# Discovery Packet Readiness Snapshot

## Summary

- Description:
  Planned deterministic snapshot showing whether enough is known to generate a
  useful Product Discovery packet.
- Owning feature:
  TBD with Discovery Chat or future Discovery Intelligence owner.
- Status:
  planned.

## Fields

- `packet_readiness_snapshot_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one readiness evaluation.
- `discovery_session_id`
  Type / Shape: `UUID`
  Description: Session evaluated.
- `readiness_state`
  Type / Shape: `TEXT`
  Description: `notReady`, `partiallyReady`, `readyWithAssumptions`,
  `readyForReview`, or `blocked`.
- `dimension_scores`
  Type / Shape: `JSONB`
  Description: Actor, workflow, problem, restraint, outcome, routing,
  implementation fit, evidence, assumption, and confirmation readiness.
- `confidence_percent`
  Type / Shape: `NUMERIC`
  Description: Deterministic coverage score after hard-gate clamping.
- `blockers`
  Type / Shape: `JSONB`
  Description: Unknowns that could invalidate route, hard restraints, actor,
  scope, or packet usefulness.
- `assumptions`
  Type / Shape: `JSONB`
  Description: Safe assumptions accepted or stated for the packet.
- `final_confirmation_state`
  Type / Shape: `TEXT`
  Description: notAsked, asked, answered, or superseded.

## Governance Notes

- Readiness does not require everything to be known.
- A packet is not ready when an unknown could invalidate route, violate a hard
  restraint, change the primary actor, materially alter scope, or undermine
  packet usefulness.
