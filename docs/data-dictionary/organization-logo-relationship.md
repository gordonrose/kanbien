# Organization Logo Relationship

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-logo-relationship` |
| Entity name | Organization Logo Relationship |
| Dictionary file | `docs/data-dictionary/organization-logo-relationship.md` |
| Owning feature | planned `organizationBrandingReferences` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_logo_relationship`, planned `OrganizationLogoRelationshipRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | PRD, public-logo asset decision, API contracts, and dictionary entry | implemented source, migrations, asset seams, and registry-backed dictionary truth | asset decision, PRD, API contracts, this page |
| Source precedence | Asset decision owns upload/read/delivery/security posture; PRD/API/data dictionary own Organization relationship posture until implementation exists. | Runtime source, migrations, asset policy, and registry rows must agree; asset storage does not become Organization authority. | future `organizationBrandingReferences` and `assets` implementations |
| Runtime persistence owner | planned `organizationBrandingReferences` for relationship; `assets` for asset invariants | `organizationBrandingReferences` plus `assets` | future feature folders |
| Runtime persistence record | planned `organization_logo_relationship` | logo relationship table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-logo-relationship` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Organization logo relationship persistence task | source, migrations, API contract, asset records, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Durable relationship between an Organization, a logo type, and a ready image asset. |
| Business purpose | Controls the current public logo for an Organization and logo type while keeping asset storage policy separate. |
| Durable fact boundary | Organization ownership, tenant/account boundary, logo type, current asset relationship, alt text, public readiness, replacement/delete posture, and cleanup behavior. |
| Primary users / actors | Root admins, tenant admins, public logo readers, asset processor, cleanup worker, export worker, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct logo relationship ownership, allowed types/MIME/size, public delivery, alt text, replacement, placeholder, cache signal, and cleanup rules. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_logo_relationship` |
| Primary key | `organization_logo_relationship_id` |
| Stable external key | `organization_id` plus `logo_type` current relationship |
| Versioning model | `mutable-current-record` with retained audit/history expected |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` or removal timestamp for relationship removal |
| Archive field | not-applicable; replacement/delete lifecycle owns relationship posture |
| Generated artifact posture | `not-applicable` for source relationship; public delivery is derived |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.logo.upload-intent` | `authoring` | create upload intent for logo type | root, tenant | UI/API/assets | creates scoped upload intent before relationship exists | upload audit; asset policy proof | public logo asset decision; API contracts | Intent is actor/scope/storage-key bound. |
| `organization.logo.replace` | `relationship-control` | attach ready asset as current logo | root, tenant | UI/API/assets | replaces current relationship after asset readiness | audit replacement; cache signal proof | public logo asset decision | Prior logo remains public until replacement accepted. |
| `organization.logo.delete` | `lifecycle` | remove current logo relationship | root, tenant | UI/API/assets | removes current relationship and falls back to initials placeholder | audit delete; cleanup evidence | public logo asset decision | Placeholder is app-generated, not uploaded asset. |
| `organization.logo.public-read` | `read-discovery` | read current public logo bytes or placeholder | public | app-controlled URL | no private Organization access granted | raw URL denial proof | public logo asset decision | Public read constrained to current accepted relationship. |
| `organization.logo.export-read` | `import-export` | include actual logo image in private export | root, tenant, system | job/export/assets | reads processed logo bytes for authorized export | export evidence | private export decision | Export includes actual image files where selected. |
| `organization.logo.cleanup-replaced` | `retention-cleanup` | delete eligible replaced prior logo bytes | system | job/assets | deletes old bytes after replacement live for 24 hours where allowed | cleanup retry/failure evidence | public logo asset decision | Legal/export posture may block source asset cleanup later. |

## Capability Family Rules

| Capability family | Meaning for Logo Relationship | Prefer over another family when |
| --- | --- | --- |
| `authoring` | Creates upload intents and relationship-ready inputs. | The operation starts or updates logo management. |
| `relationship-control` | Links a ready asset to an Organization/logo type. | The main effect is current logo relationship. |
| `lifecycle` | Removes current logo relationship. | The operation changes current public relationship availability. |
| `read-discovery` | Public/current logo read without private record access. | The operation serves current public bytes or placeholder. |
| `import-export` | Reads logo bytes into private export. | The boundary is export packaging. |
| `retention-cleanup` | Deletes eligible replaced bytes and records failures. | The main concern is cleanup and quota/cost. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_logo_relationship_id` | `organization_logo_relationship_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `asset_id` | `asset_id` | `relationship` | `UUID` | `single` | yes for current uploaded logo | no | relationship-action only | exact | asset relationship | public logo asset decision |
| `logo_type` | `logo_type` | `core` | `primary`, `icon`, `light-background`, or `dark-background` | `single` | yes | no | create-only per relationship key | exact, facet | logo type selector | asset decision/API contracts |
| `alt_text` | `alt_text` | `core` | `TEXT` | `single` | yes for public logo | no | updateable with relationship | full-text maybe | alt text field | public logo asset decision |
| `public_readiness_status` | planned readiness field | `lifecycle` | `pending`, `ready`, `rejected`, or `removed` | `single` | yes | yes | lifecycle-only | exact | readiness badge | asset decision |
| `published_at` | `published_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | public status metadata | asset decision |
| `replaced_at` | `replaced_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | replacement metadata | asset decision |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | removed metadata | asset decision |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Logo Relationship | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable relationship identity. | Hidden/read-only metadata. | System-generated. | The value identifies the relationship row. |
| `core` | Logo type and accessible display text. | Logo management panel. | Strong validation; alt text required. | The field controls product-facing logo display. |
| `relationship` | Links Organization to asset. | Logo upload/preview relationship panel. | Organization authz plus asset invariants required. | The field points to another durable record. |
| `lifecycle` | Readiness, publication, replacement, removal, cleanup posture. | Status badge and lifecycle controls. | Protected from normal update. | The field controls public availability. |
| `system` | Platform-managed timestamps. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current accepted logo relationship for a logo type. | public logo read and authorized admin reads | replace, delete, export | public logo asset decision |
| `superseded` | Prior relationship replaced by a newer accepted logo. | retained/audit reads only | cleanup eligible after 24 hours where allowed | public logo asset decision |
| `archived` | Not a named v1 logo relationship state. | not-applicable | not-applicable | this page |
| `deleted` | Current relationship removed; placeholder is used. | explicit/audit reads only | create new relationship | public logo asset decision |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `logo.organization` | `ownership` | Organization Logo Relationship | Organization | many-to-one | Must belong to same tenant/account as Organization. | Organization lifecycle constrains logo management. | Logo panel under Organization detail. | PRD/API contracts |
| `logo.asset` | `reference` | Organization Logo Relationship | Asset | many-to-one | Asset must be ready, same tenant/account, and satisfy asset policy. | Asset readiness controls public relationship. | upload/preview panel | asset decision |
| `logo.prior-replacement` | `replacement` | Organization Logo Relationship | Organization Logo Relationship | many-to-one optional | Prior logo remains public until replacement accepted. | Replaced bytes may be cleanup-eligible after 24 hours. | replacement history | asset decision |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_logo_relationship_pkey` | `primary key` | `organization_logo_relationship_id` | Stable row identity. | Supports reads and audit. | planned |
| `uq_current_logo_per_type` | `partial unique` | `organization_id`, `logo_type` | One current accepted logo relationship per Organization/logo type. | Prevents ambiguous public logo reads. | asset decision |
| `fk_logo_organization` | `foreign key` | `organization_id` | References Organization. | Keeps relationship scoped to Organization. | PRD |
| `fk_logo_asset` | `foreign key` | `asset_id` | References asset record. | Links asset without making asset authority. | asset decision |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `logo.type.allowed` | `logo_type` | Allowed types are primary, icon, light-background, dark-background. | `ORGANIZATION_LOGO_TYPE_INVALID`. | API contracts |
| `logo.alt-text.required` | `alt_text` | Public logo requires contextual alt text; default may be generated as organization name plus logo. | `ORGANIZATION_LOGO_ALT_TEXT_REQUIRED`. | asset decision |
| `logo.asset.ready` | `asset_id` | Replacement requires ready asset passing verification/scanning/processing. | `ORGANIZATION_LOGO_NOT_READY`. | asset decision |
| `logo.asset.same-tenant` | `asset_id`, `organization_id` | Asset and Organization must belong to same tenant/account. | `ORGANIZATION_LOGO_TENANT_MISMATCH`. | API contracts |
| `logo.no-raw-url` | delivery | Raw bucket/provider URLs must not be exposed as product URLs or authority. | public delivery denial. | asset decision |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id`, `organization_id` | exact, facet | scalar | boundary and child indexes | Required boundary for admin reads. | API contracts |
| `logo_type` | exact, facet | scalar | current-logo unique/index | Resolves current public logo type. | asset decision |
| `public_readiness_status` | exact, facet | scalar | readiness index | Separates pending/ready/rejected/removed. | asset decision |
| `deleted_at`, `published_at`, `replaced_at` | range, sort | scalar | lifecycle indexes as needed | Supports cleanup and audit. | asset decision |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant upload intent | upload intent fields | creates scoped short-lived intent | Raw filename is not storage authority. | asset decision |
| `replace` | root/tenant logo replace | `asset_id`, `alt_text`, readiness/current fields | marks new relationship current after readiness; signals cache/CDN invalidation | Prior logo remains public until accepted. | asset decision |
| `delete` | root/tenant logo delete | `deleted_at`, current flags | removes current relationship and uses initials placeholder | Placeholder is generated, not uploaded. | asset decision |
| `cleanup` | system cleanup job | prior asset cleanup state | deletes eligible replaced bytes; records failures/retries | Prior bytes eligible 24 hours after replacement live where allowed. | asset decision |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Current logo relationship retained; replaced prior bytes may be deleted 24 hours after new logo live and no longer needed. | relationship owner plus `assets` | replacement/delete | cleanup failures recorded and retried. | asset decision | public logo asset decision |
| Cleanup | Replaced prior logo bytes eligible for hard delete after 24 hours; failed cleanup remains recorded. | `assets` execution, Organization relationship decision owner | replacement live for 24 hours | retryable cleanup with failure evidence. | asset decision | public logo asset decision |
| Export | Export includes actual logo image files for authorized private exports where selected. | `organizationExports` and `assets` | export request | export failures recorded by export job. | private export decision | asset decisions |
| Delete / purge | Relationship delete falls back to generated initials placeholder; source asset cleanup follows asset policy. | Organization logo relationship and `assets` | admin delete or cleanup | failure evidence required. | asset decision | asset decisions |
| Legal hold | Legal-hold/export interaction for logo bytes remains as asset-decision posture; generated export copies follow export-copy policy. | future compliance owner plus asset owner | hold placement | cleanup must respect approved hold rules. | future runbook | asset decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root/tenant for management, public for current logo read, system for cleanup | API contracts; asset decision |
| Tenant context required | yes for management/export; no private tenant authority from public read | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin current tenant/account; public URL constrained to current accepted logo | API contracts |
| Governing capability | `organization.root.logo.manage`, `organization.tenant.logo.manage`, `organization.logo.public.read` planned | asset decision |
| Cross-tenant posture | deny-by-default for management and export | AGENTS tenant defaults |
| Object-level rule | Organization must authorize relationship before `assets` is called; asset ownership alone does not grant Organization access. | asset decision |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned logo upload/replace/delete APIs and public delivery URL | API contracts |
| UI required | planned Organization logo management panel | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | logo types with current/placeholder/readiness status | asset decision |
| Detail view treatment | preview, alt text, asset readiness, replacement history | asset decision |
| Create/edit treatment | upload intent, asset readiness, alt text confirmation | asset decision |
| Lifecycle action treatment | delete/removal confirmation with placeholder fallback | asset decision |
| Relationship navigation treatment | Organization detail to logo assets; asset detail should not grant Organization access by itself | asset decision |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | public branding relationship plus tenant metadata; uploaded image contents may be sensitive before publication | asset decision |
| Privacy / PII relevance | low for logos by default, but uploaded images may accidentally contain sensitive content | asset decision |
| Security relevance | high for asset upload/delivery because public content, malware scanning, and raw URL denial are required | asset decision |
| Audit relevance | yes for upload intent, readiness, replacement, delete, cleanup failure, and public-read posture | asset decision |
| Retention / cleanup posture | replaced bytes eligible after 24 hours; cleanup failures recorded/retried | asset decision |
| Export / deletion posture | private exports include actual image files; delete falls back to placeholder | asset decisions |
| Legal hold posture | future hold behavior must respect asset decision; export copies expire separately | asset decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future asset/upload/public-read/cache/cleanup tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; asset decision | Planned durable relationship record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/readiness fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | asset decision/API contracts | One current logo per Organization/logo type. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Delete removes current relationship and uses placeholder. |
| Tenant boundary / object-level authorization | yes | planned | future authz/asset tests | Organization authorizes relationship before asset seam. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | asset decisions | Cleanup/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future audit/asset tests | Upload/readiness/replacement/delete/cleanup need evidence. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_LOGO_INVALID` | organization logo request is invalid. | varies | invalid asset, MIME, size, checksum, or request body | API contracts |
| `ORGANIZATION_LOGO_NOT_READY` | logo asset is not ready. | `assetId` | asset not accepted for public relationship | API contracts |
| `ORGANIZATION_LOGO_TYPE_INVALID` | logo type is invalid. | `logoType` | unsupported logo type | API contracts |
| `ORGANIZATION_LOGO_ALT_TEXT_REQUIRED` | logo alt text is required. | `altText` | missing contextual alt text | API contracts |
| `ORGANIZATION_LOGO_TENANT_MISMATCH` | logo asset does not belong to the Organization tenant/account. | `assetId` | cross-tenant asset relationship | API contracts |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Public logo scope. |
| asset decision | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md` | Upload, readiness, public delivery, alt text, replacement, cache, and cleanup posture. |
| asset decision | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` | Export inclusion of actual logo image files. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Root logo route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant logo route posture and errors. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
