# Record Management List-Centric Template

## Scope

- Template name:
  `record_management_list_centric`
- Status:
  template-demo
- Owner:
  Codex with design-system review pending
- Current design-system surface:
  `/design-system/templates/record_management_list_centric`
- Source pattern:
  `/design-system/patterns/chat-workspace`

## Intent

- What user or operator need does this template serve?
  Provide a record-heavy page shape where a status-organized list, selected
  record drawer, and supporting chat context stay visible as one operating
  surface.
- Why is this derived from the chat workspace?
  The chat workspace already proves the expandable page frame, conversation
  index, entity selector, status list, and row drawer choreography. This
  template reuses that seam with record-management labels instead of copying
  the interaction model into a new page-local implementation.

## Template Anatomy

- Required parts:
  page-shell chrome, chat workspace shell, conversation history, entity
  selector, status-organized record list, row drawer, supporting conversation
- Optional parts:
  record-specific filters, bulk actions, saved views, import/export actions,
  and domain-specific detail panels
- Layout structure:
  expanded workspace view with the record list as the primary operating lane
  and the chat/review context preserved alongside it

## Current Demo Contract

- The demo uses `src/frontend/designSystem/assets/chatWorkspaceMockConsumer.mjs`
  as the render/controller seam.
- The template-specific adapter is
  `src/frontend/designSystem/assets/recordManagementListCentricTemplate.mjs`.
- The route intentionally remains a design-system template demo, not a
  signed-off app-consumable page family.
- Real app adoption still requires the normal behavior lock, reference pack,
  verification checklist, and adoption artifact chain for the consuming
  surface.

## Source Of Truth

- Template route:
  `src/frontend/designSystem/templates/record_management_list_centric/index.html`
- Template adapter:
  `src/frontend/designSystem/assets/recordManagementListCentricTemplate.mjs`
- Regression coverage:
  `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts`
