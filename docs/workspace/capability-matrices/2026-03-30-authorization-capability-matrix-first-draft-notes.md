# Authorization Capability Matrix First Draft Notes

## Purpose

Capture the intent behind the first draft authorization capability matrix before
implementation planning begins.

## What This Draft Covers

- root-user-only authorization management capabilities
- separate platform-role-template and tenant-role management read flows
- initial tenant runtime capability examples
- central runtime authorization seam capabilities
- durable authorization audit behavior

## What This Draft Does Not Yet Cover

- a full future business capability catalog
- every tenant feature that will eventually consume authz
- frontend management UI capabilities
- all later inheritance shapes beyond the initial own/team/tenant/all model
- later optimization capabilities for materialized or cached authorization read
  models

## Key Modeling Choices Reflected Here

- `authorization` is treated as its own backend feature area
- root-user-only management remains outside tenant authz
- platform role templates and tenant-local roles are modeled as separate
  management surfaces to avoid cross-contamination
- tenant runtime authorization is expressed through global capability strings
- runtime evaluation is split into:
  - yes/no capability checks
  - read/list scope checks
- audit is treated as a first-class capability of the feature, not an optional
  implementation detail

## Additional Role-Editing Coverage Added In This Revision

- explicit platform-template listing before edit selection
- explicit platform-template eligible-capability inspection with descriptions and
  mandatory/protected markers
- explicit platform-template assigned-vs-unassigned capability inspection
- explicit tenant-role listing before edit selection
- explicit tenant-role eligible-capability inspection with descriptions and
  mandatory/protected markers
- explicit tenant-role assigned-vs-unassigned capability inspection

## Contamination Boundary Reinforced Here

- platform role-template discovery and capability inspection are global and must
  not expose tenant-local role state as if it were a platform default
- tenant-role discovery and capability inspection are tenant-scoped and must not
  expose platform-template rows as if they were current tenant assignments
- assigned-vs-unassigned views are split by surface so future admin flows can
  stay explicit about whether the operator is editing:
  - platform defaults
  - one tenant's local divergence

## Main Questions To Pressure-Test

- whether the management capability boundaries are the right first slice
- whether the capability naming direction feels right
- whether the first tenant runtime examples are the right ones to anchor the
  model
- whether the runtime seam should stay as two explicit capabilities:
  `evaluateAuthorizationCapability` and `evaluateAuthorizationScope`
- whether any additional protected safety capabilities should be explicit in the
  matrix rather than implied in notes

## Suggested Next Step After Review

Turn this matrix into the first authorization implementation blueprint for:

- `authorization` feature foundation
- root-user-only management API
- initial persistence schema
- central evaluation seam
