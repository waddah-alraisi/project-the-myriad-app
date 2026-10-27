# CLAUDE.md — project-the-myriad-app

## Git

Only `main`. Pull `main` before starting; a session branch is merged into `main` the same day and deleted.

## What this is

The Myriad's team web app (README.md): a connected app on `@oncloud/ui`'s runtime. Screens are declared in
`src/manifest.js` (checked by OnCloud's validator in `npm test`); the app's own screens are `src/views/`.

- The data's rules live in OnCloud (row access, locks, notify): the schema is `oncloud-fly/examples/myriad.schema.json`.
- Every label in English and Arabic (`src/i18n.js`, the test checks both), Latin digits.
- Docs and reports live in `~/Desktop/Sites/oncloud-documentations/` (`planned/myriad-on-oncloud.md`).
