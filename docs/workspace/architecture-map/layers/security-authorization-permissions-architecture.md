# Authorization / Permissions Architecture

## Current Status

- `partial`

## What This Layer Should Do

- define who may do what and under what conditions
- separate authentication from authorization
- support future role, scope, tenant, and entity-level controls

## Implemented To Date

- a root-user authenticated boundary exists
- docs and standards now explicitly call out the missing permission model
- permission-mapping template exists as preparation

## Still Missing / Next Steps

- define enduring permission model in PRD and likely ADR
- define enforcement pattern and allow/deny expectations
- add capability-to-role mapping and entity-scope rules
