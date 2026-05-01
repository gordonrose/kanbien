# Task Breakdown Packet Template

Use this after a Story Breakdown packet has validated and at least one story is
marked `ready-for-task-breakdown`.

Task Breakdown converts one approved story, or a small explicitly related
story set, into isolated delivery tasks. It does not redefine story scope,
acceptance criteria, product intent, or Technical Steering architecture.

Do not describe a task as queued for Delivery unless
`npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>`
passes, or every blocker is explicitly accepted by the requester.

## Status

- Packet status:
  `draft | blocked | ready-for-delivery-handoff | superseded`
- Packet date:
- Task Breakdown ID:
- Source Story Breakdown packet:
- Selected Story ID(s):
- Related Product Discovery packet:
- Related Technical Steering packet:
- Related PRD:
- Related capability matrix:
- Validation command:
- Validation status:
  `not-run | pass | blocked | not-applicable`

## Source Story Handoff

- Story packet validation status:
  `pass | blocked | not-run`
- Selected story handoff status:
  `ready-for-task-breakdown | blocked | control-story-only | superseded`
- Story scope preserved:
  `yes | no`
- Acceptance criteria preserved:
  `yes | no`
- Product intent preserved:
  `yes | no`
- Technical Steering architecture preserved:
  `yes | no`
- Architecture invention check:
  `consumes-story-and-steering-only | proposes-new-architecture | blocked`
- Capability rows complete for implementation tasks:
  `yes | no | not-applicable`
- Story blockers carried forward:

## Steering Classification Reconciliation

Layer 4 must reconcile tasks against the Layer 2 classifications preserved by
Story Breakdown. Do not create a task queue that contradicts steering.

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |

Allowed reconciliation statuses:

- `covered`
- `blocked`
- `deferred-with-owner`

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |

Every Layer 3 signal with `Present` set to `yes` or `blocked` must be covered,
blocked, or explicitly deferred before Delivery handoff.

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use one story by default. Select a small story set only when the stories are
explicitly related and share a necessary delivery dependency.

## Story Acceptance Criteria Snapshot

Copy the approved story acceptance criteria exactly so the validator can detect
task-layer rewrites.

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |

## Task Queue

Allowed task types:

- `DEV:backend`
- `DEV:frontend`
- `DEV:vertical-slice`
- `DOC:docs-artifact`
- `TEST:test-only`
- `TEST:test-suite-alignment`
- `DECISION:refactor-first`
- `DECISION:architecture-foundation`
- `DOC:standards-compliance`
- `DEV:platform-seam`
- `DEV:migration-persistence`
- `DEV:design-system`
- `DOC:api-contract`
- `DOC:permission-mapping`
- `DOC:data-dictionary`
- `EVIDENCE:qa-evidence`

Allowed delivery handoff statuses:

- `draft`
- `blocked`
- `queued-for-delivery`
- `superseded`

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use stable task IDs such as `T-S001-01`.

## Task Size Guardrail

Layer 4 is a deep-delivery quality gate. A task is not ready for Delivery
merely because it has a type, write set, and proof command. It must be small
enough for one durable behavior, decision, or proof target to be delivered
deeply without guessing.

Allowed task grain classifications:

- `single-behavior`
- `single-decision`
- `single-proof-target`
- `inseparable-two-ac-slice`
- `split-required`
- `coarse-blocked`

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Queued tasks should usually cover one acceptance criterion. Two ACs are
allowed only when inseparable and justified. More than two ACs must block
Delivery handoff. If one AC is itself too broad, block the task and send it
back for Story Breakdown refinement rather than rewriting the AC in Layer 4.

## Decision Escalation / Stop Conditions

Use this section to record the decisions an implementer must not guess.
Every queued task needs at least one row. Use `none-known` only when the task
has no identified decision trigger and the rationale explains why.

Allowed trigger types:

- `none-known`
- `human-decision`
- `technical-steering-revisit`
- `design-system-seam-gap`
- `product-decision`
- `architecture-decision`
- `source-truth-mismatch`
- `proof-gap`

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |

Use `yes` or `no` for `May Proceed If Hit`. Decision-bearing triggers should
normally use `no`.

## Exact Starting Context

List the exact source context the implementer must inspect before editing.

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |

## Frontend Architecture Decision Reconciliation

For `DEV:frontend`, `DEV:design-system`, and frontend-affecting `DEV:vertical-slice` tasks,
copy the relevant Layer 2 DEV:frontend architecture decisions. Layer 4 packages and
enforces these decisions; it must not invent route family, product module,
journey group, topology, locator, authority, state, shell, DEV:design-system
prerequisite, or materialization posture.

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Source placement defaults:

- `shell-bootstrap` and `shell-route-registry` may touch shell entry files
  only for bootstrap, route resolution, navigation registry, or shell
  composition; `shell-route-registry` may own registry/route mounting only, not
  page or journey behavior
- `module-journey-files` is required for page, module, or journey behavior and
  must not add behavior to root shell entry files such as
  `src/frontend/rootAdminShell/assets/app.mjs`; allowed write paths must name
  the approved product module/journey group or explain `path-unknown:` when the
  exact path is not known yet
- `design-system-family-files` is required for design-system-owned render,
  behavior, accessibility, and app-consumption seams
- `generated-output` requires `Materialization Model` =
  `preview-apply-required`, a named preview/apply or materialization seam, and
  no hand edits unless the task is an explicitly approved generated/canonical
  sweep

## Frontend / Design-System Sub-Standard

For `DEV:frontend`, `DEV:design-system`, and frontend-affecting `DEV:vertical-slice` tasks,
name the primary sub-standard. Complex DEV:frontend or DEV:design-system work must
split when fixture/data contracts, visual rendering, interaction behavior,
accessibility semantics, and evidence sweep are independently meaningful.

Allowed sub-standards:

- `not-applicable`
- `fixture-data-contract`
- `visual-rendering`
- `interaction-behavior`
- `accessibility-semantics`
- `evidence-sweep`

Proof expectations:

- `fixture-data-contract` requires contract, fixture, and live/runtime payload
  proof.
- `visual-rendering` requires a canonical screenshot or evidence artifact name.
- `interaction-behavior` requires an exact state transition or interaction
  scenario name.
- `accessibility-semantics` requires role, name, state, and focus proof.
- `evidence-sweep` requires exact evidence artifact names and sweep scope.
- `not-applicable` is allowed only with concrete rationale and only where the
  task type permits it.

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |

## Frontend Performance Posture

For queued `DEV:frontend`, `DEV:design-system`, and frontend-facing `DEV:vertical-slice`
tasks, classify DEV:frontend performance risk. Layer 4 must not invent new
DEV:frontend architecture decisions, but it must package enough proof for the
primary DEV:frontend/design-system work.

Allowed postures:

- `static-low-risk`
- `interactive-low-risk`
- `data-list-or-table`
- `route-initialization`
- `large-dom-or-canvas`
- `asset-heavy`
- `animation-or-transition-heavy`
- `not-applicable`
- `unknown-blocked`

Proof expectations:

- `static-low-risk`: explain why render proof is sufficient and no
  performance-specific proof is needed.
- `interactive-low-risk`: interaction scenario proves no repeated work or fetch
  loop.
- `data-list-or-table`: bounded data-size scenario and DOM/list/table rendering
  proof.
- `route-initialization`: route init/load proof or Lighthouse/trace evidence
  where appropriate.
- `large-dom-or-canvas`: bounded DOM/canvas size plus nonblank and interaction
  proof.
- `asset-heavy`: asset size/loading strategy and rendered asset evidence.
- `animation-or-transition-heavy`: interaction/transition timing or
  reduced-motion behavior proof.
- `not-applicable`: concrete rationale required.
- `unknown-blocked`: blocks Delivery handoff.

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |

## Design-System Seam Contract

Design-system tasks must produce, refine, or prove a seam that DEV:frontend tasks
can consume. Frontend tasks must consume an existing signed-off seam or record
an approved exception; they must not recreate governed render structure,
controller behavior, ARIA/state semantics, or page CSS locally.

Allowed seam postures:

- `not-applicable`
- `produces-consumable-seam`
- `refines-existing-seam`
- `proves-existing-seam`
- `consumes-existing-seam`
- `approved-exception`
- `blocks-on-missing-seam`

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Adoption Contract

Queued `DEV:frontend` tasks with Design-System Seam Contract posture
`consumes-existing-seam` must record the exact adoption contract. Layer 4 must
make the consumer boundary deterministic: the app may compose and bind data
around signed-off DEV:design-system seams, but must not reconstruct governed
markup, controller behavior, ARIA/state semantics, or CSS locally.

Use concrete `not-applicable:` rationale when a seam type genuinely does not
apply, such as a static render seam with no behavior/controller seam.

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Security Evidence

For `DEV:frontend`, `DEV:design-system`, and frontend-affecting `DEV:vertical-slice` tasks,
copy the relevant Layer 2/3 Browser Security Posture rows. Layer 4 packages and
enforces the proof plan; it must not invent whether a browser security area is
present. If Layer 2/3 says an area is present or `Stop If Missing` is `yes`,
the queued task needs a matching row or it must block.

Allowed security areas:

- `session-cookie`
- `csp-assets`
- `privileged-helper`
- `csrf-mutation`
- `url-replay-state`
- `sensitive-rendering`
- `asset-delivery`
- `not-applicable`

Use `yes`, `no`, or `blocked` for `Source Present`.

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |

## Frontend Permission Rendering Evidence

Frontend, DEV:design-system, and frontend-facing DEV:vertical-slice tasks that render
privileged, tenant, user, role, asset, lifecycle, or otherwise sensitive data
must carry permission-aware rendering proof notes. Tenant-scoped rendering must
include cross-tenant denial proof.

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |

## Frontend Runtime Data And Mock Honesty

Frontend, DEV:design-system, and frontend-facing DEV:vertical-slice tasks that render
API or projection data must tie rendered proof to the governing contract and a
live/runtime payload, or explain why runtime payload evidence is unavailable.
Rendered proof that uses only mocks without a contract/runtime tie blocks.

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |

## Vertical Slice Coupling

Queued `DEV:vertical-slice` tasks must prove why DEV:backend and DEV:frontend work are
inseparable for exactly one journey behavior. Use a vertical slice only when one
proof story must cross API/data/browser boundaries together. Split work into
DEV:backend, DEV:frontend, DEV:design-system, DEV:migration-persistence, TEST:test-only,
TEST:test-suite-alignment, or EVIDENCE:qa-evidence tasks when those concerns can be
delivered and proven separately.

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Backend Implementation Approach

Queued `DEV:backend` tasks must translate repo-wide architecture law into the
specific implementation approach for this task without copying the full
constitution into the packet.

Allowed capability file strategies:

- `new-capability-file`
- `existing-capability-file`
- `service-composition-only`
- `transport-only`
- `not-applicable-with-rationale`

| Task ID | Feature Owner | Capability File Strategy | Expected Files / Layers | Layer Responsibilities | Public Seam / Manifest Impact | Formatting / Generated Artifact Expectations |
| --- | --- | --- | --- | --- | --- | --- |

Use this to name whether the task adds or updates
`domain/<capabilityName>.ts`, keeps `domain/service.ts` as composition,
touches `contract/`, `persistence/`, `transport/`, `integration.ts`,
`index.ts`, or `feature.manifest.json`, and which source-independent artifacts
or generated artifacts must stay aligned.

## Migration / Persistence Approach

Queued `DEV:migration-persistence` tasks must name the exact persistence change
class, live-schema posture, source data shape validation, per-row migration
eligibility validation, rejected-row behavior, migration identity posture, SQL
execution semantics, representative read/write proof, and shared Postgres
harness impact before Delivery starts.

Allowed change types:

- `live-schema-inspection`
- `new-migration`
- `corrective-migration`
- `repository-query-semantics`
- `index-or-constraint`
- `normalization-or-uniqueness`
- `postgres-harness-update`
- `not-applicable-with-rationale`

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use this to keep migration identity, live schema, code, indexes, normalization,
repository behavior, and shared persistence harness obligations explicit.
Data-transforming migrations must validate the overall source data shape before
mutation and validate each row's eligibility before transforming it. Rows that
do not match the approved source shape must fail closed, quarantine/report, or
follow an approved corrective/manual repair path rather than being silently
migrated.

## Tight Allowed Write Envelope

Prefer exact files over broad directories. Broad DEV:frontend or DEV:design-system
write sets are blocked by default for queued implementation tasks unless the
task is explicitly an audit, migration, generated/canonical sweep, or another
approved broad-scope task with strong rationale.

Allowed envelope classes:

- `exact-files`
- `narrow-pattern`
- `broad-pattern-justified`
- `broad-pattern-blocked`

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |

## Task-Specific Proof Plan

Queued tasks need at least one task-specific proof target. Broad commands can
supplement the task-specific proof, but they cannot be the only proof unless
the task type is intentionally broad and the rationale explains why.

Allowed proof specificity statuses:

- `task-specific`
- `broad-with-rationale`
- `blocked`

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |

## Test-Only Coverage Contract

Queued `TEST:test-only` tasks must say exactly what kind of test work they perform.
Use this task type for PRD-derived `TC-*` implementation, isolated proof-gap
tests, security/permutation matrix tests, or e2e journey tests. Do not use it
when production behavior must change.

Allowed production behavior change postures:

- `no-production-change`
- `test-harness-only`
- `blocked-production-change-required`

| Task ID | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

Queued `TEST:test-suite-alignment` tasks reconcile existing or newly discovered test
suite/documentation drift. Use this task type when PRD test cases, QA backlog
rows, journey IDs, executable test names, traceability output, or standards
expectations no longer line up. Do not use it to implement meaningful new
coverage; split that work into `TEST:test-only`.

Allowed mismatch classes:

- `missing-documented-test-case`
- `missing-executable-id`
- `stale-status`
- `malformed-id`
- `orphaned-executable-id`
- `standards-drift`
- `backlog-drift`
- `proof-layer-drift`
- `fixture-doc-drift`

Allowed edit postures:

- `docs-only`
- `test-title-or-comment-only`
- `docs-and-test-labels-only`
- `blocked-production-change-required`

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

Privileged, root-admin, tenant-boundary, authz, sensitive-rendering, asset,
lifecycle, and security-sensitive `TEST:test-only` tasks must carry an explicit
matrix. The matrix should name the allowed path and the meaningful denied or
edge states rather than relying on a happy-path-only test.

Use concrete `not-applicable:` rationale only for ordinary non-sensitive test
work.

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Forbidden Assumptions

Record product, design, architecture, source-truth, or proof assumptions the
implementer must not invent.

| Task ID | Forbidden Assumption | Escalation Path |
| --- | --- | --- |

## Task-Type Approval Guardrails

Each task must route to the guardrail reference that matches its task type.
Load only the matching reference when preparing the task.

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |

Allowed approval statuses:

- `approved`
- `blocked`

Every task has a task type, so every task must route to a matching guardrail.
Queued tasks must be `approved`.

Guardrail references live under:

- `.codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/`

## Task Guardrail Evidence

Use the exact required check IDs from the matching task-type guardrail
reference. This section turns task-type approval into structured evidence
rather than a single prose assertion.

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |

Allowed statuses:

- `pass`
- `not-applicable: <reason>`
- `blocked`

Queued tasks must have every required check ID for their task type marked
`pass` or `not-applicable: <reason>`. Unknown check IDs are blocked unless a
future template revision explicitly allows extensions.

## Code Placement And Extraction Review

Use this section to decide whether code belongs in a feature, a platform seam,
`src/lib`, or should remain behind an owning feature's public seam.

Allowed placement decisions:

- `feature-local`
- `DEV:platform-seam`
- `shared-lib`
- `stay-put`
- `blocked`

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

Allowed extraction values:

- `yes`
- `no`

Rules:

- queued implementation tasks must have an approved placement row
- `shared-lib` requires evidence that the logic is generic, has no
  feature-specific contract/domain/persistence dependency, and preserves
  existing consumers
- extraction `yes` requires a separate `DECISION:refactor-first` or `DEV:platform-seam`
  task and a `Task Dependencies` row that blocks the dependent task from
  queueing until extraction completes
- `shared-lib`, `stay-put`, and extraction `yes` require
  `shared-code-placement-task-guardrail.md` in the supplemental guardrail
  references
- feature-owned reusable logic should normally stay behind the owning feature's
  public seam instead of moving to `src/lib`

## Allowed Write Set Classification

Classify each allowed write path or path pattern so Delivery can later compare
the actual diff against the approved implementation envelope.

Allowed write classes:

- `feature-local`
- `DEV:platform-seam`
- `test`
- `DOC:docs-artifact`
- `generated-artifact`
- `config-script`
- `blocked`

| Task ID | Path Pattern | Write Class | Reason |
| --- | --- | --- | --- |

Queued tasks must not include `blocked` write classes.

## Forbidden Work

Convert non-goals into explicit forbidden work so opportunistic rewrites are
easier to catch during Delivery.

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered | Coverage Notes |
| --- | --- | --- |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status | Notes |
| --- | --- | --- | --- |

Allowed capability coverage statuses:

- `approved`
- `not-capability-backed`
- `blocked-missing-row`

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |

Use `not-applicable: <reason>` when a task has no shared seam. Do not leave the
field blank.

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |

Use `not-applicable: <reason>` only for task types that truly touch no
source-independent or maintained artifacts.

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

Allowed blocker types:

- `DECISION:refactor-first`
- `DECISION:architecture-foundation`
- `design-system-foundation`
- `asset-decision`
- `permission-model`
- `capability-matrix`
- `artifact-drift`
- `shared-seam-ownership`
- `runtime-evidence`

Refactor-first and DECISION:architecture-foundation blockers must be split into their
own tasks. Do not hide them inside feature work.

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |

Allowed handoff statuses:

- `queued-for-delivery`
- `blocked`
- `draft`
- `superseded`

Only `queued-for-delivery` tasks may enter Layer 5 Delivery. A task with
remaining blockers must not be queued.
