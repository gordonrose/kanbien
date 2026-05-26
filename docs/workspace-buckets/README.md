# Workspace Buckets

This directory defines the desired bucket-first documentation layout for the
repo workspace.

The folders here are destination contracts. They do not mean existing
`docs/workspace/` files have already moved, and they do not make any legacy
path obsolete by themselves.

Current buckets:

- `platform/`
- `discovery-harness/`
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

Do not use this directory as a dumping ground. If ownership is unclear, keep
the file in its current inspected location or use `unsure-needs-decision/`
only with a clear decision note.
