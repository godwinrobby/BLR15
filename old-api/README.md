# BLR15 PHP API (`/api`)

PHP + [PHPMailer](https://github.com/PHPMailer/PHPMailer) replacement for the Express/nodemailer
endpoints in `server.ts`. Same request/response contract, so the React app
(`src/services/emailService.ts`) is already wired to it.

## Endpoints

| Method | Route                   | Purpose                                              |
| ------ | ----------------------- | ---------------------------------------------------- |
| GET    | `/old-api/health`           | Service status                                       |
| GET    | `/old-api/smtp-config`      | Current SMTP settings (never returns the password)   |
| POST   | `/old-api/send-enquiry-email` | Customer confirmation + admin lead alert (PHPMailer) |
| POST   | `/old-api/save-smtp-config` | Persist SMTP settings                                |
| POST   | `/old-api/test-smtp`        | Verify SMTP credentials and send a test email        |
| GET    | `/old-api/enquiries`        | List all enquiries (live CRM data)                   |
| GET    | `/old-api/enquiries/{id}`   | Fetch a single enquiry                               |
| POST   | `/old-api/enquiries`        | Create an enquiry (server assigns `BLR15-XXXX` id)   |
| PUT    | `/old-api/enquiries/{id}`   | Update an enquiry (status, remarks, follow-ups, …)   |
| DELETE | `/old-api/enquiries/{id}`   | Delete an enquiry                                    |
| GET    | `/old-api/staff`            | List the staff roster                                |
| PUT    | `/old-api/staff`            | Replace the staff roster (full-array payload)        |

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

* **XAMPP / Apache** — served automatically from `http://localhost/<site>/old-api/...`
  (`.htaccess` rewrites extensionless routes to `index.php`; `vendor/` and
  `composer.*` are blocked from direct access). The Vite build copies this whole
  folder to `dist/old-api/` so the production build is self-contained.
* **Standalone** — `cd api && php -S 127.0.0.1:8080 router.php`
* **Dependencies** — `vendor/` is committed; after changing requirements run
  `composer install` inside `api/`.
