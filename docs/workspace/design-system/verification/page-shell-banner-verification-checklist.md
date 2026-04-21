# Page-Shell Banner Verification Checklist

## Scope

- Artifact name:
  Page-shell banner
- Surface:
  `/design-system/templates/page-shell`
- Status under review:
  signed-off template-hosted baseline
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/page-shell-banner-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/page-shell-banner-component.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/page-shell-banner-reference-pack.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-shell-page-shell-banner-adoption-contract.md`
- Related canonical launcher:
  `/design-system/canonicals/page-shell-banner`
- Related canonical render surface:
  `/design-system/components/page-shell-banner`

## Visual Contract

- One-sentence rule:
  The page shell must be able to reveal dismissible banner states above the
  page content, preserve breathing room beneath the stack, and keep each
  banner independently closable.
- Trigger for this review:
  replace the stale, non-dismissible shell-message posture with an upstream
  governed shell-banner baseline before `rootAdminShell` adoption work
- What changed since the last review:
  the banner family now runs through a shared render/controller seam, has a
  dedicated component artifact, and is adopted in `rootAdminShell` with the
  first runtime lifecycle policy

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/templates/page-shell/index.html`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/pageShellBanner.mjs`
  `src/frontend/rootAdminShell/assets/app.mjs`
  `src/frontend/rootAdminShell/index.html`
- Implementation updated:
  yes
- Known source-level risks:
  wider multi-consumer runtime policy is still based on one real shell
  consumer

## Rendered Verification

- Required viewports checked:
  desktop template-hosted review surface and desktop root-admin shell
- Required direction states checked:
  not yet separated for this first pass
- Required theme states checked:
  base theme through the signed-off review pass
- Required magnification states checked:
  not yet separately promoted for this family
- Real interactive states checked:
  `Show banners`, `Hide banners`, dismissing an individual banner, root-admin
  close control visibility, and navigation clear behavior
- Layout or spacing checks:
  required; the banner stack must preserve visible separation from the page
  content below
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/shell/pageShellBannerCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/shell/pageShellBannerDemo.spec.ts`
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`

## Accessibility Verification

- Keyboard flow:
  dismiss controls must be directly focusable
- Programmatic selected state:
  the display-settings show/hide controls must expose state through
  `aria-pressed`
- Screen-reader naming and labeling:
  banner dismiss controls must remain named
- Contrast and readability:
  approved tones must stay readable
- Localization or long-content concerns:
  still a follow-up item for broader multi-consumer reuse

## State Coverage

- Default:
  hidden banner zone
- Hover / pressed / focus:
  close button focus and interaction required
- Selected / active:
  show/hide drawer controls
- Disabled:
  not applicable
- Loading:
  not applicable
- Empty:
  banner zone hidden
- Success:
  covered
- Warning:
  covered
- Error:
  covered
- Informational:
  covered

## Quality Gate Outcome

- Implementation status:
  banner seam exists and is adopted in `rootAdminShell`
- Rendered status:
  browser-checked for show, hide, spacing, dismiss behavior, and root-admin
  navigation-clear behavior
- Human sign-off status:
  approved
- Promotion decision:
  signed off as a design-system pattern baseline and implemented in the first
  real governed consumer
- Open follow-ups:
  validate the same runtime seam in a second governed consumer before
  broadening the shared API

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/page-shell-banner-verification-checklist.md`
- Design-system route update required:
  yes; dedicated launcher and render routes now exist for direct canonical
  review
- Frontend gate manifest update required:
  no
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  yes; the shared seam and downstream adoption contract now exist, but
  `rootAdminShell` parity implementation and proof are still outstanding
