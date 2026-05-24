# API Contracts

This folder contains human-readable API contract documents for major route
families and capability groups.

These artifacts are intended to complement, not replace:

- `docs/swagger/openapi.yaml`
- PRDs under `docs/prd/`
- architecture docs under `docs/architecture/`

Their purpose is to provide a source-independent contract view that is useful
for:

- rebuild-from-spec work
- compliance-oriented review
- onboarding and route-family understanding

Typical contract docs should capture:

- routes in scope
- authentication and session transport
- authorization boundary
- request and response contract
- error payload behavior
- middleware effects
- persistence and audit side effects
- approved cross-feature reads
- compatibility notes where behavior is subtle

When maintaining these docs, prefer the `api-contract-maintainer` skill.

Shared platform contracts:

- `platform-authorization-denials.md` defines the reusable authn/authz denial
  matrix for future protected root, tenant, lifecycle, entitlement, RBAC, ABAC,
  ReBAC, object-level, support, and emergency route families.

Feature route-family contracts:

- `entity.md` defines the root-only Entity CRUD API contract for platform
  self-definition seed records.
