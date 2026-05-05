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
- `GOV:standards-update`
- `GOV:architecture-update`
- `DEV:platform-seam`
- `DEV:migration-persistence`
- `GOV:design-system`
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

For `DEV:frontend`, `GOV:design-system`, and frontend-affecting `DEV:vertical-slice` tasks,
copy the relevant Layer 2 DEV:frontend architecture decisions. Layer 4 packages and
enforces these decisions; it must not invent route family, product module,
journey group, topology, locator, authority, state, shell, GOV:design-system
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

## Frontend Change Class Contract

Required for queued `DEV:frontend` tasks. Leave empty when no `DEV:frontend`
task is queued.

Allowed change classes:

- `app-adoption`
- `route-module-behavior`
- `interaction-behavior`
- `permission-rendering`
- `api-projection-consumer`
- `topology-materialization-consumer`
- `runtime-defect-fix`
- `accessibility-semantics`
- `visual-rendering`
- `evidence-sweep-route-away`

Class expectations:

- `app-adoption` must consume a signed-off `GOV:design-system` seam or record
  an approved exception, fill the Frontend Adoption Contract, and prohibit
  local markup, controller, ARIA/state, or CSS reconstruction.
- `route-module-behavior` must use approved module/journey files and must not
  add behavior to shell entry files.
- `interaction-behavior` must name the exact state transition or interaction
  scenario and matching proof.
- `permission-rendering` must carry permission truth and permission-aware
  rendering proof.
- `api-projection-consumer` must name the governing API/projection contract,
  fixture source, live/runtime payload evidence or explicit unavailable
  reason, and mock-honesty statement.
- `topology-materialization-consumer` must use the approved topology
  materialization, preview, or apply seam and must not hand-edit generated
  truth.
- `runtime-defect-fix` must carry live process, served asset or module,
  runtime payload, and regression proof. Source-only proof is not enough.
- `accessibility-semantics` must carry role, name, state, and focus proof.
- `visual-rendering` must carry rendered browser/canonical screenshot or
  visual evidence.
- `evidence-sweep-route-away` blocks `DEV:frontend`; route evidence-only
  screenshot capture, live payload sampling, served asset checks, or
  mock-honesty comparison to `EVIDENCE:qa-evidence`.

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |

## Frontend / Design-System Sub-Standard

For `DEV:frontend`, `GOV:design-system`, and frontend-affecting `DEV:vertical-slice` tasks,
name the primary sub-standard. Complex DEV:frontend or GOV:design-system work must
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

For queued `DEV:frontend`, `GOV:design-system`, and frontend-facing `DEV:vertical-slice`
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

## Design-System Seam Class Contract

Queued `GOV:design-system` tasks must classify the governed seam class they
produce, refine, or prove. This is separate from the frontend/design-system
sub-standard: the sub-standard names the primary proof focus, while this table
names the downstream-consumable seam shape and contamination boundary.

Allowed seam classes:

- `render-structure-seam`
- `behavior-controller-seam`
- `accessibility-semantics-seam`
- `style-css-seam`
- `fixture-data-contract`
- `canonical-evidence-update`

| Task ID | Design-System Seam Class | Class-Specific Required Proof | Downstream Consumption Boundary | Forbidden App / Evidence / Standards Work |
| --- | --- | --- | --- | --- |

## Frontend Adoption Contract

Queued `DEV:frontend` tasks with Design-System Seam Contract posture
`consumes-existing-seam` must record the exact adoption contract. Layer 4 must
make the consumer boundary deterministic: the app may compose and bind data
around signed-off GOV:design-system seams, but must not reconstruct governed
markup, controller behavior, ARIA/state semantics, or CSS locally.

Use concrete `not-applicable:` rationale when a seam type genuinely does not
apply, such as a static render seam with no behavior/controller seam.

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Security Evidence

For `DEV:frontend`, `GOV:design-system`, and frontend-affecting `DEV:vertical-slice` tasks,
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

Frontend, GOV:design-system, and frontend-facing DEV:vertical-slice tasks that render
privileged, tenant, user, role, asset, lifecycle, or otherwise sensitive data
must carry permission-aware rendering proof notes. Tenant-scoped rendering must
include cross-tenant denial proof.

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |

## Frontend Runtime Data And Mock Honesty

Frontend, GOV:design-system, and frontend-facing DEV:vertical-slice tasks that render
API or projection data must tie rendered proof to the governing contract and a
live/runtime payload, or explain why runtime payload evidence is unavailable.
Rendered proof that uses only mocks without a contract/runtime tie blocks.

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |

## Vertical Slice Coupling

Queued `DEV:vertical-slice` tasks must prove why DEV:backend and DEV:frontend work are
inseparable for exactly one journey behavior. Backend and frontend work should
split by default; use a vertical slice only when one user-visible journey's main
proof risk is the backend-to-frontend browser seam itself and one proof story
must cross API/data/browser boundaries together. Split work into
DEV:backend, DEV:frontend, GOV:design-system, DEV:migration-persistence, TEST:test-only,
TEST:test-suite-alignment, or EVIDENCE:qa-evidence tasks when those concerns can be
delivered and proven separately.

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Vertical Slice Split Pressure

Required for queued `DEV:vertical-slice` tasks. Leave empty when no
`DEV:vertical-slice` task is queued.

Allowed concerns:

- `backend-behavior`
- `frontend-behavior`
- `api-data-contract`
- `design-system-seam`
- `permission-truth`
- `migration-persistence`
- `executable-proof`
- `qa-evidence`

Allowed split decisions:

- `inseparable-in-slice`
- `approved-preexisting`
- `split-before-delivery`
- `not-applicable`
- `blocked`

Queued vertical slices must not use `blocked` or `split-before-delivery`.
Backend behavior, frontend behavior, and API/data contract pressure must be
recorded as either `inseparable-in-slice` or `approved-preexisting`, with the
coupling rationale explaining why separate proof would be dishonest.

| Task ID | Concern | Split Decision | Coupling / Not-Applicable Rationale | Owning Task If Split |
| --- | --- | --- | --- | --- |

## Platform Seam Contract

Required for `DEV:platform-seam` tasks. Leave empty when no
`DEV:platform-seam` task is queued.

Allowed seam kinds:

- `router-route-mounting`
- `middleware-auth-request-context`
- `scheduler-job-runtime`
- `bootstrap-runtime`
- `generated-artifact-materialization`
- `tooling-harness`
- `shared-runtime-helper`
- `cross-feature-seam-infrastructure`

Allowed compatibility modes:

- `no-behavior-change`
- `additive-compatible`
- `dual-path-rollout`
- `compatibility-sensitive-blocked`

Use `DEV:platform-seam` only for implementation changes to shared platform,
runtime, tooling, generated-artifact, materialization, bootstrap, middleware,
router, scheduler, or harness seams. Feature-local behavior, API contract
truth, permission mapping, migrations, architecture authority, standards
authority, and evidence sweeps must split to their owning task types.

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Location | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Platform Seam Class Contract

Queued `DEV:platform-seam` tasks must also record class-specific expectations
for the selected seam kind. The platform seam class must match the Platform
Seam Contract `Seam Kind`. This prevents shared platform tasks from using a
generic compatibility row while skipping the proof shape expected for router,
middleware, scheduler, bootstrap, generated-artifact, tooling, runtime-helper,
or cross-feature seam work.

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |

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

Allowed backend change classes:

- `domain-behavior`
- `contract-schema`
- `transport-route`
- `repository-consumer`
- `persistence-adapter`
- `feature-wiring`
- `integration-dependency`
- `manifest-public-seam`
- `authz-enforcement`
- `lifecycle-behavior`
- `audit-event`
- `error-resilience`
- `transaction-consistency`
- `projection-read-model`
- `background-job-handler`
- `observability-event`

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

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

## Migration / Persistence Class Contract

Queued `DEV:migration-persistence` tasks must also record class-specific
expectations for the selected persistence change. The migration/persistence
class must match the `Migration / Persistence Approach` change type. This keeps
schema, index, repository, normalization, data migration, corrective migration,
and Postgres harness work from sharing one generic proof shape.

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |

## Tight Allowed Write Envelope

Prefer exact files over broad directories. Broad DEV:frontend or GOV:design-system
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

## Refactor-First Contract

Required for `DECISION:refactor-first` tasks. Leave empty when no
`DECISION:refactor-first` task is queued.

Allowed triggers:

- `over-broad-write-set`
- `shared-logic-before-behavior`
- `unreliable-proof-seam`
- `duplicated-equivalent-behavior`
- `wrong-owner-or-layer`
- `decision-guess-risk`
- `extraction-before-reuse`
- `test-seam-needed`

Allowed refactor types:

- `extract`
- `move`
- `rename-clarify`
- `decompose`
- `consolidate`
- `adapter-compatibility`
- `test-seam`
- `performance-preserving`

Allowed routing check values:

- `stays-refactor-first`
- `blocked-route-to-DEV:platform-seam`
- `blocked-route-to-GOV:architecture-update`
- `blocked-route-to-GOV:standards-update`
- `blocked-route-to-DOC:api-contract`
- `blocked-route-to-DEV:migration-persistence`
- `blocked-route-to-DOC:permission-mapping`
- `blocked-route-to-GOV:design-system`

| Task ID | Refactor Trigger | Refactor Type | Unchanged Behavior | Affected Consumers | Downstream Task Unblocked | Compatibility Proof | Routing Check | Forbidden Behavior / Authority Change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Foundation Contract

Required for `DECISION:architecture-foundation` tasks. Leave empty when no
`DECISION:architecture-foundation` task is queued.

Allowed concern areas:

- `ownership-boundary`
- `integration-boundary`
- `security-privacy-boundary`
- `authorization-boundary`
- `persistence-data-model`
- `data-governance-compliance`
- `frontend-architecture-boundary`
- `design-system-architecture-boundary`
- `scalability-performance`
- `resilience-consistency`
- `observability-operability`
- `deployment-runtime-topology`
- `dependency-selection`
- `migration-rollout-strategy`
- `testing-strategy-architecture`

Allowed triggers:

- `owner-boundary`
- `platform-vs-feature`
- `authz-boundary`
- `persistence-model`
- `topology-authority`
- `lifecycle-cleanup`
- `shared-seam-authority`
- `compatibility-strategy`
- `architecture-source-gap`

Allowed final authority routes:

- `existing-architecture-source`
- `Layer-2-technical-steering`
- `ADR-required`
- `GOV:architecture-update`
- `GOV:standards-update`
- `blocked-human-decision`

Allowed decision analysis statuses:

- `approved-source-exists`
- `missing-layer-2-analysis`
- `incomplete-layer-2-analysis`
- `adr-required`
- `blocked-human-decision`

| Task ID | Concern Area | Architecture Trigger | Architecture Question | Decision Analysis Status | Decision Provenance Source | Missing Analysis Fields | Sources To Review | Decision Owner | Output Artifact Target | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Forbidden Implementation / Guess |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Architecture Update Contract

Required for `GOV:architecture-update` tasks. Leave empty when no
`GOV:architecture-update` task is queued.

Allowed approved decision sources:

- `Layer-2-technical-steering`
- `ADR`
- `existing-architecture-source`
- `approved-architecture-foundation-output`
- `explicit-recorded-human-approval`

| Task ID | Approved Decision Source | Decision Source Path / Reference | Decision Summary | Architecture Artifact Target | Consistency Sweep Targets | Downstream Impact | Compatibility Posture | Forbidden Implementation / Standards Work | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Docs Artifact Contract

Required for `DOC:docs-artifact` tasks. Leave empty when no
`DOC:docs-artifact` task is queued.

Allowed artifact families:

- `feature-doc`
- `readme`
- `runbook`
- `workspace-status`
- `implementation-blueprint-status`
- `generated-artifact-summary`
- `maintained-artifact-sweep`
- `ordinary-doc-sync`

Allowed docs artifact classes:

- `feature-doc-refresh`
- `readme-index-sync`
- `runbook-update`
- `implementation-status-note`
- `workspace-summary-artifact`
- `stale-artifact-sweep`
- `template-or-example-sync`

`DOC:docs-artifact` is the residual docs-sync lane. Route API contracts, data
dictionaries, permission mappings, standards/compliance artifacts, governance
authority, design-system signoff/seams, QA evidence, and test-suite alignment
to their specialized task types.

For script-first execution, record concrete source paths, globs, generated
artifact paths, or command output that can be inspected mechanically. The
`Diff / Check Command` should be executable whenever possible; use an explicit
manual-review rationale only when the docs change depends on human judgment.

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Compliance Contract

Required for `DOC:standards-compliance` tasks. Leave empty when no
`DOC:standards-compliance` task is queued.

Allowed compliance target types:

- `repo-standard-gate`
- `external-standard-control-map`
- `platform-status-snapshot`
- `task-slice-gate-review`
- `waiver-or-blocker-review`

Allowed compliance postures:

- `pass`
- `partial`
- `fail`
- `not-assessed`
- `not-applicable`
- `blocked`
- `waived-with-approval`

External control maps should live under `docs/standards/control-maps/` and
must link adopted external requirements to repo enforcement, tests, evidence,
and decision sources without duplicating the external standard text.

For external control maps, record repo evidence, enforcement surfaces, tests,
decision sources, and gaps without copying external standard text. Keep
human review limited to applicability, compliance judgment, and waiver/blocker
interpretation.

| Task ID | Compliance Target Type | Standard / Gate | Source Standard Path / Reference | Scope Under Review | Control / Evidence Inventory | Review Method / Command | Compliance Posture | Evidence Artifact Target | Coverage Summary Command | Findings Summary | Follow-Up Routing | Human Review Boundary | Waiver / Blocker Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Standards Update Contract

Required for `GOV:standards-update` tasks. Leave empty when no
`GOV:standards-update` task is queued.

Allowed approved standards change sources:

- `Layer-2-technical-steering`
- `standards-compliance-audit`
- `issue-reconciliation`
- `escaped-defect-reconciliation`
- `harness-retrospective`
- `existing-standards-contradiction`
- `explicit-recorded-human-approval`

Allowed enforcement postures:

- `validator-or-gate-enforced-now`
- `template-required-now`
- `script-reported-debt`
- `advisory-with-approved-debt-route`

Allowed standards update classes:

- `enforced-now`
- `template-required`
- `script-reported-debt`
- `advisory-approved-debt`
- `artifact-invalidation-sweep`

Class and enforcement posture must match. Record which existing packets,
templates, validators, generated artifacts, status snapshots, or examples are
invalidated or reviewed by the new standard, even when the answer is
`not-applicable` with rationale.

| Task ID | Standards Update Class | Approved Standards Change Source | Source Path / Reference | Standards Change Summary | Standards Artifact Target | Affected Surfaces / Consistency Sweep | Artifact Invalidation Sweep | Enforcement Posture | Compatibility / Rollout Posture | Debt Route If Not Enforced Now | Forbidden Implementation / Architecture / Compliance Work | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Permission Mapping Contract

Required for `DOC:permission-mapping` tasks. Leave empty when no
`DOC:permission-mapping` task is queued.

Allowed grant source postures:

- `documentation-only`
- `seed-backed`
- `corrective-migration-backed`
- `runtime-enforced`
- `blocked`

Allowed mapping row postures:

- `current`
- `target`
- `architecture-target`
- `blocked`

`DOC:permission-mapping` records permission truth only. Runtime enforcement,
grant migrations, API denial contract changes, executable proof, and authz
model changes must split to the owning task type.

Until Layer 2 approves configuration-based and relationship-based
authorization, any configuration-based, relationship-based, ABAC, or ReBAC row
must be `architecture-target` or `blocked`, UI-ineligible, and routed to
`GOV:architecture-update`.

| Task ID | Approved Authz Source | Capability / Route / Surface | Authority World / Actor Boundary | Grant Source Posture | Mapping Row Posture | Tenant / Object Boundary | Allow / Deny Expectations | UI Eligibility | Denial / Audit / Proof Expectation | Migration Impact | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## API Contract

Required for `DOC:api-contract` tasks. Leave empty when no `DOC:api-contract`
task is queued.

Allowed compatibility postures:

- `no-wire-change`
- `additive`
- `compatibility-sensitive`
- `blocked-pending-migration-or-approval`

Allowed maintained artifact postures:

- `docs-api-contract-only`
- `openapi-maintained`
- `postman-maintained`
- `openapi-and-postman-maintained`
- `generated-docs-maintained`
- `not-maintained-with-rationale`

`DOC:api-contract` records API-facing contract truth only. Runtime route
implementation, transport schemas, domain behavior, persistence, permission
mapping, migrations, and executable tests must split to the owning task type.

| Task ID | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Split / Blocked Follow-Up | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Data Dictionary Contract

Required for `DOC:data-dictionary` tasks. Leave empty when no
`DOC:data-dictionary` task is queued.

Allowed compatibility postures:

- `docs-only-alignment`
- `no-schema-change`
- `additive`
- `compatibility-sensitive`
- `blocked-pending-migration-or-approval`

Allowed enforcement trace postures:

- `schema-enforced`
- `code-enforced`
- `test-enforced`
- `artifact-documented`
- `manual-review`
- `planned-work`
- `blocked`
- `not-applicable`

`DOC:data-dictionary` records durable data truth only. Schema changes,
migrations, repository/query behavior, domain normalization, API-visible data
shape changes, permission mapping, standards authority changes, compliance
assessment, and executable proof must split to the owning task type.

The standards/control trace should name applicable repo rules or adopted
external controls and whether they are enforced, evidenced, planned, blocked,
or not applicable for this data fact group. Enforcement evidence should point
to concrete code, schema, maintained artifact, command, or test-case evidence
instead of only saying "reviewed."

| Task ID | Entity / Table / Fact Group | Dictionary Artifact Target | Source Truth Reviewed | Field / Index / Lifecycle Truth | Durable Fact / Retention Truth | Classification / Compliance Posture | Standards / Control Trace | Enforcement Trace | Enforcement Evidence | Test / Evidence Trace | Compatibility Posture | Split / Blocked Follow-Up | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test-Only Coverage Contract

Queued `TEST:test-only` tasks must say exactly what kind of test work they perform.
Use this task type for PRD-derived `TC-*` implementation, isolated proof-gap
tests, security/permutation matrix tests, or e2e journey tests. Do not use it
when production behavior must change.

Allowed test change classes:

- `prd-test-case`
- `proof-gap`
- `permission-state-matrix`
- `security-boundary`
- `e2e-journey`
- `regression-lock`
- `fixture-honesty`

Allowed production behavior change postures:

- `no-production-change`
- `test-harness-only`
- `blocked-production-change-required`

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

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

## QA Evidence Instrument Summary

Use this section for `EVIDENCE:qa-evidence` tasks. It records which deterministic
and contextual evidence instruments the task will use and what remains unproven.
Scripts are instruments inside the evidence task; they do not replace the
task-specific proof story.

| Task ID | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Evidence Status / Remaining Gap |
| --- | --- | --- | --- | --- |

For non-`EVIDENCE:qa-evidence` tasks, use `not-applicable: <reason>`.

## Debt Health Summary Commands

Use this section for summary commands that expose residual debt after the
focused proof commands have done their job. These summaries do not replace
task-specific proof. They help Delivery decide whether debt was resolved,
split, accepted with owner, or deferred.

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

Allowed summary result values:

- `pass`
- `debt-found`
- `blocked`
- `not-run: <reason>`

Allowed debt dispositions:

- `none`
- `in-scope-resolved`
- `split-follow-up`
- `accepted-deferred`
- `blocked`
- `not-applicable: <reason>`

`DOC:data-dictionary` tasks should normally include
`npm run data:compliance-health`. `TEST:test-only`,
`TEST:test-suite-alignment`, and `EVIDENCE:qa-evidence` tasks should include a
`npm run test:coverage-strength` summary row. `EVIDENCE:qa-evidence` tasks may
also include `npm run qa:evidence-summary -- <task-packet-path>` after their
instrument summary is filled. Use `not-run: <reason>` only when the summary is
genuinely unavailable or not applicable to the scoped proof. These commands
summarize debt; they do not prove the task behavior by themselves.

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
