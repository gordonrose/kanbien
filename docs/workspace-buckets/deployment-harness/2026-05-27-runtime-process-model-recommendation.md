# Runtime Process Model Recommendation

Date: 2026-05-27

## Purpose

Recommend how to treat Kanbien runtime processes during deployment-harness
discovery.

This is not an approval to deploy workers, schedulers, or new AWS services.

## Recommendation

Treat the currently observed AWS deployment as:

`web-only runtime, with repo job runtime present but not observed in AWS`

That means:

- the HTTP service is currently the only observed deployed ECS service
- background job completion must not be assumed in AWS
- deployment harness design should model web, dispatcher, worker, and scheduler
  as separate runtime processes
- adding AWS job services requires an explicit owner, cadence, concurrency,
  monitoring, and rollback decision

## Repo Runtime Processes

Current production-oriented process scripts:

- web: `npm start`
  - runs `node dist/src/scripts/migrate.js && node dist/src/server.js`
  - owns migration-before-server startup and HTTP traffic
- dispatcher: `npm run start:jobs:dispatcher`
  - runs `node dist/src/jobDispatcher.js`
  - moves durable outbox rows from Postgres into the queue provider
- worker: `npm run start:jobs:worker`
  - runs `node dist/src/jobWorker.js`
  - consumes queued jobs and executes registered handlers
- scheduler: `npm run start:jobs:scheduler`
  - runs `node dist/src/jobScheduler.js`
  - performs one recurring-scheduler tick

Local/dev equivalents also exist:

- `dispatcher:jobs`
- `worker:jobs`
- `scheduler:jobs`

## Architecture Evidence

ADR-0034 says `jobProcessing` owns provider-neutral durable asynchronous job
request, transactional outbox dispatch, worker execution, retry/dead-letter,
payload safety, and attempt history.

ADR-0046 says the recurring scheduler has a separate process command and that
deployment orchestration must run it on the desired cadence.

`docs/architecture/system-overview.md` states that BullMQ/Redis provider
integration, recurring schedule state, and a separate scheduler runtime are
present, while operator APIs remain deferred.

The `jobProcessing` feature manifest identifies dispatcher/worker runtime and
recurring scheduler seams as platform runtime seams.

## AWS Evidence

Observed AWS runtime on 2026-05-27:

- ECS cluster `kanbien-staging` listed only service `service-platform`.
- CloudWatch log groups with `/ecs/kanbien-staging` prefix listed only
  `/ecs/kanbien-staging-service-platform`.
- No ECS service or matching log group was observed for dispatcher, worker, or
  scheduler processes.
- AWS does provide Redis/Valkey configuration through `REDIS_URL`, so the queue
  backing service exists even though job processes were not observed.

## Compatibility Rules

Until the runtime process decision is made:

- do not claim AWS background jobs complete automatically
- do not treat Redis presence as proof that workers are deployed
- do not fold dispatcher, worker, or scheduler into the HTTP service without an
  explicit compatibility plan
- do not add scheduler cadence to deployment until cadence, overlap behavior,
  logs, and failure handling are decided
- preserve migration-before-server behavior for the web process

## Follow-Up Decision

Gordon should decide whether the next AWS runtime shape is:

- `web-only`: keep current runtime and document background-job limitations
- `web-plus-manual-jobs`: run dispatcher/scheduler manually as operational
  commands when needed
- `web-plus-worker`: deploy a long-running worker but defer scheduler cadence
- `web-plus-worker-plus-scheduler`: deploy worker and scheduler orchestration
- `split-provider-later`: keep AWS web-only while future provider or harness
  work owns background execution

Do not implement any of those outcomes during discovery.
