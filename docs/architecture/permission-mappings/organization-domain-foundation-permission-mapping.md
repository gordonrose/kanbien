# Organization Domain Foundation Permission Mapping

## Purpose

Map the Organization v1 authority model as planning rows become implemented
runtime slices.

This is a transitional permission mapping for the Organization domain
foundation. Rows marked `target` are approved for task breakdown, but they are
not runtime truth until the implementing slice adds enforced capability checks,
seeded or materialized grants, tests, and any required canonical mapping
updates.

## Sources

| Source | Path | Use |
| --- | --- | --- |
| PRD | `docs/prd/2026-05-12-0025-organization-domain-foundation.md` | business and security authority rules |
| Story breakdown | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md` | story and blocker traceability |
| Capability matrix | `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv` | story/capability posture |
| Root API contract | `docs/api-contracts/organization-root-admin.md` | implemented S-004 through S-010 route families plus planned follow-on route families |
| Tenant API contract | `docs/api-contracts/organization-tenant-admin.md` | implemented S-004 through S-010 route families plus planned follow-on route families |
| Data dictionary | `docs/data-dictionary/organization*.md` | implemented and planned entity capabilities and object rules |
| Public logo signoff | `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md` | logo delivery and asset boundary |
| Private export decision | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` | export privacy and cleanup boundary |
| Secure generated export steering | `docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md` | export PIN, ZIP, job, notification, and cleanup boundary |

## Roles And Boundaries

- Role name:
  `RootUserAdmin`
  Description:
  Authenticated root operator. Root Organization actions use root authority and
  an explicit selected tenant/account from the root route. A root actor does
  not become a tenant-session actor by selecting a tenant/account.
- Role name:
  tenant admin
  Description:
  Authenticated tenant actor with exactly one current tenant/account in
  server-side session context. Tenant authority must not be supplied by request
  body.
- Role name:
  public logo reader
  Description:
  Unauthenticated or public caller that may read only the current accepted
  public logo bytes or app-generated initials placeholder through approved
  app-controlled delivery URLs. This boundary cannot read private Organization
  records, raw asset storage, historical logos, or exports.
- Role name:
  organization feature service
  Description:
  Internal Organization service boundary that performs object authorization,
  audit-safe mutation, and cross-feature calls after route-level authorization
  succeeds.
- Role name:
  organization export worker
  Description:
  System worker that may generate, expire, clean up, notify, and record export
  attempts only from an authorized durable export request.
- Role name:
  organization logo worker
  Description:
  System worker or asset-processing seam that may process, publish, invalidate,
  and clean up logo bytes only after an authorized Organization logo
  relationship and asset-readiness decision.

## Authority Rules

| Rule | Decision |
| --- | --- |
| Root tenant context | Root routes use `tenantId` from the route as selected tenant/account authority and must validate it before object access. |
| Tenant context | Tenant routes use exactly one server-side current tenant/account. Request bodies and query strings are never tenant authority. |
| Object boundary | Every Organization-owned record must prove owning tenant/account before read, mutation, search result inclusion, export inclusion, or logo relationship change. |
| Cross-tenant posture | Deny by default. Root cross-tenant operation is allowed only through an explicit selected tenant/account route plus object rule. Tenant cross-tenant access is denied. |
| Public logo posture | Public read is limited to current accepted logo bytes or placeholder behavior. Public logo access is not Organization record read authority. |
| Asset posture | Organization owns relationship authorization. `assets` owns upload intent, storage key, byte verification, scanning, readiness, raw URL denial, streaming, and cleanup invariants. |
| Export posture | Exports are requester-bound private generated copies. Organization permission alone is not enough to download another admin's export. Link plus PIN is not authority. |
| System worker posture | Workers act from durable work records and revalidate safe scoped request data before generating, expiring, deleting, or notifying. |
| UI eligibility | UI actions are hidden unless the actor has the matching capability and the feature's logo, export, or design-system prerequisites are satisfied. Backend denial remains authoritative. |
| Audit posture | Mutations, sensitive reads, denied access, logo operations, export lifecycle actions, worker failures, and cleanup failures require audit or failure evidence. |

## Capability Mapping

| Feature | Capability | Status | Allowed Roles | Minimum Role | Denied Roles | Frontend Visibility Rule | Backend Enforcement Rule | Audit Role Capture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `organizationCore` | `organization.root.manage` | `implemented-foundation` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability; selected tenant/account mismatch | show root Organization create, update, archive, restore, move controls only when root session has capability and selected tenant/account is valid | root-session middleware plus capability check; route `tenantId` is selected authority; object rules enforce same tenant/account, lifecycle, hierarchy depth, cycle denial, and active normalized-name uniqueness | yes |
| `organizationCore` | `organization.tenant.manage` | `implemented-foundation` | tenant admin in current tenant/account | tenant admin | unauthenticated caller; root actor on tenant route; tenant actor without capability; missing or multiple current tenant contexts; cross-tenant actor | show tenant Organization controls only in authenticated tenant-admin context with capability | tenant-session middleware plus current tenant/account capability check; object rules enforce same tenant/account, lifecycle, hierarchy depth, cycle denial, and active normalized-name uniqueness | yes |
| `organizationCore` | `organization.root.read` | `implemented-foundation` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability; selected tenant/account mismatch | show root Organization lists/details only when root session can read selected tenant/account | root-session middleware plus read capability and selected-tenant object rule; normal reads exclude deleted rows and only explicit capabilities expose archived/retained rows | yes for denials; successful reads optional unless sensitive detail is included |
| `organizationCore` | `organization.tenant.read` | `implemented-foundation` | tenant admin in current tenant/account | tenant admin | unauthenticated caller; root actor on tenant route; tenant actor without capability; cross-tenant actor | show tenant Organization lists/details only for current tenant/account | tenant-session middleware plus read capability and current tenant/account object rule; normal reads exclude deleted rows and only explicit capabilities expose archived/retained rows | yes for denials; successful reads optional unless sensitive detail is included |
| `organizationLegalDetails` | `organization.legal-profile.manage` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with manage capability | unauthenticated caller; actor without capability; cross-tenant actor; actor trying to create a second active legal profile | show legal profile edit controls only when actor can manage the owning Organization | Organization object authorization precedes legal-profile mutation; one-active rule, lifecycle rule, and same-tenant rule are enforced before write | yes |
| `organizationLegalDetails` | `organization.legal-profile.read` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with read capability | unauthenticated caller; actor without capability; cross-tenant actor | show legal profile area only when actor can read the owning Organization and legal profile area | Organization object authorization precedes legal-profile read; retained or archived visibility requires explicit read posture | yes for denials; successful reads optional unless security review requires |
| `organizationLocations` | `organization.location.manage` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with manage capability | unauthenticated caller; actor without capability; cross-tenant actor | show location add/edit/archive/restore controls only when actor can manage the owning Organization | Organization object authorization precedes location mutation; geocoordinates, lifecycle, and same-tenant rules enforced before write | yes |
| `organizationLocations` | `organization.location.read` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with read capability | unauthenticated caller; actor without capability; cross-tenant actor | show location lists/details only when actor can read the owning Organization | Organization object authorization precedes location read; normal reads exclude archived and deleted rows unless an explicit retained-read posture is used | yes for denials; successful reads optional unless security review requires |
| `organizationOpeningHours` | `organization.weekly-hours-slot.manage` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with manage capability | unauthenticated caller; actor without capability; cross-tenant actor; actor targeting a location outside scope | show weekly-slot controls only when actor can manage the owning location | Organization and location object authorization precede slot changes; weekday, open/close, ordering, same-day, and non-overlap rules enforced before write | yes |
| `organizationOpeningHoursExceptions` | `organization.opening-hours-exception.manage` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with manage capability | unauthenticated caller; actor without capability; cross-tenant actor; actor targeting a location outside scope | show exception controls only when actor can manage the owning location | Organization and location object authorization precede exception changes; exception type and precedence rules enforced before write | yes |
| `businessUnits` | `organization.business-unit.manage` | `implemented-foundation` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with manage capability | unauthenticated caller; actor without capability; cross-tenant actor; actor targeting a parent outside Organization scope | show business-unit create/update/move/archive/restore controls only when actor can manage the owning Organization | Organization object authorization precedes business-unit mutation; parent, child, depth, cycle, branch archive, and child reassignment rules enforced before write | yes |
| `businessUnitMemberships` | `organization.business-unit-membership.manage` | `implemented-foundation-partial-targets` | `RootUserAdmin` for selected tenant/account; tenant admin in current tenant/account | root or tenant admin with manage capability | unauthenticated caller; actor without capability; cross-tenant actor; placeholder target; invalid membership label; individual/person target before approved lookup seam | show membership add/edit/archive/restore controls only when actor can manage the owning business unit | Organization and business-unit object authorization precede membership mutation; business-unit targets must be real and in scope through the approved business-unit public seam; individual/person targets are explicitly deferred | yes |
| `organizationReferenceCatalogues` | `organization.reference-value.manage` | `implemented-foundation` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability | show reference catalogue mutation controls only to root admins with capability | root-session middleware plus capability check; tenant routes have no mutation endpoint; used values must be archived, deprecated, or explicitly replaced rather than silently removed | yes |
| `organizationReferenceCatalogues` | `organization.reference-value.read` | `implemented-foundation` | `RootUserAdmin`; tenant admin in current tenant/account | root or tenant admin with read/use capability | unauthenticated caller; actor without capability; cross-tenant actor for tenant-scoped reads | show reference selectors when actor can use approved values | root or tenant session middleware plus read/use capability; tenant admins can read/use approved values but cannot mutate system-owned catalogue rows | yes for denials; successful reads optional |
| `organizationBrandingReferences` | `organization.root.logo.manage` | `target` | `RootUserAdmin` for v1 primary logo only | `RootUserAdmin` | unauthenticated caller; tenant actor on root route; root actor without capability; selected tenant/account mismatch; actor using asset id alone as authority | show root logo upload/replace/remove controls only after runtime capability enforcement, signed-off asset constraints, and DS prerequisites are present | root-session middleware plus Organization object rule; Organization authorizes relationship first, then assets enforces `asset.create`, `asset.read`, and `asset.link`; raw bucket/provider URLs denied | yes |
| `organizationBrandingReferences` | `organization.tenant.logo.manage` | `target` | tenant admin in current tenant/account for v1 primary logo only | tenant admin | unauthenticated caller; root actor on tenant route; tenant actor without capability; cross-tenant actor; actor using asset id alone as authority | show tenant logo upload/replace/remove controls only after runtime capability enforcement, signed-off asset constraints, and DS prerequisites are present | tenant-session middleware plus Organization object rule; Organization authorizes relationship first, then assets enforces upload/read/link invariants; raw bucket/provider URLs denied | yes |
| `organizationBrandingReferences` | `organization.logo.public.read` | `target` | public logo reader through app-controlled public delivery URL | public logo reader | caller requesting private records; caller requesting raw asset URL; caller requesting historical/replaced logos; caller requesting unaccepted asset bytes | public pages or consumers may render only app-controlled current primary logo or initials placeholder URL after delivery route implementation | public delivery route resolves only current accepted relationship or placeholder; no private Organization fields, raw storage keys, or unprocessed bytes are returned | yes for denied raw/private access; successful high-volume public reads may use sampled/operational telemetry if approved |
| `organizationSearch` | `organization.root.search` | `target` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; tenant actor; root actor without capability; selected tenant/account mismatch | show root grouped search only when root can read selected tenant/account | root-session middleware plus search capability; each result group applies underlying object/read permission, lifecycle visibility, exact filters, and tenant/account boundary | yes for denials; successful reads optional unless sensitive detail is included |
| `organizationSearch` | `organization.tenant.search` | `target` | tenant admin in current tenant/account | tenant admin | unauthenticated caller; root actor on tenant route; tenant actor without capability; cross-tenant actor | show tenant grouped search only inside current tenant/account | tenant-session middleware plus search capability; each result group applies underlying object/read permission, lifecycle visibility, exact filters, and current tenant/account boundary | yes for denials; successful reads optional unless sensitive detail is included |
| `organizationExports` | `organization.root.export.manage` | `target` | `RootUserAdmin` after runtime implementation | `RootUserAdmin` | unauthenticated caller; tenant actor on root route; root actor without capability; selected tenant/account mismatch; actor trying to download another admin's export | show export request/cancel/retry/delete/download/PIN actions only after secure export steering, capability enforcement, and DS prerequisites are present | root-session middleware plus export capability; export request captures requester, selected tenant/account, sections, scope, retention choice, and branch authorization; download/PIN require same requester and available export | yes |
| `organizationExports` | `organization.tenant.export.manage` | `target` | tenant admin in current tenant/account after runtime implementation | tenant admin | unauthenticated caller; root actor on tenant route; tenant actor without capability; cross-tenant actor; actor trying to download another admin's export | show tenant export request/cancel/retry/delete/download/PIN actions only after secure export steering, capability enforcement, and DS prerequisites are present | tenant-session middleware plus export capability; export request captures requester, current tenant/account, sections, scope, retention choice, and branch authorization; download/PIN require same requester and available export | yes |
| `organizationExports` | `organization.export.generate` | `target` | organization export worker | organization export worker | user-controlled caller; public caller; actor without durable authorized export request; worker with stale or mismatched scoped data | not a user-visible UI action | worker loads durable export request, revalidates scoped Organization access and requester-bound rules where required, generates PIN/password ZIP, records safe failure category, and never logs PIN or raw secrets | yes |
| `organizationExports` | `organization.export.expire-cleanup` | `target` | organization export worker | organization export worker | user-controlled caller; public caller; worker without eligible expired/deleted export record | not a user-visible UI action | worker expires ready export after 24 hours or on delete, removes generated copy, records cleanup failure, and retries during the 7-day cleanup retry window | yes |
| `organizationExports` | `organization.export.notify` | `target` | organization export worker | organization export worker | user-controlled caller; public caller; worker without eligible ready/failed export state | async/status UI may show ready/failed attention state from durable export status | worker sends ready or failed notification using safe content; PIN may be included only under approved export/email controls and must not be logged | yes |
| `organizationLogoWorkers` | `organization.logo.process-publish` | `target` | organization logo worker and assets seam | organization logo worker | user-controlled caller; public caller; worker without accepted asset and authorized relationship | not a direct user-visible UI action; readiness reflected in logo relationship state | worker or assets seam verifies bytes, scanning, raster metadata stripping, accepted relationship, public delivery eligibility, cache invalidation, and failure recording | yes |
| `organizationLogoWorkers` | `organization.logo.cleanup-replaced` | `target` | organization logo worker and assets seam | organization logo worker | user-controlled caller; public caller; worker without eligible replaced/deleted logo record | not a direct user-visible UI action | worker deletes eligible replaced prior logo bytes 24 hours after replacement is live where allowed, records cleanup failure, and preserves durable relationship/audit facts | yes |
| future `organizationIntegrations` | `organization.integration.*` | `deferred-with-owner` | none in v1 | not applicable | all actors | no v1 integration UI is shown | deny by default; no v1 route, persistence, search result, export section, or source task may activate integration records | yes for attempted access if a route exists |

## Backend Capability Family Summary

| Capability Family | Status | Authority World | Actor Boundary | Tenant Context Required | Grant Source Posture | UI Eligibility | Object Rule Required |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.root.manage` | `target` | root | `RootUserAdmin` | yes, selected tenant/account from root route | seed-backed or runtime-enforced when implemented | eligible only after runtime enforcement | yes |
| `organization.tenant.manage` | `target` | tenant | tenant admin | yes, current tenant/account from server-side session | seed-backed or runtime-enforced when implemented | eligible only after runtime enforcement | yes |
| `organization.*.read` | `target` | root or tenant | root or tenant admin | yes | seed-backed or runtime-enforced when implemented | eligible only after runtime enforcement | yes |
| `organization.reference-value.manage` | `target` | root | `RootUserAdmin` | no tenant session; system catalogue route | seed-backed or runtime-enforced when implemented | eligible only after runtime enforcement | yes for used-value lifecycle decisions |
| `organization.reference-value.read` | `target` | root or tenant | root or tenant admin | tenant context for tenant reads | seed-backed or runtime-enforced when implemented | eligible only after runtime enforcement | conditional |
| `organization.logo.*` | `target` | root, tenant, public, system | root admin, tenant admin, public reader, logo worker | yes except public current-logo read | eligible for S-012 task breakdown after completed public logo signoff; runtime eligibility still requires implementation and enforcement | eligible only after runtime enforcement | yes |
| `organization.*.search` | `target` | root or tenant | root or tenant admin | yes | seed-backed or runtime-enforced when implemented | eligible only after runtime enforcement | yes for every result group |
| `organization.export.*` | `target` | root, tenant, system | root admin, tenant admin, export worker | yes | eligible for S-015 task breakdown after completed secure generated export steering; runtime eligibility still requires implementation and enforcement | eligible only after runtime enforcement | yes |
| `organization.integration.*` | `deferred-with-owner` | root or tenant future | none in v1 | future | blocked/deferred | not eligible | yes if revived |

## Object Rules

| Rule ID | Applies To | Required Decision |
| --- | --- | --- |
| `organization.object.same-tenant` | all Organization-owned records | target record must belong to the selected root tenant/account or tenant-admin current tenant/account |
| `organization.object.lifecycle-visible` | normal reads/search/export | deleted rows excluded; archived or retained rows require explicit visibility posture |
| `organization.object.hierarchy-valid` | Organization and business-unit move/archive/restore | parent and child must remain in same tenant/account, no cycles, depth <= 10 |
| `organization.object.branch-authorized` | branch archive, child reassignment, branch export | actor must be authorized for every included Organization or target parent |
| `organization.object.reference-value-usable` | Organization records using reference values | tenant admins can use only approved values; system-owned catalogue mutation remains root-only |
| `organization.object.membership-target-real` | business-unit memberships | membership target must be a real individual user or real business unit validated through approved public seams |
| `organization.object.logo-relationship-authorized` | logo upload/replace/delete/public read/export read | Organization relationship authorization must pass before asset read/link/content delivery |
| `organization.object.export-requester-bound` | export PIN/download/delete | export requester must match current actor; Organization permission alone does not allow another actor's export access |
| `organization.object.worker-scoped-request` | export and logo workers | worker must operate from durable scoped work records, not from user-supplied ad hoc authority |

## Denial And Test Expectations

| Denial Class | Required Proof |
| --- | --- |
| unauthenticated | every protected root and tenant route denies missing session |
| invalid actor world | tenant actor denied on root routes; root actor denied on tenant routes |
| missing capability | actor with session but without capability denied and UI action hidden |
| missing tenant context | tenant route denies missing or ambiguous current tenant/account |
| cross-tenant object | wrong tenant/account record denied for read, mutation, search result, export inclusion, and logo relationship |
| lifecycle conflict | deleted rows unavailable to normal update; archived/retained visibility explicit |
| asset authority misuse | asset id or storage ownership alone cannot read/link/publish logo |
| raw URL access | raw bucket/provider URLs never exposed for public logo or private export |
| export requester mismatch | non-requester denied PIN view, download, delete, retry, or cancel where requester-bound |
| worker stale scope | background worker records failure or denial instead of generating from stale/mismatched scoped data |

## Blocked And Deferred Boundaries

| Boundary | Status | Reason | Unblock Requirement |
| --- | --- | --- | --- |
| Public logo implementation | `ready-for-task-breakdown` | public asset delivery is a security and cost boundary | completed public logo technical signoff and runbook must be carried into S-012 tasks, tests, and asset integration |
| Private export implementation | `ready-for-task-breakdown` | PIN/password ZIP, cancellation, retry, notification, safety limits, and cleanup are a security and job boundary | completed secure generated export steering must be carried into S-015 tasks, tests, runbook, and job/file integration |
| App UI screens | `blocked` | governed app UI requires shared screen/design-system references first | shared admin screen behavior locks and references |
| Integration records | `deferred-with-owner` | integrations are future scope | new discovery/steering before any v1 route, persistence, search, export, or UI |

## Reconciliation Notes

- When Organization source implementation lands, reconcile active rows into:
  - `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`
  - `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`
  - the root/tenant capability catalog seed or materialization source, if that
    is the governing implementation path.
- This artifact intentionally does not grant runtime access by itself.
- Capability names are planning keys. Implementing tasks may split a broad
  planning key into narrower runtime capabilities if the split preserves these
  allow/deny rules and updates this mapping.
