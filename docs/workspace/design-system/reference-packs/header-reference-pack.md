# Header Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/header`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Header previews remain readable in token route |
| theme | Normal, dark, and desert heading ink variants |
| direction | Text direction inherited from shell |
| magnification | Heading previews scale without overlap |
| density | Line-height hierarchy is explicit |
| overflow | Long heading behavior belongs to first-consumer parity |
| interaction | Passive typography seam; source/display controls only |
| accessibility | Semantic heading level belongs to consuming markup |
| keyboard | Route controls remain reachable |
| focus | Focus belongs to controls, not passive headings |
| attention | N/A; header scale does not express attention state |
| disabled | N/A; disabled typography belongs to consuming controls |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `HDR-001` | `/design-system/tokens/header` | `header.1` |
| `HDR-002` | `/design-system/tokens/header` | `header.2` |
| `HDR-003` | `/design-system/tokens/header` | `header.3` |
| `HDR-004` | `/design-system/tokens/header` | `header.4` |
| `HDR-005` | `/design-system/tokens/header` | `header.5` |
| `HDR-006` | `/design-system/tokens/header` | `header.6` |
| `HDR-007` | `/design-system/tokens/header` | Normal/dark/desert preview set |
| `HDR-008` | `/design-system/tokens/header` | Definition metadata output |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `HDR-001` | `HDR-001` through `HDR-008` |
| `HDR-002` | `HDR-001` through `HDR-006` |
| `HDR-003` | `HDR-001` through `HDR-006` |
| `HDR-004` | `HDR-001` through `HDR-006` |
| `HDR-005` | `HDR-006` |
| `HDR-006` | `HDR-007` |
| `HDR-007` | `HDR-008` |
| `HDR-008` | `HDR-001` through `HDR-008` |
| `HDR-009` | `HDR-001` through `HDR-008` |
