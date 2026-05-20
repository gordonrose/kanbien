# Entity Management Page Collection Item Behavior Lock

## Purpose

Capture repeated item behavior inside the `entity_management_page` template:
add, copy, delete, card synchronization, workflow/catalog/permission lifecycles,
and item-specific builders.

## Scope

- Family:
  `entity-management-page`
- Slice:
  collection item behavior
- Status:
  review-candidate

## Behavior Review

| ID | Behavior statement | Status | Current evidence / note |
| --- | --- | --- | --- |
| `EMP-ITEM-001` | Repeated item regions must use one shared nested-card/list behavior rather than custom item controls per region. | `approved-input` | Recent duplication cleanup unified Identity and other sections on `renderNestedListPicker`. |
| `EMP-ITEM-002` | Add cards use the same nested card list placement as normal items and expose an explicit accessible name for the add action. | `review-candidate` | Tests assert accessible names for Add Workflow and Add View. |
| `EMP-ITEM-003` | Adding a workflow creates a new nested card, creates a matching nested panel, selects it, initializes form controls, and starts with an empty Workflow details section plus one Home status. | `review-candidate` | Visual test covers Add Workflow, new `workflow-4`, empty name/description, builder row count, and Home status. |
| `EMP-ITEM-004` | Copying a workflow creates a new editable workflow item using the same default new-item baseline rather than preserving source text as a hidden clone. | `review-candidate` | Visual test copies Intake and expects empty new workflow fields before user renames it. |
| `EMP-ITEM-005` | Renaming a workflow updates the corresponding nested card title immediately. | `review-candidate` | Visual test fills `Copied workflow` and asserts the nested trigger title updates. |
| `EMP-ITEM-006` | Deleting a workflow removes both the nested card and nested panel, then activates an adjacent remaining item when available. | `review-candidate` | Visual test deletes `workflow4` and expects card/panel removal. Adjacent activation needs focused assertion. |
| `EMP-ITEM-007` | Workflow item action buttons use icon-only copy/delete controls with accessible labels and the shared icon visual language. | `review-candidate` | Visual test asserts accessible labels and path counts for current copy/delete icons. |
| `EMP-ITEM-008` | Adding a catalog creates a new catalog nested card and panel with default option rows, initializes select controls, and activates the new catalog. | `review-candidate` | Code path exists through `addEntityManagementCatalogRecord`; needs focused visual coverage. |
| `EMP-ITEM-009` | Copying a catalog creates a new catalog item using the current source when provided, then allows card label/scope copy to sync from edited fields. | `review-candidate` | Code path and `syncEntityManagementCatalogCardCopy` exist. Needs focused coverage. |
| `EMP-ITEM-010` | Deleting a catalog removes both card and panel and activates a neighboring catalog when available. | `review-candidate` | Code path exists through catalog delete handler. Needs focused coverage. |
| `EMP-ITEM-011` | Catalog option rows support add, remove, move up/down, and generated value sync from option label where appropriate. | `review-candidate` | Catalog builder controls exist. Needs focused coverage. |
| `EMP-ITEM-012` | Adding a permission role creates a new permission role item, panel, role field, and updates view role eligibility options. | `review-candidate` | Add handler calls `syncEntityManagementViewRoleOptions`; needs focused coverage. |
| `EMP-ITEM-013` | Copying or editing a permission role keeps nested card label/summary synced to the role value. | `review-candidate` | `syncEntityManagementPermissionCardCopy` exists. Needs browser assertion. |
| `EMP-ITEM-014` | Deleting a permission role removes the item and updates dependent view role options so stale role choices do not remain available. | `review-candidate` | Delete handler calls role sync after deletion. Needs focused coverage. |
| `EMP-ITEM-015` | Permission capability-family select/deselect controls affect only the active family inside the current role panel. | `review-candidate` | Family-level bulk controls exist. Needs focused coverage. |
| `EMP-ITEM-016` | Repeated item mutation must not rely on global duplicate ids that break after adding or copying records. | `needs-evidence` | Add/copy functions generate indexed keys; app-consumable seam should add stronger duplicate-id verification. |
| `EMP-ITEM-017` | Add/copy/delete behavior must survive lazy materialization; handlers must initialize when a region is first selected and not double-bind after repeated selection. | `review-candidate` | Current lazy materialization initializes nested lists once via dataset flag. Needs explicit repeated-selection test. |

## Open Review Questions

- Should copy preserve source values or create a blank item with source-derived
  structure? Current workflow copy behaves like blank-new-item.
- Should delete ask for confirmation once this becomes app-consumable, or is
  immediate deletion acceptable only in the design-system demo?
- Should add-card order always append before the add card, or should ordering be
  configurable per collection?

## Evidence Gaps

- Catalog add/copy/delete and option lifecycle.
- Permission add/copy/delete plus dependent view-role sync.
- Duplicate id/name assertions after repeated add/copy cycles.
- Repeated lazy materialization with add/copy/delete handlers.

