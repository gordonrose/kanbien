# Recurring Maintenance Scheduler Foundation Test Run Summary

## Status

| Field | Value |
| --- | --- |
| Date | 2026-05-16 |
| Scope | `jobProcessing` recurring scheduler foundation; Organization export first-consumer wiring deferred |
| Result | focused pass; broad repo suite has unrelated baseline failures |

## Commands

| Command | Result | Notes |
| --- | --- | --- |
| `npx vitest run tests/unit/jobProcessing/recurringScheduler.test.ts tests/unit/jobProcessing/lifecycleHardening.test.ts tests/unit/traceability/traceability.test.ts tests/platform/express4-runtime-characterization.test.ts` | pass | 4 files passed; 18 tests passed. Covers registry validation, due-slot enqueue/idempotency, lifecycle hardening, traceability cleanup, and Express runtime characterization after isolating the scheduler-only slice. |
| `npx vitest run tests/unit/taskBreakdown/taskBreakdownValidate.test.ts` | pass | 163 tests passed after adding folder-task placeholder rejection to the validator. |
| `env $(rg '^TEST_DATABASE_' /home/gordon/kanbien/.env.test.local) RUN_POSTGRES_TESTS=true npx vitest run --fileParallelism false tests/integration/jobProcessing/persistence.test.ts` | pass | 2 tests passed after allowing local Postgres access. Covers durable job/outbox and scheduler schedule/run persistence. |
| `npm run typecheck` | pass | TypeScript compile check passed. |
| `npm run generate:feature-dependencies` | pass | Regenerated `docs/architecture/generated/feature-dependency-graph.*`. |
| `npm run check:feature-dependencies` | pass | Generated feature dependency graph is up to date with 17 features and 16 cross-feature edges. |
| `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown` | pass | Scheduler story packet validates after recording Organization export first-consumer adoption as deferred. |
| `npm run task-breakdown:validate -- docs/workspace/task-breakdown/2026-05-16-recurring-maintenance-scheduler-task-breakdown.md` | pass | Scheduler task packet validates after aligning S-004 with platform-only backend boundary proof. |
| `npm run check:static` | blocked-baseline | Blocked at `product-request:validate -- --all` by pre-existing incomplete product-request packets: `2026-05-03-loop-observability-kpi-foundation` and `2026-05-10-local-asset-storage-resilience`. Remaining sub-gates were run directly. |
| `npm run check:governed-ui-adoption` | pass | Governed UI adoption guard passed. |
| `npm run check:governed-root-admin-page-audit` | pass | No page-sensitive changes detected. |
| `npm run check:governed-root-admin-ui` | pass | Governed root-admin UI guard passed. |
| `npm run check:frontend-architecture` | pass | Passed after documenting that `package.json` scheduler commands are backend/platform runtime commands and do not change browser topology. |
| `npm test` | blocked-baseline | Full non-Postgres suite still has unrelated failures in older tenantAuth/design-system tests and one pre-existing environment-sensitive canonical routing path. Scheduler-focused tests listed above pass. |
| `npm run deps:audit` | pass | `npm audit --omit=dev` found 0 vulnerabilities. |
| `npm run test:traceability` | pass | Organization-domain cases not implemented by this scheduler slice are `pending-review`; the command reports 527/527 active documented IDs traceable with 0 missing mappings and 0 orphan executable IDs. |
| `git diff --check` | pass | Whitespace check passed after scheduler, traceability, task validator, and documentation updates. |

## Evidence Notes

- Initial Postgres persistence test attempt inside the sandbox failed with
  `EPERM 127.0.0.1:5432`. The same command passed after escalation allowed
  local test database access.
- A later Postgres attempt also exposed that the copied migration harness still
  referenced deferred Organization migrations. The scheduler-only branch now
  keeps those Organization migration groups out of the default harness until
  the Organization backend slice lands the corresponding feature files.
- No browser/runtime UI evidence is applicable because the scheduler slice has
  no frontend surface.
- `node --check src/jobScheduler.ts` is not a valid TypeScript syntax check in
  this repo because Node cannot directly check `.ts` files; `npm run
  typecheck` is the applicable compile gate.
- Recurring scheduler executable IDs were added to the job-processing PRD
  test-case document, so `TC-SCHED-UNIT-001` through `TC-SCHED-UNIT-004` and
  `TC-SCHED-INT-001` are documented executable IDs. `TC-SCHED-UNIT-004` now
  proves generic code-declared platform schedules rather than an Organization
  export first consumer.
- The repo still has pending-review documented cases outside the scheduler
  slice, including Organization-domain cases intentionally deferred from this
  platform-only branch. They are not enforced as active executable obligations
  until implementation or lifecycle review confirms they remain current.
