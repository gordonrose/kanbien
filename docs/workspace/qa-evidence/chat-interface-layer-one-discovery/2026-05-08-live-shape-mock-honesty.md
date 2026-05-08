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
| Persistence row shape | pass | `RUN_POSTGRES_TESTS=true npx vitest run tests/integration/harnessChat/persistence.test.ts` passed 4 tests after applying the harnessChat migration family, including durable LLM usage reserve/complete/block behavior. |
| Live OpenAI-backed protected API path | pass | Runtime proof through `http://127.0.0.1:3000/v1/root-admin/harness-chat/conversations` authenticated with root auth, returned an OpenAI-backed assistant reply, and persisted 2 messages plus a `harness_chat_llm_usage_attempts` row with `state = succeeded`, `model = gpt-5.2`, and `output_chars = 179`. |
| Live browser Build panel path | pass | Headless browser proof authenticated into `/root-admin`, submitted a Build panel message, observed the live assistant response rendered in the shared conversation panel, and verified the persisted conversation `408f3410-8759-4a88-a887-8029573d3c6a` had 2 messages and a succeeded LLM usage attempt with `output_chars = 260`. |

## Mock Honesty

The router tests use the same route family mounted by the feature:
`/v1/root-admin/harness-chat`.

The mocked service responses include server-owned identifiers, root actor ids,
timestamps, lifecycle state, packet revision state, message sequence, and PDF
availability. The tests do not add browser-only fallback fields or treat
surface context as authority.

This evidence now includes both mocked route-shape coverage and live runtime
coverage. The live browser proof used the actual root-admin shell, protected
root auth flow, OpenAI-backed chat adapter, and Postgres persistence. It does
not store raw provider prompts or responses in the usage-attempt entity.
