# Tenant Configuration API Contract

## Scope

- Contract name: `tenantConfiguration`
- Feature: `tenantConfiguration`
- Route family or capability group:
  Tenant-scoped auth-policy read and root-managed update routes
- In-scope routes:
  - `GET /v1/tenants/:tenantId/auth-policy`
  - `PATCH /v1/tenants/:tenantId/auth-policy`
  - `GET /v1/tenant/auth-policy`

## Capability

- Feature: `tenantConfiguration`
- Capability:
  Resolve effective tenant auth policy from system defaults plus tenant
  overrides and expose it through root and current-tenant read surfaces

## Authentication

- Required auth state:
  - authenticated root session for root read and update
  - authenticated tenant session for current-tenant self-read

## Authorization

- Allowed roles:
  - root actors with `tenant-auth-policy.read` for root exact-tenant read
  - root actors with `tenant-auth-policy.update` for root exact-tenant update
  - authenticated tenant-side actor within the current tenant context for
    tenant self-read
- Denied roles:
  - unauthenticated callers
  - root actors without the matching root capability
  - tenant callers without a current tenant context

## Request Contract

- `GET /v1/tenants/:tenantId/auth-policy`
  - route params:
    `{ tenantId }`
- `PATCH /v1/tenants/:tenantId/auth-policy`
  - route params:
    `{ tenantId }`
  - body:
    any subset of
    `{ minLength, maxLength, minUppercase, maxUppercase, minLowercase, maxLowercase, minNumbers, maxNumbers, minSymbols, maxSymbols, sessionTtlSeconds }`
- `GET /v1/tenant/auth-policy`
  - current tenant comes only from the authenticated tenant session

## Response Contract

- effective policy reads return:
  - `tenantId`
  - `policySource`
  - `hasTenantOverride`
  - `passwordPolicy`
  - `sessionPolicy`
  - `hardFloors`
  - `hardLimits`
  - `updatedAt`

## Error Contract

- feature-local:
  - `INVALID_REQUEST`
  - `TENANT_AUTH_POLICY_TENANT_NOT_FOUND`
  - `TENANT_AUTH_POLICY_CURRENT_TENANT_REQUIRED`
  - `TENANT_AUTH_POLICY_INVALID`
- shared middleware:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `FORBIDDEN`

## Persistence / Side Effects

- `tenant_auth_policy` stores one durable override row per tenant when an
  override exists
- reads merge tenant overrides with system defaults into an effective response
- updates are immediate and replace the stored tenant override columns for that
  tenant
- effective password policy is also consumed by `tenantAuth` for password setup
  and remediation-aware login
- effective session TTL policy is also consumed by `tenantAuth` when minting
  new tenant sessions
