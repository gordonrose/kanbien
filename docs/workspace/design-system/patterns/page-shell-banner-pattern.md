# Page-Shell Banner Pattern

## Scope

- Pattern name:
  `page-shell-banner`
- Status:
  signed-off on the template-hosted `/design-system` review surface
- Owner:
  `/design-system`
- Related principle artifacts:
  `docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md`
- Related component artifact:
  `docs/workspace/design-system/components/page-shell-banner-component.md`
- Related routes or consuming surfaces:
  `/design-system/templates/page-shell`
  `rootAdminShell`

## Intent

- What user or operator need does this pattern serve?
  Provide governed shell-level feedback that sits above page content, remains
  dismissible, and communicates common message severity without being rebuilt
  route by route.
- Why should this be reusable rather than page-local?
  Banner behavior is a shell concern: spacing, dismissal grammar, message
  prominence, and state presentation should not drift between pages inside the
  same governed shell family.

## Anatomy

- Required parts:
  shell-owned banner zone, message container, tone treatment, visible dismiss
  control
- Optional parts:
  message title, supportive body copy, future secondary action
- Content expectations:
  copy should be short, stateful, and relevant to the page or shell context
  without becoming long-form content
- Layout structure:
  banners stack above the page content region with explicit breathing room
  below the stack so the page header remains readable

## States

- Default:
  no banner is visible until a governed launcher or runtime event reveals one
- Hover / pressed / focus:
  dismiss controls remain visible and clearly interactive
- Selected / active:
  not applicable
- Disabled:
  not currently modeled
- Loading:
  not currently modeled
- Empty:
  hidden banner zone
- Success:
  positive confirmation state
- Warning:
  cautionary but non-fatal state
- Error:
  danger/error state
- Informational:
  neutral guidance state

## Variants

- Approved variants:
  informational, success, warning, danger
- Variant purpose:
  give future shell consumers a stable first-pass tone grammar
- Variant limits:
  current sign-off covers one dismissible stack inside the page shell, not
  persistent global notification centers or queued toast systems
- Forbidden variants:
  banners with no visible dismiss control, banners welded directly to page
  content, or page-local restyling presented as shell adoption

## Token Contract

- Color tokens:
  current shell surface, line, ink, accent-soft, and tone-specific message
  colors
- Typography tokens:
  shared shell type scale for title and body text
- Spacing tokens:
  current shell spacing scale; the banner stack must preserve vertical space
  below itself
- Radius / border tokens:
  `--radius-sm`, `--line`
- Shadow / elevation tokens:
  none required in the current signed-off pass
- Motion tokens:
  none required yet
- Other dependencies:
  shell chrome spacing, accessible close button sizing

## Accessibility

- Semantic structure:
  each banner should remain readable as a coherent status message with named
  text and a clear dismiss affordance
- Keyboard behavior:
  dismiss controls must be directly focusable and operable by keyboard
- Focus treatment:
  dismiss control focus must remain visible without changing banner geometry
- Screen-reader expectations:
  banner content should be exposed as shell feedback rather than decorative
  copy; the shared runtime controller now uses polite `status` announcements
  for non-danger tones and assertive `alert` announcements for danger
- Contrast or motion constraints:
  all approved tones must remain readable against their background treatments
- Localization / long-content concerns:
  longer copy must wrap within the banner body without collapsing the close
  affordance or crushing the stack

## Responsive Behavior

- Mobile behavior:
  banner stack remains above page content and below shell chrome with the same
  dismiss grammar
- Tablet behavior:
  stacked banner zone remains readable and separated from the page body
- Desktop behavior:
  full stack remains visibly separate from the page header and content region
- Overflow / wrapping expectations:
  body copy may wrap, but the close control must remain visible and the stack
  spacing must stay intact
- Shell attachment or floating expectations:
  attached to the governed page shell rather than floating independently over
  the whole viewport
- Width model:
  inherits the page-shell content width

## Composition Rules

- Common parent contexts:
  governed page-shell template and future governed app shells
- Compatible neighboring patterns:
  top-nav, sub-nav row, context-nav, display settings
- Nesting guidance:
  banners belong in the shell feedback zone above page content, not inside
  individual cards or page-body sections when the intent is shell-level
  feedback
- Browser-native affordance coexistence rules:
  dismiss controls should not rely on browser-native close affordances or
  title-based tooltips
- Misuse cases to avoid:
  storing stale messages indefinitely in shared shell state, omitting dismissal
  controls, or using banners as a substitute for page content

## Component Readiness

- Should this become a reusable component now?
  Yes; a shared page-shell render/controller seam now exists
- If yes, proposed public API:
  tone, optional title, message body, dismissible close control, runtime
  `show` / `clear`, and demo/canonical stack control

## Adoption Plan

- First governed surface to adopt:
  `/design-system/templates/page-shell`
- Existing pages that should migrate later:
  future governed authenticated shells beyond `rootAdminShell`
- Partial-adoption note:
  `rootAdminShell` is now the first real consumer; wider multi-shell reuse
  still needs a second governed consumer before the runtime API broadens

## Verification

- Required screenshots or visual checks:
  stacked state batch, dismiss controls, spacing beneath the stack, and
  post-dismiss remaining-state stability
- Accessibility verification:
  keyboard reachability and visible focus on dismiss controls
- Responsive verification:
  banner stack remains readable without crushing page content
- Frontend quality-gate impact:
  dedicated visual shell tests cover the template-hosted demo, dedicated
  canonical surface, and the first real `rootAdminShell` consumer

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/patterns/page-shell-banner-pattern.md`
- Design-system route update required:
  no new route; the signed-off review surface is the existing
  `/design-system/templates/page-shell`
- Architecture-map or guide updates required:
  not yet
- Follow-up component artifact:
  `docs/workspace/design-system/components/page-shell-banner-component.md`
