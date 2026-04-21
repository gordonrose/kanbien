# Search Shell Pattern

## Scope

- Pattern name:
  Search shell
- Status:
  active
- Owner:
  Codex with user sign-off
- Related principle artifacts:
  None yet
- Related routes or consuming surfaces:
  `/design-system`
  planned shared header search adoption

## Intent

- What user or operator need does this pattern serve?
  Provide a stable page- or system-search affordance inside secondary chrome
  without overpowering navigation and wayfinding.
- Why should this be reusable rather than page-local?
  Search placement, width, and focus treatment should remain consistent across
  shells that expose search in the same secondary-chrome role.

## Anatomy

- Required parts:
  search form, search input
- Optional parts:
  future prefix icon, submit affordance, empty-state helper text
- Content expectations:
  placeholder or label should describe searchable scope clearly
- Layout structure:
  search shell occupies the centered middle slot of the shared sub-nav row and
  remains width-bounded

## States

- Default:
  empty search input with placeholder text
- Hover / pressed / focus:
  focus outline and border emphasis appear without changing shell geometry
- Selected / active:
  not applicable beyond focus in the current implementation
- Disabled:
  not currently modeled
- Loading:
  not currently modeled
- Empty:
  default empty input state
- Success:
  not currently modeled
- Warning:
  not applicable
- Error:
  not currently modeled
- Destructive:
  not applicable

## Variants

- Approved variants:
  centered bounded input shell
- Variant purpose:
  keep search discoverable without destabilizing page chrome
- Variant limits:
  current implementation is intentionally simple and does not yet define icon,
  chip, or advanced-filter variants
- Forbidden variants:
  full-row takeover, unbounded width growth, or local styling that bypasses the
  shared row contract

## Token Contract

- Color tokens:
  `--surface-1`, `--line`, `--ink`, `--search-border`,
  `--search-placeholder`
- Typography tokens:
  current search input inherits the shared body type scale
- Spacing tokens:
  current padding and max-width remain local until another consumer proves the
  same semantic search-shell scale
- Radius / border tokens:
  `--radius-sm`, `--line`
- Shadow / elevation tokens:
  none beyond the current inset treatment
- Motion tokens:
  none dedicated yet
- Other dependencies:
  centered grid placement and row-level responsive composition in the shared
  `sub-nav` pattern

## Accessibility

- Semantic structure:
  `form` with `role="search"` and a semantic `input type="search"`
- Keyboard behavior:
  focus must enter cleanly and stay visible
- Focus treatment:
  current focus ring and border treatment must remain visible and readable
- Screen-reader expectations:
  future consumers may need an explicit label if placeholder-only naming is no
  longer sufficient for production
- Contrast or motion constraints:
  focus and placeholder styling must remain readable across approved themes
- Localization / long-content concerns:
  placeholder text may localize, but the input should keep its bounded layout
  rather than stealing row width

## Responsive Behavior

- Mobile behavior:
  the search shell may stack under the breadcrumb when the row layout no longer
  sustains side-by-side presentation
- Tablet behavior:
  input remains centered and width-bounded while the breadcrumb yields first
- Desktop behavior:
  input stays centered in the middle slot with a `40rem` max-width
- Overflow / wrapping expectations:
  the shell should not grow into the breadcrumb region; width pressure belongs
  to the shared row contract

## Composition Rules

- Common parent contexts:
  shared sub-nav row under top-nav or page shell
- Compatible neighboring patterns:
  breadcrumb, page titles, route-level content catalogs
- Nesting guidance:
  keep search-shell concerns limited to input behavior and styling; row width
  negotiation belongs to the parent composition pattern
- Misuse cases to avoid:
  adding local width overrides that break centered alignment or documenting
  search as though it can ignore breadcrumb pressure when both coexist

## Component Readiness

- Should this become a reusable component now?
  Not yet as a shared implementation seam; the search shell is stable enough
  for documentation, but row-aware verification and consumer proof still need
  to land
- If yes, proposed public API:
  Not applicable yet
- If no, what must stabilize first?
  explicit empty/focus verification, row-aware reference states, and the first
  governed consumer

## Adoption Plan

- First governed surface to adopt:
  shared application header search in page chrome
- Existing pages that should migrate later:
  future shells that expose a centered secondary search affordance
- Partial-adoption note:
  when search-shell appears beside breadcrumb, adopt the `sub-nav` row pattern
  alongside it

## Verification

- Required screenshots or visual checks:
  default empty input, focus state, compressed row with breadcrumb pressure,
  RTL, and long placeholder or localized text
- Accessibility verification:
  focus visibility and semantic search landmarks
- Responsive verification:
  confirm centered bounded presentation survives row pressure without overlap
- Frontend quality-gate impact:
  this family should reach explicit empty/focus/overflow verification before
  system-ready promotion

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/search-shell-pattern.md`
- Design-system route update required:
  future canonical route and family preview coverage required
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  defer until a shared implementation seam is justified by real reuse
