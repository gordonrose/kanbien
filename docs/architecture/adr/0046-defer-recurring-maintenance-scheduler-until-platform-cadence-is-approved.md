# ADR-0046: Accept Code-Declared Recurring Maintenance Scheduler Foundation

- Status: Accepted
- Date: 2026-05-16
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR-0034 approved the shared job-processing foundation and deferred recurring
jobs. ADR-0043 approved reusable lifecycle classification for long-running
work, and Organization export planning identified two maintenance jobs that
will need recurring cadence in the follow-on Organization export slice:

- expired/deleted generated export cleanup
- stale-running export timeout sweeps

The platform needs recurring maintenance without feature-local cron, user
editable schedules, a scheduler UI, or an operator API in the first slice.

## Decision

Use a platform-owned, code-declared recurring maintenance scheduler foundation
inside `jobProcessing`.

The first slice provides:

- code-declared schedule definitions through a registry seam
- durable schedule state in `job_processing_recurring_schedule`
- durable due-slot run evidence in `job_processing_recurring_schedule_run`
- lease-based due polling so another scheduler process can recover stale work
- deterministic due-slot idempotency keys when enqueueing jobs
- safe outcome recording for enqueued, skipped-overlap, retryable failure, and
  terminal failure states
- a separate `scheduler:jobs` process command that runs one scheduler tick

No feature-owned first consumer is wired in this platform-only slice.
Organization export cleanup and timeout sweeps remain the intended first
scheduled consumers, but their schedule definitions are deferred to the
Organization export slice. Organization export lifecycle,
authorization, audit, cleanup, retry, and generated-file semantics remain
owned by `organizationExports`.

## Still Deferred

The accepted first slice does not approve:

- user-created or dynamically edited schedules
- root-admin or operator scheduler UI/API
- business workflow scheduling
- per-tenant custom cadence
- public logo cleanup/cache scheduler adoption until concrete logo cleanup or
  cache jobs exist
- Organization export schedule registration until the owning feature slice
  adopts the scheduler
- public enqueue API support for client-supplied `recurringSchedule`

Normal enqueue requests must continue to reject client-supplied recurring
schedule fields.

## Consequences

### Positive

- Features can declare approved maintenance cadence without owning local cron.
- Schedule and run evidence is durable and queryable for operator review.
- Duplicate scheduler invocations use schedule leases and job idempotency
  instead of best-effort timing assumptions.
- Organization export cleanup and timeout reconciliation can adopt scheduler
  cadence without feature-local cron in the follow-on slice.

### Negative

- The first process command is tick-oriented; deployment orchestration must run
  it on the desired cadence.
- No operator UI exists yet for schedule visibility or manual intervention.
- Schedule definitions are code-owned, so cadence changes still require a code
  deployment.

### Neutral / Follow-up

- Add operator visibility/control only after Product Discovery and frontend
  design-system governance.
- Add future scheduled consumers only through code-declared schedule
  definitions and feature-owned lifecycle semantics.
- Revisit public logo cleanup/cache scheduling when the logo/cache job seams
  exist.
