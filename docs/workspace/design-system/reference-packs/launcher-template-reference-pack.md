# Launcher Template Reference Pack

## Purpose

Freeze the approved launcher-template baseline so future launcher-family work
can compare against a named, reviewable source of truth instead of re-deriving
launcher behavior from individual canonical pages.

This pack is narrower than the template artifact and more concrete than the
conventions note.

## Scope

- Family:
  `launcher-template`
- Status:
  active review baseline
- Source surface:
  `/design-system/templates/launcher`
- Canonical launcher:
  `/design-system/canonicals/launcher`
- Related template artifact:
  `docs/workspace/design-system/templates/launcher-template.md`
- Related verification evidence:
  `tests/visual/designSystem/templates/launcher.spec.ts`
- Related issue reconciliation:
  `docs/workspace/issue-reconciliations/2026-04-21-launcher-template-csp-inline-width-regression.md`

## What This Pack Is For

Use this pack to answer:

- what launcher-template states are approved today
- what later launcher-family work must preserve before claiming parity
- what counts as an intentional launcher-grid change versus layout drift

## Human Review Status

- Human review surface:
  `/design-system/templates/launcher`
- Review mode:
  template-hosted shell with display-settings tray and dense launcher grid
- Review outcome:
  accepted as the current launcher-template review baseline
- Remaining gap:
  validate the same page shape against at least one additional launcher-style
  consumer once a real governed consumer adopts it

## Reference Contract

- The default desktop launcher review posture is `5` columns.
- The launcher grid expands as the available lane grows, up to a maximum of
  `8` columns.
- Wide review posture must use the available lane instead of leaving an
  oversized five-column grid centered in unused space.
- Negative magnification review states must not collapse the wide-lane column
  contract back to the smaller baseline.
- RTL review posture must preserve the same launcher-grid density and
  containment guarantees.
- Launcher cards must remain fully contained within the launcher panel.

## Required Reference States

| Ref ID | Source route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `LTR-BASE-5` | `/design-system/templates/launcher` | Default desktop LTR baseline at `1560px` viewport | Locks the default `5`-column review posture | captured | Prevents drift toward an over-dense default launcher grid |
| `LTR-WIDE-8` | `/design-system/templates/launcher` | Wide desktop LTR review at `2048px` viewport | Proves the launcher lane grows and reaches the `8`-column ceiling | captured | Prevents a repeat of the `1408px` capped-lane regression |
| `RTL-BASE-5` | `/design-system/templates/launcher` | Default desktop RTL baseline at `1560px` viewport | Confirms launcher density and containment remain stable in RTL | captured | Direction changes should not alter the baseline column contract |
| `ZO-100-WIDE-8` | `/design-system/templates/launcher` | Wide desktop with display-settings magnification `-100%` | Locks the zoomed-out review posture that exposed the original column dispute | captured | Confirms zoom-out does not regress the launcher back to an undersized lane |

## First Evidence Batch

| Ref ID | Capture condition | Evidence location | Status | Blocker or note |
| --- | --- | --- | --- | --- |
| `LTR-BASE-5` | Default desktop LTR baseline at `1560x1200` | `tests/visual/designSystem/review-artifacts/launcher-template/ltr-base-5.png` | captured | Matches the executable `5`-column baseline guard |
| `LTR-WIDE-8` | Wide desktop LTR review at `2048x1280` | `tests/visual/designSystem/review-artifacts/launcher-template/ltr-wide-8.png` | captured | Matches the executable `8`-column wide-lane guard |
| `RTL-BASE-5` | Default desktop RTL baseline at `1560x1200` after using the display-settings tray | `tests/visual/designSystem/review-artifacts/launcher-template/rtl-base-5.png` | captured | Confirms the RTL state through the real tray interaction |
| `ZO-100-WIDE-8` | Wide desktop at `2048x1280` after applying display-settings magnification `-100%` | `tests/visual/designSystem/review-artifacts/launcher-template/zo-100-wide-8.png` | captured | Confirms the zoom-out state through the real tray interaction |

Executable evidence currently lives in:

- `tests/visual/designSystem/templates/launcher.spec.ts`

## Parity Rule

A future launcher-template change or launcher-style consumer matches this
reference pack only when:

- it preserves the default `5`-column desktop baseline
- it expands honestly toward the approved `8`-column ceiling as lane width
  grows
- RTL and zoom-out review states keep the same containment guarantees
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Initial Gaps

This pack still needs:

- an explicit drawer-open reference state if the display-settings tray becomes
  part of the launcher review contract rather than a supporting control
