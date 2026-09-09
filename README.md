# Amma RSVP

An offline-first React PWA that collects email sign-ups ("RSVPs") at Amma (Mata
Amritanandamayi) tour events on kiosks or volunteer devices, queues them locally
in the browser, and bulk-uploads them to the Amma Groups mailing-list database
(`lists.ammagroups.org`) whenever a network connection and an authenticated
admin session are available.

## Why

At large tour events, connectivity is unreliable and lines are long. This app
lets a volunteer keep collecting sign-ups on a tablet even when the venue Wi-Fi
drops: every submission is written to IndexedDB immediately, and a background
sync loop (plus a manual sync button) flushes the queue to the central
mailing-list API in CSV batches as soon as it can. Volunteers log in once with
the shared RSVP admin password; if the server session expires mid-event, the
app silently re-authenticates and retries.

## Features

- **RSVP form** — first name, last name, email, zip/postal code, country
  (3-letter ISO codes, USA/Canada/Mexico listed first), and a required email-
  consent checkbox, validated with Yup.
- **Offline queue** — submissions append to a `pendingRSVP` list in localforage
  (IndexedDB, localStorage fallback) and survive reloads.
- **Background sync** — `bulkAdd()` runs every 15 seconds and on every submit;
  it uploads pending entries as a CSV batch and clears the queue on success.
- **Manual sync + counter** — a header sync button shows how many RSVPs are
  pending and triggers an immediate flush.
- **Password-only admin login** — logs in as the fixed RSVPADMIN account,
  caches the session id (`sessid`), and auto re-logins and retries when the
  session expires ("Admin must log in first").
- **PWA** — web app manifest with icons, installable on tablets; a custom
  service worker with `skipWaiting`/`clientsClaim` so updates apply
  immediately, and a `/reset.html` escape hatch that unregisters stuck
  service workers.

## Stack

- React 16.10 (Create React App 3 / `react-scripts`)
- Material-UI v4 (`@material-ui/core`, `icons`, `styles`)
- Formik 1.5 + Yup 0.27 form state and validation
- react-select 3 (country dropdown), notistack (snackbars)
- react-router-dom 5 (routes `/` and `/login`)
- localforage (IndexedDB/localStorage persistence)
- Workbox service worker via `cra-append-sw`
- Deployed to Netlify (`amma-rsvp.netlify.com`)

## Quickstart

```bash
yarn install        # or npm install
yarn start          # dev server at http://localhost:3000
yarn build          # production build + custom service worker appended
yarn deploy         # build + run the (untracked) .deploy.sh release script
```

Open `/reset.html` on a device to unregister all service workers and clear the
PWA state if a stale cache is served.

## Environment variables

None. The API endpoint (`https://lists.ammagroups.org/dbaccess/api_ajax.php`)
and the RSVPADMIN login email are hardcoded in `src/Login/form.js` and
`src/util.js`. Runtime state lives in browser storage:

- localStorage: `sessid` (admin session id), `password` (cached admin
  password), `reset` (reset-page flag)
- localforage (IndexedDB, store `rsvp`): `pendingRSVP` (queued submissions)

## Structure

```
public/               PWA shell: index.html, manifest.json, reset.html, icons/
src/
  index.js            App entry: router, SnackbarProvider, 15s bulkAdd timer
  Header.js           AppBar: login/logout state, pending-sync counter, manual sync
  util.js             getFormData serializer, errorLogger, bulkAdd CSV sync engine
  custom-sw.js        Appended SW logic (skipWaiting, clientsClaim)
  serviceWorker.js    CRA default SW registration
  styles.css          Global styles
  Home/               RSVP form: index.js (Formik+Yup wiring), form.js (fields)
  Login/              Admin login: index.js (Formik+Yup wiring), form.js (doLogin)
architectural-diary/  Design decisions and history (see AGENTS.md)
prompt.md             One-shot recreation prompt for this app
```

## Notes

- Commit messages in this repo were rewritten on 2026-09-08 (messages only;
  no content changes) — see the note at the top of `CHANGELOG.md`.
- Historical app (2019–2020). Dependencies are pinned as-of-then and will not
  receive security updates without an upgrade pass.
