# Permission Mapping Exports

This folder contains spreadsheet-friendly exports of the source-of-truth
permission mapping documents under:

- [docs/architecture/permission-mappings](/home/gordon/kanbien/docs/architecture/permission-mappings)

Current exports:

- [backend-to-authz-capability-mapping.csv](/home/gordon/kanbien/docs/workspace/permission-mappings/backend-to-authz-capability-mapping.csv)
- [role-to-authz-capability-mapping.csv](/home/gordon/kanbien/docs/workspace/permission-mappings/role-to-authz-capability-mapping.csv)

These exports are intended for offline review and spreadsheet inspection.

They currently cover only the live implemented mapping boundary:

- public root-auth entrypoints
- `RootUserAdmin`
- current `rootAuth`, `rootUsers`, and root-admin browser-session behavior
