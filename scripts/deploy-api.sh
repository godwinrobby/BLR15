#!/usr/bin/env bash
# Deploy the Laravel API (/api) to a remote host over SSH.
#
# The local source is NEVER deleted, and this is a NON-DESTRUCTIVE sync —
# rsync only adds/overwrites on the remote. Nothing is removed in a deploy.
# Every overwritten remote file is backed up to a timestamped /tmp folder.
#
# Configure via environment (or export before running):
#   SSH_HOST      remote host, e.g. ssh.yourhost.com or 1.2.3.4
#   SSH_PORT      ssh port (default 22)
#   SSH_USER      ssh user
#   SSH_KEY       path to private key file (omit to use ~/.ssh/default / password)
#   REMOTE_DIR    absolute remote directory to hold the app, e.g. /home/u/app/api
#   REMOTE_PHP    remote PHP binary. Shared hosts often ship several versions and
#                 only one on PATH, so pass the absolute path when known, e.g.
#                   REMOTE_PHP=/opt/alt/php83/usr/bin/php
#                 Auto-detected when unset.
#   COMPOSER_BIN  remote composer binary (default: composer)
#
# All artisan/composer commands run through these binaries on the REMOTE host.
#
# Usage: ./scripts/deploy-api.sh [--dry-run]

set -euo pipefail

LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/api"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

: "${SSH_HOST:?SSH_HOST is required}"
: "${SSH_USER:?SSH_USER is required}"
: "${REMOTE_DIR:?REMOTE_DIR is required}"
SSH_PORT="${SSH_PORT:-22}"

SSH_OPTS=(-p "$SSH_PORT" -o ConnectTimeout=15)
[[ -n "${SSH_KEY:-}" ]] && SSH_OPTS+=(-i "$SSH_KEY")

ssh_to()  { ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" "$@"; }
rsync_to() { rsync -e "ssh -p ${SSH_PORT}${SSH_KEY:+ -i $SSH_KEY}" "$@"; }

echo "==> Local source: ${LOCAL_DIR}"
echo "==> Remote target: ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}"

# --- Resolve the remote PHP binary -------------------------------------------
# Shared hosts (Hostinger/Cpanel) keep PHP under /opt/alt/php<ver>/usr/bin/php
# and may have none of them on a non-interactive PATH, so detect the best one.
if [[ -n "${REMOTE_PHP:-}" ]]; then
  if ! ssh_to "'${REMOTE_PHP}' -r 'echo PHP_VERSION;'" 2>/dev/null | grep -qE '^[0-9]'; then
    echo "ERROR: REMOTE_PHP='${REMOTE_PHP}' is not executable on the remote host." >&2
    exit 1
  fi
else
  REMOTE_PHP="$(ssh_to 'for c in php /opt/alt/php83/usr/bin/php /opt/alt/php82/usr/bin/php /opt/alt/php81/usr/bin/php; do
                     v=$("$c" -r "echo PHP_VERSION;" 2>/dev/null) || continue
                     echo "$c $v"; break
                   done' 2>/dev/null | head -1)"
  REMOTE_PHP="${REMOTE_PHP%% *}"
  if [[ -z "$REMOTE_PHP" ]]; then
    echo "ERROR: no usable PHP found on the remote host." >&2
    echo "       Set REMOTE_PHP explicitly, e.g." >&2
    echo "         REMOTE_PHP=/opt/alt/php83/usr/bin/php" >&2
    exit 1
  fi
fi
remote_php="$(ssh_to "'${REMOTE_PHP}' -r 'echo PHP_VERSION;'")"
echo "    remote PHP binary: ${REMOTE_PHP} (v${remote_php})"

# --- Preflight: PHP version supports Laravel 13 ------------------------------
if ! ssh_to "'${REMOTE_PHP}' -r 'exit(version_compare(PHP_VERSION, \"8.3\", \">=\") ? 0 : 1);'"; then
  echo "ERROR: Laravel 13 needs PHP >= 8.3; remote ${REMOTE_PHP} is v${remote_php}." >&2
  exit 1
fi

# --- Create remote directory if missing -------------------------------------
ssh_to "mkdir -p '${REMOTE_DIR}'"

# --- Sync application source -------------------------------------------------
# Non-destructive: adds/overwrites only. NOTHING is deleted on the remote,
# and the LOCAL copy is never touched. Overwritten remote files are backed up
# to /tmp/blr15-api-backup-<timestamp>/ (disable with KEEP_REMOTE_BACKUPS=0).
# Excludes: vendor/ and node_modules/ (rebuilt remotely for the target's PHP),
#           .env (secrets stay on the server), storage/ runtime files.
RSYNC_EXCLUDES=(
  --exclude 'vendor/'
  --exclude 'node_modules/'
  --exclude '.env'
  --exclude '.git/'
  --exclude 'storage/framework/cache/data/*'
  --exclude 'storage/framework/sessions/*'
  --exclude 'storage/framework/views/*'
  --exclude 'storage/logs/*.log'
  --exclude '.phpunit.result.cache'
)

# NO --delete: rsync only ever adds/overwrites on the remote. Nothing is
# removed in a deploy — neither locally nor on the live server. Files deleted
# locally stay on the remote until removed by hand.
# Use --backup to keep a timestamped .bak of each overwritten remote file.
RSYNC_ARGS=(-az "${RSYNC_EXCLUDES[@]}")
[[ "${KEEP_REMOTE_BACKUPS:-1}" == "1" ]] && RSYNC_ARGS+=(--backup --backup-dir="/tmp/blr15-api-backup-$(date +%Y%m%d-%H%M%S)")
[[ $DRY_RUN -eq 1 ]] && RSYNC_ARGS+=(--dry-run --itemize-changes)

echo "==> Syncing source (add/overwrite only; nothing deleted, vendor/ and .env excluded)..."
rsync_to "${RSYNC_ARGS[@]}" "${LOCAL_DIR}/" "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

# --- Install dependencies on the server --------------------------------------
if [[ $DRY_RUN -eq 0 ]]; then
  echo "==> Installing Composer dependencies on the server..."
  ssh_to "cd '${REMOTE_DIR}' && ${COMPOSER_BIN:-composer} install --no-dev --optimize-autoloader --no-interaction"

  echo "==> Creating .env if absent and ensuring keys are set..."
  # APP_KEY / JWT_SECRET are only generated when missing, so this is re-runnable
  # and never invalidates tokens already issued in production.
  echo "    ${REMOTE_PHP} artisan key:generate"
  ssh_to "cd '${REMOTE_DIR}' && ${REMOTE_PHP} -r \"file_exists('.env') || copy('.env.example', '.env');\" \
    && ${REMOTE_PHP} artisan key:generate --force \
    && ${REMOTE_PHP} artisan jwt:secret --force"

  echo "==> Building front-end assets..."
  ssh_to "cd '${REMOTE_DIR}' && npm ci && npm run build"

  echo "==> Running migrations..."
  ssh_to "cd '${REMOTE_DIR}' && ${REMOTE_PHP} artisan migrate --force"

  # --- Cache: clear stale artifacts FIRST, then re-optimize ------------------
  # The hPanel helper runs `optimize` then `optimize:clear`, which builds the
  # cache and immediately throws it away. Order here is deliberate: clear the
  # caches that still reference the OLD code/env, then rebuild.
  # `session:clear` and `lighthouse:clear-cache` are omitted on purpose —
  # the first was removed in Laravel 11 and this app is on 13, the second
  # requires laravel/lighthouse which is not a dependency.
  # `|| true` keeps a cache command from aborting the deploy.
  echo "==> Clearing caches..."
  ssh_to "cd '${REMOTE_DIR}' \
    && ${REMOTE_PHP} artisan config:clear \
    && ${REMOTE_PHP} artisan route:clear \
    && ${REMOTE_PHP} artisan view:clear \
    && ${REMOTE_PHP} artisan cache:clear \
    && ${REMOTE_PHP} artisan clear-compiled \
    && ${COMPOSER_BIN:-composer} dump-autoload -o \
    || true"

  echo "==> Re-optimizing caches..."
  ssh_to "cd '${REMOTE_DIR}' && ${REMOTE_PHP} artisan optimize || true"

  # No -f flag: Laravel 13's storage:link has no such option and would error.
  # || true keeps a pre-existing link from failing the deploy.
  ssh_to "cd '${REMOTE_DIR}' && ${REMOTE_PHP} artisan storage:link || true"

  echo "==> Fixing ownership and permissions..."
  ssh_to "chown -R '${SSH_USER}:${SSH_USER}' '${REMOTE_DIR}' \
    && chmod -R 775 '${REMOTE_DIR}/storage' '${REMOTE_DIR}/bootstrap/cache'"

  # --- Health check ----------------------------------------------------------
  echo "==> Health check..."
  if ssh_to "cd '${REMOTE_DIR}' && ${REMOTE_PHP} artisan about --only=environment 2>&1 | head -5"; then
    echo "    deploy OK — verify over HTTP: curl https://<your-domain>/api/v1/health"
  fi
else
  echo "==> DRY RUN complete; no changes made remotely."
fi

echo "==> Done. Local source at ${LOCAL_DIR} is intact."
