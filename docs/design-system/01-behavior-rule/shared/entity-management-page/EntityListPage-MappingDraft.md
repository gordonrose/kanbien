# Entity List Page Mapping Draft

## Draft Status

| Field | Value |
| --- | --- |
| Design system | `shared` |
| Related behavior rule | `docs/design-system/01-behavior-rule/shared/entity-management-page/EntityManagementPage-Behaviour.md` |
| Mapping family | `entity-list-page` |
| Mapping status | `draft-for-review` |
| Runtime contract status | not a runtime API contract |
| Component seam status | not a Layer 5 component API |

## Purpose

Define the first deterministic mapping shape for a reusable Entity List Page.

The page should be configured by entity capability and attribute metadata. It
should not be implemented separately for organizations, tenants, users, deals,
locations, or future entity families.

This draft identifies the source packets and representative mock capability
calls that a later Layer 6 use-case page can use before current backend source
is rich enough to supply every target field.

## Existing Source Truth Found

| Source Area | Current Role In Mapping |
| --- | --- |
| `entity` feature | Durable entity seed and route/topology identity: `entityKey`, `featureName`, `tableName`, `idField`, `idColumn`, `scope`, `routeBase`, and first-slice status. |
| `entityBuilder` feature | Current compatibility anchor for versioned attributes, validation, options, form-facing posture, catalogs, validation, and export format v1. |
| Governed entity-definition discovery model | Intended target for richer section-complete entity truth, including source authority, evidence, presentation groups, statuses, relationships, search, surfaces, actions, compliance, generation, and migration. |
| Entity-management three-level reconciliation | Separates Entity Page, Record List Page, and Record Page so the list page does not own definition-authoring behavior or selected-record field invention. |
| Page materialization planning | Requires generated/default pages to consume entity-definition truth and blocks invented fields, statuses, routes, grants, relationship boundaries, generated CSS, or local variants. |
| Existing design-system record-list component | Current partial Layer 5 seam for list/detail split behavior. It is not enough on its own for full entity-list-page readiness. |

## Mapping Principle

An Entity List Page is produced from three inputs:

1. The stable entity seed says which entity family this page represents and
   where it belongs.
2. The active entity definition says which attributes, actions, views,
   filters, sorts, statuses, placements, and record-detail fields are allowed.
3. Runtime capability results say what records and operations are available for
   the current actor and context.

Entity-specific differences must enter through those inputs. They must not
enter through entity-specific page markup, page CSS, controller branches, or
copied component behavior.

## Source Packets

These packets are design-system review packets, not final backend DTO names.

| Packet | Minimum Contents | Maps To |
| --- | --- | --- |
| `EntitySeed` | `entityKey`, labels, description, `featureName`, `scope`, `routeBase`, status, source authority posture | page identity, route context, empty or blocked state, actor-bound scope notes |
| `EntityDefinition` | attributes, presentation groups, operational statuses, relationships, `searchModel`, `surfaceModel`, `actionModel`, compliance posture | configured controls, allowed views, filter/sort choices, visible fields, detail surface, action availability |
| `EntityListCapabilities` | list, create, read, update, soft delete, bulk create, bulk update, bulk soft delete, import/export or other configured list actions | visible affordances, disabled/read-only/denied states, operation routing |
| `EntityCollectionQuery` | page, page size, search/find value, filters, sort, selected view/status, include deleted/archived posture when approved | list request state, active filter/sort indicators, result summaries |
| `EntityCollectionResult` | rows, pagination totals, total matching records, total searchable records, empty/filtered-empty state, operation status | rendered row collection, result count, empty states, loading/error feedback |
| `EntityRecordProjection` | record id, list row fields, display identity, selected-record fields allowed by active view, lifecycle/status, read/edit/delete capability state | row receptors, selection context, Record Page/detail receptors |
| `EntityOperationResult` | operation key, success/failure, affected record ids, counts, error details, retryability, audit-visible status where relevant | status feedback, focus recovery, announced result, partial failure handling |

## Representative Mock Capability Calls

Use these only as contract-shaped mocks for design-system and use-case proofs.
They are not approved runtime routes or source-code APIs.

| Mock Call | Purpose |
| --- | --- |
| `getEntitySeed(entityKey)` | Load stable identity, scope, route, and status posture for the entity family. |
| `getActiveEntityDefinition(entityKey)` | Load the active definition version that governs attributes, views, actions, search, surfaces, and record display. |
| `listEntityRecords(entityKey, query)` | Return the current collection for the active query and actor context. |
| `getEntityRecord(entityKey, recordId, viewKey)` | Return selected-record projection for the approved Record Page/detail context. |
| `createEntityRecord(entityKey, input)` | Create one record from editable user-sourced attributes. |
| `updateEntityRecord(entityKey, recordId, input)` | Update editable attributes for one record. |
| `softDeleteEntityRecord(entityKey, recordId)` | Move one record out of normal active use without implying hard deletion. |
| `bulkCreateEntityRecords(entityKey, inputSet)` | Create multiple records when the action model allows it. |
| `bulkUpdateEntityRecords(entityKey, recordIds, input)` | Update allowed attributes across selected records when the action model allows it. |
| `bulkSoftDeleteEntityRecords(entityKey, recordIds)` | Soft delete selected records when the action model allows it. |

## Capability To Page Mapping

| Capability | Required Page Receptor Or Behavior |
| --- | --- |
| list | Collection region receives rows, loading, empty, filtered-empty, pagination, and result count context. |
| find | Search/find region receives query input and returns matching collection or selected-record context. |
| filter | Filter region receives configured filter definitions and active filter state. |
| sort | Sort region receives configured sortable attributes and active sort state. |
| view detail | Selected-record/detail region receives only fields approved for the active entity view. |
| create | Create action opens a governed create surface for user-sourced editable attributes only. |
| edit | Edit action opens a governed edit surface that excludes system-managed, calculated, and unauthorized fields. |
| soft delete | Destructive action communicates soft-delete result and moves focus to a stable remaining context. |
| bulk create | Bulk create surface receives a configured input-set contract and communicates aggregate/partial result when supported. |
| bulk update | Bulk action region receives selected records and only attributes approved for bulk update. |
| bulk soft delete | Bulk action region receives selected records and communicates aggregate/partial delete result when supported. |

## Attribute To Receptor Mapping

| Attribute Metadata | Page Behavior |
| --- | --- |
| display identity | Supplies primary row label, selected-record label, create/edit headings, and operation feedback context. |
| placement and presentation group | Decides where an attribute may appear in list rows, selected-record detail, forms, filters, or grouped display. |
| visibility | Hidden or unauthorized attributes do not render as rows, detail fields, filters, sort choices, form controls, or bulk fields. |
| mutability and system-managed posture | Decides whether an attribute is editable, create-only, read-only, lifecycle-managed, derived, or calculated. |
| validation rules | Feed form validation behavior once governed form seams exist; this draft does not define field UI. |
| options and catalog posture | Feed governed choice controls once approved selection seams exist. |
| search/filter/sort posture | Determines whether an attribute can appear in find, filter, active-filter, sort, and result-summary behavior. |
| lifecycle or operational status posture | Feeds status views, status indicators, and allowed actions without inventing page-local status values. |
| privacy/security/compliance posture | Blocks or modifies visibility and interaction only through approved authorization and visibility contracts. |

## First Slice For Layer 6

The first `entity-list-page` proof should use a representative future-facing
fixture rather than current source alone.

The fixture should include:

- one `EntitySeed`
- one active `EntityDefinition`
- one collection with at least four records
- list, find, filter, sort, create, detail, edit, soft-delete, and bulk-action
  availability states
- at least one hidden/system-managed attribute
- at least one editable user-sourced attribute
- at least one sortable attribute
- at least one filterable attribute
- at least one operational status
- at least one operation error fixture

The fixture must not add fallback behavior that production would not provide.
If current backend source cannot provide a field yet, the fixture should mark
that field as target-model evidence rather than pretending current source owns
it.

## Current Blockers Before App Adoption

| Blocker | Why It Matters |
| --- | --- |
| Filter, sort, active-filter, and result-summary seams are not yet governed. | The Entity List Page cannot invent these locally. |
| Create/edit form seams are not yet governed for entity-definition-driven forms. | The page cannot render deterministic create/edit behavior from attributes yet. |
| Bulk selection and bulk action seams are not yet governed. | Bulk operations are part of the universal behavior but not ready for signed rendering. |
| Record Page/detail mapping is not yet governed. | Selected-record detail must not render every attribute by default or invent field placement. |
| Backend target export shape is not implemented. | Use contract-shaped mocks for design-system proofing, with current `entityBuilder` v1 treated as compatibility evidence only. |

## Next Mapping Step

Review this draft against the found entity metadata work, then choose the first
Layer 6 proof fixture for `entity-list-page`.

The recommended first fixture is an organization-like entity because the
existing evidence registry and design-system prototype already contain
organization demo material, but the fixture should still be generic enough to
prove that entity-specific behavior comes from configuration rather than page
code.
