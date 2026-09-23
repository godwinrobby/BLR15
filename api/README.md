# BLR15 PHP API (`/api`)

PHP + [PHPMailer](https://github.com/PHPMailer/PHPMailer) replacement for the Express/nodemailer
endpoints in `server.ts`. Same request/response contract, so the React app
(`src/services/emailService.ts`) is already wired to it.

## Endpoints

| Method | Route                   | Purpose                                              |
| ------ | ----------------------- | ---------------------------------------------------- |
| GET    | `/api/health`           | Service status                                       |
| GET    | `/api/smtp-config`      | Current SMTP settings (never returns the password)   |
| POST   | `/api/send-enquiry-email` | Customer confirmation + admin lead alert (PHPMailer) |
| POST   | `/api/save-smtp-config` | Persist SMTP settings                                |
| POST   | `/api/test-smtp`        | Verify SMTP credentials and send a test email        |
| GET    | `/api/enquiries`        | List all enquiries (live CRM data)                   |
| GET    | `/api/enquiries/{id}`   | Fetch a single enquiry                               |
| POST   | `/api/enquiries`        | Create an enquiry (server assigns `BLR15-XXXX` id)   |
| PUT    | `/api/enquiries/{id}`   | Update an enquiry (status, remarks, follow-ups, …)   |
| DELETE | `/api/enquiries/{id}`   | Delete an enquiry                                    |
| GET    | `/api/staff`            | List the staff roster                                |
| PUT    | `/api/staff`            | Replace the staff roster (full-array payload)        |

All responses are JSON: success → `{ "success": true, "data": ... }`
(lists also include `count`), errors → `{ "success": false, "error": ... }`
with the proper HTTP status (400 / 404 / 405 / 500).

## Data store

Enquiries and staff are persisted as JSON files in `api/storage/`
(atomic write with lock). The runtime files `enquiries.json` / `staff.json`
are **git-ignored** (customer PII) and auto-seeded from the committed
`seed-*.json` files (same records as the frontend's `INITIAL_ENQUIRIES` /
`INITIAL_STAFF`) on first access. `.htaccess` / `router.php` block direct web
access to `storage/`.

The React app (`src/services/storageService.ts`) is API-first: it reads and
writes through these endpoints and falls back to `localStorage` when the API
is unreachable, so the site keeps working offline.

## Configuration

Precedence (identical to `server.ts`): runtime file `../.smtp-config.json`
(shared with the Node server, written by *Save SMTP Settings*, git-ignored)
→ environment / `../.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
`SMTP_PASS`, `SMTP_FROM`, `SMTP_ADMIN_EMAIL`) → defaults (Gmail, port 587).

When no SMTP password is configured the API runs in **simulated** mode
(`isSimulated: true`) so forms and the admin SMTP panel keep working.

## Running

* **XAMPP / Apache** — served automatically from `http://localhost/<site>/api/...`
  (`.htaccess` rewrites extensionless routes to `index.php`; `vendor/` and
  `composer.*` are blocked from direct access). The Vite build copies this whole
  folder to `dist/api/` so the production build is self-contained.
* **Standalone** — `cd api && php -S 127.0.0.1:8080 router.php`
* **Dependencies** — `vendor/` is committed; after changing requirements run
  `composer install` inside `api/`.
