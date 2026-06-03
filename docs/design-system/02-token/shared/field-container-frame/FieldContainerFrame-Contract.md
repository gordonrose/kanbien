# Field Container Frame Token Contract

## Purpose

`field-container-frame` governs the outer frame around one complete governed field or field pattern.

It owns the field container surface, border, radius, padding, and size rails. It does not own the field label, helper text, native input frame, selector behavior, validation behavior, or product data.

## Upstream Gate

- Behavior rule: `docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md`
- Dependency: `body-region-frame`

## Contract

Every design system must expose one default field-container frame variant before a `field-container-control` primitive or form/body pattern may render reusable field boxes.

The shared value fields are:

- `frameRole`
- `backgroundValue`
- `foregroundValue`
- `borderValue`
- `radiusValue`
- `paddingBlockValue`
- `paddingInlineValue`
- `minBlockSize`
- `minInlineSize`
- `maxInlineSize`

## Consumer Rules

Consumers must import the governed runtime seam instead of hard-coding field-container surface, padding, border, radius, or sizing values.

Consumers must not use this token for native input frames, selectable option cards, body regions, panel shells, workflow builders, app-local form CSS, validation behavior, or product data.

Hosted field content must still consume its own governed primitive or pattern before being placed inside this frame.

## Rendered Proof

Rendered proof route: `/design-system/default/tokens/field-container-frame`
