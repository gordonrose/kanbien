# 2026-04-25 Canonical Drawer Containment Gap

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into canonical overlay
> containment helpers, audit coverage, current verification checklists, and
> generated render-route expectations.

## Symptom

Drawer-based canonical renderings could appear as host-page drawers instead of
as bounded specimens inside the canonical render area. The async activity drawer
escaped because its canonical route mounted the drawer as a page-level sibling
of the design-system shell. Context-nav and display-settings drawer renderings
already used a local preview shell, but their regression coverage did not assert
the shared containment contract directly.

## Root Cause

The async activity drawer canonical reused the production `.side-panel` posture
without giving it a canonical drawer host. The global side-panel rule uses
viewport-oriented fixed positioning, which is correct for app chrome but wrong
for dedicated canonical render pages. Existing context-nav renderings had local
absolute positioning inside `#context-nav-preview-shell`, but the suite still
mostly checked visibility, dimensions, and relative attachment instead of a
render-frame containment invariant.

## Why The Loop Missed It

The earlier checks proved that drawers rendered and that selected states were
visible. They did not prove that the browser geometry stayed inside the render
surface after the route was generated or after the host page scrolled. That left
a blind spot for any canonical family that imported app-level drawer posture
without a local canonical host.

## Prevention Added

- Added a reusable `data-canonical-drawer-host="true"` render-frame posture that
  keeps drawer-side panels absolute to the canonical frame rather than fixed to
  the page viewport.
- Moved the async activity drawer canonical root inside its render frame so the
  generated route renders as a bounded specimen.
- Added geometry containment assertions for async activity drawer states,
  context-nav attached drawers, and generated display-settings drawer routes.

## Follow-Up Rule

Any generated canonical that displays a drawer must render the drawer inside a
local canonical host or an existing preview shell with equivalent containment
rules. Visibility alone is not enough evidence; drawer canonicals need geometry
coverage against the render frame.
