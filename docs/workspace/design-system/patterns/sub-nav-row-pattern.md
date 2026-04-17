# Sub-Nav Row Pattern

## Scope

- Pattern name:
  Sub-nav row
- Status:
  active
- Owner:
  Codex with user sign-off
- Related principle artifacts:
  None yet. Create a sub-nav principle note if future work changes the enduring
  page-chrome rule across routes.
- Related routes or consuming surfaces:
  `/design-system`
  planned page-chrome adoption in `rootAdminShell`

## Intent

- What user or operator need does this pattern serve?
  Provide a stable secondary chrome row that keeps page wayfinding and page
  search available without competing for the same horizontal space.
- Why should this be reusable rather than page-local?
  The responsive relationship between breadcrumb and search is a durable shell
  rule, not a one-page styling accident.

## Anatomy

- Required parts:
  breadcrumb region, search region, shared row container
- Optional parts:
  row copy or diagnostics for preview-only probes
- Content expectations:
  breadcrumb reflects current page structure; search exposes page or system
  lookup affordance without owning unrelated utility actions
- Layout structure:
  the row uses a shared three-column grid where breadcrumb occupies the leading
  slot and the search shell remains centered and width-bounded in the middle
  slot

## States

- Default:
  breadcrumb trail is visible and search input is visible
- Hover / pressed / focus:
  child-family controls show focus and hover treatment without shifting row
  geometry
- Selected / active:
  current breadcrumb item remains identifiable
- Disabled:
  not currently used in the design-system implementation
- Loading:
  not currently modeled for the standalone row
- Empty:
  not currently modeled; future consumers should decide whether empty search or
  reduced breadcrumb states are valid
- Success:
  not applicable
- Warning:
  not applicable
- Error:
  not currently modeled; real app adoption should define degraded behavior if
  search is unavailable
- Destructive:
  not applicable

## Variants

- Approved variants:
  full breadcrumb with centered search, collapsed breadcrumb with centered
  search, compact breadcrumb signpost with centered search
- Variant purpose:
  let the breadcrumb yield before the row gives up its centered search
  presentation
- Variant limits:
  current pattern assumes one breadcrumb region and one centered search region
- Forbidden variants:
  row-local ad hoc filters inside the search slot, search expansion into the
  breadcrumb slot, or page-local breakpoint hacks that bypass the measured row
  contract

## Token Contract

- Color tokens:
  `--surface-1`, `--surface-2`, `--line`, `--ink`, `--ink-soft`,
  `--search-border`, `--search-placeholder`
- Typography tokens:
  current implementation inherits the frontend baseline type scale
- Spacing tokens:
  current row uses local grid and gap values from
  `src/frontend/designSystem/assets/styles.css`; semantic extraction is
  deferred until another secondary shell row needs the same balance
- Radius / border tokens:
  `--radius-sm`, `--line`
- Shadow / elevation tokens:
  `--shadow`
- Motion tokens:
  none dedicated yet
- Other dependencies:
  row grid geometry, header offset updates, and child-family overflow handling
  remain structural concerns rather than token candidates today

## Accessibility

- Semantic structure:
  breadcrumb remains in a labeled `nav`; search remains in a `form` with
  `role="search"`
- Keyboard behavior:
  keyboard entry must reach breadcrumb triggers and the search input in a
  stable order
- Focus treatment:
  focus styles must remain visible without changing row layout
- Screen-reader expectations:
  row children should retain their own accessible labels rather than relying on
  the parent row to describe them
- Contrast or motion constraints:
  row chrome must remain readable across approved themes
- Localization / long-content concerns:
  long breadcrumb labels must yield through collapse or compact states before
  they cause whole-row overlap

## Responsive Behavior

- Mobile behavior:
  the row may stack when the existing responsive CSS decides the layout can no
  longer sustain side-by-side presentation
- Tablet behavior:
  breadcrumb should be able to collapse while search remains centered and
  bounded
- Desktop behavior:
  breadcrumb and search share the row without overlap, clipping, or ad hoc
  width stealing
- Overflow / wrapping expectations:
  breadcrumb handles pressure through its own progressive reduction; search
  remains width-bounded and should not sprawl into the breadcrumb slot

## Composition Rules

- Common parent contexts:
  page chrome directly beneath the top navigation shell
- Compatible neighboring patterns:
  top-nav, context navigation, collection header, route-local content panes
- Nesting guidance:
  keep width negotiation in the parent row; child families may manage their own
  internal states but must not silently redefine row geometry
- Misuse cases to avoid:
  documenting breadcrumb and search as if they can be adopted independently
  without a row contract, or letting one child family invent page-local
  responsive rules

## Component Readiness

- Should this become a reusable component now?
  Yes, as a draft reusable composition seam
- If yes, proposed public API:
  breadcrumb items, current breadcrumb item, search-shell props, search active
  state, row-level direction or locale inputs, and optional preview-only row
  diagnostics outside the governed shell
- If no, what must stabilize first?
  Not applicable

## Adoption Plan

- First governed surface to adopt:
  page chrome inside `rootAdminShell`
- Existing pages that should migrate later:
  future authenticated shells that combine wayfinding with page-level search
- Partial-adoption note:
  child families may extract independently later, but the row contract must be
  adopted with them whenever both appear together

## Verification

- Required screenshots or visual checks:
  wide row, compressed row with breadcrumb collapse, compressed row with
  compact breadcrumb signpost, RTL row, and long-label row
- Accessibility verification:
  keyboard access to breadcrumb menus and stable entry into the search input
- Responsive verification:
  verify breadcrumb yielding, centered search preservation, and absence of
  overlap or clipping
- Frontend quality-gate impact:
  this pattern should become the parity target for any consumer that uses both
  child families together

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`
- Design-system route update required:
  no
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  `docs/workspace/design-system/components/sub-nav-row-component.md`
