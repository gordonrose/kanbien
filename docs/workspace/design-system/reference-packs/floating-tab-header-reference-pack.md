# Floating Tab Header Reference Pack

## Purpose

Freeze the first governed reference matrix for the floating tab header
component so future app adoption has a concrete parity target instead of a
small set of hand-picked examples.

## Scope

- Family: `floating-tab-header`
- Canonical launcher route:
  `/design-system/canonical-renderings/floating-tab-header`
- Dedicated canonical render route pattern:
  `/design-system/canonical-renderings/floating-tab-header/:ref`
- Legacy component route:
  `/design-system/components/floating-tab-header`
- Exploration route: `/design-system/exploration/floating-tab-header`
- Behavior lock:
  `docs/workspace/design-system/behavior-locks/floating-tab-header-behavior-lock.md`

## Quality Gate Profile

- Complexity: `complex`
- Minimum reference states required by harness: `20`
- Required posture: every behavior lock ID must map to at least one
  deterministic reference state, and every production-relevant design dimension
  must be covered or explicitly marked not applicable.
- Harness:
  `tests/audit/designSystem/artifactQualityGate.test.ts`

## Human Review Status

- Review outcome: accepted for promotion from exploration into the design
  system.
- Remaining gap: no first app consumer has adopted this component yet.

## Reference Contract

- The component must preserve the same card, counter, overflow, attention,
  category-switch, subtab, collapse, tooltip, hover, and vertical-list behavior
  captured during the exploration loop.
- The generated canonical-renderings route family is the stable governed review
  surface.
- The component route remains a legacy direct render surface for query-driven
  compatibility and local debugging.
- The exploration route remains available for future variant experiments.
- Future app consumers must consume a design-system-owned render/behavior seam
  rather than copying local markup or controller logic into app pages.
- Shared render/controller seam:
  `src/frontend/designSystem/assets/floatingTabHeader.mjs`
- Thin design-system route consumer:
  `src/frontend/designSystem/assets/floatingTabHeaderDemo.mjs`

## Required Dimensions

| Dimension | Coverage posture | Reference states |
| --- | --- | --- |
| responsive | Covered across wide desktop, narrow desktop, mobile-width horizontal, and mobile-width vertical states. | `FTH-R-001`, `FTH-R-003`, `FTH-R-004`, `FTH-R-012`, `FTH-R-013`, `FTH-R-017` |
| theme | Covered for normal, dark, and desert readability. | `FTH-R-001`, `FTH-R-014`, `FTH-R-015` |
| direction | Covered for LTR baseline and RTL mirrored layout. | `FTH-R-001`, `FTH-R-016`, `FTH-R-021` |
| magnification | Covered with +100% pressure on dense horizontal and vertical states. | `FTH-R-017`, `FTH-R-018` |
| density | Covered at five tabs, ten tabs, twelve tabs, single row, and double row. | `FTH-R-001`, `FTH-R-002`, `FTH-R-003`, `FTH-R-006` |
| overflow | Covered for right-only, both-sides, left-only, no native scrollbar, and mobile rail paging. | `FTH-R-003`, `FTH-R-004`, `FTH-R-005`, `FTH-R-012`, `FTH-R-019` |
| interaction | Covered for paging arrows, category drawer open/select, subtab display, and expand/collapse. | `FTH-R-004`, `FTH-R-005`, `FTH-R-008`, `FTH-R-009`, `FTH-R-010`, `FTH-R-011` |
| accessibility | Covered for ARIA tab state, drawer radio selection, hidden-count labels, content collapse state, and tooltip layer use. | `FTH-R-003`, `FTH-R-008`, `FTH-R-009`, `FTH-R-010`, `FTH-R-020` |
| keyboard | Covered by focus-visible review for tab cards and controls. | `FTH-R-020` |
| focus | Covered by focus-visible review and category-drawer focus target. | `FTH-R-008`, `FTH-R-020` |
| attention | Covered in horizontal, vertical, subtab, and tooltip/truncation states. | `FTH-R-007`, `FTH-R-011`, `FTH-R-013`, `FTH-R-018` |
| disabled | Covered through off variants for category switch, non-expandable mode, hidden arrows at limits, and collapsed content state. | `FTH-R-001`, `FTH-R-005`, `FTH-R-009`, `FTH-R-010` |

## Behavior Coverage Matrix

| Behavior ID | Covered by reference states | Verification expectation |
| --- | --- | --- |
| `FTH-001` | `FTH-R-001`, `FTH-R-003`, `FTH-R-013` | Header remains an in-context sticky secondary navigation surface. |
| `FTH-002` | `FTH-R-001`, `FTH-R-002`, `FTH-R-014`, `FTH-R-015` | Counter cards preserve title, meta, count, selection, and token inheritance. |
| `FTH-003` | `FTH-R-001`, `FTH-R-021` | Five tabs fill the full rail width without empty trailing space. |
| `FTH-004` | `FTH-R-002`, `FTH-R-003`, `FTH-R-017` | Eight-plus configured tabs switch to the compact treatment. |
| `FTH-005` | `FTH-R-002`, `FTH-R-006` | Single-row and double-row slot limits remain deterministic. |
| `FTH-006` | `FTH-R-003`, `FTH-R-004`, `FTH-R-005`, `FTH-R-012`, `FTH-R-019` | Arrows page hidden tabs and no native scrollbar is shown. |
| `FTH-007` | `FTH-R-003`, `FTH-R-004`, `FTH-R-005` | Hidden-count summaries appear on the correct side with correct counts. |
| `FTH-008` | `FTH-R-007`, `FTH-R-011`, `FTH-R-017` | Subtabs sit below the main rail without competing with controls. |
| `FTH-009` | `FTH-R-009`, `FTH-R-010` | Collapse hides content only; tab header remains visible. |
| `FTH-010` | `FTH-R-008`, `FTH-R-022`, `FTH-R-023` | Category switch drawer is single-select and shares the control column. |
| `FTH-011` | `FTH-R-013`, `FTH-R-018` | Vertical tab list scrolls independently while controls stay together. |
| `FTH-012` | `FTH-R-007`, `FTH-R-013`, `FTH-R-018`, `FTH-R-024` | Attention labels, borders, hover, and adjacent cards do not collide. |
| `FTH-013` | `FTH-R-020`, `FTH-R-024` | Truncated labels use the shared floating tooltip, not native title behavior. |

## Required Reference States

| Ref ID | Route | Viewport | State | Primary assertions |
| --- | --- | --- | --- | --- |
| `FTH-R-001` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-001` | 1440 x 900 | Roomy five-tab horizontal baseline | Five cards fill full rail; meta visible; category control visible; expand hidden; no page overflow. |
| `FTH-R-002` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-002` | 1440 x 900 | Crowded ten-tab compact baseline | Ten cards fit one row when measured compact treatment is enough; no hidden-count badge; arrows hidden. |
| `FTH-R-003` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-003` | 1440 x 900 | Over-limit start window | Right summary shows hidden count; left summary hidden; arrows visible; native scrollbar hidden. |
| `FTH-R-004` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-004` | 1440 x 900 | Over-limit middle window | Left and right summaries both visible with side-specific counts. |
| `FTH-R-005` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-005` | 1440 x 900 | Over-limit end window | Left summary visible; right summary hidden; right arrow disabled. |
| `FTH-R-006` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-006` | 1440 x 900 | Double-row slot limit | Five-slot rows; max two rows; overflow summary remains in-grid. |
| `FTH-R-007` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-007` | 1440 x 900 | Horizontal full interaction pressure | Subtabs, attention, controls, arrows, and hidden counts coexist without gaps or overlap. |
| `FTH-R-008` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-008` | 1440 x 900 | Category drawer open | Drawer is single-select radio group; control column stays occupied; selected category updates cards. |
| `FTH-R-009` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-009` | 1440 x 900 | Collapsed content | Content panel hidden; tab header, subtabs, summaries, and controls remain visible. |
| `FTH-R-010` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-010` | 1440 x 900 | Optional controls off | Category and expand controls hidden; rail uses full available width. |
| `FTH-R-011` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-011` | 1440 x 900 | Roomy attention plus subtabs | Attention labels stay internal; subtab attention state is visible and not clipped. |
| `FTH-R-012` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-012` | 390 x 900 | Mobile horizontal paging | Arrow buttons are same height as cards; rail scrollbars are hidden; page does not overflow. |
| `FTH-R-013` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-013` | 420 x 900 | Vertical long-list attention | Tab list scrolls independently; controls remain together; attention chips remain inside cards. |
| `FTH-R-014` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-014` | 1440 x 900 | Dark theme | Surfaces, attention states, controls, and counts remain readable. |
| `FTH-R-015` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-015` | 1440 x 900 | Desert theme | Theme variables apply without local one-off colour drift. |
| `FTH-R-016` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-016` | 1440 x 900 | RTL horizontal | Control column, arrows, hidden-count sides, and drawer anchoring mirror correctly. |
| `FTH-R-017` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-017` | 1024 x 900 | Magnified horizontal | Text remains contained; measured compacting or paging prevents controls from overlapping subtabs or hidden counts. |
| `FTH-R-018` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-018` | 420 x 900 | Magnified vertical | Long list remains scrollable; attention labels remain internal; control stack stays fixed. |
| `FTH-R-019` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-019` | 390 x 900 | Mobile end paging | Left-only hidden summary and disabled right arrow are visible without native scrollbar. |
| `FTH-R-020` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-020` | 760 x 900 | Tooltip and focus review | Truncated labels expose shared tooltip; focus-visible treatment stays unclipped. |
| `FTH-R-021` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-021` | 1440 x 900 | RTL roomy five-tab baseline | Five-card fill rule holds in RTL. |
| `FTH-R-022` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-022` | 1440 x 900 | Category switch off with expand on | Expand button occupies the right control column alone; category drawer cannot open. |
| `FTH-R-023` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-023` | 1440 x 900 | Owner category selected | Single selected category changes tab labels/counts without changing layout contract. |
| `FTH-R-024` | `/design-system/canonical-renderings/floating-tab-header/FTH-R-024` | 420 x 900 | Vertical attention hover/clipping review | Hover border and attention label do not clip or compete with adjacent cards. |

## Parity Rule

A future consumer matches this reference pack only when it satisfies the
behavior lock and preserves these reference states or documents an approved
intentional difference.
