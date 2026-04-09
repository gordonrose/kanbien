# Tests Layout

The `tests/` tree is organized by role.

## Support And Infrastructure

- `tests/setup/`
  Process-level test setup such as environment defaults and shared hooks.
- `tests/helpers/`
  Lightweight reusable assertions and pure utility helpers.
- `tests/harness/`
  Test infrastructure that coordinates with app/runtime code, such as HTTP
  helpers, durable test-data helpers, Postgres-backed harnesses, and future
  feature test factories.

Persistence-backed test environment setup is documented in
[`docs/testing/persistence-tests.md`](/home/gordon/kanbien/docs/testing/persistence-tests.md).

## Test Layers

- `tests/platform/`
  Platform-owned smoke and wiring tests that are not feature-local.
- `tests/unit/<area>/`
  Isolated capability tests with minimal dependencies.
- `tests/integration/<area>/`
  Multi-module or cross-feature tests.
- `tests/e2e/<area>/`
  Multi-step end-to-end journey tests for customer or operator workflows that
  cross capability boundaries or rely on durable workflow state.
- `tests/security/<area>/`
  Security-focused tests when a dedicated folder becomes useful.
- `tests/audit/<area>/`
  Audit or logging-focused tests when a dedicated folder becomes useful.
- `tests/performance/<area>/`
  Performance, stress, soak, or non-functional behavior checks when a
  dedicated folder becomes useful.

## Current Convention

- Runtime-facing testing-data framework code that supports scripts belongs under
  `src/lib/testingData/`.
- Test-only factories and durable data helpers belong under `tests/harness/`.
- PRD-derived executable tests should still live under their recommended test
  layer, even when they depend on shared harness utilities.
- End-to-end journey tests should repeat reviewed `JY-*` journey IDs in the
  test name or a nearby executable comment.
