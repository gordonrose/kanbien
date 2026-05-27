# AWS Deployment Inventory

Date: 2026-05-27

## Purpose

Record the observed AWS deployment shape for Kanbien before changing,
relocating, or redesigning deployment harness behavior.

This is a discovery artifact. It describes observed AWS state and compatibility
risks. It is not an approved target architecture.

## Access Context

- AWS profile used for read-only inspection: `kanbien-dev`
- Region inspected: `eu-west-1`
- Auth model observed: AWS SSO assumed role
- Account observed: `337159794548`

Do not store access keys, secret values, session tokens, passwords, or private
keys in this artifact.

## Observed Hosting Shape

Kanbien is currently served from AWS ECS on Fargate.

Observed resources:

- ECS cluster: `kanbien-staging`
- ECS service: `service-platform`
- Launch type: `FARGATE`
- Desired count: `1`
- Running count at inspection time: `1`
- Task definition: `kanbien-staging-service-platform:5`
- Container name: `service-platform`
- Container port: `3000`
- Load balancer: `kanbien-staging-alb`
- Target group: `kanbien-staging-app-tg`
- Public Route 53 hosted zone: `kanbien.com.`

The ECS service was active and had reached steady state at inspection time.

## Public Traffic Path

Observed request path:

```text
Route 53
  -> kanbien-staging-alb
  -> kanbien-staging-app-tg
  -> ECS service service-platform
  -> Fargate task container port 3000
```

Route 53 records observed:

- `kanbien.com` A alias to `kanbien-staging-alb-1575766066.eu-west-1.elb.amazonaws.com`
- `www.kanbien.com` A alias to `kanbien-staging-alb-1575766066.eu-west-1.elb.amazonaws.com`

ALB listeners observed:

- HTTP port `80` redirects to HTTPS port `443` on host `www.kanbien.com`
- HTTPS port `443` forwards to `kanbien-staging-app-tg`
- TLS policy: `ELBSecurityPolicy-TLS13-1-2-2021-06`

## Health Checks

AWS currently depends on `/v1/health` in two places:

- ECS container health check calls
  `http://127.0.0.1:3000/v1/health`
- ALB target group health check calls `/v1/health` on traffic port `3000`

Target group health check settings observed:

- protocol: `HTTP`
- path: `/v1/health`
- expected HTTP code: `200`
- interval: `30` seconds
- timeout: `5` seconds
- healthy threshold: `2`
- unhealthy threshold: `3`

Compatibility rule:

- Do not materially change `/v1/health` semantics without an AWS compatibility
  plan. It is currently both the container health check and the ALB target
  health check.

## Runtime Configuration

Observed task definition environment values:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_SSL=true`
- `DATABASE_NAME=postgres`
- `ROOT_ADMIN_PUBLIC_ORIGIN=https://www.kanbien.com`
- `ASSETS_LOCAL_STORAGE_ROOT=/tmp/kanbien-assets`
- `REDIS_URL=rediss://...cache.amazonaws.com:6379`

Observed task definition secret references:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `ROOT_AUTH_BOOTSTRAP_PASSWORD`
- `ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY`

Secret values were not inspected or recorded.

Repo-side startup config contract observed in `src/config/env.ts`:

- required for app startup: `NODE_ENV`, `PORT`, `DATABASE_HOST`,
  `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`,
  `DATABASE_SSL`
- optional/defaulted runtime settings include root-auth TTLs, root-admin
  session settings, rate-limit settings, `REDIS_URL`, notification email
  sender, and asset local storage root

Repo-side migration config contract observed in `src/scripts/migrate.ts`:

- `ROOT_AUTH_BOOTSTRAP_PASSWORD` and `ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY` are
  required before bootstrap or repair migrations can run.
- Because AWS currently starts the container with migration-before-server
  ordering, these bootstrap values are deployment-critical even though they are
  read as optional values in `src/config/env.ts`.

Observed mapping status:

- AWS ECS provides the app startup database and server config names.
- AWS ECS provides the root-auth bootstrap secret names needed by the migration
  runner.
- AWS ECS does not currently show `OPENAI_*` configuration names. Source files
  read some `OPENAI_*` values directly from `process.env`, so AWS posture for
  OpenAI-backed features remains `unsure / needs decision`.

## Build And Release Artifact Shape

Observed ECR repository:

- `kanbien/service-platform`
- URI:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform`

Observed active image tags:

- `root-login-autofill-20260522-1`
- `staging-latest`

Observed active image digest:

- `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`

Observed active image metadata:

- pushed at: `2026-05-22T15:52:58Z`
- last recorded pull: `2026-05-22T15:54:43Z`
- approximate size: `116 MB`

Other observed ECR tags from the same inspection:

- `adedfd781094`
- `adedfd781094-2`
- `adedfd781094-3`
- `adedfd781094-4`

The tag prefix `adedfd781094` maps to repo commit:

- `adedfd781094fa6063dba2da62901f777ccd55b5`
- commit message: `Complete entity management canonical seam slice`
- commit time: `2026-05-22T12:38:51+01:00`

This ties at least part of the observed ECR image lineage to this repository's
Git history. It does not prove which Dockerfile, build context, local machine,
CI job, or image-push command produced the artifacts.

Observed ECS task-definition revision trail:

- revision `1`: image tag `adedfd781094`, registered
  `2026-05-22T11:57:47Z`
- revision `2`: image tag `adedfd781094-2`, registered
  `2026-05-22T12:02:39Z`
- revision `3`: image tag `adedfd781094-3`, registered
  `2026-05-22T12:12:42Z`
- revision `4`: image tag `adedfd781094-4`, registered
  `2026-05-22T12:18:11Z`
- revision `5`: image tag `root-login-autofill-20260522-1`, registered
  `2026-05-22T15:53:45Z`

All observed revisions used the same CPU, memory, environment-variable names,
secret names, container port, log group, and health-check shape. The observed
revision changes were image-tag changes. Each revision was registered by the
same AWS SSO administrator role used for discovery.

Observed current ECS service deployment state:

- service: `service-platform`
- cluster: `kanbien-staging`
- current task definition: `kanbien-staging-service-platform:5`
- desired count: `1`
- running count: `1`
- pending count: `0`
- deployment created at: `2026-05-22T15:54:11Z`
- deployment completed at: `2026-05-22T15:56:48Z`
- rollout state: `COMPLETED`

Recent ECS service events showed repeated `has reached a steady state`
messages from `2026-05-22` through the 2026-05-27 inspection. The latest 20
events inspected did not show a failure or rollback event.

ECR repository settings observed:

- image tag mutability: `MUTABLE`
- scan on push: enabled
- encryption: `AES256`

Compatibility notes:

- ECS currently consumes an ECR image artifact.
- `staging-latest` is mutable and should not be treated as durable release
  identity by itself.
- The immutable image digest is a stronger release-evidence anchor than
  `staging-latest`.
- The observed AWS release path likely included image push, ECS task-definition
  registration, and ECS service update steps, but the repo-side command or
  workflow that performed those steps is not yet identified.
- The repo-side image build path is not yet identified.

## Startup And Migration Evidence

CloudWatch logs observed for the active ECS task showed:

```text
Migration run complete. 0 file(s) applied.
Server listening on port 3000
```

The same log stream showed many migration files skipped as unchanged.

Public runtime verification observed on 2026-05-27:

- `https://www.kanbien.com/v1/health` returned HTTP `200`.
- Response body was `{"ok":true}`.
- Response content type was `application/json`.
- Security headers were present, including HSTS and CSP.
- `http://www.kanbien.com/v1/health` returned HTTP `301` to the HTTPS URL.

Compatibility rule:

- AWS currently runs the repo's migration-before-server startup behavior.
- Deployment depends on the database and root-auth bootstrap secret references
  being available before the HTTP server starts.
- Migrations must remain safe to execute on every ECS task start unless the
  deployment model is changed through an approved compatibility plan.
- Public deployment verification currently depends on `/v1/health` remaining
  reachable through the public HTTPS domain.

## Backing Services

Observed RDS instance:

- identifier: `database-1`
- engine: `postgres`
- engine version: `18.3`
- class: `db.t4g.micro`
- status: `available`
- publicly accessible: `false`
- storage encrypted: `true`
- backup retention: `1` day
- Multi-AZ: `false`
- deletion protection: `false`
- subnet group: `kanbien-staging-db-subnet-group`

Observed ElastiCache replication group:

- replication group: `kanbien-staging-redis`
- engine: `valkey`
- engine version: `8.0.1`
- node type: `cache.t4g.micro`
- status: `available`
- transit encryption: enabled and required
- at-rest encryption: enabled
- auth token: disabled
- Multi-AZ: disabled
- automatic failover: disabled
- snapshot retention: `0`

## Current Risk And Compatibility Notes

- The AWS resource names use `staging`, while Route 53 serves
  `kanbien.com` and `www.kanbien.com` from the staging-named ALB.
- This staging-versus-production relationship is genuinely ambiguous and needs
  human decision before renaming, splitting, or declaring environment policy.
- ECS deployment circuit breaker rollback is disabled.
- RDS and ElastiCache appear staging-sized and lack Multi-AZ/failover posture.
- RDS deletion protection is disabled.
- Asset bytes are configured under `/tmp/kanbien-assets`, which is ephemeral
  container storage.
- The repo does not yet expose an obvious Dockerfile, infrastructure-as-code
  definition, or CI/CD deploy workflow for the observed AWS path.
- The image build and task-definition registration process is observed, usage
  unknown.

## Classification

- ECS cluster/service/task definition: `deployment-harness/provider-aws`
- ALB, target group, listeners, and Route 53 records:
  `deployment-harness/provider-aws`
- RDS and ElastiCache backing services: `deployment-harness/provider-aws`
- Runtime env var contract: provider-specific implementation of
  provider-neutral deployment-harness runtime configuration
- Migration-before-server ordering: provider-neutral deployment-harness core
  behavior currently implemented through AWS ECS startup
- `/v1/health`: platform route with AWS deployment compatibility dependency
- Staging-versus-production naming: `unsure / needs decision`

## Unknowns

- How ECR images are built.
- How task definition revisions are registered.
- Whether deployment is manual, scripted locally, GitHub Actions based, or
  managed through another tool.
- Whether a separate production environment exists or is planned.
- Whether `kanbien-staging` is intentionally the public production-like
  environment.
- Whether any AWS infrastructure is intentionally managed outside this repo.
- Expected rollback procedure for a bad image or migration.
- Whether deployment evidence should be captured per release and where.
