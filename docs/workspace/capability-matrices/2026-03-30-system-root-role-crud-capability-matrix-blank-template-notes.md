# System Root-Role CRUD Capability Matrix Blank Template Notes

## Generated Artifact

- Matrix: [2026-03-30-system-root-role-crud-capability-matrix-blank-template.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-03-30-system-root-role-crud-capability-matrix-blank-template.csv)

## Intended Use

This is a blank scaffold for the upcoming system root-role CRUD slice.

It pre-seeds only the suggested capability rows so the matrix can be reviewed
and refined before the PRD and implementation blueprint are written.

## Suggested Capability Groups

- Role lifecycle:
  - `createSystemRootRole`
  - `getSystemRootRole`
  - `listSystemRootRoles`
  - `updateSystemRootRole`
  - `deleteSystemRootRole`

- Role-to-capability management:
  - `listSystemRootRoleEligibleAuthzCapabilities`
  - `listSystemRootRoleCapabilityAssignments`
  - `updateSystemRootRoleCapabilityGrants`

- Root-user assignment management:
  - `assignSystemRootRoleToRootUser`
  - `unassignSystemRootRoleFromRootUser`
  - `listRootUserAssignedSystemRootRoles`

- Effective-access inspection:
  - `readEffectiveRootUserAuthorization`

## Deliberate Gaps

This scaffold leaves the policy details blank on purpose, including:

- exact role names
- exact governing authz capability keys
- whether some capabilities are protected or mandatory
- persistence and migration shape
- route contracts
- frontend needs

Those should be decided through the normal specification loop rather than
filling them speculatively.

## Current Capability-Matrix Rule

New matrices should now classify each capability explicitly as:

- `root`
- `tenant`
- shared-cross-tenant only by explicit approval

They should also record the tenant-context rule when relevant, so downstream
authn/authz design does not have to infer whether a capability is
platform-operator-only or tenant-scoped.
