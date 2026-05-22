# Entity Management Page Shared Seam Adoption Contract

## Scope

- Component or pattern family:
  Entity Management Page
- Status:
  draft shared-seam contract
- First consumer surface:
  `/design-system/templates/entity_management_page`
- Route or shell owner:
  design-system entity-management page template
- Source pattern artifact:
  `src/frontend/designSystem/assets/entityManagementPage.mjs`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/entity-management-page-verification-checklist.md`

## Purpose

This contract records the first reusable boundary for the Entity Management
Page before real app adoption begins.

The current reusable boundary is intentionally narrow:

- shared drawer render entrypoint:
  `renderEntityManagementPageDrawerContent(...)`
- shared drawer hydrate entrypoint:
  `hydrateEntityManagementPageDrawer(drawer)`
- shared detail content entrypoint:
  `renderEntityManagementPageAttributeView()`

The purpose is to stop the template route, row drawer, and canonical renderer
from reconstructing the same page body independently while the larger page
template is still moving through behavior-lock and canonical review.

## Governed Adoption Preflight

- Exact signed-off source route or render surface:
  not yet signed off; current route remains
  `/design-system/templates/entity_management_page`
- Exact reference pack or canonical source:
  child reference packs under
  `docs/workspace/design-system/reference-packs/entity-management-page-*-reference-pack.md`
- Shared CSS seam:
  `src/frontend/designSystem/assets/chatWorkspacePattern.css`
- Shared render seam:
  `src/frontend/designSystem/assets/entityManagementPage.mjs`
- Shared controller seam:
  `hydrateEntityManagementPageDrawer(drawer)` plus the existing entity-management
  behavior controller inside `entityManagementPage.mjs`
- Family-owned visible regions:
  entity page drawer header actions, active-region summary, region selector,
  nested list, generated detail panels, evidence and AI drawers
- Host-owned visible regions:
  design-system route chrome, canonical metadata shell, page-level display
  settings, and app-specific surrounding navigation
- Approved intentional deviations before implementation:
  none for app adoption; design-system canonical route chrome may differ from
  the specimen as review scaffolding
- Shared-entrypoint parity expectation:
  identical drawer render/hydrate behavior between the template host and child
  canonical renderer
- Stop condition if a required seam is missing:
  do not copy entity-management drawer HTML, ARIA, AI/evidence controls, or
  region behavior into an app page

## Consumer Contract

- Primary destinations:
  entity-management page body inside a governed app page or design-system host
- Utility actions:
  AI mode, evidence mode, region switching, nested-card selection, generated
  form controls, add/copy/delete where supported
- Loading / empty / denied states:
  not yet approved for real app adoption
- Error or degraded states:
  action-model error cards exist in design-system fixtures; app error contract
  remains deferred
- Localization / long-label expectations:
  long label, RTL, text-spacing, zoom, and tooltip evidence remains required
  before real app adoption

## Parity Rules

- Must match reference pack:
  shell viewport, mobile carousel, drawer-as-page-body posture, region/nested
  navigation, detail panel anatomy, evidence/AI split or overlay behavior
- May differ intentionally:
  canonical render metadata and design-system route chrome
- Must not drift:
  duplicated drawer header/body markup, duplicated region behavior, copied
  AI/evidence toggle logic, page-local CSS for governed app consumers
- What would count as false confidence here?
  shared CSS without shared render/hydrate consumption, route screenshots that
  describe a viewport without enforcing it, or tests that only check the happy
  path on Identity
- Required parity evidence:
  child canonical screenshot review by matrix plus executable viewport,
  shared-render, and representative region-routing checks
- Required real interactive parity states:
  mobile carousel, region switching, drawer-selects, add/copy/delete,
  evidence/AI open/close, keyboard focus, RTL, dark theme, zoom, text spacing

## Adoption Boundary

- What existing local UI is being replaced?
  duplicated entity-management drawer header/body construction in design-system
  render hosts
- What backend seams or APIs must remain untouched?
  all backend, persistence, authz, and route contracts
- What page-local behavior is allowed for the POC?
  design-system-only route scaffolding and canonical metadata controls
- What is explicitly out of scope?
  production app adoption, persistence-backed entity definitions, and app
  route integration

## Verification

- Required rendered checks:
  template host and child canonical renderer both show the same shared drawer
  anatomy and controls
- Required executable tests:
  `tests/visual/designSystem/canonicals/data-display/entityManagementPageCanonical.spec.ts`
- Required manual sign-off steps:
  inspect child canonical matrices one family at a time after the reference
  pack is complete
- Required consumer-level route proof:
  deferred until a real app consumer is named
- Required shared-entrypoint parity proof:
  template host and canonical route both consume `entityManagementPage.mjs`
  render/hydrate entrypoints

## Promotion Decision

- Adoption result:
  candidate shared design-system seam, not real-app adopted
- Follow-up work required before wider reuse:
  complete child canonical review, WCAG 2.2 AA evidence, long-label fixtures,
  and high-count fixtures
- Follow-up work required before extraction into a shared primitive:
  split demo fixture data from render/controller code and define the stable app
  configuration API
