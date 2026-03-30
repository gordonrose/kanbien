# Root Auth Browser Session API Contract

## Scope

- Contract name: `root-auth-browser-session`
- Feature: `rootAuth`
- Route family or capability group: Same-origin browser shell session routes
  for the root-admin UI
- In-scope routes:
  - `POST /v1/root-auth/browser/login/ssh`
  - `GET /v1/root-auth/browser/session`
  - `POST /v1/root-auth/browser/logout`
- Out-of-scope but closely related routes:
  - `POST /v1/root-auth/login/password`
  - `POST /v1/root-auth/login/ssh`
  - protected bearer routes under `/v1/root-auth/*`

## Capability

- Feature: `rootAuth`
- Capability: Complete browser-oriented SSH login, expose minimal current
  browser-session summary, and support same-origin browser logout using an
  HTTP-only root-admin cookie backed by the shared `auth_sessions` table

## Authentication

- Required auth state:
  - browser login route: unauthenticated/public caller with a valid pending SSH
    challenge
  - browser session and logout routes: authenticated browser cookie session
- Session transport(s):
  - secure HTTP-only cookie named by `env.rootAdmin.sessionCookieName`
  - cookie is same-site strict, path `/`, and secure in production

## Authorization

- Allowed roles: Public caller for browser SSH completion; authenticated root
  browser session for session summary and logout
- Denied roles: Missing/invalid browser session cookie; untrusted browser
  origins on logout
- Enforcement point:
  - `createRequireRootBrowserSession(...)` for session summary and logout
  - `requireTrustedBrowserOrigin` for logout

## Middleware And Platform Effects

- Route protection middleware:
  - browser session middleware reads the session ID from the cookie rather than
    the `Authorization` header
  - missing cookie returns `401 UNAUTHORIZED`
  - invalid or expired cookie-backed session returns `401 INVALID_SESSION` and
    clears the cookie
- Rate limiting / abuse controls:
  - browser login route uses public-auth throttling and abuse controls
  - browser session and logout routes use authenticated-sensitive throttling and
    may return `429 RATE_LIMITED`
- Browser-specific behavior:
  - valid browser-session requests refresh the cookie and may extend session
    expiry using sliding idle-expiry rules capped by an absolute TTL
  - browser logout clears the cookie on success
  - browser session summary derives a display-friendly name from the exported
    `rootUsers` browser summary seam
- Other shared platform behavior:
  - logout requires a trusted `Origin` header and may return
    `403 BROWSER_ORIGIN_REQUIRED` or `403 UNTRUSTED_BROWSER_ORIGIN`

## Route

- Method:
  - `POST` for login and logout
  - `GET` for current browser session
- Path:
  - `/v1/root-auth/browser/login/ssh`
  - `/v1/root-auth/browser/session`
  - `/v1/root-auth/browser/logout`

## Request Contract

- Params:
  - none
- Query:
  - none
- Body:
  - browser login uses the same body as raw SSH completion:
    `{ challengeId, signature, publicKeyFingerprint }`
  - browser session and logout do not require a body
- Validation rules:
  - browser login inherits the same `challengeId`, `signature`, and
    `publicKeyFingerprint` validation as the raw SSH login route
  - browser logout additionally requires a trusted browser `Origin` header

## Response Contract

- Success payload:
  - browser login and browser session both return:
    `{ rootUserId, authPrincipalId, displayName, email, expiresAt }`
  - browser logout returns the status payload from the shared logout service:
    `{ status: "LOGGED_OUT" }`
- Status code:
  - `200` for all success paths
- Response headers or cookies:
  - browser login sets the root-admin session cookie
  - browser session refreshes the cookie on valid requests
  - browser logout clears the cookie

## Error Contract

- Error codes:
  - inherited auth/login errors on browser login:
    `INVALID_REQUEST`, `INVALID_CREDENTIALS`, `ROOT_USER_SIGN_IN_BLOCKED`,
    `SSH_CHALLENGE_NOT_FOUND`, `SSH_CHALLENGE_EXPIRED`,
    `SSH_CHALLENGE_ALREADY_USED`, `INVALID_SSH_SIGNATURE`,
    `AUTH_THROTTLED`, `AUTH_LOCKED_DOWN`
  - browser session middleware errors:
    `UNAUTHORIZED`, `INVALID_SESSION`
  - browser logout origin errors:
    `BROWSER_ORIGIN_REQUIRED`, `UNTRUSTED_BROWSER_ORIGIN`
  - shared rate limiting:
    `RATE_LIMITED`
- Representative messages:
  - `UNAUTHORIZED`: "Authentication is required to access this resource."
  - `INVALID_SESSION`: "Your session is invalid or has expired."
  - `UNTRUSTED_BROWSER_ORIGIN`: "The browser origin was not accepted for this action."
- `details` shape:
  - inherited feature and middleware errors may include
    `{ field?: string, reason?: string }`
  - origin-enforcement errors currently return only `code` and `message`
- Shared middleware errors:
  - browser-session middleware clears the cookie before returning auth errors
  - authenticated-sensitive throttling applies to session and logout routes

## Persistence / Side Effects

- Durable writes:
  - browser login marks the SSH challenge used and creates an `auth_sessions`
    row through the shared auth service
  - browser-session middleware may extend `auth_sessions.expires_at`
  - browser logout revokes the current session
- Audit effects:
  - browser login and logout share the same underlying auth audit behavior as
    the raw SSH completion and logout capabilities
- Cross-feature reads:
  - browser login and browser session both read minimal visible root-user
    identity data through `createRootUsersBrowserSummaryReader`
  - underlying auth completion still reads lifecycle eligibility through
    `createRootUsersAuthStateReader`
- Other side effects:
  - browser login and session convert root-user name/email into a
    display-friendly summary for the SPA

## Compatibility / Lifecycle Notes

- Notes:
  - The browser session is not a separate auth store; it is a different
    transport over the same server-backed `auth_sessions` records used by API
    bearer auth.
  - Same-origin protection is part of the effective logout contract.
  - Session expiry is sliding on activity but capped by an absolute maximum
    lifetime.

## Traceability

- PRD / design docs:
  - `docs/prd/2026-03-25-0001-root-auth.md`
  - `docs/featureDocs/rootAuth-feature.md`
  - ADR-backed browser auth architecture under `docs/architecture/adr/0013-*`
    and `0014-*`
- OpenAPI:
  - browser `rootAuth` paths under `docs/swagger/openapi.yaml`
- Tests required or existing:
  - browser login, browser session bootstrap, cookie refresh, trusted-origin
    logout, and invalid-cookie rejection should be covered

## Tests Required

- Unit:
  - cookie extraction
  - sliding expiry calculation
  - trusted-origin enforcement
- Integration:
  - browser SSH login sets cookie and returns session summary
  - browser session returns current summary from cookie-backed session
  - browser logout clears cookie and revokes session
- Security:
  - invalid cookie rejected
  - missing origin rejected on logout
  - untrusted origin rejected on logout
- Audit:
  - underlying login/logout audit event generation remains intact through the
    browser path
- Edge:
  - browser session refresh when idle expiry is extended
  - browser summary fallback when only email is available for display name
