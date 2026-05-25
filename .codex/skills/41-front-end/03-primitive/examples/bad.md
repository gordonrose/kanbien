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
