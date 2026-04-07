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
- executable tests at the required layers
- feature docs update when behavior is user-facing or operator-relevant
- traceability-clean mapping between active PRD-derived `TC-*` IDs and
  executable tests, unless an explicit deferred or pending-review posture is
  recorded in the PRD test-case doc
- downstream blueprint refresh when the PRD, source-independent contracts, or
  verification inventory changed after the current blueprint draft was written
- source-independent doc and status sync for affected API contracts, data
  dictionary entries, feature docs, OpenAPI, architecture summaries, and
  platform-status snapshots where the implemented slice changed their truth

Consider:

- ADR if a new enduring pattern or shared seam is introduced
- runbook/privacy note if security, operator flow, or personal data changes

### Full vertical slice

Required:

- capability matrix rows
- PRD
- PRD-derived test-case doc
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
- docs and operational artifacts required

## Documentation Update Rule

When a change lands, update the affected combination of:

- PRD
- PRD-derived test-case doc
- relevant feature docs
- architecture guides or ADRs
- runbook
- privacy note
- standards review notes
- AI-assisted review notes when the change materially relied on generative AI

Do not leave the implementation as the only place that knows the intended
behavior.

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
