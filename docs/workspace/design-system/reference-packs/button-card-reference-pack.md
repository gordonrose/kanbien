# ButtonCard Reference Pack

## Quality Gate Profile

- Complexity: `standard`
- Promotion target: `system-ready`
- Canonical rendering posture: token-route canonical exception.
- Reference source: `/design-system/tokens/button-card`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Mobile row proves the same compact card contract in a narrow frame |
| theme | Normal, dark, and desert theme scopes |
| direction | RTL row preserves the centered icon/label stack |
| magnification | -50%, 0%, and +100% samples preserve geometry |
| density | Compact bordered card with centered icon circle and label |
| overflow | Constrained card ellipsizes label text and exposes tooltips |
| interaction | Hover, active, selected, and keyboard-focus-compatible button semantics |
| accessibility | Full-surface button with accessible name, pressed, and disabled states |
| keyboard | Native button behavior and focus target |
| focus | Focus styling follows the hover/focus emphasis token path |
| attention | Warning and error semantic state examples |
| disabled | Native disabled and `aria-disabled` example |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `BC-R-001` | `/design-system/tokens/button-card` | Default normal theme card |
| `BC-R-002` | `/design-system/tokens/button-card` | Dark theme card |
| `BC-R-003` | `/design-system/tokens/button-card` | Desert theme card |
| `BC-R-004` | `/design-system/tokens/button-card` | Hover state |
| `BC-R-005` | `/design-system/tokens/button-card` | Active state |
| `BC-R-006` | `/design-system/tokens/button-card` | Selected state |
| `BC-R-007` | `/design-system/tokens/button-card` | Disabled state |
| `BC-R-008` | `/design-system/tokens/button-card` | Warning state |
| `BC-R-009` | `/design-system/tokens/button-card` | Error state |
| `BC-R-010` | `/design-system/tokens/button-card` | Overflow with tooltip data |
| `BC-R-011` | `/design-system/tokens/button-card` | RTL row |
| `BC-R-012` | `/design-system/tokens/button-card` | Magnification row |
| `BC-R-013` | `/design-system/tokens/button-card` | Mobile row |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `BC-001` | `BC-R-001` through `BC-R-013` |
| `BC-002` | `BC-R-001` through `BC-R-013` |
| `BC-003` | `BC-R-001`, `BC-R-006`, `BC-R-007` |
| `BC-004` | `BC-R-001`, `BC-R-002`, `BC-R-003` |
| `BC-005` | `BC-R-001`, `BC-R-011`, `BC-R-013` |
| `BC-006` | `BC-R-001`, `BC-R-010`, `BC-R-011`, `BC-R-013` |
| `BC-007` | `BC-R-001` |
| `BC-008` | `BC-R-004` through `BC-R-009` |
| `BC-009` | `BC-R-006` |
| `BC-010` | `BC-R-007` |
| `BC-011` | `BC-R-008`, `BC-R-009` |
| `BC-012` | `BC-R-010` |
| `BC-013` | `BC-R-011`, `BC-R-012`, `BC-R-013` |
| `BC-014` | `BC-R-001` |
