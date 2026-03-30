# Persistence And Migrations Guide

## Purpose

Define how durable data, searchable storage, and migrations should be designed
so the system remains scalable, recoverable, and backward-compatible.

## Durable Data Rules

- Facts that may matter later for behavior, permissions, billing, reporting,
  auditability, compliance, or historical correctness must be stored durably.
- Do not replace durable facts with live lookups against mutable related data
  unless a migration or compatibility strategy is explicitly approved.

## Persistence Expectations Per Capability

Every persistence-impacting capability should define:

- owned entity or record
- system-managed fields
- lifecycle fields
- normalization rules
- uniqueness rules
- searchable fields
- pagination and sorting behavior
- compatible migration strategy

## Searchable Field Rules

Before introducing a searchable field, specify:

- storage model
- supported operators
- index strategy
- expected scale and query pattern

## Migration Rules

- Treat applied migration identities as stable.
- Fix incorrect shared migrations with new migrations rather than rewriting
  history.
- Verify migration execution semantics against the target database.
- Re-check representative reads and writes after migration changes.

## Recoverability Rule

To rebuild persistence safely from docs, the repo should describe:

- durable facts per feature
- ownership boundaries
- lifecycle rules
- schema/index expectations
- normalization and uniqueness rules
- migration compatibility notes
