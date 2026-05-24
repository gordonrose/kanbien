# IndexCard Reference Pack

## Quality Gate Profile

- Complexity: `moderate`
- Promotion target: `system-ready`
- Canonical rendering posture: token-route canonical exception.
- Reference source: `/design-system/tokens/index-card`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Mobile row proves the same compact card contract in a narrow frame |
| theme | Normal, dark, and desert theme scopes |
| direction | RTL row preserves the stacked copy lane |
| magnification | -50%, 0%, and +100% samples preserve geometry |
| density | Compact bordered card with stacked label and count |
| overflow | Constrained card ellipsizes label/count and exposes tooltips |
| interaction | Hover, active, selected, and keyboard-focus-compatible button semantics |
| accessibility | Full-surface button with accessible name, pressed, and disabled states |
| keyboard | Native button behavior and focus target |
| focus | Focus styling follows the hover/focus emphasis token path |
| attention | Warning and error semantic state examples |
| disabled | Native disabled and `aria-disabled` example |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `IC-R-001` | `/design-system/tokens/index-card` | Default normal theme card |
| `IC-R-002` | `/design-system/tokens/index-card` | Dark theme card |
| `IC-R-003` | `/design-system/tokens/index-card` | Desert theme card |
| `IC-R-004` | `/design-system/tokens/index-card` | Hover state |
| `IC-R-005` | `/design-system/tokens/index-card` | Active state |
| `IC-R-006` | `/design-system/tokens/index-card` | Selected state |
| `IC-R-007` | `/design-system/tokens/index-card` | Disabled state |
| `IC-R-008` | `/design-system/tokens/index-card` | Warning state |
| `IC-R-009` | `/design-system/tokens/index-card` | Error state |
| `IC-R-010` | `/design-system/tokens/index-card` | Overflow with tooltip data |
| `IC-R-011` | `/design-system/tokens/index-card` | RTL row |
| `IC-R-012` | `/design-system/tokens/index-card` | Magnification row |
| `IC-R-013` | `/design-system/tokens/index-card` | Mobile row |
| `IC-R-014` | `/design-system/tokens/secondary-list-card` | Legacy route alias renders IndexCard |
| `IC-R-015` | `/design-system/assets/secondaryListCard.mjs` | Legacy import shim forwards to IndexCard |
| `IC-R-016` | `/design-system/tokens/list-card` | Full-row ListCard remains separate from IndexCard |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `IC-001` | `IC-R-001` through `IC-R-013` |
| `IC-002` | `IC-R-015` |
| `IC-003` | `IC-R-001`, `IC-R-006`, `IC-R-007` |
| `IC-004` | `IC-R-001`, `IC-R-002`, `IC-R-003` |
| `IC-005` | `IC-R-001`, `IC-R-010`, `IC-R-011`, `IC-R-013` |
| `IC-006` | `IC-R-001` |
| `IC-007` | `IC-R-001` |
| `IC-008` | `IC-R-004` through `IC-R-009` |
| `IC-009` | `IC-R-006` |
| `IC-010` | `IC-R-007` |
| `IC-011` | `IC-R-008`, `IC-R-009` |
| `IC-012` | `IC-R-010` |
| `IC-013` | `IC-R-011`, `IC-R-012`, `IC-R-013` |
| `IC-014` | `IC-R-014` |
| `IC-015` | `IC-R-015` |
| `IC-016` | `IC-R-016` |
