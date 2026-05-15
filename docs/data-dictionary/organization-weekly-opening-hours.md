# Organization Weekly Opening Hours

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-weekly-opening-hours` |
| Entity name | Organization Weekly Opening Hours |
| Dictionary file | `docs/data-dictionary/organization-weekly-opening-hours.md` |
| Owning feature | planned `locationOpeningHours` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_location_weekly_opening_hours`, planned `OrganizationWeeklyOpeningHoursRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent dictionary entry | implemented source, migrations, and registry-backed dictionary truth | PRD, API contracts, this page |
| Source precedence | Approved PRD/API/data dictionary own planned behavior until implementation exists. | Runtime source and migrations win after implementation; registry rows and generated docs must reconcile. | future `locationOpeningHours` implementation |
| Runtime persistence owner | planned `locationOpeningHours` | `locationOpeningHours` | future `src/features/locationOpeningHours` |
| Runtime persistence record | planned `organization_location_weekly_opening_hours` | weekly opening-hours table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-weekly-opening-hours` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Weekly opening-hours persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Optional recurring weekly availability slots for an Organization Location. |
| Business purpose | Captures ordinary weekly opening hours without special closure or seasonal behavior in v1. |
| Durable fact boundary | Owning location, weekday, local time range, active/archive/delete posture, and export/search behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct weekly slot fields, validation, optional absence, and out-of-scope exception behavior. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_location_weekly_opening_hours` |
| Primary key | `organization_weekly_opening_hours_id` |
| Stable external key | `organization_weekly_opening_hours_id` |
| Versioning model | `mutable-current-record` |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from owning Location and Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` |
| Archive field | `archived_at`; business state held in `lifecycle_status` |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | `source-independent-planning` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.weekly-hours.create` | `authoring` | create weekly slot | root, tenant | UI/API | creates child record under Location | audit create; time validation proof | PRD; API contracts | Opening hours are optional. |
| `organization.weekly-hours.read` | `read-discovery` | list/get weekly slots | root, tenant | UI/API/search/export | no mutation; scoped to Location and tenant/account | access proof | API contracts | Valid weekly absence is allowed. |
| `organization.weekly-hours.update` | `authoring` | update weekly slot | root, tenant | UI/API | refreshes `updated_at` | audit update | API contracts | Holiday/seasonal exceptions are out of scope. |
| `organization.weekly-hours.archive` | `lifecycle` | archive weekly slot | root, tenant | UI/API | follows Organization-domain archive posture | audit archive | PRD | Normal reads exclude archived rows. |
| `organization.weekly-hours.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected source data | export evidence | private export decision | Export follows selected sections. |

## Capability Family Rules

| Capability family | Meaning for Weekly Opening Hours | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads weekly slot records. | The operation inspects hours truth. |
| `authoring` | Creates or updates weekly slots. | The operation changes recurring availability. |
| `lifecycle` | Archives, restores, or deletes weekly slots. | The operation changes current visibility. |
| `import-export` | Includes weekly slots in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_weekly_opening_hours_id` | `organization_weekly_opening_hours_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `organization_location_id` | `organization_location_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Location relationship | PRD Weekly Opening Hours |
| `weekday` | `weekday` | `core` | `INTEGER or enum weekday` | `single` | yes | no | updateable | exact, sort | weekday selector | PRD Weekly Opening Hours |
| `opens_at_local_time` | `opens_at_local_time` | `core` | `TIME` | `single` | yes | no | updateable | range, sort | time input | PRD Weekly Opening Hours |
| `closes_at_local_time` | `closes_at_local_time` | `core` | `TIME` | `single` | yes | no | updateable | range, sort | time input | PRD Weekly Opening Hours |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact | status badge | AGENTS defaults |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Weekly Opening Hours | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable slot identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the child record. |
| `core` | Weekday and time range values. | Weekly-hours grid/form. | Validate weekday and time range. | The field describes weekly availability. |
| `relationship` | Links slot to Location, Organization, and tenant/account. | Scoped under Location detail. | Foreign-key and authz required. | The field controls ownership. |
| `lifecycle` | Controls current/archive/delete visibility. | Status/lifecycle controls. | Protected from normal update. | The field changes visibility. |
| `system` | Platform-managed values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current weekly slot. | normal reads | update, archive, export | PRD Weekly Opening Hours |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Retained slot removed from current views. | explicit retained reads/export only | restore, delete where approved | AGENTS defaults |
| `deleted` | Soft-deleted slot. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `weekly-opening-hours.location` | `ownership` | Weekly Opening Hours | Organization Location | many-to-one | Must belong to same tenant/account as Location and Organization. | Location lifecycle constrains hours visibility. | Weekly-hours panel under Location detail. | PRD/API contracts |
| `weekly-opening-hours.organization` | `ownership` | Weekly Opening Hours | Organization | many-to-one derived | Derived through Location. | Organization lifecycle constrains operations. | inherited Organization context | PRD |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_weekly_opening_hours_pkey` | `primary key` | `organization_weekly_opening_hours_id` | Stable row identity. | Supports reads and audit. | planned |
| `fk_weekly_hours_location` | `foreign key` | `organization_location_id` | References owning Location. | Keeps weekly hours scoped to location. | PRD |
| `ix_weekly_hours_location` | `index` | `organization_location_id`, `weekday`, `deleted_at` | Location weekly schedule lookup index. | Supports location detail and export. | inferred |
| `ck_weekly_hours_weekday` | `check` | `weekday` | Valid weekday only. | Prevents invalid weekly schedule rows. | PRD |
| `ck_weekly_hours_time_range` | `check or code-enforced validation` | `opens_at_local_time`, `closes_at_local_time` | Valid time range only. | Prevents invalid opening-hour slots. | PRD |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `weekly-hours.location.same-tenant` | `tenant_id`, `organization_location_id` | Slot must belong to a Location in the same tenant/account. | shared Organization boundary error. | PRD/API contracts |
| `weekly-hours.weekday.valid` | `weekday` | Only valid weekdays accepted. | invalid weekly hours error. | PRD |
| `weekly-hours.time-range.valid` | `opens_at_local_time`, `closes_at_local_time` | Time range must be valid. | invalid weekly hours error. | PRD |
| `weekly-hours.no-special-closures` | request body | Holiday, seasonal, special closure, or temporary exception behavior is out of scope. | invalid request error. | PRD |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant visibility index | Required boundary for all reads. | API contracts |
| `organization_location_id` | exact, facet | scalar | location schedule index | Scopes hours under Location. | PRD |
| `weekday` | exact, sort | scalar | weekly schedule index | Orders weekly schedule. | PRD |
| `opens_at_local_time`, `closes_at_local_time` | range, sort | scalar time | planned time index if needed | Supports validation and display ordering. | PRD |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via weekly-hours create | weekday/time range | stamps IDs, tenant, timestamps, active status | Optional absence means no row is required. | PRD |
| `update` | root/tenant via weekly-hours update | weekday/time range | refreshes `updated_at` | Special closures remain out of scope. | PRD |
| `archive` | root/tenant via weekly-hours archive | lifecycle fields | sets archived state and timestamp | Normal reads exclude archived rows. | AGENTS defaults |
| `delete` | root/tenant via explicit delete | `deleted_at` | soft-deletes and refreshes `updated_at` | Hard purge not approved here. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Archived weekly slots remain retained. | `locationOpeningHours` | archive/export | lifecycle failures require audit evidence later. | future tests | PRD |
| Cleanup | No source cleanup job approved in planning slice. | `locationOpeningHours` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized. | `organizationExports` reads via location/hours seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this planning page. | `locationOpeningHours` | explicit delete | failure evidence required later. | future tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | planned Organization weekly-hours capabilities | API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Slot, Location, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned child resource APIs | API contracts |
| UI required | planned Location detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | weekly schedule grid/list under Location | PRD |
| Detail view treatment | slot detail normally inline with Location hours | PRD |
| Create/edit treatment | weekday and time range controls | PRD |
| Lifecycle action treatment | archive/delete confirmations where exposed | AGENTS defaults |
| Relationship navigation treatment | reachable from Location under Organization | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant location metadata | PRD |
| Privacy / PII relevance | low by itself, possible sensitivity when tied to operations/location data | data dictionary planning |
| Security relevance | moderate because data is tenant-scoped and exportable | AGENTS tenant defaults |
| Audit relevance | yes for create/update/archive/delete/export | PRD/test planning |
| Retention / cleanup posture | retained when archived; no purge approved | PRD |
| Export / deletion posture | private export inclusion; soft-delete source posture | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future validation/authz/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | PRD/API contracts | Exact overlap rules are not approved here. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Normal reads exclude archived/deleted rows. |
| Tenant boundary / object-level authorization | yes | planned | future authz tests | Same tenant/account as Location/Organization. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future audit tests | Audit sink/schema not defined here. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_WEEKLY_HOURS_INVALID` | weekly opening hours are invalid. | weekday or time fields | invalid weekday, time range, or unsupported exception behavior | API contracts |
| `ORGANIZATION_WEEKLY_HOURS_NOT_FOUND` | weekly opening-hours row cannot be found. | `organizationWeeklyOpeningHoursId` | missing, wrong tenant/account, or not visible | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Weekly hours scope and out-of-scope exceptions. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
