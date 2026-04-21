# Sub-Nav Row Component

## Scope

- Component name:
  `SubNavRow`
- Status:
  draft
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`
- Consuming surfaces:
  `rootAdminShell`

## Purpose

- What reusable job does this component perform?
  Render the governed secondary shell row that composes breadcrumb wayfinding
  with a centered, width-bounded search shell beneath the top navigation.
- Why is a shared implementation now justified?
  The row contract is already locked, canonically verified, Playwright-backed,
  and adopted in `rootAdminShell`, so leaving the composition as an implied
  page-local seam would create more drift risk than documenting the intended
  shared implementation boundary.

## Public API

- Inputs / props / attributes:
  breadcrumb items, current breadcrumb item, breadcrumb reduction mode hooks,
  search-shell props, search active state, row-level locale or direction
  inputs, optional row diagnostics for governed preview surfaces
- Required inputs:
  breadcrumb structure, current item label, search-shell configuration
- Optional inputs:
  shallow home-only breadcrumb state, explicit compact-mode forcing for locked
  canonical or preview surfaces, row diagnostic copy for design-system routes
- Supported variants:
  full row, reduced breadcrumb row, compact signpost row, mobile search-only
  row
- Unsupported variants:
  row-local utility actions inside the search lane, search expansion into the
  breadcrumb slot, unrelated toolbar actions mixed into the row chrome
- Composition slots or extension points:
  child-family seam for `breadcrumb`, child-family seam for `search-shell`,
  optional preview-only framing copy outside the governed row itself

## Behavior

- Default behavior:
  render breadcrumb and search together in the governed secondary row while
  keeping search centered and bounded
- Interactive states:
  preserve breadcrumb menu behavior, compact signpost recovery, search focus
  treatment, tooltip behavior, and mobile fallback without row drift
- Loading / error / empty behavior:
  not yet data-driven at the shared seam; real consumers may decide search
  execution semantics later, but must not break row geometry
- Disabled or denied behavior:
  denied or unavailable search execution must not collapse the row into an
  unrelated local toolbar; permission-aware hiding still belongs to the
  consuming application layer

## Token Dependencies

- Token candidacy review outcome:
  row-level semantic extraction still intentionally deferred; existing shared
  base tokens remain the current dependency set
- Required semantic tokens:
  existing base tokens from `src/frontend/designSystem/assets/styles.css`:
  `--surface-1`, `--surface-2`, `--line`, `--ink`, `--ink-soft`,
  `--search-border`, `--search-placeholder`, `--radius-sm`, `--shadow`
- Tokens that must not be bypassed:
  row surface, line, bounded search treatment, tooltip layer, and child-family
  selected-state styling
- Theming or state considerations:
  component must remain readable across approved themes while keeping row fit,
  centered search geometry, and breadcrumb yielding local to the primitive
  rather than inventing page-specific token overrides

## Accessibility Contract

- Semantics:
  expose a breadcrumb `nav` plus a `form` with `role="search"` inside one
  stable row composition
- Keyboard interaction:
  keyboard access to breadcrumb triggers and the search input in a stable
  order; `Escape` behavior for breadcrumb menus remains part of the seam
- Focus behavior:
  preserve visible focus styling without changing row geometry or pushing the
  search shell out of alignment
- Announcements / labels:
  child families retain their own accessible labels; the row must not erase or
  replace that structure with weaker wrapper-only labeling
- Known constraints:
  the current shared seam is still composition-first and not yet extracted
  into shared application code, so API discipline is currently documented
  rather than enforced by framework code

## Performance And Rendering

- Rendering expectations:
  keep width negotiation at the row level and let breadcrumb yield before the
  row abandons centered search presentation
- Motion constraints:
  avoid decorative motion in shell chrome
- Large-content or overflow considerations:
  long breadcrumb labels and longer search placeholder or entered text must
  yield through the approved row and child-family reduction behavior rather
  than wrapping, clipping, or stealing each other’s lane

## Adoption And Migration

- First consumers:
  `rootAdminShell`
- Existing local implementations to replace:
  route-local page chrome beneath the adopted top-nav shell
- Migration risks:
  future consumers may want row-local toolbar actions that do not belong in
  this seam; those should stay out of scope rather than broadening the row API
  prematurely
- Compatibility notes:
  keep `breadcrumb` and `search-shell` independently governable child seams,
  but treat the row contract as mandatory whenever both appear together

## Verification

- Unit or frontend tests:
  current proof exists through design-system visual canonicals and root-admin
  parity work; shared implementation tests should follow once the seam is
  extracted into real application code
- Visual checks:
  desktop full row, compressed row, active-search row, mobile fallback, RTL
  full row, RTL reduced row, and magnified long-content row
- Responsive checks:
  breadcrumb yielding, centered bounded search preservation, mobile breadcrumb
  removal, and tooltip/layering correctness
- Accessibility checks:
  keyboard reachability for breadcrumb menus, stable focus order into search,
  and preserved child-family semantics

## Adoption And Extraction Readiness

- Component artifact promotion reason:
  the family already has locked behavior, a complete reference pack,
  Playwright-backed evidence, and a real adopted consumer in `rootAdminShell`
- What still remains before shared code extraction?
  validate the same seam in at least one additional governed consumer so the
  final extracted API is based on more than one live shell
- What is explicitly not blocked?
  documenting the intended reusable `SubNavRow` seam now

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/sub-nav-row-component.md`
- Design-system route update required:
  no
- Frontend docs update required:
  yes, when the row leaves draft and a shared application seam is extracted
- Architecture-map update required:
  yes, when the shared component seam exists in application code
