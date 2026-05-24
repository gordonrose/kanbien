# Dropdowns Token Reference Pack

## Quality Gate Profile

- Complexity: `standard`
- Promotion target: `system-ready`
- Canonical rendering posture: approved token-route canonical rendering exception.
- Reference source: `/design-system/tokens/dropdowns`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Desktop token grid and narrow mobile stack |
| theme | Normal, dark, and desert preview cards |
| direction | RTL state row |
| magnification | Narrow mobile route checked with `zoom=100` |
| anatomy | Small uppercase label and selected value live inside the trigger button |
| overflow | Long selected value clips inside the trigger |
| interaction | Trigger open, option selection, hidden value sync |
| accessibility | `aria-haspopup`, `aria-expanded`, listbox, option, selected state |
| disabled | Disabled trigger is visibly and programmatically non-interactive |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `DDT-R-001` | `/design-system/tokens/dropdowns` | Normal resting dropdown |
| `DDT-R-002` | `/design-system/tokens/dropdowns` | Dark themed dropdown |
| `DDT-R-003` | `/design-system/tokens/dropdowns` | Desert themed dropdown |
| `DDT-R-004` | `/design-system/tokens/dropdowns` | Open anchored listbox |
| `DDT-R-005` | `/design-system/tokens/dropdowns` | Disabled dropdown |
| `DDT-R-006` | `/design-system/tokens/dropdowns` | Long selected-value overflow state |
| `DDT-R-007` | `/design-system/tokens/dropdowns` | RTL dropdown |
| `DDT-R-008` | `/design-system/tokens/dropdowns?theme=dark&dir=rtl&zoom=100` | Mobile magnified stress |

## Evidence

- `tests/visual/designSystem/canonicals/data-display/simpleDropdownToken.spec.ts`
- `tests/integration/designSystem/route.test.ts`
