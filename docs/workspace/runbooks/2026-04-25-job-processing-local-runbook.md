# Job Processing Local Runbook

## Scope

This runbook covers the first job-processing foundation slice.

## Local Redis

ADR-0034 selects BullMQ backed by Redis as the first provider direction. Local
Redis is expected to use:

```bash
docker run --name kanbien-redis -p 6379:6379 -d redis:7
```

Runtime config:

- `REDIS_URL=redis://localhost:6379`

The current slice parses `REDIS_URL` and exposes dispatcher/worker entrypoints,
but the concrete BullMQ adapter is still deferred. The entrypoints fail fast
with an explicit provider-not-configured message until that adapter is added.

## Scripts

- `npm run dispatcher:jobs`
- `npm run worker:jobs`
- `npm run start:jobs:dispatcher`
- `npm run start:jobs:worker`

## Failure Posture

- dispatch failures remain durable in `job_processing_outbox`
- worker failures are recorded in `job_processing_attempt`
- exhausted jobs move to `dead`
- payloads and error summaries must stay redacted
