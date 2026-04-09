# Tenant Auth Foundation Capability Matrix First Draft Notes

## Generated Artifact

- Matrix:
  [2026-04-09-tenant-auth-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-09-tenant-auth-foundation-capability-matrix-first-draft.csv)

## Direction Captured In This Draft

- The next slice should be a shared `tenantAuth` foundation, not a
  tenant-admin-only login feature.
- `tenantAdmins` stays a tenant-scoped actor/profile feature.
- `tenantAuth` owns:
  - shared non-root principal identity
  - password setup
  - login
  - tenant session issuance
  - tenant-session read
  - tenant-context listing
  - tenant-context selection
  - logout
- The first consumer is `tenantAdmins`, but the auth model must stay reusable
  for future tenant users with narrower tenant-scoped roles.

## Core Architecture Decision

- Authentication remains separate from tenant-scoped profiles.
- A person authenticates as a shared non-root principal.
- After login, the system resolves which tenant contexts that principal may
  enter.
- If only one tenant context exists, tenant selection is skipped.
- If multiple tenant contexts exist, the client must choose from a list.

This keeps the platform aligned with the earlier direction that:

- auth is its own thing
- tenant-scoped actor records are not the login identity itself

## Decisions Locked In

- Login email must be globally unique across non-root principals.
- A single principal can access multiple tenants.
- Tenant selection happens after login.
- Single-tenant access should auto-resolve without forcing a chooser step.
- Sessions are server-backed in this slice.
- The API must be frontend-ready even though no frontend implementation is in
  scope yet.

## What Frontend-Ready Means In This Slice

Frontend-ready does **not** mean building UI now.

It means the backend contracts should already be shaped for later browser or
app consumption:

- stable login, session, tenant-list, tenant-selection, and logout routes
- deterministic response states for:
  - invalid credentials
  - onboarding required
  - authenticated with one auto-selected tenant
  - authenticated with tenant selection required
  - invalid or expired session
- response shapes that already include:
  - principal summary
  - available tenant contexts
  - active tenant context when one is selected
  - session expiry metadata when appropriate
- error codes that a later frontend can branch on without redesign

The later frontend should be able to use this auth slice without needing the
API semantics to be rethought.

## What The First Slice Must Prove

- a verified tenant-admin can bootstrap into a reusable shared non-root
  principal
- that principal can set an initial password
- that principal can log in with globally unique email plus password
- successful login can resolve one of two truthful states:
  - authenticated with a single auto-selected tenant
  - authenticated but tenant selection required
- the platform can return a stable authenticated session read
- the platform can list available tenant contexts for the authenticated
  principal
- the platform can select an active tenant context on a server-backed session
- the platform can log out cleanly

## Relationship To Tenant Admins

This draft assumes the following sequence:

1. `tenantAdmins` creates and manages the tenant-scoped actor/profile
2. `tenantAdmins` verification proves email ownership
3. `tenantAuth` bootstraps a shared principal from that verified actor
4. `tenantAuth` owns credential setup and login

This means:

- `tenantAdmins` should not own password hashes or sessions
- `tenantAuth` should not own tenant-admin profile lifecycle

## Shared-Model Direction

The model implied by this draft is roughly:

- shared principal
- shared password credential
- shared tenant session
- durable principal-to-tenant-access linkage
- tenant-admin actor/profile linkage as the first concrete tenant-scoped actor

This should stay open to later support:

- one principal with multiple tenants
- one principal with multiple tenant-scoped actor types
- future tenant users who are not tenant admins

## Scope Choices For The First Tenant-Auth Slice

- In scope now:
  - principal bootstrap from verified tenant-admin
  - initial password setup
  - login
  - current session read
  - available-tenant-context list
  - active tenant selection
  - logout
- Out of scope now:
  - forgot-password reset
  - MFA
  - invitation models beyond current tenant-admin bootstrap
  - self-service profile editing
  - browser shell implementation
  - tenant-user CRUD
  - tenant role assignment UX
  - advanced session-device management

## Important Boundary To Preserve

This slice should be reusable for future tenant users.

So it should **not**:

- assume every authenticated tenant principal is a tenant admin forever
- encode tenant-admin-only fields into principal or session contracts
- make tenant selection depend on tenant-admin-specific transport behavior
- hard-code a one-principal-one-tenant model

## Session Direction

- Server-backed sessions are acceptable for the first slice.
- Active tenant selection should be stored on the server session for now.
- The design should not block later review of:
  - cookie transport
  - bearer-only transport
  - hybrid browser/API transport
  - more advanced session/device management

This draft treats transport details as important but not yet final.

## Compatibility Notes

This auth slice should stay compatible with:

- the existing `rootAuth` philosophy of separating authentication from
  business-profile records
- the current `tenantAdmins` auth-ready foundation
- future tenant memberships or tenant-user records
- later password reset and recovery workflows targeting the shared principal
  and shared credential model

## Main Questions To Carry Into The PRD

- what the durable linkage object between principal and tenant-scoped actor
  should be called in this repo
- whether initial password setup should create a session immediately or remain
  separate from login
- exactly how tenant-access lists should be represented in frontend-ready
  responses
- whether session read should always include the full accessible tenant list or
  whether that stays a separate route
- how tenant-auth throttling and lockout policy should align with or differ
  from `rootAuth`

## Good Resume Point For Tomorrow

If work resumes later, the next correct step is:

1. PRD for `tenantAuth` foundation
2. ADR check if the principal/linkage/session boundary needs a dedicated new
   ADR
3. PRD-derived test cases
4. implementation blueprint

The matrix and this notes file should be enough to restart without depending on
chat history.
