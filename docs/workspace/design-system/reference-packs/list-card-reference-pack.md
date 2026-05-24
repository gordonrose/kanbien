# ListCard Reference Pack

## Quality Gate Profile

- Complexity: `moderate`
- Promotion target: `system-ready`
- Canonical rendering posture: token-route canonical exception.
- Reference source: `/design-system/tokens/list-card`.
- Human review: accepted in-session after rendered token review.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Mobile row proves the same full-row card contract in a narrow frame |
| theme | Normal, dark, and desert theme scopes |
| direction | RTL row preserves the start/end lane relationship |
| density | Full-width bordered row with stacked title/subtitle and trailing status |
| overflow | Constrained row ellipsizes title/subtitle/status and exposes tooltips |
| interaction | Hover, selected, and keyboard-focus-compatible button semantics |
| accessibility | Full-surface button with accessible name, pressed, and disabled states |
| keyboard | Native button behavior and focus target |
| focus | Focus styling follows the neutral theme primitive path |
| attention | Warning and error semantic state examples |
| disabled | Native disabled and `aria-disabled` example |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `LC-R-001` | `/design-system/tokens/list-card` | Normal theme row group |
| `LC-R-002` | `/design-system/tokens/list-card` | Dark theme row group |
| `LC-R-003` | `/design-system/tokens/list-card` | Desert theme row group |
| `LC-R-004` | `/design-system/tokens/list-card` | Hover state |
| `LC-R-005` | `/design-system/tokens/list-card` | Selected state |
| `LC-R-006` | `/design-system/tokens/list-card` | Disabled state |
| `LC-R-007` | `/design-system/tokens/list-card` | Warning state |
| `LC-R-008` | `/design-system/tokens/list-card` | Error state |
| `LC-R-009` | `/design-system/tokens/list-card` | Overflow with tooltip data |
| `LC-R-010` | `/design-system/tokens/list-card` | RTL row |
| `LC-R-011` | `/design-system/tokens/list-card` | Mobile row |
| `LC-R-012` | `/design-system/assets/listCard.mjs` | Shared render/hydration seam |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `LC-001` | `LC-R-001` through `LC-R-011` |
| `LC-002` | `LC-R-012` |
| `LC-003` | `LC-R-001`, `LC-R-005`, `LC-R-006` |
| `LC-004` | `LC-R-001`, `LC-R-002`, `LC-R-003`, `LC-R-007`, `LC-R-008` |
| `LC-005` | `LC-R-001`, `LC-R-009`, `LC-R-010`, `LC-R-011` |
| `LC-006` | `LC-R-001`, `LC-R-010`, `LC-R-011` |
| `LC-007` | `LC-R-001` |
| `LC-008` | `LC-R-001` |
| `LC-009` | `LC-R-001`, `LC-R-002`, `LC-R-003` |
| `LC-010` | `LC-R-004` through `LC-R-008` |
| `LC-011` | `LC-R-004`, `LC-R-005` |
| `LC-012` | `LC-R-007`, `LC-R-008` |
| `LC-013` | `LC-R-005` |
| `LC-014` | `LC-R-006` |
| `LC-015` | `LC-R-009` |
| `LC-016` | `LC-R-010`, `LC-R-011` |
| `LC-017` | `LC-R-012` |
