# ListPageStructure Reference Pack

## Review Surface

- `/design-system/tokens/list-page-structure`

## Required Reference States

| Reference | State | Purpose |
| --- | --- | --- |
| `LPS-001` | Desktop full layout, both headers visible, 12-column second header | Baseline foundation |
| `LPS-002` | Desktop split layout with resize handle | Proves 1:4 foundation split |
| `LPS-003` | Desktop 24-column second header | Proves static half-width rails with scrolling between them |
| `LPS-004` | Desktop first header hidden | Proves independent first-header visibility |
| `LPS-005` | Desktop second header hidden | Proves independent second-header visibility |
| `LPS-006` | Mobile full layout | Proves one visible first-header column and one primary lower column |
| `LPS-007` | Mobile split layout | Proves four-column primary region over hidden side region |
| `LPS-008` | Mobile second-header scroll | Proves one visible secondary-header column at a time |

## Acceptance Notes

The reference states intentionally use structural placeholders only. Any record,
filter, status, entity, or payload content belongs to downstream components.
