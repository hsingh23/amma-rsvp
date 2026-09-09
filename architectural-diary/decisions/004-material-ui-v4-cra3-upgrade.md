# Decision 004 — Material-UI 4 / CRA 3 / React 16.10 upgrade

- Date: 2019-10-18
- Commit: 0a42761
- Status: accepted

## Context

The app was built on Material-UI v3-era APIs and CRA 2-era tooling. By fall
2019 the v4 line was standard, `theme.spacing.unit` was deprecated in favor of
`theme.spacing(n)`, and reproducible builds required committing the lockfile
(yarn.lock had been gitignored until this commit).

## Decision

Jump the whole stack at once: `@material-ui/core`/`icons` to v4 (adding
`@material-ui/styles`), `react-scripts` 3.2.0, react/react-dom 16.10.2,
`react-router-dom` 5.1, `react-select` 3.x, pinning `formik` 1.5.8 and
`yup` 0.27.0. Un-ignore and commit `yarn.lock`. Migrate the RSVP form's
text-field spacing to the v4 `makeStyles` hook API.

## Consequences

- Build/tooling, UI library, and router all moved together — one coordinated
  regression pass at fall-tour time instead of three.
- Pinning formik/yup avoided form-API churn (Formik 2 changed `render`
  props) during a busy event season.
- The codebase is now frozen on this matrix; `theme.spacing.unit` survives in
  Home/Login `index.js` styles (v3 API still tolerated at runtime by v4 for
  some paths), a latent inconsistency to fix in any future upgrade.
- Committing yarn.lock made `yarn install` reproducible from this point on.
