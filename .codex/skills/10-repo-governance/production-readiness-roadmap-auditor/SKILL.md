---
name: production-readiness-roadmap-auditor
description: Use when the user wants Codex to inspect src, architecture decision records, PRDs, tests, and maintained planning artifacts to create a prioritized production-readiness todo list, roadmap, or loose-ends backlog before the app is considered production worthy.
---

# Production Readiness Roadmap Auditor

Use this skill when the user wants a backlog-oriented audit rather than an
implementation pass.

The goal is to turn the current repo state into a practical production
readiness roadmap: what must be finished, reconciled, hardened, documented, or
accepted as conscious debt before the app can credibly be called production
worthy.

## Authority Order

Use this authority order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/priniciples.md`
4. `docs/architecture/change-control.md`
5. accepted ADRs under `docs/architecture/adr/`
6. current implementation under `src/`
7. executable tests under `tests/`
8. PRDs and PRD-derived test cases under `docs/prd/`
9. maintained contracts, status snapshots, and recovery docs under `docs/`

If docs and code disagree, use architecture and accepted ADRs as the
tie-breaker first. If the ADR/PRD trail is internally inconsistent, call that
out as a roadmap item instead of silently choosing one side.

## Scope Defaults

For a whole-app production-readiness pass, inspect:

- platform startup, routing, authn/authz, sessions, middleware, and error seams
- feature registration and public seams under `src/features/*`
- persistence, migrations, indexes, lifecycle cleanup, and test DB harnesses
- frontend architecture, governed design-system adoption, route topology, and
  app pages under `src/frontend/`
- background jobs, notification delivery, assets, object storage, and any
  external-resource lifecycle assumptions
- PRDs, PRD test-case docs, journey inventories, and capability matrices
- OpenAPI, API contracts, data dictionary, feature docs, standards snapshots,
  rebuild/readiness docs, runbooks, and maintained generated artifacts
- executable unit, integration, security, audit, and visual tests

Load only the files needed to support the findings. Prefer `rg` and targeted
file reads over broad document dumping.

## What To Look For

Prioritize loose ends that would matter in production:

- unfinished PRD requirements or ADR decisions not reflected in `src/`
- implemented behavior missing PRD, API contract, OpenAPI, data dictionary, or
  maintained artifact coverage
- weak or absent executable coverage for critical paths, security boundaries,
  lifecycle transitions, migrations, compatibility aliases, and cleanup
- tenant-boundary, root/tenant actor, authz, session, replay, or asset-delivery
  risks
- missing durability for domain facts, mutable live lookups where stable facts
  are required, or lifecycle states without cleanup semantics
- production operations gaps: startup validation, env config, secrets posture,
  observability, audit events, rate limits, quotas, retries, runbooks, and
  rollback/recovery paths
- migration safety gaps: schema/code/index drift, bootstrap visibility hazards,
  applied migration identity risks, or missing repair/backfill plans
- frontend production gaps: unsigned design-system adoption, app-local drift,
  accessibility, responsive overflow, visual regression blind spots, and route
  compatibility concerns
- background job and external resource gaps: idempotency, retry policy,
  orphan cleanup, outbox consistency, dead-letter handling, and operator repair
- documentation contradictions that would mislead a future rebuild, audit, or
  incident response

Do not pad the roadmap with cosmetic refactors. Include style or naming only
when it creates operational, security, compatibility, or maintainability risk.

## Workflow

1. Confirm the requested scope.
If the user says "production worthy" or "whole app", treat the scope as whole
repo with emphasis on production blockers. If they name a feature, audit that
feature and its shared seams.

2. Build the intended-product picture.
Read the governing architecture docs, relevant ADRs, and PRDs. Identify
accepted commitments, still-planned phases, and explicit non-goals.

3. Build the implemented-product picture.
Inspect `src/`, migrations, tests, and maintained artifacts. Check both what is
present and what is conspicuously absent.

4. Reconcile PRD/ADR promises against code.
For each production-relevant gap, classify whether it is:
- missing implementation
- partial implementation
- stale or contradictory artifact
- missing verification
- operationalization gap
- compatibility or migration gap
- conscious debt that needs an owner/date/exit condition

5. Produce a prioritized roadmap.
Group findings into the reporting buckets below. For each item, include enough
evidence that another engineer can reproduce the concern.

6. Avoid unapproved implementation.
Do not patch code, docs, or tests during the audit unless the user separately
asks to start addressing the roadmap.

## Severity Buckets

Use these buckets exactly:

- `Production Blockers`
- `Pre-Launch Must Fix`
- `Hardening / Scale Readiness`
- `Documentation And Artifact Debt`
- `Conscious Post-Launch Debt`

Use `Production Blockers` only for issues that could make launch unsafe,
unusable, non-compliant with the repo's own guardrails, or impossible to operate
reliably.

## Roadmap Item Format

For each item, include:

- `Todo`: an imperative task statement
- `Why It Matters`: production risk or launch impact
- `Evidence`: file references or commands used
- `Source Of Truth`: ADR, PRD, architecture doc, or implementation seam
- `Suggested Owner`: feature/platform/frontend/docs/security/ops, as applicable
- `Exit Criteria`: what must be true before the item can be closed

When evidence is weak, say `Evidence: not enough evidence found` and treat the
item as an investigation task rather than a fact claim.

## Summary Output

End with:

- the top 5 highest-leverage next actions
- any blind spots from files or systems not inspected
- whether the result is a roadmap only or includes any implemented fixes

If there are no blockers, say that explicitly, but still report residual risks
and unverified assumptions.

## Guardrails

- Do not claim the app is production ready from absence of obvious defects.
- Do not recommend breaking compatibility without a migration or alias strategy.
- Do not treat PRD intent as implemented without source or test evidence.
- Do not treat code as correct when it contradicts accepted ADRs.
- Do not silently downgrade security, privacy, audit, or tenant-boundary gaps to
  normal backlog chores.
- Do not create tickets or edit roadmap files unless the user asks for that
  follow-up.
