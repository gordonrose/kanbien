# Imports

This folder is the active inbox for imported source files that are being used
to create or reconcile repo artifacts.

Use this folder for:

- original workbooks or external files used to create a repo artifact
- preserved input files cited by conversion notes
- evidence that explains where an older generated or converted artifact came
  from

Do not treat files in this folder as current repo source truth by default.
Before using an imported file to guide implementation, compare it with current
PRDs, feature docs, API contracts, architecture defaults, and maintained
workspace artifacts.

Current status:

- No active imported source files are kept here.
- Legacy Root Users capability-matrix workbooks were archived to
  `docs/workspace-buckets/archive-history/imports/root-users-legacy-capability-matrix/`.

When an import is only retained for historical provenance after conversion,
move it to `archive/history` and update the converted artifact's source links.
