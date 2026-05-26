# Layer 2 Readiness Checkpoint

## Purpose

This checkpoint summarizes which governed Layer 2 token seams are currently
safe for Layer 3 primitive work in the `default` design system.

It is not a new token contract. It is a review aid for preventing primitive
work from treating source-only, visual-only, or state-neutral tokens as broader
permission than they actually grant.

## Current Scope

| Field | Value |
| --- | --- |
| Harness layer | `02-token` |
| System key | `default` |
| Readiness index | `docs/design-system/02-token/token-readiness-index.md` |
| Primary upstream behavior rule | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Checkpoint status | `review-ready` |

## Consumable Token Seams

| Token seam | Layer 3 consumption posture | Rendered proof | Notes |
| --- | --- | --- | --- |
| `background-color` | Allowed for neutral page and surface foundations. | `/design-system/default/tokens/background-color` | Does not consume `primary-color-source`; primary-tinted use belongs to derived tokens. |
| `focus-ring` | Allowed for visible focus styling when primitive behavior owns focus semantics. | `/design-system/default/tokens/focus-ring` | Derived from `primary-color-source` by theme; not selected or validation meaning. |
| `label-text-style` | Allowed for short-label typography when behavior owns truncation and disclosure semantics. | `/design-system/default/tokens/label-text-style` | Governs font family, size, weight, line height, letter spacing, and transform as one style; not color, tooltip behavior, or body text. |
| `minimum-target-size` | Allowed for primitive hit-area and target-size review. | `/design-system/default/tokens/minimum-target-size` | Governs minimum interaction target size, not final visual size. |
| `primary-color-source` | Allowed as a source dependency for derived color tokens. | `/design-system/default/tokens/primary-color-source` | Source-only; not enough for text, focus, selected, or state meaning by itself. |
| `primary-tinted-background` | Allowed for low-emphasis primary-tinted surfaces. | `/design-system/default/tokens/primary-tinted-background` | Text-bearing use should pair with `primary-tinted-foreground`. Not selected or status meaning. |
| `primary-tinted-foreground` | Allowed for short primary labels on `primary-tinted-background`. | `/design-system/default/tokens/primary-tinted-foreground` | Scoped foreground pairing; not general body text, link, selected, or status meaning. |
| `tooltip-surface` | Allowed for visual values of text-overflow disclosure surfaces. | `/design-system/default/tokens/tooltip-surface` | Governs surface, foreground, border, shadow, radius, padding, max width, z-index, and motion; not trigger behavior, placement, dismissal, or ARIA. |
| `tooltip-text-style` | Allowed for typography inside tooltip disclosure surfaces. | `/design-system/default/tokens/tooltip-text-style` | Governs disclosure text typography and fallback stack; pair with `tooltip-surface` foreground/background. |

## Source And Derivation Chain

| Chain | Current status | Review rule |
| --- | --- | --- |
| `primary-color-source` | Review-ready source token. | Rendered proof exposes temporary HEX override without mutating signed values. |
| `primary-color-source` -> `focus-ring` | Review-ready derived focus value. | Proof must show the source token and derived ring value by theme. |
| `primary-color-source` -> `primary-tinted-background` | Review-ready derived tint. | Proof must show the source token, tint formula, final rendered tint, and diagnostic override. |
| `primary-color-source` -> `primary-tinted-background` -> `primary-tinted-foreground` | Review-ready paired foreground. | Proof must show source, background pairing, formulas, final rendered sample, and diagnostic override. |

## Safe For First Primitive Work

The current token set is enough to start a narrow primitive that needs:

- neutral or primary-tinted background surfaces
- visible focus ring
- minimum target size
- short-label typography
- short primary foreground text on primary-tinted background
- tooltip/disclosure surface visuals for full-text disclosure
- tooltip/disclosure text typography with a governed font fallback stack

The current token set is not enough for primitives that need:

- general text color
- general body, heading, helper, error, or link typography
- border color
- spacing, gap, padding, margin, or sizing beyond minimum target size
- selected, active, disabled, loading, warning, error, success, or validation states
- tooltip trigger behavior, placement, dismissal, ARIA, or copy/select behavior
- icon sizing or icon color

## Primitive Guardrails

Layer 3 primitives may consume these tokens only through governed Layer 2
runtime seams under `src/frontend/designSystem/layers/02-token/`.

Layer 3 primitives must not:

- copy proof-route CSS or route-local markup
- treat `primary-color-source` as a direct foreground, background, or state color
- treat `primary-tinted-background` as selected, active, warning, error,
  success, validation, or link meaning
- use `primary-tinted-foreground` on unapproved backgrounds
- treat `label-text-style` as truncation, tooltip, body text, status text, or foreground-color approval
- treat `tooltip-surface` as tooltip trigger behavior, placement logic, dismissal behavior, ARIA semantics, or menu/popover/dialog approval
- treat `tooltip-text-style` as compact label text, body text, status text, error text, or tooltip behavior approval
- invent missing spacing, border, non-label typography, icon, or semantic-state values

## Remaining Layer 2 Gaps

| Gap | Why it matters before broader primitive work |
| --- | --- |
| `border-color` | Needed for buttons, fields, panels, cards, and separators without local border literals. |
| `spacing`, `gap`, `padding`, `sizing` | Needed for primitive geometry beyond minimum target size. |
| general `text-color` | Needed for normal labels, headings, helper text, and body text outside primary-tinted surfaces. |
| broader typography styles | Needed for body text, headings, helper text, error text, links, code, and dense data text. |
| `disabled-state`, selected/active state, and semantic state tokens | Needed before selectable items, form controls, validation, and status-bearing primitives. |
| tooltip/disclosure primitive behavior | Needed before truncation disclosure can be called governed for hover, focus, touch, keyboard, dismissal, placement, and semantics. |
| broader `z-index-layering`, surface, shadow, and motion tokens | Needed before menu, popover, drawer, dialog, or overlay primitives. |
| `icon-size` and icon color/token pairing | Needed before governed icon button and icon-bearing primitives. |

## Rendered Evidence Rule

For every future derived token, the rendered proof must show:

- upstream token id or name
- upstream value
- formula or mapping
- final rendered value
- what changes when the upstream value changes
- diagnostic override behavior, when applicable
- proof that signed token values do not mutate during diagnostic review

This rule is now part of the Layer 2 harness in
`.codex/skills/41-front-end/02-token/`.

## Next Recommended Move

Start Layer 3 with a small primitive whose required tokens are already covered,
or add the next missing Layer 2 token if the primitive needs selection,
borders, icon styling, or broader spacing.

Good candidates:

- `truncating text label` primitive that consumes `label-text-style` and
  `tooltip-surface` plus `tooltip-text-style`, while owning full-text access behavior
- `focusable control shell` primitive, if it can avoid unsupported border and spacing decisions
- `button` only if we first add missing border, spacing, and state tokens

The safer first primitive is therefore a narrow label or label-like primitive,
not a full button. If the first label primitive shows full text on hover,
focus, touch, or keyboard command, Layer 3 must now prove the trigger,
placement, dismissal, and accessibility behavior instead of adding more local
visual values.
