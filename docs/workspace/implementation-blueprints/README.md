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

These files are intended to be maintained with the
`implementation-blueprint-maintainer` skill.
