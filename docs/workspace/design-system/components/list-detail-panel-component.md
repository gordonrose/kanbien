# List Detail Panel Component

## Scope

- Component name:
  `ListDetailPanel`
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/list-detail-panel-pattern.md`
- Consuming surfaces:
  `/design-system/templates/list-page`
  `/design-system/canonicals/list-detail-panel`
  `/design-system/components/list-detail-panel`

## Purpose

- What reusable job does this component perform?
  Render an open record-detail surface with header actions, readable body
  content, and simple previous/next traversal controls.
- Why is a shared implementation now justified?
  The current `List Page` detail surface already has stable anatomy and several
  governed states, while parent-owned shell placement still needs to stay
  separate.

## Public API

- Inputs / props / attributes:
  title, subtitle, meta, body, tag list, local error visibility, action label
  set, previous enabled, next enabled, optional next-terminal hint
- Required inputs:
  title, body
- Optional inputs:
  subtitle, meta, tags, local error state, previous enabled, next enabled,
  next-terminal hint
- Supported variants:
  baseline populated panel, missing-secondary-fields panel, local error panel,
  terminal-footer panel
- Unsupported variants:
  embedded list column, shell-level overlay framing, parent selection state,
  mobile modal semantics
- Composition slots or extension points:
  parent-owned action handlers, close handler, and record-traversal handlers

## Behavior

- Default behavior:
  render an open detail surface with readable header, body, and footer zones
- Interactive states:
  header actions and footer traversal stay keyboard reachable; next-terminal
  state may disable the next button while still exposing a hint
- Loading / error / empty behavior:
  local error state is modeled; loading and empty remain parent-owned for now
- Disabled or denied behavior:
  previous and next buttons may disable independently

## Token Dependencies

- Required semantic tokens:
  existing base tokens only:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--accent-soft`, `--radius`, `--radius-sm`, `--shadow-soft`
- Tokens that must not be bypassed:
  shared surface, border, focus, and text-color tokens
- Theming or state considerations:
  action, footer, and close controls must inherit the shared theme system
  without family-local overrides

## Accessibility Contract

- Semantics:
  preserve a labelled detail region and an explicitly named close control
- Keyboard interaction:
  action and footer controls use native `button` behavior
- Focus behavior:
  focus-visible state must remain clear on action, close, and footer controls
- Announcements / labels:
  title labels the region; action and footer controls keep explicit labels
- Known constraints:
  parent template still owns dialog-vs-region semantics for mobile overlay mode

## Performance And Rendering

- Rendering expectations:
  component should stay cheap enough for repeated preview and design-system
  review use
- Motion constraints:
  no decorative motion required
- Large-content or overflow considerations:
  body scrolls internally while title and description remain wrapped; metadata
  may truncate with tooltip recovery

## Adoption And Migration

- First consumers:
  `/design-system/templates/list-page`
- Existing local implementations to replace:
  current page-local detail markup and detail-state rendering inside the parent
  template
- Migration risks:
  freezing shell placement or mobile modal behavior into the child seam too
  early would make the API brittle
- Compatibility notes:
  keep desktop/mobile placement, overlay stacking, and selection choreography
  outside this component for now

## Verification

- Unit or frontend tests:
  existing `list-page` Playwright coverage plus dedicated child canonical proof
- Visual checks:
  baseline, missing-secondary-fields, local error, terminal footer, half-page
  long-content, mobile narrow, RTL, magnified, and focus-entry states
- Responsive checks:
  half-page and mobile internal layout review
- Accessibility checks:
  labelled region, close naming, button semantics, visible focus

## Adoption And Extraction Readiness

- Component artifact promotion reason:
  the panel seam already has durable header/body/footer anatomy and a stable
  local-error posture in the parent template
- What still remains before shared code extraction?
  a second governed consumer before promotion to `system-ready`
- What is explicitly not blocked?
  documenting the seam and beginning source-level hook extraction for the
  child seam now

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/list-detail-panel-component.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/list-detail-panel`
  `/design-system/components/list-detail-panel`
- Frontend docs update required:
  yes, when the child seam gets shared application code
- Architecture-map update required:
  yes, when the component leaves design-system-only documentation
