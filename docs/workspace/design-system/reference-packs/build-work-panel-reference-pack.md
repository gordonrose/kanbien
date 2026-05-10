# Build Work Panel Reference Pack

## Purpose

Define the concrete review targets for the `build-work-panel` family now that
the signed-off `/design-system` review surface has been promoted into a shared
renderer/controller seam and canonical render surface.

This pack is the signed-off reference direction for the current design-system
pattern surface and its canonical state set. Root-admin app adoption still
requires first-consumer parity proof.

## Scope

- Family:
  `build-work-panel`
- Status:
  signed-off reference direction with dedicated canonical render surface
- Intended source surface:
  `/design-system/patterns/build-work-panel-demo`, shared render/controller
  seam in `/design-system/assets/conversationPanel.mjs`, shared style seam in
  `/design-system/assets/conversationPanel.css`, and generated canonical
  family under `/design-system/canonical-renderings/build-work-panel`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/build-work-panel-pattern.md`
- Related verification checklist:
  `docs/workspace/design-system/verification/build-work-panel-verification-checklist.md`
- First adoption target:
  root-admin shell, after signoff only

## What This Pack Is For

Use this pack to answer:

- which panel, chat, starter, history, permission, responsive, and PDF states
  must be reviewed before app adoption
- which parts of the generic drawer family the Build work panel inherits
- which app-specific behavior must stay out of the design-system preview
- what later root-admin parity must match

## Rule Source

This pack is governed by:

- `BWP-*` behavior rules in
  `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md`
- the generic drawer shell rules in
  `docs/workspace/design-system/patterns/drawer-pattern.md`
- generated PDF delivery rules in
  `docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`

## Required Reference States

| Ref ID | Proposed review route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `BWP-R-001` | `/design-system/canonical-renderings/build-work-panel/BWP-R-001` | Desktop closed launcher | Proves the work-panel entry is visible in shell chrome without stealing page layout. | canonical-created | Uses the shared `conversationPanel.mjs` renderer. |
| `BWP-R-002` | `/design-system/canonical-renderings/build-work-panel/BWP-R-002` | Desktop panel open, Build selected, empty chat | Proves the right-side panel, icon toolbar, history lane, chat composition box, and opening chat state fit in the baseline desktop frame. | canonical-created | MVP primary state. |
| `BWP-R-003` | `/design-system/canonical-renderings/build-work-panel/BWP-R-003` | Active chat with conversation history collapsed | Proves the active chat remains usable when the history lane is hidden. | canonical-created | Replaces the rejected starter-prompt state. |
| `BWP-R-004` | `/design-system/canonical-renderings/build-work-panel/BWP-R-004` | Active chat with visible history | Proves mixed user and harness messages preserve scanability and history continuity. | canonical-created | Include generated-packet-ready status. |
| `BWP-R-005` | `/design-system/canonical-renderings/build-work-panel/BWP-R-005` | Packet available with download action | Proves the PDF action reads as an authenticated export/download command, not inline preview or public link. | canonical-created | Must align with the asset decision record. |
| `BWP-R-006` | `/design-system/canonical-renderings/build-work-panel/BWP-R-006` | Generation failed or unavailable | Proves failure recovery is visible without losing conversation history. | canonical-created | Includes retry affordance at the UI seam. |
| `BWP-R-007` | `/design-system/canonical-renderings/build-work-panel/BWP-R-007` | Denied or restricted state | Proves lack of access is clear and does not leak packet or history details. | canonical-created | Required before protected API adoption. |
| `BWP-R-008` | `/design-system/canonical-renderings/build-work-panel/BWP-R-008` | Mobile floating action closed | Proves the collapsed mobile entry remains reachable without covering primary page work. | canonical-created | Floating action must not overlap critical shell chrome. |
| `BWP-R-009` | `/design-system/canonical-renderings/build-work-panel/BWP-R-009` | Mobile panel open, Build selected | Proves mobile panel framing, chat history, composer, action toolbar, and close affordance fit without text overlap. | canonical-created | Highest-risk mobile state. |
| `BWP-R-010` | `/design-system/canonical-renderings/build-work-panel/BWP-R-010` | RTL desktop panel open | Proves shell attachment, action order, conversation history, and close behavior mirror correctly. | canonical-created | Direction is encoded in the canonical reference. |
| `BWP-R-011` | `/design-system/canonical-renderings/build-work-panel/BWP-R-011` | Dark theme with magnification and long labels | Proves contrast, focus indicators, wrapping, and message readability under accessibility stress. | canonical-created | Rendered smoke check passed after dark-theme correction. |
| `BWP-R-012` | `/design-system/canonical-renderings/build-work-panel/BWP-R-012` | Reporting and Support inactive actions | Proves inactive actions are visible as future affordances without acting like broken buttons. | canonical-created | MVP non-goal guard. |
| `BWP-R-013` | `/design-system/canonical-renderings/build-work-panel/BWP-R-013` | Long typed input | Proves the composer textarea grows naturally while the send button stays fixed. | canonical-created | Covers scrollbar-at-max-height risk. |
| `BWP-R-014` | `/design-system/canonical-renderings/build-work-panel/BWP-R-014` | Tools menu open | Proves attachment, screen capture, and log capture actions expand without squeezing the composer. | canonical-created | Covers expandable menu placement. |
| `BWP-R-015` | `/design-system/canonical-renderings/build-work-panel/BWP-R-015` | Download completed journey | Proves the initial packet block can disappear after download while the transcript records a repeatable event. | canonical-created | Covers completed export journey. |
| `BWP-R-016` | `/design-system/canonical-renderings/build-work-panel/BWP-R-016` | History summary tooltip | Proves slim conversation-history rows can reveal a bounded summary without making the list bulky. | canonical-created | Tooltip copy stays capped at 140 characters. |
| `BWP-R-017` | `/design-system/canonical-renderings/build-work-panel/BWP-R-017` | Message edit state | Proves builder messages can enter edit mode without collapsing transcript spacing. | canonical-created | Covers user-authored message editing. |
| `BWP-R-018` | `/design-system/canonical-renderings/build-work-panel/BWP-R-018` | Harness reply prefill | Proves replying to a harness message pre-fills the composer while preserving the compact action row. | canonical-created | Covers harness response workflow. |
| `BWP-R-019` | `/design-system/canonical-renderings/build-work-panel/BWP-R-019` | Mobile long-content stress | Proves long mobile messages, packet status, and composer remain reachable without clipping. | canonical-created | Highest-risk mobile overflow state. |
| `BWP-R-020` | `/design-system/canonical-renderings/build-work-panel/BWP-R-020` | Dark mobile preparing download | Proves dark mobile rendering keeps the preparing state readable while preserving panel structure. | canonical-created | Covers prior dark-theme and mobile-frame regressions together. |
| `BWP-R-021` | `/design-system/canonical-renderings/build-work-panel/BWP-R-021` | History hover actions | Proves new-chat, rename, archive, and undo affordances fit inside the slim history lane without making rows bulky. | canonical-created | Covers hover/focus row action reveal and reversible archive. |
| `BWP-R-022` | `/design-system/canonical-renderings/build-work-panel/BWP-R-022` | Archived history view | Proves archived chats leave the active list but remain recoverable inside the history panel. | canonical-created | Covers the first archived recovery view. |

## High-Risk Review Batch

The highest-risk review states are:

- `BWP-R-002` desktop panel open, Build selected, empty chat
- `BWP-R-004` active chat with visible history
- `BWP-R-005` packet available with download action
- `BWP-R-009` mobile panel open, Build selected
- `BWP-R-011` dark theme with magnification and long labels
- `BWP-R-013` long typed input
- `BWP-R-015` download completed journey
- `BWP-R-019` mobile long-content stress
- `BWP-R-020` dark mobile preparing download
- `BWP-R-021` history hover actions

These states prove the core workflow, responsive shape, accessibility stress,
and PDF action posture.

## Reference Contract

- The panel is a governed shell-attached work surface.
- Build is the only active MVP action.
- Reporting and Support are visible inactive actions.
- Large starter prompts are rejected for the MVP direction.
- Conversation history is a collapsible adjacent lane.
- Conversation history includes a fast new-chat action, editable titles,
  hover/focus row actions, reversible archive, and an archived recovery view.
- Chat action tools use an expandable composer menu.
- Context display never grants access.
- History remains visible and recoverable.
- PDF download is an authorized attachment action, not inline preview or public
  delivery.
- Mobile uses a reachable floating action and governed panel surface.
- Root-admin adoption now consumes the shared design-system render, controller,
  and style seams with protected harness chat APIs and live assistant runtime
  evidence.

## Evidence Status

- Behavior lock:
  signed off for the current pattern direction
- Pattern artifact:
  signed-off pattern
- Rendered `/design-system` route:
  `/design-system/patterns/build-work-panel-demo`
- Dedicated canonical launcher:
  `/design-system/canonicals/build-work-panel`
- Dedicated canonical render states:
  `/design-system/canonical-renderings/build-work-panel/BWP-R-001` through
  `/design-system/canonical-renderings/build-work-panel/BWP-R-022`
- Browser verification:
  rendered smoke checks passed for current review surface; full canonical
  browser suite exists in
  `tests/visual/designSystem/canonicals/shell/buildWorkPanel.spec.ts`
- Human signoff:
  received for the current pattern direction
- Root-admin adoption:
  consumer parity and real harness/API integration proved

## Exit Condition

This pack becomes operational when:

- the behavior lock is reviewed
- dedicated design-system render surfaces exist for the required states
- the verification checklist names passing rendered evidence
- a root-admin adoption contract names the shared render, controller, and style
  seams to consume
- the root-admin consumer proves it uses `renderConversationPanel`,
  `createConversationPanelController`, and a Build config instead of copied
  markup, CSS, or local behavior

This pack is signed-off design-system truth and root-admin adoption evidence.
The first consumer now has live Layer 1/harness API integration, server-backed
conversation state, persisted assistant usage attempts, and protected packet
generation/download behavior.
