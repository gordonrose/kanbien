# Product Request Example: Chat Interface For Layer One Discovery

## Status

- Example status: `draft-example`
- Date: 2026-05-06
- Product Request ID: `PRQ-2026-05-05-chat-interface-layer-one-discovery`
- Related model:
  `docs/workspace/harness-audits/2026-05-06-product-request-backlog-model.md`
- Guardrail posture:
  Created as a workspace example only. It does not create a database entity,
  official backlog template, source code, migrations, API contracts, feature
  manifests, or generated artifacts.

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
  Discovery conversation from inside the product, preserve the conversation
  history, use page/module/role context to offer helpful starter prompts, and
  export a well-presented Product Discovery packet as a PDF.

## Current Backlog State

- Current status:
  `ready-for-story-breakdown`
- Requester-facing status:
  Ready for story planning
- Source channel:
  `chat`
- Owning context:
  root/platform first; tenant-builder rollout is future scoped
- Priority:
  `not-set`

## Artifact Links

- Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`
- Story Breakdown:
  not created yet
- Task Breakdown:
  not created yet
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## What The Chat Widget Should Show

- Title:
  Chat interface for Layer One Product Discovery
- Status:
  Ready for story planning
- Short update:
  Product intent and architecture direction are captured. Next we need to split
  the work into stories and identify the planning, design-system, data,
  security, and evidence artifacts needed before implementation.
- Waiting next:
  Story Breakdown
- User action needed:
  none right now

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
