# Root Admin Browser Auth Shell

## Purpose

Introduce a first-phase root-admin browser experience that proves the platform
can support a real frontend without weakening the existing root-user auth
model.

This phase adds:

1. a same-origin SPA auth shell
2. browser-friendly cookie session transport
3. SSH proof completion through a localhost signing helper that uses the
   workstation's OpenSSH tooling rather than parsing private keys directly in
   app-managed crypto code
4. session bootstrap, logout, and session-expiry UX

The phase is intentionally narrow. It is not the full root-admin dashboard.

---

## Scope

This phase includes:

- same-origin root-admin SPA delivery
- composed same-origin runtime model
- password-stage root login from the browser
- SSH challenge completion from the browser through a localhost helper
- secure HTTP-only cookie browser session
- current-session bootstrap endpoint for the SPA
- logout flow
- session-expiry flow
- minimal authenticated shell screen that shows current user/session info
- manual install/reinstall flow for the localhost helper
- CSP hardening for the new browser surface

This phase does **not** include:

- tenant admin frontend
- tenant, billing, or user-management screens
- the full root-admin dashboard
- GraphQL
- public brochure pages
- SSR for the admin app
- background processing
- broad external integration API redesign

---

## Architectural Decisions

### Frontend topology

- external topology: same-origin
- internal/runtime topology: composed same-origin
- render model: SPA

This keeps cookie auth, CSP, and browser-origin handling simple while allowing
the frontend app to grow independently over time.

### Capability placement rule

The admin app is SPA by default, but each capability must still be evaluated
for where execution belongs.

- interactive shell and admin workflows are browser-rendered/orchestrated
- heavyweight report, CSV, PDF, or export generation remains server-executed
  and delivered to the browser

SSR remains a separate future consideration for brochure/public pages rather
than the admin shell.

### API stance

- the initial frontend integration surface remains REST
- GraphQL stays a deliberate future option for internal admin UX only if real
  UI complexity justifies it later

---

## Root Login Browser Flow

### Desired flow

1. browser submits email + password to `POST /v1/root-auth/login/password`
2. backend returns a one-time SSH login challenge and the registered active SSH
   keys for that auth principal
3. browser selects a registered fingerprint
4. browser calls the localhost signing helper
5. helper signs only valid root-login challenges
6. browser submits challenge proof to a browser-oriented SSH completion route
7. backend creates the authenticated session and sets a secure cookie
8. SPA bootstraps authenticated state through a current-session endpoint

### Localhost helper

The helper is intentionally narrow:

- localhost HTTP only
- one trusted admin origin in phase one
- manual install
- no per-login user approval
- validates challenge structure before signing
- signs only root-login challenges for this platform
- returns only signature and fingerprint
- delegates key handling and signing to the workstation's OpenSSH tooling so
  the browser flow does not depend on Node/OpenSSL directly parsing SSH private
  key files
- phase-one install instructions must cover both bash-like shells and Windows
  PowerShell because the target root-user operator environment is cross-platform

The phase-one implementation may still use a small local Node-based HTTP shim,
but private-key operations should be performed through system OpenSSH tooling.
The helper should not require operators to convert their normal SSH key
material into a runtime-specific format just to complete browser login.

Helper endpoint:

- `POST http://127.0.0.1:<fixed-port>/v1/root-auth/sign-login-challenge`

Request:

- `challengeText`
- `publicKeyFingerprint`

Response:

- `signature`
- `publicKeyFingerprint`

If the helper is missing or unreachable, the browser UX should show that the
helper is required and offer install/reinstall entry points. Product UX should
not attempt full troubleshooting beyond that.

If helper startup fails because the workstation lacks required prerequisites,
the helper and install guidance must report that clearly and specifically
rather than failing with low-level crypto errors.

---

## Browser Session Model

### Cookie policy

- cookie transport for browser auth
- `HttpOnly`
- `Secure` in production
- `SameSite=Strict`

The backend remains the source of truth for whether the session is valid.
Bearer sessions remain supported for existing API/manual workflows.

### Session lifetime

- idle timeout: 30 minutes
- absolute maximum lifetime: 12 hours
- valid authenticated activity extends the active browser session within the
  absolute maximum

### Session bootstrap

The SPA needs a dedicated browser bootstrap endpoint.

It must return only:

- `rootUserId`
- `authPrincipalId`
- display/email summary
- `expiresAt`

### Session expiry UX

There is no silent recovery in phase one.

When a browser session expires:

- authenticated shell state is cleared
- visible shell content is blurred
- a modal explains that the session expired
- the user is returned to the login flow through an explicit CTA

---

## Browser Security Policy

Because the service is now serving browser HTML, CSP is no longer deferred for
this surface.

Policy direction:

- least privilege
- allow only the minimum script and network surface needed for the current
  auth shell
- allow API calls only to:
  - the same-origin backend
  - the fixed localhost helper origin

Phase-one direction:

- `default-src 'self'`
- `script-src 'self'`
- `connect-src 'self' http://127.0.0.1:<fixed-port>`

Additional allowances must be justified by real frontend capability needs, not
pre-emptively added.

---

## Repo And Seams

- preserve current backend feature modularity under `src/features/*`
- do not mix browser UI concerns into backend domain/persistence/transport
  folders
- add the SPA as a separate app area in the repo
- backend feature behavior remains exposed through HTTP contracts, not internal
  imports
- same-origin runtime does not imply merged backend/frontend module boundaries

---

## Acceptance Criteria

This phase is complete when:

1. a browser can complete root login without manually handling a bearer token
2. the root-admin SPA loads from the same origin as the backend
3. the localhost helper signs only valid root-login challenges using
   workstation OpenSSH tooling rather than runtime-managed private-key parsing
4. the browser receives a secure root-admin session cookie after successful SSH
   completion
5. the SPA can bootstrap current-session state through a dedicated endpoint
6. logout revokes the server-side session and clears browser session state
7. session expiry produces the planned blurred-shell + modal UX
8. CSP is enabled for the browser surface with only the minimum required
   allowances
9. browser-session behavior is covered by executable tests and PRD traceability
10. the documented helper flow is usable on Windows PowerShell and bash-like
    shells without requiring ad hoc key-format conversion workarounds

---

## Standards Gate Review

### NIST SSDF

- Status: Partial
- Notes:
  - The browser auth shell is documented through a PRD and ADRs, keeps
    security-sensitive logic server-side, and is covered by executable
    integration, security, and audit tests.
  - Browser session behavior, helper interaction, and session-expiry behavior
    are intentionally narrow and traceable.
  - Remaining work is stronger release-integrity and operational evidence for
    the localhost helper distribution/update path, plus removal of
    secret-looking bootstrap defaults from runtime configuration.

### OWASP ASVS

- Status: Partial
- Notes:
  - The browser flow preserves centralized server-side authentication, requires
    full password-plus-SSH proof before session creation, uses strict
    HTTP-only cookie transport, and enforces trusted browser origin checks on
    browser logout.
  - CSP, auth abuse controls, and audit-visible login/logout behavior are in
    place.
  - Remaining work is hardening the localhost helper install/update trust model
    beyond the current phase-one convenience flow, not the absence of core
    auth/session controls.

### NIST CSF 2.0

- Status: Partial
- Notes:
  - The change improves Protect and Detect through strict browser session
    handling, CSP, audit events, and helper-origin restrictions.
  - The helper/browser flow has a fail-fast server dependency check for
    `ssh-keygen`, and the browser session model has explicit expiry and logout
    behavior.
  - Remaining work is a fuller operational note covering named owner,
    monitoring signals, disablement, and recovery steps for the privileged
    helper/browser path before calling the rollout production-ready.
  - That operational note now exists in
    [`root-admin-browser-auth-runbook.md`](/home/gordon/kanbien/docs/operations/root-admin-browser-auth-runbook.md).

### ISO 27001 / 27002

- Status: Partial
- Notes:
  - The design is traceable through PRD, ADRs, feature docs, and executable
    tests.
  - The phase-one browser shell remains intentionally narrow and preserves
    backend/frontend modular seams.
  - Operational/runbook evidence now exists in
    [`root-admin-browser-auth-runbook.md`](/home/gordon/kanbien/docs/operations/root-admin-browser-auth-runbook.md),
    but the helper distribution/update path still needs later hardening for
    privileged operator use.

### GDPR / Data Transfer

- Status: Partial
- Notes:
  - The browser auth shell processes personal data including login email, root
    user identity summary, request IP address, and user agent in auth/audit
    flows.
  - The current design keeps the data use tied to authentication and security
    monitoring rather than broad secondary use.
  - A privacy/data-flow note now exists in
    [`root-auth-and-root-admin-data-flow.md`](/home/gordon/kanbien/docs/privacy/root-auth-and-root-admin-data-flow.md),
    but deployment/support geography and fuller retention handling still need
    a stronger privacy pass.

### EU AI Act

- Status: Not applicable
- Notes:
  - This change introduces no AI capability.

---

## Risks And Follow-Ups

- helper installation and workstation setup may still be the largest
  operational adoption risk, even after moving signing onto system OpenSSH
- the no-approval helper model is a conscious convenience trade-off and should
  be revisited if workstation risk increases
- stricter helper trust partitioning by environment may be needed later
- the phase-one helper may still depend on local runtime packaging choices
  (for example a Node-based shim) until a more productized packaged helper
  exists
- tenant-admin frontend and external integration APIs remain separate future
  planning efforts
- GraphQL remains a future internal option, not a current dependency
