# Permission Mappings

This folder contains source-independent permission mapping artifacts for the
authorization model.

These documents answer:

- which backend capabilities map to which authz capabilities
- which roles map to which authz capabilities
- which capabilities remain root-user-only
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

At the moment, that means the mapping layer covers:

- public root-auth entrypoints
- `RootUserAdmin`
- current `rootAuth`, `rootUsers`, and root-admin browser-session behavior
- current `rootRoles` behavior

Future tenant or business roles should be added only when those feature sets
reach the normal specification loop.

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
