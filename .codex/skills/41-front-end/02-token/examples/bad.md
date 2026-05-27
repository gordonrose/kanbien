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

## Bad Example: Pattern-Owned Header Separator

This is bad because a pattern adds a visual separator that should have been
signed as a token value.

> Add `border-bottom: 1px solid #dbe4f0` to the index panel header in the
> pattern CSS so the header is visually distinct from the list.

Problems:

- The separator color and width are token-layer visual values.
- The pattern is solving a primitive visual decision locally.
- A future design-system skin could not switch the separator predictably.
- The correct boundary is to route back to Layer 2 for a signed header-frame
  separator value, then consume it from the header primitive.

## Bad Example: Custom Scrollbar Without Token

This is bad because global or local CSS gives a governed pattern a scrollbar
skin before a scrollbar token exists.

> The page already has thin purple scrollbar styling, so the index-nav panel
> can inherit it.

Problems:

- Scrollbar skin is a visual token decision when it is custom.
- Inheritance can make an unsigned value look approved in rendered proof.
- The rendered proof cannot explain where the scrollbar appearance came from.
- The correct boundary is browser-native scrollbars, or a new Layer 2/3
  scrollbar slice before the pattern may use a custom skin.

## Bad Example: Hidden Dependency Formula

This is bad because a derived visual token renders correctly but hides its
source and formula from reviewers.

> The tinted background looks right on the token page; reviewers can inspect
> the source module if they need the formula.

Problems:

- Rendered proof must show the upstream token identity, upstream value,
  formula or mapping, and final rendered value.
- A reviewer should not need source inspection to understand a dependency
  chain.
- If changing the upstream value changes rendered output, the proof needs a
  proof-only diagnostic override and browser evidence.
