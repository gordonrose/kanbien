# Story Breakdown Story: Manage Core Organizations And Hierarchy

## Story Detail

- Story ID:
  `S-004`
- Title:
  Manage core organizations and hierarchy
- Context:
  This is needed because every Organization record needs a safe parent organization inside one customer/account.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the system, I need official organization records with safe hierarchy, lifecycle, and tenant boundaries.
- Actor / System Perspective:
  system
- Outcome:
  Organizations can be created, read, updated, archived, restored, moved, and searched within the right boundary.
- Non-goals:
  No child entity implementation beyond the core organization relationship.

## Story Narrative

**Situation**
Every other Organization record attaches to an official organization. Those
records need stable identity, tenant-level name uniqueness, parent-child
structure, and safe lifecycle behavior.

**Goal**
Admins can manage organizations inside one customer/account without crossing
boundaries or creating broken trees.

**Decisions Needed**
No new product choice is expected, but task planning must carry exact fields,
request rules, permission rules, indexes, and errors from the approved docs.

**Work That Follows**
Source work can create the core records and the rules for moving, archiving,
restoring, and reading organizations.

**Evidence Of Success**
Reviewers can prove normalized name uniqueness, depth 10, loop prevention,
branch archive, child reassignment, lifecycle visibility, and cross-tenant
denial.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization.md` | Defines Organization fields, lifecycle, hierarchy, uniqueness, and rules. |
| Root API contract | actual | `docs/api-contracts/organization-root-admin.md` | Defines implemented root-admin Organization record routes. |
| Tenant API contract | actual | `docs/api-contracts/organization-tenant-admin.md` | Defines implemented tenant-admin Organization record routes. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines root, tenant, object, and denial authority. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
| Task breakdown | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-004-core-organizations-and-hierarchy/task-breakdown.md` | Splits S-004 into queued Layer 5 delivery tasks. |
| Feature source | actual | `src/features/organizationCore` | Implements S-004 core Organization persistence, domain behavior, routes, manifest, and audit event storage. |
| Feature doc | actual | `docs/features/organization-core.md` | Summarizes implemented S-004 foundation, route families, and deferred follow-on stories. |
| Unit/security proof | actual | `tests/unit/organizationCore/domain.test.ts`; `tests/security/organizationCore/security.test.ts` | Focused S-004 unit and route-security proof passed with direct Vitest command. |
| Persistence proof | actual | `tests/integration/organizationCore/persistence.test.ts` | Postgres-backed proof covers normalized uniqueness, hierarchy movement, archive visibility, and audit rows. |
| Generated dependency graph | actual | `docs/architecture/generated/feature-dependency-graph.md`; `docs/architecture/generated/feature-dependency-graph.json` | Regenerated after adding `organizationCore` manifest. |
