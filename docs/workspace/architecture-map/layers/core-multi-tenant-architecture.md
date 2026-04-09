# Multi-Tenant Architecture

## Current Status

- `partial`

## What This Layer Should Do

- define tenants as first-class platform owners or customer containers
- establish tenant identity, lifecycle, and ownership boundaries
- make future auth, data, billing, analytics, and operations tenant-aware

## Implemented To Date

- durable root-managed tenant lifecycle and metadata now exist through the
  `tenants` feature
- tenant-scoped admin profile lifecycle and verification-ready onboarding now
  exist through `tenantAdmins`
- shared tenant-side authentication now exists in narrow foundational form
  through `tenantAuth`, including shared principals, access grants,
  server-backed sessions, and tenant selection

## Still Missing / Next Steps

- tenant-scoped authorization and entity-level permission model
- stronger tenant isolation strategy across data, services, and operations
- broader tenant-member model beyond tenant-admin onboarding
- richer tenant-facing frontend and operator tooling around tenant context
- broader workflow ownership, billing, analytics, and support layers that are
  consistently tenant-aware
