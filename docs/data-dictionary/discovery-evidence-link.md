# Discovery Evidence Link

## Summary

- Description:
  Planned provenance record explaining why the discovery engine believes a
  fact, decision, restraint, route, readiness state, or packet claim.
- Owning feature:
  TBD with discovery inference ownership.
- Status:
  planned.

## Storage Model

- Primary table or durable record:
  TBD.
- Related durable records:
  discovery inference facts, hard-restraint assessments, conversation
  decisions, readiness snapshots, packet revisions, harness chat messages, and
  audit/proof artifacts.

## Fields

- `evidence_link_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one evidence link.
- `target_type`
  Type / Shape: `TEXT`
  Description: Record type the evidence supports, such as inference,
  restraint, route, readiness, packet claim, assumption, or learning item.
- `target_id`
  Type / Shape: `UUID | TEXT`
  Description: Identifier of the supported target.
- `evidence_type`
  Type / Shape: `TEXT`
  Description: `recordBackedTruth`, `userStatedFact`, `cataloguePolicyMatch`,
  `llmInference`, `derivedCalculation`, `assumption`, `openQuestion`, or
  `deferredLearning`.
- `source_reference`
  Type / Shape: `JSONB`
  Description: Pointer to message id, record id, catalogue key, audit event,
  packet revision, or other approved source.
- `confidence_contribution`
  Type / Shape: `NUMERIC | NULL`
  Description: Optional contribution to the supported confidence score.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: System-managed creation timestamp.

## Governance Notes

- Raw transcript can be fallback evidence, but structured evidence links should
  be the primary runtime source.
- Packet claims must have evidence, assumption status, or open-question status.
