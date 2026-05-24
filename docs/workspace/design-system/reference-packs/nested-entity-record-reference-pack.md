# NestedEntityRecord Reference Pack

## Quality Gate Profile

- Complexity: `standard`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/nested-entity-record`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Desktop nested frame and inherited mobile layer preview |
| theme | Inherits shell and page background token modes |
| direction | Inherits shell direction |
| magnification | Frame and embedded body remain inspectable |
| density | Entity body column density is preserved inside frame |
| overflow | Extended content proves internal scroll regions |
| interaction | Mobile layer and content-length display settings |
| accessibility | Frame and resize handles are labeled |
| keyboard | Display setting buttons are keyboard reachable |
| focus | Shared shell focus styling applies to controls |
| attention | N/A; nested record frame has no attention state |
| disabled | N/A; disabled nested records are future product behavior |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `NER-001` | `/design-system/tokens/nested-entity-record` | Default nested frame |
| `NER-002` | `/design-system/tokens/nested-entity-record` | Embedded entity body relationship |
| `NER-003` | `/design-system/tokens/nested-entity-record` | Horizontal resize affordance |
| `NER-004` | `/design-system/tokens/nested-entity-record` | Bottom resize affordance |
| `NER-005` | `/design-system/tokens/nested-entity-record` | Mobile top layer preview |
| `NER-006` | `/design-system/tokens/nested-entity-record` | Mobile bottom layer preview |
| `NER-007` | `/design-system/tokens/nested-entity-record` | Extended content state |
| `NER-008` | `/design-system/tokens/nested-entity-record` | Dark theme inherited state |
| `NER-009` | `/design-system/tokens/nested-entity-record` | RTL inherited state |
| `NER-010` | `/design-system/tokens/nested-entity-record` | Magnified shell state |
| `NER-011` | `/design-system/tokens/entity-page-structure` | Parent entity body source seam |
| `NER-012` | `/design-system/tokens/nested-entity-record` | Source drawer seam output |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `NER-001` | `NER-002`, `NER-011` |
| `NER-002` | `NER-001` |
| `NER-003` | `NER-003` |
| `NER-004` | `NER-004` |
| `NER-005` | `NER-002`, `NER-011` |
| `NER-006` | `NER-005`, `NER-006` |
| `NER-007` | `NER-007` |
| `NER-008` | `NER-008`, `NER-009`, `NER-010` |
| `NER-009` | `NER-003`, `NER-004` |
| `NER-010` | `NER-001` through `NER-012` |
