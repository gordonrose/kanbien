# Tenant Configuration Feature Reference

## Purpose

The `tenantConfiguration` feature owns durable tenant-scoped configuration
families whose effective values must be resolved from platform defaults plus
tenant overrides.

Today it ships the `tenantAuthPolicy` family. That family owns:

- root-admin exact-tenant read of the effective tenant auth policy
- root-admin exact-tenant update of tenant auth policy overrides
- tenant-admin current-tenant self-read of the effective tenant auth policy
- durable tenant-scoped password-policy override fields
- durable tenant-scoped tenant-session TTL override field
- the public resolver seam consumed by `tenantAuth` for password enforcement
  and session-expiry resolution

This feature does not own tenant login, password hashing, tenant access grants,
tenant session storage, or remediation workflow state transitions. Those remain
in `tenantAuth`.

## Where It Lives

- `src/features/tenantConfiguration/contract`
- `src/features/tenantConfiguration/domain`
- `src/features/tenantConfiguration/persistence`
- `src/features/tenantConfiguration/transport`
- `src/features/tenantConfiguration/integration.ts`
- `src/features/tenantConfiguration/index.ts`

## Platform Integration

Feature export:

- `createTenantConfigurationFeature`

Current mount points:

- `src/routes/v1/index.ts`
- root-managed base route: `/v1/tenants/:tenantId/auth-policy`
- tenant-session self-read route: `/v1/tenant/auth-policy`

Protected routes are mounted behind:

- shared root-session authentication and root capability checks for root read
  and update
- shared tenant-session authentication for current-tenant self-read
- shared platform-security audit surface for successful privileged updates and
  denied privileged attempts through the authz seam

## Runtime Contracts

### Feature factory

The feature entry point expects:

- raw `pg` `Pool`
- a `RootCapabilityChecker`
- public seams from:
  - `tenants`
  - `tenantAuth` session lookup
  - shared platform-security audit infrastructure

`integration.ts` owns repository and service wiring.
`transport/router.ts` owns HTTP parsing plus auth/authz composition.
The domain service owns effective-policy resolution, override validation, and
audit coordination for successful root updates.

### Cross-feature seams

`tenantConfiguration` uses narrow public seams rather than feature-private
imports:

- `tenants` provides visible tenant existence checks before root read or update
- `tenantAuth` provides current authenticated tenant-session context for the
  tenant self-read route
- `tenantAuth` consumes the exported `TenantAuthPolicyResolver` seam to resolve:
  - effective password policy for setup and remediation
  - aggregate shared-principal password-policy requirements
  - aggregate shared-principal tenant-session TTL, using the shortest effective
    tenant TTL across accessible tenant contexts

### Migrations

The migration runner scans:

- `src/features/**/persistence/migrations/*.sql`

This feature currently contributes:

- `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`
- `src/features/tenantConfiguration/persistence/migrations/0011_seed_tenant_auth_policy_root_capabilities.sql`
- `src/features/tenantConfiguration/persistence/migrations/0012_add_session_ttl_to_tenant_auth_policy.sql`

## Relationship To Root Roles

`tenantConfiguration` does not own authorization policy.
It consumes the shared root capability checker and depends on these capability
keys in the root capability catalog:

- `tenant-auth-policy.read`
- `tenant-auth-policy.update`

## API Surface

Root-managed base path:

- `/v1/tenants/:tenantId/auth-policy`

Tenant-session path:

- `/v1/tenant/auth-policy`

Routes:

- `GET /v1/tenants/:tenantId/auth-policy`
- `PATCH /v1/tenants/:tenantId/auth-policy`
- `GET /v1/tenant/auth-policy`

## Response Shapes

Responses are returned directly without a `{ "body": ... }` envelope.

Example effective policy response:

```json
{
  "tenantId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "policySource": "tenant_override",
  "hasTenantOverride": true,
  "passwordPolicy": {
    "minLength": 14,
    "maxLength": 64,
    "minUppercase": 2,
    "maxUppercase": null,
    "minLowercase": 1,
    "maxLowercase": null,
    "minNumbers": 2,
    "maxNumbers": null,
    "minSymbols": 1,
    "maxSymbols": null
  },
  "sessionPolicy": {
    "sessionTtlSeconds": 7200
  },
  "hardFloors": {
    "minLength": 6,
    "minUppercase": 1,
    "minLowercase": 1,
    "minNumbers": 1,
    "minSymbols": 1
  },
  "hardLimits": {
    "minSessionTtlSeconds": 300,
    "maxSessionTtlSeconds": 2592000
  },
  "updatedAt": "2026-04-13T12:00:00.000Z"
}
```

## Request Semantics

### Root update

`PATCH /v1/tenants/:tenantId/auth-policy`

Body may include any subset of:

- password-policy overrides:
  `minLength`, `maxLength`, `minUppercase`, `maxUppercase`, `minLowercase`,
  `maxLowercase`, `minNumbers`, `maxNumbers`, `minSymbols`, `maxSymbols`
- session-expiry override:
  `sessionTtlSeconds`

Rules:

- omitted fields stay `null` in storage unless explicitly provided
- `null` means inherit the platform default for that field
- password fields must satisfy the existing platform floors and min/max rules
- `sessionTtlSeconds` must stay within the current hard bounds:
  - minimum `300`
  - maximum `2592000`
- clients may not supply system-managed fields or computed effective values

### Tenant self-read

`GET /v1/tenant/auth-policy`

Rules:

- current tenant comes only from the authenticated tenant session
- the route does not accept a tenant selector in the request
- the response is tenant-specific even though login-session TTL resolution uses
  shared-principal aggregation at session-mint time

## Persistence Model

The feature owns the durable `tenant_auth_policy` row keyed by `tenant_id`.

Current stored override columns:

- password-composition bounds
- `session_ttl_seconds`
- `created_at`
- `updated_at`

`tenantConfiguration` does not own `tenant_session`, but its effective-policy
resolver influences the `expires_at` written by `tenantAuth` when a new session
is created.
