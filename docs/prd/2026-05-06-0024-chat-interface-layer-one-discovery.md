# Chat Interface For Layer One Product Discovery Specification

## Implementation Status

- Status:
  draft PRD proposal as of 2026-05-06
- Implemented:
  - no chat or harness-chat feature bundle yet
  - no root-admin Build chat UI yet
  - no durable conversation or packet history persistence yet
  - no generated Product Discovery packet PDF delivery yet
- Not yet implemented:
  - API route implementation
  - executable tests
  - runtime/browser QA evidence

This PRD preserves the root-admin MVP behavior and planning obligations. It is
not an implementation-ready artifact until the unresolved PDF configuration
implementation, root-admin design-system parity, route implementation, and
evidence blockers are resolved.

## Source Artifacts

- Product Request:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md`
- Product Discovery:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`
- Context Account Architecture ADR:
  `docs/architecture/adr/0041-adopt-context-account-architecture-for-discovery-intelligence.md`
- Story Breakdown:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Capability Matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- Capability Matrix Notes:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft-notes.md`
- PRD-derived test cases:
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`
- Journey Inventory / QA Evidence Plan:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`
- Permission Mapping:
  `docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md`
- API Contract:
  `docs/api-contracts/chat-interface-layer-one-discovery.md`
- Data Dictionary:
  `docs/data-dictionary/harness-chat-conversation.md`,
  `docs/data-dictionary/harness-chat-message.md`,
  `docs/data-dictionary/harness-chat-packet-revision.md`,
  `docs/data-dictionary/harness-chat-pdf-attempt.md`,
  planned discovery intelligence dictionary pages for session state,
  inference facts, evidence links, hard-restraint assessments, outcome graph
  nodes/relationships, conversation decisions, packet readiness snapshots, and
  learning backlog items.
- Implementation Blueprint:
  `docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md`

## Summary

The first version gives root builders a reusable in-app Build chat inside the
root-admin surface. The chat starts a Layer 1 Product Discovery conversation,
uses page/module/role context to suggest helpful starters, preserves
conversation history, generates canonical Product Discovery packet data, and
offers a well-presented packet PDF once the approved delivery posture exists.

The MVP is a root-admin workflow only. Tenant-builder active workflows,
Reporting active workflows, Support active workflows, and direct downstream
build execution are explicitly future scoped.

## Scope

The MVP includes:

- root-admin work panel entry point with Reporting, Support, and Build actions
- Reporting and Support visible only as coming-soon actions
- Build as the only active workflow
- contextual starter prompts based on current page, module, and role context
- free-form chat for Layer 1 Product Discovery
- deterministic in-app conversation policy for question selection,
  assumptions, readiness, one final confirmation, and packet generation
- durable conversation history for root builders
- root-builder review visibility for other root builders' root-admin discovery
  work
- canonical Product Discovery packet data generation through a narrow adapter
- packet revision supersession when a newer packet is generated from the same
  conversation
- generated packet PDF delivery after approved numeric thresholds and route
  contracts exist
- server-side authority for actor, root or tenant scope, context, history, and
  downloads
- runtime/browser evidence requirements before user-visible completion claims

## Non-Goals

The MVP does not include:

- tenant-builder active rollout
- active Reporting workflow
- active Support workflow
- direct creation of stories, tasks, Loop Runs, PRs, or code changes from chat
- customer-facing backlog automation
- public generated PDF delivery
- generic file-hosting or generic asset-library behavior
- app-local CSS for governed root-admin UI
- copied design-system markup or controller behavior in app pages
- a parallel chat-only Product Discovery packet format
- repeated final confirmation loops after the requester has already confirmed
  that no final follow-up remains

## Actors

- Root builder:
  A platform/root-admin actor who can start Build chat in the root-admin
  surface.
- Chat creator:
  The actor who created a conversation and may later view their own history.
- Root-builder reviewer:
  Any authenticated root builder in the root-admin MVP. Root builders may
  review other root builders' root-admin discovery histories.
- Future tenant builder:
  A known future actor. Active tenant-builder workflows are out of MVP scope.
- Product Discovery adapter:
  The platform seam that turns chat context and transcript into canonical
  Product Discovery packet data.
- Design-system owner:
  The owner of the governed work panel, mobile action, chat thread, starter
  prompt, history, and PDF action seams.

## Core Workflow

1. A root builder opens the root-admin work panel.
2. The panel shows Reporting, Support, and Build actions.
3. Reporting and Support show coming-soon posture and do not start workflows.
4. The root builder chooses Build.
5. Build opens a chat conversation for Layer 1 Product Discovery.
6. The chat may show contextual starter prompts from the current page, module,
   and role context.
7. The root builder may use a starter prompt or type freely.
8. The chat preserves the conversation transcript and contextual selections.
9. The chat asks one useful business-facing question at a time, states common
   assumptions when a detail does not need a business decision, and packages
   implementation details for later planning instead of asking the requester to
   design the solution.
10. When the chat reaches Product Discovery readiness, it says it thinks it has
    everything needed, asks whether the requester has any final follow-up, and
    explains that it will produce the packet for download if there is nothing
    else.
11. When the requester indicates there is no final follow-up, the Product
    Discovery adapter generates canonical Product Discovery packet data.
12. The generated packet becomes the current packet revision for that
    conversation.
13. A newer generated packet from the same conversation supersedes the prior
    packet revision.
14. After PDF delivery posture is approved, the root builder can download a
    well-presented packet PDF.
15. Root builders can later see root-admin conversation history, including
    root-admin discovery histories created by other root builders.

## In-App Product Discovery Conversation Policy

The Build chat must feel like a guided Product Discovery conversation, not a
form, a generic support bot, or an implementation interview. Its normal loop is:

1. reflect the request in plain language
2. classify what is already known
3. choose exactly one next action from the deterministic policy
4. ask one material business question, state a safe assumption, block on a real
   decision, or move to readiness confirmation
5. generate the packet only after the one final readiness confirmation is
   answered with no final follow-up

The conversation should cover the Product Discovery topics needed for the chosen
scope:

- normal successful behavior and first-version outcome
- primary user or actor
- where the work happens in the product
- what counts as done or successful
- business-visible policy choices, including access, visibility, history,
  recovery, rollout, compatibility, cost, or compliance when relevant
- explicit non-goals, scope cuts, and deferred future work
- common baseline assumptions for security, audit, accessibility, privacy,
  tenant boundary, and operational evidence
- technical questions packaged for later steering instead of asked as business
  decisions

### Confidence Gate

The chat may claim packet readiness only when it has at least 95 percent
confidence for the chosen scope. This is a deterministic readiness judgment, not
model self-certification. The 95 percent threshold is met when:

- the normal successful behavior is clear enough to describe without another
  business answer
- the primary actor and product surface are known or safely assumed
- the value, success signal, non-goals, and major scope cuts are stated
- every unanswered item is classified as a safe assumption, a deferred future
  scope item, or a technical question for later planning
- no unresolved business-visible decision would materially change product
  meaning, permissions, history, recovery, rollout, cost, compliance, or major
  UX direction
- the next packet can be produced from canonical Product Discovery packet data
  without inventing facts

If confidence is below 95 percent, the chat asks the single next highest-value
business question. If confidence is at least 95 percent, the chat asks the one
final readiness confirmation. After that confirmation is answered with no final
follow-up, the system generates the packet and must not ask the same final
confirmation again.

### Granularity Gate

A question is too granular for Layer 1 when the answer would only affect:

- labels, button copy, icons, microcopy, or minor visual polish
- ordinary loading, empty, hover, focus, or helper-text wording
- implementation mechanism, route shape, schema shape, migration details,
  framework choice, component internals, or provider configuration
- a reversible UI convention where the product has an established default
- a technical trade-off better owned by Technical Steering, PRD, API contract,
  design-system, or implementation planning

The chat should ask the question only when the answer would materially change
product meaning, user value, access or visibility policy, durable history,
mistake recovery, rollout, compatibility, cost, compliance, risk, or a major UX
pattern. Otherwise it should state the common assumption in plain language and
let the requester correct it.

### Repetition And Assumption Handling

The chat must not ask repeated unnecessary questions. Before asking, it checks
the conversation state for already answered, assumed, deferred, or packaged
topics. A follow-up is unnecessary when:

- the requester already answered the topic directly
- the prior answer can be safely summarized as a rule or usual case
- a common baseline assumption covers the detail
- the detail was already deferred or marked out of scope
- the detail is technical and can be packaged for later planning
- the final readiness confirmation has already been asked and answered

Assumptions are part of the conversation, not hidden model behavior. Each
assumption should be classified as `rule`, `usual-case`, `exception`,
`out-of-scope`, or `deferred`. The requester can correct any assumption; a
correction updates the deterministic state and should prevent the old assumption
from reappearing as if it were still accepted.

### Deterministic Catalogue And LLM Use

The implementation must maintain a deterministic catalogue of response patterns,
assumptions, and follow-up decisions before relying on token-consuming LLM
handling. The catalogue should include:

- coverage topics and their states: `unknown`, `answered`, `assumed`,
  `deferred`, `out-of-scope`, `technical-packaged`, and
  `blocked-real-decision`
- common Product Discovery assumptions with trigger conditions, confidence
  contribution, and correction behavior
- question templates for the next highest-value business question
- technical-packaging rules for implementation details
- readiness criteria for 95 percent confidence
- one-time final confirmation state
- safe fallback responses when LLM usage is disabled, rate-limited, or fails

Deterministic handling runs first. It should update known coverage, suppress
duplicate questions, choose safe assumptions, detect final confirmation replies,
and decide whether an LLM call is needed. LLM handling is allowed only for the
remaining language task: producing a warm, concise, schema-valid turn inside the
deterministic decision envelope. LLM output is accepted only after schema
validation and policy checks; invalid output becomes a recoverable adapter
failure or safe deterministic fallback, not accepted Product Discovery truth.

The accepted turn states are:

- `ask_business_question`: one material product question remains
- `state_assumption`: a safe assumption advances the conversation without a
  question
- `blocked_by_real_decision`: a non-trivial business decision must be answered
  before packet readiness
- `ready_for_packet`: 95 percent confidence is reached and the one final
  readiness confirmation should be asked

The packet-generation route must rely on the persisted structured discovery
state and the final confirmation state, not on a fresh free-form LLM judgment.

## Persistence-Backed Discovery Intelligence Model

Discovery Chat must operate on persisted structured state, not raw transcript
memory or prompt-only model behavior. Transcript messages remain evidence, but
the engine's working truth is structured session state, record-backed context,
and evidence-backed inference.

The governing architecture is Context Account Architecture:

- Record Accounts are official managed product truth.
- Inference Accounts are discovery-derived contextual intelligence.
- Session State is current discovery working memory.

Discovery Chat may read record accounts through approved seams. It must not
directly mutate official organization, user, role, capability, entitlement,
design-system, platform capability, feature capability, compliance, or outcome
records owned by other features. Inference may challenge or qualify records, but
reconciliation requires a governed UX or owning feature seam.

### Context Layers

The persisted discovery model is organized into these layers:

- organization context:
  record-backed tenant/organization facts plus discovery-derived signals about
  operating reality, terminology, maturity, operational strain, informal
  ownership, support dependency, commercial pressure, and change maturity.
- actor context:
  user/role/capability record facts plus profile inference about
  responsibilities, technical fluency, confidence, authority, pressure,
  communication style, risk sensitivity, decision style, workarounds, training
  needs, escalation behavior, and success criteria.
- workflow context:
  operational workflow, current product workflow, design-system workflow fit,
  platform workflow fit, feature workflow fit, handoffs, tools, data
  inputs/outputs, processing profile, failure points, frequency, latency, risk,
  emotional friction, and desired change.
- problem context:
  pain, impact, urgency, frequency, severity, business consequence, user
  consequence, operational cost, workaround cost, root-cause hypotheses,
  definition of good, non-goals, priority signals, emotional pressure, and
  failure modes.
- hard restraints:
  non-negotiable limits from organization, role, workflow, request,
  environment, compliance, design-system seams, platform boundaries, feature
  ownership, commercial entitlements, support model, time/budget, reliability,
  reversibility, auditability, or data handling.
- outcome context:
  outcome/OKR record facts if a future owner exists, plus inferred outcome
  nodes, metric candidates, goal relationships, and opportunity economics
  hypotheses.
- solution routing:
  classification of the request into existing feature usage/extension, new
  feature capability, cross-feature coordination, design-system usage or
  extension, platform seam usage or extension, authz/security/compliance/data
  review, architecture decision, pricing/entitlement change, support-process
  change, discovery-only, or blocked.
- conversation control:
  the next best action, question priority, assumption handling, repeated
  question suppression, recommendation posture, review routing, execution tier,
  and LLM-use decision.
- packet readiness:
  readiness state, blocking unknowns, safe assumptions, deferred items,
  hard-restraint impact, solution-routing confidence, final confirmation state,
  and packet recommendation.
- learning backlog:
  useful context to learn later without slowing the current packet.

### Actor Context And Existing Role Ownership

Actor Context must not create a parallel Discovery-owned role or authorization
model. Existing role, capability, role-assignment, root/tenant authority, and
future ABAC/ReBAC/object-rule ownership remain with the current role/RBAC/admin
and authz architecture.

Discovery Chat may read role data through public seams when needed:

- what roles exist
- what capabilities a role has
- what scope the role applies to
- which root/tenant boundary applies
- which users are assigned

Discovery Chat must not own or mutate roles, permissions, capabilities,
assignments, or authority boundaries.

Profile inference is separate from role records. A role is a functional
capability or responsibility category; a profile is contextualized human or
role-persona reality. Profile inference must use governed profile categories
such as responsibility, authority, technical fluency, confidence, risk
sensitivity, decision style, communication preference, pressure point, success
criteria, workaround, avoidance, escalation, approval, dependency,
emotional-driver, and training-support categories.

Empty profile fields must not automatically trigger questions. Missing profile
detail is asked only when it materially affects solution routing, risk, packet
readiness, scope, or confidence.

### Workflow Catalogue And Fit Assessment

Workflow Context must bridge tenant reality to approved implementation paths.
Discovery may infer workflow reality and map it to approved catalogues. It must
not invent frontend journeys, platform behavior, feature ownership, or
authorization behavior.

The workflow catalogue should distinguish:

- design-system workflow templates:
  approved frontend journey patterns made from governed components, page
  templates, states, transitions, accessibility rules, responsive rules,
  forbidden adaptations, and verification references.
- platform workflow capabilities:
  shared reusable platform processes such as audit recording, notification
  dispatch, approval state machines, job processing, file upload/scanning,
  tenant configuration resolution, feature flag evaluation, permission checks,
  idempotency, and retry handling.
- feature workflow capabilities:
  business-specific workflows owned by a feature, such as tenant onboarding,
  role assignment, billing contact update, support access request, admin user
  invitation, or entitlement change.

Each workflow request should classify:

- operational workflow understanding:
  `clear`, `partial`, or `unknown`
- design-system fit:
  `fitsApprovedTemplate`, `fitsWithConfiguration`,
  `requiresTemplateExtension`, `requiresNewTemplate`,
  `violatesApprovedSeam`, or `unknown`
- platform fit:
  `usesExistingPlatformCapability`, `requiresPlatformExtension`,
  `requiresNewPlatformCapability`, `violatesPlatformBoundary`, or `unknown`
- feature fit:
  `usesExistingFeatureCapability`, `extendsExistingFeatureCapability`,
  `requiresNewFeatureCapability`, `requiresCrossFeatureCoordination`, or
  `unknown`
- required procedure:
  `standardFeatureImplementation`, `designSystemChangeRequest`,
  `platformChangeRequest`, `featureExtension`, `architectureReview`, or
  `moreDiscoveryNeeded`

The workflow processing profile must capture when a request involves
validation, transformation, enrichment, calculation, routing, aggregation,
synchronization, persistence, audit generation, or automation triggers. This is
how the engine distinguishes frontend-only changes from feature-domain,
platform, integration, background-job, audit/compliance, data-model, and
architecture-review work.

### Problem And Opportunity Economics

Problem Context must be structured before jumping to solution routing. It
captures what is painful, risky, costly, slow, confusing, fragile, or missing,
and why that matters.

Opportunity Economics is a derived inference layer above workflow, problem, and
outcome context. It may infer:

- workflow value:
  value created by successful completion, who benefits, and which business,
  revenue, retention, compliance, efficiency, or customer-value signal is
  supported.
- workflow cost:
  labor, delay, support, error/rework, opportunity, compliance/risk, and
  emotional/friction cost.
- change ROI hypothesis:
  current cost, expected cost after change, value unlocked, implementation
  complexity, payback hypothesis, confidence, and assumptions.

ROI is a hypothesis, not accounting truth. It must be evidence-backed,
confidence-scored, and assumption-labelled. It should not block packet
readiness unless prioritization, scope, or business-case approval depends on it.

### Hard Restraint Evaluation

Hard restraints override preference, convenience, and inferred ROI. If a
solution violates a hard restraint, the packet must reroute the solution or mark
the issue blocked.

Hard restraint categories include tenant boundary, role authority, data
handling, compliance, auditability, security, design-system seam, platform
boundary, feature ownership, commercial entitlement, operational environment,
availability/reliability, performance, reversibility, time/budget, and support
model.

Hard-restraint evaluation must:

1. detect a candidate restraint
2. classify category and source
3. check confidence and severity
4. align with existing repo authority
5. choose enforcement mode: `block`, `reroute`, `requiresReview`, `warn`, or
   `track`
6. route to accountable owner such as architecture, security, data access,
   compliance, design system, pricing/commercial, feature owner, platform
   owner, tenant admin, or root operator
7. persist outcome and reflect it in packet readiness

Role-authority and data-handling restraints must reconcile with current and
future authz architecture before implementation. Compliance restraints must
reconcile with existing compliance gates and policy docs.

### Outcome Relationship Graph

Outcome Context should be graph-shaped rather than a flat KPI list. Official
outcomes, objectives, key results, reporting periods, owners, and priority
remain future Outcome Record Account data owned by a future planning/strategy
feature if one is approved.

Discovery may create Outcome Inference Account data such as inferred objectives,
metric candidates, priority signals, business pressure, ROI hypotheses, and
goal relationships.

Outcome node types include strategic, business, department, team, workflow,
user, customer, key result, metric candidate, risk reduction, efficiency,
quality, compliance, revenue, retention, and cost-reduction outcomes.

Relationship types include `supports`, `rollsUpTo`, `dependsOn`,
`constrains`, `conflictsWith`, `tradesOffWith`, `measures`, `isProxyFor`,
`isLeadingIndicatorFor`, `isLaggingIndicatorFor`, and `decomposesInto`.

Outcome inference is contextual intelligence, not official strategy. It must be
cautious, confidence-labelled, and asked about only when prioritization, scope,
success criteria, or business case depends on it.

### Conversation Control And Recommendations

Conversation Control is inference-first and interruption-aware. It should not
ask every interesting question. It asks only when the answer materially affects
packet readiness, routing, risk, scope, or confidence.

Supported modes:

- `askNow`
- `inferAndProceed`
- `stateAssumption`
- `recommendBestPractice`
- `recommendWithTradeoff`
- `recommendCheapestLowRiskPath`
- `deferToLearningBacklog`
- `summarizeAndConfirm`
- `routeForReview`
- `markBlocked`
- `generatePacket`

Recommendation source hierarchy:

1. hard restraint
2. governed source such as design-system, platform, authz, compliance, feature
   ownership, or approved workflow template
3. existing approved precedent
4. cheapest low-risk implementation path
5. ask or escalate

When no governed source exists, the engine may steer toward the cheapest
low-risk implementation path: reuse existing seams, keep scope narrow, prefer
configuration over code, prefer existing components/templates/workflows,
prefer existing platform seams, prefer feature extension over new feature,
prefer manual/reversible paths over automation, avoid new abstractions without
evidence, and minimize token usage, code churn, architectural novelty, and
operational risk.

If the cheapest path may violate security, compliance, authorization,
design-system, platform, feature-ownership, or commercial boundaries, escalate
instead of recommending.

### Packet Readiness

Packet readiness does not require everything to be known. It means enough is
known, unknowns are labelled, risks are visible, assumptions are explicit, and
next steps are routed.

Readiness dimensions:

- actor readiness
- workflow readiness
- problem readiness
- restraint readiness
- outcome readiness
- solution-routing readiness
- implementation-fit readiness
- evidence readiness
- assumption readiness
- confirmation readiness

Readiness states:

- `notReady`
- `partiallyReady`
- `readyWithAssumptions`
- `readyForReview`
- `blocked`

A packet is not ready if an unknown could invalidate the solution route,
violate a hard restraint, change the primary actor, materially alter scope, or
undermine packet usefulness.

The packet output should separate request summary, actor context, current
workflow, problem context, desired outcome, opportunity economics hypothesis,
hard restraints, approved seam/catalogue fit, solution routing assessment,
recommendation, assumptions, open questions, deferred learning items, required
reviews, evidence summary, and packet readiness state.

### Learning Backlog

The learning backlog prevents discovery from becoming a bloated interrogation.
It captures useful unknowns that should not block the current packet.

Learning backlog subject types include organization, actor profile, workflow,
problem, outcome, restraint, terminology, and preference. Items should capture
subject id, question intent, what to learn, why it may matter, priority,
ask-when policy, source session, evidence message ids, and status.

Ask-when values include `nextRelevantSession`, `whenSameActorAppears`,
`whenWorkflowRepeats`, `beforeImplementation`, `beforeRouting`, and
`beforePacketApproval`.

### Runtime And Token Governance

Runtime and token governance is first-class. The engine should not load,
reason over, or validate the whole discovery model on every turn.

Execution tiers:

- Tier 0 fast path:
  simple acknowledgements or small clarifications use current session summary,
  active hypothesis, last message, and next best action. No catalogue scans,
  deep routing, or packet readiness.
- Tier 1 focused discovery:
  normal discovery turns load only the relevant context layer, matching
  inference categories, active assumptions, and learning backlog.
- Tier 2 routing/restraint evaluation:
  triggered by permissions, data, compliance, frontend journeys, platform
  tooling, feature ownership, pricing, imports/exports, destructive actions,
  or other danger signals. Runs hard restraint, approved seam, fit, routing,
  and review ownership checks.
- Tier 3 packet generation:
  explicit handoff action only. Uses structured session state, relevant record
  facts, relevant inference facts, evidence, assumptions, blockers, routing
  assessment, and deferred learning.

Before any recommendation, the service must run a lightweight danger check for
tenant boundary, authz/permissions, sensitive data, compliance, audit, pricing,
destructive action, design-system seams, platform boundary, and feature
ownership. A positive danger check escalates to Tier 2.

### MVP Cut

The next planning/implementation cut should not build the full intelligence
platform.

MVP scope for this model:

- discovery session state
- compact working state
- record/inference/session separation
- actor, workflow, and problem inference category catalogues
- hard-restraint catalogue and evaluation skeleton
- solution-routing skeleton
- conversation-control modes
- packet-readiness gate
- learning backlog
- runtime/token governance

Out of scope for this cut:

- full reconciliation UX
- automated profile merge/split
- OKR record management
- advanced ROI calculations
- full catalogue admin UI
- cross-session intelligence automation beyond simple persisted inference
- a microservice split without a follow-up ADR

## Product Discovery Adapter Behavior

The Product Discovery adapter generates canonical Product Discovery packet
data from the conversation.
It must not create a parallel chat-only packet format.

## Lifecycle States

Conversation states:

- `draft`
- `active`
- `packet-ready`
- `abandoned`
- `closed`

Packet revision states:

- `draft`
- `generated`
- `pdf-ready`
- `downloaded`
- `superseded`
- `failed`

Required lifecycle behavior:

- an abandoned conversation remains visible according to the approved history
  and retention posture
- a generated packet revision is durable and traceable to its source
  conversation
- generating a newer packet revision supersedes the prior current revision
- failed generation records failure state without losing the transcript
- PDF delivery failure records a failure state without treating the packet
  generation as successful PDF delivery

## Data Requirements

The implementation must preserve durable facts for:

- conversation identity
- creator actor
- root or tenant scope
- current server-side context
- contextual prompt selections
- message history
- packet revision identity
- packet generation source
- supersession relationship
- generated PDF/download evidence
- lifecycle state
- retention posture
- audit timestamps

These facts must not depend only on mutable UI state, current page state,
request body tenant context, or external records that can change without
preserving historical truth.

## Authorization And Tenant Boundary Requirements

- Root-admin MVP runs in root/platform context.
- Tenant-builder active rollout is deferred but the data model must not block a
  future tenant-scoped rollout.
- Server-side authorization is the authority for conversations, packet
  generation, history, and downloads.
- Client-provided page/module/role context can influence starter prompts but
  must not grant authority.
- Chat creators can read their own histories.
- Any authenticated root builder may review other root builders' root-admin
  Build chat histories and generated packet versions in the MVP.
- Tenant-layer review and history access are deferred and must use explicit
  object and relationship-based permissions before activation.
- Tenant-scoped future work must deny cross-tenant access by default.
- Downloads must enforce current actor authorization at request time.

## Generated PDF Delivery Requirements

Generated packet PDF delivery uses the approved asset/download decision record
at
`docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`.

MVP delivery posture:

- transient generated attachment/download from durable packet data
- no stored rendered PDF bytes as durable assets
- current actor authorization at request time
- public delivery and generic file-hosting denied
- approved Product Discovery packet data only; raw transcript and internal
  notes excluded
- self-hosted Playwright/Chromium behind a provider-neutral generated-document
  seam
- packet source data capped at 250 KB
- rendered HTML capped at 750 KB
- PDF output capped at 5 MB, with warning metric at 3 MB
- soft render timeout of 10 seconds and hard timeout of 20 seconds
- one active render per root or future tenant context
- three active renders platform-wide
- five generations per actor per 10 minutes
- three generations per conversation per 10 minutes
- 30 generations per root/platform context per hour
- one automatic retry only for renderer startup, crash, or timeout failures
- alert if generation failure rate exceeds 10 percent over 30 minutes, any
  render reaches hard timeout, or the platform render queue remains full for
  more than 5 minutes

These are central configurable defaults for the MVP, not permanent business
tier limits. The implementation blueprint must name the owning configuration
keys or module and preserve a future path to tenant-level, package-level, or
platform-level overrides.

Public delivery and generic file-hosting behavior remain denied by default.

## Design-System Requirements

Root-admin app UI must not start until governed design-system seams exist for:

- work panel
- mobile floating action
- Build chat thread
- starter prompts
- conversation history posture
- packet PDF action
- coming-soon action posture for Reporting and Support

App adoption must consume design-system-owned render and controller seams. CSS
sharing alone is not sufficient.

## Failure And Recovery Requirements

The implementation must define behavior for:

- unauthenticated actor
- authenticated but unauthorized actor
- wrong-scope or future cross-tenant access
- stale conversation
- duplicate packet generation
- invalid or unsafe context
- Product Discovery adapter failure
- packet generation failure
- PDF delivery failure
- unavailable design-system seam during development
- denied tenant-layer review or cross-scope access

Failures must preserve durable evidence and return safe public responses.

## Audit And Evidence Requirements

Audit/evidence is required for:

- conversation creation
- packet generation
- packet supersession
- PDF download request
- download denial
- root-builder review access
- cross-tenant denial in future tenant scope
- generation and delivery failures

Runtime/browser evidence must include:

- active runtime process serving the user-facing surface
- live API or projection payload shape
- served frontend assets for browser-visible behavior
- regression fixture comparison against live shape
- mock-honesty check
- final test/gate commands after the last source change

## Open Blockers

The PRD does not resolve these blockers:

- root-admin first-consumer design-system parity proof
- API route implementation
- executable tests
- runtime/browser QA evidence from implemented code

## Acceptance Summary

This PRD is accepted for the current planning layer when:

- it preserves Product Discovery and Technical Steering scope
- the capability matrix maps the MVP capabilities
- unresolved implementation artifacts remain explicit blockers
- no implementation task is allowed to proceed from this PRD alone
