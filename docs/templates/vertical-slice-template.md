# Vertical Slice Template

Use this when one user-facing workflow spans frontend, backend, permission,
persistence, and verification concerns together.

The goal is to capture one coherent delivery story rather than separate
frontend and backend notes that drift apart.

## Summary

- Slice:
- Module:
- Journey / workflow:
- Scope:
- Phase:
- Owner:

## Inputs

- Capability matrix reference:
- PRD:
- ADR(s):
- PRD test-case doc:
- Journey inventory:
- Frontend slice doc:
- Backend contract doc:
- Permission-mapping artifacts:
- Data dictionary references:
- QA coverage matrix classification:
- QA release-gate expectation:

## Business Intent

- User-facing problem solved:
- Business outcome:
- Primary actors:
- Why this matters now:
- Out-of-scope items:

## Frontend Surface

- Module:
- Route family and launch points:
- Screens / panels / dialogs / shell:
- Screen and workflow states:
- Permission-aware visibility / disablement behavior:
- Accessibility / responsive / localization / RTL implications:
- Design-system impact:

## Backend Capability

- Owning backend features:
- Routes / contracts involved:
- Request / response / error behavior:
- Validation rules:
- Aggregation or response-shaping strategy:
- Cross-feature seams:
- Feature manifests to update:

## Permission And Tenant Boundary

- Capability boundary:
  `root`, `tenant`, or explicitly approved shared-cross-tenant
- Authentication requirement:
- Authorization expectation:
- Current tenant-context rule:
- Cross-tenant deny rule:
- Audit expectation:

## Persistence And Durable State

- Entities / rows / tables affected:
- Durable facts relied on or introduced:
- Migration implications:
- Uniqueness / normalization implications:
- Search / filter implications:
- Compatibility notes:

## Performance And Degraded UX

- Interactive-ready target:
- UI-confirmation target:
- Planned request-count posture:
- Potential waterfall risks:
- Fallback UX when targets are missed:
- Instrumentation expectations:

## Telemetry And Operational Review

- Security implications:
- Analytics events and forbidden data:
- Logging / monitoring expectations:
- Alerting expectations and severity / impact model:
- Owner / module / journey / actor / environment metadata:
- Response / rollback / recovery note:

## Verification Plan

- `TC-*` coverage:
- `JY-*` coverage:
- Unit:
- Integration:
- Frontend:
- End-to-end:
- Security:
- Audit:
- Persistence-backed:
- Accessibility:
- Performance:
- Resilience / failure-injection:
- Compatibility / contract:
- Structured exploratory QA:
- QA checklist:
- Curated test-run summary:

## Documentation And Artifact Sync

- PRD updates:
- PRD test-case updates:
- Frontend module or journey docs:
- Backend feature docs:
- API contract docs:
- Data dictionary:
- Feature manifests:
- Dependency graph artifacts:
- Permission mapping:
- Architecture guides or ADRs:
- Standards gate review:
- Platform-status files to review:
- Runbook:
- Privacy note:
- Reconstruction questionnaire:
- Bootstrap / helper docs:
- Maintained-artifacts sweep:

## Completion Guardrails

- Blocking risks:
- Explicitly deferred items and rationale:
- Required follow-up slices:
- Residual risk statement:
