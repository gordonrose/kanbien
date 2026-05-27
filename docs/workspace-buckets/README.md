# Workspace Buckets

This directory defines the desired bucket-first documentation layout for the
repo workspace.

The folders here are destination contracts. They do not mean existing
`docs/workspace/` files have already moved, and they do not make any legacy
path obsolete by themselves.

Current buckets:

- `platform/`
- `discovery-harness/`
- `deployment-harness/`
- `frontend-harness/`
- `shared-governance-kernel/`
- `archive-history/`
- `unsure-needs-decision/`

Before moving a file into one of these buckets:

- inspect current references from docs, scripts, tests, skills, and templates
- decide the owner bucket from current purpose and authority
- leave a breadcrumb at the old path when old references may still exist
- update maintained references or document why compatibility is intentionally
  deferred

## Breadcrumb Lifecycle

Breadcrumbs are temporary migration aids, not permanent structure.

Use a breadcrumb when an artifact is moved, superseded, archived, or split and
old references may still exist. Keep it tiny and non-authoritative.

Every breadcrumb should state:

- new canonical home, or split destination homes
- status: moved, superseded, archived, or split
- why the breadcrumb exists
- what compatibility it preserves
- what must be true before it can be deleted

Remove breadcrumbs during the final docs cleanup sweep once maintained
references have been updated, scripts/skills/templates/tests no longer depend
on the legacy path, and old path compatibility is no longer intentionally
supported.

Do not use this directory as a dumping ground. If ownership is unclear, keep
the file in its current inspected location or use `unsure-needs-decision/`
only with a clear decision note.
