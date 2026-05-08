# Root Admin Build Backlog Floating Tab First-Consumer Correction

## Summary

The first root-admin consumer for the floating tab header rendered as a
centered design-system preview instead of filling the route canvas. The nested
route breadcrumb also collapsed `Build` and `Backlog` into one current crumb,
the attention sub-tab label was not vertically centered with the rest of the
chip, the page-local sticky tab bar could visually sit above context-nav
drawer chrome, and clipped tab text did not reliably expose its full value on
hover.

## Root Cause

- The Build Backlog adapter reused the floating tab preview shell without an
  explicit full-canvas posture for app routes.
- Root-admin page metadata allowed `breadcrumbCurrent` to be arbitrary display
  copy, so a nested route could hide hierarchy inside `Build / Backlog`.
- The browser proof asserted the incorrect combined breadcrumb label, turning
  the violation into expected behavior.
- The attention sub-tab state added inline content without locking child
  line-height and center alignment inside the chip.
- The floating tab header and context-nav shell surfaces were both using local
  numeric `z-index` values, so source order or any future higher page-local
  layer could put page content over the Display Settings drawer.
- Overflow tooltip ownership stayed on the clipped inner text nodes only, and
  the floating tab implementation drifted from the established overflow
  tooltip posture while trying to account for the attention dot and padded
  attention label. That produced both missed title tooltips and false-positive
  attention-label tooltips.

## Why The Loop Missed It

- The first-consumer proof checked seam usage and basic interaction state, but
  did not include geometry assertions for route canvas width.
- Existing breadcrumb tests proved current-label updates, not nested-route
  breadcrumb hierarchy.
- Static guards blocked copied governed markup and app CSS, but did not require
  importable page metadata or separate breadcrumb nodes for multi-segment
  root-admin paths.

Gap classification:

- missing first-consumer route geometry coverage
- route-topology breadcrumb hierarchy blind spot
- overly permissive page metadata contract
- visual state alignment coverage gap
- shell layering invariant gap
- truncated-text hover-reveal gap

## Reconciliation Changes Added

- Added `data-floating-tab-canvas="full"` as an explicit DS-owned floating tab
  canvas posture and styled it in `src/frontend/designSystem/assets/styles.css`.
- Moved root-admin page metadata into
  `src/frontend/rootAdminShell/assets/pageMetadata.mjs` so tests can import and
  validate route metadata directly.
- Changed `/root-admin/build/backlog` breadcrumb metadata to render separate
  `Root Admin`, `Build`, and `Backlog` nodes.
- Added `tests/unit/rootAdminShell/pageMetadata.test.ts` to require
  multi-segment root-admin routes to expose separate breadcrumb nodes and to
  reject slash-composed `breadcrumbCurrent` labels.
- Strengthened `tests/audit/rootAdminPathTopologyArtifacts.test.ts` and
  `tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts` so the bad
  breadcrumb and centered preview canvas would fail.
- Tightened floating tab sub-tab alignment styles and added a browser geometry
  assertion for the attention sub-tab text, count, and label.
- Moved context-nav rail, drawer, and menu surfaces onto explicit high shell
  layer tokens below the tooltip layer, with browser proof that the Display
  Settings drawer owns the overlap area above the floating tab header.
- Promoted floating tab overflow tooltips to the owning tab button only when a
  visible child label is genuinely clipped, using rendered text measurement so
  padded labels do not create false positives. Added browser proof that a wide
  visible attention label does not get a tooltip, a narrow clipped title does,
  and native `title` attributes remain absent.

## Coverage Lesson

First-consumer design-system adoption must prove more than shared seam usage.
For route-level adoption it must also prove route canvas geometry, nested
topology semantics, and variant alignment in the browser.

## Verification

- `npx vitest run tests/unit/rootAdminShell/routeTopology.test.ts tests/unit/rootAdminShell/pageMetadata.test.ts tests/audit/rootAdminPathTopologyArtifacts.test.ts tests/audit/designSystem/floatingTabHeaderAdoptionGuard.test.ts tests/integration/rootAdminShell/browserAuth.test.ts`
- `npx playwright test tests/visual/app/rootAdminShell/rootAdminBuildBacklog.spec.ts`
- `node --import tsx src/scripts/checkGovernedUiAdoption.ts`
- `node --import tsx src/scripts/checkGovernedRootAdminUi.ts`
