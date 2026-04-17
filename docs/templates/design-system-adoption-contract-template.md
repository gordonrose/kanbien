# Design System Adoption Contract Template

## Scope

- Component or pattern family:
- Status:
  draft / active / completed
- First consumer surface:
- Route or shell owner:
- Source pattern artifact:
- Source reference pack:
- Source verification checklist:

## Purpose

- What business or workflow need is this adoption serving?
- Why is this the right first consumer?
- Why is adoption happening now instead of remaining design-system-only?

## Capability And Workflow Mapping

- Capability source:
  capability matrix / feature loop / route slice / workflow note
- Primary actor:
- Permission or capability rules:
- Route ownership:
- Workflow states in scope:
- Workflow states explicitly deferred:

## Pattern Mapping

- Signed-off pattern being adopted:
- Required behavior-lock IDs:
- Required canonical reference states:
- Which parts of the pattern are mandatory for parity?
- Which parts are intentionally deferred in this first consumer?

## Consumer Contract

- Primary destinations:
- Utility actions:
- Profile or preference actions:
- Loading / empty / denied states:
- Error or degraded states:
- Localization / long-label expectations:

## Consumer Framing

- Is this shell chrome or page content?
- Attached to adjacent chrome or intentionally floating?
- Full-width or intentionally contained?
- Shared gutter / alignment expectations:
- Elements that must align across rows:
- Browser-native controls or affordances that must coexist with custom UI:

## Parity Rules

- Must match reference pack:
- May differ intentionally:
- Must not drift:
- Required parity evidence:
- Required real interactive parity states:
- Required consumer-level shell-parity evidence:

## Adoption Boundary

- What existing local UI is being replaced?
- What backend seams or APIs must remain untouched?
- What page-local behavior is allowed for the POC?
- What is explicitly out of scope?

## Verification

- Required rendered checks:
- Required executable tests:
- Required manual sign-off steps:
- Known blockers or environment constraints:

## Canonical And Consumer Truth

- Canonical states this consumer depends on:
- Consumer-specific states not fully proven by canonicals alone:
- Render-ready or parity constraints for screenshots:

## Promotion Decision

- Adoption result:
  candidate / adopted / needs-review
- Follow-up work required before wider reuse:
- Follow-up work required before extraction into a shared primitive:
