# Feedback Text Style Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `feedback-message` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/feedback-text-style` |
| Shared token contract path | `docs/design-system/02-token/shared/feedback-text-style/FeedbackTextStyle-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/feedback-text-style/FeedbackTextStyle-Implementation.md` |

## Purpose

This token governs short non-field feedback text used by governed primitives or
patterns, such as loading, empty, no-match, warning, or error messages inside a
panel.

It does not define product copy, live-region semantics, validation behavior,
icons, empty-state layout, helper text, field-row errors, tooltip text, labels,
option supporting text, or body paragraphs.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `feedback text` |
| `shared contract` | Required tones | `neutral`; `warning`; `error` |
| `shared contract` | Required themes | `original`; `dark`; `desert` |
| `shared contract` | Overflow posture | Short feedback text may wrap; truncation needs a later disclosure decision. |
| `shared contract` | Foreground source rule | Foreground must come from a signed theme or status token, not a local literal in the consumer. |
| `system implementation` | Font family | Inter with system UI fallbacks |
| `system implementation` | Font size | `0.875rem` |
| `system implementation` | Neutral weight | `700` |
| `system implementation` | Warning and error weight | `800` |
| `system implementation` | Line height | `1.35` |
| `system implementation` | Letter spacing | `0` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/feedback-text-style/systems/default.mjs#feedbackTextStyleTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/feedback-text-style` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for short non-field feedback text when the primitive owns that message surface. |
| `04-pattern-contract` | May consume this token directly for pattern-owned feedback/status messages. |
| `app pages` | Denied; app pages must consume later governed primitives or patterns. |

## Required Evidence

The proof route must render neutral, warning, and error tones across supported
themes. It must show the source token, source value, mapping, final rendered
value, font fallback stack, and overflow posture for each variant.

## Consumer Restrictions

Consumers must not locally style short non-field feedback text with font,
weight, line-height, letter-spacing, transform, foreground colour, opacity, or
theme literals.
