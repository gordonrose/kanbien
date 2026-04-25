# Backend Processing / Job Orchestration

## Current Status

- `missing`

## What This Layer Should Do

- support asynchronous work outside the request/response path
- handle retries, scheduling, long-running work, and failure recovery
- separate user-facing latency from backend processing

## Implemented To Date

- no generalized jobs or worker platform yet
- asset foundation v1 includes a synchronous internal cleanup service/route for
  expired upload intents and abandoned objects, with durable failed-delete
  state intended to remain compatible with a future job platform

## Still Missing / Next Steps

- choose queue and worker model
- define job persistence, retry, idempotency, and observability rules
- define how jobs fit feature ownership and multi-tenant futures
- move asset cleanup execution timing and retries behind the future job or
  scheduler seam without changing `assets` lifecycle semantics
