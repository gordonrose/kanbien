# Organization Public Logo

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationBrandingReferences` |
| Status | `implemented-backend-foundation` |
| Story | `S-012` |
| Primary implementation | `src/features/organizationBrandingReferences` |
| Public route | `GET /v1/public/organizations/:organizationId/logos/primary` |
| Admin routes | mounted under root and tenant Organization route families |
| UI posture | parked; no governed app UI implemented |

## Behavior

The backend foundation manages one v1 primary logo relationship per Organization. Admin flows create upload intents through the governed asset service, upload real raster image bytes, complete the upload, replace the current primary logo relationship, read relationship metadata, and remove the current relationship.

Public reads use the stable app-controlled logo URL. Ready logo relationships stream bytes through the asset service without exposing raw storage authority. Missing logos return a generated initials placeholder with public cache headers.

## Authority

Root-admin routes require `organization.root.logo.manage` for the selected tenant. Tenant-admin routes use the authenticated current tenant context. The logo relationship stays Organization-owned; asset ownership alone is not authority to publish or replace a logo.

## Evidence

| Evidence | Status | Path / Command |
| --- | --- | --- |
| Feature source | actual | `src/features/organizationBrandingReferences` |
| Migration | actual | `src/features/organizationBrandingReferences/persistence/migrations/0059_create_organization_branding_references.sql` |
| Asset decision | actual | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md` |
| Technical signoff | actual | `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md` |
| Public asset delivery ADR | actual | `docs/architecture/adr/0045-use-app-controlled-public-asset-delivery-for-rendered-domain-assets.md` |
| Scheduler cadence ADR | proposed/deferred | `docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md` |
| Public delivery tests | pass | `npx vitest run tests/security/organizationBrandingReferences/publicLogoDelivery.test.ts tests/unit/organizationBrandingReferences/publicLogoDelivery.test.ts` |
| Typecheck | pass | `npm run typecheck` |
| Static gate | pass | `npm run check:static` |
