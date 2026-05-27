# Build And Deploy Repeatability Recommendation

Date: 2026-05-27

## Purpose

Recommend how to approach the missing build, image-push, and ECS update path
without breaking the AWS deployment that already works.

This is not a Dockerfile design, CI/CD implementation, or AWS deployment
change.

## Recommendation

Reconstruct the current manual AWS build/deploy path first, then replace it
with a governed deployment harness only after the compatibility contract is
clear.

In practical terms:

- document the existing manual path as `observed, usage unknown`
- do not invent a new CI/CD path yet
- do not assume `staging-latest` is enough release identity
- use source commit plus immutable ECR image digest as the release evidence
  anchor
- treat Dockerfile, image tagging, task-definition registration, ECS service
  update, smoke verification, and rollback as one compatibility chain

## Evidence

The repo currently proves these facts:

- app build command exists: `npm run build`
- production start command exists: `npm start`
- AWS runs migration-before-server startup through the container
- ECR repository exists: `kanbien/service-platform`
- the active image digest is recorded in the AWS inventory
- ECR tags map at least part of the image lineage to repo commit
  `adedfd781094fa6063dba2da62901f777ccd55b5`
- ECS task definition revisions show image-tag progression
- ECS service rollout reached steady state
- public `/v1/health` returned `200`

The repo does not currently prove:

- which Dockerfile or build context produced the ECR images
- which command tagged and pushed the images
- which command registered task-definition revisions
- which command updated the ECS service
- which verification command was required before considering the deploy good
- which rollback command should be used for a bad image or migration

Current file/history inspection did not find a committed Dockerfile,
`.dockerignore`, docker compose file, ECR push script, ECS deploy script,
infrastructure-as-code definition, or GitHub Actions deploy workflow.

## Why Reconstruct Before Replacing

The current AWS deployment is live and publicly reachable. Replacing the path
too early could break compatibility in quiet ways:

- image may start with a different command or missing migration behavior
- build may omit copied frontend assets
- environment variables or secret names may drift
- task health checks may no longer match `/v1/health`
- rollback may become harder if tags are mutable and digests are not captured
- asset storage and worker-process gaps may be mistaken for solved deployment
  behavior

Reconstruction gives the harness a known baseline. After that, a governed path
can intentionally improve it.

## Minimum Manual Runbook To Recover

Before implementing automation, the repo should be able to describe a manual
AWS deploy in terms of:

- source commit SHA
- image tag and immutable digest
- image build command and build context
- ECR login, tag, and push command shape
- task-definition registration inputs
- ECS service update command
- migration-before-server compatibility rule
- public health verification
- rollback target and command

Secret values and access keys must stay outside the repo.

## Do Not Do Yet

- Do not add a Dockerfile without deciding the runtime image contract.
- Do not add a GitHub Actions deploy workflow before the manual path is
  recoverable.
- Do not deploy or mutate AWS during discovery.
- Do not retag or push images during documentation work.
- Do not treat `staging-latest` as durable release evidence by itself.

