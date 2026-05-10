# Technical Steering Packet: Chat Interface For Layer One Product Discovery

## Status

- Packet status: `ready-for-story-breakdown`
- Packet date: 2026-05-05
- Steering ID: `TS-2026-05-05-chat-interface-layer-one-discovery`
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Related ADRs reviewed:
  - `docs/architecture/adr/0002-use-feature-bundle-architecture.md`
  - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
  - `docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
  - `docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`
  - `docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`
  - `docs/architecture/adr/0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`
  - `docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`
  - `docs/architecture/adr/0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`
  - `docs/architecture/adr/0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`
  - `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
  - `docs/architecture/adr/0032-promote-selected-root-admin-suites-from-hash-aliases-to-path-backed-canonical-routes.md`
  - `docs/architecture/adr/0035-adopt-object-storage-backed-asset-foundation.md`
- Validation status: `pass`

## Product Handoff

- Product Discovery status: `ready-for-technical-steering`
- Product intent preserved: yes. The root-admin MVP must expose a reusable
  right-side work panel with Reporting, Support, and Build actions; Build is
  the only active workflow; Build opens a contextual Layer 1 Product Discovery
  chat; the chat generates a simple structured Product Discovery packet PDF
  export and preserves history.
- Product questions resolved or carried as blockers:
  - root-admin is the first rollout surface.
  - Reporting and Support are visible coming-soon actions in the MVP.
  - chat creators can see their own histories.
  - root builders can see root-admin discovery histories for review/support.
  - histories and generated PDFs are retained indefinitely until a broader
    retention policy exists.
  - regenerated packets supersede earlier packets from the same conversation.
  - PDF output contains the Product Discovery packet itself, with no separate
    internal-only notes layer.
  - PDF generation uses approved Product Discovery packet data only; raw chat
    transcript and conversation history remain in app history and are excluded
    from the PDF unless later explicitly approved.
  - Approved packet versions are immutable. Material changes must move back up
    the loop through a change request or review path and create a new approved
    packet version.
  - Superseded approved packet versions remain accessible and downloadable to
    authorized root builders as history, with clear previous and next packet
    links.
  - Transient PDF generation failures can be retried immediately from the same
    approved packet version, with failed attempts recorded. Permission,
    inaccessible-data, and data-integrity failures are not treated as normal
    retry states.
  - Preferred MVP PDF renderer is self-hosted Playwright/Chromium behind a
    provider-neutral generated-document seam, avoiding paid provider
    dependency while preserving future renderer replacement.
  - Long PDF content may paginate naturally. The renderer must avoid avoidable
    image and table-row cuts across page boundaries, and broad tables must use
    an approved wider or fit layout rather than clipping columns.
  - Generated PDFs start with a compact header page containing packet version,
    generated timestamp, generating actor, approval status, and previous/next
    packet links where those links exist.
  - The header page should not include a visible explanatory note that the PDF
    was generated from approved packet data only.
  - User-visible cancellation is out of scope for MVP; cancellation is handled
    by server-side timeout, request abort, cleanup, or future worker lifecycle
    behavior.
  - Every PDF generation failure records audit and metrics evidence. Alerting
    starts only after repeated failures cross a threshold defined in PRD, API
    contract, or implementation blueprint work.
  - Support/root-builder views may show safe failed-generation reason
    categories. Stack traces, renderer internals, raw payloads, storage paths,
    session identifiers, and infrastructure details remain internal-only.
  - Renderer contracts carry locale context now, but MVP PDF content is
    English-only until the planned repo localization layer is introduced.
  - Migration/reversibility is seam-only for MVP: no second renderer fallback
    is implemented or tested now.
  - Product Discovery maps approved packet data into renderer-neutral document
    primitives; the generated-document seam must not accept Product
    Discovery-specific fields directly.
  - MVP PDF rendering is a simple structured export, not a polished branded
    document with custom presentation rules.
  - PDF generation should be usable by other features in future, so Product
    Discovery is the first consumer of a reusable generated-document boundary,
    not a hard-coded one-off renderer.
  - Scale posture is Option 2 light: a moderate shared export seam with bounded
    concurrency, timeout, fallback, and rate-limit controls, while preserving a
    path to a future high-volume async export pipeline.
  - one final readiness confirmation before packet generation is required for
    the in-app POC. When the chat believes it has enough information, it asks
    whether the requester has any final follow-up; if the requester says there
    is nothing else, the system generates the packet for download. Repeating
    the same final confirmation is not approved.
  - tenant-builder rollout is a future expansion but tenant scope and
    cross-tenant deny remain required design constraints.
- New family or template decision: `approved-new-family`

## Architecture Classification

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |
| TS-CHAT-001 | In-app harness chat domain | feature-local | future chat or harness-chat feature bundle | approved | Conversations, context selections, generated packet metadata, history visibility, retention, and supersession are durable product facts that need an owning domain. | DEV:migration-persistence |
| TS-CHAT-002 | Layer 1 Product Discovery orchestration seam | platform-seam | harness/Product Discovery adapter consumed by chat domain | approved | The UI must trigger the established Layer 1 Product Discovery flow rather than creating a parallel discovery process. | DEV:platform-seam |
| TS-CHAT-003 | Root-admin panel adoption | design-system-seam | design-system-owned right-panel and mobile floating action family consumed by root-admin shell | approved | Shell chrome, right-side panels, floating mobile actions, chat threads, and starter prompts are governed frontend patterns. | GOV:design-system |
| TS-CHAT-004 | Root-admin app integration | feature-public-seam | root-admin shell/module adoption consuming design-system seams and chat public seam | approved | First rollout is root-admin only; adoption should not copy DS markup, controller behavior, or CSS into app pages. | DEV:frontend |
| TS-CHAT-005 | Conversation and packet APIs | feature-public-seam | chat feature transport contract | approved | The browser needs protected create/read/history/generate/download behavior with stable request/response shapes and denial states. | DOC:api-contract |
| TS-CHAT-006 | Root-builder and future tenant-builder authorization | feature-local | chat feature policy plus existing root/tenant authorization platform | approved | Creator history, root-builder review, tenant scope, and cross-tenant deny rules require explicit permission mapping. | DOC:permission-mapping |
| TS-CHAT-007 | Generated Product Discovery packet PDF | architecture-foundation-required | asset/download governance plus packet-rendering decision | approved | Downloadable generated PDFs may trigger asset-consumer, retention, and delivery decisions before implementation. | DECISION:architecture-foundation |
| TS-CHAT-008 | Data dictionary and retention truth | feature-local | chat feature data dictionary | approved | Conversation history, packet versions, supersession, download evidence, scope, actor, and retention rules are source-independent data facts. | DOC:data-dictionary |
| TS-CHAT-009 | QA and browser evidence | feature-public-seam | chat feature tests plus root-admin browser scenarios | approved | The feature is user-visible, permission-sensitive, persistence-backed, and frontend-governed. | EVIDENCE:qa-evidence |
| TS-CHAT-010 | Future tenant-builder rollout | feature-local | future tenant-builder adoption and tenant-scoped repo/configuration flows | deferred-with-owner | Product Discovery named tenant builders, but MVP is root-admin only. Tenant-builder support needs separate routing, permission, history, and tenant-context planning before activation. | DOC:docs-artifact |
| TS-CHAT-011 | Reusable chat and panel logic | shared-lib-candidate | chat feature domain first, shared extraction only after another active consumer | deferred-with-owner | Reporting and Support may later reuse panel/chat orchestration, but MVP has one active Build consumer. | DECISION:refactor-first |
| TS-CHAT-012 | Maintained docs and artifact alignment | feature-local | planning and source-independent artifact sweep | approved | PRD, capability matrix, API, data, permissions, asset/download, design-system, and QA artifacts must stay aligned before implementation completion. | DOC:docs-artifact |

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |
| API route or contract change | yes | Browser chat, history, packet generation, and PDF download need protected contracts. | API contract story required before route implementation. | `DOC:api-contract` |
| persistence or migration change | yes | Durable conversations, contextual prompts, packet versions, supersession, downloads, actor scope, and history retention are required. | Persistence/data story required. | `DEV:migration-persistence` |
| authz or permission change | yes | Creator history, root-builder review access, and future tenant-scope deny behavior require explicit rules. | Permission mapping story required. | `DOC:permission-mapping` |
| DEV:frontend rendered surface | yes | Root-admin side panel, mobile floating action, chat thread, starter prompts, history, and PDF download UI are rendered browser surfaces. | Frontend adoption story required after design-system prerequisites. | `DEV:frontend` |
| governed GOV:design-system seam | yes | Panel, mobile action, chat thread, prompt starters, history view, and packet download affordance are governed shared UI. | Design-system behavior-lock and adoption stories required before app UI. | `GOV:design-system` |
| shared platform/runtime seam | yes | Chat must call the Product Discovery harness and PDF generation should use a reusable generated-document boundary with Product Discovery as the first consumer. | Platform seam story required. | `DEV:platform-seam` |
| reusable logic or extraction pressure | yes | Chat orchestration may remain feature-owned, but generated-document rendering should be shaped for future feature consumers without exposing a broad document platform in the MVP. | Define a narrow reusable rendering seam now; defer generic document platform behavior until a second feature proves it. | `DECISION:refactor-first` |
| data dictionary impact | yes | New durable records and retention/supersession behavior require source-independent documentation. | Data dictionary story required. | `DOC:data-dictionary` |
| QA/runtime evidence need | yes | Permission boundaries, PDF generation, retention, browser behavior, and mock honesty require layered evidence. | PRD-derived test cases and runtime/browser scenarios required. | `EVIDENCE:qa-evidence` |
| source-independent docs impact | yes | Product Discovery, Technical Steering, future PRD, capability matrix, API, data, permissions, DS, and asset/download decisions must align. | Artifact sweep story required. | `DOC:docs-artifact` |

## Architecture Decision Analysis

| Decision ID | Concern Area | Architecture Question | Analysis Status | Options Considered | Industry / Best-Practice Baseline | Local Repo Constraints | Trade-Offs | Risk Review | Cost / Delivery Impact | Security / Privacy / Compliance Impact | Operability Impact | Migration / Compatibility Impact | Testability / Evidence Impact | Reversibility | Recommended Option | Rejected Alternatives | Decision Owner / Signoff | Durable Authority Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ADA-CHAT-001 | Feature ownership | Should chat conversations and packet generation live in a feature-owned domain or root-admin-local UI logic? | approved | Feature-owned chat/harness domain; root-admin-local state; direct harness-only transcript files. | Durable conversations and generated artifacts need explicit ownership, access control, lifecycle, and queryable history. | Repo requires feature-local durable behavior, public seams, manifests, data dictionaries, and anti-drift boundaries. | Feature ownership adds planning and persistence work but prevents root-admin shell drift and future Support/Reporting duplication. | Root-admin-local logic would mix shell chrome, orchestration, and durable history; direct harness files would weaken permissions and retention. | Higher MVP planning cost; lower cost for future tenant-builder, Support, and Reporting expansion. | Feature-owned authorization can enforce creator/root-builder access and tenant-scope deny. | Central history and packet status support support/review workflows. | Additive new feature; root-admin adoption can be incremental. | Persistence, API, and permission tests become direct and traceable. | Reversible before production adoption; persisted histories later require retention/export decisions. | Create a feature-owned chat or harness-chat domain and expose narrow public seams to root-admin and harness adapters. | Root-admin-local state rejected for drift; direct transcript files rejected for weak access control and lifecycle. | Technical Steering owner; requester locked MVP product scope. | PRD, capability matrix, feature manifest, data dictionary, API contract. |
| ADA-CHAT-002 | Product Discovery integration | Should Build chat call the existing Layer 1 flow or create a new chat-specific discovery format? | approved | Adapter around existing Product Discovery; new chat-only packet model; manual PDF template assembled by UI. | Product workflows should reuse the canonical discovery process and generate the same durable packet format. | Layer 1 Product Discovery already has packet templates, taxonomy, validation, and artifact requirements. | Adapter work is more disciplined but avoids duplicate product semantics. | A chat-only model would drift from Product Discovery standards and make packet evidence less trustworthy. | Moderate adapter cost; improves long-term process consistency. | Reusing Layer 1 helps preserve scope, tenant boundary, and audit expectations. | Harness integration failures can be isolated behind a seam. | Additive seam; existing manual Product Discovery remains usable. | Existing packet validation can be part of generation tests. | Adapter can be replaced if a better harness seam is approved. | Build a narrow orchestration adapter that produces canonical Product Discovery packet data. | New chat-only packet format rejected for standards drift. | Technical Steering owner; Product Discovery packet source. | Product Discovery harness seam and generated packet contract. |
| ADA-CHAT-003 | Governed frontend path | Can root-admin implement the panel directly, or must design-system seams exist first? | approved | DS-owned panel/chat seams before app adoption; one-off root-admin implementation; app-local CSS and controller logic. | Shared shell chrome and reusable chat/panel behavior should come from a governed design system before broad app adoption. | Repo prohibits app-page CSS for governed app pages and requires DS-owned render/controller seams for governed app adoption. | DS-first increases upfront work but prevents copied markup and inconsistent behavior. | Direct implementation would likely violate shell, page CSS, and adoption rules. | Adds a design-system story before root-admin UI implementation. | DS governance improves accessibility, keyboard, mobile, and denied-state consistency. | Canonicals and browser scenarios provide repeatable evidence. | Additive DS seams; app adoption can target root-admin only. | Visual, accessibility, and browser evidence can be verified before app wiring. | DS seams can evolve while preserving app consumption contract. | Run design-system governance for the work panel, mobile button, chat thread, starters, history, and PDF action before app UI. | One-off app-local implementation rejected unless explicitly approved later. | Technical Steering owner; frontend/design-system owner. | Design-system behavior locks, reference packs, verification, adoption docs. |
| ADA-CHAT-004 | PDF delivery governance | Should generated PDFs be treated as transient downloads or governed generated assets? | approved | Transient generated response; stored generated asset; stored packet data with regenerated PDF on demand. | Downloadable generated files need clear retention, access, audit, and delivery posture; generated source-of-truth data should not depend on mutable rendering output alone. | Asset upload/read rules require a decision before file delivery behavior that stores, links, displays, downloads, or publishes user-managed assets; generated PDFs still need security and retention classification. | Storing rendered PDFs simplifies history but adds file lifecycle and access surface; regenerating from packet data reduces stored file risk but requires stable rendering. | Treating PDFs as casual downloads risks unclear retention, stale artifacts, and permission leaks. | Layer 3 must create the decision record before implementation, but Story Breakdown may proceed by making that a blocking story. | Must avoid public URLs and cross-tenant leakage; downloads should be actor/scope-authorized. | Download failures and regeneration need recoverable evidence. | Additive; no public delivery approved. | Tests must prove authorization, scope, supersession, and rendering integrity. | Regeneration model is easier to change before production adoption. | Approve Story Breakdown with a required asset/download decision story before any PDF implementation task. | Public delivery and generic file hosting rejected for MVP. | Architecture/security owner. | Asset consumer decision record, API contract, data dictionary. |
| ADA-CHAT-005 | Authorization model | Should MVP model tenant builders now or root-admin only with future tenant constraints? | approved | Root-admin active MVP plus future tenant constraints; full root/tenant implementation now; root-only with no tenant model. | MVP should implement the smallest active audience while preserving known future security boundaries. | Product Discovery set root-admin first, but durable defaults require tenant boundary protection when future tenant builders are known. | Root-admin-only implementation is smaller; carrying tenant constraints avoids incompatible data and route shapes. | Ignoring tenant scope now could create incompatible history and packet records. | Moderate modeling cost, lower migration risk. | Records need platform/tenant scope fields even if tenant UI is deferred. | Future tenant support can reuse history and packet constraints. | Additive scope model; tenant routes remain out of MVP. | Allow/deny tests can cover root-admin now and tenant-deny invariants later. | Tenant-builder rollout remains separately steerable. | Build root-admin MVP while modeling platform versus tenant scope and denying tenant cross-scope behavior by default. | Full tenant UI now rejected as out of MVP; root-only records rejected for future incompatibility. | Technical Steering owner; security owner. | Permission mapping, data dictionary, API contract. |
| ADA-CHAT-006 | Generated-document reuse | Should PDF generation be a narrow Product Discovery renderer only, or a reusable generated-document seam for future features? | approved | One-off Product Discovery renderer; reusable generated-document boundary with Product Discovery first; broad document-generation platform. | Export generation should separate feature-owned source data and authorization from generic document rendering and delivery handoff so future exports can reuse safe primitives. | Repo anti-drift rules favor explicit platform seams, but broad shared abstractions should not be overbuilt before a second consumer. | A reusable boundary adds a little architecture work now; a broad platform would overreach; a one-off renderer would likely force future duplication. | One-off rendering could bake Product Discovery fields into document infrastructure; broad generic rendering could introduce unsafe arbitrary document behavior. | Moderate MVP cost for a narrow boundary; avoids later rewrite if other features need structured exports. | Keeps authorization with owning features and avoids exposing a generic document API to app pages. | Render failures and audit events can become consistent across future exports. | Additive; future consumers still need their own planning, authz, data, and asset decisions. | Tests can target the generic renderer boundary and Product Discovery packet mapping separately. | Reversible by keeping the boundary internal until another feature adopts it. | Use a reusable generated-document boundary with Product Discovery as the first consumer; defer generic document platform behavior. | One-off renderer rejected for future duplication risk; broad document platform rejected for MVP overreach. | Requester confirmed future feature reuse on 2026-05-06; architecture/security owner. | PRD, API contract, implementation blueprint, data dictionary. |

## Frontend Architecture Classification

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin work panel adoption | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | app-shell | app-adoption | ui-state | none | root-admin shell work panel | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | ui-local | DS-owned-shell-required | DS-task-required | shell-registry-update | shell-bootstrap | ready | Ready for Story Breakdown; implementation remains gated by DS artifact obligations. |
| Build chat browser workflow | root-admin | in-app harness chat | build discovery | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build panel state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Chat flow state belongs to the chat feature/controller, not curated durable topology. |
| Conversation history view | root-admin | in-app harness chat | discovery history | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build history state | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | History is server-backed but route topology is not a durable product page in MVP. |
| PDF download action | root-admin | in-app harness chat | packet export | hidden/internal | root-operator | browser-workflow | journey | ui-state | none | root-admin Build packet action | not applicable | manual-shell-registry | manual-shell-registry | target-authority-current | never-serialize | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | ready | Download authorization and scope are server-side; no secrets or authority in URL state. |

## Browser Security Posture

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root-admin browser calls must use existing authenticated session posture. | API/security tests must prove unauthenticated and unauthorized denial. | yes |
| csp-assets | yes | Chat UI and PDF download affordance must use approved served assets and DS entrypoints. | Frontend/DS implementation must preserve CSP-compatible asset loading. | yes |
| privileged-helper | yes | Harness/Product Discovery adapter may execute privileged generation behavior. | Helper must avoid exposing prompt/session secrets and must validate actor and scope before generation. | yes |
| csrf-mutation | yes | Creating conversations, appending messages, generating packets, and downloading may be browser-triggered protected actions. | Route contracts must use existing CSRF/session protections for browser mutations. | yes |
| url-replay-state | yes | Page/module/role context must not become authority or serialize sensitive replay state into URLs. | Tests must prove authority comes from server session/current context, not URL state. | yes |
| sensitive-rendering | yes | Chat transcripts and packets may include platform or tenant change intent. | Redaction/visibility tests and mock-honesty checks required. | yes |
| asset-delivery | yes | Generated PDF download needs an approved transient or stored generated-file posture. | Asset/download decision record required before implementation. | yes |

## Artifact Obligations

| Artifact | Required Action | Owner Layer | Blocks Handoff | Notes |
| --- | --- | --- | --- | --- |
| Product Discovery packet | prove-current | Layer 1 | yes | Source packet exists and validates structurally. |
| Technical Steering packet | create | Layer 2 | yes | This packet records architecture classifications and blockers. |
| PRD | create | Layer 3 | yes | Required for MVP capability details, lifecycle, permissions, error states, and non-goals. |
| Capability matrix | create | Layer 3 | yes | Required for chat, history, packet generation, PDF download, authorization, and denial behavior. |
| PRD-derived test cases | create | Layer 3 | yes | Required before implementation tasks. |
| Asset consumer decision record for generated packet PDF delivery | prove-current | Layer 3 | yes | Approved at docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md for transient generated download, simple structured export rendering, approved-packet-data-only PDF source content, immutable approved packet versions, downloadable superseded history with previous/next links, immediate retry for transient generation failures, self-hosted Playwright/Chromium as preferred MVP renderer, natural pagination with image/table-row break protection and broad-table fit handling, compact header page metadata, audit/metrics for every generation failure, threshold-based repeated-failure alerting, safe support-visible failure reason categories, locale-aware renderer contract with English-only MVP content, seam-only renderer reversibility with no second MVP renderer fallback, feature-owned packet-to-document mapper, future reusable generated-document boundary posture, and Option 2 light scale posture. Exact numeric limits and alert thresholds are intentionally deferred to downstream PRD/API/blueprint ownership, with a hard rule that generated-document implementation cannot start until those limits are defined. |
| Design-system behavior lock/reference/verification/adoption artifacts | create | Layer 3/4 | yes | Required before root-admin app UI adoption. |
| API contract docs and OpenAPI/Postman maintained artifacts | create | Layer 4 | yes | Required when routes are introduced. |
| Data dictionary | create | Layer 4 | yes | Required for conversation, packet, PDF/download, scope, retention, and supersession records. |
| Permission mapping | create | Layer 4 | yes | Required before protected routes or root-builder history access. |
| Feature manifest | create | Layer 4 | yes | Required if a new chat/harness-chat feature is introduced. |
| Feature dependency graph | update | Layer 4 | yes | Required after manifests or feature public seams change. |
| Runtime/browser QA evidence | create | Layer 4 | yes | Required for visible root-admin panel, mobile, history, PDF generation, denial, and failure scenarios. |
| Future tenant-builder rollout discovery | defer-approved | Future Layer 1/2 | no | Tenant-builder active UI/workflows are out of MVP. |
| Reporting and Support active flows | defer-approved | Future Layer 1/2 | no | Visible coming-soon only in MVP. |

## Deterministic Signal Checks

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? | yes | Product Discovery harness adapter and PDF generation/download flow. | platform-seam | DEV:platform-seam | Approved as narrow adapter seams consumed by feature-owned chat domain. |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | Browser needs conversation, history, packet-generation, and download routes. | feature-public-seam | DOC:api-contract | Route work must include API contracts. |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? | yes | Durable history, packet versions, downloads, retention, and supersession are required. | feature-local | DEV:migration-persistence | Persistence is owned by the chat feature. |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? | yes | Creator history, root-builder review, tenant-scope deny, and PDF download access. | feature-local | DOC:permission-mapping | Permission mapping required before exposed routes. |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? | yes | Side panel, mobile action, chat thread, starter prompts, history, and PDF action are governed UI. | design-system-seam | GOV:design-system | DS artifacts required before app UI implementation. |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | yes | Root-admin panel and Build chat are rendered browser workflows. | feature-public-seam | DEV:frontend | Frontend work is blocked until DS prerequisite is met. |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into src/lib? | yes | Panel/chat orchestration may later support Reporting and Support flows. | shared-lib-candidate | DECISION:refactor-first | Keep MVP feature-owned until second active consumer proves extraction. |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? | yes | Conversation, packet, PDF/download, scope, retention, and supersession records. | feature-local | DOC:data-dictionary | Data dictionary required. |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? | yes | Visible root-admin UI plus permission-sensitive API and PDF generation. | feature-public-seam | EVIDENCE:qa-evidence | Runtime/browser and persistence-backed tests required. |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? | yes | PRD, capability matrix, API, data, permissions, DS, asset/download decision, and QA evidence. | feature-local | DOC:docs-artifact | Artifact sweep required before implementation completion. |

## Steering Decisions

| Decision ID | Decision | Rationale | Compatibility / Migration Strategy | Downstream Owner |
| --- | --- | --- | --- | --- |
| DEC-CHAT-001 | Create or select a feature-owned chat/harness-chat domain before implementation. | Durable conversations, packet metadata, history access, retention, and supersession need one owning domain. | Additive feature; no existing contracts broken. | PRD / Story Breakdown |
| DEC-CHAT-002 | Build a narrow adapter to the canonical Layer 1 Product Discovery process. | Keeps packet content aligned with existing Product Discovery templates and validation. | Existing manual Product Discovery flow remains valid. | Implementation Blueprint |
| DEC-CHAT-003 | Keep root-admin as the only active MVP surface. | Product Discovery selected root admin for first rollout. | Later app-wide or tenant-builder rollout requires separate planning. | Story Breakdown |
| DEC-CHAT-004 | Treat Reporting and Support as visible coming-soon actions only. | Keeps panel shape stable without inventing incomplete flows. | Later active flows require their own Product Discovery and steering. | PRD |
| DEC-CHAT-005 | Require design-system governance before root-admin app UI implementation. | The panel, chat, prompts, mobile action, history, and PDF affordance are governed UI. | No app-page CSS or copied controller behavior is approved. | Design-system owner |
| DEC-CHAT-006 | Require an asset/download decision for generated packet PDFs. | The MVP downloads generated files and retains generated outputs indefinitely until broader policy exists. | Public delivery and generic file hosting are not approved. | Architecture/security owner |
| DEC-CHAT-007 | Model platform and tenant scope even though tenant-builder UI is deferred. | Future tenant builders are known; records must not require migration from root-only assumptions. | Tenant-builder active workflows remain out of MVP. | Data/API/permission owners |
| DEC-CHAT-008 | Use server-side authorization as authority for context and downloads. | Page/module/role starter prompts are helpful context, not authority. | No sensitive authority in URLs or client-provided context. | Backend/security owner |
| DEC-CHAT-009 | Run the Layer 2 to Layer 3 blocker-resolution loop before Story Breakdown. | The harness should proactively work through requester-answerable blockers and queue technical/design/security blockers as Layer 3 unblock stories. | Additive process behavior; no product contract changes. | Harness/planning owner |

## Blockers

| Blocker ID | Blocks | Blocker Type | Required Output | Owner |
| --- | --- | --- | --- | --- |
| BLK-CHAT-001 | Implementation task breakdown | planning artifact | PRD, capability matrix, and PRD-derived test cases for root-admin MVP | Planning owner |
| BLK-CHAT-002 | Root-admin app UI implementation | design-system artifact | Signed-off DS seams for panel, mobile action, chat thread, starters, history, and PDF action | Frontend/design-system owner |
| BLK-CHAT-003 | PDF generation/download implementation | asset/download governance | Decision record for transient versus stored generated PDF delivery and retention | Architecture/security owner |
| BLK-CHAT-004 | Protected routes and history access | security/contract artifact | API contract and permission mapping | Backend/security owner |
| BLK-CHAT-005 | Persistence implementation | data artifact | Data dictionary and migration plan for conversations, packet versions, scope, downloads, and supersession | Backend/data owner |
| BLK-CHAT-006 | Future tenant-builder active rollout | product/architecture artifact | New or revised Product Discovery and Technical Steering for tenant-builder workflows | Product/architecture owner |

## Layer 2 To Layer 3 Blocker-Resolution Loop

| Item ID | Source Row / Artifact | Classification | Requester-Facing Question Or Action | Owner / Layer | Resolution Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| L2L3-CHAT-001 | BLK-CHAT-001 | required-planning-artifact | Queue PRD, capability matrix, and PRD-derived test cases as Layer 3 unblock stories for the root-admin MVP. | Planning / Layer 3 | queued-as-layer-3-unblock-story | The requester has already resolved MVP product scope. |
| L2L3-CHAT-002 | BLK-CHAT-002 | architecture-security-design-decision | Queue a labeled `/design-system` demo rendering for the panel, mobile action, chat thread, starters, history, and PDF action before behavior-lock signoff, then convert reviewed behavior into the normal behavior-lock/reference/canonical/verification/adoption chain before root-admin app UI implementation. | Frontend design-system / Layer 3 | queued-as-layer-3-unblock-story | The first design-system review should be rendered visual/behavior feedback, not behavior-lock document signoff. Do not ask the requester to choose widgets; design-system loop owns pattern decisions. |
| L2L3-CHAT-003 | BLK-CHAT-003, ADA-CHAT-004, and ADA-CHAT-006 | architecture-security-design-decision | Reference the approved generated packet PDF delivery/storage/download, rendering, source-content, versioning, retry, renderer, pagination, metadata, operations, support diagnostics, localization, reversibility, source mapping, and reuse posture before PDF implementation. | Architecture/security / Layer 3 | answered | Approved at docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md: transient generated download from durable approved packet data, simple structured export rendering, immutable approved packet versions, superseded versions downloadable as authorized history with previous/next links, immediate retry for transient generation failures, self-hosted Playwright/Chromium as preferred MVP renderer behind provider-neutral seam, natural pagination with image/table-row break protection and broad-table fit handling, compact header page metadata, audit/metrics for every generation failure with threshold-based repeated-failure alerting, safe support-visible failure reason categories with internals hidden, locale-aware renderer contract with English-only MVP PDF content, seam-only reversibility with no second MVP renderer fallback, Product Discovery packet-to-document mapper with no Product Discovery-specific fields in the generic renderer seam, no raw transcript/history content in PDF, no stored rendered bytes, reusable generated-document boundary for future features. |
| L2L3-CHAT-004 | BLK-CHAT-004 | required-planning-artifact | Queue API contract and permission mapping work for protected routes, creator history, root-builder review, tenant-scope deny, and PDF download. | Backend/security / Layer 3-4 | queued-as-layer-3-unblock-story | Permission details should not be invented in Story Breakdown. |
| L2L3-CHAT-005 | BLK-CHAT-005 | required-planning-artifact | Queue data dictionary and persistence planning for conversations, packet versions, scope, download evidence, retention, and supersession. | Backend/data / Layer 3-4 | queued-as-layer-3-unblock-story | Must preserve durable domain facts and migration safety. |
| L2L3-CHAT-006 | BLK-CHAT-006 and TS-CHAT-010 | future-scope-deferral | Keep tenant-builder active rollout out of the MVP and require separate Product Discovery/Technical Steering later. | Product/architecture / future Layer 1-2 | deferred-with-owner | No requester question needed unless the MVP scope changes. |
| L2L3-CHAT-007 | Layer 3 Handoff: Root-admin app adoption | implementation-prerequisite | Do not start root-admin app adoption until DS seams, API contracts, permissions, and runtime/browser evidence plan exist. | Frontend/backend / Layer 3-4 | queued-as-layer-3-unblock-story | App adoption remains a blocked handoff row until prerequisites are complete. |

## Layer 3 Handoff

| Story Scope Element | Handoff Status | Required Classification IDs | Notes |
| --- | --- | --- | --- |
| PRD and capability matrix for root-admin MVP | ready-for-story-breakdown | TS-CHAT-001, TS-CHAT-005, TS-CHAT-006, TS-CHAT-008 | Define capabilities, lifecycle, denied/failure states, and acceptance criteria. |
| Design-system governance for work panel and chat | ready-for-story-breakdown | TS-CHAT-003, TS-CHAT-004 | Must happen before root-admin app UI implementation. |
| Product Discovery harness adapter | ready-for-story-breakdown | TS-CHAT-002 | Adapter should produce canonical Product Discovery packet data. |
| Conversation/history persistence | ready-for-story-breakdown | TS-CHAT-001, TS-CHAT-008 | Includes retention, supersession, scope, actor, and root-builder review access. |
| Protected API contracts and permissions | ready-for-story-breakdown | TS-CHAT-005, TS-CHAT-006 | Must include creator/root-builder visibility and tenant-scope deny posture. |
| Generated PDF delivery decision | ready-for-story-breakdown | TS-CHAT-007 | Decision record exists at docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md and is approved for transient generated download, simple structured export rendering, and a future-usable generated-document boundary; implementation still must wait for PRD, API, permission, data, and QA artifacts. |
| Root-admin app adoption | blocked | TS-CHAT-003, TS-CHAT-004, TS-CHAT-009 | Blocked until DS seams, API contracts, permissions, and runtime/browser evidence plan exist. |
| Future tenant-builder rollout | blocked | TS-CHAT-010 | Out of MVP; requires separate product and steering path. |
