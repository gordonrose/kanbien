# Accordion Frame Token Contract

Status: `review-ready`

Layer: `02-token`

## Boundary

`accordion-frame` signs reusable visual, spacing, sizing, indicator, separator,
radius, and motion values for one accordion section.

It does not define expanded/collapsed semantics, native markup, keyboard
behavior, grouped accordion structure, nested form controls, validation,
persistence, workflow behavior, or app adoption.

## Required Upstream

| Source | Role |
| --- | --- |
| `docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md` | Governs disclosure behavior and accessibility promises. |
| `background-color` | Supplies theme-specific surface and foreground values. |
| `primary-tinted-background` | Supplies optional subtle tinted header backgrounds. |
| `primary-tinted-foreground` | Supplies the approved foreground pairing for tinted headers. |
| `minimum-target-size` | Supplies the minimum header interaction target. |
| `icon-size` | Supplies indicator dimensions. |
| `panel-corner-radius` | Supplies reusable flush panel radius. |

## Required Fields

Every design-system implementation must expose:

- frame role
- theme
- tone (`neutral` or `tinted`)
- header background and foreground
- content background and foreground
- border and separator values
- header minimum height
- header padding
- content padding
- section gap
- indicator inline and block size
- motion duration and easing

## Consumer Rules

Consumers must import the governed runtime seam instead of hard-coding
accordion header, content, separator, indicator, radius, or motion values.

Consumers must not use this token for dropdowns, cards, navigation items,
workflow steps, field rows, or app-local collapsible regions.

Layer 3 must still own accordion semantics, focus behavior, keyboard behavior,
state attributes, and event dispatch.

## Required Evidence

Rendered token proof must show neutral and tinted variants for original, dark,
and desert themes, plus source token identity, source values, formula or
mapping, and final rendered values.
