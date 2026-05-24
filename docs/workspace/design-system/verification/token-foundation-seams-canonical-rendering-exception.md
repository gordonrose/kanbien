# Token Foundation Seams Canonical Rendering Exception

## Decision

The signed-off token foundation seams are promoted using their token routes as
the canonical review surfaces for this pass, instead of generating separate
`/design-system/canonical-renderings/<family>` pages immediately.

## Rationale

- The user explicitly reviewed and approved the live token routes listed in the
  reference pack.
- The token routes are deterministic, directly addressable, and already expose
  display settings and source-drawer context relevant to token review.
- Several promoted seams are foundational token scales rather than rich
  component states, so duplicating them into generated canonical routes would
  add ceremony before first-consumer pressure proves which families need that
  additional surface.

## Boundaries

- This exception applies only to the token-route seams listed in
  `docs/workspace/design-system/reference-packs/token-foundation-seams-reference-pack.md`.
- It does not apply to future component families extracted from these routes.
- It does not approve real-app adoption without the adoption contract and
  first-consumer parity checks.
- If a family gains additional interactive states, generated canonical render
  pages should be created before expanding its reusable API.

## Review Surface Truth

The current source-of-truth reference URLs are:

- `/design-system/tokens/filter-panel-structure`
- `/design-system/tokens/entity-page-structure`
- `/design-system/tokens/nested-entity-record`
- `/design-system/tokens/background`
- `/design-system/tokens/container`
- `/design-system/tokens/container-section`
- `/design-system/tokens/colours`
- `/design-system/tokens/paragraph`
- `/design-system/tokens/header`
- `/design-system/tokens/icon-button`
- `/design-system/tokens/tooltip`
