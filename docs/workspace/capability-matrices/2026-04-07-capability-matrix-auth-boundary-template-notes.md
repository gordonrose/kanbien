# Capability Matrix Auth-Boundary Template Notes

## Generated Artifact

- Matrix:
  [2026-04-07-capability-matrix-auth-boundary-template.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-07-capability-matrix-auth-boundary-template.csv)

## Purpose

Provide a clean UTF-8 capability-matrix template that makes authorization
boundary decisions explicit from the start of a feature loop.

## New Required Fields

- `Capability boundary (root - tenant - shared)`
- `Tenant context rule`

Use them to answer:

- is this a root-operated platform capability or a tenant-scoped capability?
- if tenant-scoped, how is the current tenant context established and enforced?

## Default Meanings

- `root`
  platform-operator capability outside tenant authorization
- `tenant`
  tenant-scoped capability evaluated in exactly one current tenant context per
  request
- `shared`
  exceptional cross-tenant or mixed-boundary capability that should be used
  only with explicit approval

## Token Guidance Reminder

Do not assume `tenantId` must always be embedded in the auth token.

For this repo's current opaque bearer-session model, the safer rule is:

- the server-side auth/session context must resolve exactly one current tenant
  context when the capability is tenant-scoped
- root-user sessions remain tenant-agnostic unless a future design explicitly
  says otherwise
