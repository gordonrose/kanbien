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
  ready-for-technical-steering
- Technical Steering status:
  ready-for-layer-3-planning
- Steering non-goals preserved:
  no customer-facing loop evidence, no tenant-facing visibility, no generic
  project management behavior, no automatic root-cause proof, no UI in v0, no
  OLAP implementation before durable capture and read models exist.
- Steering stop conditions resolved or carried as blockers:
  Product Discovery human refresh/signoff gate was resolved on 2026-05-08.
  ADR, PRD reconciliation, capability matrix, PRD-derived test cases, and
  implementation blueprint remain blocking control stories after that human
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

## Story Narratives

### S-000: Product Discovery human gate repair

**Situation**
This is needed to confirm whether the existing discovery notes are reliable enough before using them for planning.

**Goal**
Reviewers can understand what should be true afterward: The product packet can be honestly promoted or revised.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Product Discovery human gate repair into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-001: ADR and PRD reconciliation

**Situation**
This is needed to make sure the long-term decision and the product plan describe the same version of loop evidence.

**Goal**
Reviewers can understand what should be true afterward: ADR exists and PRD reflects Technical Steering decisions.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry ADR and PRD reconciliation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-002: Capability matrix control

**Situation**
This is needed to break down what loop evidence needs to capture into individual capabilities, so we can plan the implementation more accurately.

**Goal**
Reviewers can understand what should be true afterward: behavior list covers capture, scorecard, traceability, helper, service answer, and governance criteria.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry behavior list control into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-003: PRD-derived test case planning

**Situation**
This is needed to decide what evidence will prove the loop record is trustworthy before building the record.

**Goal**
Reviewers can understand what should be true afterward: Test-case packet covers saved data, service answer, helper, scorecard, and traceability behavior.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry PRD-derived test case planning into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-004: Implementation blueprint

**Situation**
This is needed to turn the approved direction into an ordered build plan before implementation starts.

**Goal**
Reviewers can understand what should be true afterward: Blueprint is ready for task breakdown.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Implementation blueprint into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-005: Durable capture foundation

**Situation**
This is its own story because one completed work loop needs a trustworthy record before scorecards or later reviews can mean anything.

**Goal**
Reviewers can understand what should be true afterward: One loop can be captured durably from open to closure.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Durable capture foundation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-006: Closure scorecard projection

**Situation**
This is its own story because maintainers need a readable summary of completion confidence before digging into details.

**Goal**
Reviewers can understand what should be true afterward: Closure confidence is derived from persisted records.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Closure scorecard projection into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-007: Defect and regression traceability

**Situation**
This is its own story because later problems should be connectable to the work that may have caused or prevented them.

**Goal**
Reviewers can understand what should be true afterward: Issue investigation can trace loop, task, change set, and planning record.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Defect and regression traceability into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-008: Harness recording and artifact ingestion helper

**Situation**
This is needed so evidence can be recorded consistently during normal work, instead of each workflow inventing its own recording steps.

**Goal**
Reviewers can understand what should be true afterward: Harness can record loop evidence through the feature public reusable connection.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Harness recording and planning record ingestion helper into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-009: Internal/root API read and write seams

**Situation**
This is needed so trusted tools have stable ways to add and review loop evidence.

**Goal**
Reviewers can understand what should be true afterward: service answer reads and writes follow repo service entry point, validation, access checking, pagination, and sorting defaults.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Internal/root service answer read and write seams into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-010: Maintained artifact conformance

**Situation**
This is needed to keep the written rules, examples, and tests aligned with the recorded loop evidence before the feature is treated as ready.

**Goal**
Reviewers can understand what should be true afterward: The feature loop can close without stale source-independent planning records.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Maintained planning record conformance into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-011: Future loop review UI governance

**Situation**
This is needed to keep a future review screen separate from the first version, which is only about recording and reading loop evidence.

**Goal**
Reviewers can understand what should be true afterward: UI work remains blocked until capture/read model and design-system posture exist.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Future loop review UI governance into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-012: Future OLAP export foundation

**Situation**
This is its own story because analytics exports are a later reporting concern and should not complicate the first evidence record.

**Goal**
Reviewers can understand what should be true afterward: OLAP export remains derived from app-owned persistent truth.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Future OLAP export foundation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.
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

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
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
