# Web App Page Settings Foundation Capability Matrix Notes

## Purpose

Capture the first-pass assumptions behind the initial `webAppPageSettings`
capability matrix before implementation starts.

## Upstream Truth For This Matrix

This matrix starts from the newly settled ownership split between curated
topology truth and durable page-settings truth.

Source artifacts:

- [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
- [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
- [0026-separate-durable-page-settings-from-curated-frontend-topology.md](/home/gordon/kanbien/docs/architecture/adr/0026-separate-durable-page-settings-from-curated-frontend-topology.md)
- [web-app-page-settings-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-page-settings-entity-model-first-draft.md)
- current implemented `webAppHierarchyBuilder`, `webAppSurfaceDiscovery`, and
  `rootAdminShell` foundations under `src/`

## Consolidated Assumptions

- curated topology remains the authoritative source of truth for durable app
  places
- `webAppPageSettings` should be a sibling feature to
  `webAppHierarchyBuilder`, not an expansion of it
- the first page-settings slice is a privileged root-operator workflow
- `displayLabel` remains the canonical page name in v1
- page settings own:
  - `iconKey`
  - curated context-navigation membership
  - top-navigation visibility
  - page-template intent
- the default context navigation fallback is one self-pointing item
- icon selection must come from an approved icon catalog with a default
  fallback icon
- module landing-page selection is required in the same overall operator
  workspace, but it remains topology-owned in `webAppHierarchyBuilder`
- module landing-page selection may target only a direct child page of the
  module
- `/root-admin/web-app-hierarchy` remains the operator workspace suite route,
  with durable selected-page subroutes available under
  `/root-admin/web-app-hierarchy/pages/:pageKey` and sections:
  - `Hierarchy`
  - `Page Settings`
  - `Observed App`
  - `Preview & Apply`

## Recommended First Feature Boundary

The first slice should add:

- a new `webAppPageSettings` feature for settings reads and writes
- a narrow topology extension in `webAppHierarchyBuilder` for module landing
  page updates
- a root-admin browser workspace section for selected-page settings

The first slice should not absorb:

- discovery persistence
- route-generation or repo-materialization logic
- arbitrary label-override fields
- uploaded custom icon assets
- a new global topology model

## Design-System And UI Constraint

The operator UI must respect the repo's design-system signoff rule.

That means:

- the page-settings panel should compose already governed form/drawer patterns
  where possible
- if an icon-grid selector needs a new governed design-system variant, that
  design-system loop must be signed off before the real app adopts it
- the first implementation may use an approved non-grid selector over the icon
  catalog if the icon-grid family is not yet signed off

## Capability Direction

The first slice should cover these capabilities:

- read settings for one selected curated page
- save page settings for one selected curated page
- read approved settings options needed by the UI
- set or clear a module landing page through `webAppHierarchyBuilder`
- drive the selected-page settings panel inside `/root-admin/web-app-hierarchy`

Exact new write capability keys should be:

- `web-app-page-settings.read`
- `web-app-page-settings.update`
- `web-app-page-settings.read-options`
- `web-app-hierarchy.update-module-landing-page`

Default grant posture:

- all four are root-only
- `RootUserAdmin` receives the grants through additive migration-backed seeds
- UI visibility may hide or disable actions when permission is missing, but
  backend enforcement remains authoritative

## Main Benefit

This loop should let the platform answer not only:

- what page exists in the curated hierarchy

but also:

- how that page should appear in operator-controlled navigation
- which other pages it intentionally links to in context navigation
- whether it should appear in the top nav
- which template contract it intends to use
- which direct child page acts as the module landing target

without collapsing settings truth into topology truth.
