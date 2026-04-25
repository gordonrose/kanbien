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

The current slice implements provider-neutral contracts and fake-provider
contract coverage. BullMQ/Redis remains the ADR-approved first provider
direction, but the concrete BullMQ adapter and Redis-backed provider tests are
deferred until that adapter is selected and integrated.

Feature code must not import BullMQ, Redis, or job-processing persistence
internals.

## Current Limits

Still deferred:

- public or root-admin HTTP APIs
- operator UI
- recurring scheduling
- notification-delivery retry adoption
- Redis-backed BullMQ adapter tests
