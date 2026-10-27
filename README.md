# The Myriad — Team

The residence team's web app: a static single-page app (Vite + plain JavaScript) that signs in with OnCloud and works
on The Myriad's data in OnCloud's apps cluster through `/api/v1/connected/*`. No server, no secret: OnCloud is the
backend. Residents use the mobile app inside OnCloud Fly; this is the staff side (decision D5).

Plan: `oncloud-documentations/planned/myriad-on-oncloud.md`. Report: `oncloud-documentations/oncloud-vanilla/reports/2026-10-27-myriad-team-app.md`.

## Run

```sh
npm install
npm run dev      # http://localhost:5181, against the OnCloud in public/config.json
npm test         # the manifest against OnCloud's validator and Myriad's schema, the views' logic, PKCE, the CSP
npm run build    # static output in dist/
```

Tests and `npm run dev` read the sibling repos when they are checked out beside this one: `../oncloud-ui` (built
once: `npm install && npm run build`) and `../oncloud-fly` (Myriad's schema). Against a local OnCloud:
`VITE_API_BASE=http://127.0.0.1:8000 npm run dev`.

`public/config.json` holds the only two settings, both public:

| Key | Value |
|---|---|
| `api_base` | OnCloud API origin, e.g. `https://api.oncloud.om` |
| `client_id` | **The Myriad's** public client id — the same connected app as the residents' (one app, one set of data) |

Never put a secret here: a connected app is a public client (ADR 0045).

## Set it up in OnCloud

1. The Myriad is already a connected app (its schema: `oncloud-fly/examples/myriad.schema.json`, publish version 2 or
   later — it adds the `resident_id` indexes this app's per-resident lists filter on).
2. Add this app's address to The Myriad: `allowed_origins` (`https://team.myriad.example`) and `redirect_uris`
   (`https://team.myriad.example/callback`) — `PATCH /api/v1/connected-apps/{id}`.
3. Name the team: `PUT /api/v1/connected-installs/{id}/settings {"team": [public ids]}`. Only the team sees every
   resident; anyone else signing in here sees only their own records (row access, M1).
4. Deploy `dist/` (Cloudflare Pages: `public/_headers` and `public/_redirects` are ready; set the API origin in the CSP).

## What it does

Arabic first (right to left), English when the person's OnCloud language is English. OnCloud's own list and record
screens, in the workspace's brand; the app's own screens are `src/views/`.

| Area | Screens | What |
|---|---|---|
| Residents | `/residents`, `/residents/{id}` | list (balance, open requests, contract end); record with tabs: Details, **OnCloud account** (linked, or invite them to the app), their Payments, Maintenance, Contracts, Renewal offers |
| Applications | `/applications` | the public form's submissions with their answers; **Make resident** creates the resident from the answers, invites the applicant as a guest, and marks the submission — when they accept, the record is theirs |
| Maintenance | `/requests`, `/requests/{id}` | status and note to the resident (they are told); **Entry times** — propose a window, see who proposed which and the one approved; the photo |
| Complaints | `/complaints`, `/complaints/{id}` | status and note; an anonymous complaint never shows its sender (OnCloud hides it, M7) |
| Payments | `/payments`, new, record | charge a resident (kind, title in both languages, amount in OMR, due date) — they are told and pay in the app; Paid arrives by itself |
| Move-ins, Renewal offers | lists, new, records | the move-in's deposit and first rent; a renewal offer the resident accepts or declines in the app |
| Contracts | `/contracts`, new, record | the contract and its **PDF** (uploaded here, its pages shown); the resident signs it in the app; signed, it is locked |
| Guardian consents | `/consents`, new, record | **Email the signing link**: a one-time link for a guardian with no account |
| Check-outs | `/check-outs`, record | what the resident told before leaving (date, reason, IBAN, keys, room photo); move it on as you inspect and refund |
| Notices, Induction | lists, new, records | what every resident reads in the app |

## @oncloud/ui

Pinned in `ui.json` (1.1.0 on the CDN, with SRI). Two things this app does for itself until it moves to a release that
carries the fixes: money cells read minor units (baisa), and number cells use Latin digits (`registerMinorMoney()` in
`src/ui.js`).
