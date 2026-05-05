# Story Breakdown

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-05-06
- Epic ID:
  `EPIC-CHAT-2026-05-05-layer-one-discovery`
- Epic title:
  Chat Interface For Layer One Product Discovery
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`
- Related PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  pending design-system governance and generated PDF asset decision
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-05-chat-interface-layer-one-discovery-story-breakdown.md`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `ready-for-story-breakdown`
- Steering non-goals preserved:
  MVP remains root-admin only; Reporting and Support are visible coming-soon
  actions only; tenant-builder active rollout is future scoped; MVP does not
  execute downstream build work from the chat.
- Steering stop conditions resolved or carried as blockers:
  PRD and first-draft capability matrix are now linked. Remaining blockers are
  PRD-derived test cases, design-system governance, generated PDF
  asset/download decision, API contract, permission mapping, data dictionary,
  and runtime/browser evidence.
- Architecture invention check:
  `consumes-steering-only`
- Governed DEV:frontend seam posture:
  `blocked`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  Present. Steering requires explicit authorization, tenant-scope denial,
  durable conversation and packet records, PDF delivery posture, retention,
  and browser security proof before implementation.
- Missing source-of-truth artifacts:
  PRD-derived test cases, asset consumer decision record, design-system
  behavior/reference/verification/adoption artifacts, API contract, data
  dictionary, permission mapping, feature manifest, feature dependency graph
  refresh, and runtime/browser QA evidence plan.

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
| Root-admin work panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | DS-task-required | shell-registry-update | shell-bootstrap | ready | Ready for story planning; implementation remains gated by design-system artifact obligations. |
| Build chat browser workflow | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build panel state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Chat flow state belongs to the chat feature/controller, not curated durable topology. |
| Conversation history view | root-admin | in-app harness chat | discovery history | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build history state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | History is server-backed but route topology is not a durable product page in MVP. |
| PDF download action | root-admin | in-app harness chat | packet export | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build packet action | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | never-serialize | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Download authorization and scope are server-side; no secrets or authority in URL state. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | API/security tests must prove unauthenticated and unauthorized denial. | yes |
| csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and DS entrypoints. | Frontend/DS implementation must preserve CSP-compatible asset loading. | yes |
| privileged-helper | yes | Harness/Product Discovery adapter may execute privileged generation behavior. | Helper must avoid exposing prompt/session secrets and must validate actor and scope before generation. | yes |
| csrf-mutation | yes | Creating conversations, appending messages, generating packets, and downloading may be browser-triggered protected actions. | Route contracts must use existing CSRF/session protections for browser mutations. | yes |
| url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Tests must prove authority comes from server session/current context, not URL state. | yes |
| sensitive-rendering | yes | Chat transcripts and packets may include platform or tenant change intent. | Redaction/visibility tests and mock-honesty checks required. | yes |
| asset-delivery | yes | Generated PDF download needs an approved transient or stored generated-file posture. | Asset/download decision record required before implementation. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | Capability matrix required | yes | Steering requires capability rows for chat, history, packet generation, PDF download, authorization, and denial behavior. | DOC:docs-artifact |
| S-001 | PRD required | yes | MVP capability details, lifecycle, permissions, error states, and non-goals need PRD authority. | DOC:docs-artifact |
| S-002 | Governed design-system seam | yes | Panel, mobile action, chat thread, starters, history, and PDF action are governed shared UI. | GOV:design-system |
| S-003 | Asset delivery decision | yes | Generated Product Discovery packet PDFs require approved delivery, storage, retention, and authorization posture. | DECISION:architecture-foundation |
| S-004 | Persistence and data truth | yes | Conversations, packet versions, scope, download evidence, retention, and supersession require durable data design. | DEV:migration-persistence |
| S-005 | API and permission contracts | yes | Browser conversation, history, packet generation, download, creator visibility, root-builder review, and tenant deny behavior need contracts. | DOC:api-contract |
| S-006 | Platform seam | yes | Build chat must call the canonical Layer 1 Product Discovery flow through a narrow adapter. | DEV:platform-seam |
| S-007 | Frontend app adoption | yes | Root-admin app consumes DS-owned work panel and chat seams after prerequisites exist. | DEV:frontend |
| S-008 | QA evidence | yes | The feature is user-visible, permission-sensitive, persistence-backed, asset-delivering, and frontend-governed. | EVIDENCE:qa-evidence |

## Epic Summary

- Epic job to be done:
  Give root builders an in-app Build chat that starts Layer 1 Product
  Discovery, preserves history, and exports a scoped packet PDF without
  bypassing tenant, security, design-system, or artifact guardrails.
- Epic outcome:
  The work is split into planning, design-system, architecture-foundation,
  backend, platform-seam, frontend-adoption, and evidence stories with clear
  blockers before Task Breakdown.
- Epic actors:
  root builder, future tenant builder, root-admin app, chat/harness domain,
  Product Discovery adapter, design-system owner, security/data owner, delivery
  harness.
- Epic non-goals:
  Tenant-builder active rollout, Reporting and Support active flows, direct
  downstream build execution from chat, app-local CSS for governed UI, and
  public or generic file-hosting behavior.
- Epic dependency summary:
  Implementation depends on PRD and capability matrix authority, design-system
  seams, asset/download decision, API and permission contracts, persistence
  model, data dictionary, adapter contract, and QA evidence plan.
- Epic-level proof target:
  `mixed`

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | superseded | harness-value | DOC:docs-artifact | Capability matrix control | As the delivery harness, I need approved capability rows for every story acceptance criterion so Task Breakdown can avoid vague implementation scope. | harness | Capability matrix coverage exists for chat intake, history, packet generation, PDF delivery, authorization, denial, and artifact evidence. | Created in this Layer 3 unblock slice; refresh if downstream decisions change rows |
| S-001 | superseded | system-value | DOC:docs-artifact | Root-admin MVP PRD | As a planning owner, I need a PRD that locks the root-admin MVP behavior, lifecycle, non-goals, and failure states so downstream stories share one product contract. | planning system | PRD describes the MVP workflow, root-builder visibility, coming-soon actions, retention and supersession posture, and excluded future rollout. | Created in this Layer 3 unblock slice; refresh if downstream decisions change requirements |
| S-002 | blocked | system-value | GOV:design-system | Work panel and chat design-system governance | As the design-system owner, I need signed-off work panel, mobile action, chat thread, starter prompt, history, and PDF action seams before root-admin app adoption. | design-system owner | Governed render/controller/reference/verification/adoption artifacts exist and can be consumed by app UI. | Blocks S-007 |
| S-003 | blocked | system-value | DECISION:architecture-foundation | Generated packet PDF asset decision | As the architecture and security owner, I need an approved generated PDF delivery posture before packet download behavior is implemented. | architecture/security owner | Transient versus stored delivery, authorization, retention, scanning, quota, audit, and cleanup posture are decided. | Blocks S-005 and S-007 PDF action |
| S-004 | needs-prd-refinement | system-value | DEV:backend | Chat domain and persistence planning | As the chat domain owner, I need durable conversation, packet version, supersession, scope, actor, download evidence, and retention facts defined before migrations or repositories exist. | chat feature owner | A feature-owned domain shape and data dictionary plan preserve required durable facts without depending on mutable external context. | Depends on S-000 and S-001 |
| S-005 | needs-prd-refinement | system-value | DOC:docs-artifact | Protected API and permission contract | As the backend/security owner, I need protected route and permission contracts for conversations, history, packet generation, and downloads before route tasks begin. | backend/security owner | API and permission artifacts define allow/deny behavior, creator visibility, root-builder review, tenant-scope denial, CSRF/session posture, and object-level rules. | Depends on S-000, S-001, S-003, S-004 |
| S-006 | needs-prd-refinement | system-value | DEV:backend | Product Discovery adapter contract | As the harness owner, I need a narrow adapter contract to produce canonical Product Discovery packet data from chat without creating a parallel discovery model. | harness/Product Discovery adapter | Chat generation can call Layer 1 through a stable seam with actor, scope, context, failure, and packet revision expectations. | Depends on S-000, S-001, S-004, S-005 |
| S-007 | blocked | user-value | DEV:frontend | Root-admin Build chat adoption | As a root builder, I need the root-admin work panel to open Build chat, show contextual starters and history, and offer packet download once backend and DS prerequisites exist. | root builder | Root-admin consumes approved design-system seams and protected chat APIs without app-local governed CSS or duplicated controller behavior. | Depends on S-002, S-003, S-005, S-006 |
| S-008 | needs-prd-refinement | harness-value | TEST:test-suite-alignment | Evidence and test-case planning | As the delivery harness, I need test obligations translated into PRD-derived cases and runtime/browser evidence requirements before implementation tasks are split. | delivery harness | Permission, tenant boundary, lifecycle, PDF delivery, adapter, API, persistence, browser, accessibility, and mock-honesty obligations are ready for detailed test-case planning. | Depends on S-000 and S-001; informs all delivery stories |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | Capability rows are created or refreshed for each story acceptance criterion that changes chat, history, packet generation, PDF download, authorization, denial, evidence, or artifact behavior. | source-level | artifact traceability | capability matrix |
| AC-S000-02 | S-000 | Capability matrix rows preserve the routing posture from Technical Steering and do not expand the MVP beyond root-admin Build chat. | source-level | compatibility, artifact traceability | capability matrix |
| AC-S001-01 | S-001 | PRD records the root-admin MVP workflow: open work panel, choose Build, use free-form chat or starters, generate packet, download PDF, and later view history. | source-level | product contract, lifecycle | PRD |
| AC-S001-02 | S-001 | PRD records non-goals for tenant-builder active rollout, Reporting active flow, Support active flow, and downstream build execution from chat. | source-level | compatibility | PRD |
| AC-S001-03 | S-001 | PRD names lifecycle states for conversation draft, packet-ready, PDF-generated, downloaded, abandoned, and superseded packet revisions. | source-level | lifecycle, audit | PRD |
| AC-S002-01 | S-002 | Design-system artifacts define the work panel, mobile floating action, Build chat thread, starter prompt set, history posture, and PDF action before root-admin app adoption starts. | human-visible-parity | visual, accessibility, interaction, responsive | design-system behavior lock, reference pack, verification checklist, adoption contract |
| AC-S002-02 | S-002 | Design-system adoption contract states that app implementation consumes DS-owned render/controller seams and does not copy governed markup, controller logic, or page CSS. | source-level | architecture compliance | design-system adoption contract |
| AC-S003-01 | S-003 | Asset decision record states whether generated packet PDFs are transient downloads or stored generated assets and names the approved authorization and retention posture. | source-level | security, privacy, lifecycle | asset consumer decision record |
| AC-S003-02 | S-003 | Asset decision record rejects public delivery and generic file-hosting behavior unless a later approved decision changes that posture. | source-level | security, privacy, compatibility | asset consumer decision record |
| AC-S004-01 | S-004 | Data model plan identifies durable facts for conversation identity, actor, root or tenant scope, context selections, message history, packet versions, supersession, PDF/download evidence, and retention. | persistence-level | persistence, lifecycle, audit | data dictionary, migration plan |
| AC-S004-02 | S-004 | Chat feature ownership plan keeps durable conversation and packet behavior feature-local and exposes only narrow public seams. | source-level | architecture compliance | feature manifest plan, data dictionary |
| AC-S005-01 | S-005 | API contract plan defines protected conversation create/read/message, packet generation, history read, and PDF download behavior with denied, stale, and failure responses. | contract-level | API, security, resilience | API contract |
| AC-S005-02 | S-005 | Permission mapping defines creator history visibility, root-builder review visibility, tenant-scope denial, object-level checks, and server-side authority for context and downloads. | contract-level | security, privacy, tenant boundary, audit | permission mapping |
| AC-S006-01 | S-006 | Adapter contract accepts actor, scope, conversation context, prompt selections, and transcript input and returns canonical Product Discovery packet data plus packet revision metadata. | contract-level | platform seam, compatibility, lifecycle | implementation blueprint or API contract |
| AC-S006-02 | S-006 | Adapter contract records failure behavior for discovery generation failure, invalid scope, stale context, duplicate generation, and superseded packet revision handling. | contract-level | resilience, lifecycle | implementation blueprint or PRD |
| AC-S007-01 | S-007 | Root-admin app adoption consumes signed-off DS seams for work panel, chat thread, starter prompts, history, and packet download action. | rendered-browser | visual, accessibility, responsive, interaction | design-system adoption evidence |
| AC-S007-02 | S-007 | Browser workflow proves a root builder can start Build chat, view history, generate a packet, and request a PDF download through protected APIs. | rendered-browser | runtime browser, API integration, security | QA evidence |
| AC-S008-01 | S-008 | PRD-derived test-case plan covers allow and deny behavior, cross-tenant denial, lifecycle transitions, PDF delivery, adapter failures, API validation, persistence, browser behavior, accessibility, and mock-honesty checks. | source-level | test planning, security, lifecycle, frontend, persistence | PRD-derived test cases |
| AC-S008-02 | S-008 | Runtime evidence plan names live-data/API/browser checks required before any user-visible fix or feature completion claim. | source-level | runtime evidence, mock honesty | QA evidence plan |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | CHAT-CAPABILITY-MATRIX-ROWSET | planning artifact | create-or-refresh-required | Control story creates or refreshes matrix rows. |
| S-000 | AC-S000-02 | CHAT-CAPABILITY-MATRIX-ROUTING | planning artifact | create-or-refresh-required | Matrix must preserve root-admin MVP scope. |
| S-001 | AC-S001-01 | CHAT-PRD-WORKFLOW | product contract | create-or-refresh-required | PRD authority required before task split. |
| S-001 | AC-S001-02 | CHAT-PRD-NON-GOALS | product contract | create-or-refresh-required | Prevents future scope from entering MVP tasks. |
| S-001 | AC-S001-03 | CHAT-PRD-LIFECYCLE | product contract | create-or-refresh-required | Lifecycle rows required for later tests. |
| S-002 | AC-S002-01 | CHAT-DS-SEAMS | design-system | create-or-refresh-required | DS governance owns shared UI behavior. |
| S-002 | AC-S002-02 | CHAT-DS-ADOPTION | design-system | create-or-refresh-required | Adoption contract prevents app-local drift. |
| S-003 | AC-S003-01 | CHAT-PDF-ASSET-DELIVERY | asset/download | create-or-refresh-required | Asset decision gates PDF implementation. |
| S-003 | AC-S003-02 | CHAT-PDF-NO-PUBLIC-HOSTING | asset/download | create-or-refresh-required | Public delivery remains denied by default. |
| S-004 | AC-S004-01 | CHAT-DATA-DURABLE-FACTS | persistence | create-or-refresh-required | Durable facts must be preserved. |
| S-004 | AC-S004-02 | CHAT-FEATURE-OWNERSHIP | architecture | create-or-refresh-required | Feature manifest later records seams. |
| S-005 | AC-S005-01 | CHAT-API-CONTRACTS | API contract | create-or-refresh-required | Route behavior must be documented first. |
| S-005 | AC-S005-02 | CHAT-PERMISSION-MAPPING | authz/security | create-or-refresh-required | Creator/root-builder/tenant denial posture required. |
| S-006 | AC-S006-01 | CHAT-PD-ADAPTER-CONTRACT | platform seam | create-or-refresh-required | Keeps chat aligned with canonical Product Discovery. |
| S-006 | AC-S006-02 | CHAT-PD-ADAPTER-FAILURES | platform seam | create-or-refresh-required | Failure behavior must be explicit. |
| S-007 | AC-S007-01 | CHAT-APP-DS-CONSUMPTION | frontend adoption | create-or-refresh-required | App adoption waits for DS seam. |
| S-007 | AC-S007-02 | CHAT-ROOT-ADMIN-BROWSER-FLOW | frontend adoption | create-or-refresh-required | Runtime/browser proof required. |
| S-008 | AC-S008-01 | CHAT-TEST-CASE-PLAN | QA evidence | create-or-refresh-required | PRD-derived test cases required. |
| S-008 | AC-S008-02 | CHAT-RUNTIME-EVIDENCE | QA evidence | create-or-refresh-required | Runtime evidence plan required. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-CHAT-001 | S-006, AC-S006-01 | Product Discovery packet/template/validation flow | feature-public-seam | existing | Adapter contract proves canonical packet data is produced. | Integration test obligation for adapter output compatibility with Product Discovery validation. |
| DEP-CHAT-002 | S-004, S-005, S-007 | future chat or harness-chat feature bundle | new-capability | new | Feature public seams define conversation, history, packet, and download behavior. | Integration proof between feature domain, transport, and root-admin consumer. |
| DEP-CHAT-003 | S-005, AC-S005-02 | root and future tenant authorization platform | authz-capability | existing-plus-new-mapping | Permission mapping proves creator, root-builder, tenant denial, and object-level rules. | Security tests for unauthenticated, unauthorized, wrong-scope, and allowed paths. |
| DEP-CHAT-004 | S-004, AC-S004-01 | Postgres persistence and migrations | persistence-table-or-index | new | Data dictionary and migration plan prove durable facts, indexes, and lifecycle fields. | Persistence tests for creation, history, supersession, retention markers, and download evidence. |
| DEP-CHAT-005 | S-002, S-007 | design-system work panel and chat seams | design-system-seam | new | Behavior lock, reference pack, verification checklist, and adoption contract prove consumable seams. | Browser visual and interaction proof before app adoption. |
| DEP-CHAT-006 | S-003, S-005, S-007 | asset/download governance | asset-consumer-seam | new | Asset decision record proves generated PDF delivery and retention posture. | Security and runtime tests for authorized download and denied public access. |
| DEP-CHAT-007 | S-007 | root-admin shell registry and module journey files | frontend-topology-route | existing-plus-new-adoption | Adoption plan proves no durable route promotion and no app-page CSS drift. | Browser scenario for desktop panel and mobile floating action after DS prerequisite. |
| DEP-CHAT-008 | S-008 | PRD-derived test-case workflow | pre-existing-capability | existing | Test-case plan maps ACs to TC obligations. | Test traceability gate should show coverage before implementation completion. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Chat/harness feature public seam | root-admin Build panel now; future tenant builder, Support, and Reporting later | Protected conversation, history, packet generation, and download operations expose stable request/response and denial behavior. | mutable client-provided context as authority; app-local transcript files | Domain/transport/root-admin integration coverage |
| Product Discovery adapter | chat feature and future intake adapters | Produces canonical Product Discovery packet data from chat context and transcript. | parallel chat-only packet semantics | Adapter compatibility with Product Discovery validation |
| Generated packet PDF delivery seam | root-admin Build panel and future tenant builder UI | Authorized actor can download the scoped generated packet according to asset decision posture. | public permanent bucket URLs or generic file hosting | Asset/download security and runtime coverage |
| Design-system work panel and chat seams | root-admin shell first; future app surfaces later | App consumes DS-owned render/controller seams for panel, chat, starters, history, and PDF action. | copied governed markup, copied controller behavior, or app-page CSS | DS canonical and app-adoption browser coverage |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | planning owner; delivery harness | artifact maintainer | Product Discovery and Technical Steering accepted | capability matrix absent or stale | capability IDs, acceptance criteria, story IDs, routing posture | absent to created; stale to refreshed | conflicting source artifact; missing steering row | traceability, compatibility, audit |
| S-001 | planning owner; root builder as requester | artifact maintainer | MVP scope accepted | PRD absent | workflow states, non-goals, lifecycle names, denial/failure states | absent to created; draft to approved | missing product source; conflicting non-goal | accessibility, security, privacy, compatibility |
| S-002 | design-system owner; root builder | design-system maintainer | DS seams absent | behavior lock/reference/adoption artifacts absent | panel, mobile, chat, starter, history, PDF action states | absent to signed-off; signed-off to adopted | visual mismatch; accessibility failure; app-copy drift | accessibility, responsive behavior, human-visible parity |
| S-003 | architecture/security owner | asset decision owner | PDF delivery undecided | generated PDF not approved for implementation | asset kind, visibility, delivery mode, retention, quota, audit | undecided to approved; approved to superseded decision | unsafe public delivery; missing retention posture | security, privacy, compliance, operational evidence |
| S-004 | chat feature owner; data owner | backend/data maintainer | domain absent | conversation, packet, download records uncreated | IDs, actor/scope, timestamps, lifecycle, normalized context, retention | conversation draft to packet generated; packet generated to superseded | migration conflict; stale context; retention ambiguity | audit, persistence correctness, tenant isolation |
| S-005 | backend/security owner; root builder | API and permission maintainer | authenticated, unauthenticated, unauthorized, wrong-scope | conversation exists, absent, superseded, denied | route params, payload values, CSRF/session, object IDs | create, append, generate, read history, download, deny | auth failure, stale object, duplicate generation, provider failure | security, privacy, resilience, compatibility |
| S-006 | harness owner; Product Discovery adapter | platform seam maintainer | authorized root builder; invalid scope | transcript draft, packet-ready, superseded | transcript input, context selections, packet data, revision metadata | transcript to packet data; packet data to superseded revision | generation failure; invalid scope; duplicate request | compatibility, audit, resilience |
| S-007 | root builder | root-admin authorized user | desktop, mobile, authenticated, denied | panel closed/open, chat active, history visible, packet ready | starter prompts, free-form messages, PDF action, empty/failed states | closed to open; chat active to packet-ready; packet-ready to downloaded | API failure; download denial; DS seam unavailable | accessibility, responsive behavior, security, runtime evidence |
| S-008 | delivery harness; QA owner | test planning maintainer | PRD and matrix available | test cases absent or stale | TC IDs, AC IDs, proof layers, fixture shapes, live-data evidence | absent to planned; planned to implemented later | mock mismatch; wrong proof layer; missing runtime check | security, privacy, accessibility, resilience, operational evidence |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | planning owner; matrix absent | CHAT-CAPABILITY-MATRIX-ROWSET | source-level | TC obligation: matrix rows cover every AC before implementation tasks. | no |
| AC-S000-02 | planning owner; MVP scope locked | CHAT-CAPABILITY-MATRIX-ROUTING | source-level | TC obligation: matrix preserves root-admin scope and routing. | no |
| AC-S001-01 | root builder; normal workflow | CHAT-PRD-WORKFLOW | source-level | TC obligation: workflow states become testable acceptance cases. | no |
| AC-S001-02 | planning owner; future scope deferred | CHAT-PRD-NON-GOALS | source-level | TC obligation: tests avoid tenant-builder, Reporting, Support, and build execution as MVP requirements. | no |
| AC-S001-03 | conversation lifecycle states | CHAT-PRD-LIFECYCLE | source-level | TC obligation: lifecycle transitions receive later TC coverage. | no |
| AC-S002-01 | root builder; desktop/mobile; panel/chat states | CHAT-DS-SEAMS | human-visible-parity | TC obligation: DS visual, responsive, keyboard, and interaction scenarios. | yes |
| AC-S002-02 | app adoption owner; app drift states | CHAT-DS-ADOPTION | source-level | TC obligation: governed adoption check rejects copied markup/controller/page CSS. | yes |
| AC-S003-01 | authorized actor; generated PDF states | CHAT-PDF-ASSET-DELIVERY | source-level | TC obligation: delivery posture drives security and runtime tests. | yes |
| AC-S003-02 | unauthorized/public access states | CHAT-PDF-NO-PUBLIC-HOSTING | source-level | TC obligation: public delivery denial and raw URL exposure checks. | yes |
| AC-S004-01 | conversation, packet, download lifecycle | CHAT-DATA-DURABLE-FACTS | persistence-level | TC obligation: persistence tests for durable facts, supersession, and download evidence. | yes |
| AC-S004-02 | chat feature owner; public seam states | CHAT-FEATURE-OWNERSHIP | source-level | TC obligation: feature dependency graph and manifest coverage. | yes |
| AC-S005-01 | authenticated, unauthenticated, unauthorized, wrong-scope | CHAT-API-CONTRACTS | contract-level | TC obligation: route contract and denial cases. | yes |
| AC-S005-02 | creator, root builder, future tenant builder | CHAT-PERMISSION-MAPPING | contract-level | TC obligation: allow/deny, tenant-scope denial, object-level rule cases. | yes |
| AC-S006-01 | adapter caller; valid transcript and scope | CHAT-PD-ADAPTER-CONTRACT | contract-level | TC obligation: adapter output validates as canonical Product Discovery packet data. | yes |
| AC-S006-02 | adapter caller; failure and duplicate states | CHAT-PD-ADAPTER-FAILURES | contract-level | TC obligation: failure, stale context, duplicate generation, supersession cases. | yes |
| AC-S007-01 | root builder; governed UI states | CHAT-APP-DS-CONSUMPTION | rendered-browser | TC obligation: app consumes DS seam and matches adopted behavior. | yes |
| AC-S007-02 | root builder; runtime happy and denied paths | CHAT-ROOT-ADMIN-BROWSER-FLOW | rendered-browser | TC obligation: browser flow covers chat, history, packet generation, and PDF action. | yes |
| AC-S008-01 | QA owner; all story states | CHAT-TEST-CASE-PLAN | source-level | TC obligation: PRD-derived test cases cover named families. | yes |
| AC-S008-02 | QA owner; live-data/browser states | CHAT-RUNTIME-EVIDENCE | source-level | TC obligation: runtime evidence plan names active process, live API data, served assets, and mock-honesty checks. | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| BLK-SB-001 | S-000, S-001, S-004, S-005, S-006, S-007, S-008 | capability-matrix | Technical Steering requires capability rows before delivery tasks. | Capability matrix for root-admin Build chat MVP. | Capability matrix exists and maps story ACs. |
| BLK-SB-002 | S-001, S-004, S-005, S-006, S-007, S-008 | artifact-drift | PRD is required to lock lifecycle, permissions, failure states, and non-goals. | PRD for root-admin Build chat MVP. | PRD exists and aligns with Product Discovery and Technical Steering. |
| BLK-SB-003 | S-002, S-007 | design-system-foundation | Governed app UI cannot start until DS seams are signed off. | Behavior lock, reference pack, verification checklist, and adoption contract. | DS artifacts exist and app adoption contract approves consumable seams. |
| BLK-SB-004 | S-003, S-005, S-007 | asset-decision | Generated PDF download cannot be implemented without asset/download posture. | Asset consumer decision record for generated Product Discovery packet PDF. | Decision record approves delivery, retention, authorization, and cleanup posture. |
| BLK-SB-005 | S-004, S-005, S-006, S-007 | permission-model | Protected routes and history visibility require explicit permission mapping. | Permission mapping and API contract. | Allow, deny, creator, root-builder, tenant-scope, and object-level rules are documented. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-CHAT-001 | BLK-SB-004 | Should generated Product Discovery packet PDFs be transient downloads only for MVP, stored generated assets with history links, or stored later after transient MVP proof? | yes | unresolved |
| Q-CHAT-002 | BLK-SB-005 | Which named root-builder role or permission should be allowed to review root-admin discovery histories beyond the original chat creator? | yes | unresolved |
| Q-CHAT-003 | BLK-SB-003 | Which existing design-system panel/chat family can be extended, or is this a new governed family candidate? | yes | design-system owner |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-CHAT-001 | S-000 | BLK-SB-001; ART-CHAT-001 | capability-matrix-required | No human decision required unless capability matrix reveals scope conflict. | Safe default used: matrix created from Story Breakdown and Technical Steering. | Prove current during the next artifact sweep and refresh if downstream decisions change rows. | yes | resolved |
| U-CHAT-002 | S-001 | BLK-SB-002; ART-CHAT-002 | prd-required | No human decision required unless PRD exposes a business-visible policy conflict. | Safe default used: PRD preserves root-admin MVP and future-scope exclusions. | Prove current during the next artifact sweep and refresh if human decisions alter requirements. | yes | resolved |
| U-CHAT-003 | S-002, S-007 | BLK-SB-003; Q-CHAT-003; ART-CHAT-004 | design-system-governance | Which existing DS family should be extended, or should this become a new family candidate? | Extend existing side-panel/chat family if one exists; create new governed family candidate if no consumable seam exists. | Run design-system governance discovery before root-admin app UI tasks. | no | needs-human-answer |
| U-CHAT-004 | S-003, S-005, S-007 | BLK-SB-004; Q-CHAT-001; ART-CHAT-005 | human-decision | Should generated Product Discovery packet PDFs be transient downloads only, stored generated assets, or transient first and stored later? | transient MVP; stored generated asset; transient first then stored later | Decide PDF delivery posture and create asset consumer decision record. | no | needs-human-answer |
| U-CHAT-005 | S-005 | BLK-SB-005; Q-CHAT-002; ART-CHAT-007; ART-CHAT-008 | permission-mapping-required | Which named root-builder role or permission may review root-admin discovery histories beyond the creator? | platform root builder permission; root operator permission; creator-only until explicit review role exists | Decide review permission label, then create permission mapping and API contract. | no | needs-human-answer |
| U-CHAT-006 | S-004 | ART-CHAT-009 | data-dictionary-required | No human decision required unless data dictionary exposes retention or export conflict. | Safe default: preserve durable facts named by steering and Product Discovery. | Run data dictionary workflow for chat/harness-chat records. | yes | ready-to-create-artifact |
| U-CHAT-007 | S-006 | ART-CHAT-006 | artifact-creation | No human decision required unless the blueprint exposes a new shared platform seam beyond Technical Steering. | Safe default: blueprint a narrow Product Discovery adapter that consumes existing Layer 1 packet semantics. | Run implementation blueprint workflow after PRD, matrix, API contract, and permission posture exist. | yes | ready-to-create-artifact |
| U-CHAT-008 | S-004 | ART-CHAT-010 | artifact-creation | No human decision required unless the feature name or ownership conflicts with an existing feature. | Safe default: create a feature manifest for the selected chat or harness-chat feature owner. | Create the feature manifest during the backend feature planning or first implementation slice. | yes | ready-to-create-artifact |
| U-CHAT-009 | S-004 | ART-CHAT-011 | artifact-creation | No human decision required unless the dependency graph reveals an undeclared cross-feature dependency. | Safe default: regenerate feature dependency graph after feature manifest and public seams are created. | Run the feature dependency graph refresh after manifests or public seams change. | yes | ready-to-create-artifact |
| U-CHAT-010 | S-008 | ART-CHAT-003; ART-CHAT-012 | artifact-creation | No human decision required unless proof obligations conflict with approved scope. | Safe default: derive tests from PRD, capability matrix, and this Story Breakdown. | Run PRD test-case planner and QA evidence planning after PRD and matrix exist. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-CHAT-001 | S-000 | capability matrix | prove-current | capability matrix workflow | no |
| ART-CHAT-002 | S-001 | PRD | prove-current | PRD workflow | no |
| ART-CHAT-003 | S-008 | PRD-derived test cases | create | prd-test-case-planner | yes |
| ART-CHAT-004 | S-002 | design-system governance | create | frontend-design-system-loop-maintainer | yes |
| ART-CHAT-005 | S-003 | asset consumer decision record | create | asset decision workflow | yes |
| ART-CHAT-006 | S-006 | implementation blueprint | create | implementation-blueprint-maintainer | yes |
| ART-CHAT-007 | S-005 | API contract | create | api-contract-maintainer | yes |
| ART-CHAT-008 | S-005 | permission mapping | create | permission mapping workflow | yes |
| ART-CHAT-009 | S-004 | data dictionary | create | data-dictionary-maintainer | yes |
| ART-CHAT-010 | S-004 | feature manifest | create | feature implementation workflow | yes |
| ART-CHAT-011 | S-004 | feature dependency graph | refresh | generate:feature-dependencies | yes |
| ART-CHAT-012 | S-008 | runtime/browser QA evidence plan | create | QA evidence workflow | yes |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-002, S-003, S-007
- Completed Layer 3 unblock stories:
  S-000, S-001
- Stories needing capability matrix:
  none
- Stories needing PRD refinement:
  S-004, S-005, S-006, S-008
- Stories needing Technical Steering revisit:
  none
- Broad cleanup or shortcut risk:
  `none`
- Architecture invention risk:
  `none`

## Layer 4 Handoff

A story may hand off to Task Breakdown only when:

- it has a value type and delivery shape
- it has a clear job to be done
- acceptance criteria are concrete and verifiable
- dependency and seam obligations are recorded
- capability matrix posture is recorded
- proof layers and test families are assigned
- required artifact obligations are recorded
- architecture invention check is not blocked
- blockers are resolved or intentionally carried as non-delivery control work

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | not-needed | Capability matrix now exists; refresh only if later decisions change capability rows. |
| S-001 | not-needed | PRD now exists; refresh only if later decisions change requirements. |
| S-002 | blocked | Design-system family/seam decision and governance artifacts are missing. |
| S-003 | blocked | Generated PDF delivery posture needs a human decision and asset record. |
| S-004 | blocked | Data dictionary and persistence plan are missing. |
| S-005 | blocked | API contract, permission mapping, root-builder review permission decision, and PDF asset decision are missing. |
| S-006 | blocked | Protected API/permission contract and implementation blueprint are missing. |
| S-007 | blocked | DS seams, API/permission contracts, PDF asset decision, adapter contract, and evidence plan are missing. |
| S-008 | blocked | PRD-derived test cases and runtime/browser evidence plan are missing. |
