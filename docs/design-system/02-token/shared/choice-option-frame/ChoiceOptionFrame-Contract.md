# Choice Option Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `choice-option-frame` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md`; `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/choice-option-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/choice-option-frame/ChoiceOptionFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/choice-option-frame/ChoiceOptionFrame-Implementation.md` |

## Purpose

This token governs the reusable visual frame for a selectable choice option, including radio options and card-list select options: background, foreground, border, radius, padding, internal text gap, and minimum block size.

It does not define radio semantics, checkbox semantics, card-select behavior, keyboard behavior, option labels, accessible names, focus rings, validation copy, or product values.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required states | `default`; `selected`; `disabled`; `error` |
| `shared contract` | Required themes | `original`; `dark`; `desert` |
| `shared contract` | Text style rule | Option label text must consume `label-text-style`; optional supporting text must consume `supporting-text-style`. |
| `shared contract` | Target-size rule | Option frames must preserve at least the signed `minimum-target-size` block size when consumed by interactive primitives. |
| `shared contract` | Selected-state source rule | Selected backgrounds and foregrounds must derive from signed primary tint tokens, not local CSS literals. |
| `shared contract` | Error-state rule | Error frame visuals may use the signed error text foreground as the error color source, but error meaning must also be semantic in the consuming primitive. |
| `shared contract` | Visual source rule | Consumers must import the governed runtime seam instead of recreating option frame values locally. |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/choice-option-frame/systems/default.mjs#choiceOptionFrameTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/choice-option-frame` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for radio simple select, card-list select, and future governed choice-option primitives. |
| `04-pattern-contract` | May select approved primitive variants; must not apply these frame values directly to local markup. |
| `app pages` | Denied; app pages must consume later governed primitives, patterns, or component seams. |

## Required Evidence

The proof route must show each state and theme, show dependency identities and formulas, and provide proof-only primary-colour and host-surface overrides that change derived previews without mutating signed token data.

## Consumer Restrictions

Consumers must not locally define choice-option background, foreground, border, radius, padding, gap, or minimum-height values when this token applies.

Consumers must not use this token as approval for radio behavior, accessible names, focus visibility, text truncation disclosure, group layout columns, validation behavior, or app adoption.
