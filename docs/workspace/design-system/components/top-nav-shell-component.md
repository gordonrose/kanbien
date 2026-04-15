# Top Nav Shell Component

## Scope

- Component name:
  `TopNavShell`
- Status:
  draft
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Consuming surfaces:
  planned for `rootAdminShell`

## Purpose

- What reusable job does this component perform?
  Render the application header shell with brand lockup, primary destinations,
  responsive overflow, mobile navigation access, and utility actions.
- Why is a shared implementation now justified?
  Header navigation is a cross-route shell concern with accessibility and
  responsive rules that are too important to duplicate loosely.

## Public API

- Inputs / props / attributes:
  brand content, primary items, current item key, utility action slot, profile
  action slot, overflow labels, mobile trigger label
- Required inputs:
  brand content, primary items, current item key
- Optional inputs:
  utility action slot, mobile profile section, overflow button copy
- Supported variants:
  standard shell, shell with overflow, shell in forced mobile mode
- Unsupported variants:
  multiple concurrent primary navigation groups, page-local ad hoc utilities
  inside the primary nav list
- Composition slots or extension points:
  utility slot for profile or preference launchers; mobile extras section for
  mirrored utility actions

## Behavior

- Default behavior:
  render primary destinations inline and keep the current destination visible
  when space permits
- Interactive states:
  open and close overflow, mobile navigation, and utility menus through the
  existing transient surface rules
- Loading / error / empty behavior:
  not yet implemented in the design-system prototype; define explicitly before
  production data-driven navigation is introduced
- Disabled or denied behavior:
  not currently modeled; permission-aware item hiding belongs to the consuming
  application layer

## Token Dependencies

- Token candidacy review outcome:
  `docs/workspace/design-system/token-reviews/top-nav-token-candidacy-review.md`
- Required semantic tokens:
  existing base tokens from `src/frontend/designSystem/assets/styles.css`:
  `--surface-1`, `--surface-2`, `--surface-3`, `--ink`, `--ink-soft`,
  `--line`, `--line-strong`, `--accent`, `--accent-soft`, `--accent-text`,
  `--shadow`, `--shadow-soft`, `--radius`, `--radius-sm`
- Tokens that must not be bypassed:
  shell surface, line, radius, shadow, and selected-state tokens
- Theming or state considerations:
  component must remain readable across normal, dark, and desert theme modes
  while keeping measured-fit geometry and shell thresholds local to the
  primitive rather than encoding them as tokens

## Accessibility Contract

- Semantics:
  expose primary and mobile navigation regions and labeled trigger buttons
- Keyboard interaction:
  keyboard access to all triggers, `Escape` close support, and return focus to
  invoking controls when surfaces close
- Focus behavior:
  preserve visible focus styling and prevent hidden controls from remaining in
  the tab order
- Announcements / labels:
  active destination and trigger purpose should remain programmatically clear
- Known constraints:
  current prototype has lightweight menu behavior rather than a fully trapped
  dialog-style model

## Performance And Rendering

- Rendering expectations:
  use measured-fit logic to prefer overflow before switching to mobile mode
- Motion constraints:
  avoid decorative motion in the application shell
- Large-content or overflow considerations:
  long labels should move into overflow or mobile mode instead of wrapping into
  overlapping layouts

## Adoption And Migration

- First consumers:
  `rootAdminShell`
- Existing local implementations to replace:
  current route-local root admin shell header once the seam is extracted
- Migration risks:
  route-local utility actions may not map cleanly to the shared utility slot on
  the first pass
- Compatibility notes:
  keep the utility and profile areas as extension points so shell adoption does
  not force premature preference implementation coupling

## Verification

- Unit or frontend tests:
  add after extraction into a real shared seam
- Visual checks:
  desktop, overflow, mobile, RTL, and magnified shell states
- Responsive checks:
  measured-fit overflow and mobile fallback
- Accessibility checks:
  keyboard trigger access, focus return, `aria-expanded`, and active-route
  semantics

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/top-nav-shell-component.md`
- Design-system route update required:
  no
- Frontend docs update required:
  yes, when the component leaves draft and is adopted by a real consumer
- Architecture-map update required:
  yes, when the shared component seam exists in application code
