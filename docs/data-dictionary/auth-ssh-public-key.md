# Auth SSH Public Key

## Summary

- Description: Registered SSH public key used to prove possession during
  second-stage root authentication.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_ssh_public_keys`,
  `AuthSshPublicKeyRecord`

## Capabilities That Rely On This Entity

- Register SSH public key:
  Source: `src/features/rootAuth/domain/service.ts`
- List SSH public keys:
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke SSH public key:
  Source: `src/features/rootAuth/domain/service.ts`
- Complete SSH challenge using a matching active fingerprint:
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `auth_ssh_public_key_id`
  Type / Shape: `TEXT`
  Description: Stable identifier for the SSH key row.
  Constraints / Notes: Primary key. Generated with `key_` prefix in current service logic.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Owning auth principal for the key.
  Constraints / Notes: Required foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `label`
  Type / Shape: `TEXT`
  Description: Human-readable label for the key.
  Constraints / Notes: Required. Trimmed in current service logic.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `algorithm`
  Type / Shape: `TEXT`
  Description: SSH key algorithm.
  Constraints / Notes: Required. Current phase supports `ssh-ed25519` only.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/ssh.ts`
- `public_key_openssh`
  Type / Shape: `TEXT`
  Description: Canonical OpenSSH-format public key.
  Constraints / Notes: Required. Stored public key only, never private key material.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `fingerprint`
  Type / Shape: `TEXT`
  Description: Fingerprint used for lookup during SSH challenge completion.
  Constraints / Notes: Required. Unique per principal while active and not revoked.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `status`
  Type / Shape: `'active' | 'revoked'`
  Description: Lifecycle state of the SSH key.
  Constraints / Notes: Required. Revoked keys must not authenticate.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `docs/featureDocs/rootAuth-feature.md`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation timestamp.
  Constraints / Notes: Null for active keys. Required with revoked state semantics.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Related Errors

- `UNSUPPORTED_SSH_KEY_ALGORITHM`
  Message: Only ssh-ed25519 public keys are supported in phase 1.
  Field: `publicKey`
  Reason: `unsupported_algorithm`
  When It Happens: Key registration receives an unsupported algorithm.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/ssh.ts`
- `INVALID_SSH_PUBLIC_KEY`
  Message: The SSH public key could not be parsed.
  Field: `publicKey`
  Reason: `invalid_format`
  When It Happens: Key registration receives a malformed key.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/ssh.ts`
- `DUPLICATE_SSH_PUBLIC_KEY`
  Message: That SSH public key is already registered.
  Field: `publicKey`
  Reason: `duplicate_key`
  When It Happens: Key registration would duplicate an existing active fingerprint for the principal.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `SSH_PUBLIC_KEY_NOT_FOUND`
  Message: We could not find that SSH public key.
  Field: `keyId`
  Reason: `not_found`
  When It Happens: Revocation targets a missing or non-owned key.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `INVALID_SSH_SIGNATURE`
  Message: The SSH signature was not accepted.
  Field: `signature`
  Reason: `invalid_signature`
  When It Happens: SSH proof does not verify against the active key.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/ssh.ts`

## Notes

- Bootstrap migrations also seed a default active SSH public key for linked
  auth principals when missing.
