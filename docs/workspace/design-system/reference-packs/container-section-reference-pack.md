# ContainerSection Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/container-section`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Section specimen remains inspectable in shell |
| theme | Normal, dark, and desert shell inheritance |
| direction | Direction-neutral section surface |
| magnification | Section scales without text/edge overlap |
| density | Fixed specimen proves all-side border |
| overflow | N/A; section token does not own scroll |
| interaction | Source drawer and display controls only |
| accessibility | Passive surface; semantics belong to consumers |
| keyboard | Display/source controls remain reachable |
| focus | Focus belongs to controls, not passive section |
| attention | N/A; no attention state |
| disabled | N/A; disabled state belongs to consuming content |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `CNS-001` | `/design-system/tokens/container-section` | Normal default section |
| `CNS-002` | `/design-system/tokens/container-section` | Four-sided border treatment |
| `CNS-003` | `/design-system/tokens/container-section` | Square-corner structural fill |
| `CNS-004` | `/design-system/tokens/container-section` | Success section state |
| `CNS-005` | `/design-system/tokens/container-section` | Warning section state |
| `CNS-006` | `/design-system/tokens/container-section` | Error section state |
| `CNS-007` | `/design-system/tokens/container-section` | Dark/desert inherited shell |
| `CNS-008` | `/design-system/tokens/container-section` | Source output state |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `CNS-001` | `CNS-001`, `CNS-008` |
| `CNS-002` | `CNS-002`, `CNS-008` |
| `CNS-003` | `CNS-003` |
| `CNS-004` | `CNS-004`, `CNS-005`, `CNS-006` |
| `CNS-005` | `CNS-001`, `CNS-003` |
| `CNS-006` | `CNS-007` |
| `CNS-007` | `CNS-008` |
| `CNS-008` | `CNS-001` through `CNS-008` |
