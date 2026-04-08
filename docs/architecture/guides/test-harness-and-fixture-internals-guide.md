# Test Harness And Fixture Internals Guide

## Purpose

Document the source-independent testing harness seams that make the repo's
verification model work, so test infrastructure can be rebuilt without
depending only on existing `tests/` source files.

This guide complements:

- `docs/architecture/guides/testing-and-verification-guide.md`
- `tests/README.md`

by focusing on the internals of the harnesses rather than only the high-level
test-layer model.

## Scope

This guide covers:

- test harness roles
- harness ownership boundaries
- in-memory versus persistence-backed harness patterns
- fixture factories and deterministic helper patterns
- the minimum responsibilities each harness seam must preserve

It does not replace feature-specific executable tests.

## Current Harness Topology

Current harness roots:

- `tests/harness/http.ts`
- `tests/harness/postgres/*`
- `tests/harness/rootAuth/*`
- `tests/harness/testData/*`
- `tests/helpers/*`

Use these as the authoritative harness buckets when rebuilding test support.

## Design Rules

### 1. Harnesses are repo infrastructure, not feature business logic

- harness files may compose app and feature seams for tests
- harnesses must not become the only place that knows business rules
- feature contracts and executable tests still own behavioral truth

### 2. Keep harnesses deterministic

- use stable timestamps, IDs, and seeded defaults where practical
- make helper outputs reconstructable and reviewable
- avoid hidden ambient state

### 3. Distinguish support layers clearly

- `tests/harness/`
  owns reusable infrastructure that coordinates with runtime code
- `tests/helpers/`
  owns lighter-weight utilities, pure helpers, and feature-local support code

## HTTP Harness

Primary file:

- `tests/harness/http.ts`

Responsibilities:

- provide an in-process request/response driver for Express apps
- support JSON request invocation without opening a real network socket
- expose a simple cookie jar for browser-style tests
- preserve enough request metadata for middleware and auth layers to behave
  realistically:
  - headers
  - `ip`
  - `protocol`
  - cookie transport

Rebuild expectation:

- preserve `invokeJson(...)` as the default in-process JSON invocation seam
- preserve `invokeText(...)` for non-JSON surfaces
- preserve cookie absorption and replay behavior for browser/session tests

## Postgres Harness

Primary files:

- `tests/harness/postgres/migrations.ts`
- `tests/harness/postgres/testDatabase.ts`

Responsibilities of `migrations.ts`:

- define the explicit migration order used by persistence-backed tests
- group migrations by feature or capability dependency
- render root-auth bootstrap placeholders safely for test execution
- apply migrations transactionally into the dedicated test database

Responsibilities of `testDatabase.ts`:

- read dedicated Postgres test DB config from `TEST_DATABASE_*`
- enforce `NODE_ENV=test` for persistence-backed tests
- create the test DB pool used by the persistence harness
- reset owned tables for deterministic isolation
- honor preserve-mode behavior for forensic inspection

Rebuild expectation:

- preserve migration ordering as a first-class harness concern
- preserve reset-first deterministic isolation by default
- preserve explicit table-drop reset logic rather than assuming feature tests
  clean up after themselves
- preserve preserve/debug mode as an opt-in behavior

## Root Auth Harnesses

Primary files:

- `tests/harness/rootAuth/serviceHarness.ts`
- `tests/harness/rootAuth/integrationHarness.ts`

### Service harness responsibilities

`serviceHarness.ts` owns:

- in-memory or mocked repository seams for root-auth service-unit tests
- deterministic fixture factories for:
  - auth principals
  - login challenges
  - sessions
  - SSH public keys
- generated Ed25519 key material for signing challenge text in tests

Rebuild expectation:

- preserve factory helpers for root-auth record shapes
- preserve generated key material rather than hard-coding private keys
- preserve a mocked `PlatformSecurityRepository` seam for service tests

### Integration harness responsibilities

`integrationHarness.ts` owns:

- in-process Express app assembly for protected feature integration tests
- root-auth, root-users, and root-roles composition needed to exercise
  authenticated route families
- seeded root-user/auth identities
- in-memory capability grants and audit event capture
- reusable bootstrapping for protected-route tests across features

Rebuild expectation:

- preserve explicit app composition rather than hidden auto-discovery
- preserve seeded identity helpers
- preserve audit-event capture for security and audit assertions
- preserve capability-grant injection so protected features can be exercised
  through realistic authz paths

## Durable Test Data Harness

Primary file:

- `tests/harness/testData/durableData.ts`

Responsibilities:

- create run-tagged synthetic values for durable tests
- register created durable IDs into the manifest system
- keep durable cleanup tied to run IDs rather than ad hoc handwritten cleanup

Rebuild expectation:

- preserve test-run tagging for emails and labels
- preserve manifest registration helpers
- preserve a clear split between durable test-data generation and cleanup
  execution

## Feature Helpers

Primary examples:

- `tests/helpers/notificationDeliveryHarness.ts`
- `tests/helpers/tenantsHarness.ts`

Responsibilities:

- feature-local support for route mounting and fake provider seams
- lightweight abstractions that would be too feature-specific for the generic
  harness layer

Rebuild expectation:

- keep feature helpers capability-focused
- do not move generic harness concerns into feature helpers
- do not move feature business rules into generic harness infrastructure

## Rebuild-From-Docs Expectations

When reconstructing the test harness layer, preserve at minimum:

- an in-process Express invocation harness
- a deterministic Postgres migration and reset harness
- a reusable protected-route integration harness for authenticated root-user
  flows
- durable test-data tagging and manifest registration helpers
- feature-local helper seams for provider stubs and route mounting

## Maintenance Rule

Update this guide when a change:

- adds a new harness root or major harness seam
- changes migration-order or reset-harness behavior
- changes how protected-route integration tests are composed
- changes durable test-data registration or cleanup expectations
- moves a helper from generic harness code to feature-local helper code or vice
  versa
