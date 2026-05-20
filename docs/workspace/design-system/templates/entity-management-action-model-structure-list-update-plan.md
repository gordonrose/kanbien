# Entity Management Action Model Structure List Update Plan

Status:

- `planning_note`
- Date: 2026-05-20
- Scope: Placeholder capabilities shown in the `/design-system/templates/entity_management_page`
  drawer region `Action Models - Entity Structure`.
- Implementation status: design-system placeholder list updated
- Runtime/code changes: design-system demo only; no production API,
  persistence, permission, migration, or app-page contract changes

## Purpose

Define the plan for replacing the current placeholder-heavy entity-structure
capability list with a cleaner action-hook catalog that an LLM-assisted builder
can use to choose a governed API action for entity-definition changes.

This plan covers the list sourced from `entityManagementStructureActionCapabilities`
in `src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs`.

It does not approve runtime APIs, migrations, permission grants, generated app
UI, or entity-definition persistence changes. Those remain separate governed
implementation work.

## Implementation Note

The first implementation pass replaced the broad CRUD-heavy placeholder list
with section-aligned action hooks for identity/source authority, workflow,
views, relationships, attributes, catalogs, display, permissions, generation,
compliance, migration, action model, evidence, and LLM guidance.

The second implementation pass added entity-structure hooks that create the
different runtime record capability types shown in `Action Models - Record`.
Those hooks let an LLM choose an entity-definition API action to materialize
record list, read, create, update, lifecycle, export, bulk, relationship, and
status-transition capabilities from the current entity model.

This remains a design-system placeholder catalog, not an approved runtime API
contract.

## Current Problem

The current list has broad coverage, but many entries are placeholder CRUD
actions over nouns. That makes the demo useful for showing density, but too
ambiguous for an LLM that needs to choose one safe hook and call an API.

The list currently mixes:

- entity lifecycle actions
- source authority actions
- attribute and catalog management
- workflow/view/display/relationship management
- LLM guidance management
- evidence management
- permission-role capability editing
- granular display selection helpers

The desired target is a section-aligned action catalog where every callable
action has a clear owner, scope, API route posture, audit/evidence posture,
authz posture, compatibility risk, and validation boundary.

## Target Coverage Model

Each visible entity-management section should have one of these outcomes:

- no direct action because it is derived/read-only
- one broad governed action because the section is intentionally edited as a
  whole
- a small set of granular actions because LLM-assisted editing needs safe,
  deterministic hooks

Section mapping:

| Entity-management section | Target capability family |
| --- | --- |
| Identity | `entity_identity` and `definition_lifecycle` |
| Workflows | `definition_workflow_model` |
| Views | `collection_view` and `view_display_model` |
| Relationships | `relationship_definition` |
| Attributes | `attribute_definition` |
| Catalogs | `catalog_definition` and `catalog_value` |
| Display | `display_model`, `placement`, `placement_section`, and `placement_attribute` |
| Permissions | `role_need`, `authz_mapping`, and `permission_capability` |
| Generation Model | `generation_model` and generation draft actions |
| Compliance Model | `compliance_model` |
| Migration Model | `migration_model`, compatibility checks, and blockers |
| Action Models - Record | runtime record action templates generated for the entity |
| Action Models - Entity Structure | definition-structure action hooks plus record capability generation hooks |

## Planned Changes

### 1. Normalize Naming And Shape

- Convert action keys and family names toward snake_case stored/runtime values.
- Keep labels human-readable in the UI.
- Make each list item represent an action hook, not just a noun.
- Add explicit fields to each placeholder model where missing:
  - action family
  - owning layer
  - owner key
  - API route posture
  - authz/capability posture
  - audit requirement
  - evidence requirement
  - compatibility risk
  - review requirement

### 2. Merge Overlapping Guidance Capabilities

Merge these placeholder domains into one LLM guidance family:

- `AuthoringGuidance`
- `WritingGuidance`
- `QuestionGuidance`

Target actions:

| Action | Purpose |
| --- | --- |
| `read_llm_guidance` | Read reusable guidance for a schema field or section. |
| `edit_authoring_guidance` | Edit how an LLM obtains or defaults a value. |
| `edit_writing_guidance` | Edit writing style, examples, and copy rules. |
| `edit_question_guidance` | Edit how an LLM asks a human for the value. |
| `validate_llm_guidance` | Check guidance does not ask for system-owned or source-derived values. |

### 3. Split Broad Workflow Placeholder

Replace generic workflow CRUD with lifecycle/workflow-model hooks.

Target actions:

| Action | Purpose |
| --- | --- |
| `read_workflow_model` | Read definition workflow and lifecycle configuration. |
| `edit_creation_flow` | Edit how a draft entity or record is created. |
| `edit_review_flow` | Edit review-request, approval, and request-changes behavior. |
| `edit_definition_lifecycle_flow` | Edit definition lifecycle transitions. |
| `edit_record_lifecycle_flow` | Edit managed-record archive, restore, delete, cleanup posture. |
| `validate_workflow_model` | Validate lifecycle/status/workflow consistency. |

### 4. Split View Placeholder

Keep collection-view CRUD, but add safer sub-actions for high-risk view changes.

Target actions:

| Action | Purpose |
| --- | --- |
| `create_collection_view` | Add a governed collection view. |
| `edit_collection_view` | Edit labels, descriptions, and ordering. |
| `set_default_collection_view` | Change default view with compatibility checks. |
| `edit_view_role_eligibility` | Change actor/context eligibility. |
| `edit_view_status_membership` | Change which statuses appear in a view. |
| `edit_view_display_model` | Change list/drawer display posture. |
| `validate_collection_view` | Validate role/status/default/display consistency. |

### 5. Split Relationship Placeholder

Separate relationship definition edits from runtime relationship actions.

Target definition actions:

| Action | Purpose |
| --- | --- |
| `create_relationship_definition` | Add a relationship definition. |
| `edit_relationship_definition` | Edit metadata, boundary, navigation, lifecycle impact. |
| `remove_relationship_definition` | Remove only when compatibility checks pass. |
| `validate_relationship_definition` | Validate boundary, cardinality, lifecycle, and target entity rules. |

Runtime relationship hooks remain in `Action Models - Record`, such as link,
unlink, move, and reassign.

### 6. Split Attribute And Catalog Placeholders

Attribute actions should cover the field itself and its controlled subparts.

Target attribute actions:

| Action | Purpose |
| --- | --- |
| `create_attribute` | Add a field-complete attribute. |
| `edit_attribute_metadata` | Edit labels, type, cardinality, mutability, and requiredness. |
| `edit_attribute_validation` | Add, edit, or remove validation rules. |
| `edit_attribute_search_posture` | Change search operators, storage model, and index posture. |
| `edit_attribute_privacy_security` | Change privacy/security classifications. |
| `remove_attribute` | Remove only when compatibility and migration checks pass. |

Target catalog actions:

| Action | Purpose |
| --- | --- |
| `create_catalog` | Add a reusable value catalog. |
| `edit_catalog` | Edit catalog metadata and source posture. |
| `add_catalog_value` | Add an allowed value. |
| `edit_catalog_value` | Edit label, display order, badge tone, or description. |
| `remove_catalog_value` | Remove value when compatibility rules allow. |
| `reorder_catalog_value` | Change value order. |
| `edit_attribute_option_source` | Attach an attribute to inline, catalog, or relationship-backed options. |

### 7. Reshape Display Capabilities Around Template Keys

Keep the current granular display helpers, but align names to the template
contract:

- surface
- surface variant
- region
- sub-region
- group
- element

Target actions:

| Action | Purpose |
| --- | --- |
| `create_placement` | Add an attribute or relationship placement. |
| `edit_placement` | Change placement metadata, visibility, or interaction posture. |
| `remove_placement` | Remove placement without deleting the underlying attribute. |
| `reorder_placement` | Move placement within an approved region/sub-region/group. |
| `select_placement_attribute` | Add an attribute to a display section. |
| `deselect_placement_attribute` | Remove an attribute from a display section. |
| `reorder_placement_attribute` | Reorder attributes within the section. |
| `show_view_drawer_placement` | Make a placement visible in a view. |
| `hide_view_drawer_placement` | Hide a placement from a view. |
| `validate_display_model` | Validate template region/sub-region/element compatibility. |

### 8. Add Missing Model Families

Add explicit capabilities for sections that currently lack direct structure-list
coverage.

Generation model:

- `read_generation_model`
- `edit_generation_model`
- `preview_generated_page`
- `generate_api_contract_draft`
- `generate_capability_mapping_draft`
- `generate_test_draft`
- `generate_docs_draft`

Compliance model:

- `read_compliance_model`
- `edit_privacy_posture`
- `edit_security_posture`
- `edit_audit_posture`
- `edit_retention_cleanup_posture`
- `edit_export_posture`
- `validate_compliance_model`

Migration model:

- `read_migration_model`
- `edit_migration_model`
- `record_migration_blocker`
- `resolve_migration_blocker`
- `record_compatibility_check`
- `validate_migration_readiness`

Action model:

- `read_action_model`
- `edit_action_model`
- `validate_action_model`
- `generate_action_model_from_sections`

Record capability generation:

- `create_record_list_capability`
- `create_record_read_capability`
- `create_record_create_capability`
- `create_record_update_capability`
- `create_record_archive_capability`
- `create_record_restore_capability`
- `create_record_delete_capability`
- `create_record_export_capability`
- `create_record_bulk_import_capability`
- `create_record_bulk_update_capability`
- `create_record_link_parent_capability`
- `create_record_unlink_parent_capability`
- `create_record_link_child_capability`
- `create_record_unlink_child_capability`
- `create_record_status_transition_capability`

Evidence:

- `attach_entity_evidence`
- `edit_entity_evidence`
- `remove_entity_evidence`
- `reconcile_evidence`
- `attach_field_evidence`

### 9. Clarify Permission Capabilities

Preserve the existing permission-role actions, but separate four concerns:

| Concern | Target action examples |
| --- | --- |
| role need | `capture_role_need`, `edit_role_need` |
| authz mapping | `create_authz_mapping`, `edit_authz_mapping`, `validate_authz_mapping` |
| capability availability | `add_permission_capability`, `remove_permission_capability`, `select_permission_capability_family`, `deselect_permission_capability_family` |
| artifact generation | `generate_permission_mapping_draft` |

Permission changes must remain draft/reviewable until maintained permission
artifacts and tests are updated.

## Implementation Sequence

1. Inventory the current list and mark every existing placeholder as keep,
   merge, split, replace, or remove.
2. Update the data structure in `chatWorkspaceRowDrawer.mjs` without changing
   the rendered layout first.
3. Add grouping metadata so the UI can show section-aligned capability groups
   instead of one long flat placeholder list.
4. Update generated action-model panel copy so structure actions no longer say
   "runtime capability" when the action edits entity-definition structure.
5. Add or update visual tests that assert representative new capability labels
   appear in `Action Models - Entity Structure`.
6. Add coverage for at least one merged family, one split family, and one
   newly added missing family.
7. Re-check the design-system route in browser after the list update.
8. Only after the placeholder list is stable, decide whether to promote these
   names into a governed schema/catalog artifact.

Progress as of 2026-05-20:

- Steps 1, 2, 4, 5, 6, and 7 have an initial implementation pass.
- Step 3 remains intentionally deferred; the list still renders through the
  existing nested-list layout rather than a new grouped UI.
- Step 8 remains deferred.

## Validation Expectations

Minimum local evidence for the list update:

- static inspection of the updated list
- visual test coverage for the `Action Models - Entity Structure` drawer
- route smoke check for `/design-system/templates/entity_management_page`
- review of copy so every placeholder label fits within the card layout
- confirmation that no app page consumes these as real runtime API contracts

If the update later becomes an implementation contract, additional evidence is
needed:

- Product Discovery or steering artifact
- API contract draft
- permission mapping draft
- action schema validation tests
- audit/evidence behavior tests
- migration/compatibility tests for destructive or high-risk actions

## Open Decisions

| Decision | Current recommendation |
| --- | --- |
| Should the list remain flat or grouped? | Group by entity-management section while keeping search/list behavior simple. |
| Should CRUD placeholders remain for demo density? | Keep only where CRUD is genuinely the action model; otherwise replace with intent-specific hooks. |
| Should generation/compliance/migration actions be editable in this demo? | Show as read-only placeholders now; runtime editing requires later governed implementation. |
| Should source authority stay separate from migration model? | Keep separate, but link promotion actions to migration-readiness evidence. |
| Should LLM guidance be one family? | Yes; split into authoring, writing, and question sub-actions inside the family. |

## Non-Goals

- Implementing the APIs behind these actions.
- Updating real permission grants.
- Generating migrations or runtime source.
- Treating the design-system demo list as production contract truth.
- Changing app-page CSS or app adoption posture.
