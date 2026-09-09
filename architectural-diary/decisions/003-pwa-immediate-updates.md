# Decision 003 — PWA with immediate updates and a reset escape hatch

- Date: 2019-01-27 → 2019-02-07 (revised 2019-10-19)
- Commits: 63f3f60, 7e845b6, b5a74e5
- Status: accepted

## Context

Kiosk tablets run the app for days. Two risks: (1) a deployed fix doesn't
reach devices because the default CRA service worker waits for all tabs to
close before activating; (2) a bad cached SW bricks the device on a
conference/venue network where nobody can open DevTools.

## Decision

- Ship a PWA: `public/manifest.json` (name "Amma RSVP", fullscreen display,
  #2196f3 theme) with eight icon sizes, and register the CRA service worker.
- Append `src/custom-sw.js` (originally `workbox.skipWaiting()` /
  `workbox.clientsClaim()`; corrected to `workbox.core.*` in 8e13d12 when the
  Workbox build dropped the top-level aliases) to the generated precache SW at
  build time via `cra-append-sw`. New versions activate and control open
  clients immediately.
- Provide `public/reset.html`: an off-app page that unregisters every service
  worker registration, alerts success, sets `localStorage.reset = 1`, and
  redirects to `/` after 5 seconds.

## Consequences

- Bug fixes and form changes propagate to kiosks on next load — critical
  during multi-day events.
- Immediate activation means an in-flight submit can be interrupted by a
  background update; acceptable because submissions are queued locally before
  any network work.
- `reset.html` doubles as the "clear everything and start over" tool for
  on-site volunteers; it does not clear the IndexedDB RSVP queue itself.
- `yarn build` depends on `cra-append-sw` finding `src/custom-sw.js`; deleting
  or moving that file breaks the build.
