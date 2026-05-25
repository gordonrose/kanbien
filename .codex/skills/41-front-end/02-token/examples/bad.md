# Bad TokenDefinitionArtifact Example

This is bad because it skips inventory, defines component styling, and lets
color carry meaning by itself.

> Use `--button-success: #00ff00`; make all success buttons green and put them
> in a two-column card grid on the demo route.

Problems:

- Defines a route or component-specific token instead of a reusable token.
- Uses a raw value without checking the existing token inventory.
- Omits the required `tokenDefinitionV1` JSON block.
- Omits the `/design-system/default/tokens/` page route.
- Omits the reusable token spec and renderer seam.
- Omits per-variant preview, metadata, and use-case instructions.
- Defines button behavior and layout before primitive and pattern layers.
- Relies on color alone to communicate success.
- Provides no theme, contrast, magnification, or consumer evidence.
