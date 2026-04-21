# Design System Component POC Checklist

Use this checklist when a signed-off `/design-system` family is becoming its
first real app consumer.

## Preconditions

- behavior lock completed
- signed-off reference pack exists
- canonical routes exist for required states
- human sign-off recorded
- Playwright or equivalent visual lock exists for the required canonical set
- token candidacy review completed
- source pattern artifact exists
- first app consumer is named

## Adoption Contract

- adoption contract exists for the consumer
- capability or workflow mapping is explicit
- route ownership is explicit
- permission-aware visibility rules are explicit
- deferred behavior is recorded

## Implementation Guardrails

- browser-auth, persistence, API, or session seams being preserved are named
- route-local POC boundaries are explicit
- intentional deviations from the reference pack are recorded
- no opportunistic redesign is bundled into the first consumer
- consumer framing is explicit:
  shell chrome or page content
- attachment model is explicit:
  attached to adjacent chrome or intentionally floating
- width model is explicit:
  full-width or intentionally contained
- horizontal gutter and alignment expectations are explicit

## Parity Checks

- desktop shell compared to reference pack
- shell framing compared to the signed-off contract
- top-nav or adjacent-chrome attachment checked when relevant
- first-item / edge alignment checked when relevant
- overflow state compared to reference pack
- mobile state compared to reference pack
- profile or utility interactions compared to reference pack
- RTL checked when relevant
- magnification checked when relevant
- long-label behavior checked when relevant
- truncation and tooltip recovery checked when relevant
- real interactive states checked when relevant:
  filled input, native browser affordances, open menus, or compact modes
- browser-native affordance coexistence checked when relevant
- theme or accent inheritance checked when relevant

## Verification

- targeted executable tests added or updated
- rendered proof exists for the consumer
- regression or reconciliation notes added when an escaped issue surfaced
- known gaps are recorded honestly

## Promotion Decision

- result marked:
  candidate / adopted / needs-review
- next step identified:
  parity cleanup / second consumer / shared primitive extraction
