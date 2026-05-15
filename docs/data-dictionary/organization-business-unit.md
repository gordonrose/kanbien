# Organization Business Unit

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-business-unit` |
| Entity name | Organization Business Unit |
| Dictionary file | `docs/data-dictionary/organization-business-unit.md` |
| Owning feature | planned `businessUnits` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_business_unit`, planned `OrganizationBusinessUnitRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent dictionary entry | implemented source, migrations, and registry-backed dictionary truth | PRD, API contracts, this page |
| Source precedence | Approved PRD/API/data dictionary own planned behavior until implementation exists. | Runtime source and migrations win after implementation; registry rows and generated docs must reconcile. | future `businessUnits` implementation |
| Runtime persistence owner | planned `businessUnits` | `businessUnits` | future `src/features/businessUnits` |
| Runtime persistence record | planned `organization_business_unit` | `organization_business_unit` table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-business-unit` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Business-unit persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Internal structure inside an Organization, optionally arranged as a parent/child hierarchy. |
| Business purpose | Lets an Organization model departments, teams, or other internal units with bounded hierarchy. |
| Durable fact boundary | Owning Organization, tenant/account boundary, parent relationship, derived child-unit IDs, name, hierarchy depth/cycle posture, lifecycle, and export behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, membership services, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct the business-unit table, hierarchy rules, branch archive options, tenant/Organization boundary, and export posture. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_business_unit` |
| Primary key | `organization_business_unit_id` |
| Stable external key | `organization_business_unit_id` |
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
| `organization.business-unit.create` | `authoring` | create root-level or child business unit | root, tenant | UI/API | creates active unit; optional same-Organization parent | audit create; hierarchy validation proof | PRD; API contracts | Depth limit is 10 for v1. |
| `organization.business-unit.read` | `read-discovery` | list/get business units | root, tenant | UI/API/search/export | no mutation; scoped to Organization and tenant/account | access proof | API contracts | Includes hierarchy reads. |
| `organization.business-unit.update` | `authoring` | update business-unit facts | root, tenant | UI/API | refreshes `updated_at` | audit update | API contracts | Cannot override hierarchy authority fields directly where move owns them. |
| `organization.business-unit.move` | `relationship-control` | move business unit to valid parent | root, tenant | UI/API | changes parent link after depth/cycle/same-Organization validation | audit move; hierarchy tests | PRD Business Unit Hierarchy | Parent and child must share tenant/account and Organization. |
| `organization.business-unit.archive` | `lifecycle` | archive business unit | root, tenant | UI/API | archive whole branch or move children to valid parent | audit archive; branch-choice evidence | PRD | Parent archive has explicit branch behavior. |
| `organization.business-unit.restore` | `lifecycle` | restore business unit | root, tenant | UI/API | restores active visibility when allowed | audit restore | PRD | Must respect parent/Organization lifecycle. |
| `organization.business-unit.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected source data | export evidence | private export decision | Export follows selected sections. |

## Capability Family Rules

| Capability family | Meaning for Business Unit | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads/searches current or retained business units. | The operation inspects hierarchy truth. |
| `authoring` | Creates or updates unit details. | The operation changes business-unit facts. |
| `relationship-control` | Moves or validates hierarchy relationships. | The main effect is parent/child structure. |
| `lifecycle` | Archives, restores, or deletes units. | The operation changes current visibility or branch posture. |
| `import-export` | Includes units in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_business_unit_id` | `organization_business_unit_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `parent_business_unit_id` | `parent_business_unit_id` | `relationship` | `UUID or NULL` | `single` | no | no | lifecycle-only via move/parent assignment | exact, hierarchy traversal | hierarchy tree / parent selector | PRD Business Unit Hierarchy |
| `child_business_unit_ids` | derived from rows where `parent_business_unit_id = organization_business_unit_id` | `relationship` | `UUID[]` | `multi` | no | yes | derived-read-only | hierarchy traversal | child list/tree branch | user refinement 2026-05-14 |
| `name` | `name` | `core` | `TEXT` | `single` | yes | no | updateable | prefix, full-text | primary title field | inferred from business-unit purpose |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact | status badge | PRD |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Business Unit | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable unit identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the unit. |
| `core` | Main unit facts. | Primary detail/form field. | Validated and searchable. | The field describes the unit. |
| `relationship` | Links unit to Organization, parent, children, and tenant/account. | Hierarchy tree and parent selector. | Foreign-key, cycle, depth, and authz validation required. | The field controls hierarchy or ownership. |
| `lifecycle` | Controls active/archive/delete visibility. | Status badge and branch lifecycle controls. | Protected from normal update. | The field changes current visibility or branch behavior. |
| `system` | Platform-managed values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current business unit. | normal reads | update, move, archive, export | PRD |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Retained business unit removed from current views. | explicit retained reads/export only | restore, delete where approved | PRD |
| `deleted` | Soft-deleted business unit. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `business-unit.organization` | `ownership` | Business Unit | Organization | many-to-one | Must belong to same tenant/account as Organization. | Organization lifecycle constrains unit operations. | Business-unit area under Organization detail. | PRD/API contracts |
| `business-unit.parent` | `parent` | Business Unit | Business Unit | many-to-one optional | Parent must share tenant/account and Organization; depth <= 10; cycles denied. | Archive/move/delete decisions must account for children. | Hierarchy tree and parent selector. | PRD Business Unit Hierarchy |
| `business-unit.children` | `child` | Business Unit | Business Unit | one-to-many | Children must remain same tenant/account and Organization. | Parent archive can archive branch or move children. | Child list/tree branch controls. | PRD Business Unit Hierarchy |
| `business-unit.memberships` | `child` | Business Unit | Business Unit Membership | one-to-many | Memberships reference real users/roles through approved seams. | Unit archive/delete constrains membership visibility. | Membership panel under unit. | PRD Membership |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_business_unit_pkey` | `primary key` | `organization_business_unit_id` | Stable row identity. | Supports reads and audit. | planned |
| `fk_business_unit_organization` | `foreign key` | `organization_id` | References owning Organization. | Keeps unit scoped to Organization. | PRD |
| `fk_business_unit_parent` | `foreign key` | `parent_business_unit_id` | References parent business unit. | Supports hierarchy. | PRD |
| `same_organization_parent_rule` | `code-enforced validation` | `organization_id`, `parent_business_unit_id` | Parent and child must share Organization and tenant/account. | Prevents cross-boundary hierarchy. | PRD |
| `business_unit_depth_and_cycle_rule` | `code-enforced validation` | `parent_business_unit_id` | Depth <= 10 and cycles denied. | Prevents hierarchy corruption. | PRD |
| `ix_business_unit_parent` | `index` | `organization_id`, `parent_business_unit_id` | Hierarchy lookup index. | Supports tree rendering and branch archive. | inferred |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `business-unit.parent.same-organization` | `organization_id`, `parent_business_unit_id` | Parent and child must share Organization and tenant/account. | invalid business-unit parent error. | API contracts |
| `business-unit.children.derived` | `child_business_unit_ids` | Child IDs are a derived read projection from parent links, not a client-supplied or separately persisted source of truth. | invalid request if supplied in mutation body. | user refinement 2026-05-14 |
| `business-unit.parent.no-cycle` | `parent_business_unit_id` | Parent cannot be self or descendant. | invalid business-unit parent error. | PRD |
| `business-unit.parent.max-depth` | `parent_business_unit_id` | Hierarchy depth must not exceed 10. | invalid business-unit parent error. | PRD |
| `business-unit.system-fields` | identifiers, timestamps, lifecycle fields | Clients cannot override system-managed fields. | invalid request error. | AGENTS defaults |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant visibility index | Required boundary for all reads. | API contracts |
| `organization_id` | exact, facet | scalar | Organization child index | Scopes unit under Organization. | API contracts |
| `parent_business_unit_id`, derived `child_business_unit_ids` | exact, facet | scalar self-reference plus derived child projection | hierarchy index | Supports tree rendering and branch operations. | PRD; user refinement 2026-05-14 |
| `name` | prefix, full-text | scalar | planned search index | Supports grouped Organization search. | PRD Search Requirements |
| `lifecycle_status`, `deleted_at` | exact, range, sort | scalar | visibility index | Normal reads exclude archived/deleted rows. | AGENTS defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via business-unit create | name, optional parent | stamps IDs, tenant, timestamps, active status | Must validate parent depth/cycle/same Organization. | PRD |
| `update` | root/tenant via business-unit update | approved unit facts | refreshes `updated_at` | Parent movement should use move semantics; child IDs are never directly updated. | PRD; user refinement 2026-05-14 |
| `move` | root/tenant via business-unit move | `parent_business_unit_id` | refreshes `updated_at` | Must preserve same Organization, no cycles, depth <= 10. | PRD |
| `archive` | root/tenant via business-unit archive | lifecycle fields | sets archived state and timestamp | Parent archive must choose archive-branch or move-children. | PRD |
| `restore` | root/tenant via business-unit restore | lifecycle fields | clears archive fields | Must respect parent/Organization lifecycle. | PRD |
| `delete` | root/tenant via explicit delete | `deleted_at` | soft-deletes and refreshes `updated_at` | Hard purge not approved here. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Archived business units remain retained. | `businessUnits` | archive/export | lifecycle failures require audit evidence later. | future tests | PRD |
| Cleanup | No source cleanup job approved in planning slice. | `businessUnits` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized. | `organizationExports` reads via business-unit seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this planning page. | `businessUnits` | explicit delete | failure evidence required later. | future tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | planned Organization business-unit capabilities | API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Unit, parent, children, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned child resource APIs | API contracts |
| UI required | planned Organization detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | hierarchy tree/list scoped under Organization | PRD |
| Detail view treatment | unit detail plus children and memberships | PRD |
| Create/edit treatment | governed form with parent selector | PRD |
| Lifecycle action treatment | branch archive or move-children confirmation | PRD |
| Relationship navigation treatment | hierarchy tree with parent/child navigation | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant organization structure metadata | PRD |
| Privacy / PII relevance | low by itself, PII-adjacent through memberships | data dictionary planning |
| Security relevance | moderate because hierarchy can affect access/reporting/export scope | AGENTS tenant defaults |
| Audit relevance | yes for create/update/move/archive/restore/delete/export | PRD/test planning |
| Retention / cleanup posture | retained when archived; no purge approved | PRD |
| Export / deletion posture | private export inclusion; soft-delete source posture | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future hierarchy/authz/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | PRD/API contracts | Name uniqueness not approved here. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Normal reads exclude archived/deleted rows. |
| Tenant boundary / object-level authorization | yes | planned | future authz tests | Same tenant/account and Organization. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future audit tests | Audit sink/schema not defined here. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_BUSINESS_UNIT_INVALID_PARENT` | business-unit parent is invalid. | `parentBusinessUnitId` | cross-Organization parent, cycle, depth > 10, or lifecycle conflict | API contracts |
| `ORGANIZATION_BUSINESS_UNIT_NOT_FOUND` | business unit cannot be found for the authorized context. | `businessUnitId` | missing, wrong tenant/account, or not visible | inferred |
| `ORGANIZATION_BUSINESS_UNIT_INVALID_REQUEST` | business-unit request is invalid. | varies | invalid field or lifecycle conflict | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Business-unit hierarchy rules. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
