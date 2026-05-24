# Dropdowns Token Verification Checklist

## Scope

- Surface: `/design-system/tokens/dropdowns`
- Status under review: active token route
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/dropdowns-token-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/dropdowns-token-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A simple dropdown is a compact single-select trigger with its label and
  selected value inside the button, plus an anchored listbox that stays inside
  its card and viewport across theme, direction, and narrow layouts.

## Rendered Verification

- Desktop open/selection behavior:
  `tests/visual/designSystem/canonicals/data-display/simpleDropdownToken.spec.ts`
- Mobile, dark, RTL, disabled, inside-trigger label, and long-value stress:
  `tests/visual/designSystem/canonicals/data-display/simpleDropdownToken.spec.ts`
- Route and compatibility aliases:
  `tests/integration/designSystem/route.test.ts`

## Known Limits

- Search, multi-select chips, drawer framing, modal semantics, and focus traps
  remain out of scope and belong to heavier select families.
