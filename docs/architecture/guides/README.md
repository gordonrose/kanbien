# Architecture Guides

These guides sit between high-level ADRs and feature-specific PRDs.

Use them for repeatable implementation guidance that should remain consistent
across many changes, but does not belong in an ADR's narrow decision-history
format.

## Purpose

These guides exist to make the repo:

- easier to rebuild from specs
- more resilient to implementation drift
- more consistent across features and vertical slices
- safer for autonomous or semi-autonomous implementation work

## Guides

- `platform-seams-and-bootstrapping.md`
  How the app boots, where shared middleware lives, and how platform seams stay
  explicit.
- `platform-bootstrap-and-local-helpers-guide.md`
  How to make the repo runnable locally, which startup order matters, and which
  helper scripts are required versus optional.
- `feature-seams-and-public-contracts.md`
  How features expose public seams, how cross-feature reads work, and what
  stays private.
- `frontend-implementation-guide.md`
  How browser surfaces should be structured, integrated, and documented.
- `persistence-and-migrations-guide.md`
  How durable data, migrations, searchable fields, and compatibility should be
  handled.
- `auth-and-authorization-guide.md`
  How authentication and authorization should be separated and where future
  role/capability enforcement belongs.
- `testing-and-verification-guide.md`
  How PRD test cases, executable tests, persistence runs, and anti-drift review
  fit together.
- `test-harness-and-fixture-internals-guide.md`
  How the reusable test harness seams, fixture factories, and persistence test
  infrastructure are structured.
- `script-and-helper-behavior-guide.md`
  How runtime scripts, test-support scripts, and local helper utilities behave
  at a finer-grained level.

## Relationship To ADRs

- ADRs record enduring architecture decisions and trade-offs.
- Guides explain how those decisions are applied consistently in day-to-day
  implementation.
- If a guide reveals a missing enduring architectural decision, create a new
  ADR rather than growing the guide into a decision log.
