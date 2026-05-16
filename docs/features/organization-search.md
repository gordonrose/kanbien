# Organization Search

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationSearch` |
| Status | `implemented-backend-foundation` |
| Story | `S-013` |
| Primary implementation | `src/features/organizationSearch` |
| Routes | `GET /v1/root-admin/tenants/:tenantId/organization-search`; `GET /v1/tenant-admin/organization-search` |
| UI posture | parked; no governed app UI implemented |

## Behavior

Organization search is a read-only backend feature for grouped Organization-domain results. It returns separate groups for:

- `organizations`
- `legalProfiles`
- `locations`
- `weeklyOpeningHours`
- `openingHourExceptions`
- `businessUnits`
- `memberships`
- `referenceValues`
- `brandingLogoReferences`

The current backend foundation supports broad text search through `q`, exact `resultType`, exact `organizationId`, explicit `lifecycleStatus`, stable pagination, and deterministic sorting. Unknown query fields are rejected rather than treated as browser-only filters.

## Authority

Root search requires a root session and `organization.root.search`, with the target tenant supplied by the route parameter. Tenant-admin search uses the authenticated tenant session's active tenant context and does not accept tenant authority from request bodies or query strings.

Search results are tenant/account filtered at the persistence query boundary. Public logo relationship results read from the S-012 `organization_logo_relationship` table once that migration is applied.

## Persistence

The search feature owns no source business table. It adds index support through `src/features/organizationSearch/persistence/migrations/0058_create_organization_search.sql` and reads implemented Organization-domain source tables through a feature-local read model.

## Evidence

| Evidence | Status | Path / Command |
| --- | --- | --- |
| Feature source | actual | `src/features/organizationSearch` |
| Migration/index posture | actual | `src/features/organizationSearch/persistence/migrations/0058_create_organization_search.sql` |
| Route integration | actual | `src/routes/v1/index.ts` |
| Feature manifest | actual | `src/features/organizationSearch/feature.manifest.json` |
| Security tests | pass | `npx vitest run tests/security/organizationSearch/searchAuthorization.test.ts` |
| Persistence tests | present; skipped without Postgres config | `npx vitest run tests/integration/organizationSearch/persistence.test.ts` |
| Typecheck | pass | `npm run typecheck` |
| Static gate | pass | `npm run check:static` |
| Dependency graph | pass | `npm run check:feature-dependencies` |
