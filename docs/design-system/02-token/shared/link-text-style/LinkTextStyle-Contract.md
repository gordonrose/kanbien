# Link Text Style Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Token type | `link-text-style` |
| Harness layer | `02-token` |
| Contract scope | `shared across design systems` |
| Status | `review-ready` |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md` |

## Responsibility

`link-text-style` owns the visible text style and foreground values for
standalone governed text links.

It does not own underline geometry, focus rings, target sizing, destination
selection, route authorization, or app placement.

## Required Fields

| Field | Meaning |
| --- | --- |
| `linkRole` | The link text role being styled. |
| `fontFamilyValue` | Font family stack. |
| `fontSizeValue` | Font size. |
| `fontWeightValue` | Font weight. |
| `lineHeightValue` | Line height. |
| `letterSpacingValue` | Letter spacing. |
| `textTransform` | Text transform. |
| `foregroundValue` | Default text color. |
| `hoverForegroundValue` | Hover/focus text color. |
| `layoutContext` | Approved consumer context. |

## Consumer Rules

Consumers must use this token through a governed runtime seam.

Consumers must not copy the literal foreground, font weight, or hover color
into route-local, app-local, or proof-only CSS.

This token does not prove the link is accessible by itself. Link primitives
must pair it with signed decoration and focus tokens.
