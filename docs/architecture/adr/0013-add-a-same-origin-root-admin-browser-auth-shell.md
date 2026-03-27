# ADR 0013: Define Initial Browser Frontend Architecture

## Status

Accepted

## Context

The platform has moved beyond an API-only shape and now needs a durable browser
frontend strategy.

Several frontend decisions came up together:

- whether browser surfaces should be same-origin or separate-origin
- whether admin UI should default to SPA or SSR
- how frontend code should live in the repo without weakening backend feature
  modularity
- how browser auth should differ from API/manual auth
- how CSP should evolve once the platform serves browser HTML
- whether internal admin UI should adopt GraphQL immediately or stay on REST

These decisions are broader than a single delivery slice and should remain
visible even as individual browser capabilities evolve.

## Decision

Adopt these initial browser frontend architecture rules:

- browser admin surfaces are same-origin externally
- browser frontend and backend may remain separate operational units behind a
  composed same-origin runtime
- SPA is the default model for admin/browser-application surfaces
- brochure/public pages may evaluate SSR separately later
- frontend code lives in a separate app area and must not be mixed into backend
  feature domain/persistence/transport folders
- backend feature seams remain HTTP/API contracts rather than internal imports
- browser auth should use browser-oriented cookie transport rather than
  JS-managed bearer tokens
- REST remains the initial frontend integration surface
- GraphQL remains a future internal option for admin UX only if real frontend
  complexity justifies it later
- each capability must still be evaluated for browser-rendered/orchestrated
  execution versus server-executed generation or processing
- CSP for browser surfaces follows least privilege and expands only when a real
  capability requires it

## Consequences

### Positive

- the platform now has a stable frontend direction beyond any one deliverable
- same-origin admin surfaces keep cookie/CORS/origin behavior simpler than a
  separate-origin model
- SPA remains a natural default for admin tooling without forcing SSR onto
  internal browser apps
- backend feature modularity is protected because browser code stays in a
  separate app area
- REST can continue to power early browser work without closing off future
  internal GraphQL exploration

### Negative

- the platform now has to own browser-surface concerns such as CSP, cookie
  auth, and frontend deployment shape
- some implementation choices will need narrower ADRs or PRDs, because this ADR
  intentionally stays broad
- same-origin browser strategy does not remove the need to revisit external API
  architecture later

### Follow-Up

- root-user browser auth details should be captured separately from these broad
  frontend rules
- future tenant-admin frontend remains a separate product/auth decision
- future brochure/public pages may revisit SSR separately
- future external integration APIs may introduce a hybrid model later without
  invalidating this initial browser strategy
