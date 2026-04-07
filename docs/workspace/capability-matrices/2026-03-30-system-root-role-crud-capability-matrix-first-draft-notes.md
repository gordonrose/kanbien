# System Root-Role CRUD Capability Matrix First Draft Notes

## Generated Artifact

- Matrix: [2026-03-30-system-root-role-crud-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-03-30-system-root-role-crud-capability-matrix-first-draft.csv)
- Source scaffold: [2026-03-30-system-root-role-crud-capability-matrix-blank-template.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-03-30-system-root-role-crud-capability-matrix-blank-template.csv)

## Direction Captured In This Draft

- The live protected root role remains `RootUserAdmin`.
- System root roles use a stable machine `roleKey` plus editable `displayName` and `description`.
- Delete semantics are deactivate/soft-delete only; reactivation is a first-class capability.
- Deactivated roles are preserved historically but cannot be newly assigned until reactivated.
- `RootUserAdmin` is protected from day one.
- A root user may hold multiple system root roles at once.
- Every root user must have at least one role.
- At least one `RootUserAdmin` assignment must always remain in the platform.
- Capability editing is modeled as bulk-first, with room for future incremental operations.
- Effective permission inspection returns assigned roles, flattened effective grants, and grant-source explanation.
- Role evolution now has an explicit replacement capability for moving a root user from one role to another safely.

## Pressure-Test Decisions Applied

- Read-style capabilities are now marked `Protected = Yes` but `Mandatory = No`.
  This keeps them within the protected operator boundary while leaving room for future read-only root roles.
- Mutation and assignment-management capabilities remain both `Mandatory = Yes` and `Protected = Yes` for `RootUserAdmin`.
- Role deactivation no longer requires all active assignments to be removed first.
  Instead, deactivation prevents future assignment while preserving historical correctness and controlled transition paths.
- Assignment routes now use stable assignment resources instead of mixing path-key deletion with optional request bodies.
- The eligible-capability route now uses explicit `eligible-authz-capabilities` naming to avoid ambiguity.
- A dedicated replacement capability now covers the common “retire old role, move user to new role” workflow atomically.

## Deliberate Scope Choices

- This draft does not define future read-only root roles yet.
- This draft assumes all current root-role CRUD capabilities are restricted to `RootUserAdmin`.
- This draft keeps non-assigned capabilities as a derived view from:
  - `listSystemRootRoleEligibleAuthzCapabilities`
  - `listSystemRootRoleCapabilityAssignments`

## Follow-Up Questions To Pressure-Test Later

- Whether a dedicated historical assignment listing capability is needed once root-role lifecycle becomes richer.
- Whether incremental grant-management endpoints should be added later alongside the bulk set operation.
- Whether assignment creation/unassignment should later support bulk operations for operator administration workflows.
