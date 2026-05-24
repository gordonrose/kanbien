# IconButton Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/icon-button`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Host-cell sizing examples prove min/base/max behavior |
| theme | Normal, dark, and desert previews |
| direction | Direction-neutral square control |
| magnification | Fluid size clamp supports zoom review |
| density | 75/100/150 percent size relationship |
| overflow | Button remains centered inside host cell |
| interaction | Hover/focus and tooltip-trigger behavior |
| accessibility | Accessible names required for icon-only buttons |
| keyboard | Buttons are keyboard reachable |
| focus | Focus visibility is required |
| attention | N/A; no attention state in base icon button |
| disabled | N/A; disabled state requires future control-specific proof |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `ICB-001` | `/design-system/tokens/icon-button` | Minimum size button |
| `ICB-002` | `/design-system/tokens/icon-button` | Base size button |
| `ICB-003` | `/design-system/tokens/icon-button` | Maximum size button |
| `ICB-004` | `/design-system/tokens/icon-button` | Normal theme preview |
| `ICB-005` | `/design-system/tokens/icon-button` | Dark theme preview |
| `ICB-006` | `/design-system/tokens/icon-button` | Desert theme preview |
| `ICB-007` | `/design-system/tokens/icon-button` | Accessible-name and tooltip relationship |
| `ICB-008` | `/design-system/tokens/icon-button` | Source output state |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `ICB-001` | `ICB-001`, `ICB-002`, `ICB-003` |
| `ICB-002` | `ICB-001`, `ICB-002`, `ICB-003` |
| `ICB-003` | `ICB-001`, `ICB-002`, `ICB-003` |
| `ICB-004` | `ICB-004`, `ICB-005`, `ICB-006` |
| `ICB-005` | `ICB-007` |
| `ICB-006` | `ICB-007` |
| `ICB-007` | `ICB-004`, `ICB-005`, `ICB-006` |
| `ICB-008` | `ICB-001` through `ICB-008` |
