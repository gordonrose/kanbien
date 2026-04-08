# Shared Token Library Foundation Implementation Blueprint

## Summary

- Feature:
  shared platform seam under `src/lib/tokens/`
- Capability:
  one-time token material creation, parsing, and verification for
  feature-owned verification and recovery workflows
- Scope:
  backend shared-library seam only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-08-token-library-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-token-library-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-08-token-library-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-token-library-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-08-0007-shared-token-library.md](/home/gordon/kanbien/docs/prd/2026-04-08-0007-shared-token-library.md)
- ADR(s):
  [0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md](/home/gordon/kanbien/docs/architecture/adr/0017-add-a-shared-one-time-token-library-for-feature-owned-verification-flows.md)
- PRD test-case doc:
  [2026-04-08-0007-shared-token-library-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-08-0007-shared-token-library-test-cases.md)

## Scope Confirmation

This blueprint is for one coherent shared-seam slice:

- add a reusable platform-owned token seam under `src/lib/tokens/`
- implement reviewed one-time token purposes:
  - `email_verification`
  - `password_reset`
- support token material creation with opaque raw-token output and hashed
  storage material
- support parsing of the approved `<tokenId>.<secret>` wire format
- support deterministic, side-effect-free verification against
  caller-supplied stored record metadata
- keep secret comparison constant-time

This blueprint does **not** include:

- token persistence tables or repositories
- mark-used mutation or invalidation logic
- app-link generation
- email sending
- auth workflow orchestration
- tenant-admin, principal, membership, or invitation state mutation
- HTTP routes or frontend surfaces
- stateless signed-token support

## Frontend Plan

- Route / surface:
  none in this slice
- UI states:
  none in this slice
- Permission visibility behavior:
  none in this slice
- Session / expiry behavior:
  not a session feature; expiry handling is token-record verification logic only
- Browser security considerations:
  none directly because this slice exposes no browser surface

## Backend Plan

- Route(s):
  none in this slice
- Request/response/error contract:
  - exported library API only; no HTTP contract
  - `createOneTimeTokenMaterial` returns:
    - `tokenId`
    - `rawToken`
    - `secretHash`
    - `createdAt`
    - `expiresAt`
  - `parseOneTimeToken` returns parsed token parts or a deterministic parse
    failure result
  - `verifyOneTimeTokenAgainstRecord` returns a deterministic success/failure
    result without mutating caller-owned state
  - malformed token input, invalid TTL, expired record, used record, purpose
    mismatch, token-ID mismatch, and secret mismatch must be distinguishable in
    a stable library-owned result shape
- Feature-local files expected:
  - `src/lib/tokens/index.ts`
  - `src/lib/tokens/types.ts`
  - `src/lib/tokens/oneTimeToken.ts`
  - optional small helper file only if token formatting or hashing logic needs
    isolation without broadening the public surface
- Cross-feature seams:
  - consuming features may import from `src/lib/tokens/*`
  - `src/lib/tokens/*` must not import feature-local contract, domain, or
    persistence types
  - consuming features own durable token records, link generation, delivery,
    audit, and post-redemption business behavior
- Authorization enforcement point:
  not applicable inside this seam; consuming features enforce actor authn/authz
  around token issuance and redemption

## Repo File Layout Plan

- add a new shared seam under `src/lib/tokens/`
- keep the public seam narrow through `index.ts`
- keep implementation logic concentrated in `oneTimeToken.ts`
- express caller-facing record requirements as seam-safe library types in
  `types.ts`, not feature-shaped interfaces
- avoid introducing `src/features/*` ownership for this slice because the ADR
  classifies it as a reusable platform seam

## Integration Wiring Plan

- no router mounting
- no feature registration in `src/routes/v1/index.ts`
- no integration wiring under `src/features/*`
- consuming features should be able to depend on the seam through exported
  library functions only
- implementation should keep the seam small enough that future auth or
  invitation features do not need adapter wrappers just to use the core token
  mechanics

## Persistence Plan

- Entities / rows affected:
  none in this slice
- Migration changes:
  none in this slice
- Index or uniqueness changes:
  none in this slice
- Search/filter implications:
  none in this slice
- Compatibility notes:
  - this seam assumes caller features can persist at least:
    - `tokenId`
    - `purpose`
    - `secretHash`
    - `expiresAt`
    - `usedAt`
  - implementation must not hard-code a specific table or repository model
  - future durable token-record storage requires a separate feature loop or a
    reviewed extension of a consuming feature

## Security And Boundary Plan

- use cryptographically secure random bytes for raw secret generation
- persistable output must expose only `secretHash`, never the raw secret
  separately from the opaque raw token
- keep the raw token format owned by the seam and stable as
  `<tokenId>.<secret>`
- reject malformed tokens before secret comparison
- use constant-time comparison for secret-hash verification
- keep verification deterministic and side-effect free
- do not log raw tokens or raw secret material
- do not embed tenant-context, actor-type, or workflow-state assumptions into
  the seam
- do not stretch the seam into stateless signed-token support in this slice

## Verification Plan

- Unit:
  - `TC-TOKENS-UNIT-001`
  - `TC-TOKENS-UNIT-002`
  - `TC-TOKENS-UNIT-003`
  - `TC-TOKENS-UNIT-004`
  - `TC-TOKENS-EDGE-001`
  - `TC-TOKENS-EDGE-002`
- Integration:
  - `TC-TOKENS-INT-001`
  - `TC-TOKENS-EDGE-003`
  - implement with a minimal fake caller fixture rather than a real product
    feature so the seam stays workflow-agnostic
- Security:
  - `TC-TOKENS-SEC-001`
  - `TC-TOKENS-SEC-002`
  - `TC-TOKENS-SEC-003`
  - `TC-TOKENS-SEC-004`
- Audit:
  - `TC-TOKENS-AUD-001`
  - preserve the architecture boundary by asserting the seam does not take
    direct audit ownership
- Edge:
  - expiry-boundary checks with deterministic `now`
  - malformed token-shape checks
  - cross-purpose behavior without wire-format drift
- Frontend:
  none in this slice
- Persistence-backed:
  none in this slice

## Documentation Plan

- PRD updates:
  refresh only if implementation reveals a seam-shape mismatch; otherwise keep
  the PRD stable
- PRD test-case updates:
  keep the active `TC-TOKENS-*` inventory aligned with executable tests;
  implementation must not invent undocumented token IDs
- Feature docs:
  no `docs/featureDocs/` entry required because this is not a user-facing
  feature
- Runbook:
  none in this slice
- Privacy note:
  none yet; later email or account-recovery features may require one
- Standards review:
  required because this is a shared platform seam and a security-sensitive
  primitive; implementation close-out should include a standards-compliance
  check focused on auth/crypto boundary discipline
- Repo health review:
  recommended after implementation because this seam will become a reusable
  dependency surface

## Source-Independent Artifact Follow-Through

- update
  [system-overview.md](/home/gordon/kanbien/docs/architecture/system-overview.md)
  when the seam exists in code so the shared-platform layer description stays
  current
- update architecture guidance only if implementation changes guardrails beyond
  what ADR-0017 already states
- no API contract, OpenAPI, Postman, permission-mapping, or data-dictionary
  updates are required in this slice because there is no route, durable entity,
  or authz capability catalog change

## Build Notes And Blockers

- the main implementation risk is seam creep: pushing persistence, link
  generation, or workflow semantics into `src/lib/tokens/*`
- keep exported types generic enough for future auth and invitation features,
  but not so abstract that the first implementation becomes vague
- if implementation discovers a real need for stateless signed tokens or shared
  durable token-record ownership, stop and take that through a separate design
  decision rather than expanding this slice silently
