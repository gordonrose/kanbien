# Technical Steering Addendum: Reusable Background Job Lifecycle Hardening

## Status

- Decision status:
  `approved-for-first-consumer-implementation`
- Date:
  `2026-05-16`
- Applies to:
  Background jobs, generated exports, cleanup jobs, and future long-running
  feature-owned work.
- First consumer:
  Organization Domain Foundation S-015 private export bundles.
- Source product packet:
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`
- Related steering:
  `docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md`
- Architecture decision:
  `docs/architecture/adr/0043-use-platform-owned-job-lifecycle-hardening-for-long-running-work.md`

## Decision Summary

Background job lifecycle mechanics should be reusable platform patterns, while
feature-owned services decide the business outcome.

The first reusable platform slice is a deterministic timeout classifier for
long-running work. Organization exports may use that classifier to find stale
`running` exports, fail them with a safe timeout category, keep normal retry
available, and record feature-owned audit/attempt evidence.

Recurring schedules now use the `jobProcessing` code-declared scheduler. The
Organization export cleanup and timeout sweeps are the first feature-owned
maintenance consumers of that scheduler cadence.

## Reusable Platform Rules

| Rule | Decision | First Consumer Rule |
| --- | --- | --- |
| Timeout classification | Platform helper decides whether a durable work item is stale based on a timestamp, `now`, and timeout duration. | Organization exports use the helper against running export `updatedAt`. |
| Safe failure category | Shared categories should be deterministic and non-sensitive. | Organization exports use `worker_timeout`. |
| Retry posture | Timeout classification should not erase feature retry semantics. | Timed-out Organization exports become normal `failed` exports and can use existing retry behavior. |
| Audit and attempts | Platform helper does not write feature audit. | Organization exports write export attempt and audit rows. |
| Operator review | Platform helper may expose attempt thresholds, but feature records review state. | Cleanup already escalates to export operator review after the attempt cap. |
| Recurring cadence | Recurring schedules are not implemented through feature-local cron. | Timeout/cleanup jobs are code-declared scheduler entries under `jobProcessing`. |

## Implementation Boundary

Reusable in this slice:

- timeout classifier
- safe timeout failure category
- enqueueable timeout sweep job shape

Feature-owned in this slice:

- which export rows are eligible for timeout sweep
- how export status changes after timeout
- export-specific audit event names
- export-specific notification behavior
- retry eligibility after timeout

Deferred platform work:

- shared operator-review dashboard
- cross-feature requester email resolver
- global job timeout policy registry

## Proof Required

| Proof | Required Evidence |
| --- | --- |
| Helper proof | Unit test classifies timed-out and non-timed-out work deterministically. |
| First consumer proof | Organization export test marks stale running export failed with `worker_timeout`. |
| Retry preservation | Timed-out export remains in normal failed state so existing retry path applies. |
| Scheduler honesty | Docs state sweep jobs are enqueueable but not recurring in v1. |
