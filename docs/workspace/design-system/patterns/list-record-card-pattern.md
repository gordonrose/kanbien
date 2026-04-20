# List Record Card Pattern

## Scope

- Pattern name:
  List record card
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Related principle artifacts:
  None yet
- Related routes or consuming surfaces:
  `/design-system/templates/list-page`
  `/design-system/canonicals/list-record-card`
  `/design-system/components/list-record-card`

## Intent

- What user or operator need does this pattern serve?
  Let people scan a compact record summary and select one item to reveal fuller
  detail without leaving the current page.
- Why should this be reusable rather than page-local?
  Repeated summary-card anatomy and selection affordance should stay consistent
  across list-style page families even when the parent page layout changes.

## Anatomy

- Required parts:
  title, subtitle, short description, tag row, selected-state affordance
- Optional parts:
  icon, metadata badge, secondary action, supporting avatar
- Content expectations:
  card copy should summarize one record cleanly enough to support selection
- Layout structure:
  full-width button card with stacked copy and wrapping tags

## States

- Default:
  unselected summary card
- Hover / pressed / focus:
  border and surface emphasis increase without changing geometry
- Selected / active:
  accent-aware selected treatment and pressed state become visible
- Disabled:
  not yet modeled
- Loading:
  not yet modeled
- Empty:
  not applicable for a single card
- Success:
  not applicable
- Warning:
  not applicable
- Error:
  not applicable
- Destructive:
  not applicable
- Real interactive states:
  selected card after click, card-driven detail population in the parent
  pattern

## Variants

- Approved variants:
  field-mapping placeholder card, neutral placeholder card
- Variant purpose:
  allow one mapping-oriented example while the broader set stays domain-neutral
- Variant limits:
  both variants share the same anatomy and interaction contract
- Forbidden variants:
  inline expanded detail inside the card, multi-select card groups, and
  card-local drawers that bypass the parent page choreography

## Token Contract

- Color tokens:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--accent`, `--accent-soft`
- Typography tokens:
  current title, subtitle, and body scale remain local pending a second
  consumer
- Spacing tokens:
  current card padding and internal gaps remain local pending reuse
- Radius / border tokens:
  `--radius`, `--line`
- Shadow / elevation tokens:
  `--shadow-soft`
- Motion tokens:
  none dedicated yet
- Other dependencies:
  parent-owned selection choreography and detail-panel relationship

## Accessibility

- Semantic structure:
  interactive card should remain a real `button`
- Keyboard behavior:
  focusable, clickable, and able to express selection state through
  `aria-pressed`
- Focus treatment:
  visible focus must share the same geometry-safe emphasis as hover
- Screen-reader expectations:
  title and supporting summary copy should remain inside the button’s accessible
  name and description flow
- Contrast or motion constraints:
  selected and focus states must remain readable across approved themes
- Localization / long-content concerns:
  title, subtitle, description, and tags should wrap or stack without breaking
  full-width card layout

## Responsive Behavior

- Mobile behavior:
  card remains full width inside the list column and still acts as the detail
  trigger
- Tablet behavior:
  card continues to anchor the selection model without requiring a separate
  row layout
- Desktop behavior:
  card stays in the left list column and visually coordinates with the pushed
  detail panel
- Overflow / wrapping expectations:
  tag rows may wrap; summary copy may extend vertically instead of clipping
- Shell attachment or floating expectations:
  not applicable at the card level
- Width model:
  full-width within the parent list column

## Composition Rules

- Common parent contexts:
  list-style templates with one-record-at-a-time detail reveal
- Compatible neighboring patterns:
  parent detail panel, page shell chrome, filter or search affordances
- Nesting guidance:
  cards may stack in a vertical list but should not nest inside each other
- Browser-native affordance coexistence rules:
  keep native button semantics rather than replacing them with div-based click
  targets
- Misuse cases to avoid:
  turning the card into a mixed-action toolbar or making secondary actions
  compete with whole-card selection

## Component Readiness

- Should this become a reusable component now?
  yes, as the first documented child seam of the `List Page` parent template
- If yes, proposed public API:
  summary fields, detail payload fields, selected-state boolean, optional tag
  list, optional mapping-mode label set
- If no, what must stabilize first?
  not applicable

## Adoption Plan

- First governed surface to adopt:
  `/design-system/templates/list-page`
- Existing pages that should migrate later:
  future collection or record-list pages that keep the same one-record
  selection model
- Partial-adoption note:
  the parent template keeps ownership of layout switching and detail placement

## Verification

- Required screenshots or visual checks:
  default card, selected card, mapping-placeholder card, missing-attribute
  fallback card, half-page long-copy card, mobile-width card, normal-theme
  card, dark-theme card, desert-theme card
- Accessibility verification:
  real button semantics, visible focus, keyboard selection
- Responsive verification:
  desktop list column and mobile full-width list behavior
- Frontend quality-gate impact:
  existing list-page Playwright coverage already protects core open/close
  runtime behavior; child-specific rendered checks should expand from there

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/list-record-card`
  `/design-system/components/list-record-card`
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  `docs/workspace/design-system/components/list-record-card-component.md`
