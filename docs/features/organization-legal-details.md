# Organization Legal Details Feature

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationLegalDetails` |
| Implementation status | `implemented-foundation` |
| First implemented story | `S-005` |
| Source owner | `src/features/organizationLegalDetails` |
| Runtime table | `organization_legal_profile` |
| Audit table | `organization_legal_profile_audit_event` |

## Implemented Foundation

The S-005 slice introduces durable legal-profile records for Organizations with:

- one active legal profile per Organization
- required legal name plus optional registration identifier, tax/VAT number,
  and registered address
- archive, restore, and soft-delete lifecycle behavior
- normal reads that exclude archived and deleted rows unless explicitly asked
  for retained records
- export projection support for later Organization export slices
- same-tenant Organization ownership proof through the `organizationCore`
  public seam
- root-admin capability seeding for legal-profile read and manage operations

## Current Route Families

| Actor world | Canonical route family | Compatibility route family | Notes |
| --- | --- | --- | --- |
| root admin | `/v1/root-admin/tenants/:tenantId/organizations/:organizationId/legal-profiles` | `/v1/tenants/:tenantId/organizations/:organizationId/legal-profiles` | Root routes require `organization.legal-profile.read` or `organization.legal-profile.manage`. |
| tenant admin | `/v1/tenant-admin/organizations/:organizationId/legal-profiles` | `/v1/tenant/organizations/:organizationId/legal-profiles` | Tenant routes require an active tenant-admin session/current tenant context. |

## Deferred From S-005

Multiple active legal profiles, UI screens, grouped search integration, export
job integration, persistence-backed route/security tests, and richer
tenant-admin grant checks remain later slices. This feature should keep using
Organization identity and lifecycle through public seams rather than importing
private Organization persistence files.

## Evidence

| Evidence | Location |
| --- | --- |
| Story | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-005-legal-profiles/story.md` |
| Task breakdown | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-005-legal-profiles/task-breakdown.md` |
| Data dictionary | `docs/data-dictionary/organization-legal-profile.md` |
| Root API contract | `docs/api-contracts/organization-root-admin.md` |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` |
| Feature manifest | `src/features/organizationLegalDetails/feature.manifest.json` |
| Focused tests | `tests/unit/organizationLegalDetails/service.test.ts` |
