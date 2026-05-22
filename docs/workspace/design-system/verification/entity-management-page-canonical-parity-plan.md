# Entity Management Page Canonical Parity Plan

## Purpose

Compare each entity-management-page child canonical rendering against the
approved host surface at
`/design-system/templates/entity_management_page`, using screenshots and
rendered geometry before marking a rendering as signed off.

This plan treats the current child canonical routes as review candidates, not
signed-off truth.

## Source Of Truth

- Host source:
  `/design-system/templates/entity_management_page`
- Canonical launchers:
  - `/design-system/canonical-renderings/entity-management-page-outer-page`
  - `/design-system/canonical-renderings/entity-management-page-navigation`
  - `/design-system/canonical-renderings/entity-management-page-detail-panel`
  - `/design-system/canonical-renderings/entity-management-page-collection-item`
  - `/design-system/canonical-renderings/entity-management-page-evidence-ai`
  - `/design-system/canonical-renderings/entity-management-page-performance`
- Reference packs:
  `docs/workspace/design-system/reference-packs/entity-management-page-*-reference-pack.md`

## Per-Rendering Loop

For each child reference state:

1. Open the approved host route.
2. Put the host route into the equivalent state using browser interaction
   rather than source assumptions.
3. Capture a screenshot of the host template surface:
   the visible page-template frame and any active drawer/overlay state.
4. Open the matching canonical render route.
5. Capture a screenshot of the canonical specimen surface, not just the
   launcher chrome.
6. Compare screenshots for:
   - same rendered component anatomy
   - same active region and nested item
   - same mobile carousel/desktop lane behavior
   - same evidence/AI split or overlay posture where applicable
   - no missing CSS, native fallback controls, or copied shell artifacts
   - no text overlap, clipping, or horizontal overflow
   - RTL, dark theme, zoom, and WCAG text-spacing posture when the state
     declares those pressures
7. If the mismatch is a canonical-rendering implementation bug, fix the shared
   canonical renderer or its child state mapping and rerun the same reference.
8. If the mismatch requires a human product/design decision, record the
   reference as `skipped-human-decision`, note the question, and move to the
   next reference.
9. Mark the reference as:
   - `signed-off`
   - `fixed-and-signed-off`
   - `skipped-human-decision`
   - `blocked-runtime`

## Execution Order

Work one reference at a time:

1. Outer page: `EMPO-001` through `EMPO-024`
2. Navigation: `EMPN-001` through `EMPN-036`
3. Detail panel: `EMPD-001` through `EMPD-050`
4. Collection item: `EMPI-001` through `EMPI-038`
5. Evidence/AI: `EMPE-001` through `EMPE-036`
6. Performance: `EMPP-001` through `EMPP-032`

## Sign-Off Evidence

For each completed reference, keep:

- host screenshot path
- canonical screenshot path
- comparison status
- fixes made, if any
- remaining risk or skipped human decision

Initial screenshot artifacts for this loop live under:

`tests/visual/designSystem/review-artifacts/entity-management-page-canonicals/`
