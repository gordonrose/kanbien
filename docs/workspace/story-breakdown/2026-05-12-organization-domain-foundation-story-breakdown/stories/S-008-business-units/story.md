# Story Breakdown Story: Manage Business Units

## Story Detail

- Story ID:
  `S-008`
- Title:
  Manage business units
- Context:
  This is needed because organizations need internal hierarchy with safe moves and archiving.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to manage business-unit trees inside one customer/account.
- Actor / System Perspective:
  admin
- Outcome:
  Business units support depth 10, cycle denial, child projections, branch archive, and child reassignment.
- Non-goals:
  No membership links in this story.

## Story Narrative

**Situation**
Organizations need internal structures that can nest, move, and archive without
breaking child records.

**Goal**
Admins can manage business-unit hierarchy inside the right customer/account.

**Decisions Needed**
No new product choice is expected. Task planning must carry depth 10, loop
prevention, derived child-unit reads, archive-whole-branch, and move-children
behavior.

**Work That Follows**
Source work can create business-unit records and safe hierarchy operations.

**Evidence Of Success**
Reviewers can prove unit depth, loop denial, child projections from parent
links, branch archive, child reassignment, and cross-boundary denial.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-business-unit.md` | Defines business-unit hierarchy, lifecycle, child projection, and validation. |
| Root API contract | actual | `docs/api-contracts/organization-root-admin.md` | Defines implemented root child-route posture for business units. |
| Tenant API contract | actual | `docs/api-contracts/organization-tenant-admin.md` | Defines implemented tenant child-route posture for business units. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines hierarchy object rules and tenant/account authority. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
| Feature source | actual | `src/features/organizationBusinessUnits` | Implements business-unit hierarchy, lifecycle, routes, persistence, and manifest. |
| Migration | actual | `src/features/organizationBusinessUnits/persistence/migrations/0055_create_organization_business_units.sql` | Creates business-unit and audit tables plus root capabilities. |
| Feature doc | actual | `docs/features/organization-business-units.md` | Captures current implementation status, deferrals, and proof links. |
| Persistence proof | actual | `tests/integration/organizationBusinessUnits/persistence.test.ts` | Covers hierarchy, cycle denial, child reassignment, audit rows, and membership seam interaction. |
