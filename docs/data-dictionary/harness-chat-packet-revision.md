# Harness Chat Packet Revision

## Summary

- Description:
  Planned durable generated Product Discovery packet version created from one
  Build chat conversation, including immutable packet data linkage,
  supersession, lifecycle state, and PDF readiness metadata.
- Owning feature:
  planned `harnessChat`
- Primary source tables or records:
  planned `harness_chat_packet_revisions`, planned
  `HarnessChatPacketRevisionRecord`
- Status:
  planned first slice; this dictionary page records source-independent
  persistence intent before implementation.

## Storage Model

- Primary table or durable record:
  planned `harness_chat_packet_revisions`
- Related durable records:
  planned `harness_chat_conversations`, planned `harness_chat_messages`,
  planned `harness_chat_pdf_attempts`, Product Discovery packet artifacts
- Primary key:
  planned `packet_revision_id`
- Foreign key relationships:
  - planned `conversation_id -> harness_chat_conversations.conversation_id`
  - planned `generated_by_root_user_id -> root_user.root_user_id`
  - planned `previous_packet_revision_id -> harness_chat_packet_revisions.packet_revision_id`
  - planned `next_packet_revision_id -> harness_chat_packet_revisions.packet_revision_id`

## Capabilities That Rely On This Entity

- `harness-chat.root.packet.generate`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.packet.read`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.packet.downloadPdf`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`

## Fields

- `packet_revision_id`
  Type / Shape: `UUID`
  Description: Generated stable identifier for one packet revision.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: API contract.
- `conversation_id`
  Type / Shape: `UUID`
  Description: Source conversation.
  Constraints / Notes: Required.
  Source: API contract.
- `product_request_id`
  Type / Shape: `UUID | TEXT | NULL`
  Description: Linked Product Request summary/index when available.
  Constraints / Notes: Exact type depends on Product Request persistence model.
  Source: Product Request model.
- `version`
  Type / Shape: `INTEGER`
  Description: Monotonic revision number within the conversation.
  Constraints / Notes: Unique per conversation; assigned server-side.
  Source: packet supersession requirements.
- `state`
  Type / Shape: `TEXT`
  Description: Packet revision lifecycle state.
  Constraints / Notes: Allowed MVP states are `draft`, `generated`,
  `pdf-ready`, `downloaded`, `superseded`, and `failed`.
  Source: PRD lifecycle states.
- `product_discovery_packet_path`
  Type / Shape: `TEXT | NULL`
  Description: Source-independent artifact path for the generated Product
  Discovery packet, when a file artifact is produced.
  Constraints / Notes: Path is evidence/linkage, not download authority.
  Source: Product Discovery packet workflow.
- `packet_data`
  Type / Shape: `JSONB`
  Description: Harness-accepted canonical Product Discovery packet data used
  for PDF generation and later review.
  Constraints / Notes: Must preserve approved packet facts; raw transcript is
  excluded from PDF source unless later approved.
  Source: PRD and PDF decision record.
- `source_message_sequence_max`
  Type / Shape: `INTEGER`
  Description: Highest conversation message sequence included in generation.
  Constraints / Notes: Supports source traceability and mock-honesty review.
  Source: packet generation source requirement.
- `previous_packet_revision_id`
  Type / Shape: `UUID | NULL`
  Description: Prior packet revision in the conversation history.
  Constraints / Notes: Maintained during supersession.
  Source: PDF and packet history decisions.
- `next_packet_revision_id`
  Type / Shape: `UUID | NULL`
  Description: Next packet revision in the conversation history.
  Constraints / Notes: Maintained during supersession.
  Source: PDF and packet history decisions.
- `generated_by_root_user_id`
  Type / Shape: `UUID`
  Description: Root builder that requested generation.
  Constraints / Notes: System-managed actor fact.
  Source: permission mapping.
- `generated_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time generation completed.
  Constraints / Notes: UTC timestamp.
  Source: PRD audit requirements.
- `superseded_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time this revision stopped being current.
  Constraints / Notes: Set when a newer successful revision supersedes it.
  Source: packet supersession requirement.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp.
  Constraints / Notes: System-managed UTC timestamp.
  Source: AGENTS timestamp defaults.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last mutation timestamp.
  Constraints / Notes: Refreshed on every successful lifecycle update.
  Source: AGENTS mutation defaults.

## Indexes And Constraints

- planned primary key on `packet_revision_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per packet revision.
  Why It Matters: Stable route and PDF attempt linkage.
  Source: API contract.
- planned revision order constraint
  Type: `unique`
  Definition / Rule: unique `conversation_id`, `version`.
  Why It Matters: Prevents duplicate version labels.
  Source: packet history requirements.
- planned current revision index
  Type: `index or partial unique index`
  Definition / Rule: implementation must make current/non-superseded lookup
  deterministic for each conversation.
  Why It Matters: Avoids ambiguous current packet state.
  Source: API contract latest packet fields.
- planned generation actor index
  Type: `index`
  Definition / Rule: index `generated_by_root_user_id`, `generated_at DESC`.
  Why It Matters: Supports audit and operational review.
  Source: audit requirements.

## Normalization And Uniqueness Rules

- Rule:
  packet version and previous/next relationships are server-managed.
  Why It Matters:
  avoids client-controlled packet history.
  Source: system-managed field defaults.
- Rule:
  packet data is the approved source for PDF rendering.
  Why It Matters:
  prevents raw transcript or internal notes from leaking into PDF output.
  Source: asset consumer decision record.

## Lifecycle Semantics

- State or lifecycle rule:
  successful generation creates an immutable packet revision.
  Meaning:
  material changes create a new revision instead of mutating approved data.
  Source: PDF decision record.
- State or lifecycle rule:
  a newer successful revision supersedes the prior current revision.
  Meaning:
  superseded revisions remain authorized history for root builders in MVP.
  Source: PRD lifecycle requirements.
- State or lifecycle rule:
  PDF readiness/download state does not erase generation history.
  Meaning:
  PDF failures are tracked separately in PDF attempts.
  Source: asset consumer decision record.

## Mutation Semantics

- Mutation rule:
  generate packet from authorized conversation.
  Effect on stored fields:
  creates packet revision, version, packet data, source watermark, actor,
  timestamps, and supersession links.
  Source: API contract.
- Mutation rule:
  mark PDF-ready or downloaded.
  Effect on stored fields:
  updates lifecycle state only after authorized PDF generation/download
  evidence exists.
  Source: API contract and PDF decision record.

## Cross-Feature Read Seams

- Exported seam:
  planned `HarnessChatPacketRevisionReader`
  Consumer:
  root-admin packet history UI and generated-document renderer mapper.
  Allowed read shape:
  authorized packet revision data, metadata, and previous/next links.
  Source: API contract.
- Exported seam:
  planned Product Discovery packet writer/adapter.
  Consumer:
  Product Discovery artifact workflow.
  Allowed write shape:
  canonical packet data created through the approved Layer 1 adapter.
  Source: Product Discovery workflow.

## Compliance Classification And Governance

- Data classification:
  sensitive internal product metadata; packet may reference tenant-adjacent or
  customer-adjacent intent.
- PII posture:
  possible.
- Privacy notes:
  rendered PDFs may expose packet content only to authorized root builders in
  the MVP.
- Audit relevance:
  high. Generation, supersession, download, and denial are audit-relevant.
- Retention / delete posture:
  immutable approved versions retained indefinitely in MVP; deletion/export
  policy deferred.

## Compliance And Enforcement Trace

| Rule / Standard | Applies | Repo Enforcement Posture | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable Domain Data Rule | yes | enforced-by-maintained-artifact | this dictionary; PRD; API contract | Packet identity, source, version, and supersession are planned durable facts. |
| System-Managed Fields | yes | manual-review-required | future API tests | Revision ids, versions, actor, timestamps, and lifecycle fields must be server-owned. |
| Asset Upload And Read Decision Gate | yes | enforced-by-maintained-artifact | asset consumer decision record | PDF generation reads approved packet data and denies public delivery. |
| Searchable Storage Rules | yes | documented-not-enforced | this dictionary | JSON packet data is not approved as a broad scalable search surface. |
| Runtime Bug Fix Evidence Gate | future | manual-review-required | future runtime evidence plan | Packet UI and PDF fixture shape must be verified against live API payloads. |

## Migration Compatibility Notes

- First implementation should use a new migration with stable sortable prefix.
- Future tenant rollout must add tenant-scoped indexes and deny rules through
  an explicit compatibility plan.
