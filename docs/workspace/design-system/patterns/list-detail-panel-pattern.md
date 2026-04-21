# List Detail Panel Pattern

## Scope

- Pattern name:
  List detail panel
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Related routes or consuming surfaces:
  `/design-system/templates/list-page`
  `/design-system/canonicals/list-detail-panel`
  `/design-system/components/list-detail-panel`

## Intent

- What user or operator need does this pattern serve?
  Let people read the currently selected record in a dedicated detail surface
  without leaving the surrounding list context.
- Why should this be reusable rather than page-local?
  The open-detail anatomy, header zoning, local error handling, and sequential
  footer navigation should stay consistent across list-style page families even
  when parent layout and shell framing differ.

## Anatomy

- Required parts:
  header copy cluster, action row with close affordance, scrollable body,
  footer navigation row
- Optional parts:
  metadata line, subtitle, tag row, local error body
- Content expectations:
  title and body must support real reading length without collapsing the action
  and footer zones
- Layout structure:
  stacked header, body, and footer inside one bordered detail surface

## States

- Default:
  open detail surface with populated copy, actions, and footer navigation
- Missing attributes:
  title remains present while optional metadata, subtitle, or tags may be
  omitted cleanly
- Long content:
  compact metadata may truncate with tooltip recovery while title and body stay
  wrapped for reading continuity
  when header pressure becomes disproportionately tall and the user scrolls
  into the body, the header may condense secondary chrome to give the reading
  lane more space
- Local error:
  error treatment appears inside the body without collapsing the overall
  detail surface
- Boundary navigation:
  footer may disable `Previous` or `Next` and expose an honest terminal hint
- Hover / pressed / focus:
  buttons and close affordance keep geometry-safe emphasis
- Real interactive states:
  action-row focus, footer navigation enablement, and local error retry

## Variants

- Approved variants:
  baseline populated detail, missing-secondary-fields detail, local detail
  error, terminal footer state
- Variant purpose:
  preserve the parent template's current reading, resilience, and traversal
  seams without freezing parent-owned shell placement too early
- Forbidden variants:
  embedding the list column inside the component, appending shell-level overlay
  chrome, or making header actions replace the close affordance

## Token Contract

- Color tokens:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--accent-soft`
- Typography tokens:
  current detail title, subtitle, and body scale remain local pending a second
  governed consumer
- Spacing tokens:
  current internal padding and header/body/footer gaps remain local pending
  reuse
- Radius / border tokens:
  `--radius`, `--radius-sm`, `--line`
- Shadow / elevation tokens:
  `--shadow-soft`
- Other dependencies:
  parent-owned selection choreography, split placement, and mobile modal
  semantics

## Accessibility

- Semantic structure:
  child seam should preserve a labelled detail region with a clearly named
  close control
- Keyboard behavior:
  action and footer controls stay reachable in source order
- Focus treatment:
  action, close, and footer controls need visible focus without shifting layout
- Screen-reader expectations:
  title labels the detail region while action and footer controls retain clear
  accessible names
- Localization / long-content concerns:
  title, subtitle, body, and footer row must remain coherent in RTL and under
  long-content pressure

## Responsive Behavior

- Mobile behavior:
  child seam should preserve stacked header and control zoning in a narrow
  panel, while parent shell still owns modal framing and stacking
- Tablet behavior:
  component stays readable in a half-page lane without forcing truncation on
  the title or body
- Desktop behavior:
  component remains a stable reading surface beside the list column
- Overflow / wrapping expectations:
  body scrolls internally, metadata may truncate, and title/body remain wrapped
- Shell attachment or floating expectations:
  parent-owned, not part of this child seam

## Composition Rules

- Common parent contexts:
  list-style templates with one-record-at-a-time detail reveal
- Compatible neighboring patterns:
  list record cards, parent split layout, page search, shell chrome
- Nesting guidance:
  use one detail panel per active record context
- Browser-native affordance coexistence rules:
  keep real `button` controls for actions and footer traversal
- Misuse cases to avoid:
  turning the panel into a free-floating page shell or stuffing list-specific
  lazy-load messaging into the child seam

## Component Readiness

- Should this become a reusable component now?
  yes, as the second documented child seam of the `List Page` parent template
- If yes, proposed public API:
  title, subtitle, meta, body, tag list, local error visibility, action labels,
  previous/next enablement, optional terminal next hint

## Adoption Plan

- First governed surface to adopt:
  `/design-system/templates/list-page`
- Existing pages that should migrate later:
  future list-style page families with the same one-record reading model
- Partial-adoption note:
  parent template still owns selection open/close choreography, split placement,
  and mobile dialog semantics

## Verification

- Required screenshots or visual checks:
  baseline populated panel, missing-secondary-fields panel, local error panel,
  half-page long-content panel, mobile narrow panel, RTL panel, magnified panel
- Accessibility verification:
  labelled region, explicit close naming, keyboard focus on actions and footer
- Responsive verification:
  half-page and mobile-width review must preserve readable zoning
- Frontend quality-gate impact:
  existing `list-page` Playwright coverage remains upstream proof; child
  canonicals must add isolated panel verification

## Sign-Off Outcome

- Human sign-off status:
  approved on the `LDP-*` canonical set
- Promotion decision:
  promote to signed-off
- Remaining follow-up before `system-ready`:
  prove a second governed consumer before promoting beyond design-system
  sign-off

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/list-detail-panel-pattern.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/list-detail-panel`
  `/design-system/components/list-detail-panel`
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  `docs/workspace/design-system/components/list-detail-panel-component.md`
