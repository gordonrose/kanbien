# Tenant Auth Policy Session Expiry Exploratory QA Note

## Metadata

- Scope:
  `tenantAuthPolicy` per-tenant session-expiry refinement
- Owner:
  platform engineering
- Date:
  2026-04-13
- Environment:
  local repo execution
- Related PRD:
  [2026-04-09-0010-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0010-tenant-auth-policy-foundation.md)
- Related journey inventory:
  [2026-04-10-0010-tenant-auth-policy-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-10-0010-tenant-auth-policy-foundation-journey-inventory.md)
- Related test summary:
  [2026-04-13-tenant-auth-policy-session-expiry-test-summary.md](/home/gordon/kanbien/docs/workspace/test-run-summaries/2026-04-13-tenant-auth-policy-session-expiry-test-summary.md)

## Charter

- Why this exploratory review is required:
  This refinement changes authenticated-session expiry semantics in an auth
  path and introduces a new tenant-scoped policy field plus migration.
- Key risks being probed:
  stale docs claiming expiry is global-only, tenant-policy reads drifting from
  actual session-mint behavior, and shared-principal sessions outliving a
  stricter tenant TTL.

## Areas Exercised

- Workflow areas:
  root policy update payload shape, effective policy read surfaces, shared
  principal login expiry behavior, and docs-to-code alignment for session TTL
- Error/deny states:
  session TTL below platform floor, unexpected-field rejection, and unchanged
  capability-denied privileged update behavior
- Lifecycle or operator-induced states:
  a root operator shortens tenant session TTL after the broader tenant-auth
  foundation already exists
- External integrations or compatibility surfaces:
  none beyond existing root-session, tenant-session, and Postgres migration
  seams

## Findings

- `No findings`
  The exercised flows remained internally consistent: root updates expose the
  new field, effective policy reads report it truthfully, and shared-principal
  login now uses the shortest effective tenant TTL without changing the stored
  semantics of already-created sessions.

## Follow-Up

- Defects opened:
  none
- Test additions or changes required:
  none beyond the executed refinement coverage
- Policy or artifact updates required:
  rerun the Postgres-gated persistence suite in a Postgres-enabled environment
  if full persistence evidence is required for release closeout

## QA Conclusion

- Result:
  pass with one evidence gap noted
- Notes:
  Confidence is good for the behavior and contract layers; only the local
  Postgres rerun remains unexecuted in this turn.
