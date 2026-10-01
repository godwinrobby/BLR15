# BLR15 API — Complete Endpoint Map

Base URL: `http://<host>/api/v1` (the `api` prefix + `v1` group are configured in
`bootstrap/app.php` and `routes/api.php`).

Every response uses one of two envelopes:

* **Success** — `{ "success": true, "data": ..., "count"?: n }`
* **Error** — `{ "success": false, "error": "message" }` with an HTTP `4xx/5xx` status.

> Some endpoints (SMTP + email dispatch) intentionally return **top-level fields**
> instead of a `data` object so the existing React services keep working verbatim.
> Those are marked "(legacy shape)" below.

Authentication is **JWT** (`php-open-source-saver/jwt-auth`). Send the token as
`Authorization: Bearer <access_token>` on every `JWT` route.

---

## 1. Auth

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| POST | `/auth/login` | public | Exchange email + password for a JWT. Rate-limited (10/min). |
| POST | `/auth/logout` | JWT | Invalidate the current token (blacklist). |
| POST | `/auth/refresh` | JWT | Issue a fresh token without re-entering credentials. |
| GET | `/auth/me` | JWT | Current admin user (camelCase `AdminUser`). |
| POST | `/auth/change-password` | JWT | Change own password (`currentPassword`, `newPassword`, `newPassword_confirmation`). |

**Login response**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1Qi...",
    "token_type": "bearer",
    "expires_in": 7200,
    "user": { "id": "staff-1", "name": "Rajesh Kumar", "email": "rajesh.k@blr15.in", "role": "Super Admin", "phone": "+91 98450 15150", "active": true }
  }
}
```

---

## 2. Public (App / website / mobile) — no token

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/health` | Service status. |
| POST | `/enquiries` | Submit a new lead (server assigns `BLR15-XXXX`). |
| GET | `/enquiries/track?q=<id\|mobile>` | Public status lookup. |
| POST | `/emails/enquiry` | Send customer confirmation + admin alert (**legacy shape**). |

---

## 3. Admin CRM — JWT required

### Dashboard / reports / audit

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/admin/dashboard` | Totals, status/employment/source breakdowns, recent leads. |
| GET | `/admin/reports/locations` | Enquiry counts + value by property location. |
| GET | `/admin/reports/employment` | Counts by employment type. |
| GET | `/admin/reports/sources` | Counts by lead source. |
| GET | `/admin/reports/statuses` | Counts by workflow status. |
| GET | `/admin/audit-logs` | Admin activity trail (`?enquiry_id=`, `?admin_user_id=`, `?limit=`). |

### Enquiries

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/admin/enquiries` | List (`?status=`, `?assignedStaff=`, `?q=`). |
| POST | `/admin/enquiries` | Create a lead on behalf of a customer. |
| GET | `/admin/enquiries/{id}` | Fetch one. |
| PUT/PATCH | `/admin/enquiries/{id}` | Edit details / assignment / remarks. |
| PATCH | `/admin/enquiries/{id}/status` | Change status (`status`, optional `note`) → appends history. |
| DELETE | `/admin/enquiries/{id}` | Delete. |
| POST | `/admin/enquiries/{id}/follow-ups` | Add a follow-up (`date`, `time`, `notes`). |
| PATCH | `/admin/enquiries/{id}/follow-ups/{followUpId}` | Toggle completion (`completed`). |

### Staff (writes: **Super Admin** only)

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| GET | `/admin/staff` | JWT | List roster. |
| GET | `/admin/staff/{id}` | JWT | Fetch one. |
| POST | `/admin/staff` | JWT + Super Admin | Create (`name`, `email`, `role`, `phone`, `active`, `password?`). |
| PUT/PATCH | `/admin/staff/{id}` | JWT + Super Admin | Update. |
| DELETE | `/admin/staff/{id}` | JWT + Super Admin | Delete (cannot delete self). |
| PUT/POST | `/admin/staff/sync` | JWT + Super Admin | Bulk upsert (roster save; never deletes). |

### SMTP + settings

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/settings/smtp` | Current SMTP config, **never** the password (**legacy shape**). |
| PUT/POST | `/settings/smtp` | Persist SMTP config (**legacy shape**: `{success, config}`). |
| POST | `/settings/smtp/test` | Verify credentials & send a test email (**legacy shape**). |
| GET | `/settings` | All raw settings. |
| GET | `/settings/{key}` | One setting. |
| PUT | `/settings/{key}` | Upsert (`{ "value": {...} }`) — Super Admin. |

---

## 4. Frontend caller → endpoint (React app)

Verified against every `apiJson` / `apiFetch` call site in `src/**`.
**14 of the 36 routes are called by the UI today**, and all 36 are live
(`backend/docs/API_MAPPING.md` §8 shows the verification run).

### 4.1 Wired & live

| Frontend caller | Laravel v1 route | Surface | Auth |
| --------------- | ---------------- | ------- | ---- |
| `storageService.createEnquiry` — EnquiryPage, ContactPage, EligibilityWizard, MobileAppView | `POST /enquiries` | App | public |
| `storageService.trackEnquiry` — TrackEnquiryPage, MobileAppView | `GET /enquiries/track?q=` | App | public |
| `storageService.getPublicEnquiryCount` — Navbar live badge | `GET /enquiries/stats` | App | public |
| `emailService.sendEnquiryEmailViaSmtp` — enquiry submit flow | `POST /emails/enquiry` | App | public |
| `authService.login` — AdminPortal | `POST /auth/login` | Admin | public |
| `authService.logout` — AdminPortal | `POST /auth/logout` | Admin | JWT |
| `storageService.refreshEnquiries` — AdminPortal (mount + 30 s poll) | `GET /admin/enquiries` | Admin | JWT |
| `storageService.updateEnquiryDetails` → `persistEnquiry` | `PUT /admin/enquiries/{id}` | Admin | JWT |
| `storageService.updateEnquiryStatus` | `PATCH /admin/enquiries/{id}/status` | Admin | JWT |
| `storageService.addFollowUpToEnquiry` | `POST /admin/enquiries/{id}/follow-ups` | Admin | JWT |
| `storageService.refreshStaff` — AdminPortal (mount + 30 s poll) | `GET /admin/staff` | Admin | JWT |
| `emailService.getSmtpConfigStatus` — SmtpManager | `GET /settings/smtp` | Admin | JWT |
| `emailService.saveSmtpSettings` — SmtpManager | `PUT /settings/smtp` | Admin | JWT |
| `emailService.testSmtpConnection` — SmtpManager | `POST /settings/smtp/test` | Admin | JWT |

### 4.2 Exported by a service, but no component calls it yet

| Route | Service helper | Current UI behaviour |
| ----- | -------------- | -------------------- |
| `GET /health` | — | No caller; use for uptime probes. |
| `GET /auth/me` | `authService.fetchMe` | AdminPortal reads `getCurrentUser()` from localStorage. |
| `POST /auth/change-password` | `authService.changePassword` | No password form is rendered yet. |
| `POST /auth/refresh` | — | On `401` the app fires `auth-expired` and re-logins. |
| `PUT /admin/staff/sync` | `storageService.saveStaff` | Imported by AdminPortal but never invoked. |
| `DELETE /admin/enquiries/{id}` | `storageService.deleteEnquiry` | Exported, unused (no delete button wired). |

### 4.3 Backend-only — implemented, tested & live, no frontend code yet

| Route | Current UI behaviour |
| ----- | -------------------- |
| `GET /admin/dashboard` | `AdminPortal` computes `dashboardStats` in a `useMemo` (demo base offsets). |
| `GET /admin/reports/{locations,employment,sources,statuses}` | Reports section reads local state. |
| `GET /admin/audit-logs` | No audit UI yet. |
| `POST /admin/enquiries`, `GET /admin/enquiries/{id}` | Website form uses `POST /enquiries`; list view uses `GET /admin/enquiries`. |
| `PATCH /admin/enquiries/{id}/follow-ups/{followUpId}` | Follow-ups stay open in the UI. |
| `GET /admin/staff/{id}`, `POST /admin/staff`, `PUT/PATCH /admin/staff/{id}`, `DELETE /admin/staff/{id}` | Roster is read-only in the UI today. |
| `GET /settings`, `GET /settings/{key}`, `PUT /settings/{key}` | Office details come from `data/initialData.ts`. |

---

## 5. Enquiry object shape (camelCase)

Both the create request and every response use the frontend's `HomeLoanEnquiry`
shape (`src/types/index.ts`). Server mapping lives in
`App\Http\Resources\EnquiryResource` (out) and `App\Support\EnquiryMapper` (in).

---

## 6. Validation & status codes

* `200` OK · `201` Created · `204` no content (legacy `OPTIONS`).
* `401` missing/invalid JWT · `403` role not permitted · `404` not found.
* `422` validation error (`{ success:false, error, errors:{...} }`).
* `429` login rate limit exceeded.

Valid enquiry statuses: `New, Contacted, Follow-up, Interested, Documents Requested,
Application Started, Submitted to Lender, Approved, Rejected, Converted, Closed`.

---

## 7. Roles

| Role | Capabilities |
| ---- | ------------ |
| `Super Admin` | Everything, including staff + settings writes. |
| `Admin` | Enquiries, follow-ups, dashboard, reports, SMTP config; cannot manage staff. |
| `Loan Executive` | Read-only enquiries + follow-ups. |

Enforced by `App\Http\Middleware\EnsureRole` (route alias `role:`).

---

## 8. Live verification

All 36 routes were exercised end-to-end against `php artisan serve`
(`http://127.0.0.1:8199`) on a freshly seeded database:

```
39 checks — 39 passed, 0 failed
```

36 registered routes + 3 security guards:

| Guard check | Expected | Result |
| ----------- | -------- | ------ |
| `GET /admin/enquiries` with no `Authorization` header | `401` | PASS |
| `POST /admin/staff` as a `Loan Executive` | `403` | PASS |
| `POST /auth/refresh`, then reusing the *old* token | `401` | PASS (blacklist) |

Behaviours confirmed during the run:

* **Simulated email mode** — `POST /emails/enquiry` and `POST /settings/smtp/test`
  both return `200` with `isSimulated: true` while SMTP credentials are blank,
  matching `api/index.php`'s `simulated_message_id()` branch.
* **Full CRUD cycle** — create (`201`) → read (`200`) → update (`200`) →
  status (`200`) → follow-up create (`201`) + complete (`200`) → delete (`200`).
* **JWT lifecycle** — `login → me → change-password → refresh → logout`,
  with `refresh` invalidating the token it replaces.
* **Role gate** — staff writes resolve `403` for non-Super-Admin accounts.

The automated suite backs this up:

```bash
cd backend
php artisan test          # 24 passed (90 assertions)
./vendor/bin/pint --test  # style clean
```

