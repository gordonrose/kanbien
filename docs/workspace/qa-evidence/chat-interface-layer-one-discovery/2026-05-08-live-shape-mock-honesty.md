# QA Evidence: Chat Interface Live Shape And Mock Honesty

## Scope

- Story/task:
  S-008 / T-S008-02
- Journey IDs:
  JY-CHAT-L1-ROOT-BUILD-001, JY-CHAT-L1-HISTORY-001, JY-CHAT-L1-DENIALS-001
- Evidence date:
  2026-05-08

## Evidence Captured

| Evidence Target | Result | Evidence |
| --- | --- | --- |
| Protected route payload shape | pass | `npx vitest run tests/integration/harnessChat tests/security/harnessChat tests/security/rootAdmin/buildPanelContextAuthority.test.ts` passed 9 tests. |
| Authz denial shape | pass | `tests/security/harnessChat/routerAuthz.test.ts` proves create, list, append, generate, and PDF download deny with `FORBIDDEN` before service calls. |
| Context is display data only | pass | `tests/security/rootAdmin/buildPanelContextAuthority.test.ts` proves root-admin prompt context excludes query, hash, tenant-like values, and authorization fields. |
| Persistence row shape | partial | `tests/integration/harnessChat/persistence.test.ts` is present but skipped because no Postgres test database is configured in this runtime. |

## Mock Honesty

The router tests use the same route family mounted by the feature:
`/v1/root-admin/harness-chat`.

The mocked service responses include server-owned identifiers, root actor ids,
timestamps, lifecycle state, packet revision state, message sequence, and PDF
availability. The tests do not add browser-only fallback fields or treat
surface context as authority.

Residual gap: this evidence does not claim live database proof. The persistence
tests are ready, but this runtime did not provide a configured Postgres test
database, so row-level evidence remains pending.

