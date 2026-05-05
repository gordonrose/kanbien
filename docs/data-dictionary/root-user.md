# Root User

## Summary

- Description: Privileged platform operator account and lifecycle record owned
  by `rootUsers`.
- Owning feature: `rootUsers`
- Primary source tables or records: `root_users`, `RootUserRecord`,
  `RootUserAuthStateRecord`

## Storage Model

- Primary table or durable record: `root_users`
- Related durable records: `auth_principal_root_user_links`,
  `auth_sessions`, `auth_audit_events`, `root_user_role_assignments`,
  `root_role_audit_events`
- Primary key: `root_user_id`
- Foreign key relationships: Referenced by `auth_principal_root_user_links`,
  `auth_sessions`, and `auth_audit_events` from `rootAuth`; referenced by
  `root_user_role_assignments` and `root_role_audit_events` from `rootRoles`.
  `profile_picture_asset_id` optionally references `assets.asset_id`.

## Capabilities That Rely On This Entity

- Create root user
  Source: `src/features/rootUsers/domain/service.ts`
- Get root user by ID
  Source: `src/features/rootUsers/domain/service.ts`
- Get root user by exact email
  Source: `src/features/rootUsers/domain/service.ts`
- List root users
  Source: `src/features/rootUsers/domain/service.ts`
- List active root users
  Source: `src/features/rootUsers/domain/service.ts`
- List deleted root users
  Source: `src/features/rootUsers/domain/service.ts`
- Update root user
  Source: `src/features/rootUsers/domain/service.ts`
- Soft delete root user
  Source: `src/features/rootUsers/domain/service.ts`
- Remove and anonymize root user
  Source: `src/features/rootUsers/domain/service.ts`
- Reactivate root user
  Source: `src/features/rootUsers/domain/service.ts`
- Root-role assignment and effective-access reads through the exported authz
  seam
  Source: `src/features/rootRoles/domain/service.ts`
- Root-user sign-in eligibility checks through the exported auth-state seam
  Source: `src/features/rootUsers/authState.ts`,
  `src/features/rootAuth/domain/rootUserAccess.ts`

## Fields

- `root_user_id`
  Type / Shape: `UUID`
  Description: Stable root-user identifier.
  Constraints / Notes: Primary key. Remains the durable cross-feature identity.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `email`
  Type / Shape: `TEXT`
  Description: Display-preserved root-user email.
  Constraints / Notes: Required. Stored alongside `normalized_email`; not used
  as the canonical lookup/index column after migration `002`.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`,
  `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`
- `normalized_email`
  Type / Shape: `TEXT`
  Description: Canonical trimmed lowercase email.
  Constraints / Notes: Required after migration `002`. Used for exact lookup,
  uniqueness, and email-prefix search.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- `first_name`
  Type / Shape: `TEXT | NULL`
  Description: Optional first name in display form.
  Constraints / Notes: Nullable. Search uses normalized companion column.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `normalized_first_name`
  Type / Shape: `TEXT | NULL`
  Description: Trimmed lowercase first name for prefix search.
  Constraints / Notes: Nullable. Backfilled in migration `002`.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- `last_name`
  Type / Shape: `TEXT | NULL`
  Description: Optional last name in display form.
  Constraints / Notes: Nullable. Search uses normalized companion column.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `normalized_last_name`
  Type / Shape: `TEXT | NULL`
  Description: Trimmed lowercase last name for prefix search.
  Constraints / Notes: Nullable. Backfilled in migration `002`.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- `profile_picture_asset_id`
  Type / Shape: `UUID | NULL`
  Description: Optional ready image asset linked as the root-user profile
  picture.
  Constraints / Notes: Nullable foreign key to `assets.asset_id`. The service
  validates root scope, private visibility, image kind, readiness, and
  contextual accessibility before linking.
  Source: `src/features/rootUsers/persistence/migrations/0045_add_root_user_profile_picture_asset.sql`,
  `src/features/rootUsers/domain/service.ts`
- `profile_picture_alt_text`
  Type / Shape: `TEXT | NULL`
  Description: Contextual alt text for the linked root-user profile picture.
  Constraints / Notes: Required unless `profile_picture_decorative = true`
  when a profile picture asset is linked.
  Source: `src/features/rootUsers/persistence/migrations/0045_add_root_user_profile_picture_asset.sql`,
  `src/features/rootUsers/domain/service.ts`
- `profile_picture_decorative`
  Type / Shape: `BOOLEAN`
  Description: Explicit decorative posture for the linked root-user profile
  picture.
  Constraints / Notes: Defaults to `false`. Used as the accessibility
  alternative to contextual alt text.
  Source: `src/features/rootUsers/persistence/migrations/0045_add_root_user_profile_picture_asset.sql`
- `anonymized`
  Type / Shape: `BOOLEAN`
  Description: Irreversible anonymization marker.
  Constraints / Notes: Required. Defaults to `false`. Visible reads exclude
  anonymized rows; sign-in is blocked when `true`.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`,
  `src/features/rootAuth/domain/rootUserAccess.ts`
- `status`
  Type / Shape: `'active' | 'inactive'`
  Description: Business lifecycle state of the root user.
  Constraints / Notes: Required. Checked in storage. Used by active-listing and
  sign-in eligibility.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Defaults to `NOW()`. Refreshed on update,
  soft delete, remove, and reactivate.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete marker.
  Constraints / Notes: `NULL` means not soft-deleted. Visible reads exclude
  non-null values. Reactivation clears this field.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`

## Indexes And Constraints

- `root_users_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `root_user_id`.
  Why It Matters: Establishes the durable root-user identity used across
  `rootUsers` and `rootAuth`.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `uq_root_users_email_active`
  Type: `partial unique`
  Definition / Rule: Unique on `normalized_email` where `deleted_at IS NULL`.
  Why It Matters: Prevents duplicate non-deleted email ownership while allowing
  reuse after soft delete or anonymized removal.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`
- `status` check
  Type: `check`
  Definition / Rule: `status IN ('active', 'inactive')`.
  Why It Matters: Keeps lifecycle state bounded to the supported values.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `ix_root_users_email_prefix`
  Type: `other`
  Definition / Rule: Index on `normalized_email`.
  Why It Matters: Supports email-prefix filtering without scanning display-form
  email text.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`
- `ix_root_users_first_name_prefix`
  Type: `other`
  Definition / Rule: Index on `normalized_first_name`.
  Why It Matters: Supports prefix search over normalized first names.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`
- `ix_root_users_last_name_prefix`
  Type: `other`
  Definition / Rule: Index on `normalized_last_name`.
  Why It Matters: Supports prefix search over normalized last names.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`
- `ix_root_users_created_at`, `ix_root_users_updated_at`,
  `ix_root_users_deleted_at`, `ix_root_users_status`, `ix_root_users_anonymized`
  Type: `other`
  Definition / Rule: Secondary indexes on common lifecycle and list/filter
  fields.
  Why It Matters: Supports paginated list and filtered admin views.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `idx_root_users_profile_picture_asset_id`
  Type: `other`
  Definition / Rule: Partial index on `profile_picture_asset_id` where it is
  not null.
  Why It Matters: Supports maintenance and relationship lookups for linked
  profile-picture assets.
  Source: `src/features/rootUsers/persistence/migrations/0045_add_root_user_profile_picture_asset.sql`

## Normalization And Uniqueness Rules

- Rule: Email is trimmed and lowercased into `normalized_email`.
  Why It Matters: Validation, exact lookup, and uniqueness all depend on the
  normalized value rather than the display-preserved `email`.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- Rule: Optional first and last names are normalized into companion lowercase
  columns when present.
  Why It Matters: Prefix search behavior is deterministic and does not depend
  on case or surrounding whitespace.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- Rule: Only non-deleted rows participate in active email uniqueness.
  Why It Matters: Soft-deleted rows do not permanently block email reuse.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`

## Lifecycle Semantics

- State or lifecycle rule: Visible root-user reads exclude rows where
  `deleted_at IS NOT NULL` or `anonymized = true`.
  Meaning: Normal API reads and exact visible lookups only return active or
  inactive non-anonymized rows that are not deleted.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`
- State or lifecycle rule: Soft delete sets `status = 'inactive'` and a
  non-null `deleted_at`.
  Meaning: Deleted rows are durably retained, excluded from normal reads, and
  can be reactivated if not anonymized.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`
- State or lifecycle rule: Remove/anonymize sets `anonymized = true`,
  `status = 'inactive'`, clears profile-picture fields, and sets `deleted_at`
  to a timestamp.
  Meaning: Removal is a stronger lifecycle end state than soft delete and is
  treated as irreversible by the service layer.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`,
  `src/features/rootUsers/domain/service.ts`
- State or lifecycle rule: Root-user authentication requires
  `status = 'active'`, `deleted_at IS NULL`, and `anonymized = false`.
  Meaning: Inactive, deleted, or anonymized root users are blocked from login
  and from active-session lookup.
  Source: `src/features/rootAuth/domain/rootUserAccess.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`

## Mutation Semantics

- Mutation rule: Create writes both display and normalized columns and starts
  with `anonymized = false`, `status = 'active'`, `deleted_at = NULL`.
  Effect on stored fields: New rows are immediately visible and login-eligible
  unless changed later by lifecycle actions.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`
- Mutation rule: Update only applies to non-deleted, non-anonymized rows.
  Effect on stored fields: Changed fields refresh both the display and
  normalized columns and always set `updated_at = NOW()`.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`
- Mutation rule: Soft delete updates `status`, `deleted_at`, and `updated_at`.
  Effect on stored fields: The row remains durable but is excluded from normal
  reads and sign-in.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`
- Mutation rule: Remove rewrites identity-bearing text fields to anonymized
  values and marks the row deleted and anonymized.
  Effect on stored fields: Email and names are replaced with anonymized values,
  normalized companions are updated to match, and future normal mutation flows
  should not operate on the row.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`
- Mutation rule: Reactivate only applies to deleted, non-anonymized rows.
  Effect on stored fields: Sets `status = 'active'`, clears `deleted_at`, and
  refreshes `updated_at`.
  Source: `src/features/rootUsers/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: `createRootUsersAuthStateReader`
  Consumer: `rootAuth`, `rootRoles`
  Allowed read shape: `rootUserId`, `email`, `status`, `anonymized`,
  `deletedAt`
  Source: `src/features/rootUsers/authState.ts`,
  `src/features/rootUsers/domain/types.ts`

## Migration Compatibility Notes

- Note: Migration `002_align_root_users_normalized_columns.sql` is required to
  align the live schema with the repository, which reads and writes
  `normalized_email`, `normalized_first_name`, and `normalized_last_name`.
  Why It Matters For Rebuild Or Shared Environments: Rebuilding from scratch or
  auditing a live schema must include these columns and indexes; migration `001`
  alone is no longer sufficient.
  Source: `src/features/rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql`,
  `src/features/rootUsers/persistence/postgresRepository.ts`
- Note: Migration identity is path-based under the shared runner.
  Why It Matters For Rebuild Or Shared Environments: Applied migration file
  names and relative paths should remain stable; repairs should use new
  migrations rather than renaming existing ones.
  Source: `docs/architecture/system-overview.md`

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Root User is documented as owned by `rootUsers` with source record(s) `root_users`, `RootUserRecord`, `RootUserAuthStateRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | yes | enforced-in-code | Lifecycle and mutation sections in this page; repository/source references cited above | Normal read paths must exclude soft-deleted rows unless an explicit deleted/read capability is documented. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `INVALID_REQUEST`
  Message: Your request could not be accepted because one or more fields are
  missing or invalid.
  Field: varies
  Reason: varies
  When It Happens: Request validation fails for root-user routes.
  Source: `src/features/rootUsers/contract/errors.ts`,
  `src/features/rootUsers/transport/router.ts`
- `ROOT_USER_NOT_FOUND`
  Message: We could not find a root user with that ID.
  Field: `rootUserId`
  Reason: varies
  When It Happens: A root-user lookup by ID fails.
  Source: `src/features/rootUsers/contract/errors.ts`,
  `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_NOT_FOUND`
  Message: We could not find a root user with that email address.
  Field: `email`
  Reason: not explicit
  When It Happens: Exact email lookup fails.
  Source: `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_EMAIL_ALREADY_EXISTS`
  Message: That email address is already in use by another active root user.
  Field: `email`
  Reason: `duplicate_active_email`
  When It Happens: Create, update, or reactivate would conflict with another
  non-deleted root-user email.
  Source: `src/features/rootUsers/contract/errors.ts`,
  `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_ALREADY_DELETED`
  Message: That root user has already been deleted.
  Field: `rootUserId`
  Reason: `already_deleted`
  When It Happens: Soft delete is attempted for an already deleted row.
  Source: `src/features/rootUsers/contract/errors.ts`,
  `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_NOT_DELETED`
  Message: That root user is not currently deleted.
  Field: `rootUserId`
  Reason: `not_deleted`
  When It Happens: Reactivation is attempted for a row that is not deleted.
  Source: `src/features/rootUsers/contract/errors.ts`,
  `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_ALREADY_ANONYMIZED`
  Message: That root user has already been anonymized and cannot be changed in
  this way.
  Field: `rootUserId`
  Reason: `already_anonymized`
  When It Happens: Delete, remove, or reactivate flows encounter an already
  anonymized row.
  Source: `src/features/rootUsers/contract/errors.ts`,
  `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_SIGN_IN_BLOCKED`
  Message: This root user is not allowed to sign in.
  Field: `rootUserId`
  Reason: inferred from lifecycle state
  When It Happens: Auth checks reject inactive, deleted, or anonymized root
  users.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/rootUserAccess.ts`

## Notes

- `rootUsers` owns lifecycle state for the entity. `rootAuth` may authenticate
  only through the exported auth-state seam and active-session join checks.
- This page is intended to stand on its own for rebuild and compliance review;
  the source references are supporting evidence, not the sole definition of the
  persistence contract.
