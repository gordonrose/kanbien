# Floating Tab Header Behavior Lock

## Purpose

Lock the first governed behavior rules for the floating tab header component
before it is adopted by an app surface.

## Scope

- Family: `floating-tab-header`
- Stable review route: `/design-system/components/floating-tab-header`
- Exploration route: `/design-system/exploration/floating-tab-header`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/floating-tab-header-reference-pack.md`

## Behavior Review

| ID | Behavior statement | Status |
| --- | --- | --- |
| `FTH-001` | The header is a sticky in-context secondary navigation surface for one list, board, or project. | `approved` |
| `FTH-002` | Tabs render as counter cards with title, optional meta text, count, selected state, and theme/accent inheritance from the design-system tokens. | `approved` |
| `FTH-003` | Five visible tabs use the roomier card layout and fill the full available tab rail width. | `approved` |
| `FTH-004` | Crowded states at eight or more configured tabs switch to the compact card treatment. | `approved` |
| `FTH-005` | The horizontal rail supports up to ten row slots in single-row mode and five slots by two rows in double-row mode. | `approved` |
| `FTH-006` | When the configured tab count exceeds available slots, paging arrows reveal hidden tabs and no native scrollbar is shown. | `approved` |
| `FTH-007` | Hidden-tab summaries are side-aware: right-only at the beginning, both sides in the middle, and left-only at the end. Counts reflect the number hidden on that side. | `approved` |
| `FTH-008` | Optional subtabs appear below the main card row without competing with paging controls or creating an empty vertical gutter. | `approved` |
| `FTH-009` | Expand/collapse hides or shows the content panel, not the tab header itself. | `approved` |
| `FTH-010` | The optional category switch opens a single-select drawer and occupies the same right-side control column as the expand button. | `approved` |
| `FTH-011` | In vertical mode, the tab list scrolls independently while the category and expand controls remain together in the same control column. | `approved` |
| `FTH-012` | Attention state must not cause badges, labels, borders, or hover treatment to collide with adjacent tabs or cards. | `approved` |
| `FTH-013` | Truncated tab labels use the shared tokenized tooltip system rather than browser-default `title` tooltips. | `approved` |

## Exit Criteria

This behavior lock is ready for first-consumer adoption planning only after the
matching reference pack, generated canonical rendering routes, and executable
route/artifact checks exist. Real app adoption still requires a
consumer-specific adoption contract and rendered parity proof.
