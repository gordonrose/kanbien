# Tenant Feature Retrospective

## Scope

- Feature: `tenants`
- Retrospective date: `2026-04-07`
- Covers:
  the issues, gaps, and process lessons encountered while delivering the first
  root-operated tenant backend slice

## Summary

Most of the problems encountered during tenant delivery were not tenant
business-logic bugs.

They were delivery-loop and artifact-discipline gaps:

- reviewed intent drifting from implementation
- source-independent docs lagging runtime behavior
- shared test infrastructure not evolving with the new feature
- repo conventions not being enforced strongly enough early enough

## Issues And Gaps Encountered

### 1. PRD restart was needed

The first tenant PRD draft was not trusted enough to carry forward, so the
slice was reset to the PRD-creation step and the old draft was removed.

Lesson:

- when confidence in a PRD draft is low, resetting early is safer than letting
  later artifacts build on uncertain intent

### 2. Blueprint lag after PRD reset

Once the PRD was recreated, the implementation blueprint still reflected the
older state and had to be refreshed before implementation could continue
safely.

Lesson:

- restarting one artifact in the loop should trigger a deliberate revalidation
  of downstream artifacts, especially blueprints

### 3. PRD test-case drift reduced auditability

The first tenant implementation mapped only `10/22` documented `TC-*` cases
into executable tests, even though more behavior was covered.

This meant some behavior was implemented, but the reviewed test inventory was
not preserved in executable form.

Lesson:

- test coverage is not enough on its own
- exact reviewed case identity must remain visible in code for auditability

### 4. The PRD test-case sanity check could be silently overridden

Implementation could previously reshape or partially ignore the reviewed PRD
test-case inventory without an explicit gate.

This weakened the value of the PRD test-case sanity check.

Lesson:

- reviewed PRD-derived test cases must be treated as part of change control,
  not as a disposable planning note

### 5. Tenant domain structure drifted from repo convention

The first tenant implementation concentrated too much capability logic in one
`domain/service.ts` file instead of following the repo's capability-per-file
domain pattern.

Lesson:

- the repo needs stronger guardrails against local structural shortcuts, even
  when the behavior works

### 6. Permission-mapping artifacts were missed initially

Runtime capability registration for tenant permissions was implemented, but the
source-independent permission-mapping docs were not updated at first.

Lesson:

- permission-sensitive changes must update both runtime catalogs and
  source-independent permission-mapping artifacts in the same delivery loop

### 7. Source-independent docs lagged the live repo state

After tenant delivery, several docs still described a pre-tenant platform
state, including architecture summaries, architecture-map entries, and some
API-contract OpenAPI traceability notes.

Lesson:

- source-independent docs need a deliberate refresh pass after new feature
  slices land, especially when the repo now depends on them for recoverability
  and standards evidence

### 8. Root-role catalog growth broke a brittle integration test

Adding tenant capability keys increased the root capability catalog size.

A root-roles integration test assumed the expected capability would still be on
the first page of a paginated response, which stopped being true once the
catalog grew.

Lesson:

- tests for paginated catalog surfaces must avoid brittle assumptions about
  catalog size and lexical ordering unless those assumptions are part of the
  contract

### 9. Tenant persistence coverage existed but was not included in the shared script

The tenant Postgres persistence tests existed, but the normal persistence
scripts did not include them initially.

Lesson:

- adding a new persistence-backed feature requires updating the shared
  persistence run commands in the same change

### 10. Persistence tests were too easy to treat as optional

The real-Postgres suite originally ran only through the dedicated persistence
command, which made it easy to forget during normal development.

Lesson:

- when a local test database is configured, `npm test` should include
  persistence verification automatically

### 11. The Postgres test migration harness missed a dependency

The tenant migration seeds capability rows owned by the `rootRoles` slice, but
the Postgres test migration harness did not initially apply the `rootRoles`
migration group before `tenants`.

Lesson:

- shared migration harnesses must be updated whenever a new feature introduces
  migration-time dependencies on another feature's schema

### 12. The Postgres reset helper lagged the schema surface

The shared reset helper was not yet dropping the newer `tenant` and root-role
tables, so persistence rows leaked between tests.

Lesson:

- every new persistence-owned table should trigger a reset-helper review for
  the Postgres-backed test harness

### 13. Tenant persistence tests lacked a seeded actor fixture

The tenant persistence tests assumed an acting root user existed but did not
seed one explicitly, causing a foreign-key failure on
`created_by_root_admin_user_id`.

Lesson:

- persistence tests should seed their required actor/entity fixtures directly
  rather than assuming prior bootstrap state is sufficient

### 14. Local persistence setup required explicit environment wiring

There was no `.env.test.local` yet, so the dedicated test database had to be
configured before the persistence suite could participate in the normal local
loop.

Lesson:

- the developer workflow should make test-database activation explicit and easy
  to discover

## Resulting Repo Improvements

The tenant delivery work led to these concrete process improvements:

- PRD-derived test-case override gate added to standards
- permission-mapping gate added to standards
- stronger guardrail for capability-per-file feature domain structure
- tenant persistence suite included in the shared persistence commands
- `npm test` now includes persistence-backed verification when the dedicated
  Postgres test database is configured
- testing docs now explain that the two-phase `npm test` behavior is expected

## Follow-Forward Reminders

- when a feature adds capability keys, refresh:
  capability catalog, permission mappings, root-role tests, and any paginated
  catalog assumptions
- when a feature adds persistence tables, refresh:
  migrations harness, reset helper, persistence scripts, and persistence test
  fixtures
- when a feature introduces or refreshes source-independent artifacts, run a
  short post-implementation doc drift pass before considering the loop closed
