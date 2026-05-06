# Build Work Panel Pattern

## Scope

- Pattern name:
  `build-work-panel`
- Status:
  signed-off pattern
- Owner:
  `/design-system`
- Related principle artifacts:
  `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md`
- Related routes or consuming surfaces:
  signed-off review surface at `/design-system/patterns/build-work-panel-demo`;
  canonical render surface at
  `/design-system/canonical-renderings/build-work-panel/BWP-R-002`; future
  root-admin shell adoption

## Intent

- What user or operator need does this pattern serve?
  Give builders a persistent, contextual place to start Layer 1 Product
  Discovery from inside the app without leaving the page they are inspecting.
- Why should this be reusable rather than page-local?
  Reporting, Support, and Build are cross-page actions. The panel's launcher,
  page-specific right-side icon toolbar, collapsible conversation-history lane, responsive
  behavior, chat history, inactive-action posture, and export action should be
  governed once rather than recreated per page.

## Anatomy

- Required parts:
  launcher, panel surface, page-specific right-side icon toolbar, active Build
  state, inactive Reporting and Support states, collapsible
  conversation-history lane, chat
  transcript, message composer, status area, packet download action, close
  control.
- Optional parts:
  history filter, packet superseded marker, retry action, preview-only
  design-system controls.
- Content expectations:
  Keep copy task-oriented and concrete. The panel should help the builder start
  or resume discovery, not explain the implementation harness.
- Layout structure:
  Desktop and wide tablet layouts use a right-side shell-attached panel.
  Mobile layouts use a floating launcher that opens a governed mobile panel.

## States

- Default:
  panel closed with work-panel launcher visible.
- Hover / pressed / focus:
  launcher, right-side icon toolbar controls, history toggle, composer controls,
  download action, and close control keep visible focus and pressed states.
- Selected / active:
  Build is active; Reporting and Support are inactive for MVP.
- Disabled:
  Reporting and Support use an inactive/coming-soon treatment.
- Loading:
  chat response pending and packet generation pending states must be visible.
- Empty:
  empty chat with a concise harness opening message.
- Success:
  packet generated and download action available.
- Warning:
  superseded packet or draft status when needed by packet lifecycle planning.
- Error:
  failed response, failed packet generation, or unavailable harness state.
- Destructive:
  not applicable for MVP.
- Real interactive states:
  open panel, close panel, mobile floating action, right-side icon toolbar,
  conversation-history expanded/collapsed, active chat, typed message, packet
  available, denied state, failed generation, RTL, dark theme, magnification,
  long labels.

## Variants

- Approved variants:
  desktop right-side work panel, mobile floating-action panel, inactive action
  state, Build chat active state.
- Variant purpose:
  Support the same product action across desktop and mobile while preserving
  app page context.
- Variant limits:
  Reporting and Support may be shown but not activated in the MVP. Tenant
  builder scope is future work and must not leak into first adoption.
- Forbidden variants:
  page-local CSS implementation, copied root-admin-only markup, public packet
  links, inline PDF preview, hidden history, action controls placed as chat
  tabs, and large starter prompt buttons that make the chat feel like a form.

## Token Contract

- Color tokens:
  existing shell surface, line, ink, muted ink, accent, success, warning, and
  danger tokens only until rendered review proves a new semantic need.
- Typography tokens:
  existing shell and compact-panel type scale; no hero-scale text inside the
  panel.
- Spacing tokens:
  existing shell spacing scale with stable composer and action-control
  dimensions.
- Radius / border tokens:
  existing shell radius and border tokens.
- Shadow / elevation tokens:
  existing drawer or overlay elevation token.
- Motion tokens:
  no motion required for correctness; any future motion must respect reduced
  motion.
- Other dependencies:
  context-nav/page-shell attachment variables if the panel is mounted as shell
  chrome.

## Accessibility

- Semantic structure:
  labelled complementary or dialog-like work surface depending on final
  attachment model; action list uses button semantics; chat transcript exposes
  readable message grouping.
- Keyboard behavior:
  open from launcher, move through the right-side icon toolbar, history toggle,
  conversation history, transcript, composer, packet action, and close control;
  close with `Escape`; return focus to launcher.
- Focus treatment:
  visible focus on all controls in every approved theme.
- Screen-reader expectations:
  panel title, active action, inactive action status, chat message authors,
  packet status, and download availability must be named.
- Contrast or motion constraints:
  WCAG 2.2 AA contrast for text and non-text controls; motion is optional and
  must be reducible.
- Localization / long-content concerns:
  long page, module, role, action, and packet titles must wrap without
  overlapping the composer or close controls. RTL must mirror panel attachment
  and reading order.

## Responsive Behavior

- Mobile behavior:
  floating action remains reachable and opens a governed panel with stable
  close and focus return.
- Tablet behavior:
  may use desktop panel if width allows; otherwise use mobile panel.
- Desktop behavior:
  right-side panel overlays the page content without permanent reflow.
- Overflow / wrapping expectations:
  transcript scrolls inside the panel; composer and close controls remain
  reachable.
- Shell attachment or floating expectations:
  shell-attached on desktop, floating launcher on mobile.
- Width model:
  intentionally contained on desktop; full-width or lane-based mobile panel.
- Alignment expectations with adjacent chrome when relevant:
  align to shell gutters and avoid overlapping top-nav, context-nav, or bottom
  mobile chrome.

## Composition Rules

- Common parent contexts:
  root-admin shell first; future app shells only after separate adoption review.
- Compatible neighboring patterns:
  drawer, context-nav, page shell, async activity drawer, action buttons, chat
  transcript, compact status banners.
- Nesting guidance:
  do not place cards inside cards; repeated message rows may use compact
  message surfaces but should not become nested panels.
- Browser-native affordance coexistence rules:
  text inputs and textareas must keep native editing affordances visible and
  must not be blocked by floating controls.
- Misuse cases to avoid:
  wizard-only flow that blocks free chat, marketing-style hero content,
  root-admin-local implementation, hidden denied states, and PDF links that
  bypass authorization.

## Component Readiness

- Should this become a reusable component now?
  The shared design-system renderer/controller seam now exists at
  `/design-system/assets/conversationPanel.mjs`, with the Build-specific
  configured canonical render routes under
  `/design-system/canonical-renderings/build-work-panel/*`. The legacy
  `/design-system/assets/buildWorkPanel.mjs` wrapper remains only for
  compatibility. It is still not app-adoption complete until the
  real Layer 1/harness API boundary is connected and verified.
- If yes, proposed public API:
  `renderConversationPanel(root, { config, ref, messages, history })`,
  `createConversationPanelController(root, { config, ref, messages, history,
  handlers })`, and `createBuildConversationPanelConfig(overrides)`.
  Handlers cover send, mode select, panel/history/tools open changes, packet
  download, copy, edit, reply, and composer tool actions.
- If no, what must stabilize first?
  live data/API boundaries. Full Playwright canonical coverage now exists for
  `BWP-R-001` through `BWP-R-020`, the neutral app-consumable style entrypoint
  is `/design-system/assets/conversationPanel.css`, and root-admin UI-only
  parity now consumes the shared seam.

## Adoption Plan

- First governed surface to adopt:
  root-admin shell Build panel.
- Existing pages that should migrate later:
  none in MVP.
- Partial-adoption note:
  root-admin UI-only adoption now exists with temporary local handlers. Real
  Layer 1/harness integration, persisted history, and permission-backed packet
  download remain downstream; Reporting and Support remain inactive actions.

## Verification

- Required screenshots or visual checks:
  desktop closed/open, active chat, conversation-history expanded/collapsed,
  packet download journey, failure, denied, mobile closed/open, RTL, dark theme
  with magnification.
- Accessibility verification:
  keyboard open/close, focus return, screen-reader labels, focus visibility,
  denied-state clarity.
- Responsive verification:
  desktop, tablet threshold, mobile floating launcher, mobile panel, long
  content, no text overlap.
- Frontend quality-gate impact:
  add visual/browser scenarios and canonical states before app adoption.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/build-work-panel-pattern.md`
- Design-system route update required:
  yes, before signoff.
- Architecture-map or guide updates required:
  not yet; revisit after the first app consumer proves the shared seam.
- Follow-up component artifact:
  required only if the pattern is promoted beyond the current configured
  conversation-panel seam.
