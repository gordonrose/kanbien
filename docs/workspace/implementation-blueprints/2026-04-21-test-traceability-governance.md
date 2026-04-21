# Test Traceability Governance Blueprint

## Summary

- Feature:
  repo-wide test traceability governance and reporting
- Capability:
  enforce honest, machine-checkable linkage between reviewed `TC-*` and `JY-*`
  artifacts and executable tests
- Scope:
  strengthen existing traceability tooling, add journey traceability checking,
  classify and burn down the current backlog, and wire the result into the repo
  change loop
- Phase:
  repo-governance improvement blueprint from an already observed standards gap;
  this is not a normal feature PRD slice

## Inputs

- Capability matrix reference:
  not applicable as a formal capability matrix; authority comes from repo
  standards and current traceability tooling
- PRD:
  not applicable; this blueprint exists to close a repo-governance gap in the
  build-from-spec and QA artifact chain
- ADR(s):
  - [0015-version-prd-test-case-lifecycle-to-reduce-drift.md](/home/gordon/kanbien/docs/architecture/adr/0015-version-prd-test-case-lifecycle-to-reduce-drift.md)
- PRD test-case doc:
  governing set under
  [docs/prd/test_cases/](/home/gordon/kanbien/docs/prd/test_cases/README.md)
- Journey inventory:
  governing set under
  [docs/prd/journey_inventories/](/home/gordon/kanbien/docs/prd/journey_inventories/README.md)
- QA coverage matrix classification:
  shared platform seam or middleware change; governance and standards-harness
  improvement
- QA release-gate expectation:
  standards-gated once the checker scope and baseline posture are finalized

## Problem Statement

The repo already treats traceability as a required part of the change loop, but
the current control surface is incomplete and the backlog is material.

Current observed baseline from `npm run test:traceability` on April 21, 2026:

- 446 documented `TC-*` IDs tracked
- 313 traceable in code
- 133 missing mappings

Largest current backlog buckets:

- `DESIGN-SYS-CANON`: `0/25`
- `ROOT-PATH`: `2/20`
- `WEB-APP-HIER`: `12/54`
- `WEB-PAGE-SET`: `1/22`
- `DESIGN-SYS-TOPO`: `4/21`
- `WEB-APP-SURF-DISC`: `18/26`

The repo also explicitly documents a second gap:

- there is still no dedicated `JY-*` checker, so journey traceability is partly
  manual today

This means the repo has the right policy shape, but not yet a complete,
operational enforcement loop.

## Scope Confirmation

This blueprint covers:

- `TC-*` checker hardening and better reporting quality
- dedicated `JY-*` journey traceability checking
- backlog triage so missing links are classified honestly
- standards and workflow updates needed to make the checks durable
- repo-level prioritization for cleanup work in the most incomplete features

This blueprint does **not** cover:

- blindly adding executable tests for every missing ID without first classifying
  whether the gap is:
  - missing linkage only
  - missing executable test
  - deferred lifecycle that should be recorded explicitly
  - stale planning artifact drift
- changing feature behavior unrelated to traceability
- redefining the PRD/test-case lifecycle model introduced by ADR 0015

## Frontend Plan

- Route / surface:
  none directly; this is repo tooling and documentation work
- UI states:
  not applicable
- Permission visibility behavior:
  not applicable
- Session / expiry behavior:
  not applicable
- Browser security considerations:
  not applicable

## Backend Plan

- Route(s):
  none
- Request/response/error contract:
  CLI and script output only
- Feature-local files expected:
  none; work should remain in shared repo-governance seams
- Cross-feature seams:
  - [src/scripts/checkTestCaseCoverage.ts](/home/gordon/kanbien/src/scripts/checkTestCaseCoverage.ts)
  - [src/lib/testingData/traceability.ts](/home/gordon/kanbien/src/lib/testingData/traceability.ts)
  - [src/lib/testingData/traceabilityReport.ts](/home/gordon/kanbien/src/lib/testingData/traceabilityReport.ts)
  - [src/lib/testingData/testCaseLifecycle.ts](/home/gordon/kanbien/src/lib/testingData/testCaseLifecycle.ts)
- Feature manifests to update:
  none expected unless this work is later folded into a feature-owned platform
  seam
- Authorization enforcement point:
  not applicable

## Persistence Plan

- Entities / rows affected:
  none
- Migration changes:
  none
- Index or uniqueness changes:
  none
- Search/filter implications:
  none
- Compatibility notes:
  existing `TC-*` and `JY-*` naming contracts are compatibility-sensitive repo
  seams; checker hardening must preserve approved ID formats unless an explicit
  migration strategy is introduced

## Target Architecture

### Source Of Truth

Keep these authority seams distinct:

- reviewed verification intent:
  `docs/prd/test_cases/*.md`
- reviewed journey intent:
  `docs/prd/journey_inventories/*.md`
- executable proof:
  `tests/` and, where necessary, nearby executable traceability comments
- lifecycle interpretation:
  `src/lib/testingData/testCaseLifecycle.ts`
- repo enforcement:
  `src/scripts/checkTestCaseCoverage.ts` plus a new journey checker

### Enforcement Model

The enforcement loop should answer four different questions explicitly rather
than collapsing them into one signal:

- `planned`
  does the reviewed doc define the `TC-*` or `JY-*` item?
- `traceable`
  does the reviewed identifier appear in executable test code or an allowed
  nearby executable comment?
- `executed`
  was the relevant suite actually run in the claimed layer?
- `deferred`
  was the omission intentionally recorded through lifecycle or deferred
  enforcement posture?

The current `TC-*` checker partially answers only the second question and does
so by substring scan across a broad corpus. The target loop should keep the
checker lightweight while making the output more classification-aware.

### Journey Traceability

Add a dedicated `JY-*` checker rather than continuing to rely on naming
discipline alone. The checker should:

- scan reviewed journey inventories for active `JY-*` IDs
- scan executable end-to-end and related workflow tests for matching `JY-*`
  references
- report missing journey links separately from `TC-*` gaps
- respect any future approved lifecycle or deferral posture for journey
  inventories if that model is later added

## Static Tooling Plan

### Existing Script Hardening

Strengthen the current `TC-*` checker in these ways:

1. Keep the current pass/fail contract, but classify missing IDs by likely
   cause.
2. Report extra executable `TC-*` IDs that do not exist in reviewed PRD
   test-case docs.
3. Separate:
   - missing executable linkage
   - malformed documented IDs
   - orphaned executable IDs
   - deferred documents skipped intentionally
4. Narrow the searchable corpus to executable seams that should count as valid
   evidence, rather than any arbitrary source file containing an ID string.
5. Preserve the important interpretation note that traceability is not the same
   thing as execution proof.

### New Journey Script

Add a script such as:

- `src/scripts/checkJourneyTraceability.ts`

Back it with a small shared library if the parsing rules overlap enough with
the existing `TC-*` implementation.

Add package scripts such as:

- `test:traceability:journeys`
- or a combined higher-level `test:traceability:all`

### Reporting Shape

Prefer output that is useful for triage, not just failure:

- by PRD key
- by test type for `TC-*`
- by journey inventory for `JY-*`
- by owning feature or route family where inferable
- by likely cause classification

If the output gets too large, prefer a compact summary plus optional detailed
mode instead of dumping every missing ID on every run.

## Verification Plan

- Journey tier / workflow scope:
  repo-governance and standards-harness improvement
- Unit:
  parser and report-shaping tests for `TC-*` and `JY-*` logic
- Integration:
  script-level tests using fixture docs and fixture test files
- Security:
  not a dedicated security slice, but ensure the scripts do not incorrectly
  treat unrelated non-executable docs as proof
- Audit:
  none required as executable audit tests, but curated reporting should support
  QA/audit review
- Edge:
  malformed IDs, duplicate IDs, deferred documents, superseded or
  pending-review entries, mixed-case or accidental near-matches
- Frontend:
  none
- Persistence-backed:
  none
- End-to-end:
  none
- Concurrency / idempotency:
  not applicable
- Performance:
  keep runtime fast enough for local use in the normal standards loop
- Resilience / failure-injection:
  handle missing folders, empty docs, and malformed documents with honest
  failure messages
- Compatibility / contract:
  preserve currently approved `TC-*` parsing and documented lifecycle
  semantics unless an explicit follow-up ADR changes them
- Accessibility:
  not applicable
- Structured exploratory QA:
  not required if fixture-based tests cover the parser and report matrix well
- QA checklist:
  update any checklist templates or examples that mention traceability so they
  reference both `TC-*` and `JY-*` posture honestly
- Curated test-run summary:
  recommended for the initial rollout that establishes the new baseline
- Waiver / quarantine expectation:
  if the repo cannot absorb 133 existing misses at once, use an explicit staged
  rollout note rather than silently disabling the checker

## Documentation Plan

- PRD updates:
  none expected
- PRD test-case updates:
  refresh only where the cleanup finds stale or wrongly active `TC-*` intent
- Feature docs:
  none directly
- API contract docs:
  none
- OpenAPI:
  none
- Postman:
  none
- Data dictionary:
  none
- Feature manifests:
  none
- Dependency graph artifacts:
  none
- Architecture map:
  review whether
  [core-build-from-spec-artifact-chain-foundation.md](/home/gordon/kanbien/docs/workspace/architecture-map/layers/core-build-from-spec-artifact-chain-foundation.md)
  and
  [governance-compliance-evidence-posture.md](/home/gordon/kanbien/docs/workspace/architecture-map/layers/governance-compliance-evidence-posture.md)
  need wording updates after rollout
- Standards platform-status snapshots:
  review:
  - [QA-RELEASE-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/QA-RELEASE-STATUS.md)
  - [NIST-SSDF-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/NIST-SSDF-STATUS.md)
- Reconstruction questionnaire:
  none expected
- Bootstrap and helper docs:
  review
  [script-and-helper-behavior-guide.md](/home/gordon/kanbien/docs/architecture/guides/script-and-helper-behavior-guide.md)
  if new scripts or reporting contracts are added
- Maintained-artifacts sweep:
  review and refresh:
  - [docs/prd/test_cases/README.md](/home/gordon/kanbien/docs/prd/test_cases/README.md)
  - [docs/prd/journey_inventories/README.md](/home/gordon/kanbien/docs/prd/journey_inventories/README.md)
  - [testing-and-verification-guide.md](/home/gordon/kanbien/docs/architecture/guides/testing-and-verification-guide.md)
  - [end-to-end-journey-operations-guide.md](/home/gordon/kanbien/docs/architecture/guides/end-to-end-journey-operations-guide.md)
  - [change-artifact-requirements.md](/home/gordon/kanbien/docs/standards/change-artifact-requirements.md)
- Runbook:
  not required, but a short workspace rollout note may help if staged adoption
  is used
- Privacy note:
  not applicable
- Standards review:
  required because this changes repo enforcement posture
- Repo health review:
  recommended after the initial cleanup wave to confirm the backlog is not just
  being renamed

## Prioritized Backlog

### Phase 1: Make The Baseline Honest

1. Extend the current `TC-*` report so it distinguishes:
   - missing-in-code documented IDs
   - executable IDs with no reviewed doc entry
   - malformed documented IDs
   - skipped deferred docs
2. Produce one baseline artifact or workspace note capturing the current miss
   inventory by feature family.
3. Triage the 133 current misses into:
   - missing linkage only
   - missing executable tests
   - stale active docs that should become deferred, superseded, or archived
   - false negatives caused by checker limitations

### Phase 2: Close The Journey Gap

1. Implement the dedicated `JY-*` checker.
2. Add unit and fixture-driven integration tests for journey parsing and
   reporting.
3. Update journey docs and guidance so they no longer describe the checker as a
   future gap.

### Phase 3: Burn Down The Biggest Hotspots

Prioritize cleanup in this order unless a live feature loop justifies a
different local sequence:

1. `WEB-APP-HIER`
   largest raw `TC-*` gap and a shared topology-sensitive seam
2. `WEB-PAGE-SET`
   extremely low current traceability ratio despite being a recent governed
   surface
3. `ROOT-PATH`
   compatibility-sensitive migration seam
4. `DESIGN-SYS-CANON`
   signoff and public-reference truth should be especially well traced
5. `DESIGN-SYS-TOPO`
   paired with deterministic materialization expectations
6. `WEB-APP-SURF-DISC`
   moderate remaining gap after the larger hotspots

For each family, do not stop at adding ID strings mechanically. Confirm whether
the reviewed cases are actually represented by honest executable proof at the
right test layer.

### Phase 4: Put It On The Main Change Loop

1. Decide whether `test:traceability` becomes:
   - blocking immediately
   - blocking only for touched PRD families
   - or staged behind an approved temporary baseline waiver
2. Add the final script set to the relevant repo check path once the failure
   posture is agreed.
3. Update QA templates and standards docs so future slices cannot widen the gap
   silently.

## Delivery Notes

### Recommended Rollout Posture

Do not flip directly from the current red baseline to a repo-wide hard block
without an explicit staged policy. That would create noisy friction and invite
workarounds.

Recommended posture:

1. improve the checker quality first
2. capture and publish the baseline
3. block net-new drift and touched-family regressions
4. burn down the existing backlog by priority
5. promote to stricter repo-wide enforcement once the baseline is credible

### Ownership Split

Keep ownership explicit:

- shared traceability scripts and parsing:
  repo-governance / standards tooling owner
- missing case triage:
  owning feature or architecture owner for the relevant PRD family
- lifecycle corrections in docs:
  PRD/test-case artifact owner
- executable proof additions:
  feature implementation owner

## Completion Guardrails

- Blocking QA outcomes:
  the rollout is not complete until:
  - `TC-*` tooling reports cause-specific output
  - `JY-*` tooling exists
  - staged adoption posture is documented honestly
  - the highest-risk backlog families have explicit owners and status
- Explicitly deferred verification layers and rationale:
  - no frontend, persistence, or end-to-end automation is needed for the
    tooling itself
  - repo-wide hard blocking may be deferred briefly while the backlog baseline
    is stabilized, but only with an explicit documented posture
- Expected release-gate residual risk statement:
  even after the tooling lands, residual risk remains if reviewed docs and test
  ownership are not maintained; the goal is to make drift visible and
  increasingly hard, not to assume a checker alone proves coverage quality
