# Story Breakdown Story: Generated Packet Pdf Delivery Decision

## Story Narrative

**Situation**
Today, a builder can use the app to shape a short planning document that
explains what someone wants to build, why it matters, what is in scope, and
what decisions are still open. But there is no safe, official way to turn that
approved document into a PDF for a meeting, approval, or long-term record. If
we rush this, we could create files that include draft conversation, show the
wrong version, or expose information to the wrong person.

**Goal**
A builder can download a clean PDF of the approved planning document, and
everyone can trust that it represents the right version.

**Decisions Needed**
We need to agree what the PDF includes, who can download it, whether older
approved versions remain available, what happens when PDF creation fails, and
what limits keep the process reliable.

**Work That Follows**
The work will establish the download path, connect it to document history,
protect access, and record success or failure without exposing private details.

**Evidence Of Success**
A reviewer can download the right document, see that older versions are handled
clearly, confirm draft chat text is not included, and verify that unauthorized
users cannot get the file.

## Status

- Packet status:
  `ready-for-task-breakdown`

## Handoff Validation

- Architecture invention check:
  `consumes-steering-only`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-007 | Generated Product Discovery packet PDF | architecture-foundation-required | asset/download governance plus packet-rendering decision | approved | DECISION:architecture-foundation |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PDF download action | root-admin | in-app harness chat | packet export | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build packet action | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | never-serialize | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Download authorization and scope are server-side; no secrets or authority in URL state. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | API/security tests must prove unauthenticated and unauthorized denial. | yes |
| csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and design-system entrypoints. | Frontend/design-system implementation must preserve CSP-compatible asset loading. | yes |
| csrf-mutation | yes | PDF generation and download may be browser-triggered protected actions. | Route contracts must use existing CSRF/session protections for browser mutations. | yes |
| url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Tests must prove authority comes from server session/current context, not URL state. | yes |
| sensitive-rendering | yes | Generated packet PDFs may include platform change intent and approval history. | Redaction/visibility tests and mock-honesty checks required. | yes |
| asset-delivery | yes | Generated PDF download needs an approved transient generated-file posture. | Asset consumer decision record required before implementation. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-003 | Asset/download architecture decision | yes | Generated PDFs need an asset consumer decision record before implementation. | DECISION:architecture-foundation |

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | ready-for-task-breakdown | system-value | DECISION:architecture-foundation | Generated packet PDF delivery decision | This is its own story because creating a downloadable packet affects trust, privacy, storage, retention, and what people can safely share. | As architecture governance, I need a decision record for generated packet PDF delivery, storage, retention, access, MVP rendering scope, future reuse boundary, scale, latency, failure, operations, and reversibility before PDF implementation. | architecture/security | Delivery/storage/rendering direction and configurable MVP numeric thresholds are approved. | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | S-003 | Asset consumer decision record chooses transient generation or stored generated PDF delivery and states retention, download authorization, audit, failure, public-delivery denial, MVP rendering scope, future reusable generated-document boundary, scale/concurrency, latency, deterministic output, provider/runtime, operations, and reversibility posture. | source-level | security review; asset governance review; architecture interview review | asset consumer decision record |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-003 | AC-S003-01 | chatInterface.packetPdfDeliveryDecision | asset/download governance | not-capability-backed | Architecture foundation decision, not a runtime capability row. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-003 | S-003 AC-S003-01 | generated packet PDF asset/download decision | asset-consumer-seam | existing | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md | security and download authorization tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-003 | architecture/security owner | asset/download decision authority | active | PDF not generated, generated, downloaded, failed, superseded | transient generated download, no public URL, actor-bound access, approved packet data only | no decision to approved decision | rendering failure; storage failure; unauthorized download | security; privacy; audit; retention |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S003-01 | root builder; PDF generated/downloaded/failed | chatInterface.packetPdfDeliveryDecision | source-level | TC obligation: asset/download decision coverage | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| BLK-SB-CHAT-001 | S-003 | asset-decision | Generated PDF delivery cannot be implemented until approved delivery/storage/access posture, MVP rendering scope, future reuse boundary, and numeric implementation thresholds are carried into the implementation artifacts. | Human-reviewed asset consumer decision record plus PRD/API/blueprint numeric thresholds. | Resolved for MVP: delivery/storage/rendering direction and configurable MVP numeric thresholds are approved in the asset consumer decision record. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-CHAT-001 | BLK-SB-CHAT-001 | Should generated packet PDFs be transient downloads regenerated from packet data, or stored generated files with their own lifecycle? | yes | Answered: transient generated download from durable packet data is approved for the MVP. |
| Q-CHAT-001B | BLK-SB-CHAT-001 | Should PDF generation be usable by other features in future, or be a one-off Product Discovery renderer? | yes | Answered: it should be usable by other features in future through a reusable generated-document boundary, with Product Discovery as the first consumer. |
| Q-CHAT-001G | BLK-SB-CHAT-001 | Which reliable no-paid-provider PDF renderer should the MVP use? | yes | Answered: use self-hosted Playwright/Chromium as the preferred MVP renderer behind a provider-neutral generated-document seam. |
| Q-CHAT-001P | BLK-SB-CHAT-001 | Should the generated-document seam accept a generic structured document model, or feature-owned packet data plus a mapper? | yes | Answered: Product Discovery owns approved packet data and maps it into a renderer-neutral document shape. |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-005 | S-003 | asset consumer decision record | prove-current | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-003 | ready-for-task-breakdown | Asset consumer decision record captures approved transient generated download, simple structured export rendering, preferred Playwright/Chromium renderer, future-usable generated-document boundary, configurable MVP numeric limits, and alert thresholds. |
