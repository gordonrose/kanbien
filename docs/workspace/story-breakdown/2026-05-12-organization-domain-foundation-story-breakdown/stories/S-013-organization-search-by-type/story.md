# Story Breakdown Story: Search Organization Records By Type

## Story Detail

- Story ID:
  `S-013`
- Title:
  Search Organization records by type
- Context:
  This is needed because admins need broad search without mixing results or leaking records.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need grouped Organization search with filters and stable paging.
- Actor / System Perspective:
  admin
- Outcome:
  Search returns permission-filtered grouped results with explicit operators and indexes.
- Non-goals:
  No arbitrary advanced query language and no browser-only filtering.

## Story Narrative

**Situation**
Admins need to find records across the Organization domain, but mixed results
can become confusing or unsafe if they ignore boundaries.

**Goal**
Admins can search broadly and see results grouped by record type, with exact
filters and predictable paging.

**Decisions Needed**
No new product choice is expected. Task planning must carry searchable fields,
operators, indexes, sorting, pagination, and permission filtering.

**Work That Follows**
Source work can create the search endpoint and read model.

**Evidence Of Success**
Reviewers can prove grouped results, stable paging, exact filters, index
coverage, and no cross-tenant leakage.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Organization data dictionary | actual | `docs/data-dictionary/organization.md` | Defines core searchable fields and tenant/account rules. |
| Related dictionaries | actual | `docs/data-dictionary/organization-legal-profile.md`; `docs/data-dictionary/organization-location.md`; `docs/data-dictionary/organization-business-unit.md`; `docs/data-dictionary/organization-business-unit-membership.md`; `docs/data-dictionary/organization-reference-value.md` | Define grouped result sources. |
| API contracts | actual | `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` | Define grouped search route posture. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines search authorization and object filtering. |
| Feature implementation | actual | `src/features/organizationSearch` | Implements grouped backend search service, router, repository, manifest, and migration. |
| Feature docs | actual | `docs/features/organization-search.md` | Records backend behavior, route posture, and proof commands. |
| Security proof | actual | `tests/security/organizationSearch/searchAuthorization.test.ts` | Proves root authentication, root capability denial, allowed search, and unsupported-filter denial. |
| Persistence proof | actual | `tests/integration/organizationSearch/persistence.test.ts` | Persistence-backed grouped search proof; skipped when Postgres test config is unavailable. |
