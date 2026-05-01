# Test Suite Alignment Task Guardrail

Use for task type: `test-suite-alignment`

## Must Preserve

- approved PRD, story, and acceptance-criterion intent
- existing executable proof semantics unless a separate implementation or
  `test-only` task is approved
- exact `TC-*`, `AC-*`, journey, backlog, and evidence IDs where they are
  already reviewed and valid
- traceability between `docs/prd/test_cases`, QA backlog/status artifacts, and
  executable tests
- no production behavior changes hidden inside alignment work

## Approval Evidence

- source map naming the docs, backlog/status artifacts, and executable tests
  being reconciled
- mismatch class for every alignment target
- tight write envelope limited to documentation, QA backlog/status artifacts,
  and test names/comments when needed
- explicit production behavior change posture
- split decision for any newly required proof
- traceability command and expected before/after evidence

## Deep Delivery Standard

- one feature, route family, test-case document, or traceability mismatch
  family per queued task
- use for reconciliation work such as missing documented `TC-*` entries,
  missing executable IDs, stale implementation status, malformed IDs, orphaned
  executable IDs, standards drift, backlog drift, proof-layer drift, or
  fixture/documentation drift
- do not use as a shortcut for implementing meaningful new test coverage; split
  new proof into `test-only`
- do not rewrite PRD intent merely to match weak or shallow executable tests
- exact source artifacts and executable targets must be named before queueing
- focused proof must include `npm run test:traceability` or an approved
  traceability-equivalent command, plus any focused suite needed to prove that
  renamed or relabeled tests still execute
- if the reconciliation reveals missing product, design, architecture,
  permission, lifecycle, or security behavior, stop and create the owning task
  type rather than continuing alignment

## Required Check IDs

- `test-alignment-source-map`
- `test-alignment-mismatch-class`
- `test-alignment-edit-envelope`
- `test-alignment-no-production-change`
- `test-alignment-split-new-proof`
- `test-alignment-traceability-command`
