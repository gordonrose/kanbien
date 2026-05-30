# Dropdown Listbox Frame Token Contract

| Field | Value |
| --- | --- |
| Layer | `02-token` |
| Token type | `dropdown-listbox-frame` |
| Scope | shared |
| Status | `review-ready` |
| Rendered view | `/design-system/default/tokens/dropdown-listbox-frame` |

`dropdown-listbox-frame` governs the popup/listbox frame values for simple dropdown controls.

It exists because popup sizing, offset, scroll reachability, surface, border, padding, and scrollbar skin are runtime visual decisions. They must not be invented inside the primitive CSS.

## Roles

- `listbox popup frame`: popup surface, border, padding, offset, max height, and internal scroll posture for a short single-select dropdown listbox.

## Required Fields

- `frameRole`
- `theme`
- `backgroundValue`
- `foregroundValue`
- `borderValue`
- `radiusValue`
- `paddingBlockValue`
- `paddingInlineValue`
- `gapValue`
- `popupOffsetBlock`
- `desktopMaxBlockSize`
- `mobileMaxBlockSize`
- `scrollBehavior`
- `scrollbarSkinTokenName`

## Consumer Rules

- Consumers must use this token for governed simple dropdown listbox popup frame values.
- Consumers must not hard-code dropdown popup max height, popup offset, internal scroll styling, or listbox surface values in primitive or pattern CSS.
- This token does not define option semantics, keyboard behavior, selection state, search, multi-select, or popup placement beyond the simple dropdown below-trigger posture.

## Evidence

- The rendered token proof must show original, dark, and desert popup frame variants.
- The primitive proof must verify that desktop and mobile popup max-height values are consumed and that overflow remains reachable.
- The primitive proof must verify that theme selection updates trigger, listbox, and options consistently.
