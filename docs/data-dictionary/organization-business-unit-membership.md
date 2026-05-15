# Organization Business Unit Membership

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-business-unit-membership` |
| Entity name | Organization Business Unit Membership |
| Dictionary file | `docs/data-dictionary/organization-business-unit-membership.md` |
| Owning feature | planned `businessUnitMemberships` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_business_unit_membership`, planned `OrganizationBusinessUnitMembershipRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent dictionary entry | implemented source, migrations, and registry-backed dictionary truth | PRD, API contracts, this page |
| Source precedence | Approved PRD/API/data dictionary own planned behavior until implementation exists. | Runtime source and migrations win after implementation; registry rows and generated docs must reconcile. | future `businessUnitMemberships` implementation |
| Runtime persistence owner | planned `businessUnitMemberships` | `businessUnitMemberships` | future `src/features/businessUnitMemberships` |
| Runtime persistence record | planned `organization_business_unit_membership` | membership table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-business-unit-membership` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Business-unit membership persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Durable link from a real individual user or another real business unit to a Business Unit. |
| Business purpose | Records which individuals or teams/units participate in an internal Organization structure and what participation role they hold. |
| Durable fact boundary | Owning business unit, tenant/account and Organization boundary, real individual/business-unit references, membership role, lifecycle, privacy/audit posture, and export behavior. |
| Primary users / actors | Root admins, tenant admins, public individual-user and business-unit seam consumers, search/export jobs, privacy reviewers, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct the membership table, real-record requirement, member-type rule, fixed v1 role taxonomy, cross-feature seam requirement, PII-adjacent classification, and export posture. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_business_unit_membership` |
| Primary key | `organization_business_unit_membership_id` |
| Stable external key | `organization_business_unit_membership_id` |
| Versioning model | `mutable-current-record` |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from owning Business Unit and Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` |
| Archive field | `archived_at`; business state held in `lifecycle_status` |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.business-unit-membership.create` | `relationship-control` | attach individual user or business unit to business unit | root, tenant | UI/API | creates membership link to real individual/unit and assigns membership role | audit create; real-record proof | PRD; API contracts; user refinement 2026-05-14 | Placeholder people/teams are forbidden. |
| `organization.business-unit-membership.read` | `read-discovery` | list/get memberships | root, tenant | UI/API/search/export | no mutation; scoped to Business Unit and tenant/account | access proof | API contracts | May be PII-adjacent. |
| `organization.business-unit-membership.update` | `authoring` | update membership metadata | root, tenant | UI/API | refreshes `updated_at` | audit update | API contracts | Exact metadata fields remain implementation detail. |
| `organization.business-unit-membership.archive` | `lifecycle` | archive membership | root, tenant | UI/API | removes current membership visibility | audit archive | PRD | Normal reads exclude archived rows. |
| `organization.business-unit-membership.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected membership data | export evidence | private export decision | Export may contain PII-adjacent individual references and Organization structure references. |

## Capability Family Rules

| Capability family | Meaning for Business Unit Membership | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads membership records. | The operation inspects membership truth. |
| `relationship-control` | Attaches or detaches individual or business-unit relationships. | The main effect is link management. |
| `authoring` | Edits approved membership metadata. | The operation changes non-link facts. |
| `lifecycle` | Archives, restores, or deletes memberships. | The operation changes current visibility. |
| `import-export` | Includes memberships in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_business_unit_membership_id` | `organization_business_unit_membership_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `business_unit_id` | `business_unit_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Business Unit relationship | PRD |
| `individual_user_id` | planned public user reference | `privacy` | `UUID or NULL` | `single` | conditional | no | updateable by relationship action | exact | individual picker/reference | user refinement 2026-05-14 |
| `member_business_unit_id` | planned business-unit member reference | `relationship` | `UUID or NULL` | `single` | conditional | no | updateable by relationship action | exact, hierarchy traversal | team/unit picker/reference | user refinement 2026-05-14 |
| `member_type` | planned member-type field | `core` | `individual` or `business_unit` | `single` | yes | no | updateable by relationship action | exact, facet | segmented member type | user refinement 2026-05-14 |
| `membership_role` | planned participation-role field | `security` | `owner`, `manager`, `member`, or `viewer` | `single` | yes | no | updateable by relationship action | exact, facet | role selector/badge | recommendation 2026-05-14 |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact | status badge | AGENTS defaults |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Membership | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable membership identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the link record. |
| `core` | Member type and membership classification. | Membership list/detail field. | Validated and searchable. | The field describes the membership itself. |
| `relationship` | Links membership to Business Unit, Organization, and tenant/account. | Scoped relationship panel. | Foreign-key and authz required. | The field controls ownership. |
| `privacy` | Individual user reference that may identify a person. | Minimized and access-controlled. | Must use public user seam. | The value identifies or links to a person. |
| `security` | Membership participation role that may affect Organization-domain behavior. | Role badge/selector with clear permissions note. | Uses fixed v1 Organization membership role taxonomy. | The value is permission/security-adjacent. |
| `lifecycle` | Controls current/archive/delete visibility. | Status badge/lifecycle controls. | Protected from normal update. | The field changes visibility. |
| `system` | Platform-managed values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current membership link. | normal reads | update, archive, export | PRD Membership |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Retained membership removed from current views. | explicit retained reads/export only | restore, delete where approved | AGENTS defaults |
| `deleted` | Soft-deleted membership. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `membership.business-unit` | `ownership` | Business Unit Membership | Business Unit | many-to-one | Must belong to same tenant/account and Organization. | Business Unit lifecycle constrains membership visibility. | Membership panel under Business Unit. | PRD |
| `membership.individual-user` | `reference` | Business Unit Membership | public user identity | many-to-one optional | Must reference a real existing individual user through approved public seam. | User removal/deactivation behavior requires future seam decision. | individual picker/reference | user refinement 2026-05-14 |
| `membership.member-business-unit` | `reference` | Business Unit Membership | Business Unit | many-to-one optional | Must reference a real existing business unit in the same Organization and tenant/account; cannot create cyclic/ambiguous membership semantics. | Member unit archive/delete constrains display and may require explicit retained reference behavior. | team/unit picker/reference | user refinement 2026-05-14 |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_business_unit_membership_pkey` | `primary key` | `organization_business_unit_membership_id` | Stable row identity. | Supports reads and audit. | planned |
| `fk_membership_business_unit` | `foreign key` | `business_unit_id` | References owning Business Unit. | Keeps membership scoped to unit. | PRD |
| `membership_real_member_rule` | `code-enforced validation` | `individual_user_id`, `member_business_unit_id`, `member_type` | Must reference exactly one real individual user or real business unit; placeholders denied. | Prevents fake authority/member records. | PRD Membership; user refinement 2026-05-14 |
| `membership_role_allowed_values` | `check or code-enforced validation` | `membership_role` | Must be one of owner, manager, member, or viewer in v1. | Keeps role meaning deterministic. | recommendation 2026-05-14 |
| `ix_membership_business_unit` | `index` | `business_unit_id`, `lifecycle_status`, `deleted_at` | Business Unit membership lookup. | Supports unit detail and export. | inferred |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `membership.real-individual` | `individual_user_id` | Individual references must be real records through public seam. | missing user error. | API contracts; user refinement 2026-05-14 |
| `membership.real-business-unit` | `member_business_unit_id` | Business-unit member references must be real records in the same Organization and tenant/account. | missing or invalid member business unit error. | user refinement 2026-05-14 |
| `membership.exactly-one-member-target` | `member_type`, `individual_user_id`, `member_business_unit_id` | Exactly one member target must be supplied and it must match `member_type`. | invalid member target error. | user refinement 2026-05-14 |
| `membership.role-taxonomy` | `membership_role` | v1 roles are fixed to owner, manager, member, and viewer; they describe Organization-domain participation, not platform authz grants. | invalid membership role error. | recommendation 2026-05-14 |
| `membership.no-placeholders` | `individual_user_id`, `member_business_unit_id` | Placeholder people, teams, or units are forbidden. | invalid request error. | PRD Membership |
| `membership.no-private-imports` | seam usage | Feature must not import private persistence directly from other features. | architecture violation. | PRD Membership; AGENTS anti-drift seams |

## Membership Role Semantics

| Role | Meaning | Default management posture | Why choose it over another role |
| --- | --- | --- | --- |
| `owner` | Accountable owner for the unit membership context. | Can usually manage unit membership and lifecycle where the actor also has the required platform permission. | Use when the person or member unit is responsible for the unit, not merely participating. |
| `manager` | Operational manager for the unit. | Can usually manage day-to-day membership/details where allowed by platform permission. | Use when the member manages work or people but is not the accountable owner. |
| `member` | Normal participant in the unit. | Can usually be shown as part of the unit and included in exports/reporting. | Use for ordinary belonging/participation. |
| `viewer` | Read-only association with the unit. | Can usually see or be associated with the unit without implying management authority. | Use for observers, stakeholders, or read-only participants. |

Membership roles are Organization-domain participation labels. They must not by
themselves grant platform authorization unless a later permission-mapping
decision explicitly maps them to authz capabilities.

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id`, `organization_id`, `business_unit_id` | exact, facet | scalar | boundary and child indexes | Required boundary for reads. | API contracts |
| `individual_user_id`, `member_business_unit_id` | exact, facet | scalar references | planned reference indexes | Supports membership lookup and export. | user refinement 2026-05-14 |
| `member_type`, `membership_role` | exact, facet | scalar | planned filter index | Supports member grouping and role filtering. | user refinement/recommendation 2026-05-14 |
| `lifecycle_status`, `deleted_at` | exact, range, sort | scalar | visibility index | Normal reads exclude archived/deleted rows. | AGENTS defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via membership create | individual or business-unit reference, member type, membership role | stamps IDs, tenant, timestamps, active status | Must validate real individual/unit through public seams and fixed v1 role value. | PRD; user refinement 2026-05-14 |
| `update` | root/tenant via membership update | approved metadata/reference/role changes | refreshes `updated_at` | Must preserve real-record and fixed-role requirements. | PRD; user refinement 2026-05-14 |
| `archive` | root/tenant via membership archive | lifecycle fields | sets archived state and timestamp | Normal reads exclude archived row. | AGENTS defaults |
| `delete` | root/tenant via explicit delete | `deleted_at` | soft-deletes and refreshes `updated_at` | Hard purge not approved here. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Archived memberships remain retained. | `businessUnitMemberships` | archive/export | lifecycle failures require audit evidence later. | future tests | PRD |
| Cleanup | No source cleanup job approved in planning slice. | `businessUnitMemberships` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized. | `organizationExports` reads via membership seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this planning page. | `businessUnitMemberships` | explicit delete | failure evidence required later. | future tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | planned Organization business-unit membership capabilities plus public user and business-unit seam checks | API contracts; user refinement 2026-05-14 |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Membership, owning Business Unit, member individual or member Business Unit, Organization, and tenant/account must be authorized. | PRD/API contracts; user refinement 2026-05-14 |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned child resource APIs | API contracts |
| UI required | planned Business Unit child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | memberships list under Business Unit with individual/unit and role grouping | PRD; user refinement 2026-05-14 |
| Detail view treatment | membership detail with evidence, participation role, and individual/unit reference | PRD; user refinement 2026-05-14 |
| Create/edit treatment | governed picker using real individual-user or business-unit records plus fixed role selector | PRD; user refinement 2026-05-14 |
| Lifecycle action treatment | archive/delete confirmations | AGENTS defaults |
| Relationship navigation treatment | reachable from Business Unit and linked individual or member unit where approved | PRD; user refinement 2026-05-14 |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant membership metadata | PRD |
| Privacy / PII relevance | yes, user-linked membership may identify a person | PRD Membership |
| Security relevance | high-adjacent because membership role can affect Organization-domain behavior and may later be mapped to authz | AGENTS tenant/security defaults |
| Audit relevance | yes for create/update/archive/delete/export and denied seam lookups | PRD/test planning |
| Retention / cleanup posture | retained when archived; no purge approved | PRD |
| Export / deletion posture | private export inclusion; soft-delete source posture | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future public-seam/authz/privacy/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | PRD/API contracts | Exact duplicate-membership rule still needs implementation detail; member target and role taxonomy are now fixed for v1. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Normal reads exclude archived/deleted rows. |
| Tenant boundary / object-level authorization | yes | planned | future authz tests | Same tenant/account and approved individual/business-unit seams. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future audit/privacy tests | Audit sink/schema not defined here. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_MEMBERSHIP_USER_NOT_FOUND` | membership individual cannot be found. | `individualUserId` | missing or inaccessible real user record | API contracts |
| `ORGANIZATION_MEMBERSHIP_BUSINESS_UNIT_NOT_FOUND` | membership business unit cannot be found. | `memberBusinessUnitId` | missing, inaccessible, wrong-tenant, or wrong-Organization business unit | user refinement 2026-05-14 |
| `ORGANIZATION_MEMBERSHIP_ROLE_INVALID` | membership role is invalid. | `membershipRole` | role is not owner, manager, member, or viewer | recommendation 2026-05-14 |
| `ORGANIZATION_MEMBERSHIP_INVALID_REQUEST` | membership request is invalid. | varies | placeholder reference, invalid seam, invalid member target, or lifecycle conflict | PRD/API contracts |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Membership real-individual/business-unit requirements and privacy posture. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
