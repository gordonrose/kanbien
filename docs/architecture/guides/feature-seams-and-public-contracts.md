# Feature Seams And Public Contracts Guide

## Purpose

Define how features remain modular, replaceable, and contamination-resistant.

This guide complements the feature-bundle ADRs by describing the repeatable
rules that every feature should follow.

## Feature Ownership

Each feature should own:

- its API-facing contract
- its business capabilities
- its persistence seam
- its transport layer
- its platform integration entry point

Platform code should not know feature internals.

## Public vs Private Feature Surface

### Public

Public feature seams belong in:

- `index.ts`
- explicitly approved exported helpers such as a narrow auth-state reader

### Private

Private feature internals include:

- `persistence/*` implementations
- DB-facing record types
- router-local request handling details
- internal utility modules that are not explicit seams

## Cross-Feature Rules

- One feature must not import another feature's `persistence/*` files directly.
- Cross-feature reads must go through a narrow exported seam from the owning
  feature.
- Public seams should be capability-specific, not broad “feature access”
  bundles.
- Shared `src/lib/*` modules must remain feature-agnostic.

## Capability Design Expectations

Each feature should split behavior into explicit capabilities:

- exact lookup
- list or search
- create
- update
- delete/reactivate/remove
- other business actions with one clear responsibility

Avoid combining multiple distinct behaviors into one generic handler.

## Contract Expectations

Every externally visible capability should define:

- request contract
- response contract
- error contract
- authentication requirement
- authorization requirement when applicable
- persistence impact
- test expectations

These may be described across:

- capability matrix
- PRD
- PRD-derived test-case doc
- feature docs
- API contract template or manifest

## Build-From-Spec Expectations

A spec-driven implementation should make clear:

- which feature owns the capability
- which seams are public
- which seams are cross-feature only
- which seams remain private
- where traceability and tests will anchor the capability
