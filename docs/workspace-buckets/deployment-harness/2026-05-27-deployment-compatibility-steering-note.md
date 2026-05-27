# Deployment Compatibility Steering Note

Date: 2026-05-27

## Purpose

Summarize the deployment discovery pass before changing deployment structure.
This note separates provider-neutral deployment responsibilities from observed
AWS adapter behavior and unresolved decisions.

This is not a deployment redesign and not an approved target architecture.

## Provider-Neutral Responsibilities

The deployment harness should eventually make these contracts explicit for any
provider:

- source revision used for the release
- build artifact identity, preferably immutable artifact digest
- runtime process model: web, workers, schedulers, one-shot jobs
- required configuration names and secret channels, without storing values
- migration and deploy ordering
- public and internal health checks
- release evidence: artifact, target, rollout state, logs, and smoke result
- rollback and recovery posture
- asset and export durability expectations
- environment naming and promotion rules

These are provider-neutral because AWS, Azure, or another provider would still
need answers for them.

## Observed AWS Adapter Behavior

The current AWS path serves Kanbien through ECS/Fargate behind an ALB and Route
53. The current running release is tied to:

- ECR repository `kanbien/service-platform`
- active tag `root-login-autofill-20260522-1`
- active image digest
  `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`
- ECS task definition `kanbien-staging-service-platform:5`
- ECS service `service-platform` in cluster `kanbien-staging`
- public health check `https://www.kanbien.com/v1/health`

AWS currently provides the core app startup config names and root-auth
bootstrap secret names. It also runs migration-before-server startup inside the
HTTP service container.

## Current Compatibility Rules

Preserve these until a replacement contract is explicitly approved:

- `/v1/health` must remain compatible with ECS container health checks, ALB
  target group checks, and public deployment verification.
- Migrations currently run before the HTTP server starts; changing this needs a
  migration/deploy-order compatibility plan.
- ECR image digest is stronger release evidence than mutable tags such as
  `staging-latest`.
- Root-auth bootstrap secret names are deployment-critical because migrations
  require them.
- Existing AWS behavior should be treated as compatibility-sensitive even where
  resource names include `staging`.

## Risks And Unknowns

The current discovery pass found these unresolved deployment risks:

- no committed Dockerfile, image build recipe, ECR push script, infrastructure
  definition, or CI/CD deploy workflow was found
- task-definition registration and ECS service update commands are observed
  indirectly through AWS state, but the repo-side command path is unknown
- repo job entrypoints exist, but no AWS job-process service or log group was
  observed
- AWS uses `/tmp/kanbien-assets` for asset bytes, while architecture docs still
  defer production object-storage provider selection
- AWS resource names use `staging`, while public DNS serves
  `kanbien.com` and `www.kanbien.com`
- ECS deployment circuit breaker rollback is disabled
- RDS and ElastiCache appear staging-sized and lack stronger availability and
  recovery posture
- OpenAI environment posture in AWS is unclear
- rollback procedure and per-release evidence capture are not yet defined

## Next Decisions

Before redesigning deployment structure, decide:

- whether `kanbien-staging` is the production-like public environment or only a
  staging environment
- whether workers and schedulers should run in AWS now, and as what process
  type
- whether asset/export bytes require durable object storage before further
  production-like use
- whether to reconstruct the existing manual AWS deploy path first or replace
  it with a governed build/push/deploy harness
- where release evidence should be recorded for future deployments

