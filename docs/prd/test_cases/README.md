# PRD Test Cases

This folder contains test case documents derived from PRDs.

Companion end-to-end journey inventories live under:

- [`docs/prd/journey_inventories/`](/home/gordon/kanbien/docs/prd/journey_inventories/README.md)

Expected contents:

- one Markdown file per PRD
- coverage split into unit, integration, NFR security, NFR logging or audit,
  and edge cases

These files are intended to be maintained with the repo-local
`prd-test-case-planner` skill for planning and the
`prd-test-case-implementer` skill for executable test implementation and status
follow-through.

Every documented case should include a stable `TC-*` ID so it can be traced to
an executable test later.

Recommended linkage:

- put the `TC-*` ID in the Markdown test-case entry
- repeat the same ID in the Vitest test name or a nearby test comment
- run `npm run test:traceability` to check whether documented cases are traceable in code

## Change-Control Expectation

The PRD-derived test-case doc is a reviewed source of truth for verification
intent.

Implementation may realize that intent, but it must not silently redefine it.

That means:

- every active documented `TC-*` should map to executable test code or be
  explicitly marked as deferred or pending-review
- executable tests should not introduce new `TC-*` IDs unless the PRD-derived
  test-case doc is updated in the same change
- if implementation needs to change planned case identity, grouping, scope,
  lifecycle, or expected behavior, update the PRD-derived test-case doc first
  and treat that as a review gate rather than a cleanup step

This preserves the value of the PRD test-case sanity check by ensuring
implementation cannot silently override the reviewed test inventory.

Important interpretation:

- `npm run test:traceability` reports whether the documented `TC-*` IDs are present in executable tests or nearby test code
- it does not by itself prove that those tests were executed in the current run
- execution proof still comes from running the relevant Vitest command, such as `npm test` or a narrower command like `npm run test:persistence`
- when the dedicated Postgres test database is configured, `npm test` now
  intentionally performs two Vitest runs: the fast runtime suite first, then a
  serialized persistence-backed suite

## Lifecycle Metadata

PRD-derived test-case documents may also carry lifecycle metadata for
anti-drift review.

Recommended per-case fields:

- `Version`
- `Lifecycle Status`
- `Supersedes`
- `Superseded By`
- `Reason`
- `Approval Note`

Current lifecycle states:

- `active`
- `superseded`
- `archived`
- `pending-review`

Pilot default:

- if a case omits lifecycle metadata, the repo currently treats it as:
  - `Version: v1`
  - `Lifecycle Status: active`

## Traceability Enforcement

PRD-derived test-case documents may declare:

- `Traceability Enforcement: enforced`
- `Traceability Enforcement: deferred`

Use `deferred` only when a document is intentionally being added as a planning
or pilot source of truth before executable coverage is expected to be
traceability-clean.

The current traceability checker skips deferred documents.

Documents with `Traceability Enforcement: enforced` should be treated as
standards-gated artifacts:

- missing documented IDs in code are drift
- executable `TC-*` IDs that do not exist in the document are drift
- traceability should be checked during implementation, not only after the
  feature is otherwise considered done

## Status Vocabulary

Use the following terms consistently when discussing PRD test-case status:

- `planned`
  The case exists in the PRD-derived Markdown document.
- `traceable`
  The case's `TC-*` ID appears in executable test code or a nearby executable
  test comment and is reported by `npm run test:traceability`.
- `runtime-tested`
  The case is exercised by the normal in-memory or app-level Vitest suite, such
  as `npm test` or a narrower non-persistence Vitest command.
- `persistence-tested`
  The case is exercised against the dedicated Postgres test database through
  `npm run test:persistence`.
- `proven`
  The case is both traceable and executed in the appropriate layer for the
  claim it makes. Some cases are proven by `runtime-tested` alone, while
  storage-sensitive or migration-sensitive cases may require
  `persistence-tested`.

## Persistence-Mode Interpretation

Persistence-backed tests now use two deliberate execution modes:

- `npm run test:persistence`
  The normal reset-first mode against the dedicated Postgres test database.
- `npm run test:persistence:preserve`
  The optional preserve/debug mode for forensic inspection when you do not want
  routine per-test resets.

Important:

- preserve/debug mode does not automatically mean every persistence-backed test
  writes a manifest
- manifest cleanup expectations apply only to preserved durable test workflows
  that actually register a `testRunId` through the shared durable-test helpers

## Recommended Reporting Pattern

When summarizing a PRD test-case file, prefer reporting at the layer level:

- `UNIT`
- `INT`
- `SEC`
- `AUD`
- `EDGE`

For each layer, note:

- whether it is fully traceable
- whether it has been runtime-tested
- whether any cases in that layer additionally require persistence-backed proof
