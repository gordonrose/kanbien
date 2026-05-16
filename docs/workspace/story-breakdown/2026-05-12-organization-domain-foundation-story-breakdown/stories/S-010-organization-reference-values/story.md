# Story Breakdown Story: Manage Reference Values

## Story Detail

- Story ID:
  `S-010`
- Title:
  Manage reference values
- Context:
  This is needed because shared Organization values must remain stable after records use them.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the system, I need root-managed shared values that tenant admins can use safely.
- Actor / System Perspective:
  system
- Outcome:
  Reference values support create, label update, archive, deprecate, replace, tenant use, and used-value retention.
- Non-goals:
  No tenant-admin mutation of system-owned values.

## Story Narrative

**Situation**
Organization records need shared values such as organization type, legal form,
industry category, location type, and relationship type.

**Goal**
Root admins can manage shared values, and tenant admins can use approved values
without making used values disappear.

**Decisions Needed**
No new product choice is expected. Task planning must carry root-only mutation,
tenant use, immediate label updates, archive, deprecate, replace, and used
value retention.

**Work That Follows**
Source work can create catalogue records and the rules for safe value changes.

**Evidence Of Success**
Reviewers can prove tenant admins cannot mutate catalogues, used values remain
understandable, and replacements are explicit.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-reference-value.md` | Defines system-owned reference values, labels, lifecycle, and replacement. |
| Root API contract | actual | `docs/api-contracts/organization-root-admin.md` | Defines root mutation posture. |
| Tenant API contract | actual | `docs/api-contracts/organization-tenant-admin.md` | Defines tenant read/use posture. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines root-only mutation and tenant use authority. |
| Task breakdown | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/stories/S-010-organization-reference-values/task-breakdown.md` | Splits S-010 into isolated persistence, domain, route/auth, proof, and artifact tasks. |
| Feature documentation | actual | `docs/features/organization-reference-values.md` | Summarizes implemented S-010 foundation and remaining deferred work. |
| API/data alignment review | actual | `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md` | Confirms S-004 through S-010 docs align before Task Breakdown. |
