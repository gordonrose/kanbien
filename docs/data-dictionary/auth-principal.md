# Auth Principal

## Summary

- Description: Login identity record owned by `rootAuth` and linked one-to-one
  with a root user in the current phase.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_principals`,
  `AuthPrincipalRecord`, `AuthPrincipalWithRootUserRecord`

## Storage Model

- Primary table or durable record: `auth_principals`
- Related durable records: `auth_principal_root_user_links`,
  `auth_ssh_public_keys`, `auth_login_challenges`, `auth_sessions`,
  `auth_audit_events`
- Primary key: `auth_principal_id`
- Foreign key relationships: Referenced by
  `auth_principal_root_user_links`, `auth_ssh_public_keys`,
  `auth_login_challenges`, `auth_sessions`, and `auth_audit_events`

## Capabilities That Rely On This Entity

- Create root-user auth principal
  Source: `src/features/rootAuth/domain/service.ts`
- Bootstrap existing root-user auth
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0003_repair_root_auth_bootstrap.sql`
- Password-stage login
  Source: `src/features/rootAuth/domain/service.ts`
- Complete SSH challenge
  Source: `src/features/rootAuth/domain/service.ts`
- Change password
  Source: `src/features/rootAuth/domain/service.ts`
- Register SSH public key
  Source: `src/features/rootAuth/domain/service.ts`
- List SSH public keys
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke SSH public key
  Source: `src/features/rootAuth/domain/service.ts`
- List sessions
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke session and logout
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Stable principal identifier.
  Constraints / Notes: Primary key. Current service-generated IDs use the
  `ap_` prefix.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `login_email`
  Type / Shape: `TEXT`
  Description: Stored login email in normalized form.
  Constraints / Notes: Required. Current service stores the same normalized
  value into both `login_email` and `login_email_normalized`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `login_email_normalized`
  Type / Shape: `TEXT`
  Description: Canonical login lookup key.
  Constraints / Notes: Required. Unique across all auth principals. Used for
  login lookup and bootstrap matching.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `password_hash`
  Type / Shape: `TEXT`
  Description: BCrypt-compatible password hash stored in PostgreSQL.
  Constraints / Notes: Required. Plaintext password is never persisted.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `password_changed_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Timestamp of last password set or bootstrap write.
  Constraints / Notes: Populated on principal creation and updated during
  password changes.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `auth_status`
  Type / Shape: `'active' | 'disabled'`
  Description: Auth-lifecycle state for the principal.
  Constraints / Notes: Required. Current active-session lookup requires
  `auth_status = 'active'`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Principal creation time.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful principal mutation time.
  Constraints / Notes: Required. Refreshed on password changes in current
  implementation.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`

## Indexes And Constraints

- `auth_principals_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `auth_principal_id`.
  Why It Matters: Establishes the durable auth identity used across the auth
  subsystem.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `uq_auth_principals_login_email_normalized`
  Type: `unique`
  Definition / Rule: Unique on `login_email_normalized`.
  Why It Matters: Prevents duplicate auth identities for the same canonical
  login email.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_status` check
  Type: `check`
  Definition / Rule: `auth_status IN ('active', 'disabled')`.
  Why It Matters: Keeps auth principal lifecycle state bounded.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Normalization And Uniqueness Rules

- Rule: Login email is trimmed and lowercased before persistence and lookup.
  Why It Matters: Password-stage login and bootstrap matching depend on
  consistent canonical email handling.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- Rule: Normalized login email must be globally unique across auth principals.
  Why It Matters: Prevents ambiguous login resolution.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- Rule: In the current phase, a principal is expected to have exactly one
  linked root user through `auth_principal_root_user_links`.
  Why It Matters: Login, session creation, and audit semantics assume a single
  owning root user.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`

## Lifecycle Semantics

- State or lifecycle rule: Active-session lookup requires `auth_status =
  'active'`.
  Meaning: Disabled principals cannot authenticate through shared session
  middleware even though a dedicated disable capability is not yet exposed.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- State or lifecycle rule: A principal without a root-user link is not a valid
  root-login identity in the current model.
  Meaning: Login and session creation operate on the joined
  principal-plus-root-user record shape.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`

## Mutation Semantics

- Mutation rule: Principal creation hashes the submitted password in SQL and
  persists the normalized login email.
  Effect on stored fields: Writes `password_hash`, sets
  `password_changed_at = NOW()`, `auth_status = 'active'`, and timestamps.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Password change replaces the password hash and updates
  `password_changed_at` and `updated_at`.
  Effect on stored fields: The principal remains the same durable identity
  while credential material rotates.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Bootstrap migrations may create missing principals for
  existing root users.
  Effect on stored fields: Existing `root_users` can be given principals
  without changing the owning root-user identity.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0003_repair_root_auth_bootstrap.sql`

## Cross-Feature Read Seams

- Exported seam: none from this entity to other features today
  Consumer: n/a
  Allowed read shape: `rootAuth` owns this entity internally; other features
  authenticate through shared middleware rather than reading principals
  directly.
  Source: `docs/architecture/system-overview.md`

## Migration Compatibility Notes

- Note: The bootstrap portion of migration `0002_create_root_auth.sql` creates
  principals for pre-existing root users by matching normalized email.
  Why It Matters For Rebuild Or Shared Environments: Rebuilds and repairs must
  preserve both the schema and the rollout/bootstrap behavior, not just the
  table definition.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- Note: Migration `0003_repair_root_auth_bootstrap.sql` exists because the
  original bootstrap logic required a corrective rerun path.
  Why It Matters For Rebuild Or Shared Environments: Shared environments must
  treat bootstrap and repair logic as part of the durable feature contract and
  should not assume the first migration is the complete story.
  Source: `src/features/rootAuth/persistence/migrations/0003_repair_root_auth_bootstrap.sql`
- Note: Migration identity is path-based under the shared runner.
  Why It Matters For Rebuild Or Shared Environments: Applied migration file
  paths should remain stable.
  Source: `docs/architecture/system-overview.md`

## Related Errors

- `AUTH_PRINCIPAL_EMAIL_ALREADY_EXISTS`
  Message: That login email is already registered for root auth.
  Field: `loginEmail`
  Reason: `duplicate_email`
  When It Happens: Creating a principal would duplicate an existing normalized
  login email.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `INVALID_CREDENTIALS`
  Message: The supplied credentials were not accepted.
  Field: none
  Reason: none
  When It Happens: Email or password lookup fails during login, or principal
  linkage/auth prerequisites are missing.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `INVALID_CURRENT_PASSWORD`
  Message: The current password was not accepted.
  Field: `currentPassword`
  Reason: `invalid_current_password`
  When It Happens: Password change uses an incorrect current password.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `INVALID_NEW_PASSWORD`
  Message: The new password does not meet the required policy.
  Field: `newPassword`
  Reason: dynamic
  When It Happens: New password fails password policy checks.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/password.ts`
- `ROOT_USER_NOT_FOUND`
  Message: We could not find that root user.
  Field: `rootUserId`
  Reason: `not_found`
  When It Happens: Creating a principal targets a root user that does not
  exist.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`

## Notes

- The one-to-one relationship between principal and root user is currently
  enforced by the separate link table, not by a foreign key column directly on
  `auth_principals`.
- This page documents the persisted principal contract, including bootstrap
  behavior that must survive rebuild from spec.
