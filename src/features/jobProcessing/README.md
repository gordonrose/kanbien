# Job Processing

`jobProcessing` is the provider-neutral foundation for durable asynchronous
work.

The first slice provides:

- registered job-type definitions with payload versions, execution scope,
  queue, priority, retry policy, and handlers
- durable PostgreSQL job, outbox, and attempt persistence
- transactional enqueue through a feature-owned service transaction
- dispatcher and worker execution seams that accept a queue provider adapter
- payload-safety and tenant-boundary validation

Deferred in this slice:

- public or root-admin HTTP APIs
- operator UI
- recurring scheduling
- notification-delivery retry adoption
- Redis-backed BullMQ provider tests

Feature code should import only the public seam from `src/features/jobProcessing`
and must not import queue-provider libraries or job-processing persistence
internals.
