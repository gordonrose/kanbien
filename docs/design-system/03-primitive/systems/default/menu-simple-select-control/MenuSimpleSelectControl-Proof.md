# Menu Simple Select Control Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| System key | `default` |
| Primitive | `menu-simple-select-control` |
| Shared contract | `docs/design-system/03-primitive/shared/menu-simple-select-control/MenuSimpleSelectControl-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs#menuSimpleSelectControlPrimitive` |
| Rendered proof route | `/design-system/default/primitives/menu-simple-select-control` |
| Proof status | `review-ready` |

## Proof Scope

The default proof renders text-trigger, square icon-trigger, disabled, and
empty menu-simple-select states. Icon-trigger states may use semantic filter
or sort glyphs from the default glyph registry. The default state uses representative
entity-header layer options so the trigger, anchored panel, current option,
and option metadata can be reviewed before a Layer 4 header pattern consumes
the primitive.

The proof exposes review controls for original/dark/desert theme, LTR/RTL
direction, and desktop/mobile constrained width.

At mobile constrained widths, the opened option menu may become a
full-viewport sheet with an explicit close button. The close button belongs to
the sheet header; the actual options remain inside the `role="listbox"`
element.

## Token Evidence

| Dependency | Evidence |
| --- | --- |
| `menu-simple-select-frame` | Runtime seam maps text trigger, icon trigger, panel, option, current, and disabled frame values into primitive CSS variables. |
| `label-text-style` | Runtime seam maps trigger value and option label text. |
| `supporting-text-style` | Runtime seam maps uppercase trigger label, option eyebrow, and trailing label text. |
| `focus-ring` | Runtime seam maps focus outline and offset. |
| `minimum-target-size` | Runtime seam maps trigger minimum block size. |

## Accessibility Evidence

The proof exposes a named trigger with `aria-haspopup="listbox"`,
`aria-expanded`, and `aria-controls`. Options use `role="option"` and
`aria-selected`; disabled options use disabled semantics when present. The
controller owns keyboard open, traversal, selection, and Escape dismissal.

The trigger chevron uses the frame token's icon foreground and rotates from
down to up when `aria-expanded` becomes `true`. The square icon-only trigger
preserves the same accessible label/current-value announcement as the text
trigger while allowing the consuming pattern to choose a governed semantic
trigger glyph.

## Consumer Boundary

Later layers must import the runtime seam. They must not copy proof route
markup, legacy simple-select markup, dropdown route CSS, or controller logic.

## Verification Notes

Focused unit tests cover the primitive contract and rendered markup. Browser
verification checks uppercase muted trigger label text, green chevron
foreground, rotation on open, slot containment, and visible anchored menu
placement.
