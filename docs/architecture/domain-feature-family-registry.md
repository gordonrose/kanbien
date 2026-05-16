# Domain Feature Family Registry

This registry records product/domain families that are intentionally delivered
as multiple feature bundles.

It complements `src/features/<featureName>/feature.manifest.json`. It does not
replace feature manifests and does not declare cross-feature import authority.
Feature manifests continue to own public seams, declared dependencies, and
breaking-change risk notes.

Source rule:

- ADR:
  `docs/architecture/adr/0042-use-domain-feature-family-registry-for-related-feature-bundles.md`

## Registry Schema

| Column | Meaning |
| --- | --- |
| Domain family key | Stable key for the family. |
| Display name | Human-readable family name. |
| Status | Current posture: `planned`, `active`, `blocked`, `deferred`, or `superseded`. |
| Member feature bundle | Planned or implemented feature bundle key. |
| Member status | Current posture for that bundle. |
| Responsibility | What this member owns. |
| Source artifacts | Planning, architecture, or implementation source links. |
| Manifest posture | Whether a `feature.manifest.json` exists now, is future-required, or is not applicable. |
| Notes | Boundaries, blockers, or deferrals. |

## Organization Domain Family

| Domain family key | Display name | Status | Member feature bundle | Member status | Responsibility | Source artifacts | Manifest posture | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organization` | Organization domain | `active` | `organizationCore` | `active` | Organization identity, tenant-level normalized name uniqueness, hierarchy, lifecycle, archive/move behavior, and future public summary seam when a consumer exists. | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/data-dictionary/organization.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md`; `src/features/organizationCore/feature.manifest.json` | exists | Backend source feature mounted under root and tenant Organization route families. |
| `organization` | Organization domain | `active` | `organizationLegalDetails` | `active` | One active legal profile, optional tax/VAT number, registered address, legal lifecycle, retained profile reads, and export projection. | `docs/data-dictionary/organization-legal-profile.md`; `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `src/features/organizationLegalDetails/feature.manifest.json` | exists | Child record under Organization. |
| `organization` | Organization domain | `active` | `organizationLocations` | `active` | Physical and operational locations, optional geocoordinates, descriptive head-office flags, lifecycle, search, and export projection. | `docs/data-dictionary/organization-location.md`; `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `src/features/organizationLocations/feature.manifest.json` | exists | Opening-hour records depend on this location boundary. |
| `organization` | Organization domain | `active` | `organizationOpeningHours` | `active` | Weekly weekday opening-hour slots, date-specific exceptions, deterministic effective-hours precedence, and export projection. | `docs/data-dictionary/organization-weekly-opening-hours.md`; `docs/data-dictionary/organization-opening-hours-exception.md`; `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `src/features/organizationOpeningHours/feature.manifest.json` | exists | Normal weekly slots and exceptions are implemented in one feature bundle. |
| `organization` | Organization domain | `active` | `organizationBusinessUnits` | `active` | Business-unit hierarchy, depth 10, cycle denial, derived child projections, branch archive, child reassignment, and export projection. | `docs/data-dictionary/organization-business-unit.md`; `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `src/features/organizationBusinessUnits/feature.manifest.json` | exists | Memberships are separate. |
| `organization` | Organization domain | `active` | `organizationBusinessUnitMemberships` | `active` | Membership links from real individual users or real business units to business units using owner, manager, member, or viewer participation labels. | `docs/data-dictionary/organization-business-unit-membership.md`; `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md`; `src/features/organizationBusinessUnitMemberships/feature.manifest.json` | exists | Participation labels are not platform permission grants. |
| `organization` | Organization domain | `active` | `organizationReferenceCatalogues` | `active` | System-owned Organization option-list values, root-admin mutation, tenant-admin read/use, archive/deprecate/replace behavior, and used-value retention. | `docs/data-dictionary/organization-reference-value.md`; `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md`; `src/features/organizationReferenceCatalogues/feature.manifest.json` | exists | Broader platform catalogue remains deferred unless separately approved. |
| `organization` | Organization domain | `active` | `organizationBrandingReferences` | `active` | Logo-type relationships between Organizations and assets, replacement behavior, public delivery relationship authority, placeholder fallback, and export read of actual files. | `docs/data-dictionary/organization-logo-relationship.md`; `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md`; `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md`; `src/features/organizationBrandingReferences/feature.manifest.json` | exists | Public logo behavior uses app-controlled delivery and placeholder fallback. |
| `organization` | Organization domain | `active` | `organizationSearch` | `active` | Separated-by-type grouped search, exact filters, pagination, sorting, index-backed fields, and permission-filtered results. | `docs/prd/2026-05-12-0025-organization-domain-foundation.md`; `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md`; `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md`; `src/features/organizationSearch/feature.manifest.json` | exists | Search excludes deferred integration records in v1. |
| `organization` | Organization domain | `active` | `organizationExports` | `active` | Export request/status records, requester-bound PIN/password ZIP downloads, background generation, cancellation, retry, notification, expiry, and cleanup. | `docs/data-dictionary/organization-export.md`; `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`; `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`; `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md`; `src/features/organizationExports/feature.manifest.json` | exists | Uses reusable job-processing and notification seams for generation, expiry, and cleanup. |
| `organization` | Organization domain | `deferred` | future `organizationIntegrations` | `deferred-with-owner` | Future high-level integration relationship records with no secrets, endpoints, webhook secrets, payload examples, or provider configuration. | `docs/data-dictionary/organization-integration-record.md`; `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | not-applicable until revived | No v1 route, persistence, search, export, UI, or source task. |

## Maintenance Rules

- Add a row before a source feature is created for a new member of a domain
  family.
- Update member status when a planned, blocked, or deferred member changes.
- Do not add family metadata fields to `feature.manifest.json` until compiler
  support exists.
- When source features land, each source feature still needs its own
  `feature.manifest.json` and generated dependency graph update.
