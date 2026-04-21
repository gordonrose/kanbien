# ADR 0024: Adopt A Durable Frontend Topology Model With Deterministic Repo Materialization

- Status: Accepted
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

The repo now has enough frontend topology infrastructure that frontend routing
and repo structure should no longer be treated as ad hoc implementation detail
for governed app families.

Several decisions now need to align:

- curated frontend topology is intended to become the primary source of truth
  for durable app places
- the repo should become a materialized artifact of that curated topology
  rather than the only place where durable app structure is inferred
- the platform already distinguishes discovered frontend truth from curated
  hierarchy truth through `webAppSurfaceDiscovery` and `webAppHierarchyBuilder`
- the current frontend runtime includes both path-backed routes and hash-backed
  shell states, which are not the same locator class and should not be
  flattened into one fake route model
- future app modules are expected to include durable journeys with deep nested
  workflow state, feature-toggle visibility, tenant and role controls, and
  entity-dependent content

Without a durable topology model, the repo is at risk of:

- treating every workflow step or UI posture as a page
- losing the distinction between durable product places and journey-local state
- allowing route and repo-structure changes to bypass deterministic
  compatibility checks
- making safe materialization depend on human or LLM judgment instead of
  executable code

## Decision

Adopt this frontend-topology model for governed app families:

- curated frontend topology is the authoritative source of truth for durable
  product places
- repo structure is a materialized artifact derived from curated topology
  through explicit preview and apply seams
- discovered frontend truth remains separate from curated topology truth
- deterministic repo code, not LLM reasoning, must own safety-critical
  classification, compatibility checks, drift detection, and materialization

### Topology Categories

The platform distinguishes these topology classes:

- `durable-page`
  stable product page or journey anchor
- `durable-subroute`
  stable child address within a larger journey that deserves direct linking and
  compatibility protection
- `journey-state`
  nested workflow step, branch, or mode inside one durable place
- `ui-state`
  transient presentation posture with no durable route identity
- `support-only`
  technical/helper route that is not normal user-facing topology

Defaults:

- only `durable-page`, `durable-subroute`, and `support-only` belong in the
  curated global topology model by default
- `journey-state` and `ui-state` remain feature-local by default
- nested workflow steps, conditional branches, and transient posture must not
  be modeled as global topology unless they are explicitly promoted

### Addressing And Locator Rules

- public pages and governed design-system pages remain path-backed by default
- app journeys should prefer path-backed durable addresses for stable module
  and journey entry points
- hash-backed addressing remains allowed for shell-local or intentionally
  non-path-backed surfaces
- movement between hash-backed and path-backed addressing is a routing-model
  migration, not a normal rename

### Promotion Rule

Promote a `journey-state` into a `durable-subroute` only when it becomes a
stable product place with meaningful deep-linking, support, analytics,
permission, or compatibility requirements.

### Materialization And Safety Rules

- repo changes derived from curated topology must materialize only through
  explicit preview and apply seams
- deterministic code must classify proposed topology changes before apply as:
  - additive
  - compatibility-sensitive
  - blocked
  - invalid
- compatibility-sensitive changes such as route renames, route removals,
  locator-type changes, and path/hash migrations require an explicit
  compatibility strategy
- governed generated routing, import wiring, and repo structure must have clear
  ownership boundaries and must not be silently hand-edited as alternative
  sources of truth

## Consequences

### Positive

- durable product places are modeled explicitly without forcing every workflow
  step into global topology
- the platform can support both path-backed routes and hash-backed shell states
  honestly
- repo materialization has a clear authority chain from curated truth to
  preview/apply to materialized files
- compatibility checks, drift detection, and apply gating can be implemented as
  deterministic domain logic
- repo-local AI workflows can support planning and operation without becoming
  part of the safety boundary

### Negative

- governed topology changes now require more explicit classification and
  process than ad hoc file edits
- the platform must maintain clear ownership boundaries between curated truth,
  discovered truth, and materialized repo structure
- some workflow complexity will remain intentionally feature-local rather than
  being promoted into one global topology model

### Neutral / Follow-up

- later work should define the first preview/apply harness that materializes
  governed topology into repo-owned frontend routing and import structure
- later work should define which app families are governed by this model in the
  first rollout
- later work should define explicit compatibility handling for promotions,
  route moves, and path/hash migrations
