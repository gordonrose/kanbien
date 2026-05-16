# Organization Legal Profile

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-legal-profile` |
| Entity name | Organization Legal Profile |
| Dictionary file | `docs/data-dictionary/organization-legal-profile.md` |
| Owning feature | `organizationLegalDetails` |
| Ownership status | `implemented-foundation` |
| Current entity status | `active-v1` |
| Primary authority | `runtime-source` |
| Primary source table or record | `organization_legal_profile`, `OrganizationLegalProfileRecord` |
| Entity definition lineage | `source-backed-markdown` |
| Latest source review date | `2026-05-15` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | implemented source, migration, tests, and this source-backed dictionary entry | registry-backed dictionary truth when entity registry persistence is adopted | `src/features/organizationLegalDetails`; this page |
| Source precedence | Runtime source and migration own implemented behavior; this page mirrors that truth. | Registry rows and generated docs reconcile from runtime and registry truth. | `organizationLegalDetails` implementation |
| Runtime persistence owner | `organizationLegalDetails` | `organizationLegalDetails` | `src/features/organizationLegalDetails` |
| Runtime persistence record | `organization_legal_profile` table and `OrganizationLegalProfileRecord` | `organization_legal_profile` table and record type | migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-legal-profile` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | S-005 legal profile persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | S-005 task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Official legal-details record for an Organization, including optional tax/VAT and registered-address facts. |
| Business purpose | Captures durable legal identity details separately from the Organization display record. |
| Durable fact boundary | Owning Organization, tenant/account boundary, legal name, optional tax/VAT number, registered address, approved legal identifiers, active/archive/delete posture, and retained-history behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct the legal profile table, one-active-profile rule, retention posture, and Organization boundary rules. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | `organization_legal_profile` |
| Primary key | `organization_legal_profile_id` |
| Stable external key | `organization_legal_profile_id` |
| Versioning model | `mutable-current-record` with retained archived rows |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from owning Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` |
| Archive field | `archived_at`; business state held in `lifecycle_status` |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | `implemented` via `src/features/organizationLegalDetails/persistence/migrations/0052_create_organization_legal_details.sql` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.legal-profile.manage` | `authoring` | create, update, archive, restore, or delete legal profile | root | API | manages active child record under Organization | audit create/update/archive/restore/delete; one-active validation proof | source; PRD; API contracts | Root runtime capability seeded in S-005. |
| `organization.legal-profile.read` | `read-discovery` | list/get legal profiles | root, tenant | UI/API/search/export | no mutation; scoped to Organization and tenant/account | access and retained-record proof | API contracts | Retained archived profiles require explicit visibility. |
| `organization.legal-profile.manage` | `lifecycle` | archive, restore, or soft delete legal profile | root | API | removes or restores current active visibility | audit archive/restore/delete | PRD; source | Previous or archived profiles remain retained. |
| `organization.legal-profile.export` | `import-export` | include in private Organization export | root, tenant, system | job/export | exports selected active and retained source data | export evidence | private export decision | Legal profile data may be sensitive private data. |

## Capability Family Rules

| Capability family | Meaning for Organization Legal Profile | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads current or retained legal profile records. | The operation inspects profile truth without changing it. |
| `authoring` | Creates or updates legal details. | The operation changes legal facts. |
| `lifecycle` | Archives, restores, or deletes legal profile rows. | The operation changes current visibility or retained status. |
| `import-export` | Includes legal profiles in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_legal_profile_id` | `organization_legal_profile_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | source |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship panel | PRD/API contracts |
| `legal_name` | `legal_name` | `core` | `TEXT` | `single` | yes | no | updateable | prefix, full-text | primary legal-name field | PRD Legal Profile |
| `registration_identifier` | `registration_identifier` | `core` | `TEXT or NULL` | `single` | no | no | updateable | exact, prefix | legal identifier field | source |
| `tax_vat_number` | `tax_vat_number` | `core` | `TEXT or NULL` | `single` | no | no | updateable | exact, prefix | tax/VAT field | user refinement 2026-05-14; source |
| `registered_address` | `registered_address` | `core` | `TEXT or NULL` | `single` | no | no | updateable | prefix, full-text | registered-address block | user refinement 2026-05-14; source |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact | status badge | PRD Legal Profile |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Organization Legal Profile | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable legal-profile identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the child record. |
| `core` | Official legal details. | Primary legal profile form/detail area. | Strong validation and export inclusion. | The field states a legal fact. |
| `relationship` | Links profile to Organization and tenant/account. | Scoped under Organization detail. | Foreign-key and object authorization required. | The field controls ownership or boundary. |
| `lifecycle` | Controls active, archived, deleted, retained behavior. | Status badge and lifecycle controls. | Protected from normal update. | The field changes current visibility. |
| `system` | Platform-managed timestamps and derived values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `active` | Current legal profile for the Organization. | normal reads | update, archive, export | PRD Legal Profile |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Retained previous legal profile. | explicit retained reads/export only | restore, delete where approved | PRD Legal Profile |
| `deleted` | Soft-deleted legal profile. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization-legal-profile.organization` | `ownership` | Organization Legal Profile | Organization | many-to-one | Must belong to same tenant/account as Organization. | Organization archive/delete constrains visibility and export. | Legal profile area under Organization detail. | PRD/API contracts |
| `organization-legal-profile.tenant` | `ownership` | Organization Legal Profile | Tenant | many-to-one | Derived from Organization tenant/account; cross-tenant access denied. | Tenant lifecycle constrains profile operations. | hidden authority context | AGENTS tenant defaults |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_legal_profile_pkey` | `primary key` | `organization_legal_profile_id` | Stable row identity. | Supports child record reads and audit. | source |
| `fk_organization_legal_profile_organization` | `foreign key` | `organization_id` | References owning Organization. | Keeps legal profile scoped to Organization. | PRD |
| `uq_organization_legal_profile_active` | `partial unique` | `organization_id` | One active non-deleted legal profile per Organization. | Enforces v1 one-active rule. | PRD Legal Profile |
| `ix_organization_legal_profile_tenant_visibility` | `index` | `tenant_id`, `lifecycle_status`, `deleted_at` | Tenant/account scoped visibility index. | Supports secure list/search/export. | source |
| `ix_organization_legal_profile_organization_visibility` | `index` | `organization_id`, `lifecycle_status`, `deleted_at` | Organization child visibility index. | Supports child list and lifecycle reads. | source |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `legal-profile.organization.same-tenant` | `tenant_id`, `organization_id` | Profile must belong to an Organization in the same tenant/account. | shared Organization boundary error. | PRD/API contracts |
| `legal-profile.one-active` | `organization_id`, `lifecycle_status`, `deleted_at` | Only one active legal profile per Organization in v1. | duplicate active legal profile error. | API contracts |
| `legal-profile.tax-vat-optional` | `tax_vat_number` | Tax/VAT number is optional; when supplied, trim and reject empty string. | invalid tax/VAT field error. | user refinement 2026-05-14 |
| `legal-profile.registered-address-optional` | `registered_address` | Registered address is optional and describes the official registered address, not an operational location. | invalid registered address error. | user refinement 2026-05-14 |
| `legal-profile.system-fields` | identifiers, timestamps, lifecycle fields | Clients cannot override system-managed fields. | invalid request error. | AGENTS defaults |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant visibility index | Required boundary for all reads. | API contracts |
| `organization_id` | exact, facet | scalar | Organization child index | Scopes profile under Organization. | API contracts |
| `legal_name`, `registered_address` | prefix, full-text | scalar or structured address fields | planned text/search index | Supports grouped Organization search. | PRD Search Requirements; user refinement 2026-05-14 |
| `registration_identifier`, `tax_vat_number` | exact, prefix | scalar | planned identifier index if approved by implementation | Supports exact legal identifier lookup where authorized. | user refinement 2026-05-14 |
| `lifecycle_status`, `deleted_at` | exact, range, sort | scalar | visibility index | Normal reads exclude archived/deleted rows. | AGENTS defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via legal-profile create | legal details | stamps IDs, tenant, timestamps, active status | Must enforce one active profile. | PRD |
| `update` | root/tenant via legal-profile update | approved legal fields | refreshes `updated_at` | Cannot override ownership/lifecycle fields. | AGENTS defaults |
| `archive` | root/tenant via legal-profile archive | lifecycle fields | sets archived state and timestamp | Normal reads exclude archived row. | PRD |
| `restore` | root/tenant via legal-profile restore | lifecycle fields | clears archive fields | Must re-check one-active rule. | PRD |
| `delete` | root/tenant via explicit delete | `deleted_at` | soft-deletes and refreshes `updated_at` | Hard purge not approved here. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Archived legal profiles remain retained. | `organizationLegalDetails` | archive/update/export | lifecycle failures require audit evidence later. | future tests | PRD |
| Cleanup | No source cleanup job approved in planning slice. | `organizationLegalDetails` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized. | `organizationExports` reads via legal-details seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this planning page. | `organizationLegalDetails` | explicit delete | failure evidence required later. | future tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | root: `organization.legal-profile.manage` or `organization.legal-profile.read`; tenant: active tenant-admin session in current tenant context until tenant-admin grant model is introduced | source; API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Legal profile, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | implemented child resource APIs for create, read, list, update, archive, restore, and soft delete | source; API contracts |
| UI required | planned Organization detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | scoped under Organization with active/retained filtering | PRD/API contracts |
| Detail view treatment | legal detail section plus lifecycle metadata | PRD |
| Create/edit treatment | governed form with one-active validation | PRD |
| Lifecycle action treatment | archive/restore/delete confirmations | AGENTS defaults |
| Relationship navigation treatment | reachable from Organization detail | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant organization legal metadata | PRD |
| Privacy / PII relevance | possible PII-adjacent when legal contacts or identifiers are later added | data dictionary planning |
| Security relevance | moderate because legal identity affects tenant records and exports | AGENTS tenant defaults |
| Audit relevance | yes for create/update/archive/restore/delete/export | PRD/test planning |
| Retention / cleanup posture | retained when archived; no purge approved | PRD |
| Export / deletion posture | private export inclusion; soft-delete source posture | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future persistence/authz/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | implemented-foundation | `tests/unit/organizationLegalDetails/service.test.ts`; migration | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | implemented-foundation | `tests/unit/organizationLegalDetails/service.test.ts`; migration | One-active active-profile rule enforced in service and storage. |
| Soft-delete and normal-read visibility | yes | implemented-foundation | `tests/unit/organizationLegalDetails/service.test.ts` | Normal reads exclude archived/deleted rows. |
| Tenant boundary / object-level authorization | yes | implemented-foundation | `tests/unit/organizationLegalDetails/service.test.ts` | Same tenant/account as Organization through `organizationCore` seam. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-partial | this page; export decision | Source retention implemented for archived rows; export job remains later story. |
| Auditability and operational evidence | yes | implemented-foundation | migration; service tests | Feature-local audit table exists; broader audit proof can deepen later. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_LEGAL_PROFILE_DUPLICATE_ACTIVE` | organization already has an active legal profile. | `organizationId` | one-active rule violation | API contracts |
| `ORGANIZATION_LEGAL_PROFILE_NOT_FOUND` | legal profile cannot be found for the authorized context. | `organizationLegalProfileId` | missing, wrong tenant/account, or not visible | inferred |
| `ORGANIZATION_LEGAL_PROFILE_INVALID_REQUEST` | legal profile request is invalid. | varies | invalid field or lifecycle conflict | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Legal profile scope and one-active rule. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
| feature source | `src/features/organizationLegalDetails` | Implemented legal-profile domain, persistence, transport, and manifest. |
| migration | `src/features/organizationLegalDetails/persistence/migrations/0052_create_organization_legal_details.sql` | Table, indexes, audit table, and root capability seed. |
| tests | `tests/unit/organizationLegalDetails/service.test.ts` | One-active rule, optional fields, lifecycle visibility, export projection, and tenant-boundary proof. |
