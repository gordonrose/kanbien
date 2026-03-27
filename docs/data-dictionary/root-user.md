# Root User

## Summary

- Description: Privileged platform operator account and lifecycle record.
- Owning feature: `rootUsers`
- Primary source tables or records: `root_users`, `RootUserRecord`,
  `RootUserAuthStateRecord`

## Capabilities That Rely On This Entity

- Create root user:
  Source: `src/features/rootUsers/domain/service.ts`
- Get root user by ID:
  Source: `src/features/rootUsers/domain/service.ts`
- Get root user by exact email:
  Source: `src/features/rootUsers/domain/service.ts`
- List root users:
  Source: `src/features/rootUsers/domain/service.ts`
- List active root users:
  Source: `src/features/rootUsers/domain/service.ts`
- List deleted root users:
  Source: `src/features/rootUsers/domain/service.ts`
- Update root user:
  Source: `src/features/rootUsers/domain/service.ts`
- Soft delete root user:
  Source: `src/features/rootUsers/domain/service.ts`
- Remove and anonymize root user:
  Source: `src/features/rootUsers/domain/service.ts`
- Reactivate root user:
  Source: `src/features/rootUsers/domain/service.ts`
- Sign-in eligibility checks from `rootAuth` through the exported auth-state seam:
  Source: `docs/architecture/system-overview.md`, `src/features/rootUsers/authState.ts`

## Fields

- `root_user_id`
  Type / Shape: `UUID`
  Description: Stable primary identifier for the root user.
  Constraints / Notes: Primary key. Used by auth links and sessions.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `email`
  Type / Shape: `TEXT`
  Description: Root user's email address.
  Constraints / Notes: Required. Uniqueness enforced case-insensitively for non-deleted rows. Normalized handling is part of the domain contract.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `first_name`
  Type / Shape: `TEXT | NULL`
  Description: Optional first name.
  Constraints / Notes: Nullable. Searchable by prefix.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `last_name`
  Type / Shape: `TEXT | NULL`
  Description: Optional last name.
  Constraints / Notes: Nullable. Searchable by prefix.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `anonymized`
  Type / Shape: `BOOLEAN`
  Description: Indicates whether the record has been irreversibly anonymized.
  Constraints / Notes: Defaults to `false`. Blocks certain lifecycle operations and sign-in.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`, `src/features/rootUsers/domain/service.ts`
- `status`
  Type / Shape: `'active' | 'inactive'`
  Description: Lifecycle state for the root user.
  Constraints / Notes: Required. Checked in storage. Used in sign-in eligibility and filtering.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp for the row.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last update timestamp for the row.
  Constraints / Notes: Required. Defaults to `NOW()`. Must refresh on successful mutation.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`, `AGENTS.md`
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete timestamp.
  Constraints / Notes: Nullable. Null means visible or active from a deletion standpoint.
  Source: `src/features/rootUsers/persistence/migrations/001_create_root_users.sql`

## Related Errors

- `INVALID_REQUEST`
  Message: Your request could not be accepted because one or more fields are missing or invalid.
  Field: varies
  Reason: varies
  When It Happens: Request validation fails for root-user routes.
  Source: `src/features/rootUsers/contract/errors.ts`, `src/features/rootUsers/transport/router.ts`
- `ROOT_USER_NOT_FOUND`
  Message: We could not find a root user with that ID.
  Field: `rootUserId`
  Reason: varies
  When It Happens: A root user lookup by ID fails.
  Source: `src/features/rootUsers/contract/errors.ts`, `src/features/rootUsers/domain/service.ts`
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
  When It Happens: Create, update, or reactivate would conflict with another active root user email.
  Source: `src/features/rootUsers/contract/errors.ts`, `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_ALREADY_DELETED`
  Message: That root user has already been deleted.
  Field: `rootUserId`
  Reason: `already_deleted`
  When It Happens: Soft delete is attempted for an already deleted row.
  Source: `src/features/rootUsers/contract/errors.ts`, `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_NOT_DELETED`
  Message: That root user is not currently deleted.
  Field: `rootUserId`
  Reason: `not_deleted`
  When It Happens: Reactivation is attempted for a row that is not deleted.
  Source: `src/features/rootUsers/contract/errors.ts`, `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_ALREADY_ANONYMIZED`
  Message: That root user has already been anonymized and cannot be changed in this way.
  Field: `rootUserId`
  Reason: `already_anonymized`
  When It Happens: Delete, remove, or reactivate flows encounter an already anonymized row.
  Source: `src/features/rootUsers/contract/errors.ts`, `src/features/rootUsers/domain/service.ts`
- `ROOT_USER_SIGN_IN_BLOCKED`
  Message: This root user is not allowed to sign in.
  Field: `rootUserId`
  Reason: inferred from lifecycle state
  When It Happens: Auth checks reject inactive, deleted, or anonymized root users.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/rootUserAccess.ts`

## Notes

- `rootUsers` owns lifecycle state. `rootAuth` consumes sign-in eligibility only
  through the exported auth-state seam.
- The `auth_principal_root_user_links` relationship gives each root user at most
  one linked auth principal in the current model.
