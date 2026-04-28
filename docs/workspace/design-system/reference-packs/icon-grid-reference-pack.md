# Icon Grid Reference Pack

## Purpose

Freeze the current `Icon Grid` child-seam reference target so verification and
later extraction work have a concrete baseline.

## Scope

- Family:
  `icon-grid`
- Status:
  promoted child-seam reference baseline
- Current source surface:
  `/design-system/components/icon-grid`
- Canonical launcher:
  `/design-system/canonicals/icon-grid`
- Parent host family:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/icon-grid-behavior-lock.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/icon-grid-verification-checklist.md`
- SaaS topic baseline:
  `docs/workspace/design-system/reference-packs/icon-grid-saas-baseline.md`

## Signed-Off Rule Source

This pack inherits the approved child-seam behavior locks:

- `IG-001` through `IG-008` from
  `docs/workspace/design-system/behavior-locks/icon-grid-behavior-lock.md`

## Current Surface Truth

- the seam now has a dedicated child render route at
  `/design-system/components/icon-grid`
- the parent host still lives inside `/design-system/templates/form`
- the signed-off parent framing remains the same:
  field-tile shell, field label, help text, error slot, section cadence, and
  page chrome
- the child seam currently owns:
  - a single resting trigger with selected icon glyph and label
  - a compact modal panel rather than a drawer
  - a search field that filters the fuller approved in-repo shared icon library
  - a single-select icon grid with tooltip-first tile naming for density
  - owned close behavior through close button, backdrop, option selection, and
    `Escape`
  - focus return to the trigger on owned dismissal paths
  - participation in the parent overlay-arbitration model

## Ownership Boundary

- Parent-owned by `form-template`:
  field-tile framing, help/error placement, section placement, grid span, and page
  rhythm
- Child-owned by `icon-grid`:
  trigger summary, shared icon-library rendering, modal anatomy, search,
  single-selection behavior, and focus choreography
- Not owned by this child seam:
  arbitrary asset upload, custom SVG ingestion, or broader page-level overlay
  policy beyond its participation in host cleanup

## Required Reference States

The first direct child canonical batch should preserve:

| Ref ID | Hosted state | Why it exists | Evidence status |
| --- | --- | --- | --- |
| `IGR-001` | Resting trigger with default selection | Preserves the calm collapsed baseline | implemented |
| `IGR-002` | Open modal with full approved icon catalog | Preserves the searchable modal chassis | implemented |
| `IGR-003` | Open modal filtered to one search match | Preserves search-driven narrowing | implemented |
| `IGR-004` | Trigger after selecting a different icon | Preserves summary synchronization after selection | implemented |
| `IGR-005` | RTL open full-catalog review | Preserves mirrored dense-grid review on the child route | implemented |
| `IGR-006` | Dark mobile open user-search review | Preserves compact stress behavior on the child route | implemented |

## Evidence Status

- the child seam now has a dedicated behavior lock and verification checklist
- the child seam now has a dedicated canonical launcher and direct child render
  route instead of depending only on the parent form host
- the parent route runtime reuses the shared design-system icon definitions
- the current icon-grid batch exposes 60 in-repo approved icon options instead
  of the earlier starter subset
- the broader governed backlog for future icon additions now lives in
  `docs/workspace/design-system/reference-packs/icon-grid-saas-baseline.md`
- browser coverage now checks search, selection synchronization, and overlay
  arbitration on the hosted parent route

## Exit Condition

This reference pack becomes operational when:

- the child route and hosted seam behavior both remain aligned with `IG-*`
- the browser verification checklist remains current
- the dedicated canonical route continues to derive from this pack rather than
  from undocumented memory of the parent form
