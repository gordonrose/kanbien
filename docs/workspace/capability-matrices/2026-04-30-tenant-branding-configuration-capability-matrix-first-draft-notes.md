# Tenant Branding Configuration Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv](2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv)

## Current Posture

This is a first-draft planning artifact for tenant branding configuration.

At the time of writing:

- Product Discovery, Technical Steering, and Story Breakdown exist.
- The tenant branding logo asset consumer decision is approved for v1 planning.
- The PRD exists as:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`.
- API contracts, data dictionary entries, permission mappings, implementation
  blueprint, PRD-derived test cases, feature manifests, and generated graph
  updates are still pending.

The matrix should be treated as:

- a first draft for implementation planning
- a first draft for future authz capability mapping
- a first draft for API/data/test-case planning
- not yet approval to implement without the normal change loop

## Current Direction Decisions

- Tenant branding should be a new narrow `tenantBranding` feature bundle.
- Branding display name is a durable branding fact and must not overwrite the
  canonical tenant name.
- Primary colour is a validated hex value consumed through design-system
  colour behavior.
- Logo upload and replacement use the approved tenant-logo asset decision.
- Logo clearing is out of scope for v1; replacement-only is the first behavior.
- Logo accessibility metadata is contextual and requires explicit alt text or
  decorative posture per logo relationship.
- Tenant dashboard consumption is dashboard-shell only in v1.
- Branding changes apply after next login or dashboard reload, not live update.
- Missing display name falls back to canonical tenant name.
- Missing or invalid primary colour falls back to the platform default.
- Missing, not-ready, metadata-incomplete, or cross-tenant-denied logo states
  return no logo.
- Pending and failed-cleanup logo records continue to count against quota,
  actor limits, cost limits, and abuse limits until cleanup succeeds or a
  later approved retention policy says otherwise.

## Recommended Capability Boundary

The first `tenantBranding` loop should own:

- root-admin tenant branding read
- root-admin tenant branding save
- tenant logo upload intent request through `assets`
- current logo relationship replacement and readiness validation
- tenant logo content read authorization before `assets` content delivery
- tenant-dashboard branding projection
- tenant branding audit evidence
- governed frontend adoption planning
- maintained artifact conformance

It should not own:

- canonical tenant identity
- generic asset lifecycle or storage policy
- public logo delivery
- tenant-admin self-service
- broad tenant portal theming
- live dashboard push
- generic asset-library UI

## Authorization Notes

Planning capability keys:

- `root-admin.tenant-branding.read`
- `root-admin.tenant-branding.manage`
- `root-admin.tenant-branding.logo.update`
- `tenant-branding.dashboard.read`
- `tenant-branding.logo.read`
- `tenant-branding.audit.record`

The final permission mapping must reconcile these planning names with the
active root and tenant authz model before implementation.

Tenant branding must authorize entity access before calling asset seams. The
`assets` feature then enforces asset invariants such as tenant match,
lifecycle readiness, kind compatibility, content delivery posture, SVG
readiness, and visibility.

## Future Work Notes

The following artifacts remain required before implementation-ready Task
Breakdown:

- API contract docs and maintained OpenAPI/Postman artifacts
- data dictionary entries
- permission mapping
- asset alignment note and runbook/privacy notes
- implementation blueprint
- PRD-derived test cases
- feature manifests and generated dependency graph updates if public seams
  change

