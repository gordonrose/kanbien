# Root Auth Public Login API Contract

## Scope

- Contract name: `root-auth-public-login`
- Feature: `rootAuth`
- Route family or capability group: Unauthenticated login routes that issue the
  SSH challenge and complete authentication
- In-scope routes:
  - `POST /v1/root-auth/login/password`
  - `POST /v1/root-auth/login/ssh`
- Out-of-scope but closely related routes:
  - `POST /v1/root-auth/browser/login/ssh`
  - protected `/v1/root-auth/*` session-management and credential-management
    routes

## Capability

- Feature: `rootAuth`
- Capability: Authenticate an existing root user through password plus SSH
  proof and create a server-backed session only after both stages succeed

## Authentication

- Required auth state: Unauthenticated/public caller
- Session transport(s): No prior session required; success returns a bearer
  `sessionId` in the JSON payload

## Authorization

- Allowed roles: Public unauthenticated callers attempting root-user sign-in
- Denied roles: n/a at the route boundary beyond standard public abuse controls
- Enforcement point: Feature-local public route mounting plus public-auth
  throttling and auth-abuse protection

## Middleware And Platform Effects

- Route protection middleware: None for prior authentication; these are public
  endpoints
- Rate limiting / abuse controls:
  - shared public-auth rate limiting may return `429 AUTH_THROTTLED`
  - root-auth abuse protection may return `429 AUTH_LOCKED_DOWN`
  - public-auth rate limiting writes audit-visible rate-limit events
- Browser-specific behavior: None in this route family; browser login uses a
  separate route because its success transport is a cookie-backed shell session
- Other shared platform behavior: Unknown errors fall through to app-level JSON
  error middleware

## Route

- Method: `POST`
- Path:
  - `/v1/root-auth/login/password`
  - `/v1/root-auth/login/ssh`

## Request Contract

- Params:
  - none
- Query:
  - none
- Body:
  - password stage: `{ email, password }`
  - SSH stage: `{ challengeId, signature, publicKeyFingerprint }`
- Validation rules:
  - password-stage `email` is trimmed, validated, and normalized to lowercase
  - password must be non-empty
  - `challengeId` must match `chal_<lowercase-or-digit-id>`
  - `signature` and `publicKeyFingerprint` must be non-empty trimmed strings

## Response Contract

- Success payload:
  - password stage returns:
    `{ status: "SSH_CHALLENGE_REQUIRED", challengeId, challengeText, availableSshKeys }`
  - `availableSshKeys` contains `{ keyId, label, fingerprint }` items for
    active SSH keys owned by the resolved auth principal
  - SSH stage returns:
    `{ status: "AUTHENTICATED", sessionId, authPrincipalId, rootUserId, authenticatedAt, expiresAt }`
- Status code:
  - `200` for both stages on success
- Response headers or cookies:
  - no cookies in this route family

## Error Contract

- Error codes:
  - feature-local: `INVALID_REQUEST`, `INVALID_CREDENTIALS`,
    `ROOT_USER_SIGN_IN_BLOCKED`, `SSH_CHALLENGE_NOT_FOUND`,
    `SSH_CHALLENGE_EXPIRED`, `SSH_CHALLENGE_ALREADY_USED`,
    `INVALID_SSH_SIGNATURE`
  - shared platform/security: `AUTH_THROTTLED`, `AUTH_LOCKED_DOWN`
- Representative messages:
  - `INVALID_CREDENTIALS`: "The supplied credentials were not accepted."
  - `ROOT_USER_SIGN_IN_BLOCKED`: "This root user is not allowed to sign in."
  - `SSH_CHALLENGE_EXPIRED`: "That SSH challenge has expired."
- `details` shape:
  - when present: `{ field?: string, reason?: string }`
  - blocked sign-in uses `field: "rootUserId"` with reasons such as
    `inactive`, `deleted`, or `anonymized`
  - challenge and signature errors identify the relevant field
- Shared middleware errors:
  - none from auth-required middleware because the routes are public
  - public-auth rate limiting and lock-down responses are part of the effective
    route contract

## Persistence / Side Effects

- Durable writes:
  - password stage creates an `auth_login_challenges` row
  - successful SSH stage marks the challenge used and creates an `auth_sessions`
    row
- Audit effects:
  - password-stage success and failure write `auth_audit_events`
  - SSH-stage success and failure write `auth_audit_events`
  - abuse/rate-limit flows also emit audit-visible events
- Cross-feature reads:
  - reads root-user lifecycle/sign-in eligibility through the exported
    `createRootUsersAuthStateReader` seam
- Other side effects:
  - password stage must not create a session
  - successful SSH stage clears stored abuse-failure state for the account/IP

## Compatibility / Lifecycle Notes

- Notes:
  - Session creation happens only after the SSH stage succeeds.
  - Generic credential failure remains intentionally ambiguous at the public API
    level.
  - The backend accepts both the legacy raw SSH signature path and the newer
    OpenSSH-native browser-helper format during verification.

## Traceability

- PRD / design docs:
  - `docs/prd/2026-03-25-0001-root-auth.md`
  - `docs/featureDocs/rootAuth-feature.md`
- OpenAPI:
  - `docs/swagger/openapi.yaml` paths
    `/v1/root-auth/login/password` and `/v1/root-auth/login/ssh`
- Tests required or existing:
  - PRD-derived test cases should cover bad password, unknown email, blocked
    root user, expired challenge, reused challenge, wrong key, and successful
    session creation

## Tests Required

- Unit:
  - email normalization
  - challenge creation and single-use validation
  - root-user sign-in eligibility enforcement
- Integration:
  - two-stage login success path
  - no session on password-only success
  - session creation on valid SSH proof
- Security:
  - generic credential failure behavior
  - public-auth throttling and lock-down behavior
  - revoked or wrong SSH key rejected
- Audit:
  - audit events on password-stage and SSH-stage success/failure
- Edge:
  - expired challenge
  - already-used challenge
  - inactive/deleted/anonymized linked root user
