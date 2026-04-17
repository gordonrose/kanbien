# Context-Nav Reference Pack

## Purpose

Freeze the signed-off `context-nav` baseline that should guide later
system-ready promotion, first-consumer parity, and real-app adoption.

This pack is intentionally narrower than a pattern note and more concrete than
the behavior lock. It records the exact rendered states that are now approved
and must remain stable during adoption and parity work.

## Scope

- Family:
  `context-nav`
- Status:
  signed-off reference baseline
- Current source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- Related inventory row:
  `docs/workspace/design-system/component-inventory.md`
- First adoption target:
  root admin shell section navigation, starting with context-nav drawer
  integration

## What This Pack Is For

Use this pack to answer:

- what concrete `context-nav` states are approved and must remain stable
- which high-risk states have explicit review weight during future parity work
- what future app or component work must match before adoption can be treated
  as parity rather than drift

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `SV-000` through `SV-011` from
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete reference targets.

## Current Surface Truth

- The current family still exists inside the main `/design-system` shell as the
  source implementation seam, and it now also has dedicated design-system
  review routes for extraction work:
  `/design-system/exploration/context-nav`,
  `/design-system/components/context-nav`, and
  `/design-system/canonicals/context-nav`.
- Desktop behavior currently renders as a fixed vertical rail using
  `.context-nav`, `.context-nav-main`, and `.context-nav-bottom-group`.
- Narrow-width behavior currently converts that rail into a bottom navigation
  bar with labels and a near full-width `More` sheet.
- The family already has runtime interactions for the `More` sheet, filter
  panel, context-nav drawer, tooltip reveal, RTL mirroring, and header
  offset anchoring.

## Reference Contract

- The family must remain shell-attached and aligned to the true combined header
  bottom edge.
- The family must preserve two explicit icon zones: a top-growing primary zone
  and a bottom-anchored persistent utility zone.
- Icon buttons must keep their proportions in every state.
- If the top zone overflows vertically, only that zone may scroll; the bottom
  zone must remain visible.
- If vertical pressure increases on desktop, the top zone should remain in the
  same governed scroll model rather than switching to a separate collapse menu,
  and the bottom zone must remain pinned.
- On mobile, the `More` surface should read as a wide bottom-sheet-style menu
  tied to the bottom bar.
- Mobile drawers should fill the lane down to the top edge of the bottom bar.
- Drawer close controls should use the same square button grammar and diagonal
  close glyph language as the governed family actions.
- `/design-system` may keep extra preview tooling inside the first
  context-nav-drawer payload for theme, magnification, accent, and direction
  review, but a real
  app consumer only matches parity when it preserves the shell geometry and
  interaction contract while exposing only its explicitly approved app subset.
- Tooltip, menu, drawer, RTL, magnification, truncation, and layering behavior
  are all in scope for parity.
- Mobile utility actions should move into `More` rather than remaining as
  first-class bottom-bar items.

## Required Reference States

Each state below should eventually be represented by an exploration entry, a
locked canonical state, and browser-reviewed evidence.

| Ref ID | Current surface or future canonical target | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `CNR-001` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001` | Desktop rail baseline | Confirms shell-attached LTR rail, visible top and bottom zones, and stable active state | browser-reviewed, Playwright-locked, human-approved | Baseline for later parity checks |
| `CNR-002` | `/design-system/components/context-nav?width=1120&height=620&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-002` | Tall top-stack with scroll | Confirms only the top zone scrolls, the bottom zone remains anchored, icons stay proportionate, and scrollbar pressure does not visibly push the top stack off center | browser-reviewed, Playwright-locked, human-approved | High-risk scroll state now signed off |
| `CNR-003` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-003` | Desktop hover tooltip | Confirms hidden-label or truncated-item tooltip reveal uses the governed overlay layer and sits above shell chrome | browser-reviewed, human-approved | Hover/runtime proof, not just resting geometry |
| `CNR-004` | `/design-system/components/context-nav?width=1120&height=460&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-004` | Short-height desktop scroll pressure | Confirms the tall top zone remains scrollable under stronger height pressure while the bottom utility zone stays pinned and aligned | browser-reviewed, Playwright-locked, human-approved | Signed-off replacement for the abandoned collapse branch |
| `CNR-005` | `/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-005` | Mobile bottom-nav baseline | Confirms rail-to-bottom-bar conversion with visible labels and preserved current-location visibility | browser-reviewed, human-approved | Must use honest narrow width, not a renamed desktop state |
| `CNR-006` | `/design-system/components/context-nav?width=560&height=760&stack=tall&labels=standard&open=more&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-006` | Mobile `More` open | Confirms utility actions move into `More`, the menu opens as a wide sheet, and the bottom bar does not crowd | browser-reviewed, Playwright-locked, human-approved | Required interactive state with approved sheet geometry |
| `CNR-007` | `/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-007` | Bottom action launches drawer | Confirms the first governed context-nav-drawer launch remains anchored and layered correctly relative to the bar and shell, the drawer sticks to the bottom lane, and the close control matches the family button language | browser-reviewed, Playwright-locked, human-approved | Use the context-nav drawer first when adoption begins |
| `CNR-008` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=CNR-008` | RTL right-edge rail | Confirms the family moves to the full right edge, preserves desktop shell mode when width fits, and keeps native-feeling tooltip, menu, and drawer anchoring | browser-reviewed, Playwright-locked, human-approved | RTL is a first-class contract dimension |
| `CNR-009` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=CNR-009` | Magnified or long-label desktop | Confirms truncation, hover tooltip behavior, and center alignment survive magnification and longer copy | browser-reviewed, human-approved | Another high-risk state from the lock |
| `CNR-010` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=dark&dir=ltr&zoom=0&accent=%237c3aed&ref=CNR-010` | Theme and accent readability | Confirms theme and accent inheritance do not change the locked context-nav behaviors | browser-reviewed, human-approved | Lower risk than geometry states, but still part of parity |

## Signed-Off High-Risk Batch

The highest-risk signed-off states remain:

- `CNR-002` tall top-stack with scroll
- `CNR-003` desktop hover tooltip
- `CNR-005` mobile bottom-nav baseline
- `CNR-006` mobile `More` open
- `CNR-008` RTL right-edge rail
- `CNR-009` magnified or long-label desktop

These states carry the most parity risk during first adoption and should be the
first comparison points in any real consumer review.

## Evidence Status

- browser-reviewed human sign-off is complete across the `CNR-*` set
- Playwright geometry and interaction coverage exists in
  `tests/visual/designSystem/contextNavCanonicalFrame.spec.ts`
- deterministic URL reopening exists for the signed-off canonical states
- first-consumer parity must cite this signed-off chain before app adoption is
  considered approved; app implementation and tests alone are not sign-off

## Extraction Rule

When the next implementation step creates the exploration and canonical
surfaces, it must preserve these constraints:

- exploration and canonicals must be separate surfaces
- canonical widths and heights must be honest for the named state
- interactive runtime states must be reproducible directly, not recreated
  manually each time
- browser review should be used quickly if tooltip, layering, scroll, or
  alignment truth is in doubt

## Parity Rule

A future extracted component or real-app consumer matches this reference pack
only when:

- it satisfies the locked `context-nav` behaviors
- it preserves the required reference states or their approved equivalents
- any app-vs-preview difference is already recorded in the behavior lock and
  adoption artifacts before the consumer is treated as signed off
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

Do not treat a visually similar rail or bottom bar as parity if the risky
scroll, short-height pressure, tooltip, or layering states are missing from proof.

## Exit Condition

This reference pack is now the operational signed-off baseline for future
parity work. The next promotion gate is the `system-ready` artifact chain and
then first-consumer comparison against this approved set.
