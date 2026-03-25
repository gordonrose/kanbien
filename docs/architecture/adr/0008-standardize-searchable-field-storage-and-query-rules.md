# ADR-0008: Standardize Searchable Field Storage And Query Rules

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

Searchable fields are easy to add in ways that work initially but scale poorly
or become difficult to query correctly. Without explicit storage rules, future
features may introduce comma-separated values, under-indexed search columns, or
opaque JSON structures for data that should remain queryable and reliable.

## Decision

Use explicit storage and indexing rules for searchable attributes.

Current defaults:

- searchable single-value attributes should use scalar columns
- searchable scalar columns must declare supported operators and index strategy
- searchable multi-value attributes must not use comma-separated strings
- searchable multi-value attributes that need reliable filtering at scale should
  use junction tables
- array or JSONB storage for searchable multi-value attributes requires explicit
  approval based on query shape, scale, and operational trade-offs
- new searchable fields must declare storage model, approved operators, and
  index strategy before implementation

## Consequences

### Positive

- searchable data remains easier to query, index, and evolve
- performance and correctness risks are surfaced earlier
- contributors have clearer rules before adding new searchable fields

### Negative

- some implementations will take longer because storage choices must be stated
  more explicitly
- authors may need to justify exceptions for smaller or less performance-
  sensitive cases

### Neutral / Follow-up

- these rules are defaults, not proof that every searchable field needs the
  same storage pattern
- if the platform adopts stronger shared query abstractions later, this ADR can
  be refined or superseded
