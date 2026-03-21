# Root Users feature bundle

## Files included
- contract/
- domain/
- persistence/
- transport/
- integration.ts
- index.ts

## Assumptions already present in your platform
- shared `dbPool`
- migration runner that can execute `src/features/rootUsers/persistence/migrations/*.sql`
- Express v1 router in `src/routes/v1/index.ts`

## Mounting
```ts
import { createRootUsersFeature } from "../../features/rootUsers";

v1Router.use(
  "/root-users",
  createRootUsersFeature({ dbPool }),
);
```

## Migration execution
Add this folder to your existing migration discovery:
```text
src/features/rootUsers/persistence/migrations
```

## Capability routes
- `POST /v1/root-users`
- `GET /v1/root-users/:rootUserId`
- `GET /v1/root-users/by-email?email=person@example.com`
- `GET /v1/root-users`
- `GET /v1/root-users/active`
- `PATCH /v1/root-users/:rootUserId`
- `DELETE /v1/root-users/:rootUserId`
- `POST /v1/root-users/:rootUserId/remove`
- `GET /v1/root-users/deleted`
- `POST /v1/root-users/:rootUserId/reactivate`

## Important drift callout
Your platform spec says `entrypointExport: createRootUserFeature`, but the feature architecture naturally wants the pluralised export `createRootUsersFeature`. Pick one name and keep it consistent in:
- `integration.ts`
- `index.ts`
- platform router registration
- platform spec
