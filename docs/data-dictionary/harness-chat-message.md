# Harness Chat Message

## Summary

- Description:
  Planned append-only message turn for one Layer 1 Build chat conversation.
  Messages preserve the durable transcript without making raw LLM proposals the
  source of truth for accepted Product Discovery facts.
- Owning feature:
  planned `harnessChat`
- Primary source tables or records:
  planned `harness_chat_messages`, planned `HarnessChatMessageRecord`
- Status:
  planned first slice; this dictionary page records source-independent
  persistence intent before implementation.

## Storage Model

- Primary table or durable record:
  planned `harness_chat_messages`
- Related durable records:
  planned `harness_chat_conversations`, planned
  `harness_chat_packet_revisions`
- Primary key:
  planned `message_id`
- Foreign key relationships:
  - planned `conversation_id -> harness_chat_conversations.conversation_id`
  - planned `created_by_root_user_id -> root_user.root_user_id` for
    requester-authored messages

## Capabilities That Rely On This Entity

- `harness-chat.root.message.append`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.conversation.read`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.packet.generate`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`

## Fields

- `message_id`
  Type / Shape: `UUID`
  Description: Generated stable identifier for one message turn.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: API contract.
- `conversation_id`
  Type / Shape: `UUID`
  Description: Owning conversation.
  Constraints / Notes: Required exact route-owned relationship.
  Source: API contract.
- `sequence_number`
  Type / Shape: `INTEGER`
  Description: Monotonic message order within the conversation.
  Constraints / Notes: Unique per conversation; assigned server-side.
  Source: transcript ordering requirement.
- `role`
  Type / Shape: `TEXT`
  Description: Message author class.
  Constraints / Notes: Allowed planned values are `user`, `assistant`, and
  `system`.
  Source: Layer One Runtime Contract.
- `body`
  Type / Shape: `TEXT`
  Description: User-visible message body.
  Constraints / Notes: Empty strings are rejected for user and assistant turns.
  Source: AGENTS validation defaults.
- `accepted_by_harness`
  Type / Shape: `BOOLEAN`
  Description: Whether the turn produced or represents harness-accepted
  discovery state.
  Constraints / Notes: Raw proposals can be retained as transcript evidence
  without becoming accepted structured state.
  Source: Layer One Runtime Contract.
- `created_by_root_user_id`
  Type / Shape: `UUID | NULL`
  Description: Root builder that submitted a user turn.
  Constraints / Notes: Null for system/assistant turns; system-managed when
  present.
  Source: permission mapping.
- `metadata`
  Type / Shape: `JSONB | NULL`
  Description: Non-authority prompt, model, diagnostic, or rendering metadata.
  Constraints / Notes: Not searchable or permission-bearing unless a future
  design promotes specific scalar fields.
  Source: searchable storage defaults.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp.
  Constraints / Notes: System-managed UTC timestamp.
  Source: AGENTS timestamp defaults.

## Indexes And Constraints

- planned primary key on `message_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per message.
  Why It Matters: Stable transcript and audit linkage.
  Source: API contract.
- planned transcript order constraint
  Type: `unique`
  Definition / Rule: unique `conversation_id`, `sequence_number`.
  Why It Matters: Prevents ambiguous transcript order.
  Source: packet-generation source traceability.
- planned conversation transcript index
  Type: `index`
  Definition / Rule: index `conversation_id`, `sequence_number`.
  Why It Matters: Supports detail reads and packet-generation replay.
  Source: API contract detail route.

## Normalization And Uniqueness Rules

- Rule:
  sequence numbers are allocated by the server, not the client.
  Why It Matters:
  avoids client control over transcript history.
  Source: system-managed field defaults.
- Rule:
  `metadata` may not become the only source for durable accepted facts.
  Why It Matters:
  accepted discovery state belongs to conversation state and packet revisions.
  Source: Durable Domain Data Rule.

## Lifecycle Semantics

- State or lifecycle rule:
  messages are append-only in the MVP.
  Meaning:
  later correction is represented by a later turn or packet revision, not by
  mutating history.
  Source: audit and transcript history requirements.
- State or lifecycle rule:
  message append is allowed only while the conversation accepts new turns.
  Meaning:
  closed or incompatible conversations deny new messages.
  Source: API contract.

## Mutation Semantics

- Mutation rule:
  append user message through root-admin API.
  Effect on stored fields:
  creates message id, conversation id, sequence number, role, body, actor, and
  timestamp; refreshes the parent conversation `updated_at`.
  Source: API contract.
- Mutation rule:
  append assistant/system message through harness orchestration.
  Effect on stored fields:
  creates transcript evidence and may update accepted structured discovery
  state on the parent conversation.
  Source: Layer One Runtime Contract.

## Cross-Feature Read Seams

- Exported seam:
  planned `HarnessChatTranscriptReader`
  Consumer:
  Product Discovery adapter and root-admin history UI.
  Allowed read shape:
  authorized ordered transcript plus accepted-state markers.
  Source: API contract and runtime contract.

## Compliance Classification And Governance

- Data classification:
  sensitive internal product metadata; possible customer, tenant, employee, or
  operational context supplied by requester.
- PII posture:
  possible.
- Privacy notes:
  transcript is root-admin internal in the MVP and must not be exported in the
  generated PDF unless a later product and architecture decision approves it.
- Audit relevance:
  high. Messages form the evidence trail for generated packet revisions.
- Retention / delete posture:
  follows the owning conversation retention posture.

## Compliance And Enforcement Trace

| Rule / Standard | Applies | Repo Enforcement Posture | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable Domain Data Rule | yes | enforced-by-maintained-artifact | this dictionary; PRD | Transcript history is planned durable data and cannot be replaced by compact summaries. |
| System-Managed Fields | yes | manual-review-required | future API tests | Message id, order, actor, and timestamps must be server-owned. |
| Searchable Storage Rules | yes | documented-not-enforced | this dictionary | JSON metadata is not approved as a scalable search field. |
| Runtime Bug Fix Evidence Gate | future | manual-review-required | future runtime evidence plan | Browser transcript fixtures must match live API shape. |

## Migration Compatibility Notes

- First implementation should use a new migration with stable sortable prefix.
- Any future redaction, legal hold, or hard-delete behavior needs an explicit
  lifecycle and compatibility plan.
