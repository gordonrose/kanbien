# Root Admin Path Topology Foundation Capability Matrix Notes

## Purpose

Capture the first-pass assumptions behind the root-admin path-topology
foundation capability matrix before implementation starts.

## Upstream Truth For This Matrix

This matrix starts from the repo's current frontend topology and route-governed
architecture decisions.

Source artifacts:

- [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
- [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
- [0026-separate-durable-page-settings-from-curated-frontend-topology.md](/home/gordon/kanbien/docs/architecture/adr/0026-separate-durable-page-settings-from-curated-frontend-topology.md)
- current `rootAdminShell`, `webAppSurfaceDiscovery`, and
  `webAppHierarchyBuilder` foundations under `src/`
- [2026-04-21-0019-root-admin-path-topology-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md)

## Consolidated Assumptions

- selected current root-admin suite pages should become path-backed durable
  pages
- current `#` routes remain compatibility aliases during migration
- aliases are not canonical topology truth
- future suites should reuse the path-backed durable grammar rather than
  creating new hash islands
- discovery truth and curated topology truth must align around canonical
  path-backed routes
- current business capabilities should not be renamed casually just to mirror
  new route strings
- route-model migration is compatibility-sensitive and must remain additive
  first
- docs, skills, and agent guidance are part of the real migration scope rather
  than optional follow-up cleanup

## Recommended Capability Direction

The first slice should cover these capability groups:

- resolve path-backed root-admin suite entry in the real shell
- honor legacy hash aliases during the migration window
- publish path-backed canonical root-admin route truth through discovery
- align curated topology and route examples around the canonical path posture
- refresh maintained docs and agent guidance so the new topology becomes the
  durable planning baseline

## Main Benefit

This loop should let the platform answer not only:

- which operator suite is currently active in the shell

but also:

- which route is the canonical durable entry for that suite
- which legacy locators are temporary compatibility aliases
- how future suites should be modeled before payroll, annual leave,
  rostering, and CRM are added
