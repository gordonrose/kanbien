# Persistence-Backed Tests

Persistence-backed tests use the real Postgres repositories and real schema.

## Why They Exist

- They verify storage contracts that in-memory harnesses cannot prove.
- They are the right place for cases like password hashing and secret handling.
- They are also the right place for shared platform-security guarantees that
  depend on durable counters or lockdown rows surviving new repository or
  middleware instances.

## Environment

Create `.env.test` or `.env.test.local` from
[`/.env.test.example`](/home/gordon/kanbien/.env.test.example).

Required variables:

- `TEST_DATABASE_HOST`
- `TEST_DATABASE_NAME`
- `TEST_DATABASE_USER`
- `TEST_DATABASE_PASSWORD`

Recommended practice:

- keep real local test credentials in `.env.test.local` instead of committing
  them
- treat `.env.test.example` as a template with placeholders, not as a file of
  reusable shared secrets

Optional variables:

- `TEST_DATABASE_PORT`
- `TEST_DATABASE_SSL`
- `TEST_DATABASE_ADMIN_HOST`
- `TEST_DATABASE_ADMIN_PORT`
- `TEST_DATABASE_ADMIN_DB`
- `TEST_DATABASE_ADMIN_USER`
- `TEST_DATABASE_ADMIN_PASSWORD`
- `TEST_DATABASE_ADMIN_SSL`
- `TEST_ROOT_AUTH_BOOTSTRAP_PASSWORD`
- `TEST_ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY`

## Commands

Prepare the test database:

```bash
npm run test:persistence:prepare
```

Run the persistence-backed tests:

```bash
npm run test:persistence
```

Run the persistence-backed tests in preserve/debug mode:

```bash
npm run test:persistence:preserve
```

Reset the dedicated Postgres test database manually:

```bash
npm run test:persistence:reset
```

## Notes

- The prepare script attempts to create the test database if it does not
  already exist.
- That creation step requires a Postgres role with permission to create
  databases. If the configured role does not have that permission, create the
  database manually once or provide admin credentials through the
  `TEST_DATABASE_ADMIN_*` variables.
- `npm run test:persistence` is the normal reset-first mode. It resets relevant
  tables before each test for deterministic isolation.
- `npm run test:persistence:preserve` disables those routine per-test resets so
  rows remain available for forensic inspection during a targeted debug run.
- Preserve/debug mode does not automatically imply manifest cleanup for every
  persistence-backed test. Manifest cleanup still applies only to preserved
  durable test workflows that register a `testRunId` through the shared
  durable-test helpers.
- `npm run test:persistence:reset` is the operator recovery command for
  explicitly wiping the dedicated Postgres test database after a preserved run
  or an interrupted suite.
- Persistence-backed tests only activate through `npm run test:persistence`.
- The persistence suite runs with file parallelism disabled because the tests
  share one dedicated database and perform schema resets and migration work.
- Both `npm run test:persistence` and `npm run test:persistence:preserve`
  encode that serialized execution behavior directly.
- The current persistence suite includes both `rootAuth` storage proofs and
  platform-security durability proofs.
- It also includes persistence-backed audit checks where we need to verify that
  durable audit rows do not store sensitive raw secrets.
- During the normal `npm test` suite, they remain skipped by design.
- Tests are skipped when the required `TEST_DATABASE_*` variables are missing.
- These tests are intentionally separate from the main in-memory test flow.
