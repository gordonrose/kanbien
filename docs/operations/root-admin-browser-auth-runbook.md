# Root Admin Browser Auth Runbook

## Purpose

This runbook covers the operational model for the phase-one root-admin browser
auth shell and its localhost SSH signing helper.

It is intended for internal operators maintaining or troubleshooting root-user
browser login.

## Scope

This runbook covers:

- same-origin root-admin SPA login
- browser cookie session bootstrap and logout
- localhost signing helper startup and failure handling
- emergency disablement and rollback direction

This runbook does not cover future tenant-admin browser auth.

## Owner

- Primary owner: platform/backend maintainers responsible for `rootAuth`,
  root-admin browser auth, and shared platform security seams

## Components

- Browser shell:
  - [`router.ts`](/home/gordon/kanbien/src/frontend/rootAdminShell/router.ts)
  - [`app.mjs`](/home/gordon/kanbien/src/frontend/rootAdminShell/assets/app.mjs)
- Browser session middleware:
  - [`browserSession.ts`](/home/gordon/kanbien/src/lib/auth/browserSession.ts)
  - [`rootAdminCookie.ts`](/home/gordon/kanbien/src/lib/auth/rootAdminCookie.ts)
- Root auth browser endpoints:
  - [`router.ts`](/home/gordon/kanbien/src/features/rootAuth/transport/router.ts)
- Local helper:
  - [`root-auth-signer-helper.mjs`](/home/gordon/kanbien/src/rootAdminHelper/root-auth-signer-helper.mjs)
- Server-side OpenSSH verification:
  - [`ssh.ts`](/home/gordon/kanbien/src/features/rootAuth/domain/ssh.ts)

## Prerequisites

Required for browser login:

- application server running
- PostgreSQL available
- `ssh-keygen` available on the server
- local workstation helper running on `127.0.0.1`
- local workstation OpenSSH tooling available
- registered active `ssh-ed25519` key matching the root auth principal

## Expected Runtime Behavior

1. Browser submits email/password to `POST /v1/root-auth/login/password`
2. Backend returns SSH challenge and active SSH key options
3. Browser asks the localhost helper to sign the challenge
4. Browser completes `POST /v1/root-auth/browser/login/ssh`
5. Backend sets secure HTTP-only browser cookie
6. SPA bootstraps through `GET /v1/root-auth/browser/session`
7. Logout uses `POST /v1/root-auth/browser/logout`

## Monitoring And Evidence Signals

Use these signals first:

- server startup failure for missing OpenSSH verification dependency
- root auth audit events:
  - password stage success/failure
  - SSH stage success/failure
  - session revocation/logout
- platform-security rate-limit and auth-lockdown events
- browser helper startup errors in the local operator shell

Relevant test evidence:

- [`browserAuth.test.ts`](/home/gordon/kanbien/tests/integration/rootAdminShell/browserAuth.test.ts)
- [`browserSecurity.test.ts`](/home/gordon/kanbien/tests/security/rootAdminShell/browserSecurity.test.ts)
- [`audit.test.ts`](/home/gordon/kanbien/tests/audit/rootAdminShell/audit.test.ts)

## Common Failure Modes

### Helper unavailable

Symptoms:

- browser reports that the local signing helper is not available

Checks:

- helper process is running
- helper bound to `127.0.0.1:<configured-port>`
- `ROOT_ADMIN_ALLOWED_ORIGIN` matches the browser origin
- local workstation has Node.js and OpenSSH tooling available

### Server-side OpenSSH missing

Symptoms:

- application fails at startup before serving traffic

Checks:

- verify `ssh-keygen` is installed and on the server path

### Invalid or missing SSH key

Symptoms:

- password stage succeeds, SSH stage fails
- helper says it cannot find a usable matching key

Checks:

- matching active public key is registered on the auth principal
- local workstation still has the corresponding private key
- helper request fingerprint matches a discovered local key

### Browser session problems

Symptoms:

- browser cannot bootstrap session
- session immediately expires or logout fails

Checks:

- `ROOT_ADMIN_PUBLIC_ORIGIN` matches the served origin when deployed behind a
  proxy or composed same-origin setup
- cookie policy is appropriate for the environment
- browser is actually sending the session cookie

## Emergency Disablement

If the browser-auth shell must be disabled quickly:

1. stop serving `/root-admin` and the browser helper download routes
2. disable use of the browser login path by operational configuration or
   deployment rollback
3. keep bearer-token root auth available for controlled manual/admin use if
   needed
4. revoke active root-auth sessions if incident response requires containment

If helper usage itself is the concern:

- stop distributing the helper launcher
- instruct operators to stop the local helper
- continue using non-browser/manual root auth workflows until the issue is
  resolved

## Rollback Direction

Preferred rollback for browser-auth issues:

1. roll back the root-admin browser shell deployment
2. preserve existing backend `rootAuth` API and bearer-session behavior
3. keep durable auth/session/audit records intact
4. re-enable browser flow only after the issue is understood and tested

The browser shell should be treated as additive. Rolling it back must not
remove durable auth state or break existing API/manual root auth paths.

## Change Management Notes

Any future change to these areas should update this runbook:

- helper install/update model
- helper trust rules
- browser session cookie behavior
- browser origin handling
- disablement or rollback direction
