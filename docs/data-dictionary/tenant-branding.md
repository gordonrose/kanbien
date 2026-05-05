# Tenant Branding

## Summary

- Description:
  Planned durable tenant-owned branding configuration storing presentation
  facts for one tenant: branding display name, primary colour, fallback
  posture, and lifecycle timestamps.
- Owning feature:
  `tenantBranding`
- Primary source tables or records:
  planned `tenant_branding`, planned `TenantBrandingRecord`
- Status:
  planned first slice; this dictionary page records first-draft source
  independent persistence intent before implementation.

## Storage Model

- Primary table or durable record:
  planned `tenant_branding`
- Related durable records:
  `tenant`, planned `tenant_branding_logo_relationship`, `asset`
- Primary key:
  planned `tenant_branding_id`
- Foreign key relationships:
  - planned `tenant_id -> tenant.tenant_id`
  - planned current logo relationship reference to
    `tenant_branding_logo_relationship` if implementation chooses a direct
    current pointer; otherwise current relationship is resolved by partial
    unique relationship state

## Capabilities That Rely On This Entity

- `readTenantBrandingForRoot`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `saveTenantBrandingForRoot`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `readTenantDashboardBrandingProjection`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- `recordTenantBrandingAuditEvidence`
  Source: `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`

## Fields

- `tenant_branding_id`
  Type / Shape: `UUID`
  Description: Generated identifier for the branding configuration row.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: planned from
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- `tenant_id`
  Type / Shape: `UUID`
  Description: Owning tenant identifier.
  Constraints / Notes: Required; must reference the durable tenant record.
  Tenant context cannot be inferred from mutable request bodies.
  Source: planned from
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- `branding_display_name`
  Type / Shape: `TEXT | NULL`
  Description: Tenant-facing display name used for branding presentation.
  Constraints / Notes: Separate from canonical tenant name. Empty strings are
  rejected rather than converted to `NULL`. Missing value falls back to the
  canonical tenant name in the dashboard projection.
  Source: planned from
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- `primary_color_hex`
  Type / Shape: `TEXT | NULL`
  Description: Approved primary colour value consumed by governed
  design-system behaviour.
  Constraints / Notes: Must be an approved hex value when supplied. Missing or
  invalid values fall back to the platform default primary colour in the
  dashboard projection.
  Source: planned from
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the branding row was created.
  Constraints / Notes: System-managed.
  Source: planned from AGENTS timestamp defaults and PRD mutation requirements.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the branding row was last changed.
  Constraints / Notes: Refreshed on every successful save and soft-delete.
  Source: planned from AGENTS mutation defaults and PRD mutation requirements.
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete marker if a later slice approves branding deletion.
  Constraints / Notes: Normal reads exclude soft-deleted rows. V1 does not add
  a normal delete route.
  Source: planned from AGENTS visibility and soft-delete defaults.
- `created_by_root_user_id`
  Type / Shape: `UUID | NULL`
  Description: Root actor that created the branding row when available.
  Constraints / Notes: Audit-sensitive system-managed metadata. The exact FK
  and nullable posture must be finalized in implementation blueprint and
  migration design.
  Source: inferred from audit requirements in
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- `updated_by_root_user_id`
  Type / Shape: `UUID | NULL`
  Description: Root actor that last changed the branding row when available.
  Constraints / Notes: Audit-sensitive system-managed metadata. The exact FK
  and nullable posture must be finalized in implementation blueprint and
  migration design.
  Source: inferred from audit requirements in
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`

## Indexes And Constraints

- planned primary key on `tenant_branding_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per branding row.
  Why It Matters: Supports stable references from logo relationships and audit
  evidence.
  Source: first-draft planning.
- planned unique active branding per tenant
  Type: `partial unique`
  Definition / Rule: `tenant_id` is unique where `deleted_at IS NULL`.
  Why It Matters: Ensures one active branding configuration per tenant.
  Source: capability matrix index requirement.
- planned tenant lookup index
  Type: `index`
  Definition / Rule: index active rows by `tenant_id` and lifecycle visibility.
  Why It Matters: Root reads and tenant-dashboard projection are exact tenant
  lookups.
  Source: capability matrix search/filter model.
- planned primary colour validation
  Type: `check` or domain validation
  Definition / Rule: supplied colour must be an approved hex value.
  Why It Matters: Prevents one-off theme values that bypass design-system
  governance.
  Source: PRD primary-colour decision.

## Normalization And Uniqueness Rules

- Rule:
  `branding_display_name` must reject empty strings; trimming rules should
  follow the final API validation contract.
  Why It Matters:
  avoids silent null conversion and preserves explicit fallback behaviour.
  Source: AGENTS normalization defaults and PRD save requirements.
- Rule:
  active branding rows are unique by tenant.
  Why It Matters:
  tenant-dashboard projection must resolve one deterministic active branding
  configuration.
  Source: capability matrix persistence requirements.
- Rule:
  canonical tenant name remains owned by `tenants`; branding display name is a
  separate durable fact.
  Why It Matters:
  saving branding must not mutate canonical tenant identity.
  Source: PRD feature-boundary decision.

## Lifecycle Semantics

- State or lifecycle rule:
  normal reads return only active, non-deleted branding rows.
  Meaning:
  soft-deleted branding, if later approved, must be visible only through an
  explicit deleted-row capability.
  Source: AGENTS visibility defaults.
- State or lifecycle rule:
  branding changes apply to tenant-dashboard users on next login or dashboard
  reload in v1.
  Meaning:
  no live-update persistence or push-state guarantee is introduced.
  Source: PRD apply-timing decision.
- State or lifecycle rule:
  missing display name and primary colour are consumable absence states.
  Meaning:
  projection uses canonical tenant name and platform default colour fallbacks
  rather than inventing stored values.
  Source: PRD fallback decisions.

## Mutation Semantics

- Mutation rule:
  create or update branding through the root-admin save capability.
  Effect on stored fields:
  persists `branding_display_name`, `primary_color_hex`, and system-managed
  timestamps without changing canonical tenant identity.
  Source: PRD functional requirements.
- Mutation rule:
  clients cannot provide system-managed fields.
  Effect on stored fields:
  identifiers, timestamps, actor metadata, lifecycle fields, and audit
  metadata are generated or maintained server-side.
  Source: AGENTS system-managed field defaults.
- Mutation rule:
  successful save refreshes `updated_at`.
  Effect on stored fields:
  supports auditability and rebuild-from-spec mutation semantics.
  Source: AGENTS mutation defaults.

## Cross-Feature Read Seams

- Exported seam:
  planned `TenantBrandingDashboardProjectionReader`
  Consumer:
  tenant dashboard shell
  Allowed read shape:
  fallback-aware projection only: display name, primary colour, logo URL or
  null, accessibility posture, fallback indicators, and apply-timing metadata.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- Exported seam:
  planned `TenantBrandingRootReader`
  Consumer:
  root-admin tenant branding page
  Allowed read shape:
  active branding record plus current logo relationship summary; no private
  storage credentials or raw bucket URLs.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- Exported seam:
  `tenants` canonical tenant lookup
  Consumer:
  tenant branding projection
  Allowed read shape:
  tenant existence and canonical tenant name fallback.
  Source: PRD fallback decision.

## Migration Compatibility Notes

- Note:
  migration design must preserve one active branding row per tenant and must
  not backfill branding display name by mutating canonical tenant name.
  Why It Matters For Rebuild Or Shared Environments:
  canonical tenant identity and branding presentation are separate durable
  facts.
  Source: PRD feature-boundary decision.
- Note:
  if actor attribution fields are implemented, migration and test harness must
  validate FK/nullability against existing root-user and auth behavior.
  Why It Matters For Rebuild Or Shared Environments:
  audit metadata cannot make existing tenant branding rows impossible to
  bootstrap or repair.
  Source: inferred from audit requirements and migration safety defaults.

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Branding is documented as owned by `tenantBranding` with source record(s) planned `tenant_branding`, planned `TenantBrandingRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | yes | enforced-in-code | Lifecycle and mutation sections in this page; repository/source references cited above | Normal read paths must exclude soft-deleted rows unless an explicit deleted/read capability is documented. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `TENANT_BRANDING_VALIDATION_FAILED`
  Message: Tenant branding values are invalid.
  Field: `brandingDisplayName` or `primaryColorHex`
  Reason: empty display name, invalid colour, or system-managed field supplied.
  When It Happens: root-admin save validation fails.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- `TENANT_BRANDING_TENANT_NOT_FOUND`
  Message: Tenant was not found.
  Field: `tenantId`
  Reason: selected or current tenant does not exist or is not visible.
  When It Happens: root-admin exact read/save or tenant-dashboard projection
  cannot resolve the tenant.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`
- `TENANT_BRANDING_CURRENT_TENANT_REQUIRED`
  Message: Current tenant context is required.
  Field: current tenant context
  Reason: tenant-dashboard request lacks exactly one server-side tenant
  context.
  When It Happens: tenant-dashboard projection or logo read is attempted
  without current tenant authority.
  Source: planned API contract
  `docs/api-contracts/tenant-branding.md`

## Notes

- This page is a planning artifact for a not-yet-implemented entity. Source
  references point to approved planning artifacts rather than migrations.
- Implementation blueprint and migration design must either preserve these
  names or explicitly update this page before Layer 5 delivery closes.
