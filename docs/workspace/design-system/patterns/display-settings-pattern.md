# Display Settings Pattern

## Scope

- Pattern name:
  `display-settings`
- Status:
  exploratory
- Owner:
  `/design-system`
- Related principle artifacts:
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`
- Related routes or consuming surfaces:
  `/design-system`; `rootAdminShell` remains a provisional follow-on consumer

## Intent

- What user or operator need does this pattern serve?
  Provide a governed set of display and reading controls that can be hosted in
  a signed-off `context-nav drawer` without inventing ad hoc preferences UI
  per surface.
- Why should this be reusable rather than page-local?
  Theme, magnification, accent, and direction controls share the same chip-row
  grammar and should not drift across shell consumers.

## Anatomy

- Required parts:
  section grouping, section title, chip-row controls, active-state feedback
- Optional parts:
  accent swatches, direction controls, explanatory copy
- Content expectations:
  controls must map to real preview or app behavior, not decorative toggles
- Layout structure:
  grouped control sections stacked inside a governed drawer shell

## States

- Default:
  one active option per control group
- Hover / pressed / focus:
  chip controls remain readable and visibly interactive
- Selected / active:
  chosen chip exposes active state through `aria-pressed`
- Disabled:
  not yet defined
- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  not yet defined
- Real interactive states:
  theme change, magnification change, accent change, direction change,
  preview-versus-app control-scope differences

## Variants

- Approved variants:
  design-system preview controls, real-app controls subset
- Variant purpose:
  keep `/design-system` fully expressive for review while allowing real apps to
  expose only their approved subset
- Variant limits:
  subset differences must be explicitly governed in the adoption artifact
- Forbidden variants:
  silent control removal without documentation, decorative chips with no real
  runtime effect

## Token Contract

- Color tokens:
  base shell and accent tokens
- Typography tokens:
  base shell type plus uppercase section eyebrow
- Spacing tokens:
  base spacing scale
- Radius / border tokens:
  `--radius-sm`
- Shadow / elevation tokens:
  none beyond the host drawer
- Motion tokens:
  none required yet
- Other dependencies:
  `--ui-scale`, `data-theme`, `dir`, accent variables

## Accessibility

- Semantic structure:
  grouped controls under clear headings
- Keyboard behavior:
  chips are directly focusable and activate with keyboard input
- Focus treatment:
  active and focused chips remain distinguishable
- Screen-reader expectations:
  control group purpose and selected state must be programmatically exposed
- Contrast or motion constraints:
  each theme option must keep controls readable in the resulting mode
- Localization / long-content concerns:
  labels may grow, but chip rows must not break the drawer shell

## Responsive Behavior

- Mobile behavior:
  controls stack inside the bottom-attached drawer sheet
- Tablet behavior:
  same grouped-controls grammar
- Desktop behavior:
  same grouped-controls grammar inside a side panel
- Overflow / wrapping expectations:
  chip rows may wrap; content remains inside the drawer body
- Shell attachment or floating expectations:
  owned by the drawer shell, not a floating standalone panel
- Width model:
  governed by the host drawer
- Alignment expectations with adjacent chrome when relevant:
  none beyond the host drawer

## Composition Rules

- Common parent contexts:
  display settings drawer, future governed user-preference surfaces
- Compatible neighboring patterns:
  `drawer`, `selection-list`
- Nesting guidance:
  host inside a drawer or other explicitly governed preference surface
- Browser-native affordance coexistence rules:
  changes to magnification or direction must not break neighboring shell
  affordances
- Misuse cases to avoid:
  shipping preview-only controls into app without approval, splitting one
  control family across unrelated local widgets

## Component Readiness

- Should this become a reusable component now?
  not yet
- If yes, proposed public API:
  not applicable yet
- If no, what must stabilize first?
  second-consumer proof and persistence expectations

## Adoption Plan

- First governed surface to adopt:
  `/design-system` as the payload review surface, then `rootAdminShell` with
  the narrower app subset once the payload loop is complete
- Existing pages that should migrate later:
  future governed preferences surfaces
- Partial-adoption note:
  `rootAdminShell` is still only a provisional follow-on note; `/design-system`
  currently keeps accent and direction for payload review while the app subset
  is still awaiting sign-off

## Verification

- Required screenshots or visual checks:
  active chip states, theme change, magnification change, preview-only accent
  and direction controls
- Accessibility verification:
  focusability, selected-state exposure, readable labels
- Responsive verification:
  chip wrapping and drawer-body stability under mobile widths
- Frontend quality-gate impact:
  covered through design-system audit and runtime browser proof

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/display-settings-pattern.md`
- Design-system route update required:
  no
- Architecture-map or guide updates required:
  no
- Follow-up component artifact:
  deferred until control persistence and second-consumer needs stabilize
