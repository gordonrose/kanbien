# Context-Nav Drawer Reference Pack

## Purpose

Freeze the current `context-nav drawer` reference target so future drawer
verification, parity review, and sibling-drawer work have a concrete family
baseline.

This pack is intentionally narrower than a pattern note and more concrete than
the behavior lock. It records the exact drawer-family runtime states that now
need direct review.

## Scope

- Family:
  `context-nav drawer`
- Status:
  signed-off reference baseline for the shared drawer chassis; payload-specific
  settings work still follows in a separate loop
- Current source surface:
  `/design-system`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
- Related canonical launcher:
  `/design-system/canonicals/context-nav-drawer`
- Related context launcher family:
  `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md`
- Family direction:
  approved template for the broader `context-nav` drawer family unless a later
  review explicitly approves a divergent subtype

## What This Pack Is For

Use this pack to answer:

- what concrete `context-nav drawer` states now require review
- what later `context-nav` drawers should inherit by default
- what future verification or adoption work must preserve before it can be
  treated as parity rather than drift

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `CD-000` through `CD-011` from
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete review targets.

## Current Surface Truth

- `/design-system` opens the context-nav drawer from governed `context-nav`
- desktop uses a shell-attached side panel adjacent to the rail
- mobile uses a bottom-attached sheet that lands directly on the top edge of
  the bottom bar
- the drawer overlays the page content area instead of reflowing or narrowing
  the page beneath it
- the close control uses the governed square action-button grammar with a
  centered diagonal close glyph
- `/design-system` keeps preview-only controls for theme, magnification,
  accent, and direction
- earlier loop work referenced the drawer indirectly through `CNR-007`, but
  that indirect `context-nav` state is no longer sufficient as the drawer
  family’s primary sign-off target now that a dedicated `CDR-*` set exists
- dedicated context-nav drawer canonicals now exist and now represent the
  signed-off shell-family set for this chassis
- the page-shell template now uses the same chassis for an async activity
  drawer that can list multiple background jobs, error/retry states, completed
  result counts, and CSV result download actions without blocking navigation

## Reference Contract

- The drawer must launch from governed `context-nav`, not from invented local
  chrome
- The drawer must remain the template for future `context-nav` drawers unless
  a later review approves an explicit subtype difference
- The drawer must overlay page content rather than competing for permanent
  layout real estate
- The drawer must stay layered above the rail or bottom bar and above adjacent
  shell chrome
- The drawer must close on outside click and `Escape`, returning focus to the
  launching control
- Async activity payloads may show multiple in-progress jobs, waiting jobs,
  retryable error states, completed successful/failed record counts, and CSV
  download actions, but must keep the same shell attachment and close behavior
  as the host drawer family
- The launcher, close control, and in-drawer controls must remain fully
  keyboard-operable with visible focus indicators
- The drawer must preserve WCAG 2.2 AA-readable contrast and non-text contrast
  across the approved theme set
- The mobile drawer must stay bottom-attached with no spare-space gap beneath
  the sheet
- Preview-only controls remain allowed in `/design-system`, but any real app
  consumer needs a separately approved subset before it can claim parity

## Required Reference States

Each state below should be reviewed directly from the dedicated canonical
launcher and then used to drive later verification work.

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `CDR-001` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff` | Desktop attached drawer open | Confirms the baseline desktop side-panel attachment, launcher relationship, overlay behavior, and governed close-control grammar | canonical-created | First desktop review anchor |
| `CDR-002` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=rtl&zoom=0&accent=%23635bff` | RTL right-edge attached drawer | Confirms mirrored right-edge drawer anchoring and native-feeling RTL presentation | canonical-created | Keeps the family honest in RTL |
| `CDR-003` | `/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff` | Mobile bottom-sheet drawer open | Confirms bottom attachment, lane fill, overlay behavior, and preserved close-control grammar on narrow widths | canonical-created | Honest mobile runtime state |
| `CDR-004` | `/design-system/components/context-nav?width=560&height=760&stack=tall&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff` | Mobile tall-stack utility path | Confirms the drawer still launches truthfully when utility actions share the constrained mobile path with a tall navigation stack | canonical-created | Keeps future filter-drawer parity grounded in the same mobile path |
| `CDR-005` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=accessibility&theme=dark&dir=ltr&zoom=100&accent=%237c3aed` | Dark theme with magnification | Confirms focus visibility, contrast, control readability, and structural stability under non-default viewing conditions | canonical-created | Primary WCAG-sensitive stress state |
| `CDR-006` | `/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=accessibility&theme=desert&dir=ltr&zoom=50&accent=%230f766e` | Long-label readability and alternate theme | Confirms longer control copy, alternate theme treatment, and stable in-drawer structure without geometric drift | canonical-created | Secondary readability stress state |

## High-Risk Review Batch

The highest-risk review states are:

- `CDR-001` desktop attached drawer open
- `CDR-002` RTL right-edge attached drawer
- `CDR-003` mobile bottom-sheet drawer open
- `CDR-005` dark theme with magnification

These states carry the biggest risk for family drift because they prove the
template attachment model, overlay model, mobile lane behavior, RTL anchoring,
and WCAG-sensitive readability concerns.

## Evidence Status

- the dedicated canonical launcher now exists at
  `/design-system/canonicals/context-nav-drawer`
- the `CDR-*` state set is now named and directly reopenable
- human review of the dedicated drawer-family canonical set is complete for the
  shell chassis
- dedicated drawer-family browser verification is complete for `CDR-001`
  through `CDR-006`
- real-app adoption remains blocked until the design-system drawer-family chain
  is refreshed honestly

## Template Rule For Future Context-Nav Drawers

A future sibling drawer such as filters matches this pack’s family template
only when it preserves:

- shell-attached launcher ownership from `context-nav`
- overlay behavior instead of content reflow
- desktop side-panel and mobile bottom-sheet attachment
- governed close-button grammar
- outside-click and `Escape` closure with focus return
- visible focus treatment and WCAG 2.2 AA readability expectations

Content-specific controls may differ, but the shell grammar should not.

## Parity Rule

A future extracted drawer primitive, future `context-nav` sibling drawer, or
real-app consumer matches this reference pack only when:

- it satisfies the locked `CD-*` behaviors
- it preserves the required `CDR-*` states or their approved equivalents
- any app-versus-preview difference is already recorded in the relevant
  downstream artifact before parity is claimed
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

Do not treat indirect `context-nav` drawer coverage as sufficient parity once
this dedicated drawer-family set exists.

## Exit Condition

This reference pack becomes operational when:

- the `CDR-*` states are reviewed directly from the dedicated canonical
  launcher
- the verification checklist is refreshed to point at this direct drawer-family
  state set
- any later adoption artifact is written from this family pack rather than
  assuming sign-off from app implementation
