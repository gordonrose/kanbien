# Capability Matrix v4 Template

Use one row per field in the matrix and fill in the following groups.

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
- Frontend visibility rule
- Backend enforcement rule
- Audit actor role required?

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
- Session / auth dependency
- Compatibility / migration notes

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
