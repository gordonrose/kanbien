# Page-Shell Banner Component

## Scope

- Component name:
  `PageShellBanner`
- Status:
  draft
- Owner:
  Codex with user sign-off
- Source pattern artifact:
  `docs/workspace/design-system/patterns/page-shell-banner-pattern.md`
- Consuming surfaces:
  `/design-system/templates/page-shell`
  `/design-system/components/page-shell-banner`
  `rootAdminShell`
- Shared implementation seam:
  `src/frontend/designSystem/assets/pageShellBanner.mjs`

## Purpose

- What reusable job does this component perform?
  Render governed shell feedback banners with the signed-off tone grammar,
  close affordance, spacing contract, and controller behavior for both
  design-system review surfaces and real shell consumers.
- Why is a shared implementation now justified?
  The banner family is signed off upstream and now adopted in `rootAdminShell`,
  so leaving the render and interaction seam implicit would create more drift
  risk than documenting the shared API.

## Public API

- Inputs / props / attributes:
  banner host element, `ariaLabel`, demo visibility state, visible banner IDs,
  runtime `message`, optional runtime `title`, `tone`, optional
  `autoDismissMs`, and dismiss-label copy
- Required inputs:
  host element and banner message content for runtime usage
- Optional inputs:
  title, explicit visible card IDs for canonical/demo states, and explicit
  auto-dismiss override
- Shared controller methods:
  `createPageShellBannerController(...)`
  `createPageShellBannerRuntimeController(...)`
  `resolvePageShellBannerRuntimePolicy(...)`
  `renderPageShellBannerStack(...)`
- Supported variants:
  informational, success, warning, and danger banner states; review-stack demo
  mode; single-runtime-banner mode
- Unsupported variants:
  app-local banner markup forks, hidden close controls, queued toast centers,
  and arbitrary page-body banner restyling

## Behavior

- Default behavior:
  render banners in a shell-owned zone above page content with visible spacing
  beneath the zone
- Interactive states:
  every rendered banner exposes a visible dismiss `X`; demo/canonical states
  support state-local dismissal; runtime state supports one active banner at a
  time through the shared controller
- Runtime lifecycle currently implemented:
  `rootAdminShell` uses page-scoped banners that clear on navigation, auto-
  dismiss `info` and `success` after a short interval, and keep `warning` and
  `danger` visible until dismissed or replaced
- Runtime display policy currently implemented:
  routine navigation, open-state, cancellation, and successful search-refresh
  events stay quiet; blocked actions surface as warnings; errors surface as
  danger banners; success banners are reserved for real mutations
- Runtime policy matrix exposed by the shared seam:
  `informational`, `mutation-success`, `blocked-action`, and `error`; the
  current `rootAdminShell` adoption intentionally allows only
  `mutation-success`, `blocked-action`, and `error`
- Loading / error / empty behavior:
  empty host remains hidden; danger banners use assertive announcement posture
  while non-danger banners use polite status announcements
- Disabled or denied behavior:
  not currently modeled at the component seam; permission-aware trigger logic
  remains consumer-owned

## Token Dependencies

- Token candidacy review outcome:
  no dedicated token review yet; current dependency is the shared shell token
  set in `src/frontend/designSystem/assets/styles.css`
- Required semantic tokens:
  `--surface-1`, `--line`, `--ink`, `--ink-soft`, `--accent-soft`,
  `--radius-sm`
- Tokens that must not be bypassed:
  banner spacing, tone styling, dismiss button sizing, and shell feedback
  posture
- Theming or state considerations:
  tone treatment and readable contrast remain owned by the shared design-system
  stylesheet rather than consumer-local CSS

## Accessibility Contract

- Semantics:
  runtime danger banners announce as `alert`; other runtime banners announce as
  `status`; dismiss controls remain directly focusable
- Keyboard interaction:
  dismiss controls must be operable by keyboard without changing banner
  geometry
- Focus behavior:
  focus-visible styling remains on the shared close control
- Announcements / labels:
  host labels are consumer-supplied through `ariaLabel`; dismiss buttons keep
  the named dismiss affordance
- Known constraints:
  the current runtime controller intentionally supports one active banner at a
  time; richer queueing or action-button behavior is still out of scope

## Performance And Rendering

- Rendering expectations:
  keep banner render logic lightweight and localized to the host element
- Motion constraints:
  no decorative motion required for the current governed pass
- Large-content or overflow considerations:
  body copy may wrap, but the dismiss control must remain visible and the
  page-content spacing must remain intact

## Adoption And Migration

- First consumers:
  design-system review surfaces and `rootAdminShell`
- Existing local implementations replaced:
  the old raw `#shell-message` strip in `rootAdminShell`
- Migration risks:
  future consumers may want stacking, actions, or persistence models that do
  not belong in the first shared API
- Compatibility notes:
  preserve the signed-off tone grammar and the root-admin lifecycle policy
  until a second consumer justifies broader API expansion

## Verification

- Unit or frontend tests:
  `tests/visual/designSystem/canonicals/shell/pageShellBannerDemo.spec.ts`
  `tests/visual/designSystem/canonicals/shell/pageShellBannerCanonical.spec.ts`
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`
  `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`
  `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
- Visual checks:
  full four-state stack, single-state variants, partial stack after dismiss,
  real-shell spacing, visible dismiss affordance, and navigation clear
- Responsive checks:
  inherited shell spacing and banner visibility on the real app shell
- Accessibility checks:
  named dismiss control, polite/assertive runtime announcements, and keyboard
  dismiss reachability

## Adoption And Extraction Readiness

- Component artifact promotion reason:
  the banner family now has a real shared implementation seam and an adopted
  first consumer in `rootAdminShell`
- What still remains before wider reuse?
  prove the same runtime API in at least one additional governed shell
  consumer before broadening the contract
- What is explicitly not blocked?
  continued use of the shared seam in the current first consumer

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/components/page-shell-banner-component.md`
- Design-system route update required:
  no
- Frontend docs update required:
  yes, when the component leaves draft or the runtime API broadens
- Architecture-map update required:
  yes, if another governed app shell adopts the same runtime seam
