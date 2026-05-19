# Governed Entity Definition Access And Promotion

Planning status:

- `access_promotion_draft`
- Date: 2026-05-18
- Scope: role discovery, collection-view eligibility, runtime authorization
  boundary, and generated page promotion
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Define how entity creation captures who needs an entity, what they need it for,
which collection views support that work, and how generated pages move from
limited visibility to full availability.

This artifact bridges customer-facing role/workflow discovery with platform
authorization and promotion governance. It is planning only, not a permission
mapping, runtime authz implementation, route contract, migration, or generated
page implementation.

## Source Artifacts

- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-creation-and-maintenance.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-page-materialization.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-starter-default-catalog.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`

## Core Rule

Role discovery describes intended product use. Runtime authorization enforces
actual access.

Collection views, staged visibility, and selected-user previews must never grant
data or action access that runtime authorization would deny.

## Role Discovery

Entity creation should ask role questions in plain business language before
deriving views, statuses, actions, or permissions.

Recommended sequence:

1. Ask which roles in the organization need this entity.
2. Ask what each role needs to do with it.
3. Distinguish read-only needs from create, edit, approve, archive, delete,
   export, or support needs.
4. Identify whether different roles need different default views.
5. Derive candidate statuses, sub-statuses, and collection views from those
   role-specific jobs.
6. Draft capability/action mapping separately from the role conversation.

Example prompts:

> Who needs to use this record in day-to-day work?

> What does each group need to do when they open it?

> Are some people only checking status, while others need to create or change
> records?

## Role Need Shape

The planning model should eventually represent role needs separately from
runtime grants.

Working shape:

| Field | Meaning |
| --- | --- |
| `roleNeedKey` | Stable key for the discovered role need. |
| `roleLabel` | Human-readable role or group label. |
| `jobToBeDone` | Plain-language reason this role needs the entity. |
| `readNeed` | Whether the role needs to view records. |
| `mutationNeeds` | Create, update, archive, delete, restore, approve, export, or other action needs. |
| `defaultViewKey` | Preferred collection view for this role/context. |
| `relevantStatusKeys` | Statuses the role normally cares about. |
| `relevantSubStatusKeys` | Sub-statuses the role normally cares about. |
| `supportOnly` | Whether the role need is support/ops-only. |
| `evidenceKeys` | Evidence supporting the role/use decision. |

Role needs should feed:

- `surfaceModel.collectionViews`
- `actionModel`
- generated page default view behavior
- permission-mapping draft requirements
- review and promotion decisions

Role needs should not become runtime grants by themselves.

## Collection View Eligibility

Collection views express intended usage:

- which roles or role groups a view is meant for
- which statuses and sub-statuses belong to that view
- which view is the default for a role/context
- whether the view should appear before full promotion

Rules:

- A role may have one default collection view per context.
- A collection view may be useful to multiple roles.
- A role may be eligible for multiple views when the difference is meaningful.
- View eligibility does not override object-level or capability-level
  authorization.
- A generated page should hide or disable views that are not eligible for the
  current actor/context.
- If a user can see a staged page but has no eligible view, the page should show
  an explicit no-access/no-eligible-view posture rather than leaking data.

## Runtime Authorization Boundary

Authorization remains owned by the platform capability model and the owning
feature implementation.

Entity definition authoring may draft required access behavior, but runtime
access must still be enforced through approved capability checks.

Boundary rules:

- Page visibility does not grant record access.
- Collection-view eligibility does not grant record access.
- Selected-user preview does not grant record access.
- Selected-role staging does not grant record access.
- Support-only page visibility does not grant customer data access by itself.
- Action buttons must be derived from the intersection of action model,
  collection/record state, current actor, current context, and runtime authz.
- Cross-boundary access denies by default unless explicitly approved.

## Staged Visibility

Generated page visibility stages:

| Stage | Meaning | Promotion posture |
| --- | --- | --- |
| `draft_only` | Not visible in normal navigation. | Used during setup and review. |
| `selected_users` | Visible only to explicitly selected users. | Used for preview, validation, and pilot review. |
| `selected_roles` | Visible only to selected roles/groups. | Used for role-based pilot or staged rollout. |
| `support_only` | Visible only in support/ops posture. | Used for operational or controlled support workflows. |
| `all_eligible_users` | Visible to everyone who passes normal authorization and view eligibility. | Full launch posture. |

Rules:

- Staged visibility controls exposure, not authorization.
- Promotion to `all_eligible_users` must be explicit.
- Selected users/roles must be recorded durably enough for audit and support.
- Staged visibility must not rely on client-side hiding alone.
- Preview or staged links must not become access tokens.

## Promotion Evidence

Promotion should capture:

- page/materialization identifier
- entity definition version
- previous visibility stage
- new visibility stage
- actor who approved promotion
- selected users or roles involved
- feedback or blockers reviewed
- authorization mapping verification
- design-system/template readiness
- route/topology compatibility result
- timestamp and audit/evidence keys

Promotion from selected users/roles to all eligible users should require:

- entity definition is active or launch-approved
- default page readiness checks pass
- hierarchy/materialization checks pass
- authz/capability mapping is current or explicitly blocked from launch
- staged feedback is resolved, accepted, or deferred with approval
- promotion actor has authority

## Demotion And Rollback

Promotion should not be one-way.

Supported rollback/demotion postures:

- return from `all_eligible_users` to `selected_roles`
- return from `selected_roles` to `selected_users`
- hide from normal navigation as `draft_only`
- mark page `support_only`
- supersede with a corrected materialization

Rollback rules:

- demotion must not destroy persistent hierarchy or entity-definition history
  unless a separate approved cleanup plan exists
- route compatibility must be preserved when users or docs may already depend
  on the route
- rollback should be audit-visible

## Open Questions

| Question | Current posture |
| --- | --- |
| What durable store owns selected-user and selected-role staging state? | Open for architecture alignment. |
| Should role needs be persisted as part of the entity definition, as authoring evidence, or as generated permission-mapping draft input? | Open. |
| How should selected users be selected in UI without creating app-local picker behavior? | Requires design-system/governed picker decision. |
| What is the minimum authz verification evidence before promotion? | Open for implementation planning. |
| Can support-only visibility and selected-user visibility combine? | Likely yes, but the runtime model must define precedence. |

## Next Planning Step

Use this artifact with the creation, starter-default, and page-materialization
drafts to produce an implementation-facing PRD or capability matrix for
entity-definition creation and generated page rollout.

That PRD or capability matrix should complement the broader entity capability
baseline from schema formalization. Access, promotion, staged visibility,
collection-view eligibility, and signoff are rollout and governance concerns
that attach to the baseline capabilities; they do not replace managed-record,
relationship, definition lifecycle, definition-structure, or generation
capabilities.
