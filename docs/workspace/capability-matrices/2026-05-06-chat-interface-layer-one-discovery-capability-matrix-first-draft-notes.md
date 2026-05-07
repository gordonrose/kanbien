# Chat Interface For Layer One Product Discovery Capability Matrix Notes

## Status

- Status:
  first draft
- Date:
  2026-05-06
- Matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- Source PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Source Story Breakdown:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`

## Scope

This first draft maps the root-admin MVP capabilities needed before Task
Breakdown can safely isolate delivery work.

The matrix is intentionally not implementation-ready. It keeps three blockers
visible:

- generated packet PDF delivery posture
- exact root-builder review permission
- design-system family extension versus new governed family decision

## Capability Groups

- `rootAdminBuildPanelEntry`
  Root-admin entry point for the work panel and Build action.
- `buildDiscoveryConversation`
  Conversation creation, free-form chat, contextual starter prompts, and chat
  history.
- `productDiscoveryPacketGeneration`
  Narrow adapter to canonical Layer 1 Product Discovery packet data.
- `packetRevisionSupersession`
  Durable packet revisions and supersession behavior.
- `generatedPacketPdfDelivery`
  Generated PDF download posture, blocked until asset decision approval.
- `rootBuilderHistoryReview`
  Root-builder review visibility, blocked until the exact permission is named.
- `artifactEvidenceGate`
  Runtime/browser, security, persistence, and mock-honesty evidence obligations.

## Open Decisions

1. Should generated Product Discovery packet PDFs be transient downloads only
   for MVP, stored generated assets, or transient first and stored later?
2. Which named root-builder role or permission may review root-admin discovery
   histories beyond the original creator?
3. Which existing design-system family should be extended, or should this
   become a new governed family candidate?

## Usage

Use this matrix as input to:

- PRD-derived test-case planning
- API contract planning
- permission mapping
- data dictionary work
- implementation blueprint
- Task Breakdown after blockers are resolved
