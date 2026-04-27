# Canonical Render Page Reference Pack

## Purpose

Freeze the approved canonical-render-page baseline so future template-hosted
review work can compare against a named source of truth instead of re-deriving
the lane shape from individual render surfaces.

This pack is intentionally narrower than the template artifact and more
concrete than the broader canonical/parity conventions note.

## Scope

- Family:
  `canonical-render-page`
- Status:
  system-ready review baseline
- Source surface:
  `/design-system/templates/canonical-render-page`
- Related template artifact:
  `docs/workspace/design-system/templates/canonical-render-page-template.md`
- Related verification gate:
  `docs/workspace/design-system/verification/canonical-render-page-verification-checklist.md`
- Related executable proof:
  `tests/visual/designSystem/templates/canonicalRenderPage.spec.ts`

## What This Pack Is For

Use this pack to answer:

- what concrete canonical-render-page behavior is approved today
- what later render-page work must preserve before claiming parity
- what counts as an intentional template change versus extra review chrome or
  drift

## Human Review Status

- Human review surface:
  `/design-system/templates/canonical-render-page`
- Review mode:
  template-hosted render drawer with the simplified single-lane specimen and
  governed pattern swapping
- Review outcome:
  accepted as the current canonical-render-page baseline
- Remaining gap:
  none for template-level system readiness; broader family readiness remains
  per-family and follows each family's own canonical checklist

## Generated Consumer Coverage

Generated canonical-rendering routes are now first-class consumers of this
template contract:

- `/design-system/canonical-renderings/:familyKey/:referenceId`

Current executable evidence verifies that generated render routes resolve to
registered render surfaces, expose specimen markers, avoid fallback overview
content, and preserve the known high-risk render contracts around theme scope,
responsive width, and overlay containment.

Generated render coverage lives in:

- `tests/integration/frontend/designSystemCanonicalRouting.test.ts`
- `tests/integration/frontend/designSystemCanonicalThemeScopeAudit.test.ts`
- `tests/integration/frontend/designSystemCanonicalResponsiveWidthAudit.test.ts`
- `tests/integration/frontend/designSystemCanonicalOverlayContainmentAudit.test.ts`
- family-specific visual specs under `tests/visual/designSystem/canonicals/`

## Reference Contract

- The render page keeps the left-column template intro and metadata, while the
  right-column specimen enters the actual governed pattern quickly instead of
  wrapping it in extra summary cards or review-action strips.
- The render drawer can swap between the approved starter specimen set:
  `sub-nav-row`, `breadcrumb`, `search-shell`, `list-record-card`, and
  `list-detail-panel`.
- Selecting a pattern must mount the real governed family surface, not a
  text-only proxy.
- The `sub-nav-row`, `breadcrumb`, and `search-shell` options must run through
  the shared breadcrumb/search-row seam rather than independent fake markup.
- The simplified specimen lane must not prepend the removed top header copy,
  state chip, or outer panel-card wrapper ahead of the actual render surface.

## Required Reference States

| Ref ID | Source route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `CRP-001` | `/design-system/templates/canonical-render-page` | Default baseline with `sub-nav-row` selected | Locks the simplified baseline lane with the real shared row seam visible | covered-by-test | Current baseline intentionally removes extra specimen-summary chrome |
| `CRP-002` | `/design-system/templates/canonical-render-page` | `list-detail-panel` selected from the render drawer | Proves the selector swaps to a real governed pattern surface instead of proxy copy | covered-by-test | Current executable proof asserts the detail-panel host renders |
| `CRP-003` | `/design-system/templates/canonical-render-page` | `breadcrumb` selected from the render drawer | Proves breadcrumb review shows the real breadcrumb seam and hides the search shell | covered-by-test | Current executable proof asserts the breadcrumb host is visible and search is hidden |

## First Evidence Batch

The first approved evidence batch currently includes:

- render drawer exposes the five governed pattern options
- `list-detail-panel` selection mounts the real detail-panel surface
- `breadcrumb` selection mounts the real breadcrumb seam and suppresses the
  search shell

Executable evidence currently lives in:

- `tests/visual/designSystem/templates/canonicalRenderPage.spec.ts`

## Parity Rule

A future canonical-render-page change matches this reference pack only when:

- it preserves the simplified single-lane review posture
- it keeps the pattern selector bound to real governed surfaces
- any difference is explicitly recorded as either:
  - approved change
  - temporary known gap
  - regression

## Initial Gaps

This pack still needs:

- dedicated wider-state reference captures only if the template route itself
  becomes the screenshot-grade sign-off host for additional families beyond
  the generated render routes that already carry their own family-specific
  proof
