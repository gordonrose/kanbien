# Discovery Outcome Node

## Summary

- Description:
  Planned contextual OKR/outcome inference node used to relate a discovery
  request to measurable value.
- Owning feature:
  TBD; official OKR records are likely owned by a future planning/strategy
  feature, not Discovery Chat.
- Status:
  planned.

## Fields

- `outcome_node_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one inferred outcome node.
- `node_type`
  Type / Shape: `TEXT`
  Description: `strategicObjective`, `businessObjective`,
  `departmentObjective`, `teamObjective`, `workflowObjective`,
  `userOutcome`, `customerOutcome`, `keyResult`, `metricCandidate`,
  `riskReductionOutcome`, `efficiencyOutcome`, `qualityOutcome`,
  `complianceOutcome`, `revenueOutcome`, `retentionOutcome`, or
  `costReductionOutcome`.
- `label`
  Type / Shape: `TEXT`
  Description: Human-readable inferred outcome or metric candidate.
- `confidence`
  Type / Shape: `NUMERIC`
  Description: Evidence-backed confidence.
- `status`
  Type / Shape: `TEXT`
  Description: active, reviewQueue, stale, dismissed, or linkedToRecord.
- `official_record_reference`
  Type / Shape: `JSONB | NULL`
  Description: Optional reference to an official outcome record.
  Constraints / Notes: Reference only; Discovery must not silently create or
  update official OKRs.

## Governance Notes

- Outcome inference is contextual intelligence, not official strategy.
- Do not invent company OKRs; infer cautiously and label assumptions.
