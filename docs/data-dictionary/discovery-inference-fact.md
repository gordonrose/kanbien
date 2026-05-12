# Discovery Inference Fact

## Summary

- Description:
  Planned evidence-backed discovery intelligence fact about an organization,
  actor profile, workflow, problem, hard restraint, outcome, terminology,
  preference, or opportunity economics signal.
- Owning feature:
  TBD: `harnessChat`, future `discoveryIntelligence`, subject-owning feature,
  or platform context/intelligence service.
- Status:
  planned.

## Storage Model

- Primary table or durable record:
  TBD.
- Related durable records:
  discovery evidence links, discovery sessions, learning backlog items, and
  record accounts referenced through public seams.
- Primary key:
  planned `inference_fact_id`.

## Fields

- `inference_fact_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one inference fact.
  Constraints / Notes: System-managed.
- `subject_type`
  Type / Shape: `TEXT`
  Description: Subject family such as `organization`, `actorProfile`,
  `workflow`, `problem`, `restraint`, `outcome`, `terminology`, or
  `preference`.
- `subject_id`
  Type / Shape: `TEXT | UUID | NULL`
  Description: Optional scoped subject reference.
  Constraints / Notes: References record accounts without mutating them.
- `category_key`
  Type / Shape: `TEXT`
  Description: Governed inference category from the relevant catalogue.
- `value`
  Type / Shape: `JSONB`
  Description: Structured inferred value.
- `confidence`
  Type / Shape: `NUMERIC`
  Description: Confidence score or band.
  Constraints / Notes: Must be derived from rules/evidence, not raw model vibe.
- `status`
  Type / Shape: `TEXT`
  Description: `active`, `reviewQueue`, `approvalRequired`, `stale`,
  `contradicted`, or `dismissed`.
- `evidence_summary`
  Type / Shape: `TEXT`
  Description: Short human-readable basis for the inference.
- `created_at`, `updated_at`, `deleted_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Lifecycle timestamps.

## Lifecycle Semantics

- Inferences may be created, strengthened, marked stale, contradicted, queued
  for review, or dismissed.
- Merges, splits, and official record synchronization require governed UX or
  approved feature seams.

## Governance Notes

- No durable inference without evidence.
- Inference can challenge, qualify, or contextualize a record, but it must not
  silently become official truth.
