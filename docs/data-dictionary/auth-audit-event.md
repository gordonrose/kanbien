# Auth Audit Event

## Summary

- Description: Durable security-visible audit record for auth lifecycle,
  success, failure, abuse, and bootstrap events.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_audit_events`,
  `CreateAuthAuditEventInput`

## Storage Model

- Primary table or durable record: `auth_audit_events`
- Related durable records: `auth_principals`, `root_users`
- Primary key: `event_id`
- Foreign key relationships: Optional `auth_principal_id` reference to
  `auth_principals`; optional `root_user_id` reference to `root_users`

## Capabilities That Rely On This Entity

- Create auth principal
  Source: `src/features/rootAuth/domain/service.ts`
- Bootstrap existing root-user auth
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0004_backfill_root_auth_bootstrap_keys_and_events.sql`
- Password-stage login success and failure
  Source: `src/features/rootAuth/domain/service.ts`
- SSH-stage login success and failure
  Source: `src/features/rootAuth/domain/service.ts`
- Password change
  Source: `src/features/rootAuth/domain/service.ts`
- SSH key add and revoke
  Source: `src/features/rootAuth/domain/service.ts`
- Session revoke and logout
  Source: `src/features/rootAuth/domain/service.ts`
- Auth throttling and lock-down visibility
  Source: `src/lib/security/rootAuthAbuse.ts`,
  `src/features/rootAuth/transport/router.ts`
- Login abuse-state clear-on-success visibility
  Source: `src/lib/security/rootAuthAbuse.ts`,
  `src/features/rootAuth/domain/service.ts`

## Fields

- `event_id`
  Type / Shape: `TEXT`
  Description: Stable audit-event identifier.
  Constraints / Notes: Primary key. Current event IDs use the `evt_` prefix in
  service logic and bootstrap SQL.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT | NULL`
  Description: Related auth principal when known.
  Constraints / Notes: Nullable foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `root_user_id`
  Type / Shape: `UUID | NULL`
  Description: Related root user when known.
  Constraints / Notes: Nullable foreign key to `root_users`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `event_type`
  Type / Shape: `TEXT`
  Description: Auth/security event category.
  Constraints / Notes: Required. Current values include principal creation,
  password-stage and SSH-stage login outcomes, password change, SSH key add and
  revoke, session revoke, login abuse-state clear-on-success, and bootstrap
  migration applied.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `event_outcome`
  Type / Shape: `'success' | 'failure'`
  Description: Event result classification.
  Constraints / Notes: Required. Checked in storage.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ip_address`
  Type / Shape: `TEXT | NULL`
  Description: Request IP when available.
  Constraints / Notes: Nullable. Used for security/audit visibility.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `user_agent`
  Type / Shape: `TEXT | NULL`
  Description: Request user agent when available.
  Constraints / Notes: Nullable. Used for security/audit visibility.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `occurred_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Event occurrence time.
  Constraints / Notes: Required. Caller/service supplies the event time.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Indexes And Constraints

- `auth_audit_events_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `event_id`.
  Why It Matters: Establishes durable event identity for audit storage.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_audit_events.auth_principal_id -> auth_principals.auth_principal_id`
  Type: `foreign key`
  Definition / Rule: Optional principal link when available.
  Why It Matters: Preserves traceability without making anonymous or partial
  auth failures impossible to log.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_audit_events.root_user_id -> root_users.root_user_id`
  Type: `foreign key`
  Definition / Rule: Optional root-user link when available.
  Why It Matters: Preserves cross-feature security visibility.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `event_outcome` check
  Type: `check`
  Definition / Rule: `event_outcome IN ('success', 'failure')`.
  Why It Matters: Keeps outcome classification bounded and queryable.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_audit_events_auth_principal_id`
  Type: `other`
  Definition / Rule: Secondary index on `auth_principal_id`.
  Why It Matters: Supports principal-scoped security review.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_audit_events_root_user_id`
  Type: `other`
  Definition / Rule: Secondary index on `root_user_id`.
  Why It Matters: Supports root-user-scoped compliance and incident review.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Normalization And Uniqueness Rules

- Rule: Audit events are append-only records identified by generated `event_id`
  values.
  Why It Matters: The feature records security-relevant history instead of
  overwriting it.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`

## Lifecycle Semantics

- State or lifecycle rule: Audit events are durable historical records rather
  than mutable business state.
  Meaning: Successes, failures, throttling, and bootstrap operations remain
  visible for review even after the related authentication flow completes.
  Source: `docs/architecture/system-overview.md`,
  `src/features/rootAuth/domain/service.ts`
- State or lifecycle rule: Some events intentionally omit principal and/or
  root-user references.
  Meaning: The system can still audit failed public login attempts before a
  valid identity is resolved.
  Source: `src/features/rootAuth/domain/service.ts`

## Mutation Semantics

- Mutation rule: Service-layer auth actions append a new audit event rather
  than updating prior events.
  Effect on stored fields: Each auth-visible action creates a new durable row
  with its own identifier and occurrence time.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Bootstrap and repair migrations append
  `bootstrap_migration_applied` events for rows they complete.
  Effect on stored fields: Rollout/backfill operations become visible in the
  same durable audit history as runtime auth actions.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0004_backfill_root_auth_bootstrap_keys_and_events.sql`

## Cross-Feature Read Seams

- Exported seam: none
  Consumer: n/a
  Allowed read shape: This entity is currently internal to `rootAuth`, though
  it contains references to both `rootAuth` and `rootUsers` identities.
  Source: `docs/architecture/system-overview.md`

## Migration Compatibility Notes

- Note: Audit events are part of the durable security/compliance record, not
  optional telemetry.
  Why It Matters For Rebuild Or Shared Environments: Rebuild-from-spec should
  preserve audit persistence and bootstrap-event generation rather than
  downgrading them to logs only.
  Source: `docs/architecture/system-overview.md`,
  `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Related Errors

- `AUTH_THROTTLED`
  Message: Too many authentication attempts. Please wait and try again.
  Field: none
  Reason: none
  When It Happens: Public auth middleware or abuse controls throttle
  authentication attempts.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/transport/router.ts`
- `AUTH_LOCKED_DOWN`
  Message: Authentication is temporarily locked due to repeated attempts.
  Please wait and try again.
  Field: none
  Reason: none
  When It Happens: Abuse controls temporarily lock down repeated auth attempts.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/lib/security/rootAuthAbuse.ts`
- `INVALID_CREDENTIALS`
  Message: The supplied credentials were not accepted.
  Field: none
  Reason: none
  When It Happens: Failed auth attempts commonly generate audit events for
  visibility.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`

## Notes

- This page documents the audit entity itself, not every field of every
  business entity mentioned in an event payload.
