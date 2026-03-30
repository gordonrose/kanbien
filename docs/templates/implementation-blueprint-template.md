# Implementation Blueprint Template

Use this after the capability matrix and PRD exist.

The goal is to turn requirements into a buildable, reviewable implementation
plan without losing architecture, tests, docs, or standards coverage.

## Summary

- Feature:
- Capability:
- Scope:
- Phase:

## Inputs

- Capability matrix reference:
- PRD:
- ADR(s):
- PRD test-case doc:

## Frontend Plan

- Route / surface:
- UI states:
- Permission visibility behavior:
- Session / expiry behavior:
- Browser security considerations:

## Backend Plan

- Route(s):
- Request/response/error contract:
- Feature-local files expected:
- Cross-feature seams:
- Authorization enforcement point:

## Persistence Plan

- Entities / rows affected:
- Migration changes:
- Index or uniqueness changes:
- Search/filter implications:
- Compatibility notes:

## Verification Plan

- Unit:
- Integration:
- Security:
- Audit:
- Edge:
- Frontend:
- Persistence-backed:

## Documentation Plan

- PRD updates:
- PRD test-case updates:
- Feature docs:
- Runbook:
- Privacy note:
- Standards review:
- Repo health review:
