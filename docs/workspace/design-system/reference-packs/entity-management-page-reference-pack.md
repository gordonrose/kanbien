# Entity Management Page Reference Pack

## Purpose

Define the reference states that must be reviewed before the
`entity_management_page` design-system template can become an active,
app-consumable seam.

This pack is the roll-up index. The concrete browser states live in child
reference packs so reviewers can inspect one canonical batch at a time instead
of walking hundreds of states in one sitting.

It is not a sign-off claim yet.

## Scope

- Family:
  `entity-management-page`
- Status:
  review-candidate reference pack
- Current design-system route:
  `/design-system/templates/entity_management_page`
- Related behavior-lock index:
  `docs/workspace/design-system/behavior-locks/entity-management-page-behavior-lock-index.md`
- Related behavior-lock slices:
  - `docs/workspace/design-system/behavior-locks/entity-management-page-outer-page-behavior-lock.md`
  - `docs/workspace/design-system/behavior-locks/entity-management-page-navigation-behavior-lock.md`
  - `docs/workspace/design-system/behavior-locks/entity-management-page-detail-panel-behavior-lock.md`
  - `docs/workspace/design-system/behavior-locks/entity-management-page-collection-item-behavior-lock.md`
  - `docs/workspace/design-system/behavior-locks/entity-management-page-evidence-ai-behavior-lock.md`
  - `docs/workspace/design-system/behavior-locks/entity-management-page-performance-behavior-lock.md`
- Related verification:
  - `docs/workspace/design-system/verification/entity-management-page-verification-checklist.md`
  - `docs/workspace/design-system/verification/entity-management-page-wcag-2-2-aa-checklist.md`
- Child reference packs:
  - `docs/workspace/design-system/reference-packs/entity-management-page-outer-page-reference-pack.md`
  - `docs/workspace/design-system/reference-packs/entity-management-page-navigation-reference-pack.md`
  - `docs/workspace/design-system/reference-packs/entity-management-page-detail-panel-reference-pack.md`
  - `docs/workspace/design-system/reference-packs/entity-management-page-collection-item-reference-pack.md`
  - `docs/workspace/design-system/reference-packs/entity-management-page-evidence-ai-reference-pack.md`
  - `docs/workspace/design-system/reference-packs/entity-management-page-performance-reference-pack.md`
- Current executable coverage:
  `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts`

## Rule Source

The behavior-lock slices remain the rule source. This reference pack names the
browser states needed to prove the rules.

Do not treat this pack as app-adoption approval until:

- the behavior-lock slices are reviewed
- the verification checklist is completed
- WCAG 2.2 AA checks are completed
- demo fixture data is separated from reusable seam code
- an adoption contract states the app-consumable API

## Child Reference Matrices

| Child matrix | Artifact | State count | Review focus |
| --- | --- | ---: | --- |
| Outer page | `entity-management-page-outer-page-reference-pack.md` | 24 | Shell ownership, page framing, desktop/mobile scroll ownership, app-consumable boundary. |
| Navigation | `entity-management-page-navigation-reference-pack.md` | 36 | Region index, mobile region picker, nested cards, carousel, active states, resizer. |
| Detail panel | `entity-management-page-detail-panel-reference-pack.md` | 50 | Generated form panels, collapsible sections, derived fields, workflow builder, attributes, permissions, action models. |
| Collection item | `entity-management-page-collection-item-reference-pack.md` | 38 | Add/copy/delete, card sync, panel sync, workflow/catalog/permission item lifecycles. |
| Evidence/AI | `entity-management-page-evidence-ai-reference-pack.md` | 36 | Evidence and AI modes, target affordances, desktop split, mobile overlays, focus and mutual exclusion. |
| Performance | `entity-management-page-performance-reference-pack.md` | 32 | Lazy rendering, render-ready signal, DOM/control budgets, visited-region growth, module/fixture boundaries. |

Total current child states:
`216`

This is still a review-candidate inventory. It should grow when dedicated
canonical fixtures introduce broader app-data, high-count, localization, and
error/denied/loading states.

## Roll-Up State IDs

Use the prefix `EMPR-*` for entity-management-page reference states.

The roll-up states below are not the full matrix. They are the cross-slice
summary states for planning and triage. Reviewers should use the child packs
for canonical inspection.

| Ref ID | State | Route / setup | Why it exists | Evidence status | Behavior slices |
| --- | --- | --- | --- | --- | --- |
| `EMPR-001` | Desktop initial Identity baseline | `/design-system/templates/entity_management_page`, desktop width, normal theme | Proves outer shell, initial region, initial nested panel, and first useful render | partially covered | Outer, Navigation, Detail, Performance |
| `EMPR-002` | Desktop full region index pressure | Desktop height constrained enough that all 13 region entries do not fit | Proves region index vertical scroll, long label wrapping, and no truncation-only failure | partially covered | Navigation, WCAG |
| `EMPR-003` | Desktop nested resizer | Desktop, open Action Models - Entity Structure, drag/keyboard resizer | Proves two-column nested layout and secondary nav width adjustment | partially covered pointer; keyboard needs evidence | Navigation, WCAG |
| `EMPR-004` | Desktop Workflows item lifecycle | Desktop, Workflows region, add/copy/rename/delete workflow | Proves repeated item creation, card sync, panel sync, and workflow builder defaults | partially covered | Collection Item, Detail |
| `EMPR-005` | Desktop Views detail sections | Desktop, Views region, List views item, open View details and other sections | Proves section collapse, section anatomy, route/location/access/action/attribute/placement grouping | partially covered | Detail, Navigation |
| `EMPR-006` | Desktop Attributes generated form pressure | Desktop, Attributes region, long generated attribute form | Proves generated field groups, validation rows, privacy/security dependencies, search dependencies, and detail scroll | needs evidence | Detail, WCAG |
| `EMPR-007` | Desktop Catalogs item lifecycle | Desktop, Catalogs region, add/copy/delete catalog, add/move/remove option | Proves catalog repeated item behavior and option builder behavior | needs evidence | Collection Item, Detail |
| `EMPR-008` | Desktop Permissions role lifecycle | Desktop, Permissions region, add/copy/delete role, select/deselect capability family | Proves role item lifecycle, card sync, view-role resync, and capability family behavior | needs evidence | Collection Item, Detail |
| `EMPR-009` | Desktop evidence split | Desktop dark and normal themes, evidence mode open on a field | Proves evidence mode, target affordance, equal split, and no details-panel squashing | partially covered | Evidence/AI, Outer, Navigation |
| `EMPR-010` | Desktop AI split | Desktop, AI mode open on a field | Proves AI mode, guidance drawer, mutual exclusion with evidence/edit, and usable split | needs evidence | Evidence/AI |
| `EMPR-011` | Mobile initial page scroll | Mobile width, Identity baseline | Proves whole-page vertical scroll, bottom nav reachability, and no nested vertical scroll trap | covered by current visual test | Outer, Navigation, WCAG |
| `EMPR-012` | Mobile region picker | Mobile width, open region picker and switch through all regions | Proves mobile selector, region list completeness, excluded record-demo regions, lazy region materialization | partially covered | Navigation, Performance |
| `EMPR-013` | Mobile nested carousel across sections | Mobile width, Identity and Workflows at minimum; include Views/Catalogs in final pack | Proves approved horizontal carousel across nested sections and card snap behavior | partially covered | Navigation |
| `EMPR-014` | Mobile long content and high scroll pressure | Mobile width, long nested detail content, bottom nav present | Proves page-level scroll remains usable when top menus and bottom nav are present | partially covered | Outer, WCAG |
| `EMPR-015` | Mobile evidence overlay | Mobile width, evidence mode open | Proves evidence overlay behavior, underlying content suppression, close behavior, and bottom nav relationship | needs evidence | Evidence/AI, WCAG |
| `EMPR-016` | Mobile AI overlay | Mobile width, AI mode open | Proves AI overlay behavior and mutual exclusion with evidence/edit on mobile | needs evidence | Evidence/AI, WCAG |
| `EMPR-017` | Long labels and localization pressure | Desktop and mobile with long Latin labels, long unbroken tokens, and RTL labels | Proves wrapping, truncation recovery, no overlap, and no horizontal page overflow | needs evidence | Navigation, Detail, WCAG |
| `EMPR-018` | Lots of list items | Desktop and mobile with large region/nested item sets beyond current demo counts | Proves scroll ownership, virtual/lazy rendering assumptions, add-card placement, and carousel usability under larger lists | needs evidence | Navigation, Performance, WCAG |
| `EMPR-019` | Zoom and text spacing pressure | 200% browser zoom or equivalent magnification plus text-spacing override | Proves WCAG reflow, no clipping, visible controls, and usable page-level scroll | needs evidence | Outer, Navigation, Detail, WCAG |
| `EMPR-020` | Keyboard-only operation | Desktop and mobile equivalent, no pointer | Proves tab order, focus visible, region/nested activation, drawer-selects, add/copy/delete controls, evidence/AI close, and resizer keyboard behavior | needs evidence | All |
| `EMPR-021` | RTL review | Desktop and mobile, RTL direction | Proves shell alignment, region/nested navigation, carousel direction, resizer expectations, and evidence/AI panel placement | needs evidence | Outer, Navigation, Evidence/AI, WCAG |
| `EMPR-022` | Theme contrast review | Normal, dark, and desert where supported | Proves field, border, focus, evidence, AI, destructive, disabled, and readonly contrast | needs evidence | Detail, Evidence/AI, WCAG |
| `EMPR-023` | Lazy-render footprint baseline | Initial open before visiting inactive regions | Proves one region, one nested panel, bounded DOM/control counts, first useful render | covered by current visual test and manual measurement | Performance |
| `EMPR-024` | Lazy-render visited-region growth | Visit Workflows, Views, and a nested inactive item | Proves DOM grows only for visited regions/items and handlers initialize once | partially covered by smoke; needs executable lock | Performance, Navigation, Collection Item |

## High-Risk Review Batch

Review these first because they carry the most app-adoption risk:

- `EMPR-001` Desktop initial Identity baseline
- `EMPR-004` Desktop Workflows item lifecycle
- `EMPR-009` Desktop evidence split
- `EMPR-011` Mobile initial page scroll
- `EMPR-013` Mobile nested carousel across sections
- `EMPR-017` Long labels and localization pressure
- `EMPR-018` Lots of list items
- `EMPR-019` Zoom and text spacing pressure
- `EMPR-020` Keyboard-only operation
- `EMPR-023` Lazy-render footprint baseline

## Minimum Promotion Set

Before this family can move from `review-candidate` to `signed-off`, the
reference pack should have rendered evidence for at least:

- desktop normal theme
- desktop dark theme evidence split
- mobile normal theme
- mobile evidence overlay
- mobile page-level scroll with long detail content
- RTL desktop
- RTL mobile
- 200% zoom or equivalent magnification
- text spacing override
- long labels
- lots of nested list items
- keyboard-only operation
- initial lazy-render footprint

## Parity Rule

A future app consumer matches this pack only when it:

- consumes the design-system-owned render and behavior seam
- preserves the six behavior-lock slices or approved deviations
- preserves the required `EMPR-*` states or documented equivalents
- records any intentional deviation before app adoption
- does not copy the template markup, controller logic, or page-local CSS into
  app code

## Known Adoption Blockers

- `entityManagementPage.mjs` still mixes demo Organization fixture data with
  reusable render and behavior code.
- `chatWorkspaceRowDrawer.mjs` still imports the entity-management module
  eagerly for the current demo path.
- The app-consumable data adapter/API is not yet defined.
- Dedicated child canonical render surfaces now exist as review-candidate
  fallback routes; persistence-backed seeding, full fixture expansion, and
  hosted-surface pixel parity are still pending before sign-off.
