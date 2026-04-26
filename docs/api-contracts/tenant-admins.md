# Tenant Admins API Contract

## Scope

- Contract name: `tenantAdmins`
- Feature: `tenantAdmins`
- Route family or capability group:
  protected root-only tenant-admin lifecycle and verification backend routes,
  plus the public tenant-admin verification redemption route
- In-scope routes:
  - `POST /v1/tenants/{tenantId}/admins`
  - `GET /v1/tenants/{tenantId}/admins`
  - `GET /v1/tenants/{tenantId}/admins/{tenantAdminId}`
  - `PATCH /v1/tenants/{tenantId}/admins/{tenantAdminId}`
  - `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/verification/send`
  - `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/verification/resend`
  - `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/onboarding/restart`
  - `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/delete`
  - `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/reactivate`
  - `POST /v1/tenant-admin-verification/redeem`
- Out-of-scope but closely related routes:
  - `/v1/root-auth/*` routes that establish the protected root session required
    for operator routes
  - `/v1/notification-delivery/*` routes that own outbound email persistence
    and attempt history
  - `/v1/tenant-auth/*` routes that later complete password setup, login, and
    tenant sessions after verification redemption has already provisioned the
    tenant-auth identity

## Capability

- Feature: `tenantAdmins`
- Capability:
  manage durable tenant-admin profile records and tenant-admin email
  verification workflows while initiating reusable tenant-auth onboarding after
  successful public redemption

## Authentication

- Required auth state:
  - protected operator routes require an authenticated root-user session
  - `POST /v1/tenant-admin-verification/redeem` is public
- Session transport(s) for protected routes:
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` only in the current implemented slice
- Denied roles:
  unauthenticated callers, invalid root sessions, and any future narrower root
  role that lacks the governing tenant-admin capability
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus central
  `createRequireRootCapability(...)` checks using the mapped `tenant-admin.*`
  capability keys

## Middleware And Platform Effects

- Route protection middleware:
  protected routes reject missing accepted session transport with
  `401 UNAUTHORIZED` and invalid or expired sessions with `401 INVALID_SESSION`
- Rate limiting / abuse controls:
  - protected tenant-admin route family sits under shared
    authenticated-general throttling from the mounted `/v1/tenants` router
  - verification send and resend additionally use shared
    authenticated-sensitive throttling and may return `429 RATE_LIMITED`
  - public redemption uses shared public-write throttling and may return
    `429 RATE_LIMITED`
- Browser-specific behavior:
  the public redemption route is frontend-ready and does not require prior
  authentication; protected operator routes also accept the same root-admin
  browser session cookie as other root-managed features
- Other shared platform behavior:
  app-level JSON error middleware handles unexpected failures outside the
  feature-local error mapping

## Route

- Method:
  mixed
- Path:
  `/v1/tenants/{tenantId}/admins*` and `/v1/tenant-admin-verification/redeem`

## Request Contract

- Params:
  - `tenantId` is required where present and must be an exact UUID
  - `tenantAdminId` is required where present and must be an exact UUID
- Query:
  - `GET /v1/tenants/{tenantId}/admins` uses standard defaults:
    `page=1`, `pageSize=25`, `orderDirection=desc`
  - supported filters:
    `emailPrefix`, `firstNamePrefix`, `lastNamePrefix`,
    `emailVerificationStatus`, `createdAtFrom`, `createdAtTo`,
    `updatedAtFrom`, `updatedAtTo`
  - supported `orderBy` values:
    `updatedAt`, `createdAt`, `email`, `firstName`, `lastName`
- Body:
  - create:
    `{ email, firstName?, lastName?, profilePictureAssetId?, profilePictureAltText?, profilePictureDecorative? }`
  - update:
    at least one of
    `{ email?, firstName?, lastName?, profilePictureAssetId?, profilePictureAltText?, profilePictureDecorative? }`
  - verification send:
    no body
  - verification resend:
    `{ resendReason? }`
  - onboarding restart:
    no body
  - delete:
    no body
  - reactivate:
    no body
  - public redeem:
    `{ token }`
- Validation rules:
  - request bodies and query objects are strict; unexpected fields are rejected
  - `email` is trimmed and stored lowercase before persistence and uniqueness
    checks
  - empty strings are rejected rather than normalized to null
  - `profilePictureAssetId`, when supplied as a UUID, must reference a ready,
    private, tenant-scoped image asset whose tenant matches `{tenantId}`
  - `profilePictureAssetId: null` clears the profile-picture relationship and
    clears contextual accessibility metadata
  - a linked profile picture requires contextual `profilePictureAltText` or
    `profilePictureDecorative: true`
  - clients must not supply system-managed fields such as `tenantAdminId`,
    `tenantId`, `emailVerificationStatus`, `emailVerifiedAt`,
    `lastVerificationEmailRequestedAt`, `createdByRootAdminUserId`,
    `createdAt`, `updatedAt`, or `deletedAt`
  - update requires at least one field
  - resend reason, when present, must be a non-empty trimmed string
  - public redeem token must be a non-empty trimmed string

## Response Contract

- Success payload:
  - create, exact read, update, send, resend, delete, and reactivate return a
    tenant-admin summary:
    `{ tenantAdminId, tenantId, email, firstName, lastName, profilePictureAssetId, profilePictureUrl, profilePictureAltText, profilePictureDecorative, emailVerificationStatus, emailVerifiedAt, lastVerificationEmailRequestedAt, createdByRootAdminUserId, createdAt, updatedAt, deletedAt }`
  - `profilePictureUrl`, when present, is a same-origin display URL:
    `/v1/assets/{assetId}/content`
  - public redeem returns:
    `{ status, tenantAdmin, tenantAuthOnboarding }`
  - onboarding restart returns:
    `{ status, tenantAdmin, tenantAuthOnboarding }`
  - `tenantAuthOnboarding` includes:
    `{ authPrincipalId, loginEmail, passwordSetupRequired, bootstrapToken, nextStep }`
  - list returns a paginated list shape:
    `{ items, page, pageSize, totalPages, totalSearchableRecords, totalMatchingRecords }`
- Status code:
  - `201` for create success
  - `200` for reads, lists, updates, verification send/resend, onboarding
    restart, delete, reactivate, and public redeem
- Response headers or cookies:
  - no route-family-specific response headers or cookies

## Error Contract

- Error codes:
  - feature-local:
    - `INVALID_REQUEST`
    - `TENANT_ADMIN_NOT_FOUND`
    - `TENANT_ADMIN_EMAIL_ALREADY_EXISTS`
    - `TENANT_ADMIN_ALREADY_VERIFIED`
    - `TENANT_ADMIN_VERIFICATION_NOT_ELIGIBLE`
    - `TENANT_ADMIN_ONBOARDING_RESTART_NOT_ELIGIBLE`
    - `TENANT_ADMIN_VERIFICATION_TOKEN_INVALID`
    - `TENANT_ADMIN_VERIFICATION_TOKEN_EXPIRED`
    - `TENANT_ADMIN_ALREADY_DELETED`
    - `TENANT_ADMIN_NOT_DELETED`
  - shared middleware:
    - `UNAUTHORIZED`
    - `INVALID_SESSION`
    - `FORBIDDEN`
    - `RATE_LIMITED`
  - shared notification-delivery seam on send/resend:
    - `NOTIFICATION_SEND_FAILED`
    - `NOTIFICATION_PROVIDER_UNAVAILABLE`
    - `NOTIFICATION_PROVIDER_MISCONFIGURED`
  - shared asset seam on profile-picture linking:
    - `ASSET_NOT_FOUND`
    - `ASSET_FORBIDDEN`
    - `ASSET_CONFLICT`
- Representative messages:
  - duplicate active tenant-admin email:
    "That email address is already in use by another active tenant admin in this tenant."
  - already verified:
    "That tenant admin email address has already been verified."
  - invalid token:
    "That tenant-admin verification token is missing, invalid, or no longer accepted."
  - expired token:
    "That tenant-admin verification token has expired."
- `details` shape:
  - when present:
    `{ field?: string, reason?: string }`
  - representative reasons include:
    `unexpected_field`, `duplicate_active_email`, `already_verified`,
    `verification_not_eligible`, `invalid`, `expired`, `already_deleted`,
    `not_deleted`, `not_found`

## Persistence / Side Effects

- Durable writes:
  - create inserts a durable `tenant_admin` row with creator attribution and
    pending verification state, then automatically issues a fresh verification
    token and verification email
  - update changes editable profile fields, refreshes `updatedAt`, and resets
    verification state plus invalidates active tokens when `email` changes; if
    the tenant admin remains pending after the update, the feature also issues
    a fresh verification token and verification email automatically
  - create and update may link or clear a nullable tenant-scoped
    `profile_picture_asset_id` plus contextual accessibility metadata after
    validating the image asset through `assets.validateAssetForSubject`
  - verification send and resend issue feature-owned durable verification-token
    rows and update `lastVerificationEmailRequestedAt`
  - public redeem marks the chosen verification token used, marks the
    tenant-admin verified, provisions or reuses the tenant-auth principal, adds
    any missing tenant access grants for matching verified tenant-admin
    subjects, and issues a password-setup bootstrap token when the principal
    still requires initial password setup
  - onboarding restart reuses the same tenant-auth provisioning logic for an
    already verified visible tenant-admin and may issue a fresh password-setup
    bootstrap token when password setup is still required
  - soft delete stamps `deletedAt`, refreshes `updatedAt`, and invalidates
    active verification tokens
  - reactivate clears `deletedAt`, refreshes `updatedAt`, and restores
    verification state to `pending`
- Audit effects:
  - protected lifecycle and verification actions create success security audit
    events
  - profile-picture link and clear mutations write explicit success security
    audit events
  - denied capability-gated requests create shared platform security audit
    events through central authz middleware
  - public token redemption writes success and failure audit events
- Cross-feature reads:
  - reads visible tenant context through the public `tenants` seam
  - profile-picture linking validates image assets through the public `assets`
    seam
- Other side effects:
  - create, update-for-pending, verification send, and verification resend
    flow through the shared `notificationDelivery` seam with durable email and
    attempt history owned there
  - older active verification tokens are invalidated before a fresh accepted
    token is issued

## Compatibility / Lifecycle Notes

- Notes:
  - this contract reflects the current root-managed tenant-admin slice, not the
    later full tenant-auth foundation
  - `tenantAdmins` remains authoritative for tenant-admin lifecycle state and
    email verification state
  - public verification redemption is now the onboarding handoff point into
    reusable tenant-auth identity provisioning
  - shared tenant login, password setup, session issuance, and tenant
    selection are intentionally separate and handled by `tenantAuth`
  - tenant-admin self-service profile editing is intentionally deferred; this
    slice remains root-operated
  - reactivation is intentionally stricter than a pure visibility restore and
    requires reverification later

## Traceability

- PRD / design docs:
  - [2026-04-07-0006-tenant-admins-backend-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-07-0006-tenant-admins-backend-foundation.md)
  - [2026-04-08-tenant-admins-auth-ready-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-08-tenant-admins-auth-ready-foundation.md)
- OpenAPI:
  - [openapi.yaml](/home/gordon/kanbien/docs/swagger/openapi.yaml)
- Tests required or existing:
  - [2026-04-07-0006-tenant-admins-backend-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-07-0006-tenant-admins-backend-foundation-test-cases.md)

## Tests Required

- Unit:
  - email normalization and active-per-tenant uniqueness rejection
  - email-change reverification reset and token invalidation
  - verification send and resend eligibility rules
  - delete/reactivate semantics and active-token invalidation
  - public verification redemption behavior
- Integration:
  - protected operator-route enforcement through authenticated root session
  - end-to-end verification workflow across router, service, token seam,
    notification-delivery seam, and persistence
  - tenant-scoped list filtering and exact read behavior
- Security:
  - missing or invalid session rejection on protected routes
  - per-route tenant-admin capability allow and deny coverage
  - authenticated-sensitive throttling on verification send/resend
  - public-write throttling and malformed-token rejection on public redeem
- Audit:
  - successful operator lifecycle and verification actions remain visible
    through security audit events
  - public verification redemption success and failure remain visible through
    security audit events
