# ADR-0004: Use Feature-Scoped SQL Migrations With Shared Runner

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

Features may own persistence changes, but the platform still needs one reliable
way to discover and apply schema migrations. A central manifest would add
maintenance overhead, while purely ad hoc migration execution would not scale.

## Decision

Store feature-owned SQL migrations under each feature's migration folder and use
one shared migration runner to discover and apply them.

Current rules:

- migration files live under `src/features/**/migrations/*.sql`
- the runner discovers files recursively
- execution order is based on sorted relative file path
- migration identity is the relative file path recorded in `schema_migrations`

## Consequences

### Positive

- features can evolve their schema near the code that uses it
- migration discovery stays automatic without a separate manifest
- operational behavior remains centralized

### Negative

- path-based identity means renaming a migration file changes how the runner
  sees it
- ordering is filename-sensitive and requires naming discipline

### Neutral / Follow-up

- migration file names are part of migration identity and should be treated as
  stable once applied in shared environments
- migration files should use sortable, zero-padded numeric prefixes so
  lexicographic order matches intended execution order
- preferred format: `0001_short_description.sql`
- if an applied migration is wrong, add a new migration instead of renaming or
  rewriting the old one
- if path-based identity becomes too fragile, a future ADR can move to explicit
  migration IDs
