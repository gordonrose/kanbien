# Form Template Reference Pack

## Purpose

Freeze the current `Form Template` baseline so future picker, drawer, and
choice-control extraction can happen against a named parent reference instead
of loose route memory.

This pack is more concrete than the behavior lock and narrower than a future
component family. It records the parent pattern states the next loop must
preserve.

## Scope

- Family:
  `form-template`
- Status:
  signed-off parent reference baseline
- Current source surface:
  `/design-system/templates/form`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related template artifact:
  `docs/workspace/design-system/templates/form-template.md`
- Related fallback note:
  `docs/workspace/design-system/templates/form-template-fallback-note.md`
- Related canonical launcher:
  `/design-system/canonicals/form-template`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `tests/visual/designSystem/canonicals/forms/formTemplateCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/forms/datePicker.spec.ts`
  `tests/visual/designSystem/canonicals/forms/choiceGroupCanonical.spec.ts`

## Signed-Off Rule Source

This pack inherits the approved parent rules from `FT-001` through `FT-041`
in `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`.

Those behavior locks remain the rule source.
This pack turns them into named reference targets for the next loop.

## Current Surface Truth

- the route label is `Pages` while the route path remains
  `/design-system/templates`
- the `Form Template` sits under the existing page-template family beside
  other governed page-shape routes
- the current page uses:
  - the shared shell trio:
    top-nav, sub-nav, and single-item context-nav
  - a parent title and status band with top-level actions
  - one primary editor surface without a supporting sidebar lane
  - two primary form sections:
    `Basics` and `Preferences`
  - inline help and inline error slots across text, textarea, choice, and
    toggle fields
  - three grouped-choice variants:
    radios, standard checkboxes, and a full-width shared-statement checklist
    with its own inline group error
  - single-date, single-time, date-range, and date-range-with-time picker
    variants
  - two drawer-select variants with search, selected, and available stacks
  - review-state toggles for error, disabled, and mobile review posture inside
    the shared display-settings drawer
  - footer completion controls that mirror the header-level action posture
- the current prototype now has a dedicated canonical launcher for the governed
  combination matrix, and the parent-hosted picker-open and drawer-select-open
  gaps now have direct route-level or child-surface proof; parent-level
  composition stress now also has executable coverage for long-copy,
  magnification, and footer-action posture; parent composition has now been
  visually signed off as one template rather than only as a set of
  individually proven child seams
- the governed parent route is now also the explicit rollback target if a later
  replacement drifts from the approved page composition; parent fallback should
  restore the `FTR-*` set rather than relying on older prototype memory
- the parent chain now has a dedicated `Simple Select` child-seam artifact set:
  - `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md`
  - `docs/workspace/design-system/reference-packs/simple-select-reference-pack.md`
  - `docs/workspace/design-system/verification/simple-select-verification-checklist.md`
- the parent chain now also has a dedicated `Date Picker` child-seam artifact
  set:
  - `docs/workspace/design-system/behavior-locks/date-picker-behavior-lock.md`
  - `docs/workspace/design-system/reference-packs/date-picker-reference-pack.md`
  - `docs/workspace/design-system/verification/date-picker-verification-checklist.md`
- the parent chain now also has an approved exploratory `Choice Group`
  child-seam
  artifact set:
  - `docs/workspace/design-system/behavior-locks/choice-group-behavior-lock.md`
  - `docs/workspace/design-system/reference-packs/choice-group-reference-pack.md`
  - `docs/workspace/design-system/verification/choice-group-verification-checklist.md`
- the parent chain now also has a dedicated `Time Picker` child-seam artifact
  set:
  - `docs/workspace/design-system/behavior-locks/time-picker-behavior-lock.md`
  - `docs/workspace/design-system/reference-packs/time-picker-reference-pack.md`
  - `docs/workspace/design-system/verification/time-picker-verification-checklist.md`

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `FTR-001` | `/design-system/templates/form` | Desktop default baseline with one self-contained editor card and no companion sidebar | Preserves the signed-off parent page shape before child extractions begin | source-inspected | Current route source now reflects the approved no-sidebar posture |
| `FTR-002` | `/design-system/templates/form` | Display-settings drawer open, then text-field focus handoff back into the form | Preserves the recently fixed focus rule for interactive outside clicks | covered-by-test | `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts` now targets the actual textbox surface |
| `FTR-003` | `/design-system/templates/form` | Error review mode with inline field and group errors visible | Preserves the review-state contract for inline validation posture | runtime-probed | Current route exposes an error-mode toggle through the shared display-settings payload |
| `FTR-004` | `/design-system/templates/form` | Disabled review mode with controls remaining readable but not interactive | Preserves disabled posture without losing hierarchy or helper text | runtime-probed | Current route exposes a disabled-mode toggle through the shared display-settings payload |
| `FTR-005` | `/design-system/templates/form` | Mobile review mode with the page stacked into one column | Preserves the parent mobile fallback before future app adoption begins | covered-by-test | Parent route proof now exercises mobile stacking, long-copy pressure, and footer-action readability under magnification |
| `FTR-006` | `/design-system/templates/form` | Resting picker state with date and time surfaces closed | Preserves the invariant that hidden picker panels remain hidden by default | covered-by-test | Also grounded by the 2026-04-18 mobile hidden-state reconciliation note and `tests/visual/designSystem/canonicals/forms/datePicker.spec.ts` |
| `FTR-007` | `/design-system/templates/form` | Single date or range picker open state anchored to the active field | Preserves the richer scheduling interaction inside the parent template | covered-by-test | Route-level child-seam proof now covers quick single-date close, staged range selection, and mobile overlay posture |
| `FTR-008` | `/design-system/templates/form` | Drawer-select default resting state with selected summary visible in the trigger | Preserves the closed summary posture for the likely first child seam | covered-by-test | Parent route proof now verifies trigger summary synchronization for both drawer variants |
| `FTR-009` | `/design-system/templates/form` | Drawer-select open state with search plus visible `Selected` and `Available` stacks | Preserves the repeated drawer-selection chassis inside the parent template | covered-by-test | Parent route proof now verifies dual-stack anatomy, focus-to-search, on-screen overlay geometry, and `RTL + magnification` layering stress |
| `FTR-010` | `/design-system/templates/form?ref=FTR-010&theme=normal&dir=ltr&zoom=0&errors=true` | Normal-theme error review state | Preserves the governed default-theme error baseline with readable inline error treatment on normal surfaces | canonical-created | Covered by the canonical launcher and direct route-level verification |
| `FTR-011` | `/design-system/templates/form?ref=FTR-011&theme=dark&dir=ltr&zoom=0&errors=true` | Dark-theme error review state | Preserves the governed dark-theme error baseline so error affordances stay high-signal against dark surfaces | canonical-created | This combination now has a dedicated canonical URL rather than remaining implicit |
| `FTR-012` | `/design-system/templates/form?ref=FTR-012&theme=normal&dir=ltr&zoom=0&disabled=true` | Normal-theme disabled review state | Preserves the governed default-theme disabled baseline with immediately obvious but still legible disabled controls | canonical-created | The route now resolves disabled state directly from URL on first load |
| `FTR-013` | `/design-system/templates/form?ref=FTR-013&theme=dark&dir=ltr&zoom=0&disabled=true` | Dark-theme disabled review state | Preserves the governed dark-theme disabled baseline so unavailable controls remain obvious without collapsing contrast | canonical-created | Covered by the canonical launcher and direct route-level verification |
| `FTR-014` | `/design-system/templates/form?ref=FTR-014&theme=normal&dir=ltr&zoom=0&errors=true&disabled=true` | Combined error plus disabled review state | Preserves the rule that error messaging and disabled signaling remain simultaneously readable if both review levers are active | canonical-created | This state now has a dedicated first-load URL for honest combined review |
| `FTR-015` | `/design-system/templates/form?ref=FTR-015&theme=normal&dir=ltr&zoom=0&errors=true&mobile=true` | Mobile error review state | Preserves stacked-layout error review without losing local feedback or action zoning | canonical-created | This is part of the governed mobile combination set and now has a direct canonical route |
| `FTR-016` | `/design-system/templates/form?ref=FTR-016&theme=normal&dir=ltr&zoom=0&disabled=true&mobile=true` | Mobile disabled review state | Preserves stacked-layout disabled review with obvious unavailability and intact page hierarchy | canonical-created | This is part of the governed mobile combination set and now has a direct canonical route |
| `FTR-017` | `/design-system/templates/form?ref=FTR-017&theme=normal&dir=rtl&zoom=0` | RTL desktop review posture | Preserves mirrored page-level directionality beyond superficial text alignment | canonical-created | This now has a direct canonical URL under the form-template launcher |
| `FTR-018` | `/design-system/templates/form?ref=FTR-018&theme=normal&dir=rtl&zoom=0&mobile=true` | RTL plus mobile review posture | Preserves mirrored mobile overlays, navigation glyphs, and action placement in the constrained layout | canonical-created | This now has explicit route-driven canonical proof instead of a placeholder follow-up |
| `FTR-019` | `/design-system/templates/form?ref=FTR-019&theme=normal&dir=rtl&zoom=100` | RTL and magnified review posture | Preserves the expectation that this parent template will be reviewable under localization and magnification stress | covered-by-test | Route-level parent proof now covers drawer-select overlay geometry plus broader composition stress under magnified review |

## Ownership Boundary

- The parent `Form Template` reference owns page framing, title/status posture,
  section cadence, grouped-field composition, and top/footer action zoning.
- The same parent artifact chain is now the explicit rollback baseline if a
  later replacement or app adoption drifts from the approved composition.
- Future child seams such as select, date-picker, time-picker, and
  drawer-select own their internal trigger, overlay, option, search, selection,
  focus, and empty/error-state contracts once extracted.
- Child seam artifacts must inherit this parent framing rather than redefining
  the page shell or section rhythm as part of their own contract.

## Choice Group Candidacy Decision

- Assessed seam:
  `Choice Group` from the signed-off parent `Form Template`
- Decision for this loop:
  keep parent-owned for governed adoption for now; exploratory child artifacts
  now exist, but do not promote a governed child family yet
- Why it stays parent-owned:
  the seam is only proven inside one governed route; it now has a child
  verification checklist plus a provisional child launcher/render surface, but
  the first child batch is now visually approved; it still lacks a second
  governed consumer, and the shared-statement variant is still tied to the
  parent form's release-checklist composition rather than a clearly reusable
  cross-surface contract
- What stays parent-owned:
  section placement inside `Preferences`, grid-span decisions, surrounding form
  helper cadence, and the parent-owned release-checklist framing of the shared-
  statement example
- What a future child seam could own once ready:
  fieldset shell, legend posture, stacked choice rows, shared lead statement
  block, and inline group-error treatment for radio, checkbox, and shared-
  statement variants without redefining the parent page rhythm

## Extraction Guardrails

- Child seams must preserve the `FTR-*` states unless a later review
  explicitly replaces them.
- The governed combination matrix for `error`, `disabled`, theme, and
  direction states must stay represented in the reference set even before
  more granular picker-open canonicals exist.
- `Simple Select` stays the first completed child loop, `Date Picker` remains
  an active sibling child chain, and `Time Picker` is now a signed-off child
  chain; parent artifacts must stay consistent with those child boundaries.
- `Choice Group` should not be extracted until it has either a second governed
  consumer or a dedicated child reference set that proves radios, standard
  checkboxes, shared-statement checklists, and their inline-error behavior
  outside loose parent-memory. The new exploratory child chain at
  `/design-system/canonicals/choice-group` and
  `/design-system/components/choice-group` is now visually approved
  scaffolding, not extraction approval.
- The parent page shell, section cadence, grouped-field composition, and action
  zoning stay documented at the template level until a later review
  intentionally promotes any of that framing into a broader family.

## Parity Rule

A future child component extracted from this page matches the parent reference
only when:

- the `FTR-*` states still render honestly
- the child seam documents what it owns versus what remains parent-owned
- the current Playwright coverage still passes or is intentionally replaced by
  stronger equivalent proof
- any `not-yet-captured` or `source-inspected` states are either promoted to
  stronger rendered proof or carried forward honestly in the next artifact

## Exit Condition

This pack is now operational for the governed combination matrix through the
dedicated launcher at `/design-system/canonicals/form-template`; child-seam
codification now has active or signed-off chains for `Simple Select`,
`Date Picker`, `Time Picker`, `Drawer Select`, and the approved exploratory
`Choice Group` baseline, and the parent composition has now been signed off as
the governing page-template fallback and replacement baseline.
