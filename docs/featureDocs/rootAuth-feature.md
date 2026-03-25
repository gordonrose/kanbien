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
- session creation happens only after successful SSH challenge completion
- bearer tokens are opaque session IDs backed by `auth_sessions`
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

Public auth throttling:

- public auth routes may return `429 RATE_LIMITED`
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

## Data And Security Notes

- passwords are stored as hashes, never plaintext
- only SSH public keys are stored
- SSH challenges are single-use and time-bounded
- revoked sessions and revoked SSH keys must not authenticate
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
