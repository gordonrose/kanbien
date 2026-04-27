# Drawer Form Reference Pack

## Purpose

Record the first reference states for the shared drawer-hosted form seam used
to create and edit entity entries without leaving the surrounding list or
detail context.

## Scope

- Family:
  `drawer-form`
- Status:
  first shared seam preview
- Shared source:
  `src/frontend/designSystem/assets/drawerForm.mjs`
- Shared host source:
  `src/frontend/designSystem/assets/listDrawerShell.mjs`
- Generated canonical launcher:
  `/design-system/canonical-renderings/drawer-form`
- Generated canonical render surface:
  `/design-system/canonical-renderings/drawer-form/:ref`
- Source component render surface:
  `/design-system/components/drawer-form`
- Canonical state controller:
  `src/frontend/designSystem/assets/drawerFormCanonical.mjs`
- Canonical family seed:
  `src/features/designSystemCanonicals/persistence/migrations/0045_seed_drawer_form_canonicals.sql`
- First host:
  `/design-system/templates/list-page`

## Current Surface Truth

- `DrawerForm` is now rendered from a shared design-system module.
- The signed-off list drawer shell is now rendered from
  `listDrawerShell.mjs`, so child canonical render pages can consume the same
  drawer host seam as the list-page template instead of copying its markup.
- List page consumes the shared renderer through `data-drawer-form-template`
  instead of owning the form body markup directly, and consumes the drawer
  panel through `data-list-drawer-shell-template="panel"`.
- The dedicated component surface renders the same body inside the established
  list-detail drawer chassis through
  `data-list-drawer-shell-template="split-layout"`.
- The dedicated component surface accepts URL-driven canonical state parameters
  for width, direction, zoom, error, disabled, mobile, and open approved
  control states.
- The generated canonical-renderings route loads the same state truth from the
  persisted `drawer-form` canonical family and reference records.
- The seam composes approved form controls for select, date, time,
  drawer-select, choice, toggle, and upload posture.
- The seam does not own validation, persistence, authorization, uniqueness, or
  durable entity semantics.

## Required Reference States

The reference set is intentionally a risk matrix, not every mathematical
permutation. It must cover the independent baseline states and the combinations
most likely to break the inherited drawer shell: mobile plus open overlays,
RTL plus open overlays, magnification plus the largest overlay, and validation
posture combined with open controls. Theme coverage is also required because
the drawer-form renderer composes multiple child control families whose ink,
surface, and overlay tokens can drift independently.

| Ref ID | Route | State | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `DF-001` | `/design-system/canonical-renderings/drawer-form/DF-001` | Dedicated drawer-form component surface | Proves the shared renderer can stand apart from the list-page template | covered-by-test |
| `DF-004` | `/design-system/canonical-renderings/drawer-form/DF-004` | RTL component surface | Required before sign-off-grade localization review | covered-by-test |
| `DF-005` | `/design-system/canonical-renderings/drawer-form/DF-005` | Magnified component surface | Required before sign-off-grade reflow review | covered-by-test |
| `DF-006` | `/design-system/canonical-renderings/drawer-form/DF-006` | Disabled form posture | Required before app adoption | covered-by-test |
| `DF-007` | `/design-system/canonical-renderings/drawer-form/DF-007` | Error form posture | Required before app adoption | covered-by-test |
| `DF-008` | `/design-system/canonical-renderings/drawer-form/DF-008` | Mobile drawer lane | Proves the form remains a single usable lane at phone width | covered-by-test |
| `DF-009` | `/design-system/canonical-renderings/drawer-form/DF-009` | Date picker open state | Proves the date control opens inside the shared drawer-form seam | covered-by-test |
| `DF-010` | `/design-system/canonical-renderings/drawer-form/DF-010` | Time picker open state | Proves the time control opens inside the shared drawer-form seam | covered-by-test |
| `DF-011` | `/design-system/canonical-renderings/drawer-form/DF-011` | Drawer-select open state | Proves the drawer-select control opens inside the shared drawer-form seam | covered-by-test |
| `DF-012` | `/design-system/canonical-renderings/drawer-form/DF-012` | Mobile date picker open state | Proves date overlay behavior in the single-column drawer lane | covered-by-test |
| `DF-013` | `/design-system/canonical-renderings/drawer-form/DF-013` | Mobile drawer-select open state | Proves the largest approved overlay remains contained at phone width | covered-by-test |
| `DF-014` | `/design-system/canonical-renderings/drawer-form/DF-014` | RTL drawer-select open state | Proves the searchable drawer-select overlay follows specimen-local direction rather than page direction | covered-by-test |
| `DF-015` | `/design-system/canonical-renderings/drawer-form/DF-015` | RTL date picker open state | Proves calendar overlay alignment in the RTL inherited drawer shell | covered-by-test |
| `DF-016` | `/design-system/canonical-renderings/drawer-form/DF-016` | Error with drawer-select open | Proves validation styling and open-overlay layering can coexist | covered-by-test |
| `DF-017` | `/design-system/canonical-renderings/drawer-form/DF-017` | Magnified drawer-select open state | Proves the highest-pressure open control remains usable under zoom | covered-by-test |
| `DF-018` | `/design-system/canonical-renderings/drawer-form/DF-018` | Mobile error state | Proves validation messaging and field rhythm remain readable in the mobile lane | covered-by-test |
| `DF-019` | `/design-system/canonical-renderings/drawer-form/DF-019` | Dark theme baseline | Proves inherited shell, form fields, helper copy, and approved controls remain readable under local dark theme scope | covered-by-test |
| `DF-020` | `/design-system/canonical-renderings/drawer-form/DF-020` | Desert theme baseline | Proves inherited shell, form fields, helper copy, and approved controls remain readable under local desert theme scope | covered-by-test |
| `DF-021` | `/design-system/canonical-renderings/drawer-form/DF-021` | Dark drawer-select open state | Proves the highest-pressure overlay remains readable and locally themed in dark mode | covered-by-test |

## Host Adoption Reference States

These are not child canonical render pages because they review the list-page
host workflow around the shared form body. They must remain covered before the
form seam is considered safe for app adoption.

| Host state | Route | Why it exists | Evidence status |
| --- | --- | --- | --- |
| Create intent | `/design-system/templates/list-page?drawerMode=form&formIntent=create` | Proves the host can open an empty form, focus title, save a new placeholder, and return to the detail view without owning form body markup | covered-by-test |
| Edit intent | `/design-system/templates/list-page?drawerMode=form&formIntent=edit` | Proves the host can hydrate existing placeholder data into the shared body and save back into the selected card | covered-by-test |
| Edit overflow containment | `/design-system/templates/list-page?drawerMode=form&formIntent=edit` | Proves long edit-form content does not create a document scrollbar and stays in the drawer scroll lane | covered-by-test |
| Append retry beside open drawer | `/design-system/templates/list-page?listLoadError=append` | Proves list recovery actions remain usable when drawer state and list lazy-loading coexist | covered-by-test |

List-page create and edit host consumption is tracked in the list-page
reference pack as host adoption evidence, not as the child seam's canonical
rendering surface.

## Guardrails

- App consumers must consume the shared renderer or a future shared controller
  seam rather than copying the list-page host markup.
- The drawer shell is a shared host seam for this family. Child render pages
  must call that seam rather than declaring list/detail drawer anatomy locally.
- Real upload behavior and asset policy remain outside this seam.
