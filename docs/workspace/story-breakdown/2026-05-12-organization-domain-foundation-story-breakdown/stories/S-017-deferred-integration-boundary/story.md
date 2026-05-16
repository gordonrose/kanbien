# Story Breakdown Story: Keep Integration Records Deferred

## Story Detail

- Story ID:
  `S-017`
- Title:
  Keep integration records deferred
- Context:
  This is needed because integration records should remain visible as future scope without entering v1 by accident.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the planning reviewer, I need integration records marked deferred across planning sources.
- Actor / System Perspective:
  planning reviewer
- Outcome:
  Integration records do not appear in active v1 route, search, UI, export, or persistence work.
- Non-goals:
  No integration implementation, no integration export, and no provider setup.

## Story Narrative

**Situation**
Integration records were discussed earlier, but the current first version does
not build them.

**Goal**
The future idea should remain visible without becoming accidental first-version
request, search, export, screen, or record-storage work.

**Decisions Needed**
No new decision is expected. Future integration work must re-enter discovery
before implementation planning.

**Work That Follows**
Task planning can exclude integration work while keeping the no-secrets
boundary recorded for later.

**Evidence Of Success**
Reviewers can confirm integration records are marked deferred and do not appear
as active v1 implementation scope.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Integration data dictionary | actual | `docs/data-dictionary/organization-integration-record.md` | Records future integration scope and no-secrets boundary while deferred. |
| PRD deferral | actual | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | Excludes integration records from active v1 implementation and export. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Marks `organization.integration.*` as deferred with no v1 authority. |
| Future discovery | placeholder | `placeholder: future Organization integration product discovery packet` | Required before integration work can be revived. |
