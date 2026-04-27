# List Record Card Component

## Scope

- Component name:
  `ListRecordCard`
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- Consuming surfaces:
  `/design-system/templates/list-page`
  `/design-system/canonicals/list-record-card`
  `/design-system/components/list-record-card`

## Purpose

- What reusable job does this component perform?
  Render a full-width selectable record summary card that can drive a parent
  detail surface.
- Why is a shared implementation now justified?
  The same anatomy already repeats multiple times inside the parent `List Page`
  template, and centralizing the card’s selection contract is less risky than
  freezing the full parent split-layout API this early.

## Public API

- Inputs / props / attributes:
  title, subtitle, summary, tags, detail title, detail subtitle, detail body,
  detail meta, selected state, optional placeholder-mode marker
- Required inputs:
  title, subtitle, summary, detail title, detail body
- Optional inputs:
  detail meta, tag list, detail subtitle, placeholder-mode marker
- Supported variants:
  mapping placeholder card, neutral placeholder card
- Unsupported variants:
  inline expanded detail, card-local filter controls, card-local destructive
  action clusters, multi-select behavior
- Composition slots or extension points:
  parent-owned detail target relationship through shared data attributes or
  equivalent extracted props

## Behavior

- Default behavior:
  render a full-width summary card in an unselected state
- Interactive states:
  clicking or keyboard-activating the card marks it selected and lets the
  parent pattern reveal the matching detail payload
- Loading / error / empty behavior:
  not yet modeled at the component seam
- Disabled or denied behavior:
  not yet modeled at the component seam

## Token Dependencies

- Token candidacy review outcome:
  `docs/workspace/design-system/token-reviews/list-record-card-token-candidacy-review.md`
- Required semantic tokens:
  existing base tokens only:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--accent`, `--accent-soft`, `--radius`, `--shadow-soft`
- Tokens that must not be bypassed:
  shared surface, border, selected-state, and text-color tokens
- Theming or state considerations:
  hover, focus, and selected treatments must inherit the existing theme and
  accent system without family-local overrides

## Accessibility Contract

- Semantics:
  keep a real interactive `button`
- Keyboard interaction:
  Enter and Space should activate via native button behavior
- Focus behavior:
  focus-visible state must remain clear without shifting layout
- Announcements / labels:
  summary content should remain available to assistive technology through the
  button content structure and selected-state announcement
- Known constraints:
  the current prototype still lets the parent own detail-panel announcements

## Performance And Rendering

- Rendering expectations:
  cards should stay cheap to render as repeated list items
- Motion constraints:
  no decorative motion required
- Large-content or overflow considerations:
  longer summary copy should increase card height rather than clip; tag rows
  should wrap

## Adoption And Migration

- First consumers:
  `/design-system/templates/list-page`
- Existing local implementations to replace:
  repeated page-local card markup and page-local interaction hooks
- Migration risks:
  forcing parent layout and detail-panel behavior into the same child seam too
  early would make the API brittle
- Compatibility notes:
  keep parent-owned layout switching and detail placement outside this
  component for now

## Verification

- Unit or frontend tests:
  existing list-page Playwright coverage plus future child-focused visual proof
- Visual checks:
  default, selected, mapping-placeholder, missing-attribute fallback,
  half-page long-copy, mobile list states, normal/dark/desert theme states
- Responsive checks:
  full-width list-column behavior on desktop and mobile
- Accessibility checks:
  button semantics, keyboard activation, visible focus, selected-state
  expression

## Adoption And Extraction Readiness

- Component artifact promotion reason:
  the card seam is already repeated and stable enough to document even though
  the broader parent split-layout contract is still exploratory
- What still remains before shared code extraction?
  a second governed consumer before promotion to `system-ready`
- What is explicitly not blocked?
  documenting and beginning source-level hook extraction for the child seam now

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/list-record-card-component.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/list-record-card`
  `/design-system/canonical-renderings/list-record-card`
  `/design-system/canonical-renderings/list-record-card/:ref`
  `/design-system/components/list-record-card`
- Frontend docs update required:
  yes, when the child seam gets a public preview or shared application code
- Architecture-map update required:
  yes, when the component leaves design-system-only documentation
