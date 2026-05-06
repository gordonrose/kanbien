# Test Suite Alignment Task Guardrail

Use for task type: `TEST:test-suite-alignment`

## Must Preserve

- approved PRD, story, and acceptance-criterion intent
- approved source authority from traceability output, PRD test-case docs, QA
  backlog/status artifacts, standards updates, issue reconciliation, or a
  suite-maintenance finding
- existing executable proof semantics unless a separate implementation or
  `TEST:test-only` task is approved
- exact `TC-*`, `AC-*`, journey, backlog, and evidence IDs where they are
  already reviewed and valid
- traceability between `docs/prd/test_cases`, QA backlog/status artifacts, and
  executable tests
- no production behavior changes hidden inside alignment work
- no new executable proof hidden inside metadata, label, lifecycle, or
  documentation reconciliation
- no source-independent truth rewrite that makes incomplete implementation look
  correct

## Approval Evidence

- source authority and trigger: traceability output, test-case document, QA
  backlog/status row, standards change, issue reconciliation finding, or
  approved suite-maintenance finding
- source map naming the docs, backlog/status artifacts, and executable tests
  being reconciled
- mismatch class for every alignment target
- tight write envelope limited to documentation, QA backlog/status artifacts,
  test metadata, labels, lifecycle/status fields, organization, and
  names/comments when needed
- explicit production behavior change posture
- split decision for any newly required proof
- split decision for stale source truth, missing product behavior, missing API
  contract truth, missing permission/data dictionary truth, architecture or
  standards gaps, and evidence-only work
- traceability command and expected before/after evidence
- `npm run test:coverage-strength` output or a scoped equivalent when alignment
  materially changes the apparent coverage shape

## Deep Delivery Standard

- one feature, route family, test-case document, or traceability mismatch
  family per queued task
- use for reconciliation work such as missing documented `TC-*` entries,
  missing executable IDs, stale implementation status, malformed IDs, orphaned
  executable IDs, standards drift, backlog drift, proof-layer drift, or
  fixture/documentation drift
- do not use as a shortcut for implementing meaningful new test coverage; split
  new proof into `TEST:test-only`
- do not rewrite PRD intent merely to match weak or shallow executable tests
- exact source artifacts and executable targets must be named before queueing
- focused proof must include `npm run test:traceability` or an approved
  traceability-equivalent command, plus any focused suite needed to prove that
  renamed or relabeled tests still execute
- use `npm run test:coverage-strength` to summarize whether alignment improved,
  weakened, or merely relabeled coverage strength; do not treat traceability
  cleanup as proof of deeper coverage
- if the reconciliation reveals missing product, design, architecture,
  permission, lifecycle, or security behavior, stop and create the owning task
  type rather than continuing alignment
- if alignment materially changes suite status, proof-layer labels, lifecycle
  posture, or coverage posture, record whether coverage strength improved,
  weakened, or merely became more honest

## Source Authority And Mismatch Classes

TEST:test-suite-alignment reconciles approved test documentation, executable
test metadata, QA backlog/status, and traceability output. It does not
implement new behavior or new proof.

Allowed source triggers:

- `npm run test:traceability` or equivalent traceability output
- PRD test-case document lifecycle/status mismatch
- QA backlog, QA status, or evidence ledger mismatch
- standards or harness expectation change
- issue reconciliation finding
- approved suite-maintenance or suite-organization finding

Allowed mismatch classes include:

- stale documentation status
- missing or malformed `TC-*`, `AC-*`, journey, backlog, or evidence label
- renamed or moved test file
- orphaned executable ID
- superseded, archived, pending-review, or active lifecycle/status mismatch
- traceability drift
- proof-layer label drift
- fixture naming or fixture-source documentation drift
- QA backlog/status drift
- standards expectation drift

If the mismatch class is "the behavior is not implemented" or "the proof does
not exist", alignment must split the missing work to the owning task type.

## Edit Envelope

TEST:test-suite-alignment may update:

- PRD test-case lifecycle/status and traceability rows
- QA backlog/status/evidence ledger alignment fields
- executable test labels, IDs, descriptions, grouping, file organization, or
  comments when the executable assertion semantics stay the same
- suite metadata needed for traceability or reporting
- documentation that describes current test coverage honestly

It must not:

- change production source code
- change migrations, API contracts, permission mappings, data dictionary,
  architecture, or standards truth
- add new executable assertions for previously unproven behavior
- relax assertions or rewrite docs to hide shallow/incomplete coverage
- change fixtures or mocks in a way that changes behavior under test
- treat traceability cleanup as proof that coverage strength improved

## Split Rules

Split or block when:

- new executable proof is required; create `TEST:test-only`
- production behavior is missing or wrong; create the owning `DEV:*` task
- API contract truth is missing; create `DOC:api-contract`
- permission/authz truth is missing; create `DOC:permission-mapping`
- data dictionary/storage truth is missing; create `DOC:data-dictionary`
- architecture or standards authority is missing; create
  `GOV:architecture-update` or `GOV:standards-update`
- evidence capture, runtime proof collation, screenshots, or coverage-health
  reporting is the main work; create `EVIDENCE:qa-evidence`

## Worked Examples

| Scenario | Mismatch Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| `npm run test:traceability` reports an executable test missing its documented `TC-*` label, but the assertion already exists. | missing or malformed ID | Update test metadata/label or test-case trace row only, run traceability and focused suite, and record coverage-strength impact as relabeled/honest rather than new proof. | Do not add assertions; new proof routes to `TEST:test-only`. |
| A PRD test-case row is marked active but the source story superseded it. | lifecycle/status mismatch | Update lifecycle/status and traceability fields from approved source, preserve PRD intent, and run traceability. | Do not rewrite acceptance criteria to match current implementation. |
| A test file moved and QA backlog paths are stale. | renamed or moved test file | Align docs/backlog/status paths and executable labels while proving the moved tests still execute. | Do not change production behavior or test semantics. |
| Alignment reveals the documented behavior has no executable proof. | proof does not exist blocked | Record the mismatch and split new proof to `TEST:test-only`. | Do not mark the docs aligned by weakening the documented behavior. |

## Required Check IDs

- `test-alignment-source-authority`
- `test-alignment-source-map`
- `test-alignment-mismatch-class`
- `test-alignment-edit-envelope`
- `test-alignment-no-production-change`
- `test-alignment-split-new-proof`
- `test-alignment-traceability-command`
- `test-alignment-coverage-strength`
- `test-alignment-source-truth-boundary`
