# webAppPageSettings

Owns durable page-attached settings truth for curated web-app pages.

## Current capabilities

- read exact settings for one curated page
- update durable page settings for one curated page
- read approved settings options for the selected-page workflow
- read page-settings-driven context-nav projections for a selected shell page

## Important boundaries

- `webAppHierarchyBuilder` remains authoritative for topology truth
- module landing-page selection remains topology-owned
- `webAppSurfaceDiscovery` remains outside the authority boundary for settings
  writes
