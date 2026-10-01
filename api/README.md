# BLR15 Laravel API (`/api`)

Laravel 13 REST API backing the BLR15 **public App** (website + mobile) and the
**Admin CRM**, secured with **JWT** (`php-open-source-saver/jwt-auth`).

See **[docs/API_MAPPING.md](docs/API_MAPPING.md)** for the full endpoint map and
the React-caller → endpoint table.

## Requirements

* PHP **8.3+** with `pdo_mysql`
* Composer 2.x
* MySQL / MariaDB (XAMPP is fine)

## Setup

### One command

```bash
cd api
composer setup
```

`composer setup` runs `composer install`, creates `.env` from `.env.example` when missing,
sets `APP_KEY` **and** `JWT_SECRET` only if they are still empty (so it is safe to re-run —
neither key is rotated), runs `migrate --seed`, then `npm install && npm run build`.
The npm step is required: `GET /` renders `resources/views/welcome.blade.php`, which uses
`@vite` and therefore needs `public/build/manifest.json` (that directory is git-ignored).

### Step by step (the same thing, spelled out)

```bash
cd api
composer install
cp .env.example .env            # if needed
php artisan key:generate
php artisan jwt:secret          # writes JWT_SECRET to .env

# Databases
#  - App DB  -> remote hosted MariaDB (host/user in api/.env, never commit them)
#  - Test DB -> local:  blr15_backend_test @ 127.0.0.1:3307 (used by phpunit.xml)
mysql -u root -h127.0.0.1 -P3307 -e "CREATE DATABASE IF NOT EXISTS blr15_backend_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

php artisan migrate --seed      # 8 migrations, seeds 3 staff + the demo enquiries
php artisan serve --port=8199   # http://127.0.0.1:8199/api/v1/health
```

> The test suite needs the **local** MySQL on `3307` running: the hosted DB user has
> privileges only on the application schema, so it cannot create the test database.

### Key `.env` values

```
DB_CONNECTION=mysql
DB_HOST=             # hosted MariaDB 11.8 — fill from your provider (see .env, never commit)
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=         # lives only in api/.env — never commit it

JWT_SECRET=...
JWT_TTL=120                     # access-token lifetime in minutes
JWT_REFRESH_TTL=20160

CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:5173,http://localhost:3000
MAIL_MAILER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=godwinrobby1985@gmail.com
SMTP_PASS=            # blank => emails run in simulated mode
SMTP_FROM="BLR15 Home Loans" <godwinrobby1985@gmail.com>
SMTP_ADMIN_EMAIL=godwinrobby1985@gmail.com
```

> Emails are **simulated** (no delivery) until `SMTP_USER` + `SMTP_PASS` are set,
> matching the previous PHP/Node behaviour.

## Seeded logins

| Email | Role | Password |
| ----- | ---- | -------- |
| rajesh.k@blr15.in | Super Admin | password123 |
| priya.s@blr15.in | Admin | password123 |
| suresh.g@blr15.in | Loan Executive | password123 |

## Testing

```bash
php artisan test          # uses DB_DATABASE=blr15_backend_test (phpunit.xml)
```

## Connecting the React app

The SPA calls the API at a base URL (default `api/v1`). Either:

1. **Vite dev proxy** (already configured in `vite.config.ts`) — run
   `npm run dev` and the SPA's relative `api/...` calls are proxied to
   `http://127.0.0.1:8199`. Set the Laravel port via `VITE_API_PROXY_TARGET`.
2. **Absolute base URL** — set `VITE_API_BASE_URL=http://127.0.0.1:8199/api` in
   the SPA `.env` and rebuild.

## Architecture notes

* Auth guard: `api` (JWT) → provider `admin_users` (`App\Models\AdminUser`).
* Enquiries/follow-ups are stored with JSON columns (`existing_loan`,
  `status_history`, `follow_ups`) so the frontend object shape is preserved 1:1
  with `supabase-schema.sql`.
* `App\Http\Resources\EnquiryResource` maps DB snake_case → frontend camelCase.
* `App\Support\EnquiryMapper` whitelists inbound keys.
