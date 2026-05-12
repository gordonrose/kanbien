# Discovery Learning Backlog Item

## Summary

- Description:
  Planned record for useful future learning that should not block the current
  Product Discovery packet.
- Owning feature:
  TBD with Discovery Chat or future Discovery Intelligence owner.
- Status:
  planned.

## Fields

- `learning_backlog_item_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one learning item.
- `subject_type`
  Type / Shape: `TEXT`
  Description: `organization`, `actorProfile`, `workflow`, `problem`,
  `outcome`, `restraint`, `terminology`, or `preference`.
- `subject_id`
  Type / Shape: `TEXT | UUID | NULL`
  Description: Optional scoped subject reference.
- `question_intent`
  Type / Shape: `TEXT`
  Description: Why the system may ask later.
- `what_we_want_to_learn`
  Type / Shape: `TEXT`
  Description: Specific future learning need.
- `why_it_may_matter`
  Type / Shape: `TEXT`
  Description: Impact if learned later.
- `priority`
  Type / Shape: `TEXT`
  Description: low, medium, high, or blocking-before-later-stage.
- `ask_when`
  Type / Shape: `TEXT`
  Description: `nextRelevantSession`, `whenSameActorAppears`,
  `whenWorkflowRepeats`, `beforeImplementation`, `beforeRouting`, or
  `beforePacketApproval`.
- `source_discovery_session_id`
  Type / Shape: `UUID`
  Description: Session where the item was created.
- `source_evidence_message_ids`
  Type / Shape: `UUID[]`
  Description: Message evidence that led to the learning item.
- `status`
  Type / Shape: `TEXT`
  Description: `open`, `asked`, `answered`, `deferred`, `dismissed`, or
  `stale`.

## Governance Notes

- The learning backlog prevents discovery from becoming an interrogation.
- Ask now only when the answer changes the current packet, routing, risk,
  scope, or confidence.
