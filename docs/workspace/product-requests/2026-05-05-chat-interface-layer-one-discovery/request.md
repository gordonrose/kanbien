# Product Request: Chat Interface For Layer One Product Discovery

## Status

- Product Request ID:
  `PRQ-2026-05-05-chat-interface-layer-one-discovery`
- Date:
  2026-05-06
- Current status:
  `story-breakdown`
- Requester-facing status:
  Ready for story planning
- Source channel:
  `chat`
- Owning context:
  root/platform first; tenant-builder rollout is future scoped
- Priority:
  `not-set`
- Related model:
  `docs/workspace/harness-audits/2026-05-06-product-request-backlog-model.md`

## Human Summary

- Target users:
  Root builders first. Tenant builders are a known future audience, but active
  tenant-builder workflows are out of the MVP.
- Change type:
  Reusable app-consumable chat/work panel for Layer 1 Product Discovery.
- Routing layer:
  `core-platform-pr`
- What we are trying to accomplish:
  Give builders a shared in-app chat surface that can start a Layer 1 Product
  Discovery conversation from inside the product, preserve conversation
  history, use page/module/role context to offer helpful starter prompts, and
  export a well-presented Product Discovery packet as a PDF.

## Artifact Links

- Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`
- Story Breakdown:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Task Breakdown:
  pending
- PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Capability Matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- PRD-derived test cases:
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`
- Journey Inventory / QA Evidence Plan:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`
- Layer 1 Runtime Contract:
  `docs/workspace/harness-audits/2026-05-06-layer-one-runtime-contract.md`
- Permission Mapping:
  `docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md`
- API Contract:
  `docs/api-contracts/chat-interface-layer-one-discovery.md`
- Data Dictionary:
  `docs/data-dictionary/harness-chat-conversation.md`,
  `docs/data-dictionary/harness-chat-message.md`,
  `docs/data-dictionary/harness-chat-packet-revision.md`,
  `docs/data-dictionary/harness-chat-pdf-attempt.md`
- Implementation Blueprint:
  `docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md`
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## Epic Index

| Epic ID | Title | Status | Epic Artifact | Summary |
| --- | --- | --- | --- | --- |
| EPIC-chat-interface-layer-one-discovery | Chat interface for Layer One Product Discovery | story-breakdown | `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery` | Breaks the chat interface request into readable planning stories, including design-system work, generated packet delivery, conversation history, APIs, root-admin adoption, runtime evidence, artifact sweeps, and future tenant-builder rollout deferral. |

## What The Chat Widget Should Show

- Title:
  Chat interface for Layer One Product Discovery
- Status:
  Story planning blocked on artifact unblocks
- Short update:
  Product intent, architecture direction, story queue, PRD, first-draft
  capability matrix, generated PDF direction, design-system path, and
  PRD-derived test cases are captured. Root-builder review is approved for all
  root builders in the root-admin MVP, while tenant-layer object and
  relationship permissions remain deferred. The API contract is captured for
  conversations, history, packet generation, packet revisions, and PDF
  download. The data dictionary now captures planned durable conversations,
  messages, packet revisions, and PDF attempt evidence. The implementation
  blueprint now maps the root-admin MVP into repo-shaped backend, persistence,
  authz, adapter, PDF, verification, and artifact work. The journey/evidence
  plan now defines the runtime proof, browser scenarios, and mock-honesty
  checks future tasks must satisfy. Next we need Task Breakdown before
  implementation tasks can begin. The PDF numeric thresholds are captured as
  configurable MVP defaults.
- Waiting next:
  Task Breakdown
- User action needed:
  none for the current root-builder review rule

## Source-Of-Truth Boundary

Product Request is a brief human-readable summary, status tracker, and artifact
index. It must not replace the linked artifacts.

- Product Discovery owns product intent.
- Technical Steering owns architecture decisions.
- Story Breakdown owns final story definitions.
- Task Breakdown owns task write sets and execution handoff.
- Loop Runs own execution evidence, scorecards, events, metrics, change sets,
  and changed artifact traceability.
- PRs own reviewable source-control changes.
