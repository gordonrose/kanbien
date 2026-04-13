# SSO / Federation

## Current Status

- `missing`

## What This Layer Should Do

- support enterprise identity federation
- allow external identity providers to authenticate users safely
- support provisioning and enterprise access governance later

## Implemented To Date

- no SSO or federation support yet
- architecture direction now preserves room for tenant-scoped auth policy,
  provider definitions, and tenant-scoped auth-method bindings in
  [ADR-0020](/home/gordon/kanbien/docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md)

## Still Missing / Next Steps

- choose supported federation standards and provider model
- define tenant-scoped provider and account-binding model
- define domain ownership, org mapping, and lifecycle handling
- define audit and fallback login rules
