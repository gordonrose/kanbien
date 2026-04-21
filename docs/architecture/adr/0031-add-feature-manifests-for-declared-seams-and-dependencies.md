# ADR-0031: Add Feature Manifests For Declared Seams And Dependencies

- Status: Accepted
- Date: 2026-04-21
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The generated feature dependency graph now makes current import-level coupling
visible, but import topology alone does not explain which public seams are
intentional, which downstream dependencies are expected, or what kinds of
changes should be treated as breaking for a given feature.

As the feature catalog grows, both humans and LLMs need a faster way to answer
questions such as:

- which public seams does this feature intentionally expose?
- which other features are allowed to depend on those seams?
- what kinds of changes to this feature require compatibility planning?

## Decision

Add a required `feature.manifest.json` to each feature folder.

Current expectations:

- every feature under `src/features/<featureName>` maintains a
  `feature.manifest.json`
- each manifest declares:
  - the feature name
  - the feature's public seams exported through `index.ts`
  - the feature's current declared dependencies on other feature seams
  - short feature-specific breaking-change risk notes
- the dependency checker validates that:
  - manifests exist and are structurally valid
  - current cross-feature imports are declared in manifests
  - declared dependency seam ids exist in the target feature manifest
- generated dependency artifacts include manifest-derived seam and risk data so
  both automation and humans can inspect blast radius quickly

## Consequences

### Positive

- breaking-change review gets semantic context, not only import topology
- feature owners have one durable place to document stable seams and dependency
  intent
- LLMs can inspect one small manifest instead of inferring all dependency
  meaning from code alone

### Negative

- each new feature or seam change now carries a small manifest maintenance cost
- stale manifests will create checker noise until they are updated honestly

### Neutral / Follow-up

- manifests complement the generated import graph rather than replacing it
- if a future platform needs stronger contract automation, manifests can evolve
  into richer compatibility metadata instead of starting from scratch
