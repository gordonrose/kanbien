# Governed Entity Creation Capability Matrix Slice Review

Status:

- `first_pass_slice_review`
- Date: 2026-05-18
- Source matrix:
  `2026-05-18-governed-entity-creation-capability-matrix-first-draft.csv`

## Purpose

Classify the first-draft capability rows into implementation posture.

This review keeps the distinction between:

- `entity_builder_platform_capability`: logic the entity-definition system
  should implement or govern directly
- `generated_feature_capability_template`: reusable target capability templates
  for owning features generated or drafted from entity definitions

## Slice Posture Values

| Value | Meaning |
| --- | --- |
| `v1_core` | Candidate for the first implementation slice. |
| `v1_supporting` | Needed to make v1 coherent, but may be smaller/read-only/draft-only. |
| `template_only_v1` | Keep as a reusable template in v1; do not implement runtime behavior inside entity builder. |
| `defer` | Valuable, but not needed for the first implementation slice. |
| `blocked_pending_architecture` | Requires architecture, design-system, topology, authz, asset, or runtime-seam approval before implementation. |

## Recommended V1 Core

These are the smallest coherent builder/platform capabilities for starting
guided entity creation without pretending generated runtime features exist.

| Capability | Posture | Reason |
| --- | --- | --- |
| `definition_propose` | `v1_core` | Starts a section-complete draft from guided human/LLM/source input. |
| `definition_update` | `v1_core` | Allows structured edits to draft definitions. |
| `definition_validate` | `v1_core` | Gives honest blockers before activation/export/page generation. |
| `definition_export_v2` | `v1_core` | Provides explicit canonical export/read shape without changing v1 export. |
| `definition_attribute_add` | `v1_core` | Adds field-complete attributes to the entity shape. |
| `definition_attribute_edit` | `v1_core` | Supports normal refinement of attribute metadata. |
| `definition_validation_rule_edit` | `v1_core` | Lets the builder define validation behavior from approved catalogs. |
| `collection_view_create` | `v1_core` | Creates governed views from role/status discovery and starter defaults. |
| `collection_view_update` | `v1_core` | Lets customers edit recommended views before activation. |
| `collection_view_validate` | `v1_core` | Blocks invalid role/status/default-view combinations. |
| `role_need_capture` | `v1_core` | Captures the business reason for roles, statuses, views, and actions. |
| `definition_preview_ui_defaults` | `v1_core` | Previews generated/default management shape without applying real app changes. |

## Recommended V1 Supporting

These should probably exist in the first implementation plan, but can be
limited, draft-only, read-only, or validation-only.

| Capability | Posture | Reason |
| --- | --- | --- |
| `collection_view_list` | `v1_supporting` | Needed for authoring/review and generated preview. |
| `collection_view_read` | `v1_supporting` | Needed to inspect one view and its status/sub-status membership. |
| `definition_version` | `v1_supporting` | Needed once active definitions can be revised; may be limited if v1 stays draft-first. |
| `definition_activate` | `v1_supporting` | Needed only if v1 includes activation. Otherwise keep as validation target. |
| `definition_supersede` | `v1_supporting` | Needed after activation/versioning; may be deferred if v1 has no active replacement flow. |
| `definition_archive` | `v1_supporting` | Useful for cleanup/visibility of definitions, but not core to first guided creation. |
| `definition_surface_edit` | `v1_supporting` | Needed to capture hierarchy placement and template references; apply/materialization can remain blocked. |
| `definition_search_edit` | `v1_supporting` | Needed for generated filter/search intent; implementation can stay planning-only. |
| `definition_action_edit` | `v1_supporting` | Needed to draft actions/capability mappings; runtime grants remain separate. |
| `definition_generate_test_draft` | `v1_supporting` | Useful for downstream PRD/test planning. |
| `definition_report_generate` | `v1_supporting` | Useful to expose missing evidence, sensitive fields, page readiness, and blockers. |
| `page_materialization_preview` | `v1_supporting` | Needed to preview placement/route/materialization without applying changes. |
| `signoff_request` | `v1_supporting` | Needed if activation/page preview has review gates. |
| `signoff_record` | `v1_supporting` | Needed to preserve approval/rejection evidence. |

## Generated Feature Templates For V1

These should remain reusable templates in the first entity-builder slice. The
entity builder can define, validate, preview, and generate drafts for them, but
the owning feature or approved platform seam owns runtime implementation.
Later target slices may let entity creation build or materialize the backend
functionality and UX for a specific entity's runtime feature. Even then, the
resulting feature seam owns runtime record behavior after adoption.

| Capability | Posture | Reason |
| --- | --- | --- |
| `managed_record_list` | `template_only_v1` | Defines generated list expectations for owning features. |
| `managed_record_search` | `template_only_v1` | Defines search/filter/index expectations. |
| `managed_record_read` | `template_only_v1` | Defines exact read/drawer expectations. |
| `managed_record_create` | `template_only_v1` | Defines create expectations and generated action posture. |
| `managed_record_update` | `template_only_v1` | Defines edit expectations and generated action posture. |
| `managed_record_archive` | `template_only_v1` | Defines normal lifecycle action expectations. |
| `managed_record_restore` | `template_only_v1` | Defines restore expectations when lifecycle supports it. |
| `managed_record_delete` | `template_only_v1` | Defines delete/cleanup expectations but should not be generated casually. |
| `managed_record_purge` | `template_only_v1` | High-risk template only; not normal generated runtime behavior. |
| `managed_record_export` | `template_only_v1` | Defines export expectations; runtime export requires compliance/asset decisions. |
| `managed_record_list_export` | `template_only_v1` | Defines list export expectations; runtime export requires compliance/asset decisions. |
| `managed_record_report_generate` | `template_only_v1` | Defines managed-data report expectations; separate from definition reports. |
| `managed_record_import` | `template_only_v1` | Defines import expectations; file-backed import triggers asset governance. |
| `relationship_link` | `template_only_v1` | Defines relationship link expectations for owning features. |
| `relationship_unlink` | `template_only_v1` | Defines detach expectations for owning features. |
| `relationship_move` | `template_only_v1` | Defines hierarchy movement expectations for owning features. |
| `relationship_reassign` | `template_only_v1` | Defines dependency replacement expectations for owning features. |
| `relationship_validate` | `template_only_v1` | Can be used by definition validation as a template/checklist before runtime adoption. |

## Later Or Blocked Capabilities

These are important, but should not be considered first-slice implementation
unless an explicit architecture/design-system/security decision pulls them
forward.

| Capability | Posture | Reason |
| --- | --- | --- |
| `collection_view_archive` | `defer` | Useful after views are activated/promoted; not needed for draft-first creation. |
| `collection_view_delete` | `defer` | Draft cleanup only; archive is safer once promoted. |
| `definition_attribute_remove` | `defer` | Removal is compatibility-sensitive and less urgent than add/edit. |
| `definition_relationship_edit` | `defer` | Relationship modeling is important but broader than first guided creation unless a pilot entity needs it. |
| `definition_compliance_edit` | `defer` | Baseline compliance assumptions are required, but rich compliance editing can follow. |
| `definition_generate_docs` | `defer` | Useful after canonical export stabilizes; not needed before PRD/API/test planning. |
| `definition_generate_validation_config` | `defer` | Runtime config generation should wait until schema/types are locked. |
| `definition_generate_search_config` | `defer` | Search config generation needs storage/index decisions. |
| `definition_generate_capability_mapping_draft` | `defer` | Useful after action model and role needs stabilize. |
| `definition_generate_api_contract_draft` | `defer` | Should follow PRD/capability-scope decisions. |
| `page_materialization_apply` | `blocked_pending_architecture` | Requires persistent hierarchy materialization seam and design-system app-consumable template signoff. |
| `page_visibility_stage` | `blocked_pending_architecture` | Requires selected-user/role staging storage and server-side enforcement model. |
| `page_visibility_promote` | `blocked_pending_architecture` | Requires promotion/demotion authority, audit, and runtime visibility model. |
| `page_visibility_demote` | `blocked_pending_architecture` | Requires rollback semantics, hierarchy compatibility, and audit model. |

## Suggested First Implementation Slice

The first practical slice should be:

1. Create a draft governed entity definition.
2. Capture role needs in plain language.
3. Select or customize starter statuses.
4. Create and edit collection views from those statuses.
5. Add/edit attributes and validation rules.
6. Capture app placement as desired topology, referencing persistent hierarchy
   where possible.
7. Validate the draft with explicit blockers.
8. Export canonical v2 draft/read shape.
9. Preview generated/default UI and page placement without applying runtime
   routes or visibility.

This slice gives us a real entity-creation workflow while avoiding premature
runtime generation, permission grants, migrations, or app-page materialization.

## Open Review Questions

| Question | Suggested answer for now |
| --- | --- |
| Should activation be in v1? | Only if export/read v2 and validation are stable enough; otherwise keep draft/export first. |
| Should page apply be in v1? | No. Preview only until hierarchy/materialization and design-system contracts are approved. |
| Should runtime managed-record CRUD be in v1? | No. Treat as generated feature templates for downstream owning features. |
| Should relationship editing be in v1? | Only if the first pilot entity requires relationships; otherwise defer. |
| Should selected-user staged visibility be in v1? | No. Capture desired stage in preview, but defer runtime enforcement until architecture is approved. |
