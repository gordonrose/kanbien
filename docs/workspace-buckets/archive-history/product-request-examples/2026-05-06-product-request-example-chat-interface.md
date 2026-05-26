# Product Request Example: Chat Interface For Layer One Discovery

## Archive Status

- Archived from:
  `docs/workspace/harness-audits/2026-05-06-product-request-example-chat-interface.md`
- Archive reason:
  early Product Request example retained for history; do not copy as a current
  template or current request status example
- Current guidance:
  `docs/workspace/product-requests/README.md`
- Current template:
  `docs/templates/product-request-template.md`

## Original Content

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
  export a simple structured Product Discovery packet as a PDF.

## Current Backlog State

- Current status:
  `first-pass-story-map-blocked`
- Requester-facing status:
  First-pass story map created; structural questions must be resolved next
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
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Generated packet PDF decision:
  approved for transient generated download and simple structured export:
  `docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`
- Design-system behavior lock:
  `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md`
- Design-system reference pack:
  `docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md`
- Design-system pattern:
  `docs/workspace/design-system/patterns/build-work-panel-pattern.md`
- Design-system verification checklist:
  `docs/workspace/design-system/verification/build-work-panel-verification-checklist.md`
- Root-admin adoption contract:
  `docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md`
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
  First-pass story map blocked
- Short update:
  Product intent, architecture direction, a first-pass story map, and the
  generated packet PDF decision are captured. The PDF is approved as a
  transient regenerated download with simple structured export rendering. Draft
  design-system governance now names the Build work panel family, required
  states, verification needs, and root-admin adoption stop conditions, but the
  design behavior still needs explicit human review before rendered
  `/design-system` proof treats that blocker as resolved.
- Waiting next:
  behavior-lock review
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
