# Entity Management Page Detail Panel Behavior Lock

## Purpose

Capture detail-panel behavior inside the `entity_management_page` template:
generated forms, collapsible sections, derived fields, validation, workflow
builder controls, permission families, and model panels.

## Scope

- Family:
  `entity-management-page`
- Slice:
  detail panel contract
- Status:
  review-candidate

## Behavior Review

| ID | Behavior statement | Status | Current evidence / note |
| --- | --- | --- | --- |
| `EMP-DETAIL-001` | Detail panels use the shared form tile language: field label, local help, field body, optional evidence/AI affordances, and local read/edit posture. | `review-candidate` | Render helpers use `entity-management-field`, form fields, choice groups, drawer-select fields, and evidence target attributes. |
| `EMP-DETAIL-002` | Identity Primary Details is the initial visible nested panel and includes stable entity naming, key, label keys/fallbacks, and description fields. | `review-candidate` | Initial route renders Identity and Primary Details as the only heavy nested panel. |
| `EMP-DETAIL-003` | Locked/system-derived fields remain visibly present but readonly/disabled where the entity definition should not allow editing. | `review-candidate` | Stable entity key and multiple authority/model fields render as readonly or disabled. Needs explicit coverage matrix. |
| `EMP-DETAIL-004` | Owning Feature fields derive and reveal downstream route/capability values when the owning feature selection is available. | `review-candidate` | `syncEntityManagementOwningFeatureDerivedFields` manages derived visibility and values. Needs focused browser assertions. |
| `EMP-DETAIL-005` | Privacy and security classifications reveal dependent sensitive-category and security-level fields only when the chosen classification requires them. | `review-candidate` | Sync helpers exist for privacy classification and security classification. Needs explicit UI coverage. |
| `EMP-DETAIL-006` | Attribute detail panels keep intrinsic attribute facts, cardinality, validation, search posture, storage model, index posture, and visibility separate rather than flattening them into one freeform form. | `review-candidate` | Attribute renderer has distinct metadata, validation, search, privacy/security, and placement controls. |
| `EMP-DETAIL-007` | Search configuration appears only when the attribute is marked searchable. | `review-candidate` | Search fields are hidden/shown through `data-entity-management-attribute-search-config-field`. |
| `EMP-DETAIL-008` | Validation rules derive their available detail inputs from the selected rule key and can add/remove rule rows. | `review-candidate` | Validation rule sync and add/remove handlers exist. Needs focused regression coverage. |
| `EMP-DETAIL-009` | View definition panels divide detail behavior into View details, Location, Access, Workflow status visibility, Actions, Attributes, and Placements. | `review-candidate` | Visual test exercises View details and section styling. Other sections need targeted coverage. |
| `EMP-DETAIL-010` | View workflow-status visibility toggles update hidden/visible status posture without removing the status from the model. | `review-candidate` | `syncEntityManagementViewWorkflowStatusVisibility` and hidden state classes exist. Needs test coverage. |
| `EMP-DETAIL-011` | View role options are synchronized from configured permission roles, including newly added or removed permission roles. | `review-candidate` | `syncEntityManagementViewRoleOptions` is called after permission changes and lazy materialization. |
| `EMP-DETAIL-012` | Workflow definition panels expose Workflow details and Workflow builder as collapsible sections, with at most one section open inside a workflow definition at a time. | `review-candidate` | Visual test asserts Workflow details and Workflow builder toggles close/open as expected. |
| `EMP-DETAIL-013` | Workflow builder always has a fixed create-location first status that cannot be removed and shows a base location badge. | `review-candidate` | Visual test asserts Base badge, `aria-disabled`, and no remove control for the create row. |
| `EMP-DETAIL-014` | Workflow builder status rows can add statuses, remove non-fixed statuses, move statuses, and derive label/description keys from the current status name. | `review-candidate` | Visual test covers adding Status 2 and derived keys. Move/remove need focused coverage. |
| `EMP-DETAIL-015` | Subworkflow mode reveals parent workflow and parent status controls and limits parent candidates to sibling workflows. | `review-candidate` | Visual test checks parent select visibility, Review/Lifecycle options, and parent status options. |
| `EMP-DETAIL-016` | Catalog definition panels include catalog metadata, scope, options, generated option values, option move/add/remove, and impact messaging for global scope. | `review-candidate` | Catalog builder exists; add/copy/delete item tests touch catalog item lifecycle. Needs full option behavior coverage. |
| `EMP-DETAIL-017` | Display/placement panels own secondary navigation enablement, secondary-nav entity selection, placement section rows, and attribute placement selection. | `review-candidate` | Placement builder and section controls exist. Needs rendered verification. |
| `EMP-DETAIL-018` | Permission panels expose role identity and capability families; disabled families hide capability lists and enabled families expose select/deselect bulk actions. | `review-candidate` | Permission family renderer and sync helpers exist. Needs direct coverage. |
| `EMP-DETAIL-019` | Generation, Compliance, Migration, and Action Model panels are first-class entity-model sections, not placeholder text-only demo content. | `review-candidate` | Current renderers include structured fields, toggles, action model success/audit/error cards. |
| `EMP-DETAIL-020` | Action model panels keep success body, error body, audit types, route/method, execution mode, compatibility risk, async behavior, and permission mapping visible as distinct behavior groups. | `review-candidate` | Current action model renderer has structured sections. Needs reference-pack states. |

## Open Review Questions

- Which detail-panel behaviors are reusable seam requirements versus demo-only
  proof of what generated entity-definition screens might contain?
- Should collapsible sections be one-open-at-a-time globally, or only within a
  nested item/panel?
- Should all generated forms support edit/read-only mode equally, or are some
  definition areas permanently readonly?

## Evidence Gaps

- Full validation-rule lifecycle.
- Attribute search/privacy/security dependencies.
- Permission family bulk behavior.
- Placement section add/move/remove behavior.
- Action model expanded error card behavior.

