# Implementation Blueprint Template

Use this after the capability matrix and PRD exist.

The goal is to turn requirements into a buildable, reviewable implementation
plan without losing architecture, tests, docs, or standards coverage.

## Summary

- Feature:
- Capability:
- Scope:
- Phase:

## Inputs

- Capability matrix reference:
- PRD:
- Exact ADR discovery:
  - ADR files reviewed:
  - Change areas reviewed:
  - Enduring decision areas with no existing ADR found:
  - New ADR required:
  - ADR conflict / stale guidance:
- PRD test-case doc:
- Journey inventory:
- QA coverage matrix classification:
- QA release-gate expectation:

## Frontend Plan

- Route / surface:
- UI states:
- Permission visibility behavior:
- Session / expiry behavior:
- Browser security considerations:

## Backend Plan

- Route(s):
- Request/response/error contract:
- Feature-local files expected:
- Cross-feature seams:
- Feature manifests to update:
- Authorization enforcement point:

## Async Job Processing Decision Gate

Use this section for every backend or backend-adjacent slice, even when the
answer is "not needed".

- Does the feature need background work, bulk actions, retryable external
  calls, cleanup, delayed execution, long-running processing, imports/exports,
  asset processing, or operator-triggered batch workflows?
- If async work is not needed, what makes synchronous execution acceptable for
  latency, reliability, retries, and user/operator experience?
- If async work is needed, which feature-owned durable entity represents the
  work request or business fact?
- What facts must be persisted before enqueue so the queue payload is only a
  trigger/reference and not the source of truth?
- What job type name, owner feature, payload version, default queue, priority,
  and retry policy are approved?
- What is the smallest safe job payload, such as `{ entityId }` or
  `{ bulkActionId }`, and which raw request data, secrets, permissions, tenant
  authority, or mutable live claims are forbidden from the payload?
- What idempotency key or durable state prevents duplicate side effects across
  enqueue retries, worker retries, and repeated operator actions?
- What tenant context, root/operator context, object-level rule, and
  cross-tenant deny rule must be revalidated when the worker runs?
- What outcomes are retryable, non-retryable, terminal/dead-letter, canceled,
  or ignored as already complete?
- What durable progress, counters, attempt history, safe error summaries,
  audit events, and operator metadata must exist?
- What cleanup, cancellation, expiration, abandoned-state, partial-failure, or
  orphaned-resource behavior applies?
- What job-processing public seams, owning-feature public seams, and feature
  manifest dependency entries must be added or updated?
- Which tests prove enqueue, handler execution, idempotency, retry/dead-letter,
  tenant boundary, provider neutrality, and opt-in provider integration where
  external infrastructure is required?

## Persistence Plan

- Entities / rows affected:
- Migration changes:
- Index or uniqueness changes:
- Search/filter implications:
- Lifecycle / cleanup rules:
- Expiry / abandoned-state behavior:
- Orphaned external resource handling:
- Scheduled maintenance or job dependency:
- Cleanup retry and failure recording:
- Compatibility notes:

## Verification Plan

- Journey tier / workflow scope:
- Unit:
- Integration:
- Security:
- Audit:
- Edge:
- Frontend:
- Persistence-backed:
- End-to-end:
- Concurrency / idempotency:
- Performance:
- Resilience / failure-injection:
- Compatibility / contract:
- Accessibility:
- Structured exploratory QA:
- QA checklist:
- Curated test-run summary:
- Waiver / quarantine expectation:

## Documentation Plan

- PRD updates:
- PRD test-case updates:
- Feature docs:
- API contract docs:
- OpenAPI:
- Postman:
- Data dictionary:
- Feature manifests:
- Dependency graph artifacts:
- Architecture map:
- Standards platform-status snapshots:
  list which files under `docs/standards/platform-status/` must be reviewed
  because the slice changes their current wording or evidence story, even if
  the headline status level may stay the same
- Reconstruction questionnaire:
- Bootstrap and helper docs:
- Maintained-artifacts sweep:
  list older PRD/test-case/blueprint docs, README files, index files, and
  registry surfaces that may need refresh because implementation will change
  their truth value
- Runbook:
- Privacy note:
- Standards review:
- Repo health review:

## Completion Guardrails

- Blocking QA outcomes:
- Explicitly deferred verification layers and rationale:
- Expected release-gate residual risk statement:
