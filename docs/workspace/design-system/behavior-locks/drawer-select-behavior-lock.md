# Drawer Select Behavior Lock

## Purpose

Lock the behavioral rules for the `Drawer Select` child seam extracted from the
signed-off `Form Template` parent before creating a dedicated canonical set or
promoting the seam toward wider adoption.

This artifact is intentionally narrower than the parent template lock. It
inherits parent page framing from `form-template` and governs only the child
seam's trigger, drawer, search, selection, and focus behavior.

Parent page rules stay governed by:

- `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`

Do not redefine parent page framing, section cadence, grouped-field
composition, or action zoning here.

## Review Status Legend

- `approved`:
  behavior should be preserved in the child reference pack and canonical set
- `rejected`:
  current behavior should not be treated as the target
- `undecided`:
  behavior still needs iteration before being locked

## Scope

- Family:
  `drawer-select`
- Current source surface:
  `/design-system/templates/form`
- Parent host contract:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related downstream artifacts:
  `docs/workspace/design-system/reference-packs/drawer-select-reference-pack.md`
  `docs/workspace/design-system/verification/drawer-select-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `DS-001` | `Drawer Select` must remain a child seam hosted inside the signed-off `Form Template` parent and must inherit the parent field-tile and page framing instead of redefining field shell, page layout, section rhythm, or action zoning. | Keeps the seam reusable without letting extraction absorb parent ownership. | The current route hosts both drawer-select variants inside `.form-field` tile hosts and the existing form sections/action rails without changing the parent shell. | `approved` | Treat this as a child seam, not a parent page. |
| `DS-002` | In the resting state, the trigger must show a truthful summary of the current selection plus a selected-count meta line, with an empty fallback summary that matches the hosted variant instead of using one shared noun for every instance. | Makes the collapsed trigger informative and keeps the seam generic enough for multiple hosted nouns. | The current route shows summary plus `n selected`; this pass also adds instance-specific empty-summary fallbacks so the segment variant does not fall back to `Choose collections`. | `approved` | The child seam owns trigger summary behavior. |
| `DS-003` | Opening the seam must reveal a dedicated side drawer with search, `Selected`, and `Available` zones visible together, while preserving the parent form context around it. | Preserves the core interaction chassis that makes this seam more than a generic picker list. | Both signed-off variants open the same drawer chassis from the parent form and keep the two stack zones visible at the same time. | `approved` | Keep the approved `Selected` / `Available` naming. |
| `DS-004` | Opening the drawer must autofocus the search field, and owned close paths such as the close button or `Escape` must return focus to the trigger. | Protects the seam's open/close focus choreography and keeps recovery predictable. | `openDrawer()` moves focus into search on open, and owned close paths restore focus to the launching trigger. | `approved` | Preserve focus behavior on open and close. |
| `DS-005` | While open, keyboard focus must stay contained inside the drawer in a modal-like loop until the seam is explicitly exited. | Protects the approved keyboard containment model and keeps this seam from degrading into a loose side panel. | The current drawer-select runtime traps `Tab` and `Shift+Tab` within the active drawer until it closes. | `approved` | Keep the modal-like keyboard focus trap while open. |
| `DS-006` | The drawer must preserve plainly named `Selected` and `Available` stacks, expressed once per stack instead of duplicating the same label in multiple typographic layers. | Keeps the seam generic, calm, and reusable across domains. | The checked-in source now uses one neutral heading per stack in both variants. | `approved` | Preserve the current approved naming. |
| `DS-007` | Search, selected chips, and available options must stay synchronized so toggling from either stack updates the hidden value, trigger summary, selected count, and active option states together. | Makes the seam trustworthy when people search, add, and remove items in one flow. | The runtime re-renders summary, counts, chips, and option active states after both option toggles and selected-chip removals. | `approved` | The child seam owns search plus toggle/remove behavior. |
| `DS-008` | The seam must preserve separate empty states for no selected items and no search matches, and a no-match search must not hide the `Selected` stack if items are already chosen. | Prevents ambiguous empty messaging and keeps the drawer useful during narrow searches. | The current route exposes distinct selected-empty and search-empty copy, and the selected stack remains available while the option list is filtered. | `approved` | Preserve honest empty states. |
| `DS-009` | The seam must keep its two approved density variants: a descriptive default variant and a compact attribute-card variant with intentionally reduced secondary treatment. | Prevents the child extraction from flattening the reviewed variants into one generic middle ground. | The `workspace collections` drawer uses descriptive copy while the `tenant segments` drawer keeps the compact attribute-card posture. | `approved` | Keep the approved rich and compact variants distinct. |
| `DS-010` | The seam participates in the parent form's overlay ownership model: opening one drawer-select instance closes another active drawer-select instance and should not redefine broader page-level overlay rules that remain parent-owned. | Keeps the seam compatible with the host form without silently taking ownership of all overlay policy. | The runtime closes any previously active drawer-select before opening another instance, while broader cross-overlay closure rules remain governed by the parent lock. | `approved` | Own the drawer behavior, not the whole page's overlay policy. |
| `DS-011` | Passive outside-click dismissal must close the open drawer without stealing focus away from the outside target that caused the dismissal; only owned close paths such as the close button or `Escape` should restore focus to the trigger. | Preserves real authoring continuity and prevents a future extraction from over-correcting focus back to the trigger after every dismissal path. | The current runtime closes on outside click through the document listener, but only owned close paths call `closeDrawer(..., { restoreFocus: true })`. | `approved` | Keep passive dismissal distinct from owned close behavior. |
| `DS-012` | Opening `Drawer Select` must participate in the host form's overlay arbitration by requesting unrelated open form overlays to close before the drawer becomes active, while the broader overlay policy itself remains parent-owned. | Makes the seam's integration boundary explicit without transferring page-level overlay ownership out of the parent template. | `openDrawer()` calls `closeUnrelatedFormSurfaces({ preservedRoots: [root] })` before opening the drawer, so select, date, and standalone time surfaces do not remain open underneath it. | `approved` | Participate in host overlay cleanup without redefining the host's policy. |
| `DS-013` | Reopening the drawer must reset the previous search term so each entry starts from the full `Available` stack rather than inheriting a stale filtered subset from the last session. | Prevents accidental carryover that can make the seam feel half-empty or misleading on the next open. | The child runtime now clears the search input on open and re-renders the drawer before focus moves back into search. | `approved` | Search should not persist across reopen. |

## Exit Criteria For This Step

This behavior lock step is complete when the child seam rules above are stable
enough to guide:

- the child reference pack
- the first `DSR-*` canonical batch
- the child verification checklist

Do not treat the dedicated `Drawer Select` seam as signed off for wider
adoption until those downstream artifacts exist and stay aligned with these
approved behaviors.
