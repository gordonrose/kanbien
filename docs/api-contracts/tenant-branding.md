# Tenant Branding API Contract

## Scope

- Contract name: `tenantBranding`
- Feature: `tenantBranding`
- Route family or capability group:
  Root-managed tenant branding configuration, tenant logo relationship, and
  tenant-dashboard branding projection.
- Implementation status:
  planned first slice; this is a source-independent first-draft contract for
  Layer 3 / Layer 4 planning, not an implemented route inventory.
- In-scope routes:
  - `GET /v1/root-admin/tenants/:tenantId/branding`
  - `PUT /v1/root-admin/tenants/:tenantId/branding`
  - `POST /v1/root-admin/tenants/:tenantId/branding/logo/upload-intents`
  - `PUT /v1/root-admin/tenants/:tenantId/branding/logo`
  - `GET /v1/root-admin/tenants/:tenantId/branding/logo/content`
  - `GET /v1/tenant-dashboard/branding`
  - `GET /v1/tenant-dashboard/branding/logo`
- Out-of-scope but closely related routes:
  - generic asset-library or public file-hosting routes
  - public logo/CDN routes
  - logo clear/remove routes
  - tenant-admin self-service branding routes
  - live-update or push-subscription routes for already-open dashboards

## Capability

- Feature:
  `tenantBranding`
- Capabilities:
  - `readTenantBrandingForRoot`
  - `saveTenantBrandingForRoot`
  - `createTenantLogoUploadIntent`
  - `replaceTenantLogoRelationship`
  - `readTenantLogoContent`
  - `readTenantDashboardBrandingProjection`
  - `recordTenantBrandingAuditEvidence`

## Authentication

- Required auth state:
  - authenticated root-admin browser or bearer session for root-admin routes
  - authenticated tenant session with exactly one current tenant context for
    tenant-dashboard routes
- Session transport(s):
  - root-admin same-origin browser session cookie where the root-admin shell is
    the caller
  - root-admin bearer session for API/manual callers if the protected root API
    route family supports it
  - tenant-side server-backed bearer/session transport for tenant-dashboard
    reads

## Authorization

- Allowed roles:
  - `RootUserAdmin` with the mapped root-admin tenant-branding capability for
    root-admin routes
  - authenticated tenant-side actor authorized in the current tenant context
    for tenant-dashboard branding projection and logo content reads
- Denied roles:
  - unauthenticated callers
  - root actors without the matching root-admin branding capability
  - tenant actors without exactly one current tenant context
  - actors attempting to use asset ownership as authority without tenant
    branding relationship authorization
  - any cross-tenant request where selected tenant, current tenant, branding
    owner, and asset tenant scope do not match the approved route context
- Enforcement point:
  `tenantBranding` owns the entity relationship authorization and tenant
  boundary check; `assets` owns upload, storage, readiness, private content
  streaming, and asset lifecycle invariants.

## Middleware And Platform Effects

- Route protection middleware:
  protected root-session middleware for root-admin routes and tenant-session
  middleware for tenant-dashboard routes.
- Rate limiting / abuse controls:
  upload-intent and byte-upload flows inherit the approved `assets` abuse,
  quota, expiry, and cleanup posture.
- Browser-specific behavior:
  root-admin UI must consume governed design-system seams and must not add
  app-page CSS. Tenant dashboard branding changes apply on next login or
  dashboard reload in v1.
- Other shared platform behavior:
  private logo bytes must be served through same-origin authenticated delivery
  with `nosniff`; permanent raw bucket URLs, signed public URLs, and public CDN
  delivery are not approved.

## Route: Read Root Tenant Branding

- Method:
  `GET`
- Path:
  `/v1/root-admin/tenants/:tenantId/branding`
- Request contract:
  - params:
    exact `tenantId`
  - query:
    none in v1
  - body:
    none
  - validation rules:
    normal reads exclude soft-deleted branding records and cannot request
    deleted rows through this route.
- Response contract:
  - success payload:
    active branding or approved absence state with `tenantId`, branding display
    name, primary colour, fallback indicators, current logo relationship
    summary, consumer-readiness status, and audit-safe timestamps
  - status code:
    `200`
- Error contract:
  - feature-local:
    `INVALID_TENANT_BRANDING_REQUEST`,
    `TENANT_BRANDING_TENANT_NOT_FOUND`,
    `TENANT_BRANDING_NOT_VISIBLE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`

## Route: Save Root Tenant Branding

- Method:
  `PUT`
- Path:
  `/v1/root-admin/tenants/:tenantId/branding`
- Request contract:
  - params:
    exact `tenantId`
  - body:
    `{ brandingDisplayName, primaryColorHex }`
  - validation rules:
    clients must not supply system-managed fields; empty display names are
    rejected; primary colour must be an approved hex value; the request body
    cannot override the selected tenant context.
- Response contract:
  - success payload:
    saved branding record with generated identifiers, timestamps, fallback
    indicators, and current logo relationship summary
  - status code:
    `200` for update, `201` if the implementation chooses create-on-first-save
    semantics
- Error contract:
  - feature-local:
    `INVALID_TENANT_BRANDING_REQUEST`,
    `TENANT_BRANDING_TENANT_NOT_FOUND`,
    `TENANT_BRANDING_VALIDATION_FAILED`,
    `TENANT_BRANDING_LIFECYCLE_CONFLICT`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`

## Route: Create Tenant Logo Upload Intent

- Method:
  `POST`
- Path:
  `/v1/root-admin/tenants/:tenantId/branding/logo/upload-intents`
- Request contract:
  - params:
    exact `tenantId`
  - body:
    `{ contentType, byteSize, checksumSha256?, originalFilename? }`
  - validation rules:
    allowed content types are `image/png`, `image/jpeg`, `image/webp`, and
    `image/svg+xml`; raster images are capped at 5 MB and SVG at 1 MB; upload
    intents are short-lived, single-use, actor-bound, scope-bound, and
    storage-key-bound.
- Response contract:
  - success payload:
    asset id, upload intent id, upload target metadata, expiry, and accepted
    constraints without permanent bucket URL, storage credentials, or raw
    storage path authority
  - status code:
    `201`
- Error contract:
  - feature-local:
    `TENANT_BRANDING_LOGO_INVALID`,
    `TENANT_BRANDING_LOGO_QUOTA_DENIED`,
    `TENANT_BRANDING_TENANT_NOT_FOUND`
  - assets:
    `INVALID_ASSET_REQUEST`, `ASSET_CONFLICT`,
    `ASSET_STORAGE_VERIFICATION_FAILED`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`

## Route: Replace Tenant Logo Relationship

- Method:
  `PUT`
- Path:
  `/v1/root-admin/tenants/:tenantId/branding/logo`
- Request contract:
  - params:
    exact `tenantId`
  - body:
    `{ assetId, altText?, decorative? }`
  - validation rules:
    the asset must be ready, private, tenant-scoped to the same tenant, and
    allowed by the approved tenant-logo asset decision; the request must record
    either contextual alt text or explicit decorative posture; clear/remove is
    rejected in v1.
- Response contract:
  - success payload:
    current logo relationship with readiness state, accessibility posture,
    fallback indicators, and prior logo dereference posture
  - status code:
    `200`
- Error contract:
  - feature-local:
    `TENANT_BRANDING_LOGO_INVALID`,
    `TENANT_BRANDING_LOGO_NOT_READY`,
    `TENANT_BRANDING_LOGO_METADATA_REQUIRED`,
    `TENANT_BRANDING_LOGO_TENANT_MISMATCH`,
    `TENANT_BRANDING_LOGO_CLEAR_NOT_SUPPORTED`
  - assets:
    `ASSET_NOT_FOUND`, `ASSET_CONFLICT`, `ASSET_FORBIDDEN`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`

## Route: Read Root Logo Content

- Method:
  `GET`
- Path:
  `/v1/root-admin/tenants/:tenantId/branding/logo/content`
- Request contract:
  - params:
    exact `tenantId`
  - query:
    none in v1
  - body:
    none
- Response contract:
  - success payload:
    same-origin image stream for the current consumer-ready logo
  - status code:
    `200`
  - response headers:
    safe `Content-Type`, `Content-Length` when known,
    `X-Content-Type-Options: nosniff`, private cache posture
- Error contract:
  - feature-local:
    `TENANT_BRANDING_LOGO_NOT_AVAILABLE`,
    `TENANT_BRANDING_LOGO_NOT_READY`,
    `TENANT_BRANDING_LOGO_TENANT_MISMATCH`
  - assets:
    `ASSET_NOT_FOUND`, `ASSET_CONFLICT`, `ASSET_FORBIDDEN`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`

## Route: Read Tenant Dashboard Branding Projection

- Method:
  `GET`
- Path:
  `/v1/tenant-dashboard/branding`
- Request contract:
  - params:
    none
  - query:
    none in v1
  - body:
    none
  - validation rules:
    current tenant context comes only from the authenticated server-side
    tenant session context.
- Response contract:
  - success payload:
    `{ tenantId, displayName, primaryColorHex, logoUrl, logoAccessibility, fallbackIndicators, appliesOn }`
  - fallback behavior:
    canonical tenant name for missing branding display name, platform default
    primary colour for missing or invalid colour, and `null` logo for missing,
    not-ready, metadata-incomplete, or cross-tenant-denied logo states
  - status code:
    `200`
- Error contract:
  - feature-local:
    `TENANT_BRANDING_CURRENT_TENANT_REQUIRED`,
    `TENANT_BRANDING_TENANT_NOT_FOUND`,
    `TENANT_BRANDING_PROJECTION_UNAVAILABLE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`

## Route: Read Tenant Dashboard Logo Content

- Method:
  `GET`
- Path:
  `/v1/tenant-dashboard/branding/logo`
- Request contract:
  - params:
    none
  - query:
    none in v1
  - body:
    none
- Response contract:
  - success payload:
    same-origin image stream for the current tenant's consumer-ready logo
  - status code:
    `200`
  - response headers:
    safe `Content-Type`, `Content-Length` when known,
    `X-Content-Type-Options: nosniff`, private cache posture
- Error contract:
  - feature-local:
    `TENANT_BRANDING_CURRENT_TENANT_REQUIRED`,
    `TENANT_BRANDING_LOGO_NOT_AVAILABLE`,
    `TENANT_BRANDING_LOGO_NOT_READY`
  - assets:
    `ASSET_NOT_FOUND`, `ASSET_CONFLICT`, `ASSET_FORBIDDEN`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`

## Persistence / Side Effects

- Durable writes:
  tenant branding save creates or updates an active tenant branding record;
  logo replacement creates or updates the current logo relationship and records
  prior logo dereference posture.
- Audit effects:
  audit evidence is mandatory for create/update, denied writes, denied reads,
  upload intent creation, quota denial, upload/link mismatch, cross-tenant
  denial, replacement, and cleanup-sensitive failures.
- Cross-feature reads:
  - `tenants` supplies exact tenant existence and canonical tenant-name
    fallback.
  - `assets` supplies upload intent creation, asset readiness validation,
    metadata read, private content streaming, and cleanup posture.
  - `tenantAuth` supplies current tenant context for tenant-dashboard reads.
- Other side effects:
  branding save must not mutate canonical tenant identity; logo relationship
  authorization must occur before asset content read.

## Lifecycle / Cleanup

- Expiry behavior:
  logo upload intents expire according to `assets` policy and cannot later
  become current logo relationships.
- Abandoned or partial-state behavior:
  abandoned pending logo uploads remain non-consumable and follow the assets
  cleanup lifecycle.
- Orphaned external resource handling:
  abandoned, rejected, or replaced asset bytes remain governed by assets
  cleanup, retention, quota, and audit behavior.
- Cleanup trigger:
  assets support command or future scheduler/job seam.
- Cleanup retry and failure recording:
  failed cleanup remains durable, visible to operations, and retryable through
  the assets cleanup posture.
- Quota or cost accounting during pending cleanup:
  pending and failed-cleanup logo records continue to count against quota,
  cost, and abuse limits until cleanup succeeds or a later approved retention
  policy changes this rule.

## Compatibility / Lifecycle Notes

- This route family is additive and planned.
- Logo clearing/removal is explicitly out of scope for v1.
- Public delivery, signed public URLs, raw bucket URLs, generic asset-library
  behavior, tenant-admin self-service branding, broad portal theming, and live
  updates to already-open dashboards are not approved.
- Uploaded SVG requires sanitizer readiness before consumption and must never
  be injected directly into app DOM.
- OpenAPI and maintained Postman artifacts still need to be created after this
  first-draft contract is accepted.

## Traceability

- PRD / design docs:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- Capability matrix:
  `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-04-29-tenant-branding-configuration-story-breakdown.md`
- OpenAPI:
  not yet maintained for this planned route family
- Tests required or existing:
  PRD-derived test cases are still required before Task Breakdown handoff.

## Tests Required

- Unit:
  validation, fallback projection, lifecycle conflict, accessibility metadata,
  and relationship authorization tests.
- Integration:
  root-admin save/read, logo upload intent, logo replacement, root logo
  content read, tenant dashboard projection, tenant dashboard logo content.
- Security:
  unauthenticated, missing capability, cross-tenant mismatch, current tenant
  missing, body tenant spoofing, raw bucket URL denial, public access denial.
- Audit:
  successful and denied create/update/read/link operations, quota denial,
  mismatch, cleanup failure, and forbidden-field audit payload checks.
- Edge:
  soft-deleted branding, deleted tenant, not-ready asset, rejected asset,
  SVG sanitizer blocked, metadata-incomplete logo, abandoned upload, failed
  cleanup, and next-login/reload timing posture.
