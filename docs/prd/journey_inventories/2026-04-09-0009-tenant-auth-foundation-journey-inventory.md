# Tenant Auth Foundation Journey Inventory

## Scope

- Primary PRD:
  [2026-04-09-0009-tenant-auth-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0009-tenant-auth-foundation.md)
- Primary PRD test cases:
  [2026-04-09-0009-tenant-auth-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-09-0009-tenant-auth-foundation-test-cases.md)
- Primary capability matrix:
  [2026-04-09-tenant-auth-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-09-tenant-auth-foundation-capability-matrix-first-draft.csv)
- Adjacent future-extension matrix:
  [2026-04-09-tenant-auth-policy-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-09-tenant-auth-policy-foundation-capability-matrix-first-draft.csv)
- Related blueprint:
  [2026-04-09-tenant-auth-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-09-tenant-auth-foundation.md)

## Intent

Define the first reviewed end-to-end journey inventory for `tenantAuth` so the
feature loop has a durable workflow-level verification plan rather than only
capability-local test cases.

This inventory covers the `tenantAuth` foundation slice itself and records
which adjacent policy/remediation permutations are intentionally deferred to the
later `tenantAuthPolicy` slice.

It also serves as the first concrete example of applying the repo QA coverage
matrix and QA release-gate policy to a real workflow-heavy backend slice.

## QA Coverage Matrix Application

- Coverage matrix guide:
  [qa-coverage-matrix-guide.md](/home/gordon/kanbien/docs/architecture/guides/qa-coverage-matrix-guide.md)
- QA release gate:
  [QA-RELEASE-GATE.md](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)
- Change-class classification for this slice:
  - auth, session, credential, or recovery flow
  - authorization and tenant-isolation sensitive workflow
  - persistence schema and durable workflow change
- Required layers from the matrix:
  - unit
  - integration
  - end-to-end journey
  - security
  - audit
  - persistence-backed verification
- Additional required checks:
  - structured exploratory QA
  - deny-path review
  - migration safety review
- Release-gate expectation for implemented slice:
  - full pass of the required layers above
  - full `Tier 0` and `Tier 1` end-to-end pass before production by default
  - zero flaky blocking-suite tests
  - zero open `critical` and `high` defects in blocking workflow classes

## Journey Scope Summary

This inventory covers multi-step workflows for:

- verified tenant-admin bootstrap into a shared auth principal
- first password setup
- first successful login
- repeat login
- single-tenant auto-selection
- multi-tenant login requiring explicit tenant selection
- logout and post-logout behavior
- deleted-principal denial behavior
- deleted-tenant denial behavior
- negative flows where onboarding, session, or tenant-context ownership rules
  deny progression

This inventory does not yet claim to cover:

- password-policy remediation after stricter tenant policy is introduced
- SSO-only or mixed auth-method transitions
- forgot-password recovery
- MFA enrollment or step-up
- root-admin or support-driven password reset/change for tenant principals
- tenant-user actor types beyond the verified tenant-admin bootstrap source

Those belong to later inventories once their governing PRDs and reviewed test
cases exist.

## Known-Pitfall Research Summary

Focused auth-domain and multi-tenant workflow pitfalls reviewed for this slice:

- onboarding flow accidentally creates a live session before explicit login
- first-time and repeat-login behavior diverge silently
- multi-tenant users are given a stale or implicit active tenant
- tenant selection can be performed for an inaccessible tenant
- logout revokes the session partially, leaving follow-up routes still usable
- no-access or revoked-access users receive misleading authenticated states
- deleted principals can still log in or continue session truthfully
- deleted tenants remain visible or selectable after access once existed
- operator-driven credential changes may later alter first-login versus
  repeat-login posture and therefore must be reviewed explicitly even if
  deferred in this slice
- normalized email rules differ across bootstrap and login paths
- legacy bootstrap state and new post-setup state are not handled distinctly

These pitfalls drive the required journey coverage below.

## State-Dimension Review Table

| Dimension | Classification | Equivalence Classes | Affects Steps | Required Coverage Level | Reason |
| --- | --- | --- | --- | --- | --- |
| Source actor eligibility | behavior-changing | verified active; unverified or inactive or deleted | bootstrap | pairwise | Controls whether principal bootstrap is even legal. |
| Password setup state | behavior-changing | onboarding required; password already set | password setup; login | pairwise | Changes whether the actor can set a password or is told to log in instead. |
| Credential validity | behavior-changing | valid; invalid | login | pairwise | Changes whether login succeeds or returns safe auth failure. |
| Principal lifecycle | behavior-changing | active; deleted or disabled | login; session read; tenant selection; logout | pairwise | Governs whether an existing principal can authenticate or continue using a session. |
| Tenant access count | behavior-changing | zero active contexts; one active context; multiple active contexts | login; session read; tenant selection | higher-order required | Governs whether login fails, auto-selects, or requires chooser flow. |
| Tenant lifecycle | behavior-changing | active; deleted or inactive | login; session read; tenant selection | pairwise | Governs whether previously reachable tenant contexts remain enterable or visible. |
| Active tenant selection state | behavior-changing | auto-selected; selection required with none active; explicit selection complete | login; session read; tenant selection | pairwise | Governs workflow continuity after login. |
| Session validity | behavior-changing | valid; invalid or expired or revoked | session read; tenant list; tenant selection; logout | pairwise | Governs access to all protected tenant-auth routes. |
| Requested tenant ownership | behavior-changing | reachable by current principal; unreachable | tenant selection | pairwise | Governs whether selection mutates session or denies truthfully. |
| Email normalization variance | non-behavior-changing | surrounding whitespace; case variance | bootstrap; login | single-class only | Relevant only insofar as normalized handling is consistent; no separate workflow branch once normalization is correct. |
| Tenant display-card count beyond chooser threshold | non-behavior-changing | two contexts; many contexts | tenant list; tenant selection | excluded | Current workflow behavior depends only on whether selection is required, not on exact count above one. |
| Browser/frontend rendering state | non-behavior-changing | loading; submitting; refreshed | all | excluded | This slice is backend-only and does not claim browser implementation. |
| Credential mutation source | pending-review | self-set in onboarding; root-admin reset/change later | password setup; login | excluded | Deferred until a reviewed operator capability exists for tenant-principal password mutation. |
| Policy remediation state | pending-review | none in this slice; remediation required in future slice | future login/session/remediation | excluded | Deferred to `tenantAuthPolicy` inventory because it materially changes the state machine. |
| Auth method mode | pending-review | password-only in this slice; SSO-only later | login | excluded | Deferred to later auth-policy/auth-provider work. |

## Permutation Threshold For This Inventory

This inventory uses the repo default threshold:

- cover every behavior-changing class at least once
- cover meaningful pairwise interactions across behavior-changing dimensions
- add higher-order combinations where the state machine changes materially

For this slice, higher-order coverage is required specifically where:

- tenant access count interacts with password setup state and login outcome
- tenant access count interacts with session validity and tenant selection
- principal lifecycle interacts with session validity and tenant selection
- tenant lifecycle interacts with tenant access count and tenant selection
- bootstrap eligibility interacts with global login-email ownership

The inventory does not attempt brute-force combinations across all steps.
It follows the actual tenant-auth state machine.

## Step-State Matrix Notes

State relevance by step:

1. bootstrap
   Relevant dimensions:
   source actor eligibility, email normalization, uniqueness collision.
2. password setup
   Relevant dimensions:
   password setup state, bootstrap proof validity.
3. login
   Relevant dimensions:
   credential validity, password setup state, principal lifecycle, tenant
   access count, tenant lifecycle.
4. post-login session read
   Relevant dimensions:
   active tenant selection state, session validity, principal lifecycle,
   tenant access count, tenant lifecycle.
5. tenant selection
   Relevant dimensions:
   session validity, principal lifecycle, tenant access count, tenant
   lifecycle, requested tenant ownership.
6. logout
   Relevant dimensions:
   session validity, principal lifecycle.

Dimensions that no longer affect the outcome after a step is completed should
not continue multiplying later steps.

Example:

- once password setup is complete, the original bootstrap-eligibility state no
  longer branches later session-read or logout behavior
- once the actor is in the multi-tenant selection-required branch, exact
  tenant-count-above-one does not create a distinct workflow class in this
  slice

## Journey Scenarios

### `JY-TENANT-AUTH-001`

- Journey Name:
  verified tenant-admin completes bootstrap, initial password setup, first
  login, and lands in a single auto-selected tenant
- Tier:
  `Tier 0`
- Primary Actor:
  verified active `tenantAdmin`
- Tenant Variation:
  exactly one active tenant context
- Role Variation:
  verified tenant-admin bootstrap source only
- Legacy/Post-Change State:
  new onboarding state
- Trigger:
  actor completes bootstrap proof, sets initial password, then logs in
- Expected Outcome:
  principal is created; password setup succeeds without creating a session;
  subsequent login returns authenticated single-tenant state; current session
  shows the auto-selected tenant
- Related Capability Matrix Rows:
  `createSharedTenantAuthPrincipalFromVerifiedTenantAdmin`,
  `setInitialTenantPassword`,
  `loginTenantPrincipalWithPassword`,
  `readCurrentTenantSession`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-001`,
  `TC-TENANT-AUTH-UNIT-002`,
  `TC-TENANT-AUTH-UNIT-003`,
  `TC-TENANT-AUTH-UNIT-004`,
  `TC-TENANT-AUTH-INT-001`,
  `TC-TENANT-AUTH-INT-002`,
  `TC-TENANT-AUTH-INT-003`
- Suggested Test Path:
  `tests/e2e/tenantAuth/onboarding-and-single-tenant-login.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  proves the core happy path and the rule that password setup and login remain
  separate steps

### `JY-TENANT-AUTH-002`

- Journey Name:
  repeat login for an existing single-tenant principal lands directly in the
  selected tenant without onboarding
- Tier:
  `Tier 0`
- Primary Actor:
  existing authenticated principal
- Tenant Variation:
  exactly one active tenant context
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  post-setup repeat-user state
- Trigger:
  existing principal logs in again with valid credentials
- Expected Outcome:
  login succeeds without onboarding hint; session is created; single tenant is
  auto-selected again deterministically
- Related Capability Matrix Rows:
  `loginTenantPrincipalWithPassword`,
  `readCurrentTenantSession`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-003`,
  `TC-TENANT-AUTH-UNIT-004`,
  `TC-TENANT-AUTH-INT-003`
- Suggested Test Path:
  `tests/e2e/tenantAuth/repeat-single-tenant-login.test.ts`
- Execution Gates:
  affected vertical slice when login/session behavior changes; full `Tier 0`
  production gate
- Notes:
  distinguishes first-time onboarding from repeat login behavior

### `JY-TENANT-AUTH-003`

- Journey Name:
  multi-tenant principal logs in successfully but must select a tenant before
  entering a workspace
- Tier:
  `Tier 0`
- Primary Actor:
  existing principal with more than one active tenant access grant
- Tenant Variation:
  multiple active tenant contexts
- Role Variation:
  shared principal sourced from tenant-admin in multiple tenants
- Legacy/Post-Change State:
  post-setup repeat-user state
- Trigger:
  principal logs in with valid credentials after gaining a second tenant grant
- Expected Outcome:
  login returns authenticated selection-required state; no active tenant is
  set initially; tenant-context list is truthful; explicit selection persists
  the chosen tenant on the session
- Related Capability Matrix Rows:
  `loginTenantPrincipalWithPassword`,
  `readCurrentTenantSession`,
  `listAvailableTenantContexts`,
  `selectActiveTenantContext`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-003`,
  `TC-TENANT-AUTH-UNIT-004`,
  `TC-TENANT-AUTH-UNIT-005`,
  `TC-TENANT-AUTH-UNIT-006`,
  `TC-TENANT-AUTH-INT-004`
- Suggested Test Path:
  `tests/e2e/tenantAuth/multi-tenant-selection-required.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  this is the key tenant-auth state-machine branch for future tenant-side
  authorization work

### `JY-TENANT-AUTH-004`

- Journey Name:
  multi-tenant principal is denied when attempting to select a tenant they do
  not own
- Tier:
  `Tier 0`
- Primary Actor:
  authenticated principal in selection-required state
- Tenant Variation:
  multiple active tenant contexts plus one inaccessible tenant candidate
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  post-setup repeat-user state
- Trigger:
  principal submits a tenant selection for a tenant outside their durable grant
  list
- Expected Outcome:
  selection denies truthfully; current session remains valid; no inaccessible
  tenant becomes active
- Related Capability Matrix Rows:
  `selectActiveTenantContext`,
  `readCurrentTenantSession`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-006`,
  `TC-TENANT-AUTH-UNIT-004`
- Suggested Test Path:
  `tests/e2e/tenantAuth/deny-inaccessible-tenant-selection.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  this is a tenant-isolation and authorization-critical deny path

### `JY-TENANT-AUTH-005`

- Journey Name:
  principal with no active tenant access grant cannot complete login even if
  credentials are valid
- Tier:
  `Tier 0`
- Primary Actor:
  existing principal whose access grants are missing or inactive
- Tenant Variation:
  zero active tenant contexts
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  post-setup repeat-user state with changed access posture
- Trigger:
  principal logs in after all tenant access is removed or inactive
- Expected Outcome:
  login fails truthfully rather than creating a misleading authenticated
  session with no usable tenant context
- Related Capability Matrix Rows:
  `loginTenantPrincipalWithPassword`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-003`
- Suggested Test Path:
  `tests/e2e/tenantAuth/deny-login-with-no-active-tenant-context.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  this closes a common auth hole where identity success is confused with usable
  access

### `JY-TENANT-AUTH-006`

- Journey Name:
  principal who has not completed initial password setup receives onboarding
  required instead of a normal login result
- Tier:
  `Tier 1`
- Primary Actor:
  bootstrapped principal with no durable password yet
- Tenant Variation:
  one active tenant context is sufficient for this class
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  onboarding-not-complete state
- Trigger:
  principal attempts login before setting their initial password
- Expected Outcome:
  login returns onboarding-required state; no authenticated tenant session is
  created
- Related Capability Matrix Rows:
  `setInitialTenantPassword`,
  `loginTenantPrincipalWithPassword`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-002`,
  `TC-TENANT-AUTH-UNIT-003`
- Suggested Test Path:
  `tests/e2e/tenantAuth/onboarding-required-before-password-setup.test.ts`
- Execution Gates:
  affected vertical slice; broader validation; full `Tier 0` and `Tier 1`
  production gate
- Notes:
  keeps the onboarding boundary truthful and prevents partial-account confusion

### `JY-TENANT-AUTH-007`

- Journey Name:
  logout revokes the tenant session and blocks follow-up protected actions
- Tier:
  `Tier 0`
- Primary Actor:
  authenticated principal
- Tenant Variation:
  one active tenant context is sufficient for this class
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  authenticated active-session state
- Trigger:
  principal logs out and then reuses the revoked session on protected routes
- Expected Outcome:
  logout succeeds; subsequent session read fails truthfully; subsequent tenant
  selection is denied
- Related Capability Matrix Rows:
  `logoutTenantSession`,
  `readCurrentTenantSession`,
  `selectActiveTenantContext`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-007`,
  `TC-TENANT-AUTH-UNIT-004`,
  `TC-TENANT-AUTH-UNIT-006`,
  `TC-TENANT-AUTH-INT-005`
- Suggested Test Path:
  `tests/e2e/tenantAuth/logout-revokes-session.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  proves revocation works across the whole protected route family

### `JY-TENANT-AUTH-008`

- Journey Name:
  bootstrap is denied for an unverified or inactive tenant-admin source actor
- Tier:
  `Tier 1`
- Primary Actor:
  attempted onboarding actor without valid bootstrap eligibility
- Tenant Variation:
  not relevant
- Role Variation:
  tenant-admin source actor only
- Legacy/Post-Change State:
  pre-principal bootstrap state
- Trigger:
  bootstrap is attempted with a source actor that is unverified, deleted, or
  inactive
- Expected Outcome:
  no principal or grant is created; denial is truthful and safe
- Related Capability Matrix Rows:
  `createSharedTenantAuthPrincipalFromVerifiedTenantAdmin`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-001`,
  `TC-TENANT-AUTH-INT-001`
- Suggested Test Path:
  `tests/e2e/tenantAuth/deny-bootstrap-for-ineligible-source-actor.test.ts`
- Execution Gates:
  affected vertical slice; broader validation; full `Tier 0` and `Tier 1`
  production gate
- Notes:
  this protects the source-actor boundary between `tenantAdmins` and
  `tenantAuth`

### `JY-TENANT-AUTH-009`

- Journey Name:
  deleted or disabled principal is denied login and cannot continue protected
  tenant-auth workflow truthfully
- Tier:
  `Tier 0`
- Primary Actor:
  previously bootstrapped principal whose principal lifecycle is no longer
  active
- Tenant Variation:
  one active tenant context is sufficient for this class
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  post-setup credential exists but principal lifecycle changed later
- Trigger:
  principal is deleted or disabled and then attempts login or reuse of a
  previously issued session
- Expected Outcome:
  login denies truthfully; protected session-dependent routes also deny if a
  stale session is presented; no deleted/disabled principal continues as a
  normal authenticated actor
- Related Capability Matrix Rows:
  `loginTenantPrincipalWithPassword`,
  `readCurrentTenantSession`,
  `selectActiveTenantContext`,
  `logoutTenantSession`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-003`,
  `TC-TENANT-AUTH-UNIT-004`,
  `TC-TENANT-AUTH-UNIT-006`,
  `TC-TENANT-AUTH-UNIT-007`
- Suggested Test Path:
  `tests/e2e/tenantAuth/deny-deleted-or-disabled-principal.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  this is a lifecycle-critical deny path and should be treated as part of the
  default auth safety posture

### `JY-TENANT-AUTH-010`

- Journey Name:
  deleted or inactive tenant cannot remain enterable or selectable by a
  principal who previously had access
- Tier:
  `Tier 0`
- Primary Actor:
  existing principal whose tenant access once existed but the tenant lifecycle
  changed later
- Tenant Variation:
  one deleted tenant or one deleted tenant within a multi-tenant set
- Role Variation:
  shared principal sourced from tenant-admin
- Legacy/Post-Change State:
  post-setup repeat-user state with changed tenant lifecycle
- Trigger:
  principal logs in or attempts tenant selection after the target tenant is
  deleted or inactive
- Expected Outcome:
  deleted/inactive tenant is not auto-selected, not returned as a valid active
  target, and not accepted by tenant selection; if no active tenant contexts
  remain, login fails truthfully
- Related Capability Matrix Rows:
  `loginTenantPrincipalWithPassword`,
  `readCurrentTenantSession`,
  `listAvailableTenantContexts`,
  `selectActiveTenantContext`
- Related Test Cases:
  `TC-TENANT-AUTH-UNIT-003`,
  `TC-TENANT-AUTH-UNIT-004`,
  `TC-TENANT-AUTH-UNIT-005`,
  `TC-TENANT-AUTH-UNIT-006`
- Suggested Test Path:
  `tests/e2e/tenantAuth/deny-deleted-or-inactive-tenant-context.test.ts`
- Execution Gates:
  affected vertical slice; full `Tier 0` production gate
- Notes:
  this protects truthful tenant visibility and prevents stale tenant-context
  entry after lifecycle change

## Pairwise Coverage Map

Required pairwise interaction classes for this slice:

| Pair | Covered By |
| --- | --- |
| source actor eligibility x email uniqueness collision | `JY-TENANT-AUTH-008` plus unit/integration coverage from `TC-TENANT-AUTH-UNIT-001` |
| password setup state x credential validity | `JY-TENANT-AUTH-001`, `JY-TENANT-AUTH-002`, `JY-TENANT-AUTH-006` |
| credential validity x principal lifecycle | `JY-TENANT-AUTH-002`, `JY-TENANT-AUTH-009` |
| credential validity x tenant access count | `JY-TENANT-AUTH-002`, `JY-TENANT-AUTH-003`, `JY-TENANT-AUTH-005` |
| tenant lifecycle x tenant access count | `JY-TENANT-AUTH-003`, `JY-TENANT-AUTH-005`, `JY-TENANT-AUTH-010` |
| tenant access count x active tenant selection state | `JY-TENANT-AUTH-001`, `JY-TENANT-AUTH-003`, `JY-TENANT-AUTH-010` |
| principal lifecycle x session validity | `JY-TENANT-AUTH-007`, `JY-TENANT-AUTH-009` |
| session validity x requested tenant ownership | `JY-TENANT-AUTH-004`, `JY-TENANT-AUTH-007`, `JY-TENANT-AUTH-010` |
| session validity x logout behavior | `JY-TENANT-AUTH-007` |

## Higher-Order Coverage For This Slice

Required higher-order interactions:

- password setup state x credential validity x tenant access count
  Covered by:
  `JY-TENANT-AUTH-001`, `JY-TENANT-AUTH-003`, `JY-TENANT-AUTH-005`,
  `JY-TENANT-AUTH-006`
- tenant access count x session validity x requested tenant ownership
  Covered by:
  `JY-TENANT-AUTH-003`, `JY-TENANT-AUTH-004`, `JY-TENANT-AUTH-007`,
  `JY-TENANT-AUTH-010`
- principal lifecycle x session validity x tenant selection behavior
  Covered by:
  `JY-TENANT-AUTH-007`, `JY-TENANT-AUTH-009`
- tenant lifecycle x tenant access count x active tenant selection behavior
  Covered by:
  `JY-TENANT-AUTH-005`, `JY-TENANT-AUTH-010`

No additional higher-order combinations are required for this foundation slice
because:

- remediation is out of scope here
- auth-method mode variation is out of scope here
- exact tenant-count-above-one does not change workflow behavior in v1

## Omitted Or Deferred Combinations

Explicitly omitted or deferred from this inventory:

- password-policy remediation combinations
  Deferred to the `tenantAuthPolicy` slice because remediation introduces a
  materially different authenticated-but-blocked workflow.
- SSO-only or mixed auth-method combinations
  Deferred to future auth-policy and provider-management work.
- root-admin or support-driven password reset/change for tenant principals
  Deferred because the tenant-auth foundation slice does not yet define a
  reviewed operator capability for tenant-principal credential mutation.
- exact tenant counts above one
  Treated as equivalent to the "multiple active tenant contexts" class in this
  slice.
- browser rendering and navigation permutations
  Excluded because no frontend is in scope yet.
- actor-type variation beyond tenant-admin bootstrap
  Deferred until future tenant-user and membership slices exist.

## Proposed Executable E2E Seed Set

If this inventory becomes the first implemented `tests/e2e/` slice, start with:

- `JY-TENANT-AUTH-001`
- `JY-TENANT-AUTH-003`
- `JY-TENANT-AUTH-004`
- `JY-TENANT-AUTH-005`
- `JY-TENANT-AUTH-007`
- `JY-TENANT-AUTH-009`
- `JY-TENANT-AUTH-010`

That seed set gives:

- first-time happy path
- multi-tenant selection path
- critical deny path
- no-access deny path
- session revocation proof
- deleted-principal lifecycle denial
- deleted-tenant lifecycle denial

The remaining `Tier 1` scenarios should follow in the same feature family.
