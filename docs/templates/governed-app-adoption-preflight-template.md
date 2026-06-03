# Governed App Adoption Preflight Template

## Scope

- Governed family or families:
- Consumer surface:
- Route or shell owner:
- Date:
- Status:
  draft / active / approved / blocked

## Purpose

- What app change is being attempted?
- Why is this the right consumer and the right time?
- Why is the work governed adoption rather than a one-off exception?

## Signed-Off Source Truth

- Exact source route:
- Exact reference pack:
- Exact verification checklist:
- Exact behavior-lock artifact:
- If the source truth is split across multiple artifacts, list them explicitly:

## Seam Readiness

- Shared CSS seam:
- Shared render seam:
- Shared controller seam:
- Shared component seam:
- Explicit allowed consumer inputs:
- Component receptor mapping artifact:
- Which required seams are still missing?
- If a seam is missing, what is the stop condition?

## Ownership Boundary

- Family-owned visible regions:
- Host-owned visible regions:
- Family-owned interaction semantics:
- Host-owned workflow or route behavior:
- Approved consumer-specific copy or payload differences:
- Explicitly forbidden local reconstruction:

## Literal Parity Target

- What exact browser result is the consumer supposed to match?
- Which states are mandatory for parity?
- Which states are intentionally deferred?
- Which visible differences are approved in advance?
- Which visible differences would count as drift?

## False-Confidence Checks

- Why would shared CSS alone be insufficient here?
- Why would reused classes or child controls alone be insufficient here?
- Which happy-path tests could still pass while the visible route is wrong?
- Which likely browser-visible failures need direct guards?

## Verification Plan

- Required consumer-level executable tests:
- Required host or shell-parity checks:
- Required real interactive parity states:
- Required human-visible regression guards:
- Required shared-entrypoint parity checks:
- Required manual or screenshot review:

## Escalation Rules

- When should implementation stop and ask for direction?
- What visible ambiguity would be too risky to patch locally?
- What would force the work back into the design-system loop first?

## Outcome

- Proceed now / blocked on missing seam / needs signoff clarification
- Follow-up artifacts required:
