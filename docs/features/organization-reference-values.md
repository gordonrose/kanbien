# Organization Reference Values Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationReferenceCatalogues` |
| Implementation status | `implemented-foundation` |
| First implemented story | `S-010` |
| Source owner | `src/features/organizationReferenceCatalogues` |
| Runtime table | `organization_reference_value` |
| Audit table | `organization_reference_value_audit_event` |

## Implemented Foundation

The S-010 slice introduces system-owned Organization reference values:

- root-admin create, read, label update, archive, deprecate, and replace routes
- tenant-admin read/use route for active approved values
- stable `referenceType` and `referenceValueKey` storage with uniqueness per type
- active, archived, deprecated, and replaced lifecycle states
- replacement links for explicitly superseded values
- retained reads for archived, deprecated, and replaced values when requested
- root capability enforcement for mutation and read
- tenant-session enforcement for tenant reads
- audit events for root catalogue mutations

## Deferred From S-010

Frontend catalogue management screens, generic platform catalogues, grouped
Organization search integration, export integration, and deeper used-by
counting remain later slices.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-010-organization-reference-values/story.md` |
| Task breakdown | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-010-organization-reference-values/task-breakdown.md` |
| Data dictionary | `docs/data-dictionary/organization-reference-value.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Permission mapping | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` |
| Feature manifest | `src/features/organizationReferenceCatalogues/feature.manifest.json` |
| Focused tests | `tests/integration/organizationReferenceCatalogues/persistence.test.ts`; `tests/security/organizationReferenceCatalogues/referenceValueAuthorization.test.ts` |
