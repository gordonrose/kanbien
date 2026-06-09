# Entity List Page Use Case Page Artifact

## Use-Case Page Metadata

| Field | Value |
| --- | --- |
| Page scope | `design-system use-case page proof` |
| UI family | `entity-management-page` |
| Use-case page name | `entity-list-page` |
| Harness layer | `06-use-case-page` |
| Page status | `blocked` |
| Upstream component contracts | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md`; missing seams listed below |
| Shared use-case artifact path | `docs/design-system/06-use-case-page/shared/entity-list-page/EntityListPage-UseCasePage.md` |
| Planned use-case route or surface | Scaffold-only route exists at `/design-system/default/use-cases/entity-list-page`; full proof remains blocked |
| Files affected now | `docs/design-system/06-use-case-page/shared/entity-list-page/EntityListPage-UseCasePage.md`; `src/frontend/designSystem/systems/default/use-cases/entity-list-page/index.html`; `src/frontend/designSystem/systems/default/use-cases/entity-list-page/page.mjs` |

## Purpose

| Field | Value |
| --- | --- |
| Use-case family | `entity-list-page` |
| Component seams consumed | Current consumable seam: `record-list-component`; required missing seams: filter/sort/result summary, create action, bulk selection/action, record detail, and entity-definition-driven forms. |
| Page job | Prove how one reusable Record List Page consumes entity seed, active entity definition, capabilities, query state, collection results, and selected-record projections without entity-specific page code. |
| Expected reviewers | `design-system`; `accessibility`; `feature adapter`; `blocked until upstream seams exist` |
| Non-goals | Canonical scenarios, app adoption, backend workflow, durable route topology, authorization grants, persistence behavior, generated app CSS, and real organization page implementation. |

## Layer Boundary

This UseCasePageArtifact may define page-family responsibility, representative
fixtures, accepted component composition, page-local state boundaries,
proof-only controls, rendered states, route/review-surface responsibility,
browser evidence, and import boundaries only.

It must not define token values, primitive behavior, pattern composition,
component receptors, component render-proof-only behavior, canonical
scenarios, app wrappers, backend query semantics, persistence behavior,
authorization rules, or durable route topology.

## Preflight Decision Ledger

This artifact follows the Layer 1 behavior rule and mapping draft. It is not
motivated by a new rendered defect.

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Use-Case Page Action |
| --- | --- | --- | --- | --- |
| List/detail split for entity records | `05-component-seam` | `record-list-component` | none for list/detail shell | reuse |
| Search, filters, active filters, sort, and result counts | `05-component-seam` | none | missing governed component seams | block rendered proof |
| Create and edit forms from entity attributes | `03-primitive` through `05-component-seam` | none | missing form/control composition seams | block rendered proof |
| Bulk selection and bulk actions | `03-primitive` through `05-component-seam` | none | missing component seams | block rendered proof |
| Selected-record field placement | `05-component-seam` and `06-use-case-page` | partial through `detailContentHtml` only | missing Record Page/detail seam | block detail readiness |
| Organization-like fixture | `06-use-case-page` | not applicable | fixture only; not backend truth | record as representative mapping |

## Upstream Gates

| Field | Value |
| --- | --- |
| Component seam status | `blocked` for full page; `record-list-component` is `review-ready` |
| Component readiness source checked | `docs/design-system/05-component-seam/component-readiness-index.md` |
| Component render proof status | `record-list-component` render proof is `review-ready`; other required components are missing |
| Required component seams consumable by selected systems | `partial` |
| Consumer contexts known | `partial`; this artifact defines representative projection mapping only |

## Component Dependencies

| Component | Shared Contract | Runtime Seam | Layer 5 Render Proof | Page Decision Supported | Status |
| --- | --- | --- | --- | --- | --- |
| `record-list-component` | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md` | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs#renderRecordListComponent`; `#attachRecordListComponentController` | `docs/design-system/05-component-seam/render-proofs/record-list-component/RecordListComponent-RenderProof.md`; `/design-system/default/components/record-list-component` | Record collection rows, selected/open record state, detail slot, resize posture, and non-reorder posture. | `consumable` |
| filter/sort/result summary family | none | none | none | Find, filter, sort, active state, and result-count evidence. | `missing` |
| create action family | none | none | none | Start-create affordance and create operation state. | `missing` |
| entity form family | none | none | none | Create/edit fields from entity attributes, validation, read-only/system-managed posture. | `missing` |
| bulk selection/action family | none | none | none | Selected-record counts, bulk create/update/soft-delete behavior. | `missing` |
| record detail/page family | none | none | none | Selected-record field placement, groups, read/edit posture, relationship/evidence surfaces. | `missing` |

## Use-Case Surface

| Field | Value |
| --- | --- |
| Route or rendered surface | Scaffold-only route: `/design-system/default/use-cases/entity-list-page`; full rendered proof remains blocked |
| Public construction source | `record-list-component` runtime seam plus future governed seams |
| Page-level controller attachment | `attachRecordListComponentController` for the currently consumable list component; future controllers blocked |
| Allowed proof-only controls | Planned only: fixture, view/status, filter pressure, sort pressure, action availability, theme, direction, viewport pressure |
| Consumers must not use | `use-case route markup, use-case CSS, proof-only controls, fixture helpers, screenshots, or chat history` |

## Representative Feature Projection

This fixture is organization-like because existing design-system and evidence
registry work already uses organization material. It is still generic entity
configuration, not organization-specific functionality.

```json
{
  "entitySeed": {
    "entityKey": "organization",
    "labelFallback": "Organizations",
    "singularLabelFallback": "Organization",
    "descriptionFallback": "Companies and operating groups managed in Kanbien.",
    "featureName": "organizations",
    "scope": "tenant",
    "routeBase": "/organizations",
    "status": "active"
  },
  "entityDefinition": {
    "definitionVersion": 2,
    "sourceAuthority": "target_model_fixture",
    "surfaceModel": {
      "managementPattern": "record_management_list_centric",
      "defaultViewKey": "all_active",
      "collectionViews": ["all_active", "needs_review", "blocked"]
    },
    "attributes": [
      {
        "attributeKey": "display_name",
        "labelFallback": "Name",
        "placement": ["list_primary", "record_identity", "create_form", "edit_form"],
        "filterable": true,
        "sortable": true,
        "mutability": "updateable",
        "systemManaged": false
      },
      {
        "attributeKey": "sector",
        "labelFallback": "Sector",
        "placement": ["list_secondary", "record_detail", "create_form", "edit_form", "filter"],
        "filterable": true,
        "sortable": true,
        "mutability": "updateable",
        "systemManaged": false
      },
      {
        "attributeKey": "operational_status",
        "labelFallback": "Status",
        "placement": ["list_meta", "record_detail", "filter"],
        "filterable": true,
        "sortable": true,
        "mutability": "lifecycleManaged",
        "systemManaged": true
      },
      {
        "attributeKey": "created_at",
        "labelFallback": "Created",
        "placement": ["record_metadata", "sort"],
        "filterable": false,
        "sortable": true,
        "mutability": "immutable",
        "systemManaged": true
      }
    ],
    "actionModel": {
      "actions": [
        "list",
        "read",
        "create",
        "update",
        "soft_delete",
        "bulk_create",
        "bulk_update",
        "bulk_soft_delete"
      ]
    }
  },
  "collectionResult": {
    "page": 1,
    "pageSize": 25,
    "totalMatchingRecords": 4,
    "totalSearchableRecords": 4,
    "rows": [
      {
        "recordId": "org_northstar",
        "display_name": "Northstar Operations",
        "sector": "Operations",
        "operational_status": "ready"
      },
      {
        "recordId": "org_ledgerworks",
        "display_name": "LedgerWorks Finance",
        "sector": "Finance",
        "operational_status": "needs_review"
      },
      {
        "recordId": "org_atlas",
        "display_name": "Atlas Product Lab",
        "sector": "Product",
        "operational_status": "blocked"
      },
      {
        "recordId": "org_signal",
        "display_name": "Signal Works",
        "sector": "Service",
        "operational_status": "ready"
      }
    ]
  }
}
```

## Fixture And Feature Projection Coverage

| Fixture Or State | Feature Projection Shape | Component Receptors Used | Review Purpose | Source Honesty Requirement | Required Evidence |
| --- | --- | --- | --- | --- | --- |
| organization-like populated list | `EntitySeed`; `EntityDefinition`; `EntityCollectionResult`; `EntityRecordProjection` | `listLabel`; `detailLabel`; `items`; `openItemId`; `detailContentHtml`; `allowReorder: false`; `allowResize` | Prove the entity-list page can map configured entity records into the governed list component. | Fixture fields must be marked as target-model fixture values when current backend does not own them. | Blocked until rendered use-case route exists. |
| selected record | `EntityRecordProjection` for one row plus active view | `openItemId`; `detailContentHtml` | Prove selected-record context is separate from list row content. | Detail HTML is temporary until a Record Page/detail seam exists. | Blocked by missing detail seam. |
| filtered collection | `EntityCollectionQuery.filters`; `EntityCollectionResult` | none yet | Prove filter state and result count once filter seams exist. | Filter behavior must come from `searchModel` or target fixture, not page-local rules. | Blocked by missing filter/result seams. |
| sorted collection | `EntityCollectionQuery.sort`; `EntityCollectionResult` | none yet | Prove active sort and row order once sort seams exist. | Sort behavior must come from query/result fixture, not component reorder. | Blocked by missing sort seam. |
| create/edit available | `EntityListCapabilities`; `EntityDefinition.attributes` | none yet | Prove action availability and user-sourced/system-managed field separation. | Form fields must come from attribute metadata. | Blocked by missing form/action seams. |
| bulk operation available | `EntityListCapabilities`; selected record ids | none yet | Prove selected-count and bulk action behavior. | Bulk availability must come from action model and actor capability fixture. | Blocked by missing bulk seams. |
| operation error | `EntityOperationResult` | none yet | Prove failure feedback, focus recovery, and announced result. | Error fixture must identify operation and affected record/selection when known. | Blocked by missing status/feedback seams. |

## Proof Controls

Planned only. No rendered proof controls are approved until the missing
component seams exist.

| Control | Changes What Evidence | Contract Requirement Exercised | Not A Consumer API Because |
| --- | --- | --- | --- |
| fixture | Entity family, records, selected record, and operation state. | Representative projection mapping. | Features supply adapter values; fixture switching is review-only. |
| filter pressure | Active filter and result-count evidence. | Filter behavior from `searchModel`. | Blocked until a filter seam owns it. |
| sort pressure | Active sort and ordered result evidence. | Sort behavior from `searchModel`. | Blocked until a sort seam owns it. |
| action availability | Create/edit/delete/bulk affordance states. | Capability-to-page mapping. | Action visibility comes from feature capability projection. |
| theme/direction/viewport pressure | Environment evidence. | Inherited behavior-rule review dimensions. | Proof context only. |

## Interaction And State Evidence

| Interaction Or State Change | Component Event Or Page-Local State | Expected Rendered Result | Accessibility Feedback | Required Evidence |
| --- | --- | --- | --- | --- |
| open record | `record-list-component:open` | Selected record becomes the active detail context. | Selection/open state is communicated with record context. | Browser proof after route exists. |
| close record | `record-list-component:close` | Detail context closes and list remains usable. | Focus returns to stable list context. | Browser proof after route exists. |
| resize detail | `record-list-component:resize-detail` | Detail split changes without overlapping content. | Separator remains named and operable through upstream pattern. | Browser proof after route exists. |
| apply filter | blocked page-local state | Collection and result summary update. | Changed result count is communicated. | Blocked by missing filter/result seams. |
| apply sort | blocked page-local state | Collection order updates without enabling manual reorder. | Active sort is communicated. | Blocked by missing sort seam. |
| start create/edit | blocked page-local state | Governed form surface opens. | Focus moves to form context and system-managed fields remain protected. | Blocked by missing form/action seams. |
| submit bulk action | blocked page-local state | Bulk result appears with selected-count context. | Result includes enough count/failure context. | Blocked by missing bulk/status seams. |

## Responsive And Environment Coverage

| Context | Required Because | Expected Result | Required Evidence |
| --- | --- | --- | --- |
| desktop | Default list/detail management posture. | List, controls, and selected-record context are visible without overlap. | Browser proof after route exists. |
| reduced width | Record List Page must remain usable on mobile-like widths. | Later seams decide stack or overlay posture without hiding active context. | Browser proof after route exists. |
| RTL | Required by upstream behavior rule. | Entity labels, rows, controls, and detail context remain understandable. | Browser proof after route exists. |
| 150% zoom | Required by upstream behavior rule. | Controls and records remain reachable without incoherent overlap. | Browser proof after route exists. |
| dark and desert themes | Required by upstream behavior rule. | Selection, focus, status, and errors remain legible. | Browser proof after route exists. |

## Accessibility Preservation

The page must preserve the WCAG 2.2 AA default from the upstream behavior rule.

The entity-list fixture must provide non-empty accessible labels for the record
collection and selected-record context. Context-changing actions must preserve
predictable focus. Loading, empty, filtered, sorted, denied, read-only,
operation-success, and operation-error states must be communicated with text or
semantics, not color alone.

## Import And Dependency Boundary

| Field | Value |
| --- | --- |
| Allowed imports | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs` once a proof route is created; future governed component seams when available |
| Forbidden imports | `feature persistence, backend transport, app page modules, Layer 5 render-proof route modules, legacy design-system route markup` |
| Cross-feature dependency posture | `representative fixture only`; no backend or app feature imports are allowed |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| component consumption | Proof route must import Layer 5 component seams instead of rebuilding markup. |
| render-proof dependency | Every consumed component needs Layer 5 rendered evidence or a recorded blocker. |
| fixture honesty | Fixtures must distinguish current `entity`/`entityBuilder` compatibility fields from target-model fields. |
| page composition | Accepted components must work together for entity-list page behavior. |
| state coverage | Required page states must be visible or reachable. |
| interaction | Component and page events must work in the rendered page. |
| accessibility | Inherited accessibility requirements must be preserved in rendered evidence. |
| responsive/environment | Required viewport, theme, direction, zoom, and overflow contexts must be proven. |
| consumer boundary | Later consumers must consume component seams, not use-case markup or CSS. |

## Consumer Restrictions

Later layers must use the governed component seams instead of copying use-case
route markup, local CSS, fixture helpers, proof controls, controller setup, or
screenshots.

Use-case fixtures must not become product workflow, backend query,
authorization, persistence, or route-state truth.

Use-case-only controls must not be treated as component receptors unless Layer
5 has approved the receptor.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared use-case artifact at | `docs/design-system/06-use-case-page/shared/entity-list-page/EntityListPage-UseCasePage.md` |
| Store use-case route at | `src/frontend/designSystem/systems/default/use-cases/entity-list-page/` as scaffold-only |
| Stable lookup key | `shared/entity-management-page/entity-list-page/06-use-case-page` |
| How later layers consume it | Canonical and app-adoption layers may use this as page-family evidence only after missing seams and rendered proof are completed. |
| What later layers must preserve | Component seam imports, fixture honesty, accessibility evidence, responsive evidence, controller behavior, and consumer restrictions unless a use-case page revision is approved. |
| What must not consume it | Backend code, persistence code, and app pages must not import use-case route modules as construction APIs. |
| What must not be used instead | Chat history, screenshots, copied use-case markup, local CSS, or fixture helper internals. |
| Required next eval | `06-use-case-page/EVAL.md` |
| Required accessibility eval | `06-use-case-page/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `06-use-case-page` | Keep this artifact blocked while reviewing the representative fixture and mapping boundary. | Full rendered proof needs missing component seams. |
| 2 | `05-component-seam` | Govern filter/sort/result summary, create action, entity form, bulk action, and record detail seams. | Entity List Page cannot invent them locally. |
| 3 | `06-use-case-page` | Create the rendered `entity-list-page` proof route once required seams exist or exclusions are explicitly approved. | Blocked by upstream seams today. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `05-component-seam` |
| Next layer status | `blocked` |
| Reason | The first entity-list mapping fixture is explicit, but the page cannot become a rendered use-case proof until missing component seams exist or a narrower first-slice exclusion is approved. |
