# Story Breakdown Story: Manage Business-Unit Memberships

## Story Detail

- Story ID:
  `S-009`
- Title:
  Manage business-unit memberships
- Context:
  This is needed because memberships should link only to real participants with clear participation labels.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to assign real business units to business units with fixed labels, with individual/person memberships deferred until an approved person lookup seam exists.
- Actor / System Perspective:
  admin
- Outcome:
  Business-unit memberships reject placeholders, cross-boundary targets, self-links, and labels outside owner, manager, member, and viewer; individual/person targets return an explicit deferred response.
- Non-goals:
  No platform permission grants from participation labels, and no individual/person membership implementation until the lookup seam is approved.

## Story Narrative

**Situation**
Memberships should point to real existing participants. The first implemented
foundation supports other business units with fixed participation labels and
keeps individual/person targets explicitly deferred until a real lookup seam
exists.

**Goal**
Admins can maintain business-unit-to-business-unit memberships without
placeholder units or confusing participation labels with system permissions.

**Decisions Needed**
No new product choice is expected. Task planning must carry target type,
target identity, fixed labels of owner, manager, member, and viewer, the rule
that these labels are not authorization grants, and the explicit individual
target deferral.

**Work That Follows**
Source work can create business-unit membership records and validation against
the approved business-unit public lookup seam. Individual/person support can
follow after a person lookup seam is approved.

**Evidence Of Success**
Reviewers can prove only real business units can be linked now, individual
targets are explicitly deferred, roles use the fixed labels, and cross-account
or placeholder links are denied.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-business-unit-membership.md` | Defines membership target types, labels, lifecycle, and validation. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines real-target and tenant/account object rules. |
| Target lookup seam | actual/partial | `src/features/organizationBusinessUnits/index.ts`; `placeholder: approved individual/person public lookup seam` | Business-unit targets use a real public seam; individual targets are explicitly deferred until a person/individual seam exists. |
| API contracts | actual | `docs/api-contracts/organization-root-admin.md`; `docs/api-contracts/organization-tenant-admin.md` | Define implemented root and tenant child-route posture for business-unit memberships. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
| Feature source | actual | `src/features/organizationBusinessUnitMemberships` | Implements business-unit target memberships, lifecycle, routes, persistence, and manifest. |
| Migration | actual | `src/features/organizationBusinessUnitMemberships/persistence/migrations/0056_create_organization_business_unit_memberships.sql` | Creates membership and audit tables plus root capabilities. |
| Feature doc | actual | `docs/features/organization-business-unit-memberships.md` | Captures current partial implementation status and individual-target deferral. |
| Persistence proof | actual | `tests/integration/organizationBusinessUnits/persistence.test.ts` | Covers business-unit membership creation, audit rows, and individual-target deferral. |
