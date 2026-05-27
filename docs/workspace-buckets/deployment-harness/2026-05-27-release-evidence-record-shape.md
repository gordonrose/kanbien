# Release Evidence Record Shape

Date: 2026-05-27

## Purpose

Define the first small release evidence record shape for Kanbien deployment
work.

This is not a required template yet. It is the minimum shape to try when the
next production-like deployment is reconstructed or performed.

## Recommendation

Use one short Markdown note per production-like deployment.

The note should answer the questions a future operator would ask during
rollback:

- What source revision did we intend to release?
- What immutable artifact actually reached the provider?
- Which environment and runtime process set changed?
- Did migrations run, and where is the evidence?
- Did the provider report a healthy rollout?
- Did our own smoke check pass?
- What exact target would we roll back to if this release is bad?
- What is still unknown or manually verified?

This is intentionally sentence-first. A table or stricter schema can come later
only if it prevents real drift, such as missing rollback targets or confusing
mutable tags for release identity.

## First Record Sections

A first release evidence record should include these sections:

- `Release intent`: source branch, source commit, reason for release, and human
  approver when public production-like traffic is involved.
- `Artifact identity`: image repository, image tag, immutable digest, and build
  command or build provenance if known.
- `Target`: provider, environment name, service name, task definition or
  equivalent runtime revision, and runtime process set.
- `Migration evidence`: whether migrations ran, whether they changed durable
  data, and where startup or migration logs were observed.
- `Rollout evidence`: provider rollout state, health-check status, relevant
  timestamps, and any provider-reported failure or rollback event.
- `Smoke evidence`: public health endpoint, expected response, observed
  response, and whether HTTP-to-HTTPS behavior still works when relevant.
- `Rollback target`: previous known-good source revision, image digest, task
  definition or equivalent provider revision, and the command path if known.
- `Known gaps`: anything the release record cannot prove yet.

## AWS Mapping

For the current AWS adapter, the record should map those sections to observed
AWS facts:

- source revision: Git commit SHA
- artifact identity: ECR repository, tag, and image digest
- target: ECS cluster, service, task-definition revision, and container name
- migration evidence: CloudWatch log lines showing migration completion before
  server startup
- rollout evidence: ECS service deployment state and recent service events
- smoke evidence: `https://www.kanbien.com/v1/health`
- rollback target: prior ECS task-definition revision plus immutable ECR digest
  when known

Do not use mutable `staging-latest` by itself as rollback identity.

## Where Records Should Live For Now

Until the deployment harness has a final repo-bucket layout, store trial release
records under:

`docs/workspace-buckets/deployment-harness/release-evidence/`

This keeps CI/CD and SRE work together while making the records easy to migrate
into a future deployment bucket.

## Compatibility Rules

- Do not create a release evidence record that includes secret values.
- Do not claim rollback readiness if the previous known-good artifact is
  unknown.
- Do not treat provider steady state as proof that migrations, background jobs,
  assets, exports, or user-facing journeys are healthy.
- Do not require this record for non-deployment documentation-only changes
  until the harness is promoted from discovery into an approved release gate.

## When To Tighten This Shape

Tighten this into a real template or validator only after at least one trial
record shows repeated drift, such as:

- missing immutable digest
- missing rollback target
- unclear migration result
- unclear environment identity
- smoke evidence that cannot be reproduced
