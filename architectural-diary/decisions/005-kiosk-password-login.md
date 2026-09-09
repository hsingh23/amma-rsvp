# Decision 005 — Kiosk password-only admin login

- Date: 2019-03-15 (groundwork 2019-01-10, resilience 2019-05-08)
- Commits: 87b8f33, 6227772, 19f1aa5
- Status: accepted (kiosk-only tradeoff)

## Context

Only trusted volunteers use the login screen; the account is a shared,
fixed-purpose admin account on the Amma Groups backend (`RSVPADMIN@AMMAGROUPS.ORG`).
Typing an email on an event tablet is friction, and sessions expire mid-event
while the kiosk must keep syncing unattended.

## Decision

- The login form has a **single password field**. The email is hardcoded in
  `doLogin` (`src/Login/form.js`); the email field was commented out.
- On success, store both `sessid` and the **password itself** in localStorage.
- `bulkAdd` uses the cached password to auto re-authenticate when the API
  answers "Admin must log in first", then retries the upload.
- Logout (header button) deletes only `localStorage.sessid`.

## Consequences

- Kiosks survive session expiry for the length of an event with zero human
  interaction — the property this decision buys.
- The admin password sits in localStorage in plaintext on shared devices, and
  logout does not clear it (only sessid). Any same-origin script could read
  it. Acceptable for a controlled event device; **never** copy this pattern
  into a consumer app.
- Because the credential is shared and cached, changing the RSVP admin
  password invalidates every kiosk's auto-relogin at once (they retry until
  someone re-enters the new password).
