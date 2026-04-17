# Frontend Implementation Guide

## Purpose

Define how browser surfaces should be added without collapsing backend feature
modularity or weakening browser security posture.

## Current Direction

The repo currently supports:

- same-origin browser delivery
- composed same-origin operational topology
- SPA-style admin surfaces
- cookie-backed browser sessions for browser surfaces

See ADRs `0013` and `0014` for the enduring architecture decisions behind the
current browser shape.

## Frontend Ownership Rules

- Frontend code should live in its own app area, not inside backend feature
  domain or persistence folders.
- Browser code may consume backend capabilities only through approved public
  HTTP/API contracts.
- Same-origin runtime does not mean shared code ownership boundaries.

## Governed UI Adoption Rule

When a frontend surface is supposed to come from the design system, do not
implement that UI in the real app before it has been signed off through the
`/design-system` loop unless the user has explicitly approved a one-off
exception.

Before app implementation begins for a governed family, the design-system
chain should already have the relevant:

- behavior lock
- canonical/reference truth
- verification artifact
- adoption contract or note

If those are missing, do the design-system governance work first instead of
using the app as the proving ground.

## Frontend Capability Checklist

Every frontend capability should define:

- route or launch surface
- page, modal, panel, or shell location
- required session/bootstrap behavior
- loading, empty, success, error, and expiry states
- client-side permission visibility rules
- backend fallback behavior for denied/expired/error states

## Browser Security Expectations

When a frontend capability changes browser behavior, review:

- CSP impact
- cookie/session implications
- CSRF implications
- localhost or privileged bridge behavior if applicable
- storage rules for sensitive state

## Recoverability Rule

To rebuild frontend behavior from specs, the docs must describe:

- route
- UI surface
- states
- permission visibility
- backend API dependency
- session/expiry behavior
- browser-security implications
