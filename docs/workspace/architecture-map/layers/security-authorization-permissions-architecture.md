# Authorization / Permissions Architecture

## Current Status

- `partial`

## What This Layer Should Do

- define who may do what and under what conditions
- separate authentication from authorization
- support future role, scope, tenant, and entity-level controls

## Implemented To Date

- a root-user authenticated boundary exists
- current root-platform capability enforcement exists through `rootRoles`
- backend-to-authz and role-to-authz permission mappings exist for the current
  root-platform boundary
- docs and standards now explicitly distinguish current root-platform authz
  from future tenant/entity-scoped authz

## Still Missing / Next Steps

- extend the model from root-platform authz into tenant-scoped authorization
- add entity-scope and inherited-scope rules
- add broader role families beyond `RootUserAdmin`
