# Permission Mapping Task Guardrail

Use for task type: `DOC:permission-mapping`

## Must Preserve

- capability keys, root/tenant/shared-cross-tenant boundary, grants, deny rules,
  and object-level rules when relevant
- migration-backed role grants for protected DEV:backend behavior
- current tenant context remains exactly one context per request

## Approval Evidence

- capability rows and roles affected
- allow and deny expectations
- seed or corrective migration impact
- security/authz proof command

## Deep Delivery Standard

- one capability key, grant boundary, deny rule, or tenant-context decision per
  queued task
- split mapping docs, seed migration, and authz runtime implementation when
  they have distinct write sets or proof
- name the exact role/capability rows and allow/deny proof

## Required Check IDs

- `permission-capability-rows`
- `permission-boundary`
- `permission-allow-deny`
- `permission-grants-migration`
- `permission-authz-proof`
