# capabilityContractCatalog

Owns a durable normalized registry of approved backend capability truth for
later picker, builder, export, and drift-audit workflows.

## Current capabilities

- list persisted capability-picker summaries
- read one exact persisted capability record
- export deterministic catalog snapshots
- materialize persisted catalog records from a bounded source registry
- audit drift between persisted catalog truth and current source truth

## Current v1 posture

- runtime reads use persisted database-backed truth
- the same materialization flow also writes a reviewable generated artifact in
  repo
- governing authz capability keys are canonical; allowed roles are derived
- v1 currently normalizes a bounded initial source set and is intended to grow
  feature-by-feature rather than pretending every HTTP feature is already
  auto-extracted safely
