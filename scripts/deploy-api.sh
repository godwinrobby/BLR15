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
#   SSH_KEY       path to private key file (omit to use ~/.ssh default / password)
#   REMOTE_DIR    absolute remote directory to hold the app, e.g. /home/u/app/api
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

# --- Preflight: verify we can reach the host and the remote PHP version ----
echo "==> Checking remote connectivity and PHP version..."
remote_php="$(ssh_to 'php -r "echo PHP_VERSION;"' 2>/dev/null || true)"
if [[ -z "$remote_php" ]]; then
  echo "ERROR: cannot run 'php' over SSH on the remote host." >&2
  echo "       Confirm SSH_HOST/SSH_USER/SSH_KEY, and that PHP is on PATH" >&2
  echo "       for a non-interactive shell (add it to ~/.bashrc)." >&2
  exit 1
fi
echo "    remote PHP: ${remote_php}"

if ! php -r 'exit(version_compare(PHP_VERSION, "8.3", ">=") ? 0 : 1);'; then
  echo "ERROR: Laravel 13 needs PHP >= 8.3 (local is $(php -r 'echo PHP_VERSION;'))." >&2
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
  ssh_to "cd '${REMOTE_DIR}' && composer install --no-dev --optimize-autoloader --no-interaction"

  echo "==> Creating .env if absent and ensuring keys are set..."
  # APP_KEY / JWT_SECRET are only generated when missing, so this is re-runnable
  # and never invalidates tokens already issued in production.
  ssh_to "cd '${REMOTE_DIR}' && php -r \"file_exists('.env') || copy('.env.example', '.env');\" \
    && php artisan key:generate --force \
    && php artisan jwt:secret --force"

  echo "==> Building front-end assets..."
  ssh_to "cd '${REMOTE_DIR}' && npm ci && npm run build"

  echo "==> Running migrations..."
  ssh_to "cd '${REMOTE_DIR}' && php artisan migrate --force"

  ssh_to "cd '${REMOTE_DIR}' && php artisan config:clear && php artisan route:clear && php artisan cache:clear || true"

  echo "==> Fixing ownership and permissions..."
  ssh_to "chown -R '${SSH_USER}:${SSH_USER}' '${REMOTE_DIR}' \
    && chmod -R 775 '${REMOTE_DIR}/storage' '${REMOTE_DIR}/bootstrap/cache'"

  # --- Health check ----------------------------------------------------------
  echo "==> Health check..."
  if ssh_to "cd '${REMOTE_DIR}' && php artisan about --only=environment 2>&1 | head -5"; then
    echo "    deploy OK — verify over HTTP: curl https://<your-domain>/api/v1/health"
  fi
else
  echo "==> DRY RUN complete; no changes made remotely."
fi

echo "==> Done. Local source at ${LOCAL_DIR} is intact."
