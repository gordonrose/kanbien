# Technical Steering Addendum: Recurring Maintenance Scheduler Foundation

## Status

- Packet status:
  `ready-for-story-breakdown`
- Packet date:
  `2026-05-16`
- Steering ID:
  `TS-RECURRING-SCHEDULER-FOUNDATION`
- Source Product Discovery packet:
  explicit exception. This is an internal platform foundation follow-up created
  from Organization Domain Foundation maintenance gaps, ADR-0046, and the
  scheduler implementation blueprint rather than a new business-facing product
  request.
- Related ADRs reviewed:
  - `docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md`
  - `docs/architecture/adr/0043-use-platform-owned-job-lifecycle-hardening-for-long-running-work.md`
  - `docs/architecture/adr/0044-use-private-generated-export-bundles-for-sensitive-domain-exports.md`
  - `docs/architecture/adr/0045-use-app-controlled-public-asset-delivery-for-rendered-domain-assets.md`
  - `docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md`
- Related implementation blueprint:
  `docs/workspace/implementation-blueprints/2026-05-16-recurring-maintenance-scheduler-foundation.md`
- Validation status:
  `not-applicable`

## Product Handoff

- Product Discovery status:
  `explicit-platform-exception`
- Product intent preserved:
  yes. Organization exports and public logo cleanup/cache decisions require
  honest recurring maintenance before production signoff, but this isolated
  scheduler slice introduces only the platform foundation. Feature-owned
  Organization export schedule adoption is deferred to the Organization
  backend/export slice.
- Product questions resolved or carried as blockers:
  no requester-answerable product questions remain. Operator UI, dynamic
  schedules, per-tenant cadence, and business workflow scheduling are deferred.
- New family or template decision:
  `not-applicable`

## Decision Summary

Approve a first recurring maintenance scheduler foundation under
`jobProcessing`.

The first scheduler must be a backend/platform seam that supports
code-declared recurring maintenance jobs only. It must not introduce
user-created schedules, root-admin operator APIs, scheduler UI, or public API
contract changes.

The scheduler implementation may proceed to Story Breakdown and Task Breakdown
with these boundaries:

- `jobProcessing` owns schedule declaration, durable schedule/run state,
  leasing, overlap prevention, missed-run policy, scheduler runtime, and
  enqueue attempts.
- Consuming features own the business semantics of the jobs that run after
  enqueue.
- Scheduler enqueue goes through the existing `jobProcessing` public enqueue
  seam.
- Feature persistence remains private to owning features.
- `recurringSchedule` remains rejected on normal enqueue requests unless a
  later API/contract decision explicitly expands that behavior.
- ADR-0046 must be promoted to Accepted or superseded by a concrete scheduler
  ADR as part of implementation closeout.

## Architecture Classification

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |
| TS-SCHED-001 | recurring scheduler runtime | `DEV:platform-seam` | `jobProcessing` | `approved` | Scheduler cadence is shared runtime machinery and must not be duplicated feature-locally. | Story and task breakdown for platform scheduler foundation. |
| TS-SCHED-002 | code-declared schedule registry | `DEV:platform-seam` | `jobProcessing` registry | `approved` | V1 needs deterministic internal maintenance schedules, not user-authored schedules. | Registry schema, validation, and tests. |
| TS-SCHED-003 | durable schedule/run state | `architecture-foundation-required` | `jobProcessing` persistence | `approved` | Overlap prevention, missed-run recovery, and operator evidence require durable state. | Migration, platform persistence note, persistence-backed tests. |
| TS-SCHED-004 | Organization export cleanup/timeout schedules | `feature-public-seam` | `organizationExports` job definitions consumed by scheduler | `deferred-with-owner` | Existing maintenance jobs remain the intended first feature-owned consumers, but this slice must not import Organization exports. | Organization export slice wires first-consumer schedules plus manifest/docs refresh. |
| TS-SCHED-005 | public logo cleanup/cache schedules | `feature-public-seam` | `organizationBrandingReferences` + assets | `deferred-with-owner` | Public logo records expose future scheduler pressure, but implementation-ready cleanup/cache jobs are not complete first-consumer scope. | Future story after concrete logo cleanup/cache job seams exist. |
| TS-SCHED-006 | operator API/UI | `blocked` | future root/operator surface | `deferred-with-owner` | No business need or design-system chain exists for scheduler UI in this slice. | Separate Product Discovery/Technical Steering if requested. |

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |
| API route or contract change | no | First slice has no HTTP API. | Explicit non-scope row in Story Breakdown. | none |
| persistence or migration change | yes | Durable schedules, runs, leases, and failure evidence are required. | Scheduler persistence story. | backend-persistence |
| authz or permission change | no | No operator API/UI; scheduled jobs run as platform-internal. | Confirm no new capability keys. | none |
| DEV:frontend rendered surface | no | No browser surface. | Explicit no-frontend row. | none |
| governed GOV:design-system seam | no | No UI. | Explicit no-DS row. | none |
| shared platform/runtime seam | yes | New scheduler runtime and process. | Platform scheduler story. | platform-runtime |
| reusable logic or extraction pressure | yes | Schedule registry, due calculation, leasing, enqueue idempotency. | Reusable scheduler domain tasks. | platform-domain |
| data dictionary impact | yes | New durable platform operational records. | Data dictionary or platform persistence reference. | docs-data |
| QA/runtime evidence need | yes | Time-based concurrent runtime behavior can fail silently. | Scheduler QA/test-case story. | QA-platform |
| source-independent docs impact | yes | ADR-0046, blueprint, runbooks, feature docs, bootstrap docs need refresh. | Artifact sweep story. | docs-artifact |

## Architecture Decision Analysis

| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-SCHED-001 | scheduler ownership | Should recurring cadence live in each feature or in `jobProcessing`? | `approved` | Feature-local timers; platform scheduler; external managed scheduler only. | Shared async platforms normally centralize cadence, leases, and observability. | Repo forbids casual platform drift and already owns background jobs in `jobProcessing`. | Platform seam costs more now but avoids duplicated cron and inconsistent retries. | Feature-local timers risk duplicate jobs, missed cleanup, and hidden production assumptions. | Medium platform slice. | No direct customer data exposure if run records stay redacted. | Central runtime is easier to monitor and restart. | Additive; no route compatibility impact. | Can test scheduler once and consumers separately. | High before broad adoption. | Build scheduler under `jobProcessing`. | Feature-local cron; unmanaged external scheduler as only truth. | Platform owner. | ADR-0046 and scheduler blueprint. |
| DEC-SCHED-002 | schedule declaration model | Should v1 schedules be code-declared or dynamic persisted schedules? | `approved` | Code-declared; DB-authored operator schedules; user-authored schedules. | Internal maintenance schedules should start code-declared until operator product needs exist. | No operator API/UI/design-system chain exists. | Code-declared is less flexible but safer and deterministic. | Dynamic schedules add authz, UI, validation, and support risk. | Lower first-slice cost. | Avoids exposing schedule mutation authority. | Deterministic deployment review. | Future DB-authored schedules can be added with migration. | Unit tests can assert definitions. | Moderate. | Code-declared schedule registry with durable runtime state. | Dynamic/user-authored schedules. | Platform owner. | Scheduler blueprint. |
| DEC-SCHED-003 | overlap and missed-run behavior | How should duplicate scheduler processes and missed intervals behave? | `approved` | No lease; DB lease; provider-specific repeatable jobs only. | Durable leases/idempotency are standard for safe distributed scheduling. | Provider-neutral job seam must not leak BullMQ-specific repeatable-job semantics. | DB lease adds persistence complexity but keeps provider portability. | No lease risks duplicate cleanup; replaying every missed interval can overload. | Medium persistence/test cost. | Run records must keep safe summaries only. | Expired leases support recovery. | Additive tables. | Requires concurrency tests. | High. | DB-backed lease, deterministic due-slot idempotency, coalesced missed runs by default. | No lease; replay all missed intervals. | Platform owner. | Scheduler blueprint and future ADR update. |
| DEC-SCHED-004 | first consumers | Which jobs should prove the first scheduler? | `deferred-with-owner` | Scheduler-only foundation; Organization export cleanup only; cleanup plus timeout sweep; include public logo cleanup/cache. | First consumer should be implemented and already enqueueable, but should be landed with its owning feature slice. | This isolated branch is limited to `jobProcessing`; Organization export cleanup/timeout jobs are planned for the next backend/export slice; public logo cleanup/cache job seams are not yet complete. | Deferring first consumers keeps the platform seam reviewable without cross-feature coupling. | Wiring export jobs in this slice would mix platform foundation with Organization feature adoption. | Lower first-slice cost; one follow-on first-consumer task remains. | Platform-internal jobs must avoid broad authority payloads when adopted. | Reduces scheduler platform risk now; export production-readiness gap closes in the next slice. | Additive to existing job types when adopted. | Scheduler uses generic code-declared schedule validation now; consumer tests follow later. | High. | Promote scheduler foundation now; defer `organization.export.cleanup` and `organization.export.timeout_sweep` schedule registration to Organization export slice. | Public logo cleanup/cache as first consumer; feature-local cron. | Platform + Organization exports owners. | This steering addendum and Organization export follow-on story/task. |

## Frontend Architecture Classification

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| recurring scheduler foundation | `not-applicable` | `jobProcessing` | `not-applicable` | `hidden/internal` | `not-applicable` | `not-applicable` | `not-applicable` | `not-topology` | `none` | none | none | `not-applicable` | `not-applicable` | `not-applicable` | `not-applicable` | `not-applicable` | `not-governed` | `none` | `not-applicable` | `ready` | No frontend surface is in scope. |

## Browser Security Posture

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | no | No browser/session surface. | none | no |
| csp-assets | no | No rendered assets. | none | no |
| privileged-helper | no | No browser helper. | none | no |
| csrf-mutation | no | No HTTP mutation route. | none | no |
| url-replay-state | no | No URL state. | none | no |
| sensitive-rendering | no | No browser rendering. | none | no |
| asset-delivery | no | Scheduler may trigger future asset cleanup/cache work, but no asset delivery route changes in this slice. | docs must preserve asset-consumer boundaries. | yes, if implementation changes public asset behavior. |

## Layer 3 Handoff

| Handoff Item | Status | Required Story Signal |
| --- | --- | --- |
| Platform scheduler foundation | `ready` | Story for registry, persistence, runtime, leases, and enqueue loop. |
| Organization export first consumer | `deferred-with-owner` | Follow-on Organization backend/export story for cleanup and timeout schedule definitions plus docs/runbook refresh. |
| ADR-0046 closeout | `ready` | Story to promote or supersede ADR-0046 after concrete implementation lands. |
| Public logo scheduler adoption | `deferred-with-owner` | Future story after logo cleanup/cache job seams exist. |
| Operator API/UI | `deferred-with-owner` | Future Product Discovery and design-system chain if requested. |

## Story Breakdown Notes

Layer 3 should split this into the smallest independently verifiable stories:

- scheduler behavior map and test obligations
- scheduler persistence and lease model
- scheduler domain registry and due-run calculation
- scheduler runtime entrypoint and package script
- explicit deferral of Organization export schedule definitions to the owning feature slice
- documentation/artifact closeout including ADR-0046 status

No app UI, route contract, OpenAPI, Postman, or permission-mapping story is
needed unless implementation expands scope beyond this packet.
