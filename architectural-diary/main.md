# Architectural Diary — Amma RSVP

Chronological story of how this app was built, reconstructed from the git
history (2019-01-10 → 2020-03-03, 30 commits, all by Harsh Singh). Commit
references use post-rewrite hashes (see the note in `CHANGELOG.md`).

## Phase 1 — Scaffold and local persistence (2019-01-10 → 2019-01-11)

The project started as a Create React App import of a public Formik +
Material-UI + Yup form-validation template (baa7f89): an AppBar header, a
signup form (name, email, zipcode, country), and a login stub, with only an
`alert()` where submission logic would go.

Within a day the app found its purpose: submissions were queued to a
`pendingRSVP` list in localforage with a consent checkbox (b4c86ec), the login
stub was wired to the (then test) ammagroups.org endpoint (87b8f33), and the
whole offline-capture skeleton existed: header sync button (b49e9d6), form
polish (a375995), Netlify homepage config (19ffd68), link styling (741b06b).

## Phase 2 — Talking to the real API (2019-01-27 → 2019-01-28)

A single furious debugging day aligned the client with the PHP backend:

- The API expects `application/x-www-form-urlencoded`, not JSON — hence the
  `getFormData` recursive serializer (314cea8).
- The backend returns a `sessid`, not an API key (ce25d25), and `bulkAdd` had
  been checking the wrong localStorage key, so nothing ever synced (3385db8).
- The service worker was taught `skipWaiting`/`clientsClaim` via cra-append-sw
  so deploys take effect immediately on kiosks (63f3f60), and values were
  URL-encoded so names/emails with special characters stopped corrupting
  request bodies (fb9b075).

The sync engine itself — `bulkAdd` reading the localforage queue, formatting a
positional CSV, POSTing `func_name=bulk_add`, clearing on success — had landed
on 2019-01-11 (96a818d).

## Phase 3 — PWA hardening (2019-02-07 → 2019-02-18)

Real events exposed real failure modes: stuck cached service workers (fixed by
the manifest/icons/reset.html escape hatch, 7e845b6 and bde72bd), garbage
keyboard input on event tablets (letters-only name validation, dd45291), and
backend expectations (3-letter ISO country codes, 6f457a8, with the CSV columns
documented in code, 6ae6b6e). The header learned to show login state and a live
pending-sync counter (eab00c8).

## Phase 4 — Production and endurance (2019-03 → 2020-03)

The app cut over from the test API to production with a password-only login
for the fixed RSVPADMIN account and a deploy script (6227772); consent copy was
fixed (8620b5e); name validation was progressively loosened to accept
hyphenated names (95b4627) and multi-part names (b0fa7b3); the zip label went
international (d56e3ab). The key kiosk fix arrived in May 2019: when the server
session expires mid-event, `bulkAdd` auto-relogs-in with the cached password
and retries (19f1aa5). Fall 2019 brought submit snackbars and Enter-to-next-
field ergonomics plus a tour-tagged source string (53de5ff), the big
Material-UI 4 / CRA 3 / React 16.10 dependency upgrade (0a42761), a Workbox
API fix (8e13d12), and finally making the country default unselected so
respondents stop submitting 'USA' by accident (f939ce4).

## Decisions

See `decisions/`:

1. `001-offline-first-rsvp-queue.md` — capture to IndexedDB first, sync later.
2. `002-ammagroups-api-integration.md` — urlencoded form data, sessid auth,
   positional CSV bulk_add, auto re-login.
3. `003-pwa-immediate-updates.md` — skipWaiting service worker + reset.html.
4. `004-material-ui-v4-cra3-upgrade.md` — the 2019-10 dependency jump.
5. `005-kiosk-password-login.md` — fixed admin account, cached password.
6. `006-country-codes-and-name-validation.md` — alpha-3 codes and the evolving
   name regex.
