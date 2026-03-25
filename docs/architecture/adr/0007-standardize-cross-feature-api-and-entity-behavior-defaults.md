# ADR-0007: Standardize Cross-Feature API And Entity Behavior Defaults

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform is adopting a reusable feature architecture, but that structure
alone does not guarantee consistent behavior across features. Without shared
defaults, different features may drift on normalization, system-managed fields,
soft-delete semantics, pagination, sorting, and error behavior.

## Decision

Adopt cross-feature defaults for API and entity behavior unless a later ADR
defines an approved exception.

Current defaults:

- normalized fields must be stored in their canonical form where the domain
  requires normalization
- empty strings are rejected rather than silently converted to null
- timestamps are ISO-8601 at the API boundary and UTC in storage
- clients must not supply system-managed fields such as identifiers and
  audit/lifecycle timestamps
- normal reads exclude soft-deleted rows unless an explicit capability is
  defined for deleted records
- successful updates refresh `updatedAt`
- soft delete sets `deletedAt` and refreshes `updatedAt`
- list endpoints follow shared pagination defaults unless a later decision
  defines an approved exception
- sorting defaults should remain consistent across features where practical
- error responses should preserve the platform JSON error contract

## Consequences

### Positive

- cross-feature behavior becomes more predictable
- clients can rely on a more consistent API model
- Codex and other contributors can add features with less local reinvention

### Negative

- some features may need explicit exceptions where domain behavior genuinely
  differs
- tighter defaults reduce local flexibility

### Neutral / Follow-up

- entity-specific rules can still be documented in feature docs when they do
  not need to become platform-wide conventions
- if multiple valid patterns emerge, a later ADR can refine or split these
  defaults
