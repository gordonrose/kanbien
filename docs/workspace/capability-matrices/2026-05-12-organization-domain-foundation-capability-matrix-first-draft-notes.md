# Organization Domain Foundation Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv](2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv)

## Current Posture

This is now the source-backed S-000 refresh of the first-draft capability
matrix for the Organization domain foundation.

The matrix still precedes the PRD, API contracts, data dictionary pages,
permission mapping, and PRD-derived test cases. It is not approval to implement
source, migrations, routes, or UI.

The refresh intentionally replaced the earlier low-level CRUD/route-shaped
rows with capability-level rows that:

- name the source documents that support each capability
- map each active or deferred capability to a Story Breakdown story
- avoid inventing exact route paths, field names, database tables, permission
  keys, or UI controls before the downstream artifacts approve them
- mark explicit future items as deferred instead of build-ready

Treat it as:

- a planning map for the approved v1 Organization capabilities
- input to the Organization PRD
- input to the PRD-derived test plan
- input to API contract, data dictionary, permission mapping, and runbook work
- not approval to implement source, migrations, routes, or UI

## S-000 Refresh Inputs

The refreshed matrix uses:

- `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`
- `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`
- `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-000-approved-behavior-map/story.md`
- this first-draft notes file
- `docs/workspace/implementation-blueprints/2026-05-11-organization-domain-foundation-capability-blueprint.md`

Each active row records source evidence in `Source artifact` and story ownership
in `Traceability status` and `Acceptance notes`.

## Scope

The first Organization domain foundation covers:

- organization core records
- organization legal details
- organization locations
- location opening hours
- organization structure levels
- business units
- business unit memberships
- organization integrations
- organization branding references, subject to branding ownership decision
- domain, model type, and activity reference catalogues
- narrow public read seams for Discovery Intelligence and Build inspector

## Confirmed Product Decisions

- One tenant may have multiple organizations.
- Organization lifecycle is per organization and separate from sibling
  organizations under the same tenant.
- Organization behavior inherits baseline tenant disabled/deleted behavior.
- Root-admin authorization and tenant-admin authorization need distinct
  capability variants. Root authorization is not bound to a current tenant;
  tenant authorization is bound to exactly one current tenant context.
- Domain/model/activity reference catalogues are part of this slice.
- Branding is per organization and covers logo types plus primary colour hex.
- Integrations can start as official organization records.
- Root admins have full access.
- Tenant admins have full access to non-system organization entity
  capabilities in their current tenant.
- Use industry best-practice recommendations where the product detail is not
  yet settled.

## Capability Row Shape

The CSV uses the current wide capability-matrix template but keeps the row shape
at capability level rather than approved route or table level.

Rows are grouped around the Story Breakdown:

- `S-000` through `S-003`: planning and repo-governance prerequisites
- `S-004` through `S-009`: Organization domain records and catalogue behavior
- `S-010`: public logo upload, delivery, replacement, placeholder, and alt text
- `S-011`: separated-by-type search
- `S-012`: private export bundles
- `S-013`: design-system prerequisite before app UI
- `S-014`: deferred public Organization summaries
- `S-015`: maintained planning, feature, generated, and support notes

Rows marked `deferred` or `deferred-with-owner` are not build-ready v1
capabilities.

## Authorization Variants

Every non-system Organization entity capability should be planned in two
authorization variants:

- root-admin variant:
  root-scoped authorization. Results are not constrained by a current tenant
  session. List views may return records across tenants and must support tenant
  filters where the result set can span tenants.
- tenant-admin variant:
  tenant-scoped authorization. Results are constrained to exactly one current
  tenant context from the tenant session/selection model. Request bodies must
  not supply tenant authority.

System catalogue reads may be available to both root and tenant admins.
System catalogue mutation remains root/system-only unless a later catalogue
governance decision says otherwise.

Root routes and tenant routes may share capability semantics, but they should
not share authorization assumptions. The PRD and permission mapping should
expand the matrix rows into distinct root and tenant capability keys wherever
route behavior, result scope, audit, or denial handling differs.

## List And Filter Requirement

Every entity in this slice needs a list view and list API with full filtering
appropriate to that entity, following the established root-users list posture:

- pagination using repo defaults
- lifecycle/status filter
- exact id filters where relevant
- tenant filter for root-admin list views that can span tenants
- organization filter for child entities
- parent/relationship filters where relevant
- normalized text search for stable human labels such as name, key, prefix, or
  description
- attribute-type filters for entity-specific typed fields
- date/time filters for created/updated and business-relevant timestamps where
  useful
- deterministic sort fields and direction

Minimum entity-specific filters:

- organizations:
  tenant, lifecycle status, relationship type, domain, model type, name/prefix.
- legal details:
  tenant, organization, lifecycle status, jurisdiction country, company number,
  VAT/tax identifier where allowed.
- locations:
  tenant, organization, lifecycle status, location type, country, region,
  timezone, head-office flags.
- opening hours:
  tenant, organization, location, lifecycle status, weekday, timezone.
- unit levels:
  tenant, organization, lifecycle status, level number, name.
- business units:
  tenant, organization, lifecycle status, unit level, parent unit, name.
- business unit memberships:
  tenant, organization, business unit, lifecycle status, membership type,
  target user, target role.
- integrations:
  tenant, organization, lifecycle status, integration type, owner business
  unit, data sensitivity, name.
- branding references:
  tenant, organization, lifecycle status, logo reference presence/type, primary
  colour presence.
- reference catalogues:
  key, status, domain relationship, name/description text.

## Recommended Feature Boundary

The Organization domain should be a domain grouping and future service boundary
candidate, not a single umbrella feature.

Recommended feature set:

- `organizationCore`
- `organizationLegalDetails`
- `organizationLocations`
- `locationOpeningHours`
- `organizationUnitLevels`
- `businessUnits`
- `businessUnitMemberships`
- `organizationIntegrations`
- `organizationBrandingReferences`
- `organizationReferenceCatalogues`

Each feature should keep the repo-standard
`contract/domain/persistence/transport/integration/index/feature.manifest.json`
shape.

## Out Of Scope

- Bank accounts. Route to finance/billing with encryption, masking, audit, and
  stricter access controls.
- Pricing, support tier, service tier, and entitlements. Route to
  commercial/entitlement features.
- Tenant lifecycle ownership. Organization records inherit tenant baseline
  behavior but do not mutate tenant lifecycle.
- Compliance assessments. Route to a compliance feature/layer.
- Data sensitivity and clearance rules. Route to platform data governance.
- Product Discovery inference. Discovery may read official organization
  records and create separate inference, but must not mutate record accounts.

## Required Next Artifacts

Before source implementation:

- full PRD
- PRD-derived test cases
- API contract docs
- data dictionary pages for every entity
- permission mapping
- feature docs
- feature manifests, including any domain/runtime-boundary metadata
- dependency graph update plan
- capability contract catalog materialization plan
- runbook notes for asset processing, public logo cache invalidation, export
  jobs, export cleanup, and failure recording
- design-system planning before root-admin or tenant-admin app UI adoption
