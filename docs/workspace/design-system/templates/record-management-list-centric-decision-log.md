# Record Management List-Centric Decision Log

Status:

- `planning_decision_log`
- Companion contract note:
  `docs/workspace/design-system/templates/record-management-list-centric-template.md`
- Scope: Record Management List-Centric Contract v1 planning decisions.
- Implementation status: design-system demo proof of concept in progress.
- Runtime/code changes: demo fixture is served through the design-system router
  and consumed by the `record_management_list_centric` template adapter.

## Purpose

Track decisions made while defining the
`record_management_list_centric` page-template contract so the contract can
later support deterministic generated entity management pages.

This log records decisions for the template contract only. It does not approve
app implementation, generated frontend adoption, migrations, routes,
permissions, persistence changes, or runtime behavior.

## Placement Model

Decision:

- Placement follows:
  `surface -> surfaceVariant -> region -> subRegion -> group -> element`
- `regionKey` and `subRegionKey` are page-template layout concepts.
- `groupKey` remains entity presentation metadata, sourced from
  `presentationGroups`.
- Entity definitions may select approved placement keys from the signed-off
  page-template contract, but must not invent entity-local surfaces, variants,
  regions, sub-regions, or elements.

Implication:

- Placement validation must check the selected template contract before a
  definition can be treated as valid for generated page output.

## Region Presence

Decision:

- Template regions should render only when their entity-definition source has
  eligible content for that region.
- Do not render empty or collapsed placeholder chrome for:
  - `filter_bar`
  - `layer_selector`
  - `view_selector`
  - `primary_capability_area`
  - `status_bar`
- `status_bar` appears only when the entity has an operational lifecycle/status
  set with at least one status eligible for status-tab behavior.
- `record_list` and `drawer` remain required behavioral regions for the
  list-centric management template.

Implication:

- Contract v1 needs explicit eligibility rules for every conditional region so
  generators do not guess based on partial metadata.

## Draft Region Set

Current top-level region keys:

| Region key | Current posture |
| --- | --- |
| `filter_bar` | Conditional. Appears only when eligible filters exist. |
| `layer_selector` | Conditional. Appears only when eligible relationship navigation exists. |
| `view_selector` | Conditional. Appears only when approved alternate views exist. |
| `primary_capability_area` | Conditional. Appears only when eligible collection-level actions exist. |
| `status_bar` | Conditional. Appears only when eligible operational status tabs exist. |
| `record_list` | Required behavioral region. |
| `drawer` | Required behavioral region. |

Current sub-region keys:

| Parent region | Sub-region key | Current posture |
| --- | --- | --- |
| `primary_capability_area` | `secondary_capability_area` | Conditional capability slot. |
| `record_list` | `record_list_card` | Required repeatable row/card sub-region. |
| `drawer` | `record_header` | Required selected-record header sub-region. |
| `drawer` | `drawer_group_list` | Required group navigation sub-region. |
| `drawer` | `drawer_subgroup_list` | Conditional nested relationship/repeated-value sub-region. |
| `drawer` | `drawer_attribute_field_form` | Required display/edit field sub-region. |

## Open Decision Queue

Work through each region and sub-region to define:

- eligible entity-definition source content
- allowed design-system elements
- default placement and ordering
- capability slots
- generation behavior when content is missing
- validation failures
- responsive/mobile behavior

Recommended discussion order:

1. `filter_bar`
2. `layer_selector`
3. `view_selector`
4. `primary_capability_area`
5. `status_bar`
6. `record_list` and `record_list_card`
7. `drawer` and drawer sub-regions
8. relationship navigation behavior
9. responsive/mobile behavior
10. validation failures
11. signoff checklist

## Filter Bar

Decision:

- `filter_bar` appears only when `searchModel` defines at least one
  user-facing, approved filter control.
- Attribute-level internal search/index metadata is not enough to make an
  attribute appear in the filter bar.
- A filterable attribute must declare how its filter behaves so generation can
  route it to the correct page affordance.

Filter behavior routing:

| Filter behavior | Page affordance | Current posture |
| --- | --- | --- |
| text search | Page-shell search experience | Do not render as a filter-bar filter. |
| lifecycle/status | `status_bar` | Do not render as a filter-bar filter when it is operational lifecycle/status. |
| collection/category selection | Filter drawer select experience | Use the established drawer-select pattern, such as the Org filter reference. |
| date or date range | Established date selection experience | Use the approved date/date-range picker pattern. |
| value range | Range filter experience | Needed but not yet defined. |

Implication:

- `searchModel` needs a generated-filter declaration separate from raw
  attribute `search.searchable`.
- Attribute filter declarations should include a controlled filter behavior key
  that maps to approved design-system elements or redirects to another region.
- Validation should fail when an entity definition marks an attribute as a
  generated filter but its behavior has no approved template affordance.

Source-of-truth decision:

- Generated filter declarations live in `searchModel.generatedFilters[]`.
- Each generated filter row points to an `attributeKey`.
- Attributes own intrinsic facts and constraints, such as type, cardinality,
  options source, relationship source, lifecycle meaning, search/index support,
  privacy/security, validation, and mutability.
- `searchModel.generatedFilters[]` owns generated UI behavior, ordering,
  target affordance, default visibility, and template-specific routing.

Reason:

- This gives generators one deterministic list to consume while keeping
  attributes reusable across different surfaces.
- LLM-assisted definition changes can add, remove, or revise filter rows
  without mutating scattered attribute presentation behavior.
- Validation can check each generated filter against the referenced attribute,
  selected template, allowed operators, privacy/security posture, and approved
  design-system affordance.

Open follow-up:

- Define the value-range filter experience before value-range filters can be
  approved for generated pages.

Filter drawer contents:

- A generated filter targeting `filter_bar_drawer_select` requires a filter
  card in the filter list.
- The card must show the filter label, short description, and selected count.
- The opened drawer must show a title, optional search-within-options input,
  selected section, available section, selected count, clear/remove behavior,
  and apply behavior unless the signed-off template later defines immediate
  apply.
- Empty states are required for no selected values and no available option
  matches.

## Layer Selector

Decision:

- `layer_selector` appears only when the entity definition has at least one
  relationship with `navigationPosture: navigable` and the selected template
  approves that relationship category for layer navigation.
- Parent and child relationship navigation is approved for v1.
- Sibling navigation remains deferred until a real use case requires a governed
  key and behavior.
- Relationship navigation shown in the layer selector must come from governed
  relationship metadata, not freeform page links.

Organization demo example:

| Layer type | Relationship/layer keys |
| --- | --- |
| Parent layers | `chat`, `tenant`, `owner` |
| Child layers | `deals`, `locations`, `business_units`, `users` |

Implication:

- Relationship entries used by `layer_selector` need stable relationship keys,
  target entity keys, labels, relationship category, navigation posture, and
  display order.
- A missing target route, unsupported relationship category, or non-navigable
  relationship must prevent that relationship from appearing in the layer
  selector.

## View Selector

Decision:

- A view is a defined model on the entity, not an ad hoc page tab.
- `view_selector` appears only when `surfaceModel` defines two or more approved
  collection views that are eligible for the current actor and context.
- If zero or one view is eligible, the selector is omitted.
- Views may be role-suitable or context-specific, so eligibility must be
  deterministic from governed view metadata plus current actor/context.

Implication:

- Entity definitions need an entity-level view model, expected under
  `surfaceModel`, with stable view keys, labels, descriptions, default posture,
  display order, role/context eligibility, and selected template/surface
  variant behavior.
- A generated page must not invent extra views based on available fields,
  statuses, or relationships.
- Validation should fail when a view selector references a view without an
  approved template contract or an unsupported eligibility rule.

## Primary Capability Area

Decision:

- `primary_capability_area` hosts collection-level actions only.
- Selected-record actions belong in `drawer.record_header` or another approved
  drawer capability slot, not in the collection header.
- The region appears only when at least one eligible collection-level action
  exists for the current actor/context.
- To keep the UX manageable, only a small number of high-frequency primary
  collection actions should render directly.
- Secondary collection actions should live behind an expandable menu using the
  `secondary_capability_area` sub-region.
- Default direct-primary action count is one.
- Maximum direct-primary action count is three.
- Eligible actions beyond the direct-primary limit must move into the secondary
  expandable menu.

Eligible candidate action types:

| Candidate | Typical source in `actionModel` | Placement posture |
| --- | --- | --- |
| Create record | Managed-record authoring action such as `create` | Primary candidate when create is common and authorized. |
| Import records | Import/export action such as `import` or `bulk_import` | Secondary unless the entity is import-heavy. |
| Export collection | Import/export action such as `export` | Secondary by default. |
| Bulk update | Authoring or automation action | Secondary; requires selection model and compatibility rules. |
| Bulk status transition | Lifecycle action | Secondary; requires bulk transition approval. |
| Refresh/reconcile | Generation sync, automation, or support action | Secondary unless core to the page. |
| Validate collection | Evidence/audit, automation, or governance action | Secondary by default. |
| Generate/report | Generation sync or import/export action | Secondary by default. |
| Request review/approval | Governance approval action | Primary or secondary depending on view/context. |
| Save view | View-management action | Secondary unless view personalization is central. |

Excluded from this region:

- selected-record edit
- selected-record archive, restore, delete, or purge
- relationship actions for one selected record
- drawer group actions
- reveal-sensitive-field actions
- selected-record-only status transitions
- support-only correction unless the active view/context is explicitly
  support/operator oriented

Implication:

- `actionModel` needs deterministic placement metadata for collection actions,
  including whether an eligible action is `primary`, `secondary`, or not placed
  in this template.
- Validation should fail if more than three actions are marked direct-primary,
  or if overflow actions lack a template-approved secondary placement.

## Status Bar

Decision:

- `status_bar` is generated from operational status metadata, not from
  freeform page tabs.
- `status_bar` appears only when at least one operational status set/status
  group is eligible for the active view and has status entries marked eligible
  for status-tab behavior.
- Operational status display should be linked to the entity view model because
  relevant statuses may differ by selected view, role, or context.
- If no views are configured, or if no view selector is visible, and the entity
  has more than one operational status type/set, the entity definition must
  declare a default status display for the template.
- Status tabs act as status filters for the record list.
- System lifecycle states such as archived, deleted, pending cleanup, or
  cleanup failed should not appear in the normal status bar unless a view
  explicitly models them as operationally visible.

Implication:

- `operationalStatusSet` or the entity-level status model needs stable keys for
  status groups/sets, view eligibility, tab eligibility, count source, display
  order, default display posture, and badge tone.
- `surfaceModel` views need to declare which operational status set or status
  group they use.
- Validation should fail when multiple operational status sets could drive the
  status bar and no active view or default status display resolves the choice.

## Record List And Record List Card

Decision:

- `record_list` is a required behavioral region for this template.
- `record_list_card` is the required repeatable sub-region for each visible
  record.
- Every generated record card must have deterministic display identity.
- The entity definition should declare display identity explicitly rather than
  relying on generator guesses.
- Recommended display identity fields are:
  - `recordTitleAttributeKey`
  - `recordSubtitleAttributeKey`
  - `recordIdentifierAttributeKey`
- The title/display attribute must also have an approved placement in
  `record_list.record_list_card`.
- Optional secondary card fields render only through explicit placements.
- If the active view has a visible status bar, the card may show the active
  operational status using an approved status-badge placement.
- If the entity definition does not identify a title/display attribute, generated
  page eligibility should fail validation before generation rather than guessing
  from attribute names.

Implication:

- `surfaceModel` or an equivalent entity-level presentation section needs a
  display identity model for generated surfaces.
- Validation should verify that display identity attribute keys exist, are
  visible to the actor/context, and are compatible with the selected
  `record_list_card` elements.
- Entity creation or entity-definition activation should fail when the selected
  management template requires display identity and the definition does not
  declare a valid title/display attribute.

## Drawer Overall

Decision:

- `drawer` is a required behavioral region for the
  `record_management_list_centric` template.
- The drawer renders selected-record content only after a record is selected.
- Drawer content is generated from:
  - selected-record read result
  - `surfaceModel.displayIdentity`
  - `presentationGroups`
  - attribute placements targeting `drawer`
  - relationship placements targeting `drawer`
  - selected-record actions from `actionModel`
- The drawer must not automatically render every attribute in the entity
  definition.
- Attributes with no approved drawer placement remain part of the entity
  definition but are omitted from the generated drawer.
- Empty selection must use the signed-off design-system unselected/empty
  posture for this template; generated pages must not invent entity-specific
  empty drawer layouts.

Implication:

- Drawer generation depends on selected-record read capability shape and
  approved placement metadata.
- Validation should fail if required drawer sub-regions cannot be populated from
  selected-record data, display identity, presentation groups, or placements.

## List And Drawer Layout Ratio

Decision:

- Desktop expanded layout defaults to a `1:3` record-list-to-drawer ratio.
- The record list keeps enough width for title, subtitle, status badge, and a
  small number of approved secondary markers.
- The drawer gets layout priority because grouped fields, nested relationship
  lists, edit forms, and selected-record actions are the primary working area.
- Very wide screens may cap region widths so the drawer does not become
  awkwardly stretched.
- Mobile and tablet layouts do not preserve the desktop ratio; they should use
  the signed-off responsive pattern for stacked, drill-in, or equivalent
  focused navigation.

Open follow-up:

- Decide whether `1:2` remains an approved compact/list-scanning variant or is
  deferred until a concrete entity/view needs it.

## Drawer Record Header

Decision:

- `record_header` displays selected-record identity and selected-record actions.
- Default header contents are:
  - title from `surfaceModel.displayIdentity.recordTitleAttributeKey`
  - optional subtitle from `recordSubtitleAttributeKey`
  - optional subdued/support-facing identifier from
    `recordIdentifierAttributeKey`
  - optional active operational status badge when the active view/status model
    supports it
  - selected-record primary actions
  - selected-record secondary actions behind an expandable menu
- Title/display identity is required by entity-definition validation before
  generation.
- Subtitle and identifier are optional.
- Header actions are selected-record actions only.
- Collection actions stay in `primary_capability_area`.
- Selected-record edit should always be a primary header action when the actor
  can edit and the selected record state allows editing.
- Destructive or uncommon selected-record actions default to the secondary menu
  unless explicitly promoted by the view/action placement.
- Sensitive identifier display must obey capability and visibility rules.

Implication:

- `actionModel` needs deterministic selected-record action placement metadata,
  including primary vs secondary header placement.
- If edit is available for the actor/context/record state, generation should
  place it in the primary header action set.

## Drawer Group List And Subgroups

Decision:

- `drawer_group_list` renders top-level `presentationGroups` for the selected
  record.
- Groups appear only when they have at least one visible drawer field,
  relationship placement, or subgroup for the current actor/context.
- Empty groups are omitted.
- Group order comes from `presentationGroups.displayOrder`.
- Group labels and descriptions come from group metadata.
- Groups are presentation-only. They do not create permissions, lifecycle,
  storage, relationship ownership, or semantic rules.
- Placement references to unknown groups fail validation.
- Duplicate group order should fail validation rather than relying on hidden
  tie-break behavior.
- `drawer_subgroup_list` is used for nested or repeatable related-record
  collections inside the active group.
- Repeated related-record collections should declare their visible item fields
  deterministically rather than rendering an entire related entity by default.
- Entity-specific drawer structures are instances of the generic group/subgroup
  model. The template does not require Organization-like groups; each entity
  defines its own `presentationGroups`, drawer placements, relationship
  subgroups, and nested item fields.
- A subgroup belongs to exactly one `presentationGroup`.
- A subgroup must declare its source type, such as relationship-backed
  collection, repeated attribute value, computed/derived collection, or an
  approved manually defined grouping.
- Relationship-backed subgroups must reference a governed relationship key.
- Subgroups must declare item display fields explicitly.
- Subgroups must not render the target entity's full default card
  automatically.
- Empty subgroups are omitted unless the selected template/view explicitly
  requires an empty state for create/add flows.
- Subgroup order is scoped within the parent group.
- V1 allows one nested subgroup level. Deeper nesting is deferred unless a
  specific pattern is approved.

Organization drawer example:

This is an illustrative entity-specific instance, not the generic template
contract.

| Group | Example fields or subgroups |
| --- | --- |
| `identity` | name, description, industry, activity |
| `legal` | legal name, VAT, registration number, registered address |
| `structure` | child organization list, business units |
| `locations` | locations, opening-hour exceptions |
| `branding` | primary color, primary logo, icon, dark-background asset |

Nested examples:

- `structure.child_organizations`
  - child organization reference
  - child organization name
  - child organization description
- `structure.business_units`
  - business unit reference
  - business unit name
  - business unit description
- `locations.location_list`
  - location name
  - location type
  - location address
  - location coordinates
  - location opening hours
  - opening-hour exceptions

Asset note:

- Branding fields such as logos and icons are planning/demo fields only here.
  Any real upload, read, rendering, delivery, replacement, deletion, or
  publishing behavior for user-managed assets still requires the repo's asset
  consumer decision record before implementation.

Implication:

- `presentationGroups` handle the first-level drawer navigation.
- Relationship/repeated collection metadata must define which fields are shown
  inside `drawer_subgroup_list`.
- The drawer must not infer nested list fields from the target entity's full
  attribute set.
- A different entity can define a completely different drawer structure while
  still using the same template, as long as its groups, subgroups, placements,
  and item fields use approved template keys and pass validation.

## Drawer Attribute Field Form

Decision:

- `drawer_attribute_field_form` is the selected group's field display/edit
  area.
- It renders only approved drawer placements for the active group/subgroup and
  current actor/context.
- It must use approved element keys compatible with the attribute type,
  cardinality, options source, validation rules, mutability, privacy/security
  posture, and selected template contract.
- The entity definition describes what can be editable in principle.
- Actual rendered editability is determined by the intersection of:
  - attribute mutability
  - placement `interactionMode`
  - action/capability availability
  - selected record state
  - current actor/user authorization
  - current context boundary
- Current-user authorization is decisive. If the user is not authorized, the
  generated UI must not expose editable controls even if the field is generally
  updateable and the selected record state allows editing.
- Generated UI must not expose editable controls unless all required gates pass.

Implication:

- Template validation can approve that a field is eligible for an editable
  element, but runtime rendering still needs capability/authz and record-state
  evidence before showing edit controls.
- Read-only rendering remains allowed only when the actor/context is authorized
  to read the field.

## Relationship Navigation Behavior

Decision:

- Relationship behavior is governed by use. Layer navigation, drawer subgroups,
  and field/reference display are separate contract uses.
- A relationship being navigable does not automatically make it appear in the
  drawer.
- A relationship appearing in the drawer does not automatically make it appear
  in the layer selector.
- Relationship edit actions such as attach, detach, reorder, replace, reassign,
  or move must come from `actionModel`.
- Relationship ownership, lifecycle impact, boundary, navigation posture, and
  target visibility metadata constrain navigation, display, and actions.
- Cross-boundary relationships deny by default unless explicitly approved.
- Relationship target fields shown in subgroups must be explicitly declared; no
  target full-card auto-rendering.

Relationship use mapping:

| Relationship use | Where it appears | Source rule |
| --- | --- | --- |
| Layer navigation | `layer_selector` | Relationship has `navigationPosture: navigable` and template-approved parent/child layer behavior. |
| Drawer subgroup | `drawer_subgroup_list` | Relationship is placed inside a `presentationGroup` as a repeated/nested collection. |
| Field/reference display | `drawer_attribute_field_form` or `record_list_card` | Relationship attribute is placed as a field/reference using an approved element. |

Review note:

- This is the deterministic v1 posture. Revisit after active use reveals whether
  additional relationship display/navigation patterns need governed support.

## Responsive And Mobile Behavior

Decision:

- Desktop expanded layout uses the default `1:3` record-list-to-drawer ratio.
- Mobile and tablet layouts should not compress the desktop columns.
- Mobile/tablet should use a focused flow that preserves the primary tasks:
  list, search, filter/status selection, selected-record review, group
  navigation, subgroup navigation, and edit/action access.
- The default focused flow is:
  - list/search/filter/status first
  - selected record opens into a focused drawer/detail view
  - group list and subgroup navigation remain available inside the focused
    detail view
  - filters and secondary actions use overlays/drawers or the signed-off mobile
    equivalent
- No optional region should render as empty chrome on mobile.
- Status and filter controls should remain reachable without blocking the
  selected-record task.

Implication:

- Responsive behavior must be verified as part of template signoff.
- The generated page contract should preserve task order and reachability, not
  desktop column ratios.

## Template Validation Overlay

Decision:

- `record_management_list_centric` validation is a template-specific overlay on
  top of governed entity-definition schema validation.
- The template overlay must not duplicate the whole entity-definition validation
  model.
- It validates only what this template uniquely requires for deterministic
  generated page output.

Template overlay checks:

- `surfaceModel.displayIdentity.recordTitleAttributeKey` exists when this
  template is selected.
- The title/display attribute has a valid `record_list.record_list_card`
  placement.
- Region, sub-region, and element combinations are approved by this template.
- Optional regions are omitted when no eligible source content exists.
- Direct primary collection actions do not exceed three.
- Direct primary selected-record header actions do not exceed three.
- Selected-record edit is primary when edit is allowed for the
  actor/context/record state.
- Filter behaviors route to approved affordances.
- `value_range` filters remain blocked until a range filter experience is
  signed off.
- Active view/status mapping is unambiguous.
- Drawer groups/subgroups have visible content before rendering.
- Subgroup nesting does not exceed one level in v1.
- Layer navigation is limited to approved parent/child navigable relationships.
- Mobile/responsive behavior has a signed-off template posture before app
  adoption.

Implication:

- Entity-definition validation should catch generic schema and governance
  failures.
- The template overlay should catch invalid use of this page pattern.

## Signoff Checklist

Decision:

The Record Management List-Centric Contract v1 is not signed off until the
following are true:

- Required and conditional regions are documented.
- Required and conditional sub-regions are documented.
- Entity-definition source sections for each region/sub-region are documented.
- Allowed design-system elements per region/sub-region are documented or
  explicitly deferred.
- Default placement rules are documented.
- Collection and selected-record capability slots are documented.
- Filter behavior routing is documented, including blocked `value_range`.
- Status bar behavior is linked to active view/default status display.
- Record list/card behavior is documented, including display identity.
- Drawer header, group list, subgroup list, and field form behavior are
  documented.
- Relationship navigation/display/action separation is documented.
- Desktop `1:3` list-to-drawer ratio and responsive focused-flow behavior are
  documented.
- Template validation overlay checks are documented.
- Dummy Organization fixture exists and parses as JSON.
- Design-system demo route reflects the contract closely enough for review.
- Desktop and mobile verification evidence exists for the design-system route.
- Any asset-related demo fields remain planning/demo only unless an asset
  consumer decision record is approved.
- App adoption remains blocked until behavior lock, reference pack,
  verification checklist, and adoption artifact chain are complete for the
  consuming surface.

Open before signoff:

- Define or defer exact allowed element catalog per region/sub-region.
- Define the value-range filter experience or keep it blocked.
- Confirm whether `1:2` remains an approved compact/list-scanning variant or is
  deferred.
- Confirm whether root/governance and everyday record-management views are
  variants or separate template contracts.
