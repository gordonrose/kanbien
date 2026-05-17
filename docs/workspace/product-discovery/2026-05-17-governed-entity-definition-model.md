# Governed Entity Definition Model Planning Tracker

Planning status:

- `draft_v1_canonical_model_ready_for_schema_formalization`
- This is a workspace tracker and draft v1 canonical model, not the final
  implementation contract.
- No implementation, migration, route, generated artifact, or UI work is
  approved by this note.
- Full repo guardrails, artifact sweeps, and compatibility checks are deferred
  until this work moves from discovery into governed planning or
  implementation.
- Product discovery for the entity-definition shape is complete enough to stop
  line-by-line human review and move into schema formalization when that work
  is explicitly requested.

## Plain-Language Goal

Create a predictable platform definition for manageable entities so the app can
eventually generate or default entity management behavior without one-off page
code for every entity.

The definition should describe what an entity is, what its attributes mean, how
its status and lifecycle work, what parts are visible or editable, and which
metadata future scripts can safely consume.

Companion reference:

- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-example.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-handoff.md`

## Current Direction From Discovery

| Decision | Current posture |
| --- | --- |
| First milestone | Complete: the generic entity definition structure has a draft v1 canonical model ready for schema formalization. |
| Pilot entity | Deferred until the generic structure is shaped. |
| Capability/action model | Deferred until the entity definition itself is clear. |
| Creation and maintenance workflow | Deferred until after the entity definition shape is clear. |
| Implementation | Explicitly out of scope for this planning pass. |
| Source authority posture | Most entities are currently defined across repo artifacts. The target end state is persistent DB-backed entity definitions as primary truth, with repo docs becoming generated outputs or explicit transitional mirrors. |
| Canonical model authority | The governed entity-definition structure decided in this discovery stream supersedes the narrower current `entityBuilder` structure as the intended target model. Existing `entityBuilder` behavior remains important for compatibility, migration evidence, and implementation planning, but it should not constrain the canonical definition when the new model is more complete. |
| Section completeness | Canonical entity definitions should be section-complete because downstream features will depend on predictable structure. Required sections should be present for every entity, even when populated with explicit defaults, empty arrays, `none`, `notApplicable`, or other governed default values. |
| Top-level entity definition skeleton | Use the working v1 top-level shape: `entityIdentity`, `sourceAuthority`, `evidenceRegistry`, `attributes`, `presentationGroups`, `operationalStatusSet`, `relationships`, `searchModel`, `surfaceModel`, `actionModel`, `complianceModel`, `generationModel`, and `migrationModel`. |
| Entity identity fields | `entityIdentity` should include stable entity key, singular/plural localization keys and fallback labels, context-rich description key/fallback, purpose key/fallback, owning feature key, owning feature posture, owning layer, entity family key, management scope, and definition version. |
| Owning feature posture | `owningFeatureKey` should remain required, using a planned stable key when needed. Add `owningFeaturePosture` with values such as `implemented`, `planned`, and `notYetAssigned` so early entity definitions do not pretend planned features already exist. |
| Action model | Add required `actionModel` as the attachment point for mapping entity actions to feature capabilities, API route contracts, surfaces, lifecycle/status effects, compatibility checks, and tests. It should cover managed-record actions, definition lifecycle actions, and concrete definition-structure edit actions. Structure edit actions include adding, editing, removing, or reordering attributes, presentation groups, placements, validation rules, relationships, operational statuses, search config, compliance classification, and source authority. |
| Action model shape | Store actions as one flat `actions` array with an `actionFamily` field rather than separate arrays per family. Scripts consume one uniform shape; generated docs/UI can group actions by family for readability. |
| Action ownership | Each action should declare an owning layer and owner key. Managed-record actions are usually owned by the entity's feature. Entity-definition maintenance actions are usually owned by the platform/entity-definition layer. This keeps feature business behavior separate from platform definition governance. |
| Editable section actions | Every editable top-level entity-definition section should have corresponding definition-structure actions. LLM-driven builder customization should flow through governed actions rather than direct freeform edits. |
| Search and surface customization actions | The action model should support broad section-edit actions such as `editSearchModel` and `editSurfaceModel`, plus granular high-value actions such as `addGlobalSearchAttribute`, `removeGlobalSearchAttribute`, `setDefaultSort`, `addPinnedFilter`, `removePinnedFilter`, `addFacet`, `removeFacet`, `changeSurfaceVariant`, `addPlacement`, `editPlacement`, and `removePlacement`. |
| Action execution mode | Each action should declare `executionMode` with v1 values such as `sync`, `async`, `syncStartsAsync`, `scheduled`, and `manualOperational`. Async-like modes later require status tracking, retry posture, idempotency, timeout/failure behavior, audit, and progress evidence. |
| Action error model | Each action should include action-level error messages separate from attribute validation. Action errors cover operation failures such as authorization, not found, conflict, wrong lifecycle state, relationship boundary violation, dependency blocking, rate limiting, async failure, cleanup failure, external dependency failure, and unsupported action. |
| Action compatibility risk catalog | Use `none`, `low`, `medium`, `high`, and `breaking` as the v1 `compatibilityRisk` values for action rows. |
| Action review requirement catalog | Use `none`, `recommended`, `required`, and `approvalGated` as the v1 `reviewRequirement` values for action rows. |
| Compliance model | `complianceModel` should record entity-level compliance posture including privacy impact, security impact, audit, retention, delete posture, legal hold, export posture, cleanup posture, encryption posture, and evidence keys. Attribute-level privacy/security remains the detailed source; entity-level compliance summarizes and records auditable defaults. |
| Encryption posture | Store encryption instructions in `complianceModel` for auditability even when they follow platform defaults. Include at-rest, in-transit, field-level encryption posture, key-management policy key, and attribute override slots for especially sensitive fields. |
| Privacy summary vs detail | Sensitive PII category assignment belongs on attributes. `complianceModel` should summarize entity-wide privacy impact and may explicitly list `sensitivePrivacyCategoriesPresent` for reporting/audit, derived from attribute classifications. |
| Generation model | `generationModel` should declare what the entity definition is allowed to generate or drive. V1 should cautiously allow or plan docs, UI defaults, design-system previews, validation/search config, capability mapping drafts, API contract drafts, and test drafts, while blocking runtime source, database migrations, authorization logic, and permission grants by default until explicit future approval and heavier compatibility checks exist. |
| Migration model | `migrationModel` should track adoption/migration from current repo/source artifacts into persistent entity-definition primary truth. It is not the general future-change mechanism; future definition changes are handled through source authority, action model, versioning/lifecycle, and evidence. |
| Canonical export/read shape | The full governed entity definition should use a new explicit export/read shape, expected to be `exportFormatVersion = 2` or equivalent, rather than silently changing current `entityBuilder` export format v1. Current v1 exports remain compatibility-safe for existing consumers; the richer canonical structure gets its own versioned shape. |
| LLM authoring guidance | Each entity-definition section and field should eventually include context-specific guidance for LLM-assisted creation and maintenance: what a good value looks like, whether to ask the human, infer from context, use a platform default, derive from repo/source truth, or never ask because the system owns it. Guidance should vary by context such as `newEntity`, `entityUpdate`, `repoMigration`, and `persistentRevision`. Human-facing contexts such as `newEntity` and `entityUpdate` should support primary and fallback modes so the LLM can choose the lowest-friction path first and ask directly only when needed or when the field is foundational. |
| Field-level writing guidance | Reusable entity-definition schema/field catalogs should include field-specific writing guidance for LLM-authored values, including audience, tone, required content, things to avoid, and good/bad examples. This guidance should not be repeated in every entity definition instance. It lets fields such as description, purpose, proof statement, and labels use different writing behavior. |
| Two-layer authoring model | Use a two-layer model: `EntityDefinitionSchema` stores the canonical entity truth, while a reusable `EntityDefinitionAuthoringGuidanceCatalog` tells LLMs how to create or maintain those values. The entity definition stores answers; the guidance catalog teaches the LLM how to obtain good answers. Guidance should be reusable across entities unless a specific override is approved. |
| Authoring guidance catalog shape | Reusable authoring guidance entries should include field key, section key, value type, context-specific authoring guidance, writing guidance, question guidance, and validation/default guidance. `questionGuidance` is the home for how the LLM should ask humans when it must ask, such as asking one plain-language question, avoiding platform jargon, and offering a recommendation when useful. |
| Key and catalog casing compatibility | Stable entity-definition values should align with the existing `entityBuilder` snake_case posture for entity keys, attribute keys, catalog values, option keys, validation rule keys, and persisted/runtime identifiers. JSON object property names may remain lowerCamel because they describe the API/schema shape rather than stored business keys. |
| Attribute source compatibility | The current `entityBuilder` `attributeKind` concept should not remain the canonical model field. The richer definitions from this discovery work supersede it: semantic category, attribute type, value cardinality, system-managed posture, mutability, and derived/calculated/source behavior. Existing `attributeKind` values such as `persisted` and `computed` should be treated as migration/compatibility inputs that map into the richer canonical fields. |

## Decision Log

| Decision | Current rule |
| --- | --- |
| Starting point | Work from the existing data dictionary entity template, then distill a canonical machine-readable entity definition from it. |
| Relationship to current `entityBuilder` | The current `entityBuilder` foundation is source material and a compatibility anchor, not the ceiling for the canonical model. Where this discovery model is more expressive, the discovery model wins as the target. Later implementation planning must define how to evolve or replace current `entityBuilder` behavior without breaking existing routes, persistence, exports, permission mappings, or docs. |
| Source authority required | Every entity definition should include `sourceAuthority`, even when it is not yet migrated. The section should declare current authority, target authority, transition posture, source precedence, and Markdown posture. |
| Source authority catalogs | Use controlled values for source authority. `currentAuthority` should include `repoArtifacts`, `runtimeSource`, `planningArtifact`, `persistentEntityDefinition`, and `mixedTransitional`. `targetAuthority` should include `persistentEntityDefinition` and approved exceptions such as `externalSystemOfRecord`. `sourcePrecedence` should use ordered source keys such as `runtimeSource`, `migration`, `apiContract`, `entityDefinition`, `dataDictionaryMarkdown`, `featureDocs`, and `planningArtifacts`. `markdownPosture` should include `source`, `sourceIndependentPlanning`, `mirroredTransitional`, `generatedOutput`, and `notApplicable`. |
| Source authority transition posture | Use a transition posture catalog such as `notYetMigrated`, `partiallyMigrated`, `mirroredTransitional`, and `persistentPrimary` to describe whether repo artifacts or persistent entity-definition records currently own truth. |
| Evidence link migration bridge | Evidence links should support repo artifacts today and persistent evidence/source records later. Use an entity-level evidence registry with stable evidence keys that attributes, relationships, statuses, search config, and other sections can reference. The evidence model is expected to evolve as artifact types move into DB-backed records or become unnecessary. |
| Evidence registry catalogs | Evidence entries should use controlled `sourceType` values such as `sourceCode`, `migration`, `apiContract`, `dataDictionary`, `featureDoc`, `prd`, `technicalSteering`, `adr`, `capabilityMatrix`, `permissionMapping`, `testEvidence`, `runtimeEvidence`, `decisionLog`, `generatedArtifact`, `externalStandard`, and `persistentRecord`. Entries should be field-complete with stable evidence key, source location type, repo path or persistent/external reference, transition posture, proof statement, and reviewed date/default. |
| Attribute completeness | Attribute records should be field-complete as part of creation or migration. Context-specific fields should use explicit defaults, empty arrays, `none`, `notApplicable`, or governed default values rather than disappearing from the structure. |
| Grouping and order | Attribute grouping and order are required for frontend consumption, but must remain deterministic and declarative. |
| Surface-specific placement | Attributes may declare placements per approved surface rather than relying on one shared order for every surface. |
| Existing display order migration | Existing `entityBuilder` global attribute `displayOrder` values should migrate into a default placement order for the default/generated surface. After migration, canonical ordering should live on placements scoped by surface, region, and group, not on the attribute as one universal order. |
| Surface validation | A placement must reference an approved surface and an allowed region/component contract for that surface. Invalid combinations, such as a floating tab header row inside a list drawer, must fail validation. |
| Template-scoped placement enums | `surfaceKey`, `surfaceVariantKey`, `regionKey`, and `elementKey` are not arbitrary strings. They are governed enum values resolved from the selected design-system/page-template contract. Allowed values and combinations are scoped by the page/template contract chosen in `surfaceModel`. |
| Attribute element | A placed attribute must declare an approved element/display pattern, such as text field, dropdown, readonly text, status badge, or date picker. |
| Element compatibility | Element choices must be validated against the surface, region/component contract, attribute type, cardinality, mutability, and other governed metadata. |
| Attribute requiredness | Attribute `required` is a boolean in v1. Conditional or create-only requiredness is deferred until a concrete need appears. |
| Attribute mutability | Attribute mutability should use a controlled v1 catalog, not a boolean, so system-managed, immutable, create-only, updateable, lifecycle-only, and similar fields cannot be touched by the wrong part of the system. |
| V1 mutability catalog | Use `immutable`, `createOnly`, `updateable`, `systemUpdateable`, `lifecycleManaged`, `relationshipManaged`, `derived`, and `calculated` as the initial controlled mutability values. |
| Derived vs calculated | `derived` is for transparent deterministic projections from existing fields or relationships. `calculated` is for values produced by explicit business rules, scoring, aggregation, or transformations that may need a named calculation rule, version, trigger, stale/failure posture, or evidence. |
| Current `attributeKind` migration | Existing `entityBuilder` `attributeKind` values should be mapped rather than preserved as a first-class canonical field. `persisted` generally maps to a normal stored attribute with explicit category/type/cardinality/mutability/system-managed values. `computed` maps into the richer derived/calculated/source metadata depending on whether it is a transparent derivation or an explicit business calculation. |
| System-managed fields | `systemManaged` should remain separate from `mutability`. `systemManaged` declares whether clients/humans may supply the value directly; `mutability` declares when the owning authority may change it. |
| Lifecycle categories | Split lifecycle semantics into `systemLifecycle` and `operationalLifecycle`. `systemLifecycle` is the platform record-retention/availability state, such as active, archived, deleted, restored, or superseded. `operationalLifecycle` is the business/workflow state, such as draft, in review, in progress, live, paused, rejected, or completed. |
| System lifecycle catalog | Use `draft`, `active`, `archived`, `pendingDeletion`, `deleted`, `superseded`, `pendingCleanup`, and `cleanupFailed` as the initial platform-wide `systemLifecycle` status values. `pendingDeletion` is the deletion window after a delete action is accepted but before final delete/purge. `pendingCleanup` and `cleanupFailed` track related cleanup work, not the deletion timer itself. |
| Definition-version status separation | Definition-version status is separate from managed-record system lifecycle. Definition-version statuses describe the lifecycle of the entity definition itself, such as draft, active, superseded, or archived. Managed-record system lifecycle describes records created from that definition, such as active, archived, pending_deletion, deleted, pending_cleanup, or cleanup_failed. Same words may appear in both catalogs, but they refer to different objects and must be modeled separately. |
| Operational lifecycle status sets | Operational lifecycle statuses are entity-specific but must be declared in a governed status set with stable keys, localization keys/fallback copy, display order, tab eligibility, badge tone, default-for-create posture, optional parent status, optional allowed transitions, and optional nested child statuses. Allowed transitions are structural lifecycle metadata that later capability/action logic can populate, enforce, or attach authority to. |
| Nested operational statuses | Operational status sets may be hierarchical. A parent status can group child/sub-statuses for drill-down workflows, reporting, tabs, or progress modeling. Validation should prevent cycles, require stable keys, and define whether transitions apply at parent level, child level, or both. |
| Relationship categories | Replace generic `relationship` with `parentRelation`, `childRelation`, and `domainRelation` in v1. |
| Top-level relationships | The top-level `relationships` section should index meaningful/navigable entity connections. Attributes describe fields; relationships describe how this entity connects to other entities and what the app can do with that connection. Relationships may reference local relationship attributes, but may also describe inverse child collections where the stored field lives on the target entity. |
| Sibling relationships | Do not include `siblingRelation` as a v1 attribute category. Sibling relationships are usually derived from shared parent structure and may become a relationship navigation type later if a concrete need appears. |
| Domain relationships | Use `domainRelation` for relationships to other durable records that matter to the entity but are not parent or child structure, such as replacement record, related organization, duplicate candidate, paired configuration, primary asset, or approval actor. The exact meaning should live in relationship metadata such as relationship role, target entity, cardinality, and authority. |
| Security and privacy classification | Remove `security` and `privacy` from the primary attribute category catalog. Model them as separate attribute classification fields so an attribute can have a semantic category such as `identity` while also carrying privacy or security classification. |
| Privacy classification shape | Attribute privacy classification should follow an ISO PII-oriented sensitivity shape in v1: `none`, `notSensitive`, or `sensitive`. Sensitive attributes must also declare a governed sensitive-category value, such as religious belief, health, political affiliation, trade union membership, or another approved special-category value. Exact category wording should be verified against the adopted privacy/compliance standard before lock-in. |
| Sensitive PII category catalog | Use an explicit governed catalog for `sensitivePrivacyCategory`: `racialOrEthnicOrigin`, `politicalOpinions`, `religiousOrPhilosophicalBeliefs`, `tradeUnionMembership`, `healthData`, `sexLifeOrSexualOrientation`, `criminalConvictions`, `governmentIdentifiers`, `financialData`, and `medicalOrBiometricData`. Examples include Social Security numbers, passport numbers, driver's license numbers, credit card numbers, bank routing numbers, tax records, health insurance information, patient IDs, fingerprints, and genetic data. Final lock-in must reconcile exact wording with the adopted privacy/compliance standard. |
| Security classification shape | Attribute security classification should use `none`, `internal`, `restricted`, and `classified`. `internal` means visible only to internal users; `restricted` means visible only to internal users with explicit authorization; `classified` means visible only to internal users with explicit authorization and the required clearance. Classified attributes must also declare a governed classification level. |
| Security classification levels | Use neutral governed classification levels for classified attributes, such as `classificationLevel1`, `classificationLevel2`, and `classificationLevel3`, so product or tenant-specific naming can be mapped later without changing the canonical entity definition. |
| System category | Remove `system` from the primary attribute category catalog. Platform ownership should be modeled through `systemManaged` and `mutability`; the primary category should still describe the semantic kind of fact. |
| V1 attribute category catalog | Use `identity`, `core`, `secondary`, `metadata`, `systemLifecycle`, `operationalLifecycle`, `parentRelation`, `childRelation`, `domainRelation`, and `evidence` as the initial primary attribute categories. |
| Metadata vs evidence | Keep `metadata` and `evidence` separate. `metadata` describes source, freshness, trust, or maintenance posture for the record. `evidence` points to proof or trace records that justify a fact, state, review, or outcome, such as decision log entries, audit events, approval records, verification runs, source artifacts, migration proof, or compliance records. |
| Attribute type expansion | Expand the canonical v1 attribute type catalog beyond the current `entityBuilder` foundation to include common managed-entity shapes such as `json`, `money`, `phoneNumber`, `countryCode`, `timezone`, and relationship/file reference types. Exact storage and operator support must be validated before implementation. |
| Reference attribute type names | Use exact v1 reference type names: `relationshipReference`, `imageReference`, `videoReference`, `audioReference`, `documentReference`, and `spreadsheetReference`. Generic file references are denied by default unless explicitly approved through asset governance. |
| Enum type split | Split enum handling into `limitedEnum` and `expandedEnum`. `limitedEnum` is for small bounded choices and should default toward simple select, segmented, radio, checkbox, or toggle-style displays where compatible. `expandedEnum` is for larger or growing choice lists and should default toward drawer select or governed picker displays. |
| Existing enum migration | Existing `entityBuilder` `enum` attributes should migrate to `limited_enum` by default unless evidence shows the option set is large, growing, searchable, grouped, descriptive, badge-oriented, or better handled through a drawer/governed picker posture. Inline options with a small bounded set should map to `limited_enum`; catalog-backed enums should map to `expanded_enum` only when the catalog scale or UX needs justify it. |
| Options source modes | Attribute options should use controlled source modes: `none`, `inline`, `catalogReference`, and `relationshipSource`. `inline` and `catalogReference` options must provide explicit label localization keys and fallback labels, with optional description localization keys and fallback descriptions. `relationshipSource` is for choices derived from governed related records, such as children, siblings, or candidate parents, and must declare target entity, boundary, value/label mapping, optional description/subtitle/badge mapping, allowed statuses, and exclusion rules rather than freeform query logic. |
| Existing options mode migration | Existing `entityBuilder` option modes should map directly into the canonical model: `none` to `none`, `inline` to `inline`, and `catalog_reference` to `catalog_reference`. `relationship_source` is additive for new or richer definitions and should only be used during migration when source evidence clearly shows the options come from governed related entity records. |
| Date and time ranges | Include `dateRange` and `dateTimeRange` alongside `date` and `datetime` so duration/window values do not need to be represented as loosely paired fields by default. |
| File reference types | Split file references by asset kind, including image, video, audio, document, and spreadsheet references. These types are planning-level only until the required asset consumer decision record, authorization, scanning, quota, lifecycle, retention, delivery, and accessibility posture are approved for the consuming feature. |
| Value cardinality | Keep `valueCardinality` separate from attribute type with v1 values `single` and `multiple`. Do not encode arrays by creating separate array type names. |
| Multiple-value limits | Replace loose `minItems`/`maxItems` fields with an explicit `itemLimits` object. For `single`, use `itemLimits` values of `notApplicable`. For `multiple`, `minItems` and `maxItems` may be numbers or `none`; `maxItems` must be greater than or equal to `minItems` when both are numeric. |
| Validation rule catalog | Attribute validation should use a governed rule catalog with type-compatible suggested defaults. Each attribute type should be able to suggest common validation rules, default error-message localization keys, and fallback messages, while still allowing governed explicit overrides where the entity needs stricter or different behavior. |
| Existing validation message migration | Existing literal validation `errorMessage` values should migrate into fallback message copy. Canonical validation messages should use stable localization keys plus fallback copy so old behavior remains readable while future definitions support translation and deterministic message catalogs. |
| Search default | Attributes are `notSearchable` by default. Search/filter/sort posture should be declared through an explicit search block that can be created or changed later through governed entity-definition maintenance. |
| Search storage model catalog | Use controlled search storage model values: `scalar`, `normalizedScalar`, `junctionTable`, `generatedColumn`, `jsonApproved`, `externalIndex`, and `notSearchable`. Searchable multi-value fields must not rely on comma-separated strings; they need junction-table or another approved storage/index strategy. |
| Top-level search model | `searchModel` should declare entity-wide search/list behavior including `globalSearchEnabled`, `globalSearchAttributeKeys`, `sortableAttributeKeys`, `defaultSort`, `pinnedFilterAttributeKeys`, `facetAttributeKeys`, `searchStoragePosture`, and `indexEvidenceKeys`. `defaultSort` may be `none`; otherwise it must reference a sortable attribute. |
| Relationship boundary metadata | Relationship attributes must declare structural boundary constraints, such as tenant, organization, and business-unit boundary posture, to prevent accidental cross-boundary data leakage. These constraints define which relationships are valid; actor permission to create, read, update, or reveal the relationship remains owned by authz/capability logic. |
| Relationship boundary catalog | Use controlled boundary values that describe structural validity, not actor permission: `notApplicable`, same-boundary values such as `sameTenant`, `sameOrganization`, and `sameBusinessUnit`, tree values such as `sameOrganizationTree` and `sameBusinessUnitTree`, hard deny values such as `crossTenantDenied`, `crossOrganizationDenied`, and `crossBusinessUnitDenied`, approval-gated values such as `crossTenantAllowedWithApproval`, and ordinary approved cross-boundary values such as `crossTenantAllowed`. |
| Relationship resolution catalog | Relationship metadata should declare how the relationship is resolved using v1 values `storedReference`, `inverseLookup`, `joinEntity`, `computed`, and `externalLookup`. `storedReference` means this record directly stores the target reference. `inverseLookup` means target records point back to this record and require indexed lookup/index proof. `joinEntity` means a separate linking entity owns the relationship. `computed` means deterministic platform logic resolves the relationship and requires calculation metadata, freshness, and failure/staleness posture. `externalLookup` means an external system/source resolves the relationship and requires source, sync/cache, failure, latency, privacy, and authority posture. |
| Relationship lookup recipe | Relationship entries should include explicit lookup fields: `sourceAttributeKey`, `inverseAttributeKey`, and `joinEntityKey`, using `none` when not applicable. `storedReference` requires `sourceAttributeKey`; `inverseLookup` requires `inverseAttributeKey`; `joinEntity` requires `joinEntityKey`; `computed` requires calculation metadata; `externalLookup` requires external source metadata. |
| Relationship navigation posture | Relationship entries should declare `navigationPosture` with controlled values such as `notNavigable`, `displayOnly`, `navigable`, `governanceOnly`, and `supportOnly`. Exact placement/display remains owned by surface and placement contracts. |
| Complete relationship entries | Each top-level relationship entry should be field-complete with stable key, localization labels/descriptions, category, target entity, role/inverse role, cardinality, resolution, lookup keys, ownership posture, navigation posture, boundary, lifecycle impact, and evidence keys. Use explicit defaults such as `none`, `notApplicable`, and empty arrays where needed. |
| Stable key casing | Stable keys and catalog values should use snake_case where they represent persisted/runtime entity-definition values, including `entityKey`, `attributeKey`, `relationshipKey`, `groupKey`, `statusKey`, `optionKey`, validation rule keys, catalog values, and future persistent registry identifiers. This preserves compatibility with the existing `entityBuilder` foundation. |
| JSON property casing | JSON object property names should remain lowerCamel, such as `entityIdentity`, `sourceAuthority`, `attributeKey`, `valueCardinality`, and `defaultSort`. These are structural field names rather than governed stored values. |
| Relationship ownership posture | Relationship metadata should declare ownership posture using a controlled v1 catalog such as `owns`, `references`, `sharedReference`, and `dependent`. Ownership posture informs lifecycle behavior and gives authz/capability checks a structural guardrail against unauthorized access, editing, or deletion of records owned by another entity or boundary. |
| Relationship lifecycle impact | Relationship lifecycle behavior should be mapped per system lifecycle transition, not as one generic relationship value. V1 transition keys should include `onArchive`, `onDelete`, `onRestore`, and `onSupersede`; candidate impact values include `none`, `restrict`, `cascadeArchive`, `cascadeDelete`, `detach`, `reassignRequired`, `preserveHistorical`, and `cleanupRequired`. |
| Internationalization | Build the entity definition with localization in v1. User-visible entity, group, attribute, option, status, validation, and placement text should declare stable localization keys with fallback copy rather than relying on English literals as permanent truth. |
| Groups | Groups are declared once at the entity level and reused by placements. Surface-local groups are deferred unless later complexity proves they are needed. |
| Group metadata | Groups are separate presentation metadata, likely `presentationGroups` or `attributeGroups`, not meta-attributes and not entity data fields. |
| Group meaning | Groups are presentation-only. Semantic meaning such as identity, lifecycle, relationship, metadata, security, privacy, evidence, or system belongs on the attribute itself. |
| Group order | Groups should carry their own display order. Attribute placement order is scoped within the relevant surface, region, and group; for ungrouped regions it is scoped to the surface and region. |
| Optional placement | Not all attributes need placements. Unplaced attributes remain part of the canonical definition but are not rendered by default. |
| Placement interaction and visibility | Split placement posture into `interactionMode` and `visibilityMode`. `interactionMode` describes what can happen at the placement, such as `readOnly`, `editable`, or `actionOnly`. `visibilityMode` describes whether it appears by default, such as `defaultVisible`, `hiddenByDefault`, or `conditional`. |
| Placement text overrides | Defer placement-specific label/help overrides until a concrete use case appears. For now, placements should use canonical attribute text by default, while design-system contracts decide whether labels are displayed for a region. |
| Placement key configurability | `surfaceKey`, `surfaceVariantKey`, `regionKey`, and `elementKey` may be configurable only through approved design-system contracts. Entity definitions select from approved keys and combinations; they must not invent entity-local slot, region, variant, or element names. |
| Future tenant/org presentation overlays | Tenant or organization presentation customization should be modeled later as an overlay on top of the canonical entity definition, not as edits to the canonical definition. Overlays may choose from approved design-system keys and allowed override points, but must not invent attributes, weaken security/privacy/system-managed rules, expose restricted fields without authz/clearance, change relationship boundaries, or change persistence/API semantics. |
| Entity management design-system templates | `surfaceModel` should remain an attachment point until the entity-management design-system templates are built and signed off. When the record-management list-centric and operational-management status-centric templates are created, update this entity definition model to reference their approved design-system contract keys, surface variants, allowed regions, elements, and validation rules. |
| Surface model placeholder | `surfaceModel` should include a section-complete placeholder with management pattern, enabled surfaces, default surface key, overlay eligibility, design-system contract keys, and evidence keys. Include planned management pattern values `recordManagementListCentric` and `operationalManagementStatusCentric` now, with contract details pending design-system signoff. |
| Entity routing topology | `surfaceModel` should also declare where the entity is surfaced in the app topology: app/shell area, module/top-nav grouping, primary page/context-nav destination, canonical route, and parent pages when applicable. Routing values must align with approved frontend topology and must not introduce new durable destinations through ad hoc page code. |
| Hidden-by-default placement | Hidden-by-default is useful as a visibility intent for fields that have a reserved location but should only appear when later rules allow it. |
| Permission boundary | Entity definitions should not own full authorization policy. Attribute mutability and placement interaction describe domain/rendering posture; capability/authz contracts later decide who may see, reveal, edit, or act. |
| Design-system boundary | Whether a surface/region/element supports an interaction mode such as hidden-by-default should be validated through the design-system component contract, not hard-coded as entity-specific UI logic. |

## Work Streams

| Stream | Purpose | First planning outcome |
| --- | --- | --- |
| Entity definition structure | Define the canonical shape of a finished entity definition. | A locked schema/contract proposal for entity-level metadata, attributes, status, lifecycle, relationships, validation, display hints, and governance metadata. |
| Definition creation and maintenance | Define how rudimentary source inputs become deterministic entity definitions and how they are validated, versioned, reviewed, and regenerated. | A governed source-input model and maintenance lifecycle that can be implemented later without relying on freeform custom code. |
| Consumption and migration | Define how generated pages, API-aware mappings, data dictionary docs, forms, search, permissions, and existing entities consume or migrate into the definition. | A compatibility and adoption plan for current entities such as root users and organizations, plus generated/default management surfaces. |

## Discovery Questions To Track

| Question | Status | Notes |
| --- | --- | --- |
| What entity-definition concepts already exist in the repo? | investigated-initial | Initial findings are recorded below. Main sources are `entityBuilder`, ADR-0021, data dictionary registry migration guidance, the data dictionary template/examples, form-pattern catalog, capability mappings, and frontend/design-system governance docs. |
| Where are they inconsistent, incomplete, or duplicated? | investigated-initial | Key gaps are the narrow implemented `entityBuilder` shape, richer Markdown data-dictionary shape, naming/case differences, global attribute ordering, missing relationships/surfaces/compliance/search/action sections, and limited current catalogs. |
| What should the canonical entity definition structure be? | draft_v1_ready | Working shape is section-complete and recorded as a draft v1 canonical model. Next step is formal schema/catalog/validation work, not more broad discovery. |
| What rudimentary value tables or source inputs should feed it? | deferred | To be planned after the finished definition shape is clear. |
| Which fields/configuration values are required versus optional? | open | Should be answered as part of the canonical structure. |
| How should attributes declare display, drawer grouping, form behavior, searchability, status behavior, validation, relationships, permissions, and lifecycle behavior? | open | Attribute-level declaration is expected to be central, but exact boundaries are not locked. |
| How should existing entities migrate safely? | deferred | Migration should follow the generic structure and preserve API, persistence, routing, and docs compatibility. |
| What artifacts, tests, generated docs, and checks are required before lock-in? | deferred | Expected to include schema tests, validation tests, generated-doc checks, data dictionary alignment, API/permission compatibility, and migration proof. |

## Initial Repo Comparison Findings

Read-only comparison on 2026-05-17 found that the repo already has several
pieces of this direction, but they live at different maturity levels.

| Finding | Source | Planning implication |
| --- | --- | --- |
| `entityBuilder` already owns durable entity-definition lineages, immutable versions, version-owned attributes, validation rules, inline options, computed source links, catalog reads, validation, and exports. | `src/features/entityBuilder/`; `docs/featureDocs/entityBuilder-feature.md`; ADR-0021 | The current implementation is a compatibility anchor and source of migration evidence. The richer discovery model supersedes it as the intended canonical target. |
| The implemented builder intentionally shipped a narrow v1: attribute kind/type/cardinality, labels/descriptions/help/placeholder, form-facing flag, default form pattern, options, computed source links, validation, and export. | `src/features/entityBuilder/contract/schemas.ts`; `src/features/entityBuilder/domain/catalogs.ts`; `src/features/entityBuilder/persistence/migrations/0014_create_entity_builder_foundation.sql` | The target model is allowed to replace this shape conceptually. Lock-in should still include an explicit compatibility/versioning plan for moving from current behavior/export format v1 to the richer model. |
| ADR-0021 explicitly deferred relationships, cross-entity computed dependencies, field grouping, richer form-layout truth, reusable option-catalog management, frontend authoring, and dedicated audit entities. | `docs/architecture/adr/0021-add-a-versioned-entity-definition-foundation-with-derived-export-seams.md` | These are not contradictions; they are approved follow-up areas that align with this planning work. |
| The data dictionary template and registry migration map already describe many of the richer sections: source authority, attribute inventory, lifecycle, relationships, indexes, validation, search, mutation, retention/cleanup, authorization, UI/design-system posture, compliance, errors, and evidence. | `docs/templates/data-dictionary-entity-template.md`; `docs/standards/data-dictionary-registry-migration-map.md` | The canonical model should be the machine-readable successor to the Markdown bridge, and should supersede both the Markdown bridge and current builder shape once locked and implemented. |
| Existing data dictionaries for Organization-family entities already point to `entityBuilder` or an approved successor registry as the future metadata owner. | `docs/data-dictionary/organization.md` and related Organization dictionaries | Organization migration should be safe as a later pilot because current docs already expect registry-backed truth eventually. |
| The existing form-pattern catalog already governs durable attribute control references and ties them to signed-off design-system seams. | `docs/workspace/entity-definitions/approved-form-pattern-catalog.md`; `src/features/entityBuilder/domain/catalogs.ts` | Our `elementKey`/surface placement model should reuse this posture and extend it from form-only controls to surface/region/element contracts. |
| Current `entityBuilder` keys and catalogs use snake_case values and validation keys such as `catalog_reference`, `min_length`, and `type_format`, while this planning tracker has been using lowerCamel JSON-like values such as `catalogReference` and `minLength`. | `src/features/entityBuilder/contract/schemas.ts`; this tracker | Key casing and catalog value style must be decided before lock-in to avoid a painful translation layer. Existing persisted/runtime values are compatibility-sensitive. |
| Current `entityBuilder` key validation expects snake_case stable keys. Existing docs use a mix: entity keys such as `organization`, feature keys such as `organizationCore`, and capability keys with dots. | `src/features/entityBuilder/contract/schemas.ts`; data dictionary docs | Canonical field-specific key rules are needed. Not every key family should necessarily share one regex. |
| Current attribute ordering is one global `displayOrder` per attribute/version, with a unique constraint. Our planned model uses scoped placement order by surface/region/group. | `0014_create_entity_builder_foundation.sql`; presentation decisions in this tracker | This is a real migration issue. The richer model should preserve/translate current global order into default placements rather than breaking historical exports. |
| Current validation stores literal `errorMessage` values and derives type defaults at export time; our model adds localization keys, fallback messages, and a larger rule catalog. | `src/features/entityBuilder/domain/helpers.ts`; `src/features/entityBuilder/domain/presenters.ts` | Validation expansion should keep effective-default derivation but add localized message contracts and versioned rule catalogs. |
| Current security posture is root-only with root capability mappings for create, update, read, catalog read, validate, and export. | `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`; `tests/security/entityBuilder/security.test.ts` | Entity-definition maintenance actions should map to current and future `entity-builder.*` capabilities, but the entity definition itself should not become the authz engine. |
| Current executable tests prove protected routes, draft-only update, activation validation, export behavior, catalog alignment, root-only security, audit visibility, and Postgres version history. | `tests/unit/entityBuilder/service.test.ts`; `tests/integration/entityBuilder/flow.test.ts`; `tests/security/entityBuilder/security.test.ts`; `tests/audit/entityBuilder/audit.test.ts`; `tests/integration/entityBuilder/persistence.test.ts` | Lock-in should require analogous tests for every expanded section, plus compatibility tests proving current v1 definitions/export consumers still work or migrate cleanly. |

## Reconciliation Decisions Still Needed

These are the main decisions left before the entity-definition structure can be
treated as locked.

| Topic | Why it matters | Recommended posture |
| --- | --- | --- |
| Canonical target authority | Current `entityBuilder` is narrower than this discovery model. | Decision locked: the structure decided in this discovery stream supersedes current `entityBuilder` as the target model. Current builder remains a compatibility/migration concern only. |
| Canonical key casing | Existing runtime/persistence uses snake_case for entity/attribute keys and catalog values. Planning examples currently use mixed casing. | Decision locked: stable stored/runtime/catalog values use snake_case; JSON object property names use lowerCamel. Existing persisted/runtime values remain compatibility-sensitive. |
| Existing `attributeKind` vs planned richer fields | Current builder uses `persisted` and `computed`; planning adds semantic category, attribute type, cardinality, `systemManaged`, `mutability`, `derived`, and `calculated`. | Decision locked: do not keep `attributeKind` as canonical. Map current `attributeKind` values into the richer canonical fields during migration/compatibility handling. |
| Existing enum migration | Current builder has one `enum` type. | Decision locked: migrate existing `enum` to `limited_enum` by default. Use `expanded_enum` only when evidence shows the choices are large, growing, searchable, grouped, descriptive, badge-oriented, or better suited to a drawer/governed picker. |
| Existing options mode migration | Current builder uses `none`, `inline`, and `catalog_reference`. | Decision locked: map existing values directly. Add `relationship_source` only for new/richer definitions or when migration evidence clearly shows choices come from related entity records. |
| Global `displayOrder` migration | Existing rows require one display order per attribute; planned placements need scoped order. | Decision locked: map current `displayOrder` into default surface placement order during migration. New canonical ordering lives on placements scoped by surface, region, and group. |
| Validation message localization | Current validation rules may store literal `errorMessage` values. | Decision locked: migrate old literal messages into fallback copy. Canonical validation messages use localization keys plus fallback messages. |
| Export format evolution | Existing export is `exportFormatVersion = 1` and narrow. | Decision locked: introduce a new explicit export/read shape, expected as export format v2 or equivalent, for the full canonical model. Do not silently change v1. |
| Definition-version status mapping | Current builder definition versions use `draft`, `active`, `superseded`, and `archived`. | Decision locked: keep definition-version status separate from managed-record system lifecycle. Definition statuses govern the definition artifact/version; system lifecycle governs records managed by that definition. |
| Data dictionary bridge | Markdown data dictionaries are current-state docs; future registry truth should generate or mirror them. | Keep `sourceAuthority` and `migrationModel` explicit until persistent registry truth is primary and Markdown posture changes. |

## Candidate Canonical Schema Outline

This is the draft v1 canonical shape for the governed entity definition. It is
ready for schema formalization, but it is not an implementation contract yet.

Rules for this outline:

- JSON property names use lowerCamel.
- Stable keys and catalog values use snake_case.
- Every top-level section is required.
- Empty/default states should be explicit, not omitted.
- Current `entityBuilder` fields are migration inputs where they differ from
  this target model.

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

### Entity Identity

`entityIdentity` describes what the entity is and who owns it.

Required fields:

| Field | Value posture |
| --- | --- |
| `entityKey` | Stable snake_case key for the entity. |
| `singularLabelKey` / `singularLabelFallback` | User-visible singular label. |
| `pluralLabelKey` / `pluralLabelFallback` | User-visible plural label. |
| `descriptionKey` / `descriptionFallback` | Human-facing explanation of what the entity represents. |
| `purposeKey` / `purposeFallback` | Why the platform manages this entity. |
| `owningFeatureKey` | Stable feature key, even if planned. |
| `owningFeaturePosture` | `implemented`, `planned`, or `not_yet_assigned`. |
| `owningLayer` | `feature`, `platform`, `system`, or `shared`. |
| `entityFamilyKey` | Stable grouping/family key or `none`. |
| `managementScope` | `root`, `tenant`, `shared_cross_tenant`, `system`, or `public`. |
| `definitionVersion` | Version number or stable version token. |

### Source Authority

`sourceAuthority` declares what wins today, what should win later, and how repo
artifacts transition toward persistent definition truth.

Required fields:

| Field | Value posture |
| --- | --- |
| `currentAuthority` | `repo_artifacts`, `runtime_source`, `planning_artifact`, `persistent_entity_definition`, or `mixed_transitional`. |
| `targetAuthority` | `persistent_entity_definition` or approved exception such as `external_system_of_record`. |
| `transitionPosture` | `not_yet_migrated`, `partially_migrated`, `mirrored_transitional`, or `persistent_primary`. |
| `sourcePrecedence` | Ordered source keys. |
| `markdownPosture` | `source`, `source_independent_planning`, `mirrored_transitional`, `generated_output`, or `not_applicable`. |
| `evidenceKeys` | Evidence entries supporting source authority. |

### Evidence Registry

`evidenceRegistry` gives every section a stable way to point to source proof.

Each entry should include:

| Field | Value posture |
| --- | --- |
| `evidenceKey` | Stable snake_case key. |
| `sourceType` | Controlled source type such as `source_code`, `migration`, `api_contract`, `data_dictionary`, `prd`, `adr`, `decision_log`, or `persistent_record`. |
| `sourceLocationType` | `repo_path`, `persistent_record`, `external_ref`, or `not_applicable`. |
| `repoPath` | Repo path or `none`. |
| `persistentRecordRef` | Persistent record reference or `none`. |
| `externalRef` | External reference or `none`. |
| `transitionPosture` | How this evidence should evolve during migration. |
| `proofStatement` | Short human-readable proof. |
| `reviewedAt` | ISO date or `not_reviewed`. |

### Attributes

`attributes` is the core governed field catalog for the entity.

Each attribute should be field-complete.

| Field | Value posture |
| --- | --- |
| `attributeKey` | Stable snake_case key. |
| `labelKey` / `labelFallback` | User-visible label. |
| `descriptionKey` / `descriptionFallback` | User-visible description. |
| `category` | `identity`, `core`, `secondary`, `metadata`, `system_lifecycle`, `operational_lifecycle`, `parent_relation`, `child_relation`, `domain_relation`, or `evidence`. |
| `attributeType` | Controlled type such as `string`, `uuid`, `limited_enum`, `expanded_enum`, `datetime`, `relationship_reference`, `image_reference`, etc. |
| `valueCardinality` | `single` or `multiple`. |
| `itemLimits` | `{ "minItems": "not_applicable", "maxItems": "not_applicable" }` for single; numeric or `none` for multiple. |
| `required` | Boolean. |
| `systemManaged` | Boolean. |
| `mutability` | `immutable`, `create_only`, `updateable`, `system_updateable`, `lifecycle_managed`, `relationship_managed`, `derived`, or `calculated`. |
| `privacyClassification` | `none`, `not_sensitive`, or `sensitive`. |
| `sensitivePrivacyCategory` | Sensitive category or `not_applicable`. |
| `securityClassification` | `none`, `internal`, `restricted`, or `classified`. |
| `securityClassificationLevel` | Classification level or `not_applicable`. |
| `validationRules` | Governed validation rule entries with message keys/fallbacks. |
| `options` | Options source block. |
| `search` | Attribute-level search block, defaulting to `not_searchable`. |
| `placements` | Optional approved surface placements. |
| `sourceMetadata` | Source/derivation/calculation metadata, explicit defaults when not applicable. |
| `evidenceKeys` | Supporting evidence. |

### Presentation Groups

`presentationGroups` are reusable entity-level grouping metadata for placements.

Each group should include:

| Field | Value posture |
| --- | --- |
| `groupKey` | Stable snake_case key. |
| `labelKey` / `labelFallback` | User-visible group label. |
| `descriptionKey` / `descriptionFallback` | Optional user-visible description. |
| `displayOrder` | Group order relative to other groups. |
| `evidenceKeys` | Supporting evidence. |

### Placements

Placements live on attributes and declare where an attribute appears.

Each placement should include:

| Field | Value posture |
| --- | --- |
| `surfaceKey` | Approved design-system surface key. |
| `surfaceVariantKey` | Approved variant or `none`. |
| `regionKey` | Approved region for the surface. |
| `elementKey` | Approved design-system element/control/display key. |
| `groupKey` | Group key or `none`. |
| `displayOrder` | Order within the surface/region/group. |
| `interactionMode` | `read_only`, `editable`, or `action_only`. |
| `visibilityMode` | `default_visible`, `hidden_by_default`, or `conditional`. |

### Operational Status Set

`operationalStatusSet` declares the business/workflow statuses for records of
this entity.

Required fields:

| Field | Value posture |
| --- | --- |
| `statusAttributeKey` | Attribute that stores operational status, or `none`. |
| `statuses` | Nested status entries. |
| `evidenceKeys` | Supporting evidence. |

Each status entry includes stable key, labels/descriptions, display order, tab
eligibility, badge tone, default-for-create posture, allowed transitions, and
optional child statuses.

### Relationships

`relationships` declares meaningful/navigable connections to other entities.

Each relationship should include:

| Field | Value posture |
| --- | --- |
| `relationshipKey` | Stable snake_case key. |
| `labelKey` / `labelFallback` | User-visible label. |
| `descriptionKey` / `descriptionFallback` | User-visible description. |
| `relationshipCategory` | `parent_relation`, `child_relation`, or `domain_relation`. |
| `targetEntityKey` | Target entity key. |
| `relationshipRole` / `inverseRelationshipRole` | Business role labels. |
| `cardinality` | Controlled relationship cardinality. |
| `resolution` | `stored_reference`, `inverse_lookup`, `join_entity`, `computed`, or `external_lookup`. |
| `sourceAttributeKey` | Source reference attribute or `none`. |
| `inverseAttributeKey` | Target-side reference attribute or `none`. |
| `joinEntityKey` | Join entity key or `none`. |
| `ownershipPosture` | `owns`, `references`, `shared_reference`, or `dependent`. |
| `navigationPosture` | `not_navigable`, `display_only`, `navigable`, `governance_only`, or `support_only`. |
| `relationshipBoundary` | Tenant, organization, and business-unit boundary rules. |
| `relationshipLifecycleImpact` | Impact by transition: `onArchive`, `onDelete`, `onRestore`, `onSupersede`. |
| `evidenceKeys` | Supporting evidence. |

### Search Model

`searchModel` declares entity-wide search/list behavior.

Required fields:

| Field | Value posture |
| --- | --- |
| `globalSearchEnabled` | Boolean. |
| `globalSearchAttributeKeys` | Attribute keys or empty array. |
| `sortableAttributeKeys` | Attribute keys or empty array. |
| `defaultSort` | Sort declaration or `none`. |
| `pinnedFilterAttributeKeys` | Attribute keys or empty array. |
| `facetAttributeKeys` | Attribute keys or empty array. |
| `searchStoragePosture` | Entity-level storage/index posture. |
| `indexEvidenceKeys` | Supporting index/search evidence. |

### Surface Model

`surfaceModel` declares where and how the entity can appear in the app.

Required fields:

| Field | Value posture |
| --- | --- |
| `managementPattern` | `not_yet_assigned`, `record_management_list_centric`, `operational_management_status_centric`, or `custom_approved`. |
| `routingTopology` | App/module/page/route placement. |
| `enabledSurfaces` | Approved surfaces or empty array. |
| `defaultSurfaceKey` | Default surface or `none`. |
| `overlayEligible` | Boolean. |
| `designSystemContractKeys` | Approved contract keys. |
| `surfaceEvidenceKeys` | Supporting evidence. |

### Action Model

`actionModel` maps governed entity actions to capability/API/surface behavior.

Required fields:

| Field | Value posture |
| --- | --- |
| `actions` | Flat action array. |
| `actionErrorCatalog` | Shared action-level errors and messages. |
| `evidenceKeys` | Supporting evidence. |

Each action row should include action key, family, owner, execution mode,
capability mapping, route/surface mapping, lifecycle/status effects,
compatibility risk, review requirement, action-level errors, and test/evidence
requirements.

### Compliance Model

`complianceModel` summarizes entity-level privacy, security, audit, retention,
delete, export, cleanup, legal-hold, and encryption posture.

Required fields:

| Field | Value posture |
| --- | --- |
| `privacyImpact` | `none`, `contains_pii`, `contains_sensitive_pii`, or `mixed`. |
| `sensitivePrivacyCategoriesPresent` | Derived list from attributes. |
| `securityImpact` | Entity-level security summary. |
| `auditRequired` | Boolean. |
| `retentionPolicyKey` | Policy key or `none`. |
| `deletePosture` | Delete posture catalog value. |
| `legalHoldSupported` | Boolean. |
| `exportPosture` | Export posture catalog value. |
| `cleanupPosture` | Cleanup posture catalog value. |
| `encryptionPosture` | At-rest, in-transit, field-level, key policy, and overrides. |
| `evidenceKeys` | Supporting evidence. |

### Generation Model

`generationModel` declares what this definition may generate or drive.

Required fields:

| Field | Value posture |
| --- | --- |
| `generationMode` | `none`, `preview_only`, `preview_then_apply`, `automatic`, or `manual_operational`. |
| `allowedOutputCategories` | Approved output categories. |
| `blockedOutputCategories` | Blocked output categories. |
| `driftDetectionRequired` | Boolean. |
| `evidenceKeys` | Supporting evidence. |

### Migration Model

`migrationModel` tracks movement from current repo/source artifacts into
persistent entity-definition truth.

Required fields:

| Field | Value posture |
| --- | --- |
| `migrationStatus` | `not_started`, `inventory_in_progress`, `mapped_to_definition`, `persistent_record_created`, `mirrored_transitional`, `persistent_primary`, or `blocked`. |
| `currentSourcePosture` | Current source posture. |
| `targetSourcePosture` | Target source posture. |
| `currentArtifactKeys` | Current source artifacts. |
| `targetPersistentRecordKey` | Target persistent record key or `none`. |
| `compatibilityChecksRequired` | Required compatibility checks. |
| `blockingIssues` | Known blockers or empty array. |
| `migrationEvidenceKeys` | Supporting evidence. |

## Related Repo Signals To Investigate

These were the starting points for the initial repo comparison and should remain
the core source list for later lock-in review.

| Area | Candidate source | Why it matters |
| --- | --- | --- |
| Existing backend entity definition foundation | `src/features/entityBuilder/` | Already owns durable entity-definition lineages, versions, attributes, validation rules, options, catalog reads, validation, and exports. |
| Feature reference | `docs/featureDocs/entityBuilder-feature.md` | Documents current `entityBuilder` scope and current gaps such as relationship modeling, field grouping, option-catalog management, and code generation. |
| Data dictionary migration bridge | `docs/standards/data-dictionary-registry-migration-map.md` | Maps Markdown data dictionary sections to future registry-backed rows. |
| Data dictionary entity template | `docs/templates/data-dictionary-entity-template.md` | Already names structured concepts like entity registry header, attribute inventory, status/lifecycle, relationships, validation, search, authorization, UI posture, retention, and evidence. |
| Existing entity examples | `docs/data-dictionary/organization.md`, `docs/featureDocs/rootUsers-feature.md`, organization feature docs | Likely migration examples once the generic model is ready. |
| API and capability mapping | `docs/api-contracts/`, `docs/workspace/exports/capability-contract-catalog-v1.generated.json` | Future entity definitions should eventually map predictably to list/read/create/update and permission-capability behavior. |
| Frontend topology and design-system patterns | `docs/workspace/design-system/`, `docs/workspace/architecture-map/layers/frontend-*.md` | Generated/default entity pages must respect governed frontend topology and design-system adoption rules. |

## Initial Structure Hypothesis

The canonical definition will likely need these sections:

| Section | Expected purpose |
| --- | --- |
| Entity identity | Stable key, name, description, owning feature, authority posture, version/status metadata. |
| Source authority | What wins today, what wins later, and whether Markdown/source/runtime/registry truth is authoritative or transitional. |
| Attributes | Stable attribute keys, labels, descriptions, kind/type/cardinality, required/system/mutability posture, validation, options, search/filter/sort role, form/display hints, grouping, and source evidence. |
| Status and lifecycle | Generic status terms, entity-specific mappings, visibility, allowed transitions, archive/delete/restore/supersede posture. |
| Relationships | Parent/child/reference/supersession/dependency relationships, ownership rules, lifecycle impact, and navigation treatment. |
| Surface posture | Whether API, UI, generated docs, forms, drawers, search, filters, tabs, and management pages are required, planned, existing, or not applicable. |
| Governance and evidence | Permissions posture, tenant/root boundary, audit needs, retention/cleanup/export/legal-hold posture, and source/evidence links. |

## Known Non-Goals For This Pass

- Do not implement source changes.
- Do not add or change runtime tables.
- Do not change API routes or OpenAPI.
- Do not build generated entity pages.
- Do not migrate root users, organizations, or any other existing entity yet.
- Do not treat the current `entityBuilder` implementation as sufficient for the
  full governed model; it is the durable foundation and compatibility anchor
  that the richer model must reconcile with.

## Next Discovery Step

Discovery for the entity-definition shape is complete enough. The next work is
not more broad discovery; it is schema formalization and governed planning.

Recommended next step when work resumes:

> Create a formal schema/catalog/validation planning artifact for the governed
> entity definition draft v1, including compatibility requirements for current
> `entityBuilder` data and export v1 consumers.

## Schema Formalization Entry Criteria

Before implementation, the draft v1 canonical model should be converted into a
formal governed schema package that defines:

- exact JSON/schema shape for every section
- exact catalog values and casing rules
- required/default field behavior
- validation rules and default messages
- compatibility mapping from current `entityBuilder`
- export/read v2 behavior
- migration checks for existing definitions
- generated documentation expectations
- tests required before the model is considered locked
