# Shared Token Library Specification

## Purpose

Define a small shared platform library for one-time token generation, parsing,
and verification.

This library exists to support future security-sensitive workflows such as:

- email verification
- password reset
- invite acceptance
- first-time account activation if approved later

The library is intentionally not a full feature workflow.

It should provide the cryptographic and token-format foundation that later
features can reuse without re-implementing security-critical token handling.

---

## Scope

This phase includes:

- creation of opaque one-time token material
- a stable token wire format
- hashing of the secret portion for durable storage by caller features
- parsing of presented tokens
- deterministic verification of a presented token against caller-supplied
  stored record metadata
- support for at least these token purposes:
  - `email_verification`
  - `password_reset`

This phase does **not** include:

- token persistence tables
- token repositories
- email sending
- app-link generation
- marking token records used
- retry policy
- user, tenant-admin, principal, or membership state mutation
- HTTP routes
- browser or frontend screens

Those are consuming-feature responsibilities.

---

## Core Concepts

### One-time token

A one-time token is an opaque secret used to authorize one future action.

The token has:

- a stable lookup identifier `tokenId`
- a secret value known only to the holder of the raw token
- a `purpose`
- an expiry time
- caller-owned used-state in durable storage

### Raw token

The raw token is the string delivered to the user.

It should contain:

- `tokenId`
- secret

Recommended first wire format:

- `<tokenId>.<secret>`

The library owns this format.

### Stored token record

The library does not persist token records, but it assumes caller features can
store a record containing at least:

- `tokenId`
- `purpose`
- `secretHash`
- `expiresAt`
- `usedAt`

The raw secret must not be stored durably.

### Token purpose

The purpose identifies what kind of action the token authorizes.

Initial supported values:

- `email_verification`
- `password_reset`

Features may later extend this only through deliberate reviewed change.

### Verification

Verification means deciding whether a presented raw token is acceptable against
one stored token record.

The library must be able to reject tokens deterministically for:

- malformed token format
- token ID mismatch
- purpose mismatch
- already-used record
- expired record
- secret mismatch

Verification is side-effect free.

The caller feature decides whether to mark the token used and what business
action follows.

---

## Recommended Repo Shape

Recommended shared library folder:

`src/lib/tokens/`

Suggested initial files:

- `src/lib/tokens/types.ts`
- `src/lib/tokens/oneTimeToken.ts`
- `src/lib/tokens/index.ts`

This should remain a platform seam under `src/lib/*`, not a feature-local
folder, because multiple future features are expected to reuse it.

---

## Capability Matrix

| Capability | Purpose | Input | Output | Rules | Persistence | Errors | Tests |
|---|---|---|---|---|---|---|---|
| `createOneTimeTokenMaterial` | Mint a new token for later delivery and storage | purpose, ttlSeconds, optional deterministic `now` | `tokenId`, `rawToken`, `secretHash`, `createdAt`, `expiresAt` | must use high-entropy random secret material; TTL must be positive; raw token must be opaque; stored output must not expose the raw secret separately | none directly; caller stores returned hashed material | invalid TTL | valid create, stable expiry, hashed storage output, raw token opacity |
| `parseOneTimeToken` | Parse presented raw token into lookup-ready parts | raw token string | `tokenId` and secret or null | must accept only the approved opaque token format; must reject malformed or multiply-delimited values deterministically | none | malformed token | valid parse, malformed parse rejection |
| `verifyOneTimeTokenAgainstRecord` | Verify a presented token against one stored record | raw token, stored record metadata, optional expected purpose, optional deterministic `now` | stable success or failure result | must check format, token ID, optional purpose, used state, expiry state, and secret hash match; secret comparison must be constant-time; function must be side-effect free | none directly; caller owns used-state mutation | malformed, mismatch, used, expired | valid verification, purpose mismatch, used, expired, secret mismatch |

---

## Data And Security Rules

- raw token secrets must be generated from cryptographically secure random
  bytes
- raw token secrets must never be persisted directly
- caller features should persist only `secretHash`
- token verification must compare secrets in constant time
- verification must be deterministic and side-effect free
- malformed token input must be rejected before secret comparison
- the library must not log raw token secrets
- the library must not infer business meaning beyond the declared purpose
- the library must not mutate persistence state

---

## Caller Interaction Model

The consuming feature is expected to orchestrate the full workflow.

### Issuance flow

1. feature decides a token is needed
2. feature calls `createOneTimeTokenMaterial`
3. feature persists:
   - `tokenId`
   - `purpose`
   - `secretHash`
   - `expiresAt`
   - any feature-owned subject fields
4. feature builds the app link
5. feature sends the email or message

### Redemption flow

1. feature receives presented raw token
2. feature may call `parseOneTimeToken` to get `tokenId`
3. feature loads the stored record
4. feature calls `verifyOneTimeTokenAgainstRecord`
5. if valid:
   - feature marks the record used
   - feature performs the business action
   - feature writes audit records as needed

This separation is intentional.

The token library owns token mechanics.

The feature owns workflow.

---

## Boundary And Ownership Rules

- the token library is a shared platform seam, not a user-facing feature
- it must not import feature-specific domain or persistence types
- consuming features may depend on `src/lib/tokens/*`
- `src/lib/tokens/*` must not depend on consuming features
- link generation, email sending, persistence, and business-state mutation stay
  outside the library

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the repo has a shared token seam under `src/lib/tokens/`
2. token creation returns opaque raw token material and hashed storage material
3. raw secret material is not required for durable persistence
4. parsing accepts only the approved token format
5. verification rejects malformed, used, expired, purpose-mismatched, and
   secret-mismatched tokens deterministically
6. verification uses constant-time secret comparison
7. verification remains side-effect free
8. the library has no route, email, or persistence ownership
9. focused unit and security-relevant edge tests cover the seam

---

## Risks And Open Questions

- whether later token persistence should be feature-local or moved into a
  shared token-record seam
- whether invite and activation flows should reuse the same purpose enum or
  require separate reviewed additions
- how aggressively caller features should audit malformed or repeated token
  redemption attempts
- whether future stateless signed-token use cases should reuse this seam or
  remain separate from stored-record one-time tokens
