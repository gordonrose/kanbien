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

The repo does **not yet** have a fully documented enduring authorization model
for differentiated root-user roles and capability-specific permission checks.

That missing decision should be captured by a dedicated PRD and, if enduring,
an ADR when the role/capability model is finalized.

## Separation Rule

- `rootAuth` establishes identity and session context.
- Business features must not embed unrelated authentication concerns.
- Authorization decisions should be capability-specific and explicit.

## Future Authorization Expectations

For every privileged capability, the docs should define:

- allowed roles
- minimum role required
- explicitly denied roles
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

## Current Documentation Expectation

Until the dedicated authorization architecture is defined, every new privileged
capability should at least declare:

- authentication requirement
- intended authorization shape
- where the future permission rule will be enforced
