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

## Required Check IDs

- `api-route-family`
- `api-request-response`
- `api-authz-validation`
- `api-compatibility`
- `api-maintained-artifacts`
- `api-validation-command`
