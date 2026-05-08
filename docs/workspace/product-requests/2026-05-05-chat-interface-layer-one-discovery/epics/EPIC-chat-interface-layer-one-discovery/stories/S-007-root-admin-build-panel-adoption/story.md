# Story Breakdown Story: Root Admin Build Panel Adoption

## Story Narrative

**Situation**
Root builders need a clear Build entry point inside the root-admin workspace,
while Reporting and Support remain visible but inactive. If this screen
rebuilds the approved panel locally, the real app can drift away from the
approved experience.

**Goal**
The root-admin workspace shows Build as the active chat flow and presents
Reporting and Support as coming-soon actions through the approved shared
pattern.

**Decisions Needed**
We need to confirm the approved panel behavior is ready for first use and that
the root-admin screen will use it without local reinvention.

**Work That Follows**
The work will connect the root-admin workspace to the approved panel and chat
experience, including desktop, mobile, history, starter prompts, inactive
actions, and PDF download states.

**Evidence Of Success**
Stakeholders can use the root-admin screen, see Build as the active path,
understand Reporting and Support are not active, and verify the screen matches
the approved shared experience.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-004 | Root-admin app integration | feature-public-seam | root-admin shell/module adoption consuming design-system seams and chat public seam | approved | DEV:frontend |
| TS-CHAT-009 | QA and browser evidence | feature-public-seam | chat feature tests plus root-admin browser scenarios | approved | EVIDENCE:qa-evidence |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin Build panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | signed-off-seam-exists | shell-registry-update | shell-bootstrap | ready | Root-admin app adoption is ready for Layer 4 task definition and can consume the signed-off seam once protected APIs are available. |
| Page/module/role starter context display | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | journey | ui-state | none | root-admin Build panel state | not-applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | signed-off-seam-exists | shell-registry-update | shell-bootstrap | ready | Context renders through the signed-off Build panel seam as helpful prompt data only; protected API proof exists for Layer 5 delivery. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | Frontend tasks must require allowed and denied browser proof. | yes |
| csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and design-system entrypoints. | Frontend tasks must consume DS assets without app-local CSS. | yes |
| csrf-mutation | yes | Browser-triggered chat actions are protected mutations. | Frontend tasks must consume protected APIs; backend owns CSRF proof. | yes |
| url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Frontend tasks must display context as helpful data only. | yes |
| sensitive-rendering | yes | Chat transcripts and packets may include platform or tenant change intent. | Frontend tasks must require denied/unauthorized/expired proof. | yes |
| asset-delivery | yes | PDF download action needs approved generated-document delivery posture. | Frontend tasks must consume authorized download API only. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-007 | Frontend adoption | yes | Root-admin panel and Build chat are rendered browser workflows. | DEV:frontend |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-007 | ready-for-task-breakdown | user-value | DEV:frontend | Root-admin Build panel adoption | This is its own story because the root builder needs one clear place to use Build while still understanding that Reporting and Support are not active yet. | As a root builder, I need the root-admin panel to expose Reporting and Support as coming-soon actions and Build as the active chat flow. | root builder | Root-admin consumes design-system seams and chat APIs without app-local CSS or copied controller behavior. | S-002 and S-006 |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | S-007 | Root-admin app adoption consumes signed-off design-system seams for panel, mobile action, chat flow, starter prompts, history, inactive actions, and PDF action. | rendered-browser | browser; visual; accessibility; responsive | design-system adoption; frontend evidence |
| AC-S007-02 | S-007 | Page/module/role starter context is displayed as helpful context and never becomes authority for scope or download permission. | runtime-api | browser; security; URL replay | API contract; permission mapping; browser tests |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-007 | AC-S007-01 | chatInterface.rootAdminPanelAdoption | root-admin frontend | create-or-refresh-required | App adoption row depends on DS artifacts. |
| S-007 | AC-S007-02 | chatInterface.contextIsNotAuthority | security | create-or-refresh-required | Security capability row needed. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-008 | S-007 AC-S007-01 | root-admin shell and DS adoption seams | frontend-topology-route | existing and new | adoption artifact and shell registry proof | rendered browser scenarios |
| DEP-CHAT-011 | S-007 AC-S007-02 | protected chat APIs and permission mapping | API/security | new | API contract and permission mapping | URL replay and denied-state browser proof |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-007 | root builder | authenticated root builder | desktop, mobile, denied, empty, failed, degraded | panel closed/open, Build active, Reporting/Support inactive, history visible | display context only; no URL authority | open panel, start chat, view history, request PDF | API unavailable; DS seam unavailable | accessibility; performance; human-visible parity |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S007-01 | root builder desktop/mobile/empty/failed/degraded | chatInterface.rootAdminPanelAdoption | rendered-browser | TC obligation: app consumes DS seams and renders Build active with Reporting/Support inactive | yes |
| AC-S007-02 | root builder context display and denied states | chatInterface.contextIsNotAuthority | runtime-api | TC obligation: context display never grants API scope, tenant scope, or download authority | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| BLK-SB-CHAT-007 | S-007 | dependency | Root-admin adoption needs protected APIs, permission mapping, and runtime evidence inputs. | Completed S-006 backend and S-008 evidence placement. | Stop if app UI would be built from mocks without contract/runtime truth. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-004 | S-007 | GOV:design-system artifacts | prove-current | frontend-design-system-loop-maintainer | no |
| ART-CHAT-011 | S-007 | frontend browser evidence | create-after-implementation | EVIDENCE:qa-evidence | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-007 | ready-for-task-breakdown | Design-system adoption source exists, but delivery tasks remain dependency-blocked until protected APIs and evidence placement are complete. |
