# Entity Management Page Evidence And AI Behavior Lock

## Purpose

Capture evidence and AI assistant behavior inside the
`entity_management_page` template: mode toggles, target affordances, panel
layout, mobile overlay behavior, mutual exclusion, and focus recovery.

## Scope

- Family:
  `entity-management-page`
- Slice:
  evidence and AI contract
- Status:
  review-candidate

## Behavior Review

| ID | Behavior statement | Status | Current evidence / note |
| --- | --- | --- | --- |
| `EMP-EAI-001` | Evidence mode and AI mode are explicit drawer modes activated by top-level icon buttons in the drawer header. | `review-candidate` | Header buttons are imported from the entity page module and toggle drawer dataset states. |
| `EMP-EAI-002` | Evidence mode reveals evidence target affordances without entering edit mode. | `review-candidate` | Evidence toggle sets `recordManagementEvidenceMode=true` and `recordManagementEditMode=false`. |
| `EMP-EAI-003` | AI mode reveals AI target affordances without entering edit mode. | `review-candidate` | AI toggle sets `recordManagementAiMode=true` and `recordManagementEditMode=false`. |
| `EMP-EAI-004` | Evidence, AI, and edit modes are mutually exclusive. Turning one on closes the others and resets their pressed states. | `review-candidate` | Toggle handlers explicitly close opposing drawers and reset datasets/buttons. Needs focused regression test. |
| `EMP-EAI-005` | Evidence and AI buttons are attached to field/section evidence targets, not floating detached controls. | `review-candidate` | Render helpers emit evidence/AI buttons inside `data-entity-management-evidence-target` surfaces. |
| `EMP-EAI-006` | Opening an evidence target renders an Evidence detail drawer with element name, value, status, and evidence cards. | `review-candidate` | `renderRecordManagementEvidenceDrawer` renders evidence summary and cards from target metadata. |
| `EMP-EAI-007` | Opening an AI target renders an AI authoring guidance drawer with guidance status, candidate copy, and suggested actions. | `review-candidate` | `renderRecordManagementAiGuidanceDrawer` renders guidance content. Needs focused visual coverage. |
| `EMP-EAI-008` | Desktop evidence/AI view splits the drawer body into two equal usable halves; the active details panel must receive the left half and not collapse to the navigation column. | `approved-input` | User reported squashed details panel; current browser metric shows body grid `965px 965px`, entity panel `965px`, evidence panel `965px`. |
| `EMP-EAI-009` | Desktop evidence/AI view hides/collapses region and nested navigation lanes so the active nested detail panel fills the left half. | `approved-input` | Current CSS sets evidence/AI nested layout to one column and hides index/cards/resizer. |
| `EMP-EAI-010` | Mobile evidence/AI view becomes an overlay over the current page body rather than a two-column split. | `review-candidate` | Mobile CSS positions evidence drawer absolute over the body and blurs/pointer-disables underlying attribute view. |
| `EMP-EAI-011` | Closing evidence or AI removes the drawer, clears the corresponding view state, and restores the underlying page without changing selected region/item. | `review-candidate` | Close helpers remove panels and clear dataset state. Needs focused test. |
| `EMP-EAI-012` | Opening evidence/AI moves focus into the opened drawer close/return control. | `review-candidate` | Render helpers focus return buttons after insert. Needs keyboard verification. |
| `EMP-EAI-013` | Turning evidence/AI mode on focuses the first available target button to make the mode discoverable for keyboard users. | `review-candidate` | Toggle handlers focus first evidence/AI button if mode turns on. Needs keyboard verification. |
| `EMP-EAI-014` | Evidence and AI affordance styling must be visible only in their active modes and must not permanently change field layout when inactive. | `review-candidate` | CSS scopes button activation and target outline to mode datasets. Needs visual snapshots. |
| `EMP-EAI-015` | Evidence content in the design-system route is representative proof material, not the future durable evidence API contract. | `review-candidate` | Current evidence points are generated from demo target metadata. App adoption needs data contract. |

## Open Review Questions

- Should mobile evidence/AI overlay cover the bottom nav, or stay above it?
- Should closing evidence/AI return focus to the clicked target, the mode
  toggle, or the drawer header control?
- Should evidence/AI mode persist when switching regions, or clear on region
  switch?

## Evidence Gaps

- AI drawer browser coverage.
- Keyboard focus choreography.
- Mobile evidence/AI overlay geometry.
- Region switch while evidence/AI mode is active.

