# Top Nav Reference Pack

## Purpose

Freeze the signed-off top-nav baseline for future comparison.

This reference pack is the parity target for later extraction, reuse, and
AI-assisted implementation work. It is intentionally narrower than the full
pattern artifact and intentionally more concrete than the behavior lock.

## Scope

- Family:
  `top-nav`
- Status:
  operational signed-off baseline, fully captured and Playwright-locked
- Source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Related verification gate:
  `docs/workspace/design-system/verification/top-nav-verification-checklist.md`
- Related prevention note:
  `docs/workspace/design-system/top-nav-prevention-note.md`
- Related machine-readable state manifest:
  `tests/visual/designSystem/canonicals/manifests/topNav.canonical.manifest.json`

## What This Pack Is For

Use this pack to answer:

- what concrete top-nav states were signed off
- what future app or component work must match
- what counts as an intentional change versus parity drift

## Human Review Status

- Human canonical review:
  completed
- Review surface:
  `/design-system/canonicals/top-nav`
- Review outcome:
  the human owner has reviewed each canonical `TRP-*` state and signed off the
  current top-nav baseline for the design-system surface
- Remaining gap:
  token candidacy review and first real consumer parity are still pending

## What This Pack Is Not

This pack is not:

- the reusable component API
- the complete pattern documentation
- the implementation itself
- proof that rendered verification is already complete

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `TN-000` through `TN-015` from
  `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete comparison targets.

## Reference Contract

- The top-nav must preserve orientation and access to primary destinations,
  account actions, and responsive navigation states without overlap, clipping,
  distorted identity geometry, or ambiguous current-route feedback.
- The brand mark keeps its proportions; adjacent brand text may yield first.
- Desktop mode may retain at least two visible primary destinations plus
  `More`, but must not continue into the `1 item + More` state.
- Overflow, mobile fallback, long-label handling, themes, accent inheritance,
  RTL, and magnification are all in scope for parity.
- The isolated preview route used for sign-off must visually match the original
  signed-off top-nav behaviors rather than introducing preview-only styling
  drift.
- Exploration controls belong on `/design-system/exploration/top-nav`; the
  canonical sign-off surface belongs on `/design-system/components/top-nav`.

## Required Reference States

Each state below should eventually have captured evidence and parity notes.

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `TRP-001` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001` | Desktop default | Baseline full-width shell composition | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-001-desktop-default.png` |
| `TRP-002` | `/design-system/components/top-nav?width=880&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-002` | Desktop overflow | Confirms overflow before overlap | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-002-desktop-overflow.png` |
| `TRP-003` | `/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-003` | Desktop threshold before mobile | Confirms approved `2 items + More` rule | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-003-threshold-before-mobile.png`; guard assertion prevents `1 item + More` regression |
| `TRP-004` | `/design-system/components/top-nav?width=560&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-004` | Mobile shell closed | Confirms narrow-width fallback composition | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-004-mobile-shell-closed.png` |
| `TRP-005` | `/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-005` | Mobile shell open | Confirms narrow-width navigation access | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-005-mobile-shell-open.png` |
| `TRP-006` | `/design-system/components/top-nav?width=1120&fixture=standard&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-006` | Desktop profile menu open | Confirms anchored lightweight menu behavior | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-006-profile-menu-open.png` |
| `TRP-007` | `/design-system/components/top-nav?width=880&fixture=standard&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-007` | Desktop overflow menu open | Confirms overflow menu derivation and current-route treatment | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-007-overflow-menu-open.png` |
| `TRP-008` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-008` | RTL desktop | Confirms native-feeling RTL header behavior | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-008-rtl-desktop.png` |
| `TRP-009` | `/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-009` | RTL mobile | Confirms native-feeling RTL narrow shell | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-009-rtl-mobile.png` |
| `TRP-010` | `/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=TRP-010` | Magnified desktop | Confirms graceful fallback under UI scaling | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-010-magnified-desktop.png`; guard assertion checks overflow or mobile fallback under pressure |
| `TRP-011` | `/design-system/components/top-nav?width=1120&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-011` | Long brand label | Confirms brand text can yield without distorting brand mark | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-011-long-brand-label.png` |
| `TRP-012` | `/design-system/components/top-nav?width=880&fixture=long-labels&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-012` | Long primary destination label | Confirms long nav labels do not break shell geometry | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-012-long-primary-label.png` |
| `TRP-013` | `/design-system/components/top-nav?width=1120&fixture=long-labels&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-013` | Long profile trigger or menu label | Confirms long account labels do not break shell geometry | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-013-long-profile-label.png` |
| `TRP-014A` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014A` | Theme variant: normal | Confirms the default approved theme preserves shell readability | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-014a-theme-normal.png` |
| `TRP-014B` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=dark&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014B` | Theme variant: dark | Confirms the dark approved theme preserves shell readability | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-014b-theme-dark.png` |
| `TRP-014C` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=desert&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014C` | Theme variant: desert | Confirms the desert approved theme preserves shell readability | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-014c-theme-desert.png` |
| `TRP-015A` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-015A` | Primary-colour inheritance: indigo | Confirms the default shared primary colour drives shell states consistently | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-015a-accent-indigo.png` |
| `TRP-015B` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%237c3aed&ref=TRP-015B` | Primary-colour inheritance: violet | Confirms an alternate approved primary colour drives shell states consistently | captured, Playwright-locked | Evidence at `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-015b-accent-violet.png` |

Representative-set decision:

- `TRP-015A` and `TRP-015B` are the signed-off representative accent set for
  this family.
- The purpose of this pair is to prove shared primary-colour inheritance
  without turning the reference pack into a swatch-by-swatch catalog.
- Do not expand accent coverage beyond this representative set unless a later
  regression, pattern change, or explicit approval justifies it.

## Evidence Format

For each reference state, capture:

- viewport or responsive condition
- theme
- direction
- magnification level when relevant
- visible state description
- screenshot or rendered evidence location
- parity notes or known deviations

When the evidence comes from the isolated preview route, also record:

- whether the state was reached through real viewport collapse or explicit
  preview controls
- confirmation that the preview-state styling matches the original top-nav
  behavior rather than a preview-only approximation

## First Evidence Batch

This initial batch is the smallest useful set for making the pack operational.

| Ref ID | Canonical route | Capture condition | Evidence location | Status | Blocker or note |
| --- | --- | --- | --- | --- | --- |
| `TRP-001` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001` | Desktop default at a wide viewport | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-001-desktop-default.png` | captured | Locked by `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |
| `TRP-002` | `/design-system/components/top-nav?width=880&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-002` | Desktop overflow while desktop shell remains active | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-002-desktop-overflow.png` | captured | Locked by `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |
| `TRP-003` | `/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-003` | Desktop threshold before mobile; verify it does not continue into `1 item + More` | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-003-threshold-before-mobile.png` | captured | Locked by screenshot plus explicit guard assertion in `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |
| `TRP-005` | `/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-005` | Mobile shell open with full-width buttons and matching profile/submenu styling | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-005-mobile-shell-open.png` | captured | Locked by `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |
| `TRP-006` | `/design-system/components/top-nav?width=1120&fixture=standard&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-006` | Desktop profile menu open at a desktop viewport | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-006-profile-menu-open.png` | captured | Locked by `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |
| `TRP-008` | `/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-008` | RTL desktop | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-008-rtl-desktop.png` | captured | Locked by `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |
| `TRP-010` | `/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=TRP-010` | Magnified desktop with overflow/mobile pressure visible | `tests/visual/__snapshots__/designSystem/canonicals/navigation/topNav.spec.ts/trp-010-magnified-desktop.png` | captured | Locked by screenshot plus explicit guard assertion in `tests/visual/designSystem/canonicals/navigation/topNav.spec.ts` |

## Preview Route For Capture

- Route:
  `/design-system/exploration/top-nav`
- Canonical render route:
  `/design-system/components/top-nav`
- Canonical launcher:
  `/design-system/canonicals/top-nav`
- Preview source:
  `src/frontend/designSystem/exploration/top-nav/index.html`
- Canonical render source:
  `src/frontend/designSystem/components/top-nav.html`
- Runtime seam:
  `src/frontend/designSystem/router.ts`

The route is suitable for capture once a local preview server and browser
capture environment are available.

The exploration route is part of the reference workflow, not a disposable
demo. The signed truth for evidence and Playwright capture now lives on the
dedicated canonical render route, which should stay free of interactive
preview controls.

## Preview Route Query Contract

The isolated preview route supports deterministic URL-driven state so signed-off
states can be reopened directly by humans, Playwright, or future AI-driven
verification.

Supported query parameters:

- `width`
  preview frame width in pixels, clamped to `480..1320`
- `fixture`
  `standard` or `long-labels`
- `open`
  `closed`, `overflow`, `profile`, or `mobile`
- `theme`
  `normal`, `dark`, or `desert`
- `dir`
  `ltr` or `rtl`
- `zoom`
  `-50`, `0`, `50`, or `100`
- `accent`
  one of the approved preview accent hex values exposed by the page controls

Normalization rules:

- `open=overflow` coerces width down to desktop overflow range when needed
- `open=mobile` coerces width to the mobile preview width
- `open=profile` coerces width back to desktop range when needed
- invalid parameter values fall back to the signed-off defaults rather than
  leaving the preview in an undefined state

The canonical route for each `TRP-*` state now lives in the `Required
Reference States` table above and should be reused consistently by humans,
Playwright, and future AI-driven verification.

## Capture Environment Note

The first evidence batch was captured and Playwright-locked through a local
browser run outside the default sandbox constraints for this Codex session.

The default sandbox still cannot host the preview listener or launch Chromium
reliably on its own, so future capture work may still need the same escalated
local-browser path.

Human review of the full canonical state set is complete. Stored screenshots
and Playwright baselines now exist for the full canonical set.

## Parity Rule

A future extracted component or real-app consumer matches this reference pack
only when:

- it satisfies the locked behaviors
- it preserves the required reference states or their approved equivalents
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

Do not treat “close enough” visual resemblance as parity when one of the locked
reference states is missing or altered without an explicit decision.

## Initial Gaps

This pack still needs:

- token candidacy review for the stable visual decisions in the family
- final parity examples from the first real consumer

## Exit Condition

This reference pack becomes operational when:

- the required reference states have evidence attached
- the verification checklist can evaluate parity against those states
- the first governed consumer can be compared against this pack without
  reopening the original `/design-system` code to interpret intent
