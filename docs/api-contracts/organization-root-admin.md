# Organization Root-Admin API Contract

## Scope

- Contract name:
  `organizationRootAdmin`
- Feature:
  Organization domain feature family
- Route family or capability group:
  Root-admin Organization management, reference catalogue management, public
  logo relationship management, grouped search, and private export requests.
- Implementation status:
  S-004 core Organization record routes, S-005 legal-profile routes, S-006
  location routes, S-007 opening-hour routes, S-008 business-unit routes, and
  S-009 business-unit membership routes, and S-010 reference-value catalogue
  routes have initial backend implementations. Logo, search, export, and UI
  routes remain planned.
- In-scope routes:
  - `POST /v1/root-admin/tenants/:tenantId/organizations`
  - `GET /v1/root-admin/tenants/:tenantId/organizations`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId`
  - `PATCH /v1/root-admin/tenants/:tenantId/organizations/:organizationId`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/archive`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/restore`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/move`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/delete`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `PATCH /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId/archive`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId/restore`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId/delete`
  - `GET /v1/root-admin/tenants/:tenantId/organization-search`
  - `POST /v1/root-admin/organization-reference-values`
  - `GET /v1/root-admin/organization-reference-values`
  - `PATCH /v1/root-admin/organization-reference-values/:referenceValueId`
  - `POST /v1/root-admin/organization-reference-values/:referenceValueId/archive`
  - `POST /v1/root-admin/organization-reference-values/:referenceValueId/deprecate`
  - `POST /v1/root-admin/organization-reference-values/:referenceValueId/replace`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/logos/:logoType/upload-intents`
  - `PUT /v1/root-admin/tenants/:tenantId/organizations/:organizationId/logos/:logoType`
  - `DELETE /v1/root-admin/tenants/:tenantId/organizations/:organizationId/logos/:logoType`
  - `POST /v1/root-admin/tenants/:tenantId/organization-exports`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports/:exportId`
  - `POST /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/cancel`
  - `POST /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/retry`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/pin`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/download`
  - `DELETE /v1/root-admin/tenants/:tenantId/organization-exports/:exportId`
- Out-of-scope but closely related routes:
  - tenant-admin Organization routes
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
  root-admin Organization management, system reference catalogue management,
  public logo management, grouped search, private export request/status/read,
  and export delete.

## Authentication

- Required auth state:
  authenticated root-admin session for every route in this contract.
- Session transport(s):
  - same-origin root-admin browser session cookie where the root-admin shell is
    the caller
  - bearer root session where the protected root API route family supports it

## Authorization

- Allowed roles:
  root admin with the future mapped Organization capability for the requested
  action and selected target tenant/account.
- Denied roles:
  unauthenticated callers, invalid root sessions, root actors without the
  mapped Organization capability, tenant actors, and any request where the
  selected tenant/account does not own the target Organization record.
- Enforcement point:
  root-session middleware plus future Organization-domain authorization checks.
  The Organization feature owns entity/object authorization. The `assets`
  feature owns upload, storage, readiness, byte verification, and storage
  policy invariants.

## Middleware And Platform Effects

- Route protection middleware:
  protected root-session middleware and root capability checks.
- Rate limiting / abuse controls:
  authenticated root API rate limits apply. Logo upload-intent routes also
  enforce the approved asset/upload quotas. Export request routes enforce
  export request and active-job limits.
- Browser-specific behavior:
  root-admin browser callers use the root session cookie. App UI remains
  blocked until design-system governance approves shared patterns.
- Other shared platform behavior:
  JSON errors use the shared error envelope. Public logo delivery must never
  expose raw bucket/provider URLs. Private export downloads must never expose
  public links or raw bucket/provider URLs.

## Route Group: Organization Records

- Methods and paths:
  - `POST /v1/root-admin/tenants/:tenantId/organizations`
  - `GET /v1/root-admin/tenants/:tenantId/organizations`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId`
  - `PATCH /v1/root-admin/tenants/:tenantId/organizations/:organizationId`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/archive`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/restore`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/move`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/delete`
- Request contract:
  - params:
    exact `tenantId` and `organizationId` where present
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
    clients must not supply system-managed fields; empty strings are rejected;
    active organization names must be unique within the selected
    tenant/account after normalization; hierarchy depth greater than 10 is
    denied; cycles are denied; parent/child relationships must stay inside the
    selected tenant/account.
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
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `PATCH /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId/archive`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId/restore`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles/:legalProfileId/delete`
- Compatibility paths:
  `/v1/tenants/:tenantId/organizations/:organizationId/legal-profiles`
  exposes the same child route family during the current route migration.
- Request contract:
  create/update accept only `legalName`, optional `registrationIdentifier`,
  optional `taxVatNumber`, and optional `registeredAddress`. List defaults to
  `page=1`, `pageSize=25`, `orderDirection=desc` and supports explicit
  retained-record filters for archived profiles.
- Response contract:
  success payloads return generated identifiers, Organization and tenant
  ownership, legal fields, lifecycle status, archived/deleted markers, and
  audit-safe timestamps.
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
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations`
  - `GET /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId`
  - `PATCH /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId/archive`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId/restore`
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/locations/:locationId/delete`
- Compatibility paths:
  `/v1/tenants/:tenantId/organizations/:organizationId/locations` exposes the
  same child route family during the current route migration.
- Request contract:
  create/update accept only `locationName`, optional `addressSummary`,
  optional latitude/longitude pair, `isHeadOffice`, and
  `isRegisteredOffice`. Multiple active locations and multiple head-office
  flags are allowed.
- Response contract:
  success payloads return generated identifiers, Organization and tenant
  ownership, location fields, descriptive flags, lifecycle status,
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
  business unit memberships use child resources under the selected
  tenant/account and organization.
- Planned path pattern:
  `/v1/root-admin/tenants/:tenantId/organizations/:organizationId/<record-area>`
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

## Route Group: Reference Values

- Methods and paths:
  - `POST /v1/root-admin/organization-reference-values`
  - `GET /v1/root-admin/organization-reference-values`
  - `PATCH /v1/root-admin/organization-reference-values/:referenceValueId`
  - `POST /v1/root-admin/organization-reference-values/:referenceValueId/archive`
  - `POST /v1/root-admin/organization-reference-values/:referenceValueId/deprecate`
  - `POST /v1/root-admin/organization-reference-values/:referenceValueId/replace`
- Request contract:
  root admins manage system-owned Organization option-list values, such as
  organization type, legal form, industry category, location type, or
  relationship type. Future integration-type values require a revived
  integration scope. Used values must be archived, deprecated, or explicitly
  replaced; they must not silently disappear. Label changes apply immediately
  wherever records reference the value.
- Response contract:
  saved reference value or replacement result with lifecycle state and
  audit-safe timestamps.
- Error contract:
  `ORGANIZATION_REFERENCE_VALUE_NOT_FOUND`,
  `ORGANIZATION_REFERENCE_VALUE_IN_USE`,
  `ORGANIZATION_REFERENCE_REPLACEMENT_INVALID`, and shared middleware errors.

## Route Group: Public Logo Management

- Methods and paths:
  - `POST /v1/root-admin/tenants/:tenantId/organizations/:organizationId/logos/:logoType/upload-intents`
  - `PUT /v1/root-admin/tenants/:tenantId/organizations/:organizationId/logos/:logoType`
  - `DELETE /v1/root-admin/tenants/:tenantId/organizations/:organizationId/logos/:logoType`
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
  Replacement keeps the prior logo public until the new asset is accepted.
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
  `/v1/root-admin/tenants/:tenantId/organization-search`
- Request contract:
  broad text search, explicit exact filters, pagination, and deterministic
  sorting. Exact searchable fields, operators, and indexes are owned by the
  data dictionary.
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
  - `POST /v1/root-admin/tenants/:tenantId/organization-exports`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports/:exportId`
  - `POST /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/cancel`
  - `POST /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/retry`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/pin`
  - `GET /v1/root-admin/tenants/:tenantId/organization-exports/:exportId/download`
  - `DELETE /v1/root-admin/tenants/:tenantId/organization-exports/:exportId`
- Request contract:
  create body selects export sections, visibility scope (`current_only` or
  `include_retained`), Organization scope (`selected_organization_only` or
  `include_child_branch`), and optional select-all expansion. Deleted records
  are excluded. Integration records are excluded from v1 Organization exports.
  Export copies are personal to the requesting root admin. Retry may reuse
  previous options or submit changed options. Cancel is allowed while queued or
  running.
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
  JSON plus file assets are the v1 export format.
- Error contract:
  `ORGANIZATION_EXPORT_INVALID_REQUEST`, `ORGANIZATION_EXPORT_NOT_FOUND`,
  `ORGANIZATION_EXPORT_LIMIT_EXCEEDED`, `ORGANIZATION_EXPORT_NOT_READY`,
  `ORGANIZATION_EXPORT_CANCELLED`, `ORGANIZATION_EXPORT_PIN_FORBIDDEN`,
  `ORGANIZATION_EXPORT_EXPIRED`, `ORGANIZATION_EXPORT_FORBIDDEN`, and shared
  middleware errors.

## Persistence / Side Effects

- Durable writes:
  Organization records, child records, catalogue values, logo relationships,
  export requests, export status records, and audit/failure evidence according
  to future data dictionary pages.
- Audit effects:
  create, update, archive, restore, move, reference-value mutation, logo
  upload/replacement/removal, export request/status/download/delete, cleanup
  failures, and sensitive denials require audit evidence.
- Cross-feature reads:
  assets for logo upload/read/link/delete semantics; user and role public
  identity seams for memberships; job processing for exports; tenant/root auth
  and platform authorization seams for authority.
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
  names, exact field names, and permission keys exist for S-004 through S-009;
  UI screens and later Organization-domain route groups remain separate tasks.
  Backwards compatibility is required by default once any route is implemented.

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
  hierarchy rules, lifecycle validation, catalogue replacement, logo
  relationship readiness, export request validation.
- Integration:
  root route protection, persistence-backed record lifecycle, grouped search,
  logo/asset relationship, export job status and private download.
- Security:
  root capability denial, tenant/account object denial, raw URL denial, private
  export denial, and deferred integration route denial.
- Audit:
  mutation, denied access, logo processing/cleanup, and export lifecycle
  evidence.
- Edge:
  client-supplied system fields, empty strings, invalid filters, depth/cycle
  limits, unavailable export, and removed logo placeholder behavior.
