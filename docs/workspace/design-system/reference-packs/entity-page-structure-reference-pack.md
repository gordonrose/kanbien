# EntityPageStructure Reference Pack

## Quality Gate Profile

- Complexity: `standard`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/entity-page-structure`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Desktop structure and mobile layer previews |
| theme | Consumes shared page background and shell theme controls |
| direction | Direction inherited from design-system shell controls |
| magnification | Structure remains inspectable under shared magnification |
| density | Structural columns maintain approved relationships |
| overflow | Extended content probes prove internal scroll ownership |
| interaction | Header visibility, mobile layer, content length, and resize controls |
| accessibility | Structural regions and resize handles are labeled |
| keyboard | Resize handles support keyboard adjustment on desktop |
| focus | Resize handles and display controls retain visible focus |
| attention | N/A; entity foundation does not define attention states |
| disabled | Mobile resize is disabled by layout, not by disabled controls |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `EPS-001` | `/design-system/tokens/entity-page-structure` | Desktop header and 2:10 body split |
| `EPS-002` | `/design-system/tokens/entity-page-structure` | Desktop body index resized toward four columns |
| `EPS-003` | `/design-system/tokens/entity-page-structure` | Record panel 20-column header over 10-column body |
| `EPS-004` | `/design-system/tokens/entity-page-structure` | Nested panel index default split |
| `EPS-005` | `/design-system/tokens/entity-page-structure` | Nested panel index resized toward four columns |
| `EPS-006` | `/design-system/tokens/entity-page-structure` | Header hidden through display settings |
| `EPS-007` | `/design-system/tokens/entity-page-structure` | Extended content scroll probes |
| `EPS-008` | `/design-system/tokens/entity-page-structure` | Mobile top index layer preview |
| `EPS-009` | `/design-system/tokens/entity-page-structure` | Mobile bottom record-panel layer preview |
| `EPS-010` | `/design-system/tokens/entity-page-structure` | Bottom-layer panel index centered in header row |
| `EPS-011` | `/design-system/tokens/entity-page-structure` | Bottom-layer panel content condensed to two columns |
| `EPS-012` | `/design-system/tokens/nested-entity-record` | Nested record consumer of entity record body |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `EPS-001` | `EPS-001`, `EPS-006`, `EPS-008` |
| `EPS-002` | `EPS-001` through `EPS-012` |
| `EPS-003` | `EPS-001`, `EPS-002` |
| `EPS-004` | `EPS-001`, `EPS-002` |
| `EPS-005` | `EPS-001`, `EPS-008` |
| `EPS-006` | `EPS-001`, `EPS-009` |
| `EPS-007` | `EPS-002` |
| `EPS-008` | `EPS-003` |
| `EPS-009` | `EPS-004`, `EPS-005` |
| `EPS-010` | `EPS-001`, `EPS-012` |
| `EPS-011` | `EPS-008`, `EPS-009` |
| `EPS-012` | `EPS-008` |
| `EPS-013` | `EPS-008`, `EPS-009` |
| `EPS-014` | `EPS-008`, `EPS-009` |
| `EPS-015` | `EPS-010` |
| `EPS-016` | `EPS-011` |
| `EPS-017` | `EPS-009`, `EPS-011` |
| `EPS-018` | `EPS-008`, `EPS-009` |
