# Entity Management Page Collection Item Reference Pack

## Purpose

Define repeated-item reference states for the `entity_management_page`
template. Review this pack when inspecting canonical renderings for add, copy,
delete, card sync, panel sync, and item-specific builders.

## Scope

- Family:
  `entity-management-page`
- Child matrix:
  collection item behavior
- Status:
  review-candidate reference pack
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-management-page-collection-item-behavior-lock.md`
- Parent index:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`

## Reference State IDs

Use prefix `EMPI-*`.

| Ref ID | State | Route / setup | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `EMPI-001` | Workflow add baseline | Workflows, click Add Workflow | Proves card/panel creation, activation, initialized selects. | partially covered |
| `EMPI-002` | Workflow new item defaults | New workflow selected | Proves empty details and one Home status. | partially covered |
| `EMPI-003` | Workflow rename sync | Fill workflow name | Proves card title sync. | partially covered |
| `EMPI-004` | Workflow description sync | Fill workflow description | Proves card description/title attribute sync. | needs evidence |
| `EMPI-005` | Workflow copy baseline | Copy Intake | Proves copy action creates expected new item baseline. | partially covered |
| `EMPI-006` | Workflow delete new item | Delete workflow-4 | Proves card and panel removal. | partially covered |
| `EMPI-007` | Workflow delete active source | Delete currently active non-default item | Proves adjacent activation. | needs evidence |
| `EMPI-008` | Workflow repeated add/delete | Add/delete multiple workflows | Proves no duplicate keys and handlers remain single-bound. | needs evidence |
| `EMPI-009` | Workflow item lifecycle after lazy region | Visit Workflows after initial load, then add/copy/delete | Proves lazy materialization preserves handlers. | partially covered |
| `EMPI-010` | Catalog add baseline | Catalogs, click Add Catalog | Proves card/panel creation and activation. | needs evidence |
| `EMPI-011` | Catalog new defaults | New catalog selected | Proves default metadata and option row. | needs evidence |
| `EMPI-012` | Catalog label/scope sync | Edit catalog label/scope | Proves card copy sync. | needs evidence |
| `EMPI-013` | Catalog copy baseline | Copy existing catalog | Proves copy action and activation. | needs evidence |
| `EMPI-014` | Catalog delete baseline | Delete new catalog | Proves removal and adjacent activation. | needs evidence |
| `EMPI-015` | Catalog option add | Add option row | Proves option builder add behavior. | needs evidence |
| `EMPI-016` | Catalog option move | Move option up/down | Proves option ordering controls. | needs evidence |
| `EMPI-017` | Catalog option remove | Remove option | Proves option removal behavior. | needs evidence |
| `EMPI-018` | Permission role add baseline | Permissions, click Add Role | Proves role card/panel creation and activation. | needs evidence |
| `EMPI-019` | Permission role label sync | Edit role value | Proves card label/summary sync. | needs evidence |
| `EMPI-020` | Permission role copy baseline | Copy role | Proves copy behavior. | needs evidence |
| `EMPI-021` | Permission role delete baseline | Delete role | Proves removal and adjacent activation. | needs evidence |
| `EMPI-022` | Permission role view-option sync | Add/delete role, inspect view access role options | Proves dependent view role options resync. | needs evidence |
| `EMPI-023` | Permission family select all | Enable family, Select all | Proves bulk capability selection. | needs evidence |
| `EMPI-024` | Permission family deselect all | Deselect all | Proves bulk capability clearing. | needs evidence |
| `EMPI-025` | Add-card visual parity | Workflows/Catalogs/Permissions mobile and desktop | Proves add card follows shared card behavior. | partially covered |
| `EMPI-026` | Item action icon parity | Copy/delete controls across workflows/catalogs/permissions | Proves shared icon sizing, labels, and destructive treatment. | needs evidence |
| `EMPI-027` | High item count add-card reachability | 20+ item fixture | Proves add card remains reachable. | needs fixture |
| `EMPI-028` | Keyboard item lifecycle | Keyboard-only add/copy/delete | Proves WCAG keyboard support. | needs evidence |
| `EMPI-029` | Screen-reader status after add/delete | Add/delete repeated items | Proves dynamic changes announce or otherwise remain perceivable. | needs evidence |
| `EMPI-030` | Duplicate id/name sweep | After repeated add/copy cycles | Proves generated ids/names remain unique. | needs evidence |
| `EMPI-031` | Mobile carousel item lifecycle | Mobile Workflows/Catalogs/Permissions add, copy, delete | Proves mutation behavior works inside the approved carousel posture. | needs evidence |
| `EMPI-032` | Long item labels and descriptions | Long workflow/catalog/role labels plus unbroken keys | Proves card/panel sync, truncation, and tooltip behavior remain governed. | needs fixture |
| `EMPI-033` | RTL collection lifecycle | RTL desktop and mobile add/copy/delete | Proves action placement, adjacent activation, and carousel movement mirror correctly. | needs evidence |
| `EMPI-034` | Dark-theme collection lifecycle | Dark theme add/copy/delete across item families | Proves add cards, action icons, destructive affordances, and active state keep AA contrast. | needs evidence |
| `EMPI-035` | 200% zoom collection lifecycle | Zoomed desktop/mobile add/copy/delete | Proves action rows and cards do not overlap or become unreachable. | needs evidence |
| `EMPI-036` | WCAG text-spacing collection cards | Text spacing override across repeated cards | Proves card labels, descriptions, and action rows remain legible. | needs evidence |
| `EMPI-037` | WCAG target-size item controls | Mobile/touch review of add, copy, delete, move, and option controls | Proves item controls meet WCAG 2.2 AA target-size expectations or documented spacing exceptions. | needs evidence |
| `EMPI-038` | High-count destructive recovery | 20+ item fixture, delete active and last item | Proves adjacent activation and add-card reachability remain reliable at scale. | needs fixture |

## High-Risk Batch

Review first:

- `EMPI-001`
- `EMPI-003`
- `EMPI-005`
- `EMPI-008`
- `EMPI-010`
- `EMPI-018`
- `EMPI-022`
- `EMPI-027`
- `EMPI-030`
- `EMPI-031`
- `EMPI-032`
- `EMPI-034`
- `EMPI-037`

## Required Pressure States

- add/copy/delete across all add-capable item families
- mobile carousel lifecycle
- long labels and descriptions with tooltip/truncation where applicable
- high item counts
- RTL desktop and mobile
- dark theme
- 200% zoom and WCAG text spacing
- keyboard focus, status perception, and WCAG 2.2 AA target-size review
