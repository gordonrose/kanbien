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
  - API contracts
  - permission mapping
  - data dictionary
  - implementation blueprint
  - executable tests
  - runtime/browser QA evidence

This PRD preserves the root-admin MVP behavior and planning obligations. It is
not an implementation-ready artifact until the unresolved permission, PDF
configuration implementation, root-admin design-system parity, data, API,
blueprint, and evidence blockers are resolved.

## Source Artifacts

- Product Request:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery.md`
- Product Discovery:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-05-chat-interface-layer-one-discovery-story-breakdown.md`
- Capability Matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- Capability Matrix Notes:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft-notes.md`
- PRD-derived test cases:
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`

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
- durable conversation history for the creator
- root-builder review visibility once the approved permission is named
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

## Actors

- Root builder:
  A platform/root-admin actor who can start Build chat in the root-admin
  surface.
- Chat creator:
  The actor who created a conversation and may later view their own history.
- Root-builder reviewer:
  A root-level actor who may review root-admin discovery histories after the
  permission mapping names the exact role or capability.
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
9. The Product Discovery adapter generates canonical Product Discovery packet
   data from the conversation.
10. The generated packet becomes the current packet revision for that
    conversation.
11. A newer generated packet from the same conversation supersedes the prior
    packet revision.
12. After PDF delivery posture is approved, the root builder can download a
    well-presented packet PDF.
13. The creator can later see the conversation history.
14. The approved root-builder reviewer can review root-admin discovery
    histories after the permission mapping is resolved.

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
- Root-builder review visibility is required, but the exact role/capability is
  unresolved and blocks implementation.
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
- missing root-builder review permission mapping

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

- exact root-builder review role or permission
- root-admin first-consumer design-system parity proof
- API contract details
- permission mapping details
- data dictionary
- implementation blueprint
- runtime/browser QA evidence plan

## Acceptance Summary

This PRD is accepted for the current planning layer when:

- it preserves Product Discovery and Technical Steering scope
- the capability matrix maps the MVP capabilities
- unresolved policy choices remain explicit blockers
- no implementation task is allowed to proceed from this PRD alone
