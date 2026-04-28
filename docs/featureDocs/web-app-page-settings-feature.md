# Web App Page Settings Feature Reference

## Purpose

The `webAppPageSettings` feature owns durable page-attached configuration truth
for existing curated web-app pages.

Today it ships the backend foundation for:

- exact settings read for one curated page
- exact page-settings update for one curated page
- approved options reads for icons, templates, and eligible context-nav targets
- explicit parent-owned context-nav membership replacement for sibling page
  groups, with self-owned behavior for pages that have no parent
- root-admin-ready capability separation from topology truth

## Where It Lives

- `src/features/webAppPageSettings/contract`
- `src/features/webAppPageSettings/domain`
- `src/features/webAppPageSettings/persistence`
- `src/features/webAppPageSettings/transport`
- `src/features/webAppPageSettings/integration.ts`
- `src/features/webAppPageSettings/index.ts`

## Current Boundaries

- `webAppHierarchyBuilder` remains authoritative for topology truth
- module landing-page selection remains topology-owned and stays outside this
  feature
- top-level child-page assignment in the root-admin hierarchy workspace remains
  topology-owned and saves through the hierarchy move seam, even though it is
  displayed beside page settings for operator convenience
- `webAppSurfaceDiscovery` remains outside the authority boundary for settings
  writes
- option eligibility for curated pages is read through the public hierarchy seam
  rather than through direct feature-to-feature persistence imports

## Current API Surface

Base path:

- `/v1/web-app-page-settings`

Routes:

- `GET /pages/:webAppPageId`
- `PUT /pages/:webAppPageId`
- `GET /root-families/:rootFamilyId/pages/:pageKey/context-nav`
- `GET /options`

## Current Settings Model

- one durable `web_app_page_settings` row may exist per curated page
- explicit context-nav rows are stored separately in
  `web_app_page_context_nav_items`
- context-nav projection reads resolve the viewed page through hierarchy truth,
  then read rows from the viewed page's immediate parent when one exists, or
  from the viewed page itself when it is top-level
- projected context-nav items keep the target page's own icon settings and
  preserve dynamic target page keys when a root-admin page is not one of the
  fixed shell sections
- stored settings currently include:
  - `parentPageId` snapshot from the current hierarchy-owned page relationship
  - `iconKey`
  - `showInTopNav`
  - `topNavOrder`
  - `pageTemplateKey`
- effective response posture currently includes:
  - default icon fallback when no explicit icon is stored
  - topology-template fallback when no explicit settings template is stored
  - self-only context-nav fallback when no explicit context-nav rows are stored
    for an exact settings read

## Verification Status

Current executable evidence includes:

- `tests/unit/webAppPageSettings/service.test.ts`
- `tests/integration/webAppPageSettings/flow.test.ts`
- `tests/security/webAppPageSettings/security.test.ts`
- `tests/audit/webAppPageSettings/audit.test.ts`
