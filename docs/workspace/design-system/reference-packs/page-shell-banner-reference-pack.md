# Page-Shell Banner Reference Pack

## Purpose

Freeze the approved first-pass page-shell banner baseline so later shared-shell
work can compare against a named, reviewable source of truth instead of
re-deriving banner behavior from local app code.

This pack is intentionally narrower than the pattern artifact and more concrete
than the behavior lock.

## Scope

- Family:
  `page-shell-banner`
- Status:
  signed-off review baseline with shared design-system render/controller seam
- Source surface:
  `/design-system/templates/page-shell`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/page-shell-banner-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/page-shell-banner-component.md`
- Related verification gate:
  `docs/workspace/design-system/verification/page-shell-banner-verification-checklist.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-shell-page-shell-banner-adoption-contract.md`
- Related canonical launcher:
  `/design-system/canonicals/page-shell-banner`
- Related canonical render surface:
  `/design-system/components/page-shell-banner`

## What This Pack Is For

Use this pack to answer:

- what concrete page-shell banner states are approved today
- what later page-shell extraction work must preserve before claiming parity
- what counts as an intentional contract change versus shell drift

## Human Review Status

- Human review surface:
  `/design-system/templates/page-shell`
- Review mode:
  template-hosted display-settings toggle with the governed banner stack shown
- Review outcome:
  accepted as the signed-off first-pass banner baseline
- Remaining gap:
  validate the same runtime seam in at least one additional governed shell
  consumer before broadening the shared API

## Signed-Off Rule Source

This pack inherits the approved behavior locks:

- `PSB-001` through `PSB-008` from
  `docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md`

Those behavior locks remain the rule source.
This pack turns them into concrete comparison targets.

## Reference Contract

- Banner feedback lives in a shell-owned zone above page content.
- The banner zone preserves visible breathing room before the page content
  begins.
- Every banner state exposes a visible dismiss `X`.
- The signed-off first-pass set includes informational, success, warning, and
  danger states.
- Dismissing one state must not silently remove the others from the review
  stack.
- The current review surface is intentionally launched through the
  display-settings drawer rather than a route-local page toggle.
- This pack approves the visual/interaction baseline and the shared
  design-system render/controller seam; the first real root-admin consumer now
  uses page-scoped default clearing on navigation, short auto-dismiss for
  the limited high-signal `info` / `success` cases that remain allowed,
  persistent dismissible `warning` / `danger` behavior, and a quieter policy
  that suppresses routine navigation/open/cancel/search-refresh chatter.
- The shared runtime seam now exposes named policy buckets:
  `informational`, `mutation-success`, `blocked-action`, and `error`; the
  current root-admin consumer intentionally uses only the last three buckets
  so banner usage stays high-signal.

## Required Reference States

| Ref ID | Source route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `PSBR-001` | `/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0` | Full four-state stack | Captures the signed-off combined banner stack above page content | captured | Governing render-state proof now runs through the shared seam |
| `PSBR-002` | `/design-system/components/page-shell-banner?ref=PSBR-002&theme=normal&dir=ltr&zoom=0` | Success state visible with dismiss affordance | Confirms positive feedback uses the same close grammar and spacing rules | captured | Single-state proof on the dedicated render surface |
| `PSBR-003` | `/design-system/components/page-shell-banner?ref=PSBR-003&theme=normal&dir=ltr&zoom=0` | Warning state visible with dismiss affordance | Confirms warning posture is distinct but still governed by the same shell anatomy | captured | Single-state proof on the dedicated render surface |
| `PSBR-004` | `/design-system/components/page-shell-banner?ref=PSBR-004&theme=normal&dir=ltr&zoom=0` | Danger state visible with dismiss affordance | Confirms error posture remains dismissible and separated from page content | captured | Single-state proof on the dedicated render surface |
| `PSBR-005` | `/design-system/components/page-shell-banner?ref=PSBR-005&theme=normal&dir=ltr&zoom=0` | Partial stack after dismiss | Confirms dismissing one state leaves the remaining stack stable | captured | Shared seam still supports the approved partial stack |

## First Evidence Batch

The first captured batch now includes:

- `PSBR-001` full four-state stack
- `PSBR-002` success state in the governed stack
- `PSBR-003` warning state in the governed stack
- `PSBR-004` danger state in the governed stack
- `PSBR-005` partial stack after dismissing one state

Executable evidence currently lives in:

- `tests/visual/designSystem/canonicals/shell/pageShellBannerCanonical.spec.ts`
- `tests/visual/designSystem/canonicals/shell/pageShellBannerDemo.spec.ts`

## Parity Rule

A future shared page-shell seam or real-app consumer matches this reference
pack only when:

- it satisfies the locked banner behaviors
- it preserves the approved state set or approved equivalents
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Initial Gaps

This pack still needs:

- second-consumer validation before the shared runtime contract broadens
