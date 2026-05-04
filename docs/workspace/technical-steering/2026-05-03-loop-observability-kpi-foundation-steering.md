# Technical Steering Packet: Loop Observability And KPI Foundation

## Status

- Packet status: `blocked`
- Packet date: 2026-05-03
- Steering ID: `TS-2026-05-03-loop-observability-kpi-foundation`
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-03-loop-observability-kpi-foundation.md`
- Related ADRs reviewed:
  - `docs/architecture/adr/0002-use-feature-bundle-architecture.md`
  - `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
  - `docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md`
- Validation status: `not-run`

## Product Handoff

- Product Discovery status: `discovery-only`
- Product intent preserved: yes. The architecture must support durable loop
  evidence, task/change/artifact traceability, scorecard KPIs, improvement
  records, and future API/UI/OLAP paths without turning v0 into a generic
  project management tool.
- Product questions resolved or carried as blockers:
  - Human refresh/signoff gate is unresolved in Product Discovery.
  - v0 tracks internal harness/Codex loops first.
  - customer/tenant visibility is out of scope.
  - durable capture and scorecard reads come before UI and OLAP.
  - broader human-driven loop adoption is deferred.
  - exact redaction, retention, actor identity, scoring rubric, and OLAP
    delivery mechanics are technical decisions.
- New family or template decision: `approved-new-family`

## Architecture Classification

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |
| TS-LOOP-001 | Durable loop evidence domain | feature-local | src/features/loopObservability | approved | Loop evidence has durable entities, lifecycle, reads, and feature-owned persistence. Feature bundle architecture is the clean owner. | DEV:migration-persistence |
| TS-LOOP-002 | Harness recording helper | platform-seam | platform/harness helper consuming loopObservability public seam | approved | The harness needs a stable way to open/close loops and append evidence without direct database writes. | DEV:platform-seam |
| TS-LOOP-003 | Scorecard projection | feature-public-seam | loopObservability domain/read model | approved | Scorecards should be derived from persisted evidence and exposed through an explicit read seam. | EVIDENCE:qa-evidence |
| TS-LOOP-004 | Git/PR changed artifact ingestion | platform-seam | harness/GitHub ingestion adapter feeding loopObservability | approved | Git/PR metadata is the source of truth for changed paths; classification belongs near harness/tooling and persists through feature seam. | DEV:platform-seam |
| TS-LOOP-005 | Internal/root APIs | feature-public-seam | loopObservability/transport | approved | Future UI and tooling need stable route contracts; v0 may expose internal/root APIs after permission mapping. | DOC:api-contract |
| TS-LOOP-006 | Root/internal permission posture | feature-local | loopObservability protected route policy | approved | V0 is root/internal only, so exposed routes and helpers need explicit permission mapping. | DOC:permission-mapping |
| TS-LOOP-007 | Durable entity dictionary | feature-local | loopObservability data dictionary | approved | New loop evidence records, lifecycle states, and persistence semantics require source-independent field documentation. | DOC:data-dictionary |
| TS-LOOP-008 | Artifact and standards documentation | feature-local | loopObservability maintained artifacts | approved | PRD, ADR, API contracts, data dictionary, and harness standards docs must remain aligned with implementation truth. | DOC:docs-artifact |
| TS-LOOP-009 | Reusable rubric/classification pressure | shared-lib-candidate | loopObservability domain first, shared-lib only after second consumer | deferred-with-owner | Artifact classification and KPI rubric logic may become reusable, but v0 should keep it feature-local unless reuse is proven. | DECISION:refactor-first |
| TS-LOOP-010 | Future root/internal UI | design-system-seam | design-system plus future root/internal app adoption | deferred-with-owner | UI is not v0 capture work and must not begin before governed design-system posture is settled. | GOV:design-system |
| TS-LOOP-011 | OLAP export | platform-seam | derived export through transactional outbox/job-processing seam | deferred-with-owner | OLAP must be derived from app-owned truth and retryable; mechanics should align with job/outbox foundation. | DEV:platform-seam |
| TS-LOOP-012 | Architecture decision record | architecture-foundation-required | ADR for loop observability/evidence foundation | approved | This creates an enduring evidence and KPI foundation used by the harness and future tooling. | DECISION:architecture-foundation |

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |
| API route or contract change | yes | Internal/root routes are expected for loop runs, tasks, events, metrics, scorecards, and traceability reads. | API contract story required. | `DOC:api-contract` |
| persistence or migration change | yes | New durable entities include loop runs, tasks, events, metrics, change sets, artifacts, defects, regressions, and improvement actions. | Persistence story required. | `DEV:migration-persistence` |
| authz or permission change | yes | V0 is root/internal only; permission mapping is required before routes are exposed. | Permission mapping story required. | `DOC:permission-mapping` |
| DEV:frontend rendered surface | no | UI is deferred and blocked from v0 implementation. | Future UI story only. | `DEV:frontend` if later approved |
| governed GOV:design-system seam | no | No v0 UI. Future scorecard/timeline/trace UI may need governed pattern work. | Future design-system steering before UI. | `GOV:design-system` |
| shared platform/runtime seam | yes | Harness helpers, git/PR ingestion, and later export are platform/tooling seams. | Platform helper story required. | `DEV:platform-seam` |
| reusable logic or extraction pressure | yes | Artifact classification and KPI rubric logic may become reusable across harness flows. | Keep v0 feature-local unless second consumer proves extraction. | `DECISION:refactor-first` if extraction proposed |
| data dictionary impact | yes | New durable entities and lifecycle fields. | Data dictionary story required. | `DOC:data-dictionary` |
| QA/runtime evidence need | yes | Loop scorecard must prove evidence integrity, append-only behavior, and projection correctness. | PRD-derived test cases and persistence-backed tests required. | `EVIDENCE:qa-evidence` |
| source-independent docs impact | yes | PRD, Product Discovery, Technical Steering, ADR, API contracts, data dictionary, and standards/harness docs may change. | Artifact sweep story required. | `DOC:docs-artifact` |

## Frontend Architecture Classification

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V0 durable capture and APIs | not-applicable | loopObservability | evidence capture | not-applicable | support/operator | not-applicable | not-applicable | not-topology | none | not applicable | not applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | ready | No rendered frontend in v0. |

## Browser Security Posture

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | no | No browser surface in v0. | not applicable | no |
| csp-assets | no | No served frontend assets in v0. | not applicable | no |
| privileged-helper | yes | Harness helper may record evidence through an internal seam. | helper must avoid storing secrets/session material and use approved root/internal authority. | yes |
| csrf-mutation | no | No browser mutation route in v0. If HTTP routes are exposed later, standard root/internal API protections apply. | API security story if route is browser-callable. | no |
| url-replay-state | no | No replay links in v0. | not applicable | no |
| sensitive-rendering | no | UI deferred. Future UI must redact sensitive event payloads. | future UI security review. | no |
| asset-delivery | no | No user-managed assets. | not applicable | no |

## Artifact Obligations

| Artifact | Required Action | Owner Layer | Blocks Handoff | Notes |
| --- | --- | --- | --- | --- |
| Product Discovery packet | prove-current | Layer 1 | yes | Created at docs/workspace/product-discovery/2026-05-03-loop-observability-kpi-foundation.md. |
| PRD proposal | update | Layer 3 | yes | Existing draft PRD should be reconciled with Technical Steering decisions. |
| ADR | create | Layer 2/3 | yes | Required because loop observability becomes an enduring evidence foundation and harness seam. |
| Capability matrix | create | Layer 3 | yes | Required before implementation blueprint/task breakdown. |
| PRD-derived test cases | create | Layer 3 | yes | Required for persistence, scorecard, traceability, API, and helper behavior. |
| Implementation blueprint | create | Layer 3 | yes | Required before implementation tasks. |
| API contract docs | create | Layer 4 | yes | Required when route contracts are introduced. |
| Data dictionary | create | Layer 4 | yes | Required for durable entities. |
| Permission mapping | create | Layer 4 | yes | Required before exposed root/internal routes. |
| Feature manifest | create | Layer 4 | yes | Required for new feature bundle. |
| Feature dependency graph | update | Layer 4 | yes | Required after feature manifests or dependencies change. |
| Design-system artifacts | defer-approved | Future UI layer | no | Required before real app UI. |
| OLAP export/runbook docs | defer-approved | Future export layer | no | Required before export implementation. |

## Deterministic Signal Checks

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? | yes | Harness helper, git/PR ingestion, and future export seams. | platform-seam | DEV:platform-seam | Approved as narrow helper seams that consume feature public APIs. |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | Future internal/root API routes are planned. | feature-public-seam | DOC:api-contract | Route work must include API contract docs. |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? | yes | New durable loop evidence schema. | feature-local | DEV:migration-persistence | Persistence is owned by loopObservability. |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? | yes | Root/internal routes and helpers require authorization posture. | feature-local | DOC:permission-mapping | V0 is root/internal only. |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? | no | UI deferred from v0. | design-system-seam | GOV:design-system | Future UI must re-enter steering/design-system loop. |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | no | No frontend in v0. | feature-local | DEV:frontend | Future UI blocked until design-system posture exists. |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into src/lib? | yes | Artifact classification and rubric logic may become reusable. | shared-lib-candidate | DECISION:refactor-first | Keep feature-local in v0 unless multiple consumers emerge. |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? | yes | New loop evidence entities and lifecycle states. | feature-local | DOC:data-dictionary | Data dictionary required. |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? | yes | Scorecards and traceability must be proven by persistence-backed tests and helper/API tests. | feature-public-seam | EVIDENCE:qa-evidence | Browser runtime evidence not needed until UI. |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? | yes | PRD, ADR, API contracts, data dictionary, standards/harness docs. | feature-local | DOC:docs-artifact | Artifact sweep required before implementation completion. |

## Steering Decisions

| Decision ID | Decision | Rationale | Compatibility / Migration Strategy | Downstream Owner |
| --- | --- | --- | --- | --- |
| DEC-LOOP-001 | Create `loopObservability` as a feature bundle for durable loop evidence. | Feature bundle architecture keeps persistence, domain, contract, transport, and manifest ownership explicit. | Additive new feature; no existing contracts broken. | Story Breakdown / Implementation Blueprint |
| DEC-LOOP-002 | Expose harness/platform helpers as narrow consumers of the feature public seam, not direct database writers. | The harness needs ergonomic capture, but direct SQL would bypass validation, lifecycle, and audit semantics. | Additive helper seam. Existing harness remains unchanged until adoption tasks opt in. | Implementation Blueprint |
| DEC-LOOP-003 | Use append-only events and metric snapshots as evidence records. | Scorecards and future rubrics need recomputable evidence rather than narrative-only closure. | Additive schema. Corrections should use events rather than overwriting history-sensitive facts. | Capability Matrix / Data Dictionary |
| DEC-LOOP-004 | Treat git/PR metadata as changed-path truth and the harness as artifact classifier/enricher. | This prevents manual declarations from becoming dishonest or incomplete. | Existing git workflow remains valid; commit trailers are optional until separately approved. | Implementation Blueprint |
| DEC-LOOP-005 | Keep v0 root/internal only. | Loop evidence can contain sensitive operational, security, and prompt-derived summaries. | No tenant/customer contract. Future exposure requires new steering/security review. | API Contract / Permission Mapping |
| DEC-LOOP-006 | Defer UI until read APIs and design-system posture exist. | The first value is durable capture and scorecard truth; UI must not invent missing facts or add app CSS. | Future UI enters GOV:design-system loop. | Future frontend/story packet |
| DEC-LOOP-007 | Defer OLAP export until app-owned capture/read model is stable. | OLAP is derived analytics, not the source of truth; export should be idempotent and retryable. | Use future job/outbox seam when ready. | Future export story |
| DEC-LOOP-008 | Create an ADR before implementation blueprint signoff. | This is an enduring evidence/KPI foundation and harness seam. | ADR is additive and should cite Product Discovery, PRD, and Technical Steering. | Architecture owner |

## Blockers

| Blocker ID | Blocks | Blocker Type | Required Output | Owner |
| --- | --- | --- | --- | --- |
| BLK-LOOP-000 | Technical Steering promotion | product gate | Requester confirms prior context is enough to proceed or re-runs Product Discovery interview | Requester / Product Discovery owner |
| BLK-LOOP-001 | Implementation task breakdown | architecture artifact | ADR for loop observability/evidence foundation | Architecture owner |
| BLK-LOOP-002 | Implementation task breakdown | planning artifact | Capability matrix and implementation blueprint | Planning owner |
| BLK-LOOP-003 | Exposed API routes | security/contract artifact | API contract docs and permission mapping | Backend/API owner |
| BLK-LOOP-004 | Real UI implementation | design-system/frontend artifact | Design-system posture and governed adoption plan | Frontend/design-system owner |

## Layer 3 Handoff

| Story Scope Element | Handoff Status | Required Classification IDs | Notes |
| --- | --- | --- | --- |
| ADR and PRD reconciliation | blocked | TS-LOOP-012 | Blocked until Product Discovery human refresh/signoff gate is resolved. |
| Durable capture foundation | blocked | TS-LOOP-001 | Blocked until Product Discovery human refresh/signoff gate is resolved. |
| Scorecard projection | blocked | TS-LOOP-003 | Blocked until Product Discovery human refresh/signoff gate is resolved. |
| Traceability/regression linking | blocked | TS-LOOP-001, TS-LOOP-003 | Blocked until Product Discovery human refresh/signoff gate is resolved. |
| Harness recording helper | blocked | TS-LOOP-002, TS-LOOP-004 | Blocked until Product Discovery human refresh/signoff gate is resolved. |
| Internal/root APIs | blocked | TS-LOOP-005, TS-LOOP-006 | Blocked until Product Discovery human refresh/signoff gate is resolved. |
| Future UI | blocked | TS-LOOP-010 | Blocked until Product Discovery human refresh/signoff gate is resolved and future UI scope is approved. |
| Future OLAP export | blocked | TS-LOOP-011 | Blocked until Product Discovery human refresh/signoff gate is resolved and export scope is approved. |
