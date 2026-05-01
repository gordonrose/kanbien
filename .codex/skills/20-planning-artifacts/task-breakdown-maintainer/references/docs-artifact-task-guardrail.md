# Docs Artifact Task Guardrail

Use for task type: `DOC:docs-artifact`

## Must Preserve

- source-of-truth alignment with architecture, standards, PRD, contracts, and
  current implementation
- no source-independent docs describing stale platform behavior
- no artifact status promotion without validation or explicit blocker notes

## Approval Evidence

- source files or artifacts reviewed
- docs updated or intentionally not applicable
- validation or review command
- downstream stale-artifact sweep result

## Deep Delivery Standard

- one artifact family or source-truth alignment target per queued task
- separate decision/audit tasks from implementation or docs refresh tasks when
  the audit may change scope
- name the exact source files inspected, docs updated, and validation or review
  output

## API Artifact Boundary

`DOC:docs-artifact` may identify stale API contract, OpenAPI, or Postman
artifacts as part of a maintained-artifact sweep. It should not own the route
contract update itself when the change is about API request/response shape,
status codes, validation, authn/authz, pagination, sorting, or compatibility.
Route-contract artifact updates belong to `DOC:api-contract`.

## Required Check IDs

- `docs-source-truth-reviewed`
- `docs-stale-artifact-sweep`
- `docs-status-posture`
- `docs-validation-command`
