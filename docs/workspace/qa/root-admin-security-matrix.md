# Root Admin Security Matrix

Date: 2026-05-01

## Purpose

This matrix records the current root-admin permission/state closure work for
mounted protected API route families. It is intentionally compact: detailed
capability semantics remain in the feature PRD test cases, route source, and
security suites.

## Matrix Proof

Executable proof:

- `tests/security/rootAdmin/permissionMatrix.test.ts`

The matrix test uses the mounted root-auth integration harness and feature
helpers, then proves a valid authenticated root operator with no effective
capabilities receives `403 FORBIDDEN` on mapped protected routes.

Covered protected route families:

- `root-auth`
- `root-users`
- `tenants`
- `tenant-admins`
- `root-roles`
- root-role assignment routes mounted under `/v1/root-users`

Covered security dimensions:

- authenticated actor with missing route capability
- route-family capability mapping
- representative active object routes
- representative lifecycle routes:
  - root-user delete/remove/reactivate
  - tenant delete/reactivate/remove/deleted reads
  - tenant-admin delete/reactivate/verification/onboarding routes
  - root-role deactivate/reactivate
  - root-role assignment assign/unassign/replace/effective-permission read
- public routes remain out of this protected-route matrix and stay governed by
  their feature-specific security suites

## Existing Complementary Proof

The matrix supplements, rather than replaces, these existing suites:

- `tests/security/rootAuth/security.test.ts`
- `tests/security/rootUsers/security.test.ts`
- `tests/security/rootRoles/security.test.ts`
- `tests/security/tenants/security.test.ts`
- `tests/security/tenantAdmins/security.test.ts`
- `tests/security/rootAdminShell/browserSecurity.test.ts`
- `tests/e2e/rootAdmin/operator-journeys.test.ts`

Those suites continue to own missing/invalid session behavior, lifecycle
eligibility, malformed input behavior, throttling, public redemption safety,
cross-tenant tenant-admin denial, protected role erosion, and end-to-end
operator journeys.

## Refinement Rule

When a new protected root-admin route is added, update this file and either:

- add the route to `tests/security/rootAdmin/permissionMatrix.test.ts`, or
- document why a feature-specific security suite is the better owner.

When a route-family security issue escapes, update the owning proof location:

- route capability mapping issue: this matrix and the relevant feature
  security suite
- object lifecycle issue: the feature-specific security or edge suite
- public route issue: the feature-specific public/security suite
- browser shell session issue: `rootAdminShell` browser security suite
