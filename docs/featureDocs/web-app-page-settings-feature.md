# Web App Page Settings Feature Reference

## Purpose

The `webAppPageSettings` feature owns durable page-attached configuration truth
for existing curated web-app pages.

Today it ships the backend foundation for:

- exact settings read for one curated page
- exact page-settings update for one curated page
- approved options reads for icons, templates, and eligible context-nav targets
- explicit context-nav membership replacement with self-only fallback when no
  rows are stored
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
- `GET /options`

## Current Settings Model

- one durable `web_app_page_settings` row may exist per curated page
- explicit context-nav rows are stored separately in
  `web_app_page_context_nav_items`
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

## Verification Status

Current executable evidence includes:

- `tests/unit/webAppPageSettings/service.test.ts`
- `tests/integration/webAppPageSettings/flow.test.ts`
- `tests/security/webAppPageSettings/security.test.ts`
- `tests/audit/webAppPageSettings/audit.test.ts`
