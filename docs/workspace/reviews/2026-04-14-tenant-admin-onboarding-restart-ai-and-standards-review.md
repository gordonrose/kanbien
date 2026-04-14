# Tenant Admin Onboarding Restart AI And Standards Review

## Scope

- auth-sensitive change to recover verified tenant-admin onboarding without
  re-running email verification
- touched features:
  `tenantAdmins`, `tenantAuth`, root capability seed state, API contracts,
  OpenAPI, and Postman collections

## AI Assistance

- implementation and artifact drafting were materially assisted by Codex
- repository source of truth used for independent verification:
  `AGENTS.md`, `docs/architecture/`, `docs/standards/change-artifact-requirements.md`,
  `src/features/tenantAdmins/*`, `src/features/tenantAuth/*`, and executable
  tests under `tests/`

## Standards Review Notes

- capability boundary remains `root` for the new recovery route
- the route is protected by a dedicated authz capability:
  `tenant-admin.onboarding.restart`
- a corrective migration seeds the capability and default `RootUserAdmin`
  grant
- the route does not weaken email-verification semantics because it is limited
  to already verified visible tenant-admin rows
- the route does not create a tenant session and does not bypass the shared
  tenant-auth password-setup flow
- audit visibility is preserved through a dedicated
  `tenant_admin_onboarding_restarted` event

## Verification Evidence

- targeted unit, integration, security, and audit suites passed for
  `tenantAdmins`
- focused adjacent tenant-auth unit and integration suites passed
- Postgres-gated persistence verification was not run in this review

## Residual Risk

- the route intentionally trusts prior verified email state; if later policy
  introduces verification-expiry or identity re-proof requirements, the
  eligibility rule here should be revisited rather than broadened implicitly
