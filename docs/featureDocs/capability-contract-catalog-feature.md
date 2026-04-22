# Capability Contract Catalog Feature Reference

## Purpose

The `capabilityContractCatalog` feature provides a governed backend registry of
existing backend capabilities so future frontend tooling can bind UI elements to
approved backend request, response, validation, access, and description truth.

V1 owns:

- picker-oriented capability summaries
- exact capability records with request and response field metadata
- field-level validation and capability-level constraint export when derivable
- governing authz capability keys and derived allowed-role visibility
- deterministic export of catalog snapshots
- materialization of persisted catalog rows from approved source truth
- drift auditing between persisted rows and current bounded source truth

## Where It Lives

- `src/features/capabilityContractCatalog/contract`
- `src/features/capabilityContractCatalog/domain`
- `src/features/capabilityContractCatalog/generation`
- `src/features/capabilityContractCatalog/persistence`
- `src/features/capabilityContractCatalog/transport`
- `src/features/capabilityContractCatalog/index.ts`

## Platform Integration

Feature mount point:

- `src/routes/v1/index.ts`
- base route: `/v1/capability-contract-catalog`

Authentication and authorization:

- all routes require a valid root-user session
- shared authenticated-general rate limiting still applies
- governing root authz capabilities are:
  - `capability-contract-catalog.read`
  - `capability-contract-catalog.export`
  - `capability-contract-catalog.materialize`
  - `capability-contract-catalog.audit-drift`
- runtime-context requirements surfaced in records are descriptive only; they do
  not grant access and the backend remains authoritative

## Runtime Contracts

The current foundation slice exposes five backend capabilities:

- `GET /v1/capability-contract-catalog/capabilities`
- `GET /v1/capability-contract-catalog/capabilities/:capabilityId`
- `POST /v1/capability-contract-catalog/export`
- `POST /v1/capability-contract-catalog/materialize`
- `GET /v1/capability-contract-catalog/drift`

Current route coverage is intentionally bounded to the in-feature source
registry rather than full repo-wide discovery.
The initial materialized source set currently covers `notificationDelivery`.

## Persistence And Materialization

The feature persists normalized catalog records plus related fields,
constraints, and source references through feature-local migrations.

Current persistence posture:

- generated artifact plus persisted database rows
- materialization refreshes persisted truth from approved bounded sources
- drift audit compares persisted rows to current bounded source truth
- contradictory source truth is reported as `blocked` instead of being silently
  normalized

The current migration file is:

- `src/features/capabilityContractCatalog/persistence/migrations/0035_create_capability_contract_catalog.sql`

## Generated Artifact

Materialization also writes a generated artifact for reviewable normalized truth.
The artifact path is controlled through the feature generation seam and may be
redirected in tests through `CAPABILITY_CATALOG_ARTIFACT_PATH`.

## Current V1 Source Authority Posture

The bounded source registry is currently assembled from:

- feature contract schemas/types
- maintained API contract docs
- maintained permission mappings
- feature manifests

If source truth is contradictory in a way the normalizer cannot represent
honestly, materialization blocks and drift reports `blocked` posture.

## Verification Status

Implemented focused verification currently includes:

- unit tests
- integration flow tests
- security tests
- audit tests
- scoped traceability completeness for `CAP-CATALOG`

Current evidence summary:

- focused suite passed
- `CAP-CATALOG: 24/24 traceable`
- Postgres-backed persistence suite passed against dedicated local Postgres test database

## Known Limits

- V1 is still a foundation slice, not a repo-wide capability crawler
- source coverage is currently bounded to `notificationDelivery`
- no frontend picker or builder consumer is implemented yet
- contextual omission filters such as tenant and entity-relationship rules are
  represented only as surfaced requirements, not as frontend-enforced policy
