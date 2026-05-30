# Dropdown Listbox Frame Token Default Implementation

| Field | Value |
| --- | --- |
| Layer | `02-token` |
| Token type | `dropdown-listbox-frame` |
| System | `default` |
| Status | `review-ready` |
| Rendered view | `/design-system/default/tokens/dropdown-listbox-frame` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/dropdown-listbox-frame/systems/default.mjs#dropdownListboxFrameTokenSpec` |

The default implementation provides one popup frame variant per supported theme.

The listbox surface derives from signed background-color surface variants. The scrollbar values derive from the signed scrollbar-skin token. The max-height values are signed here so primitive CSS does not invent popup scroll sizing.

## Values

- Desktop max block size: `18rem`
- Mobile max block size: `min(70vh, 22rem)`
- Popup offset block: `0.25rem`
- Scroll behavior: internal block-axis scrolling when option content exceeds the signed max block size

## Required Evidence

- Rendered proof route shows the three theme variants and their dependency chain.
- Simple dropdown primitive consumes these values through the Layer 2 runtime seam.
- Browser proof confirms long option lists remain reachable without horizontal overflow.
