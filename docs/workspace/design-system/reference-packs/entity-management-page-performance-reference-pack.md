# Entity Management Page Performance Reference Pack

## Purpose

Define performance and rendering reference states for the
`entity_management_page` template. Review this pack when inspecting canonical
renderings and browser metrics for lazy rendering, initial DOM budgets,
visited-region growth, handler initialization, and module/fixture boundaries.

## Scope

- Family:
  `entity-management-page`
- Child matrix:
  performance contract
- Status:
  review-candidate reference pack
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-management-page-performance-behavior-lock.md`
- Parent index:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`

## Reference State IDs

Use prefix `EMPP-*`.

| Ref ID | State | Route / setup | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `EMPP-001` | Initial lazy footprint | Initial route open | Proves one rendered region and one rendered nested panel. | covered |
| `EMPP-002` | Initial DOM/control budget | Initial route open | Proves bounded DOM/control counts. | covered with current threshold |
| `EMPP-003` | First useful render timing | Initial route open with performance timings | Proves perceived load is not dominated by hidden DOM. | partially covered manual |
| `EMPP-004` | Region lazy materialization | Visit Workflows | Proves selected region materializes once. | partially covered |
| `EMPP-005` | Multi-region visited growth | Visit Workflows then Views then Identity | Proves DOM grows only for visited regions. | partially covered smoke |
| `EMPP-006` | Nested panel lazy materialization | Click inactive nested item | Proves selected nested panel materializes on first use. | partially covered smoke |
| `EMPP-007` | Repeated region switching | Switch same regions repeatedly | Proves no duplicate materialization or double handlers. | needs evidence |
| `EMPP-008` | Add after lazy materialization | Visit Workflows then Add Workflow | Proves add handlers initialize lazily. | partially covered |
| `EMPP-009` | Copy/delete after lazy materialization | Visit Workflows then copy/delete | Proves mutation handlers initialize lazily. | partially covered |
| `EMPP-010` | Drawer-select after lazy materialization | Visit lazily rendered panel, open drawer-select | Proves form controls initialize after insertion. | needs evidence |
| `EMPP-011` | Derived fields after lazy materialization | Visit Owning Feature/View Access | Proves sync helpers run after insertion. | needs evidence |
| `EMPP-012` | Evidence after lazy materialization | Visit Workflows, open evidence | Proves evidence targets work after lazy insertion. | partially covered smoke |
| `EMPP-013` | AI after lazy materialization | Visit Workflows, open AI | Proves AI targets work after lazy insertion. | needs evidence |
| `EMPP-014` | High nested item count lazy baseline | Fixture with 20+ nested items | Proves hidden panels are not eagerly rendered at high count. | needs fixture |
| `EMPP-015` | High region count lazy baseline | Fixture with more regions | Proves hidden regions remain placeholders. | needs fixture |
| `EMPP-016` | 200% zoom lazy baseline | Zoomed initial route | Proves lazy footprint survives magnified layout. | needs evidence |
| `EMPP-017` | Mobile lazy baseline | Mobile initial route | Proves lazy footprint and page scroll coexist. | covered |
| `EMPP-018` | Mobile multi-region visited growth | Mobile switch through regions | Proves lazy materialization through mobile picker. | partially covered |
| `EMPP-019` | Module size snapshot | Asset headers / filesystem size | Tracks entity module weight. | manual only |
| `EMPP-020` | Fixture split readiness | Future split module/data fixture | Proves app seam no longer bundles demo data unnecessarily. | blocked-for-adoption |
| `EMPP-021` | Eager import avoidance | Future route/provider import shape | Proves unrelated drawers do not eagerly import entity page module. | blocked-for-adoption |
| `EMPP-022` | Render-ready signal | First useful selector/state | Proves readiness means visible content, not hidden workspace completion. | partially covered |
| `EMPP-023` | Memory/DOM after full visit | Visit all regions once | Proves eventual full page remains within acceptable DOM/memory bounds. | needs evidence |
| `EMPP-024` | Handler count regression | Repeated add/delete/switch cycles | Proves no duplicate event handler side effects. | needs evidence |

## High-Risk Batch

Review first:

- `EMPP-001`
- `EMPP-002`
- `EMPP-003`
- `EMPP-007`
- `EMPP-014`
- `EMPP-017`
- `EMPP-020`
- `EMPP-021`

## Current Measurement Snapshot

Recent initial-load smoke after lazy rendering:

- DOM nodes:
  `781`
- controls:
  `145`
- rendered regions:
  `1`
- rendered nested panels:
  `1`
- rendered HTML:
  about `88KB`

Earlier eager-render state:

- DOM nodes:
  about `173,000`
- controls:
  about `29,600`
- rendered HTML:
  about `19.4MB`

