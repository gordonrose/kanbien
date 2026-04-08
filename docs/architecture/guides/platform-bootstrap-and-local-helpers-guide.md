# Platform Bootstrap And Local Helpers Guide

## Purpose

Document the code-specific steps and helper tooling required to get the app
running locally or to rebuild a runnable repo from source-independent docs.

This guide complements architecture and feature docs by answering:

1. what must exist before the app can run
2. which bootstrap order matters
3. which local helper scripts are required versus optional

## Scope

This guide is about runnable bootstrap, not feature behavior.

It covers:

- runtime prerequisites
- env and local configuration expectations
- database and migration bootstrap
- local helper scripts and diagnostics
- test bootstrap that is required to exercise the repo safely

It does not replace:

- feature PRDs
- API contracts
- data dictionary docs
- standards gates

## Bootstrap Principles

### 1. Keep bootstrap deterministic

- startup order should be clear
- required dependencies should fail fast
- helper scripts should be discoverable from docs

### 2. Keep secrets out of docs

- list env var names, not live values
- document local-only file expectations without committing secrets
- point to `.env.example` and local ignored env files

### 3. Distinguish required from optional helpers

- required helpers are needed to run, test, or authenticate locally
- optional helpers improve developer workflow but are not bootstrap blockers

## Local Runtime Prerequisites

Current repo assumptions:

- Node.js runtime compatible with the current TypeScript/Express backend
- npm-based script execution
- PostgreSQL available for the main app database
- PostgreSQL available for the dedicated persistence-test database when running
  the persistence-backed suite

Also required when exercising specific flows:

- an SSH private key that corresponds to the configured root bootstrap public
  key for root-auth login
- a live outbound email provider key for notification-delivery proof sends

## Environment Bootstrap

Primary runtime env file today:

- `.env`

Test-specific local env file in current use:

- `.env.test.local`

Committed placeholders:

- `.env.example`
- `.env.test.example`

Current env categories include:

- app runtime and port
- database connection settings
- root-auth bootstrap values
- root-admin browser/session settings
- platform-security configuration
- notification-delivery provider config

Bootstrap expectation:

1. copy placeholder env files or create local ignored env files
2. supply database settings
3. supply root-auth bootstrap values
4. supply provider keys only in local ignored env files

## Required Startup Order

1. provision or start PostgreSQL
2. populate local env values
3. run migrations
4. start the app server
5. if needed, start local helper tooling such as the SSH signer helper
6. authenticate through root-auth before exercising protected routes

## Database Bootstrap

Current bootstrap scripts:

- `src/scripts/migrate.ts`
  shared migration discovery and execution
- `src/scripts/ensureTestDatabase.ts`
  creates the dedicated test database when needed
- `src/scripts/resetPostgresTestDatabase.ts`
  reset-oriented test helper for persistence workflows

Current persistent-test support docs:

- `docs/testing/persistence-tests.md`

Bootstrap expectation:

- the main database must be reachable before the app starts
- the persistence test database must exist before the dedicated Postgres suite
  runs
- feature migrations are owned under `src/features/*/persistence/migrations/`

## Required Local Helpers

### Root auth SSH signing helper

Used for:

- local root-auth login flows
- Postman-assisted protected API testing
- browser-shell bootstrap when SSH challenge signing is required

Current helper files:

- `docs/postman/rootAuthSigner.mjs`
- `docs/postman/rootAuthSigner.py`
- `docs/postman/start-postman-root-auth-signer.cmd`
- `docs/postman/start-postman-root-auth-signer.ps1`
- `docs/postman/install-postman-root-auth-signer-shortcut.ps1`

Why it matters:

- root-auth currently requires password plus SSH proof
- local API or Postman flows need a safe way to sign the issued challenge text

### Notification delivery provider config

Used for:

- real proof-of-working outbound email sends

Current runtime assumptions:

- env supplies provider credentials and sender identity
- the current first live provider is `Resend`
- feature code stays provider-agnostic above the adapter seam

## Optional Local Helpers

### Postman collections

Current maintained collections:

- `docs/postman/rootUsers.postman_collection.json`
- `docs/postman/tenants.postman_collection.json`
- `docs/postman/notificationDelivery.postman_collection.json`

These are optional for runtime bootstrap, but useful for:

- protected route exploration
- repeatable manual verification
- onboarding and diagnostics

### Dummy-data utility

- `docs/postman/createDummyRootUsers.mjs`

This is optional and intended for local convenience, not bootstrap-critical
runtime behavior.

## Test Bootstrap

Current verification model:

- `npm test` runs the fast suite and, when the dedicated Postgres test
  database is configured, a second persistence phase
- `npm run test:persistence` runs the serialized Postgres-backed suite only

Test bootstrap helpers and seams:

- `tests/harness/postgres/*`
- `tests/harness/rootAuth/*`
- `tests/harness/testData/*`
- `tests/helpers/*`

Use the architecture and testing guides plus the test tree README to
understand the test model:

- `docs/architecture/guides/testing-and-verification-guide.md`
- `tests/README.md`

## Rebuild-From-Docs Expectation

To make the repo runnable from docs, maintain this guide whenever a change:

- introduces a new required startup dependency
- adds a new helper script or local daemon requirement
- changes env bootstrap expectations
- changes migration or startup order
- adds a new provider or hosted service that is required for key local flows

Also refresh:

- `docs/architecture/build-from-spec-reconstruction-questionnaire.md`

when the change adds a new interchangeable tool or deployer-local choice.
