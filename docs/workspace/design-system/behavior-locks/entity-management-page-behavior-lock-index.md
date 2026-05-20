# Entity Management Page Behavior Lock Index

## Purpose

Map the behavior-lock slices needed before the
`entity_management_page` design-system template can be treated as an active
app-consumable seam.

This page is intentionally split into reviewable slices. The template currently
contains too many behaviors to lock honestly in one pass.

## Review Status Legend

- `review-candidate`:
  behavior is observed in the current implementation or captured from recent
  user feedback, but still needs explicit human review before it is called
  approved.
- `approved-input`:
  behavior was explicitly confirmed during the recent design-system loop and
  should be preserved unless the review changes direction.
- `needs-evidence`:
  behavior is implemented or intended, but needs stronger rendered proof before
  promotion.
- `blocked-for-adoption`:
  behavior or source topology must change before first app consumption.

## Slice Map

| Slice | Artifact | Scope |
| --- | --- | --- |
| Outer page contract | `entity-management-page-outer-page-behavior-lock.md` | Shell ownership, page framing, desktop/mobile layout, scroll ownership, and app-consumable boundary. |
| Navigation contract | `entity-management-page-navigation-behavior-lock.md` | Region index, mobile region selector, nested cards, carousel, active state, and resizer behavior. |
| Detail panel contract | `entity-management-page-detail-panel-behavior-lock.md` | Form fields, generated sections, derived fields, edit posture, validation, workflow builder, and generated model panels. |
| Collection item behavior | `entity-management-page-collection-item-behavior-lock.md` | Add, copy, delete, card sync, workflow/catalog/permission item lifecycles, and item-specific builders. |
| Evidence/AI contract | `entity-management-page-evidence-ai-behavior-lock.md` | Evidence and AI modes, target affordances, desktop split, mobile overlay, focus/return behavior, and mutual exclusion. |
| Performance contract | `entity-management-page-performance-behavior-lock.md` | Lazy rendering, render-ready signal, initial DOM budget, module/fixture separation, and regression evidence. |

## Current Evidence

- Source seam:
  `src/frontend/designSystem/assets/entityManagementPage.mjs`
- Consuming demo adapter:
  `src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs`
- Styling surface:
  `src/frontend/designSystem/assets/chatWorkspacePattern.css`
- Visual/browser coverage:
  `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts`
- Current route:
  `/design-system/templates/entity_management_page`

## Promotion Position

This index does not promote the page to app-consumable status by itself.

Before app adoption, the page still needs:

- behavior-lock review and signoff for each slice
- a reference pack with concrete screenshot/geometry states
- a verification checklist tied to the six slices
- an adoption contract that states exactly what real app pages consume
- separation of demo Organization fixture data from reusable seam code
- explicit app-consumer API shape for render, behavior initialization, and data
  adaptation

