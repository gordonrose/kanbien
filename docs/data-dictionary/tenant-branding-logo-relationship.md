# Tenant Branding Logo Relationship

## Summary

- Description:
  Planned durable relationship between one tenant branding configuration and
  the current or historical tenant logo asset, including contextual
  accessibility metadata and consumer-readiness posture.
- Owning feature:
  `tenantBranding`
- Primary source tables or records:
  planned `tenant_branding_logo_relationship`, planned
  `TenantBrandingLogoRelationshipRecord`
- Status:
  planned first slice; this dictionary page records first-draft source
  independent persistence intent before implementation.

## Storage Model

- Primary table or durable record:
  planned `tenant_branding_logo_relationship`
- Related durable records:
  planned `tenant_branding`, `tenant`, `asset`
- Primary key:
  planned `tenant_branding_logo_relationship_id`
- Foreign key relationships:
  - planned `tenant_branding_id -> tenant_branding.tenant_branding_id`
  - planned `tenant_id -> tenant.tenant_id`
  - planned `asset_id -> asset.asset_id`

## Capabilities That Rely On This Entity

- `createTenantLogoUploadIntent`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `replaceTenantLogoRelationship`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `readTenantLogoContent`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `readTenantDashboardBrandingProjection`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `recordTenantBrandingAuditEvidence`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`

## Fields

- `tenant_branding_logo_relationship_id`
  Type / Shape: `UUID`
  Description: Generated identifier for the logo relationship.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: planned from
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- `tenant_branding_id`
  Type / Shape: `UUID`
  Description: Owning branding configuration row.
  Constraints / Notes: Required; links the relationship to the durable branding
  facts for one tenant.
  Source: planned from PRD logo relationship concept.
- `tenant_id`
  Type / Shape: `UUID`
  Description: Durable tenant scope copied onto the relationship.
  Constraints / Notes: Must match branding owner and asset tenant scope before
  the relationship can become consumer-ready.
  Source: PRD logo relationship and tenant-boundary decisions.
- `asset_id`
  Type / Shape: `UUID`
  Description: Asset record that owns the uploaded logo bytes and asset-native
  lifecycle.
  Constraints / Notes: Must refer to a private, tenant-scoped, ready asset
  validated by `assets`.
  Source: PRD logo relationship and assets contract.
- `relationship_status`
  Type / Shape: `TEXT`
  Description: Relationship lifecycle state.
  Constraints / Notes: Planned states include `current`, `replaced`,
  `pending`, `rejected`, or equivalent final implementation names. Only a
  consumer-ready current relationship may be used for logo content.
  Source: inferred from PRD replacement and cleanup posture.
- `consumer_ready_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time the relationship became safe for tenant branding
  consumption.
  Constraints / Notes: Requires ready asset, matching tenant scope, allowed
  lifecycle state, and contextual accessibility posture.
  Source: PRD logo relationship concept.
- `alt_text`
  Type / Shape: `TEXT | NULL`
  Description: Contextual alternative text for the logo relationship.
  Constraints / Notes: Required unless `decorative` is true. Empty strings are
  rejected when alt text is required.
  Source: PRD logo accessibility decision.
- `decorative`
  Type / Shape: `BOOLEAN`
  Description: Whether the logo is explicitly decorative in this tenant
  branding relationship.
  Constraints / Notes: Must be true only when alt text is intentionally not
  supplied. The final implementation should enforce exactly one accessibility
  posture for consumer-ready logos.
  Source: PRD logo accessibility decision.
- `readiness_failure_reason`
  Type / Shape: `TEXT | NULL`
  Description: Safe reason the relationship cannot become consumer-ready.
  Constraints / Notes: Must not contain raw bytes, storage credentials, upload
  targets, bearer/session identifiers, or secrets.
  Source: PRD audit and forbidden-field requirements.
- `replaced_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time the relationship stopped being the current logo because a
  new relationship replaced it.
  Constraints / Notes: Prior logo bytes remain governed by assets retention,
  cleanup, quota, and audit behavior.
  Source: PRD replacement-only decision.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the relationship was created.
  Constraints / Notes: System-managed.
  Source: AGENTS timestamp defaults.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the relationship was last changed.
  Constraints / Notes: Refreshed on successful relationship mutation.
  Source: AGENTS mutation defaults.
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete marker if a later slice approves relationship
  deletion.
  Constraints / Notes: Normal logo reads exclude deleted relationships.
  Source: AGENTS visibility defaults.

## Indexes And Constraints

- planned primary key on `tenant_branding_logo_relationship_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per relationship row.
  Why It Matters: Supports stable audit references and replacement history.
  Source: first-draft planning.
- planned FK to `tenant_branding`
  Type: `foreign key`
  Definition / Rule: `tenant_branding_id` references the owning branding row.
  Why It Matters: prevents orphaned relationship records.
  Source: first-draft planning.
- planned FK to `asset`
  Type: `foreign key`
  Definition / Rule: `asset_id` references the asset metadata row.
  Why It Matters: asset lifecycle and storage policy remain owned by `assets`.
  Source: PRD asset boundary.
- planned unique current logo per branding record
  Type: `partial unique`
  Definition / Rule: one current non-deleted relationship per
  `tenant_branding_id`.
  Why It Matters: tenant-dashboard projection and content read must resolve one
  deterministic current logo.
  Source: capability matrix persistence requirements.
- planned accessibility posture check
  Type: `check` or domain validation
  Definition / Rule: consumer-ready relationships must have either non-empty
  `alt_text` or explicit `decorative = true`.
  Why It Matters: accessibility metadata is contextual to the tenant branding
  relationship, not assumed from the asset.
  Source: PRD logo accessibility decision.
- planned tenant and lifecycle lookup indexes
  Type: `index`
  Definition / Rule: indexes on `tenant_id`, `asset_id`, relationship status,
  readiness, and deleted visibility.
  Why It Matters: supports exact selected-tenant and current-tenant logo reads,
  replacement validation, and cleanup-sensitive inspection.
  Source: capability matrix index requirements.

## Normalization And Uniqueness Rules

- Rule:
  relationship tenant, branding tenant, and asset tenant scope must match
  before a logo becomes consumer-ready.
  Why It Matters:
  prevents cross-tenant logo leaks and keeps asset ownership from becoming
  authority by itself.
  Source: PRD authorization and logo relationship decisions.
- Rule:
  exactly one current non-deleted logo relationship may exist for one active
  branding record.
  Why It Matters:
  projection and content routes must not choose between multiple current logos.
  Source: capability matrix persistence requirements.
- Rule:
  logo clear/remove is not a valid v1 relationship mutation.
  Why It Matters:
  removal needs separate retention, fallback, audit, and UX decisions.
  Source: PRD logo clear decision.

## Lifecycle Semantics

- State or lifecycle rule:
  pending, rejected, deleted, metadata-incomplete, sanitizer-blocked, or
  cleanup-pending relationships are not consumer-ready.
  Meaning:
  projection returns no logo and content routes deny or return typed
  not-available errors.
  Source: PRD fallback and logo readiness decisions.
- State or lifecycle rule:
  replacement creates or marks a new current relationship; prior bytes remain
  governed by `assets`.
  Meaning:
  tenant branding owns relationship history, but asset cleanup and storage
  lifecycle stay in the assets feature.
  Source: PRD replacement and asset boundary decisions.
- State or lifecycle rule:
  pending and failed-cleanup logo records count against quota, cost, and abuse
  limits until cleanup succeeds or later approved policy changes this rule.
  Meaning:
  failed cleanup remains operationally visible and cannot silently disappear
  from accounting.
  Source: PRD quota decision.

## Mutation Semantics

- Mutation rule:
  upload intent creation may allocate an asset and upload intent through
  `assets` before a relationship becomes current.
  Effect on stored fields:
  no logo relationship is consumer-ready until the asset is ready and the
  relationship is authorized with accessibility posture.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- Mutation rule:
  logo replacement validates the tenant relationship before linking the asset.
  Effect on stored fields:
  creates or updates the current relationship, records readiness, refreshes
  `updated_at`, and records prior relationship replacement posture.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- Mutation rule:
  rejected or failed relationships must record safe reasons only.
  Effect on stored fields:
  failure metadata supports audit and operations without leaking storage
  credentials, raw bytes, tokens, or secrets.
  Source: PRD audit requirements.

## Cross-Feature Read Seams

- Exported seam:
  planned `TenantBrandingLogoRelationshipValidator`
  Consumer:
  tenant branding service and logo content routes
  Allowed read shape:
  relationship readiness, tenant match, asset id, accessibility posture, and
  safe failure reason.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- Exported seam:
  `assets.validateAssetForSubject`
  Consumer:
  tenant branding logo replacement
  Allowed read shape:
  asset readiness, tenant scope, lifecycle, content type, visibility, and
  sanitizer readiness without exposing private storage credentials.
  Source: `docs/api-contracts/assets.md`
- Exported seam:
  `assets.readAssetContent`
  Consumer:
  tenant branding logo content routes
  Allowed read shape:
  same-origin private content stream after tenant branding relationship
  authorization.
  Source: `docs/api-contracts/assets.md`

## Migration Compatibility Notes

- Note:
  the migration must prevent multiple current logo relationships for one active
  tenant branding record.
  Why It Matters For Rebuild Or Shared Environments:
  a rebuild must not create ambiguous dashboard logo projection behaviour.
  Source: capability matrix uniqueness requirement.
- Note:
  tenant scope should be durably represented on the relationship even though it
  can be derived from branding and asset records.
  Why It Matters For Rebuild Or Shared Environments:
  durable tenant scope supports auditability and cross-tenant-deny proof when
  related records change or are unavailable.
  Source: AGENTS durable domain data rule and PRD authorization decisions.
- Note:
  relationship readiness must not be inferred from asset readiness alone.
  Why It Matters For Rebuild Or Shared Environments:
  contextual accessibility metadata and tenant relationship authorization are
  consuming-feature facts.
  Source: PRD logo relationship concept.

## Related Errors

- `TENANT_BRANDING_LOGO_INVALID`
  Message: Tenant logo request is invalid.
  Field: `assetId`, `altText`, or `decorative`
  Reason: unsupported clear request, invalid asset id, invalid accessibility
  posture, or unsupported logo metadata.
  When It Happens: logo intent creation or replacement validation fails.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- `TENANT_BRANDING_LOGO_NOT_READY`
  Message: Tenant logo is not ready for use.
  Field: `assetId`
  Reason: asset or relationship is pending, rejected, sanitizer-blocked,
  cleanup-pending, deleted, or metadata-incomplete.
  When It Happens: replacement, projection, or content read attempts to consume
  a non-ready logo.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- `TENANT_BRANDING_LOGO_TENANT_MISMATCH`
  Message: Tenant logo does not belong to the selected tenant.
  Field: `tenantId` / `assetId`
  Reason: selected tenant, branding owner, current tenant context, or asset
  tenant scope do not match.
  When It Happens: cross-tenant logo link or content read is attempted.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- `TENANT_BRANDING_LOGO_CLEAR_NOT_SUPPORTED`
  Message: Logo clearing is not supported in v1.
  Field: logo relationship request
  Reason: v1 is replacement-only.
  When It Happens: a caller attempts to clear or remove the logo instead of
  replacing it.
  Source: PRD logo clear decision.

## Notes

- This page is a planning artifact for a not-yet-implemented entity. Source
  references point to approved planning artifacts and existing assets contract
  docs rather than tenant-branding migrations.
- The final implementation may choose exact enum names, FK names, or current
  pointer mechanics differently, but must preserve the durable facts and
  proof obligations captured here or update the source-independent artifacts
  before delivery closes.
