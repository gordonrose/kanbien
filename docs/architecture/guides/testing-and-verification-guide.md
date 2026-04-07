# Testing And Verification Guide

## Purpose

Explain how the repo turns PRD intent into executable proof without silent
coverage drift.

## Source Of Truth

The current testing model uses:

- PRDs for scope and requirements
- PRD-derived test-case docs for explicit planned coverage
- executable tests for proof
- traceability checks to ensure documented `TC-*` IDs stay mapped
- lifecycle review to prevent silent test-intent drift

## Test Layers

Features should use the layers appropriate to their risk and shape:

- unit
- integration
- security
- audit
- edge
- frontend
- persistence-backed verification when durable storage behavior matters

## Persistence Modes

The current persistence-backed test model is:

- normal mode: reset-first for deterministic isolation
- preserve/debug mode: optional delayed cleanup and forensic inspection

When the dedicated Postgres test database is configured locally, `npm test`
now runs in two deliberate phases:

- the fast in-memory/app-level Vitest suite
- a second serialized Vitest run for persistence-backed proofs

Seeing two Vitest runs in that situation is expected and should not be treated
as accidental duplicate execution.

Manifest cleanup applies only to preserved durable workflows that actually
register run-scoped data.

## Anti-Drift Expectations

- PRD-derived test-case docs are the primary planned coverage record.
- Executable tests should carry stable `TC-*` references.
- Only active/current test intent should run in the normal loop.
- Superseded or archived test intent must be proposed and reviewed explicitly.
- Persistence-backed tests should seed their required fixtures explicitly
  rather than assuming prior bootstrap state is sufficient.
- When a feature adds persistence-owned tables or migration dependencies,
  refresh the shared migration harness, reset helpers, and persistence run
  scripts in the same loop.
- Tests for paginated catalogs or lists should avoid accidental assumptions
  about first-page contents unless that ordering is part of the documented
  contract.

## Recoverability Rule

To rebuild tests from specs, the repo should describe:

- required test layers by capability type
- harness expectations
- persistence-test rules
- traceability rules
- lifecycle status rules
- standards and repo-health review expectations for material changes
