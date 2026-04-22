# ADR-0033: Add A Capability Contract Catalog Foundation With Hybrid Materialization And Drift Audit

- Status: Proposed
- Date: 2026-04-22
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The repo increasingly wants to build new frontend and vertical-slice work by
composing against existing backend capabilities instead of rediscovering
backend behavior manually every time.

Today the truth needed for that work is spread across multiple artifacts:

- feature contract schemas and types
- maintained API contract docs
- maintained backend-to-authz capability mappings
- maintained role-to-authz capability mappings
- feature manifests

Those artifacts are useful individually, but they do not yet give the platform
one stable, machine-consumable registry that frontend tooling or later planning
work can consume directly.

Without a normalized capability catalog, the platform risks:

- duplicated local frontend knowledge about backend behavior
- drift between picker UI, validation UX, and backend truth
- ad hoc source scraping or route-handler introspection at runtime
- losing permission truth when role composition evolves
- introducing builder tooling that depends on undocumented or private feature
  internals

At the same time, a purely runtime-derived model is not enough.

The repo also needs:

- reviewable change visibility in Git when normalized capability truth changes
- durable runtime reads for later frontend consumption
- one governed write path for seeding and refresh
- one governed audit path for detecting drift

The architecture therefore needs a foundation that is:

- explicit about source authority
- durable enough for runtime consumption
- reviewable enough for planning and code review
- strict enough to block ambiguous truth instead of inventing it

## Decision

Add a new feature:

`src/features/capabilityContractCatalog/`

The feature owns a durable normalized registry of approved backend capability
truth for v1.

Current rules:

- the backend capability is the primary catalog unit
- v1 catalogs approved HTTP-backed public feature capabilities only
- non-HTTP cross-feature public seam cataloging is intentionally deferred
- stable capability identity uses feature-qualified logical ids
- normal browse, exact-read, and export flows consume persisted catalog truth
  rather than reconstructing records from scattered source files at request
  time
- the feature uses a hybrid posture:
  - a generated in-repo artifact remains reviewable maintained truth for
    change visibility and code review
  - database materialization provides the runtime query seam for catalog APIs
    and later frontend tooling
- the same normalization rules must drive both generated artifact output and
  database materialization
- the architecture must not allow generated artifact truth and persisted
  database truth to drift silently
- governing authz capability keys are canonical access truth
- resolved allowed roles are derived persisted views built from maintained
  role-mapping artifacts
- capability records should include:
  - picker-friendly summary metadata
  - exact request and response field metadata
  - field-level validation metadata when derivable honestly
  - capability-level cross-field constraints when derivable honestly
  - short picker-friendly descriptions
  - fuller inspector-friendly descriptions where source truth supports them
  - source references
  - freshness and drift posture
- frontend validation may mirror exported validation rules, but backend
  validation remains authoritative
- frontend permission visibility may mirror exported access metadata, but
  backend authorization remains authoritative
- the feature owns a governed materialization path that:
  - reads approved source artifacts
  - normalizes them deterministically
  - writes durable catalog records
  - updates the generated in-repo artifact
- the feature owns a governed drift-audit path that:
  - compares persisted catalog truth against current approved source truth
  - classifies records as fresh, stale, drifted, blocked, or missing
  - explains drift reasons explicitly
  - does not silently repair persisted truth as a side effect of reading drift
    posture
- browse and exact-read flows may expose stale or drift posture explicitly
- trusted export and materialization flows should block when source truth is
  contradictory beyond the allowed tolerance
- the exact source authority order must be encoded explicitly in the feature's
  normalization logic rather than spread implicitly across helpers or route
  code
- the long-term direction is for later frontend capability-pickers and
  builder-style tools to consume this catalog instead of re-reading source
  artifacts directly

## Consequences

### Positive

- the platform gets one explicit machine-consumable capability registry instead
  of many local backend-knowledge copies
- frontend tooling can consume capability, validation, description, and access
  metadata from one governed seam
- capability ids and field paths can become stable frontend-binding anchors
- permission truth stays tied to canonical authz capability keys rather than
  fragile role labels alone
- generated artifact output keeps normalized truth visible in Git and code
  review
- persisted database truth keeps runtime browse, exact-read, and export flows
  efficient and explicit
- materialization and drift audit become first-class governed workflows instead
  of ad hoc maintenance

### Negative

- the first slice introduces more durable-model and normalization plumbing than
  a simple docs-only or runtime-scraping approach
- the architecture must now maintain both generated and persisted outputs from
  one normalization model
- authority-order disagreements across schemas, docs, mappings, and manifests
  must be resolved deliberately instead of being ignored
- user-facing descriptions and validation extraction require disciplined source
  handling to avoid creating a drifting shadow model

### Neutral / Follow-up

- later work should define:
  - whether materialization and drift audit remain normal root-only routes or
    move behind support-only seams
  - whether durable history for materialization and audit runs becomes
    necessary
  - how far validation extraction can go without inventing a parallel
    validation language
  - how non-HTTP cross-feature public seams should join the catalog as a later
    seam family
  - how later frontend tooling should classify capabilities for table, form,
    menu, or workflow binding use cases
- if future work decides that repo-generated artifacts should become the only
  canonical output or that database truth should become the only canonical
  output, that should be an additive or superseding ADR rather than an
  implicit drift from the current hybrid model
