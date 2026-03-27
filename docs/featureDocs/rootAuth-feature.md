# Root Auth Feature Reference

## Purpose

The `rootAuth` feature provides authentication for `rootUsers`.
It owns:

- auth principal creation linked to a `rootUser`
- password verification and password change
- SSH public key registration and revocation
- one-time SSH login challenges
- opaque bearer sessions backed by server-side state
- auth audit events

It does not own root-user lifecycle state.
When auth needs sign-in eligibility data, it reads that through the exported
`rootUsers` auth-state seam rather than importing `rootUsers` persistence
internals directly.

## Where It Lives

- `src/features/rootAuth/contract`
- `src/features/rootAuth/domain`
- `src/features/rootAuth/persistence`
- `src/features/rootAuth/transport`
- `src/features/rootAuth/integration.ts`
- `src/features/rootAuth/index.ts`

## Platform Integration

Feature export:

- `createRootAuthFeature`

Mounting:

```ts
import { createRootAuthFeature } from "../../features/rootAuth";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";
import { dbPool } from "../../lib/db";

const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);

v1Router.use("/root-auth", createRootAuthFeature(dbPool, platformSecurityRepository));
```

Public auth routes also pass through shared public-auth rate limiting.
Protected routes use bearer-session middleware plus authenticated-sensitive rate
limiting.
The current platform mounts all `rootUsers` routes behind that auth seam.
`rootAuth` reads sign-in eligibility through the exported
`createRootUsersAuthStateReader` seam from the `rootUsers` feature.

## Current Auth Model

- login is two-stage: password first, SSH proof second
- successful password verification returns an SSH challenge only
- password-stage browser login also returns the active registered SSH key
  options for that auth principal so the SPA can choose a stored fingerprint
- session creation happens only after successful SSH challenge completion
- the backend accepts both the legacy raw SSH signature path and the browser
  helper's OpenSSH-native signature format so existing API/manual workflows
  remain compatible
- bearer tokens are opaque session IDs backed by `auth_sessions`
- the root-admin browser shell completes SSH login through browser-oriented
  endpoints that set a secure HTTP-only cookie backed by the same
  `auth_sessions` records
- browser SSH completion depends on a narrow localhost signing helper rather
  than browser-held private keys
- only root-user-authenticated callers can use protected `rootUsers` or
  protected `rootAuth` capabilities
- authenticated root users are a tiny operator set and may perform explicit
  root-only credential-management actions for other root users
- that privileged cross-user capability is a root-only exception and is not the
  default model for tenant admins or tenant users

## API Surface

Public routes:

- `POST /v1/root-auth/login/password`
- `POST /v1/root-auth/login/ssh`
- `POST /v1/root-auth/browser/login/ssh`
- `GET /v1/root-auth/browser/session`
- `POST /v1/root-auth/browser/logout`

Public auth throttling:

- repeated failed login behavior may return `429 AUTH_THROTTLED`
- temporary auth lockdown behavior may return `429 AUTH_LOCKED_DOWN`

Protected routes:

- `POST /v1/root-auth/principals`
- `POST /v1/root-auth/password/change`
- `POST /v1/root-auth/ssh-keys`
- `GET /v1/root-auth/ssh-keys`
- `DELETE /v1/root-auth/ssh-keys/:keyId`
- `GET /v1/root-auth/sessions`
- `POST /v1/root-auth/sessions/:sessionId/revoke`
- `POST /v1/root-auth/logout`

Transport notes:

- bearer token transport remains supported for API/manual use
- browser-shell transport uses a secure HTTP-only cookie for the same
  server-backed session records
- browser logout also validates a trusted same-origin browser origin before
  revoking the session

## Data And Security Notes

- passwords are stored as hashes, never plaintext
- only SSH public keys are stored
- SSH challenges are single-use and time-bounded
- revoked sessions and revoked SSH keys must not authenticate
- browser-session cookies are strict same-site, HTTP-only, and secure in
  production
- browser sessions use sliding expiry on valid authenticated activity with a
  hard maximum lifetime
- the root-admin helper path is intended to use workstation OpenSSH tooling for
  signing rather than depending on Node/OpenSSL to parse local private keys
- linked `rootUsers` that are inactive, soft-deleted, or anonymized are blocked
  from sign-in
- cross-feature lifecycle reads happen through the exported `rootUsers`
  auth-state seam, not through `rootUsers` private persistence adapters
- login endpoints are protected by shared public-auth rate limiting and
  root-auth abuse controls
- protected root-auth routes are protected by shared authenticated-sensitive
  rate limiting
- auth principal creation, login stages, password changes, SSH key changes,
  session revocation, logout, and bootstrap application must all be audit
  logged
- repeated failed auth behavior, rate limiting, and temporary lock-down events
  are also written to `auth_audit_events` as security-visible audit records

Supporting notes:

- operational runbook:
  [`root-admin-browser-auth-runbook.md`](/home/gordon/kanbien/docs/operations/root-admin-browser-auth-runbook.md)
- privacy/data-flow note:
  [`root-auth-and-root-admin-data-flow.md`](/home/gordon/kanbien/docs/privacy/root-auth-and-root-admin-data-flow.md)

## How To Try It

### Try it with Postman or another API client

Prerequisites:

- the app is running locally
- at least one active `rootUser` already exists
- that root user has an auth principal, a password, and at least one active SSH
  public key registered

Steps:

1. Send `POST /v1/root-auth/login/password` with:

```json
{
  "email": "root@example.com",
  "password": "your-password"
}
```

2. Confirm the response includes:
   - `challengeId`
   - `challengeText`
   - `availableSshKeys`

3. Pick one `availableSshKeys[*].fingerprint` value and sign the returned
   `challengeText` with the matching SSH private key outside the API.

4. Send `POST /v1/root-auth/login/ssh` with:

```json
{
  "challengeId": "chal_...",
  "signature": "base64-signature-here",
  "publicKeyFingerprint": "SHA256:..."
}
```

5. Copy the returned `sessionId`. Use it as:

```text
Authorization: Bearer <sessionId>
```

6. Try a protected route such as:
   - `GET /v1/root-auth/sessions`
   - `GET /v1/root-users`

7. When finished, send `POST /v1/root-auth/logout` with the same bearer token.

Notes:

- the OpenAPI route details live in [`openapi.yaml`](/home/gordon/kanbien/docs/swagger/openapi.yaml)
- repeated failed login attempts may return `429 AUTH_THROTTLED` or
  `429 AUTH_LOCKED_DOWN`

### Try it in the browser

Prerequisites:

- the app is running
- the same root-user prerequisites above are already in place
- Node.js is installed on the same machine as the browser for the phase-one
  local HTTP helper shim
- OpenSSH tooling is available on that machine because the helper signs through
  system SSH tooling rather than direct key parsing

Steps:

1. Open the root-admin shell at:
   - `http://localhost:3000/root-admin` by default
   - or `http://localhost:<your-PORT>/root-admin` if you override `PORT`

2. Make sure the local helper is already running outside the browser before you
   attempt the SSH stage.

3. The helper should use the SSH private key you already manage locally. You
   should not need to manually convert that key into a runtime-specific format
   just to complete browser login.

4. If helper startup reports that required workstation tooling is missing or
   the local key cannot be used, resolve that prerequisite first rather than
   trying to work around low-level crypto errors in the browser.

Example bash-style startup:

```bash
ROOT_ADMIN_ALLOWED_ORIGIN=http://localhost:3000 \
ROOT_AUTH_SIGNER_PORT=8787 \
node root-auth-signer-helper.mjs
```

If your app is running on a non-default `PORT`, set
`ROOT_ADMIN_ALLOWED_ORIGIN` to match that origin instead.

Example PowerShell startup:

```powershell
$env:ROOT_ADMIN_ALLOWED_ORIGIN="http://localhost:3000"
$env:ROOT_AUTH_SIGNER_PORT="8787"
node .\root-auth-signer-helper.mjs
```

5. Return to `/root-admin`, re-enter email and password if needed, then choose
   one of the returned SSH key fingerprints.

6. Let the browser call the localhost helper to sign the challenge and complete
   `POST /v1/root-auth/browser/login/ssh`.

7. Confirm the shell shows:
   - root user ID
   - principal ID
   - display name or email summary
   - session expiry

8. Use the browser logout action to revoke the session and clear the cookie.

Notes:

- the browser flow uses the same server-backed `auth_sessions` records as the
  bearer flow
- the browser transport uses a secure HTTP-only cookie instead of exposing the
  session token to SPA storage
- if the helper is not running, the browser now shows a plain error and expects
  you to resolve helper startup outside the app rather than through an in-app
  install page
