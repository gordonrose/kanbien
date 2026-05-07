# Story Breakdown Story: Work Panel And Chat Design System Governance

## Story Narrative

**Situation**
The root builder needs one clear place to use Build chat, but the system must
not invent a one-off panel that later product areas cannot reuse or trust.

**Goal**
The system has an approved panel and chat pattern for the first Build
experience, including desktop, mobile, history, starter prompts, inactive
actions, and the planning-document download action.

**Decisions Needed**
We need to confirm which shared panel and conversation pattern owns the
experience and what proof is required before the real root-admin screen uses
it.

**Work That Follows**
The work will establish the shared visual and interaction pattern, then prove
the root-admin screen uses that pattern instead of rebuilding it locally.

**Evidence Of Success**
Stakeholders can review the sample experience, understand how it behaves, and
trust the real root-admin screen to match it across desktop, mobile, empty,
denied, failed, and degraded states.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-003 | Root-admin panel adoption | design-system-seam | design-system-owned right-panel and mobile floating action family consumed by root-admin shell | approved | GOV:design-system |
| TS-CHAT-011 | Reusable chat and panel logic | shared-lib-candidate | chat feature domain first, shared extraction only after another active consumer | deferred-with-owner | DECISION:refactor-first |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin work panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | DS-task-required | shell-registry-update | shell-bootstrap | ready | App adoption is gated by governed design-system seams. |
| Build chat browser workflow | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build panel state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Chat flow state belongs to the chat feature/controller, not durable topology. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin panel and chat actions use existing authenticated browser session posture. | Governed canonical and app adoption proof must not bypass session-based route access. | yes |
| csp-assets | yes | Design-system canonical and app adoption must use served, approved assets. | Visual proof must run against served routes and CSP-compatible assets. | yes |
| csrf-mutation | yes | Chat generation/download actions may become protected browser mutations downstream. | Design-system behavior must not fake mutation authority or encode secrets. | yes |
| url-replay-state | yes | Panel state and starter prompts are UI state, not authority. | Canonicals and app adoption must avoid sensitive replay state in URLs. | yes |
| sensitive-rendering | yes | Conversation history and generated packet status may render sensitive planning information. | Denied, empty, failed, degraded, and allowed states need explicit evidence. | yes |
| asset-delivery | yes | PDF download affordance points to approved generated-document delivery posture. | Download action must remain an affordance until protected API/download tasks exist. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-002 | Governed work panel and conversation-panel seam | yes | Technical Steering requires DS-owned render, behavior, accessibility, style, canonical, and adoption contract before root-admin app UI implementation. | GOV:design-system |
| S-002 | Reusable panel/chat extraction decision | no | Shared extraction is deferred until another active consumer exists; MVP should keep reusable logic governed without broad shared-lib extraction. | DECISION:refactor-first |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | ready-for-task-breakdown | system-value | GOV:design-system | Work panel and chat design-system governance | This is needed so the root builder has one clear place to use Build chat because a one-off panel would be hard for later product areas to reuse or trust. | As design-system governance, I need a signed-off work panel and chat seam for desktop, mobile, history, starter prompts, inactive actions, and PDF affordance before root-admin app adoption. | design-system/frontend governance | Governed render, behavior, accessibility, style, canonical, and adoption contract exist for downstream root-admin consumption. | S-007 root-admin adoption |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | S-002 | Design-system artifacts define the right-side panel, mobile floating action, chat thread, contextual starter prompts, history posture, PDF action, and inactive Reporting/Support states. | human-visible-parity | visual; accessibility; interaction; responsive | design-system behavior lock; reference pack; verification |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-002 | AC-S002-01 | chatInterface.designSystemWorkPanel | governed frontend seam | not-capability-backed | Design-system governance is upstream of runtime feature capability delivery. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-002 | S-002 AC-S002-01 | design-system-owned work panel and conversation-panel family | design-system-seam | existing-or-new | behavior lock, canonical route, shared render/controller/accessibility/style consumption contract | visual, interaction, accessibility, and adoption evidence before S-007 |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-002 | root builder; root reviewer | root-admin session; denied/unauthenticated session | active; unauthenticated; unauthorized | empty history; active conversation; generated packet ready; generation failed; download failed; Reporting/Support inactive | starter prompts must not create authority; PDF affordance must not expose public URL | empty to active; active to packet ready; ready to download affordance; failed to retry | degraded service; denied action; failed generation; failed download | accessibility; responsive layout; keyboard behavior; security posture; mock honesty |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S002-01 | root builder and denied actor across desktop/mobile, empty, active, failed, degraded, and PDF affordance states | chatInterface.designSystemWorkPanel | human-visible-parity | TC obligation: governed design-system visual, interaction, accessibility, security, and adoption proof | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| BLK-SB-CHAT-002 | S-007 | design-system-governance | Root-admin app adoption cannot proceed by copying design-system markup, controller behavior, ARIA semantics, or CSS. | Consumable design-system render, behavior, accessibility, and style seams with adoption contract. | Block S-007 if the seam is missing or CSS-only. |
| BLK-SB-CHAT-002B | future shared extraction | refactor-first | Shared panel/chat extraction beyond the governed design-system seam is deferred until another active consumer exists. | Future refactor-first decision before broad shared-lib extraction. | Do not extract broad shared library during MVP Build-only work. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-CHAT-002 | BLK-SB-CHAT-002 | Which design-system-owned render, behavior, accessibility, style, canonical, and adoption seams must root-admin consume for the Build work panel? | yes | Use governed design-system work panel/conversation panel seams; app-local reconstruction is drift unless explicitly approved. |
| Q-CHAT-002B | BLK-SB-CHAT-002B | Should reusable chat/panel orchestration be extracted as a shared library during MVP? | yes | No; keep shared-lib extraction deferred until another active consumer exists. |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-002 | S-002 | design-system behavior lock and canonical evidence | prove-current | frontend-design-system-loop-maintainer | no |
| ART-CHAT-002B | S-002 | design-system adoption artifact | prove-current | frontend-design-system-loop-maintainer | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-002 | ready-for-task-breakdown | Story has one governed design-system task that must preserve or produce the consumable work panel/conversation-panel seam before root-admin app adoption. |
