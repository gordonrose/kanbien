# PageBackground Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/background`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Background remains attached to shell and structure surfaces |
| theme | Normal, dark, and desert targets are represented |
| direction | Direction-neutral; background does not mirror |
| magnification | Background remains page-attached under shell magnification |
| density | N/A; background has no density-specific geometry |
| overflow | Background does not create scroll or clipping surfaces |
| interaction | Editor controls update rendered variables and source output |
| accessibility | Background supports contrast-sensitive surfaces but has no direct semantics |
| keyboard | Editor controls remain normal button/input controls |
| focus | Focus belongs to editor controls, not the background layer |
| attention | N/A; background does not express alert or attention state |
| disabled | N/A; background does not define disabled treatment |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `PBG-001` | `/design-system/tokens/background` | Normal theme default background |
| `PBG-002` | `/design-system/tokens/background` | Dark theme background target |
| `PBG-003` | `/design-system/tokens/background` | Desert theme background target |
| `PBG-004` | `/design-system/tokens/background` | Glow extent adjustment |
| `PBG-005` | `/design-system/tokens/background` | Corner extent adjustment |
| `PBG-006` | `/design-system/tokens/background` | Wash extent adjustment |
| `PBG-007` | `/design-system/tokens/background` | Source output after control changes |
| `PBG-008` | `/design-system/tokens/entity-page-structure` | Structural consumer using page background |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `PBG-001` | `PBG-001`, `PBG-008` |
| `PBG-002` | `PBG-001` through `PBG-007` |
| `PBG-003` | `PBG-001` |
| `PBG-004` | `PBG-002` |
| `PBG-005` | `PBG-003` |
| `PBG-006` | `PBG-008` |
| `PBG-007` | `PBG-004`, `PBG-005`, `PBG-006`, `PBG-007` |
| `PBG-008` | `PBG-001`, `PBG-008` |
