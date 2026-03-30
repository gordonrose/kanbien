# API Contract Template

Use this template when a capability or route family introduces or changes
backend routes.

The goal is to create a source-independent contract artifact that remains
useful for rebuild-from-spec and compliance-oriented review even if readers do
not start from the implementation files.

## Scope

- Contract name:
- Feature:
- Route family or capability group:
- In-scope routes:
- Out-of-scope but closely related routes:

## Capability

- Feature:
- Capability:

## Authentication

- Required auth state:
- Session transport(s):

## Authorization

- Allowed roles:
- Denied roles:
- Enforcement point:

## Middleware And Platform Effects

- Route protection middleware:
- Rate limiting / abuse controls:
- Browser-specific behavior:
- Other shared platform behavior:

## Route

- Method:
- Path:

## Request Contract

- Params:
- Query:
- Body:
- Validation rules:

## Response Contract

- Success payload:
- Status code:
- Response headers or cookies:

## Error Contract

- Error codes:
- Representative messages:
- `details` shape:
- Shared middleware errors:

## Persistence / Side Effects

- Durable writes:
- Audit effects:
- Cross-feature reads:
- Other side effects:

## Compatibility / Lifecycle Notes

- Notes:

## Traceability

- PRD / design docs:
- OpenAPI:
- Tests required or existing:

## Tests Required

- Unit:
- Integration:
- Security:
- Audit:
- Edge:
