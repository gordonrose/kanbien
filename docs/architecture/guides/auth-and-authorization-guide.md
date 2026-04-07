# Authentication And Authorization Guide

## Purpose

Explain how authentication and authorization should stay separate, and where
future role/capability enforcement belongs in the repo.

## Current State

The current repo has:

- explicit authentication through `rootAuth`
- root-user lifecycle ownership in `rootUsers`
- shared request auth-context establishment
- browser and bearer transport variants for sessions
- a documented current authorization mapping for the live `RootUserAdmin`
  boundary under `docs/architecture/permission-mappings/`

The repo also has an initial enduring future authorization direction captured in:

- [`ADR-0016`](../adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md)
- [`2026-03-30-0003-tenant-role-based-authorization-architecture.md`](../../prd/2026-03-30-0003-tenant-role-based-authorization-architecture.md)

That tenant-scoped implementation is still pending, but the intended
architecture is now documented rather than left implicit.

## Separation Rule

- `rootAuth` establishes identity and session context.
- Business features must not embed unrelated authentication concerns.
- Authorization decisions should be capability-specific, explicit, and routed
  through the central authorization seam rather than being re-implemented
  inside feature logic.

## Future Authorization Expectations

For every privileged capability, the docs should define:

- allowed roles
- minimum role required
- explicitly denied roles when a later model introduces denies
- frontend visibility rule
- backend enforcement rule
- audit expectations for actor role capture

## Enforcement Rule

- Frontend may hide or disable capability surfaces.
- Backend must remain authoritative and enforce permission rules regardless of
  UI behavior.

## Recoverability Rule

To rebuild authorization safely from specs, the repo needs:

- role definitions
- capability-to-role mapping
- persistence location of role assignments
- session/bootstrap exposure rules
- backend enforcement seam
- test expectations for allow and deny paths

For the current intended model, it also needs:

- tenant membership model
- tenant role copy and divergence rules
- capability catalog ownership
- scope evaluation model for reads and lists
- inheritance and relation-resolution rules
- authorization audit model

## Current Documentation Expectation

For the current implemented root boundary, privileged capabilities should align
with the live permission mapping docs.

For future feature sets that introduce new roles or permissions, every new
privileged capability should at least declare:

- authentication requirement
- intended authorization shape
- where the future permission rule will be enforced

Now that the dedicated architecture is defined, new authorization-sensitive
work should align with the ADR/PRD pair above instead of inventing local role
or capability patterns.
