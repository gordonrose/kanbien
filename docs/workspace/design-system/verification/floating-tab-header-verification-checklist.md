# Floating Tab Header Verification Checklist

## Scope

- Artifact name:
  Floating tab header
- Surface:
  `/design-system/components/floating-tab-header`
- Status under review:
  canonical renderings created; app adoption still blocked
- Canonical launcher:
  `/design-system/canonical-renderings/floating-tab-header`
- Canonical render route pattern:
  `/design-system/canonical-renderings/floating-tab-header/:ref`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/floating-tab-header-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/floating-tab-header-reference-pack.md`
- Related component artifact:
  `docs/workspace/design-system/components/floating-tab-header-component.md`

## Visual Contract

- One-sentence rule:
  The floating tab header must remain a calm, full-width secondary navigation
  rail whose overflow, attention, subtabs, and right-side controls never
  collide with each other or with the list content it controls.
- Trigger for this review:
  Convert the signed-off preview into a design-system-owned render/controller
  seam and a dedicated canonical rendering set without allowing app
  consumption before an adoption contract exists.
- What changed since the last review:
  The component route and exploration route now mount
  `renderFloatingTabHeader` and `mountFloatingTabHeader` from
  `/design-system/assets/floatingTabHeader.mjs` instead of owning static copied
  component markup; generated `FTH-R-*` routes now resolve through
  `/design-system/assets/floatingTabHeaderCanonical.mjs`.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/assets/floatingTabHeader.mjs`
  `src/frontend/designSystem/assets/floatingTabHeaderCanonical.mjs`
  `src/frontend/designSystem/assets/floatingTabHeaderDemo.mjs`
  `src/frontend/designSystem/components/floating-tab-header.html`
  `src/frontend/designSystem/exploration/floating-tab-header/index.html`
  `src/frontend/designSystem/assets/styles.css`
- Implementation updated:
  yes
- Known source-level risks:
  first app consumer has not yet adopted the seam, so app-level parity remains
  future work.

## Rendered Verification

- Required viewports checked:
  `FTH-R-001` through `FTH-R-024` define the required viewport set.
- Required direction states checked:
  LTR and RTL are represented by deterministic reference URLs.
- Required theme states checked:
  normal, dark, and desert are represented by deterministic reference URLs.
- Required magnification states checked:
  +100% horizontal and vertical pressure states are represented by deterministic
  reference URLs.
- Overflow or clipping checks:
  right-only, both-sides, left-only, mobile, and vertical overflow states are
  required.
- Layering or anchoring checks:
  category drawer, tooltip layer, subtabs, control column, and attention labels
  must remain contained.
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/navigation/floatingTabHeaderCanonical.spec.ts`
  covers the launcher, all `FTH-R-001` through `FTH-R-024` render routes,
  side-aware overflow summaries, arrow/card height, collapse behavior, vertical
  control grouping, attention label containment, subtab attention state,
  truncation tooltip data, and local direction/theme scoping.

## Accessibility Verification

- Keyboard entry and exit:
  tabs, paging arrows, category switch, category radio options, subtabs, and
  collapse control must be reachable in stable order.
- Focus order and return focus:
  focus-visible styling must remain unclipped; drawer interactions must not
  strand focus.
- Semantic structure:
  main rail uses `tablist`, tab cards use `role="tab"`, panel uses
  `role="tabpanel"`, and category drawer uses a radio group.
- Screen-reader naming and labeling:
  counts, needs-attention state, hidden summaries, and collapsed summaries must
  be announced without duplicate or misleading labels.
- Localization or long-content considerations:
  truncation must use the shared tooltip layer and preserve counter-card fit.

## State Coverage

- Default:
  roomy five-tab baseline.
- Hover / pressed / focus:
  focus and truncated tooltip review states required.
- Selected / active:
  active main tab and active subtab states required.
- Disabled:
  category switch off, expandable off, collapsed state, and disabled paging end
  states required.
- Loading:
  not defined for this seam; host page owns data loading.
- Empty:
  not defined for this seam; host page owns empty project/list state.
- Error:
  not defined for this seam; host page owns data error state.
- Denied / restricted:
  not defined for this seam; host page owns permission-aware visibility.

## Quality Gate Outcome

- Implementation status:
  shared render/controller seam exists.
- Rendered status:
  executable canonical proof exists for the generated canonical route family.
- Human sign-off status:
  signed-off component canonical set; not promoted to system-ready.
- Promotion decision:
  blocked on first-consumer adoption contract and real-app parity proof.
- Open follow-ups:
  choose a first real app consumer, create the adoption contract, and prove the
  consumer renders through the shared seam without app-local markup or
  controller reconstruction.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/floating-tab-header-verification-checklist.md`
- Design-system route update required:
  complete
- Frontend gate manifest update required:
  not yet; add before first app adoption
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
