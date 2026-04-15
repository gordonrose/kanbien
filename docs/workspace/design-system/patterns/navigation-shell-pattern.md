# Navigation Shell Pattern

## Scope

- Pattern name:
  Navigation shell
- Status:
  active
- Owner:
  Codex with user sign-off
- Related principle artifacts:
  None yet. Create a navigation-shell principle note if future work changes the
  enduring shell rule across routes.
- Related routes or consuming surfaces:
  `/design-system`
  `rootAdminShell` target adoption

## Intent

- What user or operator need does this pattern serve?
  Provide a stable application header and companion navigation shell that can
  preserve orientation, reveal key destinations, and degrade gracefully across
  wide and narrow layouts.
- Why should this be reusable rather than page-local?
  The top navigation, overflow behavior, mobile menu, and account affordances
  are application-shell concerns that should remain consistent across operator
  surfaces rather than being reimplemented page by page.

## Anatomy

- Required parts:
  brand lockup, primary navigation region, responsive overflow behavior,
  utility region, mobile navigation trigger, mobile navigation surface
- Optional parts:
  profile menu trigger, profile menu actions, preference entry points such as
  language selection
- Content expectations:
  primary destinations must have concise labels; the active destination must be
  identifiable in both the full and overflow states; account actions should
  stay grouped in the utility region
- Layout structure:
  desktop layout uses a three-part shell with brand, primary navigation, and
  utilities; narrow layouts collapse primary navigation behind a mobile trigger
  and move account actions into the mobile navigation surface

## States

- Default:
  brand, primary navigation, and utility actions are visible with the current
  route highlighted
- Hover / pressed / focus:
  interactive items show consistent border and surface emphasis without
  shifting layout
- Selected / active:
  current route is visibly active and retains that state if moved into the
  overflow menu
- Disabled:
  not currently used in the design-system implementation
- Loading:
  not currently used in the design-system implementation
- Empty:
  not currently used; the shell assumes at least one navigable destination
- Success:
  not applicable
- Warning:
  not applicable
- Error:
  not currently represented; future app adoption should define degraded header
  behavior if navigation data fails
- Destructive:
  not applicable

## Variants

- Approved variants:
  full desktop navigation, overflowed desktop navigation, fully collapsed
  mobile navigation
- Variant purpose:
  preserve wayfinding while adapting to available width rather than relying on
  viewport breakpoints alone
- Variant limits:
  the pattern currently assumes one brand lockup, one primary destination set,
  and one utility group
- Forbidden variants:
  duplicate primary navigation in multiple visible regions, ad hoc utility
  actions inserted into the primary destination set, or page-local width hacks
  that bypass measured fit logic

## Token Contract

- Token candidacy review outcome:
  `docs/workspace/design-system/token-reviews/top-nav-token-candidacy-review.md`
- Color tokens:
  `--surface-1`, `--surface-2`, `--surface-3`, `--ink`, `--ink-soft`,
  `--line`, `--line-strong`, `--accent-soft`, `--accent-text`,
  `--nav-avatar-bg`
- Typography tokens:
  current shell inherits the frontend baseline font stack and uses existing
  font-weight conventions for current and prominent items
- Spacing tokens:
  current implementation uses shared base spacing decisions already present in
  `src/frontend/designSystem/assets/styles.css`; semantic shell spacing tokens
  were deferred by the token candidacy review until more than one extracted
  shell family proves the right naming
- Radius / border tokens:
  `--radius`, `--radius-sm`, `--line`, `--line-strong`
- Shadow / elevation tokens:
  `--shadow`
- Motion tokens:
  no dedicated motion token yet; interactions rely on minimal state changes
- Other dependencies:
  measured-fit overflow logic in
  `src/frontend/designSystem/assets/app.mjs`
  brand-mark size, shell grid geometry, and fit thresholds intentionally remain
  local to the primitive rather than becoming tokens

## Accessibility

- Semantic structure:
  brand link, primary `nav`, mobile `nav`, menu buttons, and menu containers
  with `aria-expanded` and `aria-controls`
- Keyboard behavior:
  triggers must be reachable by keyboard, `Escape` must close open surfaces,
  and focus should return to the invoking control for transient surfaces
- Focus treatment:
  visible border and surface emphasis on interactive controls; no focus trap is
  currently implemented because the menus are lightweight transient surfaces
- Screen-reader expectations:
  primary and mobile nav regions should be labeled; active route should be
  exposed consistently; menu triggers should report expansion state
- Contrast or motion constraints:
  hover and selected states must remain readable across normal, dark, and
  desert themes; avoid motion that disorients shell orientation
- Localization / long-content concerns:
  long labels are supported through measured overflow and mobile collapse;
  further localized shell adoption needs rendered checks for longer route names

## Responsive Behavior

- Mobile behavior:
  primary navigation hides, mobile trigger appears, and destinations plus
  account actions move into the mobile menu
- Tablet behavior:
  primary navigation may partially collapse into the overflow menu before the
  shell fully switches to the mobile navigation mode
- Desktop behavior:
  primary destinations remain inline when space permits, with overflow used
  when they no longer fit beside the utility region
- Overflow / wrapping expectations:
  destination wrapping is not allowed; measured-fit logic must either hide
  items into overflow or force the mobile navigation mode

## Composition Rules

- Common parent contexts:
  application shell header at the top of the route
- Compatible neighboring patterns:
  breadcrumb/search sub-nav, context navigation rail, profile menu, dialog
  launchers, accessibility or preferences surfaces
- Nesting guidance:
  utility actions can open menus or dialogs, but transport and persistence
  concerns should remain outside the shell pattern
- Misuse cases to avoid:
  page-specific controls masquerading as primary destinations, multiple
  independent overflow buttons, or shell actions that do not have a narrow
  ownership seam

## Component Readiness

- Should this become a reusable component now?
  Yes, as a draft reusable seam for real app adoption planning
- If yes, proposed public API:
  brand content, primary destination items, current destination key, utility
  actions, mobile menu sections, overflow button labels, and responsive mode
  hooks
- If no, what must stabilize first?
  Not applicable

## Adoption Plan

- First governed surface to adopt:
  `rootAdminShell`
- Existing pages that should migrate later:
  any future operator or tenant shells that currently duplicate header chrome
- Partial-adoption note:
  adopt the shell structure first, then migrate profile utilities and
  preference entry points as follow-up slices if needed

## Verification

- Required screenshots or visual checks:
  desktop full-width shell, desktop overflow state, narrow mobile shell, RTL
  desktop shell, RTL mobile shell, and magnified desktop shell
- Accessibility verification:
  keyboard access to mobile trigger, overflow button, and profile trigger;
  `Escape` close behavior; focus return for transient surfaces
- Responsive verification:
  confirm measured-fit overflow, mobile collapse, and non-overlapping utility
  alignment
- Frontend quality-gate impact:
  this pattern should become a gated shell primitive before real application
  adoption

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Design-system route update required:
  no immediate route edit required for this documentation-only step
- Architecture-map or guide updates required:
  not yet, beyond the workspace status note already in place
- Follow-up component artifact:
  `docs/workspace/design-system/components/top-nav-shell-component.md`
