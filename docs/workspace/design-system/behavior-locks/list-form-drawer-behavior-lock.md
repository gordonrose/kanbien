# List Form Drawer Behavior Lock

Superseded by `docs/workspace/design-system/behavior-locks/drawer-form-behavior-lock.md`
after the seam was renamed to `drawer-form` and promoted out of the list-page
host preview.

## Purpose

Lock the first governed variation of the list drawer that hosts create/edit
forms for repeatable entity-entry workflows.

## Scope

- Family:
  `list-form-drawer`
- Parent family:
  `list-page`
- Current source surface:
  `/design-system/templates/list-page?drawerMode=form&formIntent=create`
  `/design-system/templates/list-page?drawerMode=form&formIntent=edit`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Related form behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status |
| --- | --- | --- | --- | --- |
| `LFD-001` | Create and edit entity-entry work may happen inside the same governed drawer chassis as list detail reading, rather than forcing navigation away from the list context. | Keeps list scanning, selected-record context, and authoring in one repeatable pattern. | The list-page preview now exposes create and edit form drawer states. | `approved` |
| `LFD-002` | Form mode must replace the drawer body and footer actions without changing the drawer shell, close control, mobile overlay posture, or parent list/detail split behavior. | Prevents the form variation from becoming a separate modal or app-local drawer. | The drawer toggles between view body/actions and form body/actions while preserving the same panel host. | `approved` |
| `LFD-003` | Create mode opens a blank form with no active record required; edit mode opens from the current selected record and pre-fills the form from that record. | Makes the intent explicit and avoids ambiguous partial-edit states. | `formIntent=create` opens a blank form, while edit opens from the selected or first preview record. | `approved` |
| `LFD-004` | Local field guidance and save/cancel actions stay inside the drawer, near the fields they govern. | Aligns the variation with the form-template rule that dense form guidance and recovery should remain local. | The preview keeps helper text under each field and footer save/cancel actions inside the drawer. | `approved` |
| `LFD-005` | Saving in design-system preview may mutate placeholder records locally, but production consumers must map persistence, validation, uniqueness, permissions, and durable domain data rules through the owning feature. | Keeps the design-system pattern useful without smuggling backend policy into frontend chrome. | The preview creates or updates placeholder cards only in browser state. | `approved` |
| `LFD-006` | The variation must keep keyboard focus deterministic: opening form mode moves focus to the first field, cancel/close restores to the launcher when applicable, and save returns to the readable detail state. | Keeps create/edit drawers accessible and predictable. | The controller focuses the title input on open, uses existing close focus return, and returns to view mode after save. | `approved` |
| `LFD-007` | The drawer preview should show the major form-control families working inside the drawer format, including text, textarea, select, date, time, radio, checkbox, toggle, and upload-posture controls. | Lets the design-system review judge whether the entity-entry drawer can host realistic forms without needing a separate app page. | The current preview includes a compact control mix below the primary entity fields. | `approved` |

## Exit Criteria

This variation is ready for broader canonical review when the reference pack,
verification checklist, and executable list-page form-drawer tests all point to
the same create/edit states.
