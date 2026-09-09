# One-Shot Recreation Prompt — Amma RSVP

Give this document to a competent developer (or agent) with an empty directory
and they should be able to rebuild this application from scratch, functionally
equivalent, without asking follow-up questions.

## Goal

Build **Amma RSVP**: an offline-first, installable React PWA for collecting
email sign-ups ("RSVPs") at Amma tour events on kiosk tablets. The form must
never block on the network: submissions queue in browser storage and
bulk-upload to the Amma Groups mailing-list API whenever a connection and an
admin session exist. Volunteers log in with a single shared admin password;
the app re-authenticates itself when the session expires.

## Stack (exact, as built 2019–2020)

- Create React App via `react-scripts` 3.2.0 (no eject)
- React 16.10.2 + react-dom 16.10.2
- Material-UI v4: `@material-ui/core` ^4.5.1, `@material-ui/icons` ^4.5.1,
  `@material-ui/styles` ^4.5.0
- Formik 1.5.8 + Yup 0.27.0
- react-select ^3.0.8 (country dropdown)
- notistack ^0.9.5 (snackbars, `maxSnack` 3)
- react-router-dom ^5.1.2 (BrowserRouter)
- localforage ^1.7.3 (IndexedDB w/ localStorage fallback)
- cra-append-sw ^2.6.1 (append custom SW to CRA build)
- Deployment target: Netlify; `homepage` in package.json =
  `https://amma-rsvp.netlify.com`

## Phased build order

1. **Scaffold.** CRA app named `amma-rsvp`, version 1.0.0. Material-UI AppBar
   header ("Amma RSVP" title, links home), routes `/` (Home) and `/login`
   (Login), global `SnackbarProvider`, register CRA service worker after
   render.
2. **RSVP form (route `/`).** Formik + Yup. Fields: First Name, Last Name,
   Email, Zip/Postal code, Country (react-select), consent checkbox
   ("I agree to receive email communication from Amma Groups", must be
   checked). Material-UI TextFields with icon adornments (SupervisorAccount,
   Email, Home), full width, `makeStyles` top margin 1.5em. Enter key moves
   focus to the next field instead of submitting. Validation:
   - email: valid email, required
   - firstName/lastName: required, `matches(/^[A-z `'"-]+$/, 'Letters only please')`
   - zipcode: required; country: required (explicit selection, default null)
   - agree: `Yup.boolean().oneOf([true], ...)`
   On submit: enqueue success snackbar "Thank you!" (top-right, 3s), append
   `{firstName, lastName, email, zipcode, country}` to the localforage
   `pendingRSVP` array, call `bulkAdd()`, reset the form.
3. **Persistence.** localforage configured at startup: driver order
   [INDEXEDDB, LOCALSTORAGE], name `rsvp`, storeName `rsvp`.
4. **Sync engine (`src/util.js`).**
   - `errorLogger = e => { console.error(e); return e; }`
   - `getFormData(obj)`: recursively serialize nested objects into
     `key=value&...` with `encodeURIComponent` on every leaf value.
   - `bulkAdd()`: if `pendingRSVP.length > 0 && localStorage.sessid`, build a
     CSV array — row 0: two tip rows the backend requires (column max-length
     hints like '30 characters', '###-###-####', '3 chars USA or CAN');
     row 1: header names `email, first_name, middle_name, last_name,
     spiritual_name, other_members, address, city, state_short,
     zip/postal_code, country_abbrev, home_phone, work_phone, mobile_phone,
     email_format, receive_email, email_frequency, year_met_mother, source,
     receive_letter, comments_by_admin, auto_add_to_groups`; then one row per
     RSVP with empty strings for uncollected fields and fixed values:
     email_format 'HTML', receive_email 'YES', email_frequency 'ANY',
     source 'Amma RSVP App Fall 2019' (per-tour tag), receive_letter 'YES',
     auto_add_to_groups 'YES'. POST urlencoded
     `{ csv, sessid, func_name: 'bulk_add' }` to the API (below). On
     `success === 1` clear the queue (`setItem('pendingRSVP', [])`). On
     `success === 0 && error_msg === 'Admin must log in first'` with a cached
     password: `doLogin(localStorage.password).then(bulkAdd)`.
   - Schedule: `setInterval(bulkAdd, 15000)` at app startup.
5. **Login (route `/login`).** Single password field (Lock icon), Yup
   required. `doLogin(password)` in `src/Login/form.js` POSTs urlencoded
   `{ email: 'RSVPADMIN@AMMAGROUPS.ORG', password, func_name: 'login' }`; on
   success stores `localStorage.sessid` and `localStorage.password`, runs
   `bulkAdd()`, resets form, and `history.push('/')` via `withRouter`.
6. **Header state.** Class component; `setInterval` 500 ms polls localforage
   for the pending count and `localStorage.sessid`. When pending > 0 render a
   sync IconButton (SyncIcon + count) that calls `bulkAdd()`. Show Login
   NavLink or Logout button (Logout deletes `localStorage.sessid`) based on
   session state.
7. **PWA.** `public/manifest.json`: name/short_name "Amma RSVP",
   theme/background #2196f3, display fullscreen, scope/start_url `/`, icons
   72→512 px. `public/reset.html`: unregisters all service worker
   registrations (both `ready` and `getRegistrations` paths, alert 'Success'),
   sets `localStorage.reset = 1`, redirects to `/` after 5 s.
   `src/custom-sw.js`: `workbox.core.skipWaiting();
   workbox.core.clientsClaim();` appended at build time:
   `"build": "react-scripts build && cra-append-sw -s ./src/custom-sw.js"`.

## External API (by name)

- Endpoint: `https://lists.ammagroups.org/dbaccess/api_ajax.php`
  (PHP `api_ajax`-style RPC; POST, `application/x-www-form-urlencoded;
  charset=UTF-8`; JSON is NOT accepted)
- `func_name=login` — params `email`, `password`. Response JSON contains
  `sessid` on success.
- `func_name=bulk_add` — params `sessid`, `csv` (array of arrays as above).
  Response: `{ success: 1 }` or `{ success: 0, error_msg }`, notably
  `"Admin must log in first"`.

## Data model

- RSVP (form + queue record): `{ firstName, lastName, email, zipcode,
  country }` — country is an ISO 3166-1 alpha-3 code ('USA', 'CAN', 'IND', …);
  the full country list is hardcoded with USA/Canada/Mexico first, each entry
  `{ label, value }`; the placeholder option has value null.
- localStorage: `sessid` (session id), `password` (cached admin password;
  kiosk-only concession), `reset` (flag set by reset page).
- localforage store `rsvp`: key `pendingRSVP` = array of RSVP records.

## Design decisions to preserve

1. Capture-first, sync-later: no submit ever blocks on the network; one
   `bulkAdd()` flush path (timer + submit + login + manual button).
2. The CSV payload is positional; the two metadata rows are required by the
   backend; defaults (HTML/YES/ANY/tour source) are fixed at flush time.
3. sessid auth with auto re-login + single retry on expiry.
4. SW updates activate immediately (skipWaiting/clientsClaim) so kiosks pick
   up fixes; `/reset.html` is the escape hatch for stuck caches.
5. Password-only login against the fixed RSVPADMIN account; plaintext
   password cached for unattended re-auth (event-kiosk tradeoff only).
6. Country defaults to unselected (explicit choice required) — late fix to
   stop accidental 'USA' submissions.
7. Name validation: strict-but-widening regex history ends at
   `/^[A-z `'"-]+$/` (letters + space + backtick/apostrophe/quote/hyphen).
   Known wart: `[A-z]` admits a few symbols; do not "fix" silently.
8. Country list intentionally duplicates USA/CAN/MEX (top shortcuts +
   alphabetical full list).

## Acceptance criteria

- `yarn build` succeeds including the cra-append-sw step.
- With the network blocked: form submits show the snackbar, the header sync
  counter increments, and entries persist across reload.
- With a valid sessid: the queue drains within 15 s or on button press, and
  the counter returns to 0 only after `success === 1`.
- After `sessid` expiry: next `bulkAdd` re-logins with the cached password and
  retries once, transparently.
- `/login` with the correct password lands on `/`; Logout removes sessid and
  flips the header back to Login.
- `/reset.html` unregisters service workers, alerts, and redirects to `/`.
- Installability: manifest + icons resolve; app renders fullscreen when
  installed.
