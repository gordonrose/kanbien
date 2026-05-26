# Root Users Capability Matrix Notes

## Inputs Used

- Template:
  [`New Capability Matrix - populated.xlsx`](/home/gordon/kanbien/docs/workspace-buckets/archive-history/imports/root-users-legacy-capability-matrix/New%20Capability%20Matrix%20-%20populated.xlsx)
- Legacy source workbook:
  [`RootUser V2.3.xlsx`](/home/gordon/kanbien/docs/workspace-buckets/archive-history/imports/root-users-legacy-capability-matrix/RootUser%20V2.3.xlsx)
- Generated matrix:
  [`2026-03-30-root-users-capability-matrix-from-rootuser-v2.3.csv`](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-03-30-root-users-capability-matrix-from-rootuser-v2.3.csv)

## What This File Is

This matrix is a first-pass conversion of the legacy `RootUser V2.3` workbook
into the newer capability-matrix shape.

It preserves the legacy workbook's stated behavior where possible rather than
reconciling it to the current repo implementation or newer PRDs.

## Important Gaps Carried Forward

The legacy workbook did not explicitly define:

- actor role taxonomy
- authorization model
- frontend behavior
- session behavior
- CSP/browser-security implications
- audit requirements
- standards-review decisions
- traceability IDs

Those fields were filled with either:

- `Not specified in RootUser V2.3`
- a narrow assumption such as `likely authenticated privileged operator`

## Important Legacy Behaviors Preserved

The generated matrix intentionally preserves a few legacy semantics from
`RootUser V2.3` that may differ from newer repo docs:

- `listRootUsers` includes soft-deleted rows but excludes anonymized rows
- `removeRootUser` may run again on an already anonymized user
- authorization and audit behavior are not yet concretely specified

## Recommended Next Step

Before treating this as the repo source of truth, compare each row against:

- current `docs/prd/*`
- current `docs/featureDocs/*`
- current architecture defaults in `AGENTS.md`

Then either:

1. mark this file as a legacy snapshot, or
2. produce a reconciled `rootUsers` capability matrix aligned to the current
   repo contracts
