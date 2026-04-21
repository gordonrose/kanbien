# ADR 0023: Maintain Frontend Architecture With A Dedicated Overview And ADR Guard

- Status: Accepted
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

The repo now has enough frontend surface area that "look at `src/frontend` and
infer the shape" is no longer a safe maintenance pattern.

Several frontend architecture facts already matter operationally and
architecturally:

- same-origin browser delivery
- separate frontend ownership under `src/frontend/`
- file-routed governed `/design-system` pages
- hash-routed `rootAdminShell` states
- browser-cookie root-admin sessions
- localhost helper integration for SSH proof
- durable frontend discovery and curated hierarchy seams

Those facts were spread across implementation files, feature docs, and earlier
ADRs, but the repo did not yet have:

- one maintained current-state frontend architecture overview
- one explicit repo skill for keeping that view current
- one guard that stops architecture-sensitive frontend changes from landing
  without ADR attention

That made frontend architecture drift more likely and made it too easy for
lasting frontend platform decisions to stay implicit in code.

## Decision

Adopt this maintenance pattern for frontend architecture:

- keep a dedicated current-state frontend architecture document at
  `docs/architecture/frontend-overview.md`
- treat that overview as the current-state frontend map, distinct from ADRs
  that record enduring decisions
- add a repo-local Codex skill that maintains frontend architecture docs and
  checks whether an ADR is required when frontend seams change
- add a repo-local pre-commit guard that detects architecture-sensitive
  frontend changes and requires staged updates to:
  - `docs/architecture/frontend-overview.md`
  - at least one ADR under `docs/architecture/adr/`

The guard is intentionally scoped to frontend architecture-sensitive files such
as:

- frontend routers and discovery seams
- app-level frontend mounting
- frontend delivery/build copy behavior
- frontend-related package/runtime wiring that can reshape the browser
  architecture

The guard is not intended to require ADR updates for every visual or
page-local frontend change.

## Consequences

### Positive

- frontend architecture now has one current-state source of truth
- enduring frontend decisions are less likely to stay trapped in code-only
  changes
- repo-local AI workflows get an explicit routing target for frontend
  architecture maintenance
- frontend architecture documentation becomes easier to audit for drift

### Negative

- architecture-sensitive frontend changes now have more process overhead
- the pre-commit guard may need tuning over time if it proves too narrow or too
  noisy
- developers need to enable the repo-local hooks path for the guard to run
  automatically

### Neutral / Follow-up

- keep the guard file-pattern list conservative and adjust it when real misses
  or false positives appear
- continue using older ADRs such as `0013`, `0014`, and `0022` for the product
  decisions they already own rather than rewriting them
- prefer a new ADR over silently stretching older frontend ADRs when a new
  lasting frontend pattern appears
