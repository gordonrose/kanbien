# Source-Independent API Contract Docs

## Current Status

- `present`

## What This Layer Should Do

- document API route families in a way that survives code loss
- capture auth, middleware, browser transport, side effects, and error
  behavior that OpenAPI alone may not express well
- support rebuild-from-spec and compliance review

## Implemented To Date

- `docs/api-contracts/` exists
- root-auth, root-users, and root-roles route-family contract docs exist
- `api-contract-maintainer` skill exists

## Still Missing / Next Steps

- expand coverage as more features and route families are added
- decide whether to add a machine-readable companion layer later
