# Governed Entity Definition Schema Formalization

Planning status:

- `schema_formalization_draft`
- Derived from
  `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md`
- This is a planning artifact for the formal schema/catalog/validation shape.
- It is not an implementation contract, migration, route change, runtime schema,
  generated artifact, or UI approval.

## Purpose

Convert the draft v1 canonical governed entity definition model into a precise
schema-planning shape that can later become a governed implementation contract.

This artifact is intended to reduce future human review load. The model should
be reviewed by exception: open risks, compatibility questions, and implementation
ownership decisions, not by re-reading every field from scratch.

## Source Decisions

The schema formalization follows these locked discovery decisions:

| Decision | Formalization rule |
| --- | --- |
| Canonical model authority | The model defined in the 2026-05-17 discovery stream supersedes current `entityBuilder` as the target shape. Current `entityBuilder` is compatibility/source material. |
| Required top-level sections | Every entity definition must include every top-level section, even when the value is `none`, `not_applicable`, or an empty array. |
| Key casing | JSON property names use lowerCamel. Stable keys and catalog values use snake_case. |
| Current `attributeKind` | Do not preserve `attributeKind` as canonical. Map existing `persisted`/`computed` values into richer canonical fields. |
| Enum migration | Existing `enum` migrates to `limited_enum` by default unless evidence supports `expanded_enum`. |
| Options migration | Existing `none`, `inline`, and `catalog_reference` map directly. `relationship_source` is additive unless evidence clearly shows relationship-backed options. |
| Display order migration | Existing global attribute `displayOrder` maps into default surface placement order. New ordering lives on placements. |
| Validation messages | Existing literal `errorMessage` becomes fallback copy. Canonical messages use message keys plus fallback copy. |
| Export/read shape | Full canonical model requires a new explicit export/read shape, expected as `exportFormatVersion = 2` or equivalent. Do not silently change export v1. |
| Definition status | Definition-version status remains separate from managed-record system lifecycle. |

## Formal Top-Level Shape

Required object:

```json
{
  "schemaVersion": "governed_entity_definition_v1",
  "definitionStatus": "draft",
  "entityIdentity": {},
  "sourceAuthority": {},
  "evidenceRegistry": [],
  "attributes": [],
  "presentationGroups": [],
  "operationalStatusSet": {},
  "relationships": [],
  "searchModel": {},
  "surfaceModel": {},
  "actionModel": {},
  "complianceModel": {},
  "generationModel": {},
  "migrationModel": {}
}
```

Required top-level validation:

| Rule | Failure |
| --- | --- |
| `schemaVersion` must be present and supported. | `unsupported_schema_version` |
| `definitionStatus` must be a valid definition-version status. | `invalid_definition_status` |
| Every required section must be present. | `missing_required_section` |
| Unknown top-level sections are denied unless explicitly versioned. | `unknown_top_level_section` |
| Stable keys/catalog values must use snake_case. | `invalid_stable_key_format` |
| JSON property names must match the schema. | `invalid_schema_property` |

## Schema Dependency Catalogs

The entity definition schema is only governed if its dependent catalogs are also
explicit. These catalogs are second-level schema dependencies, not freeform
strings.

Required catalog families:

| Catalog | Purpose | Owner posture |
| --- | --- | --- |
| Attribute category catalog | Semantic purpose of an attribute. | entity-definition schema |
| Attribute type catalog | Shape of the attribute value. | entity-definition schema |
| Cardinality catalog | Single vs multiple values. | entity-definition schema |
| Mutability catalog | Who/what may change the attribute and when. | entity-definition schema |
| Privacy/security catalogs | Data classification and sensitivity. | compliance/security governance |
| Validation rule catalog | Allowed validation rules, compatible types, arguments, and default messages. | entity-definition schema plus validation engine |
| Options mode catalog | Where selectable values come from. | entity-definition schema |
| Search storage catalog | How searchable values are stored/indexed. | entity-definition schema plus persistence/search planning |
| Relationship catalogs | Relationship category, resolution, ownership, navigation, boundary, and lifecycle impact. | entity-definition schema |
| Surface/template contract catalogs | Allowed surfaces, variants, regions, elements, and combinations. | design-system/page-template governance |
| Action family catalog | What kind of action the row describes. | entity-definition schema |
| Capability family catalog | What product/security capability family governs an action. | authz/capability governance |
| Capability definition catalog | Concrete capability templates that can map to deterministic route/domain/persistence/test implementation patterns. | authz/capability governance plus feature architecture |
| Action error catalog | Non-attribute-validation action failure reasons and messages. | entity-definition schema plus API/job contracts |
| Generation output catalog | What the definition may generate or drive. | generation governance |
| Migration compatibility catalog | Required checks before old truth becomes new truth. | migration/source-authority governance |
| LLM authoring guidance catalog | How LLM-assisted workflows should obtain, infer, write, default, review, and update schema values. | entity-definition authoring governance |

## LLM Authoring Guidance Catalog

The entity definition stores canonical truth. The LLM authoring guidance catalog
does not store entity truth; it teaches LLM-assisted workflows how to populate
and maintain that truth with low human friction.

Guidance should be reusable across entity definitions unless an explicit
field/entity override is approved.

Guidance catalog entry:

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `guidanceKey` | string | none | Stable snake_case guidance entry key. |
| `sectionKey` | enum/string | none | Target top-level section, such as `entityIdentity` or `attributes`. |
| `fieldPath` | string | none | Schema field path the guidance applies to. |
| `valueType` | enum/string | none | Expected value shape, such as enum, string, boolean, array, object, localization pair. |
| `authoringContexts` | object | none | Context-specific guidance by authoring context. |
| `writingGuidance` | object | explicit object | Tone, audience, content, and examples. |
| `questionGuidance` | object | explicit object | How the LLM asks a human when it must ask. |
| `defaultGuidance` | object | explicit object | Default/fallback behavior. |
| `validationGuidance` | object | explicit object | Common mistakes and validation expectations. |
| `reviewGuidance` | object | explicit object | When human or technical review is required. |

Authoring context catalog:

| Value | Meaning |
| --- | --- |
| `new_entity` | A human and LLM are creating a new entity definition from scratch. |
| `entity_update` | A human and LLM are changing an existing entity definition. |
| `repo_migration` | The definition is being created from existing repo/source artifacts. |
| `persistent_revision` | The definition already exists as persistent truth and is being revised. |
| `schema_formalization` | The model is being converted into formal schema/catalog/validation artifacts. |
| `implementation_planning` | The formal schema is being converted into implementation tasks. |

Authoring mode catalog:

| Value | Meaning |
| --- | --- |
| `ask_human` | The LLM must ask the human because the value is product/business truth. |
| `recommend_and_confirm` | The LLM may recommend a value and ask for confirmation. |
| `infer_from_context` | The LLM may infer from nearby context and cite evidence. |
| `use_platform_default` | The LLM should apply a governed default without asking. |
| `derive_from_source_truth` | The LLM should derive from source artifacts such as code, migrations, API contracts, or data dictionaries. |
| `technical_review_required` | The LLM may draft, but technical review is required before lock-in. |
| `system_generated` | The system/tooling should generate the value; the LLM should not ask. |
| `never_ask` | The LLM should not ask the human directly because the field is system-owned, derived, or not meaningful to business users. |

Context guidance shape:

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `primaryMode` | enum | none | Preferred authoring mode for this context. |
| `fallbackMode` | enum | `none` | Secondary mode when primary is not enough. |
| `askWhen` | string/array | `none` | Conditions where the LLM should ask a human. |
| `doNotAskWhen` | string/array | `none` | Conditions where the LLM should avoid asking. |
| `evidenceRequired` | boolean | none | Whether evidence is required. |
| `reviewRequired` | boolean | none | Whether human/technical review is required. |
| `confidenceThreshold` | enum | `medium` | `low`, `medium`, `high`, or `must_be_certain`. |

Writing guidance shape:

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `audience` | enum/string | none | Intended reader, such as business user, platform maintainer, builder, auditor, or developer. |
| `tone` | enum/string | none | Plain-language tone expected for fallback text. |
| `requiredContent` | array | `[]` | What good copy must include. |
| `avoid` | array | `[]` | Wording or behavior to avoid. |
| `goodExample` | string | `none` | Example of a good value. |
| `badExample` | string | `none` | Example of a poor value. |

Question guidance shape:

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `questionStyle` | enum | `plain_language_single_question` | How the LLM should ask. |
| `maxQuestionsAtOnce` | integer | `1` | Usually one. |
| `avoidJargon` | boolean | true | Avoid platform/internal jargon unless user used it first. |
| `includeRecommendation` | boolean | true | Recommend a default when useful. |
| `confirmAs` | enum | `rule_or_exception` | Ask whether the answer is a rule, usual case, exception, out of scope, or deferred. |

Question style values:

- `plain_language_single_question`
- `recommendation_then_confirmation`
- `exception_review`
- `technical_review_prompt`
- `do_not_prompt`

Review trigger catalog:

| Value | Meaning |
| --- | --- |
| `foundational_business_truth` | Human should confirm because the value defines why the entity exists or what it means. |
| `security_or_privacy_sensitive` | Human/technical review required due to sensitive data or access posture. |
| `cross_boundary_behavior` | Review required because tenant/org/business-unit boundaries are involved. |
| `breaking_compatibility_risk` | Review required because existing contracts may break. |
| `design_system_contract_missing` | Review required because approved surface/template contract does not exist yet. |
| `source_evidence_conflict` | Review required because repo/source artifacts disagree. |
| `low_confidence_inference` | Review required because inferred value lacks enough evidence. |
| `legal_or_compliance_wording` | Review required for formal compliance wording. |

Minimum required guidance entries for schema formalization:

| Target | Required guidance |
| --- | --- |
| `entityIdentity.descriptionFallback` | Human-facing, context-rich explanation; ask/recommend in new entity; derive/review in migration. |
| `entityIdentity.purposeFallback` | Foundational business truth; ask or recommend-and-confirm. |
| `sourceAuthority.sourcePrecedence` | Derive from source truth; technical review required when sources conflict. |
| `attributes[].category` | Infer from attribute meaning; review when ambiguous. |
| `attributes[].attributeType` | Infer from source truth; technical review if storage/API evidence conflicts. |
| `attributes[].mutability` | Derive from API/persistence/lifecycle rules; technical review for system/security fields. |
| `attributes[].privacyClassification` | Infer conservatively; review for PII/sensitive data. |
| `attributes[].securityClassification` | Infer conservatively; review for restricted/classified data. |
| `attributes[].placements` | Use platform/template defaults; review if design-system contract missing. |
| `relationships[]` | Derive from source/data dictionary; review cross-boundary behavior. |
| `searchModel` | Default to not searchable; derive only from approved search/index evidence. |
| `surfaceModel` | Use approved templates; review if route/template keys are not approved. |
| `actionModel.actions[]` | Derive from capability/API/planning artifacts; review breaking or authz-sensitive actions. |
| `complianceModel` | Derive from attributes and policy defaults; review sensitive/legal cases. |
| `migrationModel` | Derive from current artifacts; review blockers and compatibility risk. |

## Capability Family Catalog

Capability families classify the product/security intent behind an action. They
are not permissions by themselves; concrete capability keys and grants remain
owned by authz/capability architecture.

| Value | Meaning |
| --- | --- |
| `read_discovery` | Finds, filters, compares, reads, or renders entity truth without changing it. |
| `authoring` | Creates or changes descriptive/business/schema truth outside lifecycle transitions. |
| `lifecycle` | Changes currentness, visibility, archive, restore, delete, purge, or supersession posture. |
| `relationship_control` | Creates, moves, reorders, replaces, detaches, or validates entity relationships. |
| `governance_approval` | Approves, rejects, locks, unlocks, reviews, or requests changes. |
| `evidence_audit` | Records, reads, reconciles, or attaches proof/evidence. |
| `generation_sync` | Generates, previews, publishes, refreshes, reconciles, or marks artifacts stale. |
| `automation` | Proposes or executes work by script, job, LLM workflow, or controlled machine actor. |
| `import_export` | Imports, dry-runs, validates, exports, packages, or downloads entity data. |
| `security_access` | Grants, revokes, restricts, reveals, masks, or evaluates sensitive access. |
| `retention_cleanup` | Holds, releases, expires, cleans, anonymizes, purges, or records cleanup failure. |
| `support_operations` | Supports diagnosis, recovery, reconciliation, or operator-only correction. |

Capability authority worlds:

| Value | Meaning |
| --- | --- |
| `root` | Platform/root operator authority. |
| `tenant` | Tenant/account-scoped authority. |
| `shared_cross_tenant` | Cross-tenant authority explicitly approved by architecture. |
| `system` | System/job/script authority. |
| `public` | Public/no-session authority, only when explicitly approved. |
| `support` | Support/operator workflow authority distinct from normal product use. |

Capability mapping posture:

| Value | Meaning |
| --- | --- |
| `not_applicable` | No capability maps to this action. |
| `planned` | Capability is planned but not implemented. |
| `current` | Capability exists and is current runtime truth. |
| `target` | Capability is target architecture but not current runtime truth. |
| `blocked` | Capability mapping is intentionally blocked pending architecture/product decision. |

Capability enforcement posture:

| Value | Meaning |
| --- | --- |
| `runtime_enforced` | Runtime checks enforce the capability today. |
| `documentation_only` | Documented target/plan, not enforced at runtime yet. |
| `design_time_only` | Used only to validate/generated planned artifacts. |
| `manual_operational` | Enforced by controlled operational process. |
| `not_applicable` | No capability enforcement applies. |

## Capability Definition Catalog

Capability families are too broad to drive deterministic implementation by
themselves. A governed entity definition also needs concrete capability
definitions that describe what the platform knows how to implement or generate
in a predictable way.

A capability definition is a reusable implementation-aware template. Entity
actions can map to these templates, and later tooling can use them to propose
routes, domain functions, validation, persistence checks, permission mappings,
docs, and tests.

Capability definition entry:

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `capabilityDefinitionKey` | string | none | Stable snake_case key for the reusable capability template. |
| `capabilityFamily` | enum | none | Family from the capability family catalog. |
| `operationKey` | string | none | Canonical operation such as `list`, `read`, `create`, or `archive`. |
| `implementationSeam` | enum | none | Whether this capability is implemented through a platform seam, feature seam, shared seam, generated seam, or manual operational seam. |
| `defaultCapabilityKeyPattern` | string | none | Pattern for concrete capability keys, such as `{entity_key}.read`. |
| `actorWorldsAllowed` | array | none | Allowed authority worlds such as `root`, `tenant`, or `system`. |
| `defaultExecutionMode` | enum | none | Suggested execution mode. |
| `defaultRoutePattern` | object | explicit object | Suggested route/job/script shape when applicable. |
| `domainBehaviorContract` | object | explicit object | Expected domain behavior and invariants. |
| `persistenceContract` | object | explicit object | Expected persistence/read/write/index behavior. |
| `authzContract` | object | explicit object | Required authz context and object-level checks. |
| `auditContract` | object | explicit object | Required audit/evidence behavior. |
| `testContract` | object | explicit object | Required unit/integration/security/audit/persistence coverage. |
| `artifactContract` | object | explicit object | Required docs/API/permission/data-dictionary/generated artifact updates. |
| `compatibilityContract` | object | explicit object | Breaking-change and migration requirements. |
| `defaultErrorKeys` | array | `[]` | Action error keys expected for this capability. |
| `generationPosture` | enum | `draft_only` | Whether this can be generated, proposed, or only documented. |

Implementation seam catalog:

| Value | Meaning |
| --- | --- |
| `feature_seam` | Implemented inside the entity's owning feature boundary. |
| `platform_seam` | Implemented by a shared platform service or platform-level feature. |
| `shared_feature_seam` | Implemented by a reusable shared feature seam consumed by multiple owning features. |
| `definition_registry_seam` | Implemented by the entity-definition/registry layer itself. |
| `design_system_seam` | Implemented through approved design-system/template contracts. |
| `generation_seam` | Implemented by generation/materialization tooling. |
| `job_scheduler_seam` | Implemented by platform job/scheduler infrastructure. |
| `external_integration_seam` | Implemented through an approved external-system integration. |
| `manual_operational_seam` | Implemented through a controlled manual/support/operational process. |
| `not_applicable` | No implementation seam applies. |

Repo seam alignment requirement:

These seam values are schema-planning terms. They must not be treated as
already-implemented repo architecture until the repo's architecture,
manifests, dependency graph, capability mappings, and design-system/generation
governance are updated to recognize them.

Before implementation, the repo needs an architecture alignment pass for:

- `definition_registry_seam`
- `generation_seam`
- `design_system_seam`
- `job_scheduler_seam`
- `shared_feature_seam`
- `external_integration_seam`
- `manual_operational_seam`

That alignment pass should decide which seams are:

- already represented by existing repo concepts
- new names for existing concepts
- genuinely new architecture seams requiring ADR or standards updates
- implementation-only details that should not become durable architecture terms

Implementation of capabilities using these seam values is blocked until the
relevant seam is approved, documented, and connected to repo governance.

Capability generation posture:

| Value | Meaning |
| --- | --- |
| `not_generateable` | Must not be generated by tooling. |
| `draft_only` | Tooling may draft planning artifacts or code proposals. |
| `preview_then_apply` | Tooling may preview then apply through approved materialization. |
| `manual_implementation_required` | Human/engineer implementation required. |
| `blocked_until_approved` | Blocked until explicit approval or missing architecture exists. |

Core managed-record capability definitions:

| Capability definition key | Family | Operation | Deterministic implementation expectation |
| --- | --- | --- | --- |
| `managed_record_list` | `read_discovery` | `list` | Seam: usually `feature_seam`; platform may provide shared pagination/search helpers. Paginated list, default sort, lifecycle visibility, boundary filtering, search/filter hooks, list response shape, list tests. |
| `managed_record_search` | `read_discovery` | `search` | Seam: feature + search/platform seam as approved. Search operators/index posture from `searchModel`, boundary filtering, deterministic result shape, search tests. |
| `managed_record_read` | `read_discovery` | `read` | Seam: usually `feature_seam`. Exact record read, lifecycle visibility rule, object boundary/authz check, not-found behavior, read tests. |
| `managed_record_create` | `authoring` | `create` | Seam: usually `feature_seam`. Create allowed mutable fields, reject system-managed fields, apply defaults, validate required fields, stamp IDs/timestamps, create tests. |
| `managed_record_update` | `authoring` | `update` | Seam: usually `feature_seam`. Update only updateable fields, reject system/lifecycle fields, refresh `updated_at`, validate uniqueness/search constraints, update tests. |
| `managed_record_archive` | `lifecycle` | `archive` | Seam: usually `feature_seam`. Transition to archived posture, enforce relationship lifecycle impacts, refresh audit/timestamps, archive tests. |
| `managed_record_restore` | `lifecycle` | `restore` | Seam: usually `feature_seam`. Re-check uniqueness/boundaries/parent status, restore visibility, refresh audit/timestamps, restore tests. |
| `managed_record_delete` | `lifecycle` | `delete` | Seam: feature lifecycle plus platform scheduler when pending deletion/cleanup applies. Start soft-delete or pending-delete posture, exclude from normal reads, trigger cleanup timer when applicable, delete tests. |
| `managed_record_purge` | `retention_cleanup` | `purge` | Seam: feature lifecycle plus platform/manual operational seam. Hard delete only when approved, legal-hold/export/retention checks, purge tests and runbook evidence. |
| `managed_record_export` | `import_export` | `export` | Seam: feature export plus platform asset/job seam when file output exists. Export approved fields only, apply privacy/security/export posture, job or sync result model, export tests. |
| `managed_record_list_export` | `import_export` | `export` | Seam: feature export plus platform asset/job seam when file output exists. Export current filtered list, selected records, or approved list projection with privacy/security/audit/export controls. |
| `managed_record_report_generate` | `import_export` | `report_generate` | Seam: feature/reporting seam plus platform job/asset seam when asynchronous or file-backed. Generate reports from actual managed record data with privacy/security/audit/retention controls. |
| `managed_record_import` | `import_export` | `import` | Seam: feature import plus platform upload/job seam when file-backed. Validate imported shape, dry-run posture, idempotency/conflict behavior, import tests. |

Relationship capability definitions:

| Capability definition key | Family | Operation | Deterministic implementation expectation |
| --- | --- | --- | --- |
| `relationship_link` | `relationship_control` | `link` | Seam: usually `feature_seam`, with platform relationship validators where shared. Validate target exists, boundary rules, cardinality, status, authz, audit. |
| `relationship_unlink` | `relationship_control` | `unlink` | Seam: usually `feature_seam`. Validate detach/delete posture, lifecycle impact, authz, audit. |
| `relationship_move` | `relationship_control` | `move` | Seam: usually `feature_seam`. Validate parent/target, no cycle, max depth, same-boundary rules, child impact. |
| `relationship_reassign` | `relationship_control` | `reassign` | Seam: usually `feature_seam`. Validate replacement target and dependency behavior before detaching old target. |
| `relationship_validate` | `relationship_control` | `validate` | Seam: feature or shared relationship validation seam. Read-only validation of relationship consistency and boundary posture. |

Definition capability definitions:

| Capability definition key | Family | Operation | Deterministic implementation expectation |
| --- | --- | --- | --- |
| `definition_propose` | `authoring` | `propose_definition` | Seam: `definition_registry_seam`. Create draft/proposed definition from human, LLM, or source inputs. |
| `definition_validate` | `governance_approval` | `validate_definition` | Seam: `definition_registry_seam`. Validate schema completeness, catalogs, relationships, surfaces, compliance, and migration posture. |
| `definition_update` | `authoring` | `update_definition` | Seam: `definition_registry_seam`. Update draft definition metadata only where allowed. |
| `definition_version` | `lifecycle` | `version_definition` | Seam: `definition_registry_seam`. Create replacement version while preserving historical truth. |
| `definition_activate` | `lifecycle` | `activate_definition` | Seam: `definition_registry_seam`. Activate only validation-passing definition version. |
| `definition_supersede` | `lifecycle` | `supersede_definition` | Seam: `definition_registry_seam`. Supersede old active version without mutating history. |
| `definition_archive` | `lifecycle` | `archive_definition` | Seam: `definition_registry_seam`. Archive retained definition version/lineage when allowed. |
| `definition_export_v2` | `import_export` | `export_definition` | Seam: `definition_registry_seam`. Export/read full canonical v2 shape without changing v1 export. |

Definition-structure capability definitions:

| Capability definition key | Family | Operation | Deterministic implementation expectation |
| --- | --- | --- | --- |
| `definition_attribute_add` | `authoring` | `add_attribute` | Seam: `definition_registry_seam`. Add field-complete attribute with validation, search, source, compliance, and placement defaults. |
| `definition_attribute_edit` | `authoring` | `edit_attribute` | Seam: `definition_registry_seam`. Edit attribute metadata with compatibility checks. |
| `definition_attribute_remove` | `authoring` | `remove_attribute` | Seam: `definition_registry_seam`. Remove attribute only when migration/export/runtime compatibility rules pass. |
| `definition_validation_rule_edit` | `authoring` | `edit_validation_rule` | Seam: `definition_registry_seam`. Add/edit/remove validation rules using validation catalog compatibility. |
| `definition_relationship_edit` | `relationship_control` | `edit_relationship` | Seam: `definition_registry_seam`. Add/edit/remove relationship definitions with boundary and lifecycle validation. |
| `definition_surface_edit` | `authoring` | `edit_surface_model` | Seam: definition registry plus `design_system_seam`. Change template/surface/routing metadata using approved design-system/topology contracts. |
| `definition_search_edit` | `authoring` | `edit_search_model` | Seam: definition registry plus feature/search seam review. Change searchable/sort/filter/facet posture with storage/index checks. |
| `definition_compliance_edit` | `security_access` | `edit_compliance_model` | Seam: definition registry plus compliance/security governance seam. Change privacy/security/retention/export posture with review triggers. |
| `definition_action_edit` | `governance_approval` | `edit_action_model` | Seam: `definition_registry_seam`. Add/edit/remove action metadata and capability mappings. |

Automation/generation capability definitions:

| Capability definition key | Family | Operation | Deterministic implementation expectation |
| --- | --- | --- | --- |
| `definition_generate_docs` | `generation_sync` | `generate_docs` | Seam: `generation_seam`. Generate deterministic docs from canonical definition. |
| `definition_preview_ui_defaults` | `generation_sync` | `preview_ui_defaults` | Seam: generation plus `design_system_seam`. Preview placements/surfaces without applying real UI changes. |
| `definition_generate_validation_config` | `generation_sync` | `generate_validation_config` | Seam: `generation_seam`. Generate validation config from catalog-compatible rules. |
| `definition_generate_search_config` | `generation_sync` | `generate_search_config` | Seam: generation plus feature/search review. Generate search config from approved search model. |
| `definition_generate_capability_mapping_draft` | `generation_sync` | `generate_capability_mapping_draft` | Seam: generation plus authz/capability governance. Draft capability mappings from action model. |
| `definition_generate_api_contract_draft` | `generation_sync` | `generate_api_contract_draft` | Seam: `generation_seam`. Draft API contract proposals from actions/capabilities. |
| `definition_generate_test_draft` | `generation_sync` | `generate_test_draft` | Seam: `generation_seam`. Draft test cases from schema, actions, validation, relationships, and compatibility posture. |
| `definition_report_generate` | `generation_sync` | `generate_definition_report` | Seam: `generation_seam`. Generate reports about the entity definition itself, such as sensitive fields, searchable fields, placements, missing evidence, or compatibility gaps. |

Generation/output boundary rule:

| Output kind | Capability area |
| --- | --- |
| Exports or reports containing actual managed record data | Managed-record export/report capabilities, governed by privacy, security, audit, retention, asset/export, and actor permissions. |
| Reports or generated artifacts describing the entity definition itself | Definition generation outputs, governed by schema/source/evidence/generation posture. |

Capability definition validation:

| Rule | Failure |
| --- | --- |
| Every action with a capability mapping must reference an approved capability definition or mark the mapping as custom-approved. | `missing_capability_definition` |
| Capability family must match the referenced capability definition. | `capability_family_mismatch` |
| Operation key must be allowed by the referenced capability definition. | `capability_operation_mismatch` |
| Implementation seam must be declared for every concrete capability mapping. | `missing_implementation_seam` |
| Implementation seam must be compatible with the referenced capability definition and entity owning layer. | `implementation_seam_mismatch` |
| Route/job/script mapping must satisfy the capability definition's implementation expectation. | `capability_route_contract_mismatch` |
| Required authz, audit, persistence, compatibility, and test contracts must be present or explicitly deferred with approval. | `capability_contract_incomplete` |

## Definition Status Catalog

Definition-version statuses:

| Value | Meaning |
| --- | --- |
| `draft` | Definition version is editable and not active truth. |
| `active` | Definition version is current canonical truth. |
| `superseded` | Definition version was replaced by a newer version. |
| `archived` | Definition version is retained but not normal active truth. |

Managed-record lifecycle is separate and belongs to the entity's record model.

## Entity Identity Schema

Required fields:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `entityKey` | string | none | snake_case, unique stable entity key |
| `singularLabelKey` | string | none | localization key |
| `singularLabelFallback` | string | none | non-empty human label |
| `pluralLabelKey` | string | none | localization key |
| `pluralLabelFallback` | string | none | non-empty human label |
| `descriptionKey` | string | none | localization key |
| `descriptionFallback` | string | none | context-rich human-facing description |
| `purposeKey` | string | none | localization key |
| `purposeFallback` | string | none | why the platform manages this entity |
| `owningFeatureKey` | string | none | stable feature key or `not_yet_assigned` |
| `owningFeaturePosture` | enum | none | `implemented`, `planned`, `not_yet_assigned` |
| `owningLayer` | enum | none | `feature`, `platform`, `system`, `shared` |
| `entityFamilyKey` | string | `none` | snake_case or `none` |
| `managementScope` | enum | none | `root`, `tenant`, `shared_cross_tenant`, `system`, `public` |
| `definitionVersion` | string/integer | none | stable version token |

## Source Authority Schema

Required fields:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `currentAuthority` | enum | none | `repo_artifacts`, `runtime_source`, `planning_artifact`, `persistent_entity_definition`, `mixed_transitional` |
| `targetAuthority` | enum | none | `persistent_entity_definition`, `external_system_of_record` |
| `transitionPosture` | enum | none | `not_yet_migrated`, `partially_migrated`, `mirrored_transitional`, `persistent_primary` |
| `sourcePrecedence` | array | none | non-empty ordered source keys |
| `markdownPosture` | enum | none | `source`, `source_independent_planning`, `mirrored_transitional`, `generated_output`, `not_applicable` |
| `evidenceKeys` | array | `[]` | keys must exist in `evidenceRegistry` |

## Evidence Registry Schema

Each evidence entry:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `evidenceKey` | string | none | unique snake_case key |
| `sourceType` | enum | none | approved evidence source type |
| `sourceLocationType` | enum | none | `repo_path`, `persistent_record`, `external_ref`, `not_applicable` |
| `repoPath` | string | `none` | required when location type is `repo_path` |
| `persistentRecordRef` | string | `none` | required when location type is `persistent_record` |
| `externalRef` | string | `none` | required when location type is `external_ref` |
| `transitionPosture` | string | `not_applicable` | migration posture for this evidence |
| `proofStatement` | string | none | non-empty proof statement |
| `reviewedAt` | date/string | `not_reviewed` | ISO date or `not_reviewed` |

Approved `sourceType` values:

- `source_code`
- `migration`
- `api_contract`
- `data_dictionary`
- `feature_doc`
- `prd`
- `technical_steering`
- `adr`
- `capability_matrix`
- `permission_mapping`
- `test_evidence`
- `runtime_evidence`
- `decision_log`
- `generated_artifact`
- `external_standard`
- `persistent_record`

## Attribute Schema

Each attribute is field-complete.

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `attributeKey` | string | none | unique snake_case key within entity |
| `labelKey` | string | none | localization key |
| `labelFallback` | string | none | non-empty label |
| `descriptionKey` | string | none | localization key |
| `descriptionFallback` | string | none | non-empty description |
| `category` | enum | none | approved attribute category |
| `attributeType` | enum | none | approved attribute type |
| `valueCardinality` | enum | none | `single`, `multiple` |
| `itemLimits` | object | none | `not_applicable` for single; numeric/`none` for multiple |
| `required` | boolean | none | explicit boolean |
| `systemManaged` | boolean | none | explicit boolean |
| `mutability` | enum | none | approved mutability value |
| `privacyClassification` | enum | none | `none`, `not_sensitive`, `sensitive` |
| `sensitivePrivacyCategory` | enum/string | `not_applicable` | required when privacy is `sensitive` |
| `securityClassification` | enum | none | `none`, `internal`, `restricted`, `classified` |
| `securityClassificationLevel` | enum/string | `not_applicable` | required when security is `classified` |
| `validationRules` | array | `[]` | rules compatible with attribute type |
| `options` | object | explicit `none` block | compatible with attribute type |
| `search` | object | `not_searchable` block | compatible with search model |
| `placements` | array | `[]` | every placement references approved surface/element/group |
| `sourceMetadata` | object | explicit not-applicable block | required for derived/calculated/source-sensitive values |
| `evidenceKeys` | array | `[]` | keys must exist in `evidenceRegistry` |

Approved `category` values:

- `identity`
- `core`
- `secondary`
- `metadata`
- `system_lifecycle`
- `operational_lifecycle`
- `parent_relation`
- `child_relation`
- `domain_relation`
- `evidence`

Approved `mutability` values:

- `immutable`
- `create_only`
- `updateable`
- `system_updateable`
- `lifecycle_managed`
- `relationship_managed`
- `derived`
- `calculated`

Approved `attributeType` values:

- `string`
- `text`
- `boolean`
- `integer`
- `decimal`
- `uuid`
- `email`
- `url`
- `date`
- `datetime`
- `date_range`
- `datetime_range`
- `limited_enum`
- `expanded_enum`
- `coordinates`
- `json`
- `money`
- `phone_number`
- `country_code`
- `timezone`
- `relationship_reference`
- `image_reference`
- `video_reference`
- `audio_reference`
- `document_reference`
- `spreadsheet_reference`

Generic file references remain denied by default.

## Privacy And Security Catalogs

Privacy:

| Field | Values |
| --- | --- |
| `privacyClassification` | `none`, `not_sensitive`, `sensitive` |
| `sensitivePrivacyCategory` | `racial_or_ethnic_origin`, `political_opinions`, `religious_or_philosophical_beliefs`, `trade_union_membership`, `health_data`, `sex_life_or_sexual_orientation`, `criminal_convictions`, `government_identifiers`, `financial_data`, `medical_or_biometric_data`, `not_applicable` |

Security:

| Field | Values |
| --- | --- |
| `securityClassification` | `none`, `internal`, `restricted`, `classified` |
| `securityClassificationLevel` | `classification_level_1`, `classification_level_2`, `classification_level_3`, `not_applicable` |

## Options Schema

Required options block:

| Field | Values |
| --- | --- |
| `optionsMode` | `none`, `inline`, `catalog_reference`, `relationship_source` |
| `inlineOptions` | required only for `inline`; otherwise `[]` |
| `catalogKey` | required only for `catalog_reference`; otherwise `none` |
| `relationshipSource` | required only for `relationship_source`; otherwise explicit not-applicable block |

Inline/catalog options require:

- `optionKey`
- `labelKey`
- `labelFallback`
- optional `descriptionKey`
- optional `descriptionFallback`
- `displayOrder`

Relationship-source options require:

- `targetEntityKey`
- `valueAttributeKey`
- `labelAttributeKey`
- optional description/subtitle/badge mappings
- boundary rules
- allowed statuses
- exclusion rules

## Validation Rule Schema

Each validation rule:

| Field | Type | Default |
| --- | --- | --- |
| `ruleKey` | string | none |
| `arguments` | object | `{}` |
| `messageKey` | string | derived from catalog unless overridden |
| `messageFallback` | string | derived from catalog or migrated literal message |
| `severity` | enum | `error` |
| `displayOrder` | integer | explicit order |

Validation must reject rules incompatible with the attribute type/cardinality.

## Validation Rule Catalog

Every validation rule should declare compatible attribute types/cardinality,
argument shape, default message key, and default fallback copy.

Core string/text rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `trim` | `string`, `text`, `email`, `url`, `phone_number` | none | `validation.trim` | Remove leading and trailing spaces. |
| `lowercase` | `string`, `email`, `url` | none | `validation.lowercase` | Use lowercase characters. |
| `uppercase` | `string` | none | `validation.uppercase` | Use uppercase characters. |
| `min_length` | `string`, `text` | `min` integer | `validation.min_length` | Enter at least {min} characters. |
| `max_length` | `string`, `text` | `max` integer | `validation.max_length` | Enter no more than {max} characters. |
| `pattern` | `string`, `text` | regex/pattern key | `validation.pattern` | Enter a value in the required format. |
| `allowed_characters` | `string`, `text` | character set key | `validation.allowed_characters` | Use only approved characters. |

Identifier/contact/location rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `uuid_format` | `uuid` | none | `validation.uuid_format` | Enter a valid UUID. |
| `email_format` | `email` | none | `validation.email_format` | Enter a valid email address. |
| `url_format` | `url` | none | `validation.url_format` | Enter a valid URL. |
| `phone_number_format` | `phone_number` | region/default policy key optional | `validation.phone_number_format` | Enter a valid phone number. |
| `country_code_format` | `country_code` | none | `validation.country_code_format` | Enter a valid country code. |
| `allowed_country_code` | `country_code` | allowed country list/catalog key | `validation.allowed_country_code` | Choose an approved country. |
| `timezone_format` | `timezone` | none | `validation.timezone_format` | Enter a valid timezone. |
| `allowed_timezone` | `timezone` | allowed timezone list/catalog key | `validation.allowed_timezone` | Choose an approved timezone. |
| `coordinates_format` | `coordinates` | none | `validation.coordinates_format` | Enter valid coordinates. |
| `latitude_range` | `coordinates` | min/max latitude | `validation.latitude_range` | Latitude must be between -90 and 90. |
| `longitude_range` | `coordinates` | min/max longitude | `validation.longitude_range` | Longitude must be between -180 and 180. |

Number/money rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `integer_format` | `integer` | none | `validation.integer_format` | Enter a whole number. |
| `decimal_format` | `decimal`, `money` | none | `validation.decimal_format` | Enter a valid number. |
| `money_format` | `money` | none | `validation.money_format` | Enter a valid monetary amount. |
| `min_value` | `integer`, `decimal`, `money` | `min` number | `validation.min_value` | Enter a value greater than or equal to {min}. |
| `max_value` | `integer`, `decimal`, `money` | `max` number | `validation.max_value` | Enter a value less than or equal to {max}. |
| `decimal_places` | `decimal`, `money` | `places` integer | `validation.decimal_places` | Use no more than {places} decimal places. |
| `positive_only` | `integer`, `decimal`, `money` | none | `validation.positive_only` | Enter a value greater than zero. |
| `non_negative` | `integer`, `decimal`, `money` | none | `validation.non_negative` | Enter zero or a positive value. |
| `currency_required` | `money` | none | `validation.currency_required` | Choose a currency. |

Boolean/date/time rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `boolean_format` | `boolean` | none | `validation.boolean_format` | Enter true or false. |
| `date_format` | `date` | none | `validation.date_format` | Enter a valid date. |
| `datetime_format` | `datetime` | none | `validation.datetime_format` | Enter a valid date and time. |
| `date_range_format` | `date_range` | none | `validation.date_range_format` | Enter a valid date range. |
| `datetime_range_format` | `datetime_range` | none | `validation.datetime_range_format` | Enter a valid date and time range. |
| `min_date` | `date`, `date_range` | date | `validation.min_date` | Enter a date on or after {minDate}. |
| `max_date` | `date`, `date_range` | date | `validation.max_date` | Enter a date on or before {maxDate}. |
| `min_datetime` | `datetime`, `datetime_range` | datetime | `validation.min_datetime` | Enter a date and time on or after {minDateTime}. |
| `max_datetime` | `datetime`, `datetime_range` | datetime | `validation.max_datetime` | Enter a date and time on or before {maxDateTime}. |
| `not_in_past` | `date`, `datetime`, ranges | none | `validation.not_in_past` | Enter a value that is not in the past. |
| `not_in_future` | `date`, `datetime`, ranges | none | `validation.not_in_future` | Enter a value that is not in the future. |
| `start_before_end` | ranges | none | `validation.start_before_end` | Start must be before end. |
| `max_duration` | ranges | duration | `validation.max_duration` | Duration must not exceed {duration}. |

Enum/options/cardinality rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `allowed_options` | `limited_enum`, `expanded_enum` | option keys/catalog | `validation.allowed_options` | Choose an approved option. |
| `option_catalog_required` | `expanded_enum`, catalog-backed attributes | catalog key | `validation.option_catalog_required` | Choose an approved option catalog. |
| `min_items` | multiple cardinality | `min` integer | `validation.min_items` | Choose at least {min} items. |
| `max_items` | multiple cardinality | `max` integer | `validation.max_items` | Choose no more than {max} items. |
| `unique_items` | multiple cardinality | none | `validation.unique_items` | Each selected item must be unique. |

Relationship/reference rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `target_exists` | `relationship_reference`, relationship-source options | target entity key | `validation.target_exists` | Choose an existing related record. |
| `relationship_boundary` | relationship references/options | boundary policy | `validation.relationship_boundary` | The selected record is outside the allowed boundary. |
| `allowed_target_status` | relationship references/options | status keys | `validation.allowed_target_status` | Choose a record with an approved status. |
| `relationship_cardinality` | relationship references | cardinality rule | `validation.relationship_cardinality` | The relationship does not meet the required cardinality. |
| `no_self_reference` | self-referential relationships | none | `validation.no_self_reference` | A record cannot reference itself here. |
| `no_cycle` | hierarchical relationships | max depth optional | `validation.no_cycle` | This relationship would create a cycle. |
| `max_depth` | hierarchical relationships | max depth | `validation.max_depth` | This relationship exceeds the maximum allowed depth. |

Asset/file/json rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `allowed_mime_types` | asset reference types | MIME list | `validation.allowed_mime_types` | Choose a file type that is allowed. |
| `max_file_size` | asset reference types | size limit | `validation.max_file_size` | File size must not exceed {maxSize}. |
| `max_file_count` | asset reference types with multiple cardinality | count | `validation.max_file_count` | Choose no more than {maxCount} files. |
| `asset_policy_approved` | asset reference types | asset policy key | `validation.asset_policy_approved` | This asset use needs an approved asset policy. |
| `json_shape` | `json` | schema/catalog key | `validation.json_shape` | Enter JSON that matches the approved shape. |

System/governance rules:

| Rule key | Applies to | Arguments | Default message key | Default fallback |
| --- | --- | --- | --- | --- |
| `required` | all attribute types | none | `validation.required` | This field is required. |
| `system_managed_denied` | system-managed attributes | none | `validation.system_managed_denied` | This field is managed by the system. |
| `immutable_denied` | immutable attributes | none | `validation.immutable_denied` | This field cannot be changed. |
| `privacy_classification_required` | sensitive attributes | none | `validation.privacy_classification_required` | Choose the sensitive privacy category. |
| `security_classification_level_required` | classified attributes | none | `validation.security_classification_level_required` | Choose the required classification level. |

## Placement Schema

Each placement:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `surfaceKey` | template-scoped enum | none | must be declared by the selected design-system/page-template contract |
| `surfaceVariantKey` | template-scoped enum | `none` | must be declared by the selected contract for the chosen surface, or `none` when the contract allows no variant |
| `regionKey` | template-scoped enum | none | must be declared by the selected contract for the chosen surface/variant |
| `elementKey` | template-scoped enum | none | must be declared by the selected contract for the chosen surface/variant/region and compatible with the attribute |
| `groupKey` | entity-scoped enum/string | `none` | must exist in `presentationGroups` or be `none` |
| `displayOrder` | integer | none | scoped to surface/region/group |
| `interactionMode` | enum | none | `read_only`, `editable`, `action_only` |
| `visibilityMode` | enum | none | `default_visible`, `hidden_by_default`, `conditional` |

Placement keys are not arbitrary strings. They are governed enum values resolved
from the selected page/template contract in `surfaceModel`.

Validation must reject:

- `surfaceKey` not allowed by the selected template contract
- `surfaceVariantKey` not allowed for the selected surface
- `regionKey` not allowed for the selected surface/variant
- `elementKey` not allowed for the selected surface/variant/region
- `elementKey` incompatible with the attribute type, cardinality, mutability,
  interaction mode, or visibility mode
- placements that reference a group not declared in `presentationGroups`

## Presentation Group Schema

Each group:

| Field | Type | Default |
| --- | --- | --- |
| `groupKey` | string | none |
| `labelKey` | string | none |
| `labelFallback` | string | none |
| `descriptionKey` | string | `none` |
| `descriptionFallback` | string | `none` |
| `displayOrder` | integer | none |
| `evidenceKeys` | array | `[]` |

## Operational Status Schema

Required `operationalStatusSet` fields:

| Field | Type | Default |
| --- | --- | --- |
| `statusAttributeKey` | string | `none` |
| `statuses` | array | `[]` |
| `evidenceKeys` | array | `[]` |

Each status:

- `statusKey`
- `labelKey`
- `labelFallback`
- `descriptionKey`
- `descriptionFallback`
- `displayOrder`
- `tabEligible`
- `badgeTone`
- `defaultForCreate`
- `allowedTransitions`
- `childStatuses`

Nested statuses must not create cycles.

Operational status field catalogs:

| Field | Values |
| --- | --- |
| `tabEligible` | boolean |
| `defaultForCreate` | boolean |
| `badgeTone` | `neutral`, `info`, `success`, `warning`, `danger`, `muted`, `custom_approved` |
| transition authority placeholder | `not_defined`, `capability_owned`, `system_owned`, `manual_approval_required` |

Allowed transition row:

| Field | Type | Default |
| --- | --- | --- |
| `fromStatusKey` | string | none |
| `toStatusKey` | string | none |
| `transitionKey` | string | none |
| `capabilityKey` | string | `not_yet_defined` |
| `guardrailNotes` | string | `none` |
| `evidenceKeys` | array | `[]` |

## Relationship Schema

Each relationship:

| Field | Type | Default |
| --- | --- | --- |
| `relationshipKey` | string | none |
| `labelKey` / `labelFallback` | string | none |
| `descriptionKey` / `descriptionFallback` | string | none |
| `relationshipCategory` | enum | none |
| `targetEntityKey` | string | none |
| `relationshipRole` | string | none |
| `inverseRelationshipRole` | string | `none` |
| `cardinality` | enum | none |
| `resolution` | enum | none |
| `sourceAttributeKey` | string | `none` |
| `inverseAttributeKey` | string | `none` |
| `joinEntityKey` | string | `none` |
| `ownershipPosture` | enum | none |
| `navigationPosture` | enum | none |
| `relationshipBoundary` | object | none |
| `relationshipLifecycleImpact` | object | none |
| `evidenceKeys` | array | `[]` |

Approved relationship values:

| Concern | Values |
| --- | --- |
| `relationshipCategory` | `parent_relation`, `child_relation`, `domain_relation` |
| `resolution` | `stored_reference`, `inverse_lookup`, `join_entity`, `computed`, `external_lookup` |
| `ownershipPosture` | `owns`, `references`, `shared_reference`, `dependent` |
| `navigationPosture` | `not_navigable`, `display_only`, `navigable`, `governance_only`, `support_only` |
| lifecycle impact | `none`, `restrict`, `cascade_archive`, `cascade_delete`, `detach`, `reassign_required`, `preserve_historical`, `cleanup_required` |

Boundary dimensions must include tenant, organization, and business-unit
posture, with explicit values such as `same_tenant`, `cross_tenant_denied`, or
`cross_tenant_allowed_with_approval`.

Relationship cardinality catalog:

| Value | Meaning |
| --- | --- |
| `one_to_one` | One source record relates to one target record. |
| `one_to_many` | One source record relates to many target records. |
| `many_to_one` | Many source records relate to one target record. |
| `many_to_many` | Many source records relate to many target records. |
| `optional_one` | Zero or one target record. |
| `optional_many` | Zero or more target records. |

Boundary catalog:

| Value | Meaning |
| --- | --- |
| `not_applicable` | This boundary does not apply to the relationship. |
| `same_tenant` | Target must be in the exact same tenant. |
| `same_organization` | Target must be in the exact same organization. |
| `same_business_unit` | Target must be in the exact same business unit. |
| `same_organization_tree` | Target may be inside the same organization hierarchy/tree. |
| `same_business_unit_tree` | Target may be inside the same business-unit hierarchy/tree. |
| `cross_tenant_denied` | Crossing tenant boundary is structurally denied. |
| `cross_organization_denied` | Crossing organization boundary is structurally denied. |
| `cross_business_unit_denied` | Crossing business-unit boundary is structurally denied. |
| `cross_tenant_allowed_with_approval` | Cross-tenant relationship requires approved root/admin/policy authority. |
| `cross_organization_allowed_with_approval` | Cross-organization relationship requires approved authority. |
| `cross_business_unit_allowed_with_approval` | Cross-business-unit relationship requires approved authority. |
| `cross_tenant_allowed` | Cross-tenant relationship is structurally allowed, still subject to authz. |
| `cross_organization_allowed` | Cross-organization relationship is structurally allowed, still subject to authz. |
| `cross_business_unit_allowed` | Cross-business-unit relationship is structurally allowed, still subject to authz. |

Relationship boundary object:

| Field | Type | Default |
| --- | --- | --- |
| `tenantBoundary` | enum | none |
| `organizationBoundary` | enum | none |
| `businessUnitBoundary` | enum | none |
| `approvalPolicyKey` | string | `not_applicable` |
| `boundaryEvidenceKeys` | array | `[]` |

## Search Model Schema

Required fields:

| Field | Type | Default |
| --- | --- | --- |
| `globalSearchEnabled` | boolean | none |
| `globalSearchAttributeKeys` | array | `[]` |
| `sortableAttributeKeys` | array | `[]` |
| `defaultSort` | object/string | `none` |
| `pinnedFilterAttributeKeys` | array | `[]` |
| `facetAttributeKeys` | array | `[]` |
| `searchStoragePosture` | enum/object | none |
| `indexEvidenceKeys` | array | `[]` |

Search storage values:

- `scalar`
- `normalized_scalar`
- `junction_table`
- `generated_column`
- `json_approved`
- `external_index`
- `not_searchable`

Search operator catalog:

| Value | Meaning |
| --- | --- |
| `exact` | Exact value matching. |
| `prefix` | Prefix matching for normalized strings. |
| `contains` | Contains/text matching where approved. |
| `full_text` | Full-text search backed by approved index/source. |
| `range` | Range query for dates, numbers, or comparable values. |
| `facet` | Faceted filtering. |
| `sort` | Sortable value. |
| `exists` | Null/non-null or presence filtering. |

Attribute-level search block:

| Field | Type | Default |
| --- | --- | --- |
| `searchMode` | enum | `not_searchable` |
| `supportedOperators` | array | `[]` |
| `storageModel` | enum | `not_searchable` |
| `indexStrategyKey` | string | `none` |
| `normalizationRuleKey` | string | `none` |
| `searchEvidenceKeys` | array | `[]` |

## Surface Model Schema

Required fields:

| Field | Type | Default |
| --- | --- | --- |
| `managementPattern` | enum | `not_yet_assigned` |
| `routingTopology` | object | explicit not-applicable or route declaration |
| `enabledSurfaces` | array | `[]` |
| `defaultSurfaceKey` | string | `none` |
| `overlayEligible` | boolean | none |
| `designSystemContractKeys` | array | `[]` |
| `surfaceEvidenceKeys` | array | `[]` |

Management pattern values:

- `not_yet_assigned`
- `record_management_list_centric`
- `operational_management_status_centric`
- `custom_approved`

Routing topology should include app, module, primary page, canonical route,
parent pages, and support-only posture.

Routing topology schema:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `appKey` | enum/string | `not_applicable` | approved app/shell key |
| `moduleKey` | enum/string | `not_applicable` | approved module/top-nav key |
| `primaryPageKey` | enum/string | `not_applicable` | approved context-nav/page key |
| `canonicalRoute` | string | `not_applicable` | approved route or not-applicable |
| `parentPageKeys` | array | `[]` | approved parent page keys |
| `supportOnly` | boolean | false | explicit support-route posture |

Known app/module/page keys remain governed by frontend topology. The entity
definition may reference approved keys; it must not invent durable routes or
page destinations outside topology governance.

Template contract schema:

| Field | Type | Meaning |
| --- | --- | --- |
| `designSystemContractKey` | string | Stable key for the approved page/template contract. |
| `managementPattern` | enum | Pattern this contract supports. |
| `allowedSurfaceKeys` | array | Surface enum values available to placements. |
| `allowedVariantKeysBySurface` | object | Variant enum values by surface. |
| `allowedRegionKeysBySurfaceVariant` | object | Region enum values by surface/variant. |
| `allowedElementKeysByRegion` | object | Element enum values by surface/variant/region. |
| `elementCompatibilityRules` | object | Attribute type/cardinality/mutability/interaction compatibility. |
| `forbiddenCombinations` | array | Explicit invalid combinations. |
| `requiredPlacementRules` | array | Required placements or sections when the template is selected. |
| `contractEvidenceKeys` | array | Evidence proving the contract is approved/signed off. |

Template-scoped placement enums must be generated from this contract.

## Action Model Schema

Required fields:

| Field | Type | Default |
| --- | --- | --- |
| `actions` | array | `[]` |
| `actionErrorCatalog` | array | `[]` |
| `evidenceKeys` | array | `[]` |

Each action should include:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `actionKey` | string | none | unique snake_case key within action model |
| `actionFamily` | enum | none | approved action family |
| `labelKey` / `labelFallback` | string | none | user-facing action label |
| `descriptionKey` / `descriptionFallback` | string | none | user-facing action description |
| `owningLayer` | enum | none | `feature`, `platform`, `system`, or `shared` |
| `ownerKey` | string | none | owning feature/platform/system key |
| `executionMode` | enum | none | approved execution mode |
| `capabilityMapping` | object | explicit mapping or not-applicable block |
| `routeMapping` | object | explicit route/job/script mapping or not-applicable block |
| `surfaceMapping` | object | explicit surface/action placement or not-applicable block |
| `lifecycleEffects` | object | explicit system/operational/definition lifecycle effects |
| `relationshipEffects` | object | relationship impact or not-applicable block |
| `compatibilityRisk` | enum | none | approved compatibility risk |
| `reviewRequirement` | enum | none | approved review requirement |
| `actionErrors` | array | `[]` | action error keys/messages from catalog |
| `testEvidenceRequirements` | array | `[]` | expected test/evidence keys |
| `evidenceKeys` | array | `[]` | keys must exist in `evidenceRegistry` |

Action family catalog:

| Value | Meaning | Examples |
| --- | --- | --- |
| `managed_record` | Action on records of the managed entity. | create organization, update organization, archive organization |
| `definition_lifecycle` | Action on an entity-definition version lifecycle. | propose definition, validate definition, activate definition, supersede definition, archive definition, export definition |
| `definition_structure` | Action that changes the structure of a draft definition. | add attribute, edit validation, remove placement, reorder group |
| `relationship_control` | Action that changes or validates entity relationships. | attach child, move parent, detach relation, approve cross-boundary link |
| `generation_sync` | Action that generates, previews, refreshes, publishes, or reconciles derived artifacts. | generate docs, preview UI defaults, refresh search config |
| `evidence_audit` | Action that records, reads, or reconciles evidence. | attach decision log, record validation proof, reconcile source evidence |
| `retention_cleanup` | Action that holds, releases, expires, cleans up, purges, or marks cleanup failure. | start pending deletion, retry cleanup, purge approved record |
| `support_operation` | Operator/support action outside normal user workflows. | reconcile definition, recover failed migration, inspect hidden evidence |

Managed-record action keys should use these canonical operation values where
possible:

| Value | Meaning |
| --- | --- |
| `list` | List records. |
| `search` | Search records. |
| `read` | Read one record. |
| `create` | Create a record. |
| `update` | Update mutable record fields. |
| `archive` | Archive a record. |
| `restore` | Restore an archived/deleted record when approved. |
| `delete` | Start soft-delete/pending-delete behavior. |
| `purge` | Hard-delete/purge when explicitly approved. |
| `move` | Change parent/placement/relationship position. |
| `link` | Create a relationship/link. |
| `unlink` | Remove a relationship/link. |
| `export` | Export record data. |
| `import` | Import record data. |

Definition-lifecycle operation values:

| Value | Meaning |
| --- | --- |
| `propose_definition` | Create a proposed/draft definition. |
| `validate_definition` | Validate a definition version. |
| `update_definition` | Update draft definition metadata. |
| `version_definition` | Create a replacement version. |
| `activate_definition` | Make a valid definition version active. |
| `supersede_definition` | Replace an active definition with a newer version. |
| `archive_definition` | Archive a definition version or lineage. |
| `export_definition` | Export/read a definition shape. |

Definition-structure operation values:

| Value | Meaning |
| --- | --- |
| `add_attribute` | Add an attribute to a draft definition. |
| `edit_attribute` | Edit an attribute's governed metadata. |
| `remove_attribute` | Remove an attribute when compatibility rules allow. |
| `reorder_attribute_placement` | Change placement order. |
| `add_presentation_group` | Add a display group. |
| `edit_presentation_group` | Edit a display group. |
| `remove_presentation_group` | Remove a display group when unused or safely migrated. |
| `add_placement` | Place an attribute on an approved surface. |
| `edit_placement` | Edit an existing placement. |
| `remove_placement` | Remove an attribute placement. |
| `add_validation_rule` | Add a validation rule. |
| `edit_validation_rule` | Edit a validation rule. |
| `remove_validation_rule` | Remove a validation rule. |
| `add_relationship` | Add a relationship definition. |
| `edit_relationship` | Edit a relationship definition. |
| `remove_relationship` | Remove a relationship definition when compatibility rules allow. |
| `add_operational_status` | Add an operational status. |
| `edit_operational_status` | Edit an operational status. |
| `remove_operational_status` | Remove an operational status when compatibility rules allow. |
| `edit_search_model` | Edit entity search/list behavior. |
| `edit_surface_model` | Edit entity surface/routing/template behavior. |
| `edit_action_model` | Edit action metadata. |
| `edit_compliance_model` | Edit compliance posture. |
| `edit_generation_model` | Edit generation posture. |
| `edit_migration_model` | Edit migration posture. |
| `edit_source_authority` | Edit source authority metadata. |
| `edit_evidence_registry` | Add/edit/remove evidence registry entries. |

Capability mapping block:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `capabilityDefinitionKey` | string | `not_applicable` | approved capability definition key or custom-approved posture |
| `implementationSeam` | enum | `not_applicable` | selected implementation seam for this entity/action mapping |
| `capabilityKey` | string | `not_applicable` | stable capability key or `not_applicable` |
| `capabilityFamily` | enum | `not_applicable` | approved capability family when a capability applies |
| `authorityWorld` | enum | `not_applicable` | root/tenant/system/etc. |
| `capabilityPosture` | enum | `not_applicable` | planned/current/target/blocked/etc. |
| `enforcementPosture` | enum | `not_applicable` | runtime/documentation/design/manual/etc. |
| `owningFeatureKey` | string | `none` | owning feature when applicable |
| `permissionMappingEvidenceKeys` | array | `[]` | permission/capability evidence |

Route/job/script mapping block:

| Field | Type | Default | Validation |
| --- | --- | --- | --- |
| `mappingType` | enum | `not_applicable` | `api_route`, `job`, `script`, `manual_process`, `not_applicable` |
| `method` | enum/string | `not_applicable` | required for API routes |
| `routePath` | string | `not_applicable` | required for API routes |
| `jobKey` | string | `not_applicable` | required for jobs |
| `scriptKey` | string | `not_applicable` | required for scripts |
| `asyncResultModel` | string/object | `not_applicable` | required for async-like actions |

Execution modes:

- `sync`
- `async`
- `sync_starts_async`
- `scheduled`
- `manual_operational`

Compatibility risk:

- `none`
- `low`
- `medium`
- `high`
- `breaking`

Review requirement:

- `none`
- `recommended`
- `required`
- `approval_gated`

Action error catalog:

| Error key | Meaning | Default message key | Default fallback |
| --- | --- | --- | --- |
| `not_authorized` | Actor lacks required authority. | `action_error.not_authorized` | You are not allowed to perform this action. |
| `not_found` | Target record/definition was not found. | `action_error.not_found` | We could not find the requested item. |
| `conflict` | Action conflicts with current state/version. | `action_error.conflict` | This action conflicts with the current state. |
| `wrong_lifecycle_state` | Target is in a state where action is not allowed. | `action_error.wrong_lifecycle_state` | This action is not allowed in the current state. |
| `relationship_boundary_violation` | Relationship crosses a denied boundary. | `action_error.relationship_boundary_violation` | The selected relationship is outside the allowed boundary. |
| `dependency_exists` | Related/dependent records block the action. | `action_error.dependency_exists` | Related records must be handled before this action can continue. |
| `validation_failed` | Attribute or structure validation failed. | `action_error.validation_failed` | Fix validation issues before continuing. |
| `rate_limited` | Action exceeded rate/abuse limits. | `action_error.rate_limited` | Try again later. |
| `async_accepted_but_failed` | Async action was accepted but later failed. | `action_error.async_accepted_but_failed` | The background action failed after it started. |
| `cleanup_failed` | Cleanup work failed. | `action_error.cleanup_failed` | Cleanup did not complete successfully. |
| `external_dependency_failed` | External system failed or was unavailable. | `action_error.external_dependency_failed` | An external dependency failed. |
| `unsupported_action` | Action is not supported for this entity/surface/status. | `action_error.unsupported_action` | This action is not supported here. |
| `compatibility_blocked` | Compatibility checks block the action. | `action_error.compatibility_blocked` | Compatibility checks must pass before this action can continue. |
| `approval_required` | Action needs explicit approval. | `action_error.approval_required` | Approval is required before this action can continue. |

## Compliance Model Schema

Required fields:

| Field | Type | Default |
| --- | --- | --- |
| `privacyImpact` | enum | none |
| `sensitivePrivacyCategoriesPresent` | array | `[]` |
| `securityImpact` | enum/string | none |
| `auditRequired` | boolean | none |
| `retentionPolicyKey` | string | `none` |
| `deletePosture` | enum | none |
| `legalHoldSupported` | boolean | none |
| `exportPosture` | enum | none |
| `cleanupPosture` | enum | none |
| `encryptionPosture` | object | none |
| `evidenceKeys` | array | `[]` |

Compliance catalogs:

| Field | Values |
| --- | --- |
| `privacyImpact` | `none`, `contains_pii`, `contains_sensitive_pii`, `mixed` |
| `securityImpact` | `none`, `internal`, `restricted`, `classified`, `mixed` |
| `deletePosture` | `not_deletable`, `soft_delete`, `soft_delete_with_pending_deletion`, `hard_delete_eligible`, `purge_only_with_approval` |
| `exportPosture` | `not_exportable`, `included_in_standard_export`, `restricted_export`, `privacy_reviewed_export` |
| `cleanupPosture` | `not_applicable`, `feature_owned_cleanup`, `platform_scheduler_cleanup`, `manual_operational_cleanup`, `external_resource_cleanup` |

Encryption posture schema:

| Field | Type | Default |
| --- | --- | --- |
| `atRest` | enum | `required` |
| `inTransit` | enum | `required` |
| `fieldLevel` | enum | `not_required` |
| `keyManagementPolicyKey` | string | platform default policy key |
| `attributeOverrides` | array | `[]` |

Encryption values:

- `required`
- `not_required`
- `inherited_platform_default`
- `custom_approved`

## Generation Model Schema

Required fields:

| Field | Type | Default |
| --- | --- | --- |
| `generationMode` | enum | none |
| `allowedOutputCategories` | array | `[]` |
| `blockedOutputCategories` | array | `[]` |
| `driftDetectionRequired` | boolean | none |
| `evidenceKeys` | array | `[]` |

Allowed output categories may include docs, UI defaults, design-system preview,
validation config, search config, capability mapping drafts, API contract
drafts, and test drafts.

Runtime source, database migrations, authorization logic, and permission grants
are blocked by default.

Generation mode values:

- `none`
- `preview_only`
- `preview_then_apply`
- `automatic`
- `manual_operational`

Generation output categories:

| Value | Default posture |
| --- | --- |
| `docs` | allowed/planned |
| `ui_defaults` | allowed/planned |
| `design_system_preview` | allowed/planned |
| `validation_config` | allowed/planned |
| `search_config` | allowed/planned |
| `capability_mapping_draft` | allowed/planned |
| `api_contract_draft` | allowed/planned |
| `test_draft` | allowed/planned |
| `runtime_source` | blocked |
| `database_migration` | blocked |
| `authorization_logic` | blocked |
| `permission_grant` | blocked |

Generated output posture values:

- `allowed`
- `planned`
- `blocked`
- `approval_required`
- `not_applicable`

## Migration Model Schema

Required fields:

| Field | Type | Default |
| --- | --- | --- |
| `migrationStatus` | enum | none |
| `currentSourcePosture` | string | none |
| `targetSourcePosture` | string | none |
| `currentArtifactKeys` | array | `[]` |
| `targetPersistentRecordKey` | string | `none` |
| `compatibilityChecksRequired` | array | `[]` |
| `blockingIssues` | array | `[]` |
| `migrationEvidenceKeys` | array | `[]` |

Migration status values:

- `not_started`
- `inventory_in_progress`
- `mapped_to_definition`
- `persistent_record_created`
- `mirrored_transitional`
- `persistent_primary`
- `blocked`

Migration compatibility check catalog:

| Value | Meaning |
| --- | --- |
| `api_contract_parity` | API contract remains compatible or migration strategy is approved. |
| `persistence_schema_parity` | Runtime persistence shape and indexes remain compatible or migration is approved. |
| `data_dictionary_parity` | Data dictionary output/mirror remains aligned. |
| `permission_mapping_parity` | Capability/authz mapping remains aligned. |
| `feature_manifest_parity` | Feature manifest public seams/dependencies remain aligned. |
| `generated_doc_parity` | Generated docs remain deterministic and compatible. |
| `runtime_behavior_parity` | Runtime behavior remains unchanged unless explicitly approved. |
| `export_v1_compatibility` | Existing export v1 consumers remain safe. |
| `export_v2_completeness` | New full export/read shape includes required canonical sections. |
| `design_system_contract_parity` | Referenced surfaces/elements match approved design-system contracts. |
| `search_index_parity` | Search/index storage matches declared search model. |
| `compliance_parity` | Privacy/security/retention/export posture remains aligned. |

## Current EntityBuilder Compatibility Map

| Current field/concept | Canonical target |
| --- | --- |
| `entityKey` | `entityIdentity.entityKey` |
| `entityName` | `entityIdentity.singularLabelFallback` and derived plural fallback needing review |
| `description` | `entityIdentity.descriptionFallback` |
| version `status` | top-level `definitionStatus` |
| `attributeKey` | `attributes[].attributeKey` |
| `attributeKind = persisted` | stored attribute with explicit category/type/cardinality/mutability/system-managed fields |
| `attributeKind = computed` | `mutability = derived` or `calculated`, depending on evidence |
| `attributeType = enum` | `limited_enum` by default, `expanded_enum` with evidence |
| `valueCardinality` | `attributes[].valueCardinality` |
| `label` | `labelFallback`; localization key must be generated or supplied |
| `description` | `descriptionFallback`; localization key must be generated or supplied |
| `helpText` | placement/form guidance or field writing guidance, depending on final schema split |
| `placeholderText` | placement/form element metadata where applicable |
| `formFacing` | placement generation input, not canonical visibility by itself |
| `defaultFormPatternKey` | placement `elementKey` seed where compatible |
| `optionsMode` | direct options mode mapping |
| `optionsCatalogKey` | `options.catalogKey` |
| inline options | `options.inlineOptions` with localization keys/fallbacks |
| `derivationNote` | source metadata proof/explanation for derived/calculated values |
| `sourceAttributeKeys` | source metadata for derived/calculated values |
| global `displayOrder` | default placement `displayOrder` |
| validation `errorMessage` | validation `messageFallback` |

## Required Validation Themes

Formal implementation should include validators for:

- required sections and field completeness
- key format and uniqueness
- catalog value compatibility
- localization key/fallback presence
- attribute type/cardinality compatibility
- item limit consistency
- privacy/security classification consistency
- validation rule compatibility and messages
- options source consistency
- placement surface/region/element compatibility
- group references and ordering
- nested operational status cycles
- relationship lookup recipe consistency
- tenant/organization/business-unit boundary declarations
- search storage/index posture
- action capability/error/review metadata
- action capability definition mapping and implementation contract completeness
- compliance summary consistency with attributes
- generation blocked/allowed output rules
- migration compatibility checks
- LLM authoring guidance coverage for required schema fields
- LLM guidance mode compatibility with field ownership and review posture

## Required Test And Artifact Expectations

Before this model can be considered locked for implementation, the later schema
package should define tests for:

- schema accepts a complete valid definition
- schema rejects missing sections
- schema rejects unknown top-level sections
- schema rejects bad stable key casing
- schema rejects incompatible attribute type/cardinality/options combinations
- schema rejects invalid placement combinations
- schema rejects unsafe relationship boundary omissions
- schema rejects privacy/security inconsistencies
- migration map covers current `entityBuilder` v1 fields
- export/read v1 remains compatibility-safe
- export/read v2 includes the full canonical sections
- generated docs can be produced deterministically from the formal model
- required LLM guidance entries exist for foundational schema fields
- LLM guidance does not ask humans for system-generated or source-derived
  fields unless the configured review trigger applies

## Open Exceptions For Human Review

These are the remaining areas where human review may be needed later:

| Area | Why human review may be needed |
| --- | --- |
| Implementation ownership | Decide whether to evolve `entityBuilder`, create a successor registry, or use a transitional adapter. |
| Design-system surface keys | Final keys depend on signed-off entity-management templates. |
| Legal/compliance wording | Sensitive PII/privacy categories should be reconciled with the adopted legal/compliance standard before production lock-in. |
| Breaking compatibility trade-offs | Any change that breaks current routes, persistence, exports, permission mappings, or docs requires explicit approval. |
| Entity pilot choice | Choosing the first migrated entity should be a deliberate product/technical decision. |
