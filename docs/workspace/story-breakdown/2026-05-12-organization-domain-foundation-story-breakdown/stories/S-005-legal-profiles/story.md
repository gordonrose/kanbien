# Story Breakdown Story: Manage Legal Profiles

## Story Detail

- Story ID:
  `S-005`
- Title:
  Manage legal profiles
- Context:
  This is needed because legal details have one-active behavior and must stay understandable over time.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the system, I need one active legal profile per organization with retained prior records.
- Actor / System Perspective:
  system
- Outcome:
  Legal profiles support required fields, optional tax/VAT number, optional registered address, lifecycle, and export projection.
- Non-goals:
  No multiple active legal profiles in v1.

## Story Narrative

**Situation**
Organizations need legal details, but the first version allows only one active
legal profile at a time.

**Goal**
Admins can maintain legal information while old or archived profiles stay
understandable.

**Decisions Needed**
No new product choice is expected. Task planning must carry optional tax/VAT
number, optional registered address, one-active behavior, and retention rules.

**Work That Follows**
Source work can create legal profile records, validation, lifecycle behavior,
and read/export projections.

**Evidence Of Success**
Reviewers can prove only one active profile exists per organization and that
profiles cannot attach across the wrong customer/account.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-legal-profile.md` | Defines legal profile fields, one-active rule, lifecycle, and retention. |
| Root API contract | actual | `docs/api-contracts/organization-root-admin.md` | Defines planned root child-route posture. |
| Tenant API contract | actual | `docs/api-contracts/organization-tenant-admin.md` | Defines planned tenant child-route posture. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines object and tenant/account authority. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
| Task breakdown | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-005-legal-profiles/task-breakdown.md` | Carries S-005 delivery tasks and closeout obligations. |
| Feature source | actual | `src/features/organizationLegalDetails` | Implements legal-profile domain, persistence, transport, integration, and manifest. |
| Feature document | actual | `docs/features/organization-legal-details.md` | Summarizes implemented route families, source owner, and deferred scope. |
| Migration | actual | `src/features/organizationLegalDetails/persistence/migrations/0052_create_organization_legal_details.sql` | Creates legal-profile source and audit tables, indexes, and root capabilities. |
| Focused tests | actual | `tests/unit/organizationLegalDetails/service.test.ts` | Proves optional fields, one-active denial, tenant boundary, lifecycle visibility, export projection, and nullable updates. |
