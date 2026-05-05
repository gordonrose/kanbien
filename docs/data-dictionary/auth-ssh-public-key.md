# Auth SSH Public Key

## Summary

- Description: Registered SSH public key used for second-factor proof during
  root-user authentication.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_ssh_public_keys`,
  `AuthSshPublicKeyRecord`

## Storage Model

- Primary table or durable record: `auth_ssh_public_keys`
- Related durable records: `auth_principals`, `auth_audit_events`
- Primary key: `auth_ssh_public_key_id`
- Foreign key relationships: `auth_principal_id` references
  `auth_principals.auth_principal_id`

## Capabilities That Rely On This Entity

- Bootstrap existing root-user auth
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0004_backfill_root_auth_bootstrap_keys_and_events.sql`
- Register SSH public key
  Source: `src/features/rootAuth/domain/service.ts`
- List SSH public keys
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke SSH public key
  Source: `src/features/rootAuth/domain/service.ts`
- Complete SSH challenge using a matching active fingerprint
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `auth_ssh_public_key_id`
  Type / Shape: `TEXT`
  Description: Stable SSH-key record identifier.
  Constraints / Notes: Primary key. Current service-generated IDs use the
  `key_` prefix.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Owning auth principal.
  Constraints / Notes: Required foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `label`
  Type / Shape: `TEXT`
  Description: Human-readable key label.
  Constraints / Notes: Required. Current service trims the submitted label.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `algorithm`
  Type / Shape: `TEXT`
  Description: SSH algorithm of the key.
  Constraints / Notes: Required. Current phase accepts `ssh-ed25519` only.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/ssh.ts`
- `public_key_openssh`
  Type / Shape: `TEXT`
  Description: Canonical OpenSSH public key text.
  Constraints / Notes: Required. Private key material is never stored.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `fingerprint`
  Type / Shape: `TEXT`
  Description: Canonical fingerprint used during challenge completion.
  Constraints / Notes: Required. Duplicate active fingerprints for the same
  principal are prevented by a partial unique index.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `status`
  Type / Shape: `'active' | 'revoked'`
  Description: Key lifecycle state.
  Constraints / Notes: Required. Active authentication lookup also requires
  `revoked_at IS NULL`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Key registration time.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation timestamp.
  Constraints / Notes: `NULL` for active keys. Revoked keys retain history
  rather than being deleted.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Indexes And Constraints

- `auth_ssh_public_keys_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `auth_ssh_public_key_id`.
  Why It Matters: Provides the durable key identity for revocation and audit.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_ssh_public_keys.auth_principal_id -> auth_principals.auth_principal_id`
  Type: `foreign key`
  Definition / Rule: Each key belongs to a valid auth principal.
  Why It Matters: Keeps SSH keys scoped to a single authentication identity.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `uq_auth_ssh_public_keys_active_fingerprint_per_principal`
  Type: `partial unique`
  Definition / Rule: Unique on `(auth_principal_id, fingerprint)` where
  `status = 'active' AND revoked_at IS NULL`.
  Why It Matters: Allows historical revoked duplicates while preventing active
  duplicate keys for a single principal.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `status` check
  Type: `check`
  Definition / Rule: `status IN ('active', 'revoked')`.
  Why It Matters: Keeps key lifecycle state bounded.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Normalization And Uniqueness Rules

- Rule: Submitted public keys are parsed into a canonical OpenSSH form before
  storage.
  Why It Matters: Fingerprint generation and duplicate detection must be stable
  across semantically equivalent input strings.
  Source: `src/features/rootAuth/domain/ssh.ts`,
  `src/features/rootAuth/domain/service.ts`
- Rule: Only active, non-revoked keys participate in duplicate detection.
  Why It Matters: Historical revoked keys remain durable without blocking
  future re-registration semantics.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`

## Lifecycle Semantics

- State or lifecycle rule: Login completion only accepts keys with
  `status = 'active'` and `revoked_at IS NULL`.
  Meaning: Revoked keys remain stored for audit/history but cannot satisfy SSH
  proof.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- State or lifecycle rule: Key listing returns both active and revoked keys in
  descending creation order.
  Meaning: The UI or caller can show key history without reading private key
  material.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`

## Mutation Semantics

- Mutation rule: Key registration parses the input, fingerprints it, trims the
  label, and inserts the canonical public key.
  Effect on stored fields: New rows start as `status = 'active'` with
  `revoked_at = NULL`.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Revocation updates `status = 'revoked'` and sets `revoked_at`
  with `COALESCE` semantics.
  Effect on stored fields: First revocation stamps the row; repeated writes do
  not move the original revocation timestamp if the row is still targeted.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Bootstrap migrations may insert a default `bootstrap` key for
  principals that do not yet have the configured fingerprint.
  Effect on stored fields: Existing root users can immediately complete the SSH
  stage after rollout, assuming the configured public key matches their private
  key.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0004_backfill_root_auth_bootstrap_keys_and_events.sql`

## Cross-Feature Read Seams

- Exported seam: none
  Consumer: n/a
  Allowed read shape: This entity remains internal to `rootAuth`; protected
  callers use route-level summaries rather than cross-feature direct reads.
  Source: `docs/architecture/system-overview.md`

## Migration Compatibility Notes

- Note: Bootstrap key creation is part of the feature contract, not just the
  table definition.
  Why It Matters For Rebuild Or Shared Environments: Rebuild-from-spec must
  preserve rollout behavior for existing root users, including idempotent key
  backfill.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/migrations/0004_backfill_root_auth_bootstrap_keys_and_events.sql`

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
- Privacy / PII relevance: yes: sensitive operational metadata may reveal actor or access context
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Auth SSH Public Key is documented as owned by `rootAuth` with source record(s) `auth_ssh_public_keys`, `AuthSshPublicKeyRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `UNSUPPORTED_SSH_KEY_ALGORITHM`
  Message: Only ssh-ed25519 public keys are supported in phase 1.
  Field: `publicKey`
  Reason: `unsupported_algorithm`
  When It Happens: Key registration receives an unsupported algorithm.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/ssh.ts`
- `INVALID_SSH_PUBLIC_KEY`
  Message: The SSH public key could not be parsed.
  Field: `publicKey`
  Reason: `invalid_format`
  When It Happens: Key registration receives a malformed key.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/ssh.ts`
- `DUPLICATE_SSH_PUBLIC_KEY`
  Message: That SSH public key is already registered.
  Field: `publicKey`
  Reason: `duplicate_key`
  When It Happens: Key registration would duplicate an existing active
  fingerprint for the principal.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `SSH_PUBLIC_KEY_NOT_FOUND`
  Message: We could not find that SSH public key.
  Field: `keyId`
  Reason: `not_found`
  When It Happens: Revocation targets a missing or non-owned key in the current
  implementation.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `INVALID_SSH_SIGNATURE`
  Message: The SSH signature was not accepted.
  Field: `signature`
  Reason: `invalid_signature`
  When It Happens: SSH proof does not verify against the active key.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/ssh.ts`

## Notes

- The PRD describes revocation as ideally idempotent, but the current route and
  service behavior still report not found when the targeted owned key row cannot
  be updated. This page documents the persisted/current contract rather than the
  aspirational one.
