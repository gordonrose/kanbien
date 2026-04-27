# List Form Drawer Reference Pack

Superseded by `docs/workspace/design-system/reference-packs/drawer-form-reference-pack.md`
after the seam was renamed to `drawer-form` and promoted out of the list-page
host preview.

## Purpose

Record the first reference states for the list drawer variation that contains a
form for creating and editing entity entries.

## Scope

- Family:
  `list-form-drawer`
- Parent family:
  `list-page`
- Status:
  first governed preview
- Current source surface:
  `/design-system/templates/list-page`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-form-drawer-behavior-lock.md`
- Existing executable verification:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`

## Current Surface Truth

- the parent list page now exposes a `New placeholder record` action in the
  list header
- create mode opens the existing list detail drawer as a blank form
- edit mode opens from a selected record and pre-fills the same form fields
- form mode uses the same drawer shell, close control, list split, mobile
  overlay posture, and accessibility model as the parent detail drawer
- form mode swaps the drawer body and footer actions, rather than adding a
  second modal or app-specific panel
- the preview now shows a compact form-control mix inside the drawer:
  text input, textarea, select, date, time, radio buttons, checkboxes, toggle,
  and upload-posture controls
- save mutates placeholder browser state only; real persistence remains owned
  by the consuming feature

## Required Reference States

| Ref ID | Route | State | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `LFD-001` | `/design-system/templates/list-page?drawerMode=form&formIntent=create` | Create form drawer open with blank fields | Proves the pattern can start a new entity entry without selecting a list record first | covered-by-test |
| `LFD-002` | `/design-system/templates/list-page` | Create form save returns to readable detail view for the new placeholder record | Proves the form variation can create a local preview record and preserve drawer context | covered-by-test |
| `LFD-003` | `/design-system/templates/list-page` | Edit form opens from the selected record with pre-filled fields | Proves edit intent remains tied to selected list context | covered-by-test |
| `LFD-004` | `/design-system/templates/list-page` | Edit form save updates the active placeholder card and returns to detail view | Proves save keeps the user in the list drawer rather than navigating away | covered-by-test |
| `LFD-005` | `/design-system/templates/list-page?drawerMode=form&formIntent=create&dir=rtl` | RTL create form drawer | Required before sign-off-grade localization review | not-yet-captured |
| `LFD-006` | `/design-system/templates/list-page?drawerMode=form&formIntent=edit&zoom=100` | Magnified edit form drawer | Required before sign-off-grade reflow review | not-yet-captured |
| `LFD-007` | `/design-system/templates/list-page?drawerMode=form&formIntent=create` | Form-control mix inside the drawer | Proves the drawer format can host the main control families without switching to the standalone form template | covered-by-test |

## Guardrails

- The variation inherits the parent list-page scroll, close, mobile overlay,
  and shell layering rules.
- The variation inherits form-template expectations for local guidance and
  local action zoning.
- App consumers must not copy this markup locally; they need a governed shared
  render/controller seam or an explicit exception before real-app adoption.
