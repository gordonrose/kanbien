# webAppSurfaceDiscovery

Owns durable discovered web-app truth for approved route families such as
`root-admin`, `login`, and `design-system`.

## Current capabilities

- run root-triggered discovery over approved providers
- read current discovered surfaces with explicit locator and stale posture
- read current discovered structure trees and exact structure nodes
- read durable discovery-run history for later drift review

## Current provider posture

- `design-system`
  discovers file-backed page routes from implemented frontend HTML surfaces
- `root-admin`
  discovers hash-backed shell states plus support-only helper download routes
- `login`
  currently reports no implemented discovered surfaces while remaining an
  approved root family

## Important boundaries

- discovered truth stays separate from curated hierarchy truth
- discovery owns both discovered surface truth and discovered structure truth
- support-only routes are persisted but remain explicitly non-importable
- v1 supports root-triggered sync only; scheduled and topic-driven refresh are
  deferred
- `webAppHierarchyBuilder` consumes discovery through the exported public seam
  rather than importing discovery persistence directly
