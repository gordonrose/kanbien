# Record Management List-Centric Template

## Scope

- Template name:
  `record_management_list_centric`
- Status:
  template-demo
- Owner:
  Codex with design-system review pending
- Current design-system surface:
  `/design-system/templates/record_management_list_centric`
- Source pattern:
  `/design-system/patterns/chat-workspace`

## Intent

- What user or operator need does this template serve?
  Provide a record-heavy page shape where governed filters, layer navigation,
  status-organized records, and the selected record drawer stay visible as one
  operating surface.
- Why is this derived from the chat workspace?
  The chat workspace already proves the expandable page frame, conversation
  index, entity selector, status list, and row drawer choreography. This
  template reuses that seam with record-management labels instead of copying
  the interaction model into a new page-local implementation.

## Template Anatomy

- Required parts:
  page-shell chrome, record list, and selected-record drawer
- Optional parts:
  generated filters, layer selector, view selector, collection-level actions,
  operational status bar, and domain-specific detail panels
- Layout structure:
  expanded desktop view with the record list and drawer in a default 1:3 ratio;
  mobile/tablet should use a focused flow rather than compressed desktop
  columns

## Current Demo Contract

- The demo uses `src/frontend/designSystem/assets/chatWorkspaceMockConsumer.mjs`
  as the render/controller seam.
- The template-specific adapter is
  `src/frontend/designSystem/assets/recordManagementListCentricTemplate.mjs`.
- The demo adapter consumes the dummy Organization fixture at
  `record-management-list-centric-organization-demo-fixture.json` through the
  design-system route
  `/design-system/templates/record_management_list_centric/organization-demo-fixture.json`.
- The fixture currently proves generated filter cards, fixture-backed
  parent/current/child layer navigation, single eligible-view omission,
  operational status tabs, fixture record rows, and selected-record drawer
  posture.
- The route intentionally remains a design-system template demo, not a
  signed-off app-consumable page family.
- Real app adoption still requires the normal behavior lock, reference pack,
  verification checklist, and adoption artifact chain for the consuming
  surface.

## Draft Region Contract

This draft template should become the source of approved placement keys for
entities that select the `record_management_list_centric` management pattern.
Entity definitions may reference these keys once the template contract is
signed off; they must not invent entity-local region or sub-region names.

Generation rule:

- Template regions should appear only when their entity-definition source has
  eligible content for that region. Do not render empty or collapsed placeholder
  chrome for `filter_bar`, `layer_selector`, `view_selector`,
  `primary_capability_area`, or `status_bar`.
- `status_bar` appears only when the entity has an operational lifecycle/status
  set with at least one status eligible for status-tab behavior.
- `record_list` and `drawer` remain the required behavioral regions for the
  list-centric management template.

Top-level regions:

| Region key | Purpose | Entity-definition source |
| --- | --- | --- |
| `filter_bar` | Opens executable filter cards for supported filters. | `searchModel`, filterable attributes, facets, relationship-backed option sources. |
| `layer_selector` | Shows the current layer and navigable parent/child entity layers. | `relationships`, entity topology, current route context. |
| `view_selector` | Switches approved views for the current entity collection. | `surfaceModel.collectionViews`, role eligibility, default view posture, status/sub-status membership. |
| `primary_capability_area` | Hosts collection-level record capabilities. | `actionModel` collection actions such as create, sort, export, and bulk upload. |
| `status_bar` | Displays operational statuses and counts, and acts as a status filter. | `operationalStatusSet`, tab eligibility, count source, attention posture. |
| `record_list` | Lists records visible to the current actor. | list/read capability results, authz scope, filters, search, sort, list-row placements. |
| `drawer` | Displays and edits the selected record. | read/update capability results, `presentationGroups`, attribute placements, relationship placements, selected-record actions. |

Sub-regions:

| Parent region | Sub-region key | Purpose | Entity-definition source |
| --- | --- | --- | --- |
| `primary_capability_area` | `secondary_capability_area` | Reserved action strip for additional collection or selected-record capabilities. | approved `actionModel` actions for the header or side rail. |
| `record_list` | `record_list_card` | Repeatable record card or row. | identifier, record name, status, and optional additional row fields. |
| `drawer` | `record_header` | Selected-record title, active group context, and primary record actions. | selected record identity, active group metadata, selected-record actions. |
| `drawer` | `drawer_group_list` | Navigation list of entity presentation groups. | `presentationGroups`, group order, item counts, group label and description. |
| `drawer` | `drawer_subgroup_list` | Optional nested list inside the active group. | relationship placements, repeated values, child/domain relationship metadata. |
| `drawer` | `drawer_attribute_field_form` | Attribute value display and edit area. | attribute placements, approved element keys, validation, mutability, visibility mode. |

## Entity Definition Contract Notes

- The status bar is populated from `operationalStatusSet`; it should not be a
  freeform tab strip. If the entity has no operational lifecycle/status model,
  the status bar is omitted rather than rendered empty.
- Operational status display should be linked to the entity view model because
  relevant statuses may differ by selected view, role, or context. If no views
  are configured or no view selector is visible, and the entity has more than
  one operational status type/set, the entity definition must declare a default
  status display for this template.
- Status tabs act as filters for the record list. System lifecycle states such
  as archived, deleted, pending cleanup, or cleanup failed should not appear in
  the normal status bar unless a view explicitly models them as operationally
  visible.
- The filter bar is populated from `searchModel` and approved filterable
  attributes. Relationship-backed options are allowed when the relationship
  contract defines the option source. If no filters are defined, the filter bar
  is omitted.
- Filter eligibility is not the same as internal searchability. A searchable
  attribute appears in the filter bar only when `searchModel` declares an
  approved generated-filter behavior for it.
- Generated filter declarations live in `searchModel.generatedFilters[]`.
  Attributes own intrinsic type, search, relationship, lifecycle, validation,
  privacy, security, and mutability facts; `searchModel.generatedFilters[]`
  owns generated UI behavior, ordering, target affordance, default visibility,
  and template routing.
- Text search should use the page-shell search experience rather than the
  filter bar.
- Operational lifecycle/status filtering should use `status_bar` rather than
  the filter bar.
- Collection or category filters should use the established drawer-select
  filter experience.
- A drawer-select filter requires a filter card with label, short description,
  and selected count. The opened drawer requires a title, optional
  search-within-options input, selected section, available section, selected
  count, clear/remove behavior, apply behavior unless immediate-apply is later
  signed off, and empty states for no selected values or no available matches.
- Date and date-range filters should use the established date selection
  experience.
- Value-range filters need a signed-off range filter experience before they can
  be approved for generated pages.
- The layer selector is populated from top-level parent and child
  relationships. If no navigable parent or child relationships are defined, the
  layer selector is omitted. Sibling navigation remains derived or deferred
  until a real use case requires a governed key.
- A relationship appears in the layer selector only when it has
  `navigationPosture: navigable` and the selected template approves that
  relationship category for layer navigation.
- Parent and child relationship navigation is approved for v1. Sibling
  navigation remains deferred.
- The view selector is populated from approved alternate views in
  `surfaceModel.collectionViews`. If no alternate views are approved, the view
  selector is omitted.
- A view is a defined model on the entity, not an ad hoc page tab. The
  `view_selector` appears only when `surfaceModel` defines two or more approved
  collection views eligible for the current actor and context. If zero or one
  view is eligible, the selector is omitted.
- Views may be role-suitable or context-specific; generated pages must resolve
  eligibility from governed view metadata and current actor/context rather than
  inventing views from available fields, statuses, or relationships.
- A collection view declares which operational statuses and sub-statuses belong
  to the view. The active view should constrain status-bar membership, record
  counts, and generated status filtering rather than allowing the page to
  assemble status tabs independently.
- The primary capability area is populated from approved collection-level
  actions. If no eligible collection-level actions are defined or authorized, the
  region is omitted.
- The primary capability area hosts collection-level actions only. Selected
  record actions belong in `drawer.record_header` or another approved drawer
  capability slot.
- Direct primary actions should be limited to a small number of high-frequency
  collection commands. Secondary collection actions should live behind an
  expandable menu using `secondary_capability_area`.
- The default direct-primary action count is one. The maximum direct-primary
  action count is three. Eligible actions beyond that limit must move into the
  secondary expandable menu.
- Eligible collection-level candidates include create, import, export, bulk
  update, bulk lifecycle transition, refresh/reconcile, validate collection,
  generate/report, request review/approval, and save view when those actions are
  declared in `actionModel` and approved for the current actor/context.
- Relationship attributes should default to a presentation group so the drawer
  can render them predictably.
- Drawer groups and drawer sub-groups are distinct from regions. Regions and
  sub-regions are page-template placement areas; groups are entity presentation
  metadata.
- The record list requires deterministic display identity. Entity definitions
  should declare record title, subtitle, and identifier attribute keys for
  generated surfaces. The title/display attribute must also have an approved
  `record_list.record_list_card` placement. If no valid title/display attribute
  is declared, entity creation or entity-definition activation should fail for
  this template before generated page output is attempted.
- Desktop expanded layout defaults to a `1:3` record-list-to-drawer ratio. The
  list keeps enough width for title, subtitle, status badge, and a small number
  of approved secondary markers; the drawer gets layout priority for grouped
  fields, nested relationship lists, edit forms, and selected-record actions.
- Mobile and tablet layouts do not preserve the desktop ratio; they should use
  the signed-off responsive pattern for stacked, drill-in, or equivalent focused
  navigation. The default mobile/tablet posture is list/search/filter/status
  first, with the selected record opening into a focused drawer/detail view
  where group and subgroup navigation remain available.
- Filters and secondary actions should use overlays/drawers or the signed-off
  mobile equivalent. Optional regions still follow the no-empty-chrome rule, and
  status/filter controls should remain reachable without blocking the
  selected-record task.
- Optional secondary card fields render only through explicit
  `record_list.record_list_card` placements. When the active view has a visible
  status bar, the card may show the active operational status through an
  approved status-badge placement.
- The drawer is a required behavioral region, but selected-record content
  renders only after a record is selected. Drawer content is generated from the
  selected-record read result, `surfaceModel.displayIdentity`,
  `presentationGroups`, approved drawer attribute/relationship placements, and
  selected-record actions from `actionModel`.
- The drawer `record_header` displays selected-record identity and
  selected-record actions. It uses the declared title, optional subtitle,
  optional subdued/support-facing identifier, optional active operational status
  badge, primary selected-record actions, and secondary selected-record actions
  behind an expandable menu.
- Selected-record edit should always be a primary header action when the actor
  can edit and the selected record state allows editing. Destructive or uncommon
  selected-record actions default to the secondary menu unless explicitly
  promoted by the view/action placement.
- The drawer must not automatically render every attribute in the entity
  definition. Attributes with no approved drawer placement remain part of the
  entity definition but are omitted from the generated drawer.
- Empty selection must use the signed-off design-system unselected/empty
  posture for this template; generated pages must not invent entity-specific
  empty drawer layouts.
- `drawer_group_list` renders top-level `presentationGroups` that have visible
  drawer fields, relationship placements, or subgroups for the current
  actor/context. Empty groups are omitted, and group order comes from
  `presentationGroups.displayOrder`. Group labels and descriptions come from
  group metadata.
- Groups are presentation-only. They do not create permissions, lifecycle,
  storage, relationship ownership, or semantic rules. Placement references to
  unknown groups fail validation, and duplicate group order should fail
  validation rather than relying on hidden tie-break behavior.
- `drawer_subgroup_list` is used for nested or repeatable related-record
  collections inside the active group. Repeated related-record collections must
  declare their visible item fields deterministically; the drawer must not infer
  nested list fields from the target entity's full attribute set.
- A subgroup belongs to exactly one `presentationGroup` and must declare its
  source type, such as relationship-backed collection, repeated attribute value,
  computed/derived collection, or an approved manually defined grouping.
  Relationship-backed subgroups must reference a governed relationship key.
- Subgroups must declare item display fields explicitly and must not render the
  target entity's full default card automatically. Empty subgroups are omitted
  unless the selected template/view explicitly requires an empty state for
  create/add flows.
- Subgroup order is scoped within the parent group. V1 allows one nested
  subgroup level; deeper nesting is deferred unless a specific pattern is
  approved.
- Entity-specific drawer structures are instances of this generic
  group/subgroup model. The template does not require Organization-like groups;
  each entity defines its own `presentationGroups`, drawer placements,
  relationship subgroups, and nested item fields using approved template keys.
- Branding fields such as logos and icons require the repo's asset consumer
  decision record before any real upload, read, rendering, delivery,
  replacement, deletion, or publishing behavior is implemented.
- Attribute values and labels render in group order using approved element
  keys. Editing uses the same placement area unless a later signed-off
  template explicitly separates read and edit surfaces.
- `drawer_attribute_field_form` renders only approved drawer placements for the
  active group/subgroup and current actor/context. Element keys must be
  compatible with attribute type, cardinality, options source, validation,
  mutability, privacy/security posture, and the selected template contract.
- The entity definition describes what can be editable in principle. Actual
  rendered editability is determined by the intersection of attribute
  mutability, placement `interactionMode`, action/capability availability,
  selected record state, current actor/user authorization, and current context
  boundary. Current-user authorization is decisive; generated UI must not expose
  editable controls unless all required gates pass.
- Relationship behavior is governed by use. Layer navigation, drawer subgroups,
  and field/reference display are separate contract uses. A relationship being
  navigable does not automatically make it appear in the drawer, and a
  relationship appearing in the drawer does not automatically make it appear in
  the layer selector.
- Relationship edit actions such as attach, detach, reorder, replace, reassign,
  or move must come from `actionModel`. Relationship ownership, lifecycle
  impact, boundary, navigation posture, and target visibility metadata constrain
  navigation, display, and actions. Cross-boundary relationships deny by
  default unless explicitly approved.
- Collection-level actions belong in the primary capability area. Selected
  record actions belong in the drawer contract.

## Open Signoff Decisions

- Confirm whether the filter bar is a reserved layout column, collapsible rail,
  or overlay at desktop and mobile widths.
- Confirm the mobile behavior for status tabs, filters, list, and drawer so no
  region blocks the primary task.
- Confirm the default record-list fields: identifier, record name, and
  operational status are expected defaults; additional row fields must be
  explicit placements.
- Align demo keys with canonical entity-definition casing and catalogs before
  signoff.
- Decide whether the root/governance view and everyday record-management view
  are template variants or separate template contracts.

## Template Validation Overlay

`record_management_list_centric` validation is a template-specific overlay on
top of governed entity-definition schema validation. It must not duplicate the
whole entity-definition validation model.

The overlay validates only what this template uniquely requires, including:

- required display identity for generated record cards and drawer headers
- approved region, sub-region, and element combinations
- omission of optional regions with no eligible source content
- maximum three direct primary collection actions
- maximum three direct primary selected-record header actions
- selected-record edit as primary when edit is allowed
- filter behavior routing to approved affordances
- blocked `value_range` filters until a range filter experience is signed off
- unambiguous active view/status mapping
- drawer group/subgroup visibility before rendering
- one-level subgroup nesting in v1
- layer navigation limited to approved parent/child navigable relationships
- signed-off responsive behavior before app adoption

## Signoff Checklist

The Record Management List-Centric Contract v1 is not signed off until:

- required and conditional regions/sub-regions are documented
- entity-definition source sections for each region/sub-region are documented
- allowed design-system elements per region/sub-region are documented or
  explicitly deferred
- default placement rules are documented
- collection and selected-record capability slots are documented
- filter behavior routing is documented, including blocked `value_range`
- status bar behavior is linked to active view/default status display
- record list/card behavior is documented, including display identity
- drawer header, group list, subgroup list, and field form behavior are
  documented
- relationship navigation/display/action separation is documented
- desktop `1:3` list-to-drawer ratio and responsive focused-flow behavior are
  documented
- template validation overlay checks are documented
- dummy Organization fixture exists and parses as JSON
- design-system demo route reflects the contract closely enough for review
- desktop and mobile verification evidence exists for the design-system route
- asset-related demo fields remain planning/demo only unless an asset consumer
  decision record is approved
- app adoption remains blocked until the behavior lock, reference pack,
  verification checklist, and adoption artifact chain are complete for the
  consuming surface

## Source Of Truth

- Template route:
  `src/frontend/designSystem/templates/record_management_list_centric/index.html`
- Template adapter:
  `src/frontend/designSystem/assets/recordManagementListCentricTemplate.mjs`
- Regression coverage:
  `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts`
