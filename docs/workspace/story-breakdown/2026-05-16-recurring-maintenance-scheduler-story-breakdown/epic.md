# Story Breakdown: Recurring Maintenance Scheduler Foundation

## Status

- Packet status:
  ready-for-task-breakdown
- Packet date:
  2026-05-16
- Epic ID:
  EPIC-RECURRING-SCHEDULER-FOUNDATION
- Epic title:
  Recurring maintenance scheduler foundation
- Source Product Discovery packet:
  explicit platform exception recorded in Technical Steering
- Source Technical Steering packet:
  docs/workspace/technical-steering/2026-05-16-recurring-maintenance-scheduler-steering.md
- Related PRD:
  none; explicit platform exception
- Related capability matrix:
  none; S-000 creates the scheduler behavior/proof map before delivery stories
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  docs/workspace/implementation-blueprints/2026-05-16-recurring-maintenance-scheduler-foundation.md;
  docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md;
  docs/architecture/adr/0043-use-platform-owned-job-lifecycle-hardening-for-long-running-work.md;
  docs/architecture/adr/0044-use-private-generated-export-bundles-for-sensitive-domain-exports.md;
  docs/architecture/adr/0045-use-app-controlled-public-asset-delivery-for-rendered-domain-assets.md;
  docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md
- Validation command:
  npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-16-recurring-maintenance-scheduler-story-breakdown
- Validation status:
  pass

## Handoff Validation

- Product Discovery status:
  explicit-platform-exception
- Technical Steering status:
  ready-for-story-breakdown
- Steering non-goals preserved:
  no scheduler UI, no root-admin operator API, no dynamic user-created
  schedules, no business workflow scheduling, no per-tenant custom cadence, no
  frontend route, no OpenAPI/Postman change, and no public logo scheduler
  adoption until concrete logo cleanup/cache jobs exist.
- Steering stop conditions resolved or carried as blockers:
  no requester-answerable blockers remain. Public logo scheduler adoption and
  operator UI/API are deferred with owner.
- Architecture invention check:
  consumes-steering-only
- Governed DEV:frontend seam posture:
  not-applicable
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  durable operational state, platform-internal authority, background runtime
  process, duplicate enqueue prevention, safe error summaries, Organization
  export generated-file cleanup, and runbook/ADR truth.
- Missing source-of-truth artifacts:
  scheduler behavior/proof map, implementation tasks, detailed TC-* cases,
  scheduler persistence artifacts, runtime runbook updates, ADR-0046 closeout.

## Entity Readiness Snapshot

### Entity Inventory

| Entity / Record | Role In Request | V1 Posture | Owning Feature / Seam | Data Dictionary Status | API / UX Surface Status | Search / Export Status | Open Questions / Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Recurring Schedule Definition | Code-declared rule saying which maintenance job should run and how often. | active-v1 | jobProcessing | platform persistence note required before closeout | no API/UX in v1 | not searchable/exported | exact fields finalized in S-001/S-002 tasks |
| Recurring Schedule Run | Durable evidence that a scheduled slot was leased, enqueued, skipped, or failed. | active-v1 | jobProcessing | platform persistence note required before closeout | no API/UX in v1 | not searchable/exported | retention/operator projection deferred |
| Scheduler Lease | Runtime lock that prevents two scheduler processes from enqueueing the same due work. | active-v1 | jobProcessing | included with schedule persistence | no API/UX in v1 | not searchable/exported | lease expiry duration finalized in tasks |
| Organization Export Cleanup Job | Existing maintenance job for expired/deleted generated export bundles. | deferred-follow-on | organizationExports future consumer of jobProcessing | existing export records documented | no new API/UX in scheduler slice | export cleanup only | scheduled cadence deferred to Organization export slice |
| Organization Export Timeout Sweep Job | Existing maintenance job for stale running export reconciliation. | deferred-follow-on | organizationExports future consumer of jobProcessing | existing export records documented | no new API/UX in scheduler slice | export lifecycle only | scheduled cadence deferred to Organization export slice |
| Public Logo Cleanup/Cache Jobs | Future scheduler consumers for public logo cleanup and cache invalidation. | deferred-with-owner | organizationBrandingReferences, assets, future cache seam | current logo docs note future pressure | no v1 scheduler surface | not in this epic | revisit when concrete job seams exist |
| Operator Schedule API/UI | Future operator visibility and controls. | deferred-with-owner | future root/operator feature | none | no v1 surface | not in this epic | future discovery/DS governance required |

### Per-Entity Readiness Questions

| Entity / Record | Question Area | Question Or Gap | Required Before Story Ready | Owner / Next Action |
| --- | --- | --- | --- | --- |
| Recurring Schedule Definition | fields | What minimum schedule fields are needed for due calculation, enablement, and safe enqueue? | yes | S-001/S-002 tasks use blueprint field list |
| Recurring Schedule Run | lifecycle | Which statuses prove enqueued, skipped, failed, or recovered work? | yes | S-001 records status model |
| Scheduler Lease | concurrency | How does a stale lease expire and allow recovery? | yes | S-001/S-003 prove with tests |
| Organization Export Schedules | cadence | Which two existing Organization export jobs become first recurring consumers? | deferred-with-owner | Follow-on Organization export slice should use cleanup and timeout sweep only |

### Entity Deferral Register

| Entity / Behavior | Deferral Posture | Must Not Appear In | Revisit Trigger | Owner |
| --- | --- | --- | --- | --- |
| Dynamic persisted schedules edited by users | deferred-with-owner | v1 API, UI, route, permission, or task work | operator scheduling product request | future product/platform owner |
| Scheduler operator API/UI | deferred-with-owner | v1 OpenAPI, Postman, frontend, permission mapping | operator visibility/control request | future product/platform owner |
| Public logo scheduled cleanup/cache adoption | deferred-with-owner | first scheduler implementation stories | concrete logo cleanup/cache job seams exist | organization branding/assets owner |
| Organization export scheduled cleanup/timeout adoption | deferred-with-owner | scheduler platform-only implementation story | Organization export slice starts | organizationExports owner |
| Business workflow scheduling | out-of-scope | v1 scheduler story or task work | future workflow scheduling request | future product owner |

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-SCHED-001 | recurring scheduler runtime | platform-seam | jobProcessing | approved | Story and task breakdown for platform scheduler foundation. |
| TS-SCHED-002 | code-declared schedule registry | platform-seam | jobProcessing registry | approved | Registry schema, validation, and tests. |
| TS-SCHED-003 | durable schedule/run state | architecture-foundation-required | jobProcessing persistence | approved | Migration, platform persistence note, persistence-backed tests. |
| TS-SCHED-004 | Organization export cleanup/timeout schedules | feature-public-seam | organizationExports job definitions consumed by scheduler | deferred-with-owner | Follow-on first-consumer story/task plus manifest/docs refresh. |
| TS-SCHED-005 | public logo cleanup/cache schedules | feature-public-seam | organizationBrandingReferences + assets | deferred-with-owner | Future story after concrete logo cleanup/cache job seams exist. |
| TS-SCHED-006 | operator API/UI | platform-seam | future root/operator surface | deferred-with-owner | Separate Product Discovery/Technical Steering if requested. |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| recurring scheduler foundation | not-applicable | jobProcessing | not-applicable | hidden/internal | not-applicable | not-applicable | not-applicable | not-topology | none | none | none | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | ready | No frontend surface is in scope. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | no | No browser/session surface. | none | no |
| csp-assets | no | No rendered assets. | none | no |
| privileged-helper | no | No browser helper. | none | no |
| csrf-mutation | no | No HTTP mutation route. | none | no |
| url-replay-state | no | No URL state. | none | no |
| sensitive-rendering | no | No browser rendering. | none | no |
| asset-delivery | no | Scheduler does not change asset delivery routes in this slice. | Preserve asset-consumer boundaries in docs. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | behavior/proof map missing | yes | No scheduler capability matrix exists. | DOC:docs-artifact |
| S-001 | durable schedule records | yes | Steering requires schedule/run state and leases. | DEV:migration-persistence |
| S-002 | reusable schedule registry | yes | Steering approves code-declared schedule registry. | DEV:backend |
| S-003 | scheduler runtime | yes | Steering approves scheduler process and enqueue loop. | DEV:backend |
| S-004 | first-consumer deferral | yes | Organization export cleanup and timeout jobs are intended consumers, but not part of the platform-only branch. | DEV:backend |
| S-005 | artifact closeout | yes | ADR-0046 and docs must distinguish implemented scheduler foundation from deferred feature adoption. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Turn recurring maintenance from an acknowledged platform gap into a planned,
  verifiable scheduler foundation.
- Epic outcome:
  Task Breakdown can implement a scheduler that safely enqueues recurring
  maintenance work without inventing cadence, state, authority, or proof rules.
- Epic actors:
  system, background scheduler process, background worker, operator, planning
  reviewer
- Epic non-goals:
  scheduler UI, operator API, user-created schedules, public logo scheduler
  adoption, business workflow scheduling, frontend work, and OpenAPI/Postman
  changes.
- Epic dependency summary:
  Depends on jobProcessing enqueue/worker seams, ADR-0046, scheduler
  blueprint, feature manifests, and runtime docs. Organization export job
  definitions are follow-on consumer inputs, not dependencies of this
  platform-only slice.
- Epic-level proof target:
  mixed

## Story Narratives

### S-000: Scheduler behavior and proof map

**Situation**
The scheduler has an approved direction, but no dedicated behavior matrix.

**Goal**
The planning reviewer can see active scheduler promises and deferred behavior
before delivery tasks start.

**Decisions Needed**
No new business choice is expected.

**Work That Follows**
Task Breakdown uses the map to keep implementation scoped.

**Evidence Of Success**
Every scheduler story traces to a behavior row or a non-behavior rationale.

### S-001: Durable schedule state

**Situation**
Recurring work needs stored evidence so restarts and duplicate processes do
not lose or repeat maintenance work.

**Goal**
The system can recover schedules, run records, and leases safely.

**Decisions Needed**
Task work finalizes exact stored field names.

**Work That Follows**
Registry and runtime work use the durable records.

**Evidence Of Success**
Stored-record tests prove uniqueness, run history, and stale lease recovery.

### S-002: Code-declared schedule registry

**Situation**
The first scheduler should run known maintenance work, not arbitrary
user-created schedules.

**Goal**
The system has a validated list of approved recurring schedules.

**Decisions Needed**
Task work chooses the exact registry module shape.

**Work That Follows**
The runtime reads the registry when deciding due work.

**Evidence Of Success**
Tests prove valid schedules register and invalid schedules are rejected.

### S-003: Scheduler runtime enqueue loop

**Situation**
The platform can enqueue jobs, but recurring work still needs a runtime that
finds due schedules.

**Goal**
The system enqueues one job per due slot and records the outcome.

**Decisions Needed**
Task work sets operational defaults such as tick interval and lease duration.

**Work That Follows**
Organization export maintenance can adopt the scheduler in the follow-on
Organization export slice.

**Evidence Of Success**
Runtime tests prove due work, duplicate prevention, and safe failure recording.

### S-004: Organization export schedule adoption deferral

**Situation**
Organization export cleanup and timeout jobs exist, but they are not yet
automatic and are not part of this platform-only branch.

**Goal**
The story records that export cleanup and stale-running reconciliation are
deferred first-consumer work.

**Decisions Needed**
No new decision in this branch. The follow-on Organization export task
sets cadence and payload defaults within the approved model.

**Work That Follows**
Export docs and runbooks can describe real scheduler cadence only after that
feature adoption lands.

**Evidence Of Success**
Static source and docs prove the scheduler foundation has no hidden
Organization export dependency.

### S-005: Scheduler closeout evidence

**Situation**
Repo docs currently say recurring scheduler cadence is deferred.

**Goal**
Reviewers can trust the documentation trail after implementation lands.

**Decisions Needed**
Implementation closeout decides whether ADR-0046 is promoted or superseded.

**Work That Follows**
The Organization server and platform loop can be reviewed for closeout.

**Evidence Of Success**
ADRs, docs, runbooks, manifests, generated artifacts, and test evidence align.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Scheduler behavior and proof map | This is needed so reviewers can see the scheduler promises before delivery work starts. | As the planning reviewer, I need scheduler behavior and proof obligations listed so implementation cannot invent them. | planning reviewer | A behavior/proof map covers the active scheduler stories and deferrals. | none |
| S-001 | ready-for-task-breakdown | system-value | DEV:backend | Durable schedule state | This is needed because repeated maintenance work must survive restarts and avoid duplicate runs. | As the system, I need durable schedule records and run history so recurring work can recover safely. | system | Schedule definitions, run records, and leases are persisted and testable. | S-000 |
| S-002 | ready-for-task-breakdown | system-value | DEV:backend | Code-declared schedule registry | This is needed because the first scheduler should run only known maintenance work. | As the system, I need a validated registry of recurring schedules so due work is deterministic. | system | Registered schedules are validated, bounded, and safe to enqueue. | S-000, S-001 |
| S-003 | ready-for-task-breakdown | system-value | DEV:backend | Scheduler runtime enqueue loop | This is needed so due maintenance work happens without a person manually starting it. | As the system, I need a scheduler runtime so maintenance work happens without manual enqueue. | system | Due schedules enqueue through jobProcessing with duplicate prevention and failure recording. | S-001, S-002 |
| S-004 | ready-for-task-breakdown | harness-value | DEV:backend | Organization export schedule adoption deferral | This is needed because expired files and stuck export work are intended consumers, but not part of the platform-only branch. | As the reviewer, I need the first-consumer boundary recorded so scheduler foundation work does not silently become Organization export work. | reviewer | Export cleanup and timeout sweeps remain deferred follow-on consumers. | S-003 |
| S-005 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Scheduler closeout evidence | This is needed because repo guidance must change once scheduler foundation is real. | As the reviewer, I need artifacts refreshed so the repo truth matches the implemented scheduler foundation. | reviewer | ADR-0046, docs, manifests, and evidence summaries align with implementation and deferred feature adoption. | S-004 |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| none | none | none | no blocker remains after steering | none | none |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| none | none | no requester-answerable questions remain | no | none |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-SCHED-001 | S-000 | behavior/proof map | create compact scheduler behavior/proof map | task-breakdown-maintainer or delivery task | no |
| ART-SCHED-002 | S-001 | persistence/data note | document scheduler operational records | data-dictionary-maintainer or docs task | no |
| ART-SCHED-002A | S-002 | source/tests | create scheduler registry implementation and validation tests | implementation task | no |
| ART-SCHED-003 | S-003 | runtime/runbook | document scheduler process, stale lease, and enqueue failure operations | implementation task/docs task | no |
| ART-SCHED-004 | S-004 | deferral docs/source proof | record Organization export first-consumer deferral and prove scheduler source has no hidden feature import | implementation task/docs task | no |
| ART-SCHED-005 | S-005 | ADR/docs closeout | promote or supersede ADR-0046 and refresh maintained docs | docs-alignment-auditor or delivery closeout | no |
| ART-SCHED-006 | all | test cases | create detailed TC-* obligations or direct traceable tests | prd-test-case-planner or delivery task | no |

## Story Readiness Summary

- Ready stories:
  S-000, S-001, S-002, S-003, S-004, S-005
- Blocked stories:
  none
- Stories needing capability matrix:
  S-000 creates the behavior/proof map because no scheduler-specific matrix
  exists.
- Stories needing PRD refinement:
  none before Task Breakdown under the approved platform exception.
- Stories needing Technical Steering revisit:
  none unless Task Breakdown expands scope to API, UI, dynamic schedules, or
  public logo scheduled jobs.
- Broad cleanup or shortcut risk:
  none
- Architecture invention risk:
  none

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | ready-for-task-breakdown | Needed to convert steering into deterministic behavior/proof rows. |
| S-001 | ready-for-task-breakdown | Persistence boundary and proof obligations are known. |
| S-002 | ready-for-task-breakdown | Code-declared registry decision is approved. |
| S-003 | ready-for-task-breakdown | Runtime scope and non-goals are explicit. |
| S-004 | ready-for-task-breakdown | First consumers are deferred to the Organization export slice. |
| S-005 | ready-for-task-breakdown | Artifact closeout scope is explicit. |
