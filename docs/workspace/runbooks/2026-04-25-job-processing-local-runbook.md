# Job Processing Local Runbook

## Scope

This runbook covers the first job-processing foundation slice.

## Local Redis

ADR-0034 selects BullMQ backed by Redis as the first provider. Local Redis can
be started with:

```bash
docker run --name kanbien-redis -p 6379:6379 -d redis:7
```

Runtime config:

- `REDIS_URL=redis://localhost:6379`

The dispatcher and worker entrypoints construct the BullMQ adapter from
`REDIS_URL`. Redis is required only for those runtime processes and for the
explicit BullMQ provider tests.

Provider test command:

```bash
RUN_REDIS_JOB_PROVIDER_TESTS=true REDIS_URL=redis://localhost:6379 \
  npx vitest run tests/integration/jobProcessing/bullmqProvider.test.ts
```

The normal test suite skips `bullmqProvider.test.ts` unless
`RUN_REDIS_JOB_PROVIDER_TESTS=true` is set.

## Scripts

- `npm run dispatcher:jobs`
- `npm run worker:jobs`
- `npm run start:jobs:dispatcher`
- `npm run start:jobs:worker`

The dispatcher runs one outbox dispatch pass and exits. The worker starts
BullMQ workers for the configured job queues and remains running until
`SIGTERM` or `SIGINT`.

Current worker registry:

- `notification.email.send`

The notification-delivery job handler sends only provider-safe stored content.
Stored snapshots with redacted verification or reset links are rejected before
provider send, so those workflows still need owner-regenerated content before
they can move to async delivery.

## Failure Posture

- dispatch failures remain durable in `job_processing_outbox`
- worker failures are recorded in `job_processing_attempt`
- exhausted jobs move to `dead`
- payloads and error summaries must stay redacted
