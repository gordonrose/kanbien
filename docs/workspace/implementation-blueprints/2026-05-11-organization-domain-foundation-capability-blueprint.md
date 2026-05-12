# Organization Domain Foundation Capability Blueprint

## Summary

- Feature set:
  Organization domain foundation.
- Capability:
  Official tenant-scoped organization record accounts for core organization
  identity, legal details, locations, opening hours, structure levels, business
  units, memberships, integrations, and branding references.
- Scope:
  Draft capability blueprint for a multi-feature Organization domain slice.
  This is not an implementation-ready blueprint because a PRD, capability
  matrix, API contract, data dictionary set, and PRD-derived test cases do not
  yet exist.
- Phase:
  planning draft; no source files or migrations are approved by this document
  alone.

## Inputs

- Capability matrix reference:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Capability matrix notes:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft-notes.md`
- User decisions captured on 2026-05-11:
  - one tenant may have multiple organizations
  - organization lifecycle applies per organization and is distinct from sibling
    organizations under the same tenant
  - organization behavior inherits baseline tenant disabled/deleted behavior
  - root-admin and tenant-admin authorization need separate capability
    variants; root authorization is not tenant-bound, while tenant-admin
    authorization is bound to exactly one current tenant context
  - domain/model/activity reference catalogues are part of this slice
  - branding is separate per organization and covers logo types plus primary
    color hex
  - integrations can begin as official organization records
  - root admins have full access
  - tenant admins have full access to non-system entity capabilities
  - use industry best-practice recommendations where product details are not
    yet settled
- Related architecture:
  - `docs/architecture/system-overview.md`
  - `docs/architecture/priniciples.md`
  - `docs/architecture/adr/0002-use-feature-bundle-architecture.md`
  - `docs/architecture/adr/0003-use-explicit-feature-registration-at-the-platform-router.md`
  - `docs/architecture/adr/0004-use-feature-scoped-sql-migrations-with-shared-runner.md`
  - `docs/architecture/adr/0006-standardize-feature-internal-module-conventions.md`
  - `docs/architecture/adr/0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`
  - `docs/architecture/adr/0008-standardize-searchable-field-storage-and-query-rules.md`
  - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
  - `docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
  - `docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md`
  - `docs/architecture/adr/0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`
  - `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
  - `docs/architecture/adr/0035-adopt-object-storage-backed-asset-foundation.md`
  - `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`
  - `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
  - `docs/architecture/adr/0041-adopt-context-account-architecture-for-discovery-intelligence.md`
- Enduring decision areas with no existing ADR found:
  - domain metadata versus domain-prefixed feature folders
  - Organization domain service-extraction readiness classification
  - organization-level branding token and logo-type governance
  - platform-wide reference catalogue ownership for domain/model/activity
  - tenant-admin full access to non-system organization capabilities
- New ADR required:
  required before implementation if this slice changes feature folder naming,
  adopts domain manifest schema changes, or declares Organization as an
  extractable service boundary. Not required for PRD/capability-matrix drafting.
- ADR conflict / stale guidance:
  none found for this planning draft. Existing ADRs favor flat feature bundles,
  explicit manifests, public seams, and generated dependency graph validation.

## Architecture Posture

Use a domain-grouped feature set, not one broad `organization` feature.

Recommended initial source layout keeps the repo's current flat feature model:

```text
src/features/
  organizationCore/
  organizationLegalDetails/
  organizationLocations/
  locationOpeningHours/
  organizationUnitLevels/
  businessUnits/
  businessUnitMemberships/
  organizationIntegrations/
  organizationBrandingReferences/
  organizationReferenceCatalogues/
```

Each feature keeps its own:

```text
contract/
domain/
persistence/
transport/
integration.ts
index.ts
feature.manifest.json
```

The `organization` domain is a grouping, navigation, and future service
boundary concept. It must not become a god-feature that owns billing,
compliance, data governance, tenant lifecycle, discovery inference, or role
authorization.

Recommended feature-manifest metadata for implementation planning:

```json
{
  "schemaVersion": 2,
  "featureName": "organizationCore",
  "domain": {
    "domainKey": "organization",
    "domainRole": "record-account",
    "navigationGroup": "organization"
  },
  "runtimeBoundary": {
    "current": "inProcessFeature",
    "candidate": "extractableService",
    "serviceDomain": "organization",
    "extractionReadiness": "planned"
  }
}
```

Manifest schema v2 and dependency-graph output changes should be planned before
implementation if domain metadata is adopted.

## Ownership Rules

- `organizationCore` owns official organization identity, relationship type,
  domain/model classification, and per-organization lifecycle.
- `organizationLegalDetails` owns legal identifiers and registered-address
  references.
- `organizationLocations` owns official organization locations.
- `locationOpeningHours` owns repeatable opening-hour slots for locations.
- `organizationUnitLevels` owns tenant-defined hierarchy labels for one
  organization.
- `businessUnits` owns official business-unit nodes.
- `businessUnitMemberships` owns business-unit membership records linked to
  users, roles, or later actor records.
- `organizationIntegrations` owns official organization integration records.
- `organizationBrandingReferences` owns per-organization branding choices and
  asset references only if branding is not assigned to a future branding/config
  feature.
- `organizationReferenceCatalogues` owns system reference catalogues for
  domain, model type, and activity if no platform reference-catalogue feature is
  introduced first.

Out of scope for this slice:

- bank accounts, which should route to finance/billing with encryption,
  masking, audit, and stronger access control
- pricing model, support tier, service tier, and entitlements, which should
  route to commercial/entitlement ownership
- tenant lifecycle state, which remains tenant-owned; organization lifecycle
  inherits tenant disabled/deleted baselines
- compliance assessments, which should route to a compliance feature/layer
- data sensitivity and clearance, which should route to platform data
  governance
- Product Discovery inference, which belongs to Discovery Chat or future
  Discovery Intelligence under Context Account Architecture

## Entity And Capability Blueprint

### organizationCore

Entity:

```text
organization {
  organizationId
  tenantId
  name
  legalName?
  organizationPrefix?
  relationshipType: client | partner | distributor
  domainId?
  modelTypeId?
  lifecycleState
  createdAt
  updatedAt
  deletedAt?
}
```

Recommended lifecycle states:

```text
active
inactive
archived
pendingReview
```

Tenant baseline rule:
if the owning tenant is disabled, deleted, or otherwise unavailable, normal
organization reads and mutations must deny or return only explicitly approved
support/admin projections.

Capabilities:

- `createOrganization`
- `listOrganizations`
- `readOrganization`
- `updateOrganization`
- `archiveOrganization`
- `reactivateOrganization`
- `readOrganizationSummaryForDiscovery`
- `readOrganizationSummaryForInspector`

Recommended notes:

- one tenant may own multiple organizations
- organization names should be searchable by normalized text
- `organizationPrefix` should be optional and unique per tenant only if a
  stable business need is approved
- `domainId` and `modelTypeId` should reference system catalogues and should
  not be free text in the organization row

### organizationLegalDetails

Entity:

```text
organizationLegalDetails {
  organizationLegalDetailsId
  tenantId
  organizationId
  companyNumber?
  registeredAddressId?
  vatNumber?
  taxIdentifier?
  jurisdictionCountry?
  createdAt
  updatedAt
  deletedAt?
}
```

Capabilities:

- `createOrganizationLegalDetails`
- `readOrganizationLegalDetails`
- `updateOrganizationLegalDetails`
- `archiveOrganizationLegalDetails`
- `reactivateOrganizationLegalDetails`

Recommended notes:

- allow at most one active legal-details record per organization unless a
  future versioned legal-profile model is approved
- use an address reference instead of embedding raw address fields if the repo
  adopts a shared address record later
- do not include bank account fields in this feature

### organizationLocations

Entity:

```text
organizationLocation {
  organizationLocationId
  tenantId
  organizationId
  type
  name
  addressId?
  geoCoordinates?
  region?
  country
  timezone
  isGlobalHeadOffice
  isRegionalHeadOffice
  isNationalHeadOffice
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Recommended location types:

```text
administrative
operational
production
sales
support
warehouse
training
other
```

Capabilities:

- `createOrganizationLocation`
- `listOrganizationLocations`
- `readOrganizationLocation`
- `updateOrganizationLocation`
- `archiveOrganizationLocation`
- `reactivateOrganizationLocation`
- `readOrganizationLocationsForDiscovery`
- `readOrganizationLocationsForInspector`

Recommended notes:

- location `country` and `timezone` should be explicit and queryable
- headquarters booleans should have uniqueness rules per organization where
  product policy requires only one global/regional/national head office
- `geoCoordinates` require a storage/operator decision before search-at-scale
  behavior is promised

### locationOpeningHours

Entity:

```text
locationOpeningHours {
  locationOpeningHoursId
  tenantId
  organizationLocationId
  timezone
  weekday
  slotIndex
  startTime
  endTime
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Capabilities:

- `createLocationOpeningHours`
- `listLocationOpeningHours`
- `readLocationOpeningHours`
- `updateLocationOpeningHours`
- `archiveLocationOpeningHours`
- `reactivateLocationOpeningHours`

Recommended notes:

- separate rows support multiple daily slots
- special closures, holiday calendars, and seasonal hours are out of scope for
  v1 unless product discovery makes them packet-blocking

### organizationUnitLevels

Entity:

```text
organizationUnitLevel {
  organizationUnitLevelId
  tenantId
  organizationId
  levelNumber
  name
  exampleLabel?
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Capabilities:

- `createOrganizationUnitLevel`
- `listOrganizationUnitLevels`
- `readOrganizationUnitLevel`
- `updateOrganizationUnitLevel`
- `archiveOrganizationUnitLevel`
- `reactivateOrganizationUnitLevel`

Recommended notes:

- enforce unique active `levelNumber` per organization
- allow tenants to use their own hierarchy language without changing system
  terms
- changes to active levels used by business units need compatibility rules

### businessUnits

Entity:

```text
businessUnit {
  businessUnitId
  tenantId
  organizationId
  name
  unitLevelId
  description?
  parentUnitId?
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Capabilities:

- `createBusinessUnit`
- `listBusinessUnits`
- `readBusinessUnit`
- `updateBusinessUnit`
- `archiveBusinessUnit`
- `reactivateBusinessUnit`
- `readBusinessUnitsForDiscovery`
- `readBusinessUnitsForInspector`

Recommended notes:

- parent unit must belong to the same tenant and organization
- prevent parent cycles
- unit level should be compatible with parent depth where level semantics are
  enforced
- deleting or archiving a parent with active children should be blocked or
  require an approved cascade policy

### businessUnitMemberships

Entity:

```text
businessUnitMembership {
  businessUnitMembershipId
  tenantId
  businessUnitId
  userId?
  roleId?
  membershipType
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Recommended membership types:

```text
owner
member
manager
approver
observer
```

Capabilities:

- `createBusinessUnitMembership`
- `listBusinessUnitMemberships`
- `readBusinessUnitMembership`
- `updateBusinessUnitMembership`
- `archiveBusinessUnitMembership`
- `reactivateBusinessUnitMembership`

Recommended notes:

- membership should support user-linked and role-linked assignments but must
  not bypass existing role/authz ownership
- exact target actor modeling should be reconciled with existing and future
  tenant-auth/role architecture
- do not embed arrays of owners or members in `businessUnit`

### organizationIntegrations

Entity:

```text
organizationIntegration {
  organizationIntegrationId
  tenantId
  organizationId
  name
  purpose
  integrationType
  ownerBusinessUnitId?
  dataSensitivityLevelId?
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Recommended integration types:

```text
api
fileImport
fileExport
webhook
manual
other
```

Capabilities:

- `createOrganizationIntegration`
- `listOrganizationIntegrations`
- `readOrganizationIntegration`
- `updateOrganizationIntegration`
- `archiveOrganizationIntegration`
- `reactivateOrganizationIntegration`
- `readOrganizationIntegrationsForDiscovery`

Recommended notes:

- store official integration metadata, not raw credentials
- raw API samples, file examples, payload bodies, secrets, and schemas need
  separate asset/data-governance handling before storage
- `dataSensitivityLevelId` should reference platform data-governance catalogue
  if available; otherwise keep the field planned, not implemented

### organizationBrandingReferences

Entity:

```text
organizationBrandingReference {
  organizationBrandingReferenceId
  tenantId
  organizationId
  logoPrimaryAssetId?
  logoSecondaryAssetId?
  logoIconAssetId?
  logoMonochromeAssetId?
  primaryColorHex?
  status
  createdAt
  updatedAt
  deletedAt?
}
```

Capabilities:

- `createOrganizationBrandingReference`
- `readOrganizationBrandingReference`
- `updateOrganizationBrandingReference`
- `archiveOrganizationBrandingReference`
- `reactivateOrganizationBrandingReference`

Recommended notes:

- logo asset references must use the `assets` feature public seam and an
  approved asset consumer decision record before upload/read behavior exists
- `primaryColorHex` must be validated and mapped through approved
  design-system token/seam rules before real app rendering
- do not store arbitrary CSS, fonts, or ungoverned theme blobs
- reconcile with existing tenant branding/config work before implementation

### organizationReferenceCatalogues

Entities:

```text
domainCatalogue {
  domainId
  key
  name
  description
  status
}

modelTypeCatalogue {
  modelTypeId
  key
  name
  description
  status
}

activityCatalogue {
  activityId
  key
  name
  description
  domainId?
  status
}
```

Recommended model type keys:

```text
b2b
b2c
b2b2c
marketplace
publicSector
nonProfit
internalOperations
```

Capabilities:

- `listDomainCatalogue`
- `readDomainCatalogueEntry`
- `listModelTypeCatalogue`
- `readModelTypeCatalogueEntry`
- `listActivityCatalogue`
- `readActivityCatalogueEntry`

Recommended notes:

- reference catalogue mutation should be system/root-only and probably out of
  v1 unless catalogue-admin requirements are approved
- Discovery Chat may read catalogue values but must store tenant-specific
  operational reality as inference, not by changing system catalogue rows

## Authorization Plan

Required posture:

- root admins have full access to Organization domain capabilities
- root-admin authorization is root-scoped and not bound to a current tenant
  session; root-admin list views may span tenants and must support tenant
  filters where cross-tenant result sets are possible
- tenant admins have full access to non-system Organization domain entity
  capabilities within their current tenant context
- tenant-admin authorization is tenant-scoped and must evaluate exactly one
  current tenant context per request
- system catalogue mutation remains root/system-only
- tenant admins may read system catalogue values needed to operate organization
  records
- tenant admins must not access sibling tenant data
- route params, session context, or explicit server-side selected tenant
  context own tenant scope; request bodies must not grant tenant authority

Candidate root authz keys:

```text
organization.root.organization.manage
organization.root.organization.read
organization.root.legalDetails.manage
organization.root.locations.manage
organization.root.unitLevels.manage
organization.root.businessUnits.manage
organization.root.integrations.manage
organization.root.branding.manage
organization.root.catalogue.read
organization.root.catalogue.manage
```

Candidate tenant capability keys:

```text
organization.tenant.organization.manage
organization.tenant.organization.read
organization.tenant.legalDetails.manage
organization.tenant.locations.manage
organization.tenant.unitLevels.manage
organization.tenant.businessUnits.manage
organization.tenant.integrations.manage
organization.tenant.branding.manage
organization.tenant.catalogue.read
```

Final names must be reconciled with the platform authorization model and
permission mapping artifacts before implementation.

## API And Route Shape

Recommended route posture:

- root-admin routes use root authorization and are not bound to a current
  tenant. Root list routes may span tenants and expose explicit tenant filters.
  Exact or child routes should still use stable route params for target tenant
  and organization when the operation is against one tenant-owned record:
  `/v1/root-admin/organizations`,
  `/v1/root-admin/tenants/:tenantId/organizations/...`
- future tenant-admin routes act within exactly one current tenant context:
  `/v1/organization/...` or a future tenant-side route family selected by the
  tenant-auth architecture
- exact `tenantId`, `organizationId`, and child ids are required route params
- list routes follow repo pagination defaults
- create/update bodies reject system-managed fields and body-supplied tenant
  authority
- root and tenant variants should be represented separately in API contracts,
  permission mappings, and tests whenever result scope, route shape, audit, or
  denial behavior differs

Representative root-admin routes:

```text
GET /v1/root-admin/organizations
POST /v1/root-admin/tenants/:tenantId/organizations
GET /v1/root-admin/tenants/:tenantId/organizations
GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId
PATCH /v1/root-admin/tenants/:tenantId/organizations/:organizationId
POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/archive
POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/reactivate
```

Child features should follow the same explicit tenant and organization route
shape unless a Technical Steering packet approves a different route family.

## List And Filter Plan

Every Organization domain entity needs a first-class list/read capability and a
root-admin list view with full filters. The list model should match the
root-users posture: searchable, paginated, lifecycle-aware, filterable by
entity-specific typed attributes, and backed by explicit indexes rather than
browser-only filtering.

Root-admin list views:

- may span tenants when the route is root-scoped
- must include tenant filtering for tenant-owned records
- should include organization filtering for child records
- must support lifecycle/status filtering
- should support normalized text search for labels such as name, key, prefix,
  purpose, or description where the entity has such fields
- should support entity-specific attribute-type filters, such as relationship
  type, domain, model type, location type, country, timezone, unit level,
  membership type, integration type, owner business unit, data sensitivity,
  logo type/presence, and primary-color presence
- should support deterministic sort fields and order direction

Tenant-admin list views:

- are constrained to the current tenant server-side
- must not accept body-supplied tenant authority
- should expose the same entity-specific filters minus root-only cross-tenant
  tenant selection

The PRD and API contracts should make each list route's supported filters,
operators, indexes, default sort, and page-size behavior explicit before
implementation.

## Persistence Plan

Each feature owns its own migration files under its own feature folder. If the
domain is later extracted into an Organization service, these tables become the
natural data boundary.

Baseline persistence rules:

- every table includes generated id, `tenant_id`, lifecycle timestamps, and
  soft-delete posture unless explicitly not applicable
- child records include both `tenant_id` and parent foreign keys so tenant
  filters remain direct and indexable
- tenant and organization ids in child records must agree with parent records
- active uniqueness should be expressed through partial indexes where needed
- normal reads exclude soft-deleted rows
- archived/deleted tenant baseline behavior overrides normal organization
  behavior

Recommended indexes:

- `organizations(tenant_id, updated_at DESC)`
- active organization name search/index by normalized name
- child tables indexed by `(tenant_id, organization_id, updated_at DESC)`
- business units indexed by `(tenant_id, organization_id, parent_unit_id)`
- memberships indexed by `(tenant_id, business_unit_id)` and target actor/role
  fields when those are approved
- integrations indexed by `(tenant_id, organization_id, integration_type)`

## Cross-Feature Seams

Required public seams:

- `tenants`:
  validate tenant existence, lifecycle, and visibility
- `tenantAuth` / future tenant authorization:
  current tenant context for tenant-admin routes
- `rootAuth` / `rootRoles` / platform authz:
  root session and root-admin authorization
- `assets`:
  logo asset validation/linking if branding references include uploaded logos
- `tenantBranding` or future branding/config feature:
  reconcile whether organization branding belongs here or in a branding owner
- future data-governance feature:
  data sensitivity levels for integrations and field-level classification
- future Discovery Intelligence:
  read-only summary seams for Product Discovery and Build inspector

The Organization domain features must not import another feature's private
`persistence`, `domain`, or `transport` files.

## Capability Contract Catalog Plan

Implementation should materialize these capabilities into
`capabilityContractCatalog` once route contracts exist.

Required source coverage:

- feature contract schemas/types
- API contract docs
- permission mappings
- feature manifests
- source references for generated catalogue rows

The Build inspector should later show Organization capabilities grouped by
domain and overlay categories without duplicating official capability records.

## Build Inspector And Product Discovery Usage

The Build inspector should expose read-only Organization domain context before
Discovery Intelligence mutates or infers anything from it.

Inspector surfaces:

- Organizations list for selected tenant
- Organization detail summary
- Legal details
- Locations and opening hours
- Unit levels
- Business units and memberships
- Integrations
- Branding reference
- Reference catalogue values
- Public-seam status and capability catalogue coverage

Product Discovery should read these official records only through approved
public seams and should create separate Organization inference when it detects
operational reality, informal terminology, compliance strain, integration
workarounds, or environment constraints.

## Frontend Plan

No root-admin UI implementation is approved by this blueprint.

Future UI should be planned through design-system governance before app
adoption. Expected surfaces:

- Organization domain list/detail pages under root-admin Build or an
  Organization management area
- tenant selector for root-admin inspection and management
- dense tables with filters/search
- detail pages or governed drawers for child records
- read-only Build inspector views for record-account verification

Do not add app-page CSS or local component copies for governed UI.

## Async Job Processing Decision Gate

The baseline CRUD/read capabilities do not require async job processing.

Async work may be needed later for:

- importing organization structures
- validating integrations
- processing logo assets
- syncing external organization systems
- bulk membership updates

Those workflows are out of scope for the foundation slice and must receive
separate lifecycle, idempotency, retry, audit, and cleanup planning before
implementation.

## Verification Plan

Unit tests:

- validation rejects client-supplied ids, timestamps, tenant authority, and
  system-managed lifecycle fields
- lifecycle transitions for archive/reactivate
- tenant/organization parent-child consistency
- normalized active uniqueness where approved

Integration tests:

- create/list/read/update/archive/reactivate flows for each feature
- child records cannot cross tenant or organization boundaries
- organization lifecycle inherits tenant disabled/deleted baselines
- public seams return discovery/inspector summaries without private persistence
  reach-through

Security tests:

- root admins can access all Organization domain capabilities
- tenant admins can access only non-system capabilities in their current tenant
- tenant admins cannot access sibling tenant data
- system catalogue mutation, if implemented, remains root/system-only

Audit tests:

- creates, updates, archive/reactivate, membership changes, integration changes,
  and branding-reference changes emit audit-visible evidence where policy
  requires

Persistence tests:

- migrations create expected tables, indexes, constraints, and active
  uniqueness rules
- soft-deleted rows are excluded from normal reads
- parent deletion/archive edge cases are handled honestly

Compatibility tests:

- capability catalog materialization reflects implemented route contracts
- dependency graph passes with declared public seams and dependencies

## Documentation Plan

Required before implementation:

- Product Discovery packet for Organization domain foundation
- Technical Steering packet
- capability matrix
- PRD
- PRD-derived test cases
- API contract docs
- data dictionary pages for each entity
- permission mapping updates
- feature docs for each feature
- feature manifests with domain/runtime-boundary metadata if schema v2 is
  adopted
- generated feature dependency graph updates after implementation
- capability contract catalog source registry/materialization updates after
  route contracts exist
- asset consumer decision record if logo upload/read behavior is implemented
- design-system artifacts before root-admin UI adoption

Maintained-artifact sweep should include:

- `docs/architecture/system-overview.md`
- `docs/architecture/generated/feature-dependency-graph.*`
- `docs/data-dictionary/index.md`
- `docs/api-contracts/`
- `docs/postman/` if maintained for new route families
- `docs/swagger/openapi.yaml` if maintained for the route family
- existing tenant, tenant-auth, tenant-configuration, asset, and discovery
  intelligence planning docs whose current-state wording changes

## Open Decisions

- Final feature names:
  `organizationCore` versus `organizations`; plural naming may better match
  existing `tenants`, while `organizationCore` makes domain grouping explicit.
- Domain manifest metadata:
  whether to adopt schema v2 before this slice or keep domain grouping in docs
  until tooling is ready.
- Route family:
  whether Organization management belongs under root-admin tenant routes only
  in v1 or also exposes tenant-admin routes immediately.
- Address model:
  shared address record versus feature-local address references.
- Branding owner:
  organization branding reference feature versus existing/future
  tenant-branding/config ownership.
- Data sensitivity:
  whether a platform data-governance catalogue exists before integration
  sensitivity fields are implemented.
- Activity catalogue:
  whether it belongs in `organizationReferenceCatalogues` or a broader platform
  reference-catalogue feature.
- Membership target:
  exact relationship between `userId`, tenant principals, tenant admins,
  future actors, and role ids.

## Completion Guardrails

This blueprint must not be treated as implementation-ready until the required
PRD, capability matrix, API contracts, data dictionaries, permission mappings,
and PRD-derived test cases exist.

Implementation must stop if it would:

- collapse these features into one broad domain service file
- mutate tenant lifecycle from Organization features
- store bank account data as normal organization fields
- store arbitrary CSS or bypass design-system rules for branding
- store secrets, payload samples, or sensitive integration data without data
  governance approval
- bypass tenant context or infer tenant authority from request bodies
- let Discovery Intelligence mutate official organization records directly
- add frontend UI without design-system governance
