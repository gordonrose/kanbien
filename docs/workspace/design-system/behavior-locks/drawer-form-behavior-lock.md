# Drawer Form Behavior Lock

## Purpose

Lock the first shared `drawer-form` seam for create/edit entity-entry workflows
hosted inside an approved drawer chassis.

## Scope

- Family:
  `drawer-form`
- First host family:
  `list-page`
- Shared renderer:
  `src/frontend/designSystem/assets/drawerForm.mjs`
- Shared host drawer seam:
  `src/frontend/designSystem/assets/listDrawerShell.mjs`
- Dedicated component surface:
  `/design-system/components/drawer-form`
- Generated canonical launcher:
  `/design-system/canonical-renderings/drawer-form`
- Generated canonical render surface:
  `/design-system/canonical-renderings/drawer-form/:ref`
- First host surfaces:
  `/design-system/templates/list-page?drawerMode=form&formIntent=create`
  `/design-system/templates/list-page?drawerMode=form&formIntent=edit`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status |
| --- | --- | --- | --- | --- |
| `DF-001` | `DrawerForm` owns the drawer form body, field cadence, helper text rhythm, and approved control composition; the host owns drawer header, close behavior, footer actions, validation, persistence, and domain policy. | Keeps the shared seam reusable without smuggling app or entity behavior into the design system. | `renderDrawerForm()` produces the body while list-page still owns create/edit state. | `approved-preview` |
| `DF-002` | The seam must compose existing approved form controls instead of inventing date, time, select, drawer-select, choice, toggle, or upload behavior locally. | Prevents drift from the form-control family. | The renderer uses the approved form-control class/data contracts and shared drawer-select/upload render helpers. | `approved-preview` |
| `DF-003` | The body must be narrow enough for active states to render without clipping and must scroll internally inside the drawer lane under long content. | Preserves readable authoring without causing document-level scrollbars. | Shared `.drawer-form*` classes define the body, fields, grid, inputs, and status lane. | `approved-preview` |
| `DF-004` | Hosts may provide create or edit intent, but the shared body does not define durable save semantics. | Real entity validation, uniqueness, authorization, persistence, and audit behavior stay feature-owned. | The list-page host mutates placeholder browser state only. | `approved-preview` |
| `DF-005` | The first component surface and list-page host must consume the same shared form renderer and the same signed-off list drawer shell seam. | Makes the seam reusable rather than a copied template fragment and prevents child canonicals from proving a local reconstruction. | `/components/drawer-form` hydrates `data-list-drawer-shell-template="split-layout"` and `/templates/list-page` hydrates `data-list-drawer-shell-template="panel"` from `listDrawerShell.mjs`; both hydrate `data-drawer-form-template` for the body. | `approved-preview` |
| `DF-006` | Canonical states for direction, zoom, disabled, error, mobile width, and open approved controls must be persistence-backed under `/design-system/canonical-renderings/drawer-form/:ref`, with URL fallback support on the component surface. | Keeps sign-off evidence repeatable and aligned with the established canonical-renderings governance path. | `drawerFormCanonical.mjs` loads generated canonical reference payloads and applies state without changing app host semantics. | `approved-preview` |
| `DF-007` | Drawer-form render pages must not locally declare list drawer shell anatomy such as `.list-page-shell-split`, `.list-page-detail-panel`, drawer header controls, or drawer footer actions. | A child canonical is only sign-off-grade when it proves adoption of the parent seam instead of an approximation. | `drawerForm.spec.ts` reads the render page source and asserts the page delegates drawer shell creation to `listDrawerShell.mjs`. | `approved-preview` |

## Exit Criteria

`drawer-form` can move from approved preview to sign-off candidate when the
dedicated canonical set includes mobile, RTL, magnified, error, disabled, and
open approved-control states with rendered geometry checks and human visual
review.
