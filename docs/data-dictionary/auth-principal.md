# Auth Principal

## Summary

- Description: Login identity record linked to exactly one root user.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_principals`,
  `AuthPrincipalRecord`, `AuthPrincipalWithRootUserRecord`

## Capabilities That Rely On This Entity

- Create root-user auth principal:
  Source: `src/features/rootAuth/domain/service.ts`
- Password-stage login:
  Source: `src/features/rootAuth/domain/service.ts`
- Complete SSH challenge:
  Source: `src/features/rootAuth/domain/service.ts`
- Change password:
  Source: `src/features/rootAuth/domain/service.ts`
- Register SSH public key:
  Source: `src/features/rootAuth/domain/service.ts`
- List SSH public keys:
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke SSH public key:
  Source: `src/features/rootAuth/domain/service.ts`
- List sessions:
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke session and logout:
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Stable primary identifier for the auth principal.
  Constraints / Notes: Primary key. Generated with `ap_` prefix in current service logic.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `login_email`
  Type / Shape: `TEXT`
  Description: Original stored login email value.
  Constraints / Notes: Required. Created from normalized input.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `login_email_normalized`
  Type / Shape: `TEXT`
  Description: Canonical normalized login email used for lookup and uniqueness.
  Constraints / Notes: Required. Unique index. Lowercased and trimmed before storage.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `password_hash`
  Type / Shape: `TEXT`
  Description: Stored password hash.
  Constraints / Notes: Required. Password plaintext is not stored.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `password_changed_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Timestamp of the last password change.
  Constraints / Notes: Nullable. Updated when password is changed or bootstrap is applied.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_status`
  Type / Shape: `'active' | 'disabled'`
  Description: Authentication lifecycle state for the principal.
  Constraints / Notes: Required. Checked in storage. Present in schema even if current flows do not expose disable behavior yet.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp for the auth principal.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last update timestamp for the auth principal.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Related Errors

- `AUTH_PRINCIPAL_EMAIL_ALREADY_EXISTS`
  Message: That login email is already registered for root auth.
  Field: `loginEmail`
  Reason: `duplicate_email`
  When It Happens: Creating an auth principal would duplicate an existing normalized login email.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `INVALID_CREDENTIALS`
  Message: The supplied credentials were not accepted.
  Field: none
  Reason: none
  When It Happens: Email or password lookup fails during login, or principal-linked auth prerequisites are missing.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `INVALID_CURRENT_PASSWORD`
  Message: The current password was not accepted.
  Field: `currentPassword`
  Reason: `invalid_current_password`
  When It Happens: Password change uses an incorrect current password.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `INVALID_NEW_PASSWORD`
  Message: The new password does not meet the required policy.
  Field: `newPassword`
  Reason: dynamic
  When It Happens: New password fails password policy checks.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/password.ts`
- `ROOT_USER_NOT_FOUND`
  Message: We could not find that root user.
  Field: `rootUserId`
  Reason: `not_found`
  When It Happens: Creating a principal targets a root user that does not exist.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`

## Notes

- Relationship: `auth_principal_root_user_links` enforces one auth principal per
  root user and one root user per auth principal in the current model.
- Architecture assigns auth principals to `rootAuth`, not `rootUsers`.
