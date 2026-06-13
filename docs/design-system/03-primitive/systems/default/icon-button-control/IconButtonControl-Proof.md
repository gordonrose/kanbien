# Icon Button Control Default Proof

The `default` design system renders `icon-button-control` at:

`/design-system/default/primitives/icon-button-control`

The proof must show native button semantics, decorative icon behavior,
accessible label behavior, signed token dependencies, focus visibility, and
activation event logging.

Glyph artwork is resolved through the default system registry at
`src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs#defaultGlyphRegistry`;
the shared primitive owns only the semantic glyph names and button behavior.
The proof includes the signpost semantic glyph used by compact breadcrumb menu
triggers.
