# Entity Management Page Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared` |
| UI family | `entity-management-page` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | none |
| Proposed design-system URL | none at this layer |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/entity-management-page/EntityManagementPage-Behaviour.md` |
| Mapping companion | `docs/design-system/01-behavior-rule/shared/entity-management-page/EntityListPage-MappingDraft.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/entity-management-page/EntityManagementPage-Behaviour.md`; `docs/design-system/01-behavior-rule/shared/entity-management-page/EntityListPage-MappingDraft.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person managing any configured Kanbien entity family, such as organizations, tenants, users, deals, locations, or future entity types. |
| Normal job | The user can create, find, view, edit, soft delete, list, filter, sort, and bulk-operate on entity records through one governed page family whose behavior is configured per entity type. |
| Success outcome | A new entity type can use the same governed page behavior by supplying entity capability and attribute configuration, without inventing entity-specific page functionality or local UI behavior. |
| Non-goals | This rule does not define token values, primitive markup, pattern structure, component APIs, route files, backend persistence, authorization grants, form schemas, validation APIs, canonical scenarios, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
render-proof routes, use-case routes, canonical files, app imports, or app
wrappers.

## Source Decomposition

This rule is not derived from a rendered route, screenshot, template,
canonical, app-like review surface, or existing design-system source page.

It is derived from the universal entity behavior described in conversation and
from existing repo planning/source artifacts that already define entity
metadata, action, surface, and route posture.

| Source | Signal Used |
| --- | --- |
| `docs/prd/2026-05-24-0026-entity-foundation.md` | The `entity` feature is the durable seed for platform self-definition and stores resolved identity fields such as `entityKey`, `featureName`, `tableName`, `idField`, `idColumn`, `scope`, and `routeBase`. |
| `docs/api-contracts/entity.md` | Current entity routes expose create, read, list, update, and archive behavior with explicit filters, sorting, pagination, and root-only capability checks. |
| `docs/prd/2026-04-19-0012-entity-builder-foundation.md` | Current `entityBuilder` provides versioned entity definitions, attributes, validation rules, options, computed source links, catalogs, validation, and export seams. |
| `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md` | The intended target model is richer than current `entityBuilder`, with section-complete `entityIdentity`, `sourceAuthority`, `attributes`, `presentationGroups`, `operationalStatusSet`, `relationships`, `searchModel`, `surfaceModel`, `actionModel`, `complianceModel`, `generationModel`, and `migrationModel`. |
| `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md` | Attribute metadata is expected to drive future generated pages, API-aware capability mapping, forms, drawers, search, filters, statuses, validation, and page behavior. |
| `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-page-materialization.md` | Generated/default entity management pages must consume entity-definition truth and must not invent fields, statuses, routes, authorization grants, relationship boundaries, generated CSS, or local variants. |
| `docs/workspace/product-discovery/2026-05-20-governed-entity-management-three-level-reconciliation.md` | Entity Page, Record List Page, and Record Page are distinct levels. `entity-list-page` maps to Record List Page behavior, while selected record detail maps to Record Page behavior. |
| `docs/design-system/entity-management-page-foundation-gap-map.md` | Existing entity-management route work is historical evidence and migration input, not a current app-consumable harness seam. |

## Universal Entity Capability Model

Every managed entity family uses the same page behavior vocabulary. Entity
configuration decides which capabilities and attributes are available for a
specific entity type; it must not create bespoke page behavior.

| Capability | Observable Behavior |
| --- | --- |
| create | The user can start a create flow for the selected entity family; user-sourced attributes are entered before create, and system or calculated attributes appear only after the create result exists. |
| find | The user can locate a known entity record through governed search, filter, navigation, or direct selection behavior. |
| view detail | The user can view all attributes that are visible for the current actor and entity context. |
| edit | The user can change editable user-sourced attributes without being offered system-managed or calculated attributes as editable fields. |
| soft delete | The user can move an entity record out of normal active use without implying that durable history or audit meaning has been erased. |
| list | The user can review a collection of entity records using the same governed list behavior across entity families. |
| filter | The user can constrain the collection by configured filterable attributes and see that filtering is active. |
| sort | The user can order the collection by configured sortable attributes and see the active ordering. |
| bulk create | The user can create multiple entity records through a governed bulk flow when the entity capability allows it. |
| bulk update | The user can update supported attributes across multiple selected records when the entity capability allows it. |
| bulk soft delete | The user can soft delete multiple selected records when the entity capability allows it. |

## Configuration Boundary

Entity-specific variation must enter through configuration or a feature-owned
adapter. It must not be expressed through page-local markup, page-local CSS, or
entity-specific controller behavior.

| Configuration Input | Behavior It Governs |
| --- | --- |
| entity identity and display labels | Page title, list label, detail label, create/edit labels, and empty-state copy identify the selected entity family without changing page behavior. |
| attribute metadata | Attributes determine which values can appear in list rows, details, forms, filters, sort controls, and bulk operations. |
| attribute source | User-sourced attributes may be editable when permitted; system-managed and calculated attributes are displayed as read-only or post-result information. |
| capability availability | Create, edit, delete, bulk, filter, and sort affordances appear only when the current entity configuration and actor capability allow them. |
| visibility rules | Hidden attributes are not rendered as visible detail, row, filter, sort, or form content. |
| filter definitions | Filterable attributes become governed filter behavior only through approved filter seams. |
| sort definitions | Sortable attributes become governed sort behavior only through approved sort seams. |
| operation result and status | Loading, success, error, denied, read-only, and deleted states communicate the operation result without relying on color alone. |

## Behavior States

Include only states that apply to this UI family.

| State | Observable Behavior |
| --- | --- |
| default | The page presents the selected entity family, current collection or selected record context, and the available configured actions. |
| no configured entity | The page does not render fake entity behavior; it communicates that no entity family is available or selected. |
| loading | The page communicates that entity configuration, records, or operation results are being prepared and does not expose fake completed content. |
| empty collection | The page communicates that no visible records match the current context without implying a load failure. |
| filtered collection | The page communicates that filters are active and the listed records are constrained. |
| sorted collection | The page communicates the active sort when sorting changes the collection order. |
| selected record | The page communicates which record is active before showing details, edit controls, or destructive actions. |
| create in progress | The page separates user-entered create attributes from system/calculated attributes that exist only after create completes. |
| read-only or denied | The page communicates when the actor can view but cannot change a record or operation. |
| edited with pending changes | The page communicates that user-sourced attributes have changed before those changes are committed. |
| soft-deleted record | The page communicates that the record is no longer normally active without implying hard deletion. |
| bulk selection | The page communicates how many records are selected and which bulk operations are available. |
| bulk operation in progress | The page communicates operation progress and does not imply each selected record has completed until the result is known. |
| operation error | The page communicates the failed operation, affected record or selection when known, and the next available user action. |
| blocked foundation | Later layers must show a blocked state instead of inventing local UI when a required governed seam is missing. |

## Required Interactions

List only interactions that create behavior decisions for this family.

| Interaction | Observable Behavior |
| --- | --- |
| start create | A create flow opens for the current entity family with editable user-sourced attributes only. |
| submit create | A successful create result makes the new record and system/calculated attributes available in the governed page context. |
| find or search | The page exposes a governed way to locate records when search or find behavior is configured. |
| apply filter | The visible collection changes to the matching records, and active filter state remains visible. |
| clear filter | The collection returns to the unfiltered or remaining-filter context. |
| apply sort | The visible collection order changes, and active sort state remains visible. |
| select record | The selected record becomes the detail/edit context without changing the entity family. |
| open detail | Visible attributes for the selected record become reviewable. |
| start edit | Editable user-sourced attributes become changeable while read-only attributes remain protected. |
| submit edit | Successful edits update the record context and communicate the result. |
| soft delete record | The selected record enters a soft-deleted state or leaves the normal visible collection according to the configured view. |
| select multiple records | The page exposes bulk operation context only for selected records. |
| submit bulk create | The page communicates the result of creating multiple records, including partial failure when later product contracts support it. |
| submit bulk update | The page communicates which selected records were updated or failed when later product contracts support per-record results. |
| submit bulk soft delete | The page communicates which selected records were soft deleted or failed when later product contracts support per-record results. |

## Interaction Outcomes

| Interaction | Visible Result | Focus Result | Announced Result | Mobile Result | Owning Later Layer |
| --- | --- | --- | --- | --- | --- |
| start create | A create surface becomes available for the current entity family. | Focus moves to the create surface or its first meaningful control. | The opened create context is programmatically communicated. | Later layers decide whether the create surface is inline, drawer, panel, or full-screen. | `04-pattern-contract` and later |
| select or open record | The selected record and its detail context become visible. | Focus remains on the triggering record or moves to a governed detail heading/control according to the later pattern. | Selection/open state is communicated with enough record context. | Later layers decide split, stack, or overlay posture. | `04-pattern-contract` through `06-use-case-page` |
| apply filter or sort | The collection changes and active filter/sort state remains visible. | Focus remains in the control or moves to a governed result summary according to later pattern behavior. | Result-count or changed-results feedback is communicated when available. | Filter/sort controls remain reachable without hiding the active collection context. | `04-pattern-contract` through `06-use-case-page` |
| start edit | Editable fields become available for the selected record. | Focus moves to the edit surface or first editable control. | Edit mode or editable context is communicated. | Later layers decide whether edit occupies the detail area, drawer, panel, or full-screen posture. | `04-pattern-contract` and later |
| soft delete | The affected record leaves normal active context or is visibly marked soft deleted. | Focus moves to a predictable remaining context rather than disappearing with the deleted row. | The deletion result is communicated with record context. | The result remains reachable in the active mobile region. | `04-pattern-contract` through app adoption |
| bulk operation | The selected-record context changes to operation progress and then result. | Focus remains in the bulk operation context until the result is available. | The result includes enough count and failure context for non-visual users. | Bulk action context remains reachable without obscuring selected-record meaning. | `04-pattern-contract` through app adoption |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Entity-specific page implementations | Entity variation must come from configuration and adapters, not bespoke page behavior. |
| Backend persistence, authorization, validation, and audit contracts | These are feature/backend contracts; the behavior rule only states what the page family must communicate. |
| Form field structure and validation UI | Form controls and form composition need their own governed lower-layer and component seams. |
| Filter, sort, status, toolbar, bulk action, drawer, and detail component APIs | Component seams belong to Layer 5 after their upstream layers pass. |
| Entity-list use-case route and rendered proof | Use-case pages belong to Layer 6 after required component seams and render proofs exist. |
| App route adoption | App adoption is blocked until the governed design-system chain and adoption gates pass. |

## Deferred Decisions

Use this section when a real decision exists but belongs to a later layer.

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which governed seams render create/edit forms | `03-primitive` through `05-component-seam` | The behavior rule can require editable/read-only separation, but cannot define form controls or component APIs. |
| Which governed seams render filters, active filters, sort, and result counts | `03-primitive` through `05-component-seam` | Entity-list pages must not invent filter/status controls locally. |
| Which governed seam renders bulk selection and bulk action state | `03-primitive` through `05-component-seam` | Bulk operation behavior needs visible, focus, and announced result handling before Layer 6 composition. |
| How record detail, edit, create, and delete surfaces are composed on desktop and mobile | `04-pattern-contract` through `06-use-case-page` | Layout, slot ownership, and mobile posture belong to later layers. |
| How backend entity capability metadata is projected into frontend receptors | `05-component-seam` and feature-owned adapter contracts | Mapping must be deterministic, but component receptor names and adapter APIs belong later. |
| `entity-list-page` use-case page proof | `06-use-case-page` | The page family can be composed only after required component seams and render proofs exist. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove entity context, list order, detail/edit surfaces, filters, sort controls, and bulk action context remain understandable in RTL. |
| zoomed in 150% | Later layers must prove entity context, records, controls, forms, filters, status feedback, and bulk selections remain reachable without incoherent overlap. |
| zoomed out 75% | Later layers must prove page regions, selected record, and active operation context remain recognizable. |
| dark theme | Later layers must prove entity state, selection, focus, operation status, and available actions remain legible. |
| desert theme | Later layers must prove entity state, selection, focus, operation status, and available actions remain legible. |
| dark theme with error | Later layers must prove create, edit, filter, delete, and bulk error states remain distinct from normal and read-only states in dark theme. |
| desert theme with error | Later layers must prove create, edit, filter, delete, and bulk error states remain distinct from normal and read-only states in desert theme. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Keyboard users must be able to reach entity selection, create, find, filter, sort, detail, edit, soft delete, and bulk operation controls when those capabilities are available. |
| Focus | Context-changing actions must leave focus in a predictable entity context, especially after opening forms/details, filtering results, deleting records, or completing bulk operations. |
| Names and semantics | Entity family, selected record, visible attributes, operation controls, active filters, active sort, selected-record counts, and operation results need visible or programmatic names. |
| Error and status communication | Loading, empty, denied, read-only, validation, deletion, partial bulk failure, and operation errors must be communicated with text or semantics, not color alone. |
| Color-independent meaning | Selection, disabled/denied state, read-only state, deleted state, errors, warnings, and bulk selection must not rely only on color, shape, position, or motion. |
| Later proof owners | Contrast, target size, focus-ring rendering, responsive geometry, live feedback implementation, form semantics, and filter/sort/bulk control semantics belong to Layer 2 and later rendered-proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy render-proof or use-case route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

Consumers must not build entity-specific page behavior when the variation can
be expressed as entity capability, attribute, visibility, filter, sort, form,
or bulk-operation configuration.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Create and edit form control families | `01-behavior-rule` through `05-component-seam` per hosted family | no | Entity-management pages cannot claim governed create/edit readiness while rendering ungoverned form controls. |
| Filter, active-filter, sort, and result-count families | `01-behavior-rule` through `05-component-seam` per family | no | `entity-list-page` cannot claim full list readiness while inventing these controls locally. |
| Bulk selection and bulk action family | `01-behavior-rule` through `05-component-seam` | no | Bulk operations may be recorded as behavior, but cannot be rendered as governed controls until their seams pass. |
| Entity capability and attribute-to-receptor mapping contract | `05-component-seam` plus feature adapter contract | no | App adoption cannot claim deterministic reuse until backend capability/configuration metadata maps to governed frontend receptors. |
| Entity-list page use-case proof | `06-use-case-page` | no | Layer 6 cannot claim completion until required component seams and render proofs exist or explicit exclusions are approved. |

## Layer 6 Use-Case Page Classification

| Field | Value |
| --- | --- |
| Later layer | `06-use-case-page` |
| Ask summary | Create an `entity-list-page` proof that composes governed entity management seams from entity capability and attribute configuration. |
| Recognition result | This is a use-case-page ask because it maps accepted component seams into a reusable product page family rather than proving one component in isolation. |

| Needed Information | Status |
| --- | --- |
| Use-case page family | Known: `entity-list-page` as the first slice of `entity-management-page`. |
| Component seams | Partial: `record-list-component` exists; filter, sort, result status, create action, bulk selection/action, detail, and form seams are missing or not yet confirmed for this use case. |
| Layer 5 render proofs | Known for `record-list-component`; missing for the other required seams. |
| Representative feature projection or fixtures | Missing: entity capability and attribute configuration must be represented without becoming backend contract truth. |
| Page states | Known at behavior level in this artifact; specific Layer 6 fixtures remain missing. |
| Viewport requirements | Known through mandatory review dimensions; concrete rendered geometry belongs to later layers. |
| Theme and direction requirements | Known through mandatory review dimensions. |
| Interaction and accessibility evidence needed | Known at behavior level; concrete rendered evidence belongs to later layers. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/entity-management-page/EntityManagementPage-Behaviour.md` |
| Stable lookup key | `shared/entity-management-page/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve universal capability behavior, configuration boundary, behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, render-proof routes, use-case routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this universal entity-management behavior rule against behavior and accessibility evals. | No known behavior-rule blocker remains. |
| 2 | `01-behavior-rule` | Review the companion `EntityListPage-MappingDraft.md` before choosing the first Layer 6 fixture. | This rule intentionally avoids defining page composition or component receptor APIs. |
| 3 | `02-token` through `05-component-seam` | Govern missing filter, sort, result status, create, bulk action, detail, and form seams one family at a time. | Layer 6 must not invent missing component behavior locally. |
| 4 | `06-use-case-page` | Create the `entity-list-page` use-case page artifact that consumes accepted seams and representative configuration. | Blocked until required component seams and render proofs exist or explicit exclusions are approved. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `01-behavior-rule` |
| Next layer status | `allowed` |
| Reason | The universal entity-management behavior is now explicit; the next safest step is a narrower `entity-list-page` behavior/mapping artifact before lower-layer seams or Layer 6 composition are claimed. |
