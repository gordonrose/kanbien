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
  `docs/workspace/story-breakdown/2026-05-05-chat-interface-layer-one-discovery-story-breakdown.md`
- Task Breakdown:
  pending
- PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Capability Matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- PRD-derived test cases:
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`
- Layer 1 Runtime Contract:
  `docs/workspace/harness-audits/2026-05-06-layer-one-runtime-contract.md`
- Permission Mapping:
  `docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md`
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

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
  relationship permissions remain deferred. Next we need to create the
  remaining API, data, journey/evidence, and blueprint artifacts before
  implementation tasks can begin. The PDF numeric thresholds are captured as
  configurable MVP defaults.
- Waiting next:
  Layer 3 unblock work
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
