# Governed Entity Definition Page Materialization

Planning status:

- `page_materialization_draft`
- Date: 2026-05-18
- Scope: generated/default entity management page materialization
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Define how an entity definition can propose, preview, stage, and apply a
generated/default management page in the app without bypassing persistent web
app hierarchy, frontend topology governance, or design-system signoff.

This artifact is planning only. It is not a runtime route contract, migration,
design-system approval, generated page implementation, or topology
materialization script.

## Source Artifacts

- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-creation-and-maintenance.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-access-and-promotion.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/design-system/templates/record-management-list-centric-template.md`
- `docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`
- `docs/architecture/adr/0040-use-root-admin-route-modules-for-durable-frontend-pages.md`

## Materialization Sources

An entity management page may come from one of these placement outcomes:

| Outcome | Meaning | Materialization posture |
| --- | --- | --- |
| Existing app/module/page context | The page belongs under known persistent hierarchy nodes. | May preview and apply when all readiness checks pass. |
| New page under existing context | A new entity page is needed under existing app/module/parent route hierarchy. | May preview and apply through approved hierarchy materialization. |
| New module under existing app | A new module/top-nav grouping is needed. | Requires explicit topology decision before apply. |
| New app/workspace | A new app or shell area is needed. | Requires explicit product/topology approval before apply. |
| Unknown or deferred placement | The desired location is unclear. | Draft save allowed; page materialization blocked. |

## Preview Before Apply

Before any materialization, the system should show a preview of what would
change.

Preview should include:

- entity definition version
- app area/workspace
- module or navigation grouping
- parent page or containing route
- proposed page key and label
- proposed canonical route
- whether the page reuses existing hierarchy or creates a new page
- whether a new module or app is being requested
- design-system template contract and readiness
- collection views and default view behavior
- status-bar behavior
- collection actions
- selected visibility stage
- compatibility risks
- blocked or unresolved decisions

The preview must distinguish between:

- entity-definition changes
- persistent hierarchy changes
- route/topology changes
- design-system/template dependencies
- generated page output
- visibility/promotion changes

## Staged Visibility

Generated page changes should support staged visibility before promotion to all
eligible users.

Visibility stages:

| Stage | Meaning | Typical audience |
| --- | --- | --- |
| `draft_only` | Not visible in normal navigation. | Entity-definition authors and reviewers. |
| `selected_users` | Visible only to explicitly selected users or reviewers. | Product owners, admins, testers, pilot users. |
| `selected_roles` | Visible to selected roles or groups before full launch. | A pilot role, support team, or operations group. |
| `all_eligible_users` | Visible to everyone who passes normal runtime authorization. | Full intended audience. |
| `support_only` | Visible only in support/ops posture. | Support or operator users. |

Rules:

- Staged visibility controls page exposure, not data authorization.
- Runtime authorization still decides whether a user can access records and
  actions.
- Selected-user or selected-role visibility must not grant access to data or
  actions the user could not otherwise access.
- Promotion from selected users to all eligible users should be explicit and
  auditable.
- Preview links or staged page visibility must not become authority for tenant,
  role, permission, or entity access.
- Staged visibility should be recorded on the materialization/promotion plan,
  not as hidden page-local behavior.

## Apply And Materialization Rules

Apply should create or update durable records through approved seams only.

Rules:

- Use persistent web app hierarchy truth when available.
- Create new pages only in the context of approved existing app/module/parent
  hierarchy unless a new app or module decision is explicit.
- Do not hand-edit governed generated routing or app structure.
- Derive canonical routes from approved topology and hierarchy rules.
- Block apply if the selected design-system template contract is not signed off
  for app consumption.
- Block apply if default page readiness requirements are missing.
- Block apply if a new app or module is implied but not explicitly approved.
- Record whether the change is preview-only, staged to selected users, staged
  to selected roles, support-only, or promoted to all eligible users.

Materialization should produce evidence for:

- hierarchy records created or referenced
- route keys and canonical route
- entity definition version
- design-system contract key
- generated page/template version
- visibility stage and promotion owner
- unresolved compatibility notes

## Promotion Rules

Promotion is separate from apply.

The system may apply a page into a staged/non-public visibility posture before
promoting it to all eligible users.

Promotion from `selected_users` or `selected_roles` to `all_eligible_users`
requires:

- entity definition version is active or otherwise approved for launch
- page materialization checks pass
- selected-user/staged feedback is resolved or explicitly accepted
- route compatibility notes are resolved
- runtime authorization mapping is current
- design-system template contract remains current
- promotion actor is authorized
- promotion is audit-visible

Demotion or rollback posture should be planned before launch:

- hide from all eligible users back to selected users/roles
- mark page support-only
- remove from normal navigation while preserving route compatibility when
  required
- supersede with a corrected materialization

## Generated Page Contract

A generated/default entity management page must consume entity-definition truth
instead of inventing local behavior.

It should consume:

- attributes and placements
- presentation groups
- relationships
- operational statuses and sub-statuses
- `surfaceModel.collectionViews`
- `surfaceModel.routingTopology`
- `actionModel`
- `searchModel`
- compliance and visibility posture

It must not invent:

- fields
- statuses
- sub-statuses
- collection views
- app/module/page route placement
- authorization grants
- relationship boundaries
- generated page CSS or app-local design-system variants

## Compatibility Rules

The following are compatibility-sensitive:

- changing canonical route
- moving page to another parent/module/app
- changing support-only posture
- promoting from staged visibility to all eligible users
- removing a previously visible collection view
- removing status/sub-status membership used by a visible view
- changing display identity fields for existing generated pages
- changing route locator type or hash/path posture

Compatibility-sensitive changes require preview, explicit risk classification,
and a migration or compatibility strategy before promotion.

## Open Questions

| Question | Current posture |
| --- | --- |
| Should staged visibility live in persistent hierarchy records, a feature-flag/promotion layer, or a dedicated materialization record? | Open for architecture alignment. |
| Should selected-user previews be shareable links, navigation-visible entries, or both? | Open; must follow page-state replay security rules. |
| What is the first approved design-system template for generated entity pages? | Likely `record_management_list_centric`, pending app-consumable signoff. |
| Should materialization create persistent hierarchy records before or after entity-definition activation? | Open; likely preview before activation, apply after validation, promote after activation. |
