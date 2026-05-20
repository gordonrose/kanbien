# Entity Management Page Detail Panel Reference Pack

## Purpose

Define the detail-panel reference states for the `entity_management_page`
template. Review this pack when inspecting canonical renderings for generated
forms, derived fields, collapsible sections, workflow builder behavior,
attribute modeling, placements, permissions, and action models.

## Scope

- Family:
  `entity-management-page`
- Child matrix:
  detail panel contract
- Status:
  review-candidate reference pack
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/entity-management-page-detail-panel-behavior-lock.md`
- Parent index:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`

## Reference State IDs

Use prefix `EMPD-*`.

| Ref ID | State | Route / setup | Why it exists | Evidence status |
| --- | --- | --- | --- | --- |
| `EMPD-001` | Identity Primary Details baseline | Identity, Primary Details | Proves initial field anatomy and stable/system-managed fields. | partially covered |
| `EMPD-002` | Identity Owning Feature baseline | Identity, Owning Feature | Proves feature drawer-select and derived fields. | needs evidence |
| `EMPD-003` | Identity Source Authority baseline | Identity, Source Authority | Proves authority posture, markdown posture, and migration status fields. | partially covered |
| `EMPD-004` | Primary Details long text | Long entity name/description values | Proves wrapping and field sizing. | needs fixture |
| `EMPD-005` | Owning Feature derived visible | Select/fixture with owning feature available | Proves derived route/capability fields reveal and sync. | needs evidence |
| `EMPD-006` | Views details collapsed | Views, List views, all sections collapsed | Proves collapsed section baseline. | partially covered |
| `EMPD-007` | View details open | Views, List views, View details open | Proves view name/description and card sync. | partially covered |
| `EMPD-008` | View location open | Views, Location section open | Proves route name, preview, and location fields. | needs evidence |
| `EMPD-009` | View access open | Views, Access section open | Proves role eligibility and access posture. | partially covered styling only |
| `EMPD-010` | View workflow-status visibility | Views, status visibility toggles | Proves status hide/show without removing model. | needs evidence |
| `EMPD-011` | View actions selector | Views, Actions section | Proves generated action selector behavior. | needs evidence |
| `EMPD-012` | View attributes selector | Views, Attributes section | Proves attribute selector behavior. | needs evidence |
| `EMPD-013` | View placements selector | Views, Placements section | Proves placement selector behavior. | needs evidence |
| `EMPD-014` | Workflow details collapsed/open | Workflows, Intake | Proves section toggle and one-open-at-a-time behavior. | partially covered |
| `EMPD-015` | Workflow builder base status | Workflows, Intake builder | Proves fixed create status, Base badge, no remove. | partially covered |
| `EMPD-016` | Workflow status add | Add second status | Proves generated status name and derived label/description keys. | partially covered |
| `EMPD-017` | Workflow status move | Multiple statuses, move up/down | Proves ordering controls. | needs evidence |
| `EMPD-018` | Workflow status remove | Multiple statuses, remove non-base | Proves removable status behavior. | needs evidence |
| `EMPD-019` | Workflow subworkflow on | Toggle subworkflow | Proves parent workflow/status controls reveal. | partially covered |
| `EMPD-020` | Workflow links drawer-select | Open links selector | Proves All/status options and drawer-select behavior. | partially covered |
| `EMPD-021` | Relationship detail baseline | Relationships region | Proves relationship metadata and direction/cardinality fields. | needs evidence |
| `EMPD-022` | Attribute identity metadata | Attributes, first attribute | Proves key/name/type/cardinality fields. | needs evidence |
| `EMPD-023` | Attribute privacy/security dependencies | Toggle classifications | Proves dependent fields appear only when required. | needs evidence |
| `EMPD-024` | Attribute validation rules | Add/remove/change validation rule | Proves validation rule detail derivation. | needs evidence |
| `EMPD-025` | Attribute searchable off | Searchable disabled | Proves search config hidden. | needs evidence |
| `EMPD-026` | Attribute searchable on | Searchable enabled | Proves operators/storage/index fields visible. | needs evidence |
| `EMPD-027` | Catalog metadata baseline | Catalogs, Status catalog | Proves catalog key, label, scope, and impact. | needs evidence |
| `EMPD-028` | Catalog option builder | Add/move/remove option | Proves option row lifecycle. | needs evidence |
| `EMPD-029` | Display placement baseline | Display, Primary details | Proves secondary nav toggle, entity source, placement sections. | needs evidence |
| `EMPD-030` | Display placement section builder | Add/move/remove section | Proves section builder lifecycle. | needs evidence |
| `EMPD-031` | Permission role baseline | Permissions, LLM | Proves role identity and family grouping. | needs evidence |
| `EMPD-032` | Permission family enabled | Enable family | Proves capability list and bulk controls. | needs evidence |
| `EMPD-033` | Permission family disabled | Disable family | Proves capability list hides and state remains clear. | needs evidence |
| `EMPD-034` | Generation model baseline | Generation Model | Proves generated model fields and toggles. | needs evidence |
| `EMPD-035` | Compliance model baseline | Compliance Model | Proves compliance toggles and evidence keys. | needs evidence |
| `EMPD-036` | Migration model baseline | Migration Model | Proves migration posture fields. | needs evidence |
| `EMPD-037` | Action model record capability | Action Models - Record, List/Create | Proves action model sections and route/method facts. | needs evidence |
| `EMPD-038` | Action model error cards | Open action error card | Proves error detail expansion and long route/error text. | needs evidence |
| `EMPD-039` | Action model structure capability | Action Models - Entity Structure | Proves read-only structure capability model. | needs evidence |
| `EMPD-040` | Readonly/disabled sweep | All model sections | Proves locked fields remain legible and non-editable. | needs evidence |
| `EMPD-041` | Long labels and long values | Long localized labels/values across fields | Proves wrapping/no overlap/no horizontal overflow. | needs fixture |
| `EMPD-042` | 200% zoom detail panel | Zoomed desktop/mobile | Proves generated forms reflow and remain operable. | needs evidence |
| `EMPD-043` | Text-spacing detail panel | WCAG text spacing override | Proves field tile rhythm survives spacing changes. | needs evidence |
| `EMPD-044` | RTL detail panel | RTL desktop/mobile | Proves form alignment and grouped controls mirror appropriately. | needs evidence |
| `EMPD-045` | Dark-theme detail panel | Dark theme across field cards, accordions, and builders | Proves detail surfaces, disabled fields, and generated controls keep AA contrast. | needs evidence |
| `EMPD-046` | Tooltip/truncated field labels | Long field labels in cards, accordions, status rows, and action models | Proves any truncated field label exposes the shared tooltip and preserves accessible names. | needs fixture |
| `EMPD-047` | WCAG focus-visible detail sweep | Keyboard traversal through all input types, toggles, accordions, and builder controls | Proves focus is visible, ordered, and not clipped inside scroll regions. | needs evidence |
| `EMPD-048` | WCAG target-size detail sweep | Mobile/touch review of toggles, accordions, icon controls, and builder rows | Proves controls meet WCAG 2.2 AA target-size expectations or have documented spacing exceptions. | needs evidence |
| `EMPD-049` | Mobile long-form page scroll | Mobile detail panel with long content and open builder section | Proves page-level scroll remains the mobile scroll owner while controls remain reachable. | needs evidence |
| `EMPD-050` | High generated field count | Fixture with many generated fields in one detail panel | Proves form layout remains bounded and lazy nested panels avoid hidden heavy DOM. | needs fixture |

## High-Risk Batch

Review first:

- `EMPD-001`
- `EMPD-007`
- `EMPD-015`
- `EMPD-019`
- `EMPD-023`
- `EMPD-024`
- `EMPD-029`
- `EMPD-032`
- `EMPD-037`
- `EMPD-041`
- `EMPD-042`
- `EMPD-045`
- `EMPD-046`
- `EMPD-047`
- `EMPD-049`

## Required Pressure States

- long labels, long values, and unbroken strings with tooltip/truncation where applicable
- high generated field and builder-row counts
- RTL desktop and mobile
- dark theme
- 200% zoom and WCAG text spacing
- keyboard focus order and visible focus
- WCAG 2.2 AA target-size review
- mobile page-level scroll with long details
