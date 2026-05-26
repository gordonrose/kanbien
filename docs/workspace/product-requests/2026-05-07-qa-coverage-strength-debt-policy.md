# Product Request: QA Coverage-Strength Debt Policy And Fail-On-Debt Gate

## Status

- Product Request ID:
  `PRQ-2026-05-07-qa-coverage-strength-debt-policy`
- Date:
  2026-05-07
- Current status:
  `intake`
- Requester-facing status:
  Policy request captured; ready for governance/discovery planning
- Source channel:
  `chat`
- Owning context:
  root/platform QA governance; test coverage strength and evidence policy
- Priority:
  `not-set`
- Related model:
  `docs/workspace/product-requests/README.md`

## Human Summary

- Target users:
  Root/platform maintainers, QA reviewers, and delivery agents that use
  coverage-strength output to decide whether test and evidence work can be
  accepted.
- Change type:
  Governance policy for QA coverage-strength debt and eventual fail-on-debt
  behavior.
- Routing layer:
  `core-platform-pr`
- What we are trying to accomplish:
  Decide which `npm run test:coverage-strength` signals are advisory, accepted
  debt, split follow-up, or blocking for each relevant task type, then define
  when scoped `--fail-on-debt` behavior is safe to enable.

## Artifact Links

- Product Discovery packet:
  pending
- Technical Steering packet:
  pending if policy/architecture ownership is needed
- Story Breakdown:
  pending
- Task Breakdown:
  pending
- Current hardening source:
  `.codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/task-type-hardening-plan.md`
- Current command evidence:
  `npm run test:coverage-strength`
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## What The Chat Widget Should Show

- Title:
  QA coverage-strength debt policy and fail-on-debt gate
- Status:
  Intake
- Short update:
  Coverage-strength now separates debug visual assertion debt, mock-honesty
  risk, escaped-defect/regression signal, e2e/browser tier breadth, and
  single-layer feature signals. The gate reports these classes, but
  fail-on-debt is intentionally deferred until QA/governance owners decide
  which classes should block, split, or remain advisory.
- Waiting next:
  QA governance policy planning
- User action needed:
  decide the owner and priority for the coverage-strength debt policy slice

## Source-Of-Truth Boundary

Product Request is a brief human-readable summary, status tracker, and artifact
index. It must not replace the linked artifacts.

- Product Discovery owns product intent.
- Technical Steering owns architecture decisions.
- Story Breakdown owns final story definitions.
- Task Breakdown owns task write sets and execution handoff.
- Loop Runs own execution evidence, scorecards, events, metrics, change sets,
  and changed artifact traceability.
- PRs own reviewable source-control changes.
