# List Detail Section Index Behavior Lock

## Purpose

Lock the reusable section-index child seam for list detail drawers.

This seam lets a selected list record expose multiple named aspects inside the
same drawer without creating one long detail body or rebuilding drawer chrome
locally in app pages.

## Scope

- Family:
  `list-detail-section-index`
- Status:
  signed-off child behavior lock
- Source surface:
  `/design-system/templates/list-page?drawerVariant=indexed`
- Reusable source:
  `src/frontend/designSystem/assets/listDrawerShell.mjs`
- Host parent family:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-section-index-reference-pack.md`
- First app consumer:
  `/root-admin/users`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status |
| --- | --- | --- | --- | --- |
| `LDSI-001` | The section index is a child seam of the list detail drawer, not a replacement for the parent list page, split layout, header, or footer. | Keeps parent drawer ownership intact and makes app adoption consume shared anatomy. | Exported as `renderListDetailSectionIndex(...)` from the design-system drawer module. | `approved` |
| `LDSI-002` | The index must render label-only selectable rows with no checkbox marker, helper paragraph, or bold-only label treatment. | Keeps the index compact while still reading as a list of available sections. | Rows reuse the drawer-select option row boundary but strip the toggle and helper copy. | `approved` |
| `LDSI-003` | Exactly one section panel is visible at a time. | Prevents long drawer bodies and preserves the point of the indexed variant. | Active section uses `aria-selected="true"` and visible panel state. | `approved` |
| `LDSI-004` | Switching sections must not change the selected list record or footer previous/next traversal state. | Keeps record selection and section selection separate. | Root-users and design-system tests switch sections without changing active cards. | `approved` |
| `LDSI-005` | Section labels are supplied by the consuming feature, while row anatomy and panel switching remain governed by the seam. | Allows root-users to use `Profile` and `Session information` without copying markup. | The renderer accepts a section array with `key`, `label`, `active`, and `content`. | `approved` |
| `LDSI-006` | The seam must remain usable in RTL, mobile, magnified, and themed review states. | Indexed drawers increase layout pressure inside the detail lane. | Existing list-page indexed tests cover RTL, dark, and magnified containment; root-users covers first consumer behavior. | `approved` |
| `LDSI-007` | App consumers must import the shared renderer rather than hand-copying index markup. | Prevents governed app-page drift. | Root-users consumes the exported renderer through the shared root-admin directory workspace seam. | `approved` |
| `LDSI-008` | Missing or unavailable optional section data must render honest section copy rather than inventing values. | Keeps the index useful without hiding that a selected feature payload lacks a section. | Root-users session information states when selected-user session records are not loaded in the list view. | `approved` |

## Exit Criteria

This behavior lock is complete when:

- the reusable renderer exists
- a reference pack names the section states
- executable checks cover the design-system variant and first root-users consumer
- the root-users adoption contract records the indexed drawer use
