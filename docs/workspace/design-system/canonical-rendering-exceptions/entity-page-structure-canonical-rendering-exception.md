# Entity Page Structure Canonical Rendering Exception

Approved canonical rendering exception.

## Decision

`entity-page-structure` may claim `system-ready` through the signed-off token
route and token foundation seam artifact set before generated
`/design-system/canonical-renderings/entity-page-structure` pages exist.

## Boundary

This exception applies only to the current reusable foundation structure seam.
If entity-page structure gains richer component states or first-consumer app
adoption exposes drift, generated canonical render pages must be added before
the seam contract broadens.
