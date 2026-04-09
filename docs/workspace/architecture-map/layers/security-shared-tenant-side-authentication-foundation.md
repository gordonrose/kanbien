# Shared Tenant-Side Authentication Foundation

## Current Status

- `partial`

## What This Layer Should Do

- provide a reusable non-root authentication model for tenant-side actors
- keep authentication separate from tenant-scoped business/profile features
- support one principal reaching multiple tenants through durable access grants
- provide durable server-backed sessions with active-tenant context selection
- stay compatible with later tenant-user, password-recovery, MFA, and browser
  transport work

## Implemented To Date

- shared tenant-side auth principals now exist under `src/features/tenantAuth`
- verified tenant-admin onboarding proof can bootstrap a shared principal
- initial password setup is separate from login
- email-plus-password login is implemented
- server-backed tenant sessions now exist
- single-tenant auto-select and multi-tenant selection-required session states
  are implemented
- the current authenticated API surface is frontend-ready in contract shape,
  even though no tenant frontend exists yet

## Still Missing / Next Steps

- broader reuse beyond `tenantAdmins` as the first source actor
- password-reset and recovery workflows
- browser-cookie transport and same-origin tenant console behavior
- tenant-user onboarding and richer actor types beyond `tenant_admin`
- MFA, SSO, and stronger enterprise identity controls
- generalized tenant authorization beyond current tenant-context selection
