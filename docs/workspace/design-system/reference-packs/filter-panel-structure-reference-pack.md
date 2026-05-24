# FilterPanelStructure Reference Pack

## Quality Gate Profile

- Complexity: `standard`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/filter-panel-structure`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Desktop stable overlay and mobile full-width panel |
| theme | Inherits normal, dark, and desert shell modes |
| direction | Inherits shell direction while preserving panel anatomy |
| magnification | Width bounds exist for zoom/readability |
| density | Title section matches page-header height; card sections keep fixed card-row height |
| overflow | Scroll belongs to card stack, not title section |
| interaction | Card-count display setting changes rendered count |
| accessibility | Regions and controls expose labels and pressed state |
| keyboard | Display setting buttons are keyboard reachable |
| focus | Pressed controls retain visible focus through shared shell |
| attention | N/A; no alert or badge state belongs to this structure |
| disabled | N/A; disabled card structures are future count-card behavior |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `FPS-001` | `/design-system/tokens/filter-panel-structure` | Desktop default five-card panel |
| `FPS-002` | `/design-system/tokens/filter-panel-structure` | Desktop stable width while page resizes |
| `FPS-003` | `/design-system/tokens/filter-panel-structure` | Mobile full-width panel |
| `FPS-004` | `/design-system/tokens/filter-panel-structure` | Short viewport with non-compressed rows |
| `FPS-005` | `/design-system/tokens/filter-panel-structure` | No-card display setting |
| `FPS-006` | `/design-system/tokens/filter-panel-structure` | Five-card display setting |
| `FPS-007` | `/design-system/tokens/filter-panel-structure` | Twenty-card scroll behavior |
| `FPS-008` | `/design-system/tokens/filter-panel-structure` | Sticky title during stack scroll |
| `FPS-009` | `/design-system/tokens/filter-panel-structure` | `3:1` title section split |
| `FPS-010` | `/design-system/tokens/filter-panel-structure` | Title height matches the shared page header |
| `FPS-011` | `/design-system/tokens/filter-panel-structure` | Centered card slot within fixed card section |
| `FPS-012` | `/design-system/tokens/filter-panel-structure` | Dark theme inherited shell review |
| `FPS-013` | `/design-system/tokens/filter-panel-structure` | RTL inherited shell review |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `FPS-001` | `FPS-001`, `FPS-002` |
| `FPS-002` | `FPS-002`, `FPS-004` |
| `FPS-003` | `FPS-003` |
| `FPS-004` | `FPS-007`, `FPS-008` |
| `FPS-005` | `FPS-009` |
| `FPS-005A` | `FPS-010` |
| `FPS-006` | `FPS-004`, `FPS-006`, `FPS-007` |
| `FPS-007` | `FPS-011` |
| `FPS-008` | `FPS-005`, `FPS-006`, `FPS-007` |
| `FPS-009` | `FPS-005`, `FPS-006`, `FPS-007` |
| `FPS-010` | `FPS-007`, `FPS-008` |
| `FPS-011` | `FPS-001` through `FPS-010` |
| `FPS-012` | `FPS-012`, `FPS-013` |
