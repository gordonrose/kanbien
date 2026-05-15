# Organization

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization` |
| Entity name | Organization |
| Dictionary file | `docs/data-dictionary/organization.md` |
| Owning feature | planned `organizationCore` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization`, planned `OrganizationRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent data dictionary entry | implemented source, migrations, and generated/registry-backed dictionary truth after the feature is built | PRD, API contracts, this page |
| Source precedence | Until implementation exists, approved PRD/API/asset decisions and this data dictionary entry own planned Organization truth; if these disagree, update the planning artifact chain before implementation. | Once implemented, source code, migrations, API contracts, and persisted registry rows must agree; applied migrations and runtime source win over stale prose, with docs regenerated or corrected. | AGENTS source/code and migration safety rules; future `organizationCore` implementation |
| Runtime persistence owner | planned `organizationCore` | `organizationCore` | future `src/features/organizationCore` |
| Runtime persistence record | planned `organization`, planned `OrganizationRecord` | `organization` table and Organization repository/domain record type | future zero-padded migration and persistence files |
| Entity-registry persistence owner | `not-yet-registered`; Markdown is the planning bridge | `entityBuilder` or approved successor entity registry | `entityKey = organization` |
| Entity-registry persistence record | not yet backed by entity-definition lineage/version rows | DB-backed entity lineage, version, attributes, relationships, lifecycle, and retention rows | future `entityBuilder`/registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact from DB-backed entity registry | `docs/data-dictionary/organization.md` |
| Migration trigger | Organization implementation planning resumes after the data dictionary/entity registry template is locked; first persistence task creates runtime table and should register or prepare registry-backed entity truth. | Handoff completes when runtime source, migrations, API contracts, registry rows, and generated Markdown are reconciled. | future Organization task breakdown / implementation blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Planned durable tenant-owned business entity record representing an official organization inside one customer/account. |
| Business purpose | Gives the Organization domain a stable root record for hierarchy, child business records, search, logo relationships, and exports. |
| Durable fact boundary | Organization identity, tenant/account ownership, parent relationship, active name uniqueness, lifecycle visibility, archive/delete posture, and source-data export behavior must remain stable on this entity or owned child records. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, asset/logo consumers, search/export jobs, audit/evidence reviewers, and future support operators. |
| Rebuild-from-spec value | A future maintainer can reconstruct the planned Organization table, tenant boundary, hierarchy rules, uniqueness, lifecycle, search, export, and authorization posture from this page plus cited artifacts. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization` |
| Primary key | `organization_id` |
| Stable external key | `organization_id`; no separate human-stable slug approved for v1 |
| Versioning model | `mutable-current-record` with audit/history evidence expected outside this page |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` |
| Soft-delete field | `deleted_at` |
| Archive field | `archived_at`; business state held in `lifecycle_status` |
| Generated artifact posture | `not-applicable` for the source record; exports are generated private copies |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.create` | `authoring` | create root-level or child organization | root, tenant | UI/API | creates active record; optional same-tenant parent link | audit create; validation proof | PRD; root-admin and tenant-admin API contracts | No automatically created default organization. |
| `organization.read` | `read-discovery` | get organization by ID | root, tenant | UI/API | no mutation; archived/deleted visibility depends on route/capability | access audit where required | API contracts | Normal reads exclude archived and deleted rows. |
| `organization.list` | `read-discovery` | list organizations | root, tenant | UI/API | no mutation; filtered by tenant/account and lifecycle visibility | access proof and pagination tests | API contracts | Uses deterministic pagination/sort defaults. |
| `organization.search` | `read-discovery` | grouped Organization-domain search | root, tenant | UI/API | no mutation; separated result groups by record type | search test evidence | API contracts; PRD Search Requirements | Browser-only filtering is not authoritative. |
| `organization.update` | `authoring` | update mutable Organization facts | root, tenant | UI/API | refreshes `updated_at`; cannot override system, tenant, or lifecycle fields | audit update; validation proof | API contracts; AGENTS defaults | Name updates must preserve tenant-scoped active uniqueness. |
| `organization.move` | `relationship-control` | move organization to a valid parent | root, tenant | UI/API | changes `parent_organization_id`; validates same tenant, no cycles, depth <= 10 | audit move; hierarchy tests | PRD Hierarchy Requirements | Parent and child must belong to same tenant/account. |
| `organization.archive` | `lifecycle` | archive organization | root, tenant | UI/API | sets archived state; either archive whole branch or move children to another valid parent | audit archive; branch-choice evidence | PRD Hierarchy Requirements | Parent archive is an explicit choice, not an implicit destructive cascade. |
| `organization.restore` | `lifecycle` | restore archived organization | root, tenant | UI/API | clears archive posture when lifecycle rules allow | audit restore; visibility proof | PRD Hierarchy Requirements | Restore/reactivation is explicit. |
| `organization.delete` | `lifecycle` | soft-delete organization | root, tenant | UI/API | sets `deleted_at`; normal reads exclude deleted rows | audit delete; retained/deleted visibility proof | AGENTS visibility and soft-delete defaults | Delete remains distinct from business archive. |
| `organization.reference-values.read` | `read-discovery` | list approved Organization reference values | root, tenant | UI/API | no mutation to organization; constrains reference selection | catalogue read proof | API contracts | Tenant admins may use active approved system-owned reference values. |
| `organization.reference-values.manage` | `governance-approval` | create/update/archive/deprecate/replace reference values | root | UI/API | may affect future reference choices; historical records retain durable meaning | audit catalogue changes | root-admin API contract; PRD Reference Values | System owned; editable by root admins, not tenant admins. |
| `organization.logo.upload` | `authoring` | create upload intent and attach logo relationship | root, tenant | UI/API/assets | creates or replaces Organization logo relationship | asset audit; scan/readiness evidence | asset decision records; API contracts | Organization owns relationship authorization; `assets` owns storage invariants. |
| `organization.logo.delete` | `lifecycle` | delete logo relationship | root, tenant | UI/API/assets | removes relationship; UI falls back to initials placeholder | audit delete; asset cleanup evidence | asset decision records; API contracts | Public logo delivery does not grant private Organization access. |
| `organization.export.create` | `import-export` | create private Organization export | root, tenant | UI/API/job/export | creates generated export copy from selected source sections | export audit; job/runbook evidence | private export asset decision; API contracts | Generated copies expire/delete separately from persistent source data. |
| `organization.export.read-download` | `import-export` | list/get/download private export | root, tenant | UI/API/export | no source mutation; reads generated copy while available | access audit; expiry proof | private export asset decision; API contracts | Export is private. |
| `organization.export.delete-expire` | `retention-cleanup` | delete or expire generated export copy | root, tenant, system | UI/API/job | deletes generated export copy; does not change persistent source data | cleanup retry/failure evidence | private export asset decision | Expiry is 24 hours or on delete. |

## Capability Family Rules

| Capability family | Meaning for Organization | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads, lists, searches, or renders Organization records, reference values, or generated export metadata without changing source records. | The user outcome is lookup, inspection, search, comparison, or download metadata. |
| `authoring` | Creates or updates source Organization facts or logo relationships. | The operation changes business facts but is not primarily a lifecycle transition. |
| `lifecycle` | Archives, restores, deletes, or removes Organization source records or relationships. | The main effect changes visibility, retained state, or delete posture. |
| `relationship-control` | Changes parent/child hierarchy or validates related child records. | The main effect is parent, child, sibling, branch, or ownership relationship. |
| `governance-approval` | Manages system-owned reference values or future approval/review posture. | Root-only policy or catalogue control is the main business event. |
| `import-export` | Creates, reads, downloads, or packages private Organization export data. | The boundary is data movement out of the feature. |
| `retention-cleanup` | Expires/deletes generated export copies or future orphaned resources. | The main concern is retention, cleanup, or deletion finality. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_id` | `organization_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | header identity / hidden system field | PRD/API contracts |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes for tenant actors; selected by root target tenant | immutable after create | exact, facet | context boundary badge / hidden authority field | PRD Authorization Requirements |
| `parent_organization_id` | `parent_organization_id` | `relationship` | `UUID or NULL` | `single` | no | no | lifecycle-only via move/parent assignment | exact, hierarchy traversal | relationship tree / parent selector | PRD Hierarchy Requirements |
| `name` | `name` | `core` | `TEXT` | `single` | yes | no | updateable | prefix/full-text display source | primary title field | PRD Data Requirements; API contracts |
| `normalized_name` | `normalized_name` | `system` | `TEXT` | `single` | yes | yes | system-only | exact, prefix, unique | hidden normalized field | AGENTS normalization/search rules |
| `organization_type_reference_value_id` | `organization_type_reference_value_id` | `relationship` | `UUID or NULL` | `single` | no | no | updateable | exact, facet | reference-value picker | PRD Reference Values |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact, facet | status badge and lifecycle controls | PRD Core Concepts |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | PRD lifecycle requirements; AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort, visibility filter | deleted-record metadata | AGENTS visibility and soft-delete defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS API/entity defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS mutation semantics |

## Attribute Category Rules

| Category | Meaning for Organization | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable Organization identity. | Shown as durable identity in detail/debug contexts; not editable. | Generated by system; exact route parameter when present. | The field identifies this record rather than describing it. |
| `core` | Business facts a user naturally edits to describe the organization. | Primary detail and create/edit form area. | Strong validation; included in standard read responses. | The field is part of normal Organization meaning. |
| `relationship` | Links Organization to tenant/account, parent, children, reference values, logos, and child records. | Relationship tree, picker, link panel, or scoped child area. | Foreign-key/reference validation and object authorization required. | The field points to or controls another durable entity. |
| `lifecycle` | Controls current visibility, archive, restore, delete, and retained-record access. | Status badge, lifecycle controls, confirmation flows. | Protected from normal update bodies; changed only by lifecycle actions. | The field changes whether the record is current, retained, or deleted. |
| `system` | Platform-maintained normalized values, identifiers, and timestamps. | Read-only metadata or hidden form values. | Clients must not supply or override. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status for this dictionary page before implementation exists. | docs/planning only | Technical Steering, PRD/task refinement, migration planning | this page |
| `active` | Runtime Organization record is current and not archived or deleted. | normal tenant/root reads | update, move, archive, delete, attach logo, export | PRD Core Concepts |
| `superseded` | Not a v1 runtime Organization record state; reference values may be explicitly replaced. | not-applicable for Organization records | not-applicable unless future versioning is approved | PRD Reference Values |
| `archived` | Organization is retained but removed from normal current lists/searches. | explicit retained-record reads only | restore, delete, historical/export inclusion where authorized | PRD Hierarchy Requirements |
| `deleted` | Organization is soft-deleted under explicit delete capability. | explicit deleted-record reads only | restore or purge only if approved later | AGENTS visibility and soft-delete defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.tenant` | `ownership` | Organization | Tenant | many-to-one | `tenant_id` owns tenant/account boundary; tenant admins cannot body-supply tenant authority. | Tenant/account lifecycle and authorization constrain Organization visibility and mutation. | Context badge; root selected-account framing; hidden tenant authority in tenant-admin flows. | PRD Authorization Requirements; API contracts |
| `organization.parent` | `parent` | Organization | Organization | many-to-one optional | Parent must be same tenant/account; depth <= 10; cycles denied. | Archive/move/delete decisions must account for children and branch posture. | Hierarchy tree and parent selector. | PRD Hierarchy Requirements |
| `organization.children` | `child` | Organization | Organization | one-to-many | Children must remain same tenant/account and within max depth. | Parent archive can archive branch or move children to another valid parent. | Child list/tree branch controls. | PRD Hierarchy Requirements |
| `organization.reference-type` | `reference` | Organization | Organization reference value | many-to-one optional | Reference values are system-owned; root admins manage; tenant admins use active approved values. | Deprecated/replaced values must preserve historical meaning. | Reference-value selector and retained label display. | PRD Reference Values; root-admin API contract |
| `organization.logo` | `reference` | Organization | Asset / Organization logo relationship | one-to-many by logo type over time; v1 uses one logo type | Organization owns entity authorization; `assets` owns asset invariants. | Deleting logo relationship falls back to initials placeholder. | Logo panel/uploader and public delivery preview. | asset decision records; API contracts |
| `organization.child-records` | `child` | Organization | legal profiles, locations, business units, integrations | one-to-many | Child features must validate Organization existence and tenant ownership through `organizationCore` seam. | Archive/delete and export behavior must account for child records. | Separate child areas scoped under Organization detail. | PRD scope; API contracts |
| `organization.export` | `evidence-link` | Organization | private export bundle | one-to-many | Export must be requested by authorized root/tenant actor for selected tenant/account sections. | Generated export copies expire/delete without changing source Organization data. | Export history/download area. | private export asset decision; API contracts |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_pkey` | `primary key` | `organization_id` | Primary key on `organization_id`. | Stable identity for child records, hierarchy, search, exports, audit, and logo relationships. | planned |
| `fk_organization_tenant` | `foreign key` | `tenant_id` | `tenant_id` references owning tenant/customer account. | Tenant boundary enforcement depends on durable tenant ownership. | PRD Authorization Requirements |
| `fk_organization_parent` | `foreign key` | `parent_organization_id` | References `organization.organization_id`. | Parent/child relationships must be durable. | PRD Hierarchy Requirements |
| `same_tenant_parent_rule` | `code-enforced validation` | `tenant_id`, `parent_organization_id` | Parent and child must share `tenant_id`. | Prevents cross-tenant hierarchy leaks and authority confusion. | PRD Authorization Requirements; `TC-ORG-FOUNDATION-UNIT-001` |
| `organization_depth_and_cycle_rule` | `code-enforced validation` | `parent_organization_id` | Hierarchy depth must not exceed 10 and cycles are denied. | Keeps tree operations bounded and prevents recursive corruption. | PRD Hierarchy Requirements; `TC-ORG-FOUNDATION-UNIT-001` |
| `ix_organization_tenant_lifecycle` | `index` | `tenant_id`, `lifecycle_status`, `deleted_at` | Planned visibility index for tenant-scoped reads. | Supports normal and retained-record visibility without full scans. | inferred from PRD/API contracts |
| `ix_organization_parent` | `index` | `tenant_id`, `parent_organization_id` | Planned hierarchy lookup index. | Supports child lookup, branch archive, move-children, and hierarchy rendering. | PRD Hierarchy Requirements |
| `ix_organization_normalized_name` | `index` | `tenant_id`, `normalized_name` | Planned search/filter index. | Supports deterministic name search and filters. | PRD Search Requirements |
| `uq_organization_tenant_normalized_name_active` | `partial unique` | `tenant_id`, `normalized_name` | Unique where Organization is active and not soft-deleted. | Allows different tenants/accounts to share names while preventing duplicate active names inside one tenant/account. | product decision on 2026-05-14; AGENTS uniqueness defaults |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `organization.name.trim-lowercase` | `name`, `normalized_name` | Trim `name`; store lowercase `normalized_name` for uniqueness/search. | `ORGANIZATION_INVALID_REQUEST` for invalid shape; `ORGANIZATION_NAME_ALREADY_EXISTS` for duplicate active normalized name. | AGENTS normalization/search defaults; PRD/API contracts |
| `organization.name.required` | `name` | Empty strings are rejected, not converted to null. | `ORGANIZATION_INVALID_REQUEST`. | AGENTS normalization defaults |
| `organization.name.tenant-active-unique` | `tenant_id`, `normalized_name`, `lifecycle_status`, `deleted_at` | Active non-deleted names are unique within one tenant/account only. | `ORGANIZATION_NAME_ALREADY_EXISTS`. | product decision on 2026-05-14 |
| `organization.parent.same-tenant` | `tenant_id`, `parent_organization_id` | Parent and child must share tenant/account. | `ORGANIZATION_TENANT_MISMATCH`. | PRD Authorization Requirements |
| `organization.parent.no-cycle` | `parent_organization_id` | Parent cannot be self or descendant. | `ORGANIZATION_HIERARCHY_CYCLE`. | PRD Hierarchy Requirements |
| `organization.parent.max-depth` | `parent_organization_id` | Hierarchy depth must not exceed 10. | `ORGANIZATION_HIERARCHY_DEPTH_EXCEEDED`. | PRD Hierarchy Requirements |
| `organization.system-managed-fields` | IDs, tenant authority, timestamps, lifecycle fields | Clients cannot override system-managed fields through create/update bodies. | `ORGANIZATION_INVALID_REQUEST`. | AGENTS system-managed field defaults; API contracts |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | `ix_organization_tenant_lifecycle`; related indexes | Required tenant/account boundary for all non-public reads. | PRD/API contracts |
| `normalized_name` | exact, prefix, full-text candidate | scalar | `ix_organization_normalized_name`; partial unique index | Supports deterministic name search and active uniqueness. | PRD Search Requirements |
| `parent_organization_id` | exact, facet | scalar self-reference | `ix_organization_parent` | Supports hierarchy tree, branch archive, and move-child workflows. | PRD Hierarchy Requirements |
| `lifecycle_status` | exact, facet | scalar | `ix_organization_tenant_lifecycle` | Normal reads exclude archived unless explicitly requested/authorized. | PRD Core Concepts |
| `deleted_at` | exact null/non-null, range, sort | scalar timestamp | `ix_organization_tenant_lifecycle` | Normal reads exclude deleted rows. | AGENTS visibility defaults |
| `created_at`, `updated_at`, `archived_at` | range, sort | scalar timestamps | planned sort/filter indexes as needed | Supports deterministic pagination, audit review, and retained-record filtering. | AGENTS pagination/sorting defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via `organization.create` | `name`, optional `parent_organization_id`, optional reference value | stamps `organization_id`, `tenant_id`, `created_at`, `updated_at`, default `lifecycle_status = active`, `normalized_name` | Must reject duplicate active name in same tenant/account and invalid parent. | PRD/API contracts; AGENTS defaults |
| `update` | root/tenant via `organization.update` | approved mutable core/reference facts | refreshes `updated_at`, recomputes `normalized_name` when `name` changes | Cannot override tenant, IDs, timestamps, lifecycle, or deleted state through normal update. | AGENTS system-managed field defaults |
| `move` | root/tenant via `organization.move` | `parent_organization_id` | refreshes `updated_at` | Must preserve same tenant/account, no cycles, depth <= 10. | PRD Hierarchy Requirements |
| `archive` | root/tenant via `organization.archive` | `lifecycle_status`, `archived_at` | refreshes `updated_at`; normal visibility removed | Parent archive must explicitly choose archive-branch or move-children. | PRD Hierarchy Requirements |
| `restore` | root/tenant via `organization.restore` | `lifecycle_status`, `archived_at` | clears archive timestamp and refreshes `updated_at` | Must re-check tenant/account, uniqueness, parent lifecycle, and deleted state. | PRD lifecycle requirements |
| `delete` | root/tenant via explicit delete capability | `deleted_at` | sets `deleted_at`, refreshes `updated_at`; normal visibility removed | Delete is distinct from archive; hard purge is not approved here. | AGENTS visibility and soft-delete defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Persistent Organization source records are retained when archived and when included in authorized private exports. | `organizationCore` owns source lifecycle; export feature owns generated copy lifecycle. | archive, restore, delete, export request | Source lifecycle failures need audit/runbook evidence later. | planned tests and future runbook | PRD; private export asset decision |
| Cleanup | No source-record cleanup job approved for Organization records in this planning slice. Generated export copies expire or delete separately. | export feature / platform job seam for generated copies | 24-hour expiry or explicit export delete | Cleanup retry and failure recording required for generated export copies. | private export decision | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` |
| Export | Private export includes selected Organization source sections, including retained records when authorized. | `organizationExports` with Organization source seams | user export request | Export job failures must be recorded and retried according to later job/runbook design. | PRD/API contracts; asset decision | private export asset decision |
| Delete / purge | Soft delete for source Organization records; generated export copies may be deleted/expired. Hard purge not approved by this page. | `organizationCore` for source; export feature for generated copies | explicit delete capability or export cleanup | Delete failures need audit evidence; purge requires future approval. | AGENTS defaults; planned tests | AGENTS visibility defaults |
| Legal hold | Legal/incident hold affects persistent source Organization data and audit evidence, not temporary generated export copies. | future compliance/legal hold owner plus source feature | hold placement/removal | Cleanup must not remove held source data; generated export copies follow approved export-copy policy. | product decision in Organization discovery | PRD/private export posture |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | `root` for root-admin selected-account routes; `tenant` for tenant-admin current-account routes; `system` for jobs/cleanup. | API contracts; PRD Authorization Requirements |
| Tenant context required | yes for all non-public Organization source operations. | AGENTS tenant boundary defaults; API contracts |
| Tenant context source | root routes use exact `tenantId` route param plus root authority; tenant-admin routes use server-side current tenant/account context. | root-admin and tenant-admin API contracts |
| Governing capability | planned Organization-domain capabilities for create/read/list/update/move/archive/restore/delete/search/logo/export/reference operations. | PRD/API contracts |
| Cross-tenant posture | deny by default unless an explicitly approved root/operator capability selects the tenant/account. | AGENTS tenant boundary defaults |
| Object-level rule | Target Organization, parent, child, logo relationship, child record, and export section must belong to the selected/current tenant/account. | API contracts; PRD Authorization Requirements |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned root-admin and tenant-admin APIs exist as contracts. | `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |
| UI required | planned shared Organization management experience; root admins see more functionality/entities. | PRD and discovery decisions |
| Default entity-management preset | `not-yet-defined`; future entity-management design-system preset should cover Organization list/detail/create/edit/lifecycle/relationship panels. | data dictionary registry discovery packet |
| List view treatment | Searchable/paginated tenant/account-scoped Organization list with status, parent summary, and actions according to actor authority. | PRD/API contracts |
| Detail view treatment | Core attributes, hierarchy relationships, child areas, logo panel, lifecycle/history, and export links should be separate governed areas. | PRD/API contracts |
| Create/edit treatment | Governed form with tenant context fixed by route/session, parent selector, reference-value picker, duplicate-name validation, and system-managed fields hidden/read-only. | PRD/API contracts |
| Lifecycle action treatment | Archive/restore/delete/move require confirmations; parent archive must choose branch archive or move children. | PRD Hierarchy Requirements |
| Relationship navigation treatment | Hierarchy tree/branch controls plus child record areas under the Organization starting point. | PRD and requester memo notes |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant organization metadata | PRD; AGENTS tenant boundary defaults |
| Privacy / PII relevance | Organization identity is not inherently personal data, but can be business-sensitive and PII-adjacent when combined with memberships, contacts, or legal/location child records. | PRD; data dictionary planning |
| Security relevance | moderate to high: tenant boundary, hierarchy authorization, logo asset relationship, export, and retained-record access require integrity protection. | AGENTS tenant/asset defaults; API contracts |
| Audit relevance | yes: create, update, move, archive, restore, delete, logo changes, export, and denied access require evidence. | PRD; planned test cases |
| Retention / cleanup posture | archived and retained source records remain available through explicit retained-record/export capabilities; generated export copies expire/delete separately. | PRD; private export asset decision |
| Export / deletion posture | private exports include selected source data; generated export copies are not source truth and expire/delete independently. | private export asset decision |
| Legal hold posture | legal and incident holds affect persistent source data and audit evidence, not temporary generated export copies. | Organization discovery decision |
| Operational evidence requirements | `npm run data:compliance-health`; future hierarchy/search/export/authz/audit tests; future runbook for export cleanup and lifecycle failures. | this page; test-case doc |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This page; PRD; API contracts | Organization is documented as planned durable source data owned by `organizationCore`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | PRD/API contracts; executable tests not implemented yet | `organization_id`, `created_at`, `updated_at`, `deleted_at`, and lifecycle fields must be generated or maintained by the system. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | product decision on 2026-05-14; PRD Search Requirements; planned implementation must add validation and storage index proof | Same normalized name is allowed across tenants/accounts but denied within one tenant/account for active rows. |
| Soft-delete and normal-read visibility | yes | planned | PRD/API contracts; executable tests not implemented yet | Normal reads exclude archived and deleted rows by default. |
| Tenant boundary / object-level authorization | yes | planned | planned security cases `TC-ORG-FOUNDATION-SEC-001`; integration cases `TC-ORG-FOUNDATION-INT-001`, `TC-ORG-FOUNDATION-INT-002` | Root and tenant authority remain distinct; current/selected tenant context is required. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`; this page | Persistent source data retention needs implementation/runbook proof; generated export copies expire/delete on schedule. |
| Auditability and operational evidence | yes | planned | planned audit case `TC-ORG-FOUNDATION-AUD-001`; future runbook/test evidence | Audit sink/schema is not defined by this entity page. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_INVALID_REQUEST` | request is missing or invalid Organization fields. | varies | invalid body, invalid query, unexpected field, empty string, or unsupported lifecycle request | API contracts; AGENTS defaults |
| `ORGANIZATION_NOT_FOUND` | organization cannot be found for the authorized context. | `organizationId` | missing, archived/deleted not visible through normal route, or wrong tenant/account | API contracts |
| `ORGANIZATION_TENANT_MISMATCH` | organization does not belong to the current or selected tenant. | `tenantId` or `organizationId` | cross-tenant access or relationship attempt | API contracts; PRD Authorization Requirements |
| `ORGANIZATION_NAME_ALREADY_EXISTS` | organization name is already used by another active organization in this tenant/account. | `name` | duplicate active `normalized_name` within the same `tenant_id` | product decision on 2026-05-14 |
| `ORGANIZATION_HIERARCHY_DEPTH_EXCEEDED` | hierarchy depth would exceed the approved limit. | `parentOrganizationId` | depth greater than 10 | PRD Hierarchy Requirements |
| `ORGANIZATION_HIERARCHY_CYCLE` | hierarchy operation would create a loop. | `parentOrganizationId` | parent is the same organization or a descendant | PRD Hierarchy Requirements |
| `ORGANIZATION_LIFECYCLE_CONFLICT` | requested operation conflicts with lifecycle state. | `lifecycleStatus` | normal update blocked by archive/delete state, invalid restore, or parent/child lifecycle violation | PRD lifecycle requirements |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| `PRD` | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Organization domain concepts, hierarchy, lifecycle, search, reference values, export, and authorization posture. |
| `API contract` | `docs/api-contracts/organization-root-admin.md` | Planned root-admin routes, request/response/error posture, tenant route context, logo/export/reference route families. |
| `API contract` | `docs/api-contracts/organization-tenant-admin.md` | Planned tenant-admin routes, current tenant/account context, and tenant-scoped Organization operation posture. |
| `test` | `docs/prd/test_cases/2026-05-12-0025-organization-domain-foundation-test-cases.md` | Planned unit, integration, security, audit, export, and compatibility proof obligations. |
| `asset decision` | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md` | Public logo relationship, upload, delivery, alt text, placeholder, and asset authorization posture. |
| `asset decision` | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` | Private export bundle retention, expiry, delete, and legal-hold/export-copy posture. |
| `discovery` | `docs/workspace/product-discovery/2026-05-14-data-dictionary-entity-registry.md` | Future DB-backed dictionary/entity-management template pressure and structured schema direction. |
| `standard` | `docs/standards/data-dictionary-registry-migration-map.md` | Mapping from this Markdown page structure to future DB-backed entity-registry rows. |
