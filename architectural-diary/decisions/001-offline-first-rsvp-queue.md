# Decision 001 — Offline-first RSVP queue

- Date: 2019-01-10 → 2019-01-11
- Commits: b4c86ec, 96a818d, dd45291, eab00c8
- Status: accepted

## Context

The app runs on kiosks/volunteer devices at large tour events where venue
Wi-Fi is unreliable. Losing a sign-up because a POST failed is unacceptable;
blocking the form on a network round-trip slows the line down.

## Decision

Every submission is written **first** to a local `pendingRSVP` array in
localforage (IndexedDB with a localStorage fallback, database/store `rsvp`),
and the form resets immediately with a success snackbar. A single `bulkAdd()`
function owns all network flushing: it runs on a 15-second `setInterval` in
`src/index.js`, after every form submit, after login, and from a manual header
sync button that displays the live pending count (polled every 500 ms).

## Consequences

- The form is always responsive and works fully offline; entries survive
  reloads and SW updates.
- Exactly one code path uploads data, so retry/clear/auth logic lives in one
  place (`src/util.js`).
- The queue is device-local: if a tablet is lost before sync, its RSVPs are
  lost with it — accepted for the event use case.
- The 15 s heartbeat and 500 ms header polling burn cycles even when idle
  (fine for a dedicated kiosk).
