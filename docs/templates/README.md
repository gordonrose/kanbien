# Spec-Driven Templates

These templates are intended to support build-from-spec implementation work.

Use them when you want to describe a capability clearly enough that the repo can
be implemented or rebuilt with lower ambiguity and lower drift risk.

## Templates

- `capability-matrix-v4-template.md`
  Spreadsheet-friendly field list for end-to-end capability definition.
- `implementation-blueprint-template.md`
  Structured build sheet derived from the capability matrix and PRD.
- `api-contract-template.md`
  Route and contract template for backend capabilities.
- `permission-mapping-template.md`
  Role-to-capability mapping template for future authorization architecture.
- `frontend-slice-template.md`
  Frontend slice template covering route/state, permissions, accessibility,
  performance, degraded UX, and telemetry.
- `frontend-telemetry-review-template.md`
  Unified review template for frontend analytics, logging, monitoring,
  alerting, and telemetry-related security/privacy considerations.
- `frontend-public-route-review-checklist.md`
  Human review checklist for public frontend routes whose qualitative design
  quality cannot be fully protected by automation alone.
- `vertical-slice-template.md`
  Combined frontend/backend slice template for one user-facing workflow across
  contracts, permissions, persistence, verification, and operations.
