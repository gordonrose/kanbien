# Paragraph Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/paragraph`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Paragraph previews remain readable in token route |
| theme | Normal, dark, desert, success, warning, and error ink variants |
| direction | Text direction inherited from shell |
| magnification | Text scales without card/control overlap |
| density | Line-height and compact label treatment are explicit |
| overflow | Long consumer text must be checked by first adopters |
| interaction | Passive typography seam; source/display controls only |
| accessibility | Text contrast and semantic roles belong to consuming content |
| keyboard | Route controls remain reachable |
| focus | Focus belongs to controls, not passive text |
| attention | Status colour variants cover semantic attention text |
| disabled | N/A; disabled typography belongs to control seams |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `PAR-001` | `/design-system/tokens/paragraph` | `paragraph.main` |
| `PAR-002` | `/design-system/tokens/paragraph` | `paragraph.mainLarge` |
| `PAR-003` | `/design-system/tokens/paragraph` | `paragraph.mainExtraLarge` |
| `PAR-004` | `/design-system/tokens/paragraph` | `paragraph.mainMinor` |
| `PAR-005` | `/design-system/tokens/paragraph` | `paragraph.label` |
| `PAR-006` | `/design-system/tokens/paragraph` | Normal/dark/desert preview set |
| `PAR-007` | `/design-system/tokens/paragraph` | Warning/success/error preview set |
| `PAR-008` | `/design-system/tokens/paragraph` | Definition metadata output |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `PAR-001` | `PAR-001` through `PAR-008` |
| `PAR-002` | `PAR-001` |
| `PAR-003` | `PAR-002`, `PAR-003` |
| `PAR-004` | `PAR-004` |
| `PAR-005` | `PAR-005` |
| `PAR-006` | `PAR-006` |
| `PAR-007` | `PAR-007` |
| `PAR-008` | `PAR-008` |
| `PAR-009` | `PAR-001` through `PAR-008` |
