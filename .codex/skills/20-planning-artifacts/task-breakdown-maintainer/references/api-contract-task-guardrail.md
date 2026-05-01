# API Contract Task Guardrail

Use for task type: `DOC:api-contract`

## Must Preserve

- route params, request/response shape, status codes, authn/authz, pagination,
  sorting, validation, and system-managed fields
- OpenAPI/Postman impact when maintained for the seam
- backwards compatibility unless an approved strategy exists

## Approval Evidence

- route family and contract path
- changed or unchanged API behavior
- compatibility posture
- validation command or review workflow

## Deep Delivery Standard

- one route family, contract behavior, or compatibility decision per queued task
- split API contract documentation from DEV:backend implementation when each has a
  distinct proof target or artifact owner
- name the exact contract file, route shape, and validation command or review
  output

## Ownership Boundary

`DOC:api-contract` owns API-facing contract truth. It may create or update:

- human-readable API contract docs under `docs/api-contracts/`
- OpenAPI artifacts when they are maintained for the affected route seam
- Postman artifacts when they are maintained for the affected route seam
- route compatibility notes and contract review evidence

It does not implement the API. Route handlers, transport schemas, domain
behavior, persistence, authz enforcement, migrations, and executable tests must
split into the owning task type.

## Required Packet Evidence

Before queueing, the task packet should name:

- route family, exact route paths, methods, and contract artifact paths
- params, query, request body, response shape, status codes, and error posture
- authn/authz, tenant-boundary, validation, pagination, sorting, and
  system-managed field behavior
- compatibility posture: no wire change, additive, compatibility-sensitive, or
  blocked pending migration/approval
- maintained API artifact impact for `docs/api-contracts/`, OpenAPI, Postman,
  generated docs, and test-case traceability
- validation command, contract review workflow, or explicit blocked reason

## Split Conditions

Split or block the task when:

- route implementation, transport schema, domain/service behavior, or runtime
  authz enforcement must change
- new capability keys, grants, or deny rules are required
- persistence, migration, index, uniqueness, or repository behavior must change
- executable proof is missing or newly required
- public/backwards compatibility changes lack an approved strategy

## Docs Artifact Boundary

`DOC:docs-artifact` may audit stale OpenAPI/Postman or API contract drift during
a broader artifact sweep. Actual route-contract updates should route to
`DOC:api-contract` so the task carries route shape, authz, validation, and
compatibility evidence.

## Required Check IDs

- `api-route-family`
- `api-request-response`
- `api-authz-validation`
- `api-compatibility`
- `api-maintained-artifacts`
- `api-validation-command`
