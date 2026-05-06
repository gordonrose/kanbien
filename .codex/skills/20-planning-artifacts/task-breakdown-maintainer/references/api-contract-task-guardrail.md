# API Contract Task Guardrail

Use for task type: `DOC:api-contract`

## Must Preserve

- route params, request/response shape, status codes, authn/authz, pagination,
  sorting, validation, and system-managed fields
- OpenAPI/Postman impact when maintained for the seam
- backwards compatibility unless an approved strategy exists

## Approval Evidence

- API contract class
- route family and contract path
- maintained artifact inventory for docs, OpenAPI, Postman, generated docs, or
  not-maintained rationale
- changed or unchanged API behavior
- compatibility posture
- validation command or review workflow
- human-review boundary for contract wording and compatibility judgment

## API Contract Classes

- `no-wire-change-refresh`: refresh contract docs without changing wire
  behavior; compatibility posture must be `no-wire-change`.
- `additive-route-contract`: document an approved additive method, route, field,
  status, or error shape; compatibility posture must be `additive`.
- `compatibility-sensitive-contract`: document or block a breaking or
  compatibility-sensitive contract change with approval or migration routing.
- `openapi-postman-sync`: update maintained OpenAPI and/or Postman artifacts for
  an already-approved route contract.
- `generated-docs-sync`: update generated API docs or generated API summaries
  through the approved generation/materialization workflow.

## Deep Delivery Standard

- one route family, contract behavior, or compatibility decision per queued task
- split API contract documentation from DEV:backend implementation when each has a
  distinct proof target or artifact owner
- name the exact contract file, route shape, and validation command or review
  output
- fill the API Contract table with class, maintained-artifact inventory,
  exact target artifacts, split routing, and human-review boundary

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

The task packet must also fill the API Contract table. If OpenAPI, Postman, or
generated API docs are not maintained for the affected route seam, the task
must say so explicitly with rationale instead of assuming.

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

## Worked Examples

| Scenario | Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| Human-readable contract says `pageSize` defaults to `50`, but route and tests prove the repo default is `25`. | `no-wire-change-refresh` | Update one `docs/api-contracts/<route-family>.md` file; source inventory names route handler, schema, tests, and current contract; proof command is the focused route/contract test plus `git diff --check`; human review confirms wording matches existing behavior. | Do not change handler defaults, OpenAPI, or Postman unless they are maintained and stale for the same route seam. |
| Approved story adds `GET /v1/root-admin/tenants/:tenantId/logo` with existing authz and no schema change. | `additive-route-contract` | Document method/path, required route param, response/status/error shape, root authz, tenant boundary, and maintained artifact inventory before the backend task queues. | Runtime route, transport schema, permission row, and executable tests split to `DEV:backend`, `DOC:permission-mapping`, and `TEST:test-only` when not already complete. |
| A route would rename `tenantId` to `id` or remove a response field. | `compatibility-sensitive-contract` | Record compatibility-sensitive posture, approved migration/alias requirement, affected consumers, and blocked follow-up before any contract text presents the new shape as current. | Do not implement the rename or delete consumers; block to architecture/product approval or owning DEV task. |
| Route family has no maintained OpenAPI/Postman artifacts. | `no-wire-change-refresh` or `additive-route-contract` | Maintained artifact inventory says `OpenAPI not maintained: <rationale>` and `Postman not maintained: <rationale>`; validation evidence uses contract review and focused tests. | Do not create ad hoc OpenAPI/Postman files inside this task unless a standards/governance task approves maintaining them. |
| OpenAPI and Postman are maintained for an already-approved root-admin route family, but the human-readable contract is current and only machine-readable artifacts drifted. | `openapi-postman-sync` | Inventory the contract doc, OpenAPI file, Postman collection, generation or validation command, and representative route tests; update only maintained OpenAPI/Postman artifacts and record compatibility posture unchanged. | Do not change route handlers, schemas, permission rows, or human-readable contract wording unless those are stale and routed into their own task. |
| Generated API docs or summaries must be refreshed from maintained contract truth after the approved generator changed. | `generated-docs-sync` | Name the approved materialization command, generated output paths, source contract files, expected generated diff, and validation/check command; human review is limited to generated output reasonableness and source-truth alignment. | Do not hand-edit generated docs unless the generator allows a maintained override; generator changes route to `DEV:platform-seam` or `GOV:standards-update` when authority changes. |

## Required Check IDs

- `api-route-family`
- `api-contract-class`
- `api-contract-source`
- `api-request-response`
- `api-authz-validation`
- `api-compatibility`
- `api-maintained-artifact-inventory`
- `api-maintained-artifacts`
- `api-split-routing`
- `api-validation-command`
