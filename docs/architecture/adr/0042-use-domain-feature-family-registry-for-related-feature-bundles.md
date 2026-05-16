# ADR-0042: Use Domain Feature Family Registry For Related Feature Bundles

- Status: Accepted
- Date: 2026-05-15
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

Some product domains are intentionally delivered as several feature bundles
rather than one large feature. Organization v1 is the current pressure point:
planned bundles include core organization records, legal details, locations,
opening hours, business units, memberships, reference values, logo
relationships, search, and exports.

The existing `feature.manifest.json` contract is intentionally narrow. ADR-0031
defines it as the source for:

- public seams exported through `index.ts`
- current cross-feature dependencies
- breaking-change risk notes

The current dependency checker also validates only that narrow shape. Adding
unsupported family fields directly into feature manifests would create
metadata that humans might trust but automation would not understand.

At the same time, reviewers need one durable place to see that related feature
bundles belong to the same business domain and to understand which planned
member owns each responsibility.

## Decision

Use a repo-backed domain feature family registry for cross-feature product
family membership.

The registry is the approved place to record:

- domain family key and display name
- family status
- member feature bundle keys
- member responsibility summary
- source planning artifacts
- implementation posture
- notes about blocked, deferred, or future members

Do not add domain-family metadata fields to `feature.manifest.json` until the
feature manifest schema, dependency checker, generated dependency graph, and
related docs explicitly support those fields.

Feature manifests remain responsible for current public seams, current
declared dependencies, and breaking-change risks. The domain family registry
does not replace those manifests and does not declare import authority.

## Initial Registry Location

The repo-backed registry lives at:

- `docs/architecture/domain-feature-family-registry.md`

The registry may later become a generated or persisted artifact, but for now it
is a source-independent architecture document maintained with planning and
implementation slices.

## Consequences

### Positive

- Related feature bundles can be reviewed as one domain without bloating the
  feature manifest schema.
- Future Organization implementation tasks can point to an approved family
  record while still using normal feature manifests for seams and dependencies.
- The dependency checker remains honest because it is not asked to validate
  fields it does not understand.
- A future compiler or persisted registry can adopt the family data from one
  place instead of extracting it from prose.

### Negative

- The registry is a second maintained artifact when a domain family changes.
- Until automation is added, registry drift must be caught through artifact
  sweeps and review rather than through feature dependency checks.

### Neutral / Follow-up

- If feature family membership becomes operationally important, add explicit
  schema support and generated validation before placing family fields in
  `feature.manifest.json`.
- If the artifact registry work later persists planning/governance records,
  this registry should become a materialized view or seed source for persisted
  domain-family records.
