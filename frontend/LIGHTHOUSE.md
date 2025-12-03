# Authenticated Lighthouse Audits

The project ships with `scripts/run-lighthouse-puppeteer.js`, a Puppeteer-powered runner that logs in first and then executes Lighthouse across the core SPA routes. Each route produces HTML and JSON reports per run.

## Prerequisites
- The Angular app must already be running (for example `npm run start:test` serves http://localhost:4300).
- Chrome or Edge must be installed; Puppeteer launches Chromium for both the login flow and the Lighthouse pass.

## Running the audits
```powershell
cd frontend
npm run start:test   # keep the dev server alive in its own terminal
# new terminal
npm run lh:audit:auth   # defaults to http://localhost:4300
```

Reports are placed in `frontend/lighthouse-reports/<timestamp>-auth/` as `<slug>.report.html` and `<slug>.report.json`.

## How authentication is handled
The script automatically:
1. Registers (idempotently) using the supplied credentials.
2. Logs in and verifies it lands on `/welcome`.
3. Seeds the desired quiz category in `localStorage` so `/quiz` loads meaningful data.

Because the runner controls the browser, there is no longer a need to create or reuse a manual Chrome profile.

## Customisation
- `LIGHTHOUSE_BASE_URL`: overrides the audited origin (default `http://localhost:4300`).
- `LIGHTHOUSE_CATEGORIES`: comma-separated Lighthouse categories (default `performance,accessibility,best-practices,seo`).
- `LIGHTHOUSE_USER_EMAIL` / `LIGHTHOUSE_USER_PASSWORD`: credentials used for registration/login (defaults `ahmed@ahmed.com` / `Ahmed@14`).
- `LIGHTHOUSE_CATEGORY`: quiz category persisted before visiting `/quiz` (default `Computer Science`).

To audit additional routes, edit the `routes` array inside `scripts/run-lighthouse-puppeteer.js`.
