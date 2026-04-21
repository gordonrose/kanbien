# Drawer Pattern

## Scope

- Pattern name:
  `drawer`
- Status:
  active
- Owner:
  `/design-system`
- Related principle artifacts:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- Related routes or consuming surfaces:
  `/design-system`, `rootAdminShell`

## Intent

- What user or operator need does this pattern serve?
  Provide a governed transient side-panel or bottom-attached sheet for shell
  workflows that need more space than a menu but must remain attached to the
  chrome that launched them.
- Why should this be reusable rather than page-local?
  Drawer attachment, close behavior, layering, focus return, and close-control
  grammar are shared shell concerns and should not be reinvented per surface.

## Anatomy

- Required parts:
  launch control, attached drawer surface, header, title, close control, body
  content area
- Optional parts:
  eyebrow, secondary sibling drawer, grouped sections, selection controls
- Content expectations:
  keep content scoped to the launcher’s governed workflow; do not treat the
  drawer as a catch-all page or settings destination
- Layout structure:
  desktop uses a shell-attached side panel adjacent to the launching rail;
  mobile uses a bottom-attached sheet that fills the lane down to the top edge
  of the bottom bar

## States

- Default:
  closed
- Hover / pressed / focus:
  launcher and close control keep the governed shell-button grammar
- Selected / active:
  launcher reflects open state through `aria-expanded`
- Disabled:
  not yet defined
- Loading:
  allowed when the content itself needs it, but the drawer shell must still
  open and close truthfully
- Empty:
  allowed for placeholder or guidance-only content
- Error:
  content errors must not detach or reposition the drawer shell
- Real interactive states:
  open drawer, close on outside click, close on `Escape`, focus return to the
  trigger, mobile bottom attachment, RTL anchoring, sibling-drawer coexistence

## Variants

- Approved variants:
  shell-attached desktop drawer, mobile bottom-attached sheet, sibling
  secondary drawer, context-nav drawer, filter drawer
- Variant purpose:
  support richer transient workflows while keeping attachment and close rules
  consistent
- Variant limits:
  drawers may differ in content, but not in close-control grammar, focus
  return, or attachment model
- Forbidden variants:
  floating detached card treatment, mobile spare-space gap beneath the sheet,
  browser-default typographic `X` close controls

## Token Contract

- Color tokens:
  `--surface-1`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-soft`, `--accent-soft`, `--accent-text`
- Typography tokens:
  base shell type plus uppercase eyebrow styling where used
- Spacing tokens:
  base spacing scale only; drawer insets remain structural, not tokenized
- Radius / border tokens:
  `--radius`, `--radius-sm`
- Shadow / elevation tokens:
  `--shadow-soft`
- Motion tokens:
  none required yet
- Other dependencies:
  `--context-nav-top`, `--context-nav-rail-width`,
  `--context-nav-mobile-height`

## Accessibility

- Semantic structure:
  use an explicitly labelled region or complementary surface with a heading and
  a named close control
- Keyboard behavior:
  open from the launcher, close with `Escape`, allow close-button entry, and
  return focus to the triggering control
- Focus treatment:
  visible focus on launcher, close control, and first interactive content
- Screen-reader expectations:
  launcher name and drawer title must make the drawer purpose explicit
- Contrast or motion constraints:
  theme changes must preserve readability; motion is not required for
  correctness
- Localization / long-content concerns:
  RTL must mirror attachment; longer titles and body copy must wrap without
  breaking the shell attachment

## Responsive Behavior

- Mobile behavior:
  drawer becomes a bottom-attached sheet filling the lane down to the top edge
  of the bottom bar
- Tablet behavior:
  keep the desktop side-panel model while width fits
- Desktop behavior:
  drawer stays attached to the launching shell seam and layers above adjacent
  chrome
- Overflow / wrapping expectations:
  drawer content may scroll internally; drawer shell must remain attached
- Shell attachment or floating expectations:
  always shell-attached for this family
- Width model:
  intentionally contained on desktop, full-lane on mobile
- Alignment expectations with adjacent chrome when relevant:
  align to the measured header bottom and the launching rail or bar

## Composition Rules

- Common parent contexts:
  `context-nav`, future shell utilities, governed filter workflows
- Compatible neighboring patterns:
  `context-nav`, `menu`, `search-shell`, `selection-list`
- Nesting guidance:
  a sibling secondary drawer is allowed only when the workflow is explicitly
  governed, as with filter options
- Browser-native affordance coexistence rules:
  do not let browser-native search affordances or focus rings hide close or
  launcher controls
- Misuse cases to avoid:
  page-local preferences dumping ground, detached modal replacement, mixed
  close-button grammars

## Component Readiness

- Should this become a reusable component now?
  yes, as a shared shell-attached drawer primitive after a second real consumer
- If yes, proposed public API:
  launcher ownership, title, optional eyebrow, placement mode, secondary-drawer
  support, and close callbacks
- If no, what must stabilize first?
  second-consumer proof beyond `rootAdminShell`

## Adoption Plan

- First governed surface to adopt:
  `rootAdminShell` context-nav drawer shell launched from `context-nav`
- Existing pages that should migrate later:
  governed filter and preference surfaces
- Partial-adoption note:
  root-admin first adopts the drawer shell with a display-settings
  payload, while the broader drawer primitive remains governed through
  `/design-system`

## Verification

- Required screenshots or visual checks:
  desktop drawer open, mobile bottom attachment, close-control grammar, RTL
  desktop anchoring, focus-return runtime proof
- Accessibility verification:
  `Escape`, outside click, close button, and focus return
- Responsive verification:
  desktop side panel and mobile bottom-attached sheet
- Frontend quality-gate impact:
  covered through design-system and root-admin browser checks

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/drawer-pattern.md`
- Design-system route update required:
  no
- Architecture-map or guide updates required:
  no
- Follow-up component artifact:
  deferred until second-consumer confirmation
