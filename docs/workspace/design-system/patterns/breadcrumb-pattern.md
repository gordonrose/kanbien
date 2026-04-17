# Breadcrumb Pattern

## Scope

- Pattern name:
  Breadcrumb
- Status:
  active
- Owner:
  Codex with user sign-off
- Related principle artifacts:
  None yet
- Related routes or consuming surfaces:
  `/design-system`
  planned page-chrome adoption in `rootAdminShell`

## Intent

- What user or operator need does this pattern serve?
  Preserve local page orientation by showing the current path and providing
  access to earlier wayfinding steps.
- Why should this be reusable rather than page-local?
  Breadcrumb structure and collapse behavior should stay consistent wherever
  secondary page chrome needs hierarchical wayfinding.

## Anatomy

- Required parts:
  labeled breadcrumb `nav`, ordered list, current page item
- Optional parts:
  collapsed middle segment menu, compact signpost menu
- Content expectations:
  parent steps should be concise, ordered, and drawn from the real page or
  workflow hierarchy; the current page must remain obvious, and filler labels
  or invented intermediate steps must not be introduced just to complete the
  trail visually
- Layout structure:
  breadcrumb occupies the leading region of the shared sub-nav row and manages
  its own reduction within that region

## States

- Default:
  full breadcrumb trail with current page visible
- Hover / pressed / focus:
  links and collapse triggers show affordance without changing trail geometry
- Selected / active:
  current page is visually distinct and exposed with `aria-current`
- Disabled:
  not applicable in the current implementation
- Loading:
  not currently modeled
- Empty:
  not currently modeled
- Success:
  not applicable
- Warning:
  not applicable
- Error:
  not currently modeled
- Destructive:
  not applicable

## Variants

- Approved variants:
  full trail, collapsed middle trail, compact signpost menu
- Variant purpose:
  yield gracefully under width pressure while preserving orientation
- Variant limits:
  current implementation assumes one collapsed middle segment and one compact
  signpost fallback
- Forbidden variants:
  wrapping across multiple lines, hiding the current page, or using collapse as
  a decorative style rather than a pressure response

## Token Contract

- Color tokens:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`
- Typography tokens:
  current breadcrumb uses the shared body type scale with a stronger current
  item weight
- Spacing tokens:
  current gap and padding values remain local until another breadcrumb-like
  family proves reuse
- Radius / border tokens:
  `--radius-sm`, `--line`, `--line-strong`
- Shadow / elevation tokens:
  `--shadow`
- Motion tokens:
  none dedicated yet
- Other dependencies:
  breadcrumb overflow measurement and compact-mode menu anchoring in
  `src/frontend/designSystem/assets/app.mjs`

## Accessibility

- Semantic structure:
  labeled `nav`, ordered list semantics, current item announced with
  `aria-current`
- Keyboard behavior:
  collapse and compact triggers must be keyboard reachable and close on outside
  click or `Escape`
- Focus treatment:
  visible button and link focus without layout jump
- Screen-reader expectations:
  collapsed or compact menus should still reveal the hidden path steps
- Contrast or motion constraints:
  current and inactive steps must remain distinguishable across themes
- Localization / long-content concerns:
  long labels must not wrap; the pattern must prefer reduction over overflow
  into adjacent row content

## Responsive Behavior

- Mobile behavior:
  compact signpost mode may represent the path when the full trail cannot fit
- Tablet behavior:
  the trail may hide `Page -1` and then the collapsed middle segment before
  switching to compact mode
- Desktop behavior:
  full trail remains visible when space permits
- Overflow / wrapping expectations:
  labels remain non-wrapping and the pattern measures against its own container
  before falling back through reduction states

## Composition Rules

- Common parent contexts:
  shared sub-nav row beneath a top-nav or page shell
- Compatible neighboring patterns:
  search-shell, context-nav, route title or metadata surfaces
- Nesting guidance:
  the breadcrumb owns only its internal reduction logic; parent row geometry is
  governed by the `sub-nav` pattern
- Misuse cases to avoid:
  treating breadcrumb collapse thresholds as standalone global breakpoints or
  allowing breadcrumb growth to take over the search slot

## Component Readiness

- Should this become a reusable component now?
  Not yet as a shared implementation seam; the pattern is stable enough for
  family documentation, but canonical row-aware proof still needs to be built
- If yes, proposed public API:
  Not applicable yet
- If no, what must stabilize first?
  row-aware canonical evidence, family verification, and a first consumer

## Adoption Plan

- First governed surface to adopt:
  `rootAdminShell` page chrome
- Existing pages that should migrate later:
  future routes with hierarchical wayfinding above the main content
- Partial-adoption note:
  adopt with the `sub-nav` row contract whenever the search shell is present on
  the same line

## Verification

- Required screenshots or visual checks:
  full trail, collapsed middle state, compact signpost state, RTL, and
  long-label stress state
- Accessibility verification:
  keyboard access to collapse and compact menus, outside-click close, and focus
  return
- Responsive verification:
  confirm the breadcrumb yields within its own region before whole-row
  instability appears
- Frontend quality-gate impact:
  this pattern should become a governed family before child-family extraction

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/breadcrumb-pattern.md`
- Design-system route update required:
  future canonical route and family preview coverage required
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  defer until a shared implementation seam is justified by a second consumer
