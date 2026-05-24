# Token Foundation Seams Reference Pack

## Review Surfaces

The signed-off review surfaces are the live token routes:

## Quality Gate Profile

- Complexity: `standard`
- Promotion target: `system-ready`
- Canonical rendering posture: approved token-route canonical exception.
- Reference source: signed-off `/design-system/tokens/*` routes.

## Required Dimensions

| Dimension | Coverage |
| --- | --- |
| responsive | Covered by shell routes, structure routes, and filter-panel visual tests |
| theme | Covered where routes expose normal, dark, and desert variants |
| direction | Covered by shared shell direction and structure-direction inheritance |
| magnification | Covered by shared display settings; first consumers must rerun parity |
| density | Covered by token-route specimen sizing and structure row/card spacing |
| overflow | Covered by tooltip max sizing, filter-panel scroll stack, and structure scroll probes |
| interaction | Covered by display settings, icon-button, tooltip, resize, and filter count states |
| accessibility | Covered by labels, icon accessible names, tooltip trigger expectations, and resize semantics |
| keyboard | Covered for focusable controls and resize handles where applicable |
| focus | Covered by icon-button, tooltip trigger, display setting, and resize handle expectations |
| attention | N/A for this token batch; no alerting or attention badge primitive is introduced |
| disabled | N/A for this token batch except future consumers that introduce disabled controls |

## Required Reference States

| Reference | Route | Required Review State |
| --- | --- | --- |
| `TFS-001` | `/design-system/tokens/background` | Background foundation with normal, dark, desert, and adjustable wash/glow/corner controls |
| `TFS-002` | `/design-system/tokens/container` | Default container surface with state-color examples |
| `TFS-003` | `/design-system/tokens/container-section` | Interior section surface inside the container token model |
| `TFS-004` | `/design-system/tokens/colours` | Semantic colour scale review |
| `TFS-005` | `/design-system/tokens/paragraph` | Paragraph scale, semantic ink, and status-color variants |
| `TFS-006` | `/design-system/tokens/header` | Header scale and theme-aware heading ink |
| `TFS-007` | `/design-system/tokens/icon-button` | Icon-only button sizing, hover/focus state, and tooltip relationship |
| `TFS-008` | `/design-system/tokens/tooltip` | Shared tooltip surface, placements, max size, and paragraph typography dependency |
| `TFS-009` | `/design-system/tokens/entity-page-structure` | Entity page header, index, panel, nested panel index, resize, and mobile layer preview |
| `TFS-010` | `/design-system/tokens/nested-entity-record` | Nested entity record frame with entity record body and resize handles |
| `TFS-011` | `/design-system/tokens/filter-panel-structure` | Overlay filter panel, sticky title, card-stack count setting, mobile full-width behavior |
| `TFS-012` | `/design-system/tokens` | Token index registration under the approved public parent groupings |

## Behavior Coverage Matrix

| Behavior ID | Reference States |
| --- | --- |
| `TFS-001` | `TFS-001` through `TFS-012` |
| `TFS-002` | `TFS-001` through `TFS-012` |
| `TFS-003` | `TFS-001` through `TFS-011` |
| `TFS-004` | `TFS-001` through `TFS-011` |
| `TFS-005` | `TFS-001`, `TFS-009`, `TFS-011` |
| `TFS-006` | `TFS-001` through `TFS-011` |
| `TFS-007` | `TFS-001` |
| `TFS-008` | `TFS-004`, `TFS-005`, `TFS-006` |
| `TFS-009` | `TFS-005`, `TFS-008` |
| `TFS-010` | `TFS-006`, `TFS-009`, `TFS-011` |
| `TFS-011` | `TFS-001` through `TFS-008` |
| `TFS-012` | `TFS-002` |
| `TFS-013` | `TFS-003` |
| `TFS-014` | `TFS-007` |
| `TFS-015` | `TFS-008` |
| `TFS-016` | `TFS-009` |
| `TFS-017` | `TFS-010` |
| `TFS-018` | `TFS-011` |
| `TFS-019` | `TFS-011` |
| `TFS-020` | `TFS-011` |
| `TFS-021` | `TFS-011` |
| `TFS-022` | `TFS-011` |

## Acceptance Notes

- The token routes are the signed-off reference surfaces for this promotion
  pass.
- Generated canonical render pages are deferred by the recorded token-route
  exception in
  `docs/workspace/design-system/verification/token-foundation-seams-canonical-rendering-exception.md`.
- App adoption must consume the shared design-system seam or CSS/token contract
  intentionally; copying token route markup into app pages is not approved.
- Real app adoption still needs parity checks against the relevant `TFS-*`
  route before first-consumer use is treated as complete.

## Known Follow-Ups

- Convert high-reuse token families into generated canonical render pages when
  they need standalone review outside the token route.
- Add first-consumer parity evidence when an app surface consumes each seam.
- Split this pack into family-specific reference packs if any token family
  grows interactive behavior beyond the current signed-off route.
