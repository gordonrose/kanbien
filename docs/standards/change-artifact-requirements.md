# Change Artifact Requirements

## Purpose

Define which artifacts must exist for a change to be considered sufficiently
specified, documented, and verifiable.

This document is intentionally procedural.
It complements ADRs and architecture guides rather than replacing them.

## Minimum Required Artifacts By Change Type

### Feature-local backend capability

Required:

- capability matrix rows
- PRD or PRD refinement
- PRD-derived test-case doc
- end-to-end journey scenario inventory when the slice changes a meaningful
  customer or operator workflow, state-transition path, tenant or role
  variation, remediation or recovery flow, or another multi-step journey
- executable tests at the required layers
- QA release-gate review when the change is material enough to affect blocking
  workflow or release confidence
- QA coverage-matrix classification naming the required verification layers
- feature docs update when behavior is user-facing or operator-relevant
- traceability-clean mapping between active PRD-derived `TC-*` IDs and
  executable tests, unless an explicit deferred or pending-review posture is
  recorded in the PRD test-case doc
- downstream blueprint refresh when the PRD, source-independent contracts, or
  verification inventory changed after the current blueprint draft was written
- source-independent doc and status sync for affected API contracts, data
  dictionary entries, feature docs, OpenAPI, architecture summaries, and
  platform-status snapshots where the implemented slice changed their truth
- maintained-artifacts sweep covering status snapshots, registry or index docs,
  and earlier planning artifacts whose wording became stale because the slice
  now exists or materially changed current platform posture

Consider:

- ADR if a new enduring pattern or shared seam is introduced
- runbook/privacy note if security, operator flow, or personal data changes
- reconstruction questionnaire or bootstrap-guide update if runtime
  dependencies, interchangeable tools, or required local helpers changed
- structured exploratory QA note for high-risk changes when deterministic
  automation alone is not sufficient
- QA checklist, defect-feedback review, or waiver/quarantine record when the
  slice needs those controls to satisfy the QA release gate
- curated source-controlled test-run summary when the slice is used as a
  blocking-gate, standards-evidence, or reusable QA example

### Full vertical slice

Required:

- capability matrix rows
- PRD
- PRD-derived test-case doc
- end-to-end journey scenario inventory
- frontend description
- backend contract description
- persistence impact description
- docs update plan
- standards gate review

Consider:

- ADR if browser architecture, auth/session model, permission model, or other
  enduring patterns change

### Shared platform or cross-feature seam change

Required:

- ADR
- system-overview update
- principles update if guardrails change
- PRD or design record if the change is feature-driven
- standards gate review

### Privileged or permission-sensitive capability

Required:

- capability boundary classification:
  `root`, `tenant`, or explicitly approved shared-cross-tenant
- authentication requirement
- authorization expectation
- permission-mapping updates when the slice introduces new authz capability
  keys or changes role grants
- allow and deny test cases
- audit expectation
- standards gate review

If the capability is tenant-scoped, also require:

- current tenant context rule
- explicit cross-tenant deny rule
- object/entity-level rule when relevant
- source-independent note of whether the current tenant context is held in
  server-side session state, validated token claims, or another approved auth
  context mechanism

If the permission model itself changes, add:

- dedicated PRD
- ADR if the enforcement pattern is enduring

### Materially AI-assisted change

Required:

- AI-assistance/provenance note for accepted output
- independent verification note naming the repo source of truth used
- deterministic test or verification evidence for behavior-changing output

Also required when generated code, snippets, or dependencies are adopted:

- dependency/license/provenance review note

Also required for high-risk AI-assisted changes such as auth, crypto, secrets,
security controls, compliance logic, migrations, or incident/monitoring logic:

- model/tool/version traceability
- expert-review note

## Required Documentation Dimensions For Build-From-Spec Work

To make a capability reconstructable from docs and templates, document:

- business intent
- capability boundary:
  `root`, `tenant`, or explicitly approved shared-cross-tenant
- actor and permission model
- tenant context rule when relevant
- frontend surface and states if applicable
- backend route and contract
- persistence impact
- security, privacy, and audit expectations
- verification layers
- end-to-end journey requirements and tier when applicable
- QA coverage-matrix classification and required human QA artifacts when
  applicable
- docs and operational artifacts required

## Documentation Update Rule

When a change lands, update the affected combination of:

- PRD
- PRD-derived test-case doc
- end-to-end journey scenario inventory when required by the testing policy
- QA checklist, exploratory note, waiver/quarantine record, and curated test
  summary when required by the QA release gate or coverage matrix
- relevant feature docs
- architecture guides or ADRs
- runbook
- privacy note
- standards review notes
- AI-assisted review notes when the change materially relied on generative AI
- maintained status snapshots, registry docs, and earlier planning artifacts
  whose current-state wording changed because the implementation now exists
- reconstruction questionnaire when the slice changes interchangeable tools,
  providers, or deployer-local choices
- bootstrap and helper docs when the slice changes startup order, required
  local helpers, or runnable env assumptions
- harness-internals docs when the slice changes reusable test harness seams or
  persistence-test infrastructure
- script/helper behavior docs when the slice changes repo scripts, helper
  tooling, or script side effects in a meaningful way

Do not leave the implementation as the only place that knows the intended
behavior.

Before a slice is considered complete, perform a maintained-artifacts sweep.

At minimum, check:

- older PRD, PRD-derived test-case, or blueprint files for stale "not yet
  implemented" wording
- `docs/standards/platform-status/` files whose truth changed because of a new
  vendor, service, processor, dependency, review workflow, or
  standards-relevant control improvement
- `docs/standards/platform-status/` files whose wording became stale because a
  slice materially changed the implemented control posture for authentication,
  authorization, session management, auditability, privacy handling, or other
  standards-gated behavior even when the headline status remains the same
- README, index, inventory, and registry docs that summarize current platform
  capabilities, artifact sets, or entity inventories

If a surface is reviewed and intentionally left unchanged, record the reason in
the same loop rather than silently skipping it.

When an upstream planning artifact is materially reset or rewritten during the
same loop, revalidate downstream artifacts before continuing.

Typical examples:

- if the PRD is recreated or materially narrowed, refresh the implementation
  blueprint before proceeding to implementation
- if source-independent contracts materially change, refresh the blueprint and
  PRD-derived test-case assumptions that depend on them
- if verification scope changes, refresh the blueprint and test-case artifact
  before treating implementation as current

Treat stale downstream artifacts after an upstream reset as drift.

## End-To-End Journey Gate

For every feature loop, explicitly determine whether end-to-end journey testing
is required.

In this repo, the default posture is:

- all features have end-to-end testing expectations
- the depth and tier may vary, but the requirement itself is not optional

Required for every feature loop:

- identify affected journeys
- classify journey tier where relevant
- identify workflow state dimensions that can change outcome
- classify each dimension as behavior-changing, non-behavior-changing, or
  pending-review
- define equivalence classes for each behavior-changing dimension
- review lifecycle, deletion/disablement, revocation, expiry, and credible
  operator-induced state changes for inclusion rather than exclusion
- define meaningful permutations, including tenant and role variation when the
  feature can behave differently across them
- define default pairwise coverage across behavior-changing dimensions and any
  required higher-order interactions
- include legacy/pre-change and post-change data states when behavior can differ
- record known-pitfall research and add missing journey coverage where needed
- ensure executable end-to-end tests or explicitly reviewed deferred posture
  exist before considering the loop complete
- identify required non-E2E layers from the QA coverage matrix when the change
  class triggers them
- identify required human QA artifacts such as checklist, exploratory note,
  run summary, or waiver record when the gate requires them

Default durable locations:

- journey inventories:
  `docs/prd/journey_inventories/`
- executable end-to-end tests:
  `tests/e2e/`
- curated source-controlled run summaries:
  `docs/workspace/test-run-summaries/`

A feature loop is incomplete when:

- the journey inventory changed but the end-to-end scenarios were not updated
- the journey inventory does not explain the threshold for omitted permutations
- lifecycle or credible operator-induced journey classes were silently excluded
  rather than explicitly covered or deferred
- required end-to-end traces are missing from the planned artifact chain
- required end-to-end tests are flaky and unresolved without approved exception
- the QA coverage-matrix classification was not recorded
- required non-functional or human-QA artifacts were silently omitted even
  though the change class triggered them

## End-To-End Traceability Rule

When end-to-end journey coverage is required, traceability must link:

- capability matrix rows
- PRD or PRD refinement
- PRD-derived test cases where applicable
- journey scenario inventory
- executable end-to-end tests
- curated run summaries when those runs are part of the reviewed gate or audit

## Feature Loop Default

For a material change, do not fall back to an older thin loop that stops at
PRD, PRD-derived test cases, and a small hand-picked test run.

The default feature loop should explicitly determine and document:

- the QA coverage-matrix classification
- the journey inventory requirement and journey tier
- the required executable layer set
- the required human QA artifacts
- the required curated gate evidence

If the recorded change-class classification says a broader QA layer or artifact
is not required, record that decision explicitly rather than silently omitting
it.

Do not treat end-to-end tests as disposable implementation details when they
are part of the reviewed verification plan.

## QA Release-Gate Rule

When a change affects blocking workflows, high-risk domains, or production
confidence materially, the repo also requires review against:

- [QA Release Gate](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)

And supporting layer selection from:

- [QA Coverage Matrix Guide](/home/gordon/kanbien/docs/architecture/guides/qa-coverage-matrix-guide.md)

## PRD Test-Case Override Gate

Reviewed PRD-derived test cases are part of the change-control surface, not a
disposable planning note.

Implementation must not silently supersede them.

Before implementation is considered complete, pause for an explicit PRD
test-case update and review when executable-test work would:

- introduce a new `TC-*` ID that is not already present in the PRD-derived
  test-case doc
- remove executable coverage for an active documented `TC-*` ID
- merge multiple planned `TC-*` cases into one executable test in a way that
  obscures which reviewed cases are covered
- split one planned `TC-*` case into materially different executable cases with
  changed intent
- change the expected behavior, scope, or meaning of a reviewed `TC-*` case
- convert a previously active planned case to deferred, superseded, archived,
  or pending-review status

Allowed without a separate gate:

- adding executable coverage for an existing documented `TC-*`
- improving assertions without changing the planned case meaning
- splitting or consolidating executable tests while preserving the same
  documented `TC-*` IDs and auditability
- adding nearby comments that improve traceability without changing intent

Rule of thumb:

- undocumented executable `TC-*` IDs are drift
- documented `TC-*` IDs missing from executable coverage are drift unless the
  PRD test-case doc explicitly records the reason

## Permission-Mapping Gate

When a change introduces new authorization capability keys or changes the role
grant baseline, the source-independent permission-mapping artifacts are
required change outputs, not optional follow-up docs.

At minimum, update the relevant combination of:

- `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`
- `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`

Treat missing permission-mapping updates as drift when:

- runtime capability catalogs or seeded authz rows change
- protected routes gain new governing capability keys
- role defaults or protected or mandatory grant posture changes

Do not treat runtime capability registration alone as sufficient evidence for a
permission-sensitive feature change.

## Persistence Harness Update Gate

When a change adds or materially changes persistence-owned tables, migration
dependencies, or persistence-backed verification, update the shared
persistence-test harness in the same change where relevant.

At minimum, review and refresh the relevant combination of:

- persistence test scripts in `package.json`
- `tests/harness/postgres/migrations.ts`
- `tests/harness/postgres/testDatabase.ts`
- persistence-backed fixtures and actor/entity seeding in affected tests

Treat missing harness updates as drift when:

- a new persistence-backed feature test exists but is not included in the
  shared persistence run commands
- a new migration depends on another feature's schema but the shared migration
  harness does not reflect that dependency
- reset helpers no longer clear the tables owned by the active persistence
  suite
- persistence tests rely on implicit bootstrap state instead of seeding their
  required fixtures explicitly

## Pagination-Test Robustness Rule

Tests for paginated catalogs, lists, and searchable collections must not make
accidental assumptions about first-page contents unless first-page ordering is
part of the documented contract.

Preferred patterns:

- request a page size large enough to cover the asserted fixture set
- assert against explicit filters or exact known fixtures
- separate pagination-contract tests from business-presence tests

Treat brittle pagination assumptions as drift when a feature change only grows
the catalog or list surface but unexpectedly breaks unrelated tests.
