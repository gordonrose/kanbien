# Icon Button Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Primitive | `icon-button-control` |
| Harness layer | `03-primitive` |
| Status | `review-ready` |
| Shared contract path | `docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/icon-button-control/IconButtonControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs#iconButtonControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/icon-button-control` |

## Responsibility

`icon-button-control` owns one native icon-only button with a decorative glyph,
required accessible label, keyboard activation through native button behavior,
visible focus behavior, minimum target sizing, and a stable activation event.
The interactive target remains governed by `minimum-target-size`; the visible
button frame may be inset when the signed `button-frame` token says so.

It does not create records, navigate routes, choose panel placement, define
icon artwork, or own app adoption.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `button-frame` | `src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec` |
| `icon-size` | `src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs#iconSizeTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Variant Selection

Consumers may choose a signed `button-frame` intent through the primitive.
Supported intents are `quiet` and `subtle`.

Patterns may select the intent that fits their composition, such as a quiet
icon button in a dense panel header. Patterns must not invent their own colour
calculation or local frame values.

Supported decorative glyph names are `plus`, `close`, and `list`. These names
are semantic primitive choices, not shared artwork. The selected design-system
implementation supplies the actual glyph drawing through its glyph registry.
For the default system, that registry is
`src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs#defaultGlyphRegistry`.

The glyph never provides the accessible name; consumers must still provide the
action label.

## Behavior And Accessibility Contract

The primitive renders a native `button` with `type="button"`.

The visible SVG is decorative and must use `aria-hidden="true"`. Consumers must
provide a non-empty accessible label.

Activation dispatches `icon-button-control:activate` with the configured value
and id. The primitive does not define what the consuming pattern or component
does with that activation.

## Consumer Restrictions

Consumers must not recreate icon-button markup, ARIA behavior, focus behavior,
target sizing, visible frame inset, glyph sizing, button-frame values, or
activation events locally.

Consumers must not embed SVG path data or other glyph artwork in pattern,
component, demo, canonical, or app code. Later layers choose semantic glyph
names; the selected design system resolves the artwork.
