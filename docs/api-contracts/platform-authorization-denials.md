# Platform Authorization Denial API Contract

## Scope

- Contract name: `platform-authorization-denials`
- Feature: shared platform authorization / future tenant authorization
- Route family or capability group:
  shared authentication and authorization denial behavior for protected root,
  tenant, support, emergency, job-triggered, and object-scoped API routes
- In-scope routes:
  - future protected tenant-scoped routes that use the layered authorization
    model from ADR-0036
  - current and future root-scoped protected routes when they need shared denial
    semantics beyond their feature-local domain errors
  - future object, relationship, attribute, lifecycle, and entitlement-protected
    routes
- Out-of-scope but closely related routes:
  - public login, bootstrap, invite, verification, and password setup routes
  - feature-local validation and domain errors unrelated to authentication or
    authorization
  - exact route-specific success payloads

This contract is an architecture target for future authorization-sensitive API
work. It preserves the current JSON error shape and existing root/tenant
middleware codes by default.

## Capability

- Feature: shared platform authorization
- Capability:
  provide consistent, safe, and auditable denial behavior across the approved
  layered authorization evaluation envelope

## Authentication

- Required auth state:
  depends on route family. Protected root routes require a valid root session.
  Protected tenant routes require a valid tenant session, and tenant-scoped
  authorization requires exactly one validated current tenant context.
- Session transport(s):
  - bearer session identifiers for raw API callers where the route family
    supports bearer auth
  - same-origin secure session cookies for browser route families where the
    route family supports browser auth

Authentication failure must not be treated as authorization failure. A request
with no valid actor identity stops at authentication before tenant, role,
feature, attribute, relationship, or object rules are evaluated.

## Authorization

- Allowed roles:
  route-specific. The platform-level contract recognizes two distinct authority
  worlds:
  - root/operator authority for root-scoped platform capabilities
  - tenant/account authority for tenant-scoped capabilities
- Denied roles:
  - unauthenticated callers
  - actors authenticated in the wrong authority world for the route
  - tenant actors without a validated current tenant context when the route is
    tenant-scoped
  - actors whose tenant lifecycle, deletion posture, feature availability,
    role, capability, attribute, relationship, or object rule does not allow the
    requested action
- Enforcement point:
  future central authorization evaluator plus existing root/tenant session
  middleware. Feature-owned resolvers may supply feature/configuration,
  entitlement, attribute, relationship, and object facts, but the final denial
  response must follow this contract.

## Middleware And Platform Effects

- Route protection middleware:
  shared root and tenant session middleware should continue to return current
  authentication errors for missing or invalid sessions.
- Rate limiting / abuse controls:
  shared throttling may still return route-family-specific `429` responses.
  Rate limiting is adjacent to this contract, not an authorization proof.
- Browser-specific behavior:
  browser route families may clear or refresh client session state after
  `INVALID_SESSION`, but replay links or URL state must not act as tenant,
  role, object, or permission authority.
- Other shared platform behavior:
  unexpected failures continue to fall through to the app-level JSON error
  middleware from ADR-0005.

## Route

- Method: mixed
- Path: applies to protected route families that opt into the shared platform
  authorization model

## Request Contract

- Params:
  route-specific. Exact route params must remain required.
- Query:
  route-specific.
- Body:
  route-specific. Tenant context must not be inferred from mutable request
  bodies when route params, session context, or explicit tenant selection state
  should own it.
- Validation rules:
  authorization denial should happen after syntactically invalid requests are
  rejected unless evaluating authorization first is required to avoid disclosing
  hidden records or cross-tenant existence.

## Response Contract

- Success payload:
  not defined by this contract.
- Status code:
  see denial matrix below.
- Response headers or cookies:
  route-specific. Denial responses must not set headers or cookies that grant,
  switch, repair, or broaden authority.

## Error Contract

The response body shape is:

```json
{
  "code": "ERROR_CODE",
  "message": "Safe user-facing message.",
  "details": {
    "reason": "stable_internal_reason"
  }
}
```

`details` remains optional for backwards compatibility. When present, it must be
safe for the caller and must not disclose hidden tenant, object, security,
legal-hold, fraud, investigation, grant-source, or internal policy facts.

### Denial Matrix

| Denial category | HTTP status | Public code | Required `details.reason` | Message posture | Existence disclosure | Audit / proof expectation |
| --- | --- | --- | --- | --- | --- | --- |
| Missing authentication | `401` | `UNAUTHORIZED` | `missing_authentication` | Generic login required. | none | security telemetry; durable audit only where route policy requires |
| Invalid, expired, or revoked session | `401` | `INVALID_SESSION` | `invalid_session` | Generic session invalid/expired. | none | security telemetry; durable audit only where route policy requires |
| Wrong authority world | `403` | `FORBIDDEN` | `wrong_authority_world` | Generic permission denial. | none | durable audit for privileged or repeated attempts |
| Tenant selection not complete | `409` | `TENANT_SELECTION_REQUIRED` | `tenant_selection_required` | Helpful recovery message; prompt tenant selection. | may reveal only that selection is needed | durable audit optional; product telemetry recommended |
| Current tenant context invalid or unavailable | `409` | `TENANT_CONTEXT_UNAVAILABLE` | `tenant_context_unavailable` | Helpful recovery message; refresh or select another tenant when safe. | may reveal only current-context failure | durable audit recommended when caused by revoked grant, inactive tenant, or deleted tenant |
| Cross-tenant access denied | `404` by default; `403` only for routes where existence is already safely known | `NOT_FOUND` by default; `FORBIDDEN` only when safe | `cross_tenant_denied` | Generic not-found or permission denial. | default none | durable security audit required for sensitive/admin routes |
| Tenant lifecycle restricted | `403` | `TENANT_LIFECYCLE_RESTRICTED` | `tenant_lifecycle_restricted` | Helpful when safe; generic for security, fraud, legal, or investigation reasons. | service availability only | durable audit required for protected mutations and support/admin access |
| Tenant deletion posture restricted | `403` by default; `404` when existence should be hidden | `TENANT_UNAVAILABLE` or `NOT_FOUND` | `tenant_deletion_posture_restricted` | Generic unless recovery/export path is safe to expose. | service availability only; no purge details | durable audit required |
| Feature, configuration, plan, or entitlement unavailable | `403` | `FEATURE_UNAVAILABLE` | `feature_unavailable` | Helpful upgrade/configuration message when safe. | may reveal approved product availability only | proof should record entitlement/config source |
| Tenant activation or configuration missing | `409` | `TENANT_CONFIGURATION_REQUIRED` | `tenant_configuration_required` | Helpful setup message and next action when safe. | may reveal setup requirement | proof should record missing configuration source |
| Role or capability missing | `403` | `FORBIDDEN` | `missing_capability` | Generic permission denial unless product explicitly allows role guidance. | no hidden object existence | durable audit required for root/admin/support/emergency routes |
| Grant source not runtime-enforced | `403` | `FORBIDDEN` | `grant_not_runtime_enforced` | Generic unavailable/permission denial. | no planned-capability disclosure | durable audit or catalog proof required before UI eligibility |
| Attribute rule denied | `403` | `FORBIDDEN` | `attribute_rule_denied` | Generic permission denial. | no attribute or policy internals | proof should record evaluated attribute source internally |
| Relationship or object rule denied | `403` when object existence is safely known; otherwise `404` | `FORBIDDEN` or `NOT_FOUND` | `relationship_rule_denied` or `object_rule_denied` | Generic permission or not-found denial. | none unless route contract safely exposes object existence | proof should record resolver source internally |
| Support reason/reference missing | `400` or `409` depending route shape | `SUPPORT_REFERENCE_REQUIRED` | `support_reference_required` | Helpful correction message. | no tenant internal facts | durable audit for attempted access |
| Emergency reason/reference missing | `400` or `409` depending route shape | `EMERGENCY_REFERENCE_REQUIRED` | `emergency_reference_required` | Helpful correction message. | no tenant internal facts | durable high-severity audit for attempted emergency action |
| Sensitive fallback denial | `404` by default; `403` only where safe | `NOT_FOUND` or `FORBIDDEN` | `sensitive_denial` | Generic. | none | durable audit required when security-sensitive |

### Status Code Rules

- Use `401` only when the caller is not authenticated for the required
  authority world or the supplied session is invalid.
- Use `403` when the actor is authenticated but not allowed and revealing that
  the route/action category exists is safe.
- Use `404` when the denial must not reveal whether a tenant, object, relation,
  cross-tenant record, or sensitive resource exists.
- Use `409` when the authenticated actor may be allowed after an explicit
  recoverable state transition, such as tenant selection or tenant configuration
  completion.
- Use `400` for missing or malformed reason/reference fields when the actor is
  otherwise allowed to attempt the operation and the route contract treats those
  fields as request validation.
- Do not use `402` for billing or plan gating in the base authorization
  contract. Plan and entitlement denials use `403 FEATURE_UNAVAILABLE`; billing
  collection or upgrade workflows may define separate route-specific contracts.

### Existing Compatibility Codes

Current route families already use:

- `UNAUTHORIZED`
- `INVALID_SESSION`
- `FORBIDDEN`
- `TENANT_AUTH_NO_TENANT_ACCESS`
- `TENANT_AUTH_TENANT_NOT_ACCESSIBLE`
- feature-local not-found and validation codes

Do not break those codes silently. New route families should use this shared
matrix directly. Existing route families should migrate only through an
explicit compatibility plan or route-family contract refresh.

### Representative Messages

Messages are examples, not mandatory copy:

- `UNAUTHORIZED`: "Authentication is required."
- `INVALID_SESSION`: "Your session is no longer valid."
- `TENANT_SELECTION_REQUIRED`: "Select a tenant to continue."
- `TENANT_CONTEXT_UNAVAILABLE`: "That tenant context is no longer available."
- `TENANT_LIFECYCLE_RESTRICTED`: "This tenant is not currently available for this action."
- `FEATURE_UNAVAILABLE`: "This feature is not available for this tenant."
- `TENANT_CONFIGURATION_REQUIRED`: "This tenant needs setup before this action can continue."
- `FORBIDDEN`: "You do not have permission to perform that action."
- `NOT_FOUND`: "We could not find that resource."

## Persistence / Side Effects

- Durable writes:
  denial responses must not mutate authorization grants, tenant selection, role
  assignments, feature flags, entitlements, lifecycle state, or object
  relationships unless the route explicitly owns a recovery action.
- Audit effects:
  durable audit is required for:
  - root capability denials on privileged routes
  - tenant admin capability denials on tenant-admin routes
  - cross-tenant denial on sensitive/admin routes
  - support access denials and support reason/reference failures
  - emergency action denials and emergency reason/reference failures
  - lifecycle/deletion posture denials for protected mutations
  - grant-source denials that affect UI eligibility or admin workflows
  - object, relationship, or attribute denials where the feature declares
    audit-sensitive access
- Cross-feature reads:
  authorization evaluation may read tenant lifecycle, deletion posture,
  configuration, entitlement, grant, role, attribute, relationship, and object
  facts through approved owning-feature seams only.
- Other side effects:
  denial proof may be recorded internally, but proof material must not be
  returned to the caller unless explicitly safe.

## Lifecycle / Cleanup

- Expiry behavior:
  session expiry produces `401 INVALID_SESSION`; tenant lifecycle expiry or
  transition produces the appropriate lifecycle, deletion, or context denial.
- Abandoned or partial-state behavior:
  incomplete tenant selection uses `409 TENANT_SELECTION_REQUIRED`.
  incomplete tenant setup uses `409 TENANT_CONFIGURATION_REQUIRED`.
- Orphaned external resource handling:
  not applicable to the base denial contract.
- Cleanup trigger:
  not applicable to denial responses; lifecycle cleanup and deletion jobs remain
  governed by ADR-0037.
- Cleanup retry and failure recording:
  not applicable to denial responses.
- Quota or cost accounting during pending cleanup:
  route-specific; denial responses must not silently trigger cost-generating
  recovery or purge work.

## Compatibility / Lifecycle Notes

- This contract is additive architecture. It does not change runtime behavior by
  itself.
- Root-user platform capabilities remain distinct from tenant-scoped
  capabilities.
- Cross-tenant access is denied by default. Use `404 NOT_FOUND` whenever
  revealing existence would disclose tenant data, hidden objects, internal
  support state, or security-sensitive facts.
- Tenant-scoped requests evaluate in exactly one current tenant context per
  request.
- A user-facing denial message may be more helpful than the generic examples
  only when it does not reveal sensitive information.
- Internal reason codes and audit/proof records may be more precise than public
  responses.

## Traceability

- PRD / design docs:
  - `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`
  - `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- Architecture:
  - `docs/architecture/adr/0005-standardize-json-error-handling-contracts.md`
  - `docs/architecture/adr/0009-separate-authentication-from-business-features.md`
  - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
  - `docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
  - `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`
  - `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
  - `docs/architecture/guides/auth-and-authorization-guide.md`
- OpenAPI:
  route-family updates required when runtime endpoints adopt this contract
- Tests required or existing:
  current root and tenant auth tests cover existing `UNAUTHORIZED`,
  `INVALID_SESSION`, `FORBIDDEN`, and tenant-auth denial behavior; future route
  families must add targeted tests for this matrix before implementation is
  considered complete

## Tests Required

- Unit:
  authorization evaluator maps each denial category to the approved status,
  code, safe message posture, and internal reason
- Integration:
  protected route families return the contract response shape through real
  middleware
- Security:
  cross-tenant, hidden-object, support, emergency, lifecycle, deletion posture,
  grant-source, attribute, and relationship denials do not disclose sensitive
  existence or policy facts
- Audit:
  denial categories marked audit-required create durable audit/proof records
  with actor, tenant context, route/action, reason, and policy source where
  applicable
- Edge:
  expired sessions, revoked grants, tenant selection changes, lifecycle changes,
  deletion posture changes, and feature flag/entitlement transitions produce
  deterministic denials without broadening access
