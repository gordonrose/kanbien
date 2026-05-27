# Archived Permission Mapping CSV Exports

This folder contains historical spreadsheet-friendly exports of permission
mapping documents.

Current source truth lives under:

- [docs/architecture/permission-mappings](/home/gordon/kanbien/docs/architecture/permission-mappings)

Archived exports:

- [backend-to-authz-capability-mapping.csv](./backend-to-authz-capability-mapping.csv)
- [role-to-authz-capability-mapping.csv](./role-to-authz-capability-mapping.csv)

Do not use these CSV files for current permission decisions, implementation
work, or role/capability audits without first comparing them to the canonical
Markdown sources under `docs/architecture/permission-mappings/`.

They currently cover only the live implemented mapping boundary:

- public root-auth entrypoints
- `RootUserAdmin`
- current `rootAuth`, `rootUsers`, and root-admin browser-session behavior

The source Markdown mappings now also include implemented slices that are newer
than these CSV exports, architecture-target platform authorization families,
and the expanded source-posture schema. These CSV exports have not yet been
expanded or refreshed to that schema; treat them as stale review exports until
a later catalog/export update regenerates them.

Archived stale posture:

- some rows that are now `current` in the architecture Markdown still appear as
  `target` in these CSV exports
- newer feature-specific permission mapping documents are not represented here

These files were moved to `archive/history` during the 2026-05-27 workspace
cleanup after Gordon chose to archive the stale CSV exports.
