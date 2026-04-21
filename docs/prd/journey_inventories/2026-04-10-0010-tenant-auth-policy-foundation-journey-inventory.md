# Tenant Auth Policy Foundation Journey Inventory

## Metadata

- Scope:
  `tenantAuthPolicy` backend foundation
- PRD:
  [2026-04-09-0010-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0010-tenant-auth-policy-foundation.md)
- PRD test cases:
  [2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md)
- Blueprint:
  [2026-04-09-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-09-tenant-auth-policy-foundation.md)
- Date:
  2026-04-10

## State Dimensions

- tenant count:
  single-tenant / multi-tenant
- policy source:
  system-default / tenant-override
- credential vintage:
  current-policy compliant / legacy pre-tightening credential
- current tenant state:
  already selected / selection required
- remediation state:
  not required / required
- session TTL posture:
  system default / tenant override / shortest-of-many-tenant-overrides

## Coverage Threshold

- all behavior-changing state classes covered
- pairwise interaction covered for:
  tenant count x remediation state
  policy source x credential vintage
  current tenant state x remediation guidance visibility
  tenant count x session TTL posture
- no broader cartesian-product promise is made for this slice

## Journey Cases

- `JY-TENANT-AUTH-POLICY-001`
  Root operator tightens a tenant password policy after a tenant principal has
  already set a previously valid password.
  The next password login succeeds at credential check, returns a
  remediation-gated authenticated tenant session, exposes the tightened
  effective policy, and clears the gate after a compliant password change.

- `JY-TENANT-AUTH-POLICY-002`
  A multi-tenant principal logs in successfully after one tenant has a stricter
  password policy than the one used when the password was originally set.
  Login returns selection-required plus remediation-required truthfully, tenant
  selection remains allowed before remediation guidance is read, and
  remediation guidance becomes tenant-specific once the current tenant is
  established.

- `JY-TENANT-AUTH-POLICY-003`
  A root operator configures a shorter tenant session TTL for one tenant while
  a shared principal can still access multiple tenants.
  The next successful login mints one durable tenant session whose `expiresAt`
  reflects the shortest effective tenant TTL across those accessible tenant
  contexts, while policy reads for each tenant remain tenant-specific.

## Executable Mapping

- `JY-TENANT-AUTH-POLICY-001`
  [root-policy-change-remediation.test.ts](/home/gordon/kanbien/tests/e2e/tenantAuthPolicy/root-policy-change-remediation.test.ts)
- `JY-TENANT-AUTH-POLICY-002`
  [multi-tenant-selection-before-remediation.test.ts](/home/gordon/kanbien/tests/e2e/tenantAuthPolicy/multi-tenant-selection-before-remediation.test.ts)
- `JY-TENANT-AUTH-POLICY-003`
  Deferred to focused unit plus integration coverage for the 2026-04-13
  refinement because no browser/operator workflow changed and the new behavior
  is a session-minting rule inside the existing login journey

## Deferred Scope

- auth-method mode expansion such as `SSO only`
- non-password remediation types
- provider-specific onboarding journeys
