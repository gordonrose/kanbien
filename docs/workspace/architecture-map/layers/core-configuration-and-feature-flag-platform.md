# Configuration And Feature-Flag Platform

## Current Status

- `missing`

## What This Layer Should Do

- manage runtime configuration beyond static environment parsing
- support phased rollout, safe toggles, and environment-specific behavior
- keep configuration changes auditable and controlled

## Implemented To Date

- basic environment parsing through `src/config/env.ts`
- architecture direction for tenant-scoped runtime configuration is now captured
  in
  [ADR-0020](/home/gordon/kanbien/docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md)

## Still Missing / Next Steps

- define dynamic configuration model
- add a dedicated tenant-scoped configuration seam
- start with tenant auth policy as the first typed configuration family
- define feature-flag evaluation rules and scope
- define admin/operator controls, audit, and rollout patterns
