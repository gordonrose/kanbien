# Organization Exports

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationExports` |
| Status | `implemented-backend-foundation` |
| Story | `S-015` |
| Primary implementation | `src/features/organizationExports` |
| Root routes | `POST/GET /v1/root-admin/tenants/:tenantId/organization-exports`; `GET/POST/DELETE /v1/root-admin/tenants/:tenantId/organization-exports/:exportId...` |
| Tenant routes | `POST/GET /v1/tenant-admin/organization-exports`; `GET/POST/DELETE /v1/tenant-admin/organization-exports/:exportId...` |
| UI posture | parked; no governed app UI implemented |

## Behavior

The backend foundation creates requester-bound private Organization export records, enqueues background generation, tracks status, supports cancel, retry, delete, PIN view, and authenticated download, and stores generated ZIP files in private app-controlled storage.

Generated ZIP bundles use the reusable password-protected ZIP helper in `src/lib/exportBundles/passwordProtectedZip.ts`. V1 generation includes the export manifest, Organization core JSON, and implemented projection sections for legal profiles, locations, opening-hour weekly slots and exceptions, business units, business-unit memberships, reference values, and primary logo relationship metadata when selected. Actual logo bytes are included when the current primary logo relationship points to a ready asset. Placeholder logo images are not generated into the export.

When generation reaches `ready` or `failed`, the worker resolves the requesting admin email and sends the corresponding notification through the `notificationDelivery` writer seam. Notification failure is recorded on the export as `notification_status = failed`, and does not invalidate a ready export or leak PIN material into audit details.

Expired or deleted generated bundles are cleaned through the Organization export cleanup job. Successful cleanup deletes the private ZIP object and clears the stored object key and encrypted PIN from the export record. Delete failures are retried with scheduled eligibility, then marked for operator review after the configured attempt cap.

Stale `running` exports are reconciled through the Organization export timeout sweep job. The sweep uses the reusable job lifecycle timeout classifier from `jobProcessing`, marks timed-out exports `failed` with `worker_timeout`, records export-specific attempt/audit evidence, and preserves the normal retry path.

The first recurring scheduler slice now declares both export maintenance jobs
as hourly platform-internal schedules through `jobProcessing`. The scheduler
process enqueues due schedules with deterministic due-slot idempotency, while
Organization export lifecycle and authorization remain owned by
`organizationExports`.

## Authority

Root routes require `organization.root.export.manage` for the selected tenant. Tenant routes require an active tenant session and current tenant context. Export records are requester-bound: status, PIN view, download, retry, cancel, and delete require the same requester identity.

Downloads are authenticated app-controlled streams with `application/zip`, attachment disposition, `private, no-store` cache posture, and no raw storage URL exposure.

## Current Limits

This is a backend foundation, not the complete export product surface. A future public requester-email resolver seam and richer operator tooling still need hardening before the export product surface should be called complete.

## Evidence

| Evidence | Status | Path / Command |
| --- | --- | --- |
| Feature source | actual | `src/features/organizationExports` |
| Migration | actual | `src/features/organizationExports/persistence/migrations/0060_create_organization_exports.sql` |
| ZIP primitive | actual | `src/lib/exportBundles/passwordProtectedZip.ts` |
| Route integration | actual | `src/routes/v1/index.ts` |
| Worker integration | actual | `src/jobWorker.ts` |
| Private export bundle ADR | actual | `docs/architecture/adr/0044-use-private-generated-export-bundles-for-sensitive-domain-exports.md` |
| Job lifecycle ADR | actual | `docs/architecture/adr/0043-use-platform-owned-job-lifecycle-hardening-for-long-running-work.md` |
| Scheduler cadence ADR | accepted | `docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md` |
| Security tests | pass | `npx vitest run tests/security/organizationExports/exportAuthorization.test.ts` |
| PIN encryption test | pass | `npx vitest run tests/unit/organizationExports/secretBox.test.ts` |
| Lifecycle and cleanup hardening tests | pass | `npx vitest run tests/unit/organizationExports/lifecycle.test.ts` |
| Recurring scheduler tests | pass | `npx vitest run tests/unit/jobProcessing/recurringScheduler.test.ts` |
| Scheduler persistence test | pass | `RUN_POSTGRES_TESTS=true npx vitest run --fileParallelism false tests/integration/jobProcessing/persistence.test.ts` |
| Reusable job lifecycle helper tests | pass | `npx vitest run tests/unit/jobProcessing/lifecycleHardening.test.ts` |
| ZIP primitive test | pass | `npx vitest run tests/unit/exportBundles/passwordProtectedZip.test.ts` |
| Persistence/generation tests | present; skipped without Postgres config | `npx vitest run tests/integration/organizationExports/persistence.test.ts` |
| Typecheck | pass | `npm run typecheck` |
| Dependency graph | pass | `npm run check:feature-dependencies` |
