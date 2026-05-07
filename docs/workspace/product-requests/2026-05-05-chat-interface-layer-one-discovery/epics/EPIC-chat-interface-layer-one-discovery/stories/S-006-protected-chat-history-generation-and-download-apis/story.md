# Story Breakdown Story: Protected Chat History Generation And Download Apis

## Story Narrative

**Situation**
Starting a chat, returning to history, generating a planning document, and
downloading a PDF are separate actions that people expect to work reliably. If
access is loose or unclear, the wrong person could see, change, or download
planning information.

**Goal**
Only the right root-admin users can start chats, view allowed history, generate
approved documents, and download the correct PDFs.

**Decisions Needed**
We need to agree who can create, review, generate, and download; how denied
actions are explained; and how the system prevents page context or links from
becoming authority.

**Work That Follows**
The work will establish protected entry points for chat, history, document
generation, and download, with clear validation and denial behavior.

**Evidence Of Success**
A reviewer can confirm allowed users can complete the expected actions,
unauthorized users are denied, cross-scope access is blocked, and helpful page
context never grants access by itself.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-005 | Conversation and packet APIs | feature-public-seam | chat feature transport contract | approved | DOC:api-contract |
| TS-CHAT-006 | Root-builder and future tenant-builder authorization | feature-local | chat feature policy plus existing root/tenant authorization platform | approved | DOC:permission-mapping |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Protected chat and packet APIs | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | journey | not-topology | none | root-admin Build panel API calls | not-applicable: no route topology | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | API and permission contracts are ready for Task Breakdown; runtime implementation remains dependency-blocked. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | API/security tests must prove unauthenticated and unauthorized denial. | yes |
| csp-assets | no | API contract has no served frontend asset surface. | not-applicable: frontend proof belongs to S-007. | no |
| privileged-helper | yes | Generation may execute privileged Product Discovery packet behavior. | Backend task must consume S-004 adapter and deny missing authority. | yes |
| csrf-mutation | yes | Creating conversations, appending messages, generating packets, and download preparation are protected browser mutations. | API contract and backend task must preserve existing CSRF/session protections. | yes |
| url-replay-state | yes | Helpful page/module/role context must not become authority. | Contract and permission tasks must state that authority comes from server-side session/current context. | yes |
| sensitive-rendering | yes | Conversation, history, packet, and download responses expose sensitive planning records. | Permission and backend tasks must prove allow/deny behavior. | yes |
| asset-delivery | yes | PDF download is governed by the approved generated packet PDF decision. | Contract must use approved delivery posture and avoid public delivery. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-006 | API contract | yes | Browser workflow requires protected conversation, history, generation, packet revision, and download routes. | DOC:api-contract |
| S-006 | Permission mapping | yes | Creator history, root-builder review, tenant-scope deny, and download access require authz mapping. | DOC:permission-mapping |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-006 | ready-for-task-breakdown | system-value | DEV:backend | Protected chat, history, generation, and download APIs | This is its own story because starting chats, returning to history, generating packets, and downloading files are separate things people expect to work reliably. | As the root-admin browser, I need protected API contracts for conversation, history, packet generation, and PDF download. | root-admin API consumer | Routes enforce validation, session, CSRF, root-builder-wide visibility, and tenant-scope deny posture. | API contract and data dictionary exist; implementation order depends on blueprint |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | S-006 | API contracts define create/read/history/generate/download behavior, exact route params, ISO timestamps, normalized validation, and rejection of system-managed client fields. | contract-level | API contract; validation | API contract docs; OpenAPI/Postman if maintained |
| AC-S006-02 | S-006 | Permission mapping proves creator history access, root-builder review access, unauthenticated denial, unauthorized denial, and tenant cross-scope denial. | runtime-api | authz allow/deny; tenant boundary | permission mapping; test cases |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-006 | AC-S006-01 | chatInterface.rootAdminApiContracts | API | prove-current | API contract exists at `docs/api-contracts/chat-interface-layer-one-discovery.md`. |
| S-006 | AC-S006-02 | chatInterface.enforceDiscoveryChatAccess | authz | prove-current | Permission mapping exists for root-builder-wide root-admin review and tenant-layer deny posture. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-006 | S-006 AC-S006-01 | chat transport routes | feature-public-seam | new | docs/api-contracts/chat-interface-layer-one-discovery.md | runtime API tests |
| DEP-CHAT-007 | S-006 AC-S006-02 | root and tenant authorization platform | authz-capability | existing and new | docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md | authz allow/deny tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-006 | root builder, unauthenticated actor, unauthorized root user, future tenant builder | root-builder allowed; unauthorized denied; tenant-scope denied until approved | authenticated, unauthenticated, unauthorized, expired | conversation new/in-progress/generated/abandoned; packet generated/downloaded/failed/superseded | exact route params, ISO timestamps, system-managed fields rejected, no URL authority | message append; packet generation; download request; denial | adapter failure; missing conversation; invalid packet; forbidden download | security; privacy; compatibility; audit |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S006-01 | root-admin browser and API consumer | chatInterface.rootAdminApiContracts | contract-level | TC obligation: API contract, validation, exact route params, ISO timestamps, and system-managed field rejection | yes |
| AC-S006-02 | authenticated root builder, unauthenticated, unauthorized, future tenant builder | chatInterface.enforceDiscoveryChatAccess | runtime-api | TC obligation: creator history access, root-builder review access, unauthenticated denial, unauthorized denial, and tenant cross-scope denial | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-009 | S-006 | API contract | prove-current | api-contract-maintainer | no |
| ART-CHAT-010 | S-006 | permission mapping | prove-current | permission-mapping workflow | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-006 | ready-for-task-breakdown | API and permission source-truth tasks can queue now; backend implementation remains dependency-blocked until S-004, S-005, API contract, and permission mapping are complete. |
