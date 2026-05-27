# Observed AWS Current Release Evidence

Date recorded: 2026-05-27

## Purpose

Record the first trial release evidence note for the currently observed AWS
deployment.

This record reconstructs evidence from read-only discovery. It does not prove
the original deployment command path, approve the deployment, or claim rollback
readiness.

## Release Intent

Observed release posture:

- provider: AWS
- environment classification:
  `public production-like staging`
- release status: observed already deployed
- original release approver: unknown
- reason for release: unknown
- source branch: unknown
- source commit for active image: unknown

Related lineage evidence:

- ECR tags with prefix `adedfd781094` map to repo commit
  `adedfd781094fa6063dba2da62901f777ccd55b5`
- the active image tag is different:
  `root-login-autofill-20260522-1`
- a local Git history search did not identify a commit that proves the active
  image source revision

## Artifact Identity

Observed ECR repository:

- repository: `kanbien/service-platform`
- URI:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform`

Observed active image tags:

- `root-login-autofill-20260522-1`
- `staging-latest`

Observed active image digest:

- `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`

Observed image metadata:

- pushed at: `2026-05-22T15:52:58Z`
- last recorded pull: `2026-05-22T15:54:43Z`
- approximate size: `116 MB`

Build command, Dockerfile, build context, and image-push command are unknown.

## Target

Observed AWS target:

- ECS cluster: `kanbien-staging`
- ECS service: `service-platform`
- task definition: `kanbien-staging-service-platform:5`
- container name: `service-platform`
- container port: `3000`
- load balancer: `kanbien-staging-alb`
- target group: `kanbien-staging-app-tg`
- public domain: `www.kanbien.com`

Observed runtime process set:

- web process: observed
- job dispatcher: not observed in AWS
- job worker: not observed in AWS
- scheduler: not observed in AWS

## Migration Evidence

CloudWatch logs for the active ECS task showed:

```text
Migration run complete. 0 file(s) applied.
Server listening on port 3000
```

The same log stream showed many migration files skipped as unchanged.

Interpretation:

- migration-before-server startup is active in AWS
- this observed startup applied no new migration files during that run
- this does not prove that future migrations are safe to apply during ECS task
  startup

## Rollout Evidence

Observed ECS service deployment state:

- deployment created at: `2026-05-22T15:54:11Z`
- deployment completed at: `2026-05-22T15:56:48Z`
- desired count: `1`
- running count at inspection time: `1`
- pending count at inspection time: `0`
- rollout state: `COMPLETED`

Recent ECS service events showed repeated steady-state messages from
`2026-05-22` through the `2026-05-27` inspection. The latest 20 events
inspected did not show a failure or rollback event.

ECS deployment circuit breaker rollback was observed as disabled.

## Smoke Evidence

Public runtime verification observed on 2026-05-27:

- `https://www.kanbien.com/v1/health` returned HTTP `200`
- response body was `{"ok":true}`
- response content type was `application/json`
- security headers were present, including HSTS and CSP
- `http://www.kanbien.com/v1/health` returned HTTP `301` to the HTTPS URL

This proves the public health endpoint responded at inspection time. It does
not prove all user-facing journeys, background jobs, asset storage, generated
exports, or rollback readiness.

## Rollback Target

Rollback readiness is not proven.

Observed prior task-definition revisions:

- revision `1`: image tag `adedfd781094`
- revision `2`: image tag `adedfd781094-2`
- revision `3`: image tag `adedfd781094-3`
- revision `4`: image tag `adedfd781094-4`

Known rollback gaps:

- previous known-good source revision is not explicitly recorded
- previous known-good immutable image digest is not recorded in this evidence
  note
- approved rollback command path is unknown
- rollback behavior after a bad migration is unknown
- rollback behavior after a bad runtime config change is unknown

Do not treat `staging-latest` as rollback identity.

## Known Gaps

- The repo does not yet contain the Dockerfile or build recipe for this image.
- The repo does not yet contain the ECR push command path.
- The repo does not yet contain the ECS task-definition registration command
  path.
- The repo does not yet contain the ECS service update command path.
- The active image source commit is not proven.
- AWS currently appears web-only; dispatcher, worker, and scheduler processes
  were not observed.
- AWS asset/export storage is currently treated as ephemeral container-local
  storage.
- Public health success is not production readiness.
- This record was reconstructed after deployment rather than captured during
  deployment.

## Classification

- provider-neutral record shape:
  `deployment-harness`
- AWS evidence mapping:
  `deployment-harness/provider-aws`
- release status:
  `observed, usage unknown`
