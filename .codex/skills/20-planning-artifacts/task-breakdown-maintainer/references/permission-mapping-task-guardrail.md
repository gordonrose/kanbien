# Permission Mapping Task Guardrail

Use for task type: `permission-mapping`

## Must Preserve

- capability keys, root/tenant/shared-cross-tenant boundary, grants, deny rules,
  and object-level rules when relevant
- migration-backed role grants for protected backend behavior
- current tenant context remains exactly one context per request

## Approval Evidence

- capability rows and roles affected
- allow and deny expectations
- seed or corrective migration impact
- security/authz proof command

## Required Check IDs

- `permission-capability-rows`
- `permission-boundary`
- `permission-allow-deny`
- `permission-grants-migration`
- `permission-authz-proof`
