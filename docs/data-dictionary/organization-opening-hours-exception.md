# Organization Opening Hours Exception

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-opening-hours-exception` |
| Entity name | Organization Opening Hours Exception |
| Dictionary file | `docs/data-dictionary/organization-opening-hours-exception.md` |
| Owning feature | `organizationOpeningHours` |
| Ownership status | `implemented-foundation` |
| Current entity status | `active-v1` |
| Primary authority | `runtime-source` |
| Primary source table or record | `organization_opening_hours_exception`, `OpeningHoursExceptionData` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-15` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | runtime source, migration, focused tests, and this source-independent dictionary entry | registry-backed dictionary truth after entity registry migration | `src/features/organizationOpeningHours`; migration `0054`; tests listed below |
| Source precedence | Runtime source and migrations win for implemented behavior; this page mirrors them. | Registry rows and generated docs must reconcile after future persistence-backed dictionary migration. | `src/features/organizationOpeningHours` |
| Runtime persistence owner | `organizationOpeningHours` | `organizationOpeningHours` | `src/features/organizationOpeningHours` |
| Runtime persistence record | `organization_opening_hours_exception` | exception table and record type | `src/features/organizationOpeningHours/persistence/migrations/0054_create_location_opening_hours.sql`; `src/features/organizationOpeningHours/domain/types.ts` |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-opening-hours-exception` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-implemented-mirror` | generated output or mirrored transitional artifact | this file |
| Migration trigger | completed S-007 foundation implementation | source, migrations, API contract, registry rows, and generated Markdown reconciled | S-007 task breakdown / implementation |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Date-specific override for a Location's normal weekly opening-hours slots. |
| Business purpose | Handles exceptional closures, partial closures, special opening slots, and replacement day schedules without corrupting the recurring weekly baseline. |
| Durable fact boundary | Owning location, exception type, local date or date range, optional local time range, precedence, lifecycle/delete posture, and export behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, effective-hours readers, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct exception types, precedence, validation, effective-hours behavior, tenant/Location boundary, and export posture. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | `organization_opening_hours_exception` |
| Primary key | `organization_opening_hours_exception_id` |
| Stable external key | `organization_opening_hours_exception_id` |
| Versioning model | `mutable-current-record` |
| Current-version pointer | not-applicable |
| Tenant / account boundary field | `tenant_id` derived from owning Location and Organization and stored for isolation/querying |
| Soft-delete field | `deleted_at` |
| Archive field | not recommended for v1 exception UX; remove/delete uses `deleted_at` while audit records preserve change evidence |
| Generated artifact posture | `not-applicable` for source record |
| Migration posture | implemented in `0054_create_location_opening_hours.sql` |

## Capability Inventory

| Capability key | Capability family | Operation | Actor / authority world | Surface | Lifecycle or relationship impact | Evidence / audit expectation | Source artifact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.opening-hours-exception.manage` | `authoring` | create/update/delete exception | root, tenant | UI/API | creates or changes date-specific override under Location | audit create/update/delete; date/time/type validation proof | runtime source; API contracts | Exceptions supersede weekly slots. |
| `organization.opening-hours-exception.read` | `read-discovery` | list/get exceptions | root, tenant | UI/API/search/export | no mutation; scoped to Location and tenant/account | access proof | API contracts | Used by effective-hours reads. |
| `organization.opening-hours-exception.preview-effective-hours` | `read-discovery` | preview effective schedule | root, tenant | UI/API | computes weekly slots plus exceptions | deterministic preview evidence | user refinement 2026-05-15 | Optional but useful before save/publish. |
| `organization.opening-hours-exception.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected source data | export evidence | private export decision | Export follows selected sections. |

## Capability Family Rules

| Capability family | Meaning for Opening Hours Exception | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads exceptions or effective schedules. | The operation inspects exception truth or computed availability. |
| `authoring` | Creates or updates exception details. | The operation changes date-specific availability. |
| `lifecycle` | Deletes/removes exceptions. | The operation changes current exception visibility. |
| `import-export` | Includes exceptions in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_opening_hours_exception_id` | `organization_opening_hours_exception_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | implemented |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship | PRD/API contracts |
| `organization_location_id` | `organization_location_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Location relationship | PRD/API contracts |
| `exception_type` | `exception_type` | `core` | `closed_day`, `closed_time_slot`, `special_opening_slot`, or `replacement_day_schedule` | `single` | yes | no | updateable | exact, facet | exception type selector | user refinement 2026-05-15 |
| `starts_on_local_date` | `starts_on_local_date` | `core` | `DATE` | `single` | yes | no | updateable | range, sort | date input | user refinement 2026-05-15 |
| `ends_on_local_date` | `ends_on_local_date` | `core` | `DATE or NULL` | `single` | no | no | updateable | range, sort | date input | user refinement 2026-05-15 |
| `starts_at_local_time` | `starts_at_local_time` | `core` | `TIME or NULL` | `single` | conditional | no | updateable | range, sort | time input | user refinement 2026-05-15 |
| `ends_at_local_time` | `ends_at_local_time` | `core` | `TIME or NULL` | `single` | conditional | no | updateable | range, sort | time input | user refinement 2026-05-15 |
| `replacement_slots` | `replacement_slots` | `core` | structured weekday-date slot payload or child rows | `multi` | conditional | no | updateable | none in v1 | replacement schedule editor | user refinement 2026-05-15 |
| `reason` | `reason` | `secondary` | `TEXT or NULL` | `single` | no | no | updateable | full-text if approved | optional note | inferred |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `deleted` | `single` | yes | yes | lifecycle-only | exact | status badge | user refinement 2026-05-15 |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Opening Hours Exception | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable exception identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the override record. |
| `core` | Exception type, dates, and time/slot override values. | Exception form and effective-hours preview. | Strong type-specific validation. | The field determines availability. |
| `secondary` | Optional explanation or operational note. | Supporting note field. | Trim and reject empty string where supplied. | The field explains but does not determine behavior. |
| `relationship` | Links exception to Location, Organization, and tenant/account. | Scoped under Location detail. | Foreign-key and authz required. | The field controls ownership. |
| `lifecycle` | Controls current/delete visibility. | Delete/remove controls. | Protected from normal update. | The field changes visibility. |
| `system` | Platform-managed values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current exception that affects effective hours. | normal reads/effective-hours computation | update, delete, export | user refinement 2026-05-15 |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Not recommended as user-facing exception state in v1. | not-applicable | not-applicable unless retained exception history is later approved | user refinement 2026-05-15 |
| `deleted` | Soft-deleted exception. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Exception Type Rules

| Exception type | Meaning | Required date/time fields | Effect over weekly slots | Precedence |
| --- | --- | --- | --- | --- |
| `closed_day` | Location is closed for the whole local date or date range. | start date; optional end date; no times | Suppresses all weekly and special opening slots for affected date(s). | 1 |
| `replacement_day_schedule` | Exception supplies the complete schedule for the date. | start date; optional end date; replacement slots | Replaces weekly baseline for affected date(s). | 2 |
| `closed_time_slot` | Location is closed for part of a local date. | start date; optional end date; start/end local times | Removes availability inside the closed time range. | 3 |
| `special_opening_slot` | Location is open outside normal weekly slots. | start date; optional end date; start/end local times | Adds availability unless a higher-precedence closure applies. | 4 |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `opening-hours-exception.location` | `ownership` | Opening Hours Exception | Organization Location | many-to-one | Must belong to same tenant/account as Location and Organization. | Location lifecycle constrains exception visibility. | Exceptions panel under Location detail. | PRD/API contracts |
| `opening-hours-exception.weekly-slots` | `supersedes` | Opening Hours Exception | Weekly Opening Hours | many-to-many derived by date/time | Exceptions supersede weekly slots for effective-hours computation. | Deleted exceptions stop overriding weekly slots. | effective-hours preview | user refinement 2026-05-15 |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_opening_hours_exception_pkey` | `primary key` | `organization_opening_hours_exception_id` | Stable row identity. | Supports reads and audit. | implemented |
| `fk_opening_hours_exception_location` | `foreign key` | `organization_location_id` | References owning Location. | Keeps exception scoped to location. | PRD |
| `ix_opening_hours_exception_location_dates` | `index` | `organization_location_id`, `starts_on_local_date`, `ends_on_local_date`, `deleted_at` | Location exception lookup index. | Supports effective-hours computation and export. | inferred |
| `ck_opening_hours_exception_type` | `check` | `exception_type` | Must be one of the approved v1 exception types. | Prevents ambiguous override behavior. | user refinement 2026-05-15 |
| `opening_hours_exception_type_shape_rule` | `code-enforced validation` | exception type and date/time fields | Required fields depend on exception type. | Prevents invalid closures or openings. | user refinement 2026-05-15 |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `opening-hours-exception.location.same-tenant` | `tenant_id`, `organization_location_id` | Exception must belong to a Location in the same tenant/account. | shared Organization boundary error. | PRD/API contracts |
| `opening-hours-exception.date-range.valid` | `starts_on_local_date`, `ends_on_local_date` | End date must be absent or on/after start date. | invalid exception error. | user refinement 2026-05-15 |
| `opening-hours-exception.time-range.valid` | `starts_at_local_time`, `ends_at_local_time` | Time ranges must be valid and same-day in v1 where times apply. | invalid exception error. | user refinement 2026-05-15 |
| `opening-hours-exception.type-shape.valid` | `exception_type` plus date/time/replacement fields | Required and forbidden fields are determined by exception type. | invalid exception error. | user refinement 2026-05-15 |
| `opening-hours-exception.precedence.deterministic` | effective-hours computation | Apply precedence: closed day, replacement day schedule, closed time slot, special opening slot. | deterministic conflict resolution. | user refinement 2026-05-15 |
| `opening-hours-exception.recurring-holidays.deferred` | request body | Recurring holiday calendars, seasonal schedules, and external feeds are not accepted in v1. | invalid request error. | user refinement 2026-05-15 |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant visibility index | Required boundary for all reads. | API contracts |
| `organization_location_id` | exact, facet | scalar | location exception index | Scopes exception under Location. | PRD |
| `starts_on_local_date`, `ends_on_local_date` | range, sort | scalar dates | date lookup index | Supports effective-hours computation. | user refinement 2026-05-15 |
| `exception_type` | exact, facet | scalar | type/status index if needed | Supports filtering exception types. | user refinement 2026-05-15 |
| `lifecycle_status`, `deleted_at` | exact, range, sort | scalar | visibility index | Normal reads exclude deleted rows. | AGENTS defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via exception create | type, dates, optional times, replacement slots, reason | stamps IDs, tenant, timestamps, active status | Must validate type shape and effective-hours precedence. | user refinement 2026-05-15 |
| `update` | root/tenant via exception update | approved exception fields | refreshes `updated_at` | Must preserve type-specific validation. | user refinement 2026-05-15 |
| `delete` | root/tenant via exception delete | `deleted_at` | soft-deletes and refreshes `updated_at` | User-facing behavior is remove exception; audit retains evidence. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Deleted exceptions remain soft-deleted for evidence; normal effective-hours reads exclude deleted exceptions. | `organizationOpeningHours` | delete/export | lifecycle failures require audit evidence later. | unit and persistence tests | user refinement 2026-05-15 |
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
| Governing capability | `organization.opening-hours-exception.read` and `organization.opening-hours-exception.manage` | runtime source; API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Exception, Location, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | implemented child resource APIs and effective-hours read | API contracts; runtime source |
| UI required | deferred Location detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | date-ordered exceptions under Location | PRD |
| Detail view treatment | exception detail with effective-hours impact preview | PRD |
| Create/edit treatment | exception type, local date/date range, conditional time/slot controls | user refinement 2026-05-15 |
| Lifecycle action treatment | delete/remove exception confirmation | AGENTS defaults |
| Relationship navigation treatment | reachable from Location under Organization | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant location metadata | PRD |
| Privacy / PII relevance | low by itself, possible sensitivity when tied to operations/location data | data dictionary planning |
| Security relevance | moderate because data is tenant-scoped, operationally meaningful, and exportable | AGENTS tenant defaults |
| Audit relevance | yes for create/update/delete/export and effective-hours changes | PRD/test planning |
| Retention / cleanup posture | soft-delete source posture; no purge approved | PRD |
| Export / deletion posture | private export inclusion; soft-delete source posture | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future validation/authz/effective-hours/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | implemented | unit/security/persistence tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | implemented | unit/persistence tests | Date/type/precedence rules are implemented. |
| Soft-delete and normal-read visibility | yes | implemented | unit/persistence tests | Normal reads exclude deleted rows. |
| Tenant boundary / object-level authorization | yes | implemented | security/persistence tests | Same tenant/account as Location/Organization. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | implemented | persistence/effective-hours tests | Audit sink/schema implemented in `organization_opening_hours_audit_event`. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_OPENING_HOURS_EXCEPTION_INVALID` | opening-hours exception is invalid. | exception fields | invalid type, date range, time range, or type-specific shape | user refinement 2026-05-15 |
| `ORGANIZATION_OPENING_HOURS_EXCEPTION_NOT_FOUND` | opening-hours exception cannot be found. | `organizationOpeningHoursExceptionId` | missing, wrong tenant/account, or not visible | inferred |
| `ORGANIZATION_OPENING_HOURS_EXCEPTION_CONFLICT` | opening-hours exception conflicts with existing exception rules. | date/time fields | conflict cannot be resolved by deterministic precedence or violates type-specific rule | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Opening-hours exception scope, types, and precedence. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
