# Job Processing Feature Reference

## Purpose

The `jobProcessing` feature owns the provider-neutral foundation for durable
asynchronous work.

The first implementation slice provides:

- registered job-type definitions with payload versions, execution scope,
  default queue, default priority, retry policy, and handler
- durable PostgreSQL job, outbox, and attempt persistence
- transactional enqueue through a feature-owned service transaction
- provider-neutral dispatcher and worker execution seams
- a concrete BullMQ-backed provider adapter used by the dispatcher and worker
  entrypoints through `REDIS_URL`
- payload-safety and tenant-boundary validation
- runtime entrypoint scripts for future dispatcher and worker processes

## Where It Lives

- `src/features/jobProcessing/contract`
- `src/features/jobProcessing/domain`
- `src/features/jobProcessing/persistence`
- `src/features/jobProcessing/integration.ts`
- `src/features/jobProcessing/index.ts`

## Platform Integration

Public feature seams:

- `enqueueTransactionalJobRequest`
- `createJobTypeRegistry`
- `createJobProcessingService`
- `dispatchOutboxToQueue`
- `executeRegisteredJob`

There is no HTTP route mount in this slice. Future operator APIs and UI remain
deferred.

## Persistence Model

The feature owns three durable tables:

- `job_processing_job`
- `job_processing_outbox`
- `job_processing_attempt`

The schema stores scalar metadata for future operator filtering and avoids
depending on arbitrary JSON payload search.

## Provider Boundary

The current slice keeps feature-facing contracts provider-neutral while adding a
BullMQ/Redis adapter behind the runtime entrypoints. Redis-backed adapter tests
are explicit provider-integration tests gated by
`RUN_REDIS_JOB_PROVIDER_TESTS=true`.

Feature code must not import BullMQ, Redis, or job-processing persistence
internals.

## Current Limits

First consumer adoption:

- `notificationDelivery` registers `notification.email.send` with the
  job-processing worker for provider-safe stored email content.
- Security-sensitive email snapshots that contain redacted verification or
  reset links are intentionally rejected by the async email handler until a
  richer owner-regenerated async content model is approved.

Still deferred:

- public or root-admin HTTP APIs
- operator UI
- recurring scheduling
