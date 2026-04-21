# Tenant Admins Auth-Ready Foundation Implementation Blueprint

## Summary

- Feature:
  `tenantAdmins`
- Capability:
  root-managed tenant-admin actor lifecycle plus verification-ready workflows
  using the shared token seam and `notificationDelivery`
- Scope:
  backend feature slice only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-08-tenant-admin-auth-ready-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-tenant-admin-auth-ready-foundation-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-08-tenant-admin-auth-ready-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-tenant-admin-auth-ready-foundation-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-07-0006-tenant-admins-backend-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-07-0006-tenant-admins-backend-foundation.md)
- ADR(s):
  - [0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md](/home/gordon/kanbien/docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md)
  - [0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md](/home/gordon/kanbien/docs/architecture/adr/0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md)
  - [0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md](/home/gordon/kanbien/docs/architecture/adr/0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md)
- PRD test-case doc:
  [2026-04-07-0006-tenant-admins-backend-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-07-0006-tenant-admins-backend-foundation-test-cases.md)

## Scope Confirmation

This blueprint is for one coherent backend slice:

- add a new `tenantAdmins` feature under `src/features/tenantAdmins/`
- implement a root-managed tenant-admin actor/profile record scoped to one
  tenant
- keep the slice `auth-ready`, not `fully authenticated`
- provide protected operator routes for:
  - create
  - exact visible read
  - visible list
  - profile update
  - verification email send
  - verification email resend
  - soft delete
  - reactivate
- provide one public route for verification-token redemption
- persist durable verification-state fields on the tenant-admin row
- persist feature-owned verification token records for tenant-admin email
  verification
- use the shared token seam for token mechanics only
- use the `notificationDelivery` feature seam for email transport and durable
  outbound-email history only
- keep the feature compatible with the later shared tenant-auth loop

This blueprint does **not** include:

- tenant-admin login
- tenant-admin browser session creation
- shared non-root principal creation
- initial password set
- forgot-password reset
- tenant selection or current-tenant resolution
- tenant memberships
- tenant role assignment
- tenant-admin-managed creation of memberships or tenant users
- permanent remove
- frontend tenant-admin screens

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  none in this slice
- Permission visibility behavior:
  future root-admin UI may expose the protected operator APIs only to actors
  granted the governing `tenant-admin.*` capabilities
- Session / expiry behavior:
  protected operator routes rely on the existing root authenticated session
  model from `rootAuth`
- Browser security considerations:
  the public verification-redemption route is API-only in this phase and does
  not require browser-shell behavior yet

## Backend Plan

- Protected operator routes:
  - `POST /v1/tenants/:tenantId/admins`
  - `GET /v1/tenants/:tenantId/admins/:tenantAdminId`
  - `GET /v1/tenants/:tenantId/admins`
  - `PATCH /v1/tenants/:tenantId/admins/:tenantAdminId`
  - `POST /v1/tenants/:tenantId/admins/:tenantAdminId/verification/send`
  - `POST /v1/tenants/:tenantId/admins/:tenantAdminId/verification/resend`
  - `POST /v1/tenants/:tenantId/admins/:tenantAdminId/onboarding/restart`
  - `POST /v1/tenants/:tenantId/admins/:tenantAdminId/delete`
  - `POST /v1/tenants/:tenantId/admins/:tenantAdminId/reactivate`
- Public workflow route:
  - `POST /v1/tenant-admin-verification/redeem`
- Request/response/error contract:
  - create accepts:
    - `email`
    - optional `firstName`
    - optional `lastName`
  - create returns:
    - tenant-admin summary with verification-state fields
  - exact read returns:
    - one visible tenant-admin with verification-state fields
  - list follows repo pagination defaults and supports filters for:
    - `emailPrefix`
    - `firstNamePrefix`
    - `lastNamePrefix`
    - `emailVerificationStatus`
  - update accepts:
    - `email`
    - `firstName`
    - `lastName`
    - no ownership or auth fields
  - verification send and resend accept route params only in v1, with optional
    operator-visible reason if the final contract keeps it narrow
  - verification redemption accepts:
    - raw verification token only
  - onboarding restart returns:
    - tenant-admin summary
    - tenant-auth onboarding payload
  - use repo-standard authz and validation error shape
  - normalize workflow-specific failures into stable feature-owned codes such as:
    - `TENANT_ADMIN_NOT_FOUND`
    - `TENANT_ADMIN_EMAIL_ALREADY_EXISTS`
    - `TENANT_ADMIN_ALREADY_VERIFIED`
    - `TENANT_ADMIN_VERIFICATION_NOT_ELIGIBLE`
    - `TENANT_ADMIN_VERIFICATION_TOKEN_INVALID`
    - `TENANT_ADMIN_VERIFICATION_TOKEN_EXPIRED`
- Feature-local files expected:
  - `src/features/tenantAdmins/index.ts`
  - `src/features/tenantAdmins/integration.ts`
  - `src/features/tenantAdmins/README.md`
  - `src/features/tenantAdmins/contract/errors.ts`
  - `src/features/tenantAdmins/contract/schemas.ts`
  - `src/features/tenantAdmins/contract/types.ts`
  - capability-focused domain files, likely:
    - `createTenantAdmin.ts`
    - `getTenantAdmin.ts`
    - `listTenantAdmins.ts`
    - `updateTenantAdminProfile.ts`
    - `sendTenantAdminVerificationEmail.ts`
    - `resendTenantAdminVerificationEmail.ts`
    - `redeemTenantAdminVerificationToken.ts`
    - `softDeleteTenantAdmin.ts`
    - `reactivateTenantAdmin.ts`
  - `src/features/tenantAdmins/domain/presenters.ts`
  - `src/features/tenantAdmins/domain/types.ts`
  - `src/features/tenantAdmins/domain/service.ts`
  - `src/features/tenantAdmins/persistence/types.ts`
  - `src/features/tenantAdmins/persistence/repository.ts`
  - `src/features/tenantAdmins/persistence/postgresRepository.ts`
  - `src/features/tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql`
  - `src/features/tenantAdmins/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for protected operator routes
  - existing `createRequireRootCapability(...)` seam for route protection
  - existing platform security repository for protected-route rate limiting
  - existing root-auth request-context seam for root actor attribution
  - `tenants` public seam for tenant existence and tenant visibility checks
  - shared token seam under `src/lib/tokens/*` for token mechanics only
  - `notificationDelivery` public seam for email transport only
  - do not import `notificationDelivery/persistence/*` or `tenants/persistence/*`
    directly
- Authorization enforcement point:
  central route and service-boundary enforcement using shared root capability
  middleware plus feature-local workflow eligibility checks

## Repo File Layout Plan

- add a mounted feature under `src/features/tenantAdmins/`
- follow the same feature shape used by `tenants` and `notificationDelivery`
- keep `integration.ts` responsible for composing:
  - Postgres repository
  - `tenants` public seam dependency
  - token-seam helper usage
  - `notificationDelivery` public seam dependency
  - domain service
  - transport router
- export a narrow public seam from `src/features/tenantAdmins/index.ts` so the
  later shared tenant-auth loop can consume tenant-admin record lookups and
  verification state without reaching into persistence or transport internals
- keep token and transport ownership out of the feature:
  - token wire format and token verification stay in `src/lib/tokens/*`
  - email sending and durable outbound-email history stay in
    `src/features/notificationDelivery/`

## Integration Wiring Plan

- extend
  [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  to mount `createTenantAdminsFeature(...)` under the tenant route family
- extend the root capability catalog in
  [capabilityCatalog.ts](/home/gordon/kanbien/src/features/rootRoles/domain/capabilityCatalog.ts)
  with at least:
  - `tenant-admin.create`
  - `tenant-admin.read`
  - `tenant-admin.list`
  - `tenant-admin.update`
  - `tenant-admin.verification.send`
  - `tenant-admin.verification.resend`
  - `tenant-admin.onboarding.restart`
  - `tenant-admin.delete`
  - `tenant-admin.reactivate`
- treat `RootUserAdmin` as the initial granting role
- update permission-mapping artifacts in:
  - [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
  - [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
- add a public redemption route at `/v1/tenant-admin-verification/redeem`
  outside the protected operator family but still under the shared `/v1`
  platform router
- route classification recommendation:
  - protected operator routes should remain behind `requireRootSession`
  - verification send and resend should use the shared
    `authenticated-sensitive` protected-route rate-limit posture
  - public redemption route should use the public write rate-limit policy or a
    similar shared public-sensitive guard if already available

## Persistence Plan

- Entities / rows affected:
  - new durable `tenant_admin` table
  - new durable feature-owned `tenant_admin_verification_token` table
- Durable tenant-admin fields expected:
  - `tenant_admin_id` UUID primary key
  - `tenant_id` UUID foreign key
  - `email`
  - `normalized_email`
  - `first_name` nullable
  - `last_name` nullable
  - `email_verification_status`
  - `email_verified_at` nullable
  - `last_verification_email_requested_at` nullable
  - `created_by_root_admin_user_id`
  - `created_at`
  - `updated_at`
  - `deleted_at` nullable
- Durable verification-token fields expected:
  - `tenant_admin_verification_token_id` UUID primary key
  - `tenant_admin_id` foreign key
  - `token_id`
  - `purpose` with bounded value `email_verification`
  - `secret_hash`
  - `expires_at`
  - `used_at` nullable
  - `invalidated_at` nullable
  - `outbound_email_id` nullable for delivery correlation
  - `requested_by_actor_type`
  - `requested_by_actor_id`
  - `created_at`
- Migration changes:
  - create the durable `tenant_admin` table
  - create the durable tenant-admin verification token table
  - persist normalized email and verification-state columns explicitly
  - create foreign-key linkage to the owning tenant
  - do not persist raw verification-token secret material
  - keep token purpose bounded to the tenant-admin verification workflow in
    this slice
- Index or uniqueness changes:
  - primary keys on tenant-admin and verification-token IDs
  - unique active `(tenant_id, normalized_email)` on `tenant_admin`
  - index on `(tenant_id, deleted_at)` for visible list queries
  - index on `(tenant_id, email_verification_status)` for operator filtering
  - unique or strongly selective index on `token_id`
  - index on `(tenant_admin_id, invalidated_at, used_at)` for active-token
    supersession checks
  - index on `expires_at` for cleanup/read path efficiency
- Search/filter implications:
  - list endpoint follows repo defaults:
    - `page=1`
    - `pageSize=25`
    - `pageSize <= 100`
    - default order direction `desc`
  - searchable fields remain scalar:
    - `normalized_email`
    - `first_name`
    - `last_name`
    - `email_verification_status`
  - no global tenant-admin catalog
- Compatibility notes:
  - do not store password material on `tenant_admin`
  - do not let verification-token storage imply later principal/session shape
  - keep reactivation compatible with later shared-principal and membership
    linkage
  - if verification-state semantics evolve later, prefer additive migrations
    rather than rewriting the original shape

## Authorization And Safety Plan

- Implement the governing authz capability checks:
  - `tenant-admin.create`
  - `tenant-admin.read`
  - `tenant-admin.list`
  - `tenant-admin.update`
  - `tenant-admin.verification.send`
  - `tenant-admin.verification.resend`
  - `tenant-admin.delete`
  - `tenant-admin.reactivate`
- Enforce these safety rules in service and persistence logic, not only in
  route validation:
  - all operator routes require authenticated root session
  - all operator routes stay tenant-scoped by exact route tenant ownership
  - verification send and resend require visible unverified tenant-admin rows
  - onboarding restart requires a visible verified tenant-admin row
  - onboarding restart must not send a new verification email
  - verification send and resend stamp
    `lastVerificationEmailRequestedAt`
  - resend mints a fresh verification token and must not replay old
    secret-bearing content blindly
  - email changes reset verification state to `pending`
  - soft delete invalidates future verification eligibility
  - reactivation restores verification state to `pending`
  - successful verification redemption must not create a tenant session
  - public redemption must validate purpose expiry used-state and invalidation
    deterministically through shared token mechanics and feature-owned token
    metadata
  - durable email snapshots must never store raw verification-token secrets

## Testing Plan

- Unit tests expected under:
  - `tests/unit/tenantAdmins/`
- Integration tests expected under:
  - `tests/integration/tenantAdmins/`
- Security tests expected under:
  - `tests/security/tenantAdmins/`
- Audit tests expected under:
  - `tests/audit/tenantAdmins/`
- Likely test helper additions:
  - `tests/helpers/tenantAdminsHarness.ts`
  - optional feature-local factory helpers for tenant-admin rows and
    verification-token rows
- High-priority traceable cases from the PRD test-case doc:
  - `TC-TENANT-ADMINS-UNIT-001` through `009`
  - `TC-TENANT-ADMINS-INT-001` through `005`
  - `TC-TENANT-ADMINS-SEC-001` through `005`
  - `TC-TENANT-ADMINS-AUD-001` through `003`
  - `TC-TENANT-ADMINS-EDGE-001` through `005`
- Existing executable test areas likely to need follow-through:
  - shared protected-route smoke coverage
  - root capability-catalog assertions
  - public-route security coverage once redemption is mounted
  - cross-feature notification/token integration expectations

## Docs And Artifact Follow-Through

- Required docs/artifacts expected in the same loop:
  - `docs/api-contracts/tenant-admins.md`
  - `docs/swagger/openapi.yaml`
  - `docs/postman/` collection update or new maintained collection
  - `docs/featureDocs/tenantAdmins-feature.md`
  - `docs/data-dictionary/tenant-admin.md`
  - `docs/data-dictionary/tenant-admin-verification-token.md`
  - permission mapping docs under
    `docs/architecture/permission-mappings/`
  - PRD test-case status refresh if the repo treats it as a living artifact
  - AI/standards review note if implementation is materially AI-assisted
- Likely standards-baseline follow-through:
  - `docs/standards/platform-status/OWASP-ASVS-STATUS.md`
  - `docs/standards/platform-status/AI-ASSISTED-DEVELOPMENT-STATUS.md`
  - privacy/vendor posture files only if the slice materially changes the
    already-established notification-delivery baseline
- Likely architecture-map follow-through:
  - review whether `security-authorization-permissions-architecture.md`
    and tenant-related layers move because the platform now has a real
    tenant-owned actor/profile foundation
- Maintained-artifacts sweep should explicitly review:
  - older tenant-admin planning drafts for stale wording
  - README/index surfaces that inventory feature docs and data dictionary docs
  - standards snapshot wording whose truth changes because tenant-owned actor
    records and verification flows now exist

## Rebuild-Readiness Follow-Through

- Reconstruction questionnaire:
  no new interchangeable provider choice is introduced beyond the already
  established notification-delivery and token foundations
- Bootstrap guide:
  likely no new local helper daemon is required in this slice
  because email transport and token mechanics already have their own
  established bootstrap assumptions
- Script/helper behavior docs:
  update only if new tenant-admin test harnesses or local bootstrap helpers are
  introduced materially

## Sequencing Notes

- implementation should proceed in this order:
  1. persistence model and migration
  2. repository seam
  3. domain lifecycle capabilities
  4. verification-send workflow using token and notification seams
  5. public redemption workflow
  6. router wiring and capability enforcement
  7. tests
  8. source-independent docs and close-out review
- do not start designing tenant login/password/session behavior inside this
  slice
- keep the later shared tenant-auth loop as a separate follow-on design and
  implementation effort

## Decisions Now Locked In

- use a simple `pending/verified` verification-state enum
- email change for a verified tenant-admin forces reverification by resetting:
  - `emailVerificationStatus` to `pending`
  - `emailVerifiedAt` to `null`
- reactivation restores verification state to `pending`
- stamp `lastVerificationEmailRequestedAt` on the tenant-admin row
- use `authenticated-sensitive` rate limiting for verification send and resend

These should be treated as implementation inputs rather than reopened during
coding unless a concrete architecture conflict appears.
