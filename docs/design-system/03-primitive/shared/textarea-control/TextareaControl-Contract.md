# Textarea Control Primitive Contract

## Purpose

`textarea-control` is the governed multi-line text entry primitive.

It composes `field-row-control`, consumes text-entry frame and value tokens, and applies signed `textarea-growth` variants.

## Upstream Gates

- Behavior rule: `docs/design-system/01-behavior-rule/shared/text-entry-control/TextEntryControl-Behaviour.md`
- Primitive dependency: `field-row-control`
- Tokens: `text-control-frame`, `field-value-text-style`, `textarea-growth`, `focus-ring`, `minimum-target-size`

## Behavior Contract

The primitive renders a native `<textarea>`.

It supports `default`, `required`, `read-only`, `disabled`, and `error` states.

Each state must consume the matching `text-control-frame` state variant for background, foreground, and border values. The primitive must not locally color error, disabled, read-only, required, or default states.

It supports `one-line`, `multi-line`, and `paragraph` growth variants.

The primitive may auto-grow vertically until the signed maximum viewport-height cap for the selected growth variant.

The primitive must reject unsupported states or growth variants.

Long labels must use the composed `field-row-control` truncation and disclosure
behavior. The textarea primitive must not introduce a second tooltip or local
text-overflow rule.

## Accessibility Contract

The textarea must reference the field-row label and description IDs.

Required, read-only, disabled, and invalid states must use native or ARIA semantics where appropriate.

Keyboard focus must remain native and must use the signed focus-ring token.

## Consumer Boundary

Consumers may provide `name`, `value`, and `placeholder` strings.

Consumers must not reconstruct textarea frame, typography, growth caps, label wiring, focus behavior, or state attributes locally.

Consumers must not override textarea row counts, max-height caps, resize
posture, or overflow behavior outside the signed `textarea-growth` token and
the governed primitive seam.
