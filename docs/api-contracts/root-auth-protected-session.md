# Root Auth Protected Session API Contract

## Scope

- Contract name: `root-auth-protected-session`
- Feature: `rootAuth`
- Route family or capability group: Protected credential-management and
  session-management API routes behind bearer auth
- In-scope routes:
  - `POST /v1/root-auth/principals`
  - `POST /v1/root-auth/password/change`
  - `POST /v1/root-auth/ssh-keys`
  - `GET /v1/root-auth/ssh-keys`
  - `DELETE /v1/root-auth/ssh-keys/{keyId}`
  - `GET /v1/root-auth/sessions`
  - `POST /v1/root-auth/sessions/{sessionId}/revoke`
  - `POST /v1/root-auth/logout`
- Out-of-scope but closely related routes:
  - public login routes under `/v1/root-auth/login/*`
  - browser-cookie routes under `/v1/root-auth/browser/*`

## Capability

- Feature: `rootAuth`
- Capability: Manage root-user auth principals, passwords, SSH public keys,
  current sessions, and owned session revocation through authenticated API
  routes

## Authentication

- Required auth state: Authenticated root-user session is required before any
  route in this family executes
- Session transport(s): `Authorization: Bearer <sessionId>`

## Authorization

- Allowed roles: Current root-user-authenticated boundary only
- Denied roles: Unauthenticated callers and any non-root actor model
- Enforcement point: Feature-local `router.use(requireRootSession)` after the
  public routes, followed by authenticated-sensitive rate limiting

## Middleware And Platform Effects

- Route protection middleware: Shared bearer-session middleware returns
  `401 UNAUTHORIZED` for missing bearer token and `401 INVALID_SESSION` for
  invalid or expired session
- Rate limiting / abuse controls: Shared authenticated-sensitive rate limiting
  applies to the entire protected subtree and may return `429 RATE_LIMITED`
- Browser-specific behavior: None in this family; routes are bearer-token API
  routes even if a browser shell exists elsewhere
- Other shared platform behavior: Feature-local `RootAuthError` mapping returns
  structured JSON error payloads

## Route

- Method: mixed
- Path: `/v1/root-auth/*` after protected middleware is mounted

## Request Contract

- Params:
  - `keyId` must match `key_<lowercase-or-digit-id>`
  - `sessionId` must match `sess_<lowercase-or-digit-id>`
- Query:
  - none for current protected routes
- Body:
  - principal create: `{ rootUserId, loginEmail, password }`
  - password change: `{ currentPassword, newPassword }`
  - add SSH key: `{ label, publicKey }`
  - list/revoke/logout routes do not require bodies
- Validation rules:
  - `rootUserId` must be a UUID
  - `loginEmail` is trimmed, validated, and normalized to lowercase
  - labels must be non-empty and at most 120 characters
  - passwords must be non-empty at the transport boundary; stronger password
    policy is enforced in domain logic

## Response Contract

- Success payload:
  - principal create:
    `{ authPrincipalId, rootUserId, loginEmail }`
  - password change: `{ status: "PASSWORD_CHANGED" }`
  - add SSH key:
    `{ keyId, label, algorithm, fingerprint, status, createdAt, revokedAt }`
  - list SSH keys: `{ items: RootAuthSshKeySummary[] }`
  - list sessions: `{ items: RootAuthSessionSummary[] }`
  - revoke session: `{ status: "SESSION_REVOKED" }`
  - revoke SSH key: `{ status: "SSH_KEY_REVOKED" }`
  - logout: `{ status: "LOGGED_OUT" }`
- Status code:
  - `201` for principal creation and SSH-key creation
  - `200` for reads and other mutations
- Response headers or cookies:
  - no route-family-specific cookies or headers

## Error Contract

- Error codes:
  - feature-local: `INVALID_REQUEST`, `AUTH_PRINCIPAL_EMAIL_ALREADY_EXISTS`,
    `ROOT_USER_NOT_FOUND`, `INVALID_CURRENT_PASSWORD`,
    `INVALID_NEW_PASSWORD`, `UNSUPPORTED_SSH_KEY_ALGORITHM`,
    `INVALID_SSH_PUBLIC_KEY`, `DUPLICATE_SSH_PUBLIC_KEY`,
    `SSH_PUBLIC_KEY_NOT_FOUND`, `SESSION_NOT_FOUND`
  - shared middleware/platform: `UNAUTHORIZED`, `INVALID_SESSION`,
    `RATE_LIMITED`
- Representative messages:
  - `AUTH_PRINCIPAL_EMAIL_ALREADY_EXISTS`: "That login email is already registered for root auth."
  - `INVALID_CURRENT_PASSWORD`: "The current password was not accepted."
  - `SESSION_NOT_FOUND`: "We could not find that session."
- `details` shape:
  - when present: `{ field?: string, reason?: string }`
  - principal-create duplicate email uses
    `{ field: "loginEmail", reason: "duplicate_email" }`
  - password-policy failures use
    `{ field: "newPassword", reason: <policy-reason> }`
- Shared middleware errors:
  - `401 UNAUTHORIZED` for missing bearer token
  - `401 INVALID_SESSION` for invalid/expired session
  - `429 RATE_LIMITED` from authenticated-sensitive throttling

## Persistence / Side Effects

- Durable writes:
  - create principal inserts `auth_principals` plus
    `auth_principal_root_user_links`
  - password change updates password hash and revokes sibling sessions
  - add/revoke SSH key writes `auth_ssh_public_keys`
  - revoke session/logout writes `auth_sessions.revoked_at`
- Audit effects:
  - principal creation, password change, SSH key add/revoke, session revoke,
    and logout all write `auth_audit_events`
- Cross-feature reads:
  - principal creation confirms target root user existence through the exported
    `createRootUsersAuthStateReader` seam
- Other side effects:
  - list routes return ownership-scoped data only for the authenticated
    principal
  - password change revokes other sessions but leaves the current session
    usable

## Compatibility / Lifecycle Notes

- Notes:
  - The PRD describes a root-only administrative exception that may later allow
    broader cross-root credential management. The current implementation is
    still ownership-scoped for session and key management, with principal
    creation available to any authenticated root user in the current boundary.
  - `DELETE /v1/root-auth/ssh-keys/{keyId}` is documented here using the
    OpenAPI path form, while the Express route is implemented as
    `/ssh-keys/:keyId`.
  - The current revoke-key behavior is deterministic but not fully aspirationally
    idempotent in the PRD sense when the targeted owned row is no longer
    updatable.

## Traceability

- PRD / design docs:
  - `docs/prd/2026-03-25-0001-root-auth.md`
  - `docs/featureDocs/rootAuth-feature.md`
- OpenAPI:
  - protected `rootAuth` paths under `docs/swagger/openapi.yaml`
- Tests required or existing:
  - PRD-derived cases should cover password rotation, SSH key add/revoke,
    session listing, session revocation, logout, and principal creation

## Tests Required

- Unit:
  - password policy and current-password enforcement
  - duplicate SSH key rejection
  - ownership checks for session and SSH-key management
- Integration:
  - bearer-protected route access
  - principal creation, password change, key add/list/revoke, session
    list/revoke, and logout flows
- Security:
  - unauthorized access rejection
  - authenticated-sensitive throttling
  - revoked session can no longer access protected routes
- Audit:
  - audit event generation for every protected mutation capability
- Edge:
  - duplicate principal email
  - invalid current password
  - missing key or session target
