# Layer 5 Delivery Pilot: Chat Interface Root-Admin MVP

## Status

- Pilot status:
  `layer-5-delivery-in-progress`
- Date:
  2026-05-07
- Parent Product Request:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md`
- Parent Story Breakdown:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Purpose:
  Define the delivery-task sequence before formal Layer 5 delivery rules exist,
  using the Layer 4 KPI contract as the pilot acceptance bar.

## KPI Contract

Layer 5 should be judged against the task-breakdown harness KPIs:

| KPI | Layer 5 Interpretation | Pilot Rule |
| --- | --- | --- |
| no rework | Delivery should not rediscover source authority, scope, write set, proof command, or artifact obligations. | Every task names exact source artifacts, write envelope, proof target, and route-away boundaries before editing. |
| no drift | Source-independent docs, tests, generated artifacts, standards, and architecture must not diverge silently. | Each task either updates its owned artifacts or names the downstream artifact task that owns closure. |
| no contamination | A task must not perform work owned by another task type or upstream layer. | API, permission, data, frontend, evidence, and closure work stay split even when implemented by the same chat later. |
| no gaps | Lifecycle, authz, persistence, runtime, browser, and mock-honesty proof cannot be left implicit. | Required proof is named as a delivery gate or an explicit blocker. |
| no bloat | A task should be one behavior, proof target, seam, or artifact alignment target. | Multi-AC stories split into one task per AC unless inseparability is proven. |
| script-first execution | Delivery should expose machine-readable inventories and focused commands. | Each task names focused commands and expected output; broad gates supplement but do not replace them. |

## Remaining Task Map

| Task ID | Story | Task Type | Delivery Status | Primary KPI | Execution Scope | Depends On | Layer 5 Done Means |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S004-01 | S-004 | DEV:platform-seam | implemented-proof-recorded | no contamination | Create the narrow Product Discovery harness adapter seam that accepts approved conversation input and returns canonical Product Discovery packet data without inventing a second discovery format. | S-001 planning artifacts; S-003 PDF source-content decision | Adapter seam exists, packet output validates against approved Product Discovery packet semantics, and existing Product Discovery authority remains the source of truth. |
| T-S004-02 | S-004 | DEV:backend | blocked | no gaps | Record recoverable adapter failure without creating an invalid packet version. | T-S004-01 seam shape plus S-005 persistence | Failure leaves conversation recoverable, records non-success state/audit evidence, and focused runtime/API proof passes. |
| T-S005-01 | S-005 | DEV:migration-persistence | implemented-proof-recorded | no rework | Add durable conversation/message storage for actor, scope, page/module/role context, lifecycle, retention posture, and system-managed timestamps. | Data dictionary source truth; S-004 adapter source needs | Migration, repository, live-schema/proof, and persistence tests prove durable conversation facts. |
| T-S005-02 | S-005 | DEV:migration-persistence | implemented-proof-recorded | no gaps | Add packet revision/version storage for generated, downloaded, failed, and superseded states. | T-S005-01 base conversation storage; S-003 PDF decision | Packet lifecycle and supersession rules persist correctly with audit/proof expectations. |
| T-S006-01 | S-006 | DOC:api-contract | proof-recorded | no drift | Preserve or refresh create/read/history/generate/download API contract truth. | S-004 and S-005 planned seams; existing API contract | API contract, validation rules, route params, response/error shapes, and maintained API artifacts are current before route implementation. |
| T-S006-02 | S-006 | DOC:permission-mapping | proof-recorded | no gaps | Preserve creator history, root-builder review, unauthenticated/unauthorized denial, tenant cross-scope denial, and download access mapping. | S-006 contract source; existing permission mapping | Permission mapping names allow/deny matrix, grant posture, safe denial, audit/proof visibility, and split routing. |
| T-S006-03 | S-006 | DEV:backend | implemented-proof-recorded | no contamination | Implement protected route behavior for create/read/history/generate/download once API, permission, and persistence contracts are fixed. | T-S005-01, T-S005-02, T-S006-01, T-S006-02 | Route tests prove validation, session, CSRF, root-builder-wide visibility, tenant-scope denial, and no URL authority. |
| T-S007-01 | S-007 | DEV:frontend | implemented-proof-recorded | no drift | Adopt the signed-off design-system Build panel in root-admin without app-local CSS, copied markup, or copied controller behavior. | S-002, T-S006-03, S-008 evidence plan | Browser proof shows root-admin consumes governed seams and renders allowed, inactive, empty, failed, degraded, and PDF states honestly. |
| T-S007-02 | S-007 | DEV:frontend | implemented-proof-recorded | no gaps | Display page/module/role starter context as helpful context only, never as authority for scope or download permission. | T-S007-01, T-S006-03 | Browser/security proof shows context display does not authorize API, tenant scope, or download access. |
| T-S008-01 | S-008 | TEST:test-suite-alignment | proof-recorded | script-first execution | Convert journey inventory IDs into executable test placement, fixture-source rules, and traceability expectations. | PRD-derived test cases; journey inventory | Test placement map exists and identifies which proof belongs to unit, integration, security, audit, visual/browser, or evidence tasks. |
| T-S008-02 | S-008 | EVIDENCE:qa-evidence | proof-recorded-with-db-gap | no gaps | Capture persistence/API live-shape and mock-honesty evidence for conversation/history flows. | T-S005-01, T-S006-03 | Evidence records source-backed payload/schema shape, fixture comparison, process/port posture, and residual DB runtime risk where Postgres config is unavailable. |
| T-S008-03 | S-008 | EVIDENCE:qa-evidence | proof-recorded-with-runtime-gap | no gaps | Capture generated PDF success, denial, retry, and failure evidence. | T-S003-01, T-S005-02, T-S006-03 | Evidence records approved packet data source, denial posture, retry/failure expectations, and no public delivery; deeper renderer proof remains a follow-up. |
| T-S008-04 | S-008 | EVIDENCE:qa-evidence | proof-recorded | no drift | Capture root-admin browser and design-system adoption evidence after first-consumer parity exists. | T-S002-01, T-S007-01, T-S007-02 | Evidence proves rendered root-admin parity, no local reconstruction, served assets, and mock-honesty alignment. |
| T-S009-01 | S-009 | DOC:data-dictionary | proof-recorded | no drift | Finalize data dictionary against implemented conversation, packet, PDF attempt, lifecycle, retention, and audit facts. | S-005 implementation complete | Data dictionary matches code/schema/index/lifecycle truth and data compliance health is recorded. |
| T-S009-02 | S-009 | DOC:api-contract | proof-recorded | no drift | Final API/OpenAPI/Postman or non-maintained rationale sweep after route implementation. | T-S006-03 | API artifacts match implemented route behavior without changing source truth silently. |
| T-S009-03 | S-009 | DOC:permission-mapping | proof-recorded | no gaps | Final permission mapping sweep after route/browser proof. | T-S006-03, T-S007-02 | Mapping matches implemented allow/deny behavior, audit posture, and tenant-boundary proof. |
| T-S009-04 | S-009 | GOV:architecture-update | proof-recorded | no drift | Review feature manifest truth and refresh generated architecture map outputs if public seams or cross-feature dependencies changed. | S-004 through S-007 implementation complete | Generated dependency graph outputs agree with source manifest and architecture rules; any manifest source edit routes to the owning implementation task. |
| T-S009-05 | S-009 | DOC:docs-artifact | queued-for-delivery | no drift | Final source-independent status and Product Request closure sweep. | T-S008 evidence tasks complete; T-S009-01 through T-S009-04 complete | Product Request, Story Breakdown, Task Breakdowns, PRD/test cases, blueprint, and closure notes describe shipped truth. |

## Layer 5 Pilot Sequence

| Sequence | Task(s) | Reason |
| --- | --- | --- |
| 1 | T-S004-01 | Establish the adapter seam before persistence and API route behavior depend on generated packet shape. T-S004-02 remains dependency-blocked until failure persistence exists. |
| 2 | T-S005-01, T-S005-02 | Persist the durable facts before protected route and evidence tasks claim live behavior. |
| 3 | T-S006-01, T-S006-02, T-S006-03 | Lock contract and permission truth before implementing protected browser-facing behavior. |
| 4 | T-S008-01 | Make the proof map executable before collecting evidence; this can happen in parallel with early backend work. |
| 5 | T-S007-01, T-S007-02 | Adopt root-admin UI only after governed DS and protected backend seams are real. |
| 6 | T-S008-02, T-S008-03, T-S008-04 | Capture runtime and browser evidence after implementation exists. |
| 7 | T-S009-01 through T-S009-05 | Close maintained artifacts only after implementation and evidence settle. |

## Story-Local Packet Backfill Plan

| Story | Packet Backfill Status | Required Next Move |
| --- | --- | --- |
| S-004 | validated | Story-local `task-breakdown.md` exists with queued T-S004-01 and dependency-blocked T-S004-02. |
| S-005 | validated | Story-local `task-breakdown.md` exists with queued T-S005-01 and T-S005-02. |
| S-006 | validated | Story-local `task-breakdown.md` exists with queued T-S006-01/T-S006-02 and blocked T-S006-03. |
| S-007 | validated | Story-local `task-breakdown.md` exists; T-S007-01 and T-S007-02 have Layer 5 proof records. |
| S-008 | validated | Story-local `task-breakdown.md` exists; T-S008-01 through T-S008-04 have Layer 5 proof records, with residual DB/renderer runtime gaps called out. |
| S-009 | validated | Story-local `task-breakdown.md` exists; T-S009-01 through T-S009-04 have Layer 5 proof records and T-S009-05 is the final docs closure task. |

## Pilot Rules For Layer 5

- Start from one `queued-for-delivery` Layer 4 task, not a whole story.
- Before editing source, record:
  - exact source authority reviewed
  - exact write envelope
  - exact proof command
  - expected output
  - route-away decisions
  - blocker/debt disposition
- Do not let a Layer 5 task edit another task type's artifact to make itself
  pass.
- If a runtime task changes browser-visible behavior, apply the runtime bug fix
  evidence gate before saying the user should see it.
- When a task reveals missing source truth, stop and route back to the owning
  Layer 4 task rather than improvising inside delivery.
