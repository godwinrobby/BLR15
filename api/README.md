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
