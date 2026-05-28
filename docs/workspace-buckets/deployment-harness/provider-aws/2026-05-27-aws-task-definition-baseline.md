# AWS Task Definition Baseline

Date: 2026-05-27

## Purpose

Record the current ECS task-definition shape that AWS uses to run Kanbien.

This is a redacted AWS adapter baseline. It is not infrastructure-as-code, not
an approved target task definition, and not a deploy instruction.

## Inspection Scope

Read-only AWS inspection:

```sh
aws ecs describe-task-definition --task-definition kanbien-staging-service-platform:5 --profile kanbien-dev --region eu-west-1
aws ecs describe-services --cluster kanbien-staging --services service-platform --profile kanbien-dev --region eu-west-1
```

Secret values were not requested, inspected, or recorded.

## Task Definition Identity

Observed:

- family: `kanbien-staging-service-platform`
- revision: `5`
- status: `ACTIVE`
- compatibility: `FARGATE`
- network mode: `awsvpc`
- task CPU: `512`
- task memory: `1024`
- runtime platform: Linux on `X86_64`
- task role: `kanbien-staging-ecs-task-role`
- execution role: `kanbien-staging-ecs-task-execution-role`
- registered at: `2026-05-22T15:53:45Z`
- registered by: AWS SSO administrator role for `gordon-kanbien`

Classification:

- `deployment-harness/provider-aws`

## Container Shape

Observed container:

- name: `service-platform`
- essential: `true`
- image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1`
- container CPU: `0`
- container memory override: none observed
- container memory reservation: none observed
- entry point: none observed
- command override: none observed
- working directory override: none observed

Interpretation:

- ECS starts the image with its image-defined default command.
- Because no task-definition command override is present, the image build must
  supply the production startup behavior.
- Repo `npm start` runs migration-before-server startup, but the task
  definition alone does not prove the image default command.

## Port Mapping

Observed:

- container port: `3000`
- host port: `3000`
- protocol: `tcp`

Compatibility rule:

- Preserve port `3000` unless ALB target-group, container health check, app
  `PORT`, and public smoke verification are changed together.

## Health Check

Observed ECS container health check:

```text
CMD-SHELL node -e "require('http').get('http://127.0.0.1:3000/v1/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
```

Observed settings:

- interval: `30` seconds
- timeout: `5` seconds
- retries: `3`
- start period: `60` seconds

Compatibility rule:

- `/v1/health` is part of the AWS adapter contract. Changing its path,
  response semantics, or port requires an AWS compatibility plan.

## Environment Values

Observed non-secret environment values:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_SSL=true`
- `DATABASE_NAME=postgres`
- `ROOT_ADMIN_PUBLIC_ORIGIN=https://www.kanbien.com`
- `ASSETS_LOCAL_STORAGE_ROOT=/tmp/kanbien-assets`
- `REDIS_URL` present and points to the staging Valkey/Redis endpoint over TLS

Redaction note:

- The Redis hostname was inspected only to confirm provider wiring. The full
  URL is not repeated here because this baseline only needs the contract:
  `REDIS_URL` is present and uses `rediss://`.

Compatibility rules:

- `NODE_ENV=production` and `PORT=3000` shape the app runtime.
- `ROOT_ADMIN_PUBLIC_ORIGIN=https://www.kanbien.com` ties the task definition
  to the public domain.
- `ASSETS_LOCAL_STORAGE_ROOT=/tmp/kanbien-assets` means asset/export bytes are
  currently container-local and should be treated as ephemeral.
- `REDIS_URL` presence does not prove dispatcher, worker, or scheduler
  processes are deployed.

## Secret Reference Names

Observed secret reference names:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `ROOT_AUTH_BOOTSTRAP_PASSWORD`
- `ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY`

Secret values were not inspected.

Compatibility rule:

- These names are deployment-critical because AWS currently runs
  migration-before-server startup and the migration runner requires root-auth
  bootstrap values for bootstrap or repair migration paths.

## Logging

Observed log configuration:

- log driver: `awslogs`
- log group: `/ecs/kanbien-staging-service-platform`
- region: `eu-west-1`
- stream prefix: `ecs`

Compatibility rule:

- Deployment verification currently depends on CloudWatch logs being available
  for startup and migration evidence.

## ECS Service Runtime Shape

Observed service:

- cluster: `kanbien-staging`
- service: `service-platform`
- task definition:
  `kanbien-staging-service-platform:5`
- launch type: `FARGATE`
- platform version: `LATEST`
- desired count: `1`
- running count at inspection time: `1`
- pending count at inspection time: `0`
- health-check grace period: `180` seconds

Observed deployment configuration:

- strategy: `ROLLING`
- minimum healthy percent: `100`
- maximum percent: `200`
- deployment circuit breaker enabled: `false`
- deployment circuit breaker rollback: `false`
- bake time: `0` minutes

Observed load balancer attachment:

- target group: `kanbien-staging-app-tg`
- container name: `service-platform`
- container port: `3000`

Observed network posture:

- `awsvpc` networking
- public IP assignment: enabled
- two subnets attached
- one security group attached

Network identifiers are not repeated here because this baseline is about the
task-definition contract, not a full VPC inventory.

## Compatibility Contracts To Preserve

Before replacing or automating this task definition, preserve or explicitly
re-decide:

- image repository:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform`
- container name: `service-platform`
- app port: `3000`
- ECS container health check against `/v1/health`
- ALB target-group mapping to container port `3000`
- migration-before-server startup behavior
- root-auth bootstrap secret reference names
- database secret reference names
- CloudWatch log group and stream-prefix expectations
- public origin `https://www.kanbien.com`
- asset/export storage risk from `/tmp/kanbien-assets`
- lack of ECS circuit-breaker rollback

## Unknowns

- Which original Dockerfile produced the active image.
- Whether the task definition was registered manually, by script, by CI, or by
  another infrastructure tool.
- Whether the current task role and execution role are least-privilege.
- Whether public IP assignment is intentional long-term.
- Whether circuit-breaker rollback should remain disabled.
- Whether the ECS service should eventually include worker, dispatcher, or
  scheduler processes as separate services or tasks.

## Do Not Do Yet

- Do not register a new task definition during discovery.
- Do not update the ECS service during discovery.
- Do not copy full secret ARNs or secret values into docs.
- Do not turn this baseline into infrastructure-as-code until the build recipe
  and manual deploy path are understood.
