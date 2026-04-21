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
- `design-system-principle-template.md`
  Durable-rule template for visual, interaction, and composition principles.
- `design-system-pattern-template.md`
  Pattern-first template connecting principles, tokens, states, and adoption.
- `design-system-token-candidacy-template.md`
  Review template for deciding which signed-off visual decisions become tokens,
  primitives, or remain intentionally local.
- `design-system-component-template.md`
  Reusable component seam template grounded in approved patterns and tokens.
- `design-system-verification-checklist.md`
  Promotion gate template separating source checks, rendered checks, sign-off,
  and adoption readiness.
- `design-system-adoption-contract-template.md`
  Bridge template mapping capability or workflow ownership onto a signed-off
  design-system family before real app adoption.
- `governed-app-adoption-preflight-template.md`
  Preflight template for first-consumer or materially changed governed app
  adoption so seam readiness, ownership boundaries, literal parity targets,
  and stop conditions are recorded before implementation starts.
- `design-system-component-poc-checklist.md`
  First-consumer checklist for moving a signed-off family into a real app POC
  with parity and verification gates.
- `page-shell-planning-feature-template.md`
  Source-independent feature-seam template for planning a new governed page
  shell, including catalogs, CSV export, and future form-field contracts.
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
