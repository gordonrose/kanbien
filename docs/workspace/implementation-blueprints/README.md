# Implementation Blueprints

This folder contains working implementation blueprints derived from approved
capability matrices and PRDs.

A blueprint is not the same thing as a capability matrix.

- capability matrix = what must exist
- implementation blueprint = how this repo should build it

Use a blueprint when the requirements are already known and you want a
repo-shaped build plan that makes the next implementation step low ambiguity.

Typical blueprint contents:

- scope and owning feature
- input artifact references
- frontend plan when relevant
- backend route and file plan
- persistence and migration plan
- cross-feature seam usage
- verification plan
- docs update plan

## Draft Capability Blueprints

- [2026-05-11 Organization Domain Foundation Capability Blueprint](./2026-05-11-organization-domain-foundation-capability-blueprint.md)
  is a planning draft for the Organization domain record-account feature set.
  It is not implementation-ready until the upstream Product Discovery, Technical
  Steering, capability matrix, PRD, API contracts, data dictionary, permission
  mapping, and test-case artifacts exist.

These files are intended to be maintained with the
`implementation-blueprint-maintainer` skill.
