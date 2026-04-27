# Design System Canonical Family

## Summary

- Description: Durable registry row for one generated design-system canonical
  launcher family.
- Owning feature: `designSystemCanonicals`
- Primary source tables or records:
  `design_system_canonical_families`,
  `DesignSystemCanonicalFamilyRecord`
- Status: implemented in the canonical-renderings foundation slice

## Storage Model

- Primary table or durable record: `design_system_canonical_families`
- Related durable records:
  `design_system_canonical_references`,
  `web_app_pages`, `web_app_page_locators`
- Primary key: `design_system_canonical_family_id`
- Foreign key relationships:
  none from this table; references point back to the family row

## Capabilities Expected To Rely On This Entity

- Manage canonical family governance
  Source: `designSystemCanonicals`
- Read public canonical family list
  Source: `designSystemCanonicals`
- Read public canonical launcher projection
  Source: `designSystemCanonicals`
- Sync design-system canonical renderings into the web-app hierarchy
  Source: `webAppHierarchyBuilder`

## Fields

- `design_system_canonical_family_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one canonical family.
  Constraints / Notes: Primary key.
- `family_key`
  Type / Shape: `TEXT`
  Description: Stable route-facing family key, such as `date-picker`.
  Constraints / Notes: Required. Preserved for display and route projection.
- `normalized_family_key`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase family key used for exact lookup.
  Constraints / Notes: Required and unique.
- `display_label`
  Type / Shape: `TEXT`
  Description: Human-readable family label.
  Constraints / Notes: Required.
- `family_kind`
  Type / Shape: `'component' | 'pattern' | 'template'`
  Description: Design-system classification for the family.
  Constraints / Notes: Required.
- `launcher_title`
  Type / Shape: `TEXT`
  Description: Title exposed on generated launcher projections.
  Constraints / Notes: Required.
- `launcher_description`
  Type / Shape: `TEXT`
  Description: Descriptive launcher copy for the family.
  Constraints / Notes: Required.
- `launcher_category`
  Type / Shape: `TEXT | NULL`
  Description: Optional grouping label for launcher display.
  Constraints / Notes: Nullable.
- `generated_launcher_route_path`
  Type / Shape: `TEXT`
  Description: Public generated family launcher path.
  Constraints / Notes: Required and unique.
- `generated_root_route_path`
  Type / Shape: `TEXT`
  Description: Root generated canonical-rendering path for the family branch.
  Constraints / Notes: Required and unique.
- `legacy_launcher_route_path`
  Type / Shape: `TEXT | NULL`
  Description: Optional legacy launcher route retained for migration review.
  Constraints / Notes: Nullable.
- `source_surface_route_path`
  Type / Shape: `TEXT | NULL`
  Description: Optional approved source or parent route for family proof.
  Constraints / Notes: Nullable.
- `status`
  Type / Shape: `'draft' | 'review' | 'live' | 'inactive'`
  Description: Registry lifecycle status.
  Constraints / Notes: Required. Public projections expose only `live` rows.
- `sort_order`
  Type / Shape: `INTEGER`
  Description: Ordering value for public family listing.
  Constraints / Notes: Required. Defaults to `0`.
- `featured`
  Type / Shape: `BOOLEAN`
  Description: Featured ordering flag for public family listing.
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

- `design_system_canonical_families_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `design_system_canonical_family_id`.
  Why It Matters: Preserves durable registry identity.
- normalized family key uniqueness
  Type: `unique`
  Definition / Rule: `normalized_family_key` is unique.
  Why It Matters: Prevents duplicate generated family branches under casing or
  whitespace variation.
- generated launcher route uniqueness
  Type: `unique`
  Definition / Rule: `generated_launcher_route_path` is unique.
  Why It Matters: Prevents two families from claiming one public launcher URL.
- generated root route uniqueness
  Type: `unique`
  Definition / Rule: `generated_root_route_path` is unique.
  Why It Matters: Keeps generated branch ownership exact.
- `family_kind` check
  Type: `check`
  Definition / Rule: `family_kind IN ('component', 'pattern', 'template')`.
  Why It Matters: Keeps design-system family classification bounded.
- `status` check
  Type: `check`
  Definition / Rule: `status IN ('draft', 'review', 'live', 'inactive')`.
  Why It Matters: Keeps public lifecycle behavior explicit.

## Normalization And Uniqueness Rules

- Rule: `family_key` is normalized into `normalized_family_key` for lookup and
  uniqueness.
  Why It Matters: Public projection and hierarchy sync must resolve one family
  deterministically.
- Rule: generated route paths are unique registry facts.
  Why It Matters: Route ownership must not depend on frontend file discovery or
  mutable launcher HTML.

## Lifecycle Semantics

- State or lifecycle rule: Only `live` families are public.
  Meaning: Draft, review, and inactive families remain protected registry truth
  and are excluded from public generated launcher projection.
- State or lifecycle rule: A live family does not equal app-adoption readiness.
  Meaning: Design-system family promotion still follows component inventory,
  verification checklist, and adoption-contract status.

## Mutation Semantics

- Mutation rule: Create generates the family id and timestamps.
  Effect on stored fields: Clients cannot supply system-managed identifiers or
  audit timestamps.
- Mutation rule: Update refreshes `updated_at`.
  Effect on stored fields: Lifecycle, route posture, ordering, and display
  metadata changes remain visible.

## Approved Cross-Feature Reads

- `webAppHierarchyBuilder` reads live canonical hierarchy nodes through the
  `designSystemCanonicals` public integration seam.
- No feature should import `designSystemCanonicals/persistence/*` directly.

## Related Errors

- `INVALID_REQUEST`
  Message: Request fields are missing, invalid, or unexpected.
  Field: schema-derived field name when available.
  Reason: schema-derived reason or `unexpected_field`.
- `CANONICAL_FAMILY_NOT_FOUND`
  Message: We could not find that canonical family.
  Field: `canonicalFamilyId` or `familyKey`.
  Reason: `not_found`.
- `CANONICAL_FAMILY_CONFLICT`
  Message: That canonical family conflicts with an existing record.
  Field: `familyKey` or `generatedLauncherRoutePath`.
  Reason: `duplicate`.
