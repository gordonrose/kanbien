# Product Discovery Packet: Chat Interface For Layer One Product Discovery

Draft safety label:

- Created as a draft discovery artifact.
- Full repo guardrails and artifact sweeps were intentionally skipped.
- This packet is not validated, governed, complete, implementation-ready, or
  artifact-complete.

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `draft-fast-path`
- Original request: "i would like to build a chat interface, like slack that
  my app can consume"
- Plain-language request summary: Build a reusable right-side chat/work panel
  that the app can consume across pages. The MVP opens from a shared page panel
  with Reporting, Support, and Build actions. Build starts a Level 1 Product
  Discovery conversation with the platform harness, offers contextual starter
  prompts, preserves chat history, and lets the user download a well-presented
  Product Discovery packet as a PDF.
- Packet date: 2026-05-05
- Owner / requester: Gordon
- Related product template: `generic-feature`
- Product template posture: `generic-template-used`
- Taxonomy version: `2026-05-03.1`
- Prior packet or feedback reference: none

## Discovery Interview Summary

- Initial understanding shared with requester: The request is for a reusable
  Slack-like chat experience that the app can consume, initially focused on
  talking to the platform harness for Level 1 Product Discovery.
- Interview cadence: `one-question-at-a-time-followed`
- If interview cadence exception was approved, why: not applicable
- Coverage areas tracked internally: universal matrix plus access /
  authorization, tenant boundary, frontend / UX, data lifecycle and retention,
  compliance / reporting, operations / support, integration / API, workflow /
  approval, and user-managed assets overlays.
- Assumptions confirmed by requester:
  - First version opens from a right-hand panel that collapses into a floating
    mobile button.
  - Stable panel actions are Reporting, Support, and Build.
  - Build opens the chat.
  - Build is where the user engages in Level 1 Product Discovery.
  - For MVP, Build is the only active panel workflow; Reporting and Support are
    visible as intentional coming-soon actions.
  - First rollout is root admin only.
  - For MVP, chat creators can see their own history, and root builders can see
    root-admin discovery histories for review/support.
  - For MVP, chat history and generated PDFs are retained indefinitely until a
    broader retention policy exists; newer packets from the same conversation
    mark earlier packets as superseded.
  - For MVP, the downloadable PDF contains the Product Discovery packet itself;
    there is no separate internal-only notes layer.
  - The in-app POC uses one final readiness confirmation before packet
    generation: when the chat believes it has enough information, it says so,
    asks whether the requester has any final follow-up, and produces the packet
    for download when the requester indicates there is nothing else.
  - Two builder audiences exist: root builders and tenant builders.
  - Root builders build for the whole platform.
  - Tenant builders build for tenant-specific configurations or repos, limited
    by their permission level.
  - Build should provide contextual starter prompts for current page, module,
    and roles.
  - Starter prompts should tailor the experience while still allowing free-form
    chat.
  - For MVP, the output is a downloadable PDF Product Discovery packet rather
    than continuing through the full delivery loop.
  - The PDF must be the real Product Discovery packet but well presented for
    both internal builders and tenant-side stakeholders.
  - Tenant builders must only download tenant-scoped packet context; root
    builders may include platform-wide context.
  - Chat conversation history must remain visible later.
- Business questions explicitly signed off as deferred until later: none for
  the draft MVP scope
- Technical questions packaged for technical stakeholder:
  - Which existing harness seam should own the chat orchestration?
  - Which PDF generation path should be used and how should packets be rendered
    consistently for browser and download?
  - Which design-system signed-off side-panel and chat-message seams already
    exist, and which must be extended before app UI work?
  - Which persistence model should retain chat transcripts and generated
    packet revisions without leaking tenant context?
- Questions still blocking packet confidence: none for the draft MVP scope;
  remaining details are packaged for Technical Steering or later iteration.
- Scope cuts used to reach confidence: MVP stops at chat history plus
  downloadable PDF; no in-app build task creation, no downstream loop execution,
  no support/reporting workflow beyond panel entry points.
- Confidence for chosen status: `95%; draft-ready for Technical Steering`

## Discovery Complexity And Completion Gate

- Request complexity: `complex/foundational`
- Complexity rationale: The request creates a reusable app-consumable chat
  surface, crosses frontend design-system governance, touches root and
  tenant-scoped authority boundaries, creates durable conversation history,
  generates downloadable files, and initiates the top of the product/build
  workflow.
- Draft-ready rationale: The MVP intent, primary actors, first screen posture,
  contextual starter concept, PDF output, and tenant/root scoping rule are clear
  enough to preserve as a draft. Product confidence is not high enough for
  Technical Steering handoff.
- First-version path known: `yes`
- Deferred future support explored: `yes`
- Deferred future support summary: Later versions may create in-app build
  tasks and continue through the planning/build loop. That is intentionally out
  of the MVP. Tenant-specific repo/configuration work remains a future routing
  area, not part of this MVP packet output.
- High-risk unknowns remain: see open business and technical questions.
- Packet may proceed: `yes`, as a draft only.

## Universal Coverage Matrix

| Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- |
| Goal and success outcome | answered | Reusable Slack-like chat panel; MVP guides Level 1 discovery and exports a PDF packet. | no |
| Primary users and actors | answered | Root builders and tenant builders were named explicitly. | no |
| Normal first-version workflow | answered | Open panel, choose Build or type freely, complete Layer 1 chat, download packet PDF, keep history. | no |
| Authority and responsibility boundaries | answered | Root builders can act platform-wide; tenant builders are tenant-scoped by permission. | no |
| Data created, changed, viewed, retained, or deleted | answered | Chat transcript, contextual prompt selections, packet content, PDF export, and history records are retained indefinitely for MVP until a broader policy exists. | no |
| Lifecycle states and transitions | answered | Conversation draft, packet-ready, PDF-generated, downloaded, history-visible, abandoned, and superseded states are implied; newer packets mark earlier ones as superseded. | no |
| Exceptions, reversals, and recovery | deferred-with-known-direction | The in-app POC uses one final readiness confirmation before packet generation; mistaken context selection, PDF failure, and access changes are packaged for Technical Steering. | no |
| Visibility, notifications, and user feedback | answered | Chat creators can see their own history; root builders can see root-admin discovery histories for review/support. | no |
| Security, privacy, audit, compliance, and abuse baseline | assumed-baseline | Required because the feature touches roles, tenant context, generated discovery records, and downloadable files. | no |
| Business policy decisions | answered | The in-app POC uses one final readiness confirmation before packet generation; later refinements may add richer review/correction behavior. | no |
| Configuration or customization | deferred-with-known-direction | Tenant builders may use this for tenant-specific configurations or repos later; MVP only captures discovery packet output. | yes |
| Billing, plan, quota, or entitlement impact | deferred-open | No billing decision was discussed; future tenant builder availability may need entitlement rules. | yes |
| Operational and support needs | deferred-with-known-direction | Support appears as a coming-soon action for MVP; a later support workflow still needs discovery. | no |
| Reporting, history, and evidence needs | answered | History must remain visible to the creator and root builders for root-admin MVP; PDF download should be available; records are retained indefinitely for MVP. | no |
| Compatibility with existing behavior | assumed-baseline | Must preserve existing root-admin behavior and existing Product Discovery process; no full delivery-loop automation in MVP. | no |
| Future extensibility pressure | answered | Future in-app build task creation and loop continuation are expected but out of MVP. | no |
| Explicit out of scope | answered | No in-app build task creation or continuation through the full loop for MVP. | no |
| Open blockers | answered | No product blockers remain for the draft MVP scope; technical decisions are packaged for Technical Steering. | no |

## Triggered Overlay Coverage

| Overlay | Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- | --- |
| access / authorization | actor classes and authority worlds | answered | Root builders and tenant builders are distinct. | no |
| access / authorization | root/operator versus tenant/account responsibilities | answered | Root can create platform-wide packets; tenant builders are scoped. | no |
| access / authorization | current tenant context and cross-tenant deny posture | answered | Tenant builders must only see/download tenant-specific context. | no |
| access / authorization | role naming and role family direction | deferred-open | "Root builders" and "tenant builders" are product roles, but role mapping is not defined. | yes |
| access / authorization | grant source posture and lifecycle | defer-to-technical-steering | Permission source should follow existing role/permission system. | no |
| access / authorization | feature/configuration/flag gate posture | deferred-open | MVP rollout audience and gating are not settled. | yes |
| access / authorization | allow and deny proof expectations | assumed-baseline | Required for root versus tenant boundaries. | no |
| access / authorization | object/entity-level rule direction | deferred-open | Exact object model for conversations and packets is not defined. | no |
| access / authorization | support/operator access posture | answered | Root builders can see root-admin discovery histories for review/support in the MVP. | no |
| access / authorization | onboarding, offboarding, and role-change lifecycle | deferred-open | Need behavior when access changes during or after a chat. | yes |
| access / authorization | audit/history visibility and retention expectations | answered | Visibility is settled for MVP; records are retained indefinitely until a broader policy exists. | no |
| tenant boundary | owning tenant context | answered | Tenant builder packets are scoped to the relevant tenant. | no |
| tenant boundary | cross-tenant deny rule | answered | Tenant builders must not download platform-wide or other-tenant context. | no |
| tenant boundary | root/operator exception posture | answered | Root builders may include platform-wide context. | no |
| tenant boundary | tenant-scoped audit and reporting visibility | deferred-with-known-direction | Tenant-builder history is deferred until tenant-builder rollout; root-admin MVP uses root-builder review visibility. | no |
| frontend / UX | primary user value | answered | Give builders a contextual way to start discovery from where they already are. | no |
| frontend / UX | surface and management location | answered | Persistent right panel; mobile floating button; Build opens chat. | no |
| frontend / UX | list size, search, comparison, and review needs | not-applicable | MVP is chat and contextual starter prompts, not a large selectable list. | no |
| frontend / UX | mistake recovery and confirmation needs | answered | One final readiness confirmation is enough before packet generation; repeated final confirmations are not approved. | no |
| frontend / UX | empty, denied, loading, failed, and degraded states | deferred-open | Not yet explored. | yes |
| frontend / UX | customer-facing wording and confidence needs | answered | PDF must be well presented for internal and tenant-side readers. | no |
| frontend / UX | governed design-system or frontend topology signal | assumed-baseline | Side panel, floating mobile action, and chat UI are governed frontend patterns. | no |
| data lifecycle and retention | lifecycle states and transitions | answered | MVP uses draft/in-progress/packet-generated/downloaded/abandoned/superseded lifecycle language. | no |
| data lifecycle and retention | retained history and user-visible history | answered | Creator and root-builder visibility are settled; records are retained indefinitely for MVP until a broader policy exists. | no |
| user-managed assets | rendering or delivery posture | answered | MVP includes downloadable PDF packet. | no |
| user-managed assets | allowed asset kinds and visibility | answered | MVP asset kind is generated PDF packet only. | no |
| user-managed assets | quota, cleanup, retention, export, and legal-hold expectations | deferred-with-known-direction | PDF retention is indefinite for MVP; quota/legal-hold posture remains technical/governance follow-up. | no |
| compliance / reporting | customer-visible versus operator-only evidence | answered | MVP PDF contains the Product Discovery packet itself, with scope controlling what context is included. | no |
| operations / support | support/operator access posture | deferred-with-known-direction | Support is not an active MVP flow; later support behavior needs separate discovery. | no |
| integration / API | consumer and provider actors | defer-to-technical-steering | The app consumes a chat harness; exact seams are technical. | no |
| workflow / approval | approval posture | answered | MVP requires only one final readiness confirmation before PDF generation; it must not repeatedly ask the same final confirmation. | no |

## Known Questions Gate

- Plain-language summary shown before drafting: Reusable right-side help/work
  panel with Reporting, Support, and Build; Build opens a contextual Level 1
  discovery chat that produces a PDF packet for MVP.
- First one question asked before drafting: "Who is the first version mainly
  for, and what should they be able to talk about in it?"
- Requester answered, corrected, or explicitly deferred first question: `yes`
- Known important product questions left unasked: none for the draft MVP scope
- For each unasked business question, requester signoff for "deferred until
  later": none needed for the draft MVP scope
- Technical questions not asked of business owner and packaged for technical
  stakeholder: chat orchestration seam, PDF generation/rendering path, storage
  model, design-system adoption path.
- If any known question was not asked, why was it safe to defer or package:
  Remaining questions are technical or later-iteration refinement concerns, not
  blockers to the draft MVP product intent.
- Packet status allowed: `yes`, draft only.

## Change Routing

- Requested change type: reusable app-consumable chat/work panel for Layer 1
  Product Discovery
- Secondary change types: governed frontend UX, root/tenant builder access,
  downloadable generated packet, chat history, support/reporting entry points
- Likely delivery path: `core-platform-pr`
- Routing confidence: `85%`
- Routing rationale: The request creates reusable platform behavior, a shared
  frontend surface, Product Discovery harness integration, root/tenant access
  boundaries, durable chat history, and PDF export behavior.
- Config-first check: Not sufficient for the MVP; this is not only structured
  tenant configuration.
- Tenant-specific extension check: Later tenant builder work may route this
  way, but the shared chat panel and discovery/PDF behavior are platform-level.
- Core platform check: Required for shared app surface, harness integration,
  access rules, history, and generated PDF behavior.
- Backlog item shape: Foundational platform feature with governed frontend
  design-system work before root-admin app adoption.
- Approval posture: Product intent still needs additional answers before
  Technical Steering.
- Evidence expectation: Future implementation will need allow/deny access
  tests, tenant-scope tests, chat lifecycle tests, PDF generation tests,
  browser scenarios for desktop/mobile panel behavior, and design-system
  signoff evidence.
- Routing blockers: access-change/failure behavior is packaged for Technical
  Steering; no remaining product blocker for the draft MVP scope.

## Product Intent

- Problem to solve: Users need a clear, contextual way to talk to the platform
  harness from inside the app and turn everyday change ideas into a real
  Product Discovery packet.
- Business outcome: Product/change requests begin in a consistent Layer 1
  format, with enough context to reduce rework and preserve tenant boundaries.
- Primary user outcome: A builder can open the panel from their current page,
  use suggested context or free-form chat, complete discovery, and download a
  polished packet.
- Why now: The platform needs a reusable app-consumable interface for the
  harness before deeper build-loop automation.
- Success signal: A root or tenant builder can generate a scoped, readable PDF
  packet and later return to the conversation history.
- Non-goal summary: MVP does not create in-app build tasks or continue through
  the full planning/build loop.

## Taxonomy Classification

- Product feature type: workflow builder; support / troubleshooting; admin /
  operator tooling
- UX pattern(s): wizard; settings panel; troubleshooting / replay view; timeline
  / activity log
- Data ownership shape: owns durable entity; generated artifact; composes page,
  module, and role context
- Surface / management location: surfaced in many modules, managed centrally
- Actor and permission shape: root operator; tenant admin/builder; delegated
  actor; system / job actor
- Relationship shape: state machine; versioned lineage; derived relationship
- Reporting / read model shape: audit / history report; exportable report;
  exact record lookup
- Lifecycle shape: draft / published; archived / superseded; canceled /
  abandoned; configuration changed
- Integration / externality shape: internal-only; generated artifact
- Evidence / compliance sensitivity: permission-sensitive; privacy-sensitive;
  audit-critical; compliance evidence; user-visible runtime-sensitive
- New taxonomy value needed: none currently
- New taxonomy axis needed: none currently

## Feature Family / Product Template Fit

- Existing feature family: Product Discovery / harness interaction
- Reusable product template used: `generic-feature`
- Template overrides: none
- New family or template needed: likely yes later for "in-app harness chat" if
  this becomes a recurring feature family.
- Reuse rationale: The generic template fits an early foundational feature with
  several cross-cutting overlays.
- Existing families/templates considered: authentication/access template
- Why rejected: Access is important, but the main product shape is a reusable
  chat/workflow surface, not an auth/access flow.

## New Family Candidate

- New family candidate needed: yes, likely
- Proposed family name: In-App Harness Chat
- Business problem it exists to solve: Let app users begin governed product,
  support, reporting, or build conversations from the context they are already
  working in.
- Why existing taxonomy values/templates do not fit: Existing generic feature
  classification captures the request but does not provide reusable defaults for
  contextual chat, transcript retention, packet generation, and role-scoped
  harness interaction.
- Reusable user/job pattern: User opens contextual assistant panel, selects a
  guided starter or types freely, receives tailored conversation flow, and
  produces a durable output.
- Expected journeys: Build discovery, support request, reporting request.
- Expected capability groups: capture conversation, suggest contextual prompts,
  generate packet, download PDF, browse history, enforce scope.
- Expected actors / permissions: root builder, tenant builder, support/root
  operator, system PDF generation actor.
- Expected data ownership shape: durable conversations and generated packet
  records owned by the chat/harness feature or an approved Product Discovery
  feature seam.
- Expected relationship shape: conversation to actor; conversation to current
  page/module/role context; packet to conversation; packet to tenant or
  platform scope.
- Expected reporting / read model shape: searchable/browsable history and
  export/download history.
- Expected lifecycle shape: draft conversation, ready packet, generated PDF,
  downloaded, abandoned, superseded.
- Product-template candidate needed: yes, after this first packet is refined.
- Approval needed before requirements lock: yes.

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient: unknown
- Existing UX pattern likely needs extension: yes
- New UX pattern may be needed: yes
- Design-system extension may be needed: yes
- Affected surfaces: root-admin right-side panel, mobile floating button, chat
  view, contextual starter prompts, PDF preview/download affordance, history
  view.
- User workflow reason: The panel must be reusable across pages while preserving
  context and role scope.
- Product constraints: Same actions on every page; Build opens chat; mobile
  collapses to floating button; starter prompts should tailor but not block
  free-form chat.
- Existing design-system references checked: not checked in this draft fast
  path.
- Must stop before app UI implementation: yes, unless an explicit exception is
  approved.
- Technical Steering / design-system questions:
  - Does a signed-off side-panel family already exist?
  - Does a governed chat/message/thread pattern already exist?
  - Does the mobile floating action behavior need a new behavior lock?
  - How should PDF preview/download be represented in the design system?

## Users, Actors, And Context

- Primary actor: builder using the app
- Secondary actors: tenant-side stakeholder reading the PDF; internal builder
  reviewing the PDF
- Configuration / governance actors: root builder, tenant builder with
  permission-limited scope
- Support / root / operator actors: root builders can see root-admin discovery
  histories for review/support in the MVP
- System or external-provider actors: harness chat orchestrator; PDF generator
- Affected modules / surfaces: root-admin panel, current root-admin page/module,
  role context display, Product Discovery packet output
- Root / tenant / public posture: root and tenant; not public
- Permission-sensitive decisions still open: tenant builder role mapping, rollout
  gating, access-change behavior
- Current context: current page, current module, logged-in roles, and tenant or
  platform scope
- Trigger event: user opens Build from the right-side panel or mobile floating
  button

## User Journey Flow

### Primary Journey

1. User starts from: a root-admin page with the shared panel available.
2. User wants to: modify something, get support, or begin a build/discovery
   conversation from current context.
3. System helps by: showing contextual starter prompts for current page, module,
   and roles; allowing free-form chat; guiding Level 1 discovery; keeping
   conversation history.
4. User completes when: the chat has enough confirmed discovery content to
   generate a well-presented Product Discovery packet PDF for the correct
   platform or tenant scope.

### Alternate / Edge Journeys

- User ignores starter prompts and starts free-form chat.
- User chooses page-level modify/support.
- User chooses module-level modify/support.
- User chooses role-context modify/support.
- Tenant builder starts from a tenant-scoped context.
- Root builder starts from platform-wide context.
- User returns later to conversation history.

### Denied, Empty, Failed, Or Degraded States

- Denied: tenant builder attempts platform-wide or other-tenant context.
- Empty: no useful page/module context is available; chat still allows free-form
  start.
- Failed: PDF generation fails; conversation should remain recoverable.
- Degraded: harness unavailable; panel should explain that discovery chat is
  temporarily unavailable.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | root or tenant builder | completes the discovery chat and downloads the packet | yes | Primary MVP journey. |
| Admin / configuration | tenant builder | requests tenant-specific configuration or repo work | yes | Explicitly named by requester. |
| Support / root / governance | root builder / support | supports, reviews, or governs chat outputs | yes | Root/tenant boundary and history visibility matter. |
| System / external provider | harness and PDF generator | affects conversation flow and generated output | yes | Core to product behavior. |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | end user journey | root builder | start a contextual discovery chat | turn platform-wide ideas into a reusable discovery packet | viewing an app page or module | downloads a clear platform-scoped PDF packet and can revisit history |
| JTBD-002 | end user journey | tenant builder | start a scoped discovery chat | request tenant-specific configuration or repo work within their permissions | viewing tenant-scoped app context | downloads a tenant-scoped PDF packet without leaking other context |
| JTBD-003 | support / governance | internal reviewer | inspect chat history and generated packets | understand what was requested and why | reviewing a discovery output | sees an accurate transcript and packet scope |

### Epic-Level Job Summary

- User type: root or tenant builder
- Needs to: start a contextual chat from inside the app
- So they can: complete Level 1 Product Discovery without leaving the app
- Current context: current page, module, roles, and platform/tenant scope
- Trigger event: user opens Build from the shared panel
- Desired outcome: well-presented Product Discovery packet PDF plus retained
  conversation history
- Success looks like: the packet is readable by both internal and tenant-side
  stakeholders and accurately reflects the allowed scope.

### Current Satisfaction

They are currently happy with:

- The existing Layer 1 Product Discovery process as the right front door for
  shaping change requests.

They are currently unhappy with:

- Discovery is not yet available as an in-app contextual chat experience.

### Proposed Product Idea

Their idea would:

- Put a reusable panel into the app, expose Build as a chat entry point, use
  context to tailor the conversation, and generate a packet PDF for MVP.

### Examples / Evidence

Examples involve:

- Current page prompt: modify / get support.
- Current module prompt: modify / get support.
- Current roles prompt: modify / get support.
- Free-form chat when starter prompts do not fit.

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | root builder | create/export | Generate platform-scoped discovery packet | Root builders build for the whole platform. | Must support platform-wide scope. |
| UC-002 | JTBD-002 | tenant builder | create/export | Generate tenant-scoped discovery packet | Tenant builders limited by permission level. | Must enforce tenant boundary and deny cross-tenant context. |
| UC-003 | JTBD-001/JTBD-002 | builder | guide | Start from contextual starter prompt or free text | Page/module/roles starter examples. | Must capture context without forcing a rigid wizard. |
| UC-004 | JTBD-003 | creator/root builder | read/history | Revisit conversation after packet generation | History must remain visible to creator and root builders. | Must retain transcript and packet relationship with scoped visibility. |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| Builder actor | root builder, tenant builder, no Build permission, role changed | Authority changes materially affect access and packet scope. |
| Conversation | new, in progress, abandoned, packet-ready, packet-generated, superseded | MVP must at least preserve in-progress and generated history. |
| Packet PDF | not generated, generated, downloaded, failed, superseded | Download output is MVP end state. |
| App context | page known, module known, roles known, tenant context known, context unavailable | Context drives starter prompts. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | root builder | authorized | conversation | new | opens Build | platform-scoped chat starts with contextual prompts | ready-for-signoff |
| JY-STATE-002 | tenant builder | authorized in current tenant | conversation | new | opens Build | tenant-scoped chat starts with contextual prompts | ready-for-signoff |
| JY-STATE-003 | tenant builder | not authorized for selected context | conversation | new | opens Build | denied or scope-corrected before chat starts | needs-product-answer |
| JY-STATE-004 | builder | authorized | conversation | in progress | leaves and returns | history remains visible | ready-for-signoff |
| JY-STATE-005 | builder | authorized | packet PDF | failed | downloads packet | failure is visible and conversation is recoverable | needs-product-answer |
| JY-STATE-006 | builder | role changed | conversation | in progress | continues chat | access and scope are rechecked | needs-product-answer |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | builder | new | in progress | conversation | first chat message or starter selection | conversation captures scope and context | ready-for-signoff |
| ST-002 | builder/system | in progress | packet-ready | conversation | enough discovery information captured | user can review/generate packet | needs-product-answer |
| ST-003 | system | packet-ready | packet-generated | packet PDF | user requests download | scoped PDF is generated | ready-for-signoff |
| ST-004 | builder | in progress | abandoned | conversation | user stops before packet | retained in history for MVP | ready-for-signoff |
| ST-005 | system | packet-generated | superseded | packet PDF | user changes discovery content later | prior packet remains and is marked superseded | ready-for-signoff |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Root builder creates platform-wide packet | in-scope | no | Confirmed. |
| Tenant builder creates tenant-scoped packet | in-scope | no | Confirmed. |
| Tenant builder attempts cross-tenant/platform scope | in-scope | no | Product rule is deny cross-tenant/platform scope for tenant builders; exact UX wording can be refined later. |
| User starts free-form chat | in-scope | no | Confirmed. |
| User uses contextual starter prompt | in-scope | no | Confirmed. |
| Reporting panel action | out-of-scope | no | Visible as coming soon for MVP; no active reporting flow. |
| Support panel action | out-of-scope | no | Visible as coming soon for MVP; no active support flow. |
| PDF generation failure | in-scope | no | Recovery behavior should be defined in Technical Steering/product refinement, but does not block MVP product intent. |
| Chat abandoned before packet | in-scope | no | Retained indefinitely for MVP until a broader policy exists. |
| User access changes during chat | in-scope | no | Product behavior should recheck current access and scope; exact technical enforcement is packaged for Technical Steering. |
| Full in-app build task creation | out-of-scope | no | Explicitly replaced by PDF download for MVP. |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used: none
- Required because: not applicable
- Checklist posture: `not-applicable`
- Product answers imported into this packet: not applicable
- Deferred checklist items and reason: not applicable
- Reference: `docs/product-discovery/templates/generic-feature-template.md`

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Open shared work panel | JTBD-001, JTBD-002 | JY-STATE-001, JY-STATE-002 | Access Reporting, Support, and Build from root admin | builder | root-admin panel | Governed frontend family likely needed. |
| Collapse to mobile action | JTBD-001, JTBD-002 | JY-STATE-001 | Use same entry point on mobile | builder | mobile app UI | Must preserve active conversation access. |
| Start Build chat | UC-001, UC-002 | ST-001 | Begin Level 1 discovery | builder | Build panel | Initial MVP primary action. |
| Show contextual starters | UC-003 | ST-001 | Start with page/module/role context | builder | Build chat | Prompt suggestions, not hard gates. |
| Free-form chat | UC-003 | ST-001 | Describe need without choosing a starter | builder | Build chat | Required by requester. |
| Enforce root/tenant scope | UC-001, UC-002 | JY-STATE-003 | Prevent scope leaks | builder/system | Build chat and PDF | Permission-sensitive. |
| Generate Product Discovery packet | UC-001, UC-002 | ST-002, ST-003 | Produce real packet content | builder/system | Build chat | Should map to Layer 1 format. |
| Download well-presented PDF | UC-001, UC-002 | ST-003 | Share packet with internal and tenant readers | builder | packet output | Generated PDF is MVP endpoint. |
| Preserve conversation history | UC-004 | JY-STATE-004 | Revisit the chat later | builder/reviewer | history view | Retained indefinitely for MVP until broader policy exists. |

## Business Questions Before Requirements Lock

| Question | Why it matters in plain language | Required before steering? | Current answer / owner | Deferred until later signed off by requester? |
| --- | --- | --- | --- | --- |
| What should Reporting do after the MVP? | Reporting is visible but inactive in the MVP; later behavior needs its own product answer. | no | deferred; likely separate discovery | yes |
| What should Support do after the MVP? | Support is visible but inactive in the MVP; later behavior needs its own product answer. | no | deferred; likely separate discovery | yes |
| What should replace indefinite retention later? | MVP keeps records indefinitely, but a production retention policy should eventually decide archive/delete/legal-hold behavior. | no | deferred; future governance | yes |
| Should tenant-facing PDFs include only shared business language, or also internal notes? | The MVP uses the Product Discovery packet only, with no separate internal-only notes layer. | no | answered by requester | not-applicable |
| What exactly should happen before PDF generation? | The chat asks one final readiness confirmation when it believes it has enough information; if the requester has no final follow-up, the packet is produced for download. | no | answered by requester | not-applicable |

## Technical Questions For Technical Stakeholders

| Question | Plain-language context | Suggested technical owner | Blocks Technical Steering handoff? |
| --- | --- | --- | --- |
| Which backend feature owns chat conversations and packet generation? | The app needs a durable place for transcript, context, and generated packet state. | platform/backend | yes |
| Which existing Product Discovery harness seam should the chat call? | The chat must trigger Layer 1 behavior rather than inventing a parallel process. | harness/platform | yes |
| How should PDF rendering and download be implemented? | The PDF must look polished and remain faithful to the packet. | platform/frontend | yes |
| Does PDF download require an asset decision record? | Generated user-downloadable files may trigger asset governance. | architecture/security | yes |
| Which design-system families must be signed off before app adoption? | The right panel, mobile floating button, chat thread, and prompts are governed UI. | frontend/design-system | yes |
| How should history be indexed and filtered by root/tenant scope? | Users must only see conversations they are allowed to see. | backend/security | yes |

## Explicitly Out Of Scope

- In-app build task creation for MVP.
- Continuing through the full planning/build loop after Layer 1.
- Public or unauthenticated chat.
- Public packet delivery.
- Generic file hosting or arbitrary user file upload.
- Tenant builders creating platform-wide packets.
- Copying governed UI markup/CSS into app pages without design-system signoff.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed | Owner / signoff |
| --- | --- | --- | --- | --- | --- |
| Panel availability | Shared panel appears in root admin for MVP. | high | If later treated as app-wide, governance scope may expand. | no | confirmed |
| PDF output | MVP output is a downloadable PDF, not a build task. | high | Could overbuild downstream workflow. | no | confirmed |
| History | Conversations remain visible to their creator and root builders for root-admin MVP and are retained indefinitely until broader policy exists. | high | Later policy could require archival or deletion rules. | no | confirmed |
| Tenant scope | Tenant builders see/download only tenant-specific context. | high | Cross-tenant data leakage. | no | confirmed |
| Root scope | Root builders can create platform-wide packets. | high | Platform-wide requests might be blocked incorrectly. | no | confirmed |
| Starter prompts | Prompts tailor the conversation but do not block free text. | high | Wizard may become too rigid. | no | confirmed |
| PDF audience | Both internal and tenant readers receive the Product Discovery packet itself, scoped to their allowed context, with no separate internal notes layer for MVP. | high | Packet wording must be well presented because it is the shared output. | no | confirmed |
| Reporting/Support | Actions are visible but inactive/coming soon for MVP; Build is the only working flow. | high | If shown poorly, inactive actions could still confuse users. | no | confirmed |

## Discovery Feedback Loop

- Feedback status: `collecting`
- First iteration reference: this packet
- Feedback sources:
  - user interview: this conversation
  - support issue: none
  - analytics / usage signal: none
  - runtime defect: none
  - sales / stakeholder input: none
  - internal operator note: none
- Feedback review date: 2026-05-05
- Decision owner: Gordon

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user interview | MVP should stop at downloadable PDF and history, not downstream task creation. | out-of-scope / capability | accept | Keep build task creation out of MVP. |
| FDBK-002 | user interview | Reporting and Support should be visible but inactive/coming soon for MVP; Build is the only active workflow. | journey / capability / out-of-scope | accept | Update MVP scope and unblock Reporting/Support ambiguity. |
| FDBK-003 | user interview | First rollout should be root admin only. | scope / surface | accept | Remove app-wide rollout from MVP. |
| FDBK-004 | user interview | For MVP, chat creators can see their own history and root builders can see root-admin discovery histories for review/support. | visibility / history | accept | Defer tenant-builder history rules until tenant-builder rollout. |
| FDBK-005 | user interview | For MVP, retain chat history and generated PDFs indefinitely; mark earlier packets superseded when a newer packet is generated from the same conversation. | lifecycle / retention | accept | Defer broader retention policy to later governance. |
| FDBK-006 | user interview | For MVP, the downloadable PDF should just contain the Product Discovery packet, with no separate internal-only notes layer. | PDF content / evidence | accept | Treat scope filtering as the privacy boundary for MVP. |
| FDBK-007 | user interview | The POC should use one final readiness confirmation before packet generation and must not repeat that confirmation after the requester has no final follow-up. | workflow / approval | accept | Treat packet generation as direct after the one readiness confirmation is answered with no final follow-up. |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial chat-based discovery | Captures MVP intent and blockers for reusable in-app harness chat. | Technical Steering, design-system behavior locks, Product Discovery harness contracts, asset/PDF decision records. |

## Technical Steering Handoff

- Product decisions locked:
  - Shared panel includes Reporting, Support, and Build.
  - Build opens the chat.
  - For MVP, Build is the only active workflow; Reporting and Support are
    visible as coming-soon actions.
  - First rollout is root admin only.
  - Chat creators can see their own history, and root builders can see
    root-admin discovery histories for review/support.
  - Chat history and generated PDFs are retained indefinitely for MVP until a
    broader policy exists; newer packets mark earlier packets from the same
    conversation as superseded.
  - The downloadable PDF contains the Product Discovery packet itself, with no
    separate internal-only notes layer for MVP.
  - The in-app POC uses one final readiness confirmation before packet
    generation and must not repeat that confirmation after the requester has no
    final follow-up.
  - Build starts Level 1 Product Discovery.
  - Root and tenant builder audiences exist.
  - Tenant builder packets must be tenant-scoped.
  - Root builder packets may be platform-wide.
  - MVP output is downloadable PDF packet plus retained chat history.
- Business decisions intentionally deferred until later with requester signoff:
  none for the draft MVP scope
- Technical questions packaged for technical stakeholder:
  chat orchestration seam, PDF generation, storage/history model, design-system
  adoption, asset governance.
- Packet confidence for handoff: `95%; draft-ready for Technical Steering`
- Scope cuts made to reach confidence:
  MVP excludes in-app build task creation and downstream loop continuation.
- Risk flags for Technical Steering:
  - permission-sensitive: yes
  - tenant-boundary: yes
  - state-based journey matrix: yes, partial
  - governed frontend: yes
  - new UX pattern: yes
  - design-system extension: yes
  - asset/user file: yes, generated PDF
  - reporting/read model: yes, history/download evidence
  - migration/persistence: yes, likely
  - async/job: possible for PDF generation
  - external provider: no current external provider
  - privacy/compliance: yes
- Recommended next artifact: Technical Steering, then design-system governance
  before app UI implementation.
- Stop condition triggered: Product intent is ready for Technical Steering for
  the draft MVP scope.
