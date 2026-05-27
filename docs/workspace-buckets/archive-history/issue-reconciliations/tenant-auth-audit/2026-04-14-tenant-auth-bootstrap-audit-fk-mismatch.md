# Tenant Auth Bootstrap Audit FK Mismatch

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into the tenant-auth service
> audit seam, Postgres-backed tenant-auth persistence regression, tenant-auth
> audit visibility tests, and the auth-audit-event data dictionary. Keep future
> tenant-auth audit authority in those maintained artifacts rather than this
> historical incident note.

## Summary

- Date found: `2026-04-14`
- User-visible symptom:
  `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/onboarding/restart`
  returned `500 INTERNAL_ERROR`
- Runtime error:
  insert or update on table `auth_audit_events` violated foreign key
  `auth_audit_events_auth_principal_id_fkey`

## Root Cause

Tenant-auth bootstrap auditing wrote the tenant-auth principal ID into
`auth_audit_events.auth_principal_id`.

That shared platform audit column is currently constrained to the root-auth
`auth_principals` table, not the tenant-auth `tenant_auth_principal` table.

The onboarding restart business flow succeeded until the audit write attempted
to persist an incompatible foreign-key reference.

## Why The Feature Loop Missed It

- restart-onboarding behavior was covered in unit and integration tests, but
  those paths used in-memory harnesses rather than the Postgres-backed audit
  table
- tenant-auth audit coverage asserted that an event was emitted, but it did not
  verify the event could be inserted under the live schema constraints
- persistence-backed tests existed for tenant-auth and platform security, but
  not for the exact seam where tenant-auth bootstrap writes into shared
  platform audit storage

## Reconciliation Changes Added

- code fix:
  [src/features/tenantAuth/domain/service.ts](/home/gordon/kanbien/src/features/tenantAuth/domain/service.ts:56)
  no longer writes tenant-auth principal IDs into the root-auth foreign-key
  audit column
- audit expectation refresh:
  [tests/audit/tenantAuth/audit.test.ts](/home/gordon/kanbien/tests/audit/tenantAuth/audit.test.ts:75)
  now matches the shared audit table contract
- persistence-backed regression:
  [tests/integration/tenantAuth/persistence.test.ts](/home/gordon/kanbien/tests/integration/tenantAuth/persistence.test.ts:1)
  now verifies tenant-auth bootstrap audit events persist successfully in
  Postgres without populating the incompatible FK

## Coverage Lesson

When a feature writes through a shared platform seam, the feature loop needs at
least one persistence-backed test that exercises the real storage contract for
that seam.

Behavior-level integration coverage alone is not enough when the seam crosses
feature boundaries or foreign-key domains.

## Follow-Up Watch Items

- if we later want tenant-auth audit rows to carry a principal foreign key, the
  platform audit schema needs an explicit multi-auth-domain design rather than
  ad hoc field reuse
- future auth-domain changes should explicitly classify whether audit identity
  fields are:
  root-auth only, tenant-auth only, polymorphic, or intentionally nullable
