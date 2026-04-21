# Implementation Blueprint Template

Use this after the capability matrix and PRD exist.

The goal is to turn requirements into a buildable, reviewable implementation
plan without losing architecture, tests, docs, or standards coverage.

## Summary

- Feature:
- Capability:
- Scope:
- Phase:

## Inputs

- Capability matrix reference:
- PRD:
- ADR(s):
- PRD test-case doc:
- Journey inventory:
- QA coverage matrix classification:
- QA release-gate expectation:

## Frontend Plan

- Route / surface:
- UI states:
- Permission visibility behavior:
- Session / expiry behavior:
- Browser security considerations:

## Backend Plan

- Route(s):
- Request/response/error contract:
- Feature-local files expected:
- Cross-feature seams:
- Feature manifests to update:
- Authorization enforcement point:

## Persistence Plan

- Entities / rows affected:
- Migration changes:
- Index or uniqueness changes:
- Search/filter implications:
- Compatibility notes:

## Verification Plan

- Journey tier / workflow scope:
- Unit:
- Integration:
- Security:
- Audit:
- Edge:
- Frontend:
- Persistence-backed:
- End-to-end:
- Concurrency / idempotency:
- Performance:
- Resilience / failure-injection:
- Compatibility / contract:
- Accessibility:
- Structured exploratory QA:
- QA checklist:
- Curated test-run summary:
- Waiver / quarantine expectation:

## Documentation Plan

- PRD updates:
- PRD test-case updates:
- Feature docs:
- API contract docs:
- OpenAPI:
- Postman:
- Data dictionary:
- Feature manifests:
- Dependency graph artifacts:
- Architecture map:
- Standards platform-status snapshots:
  list which files under `docs/standards/platform-status/` must be reviewed
  because the slice changes their current wording or evidence story, even if
  the headline status level may stay the same
- Reconstruction questionnaire:
- Bootstrap and helper docs:
- Maintained-artifacts sweep:
  list older PRD/test-case/blueprint docs, README files, index files, and
  registry surfaces that may need refresh because implementation will change
  their truth value
- Runbook:
- Privacy note:
- Standards review:
- Repo health review:

## Completion Guardrails

- Blocking QA outcomes:
- Explicitly deferred verification layers and rationale:
- Expected release-gate residual risk statement:
