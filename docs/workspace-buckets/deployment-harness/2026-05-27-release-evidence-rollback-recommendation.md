# Release Evidence And Rollback Recommendation

Date: 2026-05-27

## Purpose

Record the minimum release-evidence and rollback posture Kanbien should require
before treating the current AWS deployment path as production-like.

This is a discovery and compatibility note. It does not deploy, roll back,
change ECS settings, enable AWS rollback automation, or define a full incident
management program.

## Recommendation

Treat public `/v1/health` success as necessary but not sufficient deployment
evidence.

For every production-like deployment, the deployment harness should capture a
small release record that proves:

- which source revision was released
- which immutable image digest was deployed
- which target environment and task definition revision received it
- whether migrations ran before the server started
- whether the service reached steady state
- whether public smoke verification passed
- what the intended rollback target is

Until that evidence and rollback target are captured, classify the AWS release
path as `observed, usage unknown` rather than governed CI/CD.

## Current Evidence

Repo and AWS discovery already prove some release facts:

- `/v1/health` exists as a platform route and returns `{ "ok": true }`.
- AWS uses `/v1/health` for both ECS container health and ALB target-group
  health.
- Public `https://www.kanbien.com/v1/health` returned HTTP `200` during
  discovery.
- CloudWatch logs showed migration-before-server startup completing before
  `Server listening on port 3000`.
- ECS reported the active deployment reached steady state.
- The active ECR image digest was observed and recorded in the AWS inventory.
- ECR tags map at least part of the image lineage to a Git commit.

Those facts are useful evidence, but they do not yet prove a repeatable deploy
process or an approved rollback procedure.

## Current Gaps

The repo does not currently prove:

- which committed build recipe produced the running image
- which command tagged and pushed the image to ECR
- which command registered the ECS task-definition revision
- which command updated the ECS service
- whether a failed deployment should roll back by task-definition revision,
  immutable image digest, source revert, config change, database repair, or a
  combination of those
- what evidence should be recorded when a migration succeeds, fails, or changes
  durable data
- who approves rollback when public production-like traffic is involved

The architecture map also marks these layers as `missing`:

- deployment and release architecture
- incident, SLO, and reliability model
- backup, restore, and disaster recovery model

That means the deployment harness should record a narrow release-evidence
minimum now, while avoiding fake certainty about the broader SRE model.

## AWS Compatibility Rules

- Preserve `/v1/health` compatibility until the AWS health-check contract is
  intentionally changed.
- Preserve migration-before-server startup unless a deploy-order compatibility
  plan is approved.
- Use immutable ECR image digest as the release-evidence anchor; do not rely on
  mutable tags such as `staging-latest` alone.
- Treat ECS steady state as rollout evidence, not complete production
  readiness.
- Do not enable or assume automatic ECS rollback behavior without recording how
  it interacts with migrations, durable data, config, and smoke verification.
- Do not claim rollback is safe until the rollback target and command path are
  known.

## Provider-Neutral Contract To Define Next

A future deployment-harness core contract should define a short release record
for any provider:

- source revision
- artifact identity
- target environment
- runtime process set
- migration/deploy ordering evidence
- smoke verification result
- rollback target
- rollback safety notes

AWS provider notes should then explain how ECS, ECR, CloudWatch, ALB health
checks, and Route 53 satisfy that contract.

## Do Not Do Yet

- Do not add a CI/CD deploy workflow before the manual AWS path is recoverable.
- Do not mutate ECS deployment settings during discovery.
- Do not treat health-check success as proof of rollback readiness.
- Do not define SLOs, incident roles, or disaster recovery targets in this note.
  Those require a separate operations decision.
