# Token Library Capability Matrix First Draft Notes

## Generated Artifact

- Matrix:
  [2026-04-08-token-library-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-token-library-capability-matrix-first-draft.csv)

## Direction Captured In This Draft

- `tokens` is a shared platform seam, not a user-facing feature.
- It does not own routes, persistence, email delivery, or redemption workflow.
- It exists to support later:
  - email verification
  - password reset
  - invite and activation links if approved later

## Capability Set In Scope

- `createOneTimeTokenMaterial`
- `parseOneTimeToken`
- `verifyOneTimeTokenAgainstRecord`

These are intentionally the library-only capabilities.

They do **not** include:

- persisting token records
- generating app URLs
- sending email
- marking a token record used
- updating user, tenant-admin, or principal state after redemption

Those later steps belong to the consuming feature.

## Security Decisions Captured

- raw tokens are opaque one-time secrets for delivery only
- only hashed secret material should be persisted durably
- verification must stay side-effect free
- verification must reject:
  - malformed tokens
  - used tokens
  - expired tokens
  - purpose mismatch
  - secret mismatch
- secret comparison should be constant-time

## Initial Purpose Set

The first purpose values assumed by the draft are:

- `email_verification`
- `password_reset`

This keeps the library aligned with the likely next auth flows without making
it email-transport-aware.

## Boundary Decision

The capability boundary is `shared`.

Reason:

- this is a platform seam intended for reuse by multiple future features
- it is not root-only behavior
- it is not itself a tenant-scoped runtime permission surface
- it should remain feature-agnostic and workflow-agnostic

## Main Constraint

This draft deliberately avoids turning the token library into a hidden auth or
email feature.

The library should answer only:

- how to mint opaque one-time token material safely
- how to parse it safely
- how to verify it safely against stored record metadata

## Likely Next Feature Work After This

Once this seam exists, later features can build:

- token persistence records
- email sending capability
- email verification flow
- password reset flow

without re-implementing token crypto and replay checks in each feature.
