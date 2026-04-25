# Canonical Host Surface Isolation Audit

## Purpose

Record the current cross-family audit of canonical renderings against the
design-system `Canonical Host And Surface Isolation` rule before further
design-system component rollout continues.

This audit is narrower than a family verification checklist.
It focuses on whether the canonical host page and the rendered review surface
are decoupled enough for sign-off-grade evidence.

## Scope

- Audit date:
  2026-04-17
- Families reviewed:
  `top-nav`, `sub-nav`, `context-nav`, and the `context-nav-drawer`
  canonicals that inherit the shared `context-nav` renderer
- Governing rule:
  `docs/workspace/design-system/canonical-and-parity-conventions.md`
- Trigger:
  the escaped `CDR-001` host-scroll coupling issue proved that at least one
  canonical renderer could react to host-page conditions rather than only to
  explicit canonical parameters

## Audit Method

- source inspection of:
  `src/frontend/designSystem/components/top-nav.html`
  `src/frontend/designSystem/components/sub-nav.html`
  `src/frontend/designSystem/components/context-nav.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
- verification artifact inspection of:
  `docs/workspace/design-system/verification/top-nav-verification-checklist.md`
  `docs/workspace/design-system/verification/sub-nav-row-verification-checklist.md`
  `docs/workspace/design-system/verification/context-nav-verification-checklist.md`
- runtime browser inspection against `http://127.0.0.1:3000`
  using the current canonical routes and computed-style checks

## Audit Questions

- does the family use a dedicated canonical render surface or only a preview
  page with controls?
- does the canonical renderer depend on document-level CSS variables or
  document-level theme, direction, or scale writes?
- can host-page scroll or host-page shell geometry alter the rendered
  canonical state?
- do the current verification artifacts overstate confidence relative to the
  current isolation seam?

## Findings

### `top-nav`

- Current posture:
  improved, still coupled
- Evidence:
  canonical review now points at the dedicated canonical render page,
  `/design-system/components/top-nav?...`, while exploration controls live on
  `/design-system/exploration/top-nav`
- Host/surface coupling:
  the family now has a dedicated canonical render surface, but still lives in
  the same document as the host review page
- Shared runtime seam:
  the canonical host and render surface still share one document
- Hardening applied:
  theme and magnification now live on the local `.top-nav-preview-canvas`, and
  RTL direction now lives on that same local render surface instead of
  `document.documentElement`; `.canonical-render-layout` and the render intro
  chrome remain unthemed
- Audit conclusion:
  `top-nav` is no longer the weakest family architecturally, but it still does
  not satisfy the stronger end-state isolation rule

### `sub-nav`

- Current posture:
  improved, still coupled
- Evidence:
  `src/frontend/designSystem/components/sub-nav.html` uses a dedicated
  canonical render page, and canonical layout width is now scoped to that
  page's local `.canonical-render-layout` container; RTL direction is now
  owned by the local render shell instead of the host document on canonical
  pages, including canonical state resolution in the shared runtime
- Shared runtime seam:
  theme and magnification are now localized to the rendered shell for
  canonical pages, but the host page and rendered shell still share one
  document and some broader runtime paths
- Host/surface coupling:
  the render page and rendered shell still live in the same document rather
  than in an isolated render boundary
- Audit conclusion:
  `sub-nav` is in better shape than `top-nav`, but it still does not fully
  prove that only canonical parameters drive the rendered state

### `context-nav`

- Current posture:
  improved, still coupled
- Evidence:
  `src/frontend/designSystem/components/context-nav.html` uses a dedicated
  canonical render page, and canonical layout width is now scoped to that
  page's local `.canonical-render-layout` container; RTL direction is now
  owned by the local render shell instead of the host document on canonical
  pages
- Hardening applied:
  the rendered shell no longer depends on host-page sticky positioning for its
  own placement, while the host review page now intentionally keeps the review
  frame parked below the host chrome during page scroll
- Shared runtime seam:
  `updateContextNavOffset()` writes `--context-nav-top` through
  `document.documentElement`, so host-page shell geometry still exists in the
  broader page runtime on non-canonical pages
- Hardening applied:
  theme and magnification now live on the local `.context-nav-preview-shell`;
  `.canonical-render-layout` and the render intro chrome remain unthemed
- Runtime proof:
  browser inspection now shows the canonical review frame is `position:
  sticky` on the host page with a host-owned review offset, while canonical
  pages keep `--context-nav-top` empty on the document root and the rendered
  shell keeps its own local `--context-nav-top` attachment math
- Audit conclusion:
  this is the first honest architecture improvement for the shared canonical
  renderer, but not the final isolation posture

### `context-nav-drawer`

- Current posture:
  inherits `context-nav` renderer risk
- Evidence:
  `CDR-*` canonicals are routed through the shared
  `/design-system/components/context-nav?...&ref=CDR-*` surface
- Host/surface coupling:
  the drawer inherits the same shared document runtime, sticky frame behavior,
  and host-page offset seams as `context-nav`
- Audit conclusion:
  the drawer family should not be treated as having a cleaner canonical
  architecture than the shared `context-nav` renderer it currently depends on

## Verification Artifact Honesty Check

- `top-nav` verification is materially more honest now that the family has a
  dedicated canonical render surface with local theme, magnification, and
  direction ownership, but it still shares a same-document host boundary
- `sub-nav` verification is directionally closer to the new rule, but it does
  not currently call out the remaining same-document coupling clearly enough
- `context-nav` verification overstates long-term render-boundary confidence
  less than before; host offset writes are now out of the canonical path, but
  the shared document runtime is still broader than the target isolation rule

## Audit Outcome

- family behavior sign-off remains useful
- the current same-document hardening pass is now applied across the governed
  shell families in `/design-system`:
  `top-nav`, `sub-nav`, `context-nav`, and the inherited `context-nav drawer`
- that means local theme, magnification, direction, layout-width, and
  attachment ownership are now the repo-wide interim practice for canonical
  render surfaces, not a drawer-only exception
- canonical host/surface architecture is still not strong enough to treat the
  current rendering model as the repo-wide long-term reference standard
- further design-system component rollout can continue, but should keep using
  this hardened same-document posture until or unless we deliberately move to
  an isolated-document model

## Recommended Next Steps

1. Keep treating the hardened same-document render-root model as the required
   default for new `/design-system` canonical families.
2. Decide later whether the target isolation model should remain that harder
   same-document seam or move to an isolated document boundary.
3. Continue reducing the remaining document-level and same-document shared
   seams for `top-nav`, `sub-nav`, and `context-nav`, especially around
   host/runtime entanglement.
4. Refresh affected verification artifacts whenever a family improves or
   weakens its isolation posture so the docs stay honest.

## Evidence Notes

- Browser inspection used the live local design-system server at
  `http://127.0.0.1:3000`
- Runtime evidence observed:
  - `top-nav` now has a dedicated canonical render route and no longer mixes
    canonical truth with preview controls; theme is local to the canonical
    layout, while magnification and RTL direction are local to the preview
    canvas
  - `sub-nav` no longer writes `--canonical-render-layout-width` globally and
    now owns RTL direction locally; theme is local to the canonical layout and
    magnification is local to the preview shell
  - `context-nav` no longer uses host-page sticky frame positioning; canonical
    pages keep host offset writes off the document root, while the host review
    page now intentionally owns a sticky review-frame offset; theme is local
    to the canonical layout and magnification is local to the preview shell
