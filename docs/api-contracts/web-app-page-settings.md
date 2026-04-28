# Web App Page Settings API Contract

## Scope

- Contract name: `web-app-page-settings`
- Feature: `webAppPageSettings`
- Route family or capability group:
  protected root-only page-settings backend routes
- In-scope routes:
  - `GET /v1/web-app-page-settings/pages/{webAppPageId}`
  - `PUT /v1/web-app-page-settings/pages/{webAppPageId}`
  - `GET /v1/web-app-page-settings/root-families/{rootFamilyId}/pages/{pageKey}/context-nav`
  - `GET /v1/web-app-page-settings/options`

## Capability

- Feature: `webAppPageSettings`
- Capability:
  manage durable page-attached settings truth for existing curated web-app
  pages without changing topology ownership

## Authentication

- Required auth state:
  authenticated root-user session is required for every route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>`
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` in the current implemented slice
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus
  `createRequireRootCapability(...)` checks using
  `web-app-page-settings.read`, `web-app-page-settings.update`, and
  `web-app-page-settings.read-options`

## Middleware And Platform Effects

- Route protection middleware:
  shared root-session middleware rejects missing accepted session transport
  with `401 UNAUTHORIZED` and invalid/expired sessions with `401 INVALID_SESSION`
- Rate limiting / abuse controls:
  shared authenticated-general rate limiting applies to the mounted
  `web-app-page-settings` route family and may return `429 RATE_LIMITED`

## Request Contract

- Params:
  - `webAppPageId` is required where present and must be an exact UUID
  - `rootFamilyId` is required for context-nav projections and must be one of
    `root-admin`, `login`, or `design-system`
  - `pageKey` is required for context-nav projections and must be a non-empty
    shell page key
- Query:
  - `GET /options` requires:
    `webAppPageId`
- Body:
  - update page settings:
    at least one of
    `{ iconKey?, showInTopNav?, topNavOrder?, pageTemplateKey?, contextNavTargetPageIds? }`
- Validation rules:
  - request bodies and query objects are strict; unexpected fields are rejected
  - `iconKey` must be one approved catalog key or `null`
  - `pageTemplateKey` must be one approved template key or `null`
  - `topNavOrder` must be a non-negative integer or `null`
  - `contextNavTargetPageIds` must be an array of exact UUIDs with no duplicates
  - context-nav target pages must come from the eligible curated-page read seam
    exposed by `webAppHierarchyBuilder`
  - clients must not supply system-managed fields such as ids or timestamps

## Response Contract

- Success payload:
  - exact settings read and update return:
    `{ webAppPageId, parentPageId, rootFamilyId, displayLabel, hasStoredSettings, iconKey, effectiveIconKey, showInTopNav, topNavOrder, pageTemplateKey, effectivePageTemplateKey, contextNavItems, createdAt, updatedAt }`
  - `/root-families/{rootFamilyId}/pages/{pageKey}/context-nav` returns:
    `{ rootFamilyId, shellPageKey, items }`, where `items` are ordered
    context-nav destinations resolved from the viewed page's owner settings;
    each item includes the target page's own `iconKey`, `effectiveIconKey`,
    `resolvedFullRoutePath`, and derived `shellPageKey`
  - `/options` returns:
    `{ webAppPageId, parentPageId, defaultIconKey, currentTopologyTemplateKey, icons, pageTemplates, eligibleContextNavTargets }`
- Status code:
  - `200` for exact reads, updates, and options reads

## Error Contract

- Error codes:
  - feature-local:
    - `INVALID_REQUEST`
    - `WEB_APP_PAGE_NOT_FOUND`
    - `WEB_APP_PAGE_SETTINGS_INVALID_ICON_KEY`
    - `WEB_APP_PAGE_SETTINGS_INVALID_TEMPLATE_KEY`
    - `WEB_APP_PAGE_SETTINGS_DUPLICATE_CONTEXT_NAV_TARGET`
    - `WEB_APP_PAGE_SETTINGS_INVALID_CONTEXT_NAV_TARGET`
  - shared middleware:
    - `UNAUTHORIZED`
    - `INVALID_SESSION`
    - `FORBIDDEN`
    - `RATE_LIMITED`

## Persistence / Side Effects

- Durable writes:
  - exact update mutates or creates one `web_app_page_settings` row
  - exact update snapshots the current hierarchy-owned `parentPageId` into the
    settings row for the selected page
  - exact update replaces explicit `web_app_page_context_nav_items` rows for
    the selected owner page when `contextNavTargetPageIds` is supplied
  - exact read, options read, and context-nav projection read do not mutate
    persisted settings truth
- Audit effects:
  - denied capability-gated requests create shared platform security audit
    events through the central authz middleware
  - successful mutations are currently operator-visible through authenticated
    backend responses; no feature-local durable success-audit table exists yet

## Approved Cross-Feature Reads

- `webAppPageSettings` consumes the public `webAppHierarchyBuilder` seam for:
  - exact curated-page validation by `webAppPageId`
  - eligible context-nav target projection derived from curated tree truth
- the feature does not depend on `webAppSurfaceDiscovery` for settings truth
  or option eligibility

## Compatibility / Lifecycle Notes

- `webAppHierarchyBuilder` remains authoritative for page placement, page
  identity, route ownership, and module landing-page selection
- `parentPageId` is captured from the current `webAppHierarchyBuilder` page
  relationship and echoed through page-settings responses; clients do not own a
  separate parent-page write contract in this slice
- `pageTemplateKey` in page settings coexists with the current
  topology-owned `templateKey` posture; the effective response falls back to
  topology truth when no explicit settings template exists
- context-nav projection reads use the viewed page's hierarchy owner:
  child pages inherit the context-nav rows stored on their immediate parent
  page, while pages with no parent use their own rows
- context-nav target identity is target-owned: fixed root-admin shell pages may
  normalize to their canonical shell key, while dynamic root-admin targets keep
  their target page key so app links and icons do not collapse to `overview`
- exact page-settings reads still use a self-only context-nav fallback when no
  explicit rows exist for the selected settings page
- icons remain governed by an approved catalog source; the current backend
  catalog is intentionally narrow and additive until the signed-off
  design-system icon selector source becomes the durable provider
