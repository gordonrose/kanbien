# Container Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/container`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Container specimen remains inspectable in shell |
| theme | Normal, dark, and desert shell inheritance |
| direction | Direction-neutral surface |
| magnification | Container scales with shell without overlap |
| density | Fixed specimen density proves surface treatment |
| overflow | N/A; container token does not own scroll |
| interaction | Source drawer and display controls only |
| accessibility | Surface itself has no semantics; labels belong to consumers |
| keyboard | Display/source controls remain reachable |
| focus | Focus belongs to controls, not passive surface |
| attention | N/A; no attention state |
| disabled | N/A; disabled state belongs to consuming controls |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `CON-001` | `/design-system/tokens/container` | Normal default container |
| `CON-002` | `/design-system/tokens/container` | Bottom/right border treatment |
| `CON-003` | `/design-system/tokens/container` | Success container state |
| `CON-004` | `/design-system/tokens/container` | Warning container state |
| `CON-005` | `/design-system/tokens/container` | Error container state |
| `CON-006` | `/design-system/tokens/container` | Dark theme inherited shell |
| `CON-007` | `/design-system/tokens/container` | Desert theme inherited shell |
| `CON-008` | `/design-system/tokens/container` | Source output state |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `CON-001` | `CON-001` |
| `CON-002` | `CON-001`, `CON-008` |
| `CON-003` | `CON-002`, `CON-008` |
| `CON-004` | `CON-003`, `CON-004`, `CON-005` |
| `CON-005` | `CON-001` through `CON-005` |
| `CON-006` | `CON-006`, `CON-007` |
| `CON-007` | `CON-001` |
| `CON-008` | `CON-008` |
