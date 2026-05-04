# Platform Authorization `adminOwner` V1 Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft.csv](2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft.csv)

## Source Artifacts

- Product Discovery:
  `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-05-platform-authorization-admin-owner-story-breakdown.md`
- PRD:
  `docs/prd/2026-05-05-0023-platform-authorization-admin-owner-v1.md`

## Current Posture

This is a first-draft planning matrix for the v1 platform authorization
`adminOwner` foundation.

It should be treated as:

- a capability planning source for implementation blueprint work
- a traceability bridge from Product Discovery, Technical Steering, Story
  Breakdown, and PRD into later task planning
- not a runtime grant catalog
- not approval to expose UI controls
- not approval to implement broad ABAC/ReBAC

## Current Direction Decisions

- V1 tenant authority has one tenant role: `adminOwner`.
- `adminOwner` behavior must remain globally consistent across tenants.
- Root authority and tenant authority stay separate.
- Cross-tenant access denies by default.
- Feature/configuration/entitlement gates run before tenant role grants.
- ABAC/ReBAC/object-rule inputs are typed extension points only in V1.
- UI eligibility requires runtime-enforced capability proof.
- Grant source posture must be explicit.
- Existing root and tenant-auth denial behavior remains backwards compatible by
  default unless a route-family API contract records a migration.

## Recommended Capability Boundary

The first runtime loop should not attempt to implement the full matrix at once.
Recommended sequencing:

1. Choose storage/audit/lifecycle compatibility posture in an implementation
   blueprint.
2. Implement the central evaluator foundation and tenant grant resolution.
3. Apply the evaluator to one narrow tenant-admin route family.
4. Add audit/proof persistence for the enforced route family.
5. Refresh permission mappings and capability catalog posture to
   `runtime-enforced` only after route tests prove enforcement.

## Blocked Or Deferred Capability Families

The following remain blocked/deferred for V1:

- tenant-created custom roles
- tenant-specific `adminOwner` divergence
- tenant self-service tenant-admin management
- root impersonation
- broad ABAC/ReBAC runtime
- admin UI exposure before runtime-enforced capability proof
- root-only internal proof trail disclosure to tenant admins

## Open Implementation Planning Decisions

- Tenant grant storage posture.
- Audit/proof sink posture.
- Tenant lifecycle/deletion compatibility plan.
- First tenant account route family.
- First tenant export/reporting route family.
- Capability catalog materialization support for expanded source posture.

## Verification Direction

Later PRD-derived test cases should cover:

- tenant context selection required
- explicit tenant switching
- cross-tenant deny
- root-owned deny
- feature/config/entitlement deny
- pending tenant admin deny
- accepted/setup-complete tenant admin allow
- revoked tenant admin immediate deny
- lifecycle/deletion deny
- safe public denial behavior
- sensitive fallback behavior
- audit/proof field coverage
- existing root/tenant-auth compatibility
