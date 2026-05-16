# Organization Export

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-export` |
| Entity name | Organization Export |
| Dictionary file | `docs/data-dictionary/organization-export.md` |
| Owning feature | `organizationExports` |
| Ownership status | `implemented-backend-foundation` |
| Current entity status | `active` |
| Primary authority | `planning-artifact` |
| Primary source table or record | `organization_export`, `OrganizationExportRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-16` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`; `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | PRD, private export asset decision, API contracts, and dictionary entry | implemented source, migrations, job/asset seams, and registry-backed dictionary truth | private export decision, PRD, API contracts, this page |
| Source precedence | Private export asset decision owns generated ZIP/storage/security/cleanup posture; PRD/API/data dictionary own Organization export relationship posture until implementation exists. | Runtime source, migrations, job processing, asset/export storage policy, and registry rows must agree. | future `organizationExports`, job processing, and generated asset storage implementation |
| Runtime persistence owner | planned `organizationExports` | `organizationExports` | future `src/features/organizationExports` |
| Runtime persistence record | planned `organization_export` | export request/status table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-export` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Organization export persistence task | source, migrations, API contract, job rows, asset/export records, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Durable request/status record for a private generated Organization export ZIP. |
| Business purpose | Lets authorized admins request, inspect, download, delete, and expire private export bundles. |
| Durable fact boundary | Requesting actor, tenant/account authority, source Organization scope, selected sections, visibility scope, job status, cancellation/retry, expiry, PIN/password posture, size/checksum, failure category, cleanup state, and source-data/export-copy separation. |
| Primary users / actors | Root admins, tenant admins, background export worker, cleanup worker, support/audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct export records, requester-only access, PIN/password behavior, section/branch scope, retained/deleted rules, background job posture, private download behavior, expiry/delete cleanup, and evidence requirements. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_export` |
| Primary key | `organization_export_id` |
| Stable external key | `organization_export_id` |
| Versioning model | `append-only-event` for attempts plus mutable current status on export request |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` |
| Soft-delete field | `deleted_at` or `deleted_at` style unavailable marker for generated copy |
| Archive field | not-applicable; status/expiry/delete owns export lifecycle |
| Generated artifact posture | source record plus generated private ZIP output |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.export.create` | `import-export` | create export request | root, tenant | UI/API/job | creates background export request | audit create; technical safety proof where approved | private export decision; API contracts | Background job only. |
| `organization.export.read` | `read-discovery` | list/get export status | root, tenant | UI/API | no source mutation; reads status metadata | access proof | API contracts | Scoped to authorized tenant/account and actor rules. |
| `organization.export.view-pin` | `read-discovery` | view export PIN/password | root, tenant | UI/API/export | reveals sensitive unlock secret to requester | PIN-view audit; no ordinary logging | reusable export pattern | Requester only while export is available. |
| `organization.export.download` | `import-export` | download ready private ZIP | root, tenant | UI/API/export | records download attempt | download audit; requester proof | private export decision | Private password-protected attachment, no raw storage URL. |
| `organization.export.retry` | `automation` | retry failed export | root, tenant | UI/API/job | creates retry attempt using previous or changed options | retry audit; option-change evidence | reusable export pattern | Failed exports remain visible with retry. |
| `organization.export.cancel` | `lifecycle` | cancel pending or running export | root, tenant | UI/API/job | requests cancellation and prevents downloadable output | cancellation audit | reusable export pattern | Exact worker interruption semantics deferred to steering. |
| `organization.export.delete` | `retention-cleanup` | delete export copy | root, tenant | UI/API/job | marks unavailable and triggers cleanup | audit delete; cleanup proof | API contracts; private export decision | Generated copy deletion does not affect source data. |
| `organization.export.expire` | `retention-cleanup` | expire ready export | system | job/export storage | removes download availability after 24 hours | cleanup retry/failure evidence | private export decision | Export cleanup retry window is 7 days. |
| `organization.export.generate` | `automation` | build export ZIP | system | background job | reads selected source records and writes generated copy | job attempt/failure evidence | private export decision | 10-minute soft timeout and 30-minute hard timeout in v1. |
| `organization.export.notify-ready` | `notification` | send ready notification | system | email/UI | tells requester export is ready and may include PIN | notification evidence | reusable export pattern | PIN must not be logged. |
| `organization.export.notify-failed` | `notification` | send failed notification | system | email/UI | tells requester safe failure reason and retry prompt | notification evidence | reusable export pattern | Detailed diagnostics stay internal. |

## Capability Family Rules

| Capability family | Meaning for Organization Export | Prefer over another family when |
| --- | --- | --- |
| `import-export` | Creates or downloads private export bundles. | The boundary is data movement out of the feature. |
| `read-discovery` | Reads export status/metadata. | The operation inspects export state. |
| `retention-cleanup` | Deletes/expires generated export copies and records failures. | The main concern is cleanup, expiry, and quota/cost. |
| `automation` | Background job builds ZIP and records attempts. | Machine execution and retry posture are central. |
| `notification` | Sends ready/failed email and drives async/status attention. | The outcome is user feedback rather than source data movement. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_export_id` | `organization_export_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | API contracts |
| `actor_id` | `actor_id` | `privacy` | `UUID` | `single` | yes | yes | immutable | exact, facet | requester metadata | private export decision |
| `actor_authority_world` | `actor_authority_world` | `security` | `root` or `tenant` | `single` | yes | yes | immutable | exact, facet | authority badge | private export decision |
| `source_organization_id` | `source_organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | source Organization link | reusable export pattern |
| `selected_sections` | `selected_sections` | `core` | `structured section list` | `multiple` | yes | no | create-only | facet | section checklist | API contracts |
| `visibility_scope` | `visibility_scope` | `core` | `current_only` or `include_retained` | `single` | yes | no | create-only | exact, facet | retained-record toggle | reusable export pattern |
| `organization_scope` | `organization_scope` | `core` | `selected_organization_only` or `include_child_branch` | `single` | yes | no | create-only | exact, facet | branch toggle | reusable export pattern |
| `snapshot_timing` | `snapshot_timing` | `core` | `generation_time` | `single` | yes | yes | immutable | exact | manifest metadata | reusable export pattern |
| `status` | `status` | `lifecycle` | `queued`, `running`, `cancel_requested`, `cancelled`, `ready`, `failed`, `retrying`, `expired`, or `deleted` | `single` | yes | yes | lifecycle-only | exact, facet | async status badge | reusable export pattern |
| `expires_at` | `expires_at` | `lifecycle` | `TIMESTAMPTZ` | `single` | yes when ready | yes | lifecycle-only | range, sort | expiry metadata | private export decision |
| `pin_secret_reference` | `pin_secret_reference` | `security` | `TEXT or secret reference` | `single` | yes when ready | yes | system-only | none | hidden secret reference | reusable export pattern |
| `pin_viewed_at` | `pin_viewed_at` | `security` | `TIMESTAMPTZ or NULL` | `single` | no | yes | system-only | range, sort | sensitive evidence | reusable export pattern |
| `download_attempt_count` | `download_attempt_count` | `security` | `INTEGER` | `single` | yes | yes | system-only | range, sort | download evidence counter | private export decision |
| `notification_status` | `notification_status` | `evidence` | `pending`, `sent`, `failed`, or `not-applicable` | `single` | no | yes | system-only | exact, facet | notification badge | reusable export pattern |
| `size_bytes` | `size_bytes` | `evidence` | `INTEGER or NULL` | `single` | no | yes | system-only | range, sort | file metadata | private export decision |
| `checksum` | `checksum` | `evidence` | `TEXT or NULL` | `single` | no | yes | system-only | exact | file integrity metadata | private export decision |
| `failure_category` | `failure_category` | `evidence` | `TEXT or NULL` | `single` | no | yes | system-only | exact, facet | failure badge | private export decision |
| `storage_reference` | planned storage reference | `security` | `TEXT` | `single` | no until ready | yes | system-only | none | hidden storage reference | private export decision |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | private export decision |

## Attribute Category Rules

| Category | Meaning for Organization Export | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable export identity. | Hidden/read-only metadata. | System-generated. | The value identifies the export request. |
| `core` | User-selected export content. | Section checklist/summary. | Create-only and validated. | The field defines export scope. |
| `relationship` | Links export to tenant/account and source records. | Export detail metadata. | Tenant/object authorization required. | The field controls ownership. |
| `lifecycle` | Status, expiry, delete, readiness. | Status badge and lifecycle actions. | System/job managed. | The field changes availability. |
| `security` | Actor authority, PIN/secret reference, download evidence, storage reference. | Restricted/read-only. | Never raw storage URL; enforce requester-only access and no ordinary PIN logging. | The value affects access or abuse controls. |
| `privacy` | Actor/request metadata. | Minimized and access-controlled. | Audit/export policy applies. | The value identifies a person/admin. |
| `evidence` | Size, checksum, failure category. | Evidence/status area. | System-managed and auditable. | The field proves output integrity/outcome. |
| `system` | Platform-managed timestamps. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Export request is queued, running, retrying, or ready before expiry/delete. | requester export reads | status read, cancel if queued/running, download if ready, view PIN if ready, delete | reusable export pattern |
| `superseded` | Not applicable; new request creates separate export. | not-applicable | not-applicable | private export decision |
| `archived` | Not a v1 export status; durable metadata retention remains policy-controlled. | not-applicable | not-applicable | this page |
| `deleted` | Generated export copy is deleted/unavailable; metadata/audit retained. | explicit export metadata reads only | none except audit/support | private export decision |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `export.tenant` | `ownership` | Organization Export | Tenant | many-to-one | Export limited to authorized tenant/account. | Tenant/account authority controls reads/download/delete. | export list scoped by tenant/account | private export decision |
| `export.actor` | `reference` | Organization Export | root or tenant actor | many-to-one | Requester identity and audit attribution required. | Requester-only access applies. | requester metadata | reusable export pattern |
| `export.source-organization` | `ownership` | Organization Export | Organization | many-to-one | Actor must be authorized for source Organization and every included branch Organization. | Organization lifecycle and permissions control section reads. | source Organization metadata | reusable export pattern |
| `export.job` | `dependency` | Organization Export | job processing job/attempts | one-to-many | Background job builds export. | job failures update export status/failure category. | job status/evidence panel | private export decision |
| `export.generated-asset` | `reference` | Organization Export | generated ZIP storage object | one-to-one when ready | Private generated copy, no raw URL authority. | expiry/delete cleanup controls availability. | download button/status | private export decision |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_export_pkey` | `primary key` | `organization_export_id` | Stable row identity. | Supports reads and audit. | planned |
| `ix_organization_export_tenant_status` | `index` | `tenant_id`, `status`, `expires_at` | Export list/status index. | Supports status views and cleanup. | private export decision |
| `ix_organization_export_actor_status` | `index` | `actor_id`, `status` | Requester export lookup. | Supports requester-only list/status/read and cleanup. | reusable export pattern |
| `ix_organization_export_source` | `index` | `source_organization_id`, `status` | Source Organization export lookup. | Supports authorization and operational review. | reusable export pattern |
| `organization_export_no_product_size_cap` | `technical-steering-required` | generated ZIP size and included Organization count | No product-facing max Organization count or max ZIP size is approved in v1; technical guardrails may still be required. | Avoids silently reintroducing a rejected business cap. | reusable export pattern |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `export.sections.valid` | `selected_sections` | Create body selects approved export sections only. | `ORGANIZATION_EXPORT_INVALID_REQUEST`. | API contracts |
| `export.visibility-scope.valid` | `visibility_scope` | Actor chooses `current_only` or `include_retained`; deleted records are always excluded. | `ORGANIZATION_EXPORT_INVALID_REQUEST`. | reusable export pattern |
| `export.organization-scope.valid` | `organization_scope` | Actor chooses selected Organization only or child branch; branch requires permission for every included Organization. | `ORGANIZATION_EXPORT_FORBIDDEN`. | reusable export pattern |
| `export.integration-excluded` | `selected_sections` | Integration records are excluded from v1 Organization exports. | `ORGANIZATION_EXPORT_INVALID_REQUEST`. | product decision |
| `export.background-only` | request | Exports are background jobs only; no synchronous generation. | invalid request or route denial. | API contracts |
| `export.ready-required` | `status` | Download only when ready and unexpired. | `ORGANIZATION_EXPORT_NOT_READY` or `ORGANIZATION_EXPORT_EXPIRED`. | API contracts |
| `export.requester-only` | `actor_id` | Status, PIN, download, retry, cancel, and delete are personal to requesting actor. | `ORGANIZATION_EXPORT_FORBIDDEN`. | reusable export pattern |
| `export.logged-in-download` | session | Admin must be logged in to download; link plus PIN alone is not authority. | unauthorized/forbidden. | reusable export pattern |
| `export.pin-sensitive` | `pin_secret_reference` | PIN may be viewed again and emailed, but must not be logged in ordinary logs. | security violation. | reusable export pattern |
| `export.no-raw-url` | download | Download must not expose raw bucket/provider URL. | forbidden/raw URL denial. | private export decision |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant/status index | Required boundary for reads. | API contracts |
| `actor_id` | exact, facet | scalar | requester/status index | Supports requester-only reads, download, PIN view, retry, cancel, and audit. | reusable export pattern |
| `status` | exact, facet | scalar | tenant/status index | Drives download availability. | API contracts |
| `source_organization_id`, `visibility_scope`, `organization_scope` | exact, facet | scalar | source/scope indexes | Supports requester list, branch export, and support review. | reusable export pattern |
| `expires_at`, `created_at`, `updated_at`, `deleted_at` | range, sort | scalar | lifecycle/status indexes | Supports cleanup, list, and audit. | private export decision |
| `failure_category` | exact, facet | scalar | planned failure index | Supports operational review. | private export decision |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via export create | selected sections, source Organization, visibility scope, branch scope | stamps ID, actor, tenant, queued status, timestamps; enqueues job | Background-only; records exact selected sections/options. | API contracts |
| `generate` | system background job | status, size, checksum, storage reference, PIN secret reference, failure category | marks running/ready/failed; records attempts; sends ready/failed notification | Reads generation-time data; must verify source data and generated bytes. | private export decision; reusable export pattern |
| `view-pin` | requesting actor via PIN read | `pin_viewed_at` | records sensitive PIN view | Only requester while export available. | reusable export pattern |
| `download` | requesting actor via export download | download attempt count | records download attempt | Must be ready, unexpired, requester-bound, and authenticated. | API contracts |
| `retry` | requesting actor via retry | status and retry attempt fields | re-enqueues with previous or changed options | Failed export remains visible until retry/delete/cleanup. | reusable export pattern |
| `cancel` | requesting actor via cancel | status/cancel fields | records cancellation request and prevents downloadable output | Worker may stop or ignore output if too far progressed. | reusable export pattern |
| `delete` | root/tenant via export delete | status/delete fields | marks unavailable and triggers cleanup | Does not affect persistent source data. | private export decision |
| `expire` | system cleanup | status/delete/expiry cleanup fields | removes generated copy and records failures | Retry cleanup for 7 days. | private export decision |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Generated ZIP expires 24 hours after ready or earlier on delete; durable metadata/audit retained by future policy. | `organizationExports` | ready timestamp or delete | cleanup failures recorded and retried. | private export decision | private export decision |
| Cleanup | Generated export bytes are hard-delete eligible after expiry or manual delete. | export cleanup worker / storage lifecycle | expiry/delete | retry cleanup for 7 days and record failures. | private export decision | private export decision |
| Export | ZIP contains selected JSON structured sections and actual uploaded logo image files where selected; manifest required; reference values included inline and in `reference-values.json`; no generated placeholder image files. | `organizationExports` | export job | failures record safe failure category. | private export decision | reusable export pattern |
| Delete / purge | Delete marks export unavailable and triggers generated-copy cleanup; source records unchanged. | `organizationExports` | explicit delete or expiry | failure evidence required. | private export decision | private export decision |
| Legal hold | Legal hold and incident hold affect persistent source data, not generated export-copy retention in v1. | future compliance owner plus source features | hold placement | export copies still expire/delete by policy. | product decision | private export decision |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant for request/read/download/delete; system for job/cleanup | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin current tenant/account; job payload carries safe scoped request data | API contracts; private export decision |
| Governing capability | planning keys `organization.root.export.manage` and `organization.tenant.export.manage` | private export decision |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Export request denied unless actor is authorized for source Organization and every included branch Organization; status/PIN/download/retry/cancel/delete denied unless actor is the requester and remains authorized. | reusable export pattern |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned export request/status/PIN/download/retry/cancel/delete APIs | API contracts |
| UI required | planned Organization export area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | requester-personal export status list with async/status component and attention badge | reusable export pattern |
| Detail view treatment | selected sections/options, status, size/checksum, failure category, notification status, PIN availability, download availability | API contracts |
| Create/edit treatment | section selector with select-all, current/retained toggle, Organization/branch scope toggle | reusable export pattern |
| Lifecycle action treatment | retry/change options, cancel queued/running, delete/unavailable confirmation, expiry indicators | reusable export pattern |
| Relationship navigation treatment | export details link to source sections and job evidence where approved | private export decision |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | sensitive private export metadata and generated ZIP bundle | private export decision |
| Privacy / PII relevance | yes, exports may contain membership/user-linked and tenant data | private export decision |
| Security relevance | high because private downloads, PIN/password handling, requester-only access, raw URL denial, checksums, and cleanup are required | reusable export pattern |
| Audit relevance | yes for create, job start/complete/fail, PIN view, download, retry, cancel, delete, cleanup failure, notification failure, and denials | reusable export pattern |
| Retention / cleanup posture | generated copies expire/delete after 24 hours or delete; cleanup retry 7 days | private export decision |
| Export / deletion posture | export record creates generated copy only; persistent source data unchanged by export delete | private export decision |
| Legal hold posture | source holds do not extend generated export-copy retention in v1 | private export decision |
| Operational evidence requirements | `npm run data:compliance-health`; future job/download/PIN/notification/cancel/checksum/cleanup tests and runbook | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; private export decision | Planned durable export request/status record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/status/attempt counters system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | private export decision/API contracts | Limits/status indexes need implementation proof. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Delete/expiry makes generated copy unavailable. |
| Tenant boundary / object-level authorization | yes | planned | future authz/export tests | Export is tenant/account scoped. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | private export decision | Cleanup/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future job/audit tests | Export lifecycle requires detailed evidence. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_EXPORT_INVALID_REQUEST` | export request is invalid. | varies | invalid sections or request shape | API contracts |
| `ORGANIZATION_EXPORT_NOT_FOUND` | export cannot be found. | `exportId` | missing, wrong tenant/account, or unavailable | API contracts |
| `ORGANIZATION_EXPORT_LIMIT_EXCEEDED` | export limit exceeded. | request | technical safety or operational limit exceeded where approved by steering | API contracts |
| `ORGANIZATION_EXPORT_NOT_READY` | export is not ready. | `exportId` | attempted download before ready | API contracts |
| `ORGANIZATION_EXPORT_CANCELLED` | export was cancelled. | `exportId` | attempted download of cancelled export or cancelled job state | reusable export pattern |
| `ORGANIZATION_EXPORT_PIN_FORBIDDEN` | export PIN cannot be viewed. | `exportId` | actor is not requester or export is unavailable | reusable export pattern |
| `ORGANIZATION_EXPORT_EXPIRED` | export expired. | `exportId` | ready export past expiry | API contracts |
| `ORGANIZATION_EXPORT_FORBIDDEN` | export access is forbidden. | `exportId` | actor not authorized for export or tenant/account | API contracts |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Private export scope. |
| asset decision | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` | Export generation, retention, cleanup, security, and legal-hold posture. |
| discovery packet | `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md` | Reusable export/email behavior, PIN, requester-only access, cancellation, retry, JSON plus files, and notification posture. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Root export route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant export route posture and errors. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
