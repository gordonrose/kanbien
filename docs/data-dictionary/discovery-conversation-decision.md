# Discovery Conversation Decision

## Summary

- Description:
  Planned deterministic record of why Discovery Chat chose its next action.
- Owning feature:
  TBD with Discovery Chat or future Discovery Intelligence owner.
- Status:
  planned.

## Fields

- `conversation_decision_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one decision.
- `discovery_session_id`
  Type / Shape: `UUID`
  Description: Session that owns the decision.
- `message_id`
  Type / Shape: `UUID | NULL`
  Description: Optional source message that triggered the decision.
- `decision_mode`
  Type / Shape: `TEXT`
  Description: `askNow`, `inferAndProceed`, `stateAssumption`,
  `recommendBestPractice`, `recommendWithTradeoff`,
  `recommendCheapestLowRiskPath`, `deferToLearningBacklog`,
  `summarizeAndConfirm`, `routeForReview`, `markBlocked`, or
  `generatePacket`.
- `execution_tier`
  Type / Shape: `TEXT`
  Description: Tier selected for this turn.
- `catalogues_loaded`
  Type / Shape: `JSONB`
  Description: Catalogue keys loaded for the decision.
- `decision_reason`
  Type / Shape: `TEXT`
  Description: Human-readable reason for the selected mode.
- `llm_used`
  Type / Shape: `BOOLEAN`
  Description: Whether token-consuming handling was used.

## Governance Notes

- Deterministic handling comes first; LLM handling is second and must operate
  inside the selected next-step envelope.
