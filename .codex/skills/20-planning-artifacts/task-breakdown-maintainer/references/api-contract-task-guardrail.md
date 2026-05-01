# API Contract Task Guardrail

Use for task type: `API-contract`

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
- split API contract documentation from backend implementation when each has a
  distinct proof target or artifact owner
- name the exact contract file, route shape, and validation command or review
  output

## Required Check IDs

- `api-route-family`
- `api-request-response`
- `api-authz-validation`
- `api-compatibility`
- `api-maintained-artifacts`
- `api-validation-command`
