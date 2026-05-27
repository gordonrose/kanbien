# AWS Manual Deploy Reconstruction

Date: 2026-05-27

## Purpose

Reconstruct the current likely AWS manual deployment path from repo and AWS
evidence without changing, approving, or replacing it.

This is a discovery artifact. It records what is observed, inferred, unknown,
and unsafe to run during discovery.

## Classification Key

- `observed`: proven by repo files, git history, or read-only AWS inspection
- `inferred`: likely because the observed AWS state implies it happened
- `unknown`: not proven yet
- `do not run during discovery`: command shape is useful context but would push
  artifacts, mutate AWS, deploy code, or change runtime state

## Current Chain Of Custody

The deployment chain we are trying to reconstruct is:

```text
source code
  -> build artifact
  -> ECR image
  -> ECS task definition
  -> ECS service rollout
  -> public smoke verification
  -> rollback target
```

Current confidence:

- source-to-image build recipe: `unknown`
- ECR image identity: `observed`
- ECS task-definition revision trail: `observed`
- ECS service rollout: `observed`
- public smoke verification: `observed`
- rollback command path: `unknown`

## Step 1: Source Revision

Status: `partly observed`, `active source unknown`

Observed:

- ECR tags with prefix `adedfd781094` map to repo commit
  `adedfd781094fa6063dba2da62901f777ccd55b5`.
- Active image tag is `root-login-autofill-20260522-1`.
- Local Git history search did not prove which source commit produced the
  active image.

Current conclusion:

- The repo proves lineage for earlier `adedfd781094*` image tags.
- The repo does not yet prove the exact source revision for the currently
  active image.

## Step 2: Build Local Image

Status: `unknown`, with shell-history evidence outside committed repo

Shell-history evidence reported during discovery:

```sh
docker context use desktop-linux
docker build -t kanbien-staging:local .
```

Repo evidence:

- `npm run build` exists and compiles TypeScript plus frontend assets.
- `npm start` exists and runs migrations before starting the server.
- No committed Dockerfile was found.
- No committed `.dockerignore`, compose file, Docker build script, or deploy
  workflow was found.

Current conclusion:

- A local Docker build probably happened, but the committed repo does not prove
  how the image was built.
- This is the weakest part of the current deployment chain.

Do not run during discovery:

```sh
docker build -t kanbien-staging:local .
```

Reason:

- Building may be safe locally in some contexts, but the current discovery goal
  is reconstruction, not reproducing or changing artifacts.

## Step 3: Authenticate Docker To ECR

Status: `inferred`, `do not run during discovery`

Observed:

- ECR repository exists:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform`
- Active ECS task consumes an image from that repository.

Likely command shape:

```sh
aws ecr get-login-password --profile kanbien-dev --region eu-west-1 \
  | docker login --username AWS --password-stdin \
    337159794548.dkr.ecr.eu-west-1.amazonaws.com
```

Current conclusion:

- ECR authentication must have happened before a local push, unless another
  build/push system was used.
- The repo does not prove whether this was run locally, by CI, or by another
  tool.

Do not run during discovery:

- This command contacts AWS and authenticates Docker to the registry.

## Step 4: Tag Image For ECR

Status: `inferred`

Observed active tags:

- `root-login-autofill-20260522-1`
- `staging-latest`

Likely command shape:

```sh
docker tag kanbien-staging:local \
  337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:<tag>
```

Current conclusion:

- The active image tags prove that some artifact was tagged for ECR.
- The exact local source image name and tagging command are not proven.

Do not run during discovery:

- Tagging alone is local, but it is part of the deploy mutation chain and should
  not be performed during documentation-only reconstruction.

## Step 5: Push Image To ECR

Status: `observed result`, `command inferred`, `do not run during discovery`

Observed:

- Active image digest:
  `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`
- Active image pushed at `2026-05-22T15:52:58Z`.
- Active image last recorded pull at `2026-05-22T15:54:43Z`.
- ECR repository scan-on-push is enabled.

Likely command shape:

```sh
docker push \
  337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:<tag>
```

Current conclusion:

- The push result is observed in ECR.
- The command or system that performed the push is unknown.

## Step 6: Register ECS Task Definition Revision

Status: `observed result`, `command unknown`, `do not run during discovery`

Observed ECS task-definition revisions:

- revision `1`: image tag `adedfd781094`
- revision `2`: image tag `adedfd781094-2`
- revision `3`: image tag `adedfd781094-3`
- revision `4`: image tag `adedfd781094-4`
- revision `5`: image tag `root-login-autofill-20260522-1`

Observed consistency:

- CPU, memory, environment-variable names, secret names, container port, log
  group, and health-check shape were the same across observed revisions.
- The observed revision changes were image-tag changes.

Likely AWS action:

```sh
aws ecs register-task-definition ...
```

Current conclusion:

- Task-definition registration definitely happened.
- The repo does not contain the task-definition JSON, registration command, or
  IaC source of truth.

Compatibility warning:

- Reconstructing this step later must preserve migration-before-server startup,
  `/v1/health` container health check, port `3000`, secret reference names, and
  runtime environment names unless a compatibility plan changes them.

## Step 7: Update ECS Service

Status: `observed result`, `command inferred`, `do not run during discovery`

Observed:

- ECS service `service-platform` runs task definition
  `kanbien-staging-service-platform:5`.
- Deployment created at `2026-05-22T15:54:11Z`.
- Deployment completed at `2026-05-22T15:56:48Z`.
- Rollout state is `COMPLETED`.
- Desired count was `1`; running count was `1`; pending count was `0`.

Likely command shape:

```sh
aws ecs update-service \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:<revision>
```

Current conclusion:

- ECS service update happened.
- The exact command, operator, and approval path are unknown.

## Step 8: Startup And Migration

Status: `observed`

Observed CloudWatch log lines:

```text
Migration run complete. 0 file(s) applied.
Server listening on port 3000
```

Observed runtime command behavior:

- `npm start` runs `node dist/scripts/migrate.js && node dist/server.js`.
- AWS currently depends on root-auth bootstrap secret references being present
  before startup migrations run.

Current conclusion:

- AWS currently runs migration-before-server startup.
- The observed active task applied no new migration files during that run.
- This does not prove future migration safety.

## Step 9: Public Smoke Verification

Status: `observed`

Observed public verification on 2026-05-27:

- `https://www.kanbien.com/v1/health` returned HTTP `200`.
- Response body was `{"ok":true}`.
- Response content type was `application/json`.
- Security headers were present, including HSTS and CSP.
- `http://www.kanbien.com/v1/health` returned HTTP `301` to the HTTPS URL.

Current conclusion:

- Public web health was verified.
- This does not prove user journeys, background jobs, asset durability,
  generated exports, or rollback readiness.

## Step 10: Rollback

Status: `partly inferable`, `not approved`, `do not run during discovery`

Observed:

- Previous ECS task-definition revisions exist.
- ECS deployment circuit breaker rollback is disabled.
- Mutable tag `staging-latest` exists.

Unknown:

- previous known-good source revision
- previous known-good immutable image digest
- approved rollback command path
- rollback behavior after a bad migration
- rollback behavior after a bad runtime config change

Possible command shape:

```sh
aws ecs update-service \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:<previous-known-good-revision>
```

Current conclusion:

- Rolling back by ECS task-definition revision may be possible.
- It is not yet an approved rollback path.
- Do not treat mutable tags as rollback identity.

## Current Manual Deploy Reconstruction

The current likely manual deploy path is:

```text
unknown source revision
  -> unknown Docker build recipe
  -> inferred ECR login
  -> inferred local image tag
  -> observed ECR image push result
  -> observed ECS task-definition registration result
  -> observed ECS service update result
  -> observed migration-before-server startup
  -> observed public /v1/health smoke
  -> rollback target unknown
```

## What This Proves

- AWS is serving a real ECR-backed ECS/Fargate deployment.
- The current runtime path depends on ECR, ECS task definitions, ECS service
  rollout, CloudWatch logs, ALB health checks, and public `/v1/health`.
- The deployment path is reconstructable enough to identify compatibility
  contracts.

## What This Does Not Prove

- The repo can rebuild the current image.
- The active image source commit is known.
- The deploy was performed from this repo.
- CI/CD exists.
- Rollback is safe or approved.
- AWS is production-ready.

## Next Discovery Questions

- Can we find or recover the Dockerfile/build recipe that produced the running
  image?
- Can we export the current ECS task-definition JSON as an observed AWS adapter
  baseline without storing secret values?
- Can we identify the prior known-good immutable digest for task-definition
  revision `4`?
- Should the next trial evidence record require the active source commit before
  any future production-like deployment is considered governed?
