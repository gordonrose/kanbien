# Permission Mapping Task Guardrail

Use for task type: `DOC:permission-mapping`

## Must Preserve

- capability keys, root/tenant/shared-cross-tenant boundary, grants, deny rules,
  and object-level rules when relevant
- migration-backed role grants for protected DEV:backend behavior
- current tenant context remains exactly one context per request

## Approval Evidence

- capability rows and roles affected
- allow and deny expectations
- seed or corrective migration impact
- security/authz proof command

## Deep Delivery Standard

- one capability key, grant boundary, deny rule, or tenant-context decision per
  queued task
- split mapping docs, seed migration, and authz runtime implementation when
  they have distinct write sets or proof
- name the exact role/capability rows and allow/deny proof

## Ownership Boundary

`DOC:permission-mapping` owns source-independent permission truth. It may create
or update:

- permission mapping docs under `docs/permission-mapping/`
- role-to-capability, capability-to-route, and allow/deny mapping tables when
  maintained as planning or documentation artifacts
- permission compatibility notes and review evidence
- task packet evidence that traces permission-sensitive behavior back to
  approved capability rows

It does not implement authorization behavior. Runtime authz enforcement,
middleware, route guards, transport behavior, feature-domain permission checks,
seed/corrective grant migrations, and executable allow/deny tests must split
into the owning task type.

## Required Packet Evidence

Before queueing, the task packet should name:

- exact capability keys, roles, grants, denied roles, and protected surfaces
- root, tenant, shared-cross-tenant, public, system, or internal boundary
  posture
- current tenant context, cross-tenant deny rule, and object-level rule when
  relevant
- whether role grants are documentation-only, pre-existing, seed-backed,
  corrective-migration-backed, or blocked pending approval
- affected permission artifacts, including `docs/permission-mapping/`,
  capability matrix rows, API contract authz notes, and feature docs
- allow/deny proof command, review workflow, or explicit blocked reason

## Split Conditions

Split or block the task when:

- runtime authorization, route guards, middleware, session context, domain
  permission checks, or object-level enforcement must change
- new or changed grants require seed data, corrective migrations, or live data
  repair
- API request/response, status code, validation, or authn/authz contract wording
  must change
- executable allow/deny tests are missing or newly required
- a shared-cross-tenant, public, system, or internal permission boundary lacks
  an approved decision

## Related Task Boundaries

- Route contract wording belongs to `DOC:api-contract` when the permission
  change affects API-visible authn/authz behavior.
- Grant seed or corrective migration work belongs to `DEV:migration-persistence`.
- Runtime enforcement belongs to `DEV:backend`, `DEV:platform-seam`, or
  `DEV:vertical-slice`, depending on the approved seam.
- Executable allow/deny coverage belongs to `TEST:test-only` when no product
  behavior is changing.

## Required Check IDs

- `permission-capability-rows`
- `permission-boundary`
- `permission-allow-deny`
- `permission-grants-migration`
- `permission-authz-proof`
