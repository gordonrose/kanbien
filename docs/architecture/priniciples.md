# Architecture Principles

These principles are written to support rapid delivery, including autonomous
Codex-driven changes, without sacrificing scalability, security, modularity,
flexibility, reliability, or consistency.

## 1. Prefer Explicit Platform Seams

Platform wiring must be easy to find and reason about.

- Feature integration must happen through explicit platform entry points.
- Shared infrastructure must be mounted in one obvious place.
- Hidden runtime discovery for routers, middleware, or feature exports should be
  avoided unless there is a clear operational benefit.

Why:

- explicit seams reduce accidental coupling
- debugging stays cheap as the number of features grows
- platform-wide changes remain auditable

## 2. Features Must Be Self-Contained Bundles

A feature should be added primarily by creating or updating one folder under
`src/features`.

- A feature owns its transport, contract, domain, persistence, and integration
  code.
- Distinct units of utility inside a feature should be split into explicit
  capabilities rather than merged into generic handlers.
- A feature may depend on shared platform services, but platform code should not
  know feature internals.
- Cross-feature reuse should happen through deliberate shared modules, not by
  reaching into another feature's private files.
- When one feature must read another feature's data, the owning feature should
  expose a narrow public seam for that purpose.

Why:

- modularity scales better than file-by-layer sprawl
- changes are easier to test and review
- ownership stays clear as the platform grows

## 2A. Standardize Feature-Internal Conventions

Feature bundles should follow a repeatable internal structure and naming style.

- `contract` defines API-facing primitives only, never DB record types.
- `domain` defines business entities and post-validation capability inputs and
  results.
- `persistence` defines repository seams, record types, and DB adapters.
- `transport` owns HTTP routing and request handling only.
- `integration.ts` owns feature wiring for the platform.
- `index.ts` exposes the feature's public integration surface.
- Cross-feature reads must use exported feature seams rather than importing
  another feature's private persistence adapter or DB-shaped record types.
- Query schemas must be first-class exports, not hidden inside route handlers.
- Exact lookup schemas must be separate from list or search schemas.
- Exact route params must never be optional.
- Repository contracts must make filter, pagination, sorting, and scope rules
  explicit.
- Capability names should describe one business purpose each.

Why:

- repeatable structure reduces feature drift
- naming discipline makes autonomous changes safer
- explicit seams preserve flexibility as features multiply

## 3. Keep the Platform Thin

The platform layer should orchestrate, not absorb business logic.

- `src/app.ts`, `src/routes`, `src/config`, `src/lib`, and startup scripts should
  stay small and generic.
- Domain rules, validation rules, and persistence logic belong in features.
- Platform code may define cross-cutting contracts, but should avoid feature-
  specific behavior.

Why:

- a thin platform is easier to evolve
- feature teams can move faster without destabilizing startup or routing

## 4. Standardize Cross-Cutting Contracts

The platform must behave consistently across features in ways clients and
operators care about.

- Request validation failures should have a predictable JSON shape.
- Unexpected errors must return a predictable JSON shape.
- Environment loading and startup checks should fail fast.
- Public API versioning and mount conventions should be stable.
- Feature naming and integration conventions should remain consistent unless a
  documented decision changes them.
- Authentication context establishment should be separated from later
  authorization and scope evaluation.
- Cross-feature platform security behaviors such as headers, throttling, and
  lock-down responses should remain consistent unless a documented decision
  changes them.

Why:

- consistency reduces client complexity
- observability and operations become easier
- new features can copy known-good patterns safely

## 5. Reliability Beats Cleverness

Changes should favor deterministic behavior over convenience shortcuts.

- Startup should verify critical dependencies before serving traffic.
- Migration behavior must be deterministic and repeatable.
- Multi-step bootstrap or repair migrations should be written with the target
  database's statement-visibility semantics in mind.
- File naming, registration, and execution order should be stable.
- Persistence code, live schema, and indexes must agree on required columns,
  normalization rules, and uniqueness behavior.
- Shared rate limiting and lock-down behavior should use durable state when the
  platform needs consistent enforcement across requests and restarts.
- Test coverage should protect platform seams and feature contracts.

Why:

- predictable systems are easier to operate
- reliability debt becomes expensive quickly in backend platforms

## 6. Security Is a Default Constraint

Security should be preserved by default, not added later by convention.

- Inputs must be validated at the transport boundary.
- Database access must use parameterized queries.
- Secrets and connection settings must come from environment configuration.
- Error responses must not leak implementation details or sensitive data.
- Authentication features should establish identity and session context without
  absorbing unrelated business management behavior.
- Shared platform security middleware should provide secure-by-default headers.
- Sensitive public routes should have explicit abuse controls, not just correct
  credential checks.
- Suspicious auth behavior should be audit visible through durable events or an
  equivalent shared security record.

Why:

- fast iteration without guardrails creates hard-to-remove risk
- security consistency matters more as feature count grows

## 7. Preserve Replaceability

Implementation details may change, but stable seams should not churn casually.

- Feature entry points should have clear contracts.
- Persistence should be hidden behind feature repositories or equivalent seams.
- Docs, tests, Postman collections, and OpenAPI specs should track externally
  visible behavior.
- A feature may evolve internally without forcing unrelated platform changes.

Why:

- flexibility depends on low-cost internal refactoring
- replaceable parts slow down architecture lock-in

## 8. Optimize For Safe Autonomous Change

Codex or other contributors should be able to move quickly inside clear
boundaries.

- Small feature-local changes may proceed directly when they preserve platform
  contracts.
- Shared platform seams, public API contracts, migration behavior, and security
  posture should not change silently.
- When a change introduces a new enduring rule, capture it in an ADR.
- When a change intentionally breaks an existing pattern, update the architecture
  docs in the same change.

Why:

- speed is only useful if it does not create hidden architectural debt
- explicit guardrails let automation help without quietly fragmenting the system

## 9. Consistency Is Preferable To Local Optimization

One feature should not become special without a strong reason.

- Follow the established feature bundle structure unless there is a documented
  reason not to.
- Follow the established capability, schema, and repository naming discipline
  unless a stronger cross-feature convention replaces it.
- Reuse shared platform conventions for routing, startup, migrations, and error
  handling.
- Prefer the same response and documentation patterns across features where
  practical.

Why:

- consistency compounds over time
- local exceptions create future maintenance cost

## Decision Heuristics

When deciding whether a proposed change is architecturally acceptable:

- Prefer the change if it keeps the platform seam explicit and the feature
  self-contained.
- Be cautious if it adds hidden discovery, special cases, or cross-feature
  coupling.
- Escalate if it changes public contracts, migration identity, security posture,
  startup behavior, or error semantics.
