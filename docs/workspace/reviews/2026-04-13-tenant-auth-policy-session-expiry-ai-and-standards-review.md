# AI And Standards Review

## Scope

- Change:
  `tenantAuthPolicy` refinement adding tenant-scoped session expiry overrides
  through `sessionTtlSeconds`, plus shared-principal login expiry aggregation
  in `tenantAuth`
- Review date:
  2026-04-13

## Human Owner

- Owner:
  Gordon Rose
- Acceptance responsibility:
  the human owner remains accountable for accepting the auth-policy contract
  expansion, migration, session-expiry semantics, and the verification posture
  recorded for this refinement

## AI Assistance Disclosure

- Material AI assistance:
  yes
- Assisted artifacts:
  - implementation changes in `tenantConfiguration` and `tenantAuth`
  - migration drafting for the new tenant policy column
  - test drafting and updates across unit, integration, audit, and
    non-functional coverage
  - source-independent doc and planning-artifact refresh
  - this AI/standards review note

## Model / Tool / Version

- Tool:
  OpenAI Codex coding agent session
- Model family:
  GPT-5
- Version / exact model metadata:
  exact dated model/version metadata was not exposed in the repo-local session
  artifacts available during this change
- Evidence availability note:
  this high-risk note records the available tool and model-family evidence
  only; exact model/version traceability remains a tooling gap

## Source Of Truth Used

- `AGENTS.md`
- relevant architecture docs and ADRs, especially
  [system-overview.md](/home/gordon/kanbien/docs/architecture/system-overview.md),
  [0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md](/home/gordon/kanbien/docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md),
  and
  [0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md](/home/gordon/kanbien/docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md)
- relevant PRD and PRD test-case doc:
  [2026-04-09-0010-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0010-tenant-auth-policy-foundation.md)
  and
  [2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md)
- implementation blueprint:
  [2026-04-09-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-09-tenant-auth-policy-foundation.md)
- scoped source files under
  [tenantConfiguration](/home/gordon/kanbien/src/features/tenantConfiguration)
  and
  [tenantAuth](/home/gordon/kanbien/src/features/tenantAuth)
- scoped executable tests under
  [tests/unit/tenantConfiguration](/home/gordon/kanbien/tests/unit/tenantConfiguration),
  [tests/unit/tenantAuth](/home/gordon/kanbien/tests/unit/tenantAuth),
  [tests/integration/tenantConfiguration](/home/gordon/kanbien/tests/integration/tenantConfiguration),
  [tests/integration/tenantAuth](/home/gordon/kanbien/tests/integration/tenantAuth),
  [tests/audit/tenantConfiguration](/home/gordon/kanbien/tests/audit/tenantConfiguration),
  and
  [tests/performance/tenantAuth](/home/gordon/kanbien/tests/performance/tenantAuth)

## Prompt And Data Handling

- Secrets or production credentials in prompts:
  none
- Sensitive personal/customer/confidential data in prompts:
  none beyond repo-local code, docs, synthetic test identities, and local
  architecture context
- Minimization note:
  the work stayed inside repo-local artifacts and local test execution; no
  real customer data, production secrets, or live tokens were used as prompt
  material

## Independent Verification

- Commands run:
  - `npx vitest run tests/unit/tenantConfiguration/policy.test.ts tests/unit/tenantAuth/service.test.ts tests/integration/tenantConfiguration/flow.test.ts tests/integration/tenantConfiguration/persistence.test.ts tests/audit/tenantConfiguration/audit.test.ts`
  - `npx vitest run tests/integration/tenantAuth/flow.test.ts tests/performance/tenantAuth/nonFunctional.test.ts`
  - `npm test -- --runInBand tests/unit/tenantConfiguration/policy.test.ts`
- Deterministic evidence summary:
  - focused unit, integration, audit, and non-functional suites passed
  - the tenant-auth policy E2E flow coverage remained passing during the broad
    repo test-driver rerun executed in this turn
  - the live Postgres rerun for the new `session_ttl_seconds` column was not
    executed in this turn because `RUN_POSTGRES_TESTS` was not enabled

## Dependency / Snippet Provenance

- New package or service introduced:
  none
- External snippet/copied-pattern provenance note:
  no third-party code snippet or new dependency was adopted; the refinement
  stays within existing repo patterns for feature-local policy storage,
  service-level resolution, server-backed session expiry, and contract/test
  structure

## Expert Review Note

- High-risk change classification:
  yes; this is materially AI-assisted auth, session-management, contract, and
  migration work
- Human security/compliance review note:
  the refinement was checked against the repo's backward-compatibility rule,
  tenant-boundary defaults, durable-data rules, and shared-principal auth
  model. The implemented rule changes only newly minted session expiry and does
  not silently rewrite existing persisted sessions.

## Standards Gate Summary

- `NIST SSDF`:
  partial-to-moderate; planning and deterministic evidence were refreshed after
  the initial process miss, but exact model/version traceability remains
  incomplete
- `OWASP ASVS`:
  moderate for this refinement; session-management truthfulness improved and
  tenant-scoped policy control stayed server-authoritative
- `NIST CSF 2.0`:
  low-to-moderate; identity/session governance improved locally without a
  broader platform posture change
- `ISO 27001 / 27002`:
  moderate; auth-sensitive change evidence, accountability, and documented
  review improved for this slice
- `GDPR / Data Transfer`:
  no new processor or data-transfer posture change; the refinement continues to
  use server-backed session state
- `EU AI Act`:
  not applicable; no product AI capability was introduced
- `AI-Assisted Development`:
  partial; the review note closes the provenance gap for this auth-sensitive
  refinement, but exact model-version traceability is still unavailable

## Known Limits / Follow-Up

- Remaining evidence gaps:
  exact model/version metadata is unavailable, and the Postgres-gated
  persistence suite was not rerun against a live local Postgres environment in
  this turn
- Follow-up action if needed:
  rerun `tests/integration/tenantConfiguration/persistence.test.ts` with
  `RUN_POSTGRES_TESTS=true` before treating the persistence evidence for the
  new column as fully closed
