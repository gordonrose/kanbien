# Tenant Auth API Contract

## Scope

- Contract name: `tenantAuth`
- Feature: `tenantAuth`
- Route family or capability group:
  Public tenant-auth onboarding/login routes plus authenticated tenant-session
  routes
- In-scope routes:
  - `POST /v1/tenant-auth/principals/bootstrap`
  - `POST /v1/tenant-auth/password/setup`
  - `POST /v1/tenant-auth/login/password`
  - `GET /v1/tenant-auth/remediation`
  - `POST /v1/tenant-auth/remediation/password`
  - `GET /v1/tenant-auth/session`
  - `GET /v1/tenant-auth/tenant-contexts`
  - `POST /v1/tenant-auth/tenant-selection`
  - `POST /v1/tenant-auth/logout`

## Capability

- Feature: `tenantAuth`
- Capability:
  Bootstrap a reusable tenant-side principal from verified tenant-admin proof,
  establish credentials, create tenant sessions, and manage active tenant
  context

## Authentication

- Required auth state:
  - public for bootstrap, password setup, and login
  - authenticated tenant session for session read, tenant list, tenant
    selection, and logout
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for current authenticated routes

## Authorization

- Allowed roles:
  - public onboarding caller with valid proof for bootstrap and password setup
  - authenticated tenant-side principal for session routes
- Denied roles:
  - unauthenticated callers on protected tenant-session routes
  - callers attempting to select tenants outside their allowed access grants
- Enforcement point:
  shared `createRequireTenantSession(...)` middleware plus feature-local access
  validation against durable tenant access grants

## Request Contract

- `POST /v1/tenant-auth/principals/bootstrap`
  - body:
    `{ verificationToken }`
  - current proof model:
    consumes a tenant-admin verification token as the onboarding proof
- `POST /v1/tenant-auth/password/setup`
  - body:
    `{ bootstrapToken, newPassword, repeatPassword }`
- `POST /v1/tenant-auth/login/password`
  - body:
    `{ email, password }`
- `GET /v1/tenant-auth/remediation`
  - bearer tenant session required
- `POST /v1/tenant-auth/remediation/password`
  - bearer tenant session required
  - body:
    `{ newPassword, repeatPassword }`
- `GET /v1/tenant-auth/session`
  - bearer tenant session required
- `GET /v1/tenant-auth/tenant-contexts`
  - bearer tenant session required
- `POST /v1/tenant-auth/tenant-selection`
  - bearer tenant session required
  - body:
    `{ tenantId }`
- `POST /v1/tenant-auth/logout`
  - bearer tenant session required
  - no request body required

## Response Contract

- bootstrap returns:
  - principal summary
  - normalized login email
  - `passwordSetupRequired`
  - bootstrap token when password setup is still required
- password setup returns:
  - `PASSWORD_SET`
  - principal summary
  - `LOGIN_REQUIRED` next-step hint
- login returns one of:
  - `ONBOARDING_REQUIRED`
  - `AUTHENTICATED_SINGLE_TENANT`
  - `AUTHENTICATED_SELECTION_REQUIRED`
- login and session reads also return:
  - `remediationRequired`
  - `remediationReason`
  - `passwordPolicyRequirements` when a current tenant context exists and
    remediation is active
- remediation read returns:
  - whether remediation is currently required
  - remediation reason
  - active tenant context after one current tenant has been established
  - current tenant password-policy requirements
  - `TENANT_AUTH_REMEDIATION_CURRENT_TENANT_REQUIRED` when remediation is read
    before tenant selection has established a current tenant
- remediation password completion returns:
  - updated authenticated session state with remediation cleared when the new
    password is accepted
- authenticated session routes return:
  - principal summary
  - active tenant context when present
  - available tenant contexts
  - `selectionRequired`
  - remediation state
  - session timestamps

## Error Contract

- feature-local:
  - `INVALID_REQUEST`
  - `TENANT_AUTH_BOOTSTRAP_INVALID`
  - `TENANT_AUTH_BOOTSTRAP_EXPIRED`
  - `TENANT_AUTH_PASSWORD_SETUP_INVALID`
  - `TENANT_AUTH_PASSWORD_SETUP_EXPIRED`
  - `TENANT_AUTH_PASSWORD_ALREADY_SET`
  - `TENANT_AUTH_INVALID_CREDENTIALS`
  - `TENANT_AUTH_INVALID_NEW_PASSWORD`
  - `TENANT_AUTH_NO_TENANT_ACCESS`
  - `TENANT_AUTH_TENANT_NOT_ACCESSIBLE`
  - `TENANT_AUTH_REMEDIATION_CURRENT_TENANT_REQUIRED`
  - `TENANT_AUTH_REMEDIATION_NOT_REQUIRED`
- shared middleware:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `AUTH_THROTTLED`
  - `RATE_LIMITED`

## Persistence / Side Effects

- bootstrap may:
  - mark the supplied tenant-admin verification token used
  - mark the source tenant-admin verified
  - create one shared principal
  - create one or more tenant access grants for matching verified tenant-admin
    subjects
  - create one password-setup bootstrap token when password setup is still
    required
- password setup writes durable password credential state and marks the
  bootstrap token used
- login creates one durable tenant session and may mark it remediation-gated
- remediation completion updates the durable password credential and clears
  tenant-session remediation state
- tenant selection mutates `tenant_session.active_tenant_id`
- logout revokes the current tenant session
- bootstrap, password setup, login, tenant selection, and logout currently
  create durable security-audit events through the shared audit surface
- remediation completion creates a durable security-audit event

## Compatibility / Lifecycle Notes

- tenant-admin profile lifecycle remains owned by `tenantAdmins`
- one principal may accumulate multiple tenant access grants over time
- session contracts use generic `subjectType` and `subjectId` so future
  non-admin tenant actors can reuse the same API shape
- forgot-password reset, MFA, and final browser transport are intentionally out
  of scope in the current slice
