# Auth Login Challenge

## Summary

- Description: Single-use SSH challenge issued after successful password-stage
  login and consumed during second-stage authentication.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_login_challenges`,
  `AuthLoginChallengeRecord`

## Storage Model

- Primary table or durable record: `auth_login_challenges`
- Related durable records: `auth_principals`, `auth_sessions`,
  `auth_audit_events`
- Primary key: `challenge_id`
- Foreign key relationships: `auth_principal_id` references
  `auth_principals.auth_principal_id`

## Capabilities That Rely On This Entity

- Password-stage login issues the challenge
  Source: `src/features/rootAuth/domain/service.ts`
- Complete SSH challenge validates and consumes it
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `challenge_id`
  Type / Shape: `TEXT`
  Description: Stable challenge identifier.
  Constraints / Notes: Primary key. Current service-generated IDs use the
  `chal_` prefix.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Principal that must complete the SSH proof.
  Constraints / Notes: Required foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `purpose`
  Type / Shape: `TEXT`
  Description: Challenge purpose label.
  Constraints / Notes: Required. Current value is `root-login`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `challenge_text`
  Type / Shape: `TEXT`
  Description: Signed challenge payload presented to the client.
  Constraints / Notes: Required. Current format includes `challengeId`,
  `authPrincipalId`, `purpose`, `nonce`, `expiresAt`, and audience.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Expiration time for challenge use.
  Constraints / Notes: Required. Derived from configured challenge TTL.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `used_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Challenge-consumption timestamp.
  Constraints / Notes: `NULL` until the challenge is successfully consumed.
  Single-use behavior depends on this field.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Challenge creation time.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Indexes And Constraints

- `auth_login_challenges_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `challenge_id`.
  Why It Matters: Supports durable lookup of a challenge across requests.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_login_challenges.auth_principal_id -> auth_principals.auth_principal_id`
  Type: `foreign key`
  Definition / Rule: Each challenge belongs to one auth principal.
  Why It Matters: Challenge verification is principal-scoped.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_login_challenges_auth_principal_id`
  Type: `other`
  Definition / Rule: Secondary index on `auth_principal_id`.
  Why It Matters: Supports principal-scoped challenge access patterns.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_login_challenges_expires_at`
  Type: `other`
  Definition / Rule: Secondary index on `expires_at`.
  Why It Matters: Supports expiry-oriented maintenance and query efficiency.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Normalization And Uniqueness Rules

- Rule: Challenge text is generated server-side and includes a nonce and expiry.
  Why It Matters: Prevents clients from supplying or mutating the signed
  payload structure.
  Source: `src/features/rootAuth/domain/service.ts`

## Lifecycle Semantics

- State or lifecycle rule: A challenge is valid only if it exists, is unused,
  and `expires_at` is still in the future.
  Meaning: Expired or already-used challenges remain durable but are not
  accepted for authentication.
  Source: `src/features/rootAuth/domain/service.ts`
- State or lifecycle rule: Successful SSH completion marks the challenge as
  used before creating the session response.
  Meaning: Challenges are single-use across concurrent or repeated requests.
  Source: `src/features/rootAuth/domain/service.ts`

## Mutation Semantics

- Mutation rule: Password-stage login creates a challenge row with `used_at =
  NULL`.
  Effect on stored fields: Establishes a durable pending second-factor proof.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Successful SSH completion sets `used_at` to the consumption
  time.
  Effect on stored fields: The row becomes permanently non-reusable.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: none
  Consumer: n/a
  Allowed read shape: This entity is internal to `rootAuth`.
  Source: `docs/architecture/system-overview.md`

## Migration Compatibility Notes

- Note: Although challenges are transient operational records, they are still
  persisted durably enough to enforce expiry and single-use semantics across
  requests and processes.
  Why It Matters For Rebuild Or Shared Environments: Rebuild-from-spec should
  not replace this with in-memory state if the goal is equivalent security
  behavior.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`

## Related Errors

- `SSH_CHALLENGE_NOT_FOUND`
  Message: We could not find that SSH challenge.
  Field: `challengeId`
  Reason: `not_found`
  When It Happens: SSH completion references a missing challenge ID.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `SSH_CHALLENGE_EXPIRED`
  Message: That SSH challenge has expired.
  Field: `challengeId`
  Reason: `expired`
  When It Happens: Challenge expiry time has passed.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `SSH_CHALLENGE_ALREADY_USED`
  Message: That SSH challenge has already been used.
  Field: `challengeId`
  Reason: `already_used`
  When It Happens: SSH completion tries to reuse a challenge.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `INVALID_SSH_SIGNATURE`
  Message: The SSH signature was not accepted.
  Field: `signature`
  Reason: `invalid_signature`
  When It Happens: Signature verification fails while completing a challenge.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/ssh.ts`

## Notes

- This entity is intentionally durable even though it is short-lived. That
  durability is part of the security model, not an implementation detail.
