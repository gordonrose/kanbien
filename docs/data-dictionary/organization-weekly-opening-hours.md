# Organization Weekly Opening Hours

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-weekly-opening-hours` |
| Entity name | Organization Weekly Opening Hours |
| Dictionary file | `docs/data-dictionary/organization-weekly-opening-hours.md` |
| Owning feature | `organizationOpeningHours` |
| Ownership status | `implemented-foundation` |
| Current entity status | `active-v1` |
| Primary authority | `runtime-source` |
| Primary source table or record | `organization_location_weekly_opening_hours`, `WeeklyOpeningHoursSlotData` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-15` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | runtime source, migration, focused tests, and this source-independent dictionary entry | registry-backed dictionary truth after entity registry migration | `src/features/organizationOpeningHours`; migration `0054`; tests listed below |
| Source precedence | Runtime source and migrations win for implemented behavior; this page mirrors them. | Registry rows and generated docs must reconcile after future persistence-backed dictionary migration. | `src/features/organizationOpeningHours` |
| Runtime persistence owner | `organizationOpeningHours` | `organizationOpeningHours` | `src/features/organizationOpeningHours` |
| Runtime persistence record | `organization_location_weekly_opening_hours` | weekly opening-hours table and record type | `src/features/organizationOpeningHours/persistence/migrations/0054_create_location_opening_hours.sql`; `src/features/organizationOpeningHours/domain/types.ts` |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-weekly-opening-hours` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-implemented-mirror` | generated output or mirrored transitional artifact | this file |
| Migration trigger | completed S-007 foundation implementation | source, migrations, API contract, registry rows, and generated Markdown reconciled | S-007 task breakdown / implementation |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Optional weekday-specific recurring opening-hours slot for an Organization Location. |
| Business purpose | Captures ordinary weekly opening slots, including multiple open/close ranges for the same weekday. |
| Durable fact boundary | Owning location, weekday, slot order, local time range, active/delete posture, exception-supercession posture, and export/search behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct weekly slot fields, multiple-slot validation, ordering, optional absence, exception-supercession posture, and export behavior. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | `organization_location_weekly_opening_hours` |
| Primary key | `organization_weekly_opening_hours_id` |
| Stable external key | `organization_weekly_opening_hours_id` |
| Versioning model | `mutable-current-record` |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from owning Location and Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` |
| Archive field | not recommended for v1 slot UX; delete/remove uses `deleted_at` while audit records preserve change evidence |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | implemented in `0054_create_location_opening_hours.sql` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.weekly-hours-slot.manage` | `authoring` | create/update/delete weekly slot | root, tenant | UI/API | creates or changes child slot under Location and weekday | audit create/update/delete; time/order/non-overlap proof | runtime source; API contracts | Opening hours are optional. |
| `organization.weekly-hours-slot.read` | `read-discovery` | list/get weekly slots grouped by weekday | root, tenant | UI/API/search/export | no mutation; scoped to Location and tenant/account | access proof | API contracts | No active slots for a weekday means closed in the normal weekly schedule. |
| `organization.weekly-hours-slot.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected source data | export evidence | private export decision | Export follows selected sections. |

## Capability Family Rules

| Capability family | Meaning for Weekly Opening Hours | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads weekly slot records. | The operation inspects hours truth. |
| `authoring` | Creates or updates weekly slots. | The operation changes recurring availability. |
| `relationship-control` | Reorders slots within one weekday. | The operation changes slot sequence without changing ownership. |
| `lifecycle` | Deletes/removes weekly slots. | The operation changes current visibility. |
| `import-export` | Includes weekly slots in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_weekly_opening_hours_id` | `organization_weekly_opening_hours_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | implemented |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `organization_location_id` | `organization_location_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Location relationship | PRD Weekly Opening Hours |
| `weekday` | `weekday` | `core` | `INTEGER or enum weekday` | `single` | yes | no | updateable | exact, sort | weekday selector | PRD Weekly Opening Hours |
| `slot_order` | `slot_order` | `core` | `INTEGER` | `single` | yes | no | updateable via reorder | sort | slot order handle/index | user refinement 2026-05-15 |
| `opens_at_local_time` | `opens_at_local_time` | `core` | `TIME` | `single` | yes | no | updateable | range, sort | time input | PRD Weekly Opening Hours |
| `closes_at_local_time` | `closes_at_local_time` | `core` | `TIME` | `single` | yes | no | updateable | range, sort | time input | PRD Weekly Opening Hours |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `deleted` | `single` | yes | yes | lifecycle-only | exact | status badge | user refinement 2026-05-15 |
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
| `active` | Current weekly slot. | normal reads | update, reorder, delete, export | PRD Weekly Opening Hours |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Not recommended as user-facing slot state in v1. | not-applicable | not-applicable unless retained slot history is later approved | user refinement 2026-05-15 |
| `deleted` | Soft-deleted slot. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `weekly-opening-hours.location` | `ownership` | Weekly Opening Hours | Organization Location | many-to-one | Must belong to same tenant/account as Location and Organization. | Location lifecycle constrains hours visibility. | Weekly-hours panel under Location detail. | PRD/API contracts |
| `weekly-opening-hours.organization` | `ownership` | Weekly Opening Hours | Organization | many-to-one derived | Derived through Location. | Organization lifecycle constrains operations. | inherited Organization context | PRD |
| `weekly-opening-hours.exceptions` | `superseded-by` | Weekly Opening Hours | Opening Hours Exception | one-to-many derived by location/date/time | Exceptions supersede normal weekly slots for affected dates/times. | Effective-hours reads apply exception precedence. | exception panel/effective schedule preview | user refinement 2026-05-15 |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_weekly_opening_hours_pkey` | `primary key` | `organization_weekly_opening_hours_id` | Stable row identity. | Supports reads and audit. | implemented |
| `fk_weekly_hours_location` | `foreign key` | `organization_location_id` | References owning Location. | Keeps weekly hours scoped to location. | PRD |
| `uq_weekly_hours_slot_order` | `partial unique` | `organization_location_id`, `weekday`, `slot_order`, `deleted_at` | One active slot order per location and weekday. | Keeps multi-slot display deterministic. | user refinement 2026-05-15 |
| `weekly_hours_no_overlap_rule` | `code-enforced validation` | `organization_location_id`, `weekday`, `opens_at_local_time`, `closes_at_local_time`, `deleted_at` | Active slots for the same location and weekday must not overlap. | Prevents ambiguous normal schedules. | user refinement 2026-05-15 |
| `ix_weekly_hours_location` | `index` | `organization_location_id`, `weekday`, `slot_order`, `deleted_at` | Location weekly schedule lookup index. | Supports location detail and export. | inferred |
| `ck_weekly_hours_weekday` | `check` | `weekday` | Valid weekday only. | Prevents invalid weekly schedule rows. | PRD |
| `ck_weekly_hours_time_range` | `check or code-enforced validation` | `opens_at_local_time`, `closes_at_local_time` | `opens_at_local_time` must be before `closes_at_local_time`; overnight slots deferred. | Prevents invalid opening-hour slots. | PRD; user refinement 2026-05-15 |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `weekly-hours.location.same-tenant` | `tenant_id`, `organization_location_id` | Slot must belong to a Location in the same tenant/account. | shared Organization boundary error. | PRD/API contracts |
| `weekly-hours.weekday.valid` | `weekday` | Only valid weekdays accepted. | invalid weekly hours error. | PRD |
| `weekly-hours.slot-order.unique` | `organization_location_id`, `weekday`, `slot_order` | Slot order must be unique per active weekday schedule. | duplicate slot order error. | user refinement 2026-05-15 |
| `weekly-hours.time-range.valid` | `opens_at_local_time`, `closes_at_local_time` | Time range must be valid and same-day in v1. | invalid weekly hours error. | PRD |
| `weekly-hours.no-overlap` | weekday/time fields | Active slots for the same location and weekday must not overlap. | overlapping weekly hours error. | user refinement 2026-05-15 |
| `weekly-hours.closed-by-absence` | weekday slots | No active slots for a weekday means closed under the recurring baseline. | not-applicable | user refinement 2026-05-15 |
| `weekly-hours.exceptions-separate` | exception behavior | Date-specific closures and special openings belong to Opening Hours Exception, not this row. | invalid request error if supplied here. | user refinement 2026-05-15 |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant visibility index | Required boundary for all reads. | API contracts |
| `organization_location_id` | exact, facet | scalar | location schedule index | Scopes hours under Location. | PRD |
| `weekday`, `slot_order` | exact, sort | scalar | weekly schedule index | Orders weekly schedule. | PRD; user refinement 2026-05-15 |
| `opens_at_local_time`, `closes_at_local_time` | range, sort | scalar time | planned time index if needed | Supports validation and display ordering. | PRD |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via weekly-hours-slot create | weekday, slot order, time range | stamps IDs, tenant, timestamps, active status | Optional absence means no row is required; no overlap allowed. | PRD; user refinement 2026-05-15 |
| `update` | root/tenant via weekly-hours-slot update | weekday, slot order, time range | refreshes `updated_at` | Must preserve non-overlap and same-day rules. | PRD; user refinement 2026-05-15 |
| `reorder` | root/tenant via weekly-hours-slot reorder | `slot_order` | refreshes `updated_at` | Order unique per location/weekday. | user refinement 2026-05-15 |
| `delete` | root/tenant via weekly-hours-slot delete | `deleted_at` | soft-deletes and refreshes `updated_at` | User-facing behavior is remove slot; audit retains evidence. | AGENTS defaults; user refinement 2026-05-15 |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Deleted weekly slots remain soft-deleted for evidence; normal active schedule excludes deleted slots. | `organizationOpeningHours` | delete/export | lifecycle failures require audit evidence later. | unit and persistence tests | PRD; user refinement 2026-05-15 |
| Cleanup | No source cleanup job approved in planning slice. | `organizationOpeningHours` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized. | `organizationExports` reads via location/hours seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this foundation slice. | `organizationOpeningHours` | explicit delete | failure evidence required later. | unit and persistence tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | `organization.weekly-hours-slot.read` and `organization.weekly-hours-slot.manage` | runtime source; API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Slot, Location, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | implemented child resource APIs | API contracts; runtime source |
| UI required | deferred Location detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | weekly schedule grid/list under Location | PRD |
| Detail view treatment | slots grouped by weekday, usually inline with Location hours | PRD |
| Create/edit treatment | weekday, slot order, and local time range controls | PRD |
| Lifecycle action treatment | delete/remove slot confirmations where exposed | AGENTS defaults |
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
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | implemented | unit/security/persistence tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | implemented | unit/persistence tests | Slot order and non-overlap rules are implemented. |
| Soft-delete and normal-read visibility | yes | implemented | unit/persistence tests | Normal reads exclude deleted rows. |
| Tenant boundary / object-level authorization | yes | implemented | security/persistence tests | Same tenant/account as Location/Organization. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | implemented | persistence tests | Audit sink/schema implemented in `organization_opening_hours_audit_event`. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_WEEKLY_HOURS_INVALID` | weekly opening hours are invalid. | weekday, slot order, or time fields | invalid weekday, time range, slot order, or exception behavior submitted to weekly slot route | API contracts |
| `ORGANIZATION_WEEKLY_HOURS_OVERLAP` | weekly opening-hours slots overlap. | time fields | active slot overlaps another active slot for the same location and weekday | user refinement 2026-05-15 |
| `ORGANIZATION_WEEKLY_HOURS_NOT_FOUND` | weekly opening-hours row cannot be found. | `organizationWeeklyOpeningHoursId` | missing, wrong tenant/account, or not visible | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Weekly hours scope and out-of-scope exceptions. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
