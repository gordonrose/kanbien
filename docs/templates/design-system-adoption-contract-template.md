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

## Governed Adoption Preflight

- Exact signed-off source route or render surface:
- Exact reference pack or canonical source:
- Shared CSS seam:
- Shared render seam:
- Shared controller seam:
- Family-owned visible regions:
- Host-owned visible regions:
- Approved intentional deviations before implementation:
- Shared-entrypoint parity expectation:
  identical to canonical / intentionally narrower / not yet decided
- Stop condition if a required seam is missing:

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
- What would count as false confidence here?
  shared CSS / reused classes / reused child controls / happy-path tests / other
- Required parity evidence:
- Required real interactive parity states:
- Required consumer-level shell-parity evidence:
- Required human-visible regression guards:

## Adoption Boundary

- What existing local UI is being replaced?
- What backend seams or APIs must remain untouched?
- What page-local behavior is allowed for the POC?
- What is explicitly out of scope?

## Verification

- Required rendered checks:
- Required executable tests:
- Required manual sign-off steps:
- Required consumer-level route proof:
- Required shared-entrypoint parity proof:
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
