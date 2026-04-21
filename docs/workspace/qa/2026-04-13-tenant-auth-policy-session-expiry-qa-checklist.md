# Tenant Auth Policy Session Expiry QA Checklist

## Metadata

- Scope:
  `tenantAuthPolicy` per-tenant session-expiry refinement
- Change class:
  auth/session, privileged root configuration, persistence-backed workflow
- Owner:
  platform engineering
- Date:
  2026-04-13
- Related PRD:
  [2026-04-09-0010-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0010-tenant-auth-policy-foundation.md)
- Related test cases:
  [2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md)
- Related journey inventory:
  [2026-04-10-0010-tenant-auth-policy-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-10-0010-tenant-auth-policy-foundation-journey-inventory.md)
- Related blueprint:
  [2026-04-09-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-09-tenant-auth-policy-foundation.md)
- Related test summary:
  [2026-04-13-tenant-auth-policy-session-expiry-test-summary.md](/home/gordon/kanbien/docs/workspace/test-run-summaries/2026-04-13-tenant-auth-policy-session-expiry-test-summary.md)

## Coverage Classification

- Required layers from QA coverage matrix:
  unit, integration, security, audit, end-to-end, persistence-backed,
  concurrency/idempotency, performance
- Required non-functional checks:
  login/session policy-resolution budget and expiry-rule determinism
- Structured exploratory QA required:
  yes
- Release-gate review required:
  yes

## Planning Checks

- [x] Required test layers were revalidated for the session-expiry refinement.
- [x] Required `TC-*` and `JY-*` artifacts were refreshed for the new policy field.
- [x] Shared-principal expiry aggregation and existing-session compatibility were reviewed explicitly.
- [x] Maintained source-independent docs were identified before closeout.
- [x] AI-assisted high-risk change review was identified as required.

## Execution Checks

- [x] Required unit suites passed.
- [x] Required integration suites passed.
- [x] Required audit suites passed.
- [x] Required performance suites passed.
- [x] Existing tenant-auth policy E2E suites remain passing after the refinement.
- [x] Focused local verification evidence is recorded in the test summary.
- [ ] Postgres-backed `tenantConfiguration` persistence suite rerun with `RUN_POSTGRES_TESTS=true`.

## Quality And Risk Checks

- [x] No open `critical` defects remain.
- [x] No open `high` defects remain for blocking workflows.
- [x] No blocking flaky tests remain unresolved.
- [x] Residual risk is documented honestly.
- [x] Existing sessions are not silently rewritten in place; only newly minted sessions change behavior.

## Human QA Checks

- [x] Structured exploratory QA note exists.
- [x] Operator-facing policy-read and policy-write behavior was reviewed.
- [x] Authenticated-session expiry behavior was reviewed for truthful current behavior.

## Final Decision

- QA decision:
  conditional pass pending optional Postgres rerun in an environment with
  `RUN_POSTGRES_TESTS=true`
- Notes:
  Local deterministic coverage for contract, service, integration, audit, and
  performance behavior passed. The only remaining evidence gap is that this
  turn did not rerun the Postgres-gated persistence suite against a live local
  Postgres test database.
- Approver:
  platform engineering / QA policy bootstrap
- Follow-up actions:
  rerun the persistence-gated suite in a Postgres-enabled environment before
  treating the refinement as fully evidenced at the persistence layer
