# Dropdown Trigger Frame Token Contract

| Field | Value |
| --- | --- |
| Layer | `02-token` |
| Token type | `dropdown-trigger-frame` |
| Status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/simple-dropdown/SimpleDropdown-Behaviour.md` |
| Rendered view | `/design-system/default/tokens/dropdown-trigger-frame` |

## Purpose

`dropdown-trigger-frame` governs reusable visual frame values for simple dropdown triggers.

It defines trigger background, foreground, border, radius, padding, and minimum block size for default, open, disabled, and error states across supported themes.

It does not define listbox semantics, option behavior, keyboard behavior, popup positioning, glyphs, product values, validation copy, or app adoption.

## Consumer Rules

- Layer 3 dropdown primitives may consume this token for trigger frame visuals.
- Consumers must pair this token with focus-ring, minimum-target-size, field-value text, label text, and tooltip disclosure tokens as needed.
- Consumers must not reuse text-control-frame for dropdown triggers.
- Consumers must not hard-code dropdown trigger colors, borders, radius, padding, or minimum height locally when this token applies.

## Required Evidence

- The default system proof must show each state.
- The primitive proof must show that changing theme affects the closed trigger, open trigger, listbox, and options consistently.
- If the token depends on upstream primary or surface tokens, the proof must expose the upstream source and formula.
- Later layers may consume this token only from the governed runtime seam, not from route-local CSS or prose.
