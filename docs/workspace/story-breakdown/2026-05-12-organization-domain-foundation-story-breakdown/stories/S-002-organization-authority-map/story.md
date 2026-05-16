# Story Breakdown Story: Map Organization Authority

## Story Detail

- Story ID:
  `S-002`
- Title:
  Map Organization authority
- Context:
  This is needed because root admins, tenant admins, public readers, and export workers need different rules.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the security reviewer, I need an authority map before routes, jobs, or screens are planned.
- Actor / System Perspective:
  security reviewer
- Outcome:
  Permission mapping names capabilities, tenant context, object rules, denial behavior, and blocker posture.
- Non-goals:
  No runtime permission implementation.

## Story Narrative

**Situation**
Root admins and tenant admins can do similar work, but their authority is not
the same. Some actions are tenant-bound, some are root-only, and some involve
public or private files.

**Goal**
Create the Organization authority map that later protected endpoints, jobs,
export, logo, and screen work must use.

**Decisions Needed**
The mapping must settle who can act, which customer/account context applies,
which records must be checked before access, which actions are denied, and
which logo, export, or integration work must remain blocked or deferred.

**Work That Follows**
Record management, export, logo, search, membership, reference-value, and
screen tasks can now reference the same permission source.

**Evidence Of Success**
A reviewer can open the permission mapping and see:

- who may create, read, update, archive, restore, move, search, upload, export,
  download, cancel, retry, view PINs, delete export copies, and manage
  reference values
- where root authority differs from tenant authority
- which logo work is ready for task breakdown and which export work remains blocked before implementation
- which integration behavior remains deferred from v1
- which object rules later source tasks must prove with allow and deny tests

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Completed permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines root-admin, tenant-admin, public logo reader, feature service, export worker, and logo worker authority. |
| Story packet ledger | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md` | `U-ORG-S002` and `ART-ORG-002` are marked resolved. |
| Source PRD | actual | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Provides root, tenant, public logo, and export authority requirements. |
| Root API contract | actual | `docs/api-contracts/organization-root-admin.md` | Provides planned root-admin route authority. |
| Tenant API contract | actual | `docs/api-contracts/organization-tenant-admin.md` | Provides planned tenant-admin current-context authority. |
| Data dictionary source | actual | `docs/data-dictionary/organization.md` | Provides planned Organization capability and object-rule source. |
