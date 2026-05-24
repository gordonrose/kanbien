# Tooltip Reference Pack

## Quality Gate Profile

- Complexity: `simple`
- Promotion target: `system-ready`
- Canonical rendering posture: approved canonical rendering exception.
- Reference source: `/design-system/tokens/tooltip`.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Tooltip max width/height protect small surfaces |
| theme | Tooltip variables govern surface contrast |
| direction | Placement and trigger semantics remain direction-safe |
| magnification | Paragraph main-minor text and max size protect zoomed content |
| density | Compact explanatory overlay density |
| overflow | Long tooltip content is bounded |
| interaction | Hover/focus trigger behavior belongs to shared tooltip layer |
| accessibility | Tooltip does not replace accessible names |
| keyboard | Focusable triggers can reveal equivalent tooltip behavior |
| focus | Focus remains on trigger, not tooltip content |
| attention | N/A; tooltip is explanatory, not alerting |
| disabled | Disabled-trigger behavior requires future consumer-specific proof |

## Required Reference States

| Reference | Route | State |
| --- | --- | --- |
| `TTP-001` | `/design-system/tokens/tooltip` | Top placement |
| `TTP-002` | `/design-system/tokens/tooltip` | Right placement |
| `TTP-003` | `/design-system/tokens/tooltip` | Bottom placement |
| `TTP-004` | `/design-system/tokens/tooltip` | Left placement |
| `TTP-005` | `/design-system/tokens/tooltip` | Long content bounded state |
| `TTP-006` | `/design-system/tokens/tooltip` | Paragraph main-minor dependency |
| `TTP-007` | `/design-system/tokens/tooltip` | Shared floating tooltip layer |
| `TTP-008` | `/design-system/tokens/tooltip` | Source output state |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `TTP-001` | `TTP-007`, `TTP-008` |
| `TTP-002` | `TTP-006` |
| `TTP-003` | `TTP-001`, `TTP-002`, `TTP-003`, `TTP-004` |
| `TTP-004` | `TTP-005` |
| `TTP-005` | `TTP-001` through `TTP-008` |
| `TTP-006` | `TTP-001` through `TTP-008` |
| `TTP-007` | `TTP-007` |
| `TTP-008` | `TTP-001` through `TTP-008` |
