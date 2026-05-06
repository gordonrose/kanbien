# Story Breakdown: Loop Observability And KPI Foundation

## Status

- Packet status:
  blocked
- Packet date:
  2026-05-03
- Epic ID:
  EPIC-LOOP-OBSERVABILITY-KPI-FOUNDATION
- Epic title:
  Loop observability and KPI foundation
- Source Product Discovery packet:
  docs/workspace/product-discovery/2026-05-03-loop-observability-kpi-foundation.md
- Source Technical Steering packet:
  docs/workspace/technical-steering/2026-05-03-loop-observability-kpi-foundation-steering.md
- Related PRD:
  docs/prd/2026-05-02-0023-loop-observability-and-kpi-foundation.md
- Related capability matrix:
  not created yet
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  ADR required by Technical Steering before implementation blueprint signoff;
  GOV:design-system deferred for future UI; asset artifacts not applicable.
- Validation command:
  npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-03-loop-observability-kpi-foundation-story-breakdown.md
- Validation status:
  not-run

## Handoff Validation

- Product Discovery status:
  discovery-only
- Technical Steering status:
  blocked
- Steering non-goals preserved:
  no customer-facing loop evidence, no tenant-facing visibility, no generic
  project management behavior, no automatic root-cause proof, no UI in v0, no
  OLAP implementation before durable capture and read models exist.
- Steering stop conditions resolved or carried as blockers:
  Product Discovery human refresh/signoff gate is unresolved. ADR, PRD
  reconciliation, capability matrix, PRD-derived test cases, and
  implementation blueprint remain blocking control stories after the human
  gate is resolved. API contracts, data dictionary, permission mapping, feature
  manifest, and dependency graph updates are delivery-time blockers for
  exposed routes and source changes.
- Architecture invention check:
  consumes-steering-only
- Governed DEV:frontend seam posture:
  not-applicable
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  root/internal authorization, privileged helper posture, event payload
  redaction, persistence migrations, append-only evidence, scorecard rubric
  versioning, data retention, and operational evidence must be covered before
  implementation completion.
- Missing source-of-truth artifacts:
  Product Discovery human refresh/signoff decision, ADR, reconciled PRD,
  capability matrix, implementation blueprint, PRD-derived test cases, API
  contract docs, data dictionary, permission mapping, feature manifest, and
  generated dependency graph plan.

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-LOOP-001 | Durable loop evidence domain | feature-local | src/features/loopObservability | approved | DEV:migration-persistence |
| TS-LOOP-002 | Harness recording helper | platform-seam | platform/harness helper consuming loopObservability public seam | approved | DEV:platform-seam |
| TS-LOOP-003 | Scorecard projection | feature-public-seam | loopObservability domain/read model | approved | EVIDENCE:qa-evidence |
| TS-LOOP-004 | Git/PR changed artifact ingestion | platform-seam | harness/GitHub ingestion adapter feeding loopObservability | approved | DEV:platform-seam |
| TS-LOOP-005 | Internal/root APIs | feature-public-seam | loopObservability/transport | approved | DOC:api-contract |
| TS-LOOP-006 | Root/internal permission posture | feature-local | loopObservability protected route policy | approved | DOC:permission-mapping |
| TS-LOOP-007 | Durable entity dictionary | feature-local | loopObservability data dictionary | approved | DOC:data-dictionary |
| TS-LOOP-008 | Artifact and standards documentation | feature-local | loopObservability maintained artifacts | approved | DOC:docs-artifact |
| TS-LOOP-009 | Reusable rubric/classification pressure | shared-lib-candidate | loopObservability domain first, shared-lib only after second consumer | deferred-with-owner | DECISION:refactor-first |
| TS-LOOP-010 | Future root/internal UI | design-system-seam | design-system plus future root/internal app adoption | deferred-with-owner | GOV:design-system |
| TS-LOOP-011 | OLAP export | platform-seam | derived export through transactional outbox/job-processing seam | deferred-with-owner | DEV:platform-seam |
| TS-LOOP-012 | Architecture decision record | architecture-foundation-required | ADR for loop observability/evidence foundation | approved | DECISION:architecture-foundation |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V0 durable capture and APIs | not-applicable | loopObservability | evidence capture | not-applicable | support/operator | not-applicable | not-applicable | not-topology | none | not applicable | not applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | ready | No rendered frontend in v0. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | no | No browser surface in v0. | not applicable | no |
| csp-assets | no | No served frontend assets in v0. | not applicable | no |
| privileged-helper | yes | Harness helper may record evidence through an internal seam. | Helper must avoid storing secrets and session material and use approved root/internal authority. | yes |
| csrf-mutation | no | No browser mutation route in v0. If HTTP routes are exposed later, standard root/internal API protections apply. | API security story if route is browser-callable. | no |
| url-replay-state | no | No replay links in v0. | not applicable | no |
| sensitive-rendering | no | UI deferred. Future UI must redact sensitive event payloads. | future UI security review. | no |
| asset-delivery | no | No user-managed assets. | not applicable | no |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-001 | ADR foundation | yes | Technical Steering requires an ADR before implementation blueprint signoff. | DECISION:architecture-foundation |
| S-001 | PRD reconciliation | yes | PRD proposal predates Technical Steering decisions and must be aligned. | DOC:docs-artifact |
| S-002 | Capability matrix control | yes | No capability matrix exists for loop observability. | DOC:docs-artifact |
| S-003 | PRD-derived test cases | yes | Story acceptance criteria need TC coverage before delivery. | TEST:test-only |
| S-004 | Implementation blueprint | yes | Delivery needs an approved build plan after ADR, PRD, matrix, and test cases. | DOC:docs-artifact |
| S-005 | Durable persistence | yes | Loop runs, tasks, events, metrics, change sets, and artifacts require tables and lifecycle rules. | DEV:migration-persistence |
| S-005 | Backend feature bundle | yes | loopObservability owns durable evidence. | DEV:backend |
| S-006 | Scorecard read model | yes | Closure confidence must derive from persisted evidence. | DEV:backend |
| S-006 | QA evidence | yes | Scorecard projection needs proof for complete, blocked, and partially verified loops. | EVIDENCE:qa-evidence |
| S-007 | Regression traceability | yes | Defects need suspected and confirmed cause links. | DEV:backend |
| S-008 | Harness helper | yes | Harness opens/closes loops and appends evidence through feature seam. | DEV:platform-seam |
| S-009 | Internal API contract | yes | Root/internal route contracts are expected after permission mapping. | DOC:api-contract |
| S-009 | Permission mapping | yes | V0 routes and helpers require root/internal access policy. | DOC:permission-mapping |
| S-010 | Data dictionary | yes | New durable entities require source-independent field truth. | DOC:data-dictionary |
| S-010 | Maintained artifact sweep | yes | Feature manifest and dependency graph will change during implementation. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Internal maintainers need each material loop to produce durable evidence,
  scorecard KPIs, artifact traceability, and improvement signals so they can
  trust loop completion and reduce future rework.
- Epic outcome:
  The platform has a planned loopObservability foundation with a staged path
  from capture to scorecards, traceability, APIs, future UI, and future OLAP.
- Epic actors:
  maintainer, harness/Codex agent, root/internal operator, future CI/GitHub
  actor, future export worker.
- Epic non-goals:
  customer-facing reporting, generic project management, full analytics
  dashboard, automatic standards mutation, automatic root-cause proof, UI v0,
  OLAP v0.
- Epic dependency summary:
  New loopObservability feature bundle, platform/harness helper seam, git/PR
  metadata, future root/internal authz mapping, future job/outbox export seam.
- Epic-level proof target:
  mixed

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | blocked | harness-value | DOC:docs-artifact | Product Discovery human gate repair | This is needed to confirm whether the existing discovery notes are reliable enough before using them for planning. | As the delivery harness, I need the requester to confirm prior context is enough or choose to re-run Product Discovery before downstream artifacts are promoted. | harness | The product packet can be honestly promoted or revised. | none |
| S-001 | blocked | system-value | DECISION:architecture-foundation | ADR and PRD reconciliation | This is needed to make sure the long-term decision and the product plan describe the same version of loop evidence. | As architecture governance, I need the enduring loop evidence decision and PRD proposal aligned so downstream planning starts from one source of truth. | architecture governance | ADR exists and PRD reflects Technical Steering decisions. | S-000 |
| S-002 | blocked | harness-value | DOC:docs-artifact | Capability matrix control | This is needed to break down what loop evidence needs to capture into individual capabilities, so we can plan the implementation more accurately. | As the delivery harness, I need approved capability rows for every loop observability behavior before implementation tasks are cut. | harness | Capability matrix covers capture, scorecard, traceability, helper, API, and governance criteria. | S-000 and S-001 |
| S-003 | blocked | harness-value | TEST:test-only | PRD-derived test case planning | This is needed to decide what evidence will prove the loop record is trustworthy before building the record. | As QA governance, I need TC obligations for loop evidence behavior before delivery tasks. | QA governance | Test-case packet covers persistence, API, helper, scorecard, and traceability behavior. | S-001 and S-002 |
| S-004 | blocked | system-value | DOC:docs-artifact | Implementation blueprint | This is needed to turn the approved direction into an ordered build plan before implementation starts. | As implementation governance, I need a build plan that sequences feature bundle, persistence, APIs, helper, artifacts, and proof. | implementation governance | Blueprint is ready for task breakdown. | S-001, S-002, and S-003 |
| S-005 | needs-capability-matrix | system-value | DEV:backend | Durable capture foundation | This is its own story because one completed work loop needs a trustworthy record before scorecards or later reviews can mean anything. | As the harness, I need loop runs, tasks, events, metrics, change sets, and changed artifacts persisted through a feature seam. | harness/system actor | One loop can be captured durably from open to closure. | S-002 through S-004 |
| S-006 | needs-capability-matrix | user-value | DEV:backend | Closure scorecard projection | This is its own story because maintainers need a readable summary of completion confidence before digging into details. | As a maintainer, I need a scorecard that shows measured, assessed, improvement, standards, and deferral evidence. | maintainer | Closure confidence is derived from persisted records. | S-005 |
| S-007 | needs-capability-matrix | user-value | DEV:backend | Defect and regression traceability | This is its own story because later problems should be connectable to the work that may have caused or prevented them. | As a root/internal operator, I need later defects linked to suspected and confirmed causing loop evidence. | root/internal operator | Issue investigation can trace loop, task, change set, and artifact. | S-005 and S-006 |
| S-008 | needs-capability-matrix | harness-value | DEV:backend | Harness recording and artifact ingestion helper | This is needed so evidence can be recorded consistently during normal work, instead of each workflow inventing its own recording steps. | As the harness, I need helpers that record evidence and ingest changed artifacts without direct SQL. | harness/system actor | Harness can record loop evidence through the feature public seam. | S-005 |
| S-009 | needs-capability-matrix | system-value | DEV:backend | Internal/root API read and write seams | This is needed so trusted tools have stable ways to add and review loop evidence. | As internal tooling, I need stable routes for loop capture, scorecards, and traceability reads. | internal/root API consumer | API reads and writes follow repo route, validation, authz, pagination, and sorting defaults. | S-005 through S-008 |
| S-010 | blocked | harness-value | DOC:standards-compliance | Maintained artifact conformance | This is needed to keep the written rules, examples, and tests aligned with the recorded loop evidence before the feature is treated as ready. | As repo governance, I need docs, contracts, feature manifest, data dictionary, permission mapping, and generated graph artifacts aligned. | repo governance | The feature loop can close without stale source-independent artifacts. | S-001 through S-009 |
| S-011 | blocked | user-value | GOV:design-system | Future loop review UI governance | This is needed to keep a future review screen separate from the first version, which is only about recording and reading loop evidence. | As a maintainer, I need future scorecard and trace views to use governed design-system seams. | future frontend governance | UI work remains blocked until capture/read model and design-system posture exist. | Future scope only |
| S-012 | blocked | system-value | DOC:docs-artifact | Future OLAP export foundation | This is its own story because analytics exports are a later reporting concern and should not complicate the first evidence record. | As analytics tooling, I need exported loop facts to be derived, idempotent, and retryable. | future export worker | OLAP export remains derived from app-owned persistent truth. | Future scope only |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | Product Discovery packet records that prior context is available but human refresh/signoff is required before promotion. | source-level | docs alignment review | Product Discovery packet |
| AC-S000-02 | S-000 | Requester either confirms the prior-context summary is accurate enough to proceed or requests a renewed Product Discovery interview. | source-level | human signoff review | Product Discovery packet |
| AC-S001-01 | S-001 | ADR states that loopObservability owns durable loop evidence while platform helpers consume its public seam. | source-level | architecture review | ADR |
| AC-S001-02 | S-001 | PRD proposal records Technical Steering decisions, v0 scope, deferred UI and OLAP posture, and required artifact chain. | source-level | docs alignment review | PRD proposal |
| AC-S002-01 | S-002 | Capability matrix covers loop run, task, event, metric, change set, changed artifact, scorecard, defect, regression, improvement, helper, and API capabilities. | contract-level | capability traceability review | capability matrix |
| AC-S002-02 | S-002 | Every story acceptance criterion maps to a capability row or a non-capability governance rationale. | contract-level | capability traceability review | capability matrix |
| AC-S003-01 | S-003 | Test-case packet records persistence, validation, lifecycle, append-only, projection, authz, helper, API, and traceability test obligations. | contract-level | TC planning review | PRD-derived test cases |
| AC-S004-01 | S-004 | Implementation blueprint sequences feature scaffold, migrations, domain, transport, helper, tests, and artifacts without starting UI or OLAP. | source-level | blueprint review | implementation blueprint |
| AC-S005-01 | S-005 | Capture foundation persists loop run, task, event, metric snapshot, change set, and changed artifact records with system-managed fields. | persistence-level | persistence integration; validation; lifecycle | data dictionary; migration plan |
| AC-S005-02 | S-005 | Events and metric snapshots are append-only and corrections are represented as new evidence records rather than silent overwrites. | persistence-level | lifecycle; audit; regression | data dictionary; test cases |
| AC-S006-01 | S-006 | Scorecard read model distinguishes measured, assessed, and improvement KPIs and includes standards maintenance plus explicit deferrals. | contract-level | projection; rubric; contract | PRD; capability matrix; API contract |
| AC-S006-02 | S-006 | Scorecard behavior covers complete, blocked, reopened, and partially verified loop states. | persistence-level | state matrix; projection; regression | test cases |
| AC-S007-01 | S-007 | Defect records classify layer, severity, status, and detected time. | persistence-level | persistence; validation | data dictionary; test cases |
| AC-S007-02 | S-007 | Regression traces keep suspected and confirmed causing loop, task, change set, and artifact links separate. | persistence-level | lifecycle; regression | data dictionary; test cases |
| AC-S008-01 | S-008 | Harness helper opens loops, updates tasks, appends events and metrics, and closes loops through the feature public seam. | mixed | helper integration; contract; persistence | implementation blueprint; test cases |
| AC-S008-02 | S-008 | Changed artifacts are derived from git or PR metadata before harness enrichment. | source-level | classifier; fixture; integration | implementation blueprint |
| AC-S009-01 | S-009 | Internal/root APIs reject client-supplied system-managed fields and follow pagination, sorting, timestamp, and exact route param defaults. | runtime-api | API contract; validation; authz | API contract; permission mapping |
| AC-S009-02 | S-009 | Scorecard and artifact-trace reads return stable shapes for future UI and tooling without requiring OLAP. | runtime-api | API integration; projection | API contract; test cases |
| AC-S010-01 | S-010 | Data dictionary, permission mapping, API contracts, feature manifest, and generated dependency graph are aligned with implemented seams. | source-level | artifact sweep; generated artifact verification | data dictionary; permission mapping; feature manifest; generated graph |
| AC-S011-01 | S-011 | Future UI remains blocked until a design-system scorecard/timeline/trace posture is approved. | source-level | design-system governance review | future GOV:design-system artifact |
| AC-S012-01 | S-012 | Future OLAP export remains blocked until app-owned capture/read model stabilizes and export mechanism is selected. | source-level | architecture review | future export artifact |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | Product Discovery human gate | planning | not-capability-backed | Gate repair criterion. |
| S-000 | AC-S000-02 | Product Discovery human gate | planning | not-capability-backed | Human signoff criterion. |
| S-001 | AC-S001-01 | Loop observability architecture foundation | architecture | not-capability-backed | ADR governance criterion. |
| S-001 | AC-S001-02 | PRD reconciliation | planning | not-capability-backed | Docs alignment criterion. |
| S-002 | AC-S002-01 | Capability matrix control rows | planning | create-or-refresh-required | Matrix does not exist yet. |
| S-002 | AC-S002-02 | Capability matrix traceability rows | planning | create-or-refresh-required | Matrix does not exist yet. |
| S-003 | AC-S003-01 | PRD-derived TC planning rows | test planning | create-or-refresh-required | TC packet does not exist yet. |
| S-004 | AC-S004-01 | Implementation blueprint control rows | planning | create-or-refresh-required | Blueprint does not exist yet. |
| S-005 | AC-S005-01 | loopObservability.captureLoopEvidence | loopObservability | create-or-refresh-required | Core durable capture capability. |
| S-005 | AC-S005-02 | loopObservability.appendEvidence | loopObservability | create-or-refresh-required | Append-only behavior. |
| S-006 | AC-S006-01 | loopObservability.readScorecard | loopObservability | create-or-refresh-required | Scorecard projection. |
| S-006 | AC-S006-02 | loopObservability.readScorecard | loopObservability | create-or-refresh-required | State coverage. |
| S-007 | AC-S007-01 | loopObservability.recordDefect | loopObservability | create-or-refresh-required | Defect capture. |
| S-007 | AC-S007-02 | loopObservability.linkRegressionTrace | loopObservability | create-or-refresh-required | Regression trace. |
| S-008 | AC-S008-01 | loopObservability.recordHarnessEvidence | platform helper | create-or-refresh-required | Helper consumes public seam. |
| S-008 | AC-S008-02 | loopObservability.importChangedArtifacts | platform helper | create-or-refresh-required | Git/PR-derived path truth. |
| S-009 | AC-S009-01 | loopObservability.rootInternalWrite | API | create-or-refresh-required | Exact capability key deferred to permission mapping. |
| S-009 | AC-S009-02 | loopObservability.rootInternalRead | API | create-or-refresh-required | Read model for future UI/tooling. |
| S-010 | AC-S010-01 | Maintained artifact conformance | governance | not-capability-backed | Artifact sweep control criterion. |
| S-011 | AC-S011-01 | Future loop review UI | future UI | not-capability-backed | Deferred future scope. |
| S-012 | AC-S012-01 | Future OLAP export | future export | not-capability-backed | Deferred future scope. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-000 | S-000 AC-S000-01 | requester Product Discovery gate | pre-existing-capability | existing | explicit requester response | not-applicable: human gate |
| DEP-000A | S-001 AC-S001-01 | Product Discovery, Technical Steering, and PRD proposal | pre-existing-capability | existing | source artifact references | not-applicable: docs-only architecture task |
| DEP-000B | S-002 AC-S002-01 | Product Discovery, Technical Steering, and PRD proposal | pre-existing-capability | existing | source artifact references | not-applicable: docs-only capability planning task |
| DEP-001 | S-005 AC-S005-01 | loopObservability persistence | persistence-table-or-index | new | migration and data dictionary | persistence integration tests |
| DEP-002 | S-006 AC-S006-01 | loopObservability scorecard seam | feature-public-seam | new | API/read model contract | projection integration tests |
| DEP-003 | S-007 AC-S007-02 | loopObservability regression trace seam | feature-public-seam | new | lifecycle and link contract | persistence integration tests |
| DEP-004 | S-008 AC-S008-01 | platform harness helper | new-capability | new | helper contract | helper integration tests |
| DEP-005 | S-008 AC-S008-02 | git or PR metadata | external-provider | existing | changed path source proof | classifier fixture tests |
| DEP-006 | S-009 AC-S009-01 | root/internal authorization | authz-capability | new | permission mapping | API authz allow and deny tests |
| DEP-007 | S-010 AC-S010-01 | feature manifest and dependency graph | feature-public-seam | new | manifest and generated graph proof | artifact validation commands |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| loopObservability public evidence recording seam | harness helper | Records loop evidence without direct database writes. | Direct SQL, mutable external records only, unsafe payload material. | helper and persistence integration tests |
| loopObservability scorecard read seam | future UI and tooling | Returns scorecard sections from persisted evidence. | OLAP, narrative-only summaries, invented fallback values. | scorecard projection and API tests |
| loopObservability artifact trace read seam | future defect triage and UI | Answers which loop and task touched an artifact path. | Manual artifact declaration alone. | artifact ingestion and read tests |
| loopObservability regression trace seam | issue reconciliation | Separates suspected from confirmed causes. | Automatic blame or unproven causation. | lifecycle and regression tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | requester and Product Discovery owner | repo planning authority | active | human gate pending | confirm prior context or re-run Product Discovery | pending to confirmed or interview-reopened | missing explicit requester response | governance integrity |
| S-001 | architecture maintainer | repo planning authority | active | PRD/ADR absent or stale | not-applicable: docs governance | draft to accepted ADR; PRD stale to reconciled | missing source file; contradictory steering | auditability; compatibility |
| S-002 | planning maintainer | repo planning authority | active | matrix absent | capability rows, non-capability rationale | absent to drafted matrix | missing AC mapping | traceability |
| S-003 | QA planner | repo test planning authority | active | TC packet absent | TC obligations per AC | absent to drafted packet | missing story or AC reference | test strength; traceability |
| S-004 | implementation planner | repo planning authority | active | blueprint absent | story sequence; dependency order | absent to drafted blueprint | missing artifact prerequisite | compatibility; operational evidence |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | Product Discovery owner; human gate pending | not-capability-backed | source-level | TC obligation: Product Discovery gate repair review | no |
| AC-S000-02 | requester; human gate pending | not-capability-backed | source-level | TC obligation: requester signoff evidence | no |
| AC-S001-01 | architecture maintainer active; ADR absent/stale | not-capability-backed | source-level | TC obligation: ADR decision review | no |
| AC-S001-02 | planning maintainer active; PRD stale | not-capability-backed | source-level | TC obligation: docs alignment review | no |
| AC-S002-01 | planning maintainer active; matrix absent | create matrix rows | contract-level | TC obligation: capability traceability review | no |
| AC-S002-02 | planning maintainer active; AC mapping incomplete | create matrix rows | contract-level | TC obligation: capability coverage review | no |
| AC-S003-01 | QA planner active; TC packet absent | create TC rows | contract-level | TC obligation: PRD-derived test-case planning | no |
| AC-S004-01 | implementation planner active; blueprint absent | blueprint rows | source-level | TC obligation: blueprint consistency review | no |
| AC-S005-01 | harness/system actor; loop open | loopObservability.captureLoopEvidence | persistence-level | TC obligation: persistence create/read/update validation | yes |
| AC-S005-02 | harness/system actor; evidence appended/corrected | loopObservability.appendEvidence | persistence-level | TC obligation: append-only evidence lifecycle | yes |
| AC-S006-01 | maintainer; loop completed/partial | loopObservability.readScorecard | contract-level | TC obligation: scorecard projection groups | yes |
| AC-S006-02 | maintainer; loop complete/blocked/reopened/partial | loopObservability.readScorecard | persistence-level | TC obligation: loop state projection matrix | yes |
| AC-S007-01 | operator; defect raised | loopObservability.recordDefect | persistence-level | TC obligation: defect classification | yes |
| AC-S007-02 | operator; regression suspected/confirmed | loopObservability.linkRegressionTrace | persistence-level | TC obligation: causation lifecycle | yes |
| AC-S008-01 | harness actor active | loopObservability.recordHarnessEvidence | mixed | TC obligation: helper-to-feature integration | yes |
| AC-S008-02 | harness actor active; git paths available | loopObservability.importChangedArtifacts | source-level | TC obligation: git/PR classifier fixtures | yes |
| AC-S009-01 | root/internal actor active | loopObservability.rootInternalWrite | runtime-api | TC obligation: route validation and authz | yes |
| AC-S009-02 | root/internal actor active | loopObservability.rootInternalRead | runtime-api | TC obligation: route read model | yes |
| AC-S010-01 | repo governance active | not-capability-backed | source-level | TC obligation: artifact sweep evidence | yes |
| AC-S011-01 | future frontend governance | not-capability-backed | source-level | TC obligation: future design-system gate | no |
| AC-S012-01 | future export governance | not-capability-backed | source-level | TC obligation: future export gate | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| BLK-SB-000 | S-001 through S-012 | artifact-drift | Product Discovery human refresh/signoff gate is unresolved. | Requester response and Product Discovery packet promotion or revision | Do not mark downstream stories ready before human gate is resolved. |
| BLK-SB-001 | S-003 through S-010 | DECISION:architecture-foundation | Technical Steering requires an ADR before implementation blueprint signoff. | ADR for loop observability evidence foundation | Do not mark implementation stories ready before ADR exists. |
| BLK-SB-002 | S-005 through S-010 | capability-matrix | Capability rows do not exist yet. | Capability matrix for loop observability v0 | Do not cut delivery tasks before matrix exists. |
| BLK-SB-003 | S-004 through S-010 | test-harness | PRD-derived test cases do not exist yet. | Test-case packet for loop observability v0 | Do not cut delivery tasks before TC obligations are planned. |
| BLK-SB-004 | S-005 through S-010 | artifact-drift | Implementation blueprint and maintained-artifact plan do not exist yet. | Implementation blueprint | Do not cut delivery tasks before build sequence exists. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-000 | BLK-SB-000 | Is the prior-context summary accurate enough to proceed with v0 internal harness/Codex loops first, or should Product Discovery be re-run one question at a time? | yes | Pending requester response. |
| Q-001 | BLK-SB-001 | Should the ADR name loop observability as a feature-owned evidence foundation with platform helper consumers? | no | Technical Steering already recommends yes; ADR author records final wording. |
| Q-002 | BLK-SB-002 | Should v0 capability rows include only internal harness loops and defer human delivery loops? | no | Product Discovery and Technical Steering already scope v0 to internal harness/Codex loops. |
| Q-003 | BLK-SB-003 | Which exact TC IDs cover scorecard confidence and append-only evidence? | no | PRD test-case planner owns exact TC IDs. |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-000 | S-000 through S-012 | BLK-SB-000, Q-000, and ART-000 | human-decision | Is the prior-context summary accurate enough to proceed, or should Product Discovery be re-run one question at a time? | confirm prior context and proceed; re-run Product Discovery interview | Ask requester for the gate decision before promoting Product Discovery. | no | needs-human-answer |
| U-001 | S-003 through S-010 | BLK-SB-001 and ART-001 | artifact-creation | no | Safe default: create ADR from Product Discovery, PRD, and Technical Steering. | Create ADR for loop observability evidence foundation. | yes | ready-to-create-artifact |
| U-001B | S-003 through S-010 | ART-002 | artifact-creation | no | Safe default: reconcile the existing PRD proposal after the ADR decision is recorded. | Update PRD proposal with Technical Steering and ADR decisions. | yes | ready-to-create-artifact |
| U-002 | S-005 through S-010 | BLK-SB-002 and ART-003 | capability-matrix-required | no | Safe default: create v0 internal harness capability matrix before implementation blueprint. | Create capability matrix for loop observability v0. | yes | ready-to-create-artifact |
| U-003 | S-004 through S-010 | BLK-SB-003 and ART-004 | artifact-creation | no | Safe default: create PRD-derived test-case packet after capability matrix rows exist. | Run PRD test-case planning for loop observability. | yes | ready-to-create-artifact |
| U-004 | S-005 through S-010 | BLK-SB-004 and ART-005 | artifact-creation | no | Safe default: create implementation blueprint after ADR, PRD, matrix, and test cases. | Create implementation blueprint. | yes | ready-to-create-artifact |
| U-005 | S-009 | ART-006 and ART-008 | api-contract-required | no | Safe default: create API contract and permission mapping before route implementation. | Create API contract and permission mapping during delivery planning. | yes | ready-to-create-artifact |
| U-006 | S-010 | ART-007 and ART-009 | data-dictionary-required | no | Safe default: create data dictionary and feature manifest during delivery planning. | Create data dictionary and manifest plan. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-000 | S-000 | Product Discovery human gate | update | product-discovery-maintainer | yes |
| ART-001 | S-001 | ADR | create | architecture governance | yes |
| ART-002 | S-001 | PRD proposal | update | PRD maintainer | yes |
| ART-003 | S-002 | capability matrix | create | capability matrix workflow | yes |
| ART-004 | S-003 | PRD-derived test cases | create | prd-test-case-planner | yes |
| ART-005 | S-004 | implementation blueprint | create | implementation-blueprint-maintainer | yes |
| ART-006 | S-009 | API contract | create | api-contract-maintainer | yes |
| ART-007 | S-010 | data dictionary | create | data-dictionary-maintainer | yes |
| ART-008 | S-009 | permission mapping | create | permission mapping workflow | yes |
| ART-009 | S-010 | feature manifest and dependency graph | create | feature implementation workflow | yes |
| ART-010 | S-011 | design-system governance | defer-approved | frontend-design-system-loop-maintainer | no |
| ART-011 | S-012 | OLAP export/runbook posture | defer-approved | future export workflow | no |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-000, S-001, S-002, S-003, S-004, S-010, S-011, S-012
- Stories needing capability matrix:
  S-005, S-006, S-007, S-008, S-009
- Stories needing PRD refinement:
  none
- Stories needing Technical Steering revisit:
  none
- Broad cleanup or shortcut risk:
  none
- Architecture invention risk:
  none

## Layer 4 Handoff

A story may hand off to Task Breakdown only when:

- it has a value type and delivery shape
- it has a clear job to be done
- acceptance criteria are concrete and verifiable
- dependency and seam obligations are recorded
- capability matrix posture is recorded
- proof layers and test families are assigned
- required artifact obligations are recorded
- architecture invention check is not blocked
- blockers are resolved or intentionally carried as non-delivery control work

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | blocked | Human refresh/signoff gate must be resolved before downstream artifact promotion. |
| S-001 | blocked | Wait for Product Discovery human gate before ADR and PRD reconciliation. |
| S-002 | blocked | Wait for Product Discovery human gate and ADR/PRD reconciliation. |
| S-003 | blocked | Wait for ADR and capability matrix before PRD-derived test cases. |
| S-004 | blocked | Wait for ADR, PRD reconciliation, matrix, and test-case packet. |
| S-005 | blocked | Delivery story waits for capability matrix and blueprint. |
| S-006 | blocked | Delivery story waits for capability matrix and blueprint. |
| S-007 | blocked | Delivery story waits for capability matrix and blueprint. |
| S-008 | blocked | Delivery story waits for capability matrix and blueprint. |
| S-009 | blocked | API story waits for matrix, blueprint, API contract, and permission mapping. |
| S-010 | blocked | Artifact conformance waits for implementation scope. |
| S-011 | blocked | Future UI requires design-system governance and read APIs. |
| S-012 | blocked | Future OLAP requires stable capture/read model and export decision. |
