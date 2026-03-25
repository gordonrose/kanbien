# ADR-0003: Use Explicit Feature Registration At The Platform Router

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform wants feature addition to be cheap, but it also needs route
registration and dependency wiring to remain obvious. Automatic discovery of
feature routers would reduce one manual step, but it would also make runtime
composition less explicit and harder to audit.

## Decision

Mount feature routers explicitly in `src/routes/v1/index.ts`.

The platform router is responsible for:

- importing feature entry points
- selecting mount paths
- passing shared dependencies into features

Feature folders alone do not activate features at runtime.

## Consequences

### Positive

- route wiring is easy to find and review
- mount paths remain under deliberate platform control
- shared dependency injection stays explicit

### Negative

- each new feature requires one manual platform registration step
- there is no plug-and-play runtime discovery

### Neutral / Follow-up

- if explicit registration becomes a bottleneck later, a future ADR can revisit
  discovery or generated manifests
- the current trade-off favors clarity over maximum automation
