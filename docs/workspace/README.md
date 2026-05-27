# Workspace Docs

This folder is the repo-local home for active or transitional working
specification artifacts that Codex can read and update during delivery work.

Use this area when a document is important to the current repo but is not yet a
finalized architecture, PRD, standards artifact, bucket-owned artifact, or
archive/history record.

This folder is no longer a permanent catch-all. During the repo-bucket cleanup,
completed historical records should move toward
`docs/workspace-buckets/archive-history/`, and active reusable authority should
move toward the owning bucket, standards, architecture, product-discovery,
design-system, or platform docs only after references and generators are
checked.

During the repo-bucket cleanup, each first-level workspace folder README should
name its current repo bucket classification. Treat that classification as a
cleanup aid, not as permission to move the folder without checking references,
generators, skills, scripts, tests, and downstream artifacts.

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
- `reviews/`
  Dated review notes for materially AI-assisted, standards-sensitive, or
  otherwise notable delivery slices when the repo needs a durable close-out
  artifact beyond chat history.

## Matrix Vs Blueprint

- Capability matrix:
  A high-level inventory of what the platform or feature slice must do.
  This is the requirements grid. It captures capabilities, actors, auth,
  routes, persistence expectations, audit expectations, and verification
  expectations across a set of capabilities.
  It should now also make the capability boundary explicit:
  `root`, `tenant`, or explicitly approved shared-cross-tenant, plus the
  tenant-context rule when relevant.
  Use the v5 matrix shape for new permission-sensitive, platform-scope,
  tenant-boundary, asset, billing, compliance, or background-job planning.
  Use the same v5 shape for frontend-relevant capabilities because it records
  route family, topology, design-system prerequisite, materialization,
  source-placement, and evidence posture. V5 also includes compact harness
  gates for downstream artifacts such as data dictionaries, API contracts,
  permission mappings, asset decisions, job/cleanup decisions, compliance
  gates, feature manifests, runbooks, and generated artifacts. Existing v4
  matrices remain legacy-compatible and should be migrated only when their
  feature is materially refreshed.
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
  keep the original name and move it under the appropriate
  `docs/workspace-buckets/archive-history/` subfolder

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
4. Move obsolete working files into the appropriate
   `docs/workspace-buckets/archive-history/` subfolder rather than deleting
   them immediately.

## Cleanup Direction

Prefer decisive cleanup when a record is clearly historical and its lesson has
been promoted into maintained tests, skills, standards, source docs, or
runtime guardrails.

Do not move active records just to make the tree look cleaner. Keep records in
`docs/workspace/` when they still carry unresolved waivers, production-readiness
caveats, active generator paths, current tool defaults, or live adoption risks.

When moving historical records, leave a short breadcrumb at the old path until
the final compatibility sweep removes temporary breadcrumbs and updates any
remaining upstream references.

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
