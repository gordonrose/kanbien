# Canonical Render Page Verification Checklist

## Scope

- Artifact name:
  Canonical render page
- Surface:
  `/design-system/templates/canonical-render-page`
- Status under review:
  system-ready template-hosted baseline
- Related template artifact:
  `docs/workspace/design-system/templates/canonical-render-page-template.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/canonical-render-page-reference-pack.md`
- Related executable proof:
  `tests/visual/designSystem/templates/canonicalRenderPage.spec.ts`

## Visual Contract

- One-sentence rule:
  The canonical render page should let reviewers swap between real governed
  pattern surfaces inside one focused lane without adding extra specimen-summary
  chrome ahead of the actual surface.
- Trigger for this review:
  promote the simplified selector-driven render host into a reusable,
  locked-in baseline with upstream design-system artifacts
- What changed since the last review:
  the page now mounts real governed pattern hosts, removed the proxy copy-only
  lane, dropped redundant specimen header/status chrome, and removed the outer
  panel wrapper ahead of the selected surface

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/templates/canonical-render-page/index.html`
  `src/frontend/designSystem/assets/canonicalRenderPageTemplate.mjs`
  `src/frontend/designSystem/assets/pageShellController.mjs`
  `src/frontend/designSystem/assets/styles.css`
- Implementation updated:
  yes
- Known source-level risks:
  the current automated proof covers the selected swap contract rather than a
  full matrix of viewport, state, and every family option

## Rendered Verification

- Required viewports checked:
  default desktop template-hosted surface
- Required direction states checked:
  selector plumbing remains compatible with direction controls, but the locked
  proof does not yet split out a dedicated RTL assertion for this template
- Required theme states checked:
  dark and desert render theme controls are now checked for containment:
  theme scope must land on the specimen lane and must not affect the document,
  top nav, or canonical render intro chrome
- Required magnification states checked:
  not separately promoted in the current baseline
- Real interactive states checked:
  render drawer open, pattern dropdown visible, `list-detail-panel` selection,
  `breadcrumb` selection with search-shell suppression, and local render theme
  switching without page-chrome theme leakage
- Layout or spacing checks:
  required; the render lane must enter the governed pattern directly without a
  redundant outer panel-card wrapper or top specimen header copy
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/templates/canonicalRenderPage.spec.ts`

## Accessibility Verification

- Keyboard flow:
  render drawer controls remain keyboard reachable and the native pattern
  select remains operable
- Programmatic selected state:
  the native select value reflects the active specimen family
- Screen-reader naming and labeling:
  the pattern select remains explicitly labelled and the hosted pattern
  surfaces keep their own native semantics
- Contrast and readability:
  relies on the existing governed pattern surfaces and shared template tokens
- Localization or long-content concerns:
  not yet split into dedicated template-level checks beyond the underlying
  governed family coverage

## State Coverage

- Default:
  `sub-nav-row` baseline surface visible
- Hover / pressed / focus:
  native select focus and render-drawer interaction
- Selected / active:
  `list-detail-panel` and `breadcrumb` swaps covered directly
- Disabled:
  not directly promoted in the current template baseline
- Loading:
  not applicable
- Empty:
  not applicable
- Success:
  not applicable
- Warning:
  not applicable
- Error:
  template-level error posture remains supported but not separately promoted in
  the locked baseline

## Quality Gate Outcome

- Implementation status:
  template-hosted selector-driven render lane exists and mounts real governed
  pattern surfaces
- Rendered status:
  browser-checked for selector visibility, real-surface swapping, and dark /
  desert render-theme containment on the signed-off baseline route
- Human sign-off status:
  approved
- Promotion decision:
  system-ready as the current canonical-render-page baseline and generated
  render-route scaffold
- Open follow-ups:
  expand viewport and direction assertions only if this route becomes a broader
  sign-off host for more governed families

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/canonical-render-page-verification-checklist.md`
- Design-system route update required:
  no; the route already exists and this pass locks its current baseline
- Frontend gate manifest update required:
  no
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  not applicable; this artifact governs the design-system template itself
- Generated-route adoption now allowed:
  yes; generated canonical render routes may consume this template contract
  when they also carry family-specific specimen, fallback-absence, scope, and
  containment proof
