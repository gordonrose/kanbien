# Organization Tenant-Admin API Contract

## Scope

- Contract name:
  `organizationTenantAdmin`
- Feature:
  planned Organization domain feature family
- Route family or capability group:
  Tenant-admin Organization management inside exactly one current
  tenant/account context, including record management, public logo
  relationship management, grouped search, and private export requests.
- Implementation status:
  planned; this is a source-independent first-draft contract for task
  breakdown, not an implemented route inventory.
- In-scope routes:
  - `POST /v1/tenant-admin/organizations`
  - `GET /v1/tenant-admin/organizations`
  - `GET /v1/tenant-admin/organizations/:organizationId`
  - `PATCH /v1/tenant-admin/organizations/:organizationId`
  - `POST /v1/tenant-admin/organizations/:organizationId/archive`
  - `POST /v1/tenant-admin/organizations/:organizationId/restore`
  - `POST /v1/tenant-admin/organizations/:organizationId/move`
  - `GET /v1/tenant-admin/organization-search`
  - `GET /v1/tenant-admin/organization-reference-values`
  - `POST /v1/tenant-admin/organizations/:organizationId/logos/:logoType/upload-intents`
  - `PUT /v1/tenant-admin/organizations/:organizationId/logos/:logoType`
  - `DELETE /v1/tenant-admin/organizations/:organizationId/logos/:logoType`
  - `POST /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports/:exportId`
  - `GET /v1/tenant-admin/organization-exports/:exportId/download`
  - `DELETE /v1/tenant-admin/organization-exports/:exportId`
- Out-of-scope but closely related routes:
  - root-admin Organization routes
  - tenant-admin reference catalogue mutation routes
  - public organization logo delivery URLs
  - generic asset-library, file-hosting, import, or bulk-upload routes
  - app screen routes and design-system canonicals

## Capability

- Feature:
  planned Organization feature family:
  `organizationCore`, `organizationLegalDetails`, `organizationLocations`,
  `locationOpeningHours`, `businessUnits`, `businessUnitMemberships`,
  `organizationIntegrations`, `organizationReferenceCatalogues`,
  `organizationBrandingReferences`, `organizationSearch`, and
  `organizationExports`.
- Capabilities:
  tenant-admin Organization management, approved reference-value use, public
  logo management, grouped search, private export request/status/read, and
  export delete inside the current tenant/account.

## Authentication

- Required auth state:
  authenticated tenant-admin session with exactly one current tenant/account
  context.
- Session transport(s):
  tenant-side server-backed session transport. Tenant context is validated
  server-side and must not be inferred from mutable request bodies.

## Authorization

- Allowed roles:
  tenant admin with the future mapped Organization capability inside the
  current tenant/account.
- Denied roles:
  unauthenticated callers, invalid tenant sessions, tenant actors without the
  mapped capability, tenant actors without exactly one current tenant/account
  context, root actors trying to use tenant routes, and any cross-tenant
  request.
- Enforcement point:
  tenant-session/current-context middleware plus future Organization-domain
  authorization checks. The Organization feature owns entity/object
  authorization. The `assets` feature owns upload, storage, readiness, byte
  verification, and storage policy invariants.

## Middleware And Platform Effects

- Route protection middleware:
  protected tenant-session middleware and tenant capability checks.
- Rate limiting / abuse controls:
  authenticated tenant API rate limits apply. Logo upload-intent routes also
  enforce approved asset/upload quotas. Export request routes enforce export
  request and active-job limits.
- Browser-specific behavior:
  tenant-admin browser callers use the tenant-admin session/current-context
  model. App UI remains blocked until design-system governance approves shared
  patterns.
- Other shared platform behavior:
  request bodies must not select or override tenant authority. Public logo
  delivery must never expose raw bucket/provider URLs. Private export downloads
  must never expose public links or raw bucket/provider URLs.

## Route Group: Organization Records

- Methods and paths:
  - `POST /v1/tenant-admin/organizations`
  - `GET /v1/tenant-admin/organizations`
  - `GET /v1/tenant-admin/organizations/:organizationId`
  - `PATCH /v1/tenant-admin/organizations/:organizationId`
  - `POST /v1/tenant-admin/organizations/:organizationId/archive`
  - `POST /v1/tenant-admin/organizations/:organizationId/restore`
  - `POST /v1/tenant-admin/organizations/:organizationId/move`
- Request contract:
  - params:
    exact `organizationId` where present
  - query:
    list defaults to `page=1`, `pageSize=25`, `orderDirection=desc`; exact
    filters and sort fields are finalized by the data dictionary.
  - body:
    create/update accept only Organization-domain fields approved by the data
    dictionary; archive accepts an archive choice of whole branch or move
    children to a valid replacement parent; move accepts a target parent or
    root-level posture.
  - validation rules:
    clients must not supply tenant/account authority, system-managed fields,
    empty strings, or cross-tenant parent identifiers. Active organization
    names must be unique within the current tenant/account after
    normalization. Hierarchy depth greater than 10 is denied. Cycles are
    denied.
- Response contract:
  - success payload:
    Organization summary or detail with generated identifiers, lifecycle
    state, parent/child relationship summary, reference-value display
    projections, and audit-safe timestamps.
  - status code:
    `201` for create, `200` for reads and mutations.
- Error contract:
  - feature-local:
    `ORGANIZATION_INVALID_REQUEST`, `ORGANIZATION_NOT_FOUND`,
    `ORGANIZATION_TENANT_MISMATCH`, `ORGANIZATION_NAME_ALREADY_EXISTS`,
    `ORGANIZATION_HIERARCHY_DEPTH_EXCEEDED`, `ORGANIZATION_HIERARCHY_CYCLE`,
    `ORGANIZATION_LIFECYCLE_CONFLICT`, `ORGANIZATION_REFERENCE_VALUE_INVALID`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`

## Route Group: Related Records

- Scope:
  legal profiles, locations, weekly opening hours, business units, business
  unit memberships, and high-level integration records use child resources
  under the current tenant/account and selected organization.
- Planned path pattern:
  `/v1/tenant-admin/organizations/:organizationId/<record-area>`
- Request contract:
  child record request bodies accept only data-dictionary-approved fields.
  Legal profiles may include optional tax/VAT number and registered address
  fields. Locations may include optional geocoordinates. Business-unit
  hierarchy depth greater than 10 is denied. Business-unit child IDs are a
  derived read projection from parent relationships, not an independently
  mutable request field. Memberships must reference real individual users or
  real business units through approved public seams and use one of the fixed v1
  membership roles: owner, manager, member, or viewer.
  Integration records reject credentials, endpoints, webhook secrets, payload
  examples, and provider configuration.
- Response contract:
  success payloads return the created, updated, listed, or lifecycle-changed
  child record with generated identifiers and audit-safe timestamps.
- Error contract:
  child routes share Organization boundary errors and add area-specific
  validation errors such as duplicate active legal profile, invalid weekly
  hours, invalid geocoordinates, invalid business-unit parent, missing user,
  missing member business unit, invalid membership role, and rejected
  secret-like integration field.

## Route Group: Reference Value Reads

- Method:
  `GET`
- Path:
  `/v1/tenant-admin/organization-reference-values`
- Request contract:
  tenant admins may list and use active approved Organization option-list
  values, such as organization type, legal form, industry category, location
  type, integration type, or relationship type. They cannot create, rename,
  archive, deprecate, or replace system-owned values.
- Response contract:
  approved reference values grouped by reference type with lifecycle and
  replacement/deprecated posture needed for display.
- Error contract:
  shared middleware errors and invalid filter/sort errors.

## Route Group: Public Logo Management

- Methods and paths:
  - `POST /v1/tenant-admin/organizations/:organizationId/logos/:logoType/upload-intents`
  - `PUT /v1/tenant-admin/organizations/:organizationId/logos/:logoType`
  - `DELETE /v1/tenant-admin/organizations/:organizationId/logos/:logoType`
- Request contract:
  `logoType` is one of `primary`, `icon`, `light-background`, or
  `dark-background`. Upload-intent body includes allowed MIME type, byte size,
  checksum, and optional original filename. Relationship replacement body
  includes a ready `assetId` and required alt text, defaulting to
  `<organizationName> logo` when custom text is not supplied.
- Validation rules:
  allowed MIME types are `image/png`, `image/jpeg`, and `image/webp`; SVG is
  out of scope; max upload size is 5 MB; accepted public delivery requires
  malware scanning, actual-byte verification, and raster metadata stripping.
  The asset and organization must belong to the current tenant/account.
- Response contract:
  upload intent, current logo relationship, or removal result with placeholder
  posture. Removing a logo falls back to an app-generated initials
  placeholder, not an uploaded asset.
- Error contract:
  `ORGANIZATION_LOGO_INVALID`, `ORGANIZATION_LOGO_NOT_READY`,
  `ORGANIZATION_LOGO_TYPE_INVALID`, `ORGANIZATION_LOGO_ALT_TEXT_REQUIRED`,
  `ORGANIZATION_LOGO_TENANT_MISMATCH`, asset feature errors, and shared
  middleware errors.

## Route Group: Grouped Search

- Method:
  `GET`
- Path:
  `/v1/tenant-admin/organization-search`
- Request contract:
  broad text search, explicit exact filters, pagination, and deterministic
  sorting inside the current tenant/account. Exact searchable fields,
  operators, and indexes are owned by the data dictionary.
- Response contract:
  grouped result sets by record type for organizations, legal profiles,
  locations, weekly opening hours, business units, memberships, integrations,
  branding/logo references, and reference values. Results are
  permission-filtered and tenant/account-filtered.
- Error contract:
  unsupported filters, invalid pagination/sort, tenant mismatch, and shared
  middleware errors.

## Route Group: Private Exports

- Methods and paths:
  - `POST /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports/:exportId`
  - `GET /v1/tenant-admin/organization-exports/:exportId/download`
  - `DELETE /v1/tenant-admin/organization-exports/:exportId`
- Request contract:
  create body selects export sections for the current tenant/account. Active
  exports are limited to 1 per actor, 3 per tenant, and 10 platform-wide.
  Requests are limited to 5 per actor per hour and 20 per tenant per day.
- Response contract:
  export request/status payload with selected sections, state, timestamps,
  expiry, size/checksum once ready, failure category when failed, and download
  availability. Download returns a private `.zip` attachment.
- Validation rules:
  exports are background jobs only. ZIP size cap is 250 MB. Download attempts
  are capped at 10 before expiry. Ready exports expire after 24 hours or when
  deleted. Legal hold and incident hold do not extend generated export-copy
  retention in v1.
- Error contract:
  `ORGANIZATION_EXPORT_INVALID_REQUEST`, `ORGANIZATION_EXPORT_NOT_FOUND`,
  `ORGANIZATION_EXPORT_LIMIT_EXCEEDED`, `ORGANIZATION_EXPORT_NOT_READY`,
  `ORGANIZATION_EXPORT_EXPIRED`, `ORGANIZATION_EXPORT_DOWNLOAD_LIMIT_EXCEEDED`,
  `ORGANIZATION_EXPORT_FORBIDDEN`, and shared middleware errors.

## Public Logo Delivery Note

Public readers may read only current accepted public logo bytes or the
app-generated initials placeholder through approved app-controlled public
delivery URLs. Public delivery is not authority to read private Organization
records, historical logo relationships, private exports, or raw asset storage.
The exact public logo URL shape remains a later public-delivery/API task.

## Persistence / Side Effects

- Durable writes:
  Organization records, child records, logo relationships, export requests,
  export status records, and audit/failure evidence according to future data
  dictionary pages.
- Audit effects:
  create, update, archive, restore, move, logo upload/replacement/removal,
  export request/status/download/delete, cleanup failures, and sensitive
  denials require audit evidence.
- Cross-feature reads:
  assets for logo upload/read/link/delete semantics; user and role public
  identity seams for memberships; job processing for exports; tenant auth and
  platform authorization seams for authority.
- Other side effects:
  logo replacement triggers cache/CDN purge or invalidation with retryable
  failure recording. Export request creates background work and private stored
  generated bytes.

## Lifecycle / Cleanup

- Expiry behavior:
  public logo prior bytes may be deleted 24 hours after replacement is live;
  ready export bundles expire after 24 hours unless deleted sooner.
- Abandoned or partial-state behavior:
  pending uploads, failed processing, failed jobs, and partial exports remain
  recorded with safe failure category until cleanup or retry rules resolve.
- Orphaned external resource handling:
  assets/storage cleanup is owned by the asset or generated-file seam, while
  Organization owns relationship and export lifecycle decisions.
- Cleanup trigger:
  job queue / scheduler / storage lifecycle, depending on the later
  implementation blueprint.
- Cleanup retry and failure recording:
  logo purge/delete failures and export cleanup failures are recorded and
  retried; export cleanup retry window is 7 days.
- Quota or cost accounting during pending cleanup:
  logo and export byte caps continue to count until cleanup removes stored
  bytes unless a later runbook approves a different rule.

## Compatibility / Lifecycle Notes

- Notes:
  This contract approves planned route shape for task breakdown. Source
  implementation, migrations, exact table names, exact field names, exact
  permission keys, and UI screens remain separate tasks. Tenant-admin routes
  must never infer tenant authority from request bodies.

## Traceability

- PRD / design docs:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`
- OpenAPI:
  not maintained yet for this planned route family.
- Tests required or existing:
  `docs/prd/test_cases/2026-05-12-0025-organization-domain-foundation-test-cases.md`

## Tests Required

- Unit:
  hierarchy rules, lifecycle validation, logo relationship readiness, export
  request validation.
- Integration:
  tenant route protection, current-context enforcement, persistence-backed
  record lifecycle, grouped search, logo/asset relationship, export job status
  and private download.
- Security:
  missing/invalid session denial, cross-tenant denial, tenant catalogue
  mutation denial, raw URL denial, private export denial, rejected secret-like
  integration fields.
- Audit:
  mutation, denied access, logo processing/cleanup, and export lifecycle
  evidence.
- Edge:
  client-supplied system fields, empty strings, request-body tenant spoofing,
  invalid filters, depth/cycle limits, unavailable export, and removed logo
  placeholder behavior.
