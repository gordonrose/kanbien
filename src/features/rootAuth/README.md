# Root Auth Feature Bundle

## Files Included

- `contract/`
- `domain/`
- `persistence/`
- `transport/`
- `integration.ts`
- `index.ts`

## Platform Assumptions

- shared `pg` `Pool`
- feature routes mounted from `src/routes/v1/index.ts`
- migration runner that scans `src/features/**/migrations/*.sql`
- app-level JSON error middleware for unhandled failures
- root-user-protected routes use bearer-session middleware

## Feature Entry Point

```ts
import { createRootAuthFeature } from "../../features/rootAuth";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";

const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);

v1Router.use("/root-auth", createRootAuthFeature(dbPool, platformSecurityRepository));
```

## Important Integration Notes

- The feature export is `createRootAuthFeature`.
- Public login endpoints live in `rootAuth`.
- Protected `rootAuth` and `rootUsers` routes both rely on the same
  server-backed bearer session model.
- `rootAuth` owns auth principals, SSH public keys, login challenges, sessions,
  and auth audit events.
- `rootUsers` remains authoritative for root-user lifecycle state.
- `rootAuth` reads sign-in eligibility through the exported
  `createRootUsersAuthStateReader` seam rather than importing `rootUsers`
  persistence internals directly.

## API Notes

- `POST /v1/root-auth/login/password` performs password-stage login.
- `POST /v1/root-auth/login/ssh` completes login and returns an opaque session
  token.
- `POST /v1/root-auth/browser/login/ssh` completes browser login and sets the
  root-admin session cookie.
- `GET /v1/root-auth/browser/session` returns the minimal current-session
  summary for the root-admin SPA.
- `POST /v1/root-auth/browser/logout` revokes the browser session and clears
  the cookie.
- backend SSH verification remains compatible with legacy raw signatures while
  also accepting the browser helper's OpenSSH-native signature format
- the browser-helper path is intended to sign through workstation OpenSSH
  tooling rather than direct runtime-managed private-key parsing
- Protected requests must send `Authorization: Bearer <sessionId>`.
- Root-user sign-in is blocked for inactive, deleted, or anonymized linked
  `rootUsers`.
