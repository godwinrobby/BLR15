<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/dd21f684-6127-4eea-9f64-2739b4af828b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend — Laravel JWT API (`/api`)

The App (website + mobile) and the Admin CRM are served by a **Laravel 13 REST API**
with **JWT** auth (`php-open-source-saver/jwt-auth`).

```bash
cd api
composer setup                 # install + .env + APP_KEY/JWT_SECRET + migrate --seed + npm build
php artisan serve --port=8199
```

> `composer setup` only fills in `APP_KEY`/`JWT_SECRET` when they are empty, so it is safe
> to run again. It ends with `npm run build` because `GET /` uses `@vite`.

* Full endpoint map: [`api/docs/API_MAPPING.md`](api/docs/API_MAPPING.md)
* Setup + seeded logins: [`api/README.md`](api/README.md)

The SPA calls the API at `/api/v1/*`. During `npm run dev` the relative calls are
proxied to the Laravel server via the Vite proxy (`VITE_API_PROXY_TARGET`,
default `http://127.0.0.1:8199`). Seeded admin login: `rajesh.k@blr15.in` /
`password123`.
