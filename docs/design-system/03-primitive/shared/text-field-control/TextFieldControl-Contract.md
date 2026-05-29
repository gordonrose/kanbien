# Text Field Control Primitive Contract

## Purpose

`text-field-control` is the governed single-line text input primitive.

It composes `field-row-control` for label/helper/error structure, consumes text-entry tokens for the native input frame and value typography, and preserves native input behavior.

## Upstream Gates

- Behavior rule: `docs/design-system/01-behavior-rule/shared/text-entry-control/TextEntryControl-Behaviour.md`
- Primitive dependency: `field-row-control`
- Tokens: `text-control-frame`, `field-value-text-style`, `focus-ring`, `minimum-target-size`

## Behavior Contract

The primitive renders a native `<input type="text">` inside a governed field row.

It supports `default`, `required`, `read-only`, `disabled`, and `error` states.

Each state must consume the matching `text-control-frame` state variant for background, foreground, and border values. The primitive must not locally color error, disabled, read-only, required, or default states.

The primitive must reject unsupported states.

The primitive emits normal browser input events only; product-specific persistence and validation remain downstream.

## Accessibility Contract

The input must reference the field-row label and description IDs.

`required`, `readonly`, `disabled`, and invalid states must use native or ARIA semantics where appropriate.

Keyboard focus must remain native and must use the signed focus-ring token.

## Consumer Boundary

Consumers may provide `name`, `value`, and `placeholder` strings.

Consumers must not reconstruct the input frame, label wiring, focus behavior, or state attributes locally.
