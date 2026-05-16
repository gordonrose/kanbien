# ADR-0043: Use Platform-Owned Job Lifecycle Hardening For Long-Running Work

- Status: Accepted
- Date: 2026-05-16
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR-0034 established the shared `jobProcessing` foundation for durable,
provider-neutral background work. Organization export implementation added a
new pressure point: feature-owned export records can remain in `running` after
a worker crash, deploy interruption, provider stall, or uncaught execution
failure.

The platform needs a consistent way to name and classify these job lifecycle
failures without moving feature-owned business transitions into the generic job
platform.

Without a shared lifecycle-hardening seam, each feature that runs long-lived or
cleanup-sensitive jobs would likely invent its own timeout labels, stale-work
classification, retry posture, and operator language. That would create drift
across exports, imports, cleanup jobs, notifications, and future bulk
maintenance work.

At the same time, the repo's anti-drift rules require feature ownership to
remain explicit:

- `jobProcessing` owns generic job execution and durable job request handling
- the feature owns its domain records, status transitions, audit events,
  cleanup decisions, and user-visible recovery behavior
- platform seams should stay provider-neutral and capability-specific
- recurring scheduler behavior is not yet implemented and must not be implied
  by a timeout classification helper

## Decision

Extend `jobProcessing` with a narrow lifecycle-hardening public seam for
classifying long-running job lifecycle failures.

The initial seam lives at:

- `src/features/jobProcessing/domain/lifecycleHardening.ts`
- exported through `src/features/jobProcessing/index.ts`

The seam is intentionally pure and provider-neutral. It may classify lifecycle
conditions and return stable failure categories, but it must not mutate
feature-owned records, enqueue recovery jobs, inspect feature tables directly,
or depend on BullMQ, Redis, or another queue-provider object.

The first approved category is:

- `worker_timeout`

`worker_timeout` means the feature has determined that a domain record tied to
background work has been `running` longer than the approved timeout window and
should be reconciled as a worker lifecycle failure.

Feature-owned consumers must still decide:

- which records are eligible for stale-running reconciliation
- the timeout window and scan limit
- the resulting domain status transition
- whether retry remains available
- how audit, notification, cleanup, and operator evidence are recorded
- whether a support command, manually enqueued maintenance job, or future
  scheduler triggers the sweep

Organization exports are the first consumer. They use the shared classifier
from an `organization.export.timeout_sweep` maintenance job, then apply
Organization-export-specific failure, audit, and retry semantics.

Recurring scheduler cadence remains explicitly out of scope for this ADR. The
current platform may support enqueueable maintenance jobs, but recurring
schedules require a later decision and implementation before features can rely
on automatic periodic execution.

## Consequences

### Positive

- Long-running features can share stable lifecycle failure language without
  duplicating timeout categories.
- Feature domains keep ownership of their records and recovery behavior.
- The seam extends ADR-0034 without exposing queue-provider internals.
- Tests can validate timeout classification once at the platform seam and
  separately validate feature-specific reconciliation behavior.
- Future imports, generated exports, cleanup sweeps, and notification retries
  have a safe first pattern to follow.

### Negative

- The first seam is intentionally small, so some features may still need their
  own scan, audit, and retry implementation until more shared needs are proven.
- Operators must understand that lifecycle classification does not itself mean
  recurring scheduler automation exists.
- If features use different timeout windows, reviewers must inspect the
  feature-owned artifacts rather than assuming one global timeout.

### Neutral / Follow-up

- Add a broader platform policy registry only after at least one more consumer
  proves the same metadata is duplicated.
- Add a recurring scheduler ADR before implementing automatic cadence for
  cleanup or timeout sweep jobs.
- If a future provider exposes reliable stalled-job events, adapt the provider
  adapter behind `jobProcessing` without changing feature-facing lifecycle
  categories.
- If operator dashboards become a product surface, expose lifecycle categories
  through a governed read model rather than scraping feature audit prose.
