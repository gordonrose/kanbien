# ADR-0017: Add A Shared One-Time Token Library For Feature-Owned Verification Flows

- Status: Accepted
- Date: 2026-04-08
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform is about to add verification and recovery workflows such as:

- email verification
- password reset
- invite acceptance
- first-time account activation if approved later

These workflows all need the same low-level token behavior:

- generate opaque one-time token material
- persist only hashed secret material
- parse presented tokens safely
- verify them against stored record metadata
- reject expired, used, malformed, or mismatched tokens deterministically

If each future feature implements its own token mechanics, the repo risks:

- inconsistent token formats
- replay and expiry bugs
- secret-handling drift
- duplicated security-critical code across features

At the same time, the token primitive is not itself a full product workflow.

Persistence, link generation, email delivery, and post-redemption business
state changes still belong to the feature that needs the token.

The architecture therefore needs a small reusable platform seam without
accidentally creating a hidden auth or email feature under `src/lib/*`.

## Decision

Add a shared one-time token library under:

`src/lib/tokens/`

The shared library owns token mechanics only.

Current rules:

- the seam is platform-owned and reusable across future features
- it may generate opaque one-time token material for reviewed purposes such as:
  - `email_verification`
  - `password_reset`
- it may define and own the stable token wire format
- it may hash the secret portion for caller-owned durable storage
- it may parse presented raw tokens into lookup-ready parts
- it may verify a presented raw token against caller-supplied stored record
  metadata
- verification must be deterministic and side-effect free
- verification must reject:
  - malformed tokens
  - token-ID mismatch
  - purpose mismatch
  - expired records
  - used records
  - secret mismatch
- secret comparison must be constant-time
- the library must not persist records
- the library must not generate app URLs
- the library must not send email
- the library must not mark token records used
- the library must not mutate user, principal, membership, tenant-admin, or
  other business state
- consuming features own:
  - persistence
  - link generation
  - message delivery
  - mark-used mutation
  - audit events
  - business outcome after successful redemption
- `src/lib/tokens/*` must not import feature-specific contract, domain, or
  persistence types
- consuming features may depend on `src/lib/tokens/*`, but the dependency must
  remain one-way

## Consequences

### Positive

- verification and reset flows can share one reviewed token primitive
- token security rules become consistent across features
- future auth or invitation work can reuse the seam without copying
  crypto-sensitive code
- the library stays small enough to review thoroughly
- features keep ownership of workflow meaning and audit policy

### Negative

- future features still need extra plumbing for persistence, link generation,
  and delivery
- some teams may be tempted to push too much workflow logic into the shared
  seam over time
- if later token use cases diverge significantly, the seam may need careful
  extension or a second token model

### Neutral / Follow-up

- later work may define feature-local token record tables or a shared durable
  token-record seam if that becomes justified
- later work may add additional reviewed token purposes
- if the platform later needs stateless signed tokens, that may require a
  separate decision rather than stretching this one-time stored-record seam too
  far
- feature docs, PRDs, and test-case artifacts should keep making the workflow
  split explicit:
  token mechanics in the shared seam, workflow ownership in the consuming
  feature
