# Capability Matrix v4 Template

Use one row per capability in the matrix and fill in the following groups.

V4 remains legacy-compatible for existing matrices. Prefer
`capability-matrix-v5-template.md` for new permission-sensitive,
platform-scope, tenant-boundary, asset, billing, compliance, or background-job
capabilities because v5 records the explicit architecture and authorization
envelope required by the current planning harness.

## Capability Identity

- Feature
- Capability
- Capability type
- Phase
- Status

## Business Intent

- Business goal
- User outcome
- Notes / constraints

## Actor And Authorization

- Primary actor
- Allowed root roles
- Minimum role required
- Explicitly denied roles
- Authorization summary
- Governing authz capability
- Authz scope type
- Granted role / boundary
- Mandatory grant?
- Protected grant?
- Frontend visibility rule
- Backend enforcement rule
- Audit actor role required?

Use these fields so the matrix can act as the source artifact for rebuilding:

- backend-to-authz capability mappings
- role-to-authz capability mappings

When a row is not a normal role-granted capability, fill the fields explicitly:

- public entrypoints:
  - `Granted role / boundary = public unauthenticated caller`
- internal seams:
  - `Granted role / boundary = system internal seam`
- internal bootstrap or migration behavior:
  - `Granted role / boundary = internal migration execution`

## Frontend Slice

- Frontend required?
- Frontend route
- Frontend surface
- Frontend states
- Session / expiry behavior
- Client-side permission behavior

## Backend Slice

- API required?
- Route(s)
- Request contract
- Response contract
- Error contract
- Feature seam(s)
- Cross-feature seams

## Persistence And Platform

- Persistence impact
- Migration required?
- Indexes / uniqueness
- Search / filter model
- Lifecycle / cleanup rules
- Expiry / abandoned-state behavior
- Orphaned external resource handling
- Scheduled maintenance or job dependency
- Session / auth dependency
- Compatibility / migration notes

When a capability may involve background work, bulk operations, retryable
external calls, delayed execution, imports/exports, cleanup, or long-running
processing, use these fields to record the async decision instead of leaving it
implicit:

- `Persistence impact` names the durable owning entity or says async work is
  not needed.
- `Lifecycle / cleanup rules` covers retry, dead-letter, cancellation,
  partial-failure, expiration, and abandonment semantics.
- `Scheduled maintenance or job dependency` names the job type, payload
  version, queue, priority, enqueue seam, worker handler seam, and whether
  provider/infrastructure tests are opt-in.
- `Compatibility / migration notes` names idempotency keys, safe payload shape,
  forbidden payload data, tenant/root context revalidation, and durable progress
  or operator metadata.

## Security / Privacy / Audit

- Authentication requirement
- Authorization enforcement layer
- CSP / browser security impact
- Audit requirement
- Privacy / personal data impact
- Standards impact

## Delivery And Anti-Drift

- PRD required?
- ADR required?
- Test-case doc required?
- Feature docs update required?
- Runbook required?
- Standards review required?
- Repo health review required?
- Traceability status
- Lifecycle version/status

## Verification

- Unit tests
- Integration tests
- Security tests
- Audit tests
- Edge tests
- Frontend tests
- Acceptance notes
