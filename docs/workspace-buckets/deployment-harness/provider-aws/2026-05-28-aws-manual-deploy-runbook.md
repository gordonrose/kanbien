# AWS Manual Deploy Runbook

Date: 2026-05-28

## Purpose

Define the first non-secret manual AWS deploy runbook for the service platform.

This is a compatibility runbook for a human-approved production-like deploy. It
does not create CI/CD, approve rollback, replace infrastructure-as-code, or
authorize any AWS mutation during documentation work.

## Safety Posture

Run this only after an explicit deployment approval.

Do not paste secret values into shell history, release evidence, or repo docs.
Use AWS profiles, IAM roles, ECR auth tokens, ECS secret references, and
CloudWatch evidence instead of recording secret material.

From WSL, use Docker's default Unix-socket context explicitly:

```sh
docker --context default ...
```

Unqualified `docker ...` may hit the incompatible `desktop-linux` / `npipe`
context from WSL.

## Required Inputs

Choose and record these before building:

- source branch and full source commit SHA
- human approver for the deployment
- immutable image tag for this release
- target AWS profile, account, region, cluster, service, and task-definition
  family
- previous known-good task-definition revision and immutable image digest, if
  rollback is expected to be claimable

Current observed AWS adapter defaults:

- AWS profile: `kanbien-dev`
- AWS region: `eu-west-1`
- ECR repository:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform`
- ECR repository name: `kanbien/service-platform`
- ECS cluster: `kanbien-staging`
- ECS service: `service-platform`
- task-definition family: `kanbien-staging-service-platform`
- container name: `service-platform`
- app port: `3000`
- public smoke URL: `https://www.kanbien.com/v1/health`

## Environment Setup

Use variables so the evidence record can quote intent without copying secrets:

```sh
export AWS_PROFILE=kanbien-dev
export AWS_REGION=eu-west-1
export AWS_ACCOUNT_ID=337159794548
export ECR_REPOSITORY_NAME=kanbien/service-platform
export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
export IMAGE_REPOSITORY="${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}"
export ECS_CLUSTER=kanbien-staging
export ECS_SERVICE=service-platform
export TASK_FAMILY=kanbien-staging-service-platform
export CONTAINER_NAME=service-platform
export SOURCE_COMMIT="$(git rev-parse HEAD)"
export IMAGE_TAG="<immutable-release-tag>"
export IMAGE_URI="${IMAGE_REPOSITORY}:${IMAGE_TAG}"
```

The image tag should be unique and immutable in practice, such as a short commit
plus release attempt suffix. Do not use `staging-latest` as the release identity
or rollback identity.

## Preflight

Confirm the intended source and repo guardrails:

```sh
git status --short --branch
npm run git:preflight
npm run check:static
```

Confirm Docker context access from WSL:

```sh
id
groups owner
stat -c '%U %G %a %n' /var/run/docker.sock
docker --context default version
```

Stop if the source commit, dirty state, or Docker context is not what the
release approver expects.

## Step 1: Build The Image

Build the repo's reconstructed runtime image:

```sh
docker --context default build -t kanbien-service-platform:reconstructed .
```

Inspect the local image before tagging it for ECR:

```sh
docker --context default inspect kanbien-service-platform:reconstructed
docker --context default history kanbien-service-platform:reconstructed
docker --context default run --rm --entrypoint sh \
  kanbien-service-platform:reconstructed \
  -lc 'node --version; npm --version; pwd; test -f dist/src/server.js; test -f dist/src/scripts/migrate.js; test -d src/features; test -d node_modules; printf "runtime-files-ok\n"'
```

Evidence to capture:

- source commit SHA
- build command
- image config summary: entrypoint, command, workdir, exposed ports, env names
- runtime file check result
- any vulnerability/audit output that affects release approval

## Step 2: Tag The Image With An Immutable Tag

Tag the validated local image for ECR:

```sh
docker --context default tag \
  kanbien-service-platform:reconstructed \
  "${IMAGE_URI}"
```

Evidence to capture:

- local image name
- ECR image URI
- immutable image tag

Do not tag or push `staging-latest` unless a separate approval says this
environment still needs that compatibility alias.

## Step 3: Authenticate Docker To ECR

Authenticate Docker to ECR without recording the token:

```sh
aws ecr get-login-password \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  | docker --context default login \
      --username AWS \
      --password-stdin "${ECR_REGISTRY}"
```

Evidence to capture:

- AWS profile name
- AWS region
- ECR registry host
- success or failure of the login command

Do not record the login token.

## Step 4: Push The Immutable Image Tag

Push only the approved immutable tag:

```sh
docker --context default push "${IMAGE_URI}"
```

Read back the immutable digest from ECR:

```sh
aws ecr describe-images \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --repository-name "${ECR_REPOSITORY_NAME}" \
  --image-ids imageTag="${IMAGE_TAG}" \
  --query 'imageDetails[0].{imageDigest:imageDigest,imagePushedAt:imagePushedAt,imageSizeInBytes:imageSizeInBytes,imageTags:imageTags}' \
  --output json
```

Evidence to capture:

- immutable image digest
- pushed timestamp
- scan-on-push status or scan result timing when available
- confirmation that `staging-latest` was not used as release identity

## Step 5: Register A New Task Definition Revision

Create a new task-definition registration input from the current AWS task
definition shape, changing only the container image unless a separate
compatibility decision approves more changes.

The new revision must preserve:

- family `kanbien-staging-service-platform`
- Fargate / `awsvpc` runtime shape
- task CPU `512` and memory `1024`
- task role and execution role references
- container name `service-platform`
- container port `3000`
- `/v1/health` container health check
- non-secret environment variable names and values already approved for AWS
- secret reference names, without recording secret values
- CloudWatch log group and stream prefix

Command shape:

```sh
aws ecs describe-task-definition \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --task-definition "${TASK_FAMILY}" \
  --query 'taskDefinition' \
  --output json > /tmp/kanbien-current-task-definition.json
```

Prepare `/tmp/kanbien-next-task-definition.json` from that file by removing
AWS-managed read-only fields and replacing only the `service-platform`
container image with `${IMAGE_URI}`.

Register the new revision:

```sh
aws ecs register-task-definition \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --cli-input-json file:///tmp/kanbien-next-task-definition.json
```

Evidence to capture:

- new task-definition ARN and revision
- image URI recorded in the registered container definition
- confirmation that no command override was added
- confirmation that secret values were not exported or stored

Stop if the task-definition diff changes anything beyond the approved image
URI and expected AWS-managed metadata.

## Step 6: Update The ECS Service

Update the service to the newly registered task-definition revision:

```sh
export NEXT_TASK_DEFINITION_ARN="<new-task-definition-arn-or-family:revision>"

aws ecs update-service \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --cluster "${ECS_CLUSTER}" \
  --service "${ECS_SERVICE}" \
  --task-definition "${NEXT_TASK_DEFINITION_ARN}"
```

Wait for ECS to report service stability:

```sh
aws ecs wait services-stable \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --cluster "${ECS_CLUSTER}" \
  --services "${ECS_SERVICE}"
```

Read back rollout state:

```sh
aws ecs describe-services \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --cluster "${ECS_CLUSTER}" \
  --services "${ECS_SERVICE}" \
  --query 'services[0].{serviceName:serviceName,taskDefinition:taskDefinition,desiredCount:desiredCount,runningCount:runningCount,pendingCount:pendingCount,deployments:deployments[*].{id:id,status:status,taskDefinition:taskDefinition,desiredCount:desiredCount,runningCount:runningCount,pendingCount:pendingCount,rolloutState:rolloutState,rolloutStateReason:rolloutStateReason,createdAt:createdAt,updatedAt:updatedAt},events:events[0:5]}' \
  --output json
```

Evidence to capture:

- service update command
- new task-definition revision
- deployment creation and completion timestamps
- desired, running, and pending counts
- rollout state and recent service events

## Step 7: Verify Startup, Migration, And Public Smoke

Confirm CloudWatch startup evidence for the new task:

```sh
aws logs tail /ecs/kanbien-staging-service-platform \
  --profile "${AWS_PROFILE}" \
  --region "${AWS_REGION}" \
  --since 30m
```

Look for:

- migration runner startup
- migration result
- `Server listening on port 3000`
- absence of repeated crash or health-check failure messages

Run public smoke checks:

```sh
curl -sS -i --max-time 15 https://www.kanbien.com/v1/health
curl -I --max-time 15 http://www.kanbien.com/v1/health
```

Expected smoke posture:

- HTTPS health returns HTTP `200`
- health body remains `{"ok":true}`
- HTTP health redirects to HTTPS
- smoke evidence does not claim user journeys, background workers, asset
  durability, exports, or rollback are healthy

## Step 8: Capture Release Evidence

Create a release evidence note under:

```text
docs/workspace-buckets/deployment-harness/release-evidence/
```

Use the sections from
`docs/workspace-buckets/deployment-harness/2026-05-27-release-evidence-record-shape.md`.

At minimum, record:

- release intent: source branch, source commit, reason, approver
- artifact identity: ECR repository, immutable tag, immutable digest, build
  command
- target: AWS account/profile name, region, ECS cluster, service,
  task-definition revision, container name
- migration evidence: CloudWatch log pointers and migration result
- rollout evidence: ECS rollout state, counts, timestamps, service events
- smoke evidence: exact URLs, status codes, response body for health, redirect
  behavior
- rollback target: previous task-definition revision and previous immutable
  image digest, or a clear statement that rollback identity is not proven
- known gaps: any missing source, digest, migration, smoke, or rollback
  evidence

Do not call the deployment complete until the release evidence record exists
and includes the immutable image digest that ECS is running.

## Stop Gates

Stop before mutating AWS if:

- source commit or branch does not match release approval
- working tree is dirty for unrelated changes
- Docker is not reachable through `docker --context default`
- image inspection does not preserve `/app`, port `3000`, Node `24.16.0`, or
  migration-before-server startup
- ECR push returns a digest that cannot be read back
- task-definition input changes secret references, environment names, port,
  health check, log group, roles, or command behavior without explicit approval
- previous known-good rollback identity is required but unavailable

Stop after AWS mutation and begin incident handling if:

- ECS does not reach stable service state
- new tasks crash or fail health checks
- migration logs show unexpected failures
- public health does not return the expected HTTPS `200`

## Explicit Non-Goals

This runbook does not:

- push or deploy during documentation work
- approve mutable `staging-latest` as release identity
- approve automatic rollback
- deploy dispatcher, worker, or scheduler processes
- solve asset/export durability from `/tmp/kanbien-assets`
- harden the base image or remediate scan findings
- replace the eventual need for infrastructure-as-code or CI/CD
