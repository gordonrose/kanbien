# ADR-0030: Enforce Feature Public Seams With A Generated Dependency Graph

- Status: Accepted
- Date: 2026-04-21
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform already expects cross-feature reads to happen through exported
feature seams instead of private reach-through into another feature's
`domain/`, `persistence/`, or `transport/` files.

That rule is documented in architecture guidance, but as the `src/features`
catalog grows, undocumented dependencies and private imports become harder for
both humans and LLMs to spot quickly. Multi-branch and multi-chat work increases
that pressure because the blast radius of a feature change is no longer obvious
from one local diff alone.

## Decision

Adopt a generated feature dependency graph and an automated seam check for
`src/features`.

Current expectations:

- cross-feature imports inside `src/features` must resolve through the target
  feature root `index.ts` seam
- private imports into another feature's `domain/`, `persistence/`,
  `transport/`, or other non-root files are not allowed by default
- the repo maintains generated dependency artifacts under
  `docs/architecture/generated/`
- the dependency checker is part of the repo's normal static checks
- when a feature needs a new cross-feature seam, that seam should be exported
  intentionally from the owning feature root rather than consumed through a
  private file path

## Consequences

### Positive

- breaking-change blast radius becomes easier to inspect for both humans and
  LLMs
- cross-feature coupling becomes visible and reviewable instead of staying
  implicit in import paths
- feature authors get fast feedback when they reach through another feature's
  private internals

### Negative

- some existing or future cross-feature collaboration patterns may need small
  public-seam refactors before changes can pass the checker
- generated dependency artifacts add one more maintained output to keep in sync

### Neutral / Follow-up

- this decision governs import-level feature seams first; stronger semantic
  metadata such as stable versus experimental seam classes can be layered on
  later if needed
- if the repo later adopts feature manifests, they should complement rather
  than replace the import-based guard unless a superseding ADR says otherwise
