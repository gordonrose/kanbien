# Branch Stack Reconciliations

This folder records branch-stack accounting decisions for repo git hygiene.

Repo bucket classification: `shared-governance-kernel`.

Some files in this folder are machine-readable reconciliation records consumed
by `src/scripts/gitBranchStackAudit.ts`. Others are human-readable cleanup
ledgers that explain branch, stash, or promotion history.

For a file to count as a machine-readable reconciliation record, it must include
these Markdown fields exactly:

- `Branch`
- `Head Commit`
- `Disposition`
- `Accounted By`

The script currently recognizes only these dispositions:

- `superseded-by-current`
- `intentionally-parked`

Human cleanup ledgers may use different headings or richer narrative, but they
do not satisfy branch-stack accounting unless they include the required fields
above.

Do not move this folder without updating the default reconciliation directory
in `src/scripts/gitBranchStackAudit.ts`, the package script and tests that rely
on that path, and any workflow notes that point maintainers here.
