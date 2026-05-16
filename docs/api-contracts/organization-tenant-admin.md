# Organization Tenant-Admin API Contract

## Scope

- Contract name:
  `organizationTenantAdmin`
- Feature:
  Organization domain feature family
- Route family or capability group:
  Tenant-admin Organization management inside exactly one current
  tenant/account context, including record management, public logo
  relationship management, grouped search, and private export requests.
- Implementation status:
  S-004 core Organization record routes, S-005 legal-profile routes, S-006
  location routes, S-007 opening-hour routes, S-008 business-unit routes, and
  S-009 business-unit membership routes, and S-010 reference-value read routes
  have initial backend implementations. Logo, search, export, and UI routes
  remain planned.
- In-scope routes:
  - `POST /v1/tenant-admin/organizations`
  - `GET /v1/tenant-admin/organizations`
  - `GET /v1/tenant-admin/organizations/:organizationId`
  - `PATCH /v1/tenant-admin/organizations/:organizationId`
  - `POST /v1/tenant-admin/organizations/:organizationId/archive`
  - `POST /v1/tenant-admin/organizations/:organizationId/restore`
  - `POST /v1/tenant-admin/organizations/:organizationId/move`
  - `POST /v1/tenant-admin/organizations/:organizationId/delete`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles`
  - `GET /v1/tenant-admin/organizations/:organizationId/legal-profiles`
  - `GET /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `PATCH /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId/archive`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId/restore`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId/delete`
  - `GET /v1/tenant-admin/organization-search`
  - `GET /v1/tenant-admin/organization-reference-values`
  - `POST /v1/tenant-admin/organizations/:organizationId/logos/:logoType/upload-intents`
  - `PUT /v1/tenant-admin/organizations/:organizationId/logos/:logoType`
  - `DELETE /v1/tenant-admin/organizations/:organizationId/logos/:logoType`
  - `POST /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports/:exportId`
  - `POST /v1/tenant-admin/organization-exports/:exportId/cancel`
  - `POST /v1/tenant-admin/organization-exports/:exportId/retry`
  - `GET /v1/tenant-admin/organization-exports/:exportId/pin`
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
  Organization feature family:
  `organizationCore`, `organizationLegalDetails`, `organizationLocations`,
  `organizationOpeningHours`, `businessUnits`, `businessUnitMemberships`,
  `organizationOpeningHoursExceptions`, `organizationReferenceCatalogues`,
  `organizationBrandingReferences`, `organizationSearch`, and
  `organizationExports`. `organizationIntegrations` is deferred from v1.
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
  - `POST /v1/tenant-admin/organizations/:organizationId/delete`
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
    root-level posture; delete soft-deletes an organization with no active
    children.
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
    `INVALID_REQUEST`, `ORGANIZATION_NOT_FOUND`,
    `ORGANIZATION_NAME_ALREADY_EXISTS`, `ORGANIZATION_HIERARCHY_CONFLICT`,
    `ORGANIZATION_LIFECYCLE_CONFLICT`, `ORGANIZATION_REFERENCE_VALUE_INVALID`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`

## Route Group: Legal Profiles

- Methods and paths:
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles`
  - `GET /v1/tenant-admin/organizations/:organizationId/legal-profiles`
  - `GET /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `PATCH /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId/archive`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId/restore`
  - `POST /v1/tenant-admin/organizations/:organizationId/legal-profiles/:legalProfileId/delete`
- Compatibility paths:
  `/v1/tenant/organizations/:organizationId/legal-profiles` exposes the same
  child route family during the current route migration.
- Request contract:
  create/update accept only `legalName`, optional `registrationIdentifier`,
  optional `taxVatNumber`, and optional `registeredAddress`. Request bodies
  must not select or override tenant authority. List defaults to `page=1`,
  `pageSize=25`, `orderDirection=desc` and supports explicit retained-record
  filters for archived profiles.
- Response contract:
  success payloads return generated identifiers, Organization and current
  tenant ownership, legal fields, lifecycle status, archived/deleted markers,
  and audit-safe timestamps.
- Error contract:
  feature-local errors include
  `ORGANIZATION_LEGAL_PROFILE_DUPLICATE_ACTIVE`,
  `ORGANIZATION_LEGAL_PROFILE_NOT_FOUND`, and
  `ORGANIZATION_LEGAL_PROFILE_INVALID_REQUEST`.
- Implementation status:
  implemented-foundation in `src/features/organizationLegalDetails`; UI,
  grouped search, export-job integration, and deeper persistence-backed route
  proof remain later slices.

## Route Group: Locations

- Methods and paths:
  - `POST /v1/tenant-admin/organizations/:organizationId/locations`
  - `GET /v1/tenant-admin/organizations/:organizationId/locations`
  - `GET /v1/tenant-admin/organizations/:organizationId/locations/:locationId`
  - `PATCH /v1/tenant-admin/organizations/:organizationId/locations/:locationId`
  - `POST /v1/tenant-admin/organizations/:organizationId/locations/:locationId/archive`
  - `POST /v1/tenant-admin/organizations/:organizationId/locations/:locationId/restore`
  - `POST /v1/tenant-admin/organizations/:organizationId/locations/:locationId/delete`
- Compatibility paths:
  `/v1/tenant/organizations/:organizationId/locations` exposes the same child
  route family during the current route migration.
- Request contract:
  create/update accept only `locationName`, optional `addressSummary`,
  optional latitude/longitude pair, `isHeadOffice`, and
  `isRegisteredOffice`. Request bodies must not select or override tenant
  authority. Multiple active locations and multiple head-office flags are
  allowed.
- Response contract:
  success payloads return generated identifiers, Organization and current
  tenant ownership, location fields, descriptive flags, lifecycle status,
  archived/deleted markers, and audit-safe timestamps.
- Error contract:
  feature-local errors include `ORGANIZATION_LOCATION_NOT_FOUND` and
  `ORGANIZATION_LOCATION_INVALID_REQUEST`.
- Implementation status:
  implemented-foundation in `src/features/organizationLocations`; opening
  hours, UI, grouped search, and export-job integration remain later slices.

## Route Group: Other Related Records

- Scope:
  weekly opening-hour slots, opening-hours exceptions, business units, and
  business unit memberships use child resources under the current
  tenant/account and selected organization.
- Planned path pattern:
  `/v1/tenant-admin/organizations/:organizationId/<record-area>`
- Request contract:
  child record request bodies accept only data-dictionary-approved fields.
  Weekly opening hours are weekday-specific slots with slot order, local open/close times,
  same-day-only v1 behavior, and non-overlap validation. Opening-hours
  exceptions are date-specific overrides and use deterministic precedence:
  closed day, replacement day schedule, closed time slot, then special opening
  slot. Business-unit hierarchy depth greater than 10 is denied.
  Business-unit child IDs are a
  derived read projection from parent relationships, not an independently
  mutable request field. Memberships currently support real business-unit
  member targets through the `organizationBusinessUnits` public service seam
  and use one of the fixed v1 membership roles: owner, manager, member, or
  viewer. Individual/person member targets are explicitly deferred until an
  approved individual/person lookup seam exists.
  Integration records are not v1 child resources. If revived later, they must
  re-enter discovery and continue to reject credentials, endpoints, webhook
  secrets, payload examples, and provider configuration.
- Response contract:
  success payloads return the created, updated, listed, or lifecycle-changed
  child record with generated identifiers and audit-safe timestamps.
- Error contract:
  child routes share Organization boundary errors and add area-specific
  validation errors such as duplicate active legal profile, invalid weekly
  hours, overlapping weekly hours, invalid opening-hours exception, invalid
  geocoordinates, invalid business-unit parent, missing user, missing member
  business unit, and invalid membership role.

## Route Group: Reference Value Reads

- Method:
  `GET`
- Path:
  `/v1/tenant-admin/organization-reference-values`
- Request contract:
  tenant admins may list and use active approved Organization option-list
  values, such as organization type, legal form, industry category, location
  type, or relationship type. Future integration-type values require a revived
  integration scope. Tenant admins cannot create, rename, archive, deprecate,
  or replace system-owned values.
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
  v1 supports `logoType=primary`. Future logo types such as icon or
  light/dark-background variants require a separate expansion decision.
  Upload-intent body includes allowed MIME type, byte size, checksum, and
  optional original filename. Relationship replacement body includes a ready
  `assetId` and required alt text, defaulting to `<organizationName> logo`
  when custom text is not supplied.
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
  locations, weekly opening hours, opening-hour exceptions, business units,
  memberships, branding/logo references, and reference values. Results are
  permission-filtered and tenant/account-filtered.
- Error contract:
  unsupported filters, invalid pagination/sort, tenant mismatch, and shared
  middleware errors.

## Route Group: Private Exports

- Methods and paths:
  - `POST /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports`
  - `GET /v1/tenant-admin/organization-exports/:exportId`
  - `POST /v1/tenant-admin/organization-exports/:exportId/cancel`
  - `POST /v1/tenant-admin/organization-exports/:exportId/retry`
  - `GET /v1/tenant-admin/organization-exports/:exportId/pin`
  - `GET /v1/tenant-admin/organization-exports/:exportId/download`
  - `DELETE /v1/tenant-admin/organization-exports/:exportId`
- Request contract:
  create body selects export sections for the current tenant/account,
  visibility scope (`current_only` or `include_retained`), Organization scope
  (`selected_organization_only` or `include_child_branch`), and optional
  select-all expansion. Deleted records are excluded. Integration records are
  excluded from v1 Organization exports. Export copies are personal to the
  requesting tenant admin. Retry may reuse previous options or submit changed
  options. Cancel is allowed while queued or running.
- Response contract:
  export request/status payload with selected sections, state, timestamps,
  generation-time snapshot note, expiry, size/checksum once ready, failure
  category when failed, notification status, PIN availability, and download
  availability. Ready and failed export states should drive the async/status
  component and attention badge. Download returns a private password/PIN
  protected `.zip` attachment.
- Validation rules:
  exports are background jobs only. No product-facing maximum Organization
  count or ZIP size is approved in v1; technical safety limits remain a
  steering concern. Ready exports expire after 24 hours or when deleted. Admin
  must be currently logged in and must be the requester to download or view the
  PIN. Link plus PIN alone is not authority. The ZIP manifest is required and
  JSON plus file assets are the v1 export format. Legal hold and incident hold
  do not extend generated export-copy retention in v1.
- Error contract:
  `ORGANIZATION_EXPORT_INVALID_REQUEST`, `ORGANIZATION_EXPORT_NOT_FOUND`,
  `ORGANIZATION_EXPORT_LIMIT_EXCEEDED`, `ORGANIZATION_EXPORT_NOT_READY`,
  `ORGANIZATION_EXPORT_CANCELLED`, `ORGANIZATION_EXPORT_PIN_FORBIDDEN`,
  `ORGANIZATION_EXPORT_EXPIRED`, `ORGANIZATION_EXPORT_FORBIDDEN`, and shared
  middleware errors.

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
  This contract now includes implemented backend route shape for Organization
  records, legal profiles, locations, opening-hour records, business units, and
  business-unit memberships. Source implementation, migrations, exact table
  names, exact field names, and root permission keys exist for S-004 through
  S-009; UI screens and later Organization-domain route groups remain separate
  tasks. Tenant-admin routes must never infer tenant authority from request
  bodies.

## Traceability

- PRD / design docs:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`
- OpenAPI:
  not maintained yet for this route family.
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
  mutation denial, raw URL denial, private export denial, and deferred
  integration route denial.
- Audit:
  mutation, denied access, logo processing/cleanup, and export lifecycle
  evidence.
- Edge:
  client-supplied system fields, empty strings, request-body tenant spoofing,
  invalid filters, depth/cycle limits, unavailable export, and removed logo
  placeholder behavior.
