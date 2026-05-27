# Button Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `button-frame` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/button-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/button-frame/ButtonFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/button-frame/ButtonFrame-Implementation.md` |

## Purpose

This token governs reusable button frame visuals: background, foreground,
border, radius, padding, internal gap, and visual inset when the visible frame
must sit inside a larger interactive hit target.

It does not define button behavior, native semantics, accessible naming, icon
glyph size, focus visibility, target size, emitted events, or product actions.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required roles | `icon button frame`; `text action button frame` |
| `shared contract` | Required intents | `quiet`; `subtle` |
| `shared contract` | Required themes | `original`; `dark`; `desert` |
| `shared contract` | Host surface rule | `quiet` button frame background uses the signed host surface directly; `subtle` button frame background may use `primary-color-source` mixed over the signed host surface. |
| `shared contract` | Border rule | Button border values may be derived from `primary-color-source` mixed over a signed host surface, with the theme surface as the default fallback. |
| `shared contract` | Text sample rule | Rendered proof text must consume `label-text-style`; the frame token itself does not own typography. |
| `shared contract` | Icon visual inset rule | Icon-only button frames may define a visible-frame inset while preserving the `minimum-target-size` hit area in the consuming primitive. |
| `shared contract` | Visual source rule | Values must come from signed color and typography tokens or system implementation formulas, not downstream CSS literals. |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/button-frame` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for reusable icon-button and text-action button primitives. |
| `04-pattern-contract` | May select an approved primitive/token intent through a governed primitive; must not invent colour calculations locally. |
| `app pages` | Denied; app pages must consume later governed primitives, patterns, or component seams. |

## Required Evidence

The proof route must show each role and theme, show where the derived values
come from, and provide proof-only primary colour and host-surface overrides
that change the rendered frame preview without mutating signed token data.

## Consumer Restrictions

Consumers must not locally define button frame background, foreground, border,
radius, padding, gap, or visual inset values when this token applies.

Consumers must not treat this token as approval for keyboard behavior,
accessible names, focus rings, target size, or app actions.
