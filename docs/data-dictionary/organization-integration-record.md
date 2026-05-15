# Organization Integration Record

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-integration-record` |
| Entity name | Organization Integration Record |
| Dictionary file | `docs/data-dictionary/organization-integration-record.md` |
| Owning feature | planned `organizationIntegrations` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_integration_record`, planned `OrganizationIntegrationRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent dictionary entry | implemented source, migrations, and registry-backed dictionary truth | PRD, API contracts, this page |
| Source precedence | Approved PRD/API/data dictionary own planned behavior until implementation exists. | Runtime source and migrations win after implementation; registry rows and generated docs must reconcile. | future `organizationIntegrations` implementation |
| Runtime persistence owner | planned `organizationIntegrations` | `organizationIntegrations` | future `src/features/organizationIntegrations` |
| Runtime persistence record | planned `organization_integration_record` | integration table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-integration-record` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Organization integration persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | High-level official integration relationship for an Organization. |
| Business purpose | Records that an Organization has an integration relationship without storing provider configuration or secrets in v1. |
| Durable fact boundary | Owning Organization, tenant/account boundary, integration name/type/status, rejection of secrets/endpoints/config, lifecycle, and export behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, search/export jobs, security reviewers, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct the high-level integration table and the explicit no-secrets/no-provider-config boundary. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_integration_record` |
| Primary key | `organization_integration_record_id` |
| Stable external key | `organization_integration_record_id` |
| Versioning model | `mutable-current-record` |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from owning Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` |
| Archive field | `archived_at`; business state held in `lifecycle_status` |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.integration.create` | `authoring` | create high-level integration record | root, tenant | UI/API | creates child record under Organization | audit create; secret-field rejection proof | PRD; API contracts | Credentials/endpoints/webhook secrets/provider config are out of scope. |
| `organization.integration.read` | `read-discovery` | list/get integration records | root, tenant | UI/API/search/export | no mutation; scoped to Organization and tenant/account | access proof | API contracts | Reads high-level facts only. |
| `organization.integration.update` | `authoring` | update high-level integration facts | root, tenant | UI/API | refreshes `updated_at` | audit update; secret-field rejection proof | API contracts | Must reject secret-like fields. |
| `organization.integration.archive` | `lifecycle` | archive integration record | root, tenant | UI/API | removes current visibility | audit archive | PRD | Normal reads exclude archived rows. |
| `organization.integration.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected high-level facts | export evidence | private export decision | Export must not include rejected config/secrets. |

## Capability Family Rules

| Capability family | Meaning for Integration Record | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads high-level integration records. | The operation inspects integration truth. |
| `authoring` | Creates or updates high-level integration facts. | The operation changes non-secret integration facts. |
| `lifecycle` | Archives, restores, or deletes integration records. | The operation changes current visibility. |
| `import-export` | Includes integration records in private export bundles. | The boundary is data movement out of the feature. |
| `security-access` | Rejects or governs secret-like/config fields. | The operation touches credentials, endpoints, webhook secrets, payloads, or provider config. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_integration_record_id` | `organization_integration_record_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `integration_name` | planned integration name field | `core` | `TEXT` | `single` | yes | no | updateable | prefix, full-text | primary title field | inferred from integration purpose |
| `integration_type_reference_value_id` | planned reference value | `relationship` | `UUID or NULL` | `single` | no | no | updateable | exact, facet | reference-value picker | PRD Reference Values |
| `integration_note` | planned high-level note field | `secondary` | `TEXT or NULL` | `single` | no | no | updateable | full-text | notes field | inferred |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact | status badge | AGENTS defaults |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Integration Record | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable integration record identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the child record. |
| `core` | High-level official integration facts. | Primary form/detail area. | Validated and searchable. | The field describes the integration relationship. |
| `secondary` | Supporting non-secret notes. | Secondary detail area. | Must reject secrets/config. | The field gives context but is not core identity. |
| `relationship` | Links record to Organization, tenant/account, and reference values. | Scoped under Organization detail. | Foreign-key and authz required. | The field controls ownership/classification. |
| `lifecycle` | Controls current/archive/delete visibility. | Status badge/lifecycle controls. | Protected from normal update. | The field changes visibility. |
| `system` | Platform-managed values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current high-level integration record. | normal reads | update, archive, export | PRD Integration Record |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Retained record removed from current views. | explicit retained reads/export only | restore, delete where approved | AGENTS defaults |
| `deleted` | Soft-deleted record. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `integration.organization` | `ownership` | Integration Record | Organization | many-to-one | Must belong to same tenant/account as Organization. | Organization lifecycle constrains integration operations. | Integration area under Organization detail. | PRD/API contracts |
| `integration.type-reference` | `reference` | Integration Record | Organization Reference Value | many-to-one optional | Uses approved system-owned reference values. | Deprecated/replaced values must preserve historical meaning. | Reference-value picker. | PRD Reference Values |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_integration_record_pkey` | `primary key` | `organization_integration_record_id` | Stable row identity. | Supports reads and audit. | planned |
| `fk_integration_organization` | `foreign key` | `organization_id` | References owning Organization. | Keeps integration scoped to Organization. | PRD |
| `ix_integration_organization` | `index` | `organization_id`, `lifecycle_status`, `deleted_at` | Organization integration lookup. | Supports detail view and export. | inferred |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `integration.no-credentials` | request body | Credentials are out of scope and rejected or absent. | rejected secret-like integration field error. | PRD/API contracts |
| `integration.no-endpoints` | request body | Endpoints and provider configuration are out of scope and rejected or absent. | rejected secret-like integration field error. | PRD/API contracts |
| `integration.no-webhook-secrets` | request body | Webhook secrets and payload examples are out of scope and rejected or absent. | rejected secret-like integration field error. | PRD/API contracts |
| `integration.organization.same-tenant` | `tenant_id`, `organization_id` | Integration must belong to an Organization in the same tenant/account. | shared Organization boundary error. | API contracts |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id`, `organization_id` | exact, facet | scalar | boundary and child indexes | Required boundary for reads. | API contracts |
| `integration_name` | prefix, full-text | scalar | planned search index | Supports grouped Organization search. | PRD Search Requirements |
| `integration_type_reference_value_id` | exact, facet | scalar reference | planned reference index | Supports type filtering. | PRD Reference Values |
| `lifecycle_status`, `deleted_at` | exact, range, sort | scalar | visibility index | Normal reads exclude archived/deleted rows. | AGENTS defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via integration create | high-level facts only | stamps IDs, tenant, timestamps, active status | Must reject secret/config fields. | PRD |
| `update` | root/tenant via integration update | high-level facts only | refreshes `updated_at` | Must reject secret/config fields. | PRD |
| `archive` | root/tenant via integration archive | lifecycle fields | sets archived state and timestamp | Normal reads exclude archived row. | AGENTS defaults |
| `delete` | root/tenant via explicit delete | `deleted_at` | soft-deletes and refreshes `updated_at` | Hard purge not approved here. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Archived integration records remain retained. | `organizationIntegrations` | archive/export | lifecycle failures require audit evidence later. | future tests | PRD |
| Cleanup | No source cleanup job approved in planning slice. | `organizationIntegrations` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized, excluding forbidden secret/config data. | `organizationExports` reads via integration seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this planning page. | `organizationIntegrations` | explicit delete | failure evidence required later. | future tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | planned Organization integration capabilities | API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Integration record, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned child resource APIs | API contracts |
| UI required | planned Organization detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | integration list scoped under Organization | PRD |
| Detail view treatment | high-level integration detail only | PRD |
| Create/edit treatment | governed form that rejects secret/config fields | PRD/API contracts |
| Lifecycle action treatment | archive/delete confirmations | AGENTS defaults |
| Relationship navigation treatment | reachable from Organization detail | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant integration metadata | PRD |
| Privacy / PII relevance | low by itself unless notes contain personal data; notes should be constrained later | data dictionary planning |
| Security relevance | high boundary because secrets/config are explicitly out of scope and must be rejected | PRD |
| Audit relevance | yes for create/update/archive/delete/export and rejected secret-like submissions | PRD/test planning |
| Retention / cleanup posture | retained when archived; no purge approved | PRD |
| Export / deletion posture | private export inclusion for approved high-level facts only | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future secret-rejection/authz/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | PRD/API contracts | Exact integration type catalog still needs implementation. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Normal reads exclude archived/deleted rows. |
| Tenant boundary / object-level authorization | yes | planned | future authz tests | Same tenant/account and Organization. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future audit/security tests | Secret-like submissions should be auditable safely. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_INTEGRATION_SECRET_FIELD_REJECTED` | integration field is not allowed in v1. | varies | credentials, endpoints, webhook secrets, payload examples, or provider configuration submitted | API contracts |
| `ORGANIZATION_INTEGRATION_NOT_FOUND` | integration record cannot be found. | `organizationIntegrationRecordId` | missing, wrong tenant/account, or not visible | inferred |
| `ORGANIZATION_INTEGRATION_INVALID_REQUEST` | integration request is invalid. | varies | invalid field or lifecycle conflict | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | High-level integration scope and no-secret boundary. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and rejected secret-like fields. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
