# Workspace Docs

This folder is the repo-local home for working specification artifacts that
Codex can read and update during delivery work.

Use this area when a document is important to the current repo but is not yet a
finalized architecture, PRD, or standards artifact.

## Folder Layout

- `capability-matrices/`
  Working capability matrices in `.csv`, `.xlsx`, or Markdown-export form.
- `implementation-blueprints/`
  Filled implementation blueprints derived from approved PRDs and capability
  matrices.
- `imports/`
  Files copied in from Windows downloads, email attachments, or external
  sources before they are normalized or reviewed.
- `exports/`
  Files generated from repo work for review or handoff.
- `retrospectives/`
  Dated lessons-learned or issue-summary notes for a delivered slice when the
  repo should keep the context near other working artifacts.
- `archive/`
  Superseded or dated working artifacts that should be kept for reference but
  are no longer active.

## Matrix Vs Blueprint

- Capability matrix:
  A high-level inventory of what the platform or feature slice must do.
  This is the requirements grid. It captures capabilities, actors, auth,
  routes, persistence expectations, audit expectations, and verification
  expectations across a set of capabilities.
  It should now also make the capability boundary explicit:
  `root`, `tenant`, or explicitly approved shared-cross-tenant, plus the
  tenant-context rule when relevant.
- Implementation blueprint:
  A build-ready plan for how one approved slice should be implemented in this
  repo. This is the construction drawing. It translates the approved PRD and
  capability matrix into repo-shaped execution detail such as file layout,
  seams, route grouping, persistence plan, migration plan, test plan, and docs
  update plan.

Short version:

- capability matrix = what must exist
- implementation blueprint = how this repo should build it

## Naming Convention

Prefer sortable, explicit names:

- capability matrix:
  `YYYY-MM-DD-<feature-or-slice>-capability-matrix.xlsx`
- implementation blueprint:
  `YYYY-MM-DD-<feature-or-slice>-implementation-blueprint.md`
- imported external file:
  `YYYY-MM-DD-<source>-<short-description>.<ext>`
- archived file:
  keep the original name and move it under `archive/`

Examples:

- `2026-03-30-root-users-capability-matrix.xlsx`
- `2026-03-30-root-auth-implementation-blueprint.md`
- `2026-03-30-download-new-capability-matrix.xlsx`

## Recommended Workflow

1. Copy external files into `imports/` first.
2. Move the active working version into `capability-matrices/` or
   `implementation-blueprints/`.
3. Treat finalized architecture, PRD, and standards decisions as source-of-
   truth docs under `docs/`, not only here.
4. Move obsolete working files into `archive/` rather than deleting them
   immediately.

## WSL And Windows Paths

If you copy files from Windows, the usual WSL path form is:

- `C:\Users\gordo\Downloads\file.xlsx`
- `/mnt/c/Users/gordo/Downloads/file.xlsx`

You can copy files into this workspace with:

```bash
cp /mnt/c/Users/gordo/Downloads/file.xlsx \
  /home/gordon/kanbien/docs/workspace/imports/
```

## Current Repo Path

Repo-local workspace root:

- `/home/gordon/kanbien/docs/workspace`
