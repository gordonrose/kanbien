# webAppPageSettings

Owns durable page-attached settings truth for curated web-app pages.

## Current capabilities

- read exact settings for one curated page
- update durable page settings for one curated page
- read approved settings options for the selected-page workflow
- read parent-owned page-settings-driven context-nav projections for a selected
  shell page, so sibling child pages inherit their immediate parent's nav setup

## Important boundaries

- `webAppHierarchyBuilder` remains authoritative for topology truth
- module landing-page selection remains topology-owned
- child-page assignment remains topology-owned and must use
  `webAppHierarchyBuilder` move capabilities
- `webAppSurfaceDiscovery` remains outside the authority boundary for settings
  writes
