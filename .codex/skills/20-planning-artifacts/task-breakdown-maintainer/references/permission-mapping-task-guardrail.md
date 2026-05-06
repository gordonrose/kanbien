# Permission Mapping Task Guardrail

Use for task type: `DOC:permission-mapping`

## Must Preserve

- capability keys, root/tenant/shared-cross-tenant boundary, grants, deny rules,
  and object-level rules when relevant
- migration-backed role grants for protected DEV:backend behavior
- current tenant context remains exactly one context per request
- approved Layer 2 authorization authority from ADRs, Technical Steering, API
  contracts, and architecture permission-mapping docs
- grant source posture and UI eligibility stay explicit so planned permissions
  cannot become usable before runtime enforcement exists
- safe denial category, audit/proof expectation, and authority-world separation
  remain visible for protected surfaces
- current mapping work may document approved RBAC, root, tenant, and
  capability-grant truth; configuration-based, relationship-based, ABAC, and
  ReBAC rows must remain `architecture-target` or `blocked` until Layer 2 has
  approved the model

## Approval Evidence

- permission mapping class
- approved authz model source reviewed, such as ADR-0036, the platform
  authorization Technical Steering packet, or a route/feature-specific
  Technical Steering packet
- capability rows and roles affected
- authority world, actor boundary, tenant context, cross-tenant posture, and
  lifecycle gate when relevant
- grant source posture and UI eligibility
- safe denial category and audit/proof expectation
- allow and deny expectations, including object/relationship/attribute posture
  when relevant
- evidence mapping inventory linking capability, route, UI, audit, and proof
  sources
- seed or corrective migration impact
- security/authz proof command
- human-review boundary for authz-source interpretation and mapping judgment

## Permission Mapping Classes

- `runtime-enforced-row`: current mapping for runtime-enforced authorization.
- `documentation-only-row`: docs-only mapping that must not become selectable
  or usable.
- `grant-source-row`: seed-backed or corrective-migration-backed grant source
  mapping that must route migration work separately.
- `future-authz-model-row`: configuration-based, relationship-based, ABAC, or
  ReBAC posture that must remain `architecture-target` or `blocked` until
  Layer 2 approves the model.
- `ui-eligibility-review`: task focused on whether mapped capabilities are
  selectable, usable, hidden, or blocked in UI surfaces.

## Deep Delivery Standard

- one capability key, role/boundary row, grant-source posture, deny rule,
  tenant-context rule, or permission artifact schema update per queued task
- split mapping docs, seed migration, and authz runtime implementation when
  they have distinct write sets or proof
- name the exact role/capability rows, approved authz model source, safe denial
  category, grant-source posture, and allow/deny proof
- name concrete mapping/evidence inventory paths or command output before
  queueing
- do not use `DOC:permission-mapping` to approve a new authorization model. If
  the task changes evaluator order, authority-world policy, grant-source
  vocabulary, role-family policy, tenant lifecycle policy, or ABAC/ReBAC
  extension rules, route that governance change to `GOV:architecture-update`
  for now.
- if a mapping row names configuration-based authorization,
  relationship-based authorization, ABAC, or ReBAC before Layer 2 approval,
  the row must be `architecture-target` or `blocked`, UI-ineligible, and routed
  to `GOV:architecture-update`; it must not be recorded as `current`,
  `target`, seed-backed, or runtime-enforced truth

## Ownership Boundary

`DOC:permission-mapping` owns source-independent permission truth. It may create
or update:

- permission mapping docs under `docs/architecture/permission-mappings/` or
  `docs/workspace/permission-mappings/`
- role-to-capability, capability-to-route, and allow/deny mapping tables when
  maintained as planning or documentation artifacts
- authority-world, actor-boundary, grant-source posture, UI eligibility,
  tenant-context, cross-tenant posture, lifecycle gate, denial category, audit
  requirement, evaluator-layer, and object/ABAC/ReBAC posture rows when those
  fields are source-independent mapping truth
- permission compatibility notes and review evidence
- task packet evidence that traces permission-sensitive behavior back to
  approved capability rows and approved authz architecture

It does not implement authorization behavior. Runtime authz enforcement,
middleware, route guards, transport behavior, feature-domain permission checks,
seed/corrective grant migrations, and executable allow/deny tests must split
into the owning task type.

## Required Packet Evidence

Before queueing, the task packet should name:

- approved authz source, such as ADR, Technical Steering, Product Discovery,
  PRD/capability matrix, API denial contract, or architecture mapping artifact
- exact capability keys, roles, grants, denied roles, and protected surfaces
- authority world: root, tenant, system, public, shared-cross-tenant only with
  explicit approval, or internal/support/emergency boundary
- actor boundary, role family, grant model, and whether the row is current,
  target, architecture-target, or blocked
- current tenant context, lifecycle/deletion gate, cross-tenant deny rule, and
  object/relationship/attribute posture when relevant
- grant source posture: documentation-only, seed-backed,
  corrective-migration-backed, runtime-enforced, or blocked
- UI eligibility, including proof that docs-only, seed-backed,
  corrective-migration-backed without runtime proof, and blocked capabilities do
  not become selectable or usable
- safe denial category and API contract source when authn/authz behavior is
  route-visible
- audit/proof expectation and visibility class when the capability is
  privileged, tenant-scoped, support, emergency, lifecycle-sensitive, or
  object-sensitive
- affected permission artifacts, including architecture permission mappings,
  workspace CSV exports, capability matrix rows, API contract authz notes,
  feature docs, and capability catalog materialization posture
- allow/deny proof command, review workflow, or explicit blocked reason

The task packet must also fill the Permission Mapping Contract. If the mapping
row is not currently runtime-enforced, the contract must say whether it is
documentation-only, seed-backed, corrective-migration-backed, target,
architecture-target, or blocked, and must name the split or blocker that keeps
the permission from becoming usable prematurely.

Until Layer 2 approves configuration-based and relationship-based
authorization, rows that mention configuration-based, relationship-based, ABAC,
or ReBAC posture must be marked `architecture-target` or `blocked`, must remain
UI-ineligible, and must route model approval to `GOV:architecture-update`.

## Split Conditions

Split or block the task when:

- the approved authz model source is missing, proposed, contradictory, or would
  need to change before the mapping can be accurate
- runtime authorization, route guards, middleware, session context, domain
  permission checks, or object-level enforcement must change
- new or changed grants require seed data, corrective migrations, or live data
  repair
- API request/response, status code, validation, or authn/authz contract wording
  must change
- executable allow/deny tests are missing or newly required
- a shared-cross-tenant, public, system, or internal permission boundary lacks
  an approved decision
- UI eligibility would expose a capability that is not runtime-enforced or is
  blocked/documentation-only
- configuration-based, relationship-based, ABAC, or ReBAC posture is recorded
  as current, target, seed-backed, corrective-migration-backed, or
  runtime-enforced without approved Layer 2 authority
- support, emergency, system/job, lifecycle, object, relationship, or attribute
  rules lack safe denial and audit/proof expectations

## Related Task Boundaries

- Route contract wording belongs to `DOC:api-contract` when the permission
  change affects API-visible authn/authz behavior.
- Grant seed or corrective migration work belongs to `DEV:migration-persistence`.
- Runtime enforcement belongs to `DEV:backend`, `DEV:platform-seam`, or
  `DEV:vertical-slice`, depending on the approved seam.
- Executable allow/deny coverage belongs to `TEST:test-only` when no product
  behavior is changing.
- Runtime/browser/live evidence capture belongs to `EVIDENCE:qa-evidence` when
  the task needs to prove current behavior or evidence posture without changing
  executable tests or production behavior.
- Changes to evaluator order, authority-world policy, grant-source vocabulary,
  role-family policy, lifecycle policy, ABAC/ReBAC extension rules, or the
  permission mapping schema as a durable governance authority belong to
  `GOV:architecture-update` for now.

## Worked Examples

| Scenario | Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| Existing root capability is enforced in middleware, but the permission mapping doc lacks the route-to-capability row. | `runtime-enforced-row` | Update the exact mapping artifact row with capability key, root authority world, actor boundary, safe denial category, audit/proof expectation, evidence inventory, and allow/deny proof command. | Do not change middleware, grants, route code, or tests; split missing executable proof to `TEST:test-only`. |
| New permission is approved for future UI planning but has no runtime enforcement or grant source. | `documentation-only-row` | Record row posture as documentation-only, UI-ineligible, grant source blocked/not-applicable, and split/runtime blocker so the capability cannot become selectable. | Do not seed grants or expose UI eligibility. |
| Feature needs relationship-based access before Layer 2 approves ReBAC/relationship posture. | `future-authz-model-row` | Mark the row `architecture-target` or `blocked`, keep UI eligibility `no`, name the missing Layer 2/GOV architecture decision, and block dependent backend/frontend work. | Do not record as current, target, seed-backed, corrective-migration-backed, or runtime-enforced truth. |
| A UI selector might show a capability that is seed-backed but not runtime-proven. | `ui-eligibility-review` | Review mapping docs, grant source, UI surface, and allow/deny evidence; output eligibility as blocked or hidden until runtime proof exists. | Do not patch the UI; route UI changes to `DEV:frontend` after permission truth is settled. |
| Approved role grants need seed-backed mapping rows, but the runtime enforcement already exists. | `grant-source-row` | Record capability key, role/grant source posture as seed-backed, exact seed or migration source inventory, runtime enforcement evidence, UI eligibility, and split migration impact. | Do not create or repair seed data inside mapping docs; route seed/corrective migration work to `DEV:migration-persistence`. |
| A capability applies only to active tenant objects and must deny soft-deleted or cross-tenant objects. | `runtime-enforced-row` | Record authority world, object/lifecycle boundary, current tenant context source, cross-tenant deny rule, safe denial category, audit/proof expectation, and allowed/denied proof commands. | Do not infer object rules from route params alone; missing lifecycle or object-level policy routes to architecture or backend/authz work. |

## Required Check IDs

- `permission-authz-model-source`
- `permission-mapping-class`
- `permission-capability-rows`
- `permission-boundary`
- `permission-grant-source-ui`
- `permission-mapping-row-posture`
- `permission-denial-audit`
- `permission-allow-deny`
- `permission-evidence-inventory`
- `permission-grants-migration`
- `permission-split-routing`
- `permission-authz-proof`
