# Colours Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/colours`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Swatch/token review remains readable in shell |
| theme | Normal, dark, desert, and state colour families |
| direction | Direction-neutral token meanings |
| magnification | Labels and swatches remain inspectable |
| density | Token grid density remains stable |
| overflow | Long token labels must not create incoherent overlap |
| interaction | Accent controls demonstrate approved primary colour changes |
| accessibility | Colour semantics support contrast review by consumers |
| keyboard | Display/source controls remain reachable |
| focus | Focus belongs to controls, not passive swatches |
| attention | N/A; attention treatment is future component behavior |
| disabled | N/A; disabled colours require future control-specific proof |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `COL-001` | `/design-system/tokens/colours` | Primary/accent colour family |
| `COL-002` | `/design-system/tokens/colours` | Text colour family |
| `COL-003` | `/design-system/tokens/colours` | Surface/background colour family |
| `COL-004` | `/design-system/tokens/colours` | Border/line colour family |
| `COL-005` | `/design-system/tokens/colours` | Success semantic family |
| `COL-006` | `/design-system/tokens/colours` | Warning semantic family |
| `COL-007` | `/design-system/tokens/colours` | Error semantic family |
| `COL-008` | `/design-system/tokens/colours` | Dark/desert theme families |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `COL-001` | `COL-001` through `COL-008` |
| `COL-002` | `COL-001` |
| `COL-003` | `COL-002`, `COL-003`, `COL-004` |
| `COL-004` | `COL-005`, `COL-006`, `COL-007` |
| `COL-005` | `COL-008` |
| `COL-006` | `COL-001` through `COL-008` |
| `COL-007` | `COL-001` through `COL-008` |
| `COL-008` | `COL-001` through `COL-008` |
| `COL-009` | `COL-001` through `COL-008` |
