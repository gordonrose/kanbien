# Job Processing

`jobProcessing` is the provider-neutral foundation for durable asynchronous
work.

The first slice provides:

- registered job-type definitions with payload versions, execution scope,
  queue, priority, retry policy, and handlers
- durable PostgreSQL job, outbox, and attempt persistence
- transactional enqueue through a feature-owned service transaction
- dispatcher and worker execution seams that accept a queue provider adapter
- a BullMQ/Redis provider adapter for the runtime dispatcher and worker
  entrypoints
- payload-safety and tenant-boundary validation
- code-declared recurring maintenance schedules with durable schedule state,
  due-slot run history, leasing, duplicate prevention, and a separate
  `scheduler:jobs` runtime command

Deferred in this slice:

- public or root-admin HTTP APIs
- operator UI
- notification-delivery retry adoption

`transport/` is present as an explicit placeholder because this feature has no
HTTP routes yet. Future operator APIs for job inspection, retry, cancellation,
or scheduler controls should live there before being mounted through the v1
router.

The first feature-owned recurring scheduler consumer is deferred to the
Organization export slice. This slice provides the platform scheduler,
persistence, and runtime command without importing feature-specific schedules.

Redis-backed BullMQ provider tests are available behind
`RUN_REDIS_JOB_PROVIDER_TESTS=true` so the normal suite does not require Redis.

Feature code should import only the public seam from `src/features/jobProcessing`
and must not import queue-provider libraries or job-processing persistence
internals.
