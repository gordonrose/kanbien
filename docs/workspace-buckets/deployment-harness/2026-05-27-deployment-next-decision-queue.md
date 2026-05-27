# Deployment Next Decision Queue

Date: 2026-05-27

## Purpose

Name the next deployment decisions in the order that reduces the most risk
without redesigning the current AWS path prematurely.

This is a discovery queue, not an implementation plan.

## Decision 1: Environment Identity

Question:

- Is `kanbien-staging` the public production-like environment, or only a
  staging environment currently serving the public domain?

Why this comes first:

- Environment naming affects release approval, rollback posture, data
  durability, incident severity, and whether staging-sized AWS resources are
  acceptable.

Evidence:

- Route 53 serves `kanbien.com` and `www.kanbien.com` from staging-named AWS
  resources.
- The deployment/release architecture layer is still marked `missing`.
- Current recommendation:
  `docs/workspace-buckets/deployment-harness/2026-05-27-environment-identity-recommendation.md`

Do not do yet:

- Do not rename AWS resources or split environments until this is decided.

## Decision 2: Repeatable Build And Deploy Path

Question:

- Should the existing manual AWS deploy path be reconstructed first, or should
  a new governed build/push/deploy harness become the source of truth?

Why this comes next:

- The repo can identify the running AWS image, digest, task definition, and
  service rollout, but it still cannot repeat the build and push from committed
  instructions.

Evidence:

- No committed Dockerfile, deploy workflow, ECR push script, or infrastructure
  definition was found.
- ECR image tags map to a real Git commit, so source lineage exists even though
  the image-build recipe is missing.

Do not do yet:

- Do not replace the AWS path until the current compatibility contract is
  recorded well enough to preserve it.

## Decision 3: Runtime Process Model

Question:

- Which processes must run in AWS: web, dispatcher, worker, scheduler, or
  one-shot operational jobs?

Why this comes before worker deployment:

- The repo has provider-neutral job-processing seams and runtime commands, but
  AWS currently shows only the HTTP ECS service.

Evidence:

- `jobProcessing` owns durable async job request, outbox, worker execution,
  retry/dead-letter, and scheduler seams.
- ADR-0046 says deployment orchestration must run the scheduler tick on the
  desired cadence.
- No AWS ECS service or log group was observed for job dispatcher, scheduler,
  or worker processes.

Do not do yet:

- Do not add AWS job services until owner, cadence, concurrency, monitoring,
  and rollback expectations are known.

## Decision 4: Asset And Export Durability

Question:

- Must AWS use durable object storage for assets and generated exports before
  further production-like use?

Why this matters:

- The current AWS task uses `/tmp/kanbien-assets`, which is container-local and
  should be treated as ephemeral under Fargate task replacement.

Evidence:

- ADR-0035 keeps production object-store provider selection as follow-up.
- Local/dev/test asset storage is explicitly filesystem-backed.
- Organization export integration stores generated export bytes under the asset
  local storage root.

Do not do yet:

- Do not switch object-storage provider assumptions without an asset decision
  record and compatibility plan.

## Decision 5: Release Evidence And Rollback

Question:

- What evidence must be captured for every deployment, and what is the approved
  rollback path for a bad image, bad config, or bad migration?

Why this follows the first four:

- Release evidence depends on knowing the environment, artifact identity,
  process model, and storage durability expectations.

Evidence:

- ECS reports the current rollout completed and reached steady state.
- Public `/v1/health` verifies the current web service.
- ECS deployment circuit breaker rollback is disabled.
- SLO, incident, and reliability architecture are still marked `missing`.
- NIST CSF gate expects monitoring, incident handling, and rollback/recovery
  notes for production-risky changes.

Do not do yet:

- Do not claim production readiness from health-check success alone.

## Decision 6: Optional Provider Config

Question:

- Are OpenAI-backed features intentionally disabled in AWS, or should AWS carry
  `OPENAI_*` configuration?

Why this is lower priority:

- The core deployment starts without these values, but source files read them
  directly from `process.env`, so the posture should be explicit before any
  feature depends on them in AWS.

Evidence:

- `.env.example` contains `OPENAI_*` placeholders.
- ECS task definition did not show `OPENAI_*` environment names during
  inspection.

Do not do yet:

- Do not add provider credentials or print secret values during discovery.
