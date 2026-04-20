# List Detail Split Layout Component

## Scope

- Component name:
  `ListDetailSplitLayout`
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-split-layout-pattern.md`
- Consuming surfaces:
  `/design-system/templates/list-page`
  `/design-system/canonicals/list-detail-split-layout`
  `/design-system/components/list-detail-split-layout`

## Purpose

- What reusable job does this component perform?
  Render the lane relationship between a list region and a connected detail
  region across closed, open, mirrored, and mobile-overlay states.
- Why is a shared implementation now justified?
  The parent `List Page` now has two signed-off inner child seams, which makes
  the remaining reusable shell relationship clearer and less likely to absorb
  unstable card or panel internals.

## Public API

- Inputs / props / attributes:
  open boolean, direction, lane content, shell-offset mode, mobile-overlay
  mode
- Required inputs:
  list lane content
- Optional inputs:
  detail lane content, open state, direction, shell-offset context
- Supported variants:
  closed single-lane state, desktop open split, mobile overlay
- Unsupported variants:
  search-state logic, lazy-load policy, no-results treatment, card anatomy,
  detail anatomy
- Composition slots or extension points:
  parent-owned list content slot and parent-owned detail content slot

## Behavior

- Default behavior:
  render a list lane and only expand to a split or overlay relationship when
  detail is open
- Interactive states:
  none owned directly beyond preserving the lane relationship for the inner
  seams
- Loading / error / empty behavior:
  parent-owned for now
- Disabled or denied behavior:
  not modeled at the layout seam

## Token Dependencies

- Required semantic tokens:
  existing base tokens only:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--shadow-soft`, `--radius`
- Tokens that must not be bypassed:
  shared surface, border, and text-color tokens
- Theming or state considerations:
  lane surfaces must inherit the shared theme system without family-local
  overrides

## Accessibility Contract

- Semantics:
  preserve a stable container around a list region and the signed-off detail
  region when present
- Keyboard interaction:
  must not block keyboard reachability into either lane
- Focus behavior:
  open, mirrored, and overlay states must not clip focus-visible controls
- Announcements / labels:
  inherited from the parent and inner child seams
- Known constraints:
  parent template still owns focus movement, announcements, and invalidation
  choreography

## Performance And Rendering

- Rendering expectations:
  layout shell should stay cheap enough for repeated preview and design-system
  review use
- Motion constraints:
  no decorative motion required
- Large-content or overflow considerations:
  list and detail lanes keep independent scrolling where needed

## Adoption And Migration

- First consumers:
  `/design-system/templates/list-page`
- Existing local implementations to replace:
  current page-local split shell and mobile overlay layout around the signed-off
  card and detail child seams
- Migration risks:
  freezing parent state choreography into the child seam too early would make
  the API brittle
- Compatibility notes:
  keep selection logic, search behavior, and loading/error policy outside this
  component for now

## Verification

- Unit or frontend tests:
  existing `list-page` Playwright coverage plus dedicated child canonical proof
- Visual checks:
  desktop closed, desktop open, independent scroll pressure, mobile overlay,
  mobile layering, RTL, magnified, and theme states
- Responsive checks:
  open/closed lane shifts plus mobile overlay review
- Accessibility checks:
  readable lane widths, no clipped controls, mirrored layout parity

## Adoption And Extraction Readiness

- Component artifact promotion reason:
  the inner card and detail seams are now signed off, making the remaining lane
  relationship explicit enough to document on its own
- What still remains before shared code extraction?
  prove a second governed consumer before promotion beyond design-system
  sign-off
- What is explicitly not blocked?
  documenting the seam and beginning isolated design-system verification now

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/list-detail-split-layout-component.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/list-detail-split-layout`
  `/design-system/components/list-detail-split-layout`
- Frontend docs update required:
  yes, when the child seam gets shared application code
- Architecture-map update required:
  yes, when the component leaves design-system-only documentation
