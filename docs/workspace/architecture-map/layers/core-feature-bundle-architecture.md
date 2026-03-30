# Feature-Bundle Architecture

## Current Status

- `present`

## What This Layer Should Do

- make features modular and replaceable
- keep contracts, domain logic, persistence, and transport separate
- enforce narrow public seams between features

## Implemented To Date

- consistent `contract/domain/persistence/transport/integration/index` shape
- explicit feature-local ownership in `rootUsers` and `rootAuth`
- narrow exported cross-feature seams such as root-user auth-state and browser
  summary readers

## Still Missing / Next Steps

- prove the pattern against more features beyond auth and root-user management
- keep future shared seams ADR-backed as the platform grows
