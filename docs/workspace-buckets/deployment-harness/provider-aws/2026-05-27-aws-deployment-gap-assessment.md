# AWS Deployment Gap Assessment

Date: 2026-05-27

## Purpose

Loop through the remaining AWS deployment discovery gaps after the first
inventory, manual deploy reconstruction, release evidence record, and ECS task
definition baseline.

This is still `what is` discovery. It does not choose the future deployment
architecture, add CI/CD, change AWS, or approve rollback.

## Scope And Safety

Inspection used:

- repo file search for Docker, deploy, ECR, ECS, IaC, and workflow files
- package script inspection
- Git history search for deployment/image clues
- shell-history search for Docker/ECR/ECS command clues
- read-only AWS ECR, ECS, and CloudWatch Logs listing/describe commands

Not inspected or recorded:

- `.env`
- secret values
- secret ARNs
- AWS resource mutation commands
- Docker build/push/deploy execution

## Gap 1: Dockerfile / Image Build Recipe

Current status: `publish recipe mostly recovered`, `Dockerfile contents still unknown`

What is known:

- `npm run build` exists and compiles TypeScript plus frontend assets.
- `npm start` exists and runs `node dist/scripts/migrate.js && node
  dist/server.js`.
- The active ECS task definition has no command override, so the image itself
  must supply the production startup command.
- Shell-history evidence confirms:

```sh
docker context use desktop-linux
docker build -t kanbien-staging:local .
```
- Docker Desktop logs confirm the tag/push flow for
  `root-login-autofill-20260522-1` and `staging-latest`.
- Buildx references show the build context was `/home/gordon/kanbien` and
  `DockerfilePath` was empty, meaning Docker used the default Dockerfile path in
  the repo root.

What was re-checked:

- repo file search did not find a committed Dockerfile, `.dockerignore`, Docker
  compose file, deploy script, ECR script, ECS script, IaC definition, or deploy
  workflow.
- Docker is not available as a command in the current WSL environment.

Current interpretation:

- The local Docker build and ECR publish sequence are now mostly recovered.
- The original root Dockerfile contents remain unrecovered.
- The exact image default command and Dockerfile layer recipe remain the largest
  deployment-chain gap.

Next discovery action:

- Start Docker Desktop / WSL integration and run `docker inspect` plus
  `docker history` on the local image if it still exists.
- If local inspection cannot recover the Dockerfile behavior, treat the later
  Dockerfile as a new compatibility reconstruction rather than the original
  known recipe.

## Gap 2: Active Image Source Commit

Current status: `still unknown`

What is known:

- Active image tag:
  `root-login-autofill-20260522-1`
- Active image digest:
  `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`
- Active image was pushed at `2026-05-22T15:52:58Z`.
- Earlier ECR tags with prefix `adedfd781094` map to repo commit
  `adedfd781094fa6063dba2da62901f777ccd55b5`.

What was re-checked:

- Git history search did not prove which source commit produced the active
  `root-login-autofill-20260522-1` image.

Current interpretation:

- The active image has strong artifact identity but weak source identity.
- The active image source commit should remain `unknown` until proven.

Next discovery action:

- Look for local build notes, Docker image labels, release notes, or external
  deployment chat/history that ties `root-login-autofill-20260522-1` to a Git
  commit.

## Gap 3: Task Definition Registration Command

Current status: `observed result`, `command still unknown`

What is known:

- ECS task-definition revision `5` exists and is active.
- Revisions `1` through `5` show image-tag progression.
- Revision `5` uses the active image tag.
- The task definition was registered by the observed AWS SSO administrator
  role.

What was re-checked:

- repo search did not find a committed task-definition JSON file, ECS register
  script, IaC source, or CI deploy workflow.

Current interpretation:

- Task-definition registration definitely happened.
- The original registration command or tool remains unknown.

Next discovery action:

- If needed, export the current task-definition JSON as a redacted observed
  adapter baseline input, but do not treat it as source-of-truth IaC.

## Gap 4: ECS Service Update Command

Current status: `observed result`, `command still unknown`

What is known:

- ECS service `service-platform` runs task definition
  `kanbien-staging-service-platform:5`.
- Deployment reached `COMPLETED`.
- Desired count is `1`, running count is `1`, pending count is `0`.

What was re-checked:

- repo search did not find an ECS update-service script or deploy workflow.

Current interpretation:

- ECS service update definitely happened.
- The original operator command, approval path, and automation source remain
  unknown.

Next discovery action:

- Search external notes or shell history from the machine/session that performed
  the deployment.

## Gap 5: Rollback Target

Current status: `partly improved`, `not approved`

What is known:

- Previous ECS task-definition revision `4` exists.
- ECR tag `adedfd781094-4` has immutable digest:
  `sha256:d80e30b289e65f085dafd37ca296c1395bd312e6569d297ebbcebffa8f2add70`
- The `adedfd781094` prefix maps to repo commit
  `adedfd781094fa6063dba2da62901f777ccd55b5`.
- ECS deployment circuit breaker rollback is disabled.

Current interpretation:

- We now have a concrete candidate prior task-definition/image pair.
- This is not the same as an approved rollback target.
- Rollback after bad migrations, bad config, or durable-data changes remains
  unresolved.

Next discovery action:

- Decide what evidence is required before calling revision `4` a previous
  known-good rollback target.

## Gap 6: Background Jobs In AWS

Current status: `still web-only observed`

What is known:

- Repo scripts exist for:
  - `start:jobs:dispatcher`
  - `start:jobs:worker`
  - `start:jobs:scheduler`
- AWS ECS service listing for cluster `kanbien-staging` shows only
  `service-platform`.
- CloudWatch log groups with `/ecs/kanbien-staging` prefix show only
  `/ecs/kanbien-staging-service-platform`.
- `REDIS_URL` is present in the web task definition.

Current interpretation:

- Redis/Valkey is configured, but job processes are not observed in AWS.
- Background job completion must not be assumed in the current AWS deployment.

Next discovery action:

- Decide whether current AWS is intentionally web-only, manual-job only, or
  missing required background runtime.

## Gap 7: Durable Asset / Export Storage

Current status: `risk documented`, `not solved`

What is known:

- AWS task definition sets
  `ASSETS_LOCAL_STORAGE_ROOT=/tmp/kanbien-assets`.
- Repo asset integration uses local filesystem storage when local storage root
  is configured.
- Organization export integration stores generated exports under the asset
  local storage root plus an `exports` subfolder.
- ADR-0035 leaves production object-store provider selection as follow-up.

Current interpretation:

- Current AWS asset/export bytes should be treated as ephemeral
  container-local storage.
- This remains a production-like deployment risk.

Next discovery action:

- Before production-like reliance on uploads/logos/exports, decide the durable
  storage provider and delivery/cleanup/recovery contract.

## Gap 8: Environment Identity

Current status: `classified for now`, `human decision still needed`

What is known:

- AWS resource names and tags say staging.
- Route 53 and public origin use `kanbien.com` / `www.kanbien.com`.
- `NODE_ENV=production`.
- Current recommendation classifies the environment as
  `public production-like staging`.

Current interpretation:

- This classification is good enough for caution during discovery.
- It is not a final environment policy.

Next discovery action:

- Gordon should eventually decide whether this environment is staging-only,
  production-like staging, production, or one side of a future split.

## Gap 9: CI/CD

Current status: `not present for deployment`

What is known:

- `.github/workflows/frontend-gate.yml` exists.
- The workflow validates frontend governance and visual gates.
- No GitHub Actions deploy workflow was found.
- Package scripts include repo git guardrails but no Docker/ECR/ECS deployment
  script.

Current interpretation:

- CI exists for frontend gates.
- CD for AWS deployment is not observed in the repo.
- Adding CI/CD now would be premature because the manual deploy path and build
  recipe are still not recoverable enough.

Next discovery action:

- Keep CI/CD as a future implementation topic after the current build recipe,
  task registration, service update, release evidence, and rollback contracts
  are known.

## Overall Current Position

The AWS deployment is real and publicly reachable, and the middle/end of the
chain is now well observed:

- ECR image
- ECS task definition
- ECS service rollout
- CloudWatch startup evidence
- public `/v1/health` smoke

The beginning and recovery ends remain weak:

- source commit for active image
- Dockerfile contents and image default command
- original registration/update commands
- approved rollback target and procedure

## Recommended Next Discovery Slice

Stay in `what is` mode and focus on local image inspection.

Best next question:

- Can Docker Desktop / WSL expose the local image so `docker inspect` and
  `docker history` can recover the image default command and layer history?

If not, the later work should treat the Dockerfile as a new compatibility
reconstruction, not as something already known.
