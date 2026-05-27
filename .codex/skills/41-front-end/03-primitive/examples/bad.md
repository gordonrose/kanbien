# Bad PrimitiveDefinitionArtifact Example

This is bad because it defines a button primitive by inventing unsigned token
values and component behavior at the same time.

> Create a 32px purple rounded icon button with hover, disabled, tooltip, and
> loading states. Apps can copy this HTML and use `.iconButton` until the shared
> module exists.

Problems:

- Consumes missing `icon-size`, `minimum-target-size`, `focus-ring`,
  `border-radius`, `text-color`, and state tokens as if templates were signed
  token seams.
- Hard-codes visual values in the primitive layer.
- Combines icon button, tooltip, and loading behavior before their boundaries
  are governed.
- Allows app-local copied markup instead of a public primitive boundary.
- Omits role, accessible name, keyboard activation, focus visibility, and
  disabled behavior.
- Lets color and appearance drive behavior instead of preserving behavior
  across design-system skins.
- Treats a likely component or pattern concern as a primitive without proving
  the smaller low-level responsibility.

## Bad Example: Unsigned Current Marker

This is bad because it satisfies a real accessibility requirement by inventing
a local visual marker in the primitive layer.

> The current index item renders a vertical bar beside the label so current
> state is not color-only.

Problems:

- The primitive owns current semantics, but the bar's shape, size, placement,
  thickness, radius, and color source are visual token decisions.
- The artifact does not name a signed Layer 2 token dependency for the current
  marker.
- A future design-system skin could not switch the marker predictably because
  the affordance is hidden in primitive CSS.
- The correct boundary is to route back to Layer 2 for an
  `index-nav-item-current-indicator` or equivalent token, then consume that
  signed seam from the primitive.

## Bad Example: Unsigned Supporting Text

This is bad because it renders a second text role without a signed text-style
token.

> The primitive shows a label and a smaller "3 items" line using local
> `font-size`, `font-weight`, and `opacity`.

Problems:

- The supporting line is a distinct visible text role from the primary label.
- Local typography values make later design-system skins drift from the shared
  primitive contract.
- Opacity changes text contrast and must be governed by a token or avoided.
- The correct boundary is to route back to Layer 2 for a supporting-text-style
  token or remove the supporting line until that token exists.

## Bad Example: Tooltip Without Truncation

This is bad because it turns tooltip behavior into a default hover effect
instead of measured text-disclosure behavior.

> Always show a tooltip for index item labels so long labels are easy to read.

Problems:

- The tooltip trigger is only justified when text is actually truncated or
  otherwise unavailable.
- `aria-describedby` must not point to tooltip content that is not relevant to
  the rendered state.
- The primitive must prove both fitting text and truncated text cases.
- The correct boundary is overflow-gated tooltip behavior in the primitive
  controller with focused browser evidence.

## Bad Example: Skipped Panel Header Primitive

This is bad because a pattern renders a low-level structural control locally.

> The index-nav panel pattern can render `<header><h3>Primary index</h3><button
> type="button">+</button></header>` directly because the header is small.

Problems:

- The header has stable primitive behavior: semantic header, fixed height,
  min/max height, sticky top, title truncation, and action alignment.
- The add action is an interactive affordance and must be a governed primitive.
- The pattern would own primitive semantics and visual CSS locally.
- The correct boundary is a signed header-frame token plus an
  `index-nav-panel-header-control` primitive consumed by the pattern.

## Bad Example: Primitive Custom Scrollbar

This is bad because a primitive applies custom scrollbar styling without a
signed scrollbar token.

> Make the primitive scroll area use a thin accent-colored scrollbar so it
> matches the page shell.

Problems:

- Custom scrollbar appearance is not browser-native.
- The primitive cannot invent scrollbar width, thumb color, track color, or
  radius locally.
- If scrollbar styling matters, Layer 2 must sign the values and Layer 3 must
  define the primitive behavior before later layers consume it.
