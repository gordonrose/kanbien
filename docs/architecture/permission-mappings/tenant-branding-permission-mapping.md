# Tenant Branding Permission Mapping

## Purpose

Map planned tenant-branding capabilities to the authorization boundaries that
must exist before Layer 5 delivery.

This artifact is a first-draft planning mapping for a not-yet-implemented
feature. Rows marked `target` must be reconciled into the canonical backend and
role mapping documents when implementation lands.

## Roles

- Role name:
  `RootUserAdmin`
  Description:
  Current coarse authenticated root-user operator boundary. Root-admin tenant
  branding actions are selected-tenant operations, not tenant-session actions.
- Role name:
  authenticated tenant actor
  Description:
  Future tenant-side actor authenticated into exactly one current tenant
  context for dashboard branding projection and logo content reads.
- Role name:
  tenant branding feature service
  Description:
  Internal feature service boundary that records tenant-branding audit evidence
  and calls `assets` only after tenant-branding relationship authorization.

## Capability Mapping

| Feature | Capability | Status | Allowed Roles | Minimum Role | Denied Roles | Frontend Visibility Rule | Backend Enforcement Rule | Audit Role Capture |
|---|---|---|---|---|---|---|---|---|
| `tenantBranding` | `root-admin.tenant-branding.read` | `target` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability | show root-admin branding read surface only when root session has capability | root-session middleware plus tenantBranding selected-tenant capability check; normal read excludes soft-deleted branding | yes for denied reads; successful reads optional unless security review requires |
| `tenantBranding` | `root-admin.tenant-branding.manage` | `target` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability | show save controls only when root session has manage capability | root-session middleware plus tenantBranding selected-tenant capability check; body tenant ids are not authority; client-supplied system fields rejected | yes |
| `tenantBranding` | `root-admin.tenant-branding.logo.update` | `target` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability; actor attempting cross-tenant link | show upload/replace controls only when root session has logo update capability and asset constraints are known | tenantBranding authorizes selected tenant and relationship first; assets then enforces `asset.create`, `asset.read`, and `asset.link` invariants | yes |
| `tenantBranding` | `tenant-branding.dashboard.read` | `target` | authenticated tenant actor in current tenant context | authenticated tenant actor | unauthenticated caller; root session without tenant context; tenant actor without current tenant; cross-tenant actor | tenant dashboard may request projection only for its server-side current tenant; no tenant selector spoofing | tenant-session middleware plus tenantBranding current-tenant capability check; projection falls back safely for missing/not-ready branding | yes for denied projection reads |
| `tenantBranding` | `tenant-branding.logo.read` | `target` | authenticated tenant actor in current tenant context; `RootUserAdmin` for selected-tenant preview | authenticated tenant actor or `RootUserAdmin` | public caller; unauthenticated caller; actor without matching current/selected tenant; actor using asset ownership alone as authority | logo URL is emitted only by authorized branding projection or root read response; no public/raw bucket URL is shown | tenantBranding relationship authorization precedes `asset.content.read`; assets streams private content with same-origin headers | yes for denied content reads; successful reads optional unless security review requires |
| `tenantBranding` | `tenant-branding.audit.record` | `target` | tenant branding feature service | tenant branding feature service | user-controlled callers; public callers; actors trying to write raw secrets or storage credentials | not a user-visible UI action | feature service records audit-safe events for create/update/deny/mismatch/quota/cleanup-sensitive outcomes; payload must exclude raw bytes, storage credentials, upload targets, tokens, and bearer/session identifiers | yes |
| `assets` | `asset.create` | `current dependency` | `RootUserAdmin` through branding logo-update flow | `RootUserAdmin` | unauthenticated caller; root actor without asset create; tenant actor in v1 root-managed upload flow | branding upload controls hidden unless tenant branding and asset constraints are both available | assets creates constrained upload intents only after tenantBranding authorizes tenant relationship | yes through assets and tenantBranding audit posture |
| `assets` | `asset.read` | `current dependency` | `RootUserAdmin` through branding logo-update/read flow | `RootUserAdmin` | unauthenticated caller; actor without asset read; cross-tenant mismatch | asset metadata is shown only as safe logo relationship summary | assets returns safe metadata only; no storage credentials or raw bucket authority | yes where assets requires |
| `assets` | `asset.link` | `current dependency` | consuming feature service after entity authorization | tenant branding feature service | callers trying to link before tenantBranding authorization; cross-tenant asset links | not directly visible; result is reflected as logo readiness/relationship state | tenantBranding validates selected tenant/current tenant and then calls asset validation for subject, readiness, scope, and lifecycle | yes for link success/failure |
| `assets` | `asset.content.read` | `current dependency` | `RootUserAdmin` for selected-tenant preview; authenticated tenant actor after tenantBranding authorization | authenticated root or tenant actor with matching context | public caller; cross-tenant actor; actor relying on asset id alone | UI uses same-origin logo URL only from authorized branding projection/read response | tenantBranding authorizes relationship first; assets streams ready private content with `nosniff` and private cache posture | yes for denied content reads |

## Notes

- Root-admin tenant branding operations use a selected tenant id as the object
  being administered. They do not create a tenant session for the root actor.
- Tenant dashboard reads use exactly one current tenant context from
  server-side auth/session state. Request bodies and query strings are not
  tenant authority.
- Asset ownership alone is never sufficient authority to read or link a tenant
  logo. The consuming `tenantBranding` feature owns relationship authorization;
  `assets` owns asset invariants.
- Public logo delivery, raw bucket URLs, signed public URLs, generic asset
  library behaviour, and tenant-admin self-service branding are not approved in
  v1.
- When the feature is implemented, reconcile these target rows into:
  - `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`
  - `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`
  - the root-role/capability catalog seed or materialization source, if that
    is the governing implementation path at that time.
