# Entity Management Page Navigation Behavior Lock

## Purpose

Capture the navigation behavior for the `entity_management_page` template:
top-level regions, mobile selector, nested list cards, carousel behavior,
active state, and resizer behavior.

## Scope

- Family:
  `entity-management-page`
- Slice:
  navigation contract
- Status:
  review-candidate

## Behavior Review

| ID | Behavior statement | Status | Current evidence / note |
| --- | --- | --- | --- |
| `EMP-NAV-001` | The template exposes a fixed ordered region set: Identity, Workflows, Views, Relationships, Attributes, Catalogs, Display, Permissions, Generation Model, Compliance Model, Migration Model, Action Models - Record, and Action Models - Entity Structure. | `review-candidate` | Visual test asserts the region order and absence of generic record-detail regions. |
| `EMP-NAV-002` | Top-level desktop region navigation uses tab semantics: triggers expose `role="tab"`, active state, selected state, header label, and header description. | `review-candidate` | Current renderer uses `data-record-management-region-trigger`, `aria-selected`, and panel ids. Needs focused a11y test. |
| `EMP-NAV-003` | Activating a region updates the visible panel, selected trigger state, mobile selector value, and drawer header summary. | `review-candidate` | `activateRegion` updates trigger classes, `aria-selected`, panel hidden state, select value, and drawer title/description. |
| `EMP-NAV-004` | Inactive top-level regions must remain lightweight until selected; selecting a region materializes the region content once. | `review-candidate` | Lazy region renderer now sets one rendered region at initial load and materializes selected regions on demand. |
| `EMP-NAV-005` | Desktop region index may scroll vertically when there are more regions than can fit, and long labels must wrap rather than truncating into unusable text. | `review-candidate` | Visual test asserts region index overflow-y and wrapped long action-model label. |
| `EMP-NAV-006` | Mobile hides the desktop region index and replaces it with a full-width form-select style region picker. | `review-candidate` | Mobile test asserts mobile header visible, region index hidden, select value and label synced. |
| `EMP-NAV-007` | Mobile region picker must include all entity-management regions and exclude record-management demo regions such as members, legal, locations, and branding. | `review-candidate` | Mobile visual test asserts included and excluded options. |
| `EMP-NAV-008` | Each region with nested content uses the same nested-list picker structure instead of custom section-specific markup. | `approved-input` | Recent duplication cleanup moved Identity onto `renderNestedListPicker` and removed special entity sublist CSS. |
| `EMP-NAV-009` | Nested card selection updates `aria-pressed`, active visual state, visible nested panel, and lazy panel materialization. | `review-candidate` | `activateNestedListItem` updates triggers and panels and calls lazy materialization. Needs direct keyboard/a11y coverage. |
| `EMP-NAV-010` | Nested cards may include an add card when the region supports item creation; the add card participates visually in the same card list. | `review-candidate` | Workflows, Views, Catalogs, and Permissions currently render add cards where relevant. |
| `EMP-NAV-011` | Mobile nested card lists use the approved horizontal carousel across all sections, not only Identity. | `approved-input` | User confirmed carousel should stay and apply across the board. Test asserts Identity and Workflows carousel geometry. |
| `EMP-NAV-012` | The mobile carousel owns horizontal scroll only; it must not own page vertical scroll. | `approved-input` | CSS keeps card list `overflow-x: auto`; mobile scroll test asserts vertical scroll belongs to page. |
| `EMP-NAV-013` | Desktop nested list cards and drawer share a resizable two-column layout with a keyboard and pointer resizer. | `review-candidate` | Desktop test drags the nested resizer and observes secondary nav width growth. |
| `EMP-NAV-014` | The nested resizer is hidden on mobile because carousel navigation replaces the desktop secondary-nav width relationship. | `review-candidate` | CSS hides `.record-management-nested-list-resizer` under mobile breakpoint. |
| `EMP-NAV-015` | Evidence/AI mode collapses top-level and nested navigation lanes out of the way so the active detail panel receives the left half of the desktop split. | `approved-input` | Recent browser metric showed body grid `965px 965px` and nested drawer `965px`, fixing the squashed panel. |

## Open Review Questions

- Should nested list activation support arrow-key roving focus, or is standard
  tab/button navigation enough for this seam?
- Should mobile region picker search/filter if the region list grows beyond the
  current fixed set?
- Should nested carousel cards snap one card at a time or allow free horizontal
  scroll?

## Evidence Gaps

- Keyboard behavior for region tabs, mobile selector, nested cards, and resizer.
- RTL carousel/resizer behavior.
- Magnified mobile carousel behavior beyond the current mobile geometry smoke.

