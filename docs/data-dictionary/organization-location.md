# Organization Location

## Entity Registry Header

| Field | Value |
| --- | --- |
| Entity key | `organization-location` |
| Entity name | Organization Location |
| Dictionary file | `docs/data-dictionary/organization-location.md` |
| Owning feature | planned `organizationLocations` |
| Ownership status | `planned` |
| Current entity status | `draft` |
| Primary authority | `planning-artifact` |
| Primary source table or record | planned `organization_location`, planned `OrganizationLocationRecord` |
| Entity definition lineage | `not-yet-registered` |
| Latest source review date | `2026-05-14` |
| Related PRD / steering / ADR | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` |

## Source Authority And Future Persistence

| Concern | Current posture | Future posture | Source / target |
| --- | --- | --- | --- |
| Current source of truth | planning artifacts and source-independent dictionary entry | implemented source, migrations, and registry-backed dictionary truth | PRD, API contracts, this page |
| Source precedence | Approved PRD/API/data dictionary own planned behavior until implementation exists. | Runtime source and migrations win after implementation; registry rows and generated docs must reconcile. | future `organizationLocations` implementation |
| Runtime persistence owner | planned `organizationLocations` | `organizationLocations` | future `src/features/organizationLocations` |
| Runtime persistence record | planned `organization_location` | `organization_location` table and record type | future migration and persistence files |
| Entity-registry persistence owner | not-yet-registered | `entityBuilder` or approved successor registry | `entityKey = organization-location` |
| Entity-registry persistence record | not yet backed by registry rows | DB-backed lineage, version, attributes, relationships, lifecycle, and retention rows | future registry records |
| Markdown posture | `source-independent-planning` | generated output or mirrored transitional artifact | this file |
| Migration trigger | Organization location persistence task | source, migrations, API contract, registry rows, and generated Markdown reconciled | future task breakdown / blueprint |

## Summary

| Field | Value |
| --- | --- |
| Plain-language description | Place of operation for an Organization. |
| Business purpose | Records many physical or operational locations under one Organization. |
| Durable fact boundary | Owning Organization, tenant/account boundary, location name/address facts, optional geocoordinates, head-office booleans, lifecycle state, and search/export behavior. |
| Primary users / actors | Root admins, tenant admins, Organization-domain services, search/export jobs, and audit reviewers. |
| Rebuild-from-spec value | A future maintainer can reconstruct location ownership, many-per-Organization posture, head-office flags, lifecycle, search, and export rules. |

## Storage Model

| Field | Value |
| --- | --- |
| Primary table or durable record | planned `organization_location` |
| Primary key | `organization_location_id` |
| Stable external key | `organization_location_id` |
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
| `organization.location.create` | `authoring` | create location | root, tenant | UI/API | creates child record under Organization | audit create; boundary proof | PRD; API contracts | An Organization may have many locations. |
| `organization.location.read` | `read-discovery` | list/get locations | root, tenant | UI/API/search/export | no mutation; scoped to Organization and tenant/account | access proof | API contracts | Includes active and retained visibility handling. |
| `organization.location.update` | `authoring` | update location facts | root, tenant | UI/API | refreshes `updated_at` | audit update | API contracts | Head-office flags are descriptive booleans, not uniqueness constraints. |
| `organization.location.archive` | `lifecycle` | archive location | root, tenant | UI/API | follows Organization-domain archive posture | audit archive | PRD | Normal reads exclude archived rows. |
| `organization.location.restore` | `lifecycle` | restore location | root, tenant | UI/API | restores active visibility if parent Organization allows | audit restore | PRD | Must respect Organization lifecycle. |
| `organization.location.export` | `import-export` | include in private export | root, tenant, system | job/export | exports selected source data | export evidence | private export decision | Location data may be sensitive. |

## Capability Family Rules

| Capability family | Meaning for Organization Location | Prefer over another family when |
| --- | --- | --- |
| `read-discovery` | Reads or searches location records. | The operation inspects location truth. |
| `authoring` | Creates or updates location details. | The operation changes location facts. |
| `lifecycle` | Archives, restores, or deletes locations. | The operation changes current visibility. |
| `import-export` | Includes locations in private export bundles. | The boundary is data movement out of the feature. |

## Attribute Inventory

| Attribute key | Stored field / source field | Category | Type / shape | Cardinality | Required? | System-managed? | Mutable? | Search/filter role | Design-system treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization_location_id` | `organization_location_id` | `identity` | `UUID` | `single` | yes | yes | immutable | exact | hidden system identity | planned |
| `tenant_id` | `tenant_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | hidden authority field | PRD/API contracts |
| `organization_id` | `organization_id` | `relationship` | `UUID` | `single` | yes | yes | immutable | exact, facet | Organization relationship panel | PRD/API contracts |
| `location_name` | planned location name field | `core` | `TEXT` | `single` | yes | no | updateable | prefix, full-text | primary title field | inferred from location purpose |
| `address_summary` | planned address field group | `core` | `TEXT or structured address fields` | `single` | optional | no | updateable | prefix, full-text | address block | inferred from location purpose |
| `latitude` | planned latitude field | `secondary` | `DECIMAL or DOUBLE PRECISION` | `single` | no | no | updateable | range, geo | coordinate input/map pin | user refinement 2026-05-14 |
| `longitude` | planned longitude field | `secondary` | `DECIMAL or DOUBLE PRECISION` | `single` | no | no | updateable | range, geo | coordinate input/map pin | user refinement 2026-05-14 |
| `is_head_office` | planned head-office flag | `secondary` | `BOOLEAN` | `single` | yes | no | updateable | exact, facet | boolean toggle | PRD Location |
| `is_registered_office` | planned office flag | `secondary` | `BOOLEAN` | `single` | yes | no | updateable | exact, facet | boolean toggle | inferred |
| `lifecycle_status` | `lifecycle_status` | `lifecycle` | `active` or `archived` | `single` | yes | yes | lifecycle-only | exact | status badge | PRD Location |
| `archived_at` | `archived_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | lifecycle metadata | AGENTS defaults |
| `deleted_at` | `deleted_at` | `lifecycle` | `TIMESTAMPTZ or NULL` | `single` | no | yes | lifecycle-only | range, sort | deleted metadata | AGENTS defaults |
| `created_at` | `created_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |
| `updated_at` | `updated_at` | `system` | `TIMESTAMPTZ` | `single` | yes | yes | system-only | range, sort | metadata timestamp | AGENTS defaults |

## Attribute Category Rules

| Category | Meaning for Organization Location | Default UI treatment | Default API / schema treatment | Prefer over another category when |
| --- | --- | --- | --- | --- |
| `identity` | Stable location identity. | Hidden or read-only metadata. | System-generated and immutable. | The value identifies the child record. |
| `core` | Main location details. | Primary location form/detail area. | Validated and included in search/export. | The field describes the location. |
| `secondary` | Supporting descriptive flags. | Secondary fields or toggles. | Validated but not uniqueness-defining. | The field helps classify location behavior without owning identity. |
| `relationship` | Links location to Organization and tenant/account. | Scoped under Organization detail. | Foreign-key and authz required. | The field controls ownership. |
| `lifecycle` | Controls current/archive/delete visibility. | Status badge and lifecycle controls. | Protected from normal update. | The field changes visibility. |
| `system` | Platform-managed values. | Read-only metadata. | Clients must not supply. | The platform owns the value. |

## Status And Lifecycle Model

| Status | Meaning for this entity | Normal visibility | Allowed next actions | Source |
| --- | --- | --- | --- | --- |
| `draft` | Planning status before implementation. | docs/planning only | implementation planning | this page |
| `active` | Current location. | normal reads | update, archive, export | PRD Location |
| `superseded` | Not a named v1 runtime state. | not-applicable | not-applicable unless versioning is approved | this page |
| `archived` | Retained location removed from current views. | explicit retained reads/export only | restore, delete where approved | PRD Location |
| `deleted` | Soft-deleted location. | explicit deleted reads only | restore or purge only if later approved | AGENTS defaults |

## Relationship Inventory

| Relationship key | Relationship type | Source entity | Target entity | Cardinality | Ownership / authority rule | Lifecycle impact | UX treatment | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization-location.organization` | `ownership` | Organization Location | Organization | many-to-one | Must belong to same tenant/account as Organization. | Organization lifecycle constrains location operations. | Location area under Organization detail. | PRD/API contracts |
| `organization-location.weekly-hours` | `child` | Organization Location | Weekly Opening Hours | one-to-many | Hours belong to a location in same tenant/account. | Location archive/delete constrains hours visibility. | Weekly-hours panel under location. | PRD Weekly Opening Hours |

## Indexes And Constraints

| Name | Type | Field(s) | Definition / rule | Why it matters | Source |
| --- | --- | --- | --- | --- | --- |
| `organization_location_pkey` | `primary key` | `organization_location_id` | Stable row identity. | Supports reads and audit. | planned |
| `fk_organization_location_organization` | `foreign key` | `organization_id` | References owning Organization. | Keeps location scoped to Organization. | PRD |
| `ix_organization_location_tenant` | `index` | `tenant_id`, `lifecycle_status`, `deleted_at` | Tenant/account visibility index. | Supports secure list/search/export. | inferred |
| `ix_organization_location_organization` | `index` | `organization_id`, `lifecycle_status`, `deleted_at` | Organization child list index. | Supports detail view and export. | inferred |

## Normalization And Validation Rules

| Rule key | Field(s) | Rule | Failure behavior / error | Source |
| --- | --- | --- | --- | --- |
| `location.organization.same-tenant` | `tenant_id`, `organization_id` | Location must belong to an Organization in the same tenant/account. | shared Organization boundary error. | PRD/API contracts |
| `location.coordinates.optional-pair` | `latitude`, `longitude` | Geocoordinates are optional; if supplied, latitude and longitude should be supplied together. | invalid geocoordinates error. | user refinement 2026-05-14 |
| `location.coordinates.range` | `latitude`, `longitude` | Latitude must be between -90 and 90; longitude must be between -180 and 180. | invalid geocoordinates error. | geocoordinate standard practice |
| `location.head-office.not-unique` | `is_head_office` | Head-office flags are descriptive booleans and do not require uniqueness. | no duplicate-head-office error should be created by default. | PRD Location |
| `location.system-fields` | identifiers, timestamps, lifecycle fields | Clients cannot override system-managed fields. | invalid request error. | AGENTS defaults |

## Search, Filter, And Sort Model

| Field | Operator(s) | Storage model | Index posture | Default sort / visibility impact | Source |
| --- | --- | --- | --- | --- | --- |
| `tenant_id` | exact, facet | scalar | tenant visibility index | Required boundary for all reads. | API contracts |
| `organization_id` | exact, facet | scalar | Organization child index | Scopes location under Organization. | API contracts |
| `location_name`, `address_summary` | prefix, full-text | scalar or structured address fields | planned text/search index | Supports grouped Organization search. | PRD Search Requirements |
| `latitude`, `longitude` | range, geo | scalar coordinate fields | planned geo/range index only if map/radius search is approved | Supports map display and future geo search without making geo search mandatory in v1. | user refinement 2026-05-14 |
| `is_head_office`, `is_registered_office` | exact, facet | scalar booleans | planned filter index if needed | Descriptive filters only. | PRD Location |
| `lifecycle_status`, `deleted_at` | exact, range, sort | scalar | visibility index | Normal reads exclude archived/deleted rows. | AGENTS defaults |

## Mutation Semantics

| Mutation | Actor / capability | Fields changed | System-managed effects | Compatibility notes | Source |
| --- | --- | --- | --- | --- | --- |
| `create` | root/tenant via location create | location fields | stamps IDs, tenant, timestamps, active status | Must validate owning Organization. | PRD/API contracts |
| `update` | root/tenant via location update | approved location fields including optional geocoordinates | refreshes `updated_at` | Head-office flags are not uniqueness constraints; geocoordinates are optional. | PRD; user refinement 2026-05-14 |
| `archive` | root/tenant via location archive | lifecycle fields | sets archived state and timestamp | Follows Organization-domain lifecycle. | PRD |
| `restore` | root/tenant via location restore | lifecycle fields | clears archive fields | Must respect Organization lifecycle. | PRD |
| `delete` | root/tenant via explicit delete | `deleted_at` | soft-deletes and refreshes `updated_at` | Hard purge not approved here. | AGENTS defaults |

## Retention, Cleanup, Export, And Legal Hold

| Concern | Policy | Owner | Trigger | Failure / retry posture | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Retention | Archived locations remain retained. | `organizationLocations` | archive/export | lifecycle failures require audit evidence later. | future tests | PRD |
| Cleanup | No source cleanup job approved in planning slice. | `organizationLocations` | not-applicable | not-applicable until approved. | this page | this page |
| Export | Included in private Organization exports when selected and authorized. | `organizationExports` reads via location seam | export request | export failures recorded by export job. | private export decision | asset decision |
| Delete / purge | Soft delete only in this planning page. | `organizationLocations` | explicit delete | failure evidence required later. | future tests | AGENTS defaults |
| Legal hold | Persistent source data may be held; generated export copies follow export-copy policy. | future compliance owner | hold placement | cleanup must not remove held source data. | future runbook | Organization decisions |

## Authorization And Tenant Boundary

| Concern | Rule | Source |
| --- | --- | --- |
| Authority world | root or tenant | API contracts |
| Tenant context required | yes | AGENTS tenant defaults |
| Tenant context source | root route `tenantId`; tenant-admin server-side current tenant/account | API contracts |
| Governing capability | planned Organization location capabilities | API contracts |
| Cross-tenant posture | deny-by-default | AGENTS tenant defaults |
| Object-level rule | Location, Organization, and tenant/account must match. | PRD/API contracts |

## API, UI, And Design-System Posture

| Concern | Posture | Source |
| --- | --- | --- |
| API required | planned child resource APIs | API contracts |
| UI required | planned Organization detail child area | PRD |
| Default entity-management preset | not-yet-defined | entity registry discovery |
| List view treatment | scoped under Organization with active/retained filtering | PRD/API contracts |
| Detail view treatment | location detail plus weekly hours panel | PRD |
| Create/edit treatment | governed form with head-office booleans and address fields | PRD |
| Lifecycle action treatment | archive/restore/delete confirmations | AGENTS defaults |
| Relationship navigation treatment | reachable from Organization detail; hours reachable from Location detail | PRD |

## Compliance Classification And Governance

| Concern | Classification / rule | Source |
| --- | --- | --- |
| Data classification | confidential tenant location metadata | PRD |
| Privacy / PII relevance | possible when address data identifies people or sensitive operations | data dictionary planning |
| Security relevance | moderate because location data is tenant-scoped and exportable | AGENTS tenant defaults |
| Audit relevance | yes for create/update/archive/restore/delete/export | PRD/test planning |
| Retention / cleanup posture | retained when archived; no purge approved | PRD |
| Export / deletion posture | private export inclusion; soft-delete source posture | private export decision |
| Legal hold posture | source records may be held; export copies not extended by hold in v1 | Organization decisions |
| Operational evidence requirements | `npm run data:compliance-health`; future persistence/authz/export tests | this page |

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | this page; PRD | Planned durable child record. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | planned | future implementation tests | IDs/timestamps/lifecycle fields system-managed. |
| Normalization, uniqueness, and searchable-storage rules | yes | planned | PRD/API contracts | Exact address schema still needs implementation detail. |
| Soft-delete and normal-read visibility | yes | planned | future tests | Normal reads exclude archived/deleted rows. |
| Tenant boundary / object-level authorization | yes | planned | future authz tests | Same tenant/account as Organization. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | documented-not-enforced | this page; export decision | Source retention/runbook not implemented. |
| Auditability and operational evidence | yes | planned | future audit tests | Audit sink/schema not defined here. |

## Related Errors

| Error code | Message | Field / object | Reason | Source |
| --- | --- | --- | --- | --- |
| `ORGANIZATION_LOCATION_NOT_FOUND` | location cannot be found for the authorized context. | `organizationLocationId` | missing, wrong tenant/account, or not visible | inferred |
| `ORGANIZATION_LOCATION_INVALID_REQUEST` | location request is invalid. | varies | invalid field, invalid lifecycle, or wrong Organization boundary | inferred |

## Source And Evidence Links

| Source type | Path / reference | What it proves |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Location scope and head-office flag posture. |
| API contract | `docs/api-contracts/organization-root-admin.md` | Child route posture and errors. |
| API contract | `docs/api-contracts/organization-tenant-admin.md` | Tenant-admin child route posture. |
| standard | `docs/standards/data-dictionary-registry-migration-map.md` | Markdown-to-registry migration mapping. |
