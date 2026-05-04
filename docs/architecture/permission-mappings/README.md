# Permission Mappings

This folder contains source-independent permission mapping artifacts for the
authorization model.

These documents answer:

- which backend capabilities map to which authz capabilities
- which roles map to which authz capabilities
- which capabilities remain root-user-only
- which authority world a capability belongs to: root, tenant, or system
- whether a target capability is documentation-only, seed-backed,
  corrective-migration-backed, runtime-enforced, or blocked
- whether a capability is eligible for UI exposure
- what the backend enforcement expectation is
- what the frontend visibility expectation is

## Current Documents

- [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
  Mapping from backend actions to governing authz capability keys, with
  explicit `current` and approved `target` rows.
- [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
  Mapping from authz capability keys to the `RootUserAdmin` role and public
  entrypoint boundaries, with explicit `current` and approved `target` rows.
- [tenant-role-based-authorization-bootstrap.md](/home/gordon/kanbien/docs/architecture/permission-mappings/tenant-role-based-authorization-bootstrap.md)
  Forward-looking architecture note for the tenant authz direction. This is not
  the live current-role mapping catalog.

## Current Scope

The mapping catalog is intentionally explicit about status:

- `current` means implemented repo truth
- `target` means approved next-slice mapping backed by an accepted PRD but not
  yet implemented
- `architecture-target` means approved Layer 2 direction that still needs
  Product/PRD/capability-matrix/story breakdown before implementation
- `blocked` means the capability family must not be granted, selected, or used

At the moment, that means the mapping layer covers:

- public root-auth entrypoints
- `RootUserAdmin`
- current `rootAuth`, `rootUsers`, and root-admin browser-session behavior
- current `rootRoles` behavior
- architecture-target platform authorization families for `rootAdmin`,
  `rootSupport`, `adminOwner`, and `systemJob`

Future tenant or business roles should be added only when those feature sets
reach the normal specification loop.

## Source Posture And UI Eligibility

The platform authorization model uses grant source posture values from
ADR-0036 and the Platform Authorization Model Technical Steering packet:

- `documentation-only`
- `seed-backed`
- `corrective-migration-backed`
- `runtime-enforced`
- `blocked`

Only `runtime-enforced` capabilities may become usable UI/admin options. Rows
that are documented, cataloged, seeded, or planned are not enough by themselves.

The current CSV exports remain review snapshots of the implemented baseline.
They are not yet expanded with the new platform authorization schema.

## Downloadable CSV Exports

- [backend-to-authz-capability-mapping.csv](/home/gordon/kanbien/docs/workspace/permission-mappings/backend-to-authz-capability-mapping.csv)
- [role-to-authz-capability-mapping.csv](/home/gordon/kanbien/docs/workspace/permission-mappings/role-to-authz-capability-mapping.csv)

Use these mappings alongside:

- ADRs for enduring authorization rules
- PRDs for behavioral scope
- API contracts for route-level behavior
- implementation blueprints for repo-shaped execution

These files are not meant to replace the authorization seam.
They define the intended policy model that the seam should enforce.
