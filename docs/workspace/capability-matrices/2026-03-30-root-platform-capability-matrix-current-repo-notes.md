# Current Repo Capability Matrix Notes

## Generated Artifact

- Matrix: [`2026-03-30-root-platform-capability-matrix-current-repo.csv`](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-03-30-root-platform-capability-matrix-current-repo.csv)

## Source Inputs Used

- current rootUsers PRD, feature docs, and test-case docs
- current rootAuth PRD, feature docs, and test-case docs
- current rootAdminShell PRD and test-case docs
- current OpenAPI and architecture docs

## Reconciliation Choice

This matrix follows the current repo rather than the old `RootUser V2.3` workbook.

It intentionally reflects current repo behavior such as:

- `listRootUsers` excludes deleted and anonymized rows in the normal list
- `removeRootUser` is irreversible and blocks later reactivation
- `rootUsers` routes are protected by authenticated root-user session plus shared authenticated-general throttling
- `rootAuth` public login routes are protected by shared auth abuse controls and public-auth throttling
- browser auth uses cookie-backed sessions and same-origin shell behavior through the root-admin shell slice

## Authorization Mapping Coverage Added

This matrix now carries explicit authz-mapping fields for every current repo
capability:

- `Governing authz capability`
- `Authz scope type`
- `Granted role / boundary`
- `Mandatory grant?`
- `Protected grant?`

For the current repo baseline, those fields are intentionally conservative:

- the live implemented operator role is `RootUserAdmin`
- public login and browser entrypoints are marked as `public unauthenticated caller`
- internal seams and bootstrap logic are marked explicitly rather than being
  forced into user-role language

That means the current matrix now contains enough information to reconstruct:

- backend-to-authz capability mapping
- role-to-authz capability mapping

for the current root platform without needing to infer those documents from
code alone.

## Known Remaining Gap

The repo still does not define a fully enduring differentiated root-role authorization model.
