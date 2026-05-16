# Feature Family Decision: Organization Domain Foundation

## Status

- Decision status:
  `approved-for-task-breakdown`
- Date:
  2026-05-12
- Story:
  `S-003`
- Source PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Source Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md`
- Source capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`

## Decision

Organization Domain Foundation is represented as a feature family by this
architecture-map record during planning and task breakdown.

Implementation must still create normal feature folders under
`src/features/<featureName>/`. Each implemented feature must maintain its own
schema-version-1 `feature.manifest.json` using the currently supported fields:

- `schemaVersion`
- `featureName`
- `publicSeams`
- `dependsOn`
- `breakingChangeRisks`

Do not add ad hoc family fields to `feature.manifest.json`. If repo automation
later needs family metadata inside manifests or generated dependency artifacts,
that requires a separate schema/tooling task before any feature manifest uses
the new field.

## Why This Shape

The Organization domain is too broad to become one large feature. It includes
core organization records, legal profiles, locations, units, catalogues,
branding, search, exports, and future public summaries.

The current feature manifest checker validates each feature as an independent
feature seam. It does not expose a supported family field in generated
dependency artifacts. This decision keeps planning readable without weakening
the existing manifest contract.

## Family Key

- Family key:
  `organization-domain-foundation`
- Family label:
  Organization Domain Foundation
- Family role:
  Customer/account organization structure, official organization facts,
  organization branding references, organization search, and private
  organization-domain exports.

## Initial Feature Members

| Planned Feature | Responsibility | First Owning Story | Implementation Posture |
| --- | --- | --- | --- |
| `organizationCore` | Official organization identity, parent/child hierarchy, depth and cycle rules, archive/restore/move behavior. | `S-004` | implemented-foundation |
| `organizationLegalDetails` | One active legal profile per organization and legal-detail lifecycle rules. | `S-005` | implemented-foundation |
| `organizationLocations` | Organization location records, location type selection, head-office booleans, and location lifecycle. | `S-006` | implemented-foundation |
| `organizationOpeningHours` | Optional weekly opening-hour and exception records attached to real locations. | `S-007` | implemented-foundation |
| `organizationBusinessUnits` | Organization unit hierarchy with max depth and move/archive behavior. | `S-008` | implemented-foundation |
| `organizationBusinessUnitMemberships` | Real business-unit membership relationships for business units, with individual/person targets deferred. | `S-009` | implemented-foundation-partial-targets |
| `organizationIntegrations` | High-level official integration presence records without secrets or deep settings. | `S-017` | deferred; no source folder yet |
| `organizationReferenceCatalogues` | System-owned reference values editable by root admins and usable by tenant admins. | `S-010` | implemented-foundation |
| `organizationBrandingReferences` | Organization logo relationships, placeholder behavior, alt text, and consuming-feature authorization around asset links. | `S-012` | blocked; no source folder yet |
| `organizationSearch` | Separated-by-type search and filter read model across approved Organization-domain record types. | `S-013` | planned; no source folder yet |
| `organizationExports` | Private background ZIP export requests, status, download, cleanup, and failure evidence. | `S-015` | blocked; no source folder yet |
| `organizationPublicSummaries` | Future narrow public-facing organization summaries after core behavior exists. | `S-014` | deferred; no source folder yet |

## Manifest Rule For Later Implementation

When a member feature is implemented:

- create `src/features/<plannedFeature>/feature.manifest.json`
- keep `featureName` equal to the folder name
- declare only actual public seams exported through that feature's `index.ts`
- declare only actual cross-feature dependencies through `dependsOn`
- describe breaking-change risks for that feature's own public seams
- regenerate `docs/architecture/generated/feature-dependency-graph.*` when the
  feature manifest or cross-feature imports change

The family relationship is recorded here and in downstream task breakdown until
the repo has an approved manifest schema/tooling change for family metadata.

## Expected Cross-Feature Relationships

These are planning signals, not implemented dependencies:

| Consuming Feature | Expected Owning Feature / Seam | Reason |
| --- | --- | --- |
| `organizationBrandingReferences` | `assets` | Public logo upload, verification, delivery, replacement, deletion, and cleanup must use asset-owned invariants. |
| `organizationExports` | `assets` or approved private file delivery seam | Export bundles are private files and must not expose permanent raw storage URLs. |
| Organization member features | tenant context and auth/session seams | Tenant-admin behavior must run in exactly one current customer/account context. |
| Organization member features | platform authorization seam | Root and tenant admin permissions must remain separate and deny cross-customer/account access by default. |
| `businessUnitMemberships` | user and role identity public seams | Memberships must reference real user and role records without importing persistence internals. |
| `organizationExports` | job processing seam | Exports are built by background work, with retry and failure recording. |

## Boundaries

This decision does not:

- create source folders
- create migrations
- create API routes
- create executable tests
- add feature-manifest fields
- change the generated dependency graph format
- approve exact table names, route paths, permission keys, or UI screens

Those choices belong to task breakdown and later implementation tasks.

## Task-Breakdown Requirements

Task breakdown must create explicit tasks for:

- each implemented feature folder and its own manifest
- any cross-feature public seam needed before a consuming feature can import it
- generated dependency graph regeneration after manifest/source changes
- API contract, data dictionary, permission mapping, runbook, and feature-doc
  updates required by each implemented slice
- a separate manifest schema/tooling task if family metadata is promoted into
  `feature.manifest.json`

## Evidence Of Success

S-003 is satisfied when:

- this feature-family decision is linked from the Organization story breakdown
- downstream tasks can identify the intended family member for every
  Organization implementation story
- no unsupported `feature.manifest.json` fields are required before task
  breakdown
- later implementation can use the existing feature manifest/dependency graph
  contract without inventing a second tracking style
