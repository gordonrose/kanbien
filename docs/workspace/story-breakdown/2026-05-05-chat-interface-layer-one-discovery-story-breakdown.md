# Story Breakdown: Chat Interface For Layer One Product Discovery

## Status

- Packet status:
  blocked
- Packet date:
  2026-05-06
- Epic ID:
  EPIC-CHAT-INTERFACE-LAYER-ONE-DISCOVERY
- Epic title:
  Chat interface for Layer One Product Discovery
- Source Product Discovery packet:
  docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md
- Source Technical Steering packet:
  docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md
- Related PRD:
  docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md
- Related capability matrix:
  docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  Build work panel design-system governance exists at
  docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md,
  docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md,
  docs/workspace/design-system/patterns/build-work-panel-pattern.md,
  docs/workspace/design-system/verification/build-work-panel-verification-checklist.md,
  and
  docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md.
  The design-system path is answered as the `build-work-panel` family consuming
  the neutral `conversationPanel.mjs` render/controller seam and
  `conversationPanel.css` style seam. Root-admin app adoption remains blocked
  on first-consumer parity proof. Generated packet PDF delivery is approved at
  docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md.
  That decision includes a reusable generated-document boundary posture so
  future features can use the generation path without copying Product
  Discovery-specific code. The remaining PDF blocker is numeric implementation
  thresholds before implementation planning.
- Validation command:
  npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-05-chat-interface-layer-one-discovery-story-breakdown.md
- Validation status:
  pass

## Handoff Validation

- Product Discovery status:
  ready-for-technical-steering
- Technical Steering status:
  ready-for-story-breakdown
- Steering non-goals preserved:
  no in-app build task creation, no downstream delivery-loop execution, no
  active Reporting or Support workflow, no tenant-builder active rollout, no
  public packet delivery, no generic file hosting, no app-local governed UI
  implementation.
- Steering stop conditions resolved or carried as blockers:
  The Layer 2 to Layer 3 blocker-resolution loop found no requester-answerable
  product blocker for the MVP. PRD, first-draft capability matrix, generated
  PDF direction, and design-system path are now captured. Remaining blockers
  are PRD-derived test cases, API contract, permission mapping, data dictionary,
  persistence planning, runtime evidence, implementation blueprint, root-builder
  review permission, PDF numeric thresholds, and root-admin first-consumer
  parity proof.
- First-pass story-map posture:
  This packet is a first-pass blocked story map. It identifies the story queue
  and structural unblock work, but it does not authorize Task Breakdown,
  implementation blueprinting, or Delivery while API/permission,
  persistence/data, evidence, root-admin parity, and PDF numeric-threshold
  artifacts are missing.
- Architecture invention check:
  consumes-steering-only
- Governed DEV:frontend seam posture:
  ready-seam
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  generated PDF delivery, creator and root-builder history visibility,
  platform versus tenant scope, cross-tenant deny posture, browser mutations,
  sensitive transcript rendering, durable retention, supersession, and
  design-system governed app adoption.
- Missing source-of-truth artifacts:
  PRD-derived test cases, API contract, permission mapping, data dictionary,
  implementation blueprint, feature manifest plan, generated dependency graph
  plan, runtime/browser evidence plan, root-admin first-consumer parity proof,
  and PDF numeric-threshold decisions.

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-CHAT-001 | In-app harness chat domain | feature-local | future chat or harness-chat feature bundle | approved | DEV:migration-persistence |
| TS-CHAT-002 | Layer 1 Product Discovery orchestration seam | platform-seam | harness/Product Discovery adapter consumed by chat domain | approved | DEV:platform-seam |
| TS-CHAT-003 | Root-admin panel adoption | design-system-seam | design-system-owned right-panel and mobile floating action family consumed by root-admin shell | approved | GOV:design-system |
| TS-CHAT-004 | Root-admin app integration | feature-public-seam | root-admin shell/module adoption consuming design-system seams and chat public seam | approved | DEV:frontend |
| TS-CHAT-005 | Conversation and packet APIs | feature-public-seam | chat feature transport contract | approved | DOC:api-contract |
| TS-CHAT-006 | Root-builder and future tenant-builder authorization | feature-local | chat feature policy plus existing root/tenant authorization platform | approved | DOC:permission-mapping |
| TS-CHAT-007 | Generated Product Discovery packet PDF | architecture-foundation-required | asset/download governance plus packet-rendering decision | approved | DECISION:architecture-foundation |
| TS-CHAT-008 | Data dictionary and retention truth | feature-local | chat feature data dictionary | approved | DOC:data-dictionary |
| TS-CHAT-009 | QA and browser evidence | feature-public-seam | chat feature tests plus root-admin browser scenarios | approved | EVIDENCE:qa-evidence |
| TS-CHAT-010 | Future tenant-builder rollout | feature-local | future tenant-builder adoption and tenant-scoped repo/configuration flows | deferred-with-owner | DOC:docs-artifact |
| TS-CHAT-011 | Reusable chat and panel logic | shared-lib-candidate | chat feature domain first, shared extraction only after another active consumer | deferred-with-owner | DECISION:refactor-first |
| TS-CHAT-012 | Maintained docs and artifact alignment | feature-local | planning and source-independent artifact sweep | approved | DOC:docs-artifact |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin work panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | DS-task-required | shell-registry-update | shell-bootstrap | ready | Ready for Story Breakdown; implementation remains gated by design-system artifact obligations. |
| Build chat browser workflow | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build panel state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Chat flow state belongs to the chat feature/controller, not curated durable topology. |
| Conversation history view | root-admin | in-app harness chat | discovery history | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build history state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | History is server-backed but route topology is not a durable product page in MVP. |
| PDF download action | root-admin | in-app harness chat | packet export | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build packet action | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | never-serialize | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Download authorization and scope are server-side; no secrets or authority in URL state. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | API/security tests must prove unauthenticated and unauthorized denial. | yes |
| csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and design-system entrypoints. | Frontend/design-system implementation must preserve CSP-compatible asset loading. | yes |
| privileged-helper | yes | Harness/Product Discovery adapter may execute privileged generation behavior. | Helper must avoid exposing prompt/session secrets and must validate actor and scope before generation. | yes |
| csrf-mutation | yes | Creating conversations, appending messages, generating packets, and downloading may be browser-triggered protected actions. | Route contracts must use existing CSRF/session protections for browser mutations. | yes |
| url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Tests must prove authority comes from server session/current context, not URL state. | yes |
| sensitive-rendering | yes | Chat transcripts and packets may include platform or tenant change intent. | Redaction/visibility tests and mock-honesty checks required. | yes |
| asset-delivery | yes | Generated PDF download needs an approved transient or stored generated-file posture. | Asset consumer decision record required before implementation. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-001 | PRD and capability planning | yes | Technical Steering requires PRD, capability matrix, and PRD-derived test cases before task planning. | DOC:docs-artifact |
| S-002 | Design-system governance | yes | Technical Steering requires signed-off panel, mobile action, chat, starter, history, and PDF action seams. | GOV:design-system |
| S-003 | Asset/download architecture decision | yes | Generated PDFs need an asset consumer decision record before implementation. | DECISION:architecture-foundation |
| S-004 | Platform harness adapter | yes | Build chat must call the canonical Layer 1 Product Discovery harness seam. | DEV:platform-seam |
| S-005 | Durable persistence | yes | Conversations, packet versions, scope, download evidence, retention, and supersession need durable storage planning. | DEV:migration-persistence |
| S-006 | API contract | yes | Browser workflow requires protected conversation, history, generation, and download routes. | DOC:api-contract |
| S-006 | Permission mapping | yes | Creator history, root-builder review, tenant-scope deny, and download access require authz mapping. | DOC:permission-mapping |
| S-007 | Frontend adoption | yes | Root-admin panel and Build chat are rendered browser workflows. | DEV:frontend |
| S-008 | Runtime/browser evidence | yes | Visible frontend plus permission-sensitive API and PDF flow require browser/runtime proof. | EVIDENCE:qa-evidence |
| S-009 | Data dictionary | yes | Durable records and lifecycle states require source-independent data truth. | DOC:data-dictionary |
| S-010 | Artifact alignment | yes | Feature manifest, dependency graph, standards, and planning artifacts must stay aligned. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Root builders need an in-app Build chat in root admin that starts Layer 1
  Product Discovery from page/module/role context and exports a scoped Product
  Discovery packet PDF.
- Epic outcome:
  The MVP is split into governed planning, design-system, asset/download,
  backend, API/authz, frontend-adoption, and evidence stories without starting
  implementation from unresolved architecture or artifact gaps.
- Epic actors:
  root builder, future tenant builder, root builder reviewer, harness/Product
  Discovery adapter, PDF generator, root-admin frontend consumer.
- Epic non-goals:
  active Reporting flow, active Support flow, in-app build task creation,
  tenant-builder active rollout, public packet delivery, generic file hosting,
  app-local governed UI.
- Epic dependency summary:
  future chat or harness-chat feature domain, Product Discovery harness seam,
  root-admin shell, design-system seams, generated PDF decision, authz policy,
  persistence/data dictionary, API contracts, runtime/browser QA evidence.
- Epic-level proof target:
  mixed

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | blocked | harness-value | DOC:docs-artifact | MVP PRD, capability matrix, and test-case planning | This is needed to break down the first chat version into individual capabilities and proof expectations, so we can plan the implementation more accurately. | As the delivery harness, I need the root-admin MVP captured in PRD, capability rows, and test-case obligations before implementation tasks are cut. | harness/planning | PRD, capability matrix, and PRD-derived test cases exist for every MVP capability and acceptance criterion. | none |
| S-002 | blocked | user-value | GOV:design-system | Work panel and chat design-system governance | This is needed to define how the chat experience should look and behave before it appears in the real workspace. | As a root builder, I need the panel, mobile action, chat thread, starter prompts, history, and PDF action to use signed-off design-system seams. | root builder / design-system owner | The design-system path is answered as `build-work-panel` over the shared `conversationPanel` seam; root-admin app adoption remains blocked on first-consumer parity proof. | S-001 |
| S-003 | blocked | system-value | DECISION:architecture-foundation | Generated packet PDF delivery decision | This is its own story because creating a downloadable packet affects trust, privacy, storage, retention, and what people can safely share. | As architecture governance, I need a decision record for generated packet PDF delivery, storage, retention, access, MVP rendering scope, future reuse boundary, scale, latency, failure, operations, and reversibility before PDF implementation. | architecture/security | Delivery/storage/rendering direction is approved; numeric implementation thresholds remain deferred before implementation. | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md |
| S-004 | blocked | harness-value | DEV:backend | Product Discovery harness adapter | This is its own story because the chat should create the same discovery packet people already expect, not a lookalike version. | As the Build chat, I need a narrow adapter that produces canonical Product Discovery packet data through the existing Layer 1 process. | harness/system | Chat orchestration can create packet data without inventing a parallel discovery format. | API contract and implementation blueprint |
| S-005 | blocked | system-value | DEV:backend | Conversation and packet history foundation | This is its own story because people need confidence that their discovery conversations and generated packets are not lost or mixed together. | As the platform, I need durable conversations, packet versions, history visibility, retention, and supersession owned by a feature seam. | chat feature | Root-admin discovery history and packet state are stored with actor and scope facts. | data dictionary and persistence planning |
| S-006 | blocked | system-value | DEV:backend | Protected chat, history, generation, and download APIs | This is its own story because starting chats, returning to history, generating packets, and downloading files are separate things people expect to work reliably. | As the root-admin browser, I need protected API contracts for conversation, history, packet generation, and PDF download. | root-admin API consumer | Routes enforce validation, session, CSRF, creator/root-builder visibility, and tenant-scope deny posture. | API contract and permission mapping |
| S-007 | blocked | user-value | DEV:frontend | Root-admin Build panel adoption | This is its own story because the root builder needs one clear place to use Build while still understanding that Reporting and Support are not active yet. | As a root builder, I need the root-admin panel to expose Reporting and Support as coming-soon actions and Build as the active chat flow. | root builder | Root-admin consumes design-system seams and chat APIs without app-local CSS or copied controller behavior. | S-002 and S-006 |
| S-008 | blocked | harness-value | TEST:test-suite-alignment | Runtime and mock-honesty evidence plan | This is needed to decide what evidence will prove the chat works in the real workspace, not only in simplified examples. | As QA governance, I need tests and browser scenarios that prove the live root-admin panel, APIs, permissions, PDF flow, and fixtures match production shapes. | QA governance | Test obligations cover persistence, API, permission, generated PDF, browser states, and mock honesty. | PRD-derived test cases and QA evidence plan |
| S-009 | blocked | harness-value | DOC:docs-artifact | Data, permissions, API, and feature-manifest artifact sweep | This is needed to keep the written rules, examples, and tests aligned with the finished chat feature before follow-on work starts. | As repo governance, I need source-independent artifacts aligned with the implemented seams before delivery can close. | repo governance | Data dictionary, permission mapping, API contracts, feature manifest, dependency graph, and status docs are current. | S-004 through S-008 |
| S-010 | blocked | system-value | DOC:docs-artifact | Future tenant-builder rollout deferral | This is its own story because tenant-builder rollout is a separate product decision and should not accidentally become part of the first root-admin version. | As product governance, I need tenant-builder active rollout kept separate until it has its own Product Discovery and Technical Steering. | product/architecture | Tenant-builder work remains a named future scope and cannot leak into MVP tasks. | future scope only |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | PRD records root-admin-only MVP scope, Build as the only active action, coming-soon Reporting and Support, history visibility, retention, PDF output, and explicit non-goals. | source-level | docs alignment review | PRD |
| AC-S001-02 | S-001 | Capability matrix maps every MVP behavior to explicit capability rows or a non-capability governance rationale. | contract-level | capability traceability review | capability matrix |
| AC-S001-03 | S-001 | PRD-derived test cases cover permissions, tenant-scope deny, lifecycle, generated PDF, browser states, and mock-honesty obligations. | contract-level | TC planning review | PRD-derived test cases |
| AC-S002-01 | S-002 | Design-system artifacts define the right-side panel, mobile floating action, chat thread, contextual starter prompts, history posture, PDF action, and inactive Reporting/Support states. | human-visible-parity | visual; accessibility; interaction; responsive | design-system behavior lock; reference pack; verification |
| AC-S002-02 | S-002 | Design-system adoption artifact states which render/controller/style seams root admin must consume and forbids app-page CSS or copied governed behavior. | source-level | design-system adoption review | design-system adoption artifact |
| AC-S003-01 | S-003 | Asset consumer decision record chooses transient generation or stored generated PDF delivery and states retention, download authorization, audit, failure, public-delivery denial, MVP rendering scope, future reusable generated-document boundary, scale/concurrency, latency, deterministic output, provider/runtime, operations, and reversibility posture. | source-level | security review; asset governance review; architecture interview review | asset consumer decision record |
| AC-S004-01 | S-004 | Harness adapter produces canonical Product Discovery packet data and uses the existing Product Discovery taxonomy/template semantics. | contract-level | adapter contract; packet validation | PRD; capability matrix; API contract |
| AC-S004-02 | S-004 | Adapter failure leaves the conversation recoverable and records a non-success state without creating an invalid packet version. | runtime-api | resilience; lifecycle; audit | test cases; API contract |
| AC-S005-01 | S-005 | Conversation records persist actor, platform or tenant scope, page/module/role context, lifecycle state, retention posture, and system-managed timestamps. | persistence-level | persistence integration; lifecycle; validation | data dictionary; migration plan |
| AC-S005-02 | S-005 | Packet records support generated, downloaded, failed, and superseded states, with newer packets marking earlier packets from the same conversation as superseded. | persistence-level | lifecycle; audit; regression | data dictionary; test cases |
| AC-S006-01 | S-006 | API contracts define create/read/history/generate/download behavior, exact route params, ISO timestamps, normalized validation, and rejection of system-managed client fields. | contract-level | API contract; validation | API contract docs; OpenAPI/Postman if maintained |
| AC-S006-02 | S-006 | Permission mapping proves creator history access, root-builder review access, unauthenticated denial, unauthorized denial, and tenant cross-scope denial. | runtime-api | authz allow/deny; tenant boundary | permission mapping; test cases |
| AC-S007-01 | S-007 | Root-admin app adoption consumes signed-off design-system seams for panel, mobile action, chat flow, starter prompts, history, inactive actions, and PDF action. | rendered-browser | browser; visual; accessibility; responsive | design-system adoption; frontend evidence |
| AC-S007-02 | S-007 | Page/module/role starter context is displayed as helpful context and never becomes authority for scope or download permission. | runtime-api | browser; security; URL replay | API contract; permission mapping; browser tests |
| AC-S008-01 | S-008 | Evidence plan includes persistence-backed tests, API authz tests, generated PDF tests, browser scenarios for desktop/mobile, denied/empty/failed/degraded states, and mock-honesty checks. | source-level | QA planning; fixture review | PRD-derived test cases; QA evidence plan |
| AC-S009-01 | S-009 | Data dictionary, permission mapping, API contracts, feature manifest, generated dependency graph plan, and source-independent docs are aligned before implementation closure. | source-level | artifact sweep; generated artifact verification | data dictionary; permission mapping; feature manifest |
| AC-S010-01 | S-010 | Story Breakdown and future artifacts keep tenant-builder active rollout out of MVP and require separate Product Discovery and Technical Steering before activation. | source-level | docs alignment review | Product Discovery and Technical Steering references |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | chatInterface.mvpPlanning | planning | create-or-refresh-required | PRD does not exist yet. |
| S-001 | AC-S001-02 | chatInterface.capabilityTrace | planning | create-or-refresh-required | Capability matrix does not exist yet. |
| S-001 | AC-S001-03 | chatInterface.testPlanning | planning | create-or-refresh-required | PRD-derived test cases do not exist yet. |
| S-002 | AC-S002-01 | chatInterface.designSystemWorkPanel | design-system | create-or-refresh-required | Design-system artifacts do not exist yet. |
| S-002 | AC-S002-02 | chatInterface.designSystemAdoption | design-system | create-or-refresh-required | Adoption artifact required before app UI. |
| S-003 | AC-S003-01 | chatInterface.packetPdfDeliveryDecision | asset/download governance | not-capability-backed | Architecture foundation decision, not a runtime capability row. |
| S-004 | AC-S004-01 | chatInterface.generateDiscoveryPacketData | harness adapter | create-or-refresh-required | Exact row to be created in capability matrix. |
| S-004 | AC-S004-02 | chatInterface.recordAdapterFailure | harness adapter | create-or-refresh-required | Exact row to be created in capability matrix. |
| S-005 | AC-S005-01 | chatInterface.persistConversation | chat feature | create-or-refresh-required | Exact row to be created in capability matrix. |
| S-005 | AC-S005-02 | chatInterface.persistPacketVersion | chat feature | create-or-refresh-required | Exact row to be created in capability matrix. |
| S-006 | AC-S006-01 | chatInterface.rootAdminApiContracts | API | create-or-refresh-required | Exact route rows deferred to API contract. |
| S-006 | AC-S006-02 | chatInterface.enforceDiscoveryChatAccess | authz | create-or-refresh-required | Exact authz keys deferred to permission mapping. |
| S-007 | AC-S007-01 | chatInterface.rootAdminPanelAdoption | root-admin frontend | create-or-refresh-required | App adoption row depends on DS artifacts. |
| S-007 | AC-S007-02 | chatInterface.contextIsNotAuthority | security | create-or-refresh-required | Security capability row needed. |
| S-008 | AC-S008-01 | chatInterface.qaEvidencePlan | QA governance | create-or-refresh-required | Detailed TC rows created later. |
| S-009 | AC-S009-01 | chatInterface.artifactAlignment | repo governance | not-capability-backed | Artifact sweep control criterion. |
| S-010 | AC-S010-01 | chatInterface.futureTenantBuilderDeferral | future governance | not-capability-backed | Future scope guard. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-001 | S-001 AC-S001-01 | Product Discovery and Technical Steering packets | pre-existing-capability | existing | validated source artifact references | not-applicable: planning artifact source |
| DEP-CHAT-002 | S-002 AC-S002-01 | design-system panel/chat seams | design-system-seam | new | draft behavior lock, reference pack, pattern, verification checklist, and adoption contract exist; render/canonical signoff still missing | visual and accessibility browser scenarios |
| DEP-CHAT-003 | S-003 AC-S003-01 | generated packet PDF asset/download decision | asset-consumer-seam | existing | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md | security and download authorization tests |
| DEP-CHAT-004 | S-004 AC-S004-01 | Product Discovery harness adapter | feature-public-seam | new | adapter contract and packet validation | adapter integration tests |
| DEP-CHAT-005 | S-005 AC-S005-01 | chat conversation persistence | persistence-table-or-index | new | migration plan and data dictionary | persistence integration tests |
| DEP-CHAT-006 | S-006 AC-S006-01 | chat transport routes | feature-public-seam | new | API contract docs | runtime API tests |
| DEP-CHAT-007 | S-006 AC-S006-02 | root and tenant authorization platform | authz-capability | existing and new | permission mapping | authz allow/deny tests |
| DEP-CHAT-008 | S-007 AC-S007-01 | root-admin shell and DS adoption seams | frontend-topology-route | existing and new | adoption artifact and shell registry proof | rendered browser scenarios |
| DEP-CHAT-009 | S-008 AC-S008-01 | frontend and persistence test harnesses | pre-existing-capability | existing | test plan references | mock-honesty and runtime evidence checks |
| DEP-CHAT-010 | S-009 AC-S009-01 | feature manifest and dependency graph generator | feature-public-seam | existing and new | manifest plus generated graph output | artifact validation command |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| chatInterface Product Discovery adapter | root-admin Build chat | Produces canonical Product Discovery packet data from chat flow. | Parallel chat-only packet format or mutable UI state as source of truth. | adapter and packet validation tests |
| chatInterface conversation history seam | root builders and future tenant builders | Returns conversations and packet versions filtered by actor and scope. | Asset ownership alone, client-supplied scope, or URL replay state. | API, authz, persistence tests |
| generated-document rendering seam | root-admin Build chat and future feature exports | Renders authorized simple structured documents from feature-owned durable data and hands off to the approved delivery path. | Public URLs, generic file hosting, arbitrary HTML/document input, app-page direct access, or Product Discovery-specific fields embedded in generic renderer APIs. | renderer contract, asset/download, API, authz tests |
| design-system work panel/chat seams | root-admin shell and future app surfaces | Provides governed render, controller, accessibility, and responsive behavior. | App-page CSS or copied governed component markup. | design-system and browser scenarios |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | requester, planning maintainer | repo planning authority | active | PRD/matrix/test cases absent | source references must be exact | absent to drafted artifacts | missing source packet; contradictory steering | traceability; auditability |
| S-002 | design-system maintainer, root builder reviewer | DS governance authority | active | DS seams absent, draft, signed-off | responsive, accessible, inactive action, chat state values | draft to behavior-locked to adoption-ready | visual mismatch; interaction failure | accessibility; compatibility; human-visible parity |
| S-003 | architecture/security owner | asset/download decision authority | active | PDF not generated, generated, downloaded, failed, superseded | transient or stored delivery, no public URL, actor-bound access | no decision to approved decision | rendering failure; storage failure; unauthorized download | security; privacy; audit; retention |
| S-004 | harness adapter, chat feature | root/internal system authority | active | conversation in progress, packet-ready, failed | packet data must match Product Discovery template semantics | in-progress to packet-ready or failed | harness unavailable; validation failure | resilience; auditability |
| S-005 | chat feature, root builder | creator/root-builder authority | active, role changed | conversation new, in progress, abandoned, generated; packet current, superseded | actor, scope, context, ISO timestamps, system-managed fields | new to in-progress to generated or abandoned; generated to superseded | persistence conflict; stale actor scope | privacy; audit; compatibility |
| S-006 | root-admin browser, API consumer | authenticated root builder, unauthenticated, unauthorized, future tenant builder | active, no session, wrong scope | conversation and packet records current, failed, superseded | exact route params, normalized inputs, no system-managed client fields | create, read, generate, download, deny | CSRF failure; session expiry; cross-scope request | security; tenant isolation; resilience |
| S-007 | root builder | authenticated root builder | desktop, mobile, denied, empty, failed, degraded | panel closed/open, Build active, Reporting/Support inactive, history visible | display context only; no URL authority | open panel, start chat, view history, request PDF | API unavailable; DS seam unavailable | accessibility; performance; human-visible parity |
| S-008 | QA planner | repo QA authority | active | fixtures absent or stale | fixtures must match live API/persistence shape | plan absent to accepted | mock drift; browser evidence unavailable | mock honesty; runtime evidence |
| S-009 | repo governance | artifact maintainer authority | active | artifacts absent, stale, aligned | source-independent docs must match source truth | stale to aligned | generator failure; manifest mismatch | compliance; recoverability |
| S-010 | product/architecture owner | future planning authority | active | tenant-builder scope deferred | future scope remains explicit | deferred to future Product Discovery | accidental MVP scope expansion | compatibility; tenant isolation |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | planning maintainer; PRD absent | chatInterface.mvpPlanning | source-level | TC obligation: PRD scope alignment | no |
| AC-S001-02 | planning maintainer; matrix absent | chatInterface.capabilityTrace | contract-level | TC obligation: capability traceability | no |
| AC-S001-03 | QA planner; TC packet absent | chatInterface.testPlanning | contract-level | TC obligation: PRD-derived TC coverage | no |
| AC-S002-01 | root builder; desktop/mobile UI states | chatInterface.designSystemWorkPanel | human-visible-parity | TC obligation: visual/accessibility/responsive DS states | yes |
| AC-S002-02 | root-admin adopter; DS seam ready | chatInterface.designSystemAdoption | source-level | TC obligation: adoption artifact proof | yes |
| AC-S003-01 | root builder; PDF generated/downloaded/failed | chatInterface.packetPdfDeliveryDecision | source-level | TC obligation: asset/download decision coverage | yes |
| AC-S004-01 | harness adapter; packet-ready | chatInterface.generateDiscoveryPacketData | contract-level | TC obligation: adapter output validates as packet data | yes |
| AC-S004-02 | harness adapter; failed generation | chatInterface.recordAdapterFailure | runtime-api | TC obligation: recoverable adapter failure | yes |
| AC-S005-01 | root builder; conversation lifecycle | chatInterface.persistConversation | persistence-level | TC obligation: persistence and lifecycle states | yes |
| AC-S005-02 | root builder; packet supersession | chatInterface.persistPacketVersion | persistence-level | TC obligation: generated/downloaded/failed/superseded states | yes |
| AC-S006-01 | browser API consumer; route validation | chatInterface.rootAdminApiContracts | contract-level | TC obligation: route contract and validation | yes |
| AC-S006-02 | root builder, unauthenticated, unauthorized, future tenant builder | chatInterface.enforceDiscoveryChatAccess | runtime-api | TC obligation: allow and deny matrix | yes |
| AC-S007-01 | root builder; desktop/mobile panel states | chatInterface.rootAdminPanelAdoption | rendered-browser | TC obligation: browser scenario with DS seams | yes |
| AC-S007-02 | root builder; context display | chatInterface.contextIsNotAuthority | runtime-api | TC obligation: URL/context not authority | yes |
| AC-S008-01 | QA planner; fixture and runtime states | chatInterface.qaEvidencePlan | source-level | TC obligation: mock-honesty and runtime evidence plan | yes |
| AC-S009-01 | repo governance; artifact states | chatInterface.artifactAlignment | source-level | TC obligation: artifact sweep/generator proof | yes |
| AC-S010-01 | product/architecture owner; future scope deferred | chatInterface.futureTenantBuilderDeferral | source-level | TC obligation: future-scope guard | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| BLK-SB-CHAT-001 | S-003 | asset-decision | Generated PDF delivery cannot be implemented until approved delivery/storage/access posture, MVP rendering scope, future reuse boundary, and numeric implementation thresholds are carried into the implementation artifacts. | Human-reviewed asset consumer decision record plus PRD/API/blueprint numeric thresholds. | Open: delivery/storage/rendering direction is approved; exact packet size, output size, numeric concurrency, burst limits, fallback timeout, rate limits, and alert thresholds remain deferred to PRD/API contract or implementation blueprint ownership. |
| BLK-SB-CHAT-002 | S-002 and S-007 | design-system-foundation | Governed panel/chat UI cannot be implemented through root-admin-local CSS or copied controller behavior. | DS behavior lock, reference pack, verification, adoption artifacts, render surface, canonicals, shared seams, and first-consumer parity proof. | Open: `build-work-panel` and shared `conversationPanel` seams are the selected path; root-admin app adoption remains blocked until first-consumer parity proof exists. |
| BLK-SB-CHAT-003 | S-001 through S-009 | capability-matrix | Stories cannot enter Task Breakdown without capability rows or explicit non-capability rationale. | Capability matrix for the root-admin MVP. | Matrix maps every acceptance criterion. |
| BLK-SB-CHAT-004 | S-006 and S-009 | permission-model | Protected APIs and history access require explicit capability and deny mapping. | Permission mapping artifact. | Allow/deny and tenant-scope rules are documented and testable. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-CHAT-001 | BLK-SB-CHAT-001 | Should generated packet PDFs be transient downloads regenerated from packet data, or stored generated files with their own lifecycle? | yes | Answered: transient generated download from durable packet data is approved for the MVP. |
| Q-CHAT-001A | BLK-SB-CHAT-001 | Should the MVP PDF be a simple structured export or a polished branded document with designed sections and presentation rules? | yes | Answered: simple structured export is approved for the MVP; polished branded PDF generation is deferred. |
| Q-CHAT-001B | BLK-SB-CHAT-001 | Should PDF generation be usable by other features in future, or be a one-off Product Discovery renderer? | yes | Answered: it should be usable by other features in future through a reusable generated-document boundary, with Product Discovery as the first consumer. |
| Q-CHAT-001C | BLK-SB-CHAT-001 | What size, concurrency, and generation-speed targets should the MVP generated-document seam be designed around? | yes | Deferred with owner: Option 2 light is approved, with typical generation/download under 3 seconds, preparing-download fallback, bounded concurrency/timeouts/rate limits, and future Option 3 async pipeline compatibility. Exact packet size, output size, numeric concurrency, burst limits, fallback timeout threshold, and rate-limit tuning are deferred to PRD/API contract or implementation blueprint ownership, with a hard rule that implementation cannot start until those limits are defined. |
| Q-CHAT-001D | BLK-SB-CHAT-001 | Should generated PDFs render only from approved Product Discovery packet data, or also include raw chat transcript/history content? | yes | Answered: PDF generation may render only from approved Product Discovery packet data for the MVP. Raw chat transcript and conversation history remain visible in the app history experience, but are excluded from the PDF unless a later product and architecture decision explicitly promotes them into the export contract. |
| Q-CHAT-001E | BLK-SB-CHAT-001 | Should regenerated PDFs render immutable approved packet versions, and what happens to superseded versions? | yes | Answered: approved packet versions are immutable. A material change must move back up the loop through change request or review and create a new approved packet version. Superseded approved versions remain accessible and downloadable to authorized root builders as history, with clear previous and next packet-version links. |
| Q-CHAT-001F | BLK-SB-CHAT-001 | When PDF generation fails, can the user retry from the same approved packet version? | yes | Answered: the user may retry immediately from the same approved packet version for transient rendering or delivery failures. Failed attempts must be recorded. Permission, inaccessible-data, and data-integrity failures remain denied or escalated rather than treated as normal retry states. |
| Q-CHAT-001G | BLK-SB-CHAT-001 | Which reliable no-paid-provider PDF renderer should the MVP use? | yes | Answered: use self-hosted Playwright/Chromium as the preferred MVP renderer behind a provider-neutral generated-document seam. The seam must accept approved structured packet data, reject arbitrary user HTML/document input, return authenticated attachment PDFs, and allow a later move to a worker, another renderer, or paid provider without changing the Product Discovery packet contract. |
| Q-CHAT-001H | BLK-SB-CHAT-001 | How should long packet content, images, and broad tables behave in the generated PDF? | yes | Answered: natural pagination is allowed. The renderer must avoid cutting images or individual table rows across page boundaries where they can fit intact. Broad tables must use an approved wider or fit layout, such as landscape table sections or fit-to-width table rendering, rather than clipping columns or overflowing the page. |
| Q-CHAT-001I | BLK-SB-CHAT-001 | Should the PDF include generated-document metadata, and where should it appear? | yes | Answered: include a compact header page before the packet body. The header page must identify packet version, generated timestamp, generating actor, packet approval status, and previous/next packet-version links where they exist, without adding raw chat transcript or internal notes. |
| Q-CHAT-001J | BLK-SB-CHAT-001 | Should the header page visibly explain that the PDF was generated from approved packet data only? | yes | Answered: no. The header page should stay clean and not include that visible explanatory note. The source-content contract still excludes raw chat transcript, working conversation history, support notes, and internal review notes. |
| Q-CHAT-001K | BLK-SB-CHAT-001 | Should PDF generation cancellation be user-visible in the MVP? | yes | Answered: no. Explicit user-visible cancellation is out of scope for MVP. Cancellation is handled through server-side timeout, request abort, cleanup, or future worker lifecycle behavior. Users see preparing, success, failed, and retry states rather than a cancel action. |
| Q-CHAT-001L | BLK-SB-CHAT-001 | What operational signal should repeated PDF generation failures produce? | yes | Answered: every generation failure must create audit and metrics evidence. Alerting should trigger only after repeated failures cross a threshold. Exact alert thresholds are deferred to PRD/API contract or implementation blueprint ownership and must be defined before implementation starts. |
| Q-CHAT-001M | BLK-SB-CHAT-001 | Should support/root builders see a failed PDF generation reason category? | yes | Answered: yes. Support/root-builder views may show safe failure reason categories such as `render_timeout`, `packet_unavailable`, `permission_denied`, `data_integrity_failure`, or `renderer_unavailable`. Stack traces, renderer internals, raw payloads, storage paths, session identifiers, and infrastructure details stay internal-only. |
| Q-CHAT-001N | BLK-SB-CHAT-001 | Should generated PDFs be locale-aware now or English-only with no locale contract? | yes | Answered: include locale context in the renderer contract now, but ship English-only MVP PDF content. Translation, localized copy management, locale-specific formatting, and fallback-language behavior are deferred to the planned repo localization layer before non-English PDF output is enabled. |
| Q-CHAT-001O | BLK-SB-CHAT-001 | Should migration/reversibility be seam-only for MVP, or should a second renderer fallback be implemented and tested now? | yes | Answered: use seam-only reversibility for MVP. Keep Playwright/Chromium behind the provider-neutral generated-document seam, and do not implement or test a second renderer fallback in MVP. Future replacement may move rendering to a worker, another self-hosted renderer, or a paid provider without changing the Product Discovery packet contract. |
| Q-CHAT-001P | BLK-SB-CHAT-001 | Should the generated-document seam accept a generic structured document model, or feature-owned packet data plus a mapper? | yes | Answered: Product Discovery owns approved packet data and maps it into a renderer-neutral document shape. The generated-document seam accepts only generic rendering primitives, metadata, locale context, and delivery options. It must not accept Product Discovery-specific fields directly. |
| Q-CHAT-002 | BLK-SB-CHAT-002 | Which design-system family owns the work panel, chat thread, starter prompts, history, and PDF action? | yes | Answered: use the `build-work-panel` configured family over the neutral shared `conversationPanel.mjs` render/controller seam and `conversationPanel.css` style seam. Consumer is `/home/gordon/kanbien`, root-admin shell, right-side desktop panel plus mobile floating action, first active mode Build. Root-admin adoption remains blocked on first-consumer parity proof and must not copy DS markup/controller behavior or app-page CSS. |
| Q-CHAT-003 | BLK-SB-CHAT-004 | Which exact root-builder capability keys govern creator history, root-builder review, packet generation, and PDF download? | no | Backend/security owner in permission mapping. |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-CHAT-001 | S-001 AC-S001-01 through AC-S001-03 | ART-CHAT-001; ART-CHAT-002; ART-CHAT-003; BLK-SB-CHAT-003 | prd-required | No requester answer needed for MVP scope. | Safe default: create PRD from Product Discovery and Technical Steering; keep future tenant-builder rollout deferred. | Run PRD, capability matrix, and test-case planning workflows for root-admin MVP. | yes | ready-to-create-artifact |
| U-CHAT-002 | S-002 AC-S002-01 and AC-S002-02; S-007 AC-S007-01 | Q-CHAT-002; ART-CHAT-004; BLK-SB-CHAT-002 | design-system-governance | No further design-system path decision is needed. | Safe default used: `build-work-panel` configured family consumes the neutral shared `conversationPanel` seam. | Complete root-admin first-consumer parity proof before app adoption. | yes | deferred-with-owner |
| U-CHAT-003 | S-003 AC-S003-01 | Q-CHAT-001; Q-CHAT-001A; Q-CHAT-001B; Q-CHAT-001C; Q-CHAT-001D; Q-CHAT-001E; Q-CHAT-001F; Q-CHAT-001G; Q-CHAT-001H; Q-CHAT-001I; Q-CHAT-001J; Q-CHAT-001K; Q-CHAT-001L; Q-CHAT-001M; Q-CHAT-001N; Q-CHAT-001O; Q-CHAT-001P; ART-CHAT-005; BLK-SB-CHAT-001 | technical-steering-revisit | Exact packet size, output size, numeric concurrency, burst, fallback timeout, rate-limit tuning, and alert thresholds remain undefined. | Deferred to PRD/API contract or implementation blueprint owner. No generated-document implementation task may start until these numeric limits are defined. Approved PDF source is Product Discovery packet data only. Approved packet versions are immutable and superseded versions remain downloadable history with previous/next links. Transient generation failures can be retried immediately from the same approved packet version with failed-attempt evidence. Preferred MVP renderer is self-hosted Playwright/Chromium behind a provider-neutral generated-document seam. Natural pagination is allowed, with no avoidable image/table-row cuts and no broad-table clipping. PDF includes a compact header page with packet/version/generation metadata, but no visible approved-packet-data-only explanatory note. User-visible cancellation is out of scope for MVP. Every generation failure records audit/metrics; alerting starts only after repeated failures cross a later-defined threshold. Support/root builders can see safe failure reason categories, while internals stay internal-only. Renderer contract is locale-aware, but MVP PDF content is English-only until the planned localization layer exists. Reversibility is seam-only; no second renderer fallback is implemented or tested in MVP. Product Discovery maps packet data into renderer-neutral document primitives; the renderer seam must not accept Product Discovery-specific fields directly. | Carry the hard implementation gate, PDF source-content rule, immutable packet-version rule, historical download chain, retry rule, renderer choice, pagination-quality rule, header-page metadata rule, server-side cancellation rule, failure-signal rule, support-diagnostics rule, localization-contract rule, seam-only reversibility rule, and source-mapper rule into PRD, API contract, and implementation blueprint work. No further requester answer is needed for the PDF architecture decision except the deferred numeric limit and alert-threshold gate. | yes | deferred-with-owner |
| U-CHAT-004 | S-006 AC-S006-01 and AC-S006-02 | ART-CHAT-006; ART-CHAT-007; BLK-SB-CHAT-004 | api-contract-required | No requester answer needed. | Safe default: protected root-admin APIs with server-side authorization and no URL authority. | Create API contract and permission mapping artifacts. | yes | ready-to-create-artifact |
| U-CHAT-005 | S-005 AC-S005-01 and AC-S005-02; S-009 AC-S009-01 | ART-CHAT-008; ART-CHAT-010 | data-dictionary-required | No requester answer needed. | Safe default: persist durable actor, scope, lifecycle, retention, and supersession facts. | Create data dictionary and persistence planning artifacts. | yes | ready-to-create-artifact |
| U-CHAT-006 | S-008 AC-S008-01 | ART-CHAT-009 | artifact-creation | No requester answer needed. | Safe default: require persistence, API, authz, generated PDF, browser, and mock-honesty proof. | Create PRD-derived test cases and QA evidence plan. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-001 | S-001 | PRD | prove-current | PRD maintainer workflow | no |
| ART-CHAT-002 | S-001 | capability matrix | prove-current | capability-matrix maintainer workflow | no |
| ART-CHAT-003 | S-001 | PRD-derived test cases | create | prd-test-case-planner | yes |
| ART-CHAT-004 | S-002 and S-007 | GOV:design-system artifacts | prove-current | frontend-design-system-loop-maintainer | no |
| ART-CHAT-005 | S-003 | asset consumer decision record | prove-current | docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md | no |
| ART-CHAT-006 | S-006 | API contract docs | create | api-contract-maintainer | yes |
| ART-CHAT-007 | S-006 | permission mapping | create | permission mapping workflow | yes |
| ART-CHAT-008 | S-005 | data dictionary | create | data-dictionary-maintainer | yes |
| ART-CHAT-009 | S-008 | QA evidence and browser scenario plan | create | frontend-test-case-maintainer plus PRD test planning | yes |
| ART-CHAT-010 | S-009 | feature manifest and dependency graph plan | create | implementation planning workflow | yes |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010
- Stories needing capability matrix:
  none
- Stories needing PRD refinement:
  none
- Stories needing Technical Steering revisit:
  none; PDF numeric thresholds remain deferred to PRD/API contract or
  implementation blueprint ownership before implementation tasks.
- Broad cleanup or shortcut risk:
  none
- Architecture invention risk:
  none

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-001 | blocked | PRD and capability matrix exist; PRD-derived test cases must still be created before Task Breakdown. |
| S-002 | control-story-only | Design-system path is answered as `build-work-panel` over shared `conversationPanel` seams; root-admin first-consumer parity proof remains part of S-007. |
| S-003 | blocked | Asset consumer decision record captures approved transient generated download, simple structured export rendering, preferred Playwright/Chromium renderer, and future-usable generated-document boundary; implementation remains blocked until numeric limits and alert thresholds are set in PRD/API contract or implementation blueprint. |
| S-004 | blocked | API contract and implementation blueprint must define adapter behavior before Task Breakdown. |
| S-005 | blocked | Data dictionary and persistence plan are missing. |
| S-006 | blocked | API contract and permission mapping are missing. |
| S-007 | blocked | Root-admin first-consumer parity proof, APIs, permissions, and evidence plan are missing. |
| S-008 | blocked | PRD-derived test cases and QA evidence plan are missing. |
| S-009 | blocked | Source-independent artifact set is not created yet. |
| S-010 | control-story-only | Future tenant-builder rollout is intentionally deferred from MVP. |
