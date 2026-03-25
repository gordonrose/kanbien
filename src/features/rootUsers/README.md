# Root Users Feature Bundle

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

## Feature Entry Point

```ts
import { createRootUserFeature } from "../../features/rootUsers";

v1Router.use("/root-users", createRootUserFeature(dbPool));
```

## Important Integration Notes

- The feature export is `createRootUserFeature`.
- The router factory accepts `dbPool` directly, not `{ dbPool }`.
- The migration runner will automatically discover `persistence/migrations/*.sql`.
- The router handles known `RootUserError` failures locally and forwards unknown errors to the platform middleware.

## API Notes

- `GET /v1/root-users?email=person@example.com` performs exact email lookup.
- `GET /v1/root-users` without `email` returns the paginated list endpoint.
- Responses are returned directly and are not wrapped in a `{ body: ... }` envelope.
