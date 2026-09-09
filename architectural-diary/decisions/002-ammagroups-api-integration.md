# Decision 002 — Amma Groups API integration contract

- Date: 2019-01-11 → 2019-05-08
- Commits: 96a818d, 314cea8, ce25d25, 3385db8, fb9b075, 6ae6b6e, 19f1aa5
- Status: accepted

## Context

The upstream system is the Amma Groups mailing-list database, a PHP
application at `https://lists.ammagroups.org/dbaccess/api_ajax.php` driven by
an `api_ajax`-style RPC convention (`func_name` selects the operation). It is
not ours to change.

## Decision

- **Wire format:** all requests are `application/x-www-form-urlencoded`,
  built by the recursive `getFormData` serializer with `encodeURIComponent`
  on every value (314cea8, fb9b075). JSON bodies are rejected by the backend.
- **Auth:** `func_name=login` with the fixed RSVPADMIN email + password
  returns a `sessid`, stored in `localStorage.sessid` and sent with every
  `bulk_add` call (ce25d25, 3385db8).
- **Upload shape:** `func_name=bulk_add` receives a positional CSV array:
  row 0 = column-length tips, row 1 = header names (`email`, `first_name`,
  `last_name`, `postal_code`, `country_abbrev`, `source`, ...), then one row
  per pending RSVP with fixed defaults (HTML format, auto-add to groups YES,
  source tagged per tour, e.g. 'Amma RSVP App Fall 2019'). Rows are only
  cleared from the queue on `success === 1`.
- **Session expiry:** on `error_msg === "Admin must log in first"`, `bulkAdd`
  re-runs `doLogin(localStorage.password)` and recurses once to retry
  (19f1aa5).

## Consequences

- Correct-by-construction against the PHP RPC: the client mirrors its
  quirks (urlencoded, sessid, CSV metadata rows) rather than abstracting them.
- The CSV columns are positional and therefore fragile; inline comments in
  `src/util.js` document each column and must be kept in sync.
- Values in the CSV (e.g. defaults like email format or source tag) are
  frozen at queue-flush time, not capture time.
