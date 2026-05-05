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

## Approval Evidence

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
- seed or corrective migration impact
- security/authz proof command

## Deep Delivery Standard

- one capability key, role/boundary row, grant-source posture, deny rule,
  tenant-context rule, or permission artifact schema update per queued task
- split mapping docs, seed migration, and authz runtime implementation when
  they have distinct write sets or proof
- name the exact role/capability rows, approved authz model source, safe denial
  category, grant-source posture, and allow/deny proof
- do not use `DOC:permission-mapping` to approve a new authorization model. If
  the task changes evaluator order, authority-world policy, grant-source
  vocabulary, role-family policy, tenant lifecycle policy, or ABAC/ReBAC
  extension rules, route that governance change to `GOV:architecture-update`
  for now.

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

## Required Check IDs

- `permission-authz-model-source`
- `permission-capability-rows`
- `permission-boundary`
- `permission-grant-source-ui`
- `permission-mapping-row-posture`
- `permission-denial-audit`
- `permission-allow-deny`
- `permission-grants-migration`
- `permission-split-routing`
- `permission-authz-proof`
