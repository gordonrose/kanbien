# Story Breakdown Story: Conversation And Packet History Foundation

## Story Narrative

**Situation**
People need confidence that their Build chat conversations and generated
planning documents are not lost, mixed together, or silently overwritten.
Without trustworthy history, approvals and later reviews become hard to rely
on.

**Goal**
The system keeps clear conversation and document history, including who created
it, what scope it belongs to, which version is current, and what older versions
mean.

**Decisions Needed**
We need to agree what history is kept, who can see it, how long it remains
available, when a newer document replaces an older one, and what failed or
abandoned work means.

**Work That Follows**
The work will establish durable history, version behavior, retention rules, and
safe visibility for creators and reviewers.

**Evidence Of Success**
A reviewer can find the right conversation and document version, see when a
newer version replaced an older one, and confirm history is not visible outside
the approved audience.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-001 | In-app harness chat domain | feature-local | future chat or harness-chat feature bundle | approved | DEV:migration-persistence |
| TS-CHAT-008 | Data dictionary and retention truth | feature-local | chat feature data dictionary | approved | DOC:data-dictionary |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Conversation and packet history storage | not-applicable | harness chat backend | build discovery | not-applicable | root-operator | not-applicable | not-applicable | not-topology | none | not-applicable: no route | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | feature-local-state-machine | not-applicable | not-governed | none | not-applicable | not-applicable | Persistence has no direct browser surface; APIs and UI consume it later. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | no | Persistence has no direct browser surface. | S-006 owns protected API session proof. | no |
| csp-assets | no | Persistence has no served asset surface. | not-applicable: no frontend assets | no |
| csrf-mutation | no | Persistence is consumed by protected API mutations later. | S-006 owns CSRF proof. | no |
| url-replay-state | yes | Page/module/role context is durable helpful context but never authority. | Persistence tasks must store context as data, not authorization. | yes |
| sensitive-rendering | yes | Conversations, messages, packet revisions, and history are sensitive planning records. | Persistence tasks must preserve actor/scope/lifecycle facts for later allow/deny proof. | yes |
| asset-delivery | yes | Packet revision history is the source for later PDF attempts and downloads. | Packet revision storage must support immutable packet history and later PDF evidence. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-005 | Durable persistence | yes | Conversations, packet versions, scope, download evidence, retention, and supersession need durable storage planning. | DEV:migration-persistence |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | ready-for-task-breakdown | system-value | DEV:backend | Conversation and packet history foundation | This is its own story because people need confidence that their discovery conversations and generated packets are not lost or mixed together. | As the platform, I need durable conversations, packet versions, history visibility, retention, and supersession owned by a feature seam. | chat feature | Root-admin discovery history and packet state are stored with actor and scope facts. | data dictionary exists; migration details move to Task Breakdown/implementation blueprint |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | S-005 | Conversation records persist actor, platform or tenant scope, page/module/role context, lifecycle state, retention posture, and system-managed timestamps. | persistence-level | persistence integration; lifecycle; validation | data dictionary; migration plan |
| AC-S005-02 | S-005 | Packet records support generated, downloaded, failed, and superseded states, with newer packets marking earlier packets from the same conversation as superseded. | persistence-level | lifecycle; audit; regression | data dictionary; test cases |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-005 | AC-S005-01 | chatInterface.persistConversation | chat feature | create-or-refresh-required | Exact row to be created in capability matrix. |
| S-005 | AC-S005-02 | chatInterface.persistPacketVersion | chat feature | create-or-refresh-required | Exact row to be created in capability matrix. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-005 | S-005 AC-S005-01 | chat conversation persistence | persistence-table-or-index | new | migration plan and data dictionary | persistence integration tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-005 | chat feature, root builder | creator/root-builder authority | active, role changed | conversation new, in progress, abandoned, generated; packet current, superseded | actor, scope, context, ISO timestamps, system-managed fields | new to in-progress to generated or abandoned; generated to superseded | persistence conflict; stale actor scope | privacy; audit; compatibility |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S005-01 | root builder; conversation lifecycle | chatInterface.persistConversation | persistence-level | TC obligation: persistence and lifecycle states | yes |
| AC-S005-02 | root builder; packet supersession | chatInterface.persistPacketVersion | persistence-level | TC obligation: generated/downloaded/failed/superseded states | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-008 | S-005 | data dictionary | prove-current | data-dictionary-maintainer | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-005 | ready-for-task-breakdown | Data dictionary captures planned conversations, messages, packet revisions, PDF attempt evidence, lifecycle states, actor/scope facts, retention posture, and supersession rules; migration details move to implementation blueprint and Task Breakdown. |
