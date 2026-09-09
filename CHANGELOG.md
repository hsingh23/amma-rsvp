# Changelog

All notable changes to the Amma RSVP app, newest first.

> **History-rewrite note (2026-09-08):** On 2026-09-08 all 30 commit messages in
> this repository were rewritten in place (messages only — trees, file contents,
> authors, and dates are byte-for-byte unchanged) from terse one-liners
> ("init", "styles", "words") to conventional-commit messages with explanatory
> bodies. Commit hashes changed as a result; the pre-rewrite history is preserved
> on the local branch `backup/pre-docs-20260908`. Entries below reference the
> post-rewrite hashes and dates.

## 2020-03-03 — f939ce4 fix(form): default country to unselected placeholder

- Add a null-value "Select a country" option to the country dropdown and change the initial form value from 'USA' to null, so respondents must explicitly pick a country.
- Adjust country-field and submit-button margins for better spacing.

## 2019-10-19 — 8e13d12 fix(sw): call skipWaiting/clientsClaim via workbox.core

- Update `src/custom-sw.js` to call `workbox.core.skipWaiting()` and `workbox.core.clientsClaim()` instead of the removed top-level aliases so the service worker activates correctly.

## 2019-10-18 — 0a42761 build: upgrade to Material-UI 4, CRA 3, React 16.10; track yarn.lock

- Bump `@material-ui/core`/`icons` to v4, add `@material-ui/styles`; upgrade `react-scripts` to 3.2.0, React to 16.10.2, `react-router-dom` to 5.1, `react-select` to 3.x; pin `formik` 1.5.8 and `yup` 0.27.0.
- Stop ignoring `yarn.lock` and commit the regenerated lockfile for reproducible builds.
- Migrate the RSVP form's text-field spacing to `makeStyles` for Material-UI v4.

## 2019-10-18 — 53de5ff feat(form): add submit snackbar, Enter-to-next-field, fall tour source

- Wrap the app in notistack's `SnackbarProvider` and show a success "Thank you!" snackbar on RSVP submit.
- Enter key now advances focus to the next form field instead of submitting.
- Tag uploaded RSVPs with source `'Amma RSVP App Fall 2019'` for the fall tour.

## 2019-05-08 — 19f1aa5 fix(sync): auto re-login and retry bulkAdd on session expiry

- Extract a `doLogin` helper that caches `sessid` and the password in localStorage.
- When `bulkAdd` receives the "Admin must log in first" error, re-authenticate with the saved password and retry the upload.
- Fix the default country value from 'US' to 'USA'.

## 2019-04-10 — d56e3ab style(form): relabel zipcode field as "Zip/Postal code"

- Rename the zipcode field label to "Zip/Postal code" since the form accepts international respondents.

## 2019-04-10 — b0fa7b3 fix(form): allow spaces in first/last name validation

- Add a space to the allowed character class in the firstName/lastName Yup regexes so multi-part names pass validation.

## 2019-03-15 — 6227772 feat(api): use production endpoint, password-only login, deploy script

- Point login and `bulkAdd` at the production `lists.ammagroups.org/dbaccess` API (dropping the `/test/` path).
- Hardcode the RSVPADMIN login email and comment out the email field and its validation — login is password-only.
- Add a `deploy` npm script (build + gitignored `.deploy.sh`) and VS Code theme settings.

## 2019-03-08 — 8620b5e docs(form): fix consent label typo and wording

- Correct "recieve" to "receive" and drop the trailing "site" from the email-consent checkbox label.

## 2019-02-18 — 95b4627 fix(form): allow dashes in first/last name validation

- Add a hyphen to the allowed character class in the firstName/lastName Yup regexes so hyphenated names pass validation.

## 2019-02-18 — eab00c8 feat(header): show login/logout button and pending RSVP sync counter

- Convert the header from a stateless function to a `PureComponent` class named `Header`.
- Poll localforage every 500 ms to count pending offline RSVPs and check `localStorage.sessid` for session state.
- Render the sync button (with pending count) only when changes are queued; swap the Login link for a Logout button when a session exists.

## 2019-02-18 — 6f457a8 feat(form): use 3-letter ISO country codes in country dropdown

- Replace 2-letter country values with ISO 3166-1 alpha-3 codes, matching what the backend expects.
- Move USA, Canada, and Mexico to the top of the list for faster selection and reorder entries as `{ label, value }`.

## 2019-02-18 — 6ae6b6e refactor(util): annotate bulkAdd CSV columns; use USA/CAN codes

- Expand the `csv.push` row in `bulkAdd` to one field per line with inline comments naming each ammagroups.org API column (email, first_name, postal_code, country_abbrev, etc.); payload values unchanged.
- Change the United States and Canada dropdown values from 'US'/'CA' to 'USA'/'CAN' to start matching the API's 3-letter country codes.

## 2019-02-07 — bde72bd fix(reset): alert on service worker unregister, redirect to root

- Show a 'Success' alert after each service worker unregistration on the reset page.
- Redirect to '/' instead of 'index.html' after the 5-second delay; remove the redundant "Cleared serviceWorkers" text.

## 2019-02-07 — dd45291 feat(form): validate names are letters-only; sync pending every 15s

- Add Yup `matches(/^[A-z`'"]+$/)` rules to firstName/lastName with a "Letters only please" message.
- Shorten the `bulkAdd` interval in `src/index.js` from 30 seconds to 15 seconds to flush pending offline RSVPs faster.

## 2019-02-07 — 7e845b6 feat(pwa): add web app manifest, icons, and service-worker reset page

- Add `public/manifest.json` with Amma RSVP branding and eight icon sizes (72–512 px) for add-to-homescreen support.
- Add `public/reset.html`, which unregisters all service workers and redirects back after 5 seconds.
- Retitle `index.html` to "Amma RSVP" and bump react/react-dom to 16.8.1.

## 2019-01-28 — fb9b075 fix(util): URL-encode values in getFormData serialization

- Wrap each value in `encodeURIComponent` when building the key=value pairs in `getFormData` so strings with spaces, ampersands, or accented characters serialize correctly.

## 2019-01-27 — 63f3f60 feat(sw): activate new service workers immediately via skipWaiting

- Add `src/custom-sw.js` with `workbox.skipWaiting()` and `clientsClaim()` so updated service workers take control of open tabs right away.
- Wire the `cra-append-sw` dependency into the build script to append the custom logic to the default CRA precache service worker.

## 2019-01-27 — 3385db8 fix(util): gate bulkAdd on localStorage.sessid, not apiKey

- The Login form stores the session id under `localStorage.sessid`, but `bulkAdd` checked `localStorage.apiKey`, so pending RSVPs never synced after login. Read the sessid key instead.

## 2019-01-27 — 36cd94f chore(util): drop commented-out getFormData variant

- Remove the dead, commented-out `Object.keys`/`FormData` implementation of `getFormData`; the active recursive implementation is the one in use.

## 2019-01-27 — 314cea8 fix(api): send login and bulk-add requests as urlencoded form data

- The remote `api_ajax.php` endpoint expects `application/x-www-form-urlencoded` parameters, not JSON bodies.
- Add a `getFormData` helper that serializes (nested) objects into urlencoded strings; switch the login form and `bulkAdd` RSVP sync to use it.

## 2019-01-27 — ce25d25 fix(api): authenticate with session id instead of API key

- The login endpoint returns a `sessid` rather than an `apiKey`. Store the sessid in localStorage after login and send it (instead of `api_key`) as the credential in the `bulk_add` sync request.

## 2019-01-11 — 741b06b style(ui): fix header link styling and flatten form containers

- Swap header Links for NavLinks with inherit color and no underline; use `color="inherit"` for the sync icon and login button.
- Replace Paper wrappers with plain divs on the Home and Login forms; rename the signup heading to "Stay in touch".

## 2019-01-11 — 19ffd68 build(deploy): set Netlify homepage URL and ignore build dir

- Add `"homepage": "https://amma-rsvp.netlify.com"` to package.json so CRA emits correct absolute asset paths for Netlify.
- Add the build output directory to `.gitignore`.

## 2019-01-11 — a375995 style(form): polish country picker and consent checkbox on RSVP form

- Wrap the Country react-select in a margined div and render the agree checkbox inside a FormGroup/FormControlLabel with descriptive label text.
- Swap the LockIcon adornment for a HomeIcon; default the form to country 'US' with agree checked.

## 2019-01-11 — b49e9d6 style(header): show sync icon on the bulk-add button

- Replace the MenuIcon with a SyncIcon in the header IconButton that triggers `bulkAdd`, so the button reads as a sync action.

## 2019-01-11 — 96a818d feat(sync): bulk upload pending RSVPs to the mailing-list API

- Add `bulkAdd` in `src/util.js`: read queued RSVPs from localforage, format them as the CSV layout expected by `api_ajax.php`'s `bulk_add` endpoint, upload them, and clear the queue on success.
- Trigger sync after form submit, after login, on a 30-second interval, and from the header button.
- Swap the country Select to react-select, rename the package to `amma-rsvp`, and move `errorLogger` into util.js.

## 2019-01-10 — 87b8f33 feat(login): submit credentials to backend and store API key

- Replace the placeholder alert in the login form with a POST of email and password to the (then-test) ammagroups.org login endpoint.
- On success, store the returned key in localStorage, reset the form, and navigate home via `withRouter`.

## 2019-01-10 — b4c86ec feat(form): queue RSVPs in localforage and require consent checkbox

- Replace the placeholder submit alert with logic that appends each RSVP (name, email, zipcode, country) to a `pendingRSVP` queue in localforage and resets the form.
- Add an agree checkbox enforced by Yup validation; configure localforage (IndexedDB with localStorage fallback) at startup.

## 2019-01-10 — baa7f89 feat: scaffold Amma RSVP app with Formik signup and login forms

- Initial commit: Create React App project based on a Formik + Material-UI + Yup form-validation template.
- Adds an AppBar header, a Home signup form (name, email, zipcode, country select) with Yup validation, a login form stub, service-worker registration, and localforage as a dependency.
