# Discovery Intelligence Session

## Summary

- Description:
  Planned compact working-state record for one persistence-backed Discovery
  Chat session.
- Owning feature:
  TBD: `harnessChat`, future `discoveryIntelligence`, or another approved
  owner.
- Primary source tables or records:
  planned only; no table approved by this page.
- Status:
  planned.

## Storage Model

- Primary table or durable record:
  TBD.
- Related durable records:
  `harness_chat_conversations`, discovery inference facts, evidence links,
  conversation decisions, readiness snapshots, and learning backlog items.
- Primary key:
  planned `discovery_session_id`.

## Fields

- `discovery_session_id`
  Type / Shape: `UUID`
  Description: Stable identifier for the discovery intelligence session.
  Constraints / Notes: System-managed.
- `harness_chat_conversation_id`
  Type / Shape: `UUID`
  Description: Optional link to the app chat conversation that owns the
  session in the root-admin MVP.
  Constraints / Notes: Must not become authority for record-account mutation.
- `compact_working_state`
  Type / Shape: `JSONB`
  Description: Current actor, workflow, problem, route, restraints,
  assumptions, open questions, and next best action.
  Constraints / Notes: Working memory only; not official record truth.
- `execution_tier`
  Type / Shape: `TEXT`
  Description: Current runtime tier: `tier0`, `tier1`, `tier2`, or `tier3`.
  Constraints / Notes: Drives token and catalogue loading discipline.
- `active_blockers`
  Type / Shape: `JSONB`
  Description: Current packet blockers and unresolved material questions.
  Constraints / Notes: Must distinguish blockers from deferred learning.
- `created_at`, `updated_at`, `deleted_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Lifecycle timestamps.
  Constraints / Notes: System-managed; soft delete requires future approval.

## Lifecycle Semantics

- Session state may change every turn.
- Session state may summarize transcript evidence, but it must not replace
  durable messages as source evidence.
- Closing or abandoning a chat session must preserve packet-relevant evidence
  according to the owning feature's retention policy.

## Governance Notes

- This record is session working memory under Context Account Architecture.
- It may reference official record accounts and inference accounts, but it must
  not pollute either.
