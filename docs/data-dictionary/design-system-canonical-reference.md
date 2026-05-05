# Design System Canonical Reference

## Summary

- Description: Durable registry row for one generated canonical-rendering
  reference state under a design-system canonical family.
- Owning feature: `designSystemCanonicals`
- Primary source tables or records:
  `design_system_canonical_references`,
  `DesignSystemCanonicalReferenceRecord`
- Status: implemented in the canonical-renderings foundation slice

## Storage Model

- Primary table or durable record: `design_system_canonical_references`
- Related durable records:
  `design_system_canonical_families`,
  `web_app_pages`, `web_app_page_locators`
- Primary key: `design_system_canonical_reference_id`
- Foreign key relationships:
  `design_system_canonical_family_id` references
  `design_system_canonical_families.design_system_canonical_family_id`

## Capabilities Expected To Rely On This Entity

- Manage canonical reference governance
  Source: `designSystemCanonicals`
- Read public canonical rendering projection
  Source: `designSystemCanonicals`
- Read public canonical launcher projection
  Source: `designSystemCanonicals`
- Sync design-system canonical renderings into the web-app hierarchy
  Source: `webAppHierarchyBuilder`

## Fields

- `design_system_canonical_reference_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one canonical reference.
  Constraints / Notes: Primary key.
- `design_system_canonical_family_id`
  Type / Shape: `UUID`
  Description: Owning canonical family id.
  Constraints / Notes: Required foreign key with cascade delete.
- `reference_id`
  Type / Shape: `TEXT`
  Description: Stable family-scoped reference id, such as `DTPR-001`.
  Constraints / Notes: Required. Preserved for generated route projection.
- `normalized_reference_id`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase reference id used for family-scoped lookup.
  Constraints / Notes: Required.
- `display_label`
  Type / Shape: `TEXT`
  Description: Human-readable reference label.
  Constraints / Notes: Required.
- `description`
  Type / Shape: `TEXT`
  Description: Review intent for the reference state.
  Constraints / Notes: Required.
- `render_route_path`
  Type / Shape: `TEXT`
  Description: Public generated reference render route.
  Constraints / Notes: Required and unique.
- `legacy_render_route_path`
  Type / Shape: `TEXT | NULL`
  Description: Optional legacy render route retained for parity review.
  Constraints / Notes: Nullable.
- `viewport`
  Type / Shape: `TEXT | NULL`
  Description: Optional named viewport or review lane.
  Constraints / Notes: Nullable.
- `width`
  Type / Shape: `INTEGER | NULL`
  Description: Intended render-lane width.
  Constraints / Notes: Nullable. Positive when supplied by the API schema.
- `height`
  Type / Shape: `INTEGER | NULL`
  Description: Intended render-lane height.
  Constraints / Notes: Nullable. Positive when supplied by the API schema.
- `theme`
  Type / Shape: `TEXT`
  Description: Deterministic theme setting for the reference.
  Constraints / Notes: Required. Defaults to `normal` at service create.
- `direction`
  Type / Shape: `TEXT`
  Description: Deterministic text direction setting for the reference.
  Constraints / Notes: Required. Defaults to `ltr` at service create.
- `zoom`
  Type / Shape: `INTEGER`
  Description: Deterministic zoom or magnification setting.
  Constraints / Notes: Required. Must be from `-100` through `100`.
- `locale_fixture`
  Type / Shape: `TEXT | NULL`
  Description: Optional locale fixture key.
  Constraints / Notes: Nullable.
- `label_density_fixture`
  Type / Shape: `TEXT | NULL`
  Description: Optional content-density fixture key.
  Constraints / Notes: Nullable.
- `state_variant_key`
  Type / Shape: `TEXT | NULL`
  Description: Optional implementation state variant key.
  Constraints / Notes: Nullable.
- `specimen_payload`
  Type / Shape: `JSONB`
  Description: Bounded deterministic payload for the reference specimen.
  Constraints / Notes: Required. Defaults to `{}`.
- `status`
  Type / Shape: `'draft' | 'review' | 'live' | 'inactive'`
  Description: Registry lifecycle status.
  Constraints / Notes: Required. Public projections expose only `live` rows.
- `sort_order`
  Type / Shape: `INTEGER`
  Description: Ordering value within one family launcher.
  Constraints / Notes: Required. Defaults to `0`.
- `featured`
  Type / Shape: `BOOLEAN`
  Description: Featured flag for launcher treatment.
  Constraints / Notes: Required. Defaults to `FALSE`.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Refreshed on update.

## Indexes And Constraints

- `design_system_canonical_references_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `design_system_canonical_reference_id`.
  Why It Matters: Preserves durable reference identity across route and label
  edits.
- family foreign key
  Type: `foreign key`
  Definition / Rule:
  `design_system_canonical_family_id` references the owning family with cascade
  delete.
  Why It Matters: A reference cannot outlive its registry family.
- render route uniqueness
  Type: `unique`
  Definition / Rule: `render_route_path` is unique.
  Why It Matters: Prevents two references from claiming the same generated
  render URL.
- family/reference uniqueness
  Type: `unique`
  Definition / Rule:
  `(design_system_canonical_family_id, normalized_reference_id)` is unique.
  Why It Matters: Keeps reference ids deterministic within one family while
  allowing different families to use their own ref-id schemes.
- family sort index
  Type: `other`
  Definition / Rule:
  index on `(design_system_canonical_family_id, sort_order, normalized_reference_id)`.
  Why It Matters: Supports deterministic launcher projection.
- `status` check
  Type: `check`
  Definition / Rule: `status IN ('draft', 'review', 'live', 'inactive')`.
  Why It Matters: Keeps public lifecycle behavior explicit.
- `zoom` check
  Type: `check`
  Definition / Rule: `zoom >= -100 AND zoom <= 100`.
  Why It Matters: Bounds deterministic magnification values.

## Normalization And Uniqueness Rules

- Rule: `reference_id` is normalized into `normalized_reference_id` for
  family-scoped lookup and uniqueness.
  Why It Matters: Public render lookup must resolve one exact reference without
  depending on casing variation.
- Rule: `render_route_path` is unique globally.
  Why It Matters: Generated route truth must stay exact and durable.

## Lifecycle Semantics

- State or lifecycle rule: Only references under a `live` family and with
  `live` status are public.
  Meaning: Draft, review, and inactive references remain protected registry
  truth and are excluded from public launcher/render projections.
- State or lifecycle rule: Reference state is deterministic, not URL-mutable.
  Meaning: Query params must not become canonical state authority for generated
  render paths.

## Mutation Semantics

- Mutation rule: Create generates the reference id and timestamps.
  Effect on stored fields: Clients cannot supply system-managed identifiers or
  audit timestamps.
- Mutation rule: Update refreshes `updated_at`.
  Effect on stored fields: Route posture, lifecycle, display metadata, and
  deterministic render settings remain durable.

## Approved Cross-Feature Reads

- `webAppHierarchyBuilder` reads live reference route data through the
  `designSystemCanonicals` public integration seam.
- Public frontend generated render routes read public projections rather than
  direct persistence records.
- No feature should import `designSystemCanonicals/persistence/*` directly.

## Compliance Classification And Governance

- Data classification: internal platform metadata
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Design System Canonical Reference is documented as owned by `designSystemCanonicals` with source record(s) `design_system_canonical_references`, `DesignSystemCanonicalReferenceRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `INVALID_REQUEST`
  Message: Request fields are missing, invalid, or unexpected.
  Field: schema-derived field name when available.
  Reason: schema-derived reason or `unexpected_field`.
- `CANONICAL_FAMILY_NOT_FOUND`
  Message: We could not find that canonical family.
  Field: `canonicalFamilyId` or `familyKey`.
  Reason: `not_found`.
- `CANONICAL_REFERENCE_NOT_FOUND`
  Message: We could not find that canonical reference.
  Field: `canonicalReferenceId` or `referenceId`.
  Reason: `not_found`.
- `CANONICAL_REFERENCE_CONFLICT`
  Message: That canonical reference conflicts with an existing record.
  Field: `referenceId` or `renderRoutePath`.
  Reason: `duplicate`.
