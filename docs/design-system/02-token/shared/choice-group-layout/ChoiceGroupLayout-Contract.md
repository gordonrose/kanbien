# Choice Group Layout Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `choice-group-layout` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md`; `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/choice-group-layout` |
| Shared token contract path | `docs/design-system/02-token/shared/choice-group-layout/ChoiceGroupLayout-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/choice-group-layout/ChoiceGroupLayout-Implementation.md` |

## Purpose

This token governs reusable choice-group grid layout values for one, two, three, and four column option groups, including radio simple select and card-list select.

It does not define radio behavior, option frame visuals, native inputs, text truncation, selected state, validation, or product values.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required column counts | `1`; `2`; `3`; `4` |
| `shared contract` | Layout role | The token controls group grid columns, row gap, column gap, and the option collapse threshold. |
| `shared contract` | Responsive rule | Later primitives may collapse to fewer columns under constrained width, but they must use this token as the source of the approved requested column counts and collapse threshold. |
| `shared contract` | Overflow rule | Layout values must not allow options to overlap; text overflow remains governed by text-overflow disclosure. |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/choice-group-layout/systems/default.mjs#choiceGroupLayoutTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/choice-group-layout` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token to render approved radio simple select and card-list select column variants. |
| `04-pattern-contract` | May compose primitives that already consume this token; must not invent local grid values. |
| `app pages` | Denied; app pages must consume later governed primitives, patterns, or component seams. |

## Required Evidence

The proof route must show 1, 2, 3, and 4 column variants, including mobile width evidence that the rendered proof does not create horizontal overflow.

## Consumer Restrictions

Consumers must not hard-code choice-grid column templates, row gaps, column gaps, or collapse thresholds when this token applies.

Consumers must not use this token as approval for option frame visuals, radio semantics, selected value behavior, focus behavior, or text disclosure.
