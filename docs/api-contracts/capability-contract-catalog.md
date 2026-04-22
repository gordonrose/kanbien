# Capability Contract Catalog API Contract

## Scope

- Contract name: `capability-contract-catalog`
- Feature: `capabilityContractCatalog`
- Route family or capability group:
  Protected root-only capability catalog browsing, export, materialization, and
  drift-audit routes
- In-scope routes:
  - `GET /v1/capability-contract-catalog/capabilities`
  - `GET /v1/capability-contract-catalog/capabilities/{capabilityId}`
  - `POST /v1/capability-contract-catalog/export`
  - `POST /v1/capability-contract-catalog/materialize`
  - `GET /v1/capability-contract-catalog/drift`

## Capability

- Feature: `capabilityContractCatalog`
- Capability:
  Browse and inspect persisted normalized backend capability records, export
  deterministic catalog snapshots, materialize persisted records from approved
  source truth, and audit drift between persisted truth and current sources

## Authentication

- Required auth state:
  Authenticated root-user session is required for every route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` in the current implementation slice
- Denied roles:
  unauthenticated callers and any future narrower root role that lacks the
  governing catalog capability for the route
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus central
  `createRequireRootCapability(...)` checks using:
  - `capability-contract-catalog.read`
  - `capability-contract-catalog.export`
  - `capability-contract-catalog.materialize`
  - `capability-contract-catalog.audit-drift`

## Request Contract

- `GET /v1/capability-contract-catalog/capabilities`
  - query:
    repo-standard `page`, `pageSize`, `orderDirection`
  - supported filters:
    `featureName`, `routeFamily`, `seamType`, `capabilityBoundary`,
    `governingAuthzCapability`, `allowedRole`, `capabilityId`, `displayLabel`,
    `featureNamePrefix`, `supportsRequestBody`, `supportsResponseFields`,
    `supportsFilters`, `freshnessStatus`
- `GET /v1/capability-contract-catalog/capabilities/{capabilityId}`
  - path:
    exact capability id such as `notificationDelivery.resendEmail`
- `POST /v1/capability-contract-catalog/export`
  - body:
    `{ includeFeatures?, formatVersion, allowStale? }`
- `POST /v1/capability-contract-catalog/materialize`
  - body:
    `{ includeFeatures? }`
- `GET /v1/capability-contract-catalog/drift`
  - query:
    optional repeated `includeFeatures`

## Response Contract

- list returns:
  - paginated picker summary rows
  - feature, route-family, and seam grouping metadata
  - governing authz capability keys
  - allowed roles
  - freshness posture
- exact read returns:
  - one persisted capability record
  - request fields partitioned into params, query, and body
  - response fields
  - field-level validation metadata
  - capability-level constraints
  - source references
  - freshness posture
- export returns:
  - deterministic ordered snapshot from persisted catalog records
  - explicit format version
  - exact-record payloads
- materialize returns:
  - inserted and updated record counts
  - generated-artifact path
  - materialization timestamp
- drift returns:
  - one status row per capability id
  - drift reasons
  - source coverage flags
  - rematerialization requirement posture

## Error Contract

- feature-local:
  - `INVALID_REQUEST`
  - `CAPABILITY_CATALOG_NOT_FOUND`
  - `CAPABILITY_CATALOG_EXPORT_BLOCKED`
  - `CAPABILITY_CATALOG_MATERIALIZATION_BLOCKED`
- shared middleware:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `FORBIDDEN`
  - `RATE_LIMITED`

## Persistence / Side Effects

- materialization writes:
  - `capability_catalog_records`
  - `capability_catalog_fields`
  - `capability_catalog_constraints`
  - `capability_catalog_source_references`
- materialization also writes a reviewable generated artifact under
  `docs/workspace/exports/`
- browse, exact-read, export, and drift reads do not mutate persisted catalog
  rows in the current implementation

## Compatibility / Lifecycle Notes

- this route family is intentionally root-only in v1
- the initial implementation currently materializes a bounded source registry
  and is intended to expand feature-by-feature rather than pretending every
  HTTP feature is already auto-extracted safely
- governing authz capability keys are canonical; allowed roles are derived
  persisted views
