# Backend Processing / Job Orchestration

## Current Status

- `missing`

## What This Layer Should Do

- support asynchronous work outside the request/response path
- handle retries, scheduling, long-running work, and failure recovery
- separate user-facing latency from backend processing

## Implemented To Date

- no generalized jobs or worker platform yet

## Still Missing / Next Steps

- choose queue and worker model
- define job persistence, retry, idempotency, and observability rules
- define how jobs fit feature ownership and multi-tenant futures
