# Organization Reference Value

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-reference-value` |
| Entity name | Organization Reference Value |
| Dictionary file | `docs/data-dictionary/organization-reference-value.md` |
| Owning feature | planned `organizationReferenceCatalogues` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_reference_value`, planned `OrganizationReferenceValueRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent dictionary entry | implemented source, migrations, and registry-backed dictionary truth | PRD, API contracts, this page |
| Source precedence | Approved PRD/API/data dictionary own planned behavior until implementation exists. | Runtime source and migrations win after implementation; registry rows and generated docs must reconcile. | future `organizationReferenceCatalogues` implementation |
| Runtime persistence owner | planned `organizationReferenceCatalogues` | `organizationReferenceCatalogues` unless broader platform catalogue is approved | future `src/features/organizationReferenceCatalogues` |
| Runtime persistence record | planned `organization_reference_value` | reference-value table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-reference-value` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Organization reference catalogue persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | System-owned option-list value used by Organization-domain records. |
| Business purpose | Provides controlled choices tenant admins can select, such as organization type, legal form, industry category, location type, integration type, or relationship type. |
| Durable fact boundary | Stable key, reference type, label, lifecycle state, replacement link, root-admin ownership, tenant-admin read/use posture, and historical meaning. |
| Primary users / actors | Root admins, tenant admins as readers/users, Organization-domain services, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct the option-list table, root-only mutation, tenant read/use, immediate label update, and used-value retention rules. |

## Plain-Language Meaning

| Question | Answer |
| --- | --- |
| What is a reference value? | A controlled option in a list, managed by root admins and selected by tenant admins. |
| What is it not? | It is not a customer-created Organization record and it is not free text. |
| Example values | Organization type, legal form, industry category, location type, integration type, relationship type. |
| Why store it as a record? | So used choices keep stable meaning, can be renamed immediately by reference, and can be archived/deprecated/replaced without silently breaking historical records. |
| Why not hard-code only enums? | Some option lists may need root-admin changes without a deployment, while still remaining system-owned and governed. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_reference_value` |
| Primary key | `organization_reference_value_id` |
| Stable external key | planned stable `reference_value_key` |
| Versioning model | `mutable-current-record` with replacement link for used values |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | not-applicable; system-owned catalogue |
| Soft-delete field | not approved; use archive/deprecate/replace posture for used values |
| Archive field | `archived_at`; business state held in `lifecycle_status` |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.reference-value.create` | `governance-approval` | create option-list value | root | UI/API | adds usable system-owned value | audit create | PRD/API contracts | Tenant admins cannot mutate catalogue. |
| `organization.reference-value.read` | `read-discovery` | list approved reference values | root, tenant | UI/API/search/export | no mutation | access proof | API contracts | Tenant admins may list/use active approved values. |
| `organization.reference-value.update-label` | `governance-approval` | rename reference value | root | UI/API | label applies immediately everywhere by reference | audit update | PRD | Historical records keep durable meaning by reference. |
| `organization.reference-value.archive` | `lifecycle` | archive reference value | root | UI/API | removes from normal new selection | audit archive | PRD | Used values must not disappear silently. |
| `organization.reference-value.deprecate` | `lifecycle` | deprecate reference value | root | UI/API | marks value discouraged/retained | audit deprecate | PRD | Used values remain readable. |
| `organization.reference-value.replace` | `relationship-control` | replace with another value | root | UI/API | links old value to replacement | audit replacement | PRD/API contracts | Explicit replacement required where used value is removed. |

## Capability Family Rules

| Capability family | Meaning for Reference Value | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads reference values for display/use. | The operation inspects catalogue truth. |
| `governance-approval` | Root-admin catalogue mutation. | The operation changes system-owned catalogue values. |
| `lifecycle` | Archives or deprecates values. | The operation changes selection/currentness posture. |
| `relationship-control` | Replaces or links values. | The operation creates replacement relationship. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_reference_value_id` | `organization_reference_value_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `reference_type` | `reference_type` | `core` | `TEXT or enum` | `single` | yes | no | create-only | exact, facet | grouped catalogue category | PRD Reference Values |
| `reference_value_key` | `reference_value_key` | `identity` | `TEXT` | `single` | yes | no | immutable | exact | stable machine key | inferred |
| `label` | `label` | `core` | `TEXT` | `single` | yes | no | updateable | prefix, full-text | display label | PRD Reference Values |
| `replacement_reference_value_id` | `replacement_reference_value_id` | `relationship` | `UUID or NULL` | `single` | no | no | lifecycle-only | exact | replacement link | PRD Reference Values |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active`, `archived`, `deprecated`, or `replaced` | `single` | yes | yes | lifecycle-only | exact, facet | status badge | PRD Reference Values |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deprecated_at` | `deprecated_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | PRD Reference Values |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Reference Value | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable value identity/key. | Hidden or read-only metadata. | Immutable once used. | The value identifies the catalogue entry. |
| `core` | Reference type and label. | Catalogue management list/form. | Strong validation and immediate read propagation. | The field defines the displayed catalogue value. |
| `relationship` | Replacement link. | Replacement selector/link. | Must validate target value and historical meaning. | The field points to another value. |
| `lifecycle` | Active/archive/deprecate/replace posture. | Status badge and lifecycle controls. | Root-only lifecycle actions. | The field changes selection/use posture. |
| `system` | Platform-managed timestamps. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Approved value usable by tenant admins and records. | normal catalogue reads | rename, archive, deprecate, replace | PRD Reference Values |
| `superseded` | Mapped to explicit `replaced` lifecycle value when old value points to replacement. | retained/historical reads | read, export, maybe display replacement | PRD |
| `archived` | Value not available for new use but retained. | explicit/retained catalogue reads | restore only if approved later | PRD |
| `deleted` | Not approved for used values in v1. | not-applicable | not-applicable unless future purge policy exists | PRD |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `reference-value.replacement` | `replacement` | Organization Reference Value | Organization Reference Value | many-to-one optional | Root admins choose explicit replacement. | Used old value remains readable with replacement link. | replacement badge/link. | PRD Reference Values |
| `reference-value.used-by-organization-records` | `reference` | Organization-domain records | Organization Reference Value | many-to-one | Tenant admins may use approved active values only. | Archived/deprecated/replaced values retain historical meaning. | retained label display. | PRD |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_reference_value_pkey` | `primary key` | `organization_reference_value_id` | Stable row identity. | Supports references and audit. | planned |
| `uq_reference_value_key` | `unique` | `reference_type`, `reference_value_key` | Stable unique key per reference type. | Prevents catalogue ambiguity. | inferred |
| `ix_reference_value_status` | `index` | `reference_type`, `lifecycle_status` | Catalogue read index. | Supports grouped active/deprecated/archived reads. | inferred |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `reference-value.root-only-mutation` | all mutation routes | Only root admins mutate system-owned catalogue. | forbidden error. | PRD/API contracts |
| `reference-value.tenant-read-only` | tenant-admin routes | Tenant admins may read/use approved values but cannot mutate. | forbidden error. | PRD |
| `reference-value.used-value-retained` | lifecycle actions | Used values must be archived, deprecated, or replaced rather than silently removed. | in-use or invalid replacement error. | API contracts |
| `reference-value.label-immediate` | `label` | Label changes apply immediately by reference. | not-applicable | PRD |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `reference_type` | exact, facet | scalar | catalogue index | Groups values by type. | PRD |
| `reference_value_key` | exact | scalar | unique index | Stable lookup. | inferred |
| `label` | prefix, full-text, sort | scalar | planned label index | Catalogue display/search. | PRD |
| `lifecycle_status` | exact, facet | scalar | status index | Active values are normal use set. | PRD |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root via reference create | type, key, label | stamps IDs and timestamps, active status | Creates system-owned value. | PRD |
| `update` | root via reference update | label and allowed metadata | refreshes `updated_at` | Label updates apply immediately everywhere. | PRD |
| `archive` | root via reference archive | lifecycle fields | archived status/timestamp | Used values remain retained. | PRD |
| `deprecate` | root via reference deprecate | lifecycle fields | deprecated status/timestamp | Used values remain readable. | PRD |
| `replace` | root via reference replace | replacement link, lifecycle fields | replacement relationship and timestamp | Replacement target must be valid. | API contracts |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Used reference values remain retained as archived/deprecated/replaced. | `organizationReferenceCatalogues` | lifecycle action/use by records | mutation failures require audit evidence later. | future tests | PRD |
| Cleanup | No silent delete/purge for used values in v1. | `organizationReferenceCatalogues` | not-applicable | not-applicable until approved. | this page | PRD |
| Export | Included in private exports as referenced display/current metadata where selected. | `organizationExports` reads via catalogue seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Not approved for used values; archive/deprecate/replace instead. | `organizationReferenceCatalogues` | root lifecycle action | failure evidence required later. | future tests | PRD |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root for mutation; tenant/root for read/use | API contracts |
| Tenant context required | no for system catalogue mutation; tenant context may filter use/read where needed | API contracts |
| Tenant context source | root system catalogue routes; tenant-admin current context for reads | API contracts |
| Governing capability | planned reference catalogue read/manage capabilities | API contracts |
| Cross-tenant posture | system-owned, not tenant-owned; use by tenant-scoped records still tenant-authorized | PRD |
| Object-level rule | Tenant records may only use approved values through Organization-domain validation. | PRD |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned root mutation and tenant/root read APIs | API contracts |
| UI required | root catalogue management plus picker/read surfaces | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | grouped catalogue by reference type and lifecycle status | API contracts |
| Detail view treatment | value metadata plus replacement/deprecated posture | API contracts |
| Create/edit treatment | root-only governed form | PRD |
| Lifecycle action treatment | archive/deprecate/replace confirmations | PRD |
| Relationship navigation treatment | show used-by and replacement links where approved later | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | internal platform catalogue metadata | PRD |
| Privacy / PII relevance | low by itself | data dictionary planning |
| Security relevance | moderate because values affect classification and UI behavior | AGENTS defaults |
| Audit relevance | yes for root catalogue mutations and replacement decisions | PRD/test planning |
| Retention / cleanup posture | used values retained; no silent disappearance | PRD |
| Export / deletion posture | private export may include reference labels/keys; no hard delete approved for used values | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future catalogue mutation tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable catalogue record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | PRD/API contracts | Stable key/label rules need implementation proof. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Used values use archive/deprecate/replace posture, not normal soft delete. |
| Tenant boundary / object-level authorization | yes | planned | future authz tests | System catalogue mutation is root-only. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Used value retention not implemented. |
| Auditability and operational evidence | yes | planned | future audit tests | Root catalogue changes require audit evidence. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_REFERENCE_VALUE_NOT_FOUND` | reference value cannot be found. | `referenceValueId` | missing or unavailable value | API contracts |
| `ORGANIZATION_REFERENCE_VALUE_IN_USE` | reference value is already used. | `referenceValueId` | unsafe delete/removal attempt | API contracts |
| `ORGANIZATION_REFERENCE_REPLACEMENT_INVALID` | replacement reference value is invalid. | `replacementReferenceValueId` | invalid type, lifecycle, or self-reference | API contracts |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Reference-value rules. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Root mutation route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant read/use posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
