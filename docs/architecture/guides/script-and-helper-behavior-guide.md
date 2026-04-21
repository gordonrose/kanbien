# Script And Helper Behavior Guide

## Purpose

Document the finer-grained behavior of repo scripts and helper utilities so the
repo can be rebuilt and operated from `/docs` without relying only on current
implementation files.

This guide is the source-independent inventory for:

- runtime scripts under `src/scripts/`
- developer and verification helpers under `docs/postman/`
- notable bootstrap or diagnostics helpers that affect repo behavior

## Scope

This guide covers:

- what each script or helper is for
- required inputs and env assumptions
- whether the script is required, optional, runtime-facing, or test-facing
- notable side effects and safety expectations

It does not replace the scripts themselves.

## Classification

### Runtime-facing scripts

Current runtime-facing scripts:

- `src/scripts/migrate.ts`
- `src/scripts/copyFrontendAssets.ts`

### Test and verification scripts

Current test-facing scripts:

- `src/scripts/runTestSuite.ts`
- `src/scripts/checkTestCaseCoverage.ts`
- `src/scripts/reportTestCaseLifecycle.ts`
- `src/scripts/ensureTestDatabase.ts`
- `src/scripts/resetPostgresTestDatabase.ts`
- `src/scripts/cleanupTestData.ts`

### Developer governance scripts

Current developer-governance scripts:

- `src/scripts/checkFrontendArchitectureDocs.ts`

### Local helper utilities

Current helper utilities:

- `docs/postman/helpers/rootAuthSigner.mjs`
- `docs/postman/helpers/rootAuthSigner.py`
- launcher helpers under `docs/postman/helpers/`
- maintained Postman collections under `docs/postman/collections/`

## Script Behavior Inventory

### `src/scripts/migrate.ts`

Purpose:

- discover feature-scoped SQL migrations
- create `schema_migrations` if needed
- apply new or changed migrations in deterministic order

Inputs and assumptions:

- runtime database config from `src/config/env.ts`
- root-auth bootstrap env is required if migrations seed or repair root auth
- migration identity is path-based via the file's repo-relative path

Notable behavior:

- recursively scans `src/features/**/migrations/*.sql`
- renders bootstrap placeholders before execution
- skips unchanged migrations by stored checksum
- reapplies a path-identical migration when the checksum changes

Safety expectation:

- do not rename applied migration files casually
- use corrective migrations rather than rewriting shared-environment history

### `src/scripts/runTestSuite.ts`

Purpose:

- run the repo's default two-phase test suite

Inputs and assumptions:

- loads `.env`, `.env.test`, and `.env.test.local`
- uses `TEST_DATABASE_*` presence to decide whether to run the persistence
  phase

Notable behavior:

- first phase excludes persistence tests
- second phase runs a serialized list of Postgres-backed persistence proofs
- skips the persistence phase entirely when the dedicated test DB is not fully
  configured

Rebuild expectation:

- preserve the two deliberate test phases
- preserve the explicit persistence file list
- preserve the env-driven decision rather than assuming every machine has the
  test DB configured

### `src/scripts/ensureTestDatabase.ts`

Purpose:

- create the dedicated Postgres test database if it does not already exist

Inputs and assumptions:

- `TEST_DATABASE_*`
- optional `TEST_DATABASE_ADMIN_*`
- `.env`, `.env.test`, and `.env.test.local`

Notable behavior:

- connects to the admin DB, defaulting to `postgres`
- checks for DB existence before attempting creation
- creates the DB only when missing

### `src/scripts/resetPostgresTestDatabase.ts`

Purpose:

- clear the dedicated Postgres test database tables for deterministic reruns

Inputs and assumptions:

- same env-loading pattern as other test DB scripts
- forces `NODE_ENV=test`

Notable behavior:

- uses the shared Postgres test harness reset logic rather than duplicating SQL
- intended as a local diagnostic or cleanup helper

### `src/scripts/checkTestCaseCoverage.ts`

Purpose:

- enforce traceability between documented `TC-*` IDs and executable code or
  tests

Inputs and assumptions:

- scans `docs/prd/test_cases/`
- scans `tests/` and `src/`
- respects deferred traceability enforcement flags in lifecycle docs

Notable behavior:

- fails when documented active `TC-*` IDs are not traceable in code/tests
- is intentionally source-independent first and implementation-aware second

### `src/scripts/checkFrontendArchitectureDocs.ts`

Purpose:

- guard architecture-sensitive frontend changes from landing without a current
  frontend architecture doc update and ADR attention

Inputs and assumptions:

- runs inside a git worktree
- inspects changed files from either:
  - `git status --porcelain`
  - `git diff --cached --name-only --diff-filter=ACMR` when `--staged` is used
- expects the maintained frontend architecture map at
  `docs/architecture/frontend-overview.md`

Notable behavior:

- treats frontend routers, frontend discovery seams, frontend app mounting, and
  frontend copy/build wiring as architecture-sensitive trigger files
- fails when those trigger files changed without a staged update to
  `docs/architecture/frontend-overview.md`
- also fails when no ADR file under `docs/architecture/adr/` is staged in the
  same change
- prints a softer reminder to consider `docs/architecture/system-overview.md`
  when it was not updated

Safety expectation:

- keep the trigger-file list conservative and tune it only when real misses or
  false positives appear
- bypass intentionally with `--no-verify` only after explicitly reviewing the
  architecture-doc impact

### `src/scripts/reportTestCaseLifecycle.ts`

Purpose:

- report lifecycle and traceability metadata from PRD-derived test-case docs

Inputs and assumptions:

- scans Markdown files under `docs/prd/test_cases/`
- supports path-substring filters via CLI args

Notable behavior:

- prints traceability enforcement posture and lifecycle metadata
- useful for anti-drift review rather than runtime behavior

### `src/scripts/cleanupTestData.ts`

Purpose:

- perform manifest-driven durable test-data cleanup against the real DB

Inputs and assumptions:

- cleanup plan args parsed through `src/lib/testingData/cleanupRuntime`
- access to runtime DB pool from `src/lib/db`
- manifest files created through the durable test-data helper flow

Notable behavior:

- executes cleanup inside one transaction
- deletes only the IDs registered for the chosen run/entity plan
- removes the manifest after successful cleanup through the shared runtime

## Helper Utility Inventory

### Root auth signing helpers

Files:

- `docs/postman/helpers/rootAuthSigner.mjs`
- `docs/postman/helpers/rootAuthSigner.py`
- launcher helpers under `docs/postman/helpers/`

Canonical helper:

- `docs/postman/helpers/rootAuthSigner.mjs`

Purpose:

- sign the current SSH challenge text for local root-auth flows outside the app
  server

Rebuild expectation:

- preserve a local helper path for signing challenge text without embedding
  private keys into repo docs or app source

### Postman collections

Files:

- `docs/postman/collections/rootUsers.postman_collection.json`
- `docs/postman/collections/tenants.postman_collection.json`
- `docs/postman/collections/notificationDelivery.postman_collection.json`

Purpose:

- provide manually runnable source-independent request collections for major
  protected route families

Rebuild expectation:

- keep maintained collections aligned with route families that matter to
  operator or manual verification workflows

## Rebuild-From-Docs Expectations

A rebuild from `/docs` should preserve:

- the distinction between runtime scripts and test-support scripts
- env-loading expectations for test-support scripts
- migration and persistence-test bootstrap order
- traceability and lifecycle-report tooling as part of repo governance
- frontend architecture drift guarding as part of repo governance
- helper tooling required for root-auth and other nontrivial local workflows

## Maintenance Rule

Update this guide when a change:

- adds, removes, or materially repurposes a script under `src/scripts/`
- changes env-loading behavior or side effects for an existing script
- changes the two-phase test-runner contract
- adds or removes a meaningful local helper under `docs/postman/`
- changes which helpers are required versus optional for local operation
- adds or materially changes a maintained governance script or repo-local hook
