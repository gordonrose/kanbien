# Entity Management Page Navigation Reference Pack

## Purpose

Define the navigation reference states for the `entity_management_page`
template. Review this pack when inspecting canonical renderings for top-level
regions, mobile region picker, nested cards, carousel behavior, active states,
and the desktop nested resizer.

## Scope

- Family:
  `entity-management-page`
- Child matrix:
  navigation contract
- Status:
  review-candidate reference pack
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-management-page-navigation-behavior-lock.md`
- Parent index:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`

## Reference State IDs

Use prefix `EMPN-*`.

| Ref ID | State | Route / setup | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `EMPN-001` | Desktop region order baseline | Desktop, initial route | Proves fixed 13-region order and no generic record-detail regions. | covered |
| `EMPN-002` | Desktop active region state | Desktop, switch Identity to Workflows to Views | Proves active trigger, selected state, panel visibility, and header summary sync. | partially covered |
| `EMPN-003` | Desktop long region labels | Desktop with long labels or action-model labels | Proves wrapping and no truncation-only failure. | partially covered |
| `EMPN-004` | Desktop high region count | Fixture with more regions than current demo | Proves region index remains usable with many items. | needs fixture |
| `EMPN-005` | Desktop constrained height region index | Reduced height | Proves region index vertical scroll remains usable. | partially covered |
| `EMPN-006` | Desktop nested Identity baseline | Identity, Primary Details | Proves shared nested-list picker for Identity. | partially covered |
| `EMPN-007` | Desktop nested Workflows baseline | Workflows, Intake | Proves nested list plus add card in add-capable section. | partially covered |
| `EMPN-008` | Desktop nested Views baseline | Views, List views | Proves nested list plus add card and detail sections. | partially covered |
| `EMPN-009` | Desktop nested Relationships baseline | Relationships | Proves non-add nested region. | needs evidence |
| `EMPN-010` | Desktop nested Attributes high list | Attributes | Proves six-plus attribute items and generated panel activation. | needs evidence |
| `EMPN-011` | Desktop nested Catalogs add-capable list | Catalogs | Proves nested add card and catalog card summaries. | needs evidence |
| `EMPN-012` | Desktop nested Permissions list | Permissions | Proves permission role card behavior. | needs evidence |
| `EMPN-013` | Desktop action-model nested list | Action Models - Record | Proves high action capability count and list scroll. | needs evidence |
| `EMPN-014` | Desktop entity-structure action nested list | Action Models - Entity Structure | Proves long action labels and resizer pressure. | partially covered |
| `EMPN-015` | Desktop resizer pointer | Action Models - Entity Structure, drag resizer | Proves secondary nav width adjustment by pointer. | partially covered |
| `EMPN-016` | Desktop resizer keyboard | Focus resizer, Arrow/Home/End | Proves non-drag alternative for WCAG 2.5.7. | needs evidence |
| `EMPN-017` | Mobile region picker baseline | Mobile, open picker | Proves mobile selector replaces desktop region index. | covered |
| `EMPN-018` | Mobile region picker full set | Mobile, picker open | Proves all 13 regions appear and unrelated record-demo regions are absent. | covered |
| `EMPN-019` | Mobile region switching | Mobile, switch through all regions | Proves selector value, label, and lazy region activation. | partially covered |
| `EMPN-020` | Mobile Identity carousel | Mobile, Identity | Proves carousel horizontal scroll and three cards. | covered |
| `EMPN-021` | Mobile Workflows carousel | Mobile, Workflows | Proves carousel applies to add-card section. | covered |
| `EMPN-022` | Mobile Views carousel | Mobile, Views | Proves carousel applies to another add-card section. | needs evidence |
| `EMPN-023` | Mobile Catalogs carousel | Mobile, Catalogs | Proves carousel applies to catalog add-card section. | needs evidence |
| `EMPN-024` | Mobile Permissions carousel | Mobile, Permissions | Proves carousel works for permission roles. | needs evidence |
| `EMPN-025` | Mobile high nested item count | Mobile fixture with 20 nested items | Proves carousel remains usable at high count. | needs fixture |
| `EMPN-026` | Mobile long nested card labels | Mobile fixture with long labels/descriptions | Proves card wrapping/truncation and no vertical scroll trap. | needs fixture |
| `EMPN-027` | RTL desktop navigation | RTL desktop | Proves region and nested navigation alignment. | needs evidence |
| `EMPN-028` | RTL mobile carousel | RTL mobile | Proves carousel direction and snap behavior in RTL. | needs evidence |
| `EMPN-029` | Zoomed desktop navigation | 200% zoom or equivalent | Proves region/nested navigation remains usable. | needs evidence |
| `EMPN-030` | Text-spacing navigation | WCAG text-spacing override | Proves labels do not overlap or clip. | needs evidence |

## High-Risk Batch

Review first:

- `EMPN-001`
- `EMPN-002`
- `EMPN-015`
- `EMPN-016`
- `EMPN-017`
- `EMPN-020`
- `EMPN-021`
- `EMPN-025`
- `EMPN-026`
- `EMPN-028`

