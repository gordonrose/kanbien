# Canonical Host Surface Isolation Drift

## Summary

The `CDR-001` accessibility-drawer desktop canonical exposed a broader design
system architecture issue: canonical render pages and the rendered shell they
host are not isolated enough from each other.

User-visible symptom:

- scrolling the host canonical page caused the rendered context-nav drawer to
  behave as though the rendered sub-nav had disappeared, letting the drawer
  push up behind the still-rendered sub-nav inside the preview shell

This is not only a drawer bug.
It is evidence that the current canonical rendering model can let host-page
conditions influence the supposedly deterministic rendered state.

## Root Cause

Two concrete issues combined:

1. The `context-nav` canonical renderer used shared host-page and rendered-shell
   geometry paths in the same runtime file, `src/frontend/designSystem/assets/app.mjs`.
2. The preview-shell local drawer offset write in
   `updateContextNavPreviewShellLayout()` could be skipped in the normal
   desktop-fit path, allowing the rendered drawer to fall back to host-page
   offset behavior during scroll updates.

Even after the immediate `CDR-001` fix, the deeper lesson remains:

- top-level canonical pages still host rendered surfaces inside the same
  document
- shared runtime state still writes some geometry through
  `document.documentElement`
- canonical render pages still rely on host-page shell chrome and host-page
  scroll lifecycle rather than on a fully isolated render boundary

That means canonical truth can still be influenced by host-page conditions in a
way that is too implicit for sign-off-grade evidence.

## Why The Loop Missed It

This escaped because the existing prevention layer focused on named canonical
state correctness at load time rather than on host/surface isolation during
host-page interaction.

Coverage gap classification:

- wrong-layer coverage:
  the design system had canonical geometry checks, but not a specific check for
  host-page scroll affecting rendered-surface attachment
- missing regression scenario:
  no test asserted that a rendered drawer remained attached below the rendered
  sub-nav after scrolling the containing canonical page
- architectural blind spot:
  the repo had canonical naming and parity conventions, but no explicit rule
  that canonical hosts must be decoupled from the rendered surface they frame

## Audit Of Existing Canonical Renderings

Current families reviewed:

- `top-nav`
- `sub-nav`
- `context-nav`
- `context-nav-drawer` via the shared `context-nav` canonical renderer

Findings:

1. `top-nav` canonical rendering is embedded in the same document as the host
   review page and uses shared runtime wiring in
   `src/frontend/designSystem/assets/app.mjs`.
2. `sub-nav` canonical rendering is embedded in the same document as the host
   review page and writes family state through shared document-level runtime
   seams such as `--canonical-render-layout-width`.
3. `context-nav` canonical rendering is embedded in the same document as the
   host review page and previously mixed host-page scroll updates with
   rendered-shell attachment updates.
4. The context-nav drawer family inherits the same coupling risk because its
   canonicals are rendered through the shared `context-nav` canonical surface.

Repo evidence for this shared coupling model includes:

- `src/frontend/designSystem/components/top-nav.html`
- `src/frontend/designSystem/components/sub-nav.html`
- `src/frontend/designSystem/components/context-nav.html`
- shared canonical runtime logic in
  `src/frontend/designSystem/assets/app.mjs`
- shared document-level canonical layout writes such as
  `document.documentElement.style.setProperty("--canonical-render-layout-width", ...)`

Audit conclusion:

- the existing canonical system is functional but not isolated enough to serve
  as a fully trustworthy long-term reference architecture without follow-on
  hardening
- we should not keep expanding design-system family rollout as though this seam
  is solved repo-wide

## Reconciliation Changes Added

Implementation and prevention work added in this incident:

- fixed the `CDR-*` registration gap so dedicated context-nav-drawer
  canonicals resolve as first-class canonical states
- added direct browser checks for:
  - `CDR-001`
  - `CDR-002`
  - `CDR-003`
- added a regression test for host-page scroll affecting the rendered drawer
- fixed the immediate `CDR-001` preview-shell local offset write so the drawer
  remains anchored below the rendered sub-nav during host-page scroll
- removed host-page global offset dependency from the shared `context-nav`
  canonical frame so the rendered shell no longer depends on the host page's
  global offset variable for placement
- localized canonical layout width for the shared `sub-nav` and `context-nav`
  render pages so that width now belongs to the local canonical container
  instead of `document.documentElement`
- localized RTL direction ownership for `sub-nav` and `context-nav`
  canonical render shells so those canonical pages no longer need the host
  document itself to switch into RTL
- removed document-direction fallback from canonical `sub-nav` and
  `context-nav` state resolution so those families now resolve direction from
  their local render shells during canonical updates as well as at load time
- split `top-nav` exploration from canonical truth by making
  `/design-system/components/top-nav` the dedicated canonical render page and
  leaving interactive controls on `/design-system/exploration/top-nav`
- fixed `top-nav` overflow pressure logic to use the local render shell inside
  `#top-nav-preview-frame` rather than host-shell `.top-nav` queries
- localized canonical RTL direction ownership for `top-nav` to
  `.top-nav-preview-canvas` so canonical RTL states no longer depend on
  `document.documentElement`
- localized canonical theme ownership to the local `.canonical-render-layout`
  for `top-nav`, `sub-nav`, and `context-nav` so canonical pages no longer
  need `document.documentElement` to switch themes
- localized canonical magnification ownership to the render surfaces
  themselves:
  `.top-nav-preview-canvas`,
  `#sub-nav-preview-shell`,
  and `#context-nav-preview-shell`
- removed host offset writes from the canonical `context-nav` path so
  `--context-nav-top` no longer gets populated on `document.documentElement`
  during canonical render, resize, or host-page scroll
- added a host-owned sticky review-frame offset for `context-nav` canonicals
  so the preview remains parked below the host review chrome during page
  scroll, while the rendered shell stays locally owned
- updated the canonical conventions with an explicit `Canonical Host And
  Surface Isolation` rule in
  `docs/workspace/design-system/canonical-and-parity-conventions.md`

## Coverage Lesson

Canonical evidence needs one more class of protection beyond state naming and
geometry assertions:

- isolation protection

For any canonical family that renders a shell or overlay inside a host review
page, the suite should prove that host-page behavior does not alter the
rendered-surface truth unless that host behavior is explicitly part of the
canonical contract.

## Recommended Repo Posture Before Further Design-System Rollout

Before continuing broader design-system component work, we should perform a
focused canonical-rendering architecture audit and hardening pass.

Minimum recommended audit questions:

- which canonical renderers still rely on document-level shared geometry
  variables?
- which canonical surfaces can be affected by host-page scroll or sticky host
  chrome?
- which renderers need a stronger isolation boundary, such as an iframe-like
  document or a stricter family-local render root?
- which existing tests prove named state correctness but not host/surface
  decoupling?

That broader audit is now recorded at:

- `docs/workspace/design-system/verification/canonical-host-surface-isolation-audit.md`

## Verification

Evidence run for this incident:

- `PLAYWRIGHT_PREVIEW_PORT=4318 npx playwright test tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts -g "host-page scroll|CDR-001 desktop canonical|CDR-002|CDR-003"`

That suite now proves the immediate `CDR-001` scroll-coupling regression is
fixed on the clean updated preview server.

Follow-on hardening evidence also now includes:

- `npx playwright test tests/visual/designSystem/canonicals/navigation/topNav.spec.ts --update-snapshots --workers=1`
- `npx playwright test tests/visual/designSystem/canonicals/navigation/subNav.spec.ts --update-snapshots --workers=1`
- `npx playwright test tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts -g "host offset state|theme and magnification stay scoped|RTL direction is owned by the local render surface|CDR-001 desktop drawer stays below the rendered sub-nav after host-page scroll" --workers=1`
- `npx playwright test tests/visual/designSystem/canonicals/navigation/subNav.spec.ts -g "RTL direction is owned by the local render surface|theme and magnification stay scoped to the local render layout" --workers=1`
- `npx playwright test tests/visual/designSystem/canonicals/navigation/topNav.spec.ts -g "TRP-008 rtl desktop|TRP-009 rtl mobile|theme and magnification stay scoped|RTL direction is owned by the local render surface|dedicated canonical page" --workers=1`
- `npx playwright test tests/visual/designSystem/canonicals/navigation/topNav.spec.ts tests/visual/designSystem/canonicals/navigation/subNav.spec.ts tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts --workers=1`

## Resolution Status

- candidate fix awaiting user confirmation

## Residual Risk

- `top-nav` and `sub-nav` canonical renderers still use the same broad
  host-page embedding model
- the repo still lacks a fully isolated canonical render boundary across all
  design-system families
- a broader combined Playwright run showed that long-lived preview-server
  sessions can still be less stable than one-family focused runs, even when
  the underlying canonical families pass individually
- WCAG-sensitive and longer-content drawer states (`CDR-004` through
  `CDR-006`) still need direct browser review
