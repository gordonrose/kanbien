# Link Decoration Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Token type | `link-decoration` |
| Harness layer | `02-token` |
| Contract scope | `shared across design systems` |
| Status | `review-ready` |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md` |

## Responsibility

`link-decoration` owns the non-color visual affordance for standalone governed
text links: underline presence, thickness, offset, and hover/focus persistence.

It does not own text color, font styling, focus ring, target sizing,
destination selection, route authorization, or app placement.

## Required Fields

| Field | Meaning |
| --- | --- |
| `decorationRole` | The link decoration role being styled. |
| `textDecorationLineValue` | Default decoration line. |
| `textDecorationThicknessValue` | Default decoration thickness. |
| `textUnderlineOffsetValue` | Default underline offset. |
| `hoverTextDecorationLineValue` | Hover/focus decoration line. |
| `colorIndependentMeaningRule` | How link meaning is exposed without color alone. |
| `layoutContext` | Approved consumer context. |

## Consumer Rules

Consumers must use this token through a governed runtime seam.

Consumers must not copy underline thickness, offset, or hover decoration into
route-local, app-local, or proof-only CSS.

This token does not prove link keyboard behavior by itself. Link primitives
must pair it with native anchor semantics and signed focus tokens.
