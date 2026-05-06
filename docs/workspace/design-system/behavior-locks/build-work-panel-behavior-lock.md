# Build Work Panel Behavior Lock

## Purpose

Lock the behavioral rules for the `build-work-panel` family before creating
signed-off reference states, canonical renderings, or root-admin app adoption.

This artifact covers the shared work-panel shell and its MVP Build chat
payload. It intentionally does not approve root-admin implementation yet.
Root-admin may adopt this family only after the behavior lock, reference pack,
verification checklist, and adoption contract are honest and the required
render/controller seams exist.

Related existing family rules:

- `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
- `docs/workspace/design-system/patterns/drawer-pattern.md`

The Build work panel may inherit drawer attachment and close behavior, but it
needs its own lock because it combines persistent page-level availability,
page-specific right-side icon toolbar, chat, conversation history, and packet export.

## Review Status Legend

- `approved`:
  behavior should be preserved in the signed-off reference pack
- `rejected`:
  current or proposed behavior should not be treated as the target
- `undecided`:
  behavior needs review, rendered proof, or clarification before signoff

## Scope

- Family:
  `build-work-panel`
- Current source surface:
  signed-off `/design-system/patterns/build-work-panel-demo` review surface
- Intended first governed surface:
  root-admin shell
- Source product artifact:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`
- Source steering artifact:
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`
- Source story artifact:
  `docs/workspace/story-breakdown/2026-05-05-chat-interface-layer-one-discovery-story-breakdown.md`
- Related asset decision:
  `docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`
- Related downstream artifacts:
  `docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md`
  and
  `docs/workspace/design-system/verification/build-work-panel-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `BWP-000` | The Build work panel is governed shell chrome, not page-local content or an app-page CSS exception. | Keeps the reusable Reporting/Support/Build surface from becoming a one-off root-admin implementation. | The signed-off pattern remains design-system-owned through `conversationPanel`; root-admin now consumes that seam for UI-only adoption proof with temporary local handlers. | `approved` | Signed off for design-system pattern promotion; real harness integration remains blocked until the next slice. |
| `BWP-001` | Desktop and wide tablet layouts should expose the work panel from the right side of the shell, attached to the app chrome and overlaying the page content instead of reflowing the page. | Preserves a stable work surface across pages without forcing each page to reserve layout space. | Review surface and root-admin UI-only consumer render a right-side shell-attached panel without page reflow. | `approved` | Signed off for MVP direction. |
| `BWP-002` | Mobile layouts should collapse the work panel entry into a floating action button that opens a full-height or bottom-attached governed panel without hiding the active page permanently. | Keeps the action reachable on small screens while preserving page context and recovery. | Review surface includes mobile collapsed entry and panel state; root-admin UI-only parity covers close and floating-action reopen. | `approved` | Signed off for MVP direction. |
| `BWP-003` | The surface must always show the same top-level page actions for the MVP as a right-side icon toolbar: Reporting, Support, and Build. Reporting and Support are visible but inactive/coming-soon; Build is active. | Keeps page-specific tools distinct from module-level context navigation without turning shell actions into chat tabs. | Signed-off rendering places icon actions outside the chat panel. | `approved` | Signed off after tab treatment was rejected. |
| `BWP-004` | Activating Build opens the Layer 1 Product Discovery chat surface; Reporting and Support must not open incomplete workflows in the MVP. | Prevents accidental product-scope expansion and confusing dead-end interactions. | Build toggles the panel; Reporting and Support remain inactive actions. | `approved` | Signed off for MVP scope. |
| `BWP-005` | The Build chat starts directly in the conversation. Large starter prompt buttons for page, module, and role context are rejected for the current demo direction. | Keeps the panel feeling like chat rather than a form-driven wizard while preserving open-ended discovery. | Updated after demo feedback. | `rejected` | Remove starter-card treatment from reference direction. |
| `BWP-006` | Page, module, and role context is display/help text only; server-side authorization remains the only authority for chat history, packet generation, and PDF download. | Protects the tenant/security boundary and prevents URL or UI state from granting access. | Steering and story breakdown already carry this as a security rule. | `approved` | Signed off as a baseline security rule. |
| `BWP-007` | The chat surface must include a conversation-history lane next to the active chat. That lane must be collapsible/expandable and list that user's prior conversations. | Users and root builders need continuity and reviewability without burying conversation selection inside the transcript. | Signed-off rendering includes an adjacent collapsible history lane with slim items and summaries. | `approved` | Signed off for MVP direction; data/API planning remains downstream. |
| `BWP-008` | The packet download action must look like an export/download command, must only appear when an authorized packet is available, and must use attachment/download behavior rather than inline rendering. | Aligns the UI with the proposed generated-PDF decision and avoids casual public or inline document treatment. | Signed-off rendering includes ready, preparing, completed history event, and repeat-download affordances. | `approved` | Signed off for simple structured export UI journey. |
| `BWP-009` | Loading, empty, denied, unavailable, and failed-generation states must be first-class visible states, not hidden behind generic spinners or silent no-ops. | The work panel will sit in privileged admin chrome, so users need clear recovery and confidence cues. | Needs reference states. | `undecided` | Pending reference pack. |
| `BWP-010` | Closing the panel should preserve server-backed conversation history and return focus to the launching control. | Keeps the surface recoverable and accessible without making panel visibility the source of truth. | Review surface preserves visible history and close/open controls; server-backed persistence remains an app/API contract. | `approved` | Signed off for panel visibility behavior. |
| `BWP-011` | Keyboard users must be able to open the panel, switch actions, expand/collapse conversation history, choose a conversation, write chat messages, download an available packet, close the panel, and recover focus without pointer input. | Makes the first workflow usable under WCAG 2.2 AA expectations. | Needs direct keyboard verification. | `undecided` | Pending verification. |
| `BWP-012` | The panel must remain readable and structurally stable in desktop, mobile, RTL, long-label, high-magnification, and dark-theme states. | Protects the shared shell against localization, accessibility, and responsive drift. | Rendered smoke checks passed for dark theme, display settings, RTL, and high magnification on the review surface; canonical states still required. | `approved` | Signed off for current pattern surface. |
| `BWP-013` | The panel may include preview-only knobs or labels on `/design-system`, but the root-admin consumer must expose only product-approved actions and copy. | Keeps review tooling out of production UI. | Review surface includes display settings controls; adoption contract excludes them from production payload. | `approved` | Signed off as design-system-only review tooling. |
| `BWP-014` | Root-admin app adoption is blocked until a design-system-owned render seam, style seam, and controller seam exist or an explicit exception is approved. | Prevents copied markup, app-page CSS, or page-local interaction logic. | This is required by repo governance. | `approved` | Design-system signoff is required before app UI. |

## Open Questions To Resolve Through Feedback

- Exact denied and failed-generation copy, retry timing, and support handoff
  posture for protected app adoption.
- The API/data model for conversation history, packet-chain history, and
  root-builder authorization.
- The shared design-system render/controller/style seam shape for app
  consumption.

## Exit Criteria For This Step

This behavior lock step is complete when each listed behavior is marked:

- `approved`
- `rejected`
- or `undecided` with an explicit follow-up action

Do not treat the Build work panel reference pack, canonical set, verification
artifact, or root-admin adoption as signed off while critical behaviors remain
undecided.
