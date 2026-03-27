# Auth Login Challenge

## Summary

- Description: Single-use SSH challenge issued after password-stage login and
  consumed during second-stage authentication.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_login_challenges`,
  `AuthLoginChallengeRecord`

## Capabilities That Rely On This Entity

- Password-stage login issues the challenge:
  Source: `src/features/rootAuth/domain/service.ts`
- Complete SSH challenge validates and consumes it:
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `challenge_id`
  Type / Shape: `TEXT`
  Description: Stable challenge identifier.
  Constraints / Notes: Primary key. Generated with `chal_` prefix in current service logic.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Auth principal that must complete the challenge.
  Constraints / Notes: Required foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `purpose`
  Type / Shape: `TEXT`
  Description: Challenge purpose label.
  Constraints / Notes: Required. Current value is `root-login`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `challenge_text`
  Type / Shape: `TEXT`
  Description: Signed challenge payload presented to the client.
  Constraints / Notes: Required. Includes challenge ID, auth principal ID, nonce, expiry, and audience.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time after which the challenge cannot be used.
  Constraints / Notes: Required. Derived from configured challenge TTL.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `used_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Timestamp marking the challenge as consumed.
  Constraints / Notes: Null until successful use. Single-use semantics depend on this field.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Related Errors

- `SSH_CHALLENGE_NOT_FOUND`
  Message: We could not find that SSH challenge.
  Field: `challengeId`
  Reason: `not_found`
  When It Happens: SSH completion references a missing challenge ID.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `SSH_CHALLENGE_EXPIRED`
  Message: That SSH challenge has expired.
  Field: `challengeId`
  Reason: `expired`
  When It Happens: Challenge expiry time has passed.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `SSH_CHALLENGE_ALREADY_USED`
  Message: That SSH challenge has already been used.
  Field: `challengeId`
  Reason: `already_used`
  When It Happens: SSH completion tries to reuse a challenge.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `INVALID_SSH_SIGNATURE`
  Message: The SSH signature was not accepted.
  Field: `signature`
  Reason: `invalid_signature`
  When It Happens: Signature verification fails while completing a challenge.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/ssh.ts`

## Notes

- Challenges are intentionally transient but still durable enough to enforce
  expiration and single-use behavior correctly across requests.
