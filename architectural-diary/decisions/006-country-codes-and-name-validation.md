# Decision 006 — Country codes and the evolving name validation

- Date: 2019-01-11 → 2020-03-03
- Commits: 96a818d, a70556f, 2689c58, dd45291, 95b4627, b0fa7b3, f939ce4
- Status: accepted

## Context

Two form-field policies drifted as real-world data arrived from events:
what a "valid" name is, and how countries are represented.

## Country representation

The country dropdown began with 2-letter values, moved USA/Canada to
alpha-3 ('USA'/'CAN') to match the backend's `country_abbrev` column
(a70556f), then converted the entire list to ISO 3166-1 alpha-3 codes with
USA/Canada/Mexico hoisted to the top for fast selection (2689c58). The final
touch (f939ce4) removed the 'USA' default entirely: a null-value "Select a
country" placeholder forces an explicit choice, because pre-selected USA
produced accidental US attributions for international visitors.

Known wart: the hoisted USA/CAN/MEX entries are duplicated later in the
alphabetical list.

## Name validation

Introduced as letters-only (`/^[A-z`'"]+$/`, dd45291), then loosened
twice from field data: hyphens for hyphenated surnames (95b4627), then spaces
for multi-part names (b0fa7b3) — final regex `/^[A-z `'"-]+$/`. Note `[A-z]`
is not `[A-Za-z]`: it also admits `[ \ ] ^ _` and backtick. Kept as-is for
historical fidelity; a future pass should switch to `/^[\p{L} ...]+$/u`.

## Consequences

- The validation history is a good template: ship strict, relax on evidence.
- Each loosening only widened the character class, so no previously accepted
  name was ever rejected by a later version.
- The unselected-default change postdates the last deployed season (2020-03)
  and has never been exercised at a real event.
