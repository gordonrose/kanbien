# Tenant Admin Auth-Ready Foundation Capability Matrix First Draft Notes

## Generated Artifact

- Matrix:
  [2026-04-08-tenant-admin-auth-ready-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-tenant-admin-auth-ready-foundation-capability-matrix-first-draft.csv)

## Why This Refresh Exists

The earlier `2026-04-07` tenant-admin draft captured a pre-token and pre-email
platform state.

Since then the repo has added:

- the shared one-time token seam in ADR-0017
- the `notificationDelivery` feature in ADR-0018
- explicit build-from-spec and close-out guardrails that make shared-seam
  dependencies easier to model honestly

That means the old tenant-admin draft is no longer current enough for planning
the next slice.

## Direction Captured In This Refresh

- `tenantAdmins` remains a root-managed feature in the next slice.
- `tenantAdmin` is still a durable tenant-owned actor record, not yet a full
  tenant-auth principal.
- the next safe slice should become `auth-ready`, not `fully authenticated`
- the matrix now captures:
  - durable tenant-admin lifecycle
  - verification-ready state on the tenant-admin row
  - operator-triggered verification send
  - operator-triggered verification resend
  - public verification-token redemption
- this refresh intentionally does **not** yet model:
  - tenant-admin login/session issuance
  - shared principal creation
  - tenant memberships
  - tenant role assignment
  - password-reset execution
  - tenant-admin-managed creation of memberships or tenant users

## Main Model Shift

The earlier draft treated `tenantAdmin` mostly as a durable placeholder row.

This refresh treats it as:

- a durable tenant-owned admin actor record
- with verification-ready lifecycle fields
- and feature-owned verification workflows
- while still deferring the larger shared-principal and tenant-auth model

That is a better fit for the repo's current platform state because the platform
now has the reusable seams needed to support real verification flows without
pretending the full auth architecture is already settled.

## Current Recommended Next Slice

The next `tenantAdmins` slice should likely cover:

- create
- exact visible read
- visible list
- profile update
- send verification email
- resend verification email
- redeem verification token
- soft delete
- reactivate

This is intentionally smaller than the older lifecycle-heavy draft in one way
and broader in another:

- smaller because explicit deleted-read and deleted-list surfaces are not
  required for the next safe auth-ready slice
- broader because verification workflows now matter more than extra deleted-row
  operator surfaces

## Feature-Loop Boundary

This refresh should now be read as the first of **two** related but separate
feature loops.

### Loop 1: `tenantAdmins` auth-ready foundation

This loop owns:

- the durable tenant-admin actor/profile record
- root-managed lifecycle
- verification-ready state
- verification send and resend
- verification-token redemption

This loop does **not** own:

- password creation
- login
- session issuance
- tenant selection
- shared principal creation

### Loop 2: shared tenant-auth foundation

This later loop should own:

- shared non-root auth principal
- credential ownership
- initial password set after verification
- login
- session issuance
- tenant selection and current-tenant resolution
- linkage from principal to tenant-scoped actor/profile or membership

This split is important because it preserves the repo's intended architecture:

- authentication remains its own concern
- tenant-scoped actor/profile records remain separate
- tenant context is resolved after authentication rather than being baked into
  the authenticating identity record itself

## Verification Ownership Split

This refresh makes the seam ownership explicit:

- `tenantAdmins` owns:
  - tenant-admin eligibility
  - verification workflow meaning
  - durable verification-state fields
  - tenant-admin token subject ownership
- shared token seam owns:
  - token generation
  - token parsing
  - token verification mechanics
- `notificationDelivery` owns:
  - email provider integration
  - durable outbound email metadata
  - durable attempt history

This avoids accidentally pushing too much business workflow into either shared
seam.

## Recommended Tenant Admin Verification Fields

The refreshed matrix assumes the tenant-admin row will likely need at least:

- `emailVerificationStatus`
- `emailVerifiedAt`
- `lastVerificationEmailRequestedAt`

And likely later:

- `lastVerificationEmailRequestedAt`
- lightweight verification-send counters or supersession metadata if justified

The exact final field set should be confirmed in the PRD and persistence model,
but the capability matrix now assumes verification is durable feature-owned
state rather than something inferred only from token or email history.

## Verification-State Decisions Now Locked In

- `emailVerificationStatus` should stay a small enum in this slice:
  - `pending`
  - `verified`
- email change for an already verified tenant-admin must revoke prior
  verification trust by returning the row to:
  - `emailVerificationStatus = pending`
  - `emailVerifiedAt = null`
- soft delete should invalidate active verification tokens immediately
- reactivation should restore the row to:
  - visible
  - `emailVerificationStatus = pending`
  - `emailVerifiedAt = null`
- `lastVerificationEmailRequestedAt` should be stamped on the tenant-admin row
  as a convenience summary field
- verification send and resend should use the shared
  `authenticated-sensitive` rate-limit posture

These choices keep the first slice small while making reverification and
operator follow-up explicit.

## Password Reset Position

The shared token and email tooling now makes password reset feasible later, but
this refresh does **not** put password-reset execution into the next
tenant-admin slice.

Reason:

- password ownership is still entangled with the not-yet-settled shared
  principal and tenant-auth model
- verification is the cleaner first auth-ready move
- adding reset too early would risk making `tenantAdmins` behave like the final
  tenant-auth feature before that architecture is agreed

So the current recommendation is:

- verification now
- initial password set later in the shared tenant-auth loop
- forgot-password reset after credential ownership and session issuance are
  settled in that shared auth model

## Remaining Questions To Review Later

- whether explicit deleted-read and deleted-list routes should be deferred from
  the next slice to keep auth-readiness scope tighter

## Recommended Reading Of The Current State

The safest framing now is:

- `tenantAdmins` is becoming the first tenant-owned admin actor record with
  real verification-ready workflow
- it is still **not** yet the full tenant-auth principal and membership model
- the new shared token and email seams should be used to support the workflow,
  not to collapse the bigger auth architecture prematurely
- the next `tenantAdmins` work and the later shared tenant-auth work should be
  planned and delivered as separate loops

## Follow-Up Recommendation

The next artifact that should be refreshed after this matrix is:

- [2026-04-07-0006-tenant-admins-backend-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-07-0006-tenant-admins-backend-foundation.md)

That PRD still reflects the older pre-token and pre-email framing and should
now be updated to match the auth-ready direction captured here.
