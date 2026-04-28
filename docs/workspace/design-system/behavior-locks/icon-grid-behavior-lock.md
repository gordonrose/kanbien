# Icon Grid Behavior Lock

## Purpose

Lock the behavioral rules for the `Icon Grid` child seam extracted from the
signed-off `Form Template` parent.

This artifact stays intentionally narrower than the parent template lock. It
inherits parent field framing from `form-template` and governs only the child
seam's trigger, searchable modal, governed icon library, selection, and focus
behavior.

Parent page rules stay governed by:

- `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`

## Scope

- Family:
  `icon-grid`
- Current source surface:
  `/design-system/components/icon-grid`
- Canonical launcher:
  `/design-system/canonicals/icon-grid`
- Parent host contract:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related downstream artifacts:
  `docs/workspace/design-system/reference-packs/icon-grid-reference-pack.md`
  `docs/workspace/design-system/verification/icon-grid-verification-checklist.md`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `IG-001` | `Icon Grid` must remain a field-level child seam with its own direct render and canonical routes, while still inheriting the signed-off `Form Template` field-tile shell instead of redefining section layout or page rhythm. | Keeps the seam reusable without absorbing parent ownership while still giving it a proper review surface. | The current route now renders the picker directly on `/design-system/components/icon-grid` and preserves the same parent-owned `.form-field` tile shell when hosted in the form template. | `approved` | Treat this as a field-level child seam. |
| `IG-002` | The resting surface must remain a single trigger that shows the current governed icon and its human-readable label. | Keeps the seam calm and truthful before the modal opens. | The trigger shows one selected icon glyph plus a label sourced from the approved in-repo icon catalog. | `approved` | Keep the collapsed state simple. |
| `IG-003` | Opening the seam must reveal a compact searchable modal rather than a full drawer or an anchored listbox. | Preserves the reviewed size and interaction boundary between simple-select and drawer-select. | The current picker opens a centered modal panel with search, copy, and the icon grid. | `approved` | This should feel like a small modal. |
| `IG-004` | Search must filter the approved design-system icon library without changing the underlying library source. | Ensures the seam is searchable while staying tied to the governed icon set already used by the design system. | The runtime now filters the fuller in-repo icon catalog by key, label, and aliases instead of the earlier starter subset. | `approved` | Search the same library the system already uses. |
| `IG-005` | Dense icon-grid tiles may hide visible labels to preserve scan density, but each tile must still expose its name through hover and keyboard-focus tooltip behavior plus an accessible button label. | Lets the seam scale to a larger icon set without turning the modal into a text-heavy wall while keeping naming discoverable. | The current grid now uses shared tooltip labels and `aria-label` on each icon button rather than permanently visible text under every tile. | `approved` | Tooltips are okay if names stay discoverable and accessible. |
| `IG-006` | Selecting an icon must update the hidden value, trigger glyph, and trigger label together, then close the modal and return focus to the trigger. | Keeps the seam trustworthy and keyboard-recoverable. | Choosing an option updates the field value, re-renders the closed trigger state, and restores focus to the launcher. | `approved` | Selection should feel immediate and tidy. |
| `IG-007` | Opening the icon-grid modal must participate in the host form’s overlay arbitration by closing unrelated open form overlays first. | Prevents the form from stacking lightweight overlays and modal surfaces together. | `openIconGrid()` calls `closeUnrelatedFormSurfaces({ preservedRoots: [root] })` before the modal opens. | `approved` | Keep it aligned with the other form-owned overlays. |
| `IG-008` | While open, keyboard focus must stay contained inside the modal, and `Escape` must close the modal and return focus to the trigger. | Preserves modal semantics and predictable keyboard recovery. | The runtime traps `Tab` inside the active modal and uses owned `Escape` dismissal to restore trigger focus. | `approved` | Modal keyboard behavior should be explicit. |

## Exit Criteria For This Step

This behavior lock step is complete when the child seam rules above are stable
enough to guide:

- the child reference pack
- the dedicated canonical launcher and render surface
- the browser verification pass on both the direct child route and the parent host
