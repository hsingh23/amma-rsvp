# AGENTS.md — Amma RSVP

Guidance for AI agents (and humans) working in this repository.

## What this is

An offline-first React PWA (Create React App, 2019–2020 era) that collects
sign-ups at Amma tour events, queues them in IndexedDB, and bulk-uploads them
to the Amma Groups mailing-list API. See `README.md` for the product story and
`architectural-diary/` for how it got that way.

## Commands

```bash
yarn install       # install dependencies (uses committed yarn.lock)
yarn start         # CRA dev server on http://localhost:3000
yarn build         # react-scripts build && cra-append-sw -s ./src/custom-sw.js
yarn test          # react-scripts test --env=jsdom (no tests exist)
yarn deploy        # build + ./.deploy.sh (script is gitignored/untracked)
yarn eject         # CRA eject (do not run)
```

There is no linter config beyond CRA defaults and no CI. Node/yarn versions are
not pinned (pre-engines era).

## Architecture map

```
src/index.js
  ├─ Router (react-router-dom v5)
  │   ├─ "/"     → Home   (RSVP capture form)
  │   └─ "/login" → Login (admin password login)
  ├─ SnackbarProvider (notistack) wraps everything
  ├─ Header — polls localforage every 500ms for pending count + sessid state
  └─ setInterval(bulkAdd, 15_000)  ← the sync heartbeat

src/Home/index.js  Formik + Yup schema (email, firstName, lastName, zipcode,
                   country, agree) → renders Home/form.js
src/Home/form.js   Material-UI TextFields, react-select country list
                   (ISO alpha-3, USA/CAN/MEX first), consent checkbox.
                   onSubmit → append to localforage 'pendingRSVP' → bulkAdd()

src/Login/index.js Formik + Yup (password required)
src/Login/form.js  doLogin(password) → POST func_name=login
                   (fixed RSVPADMIN email) → stores sessid + password

src/util.js        getFormData(obj) → urlencoded k=v serializer
                   bulkAdd() → reads 'pendingRSVP', builds CSV rows
                   (2 metadata rows + 1 row/RSVP, ~22 columns),
                   POSTs func_name=bulk_add + sessid to
                   https://lists.ammagroups.org/dbaccess/api_ajax.php,
                   clears queue on success=1; on "Admin must log in first"
                   → doLogin(saved password) → retry bulkAdd

src/custom-sw.js   workbox.core.skipWaiting() + clientsClaim(), appended to
                   the CRA precache SW at build time by cra-append-sw
public/reset.html  manual escape hatch: unregisters all SWs, redirects to /
```

## Conventions

- Conventional-commit messages (`type(scope): subject`, imperative, ≤72 chars,
  body explains why). The whole history was rewritten to this standard on
  2026-09-08 (messages only; trees unchanged — see CHANGELOG.md).
- Class components + withStyles/makeStyles (Material-UI v4 era); forms are
  Formik `<Formik render={...}>` with `withSnackbar`/`withRouter` HOCs.
- API calls use `getFormData` + `application/x-www-form-urlencoded` (the PHP
  backend does not accept JSON).
- Country values are ISO 3166-1 alpha-3 codes ('USA', 'CAN', ...).

## Gotchas

- **`localStorage.password` stores the admin password in plaintext** so the
  kiosk can auto-re-login. Kiosk-only tradeoff; never copy this pattern.
- The CSV payload in `bulkAdd` is positional: rows 0–1 are tips/header rows the
  backend requires; each column maps to a named API field documented in inline
  comments. Do not reorder columns.
- `bulkAdd` recurses via `doLogin(...).then(bulkAdd)` on session expiry — a
  persistent auth failure loops this chain silently (only console errors).
- `Header` polls every 500 ms via `setInterval` created in the constructor
  (never cleared; minor leak pattern from the original code).
- The name-validation regex `[A-z ...]` admits a few ASCII symbols between
  'Z' and 'a' (`[`, `\`, `]`, `^`, `_`, backtick) — a classic `[A-Za-z]` bug
  kept for historical fidelity.
- Country list contains duplicate USA/CAN/MEX entries (top-of-list shortcuts
  plus full alphabetical list).
- `yarn build` fails if `cra-append-sw` cannot find `src/custom-sw.js`.
- `homepage` in package.json pins asset paths to the Netlify domain; change it
  if deploying elsewhere.

## Verify changes

1. `yarn start` — app loads; RSVP form renders at `/`.
2. Fill the form (valid name/email/zip, pick a country, check consent) and
   submit: a "Thank you!" snackbar appears and the header sync counter
   increments (API call will fail without credentials — the queue must keep
   the entry).
3. Reload the page: the pending count persists (IndexedDB queue works).
4. Visit `/reset.html`: service workers unregister and the page redirects to
   `/` after 5 s.
5. `yarn build` must succeed end-to-end (including the cra-append-sw step).

## Pointers

- `README.md` — product overview, stack, quickstart.
- `CHANGELOG.md` — every commit, newest first, with post-rewrite hashes.
- `architectural-diary/main.md` — chronological build story.
- `architectural-diary/decisions/` — the six key design decisions (ADR style).
- `prompt.md` — one-shot prompt that recreates this app from scratch.
