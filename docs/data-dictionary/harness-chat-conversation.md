# Harness Chat Conversation

## Summary

- Description:
  Durable root-admin Build chat conversation for Layer 1 Product
  Discovery, including root scope, creator, lifecycle state, prompt context,
  structured discovery state, and current packet linkage.
- Owning feature:
  `harnessChat`
- Primary source tables or records:
  `harness_chat_conversations`, `HarnessChatConversationRecord`
- Status:
  implemented first persistence slice for conversation/message storage.

## Storage Model

- Primary table or durable record:
  `harness_chat_conversations`
- Related durable records:
  `harness_chat_messages`, `harness_chat_packet_revisions`,
  `harness_chat_pdf_attempts`,
  Product Request artifact index, root user/session records
- Primary key:
  `conversation_id`
- Foreign key relationships:
  - `created_by_root_user_id -> root_users.root_user_id`
  - `product_request_id` is a nullable text artifact/backing-record reference
    until Product Request persistence is introduced
  - `latest_packet_revision_id -> harness_chat_packet_revisions.packet_revision_id`
    as a deferrable current packet pointer

## Capabilities That Rely On This Entity

- `harness-chat.root.conversation.create`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.conversation.read`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.message.append`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.packet.generate`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`

## Fields

- `conversation_id`
  Type / Shape: `UUID`
  Description: Generated stable identifier for one Build chat conversation.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: planned API contract.
- `product_request_id`
  Type / Shape: `UUID | TEXT | NULL`
  Description: Link to the Product Request that summarizes and indexes the
  requested body of work.
  Constraints / Notes: Exact type depends on Product Request persistence model.
  Source: Product Request and API contract.
- `scope_type`
  Type / Shape: `TEXT`
  Description: Durable authority-world marker.
  Constraints / Notes: MVP value is `root`; future tenant values require a
  separate tenant-scoped data/API/permission design.
  Source: PRD authorization requirements.
- `tenant_id`
  Type / Shape: `UUID | NULL`
  Description: Future tenant owner when tenant-layer chat is approved.
  Constraints / Notes: Must remain `NULL` for root-admin MVP conversations.
  Tenant context must never be inferred from mutable request bodies.
  Source: tenant-boundary guardrails.
- `created_by_root_user_id`
  Type / Shape: `UUID`
  Description: Root builder that created the conversation.
  Constraints / Notes: System-managed actor fact; root builders may still read
  other root builders' root-admin conversations in the MVP.
  Source: permission mapping.
- `state`
  Type / Shape: `TEXT`
  Description: Conversation lifecycle state.
  Constraints / Notes: Allowed MVP states are `draft`, `active`,
  `packet-ready`, `abandoned`, and `closed`.
  Source: PRD lifecycle states.
- `source_channel`
  Type / Shape: `TEXT`
  Description: Intake surface that created the conversation.
  Constraints / Notes: Root-admin MVP uses `app`; other values require later
  route/API approval.
  Source: API contract.
- `surface_context`
  Type / Shape: `JSONB`
  Description: Historical page/module/role/starter context used to guide
  prompts.
  Constraints / Notes: Prompt input only; never authority for root, tenant,
  object, history, generation, or download access.
  Source: API contract and runtime contract.
- `client_context`
  Type / Shape: `JSONB`
  Description: Optional locale/timezone and client posture inputs.
  Constraints / Notes: Helpful context only; not authority.
  Source: runtime contract.
- `structured_discovery_state`
  Type / Shape: `JSONB`
  Description: Harness-validated structured Layer 1 discovery facts, routing,
  confidence, blockers, and readiness metadata.
  Constraints / Notes: Only server/harness accepted state is stored; raw LLM
  proposals are not source of truth.
  Source: Layer One Runtime Contract.
- `compact_transcript_summary`
  Type / Shape: `TEXT | NULL`
  Description: Server-maintained summary used for future turns without loading
  excessive transcript context.
  Constraints / Notes: Must not replace durable message history.
  Source: Layer One Runtime Contract.
- `latest_packet_revision_id`
  Type / Shape: `UUID | NULL`
  Description: Current packet revision for this conversation, if one exists.
  Constraints / Notes: Must agree with packet revision supersession rules.
  Source: API contract.
- `retention_posture`
  Type / Shape: `TEXT`
  Description: Retention rule applied to the conversation.
  Constraints / Notes: MVP retention is indefinite until broader policy exists.
  Source: PRD data requirements.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp.
  Constraints / Notes: System-managed UTC timestamp.
  Source: AGENTS timestamp defaults.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last mutation timestamp.
  Constraints / Notes: Refreshed on every successful update.
  Source: AGENTS mutation defaults.
- `deleted_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Soft-delete marker if a future deletion capability is approved.
  Constraints / Notes: No normal delete route is approved in MVP.
  Source: AGENTS soft-delete defaults.

## Indexes And Constraints

- primary key on `conversation_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per conversation.
  Why It Matters: Stable route and packet linkage.
  Source: API contract.
- root history index
  Type: `index`
  Definition / Rule: index `scope_type`, `updated_at DESC`, and `state`.
  Why It Matters: Supports root-builder-wide history listing.
  Source: API contract list route.
- creator history index
  Type: `index`
  Definition / Rule: index `created_by_root_user_id`, `updated_at DESC`.
  Why It Matters: Supports creator-specific history views and audit review.
  Source: PRD history requirements.
- tenant guard constraint
  Type: `check`
  Definition / Rule: `tenant_id IS NULL` when `scope_type = 'root'`.
  Why It Matters: Prevents accidental tenant authority in root MVP records.
  Source: tenant-boundary defaults.

## Normalization And Uniqueness Rules

- Rule:
  route ids and system-managed fields are generated server-side.
  Why It Matters:
  prevents client authority over durable entity identity.
  Source: AGENTS system-managed field defaults.
- Rule:
  `surface_context` is persisted as evidence/prompt context, not as authority.
  Why It Matters:
  avoids URL or page state becoming a permission input.
  Source: API and permission mapping.

## Lifecycle Semantics

- State or lifecycle rule:
  `draft` and `active` conversations may accept messages.
  Meaning:
  message append must deny closed or incompatible states.
  Source: API contract.
- State or lifecycle rule:
  `packet-ready` indicates at least one generated packet revision exists.
  Meaning:
  packet state is still owned by packet revisions; conversation state is a
  summary.
  Source: PRD lifecycle states.
- State or lifecycle rule:
  abandoned conversations remain visible to root builders in the MVP.
  Meaning:
  abandoned is not deletion.
  Source: API contract lifecycle notes.

## Mutation Semantics

- Mutation rule:
  create conversation through root-admin API.
  Effect on stored fields:
  creates server-derived root scope, creator, state, timestamps, and optional
  initial context.
  Source: API contract.
- Mutation rule:
  append accepted message turn.
  Effect on stored fields:
  updates structured state, compact summary, `updated_at`, and audit evidence.
  Source: Layer One Runtime Contract.
- Mutation rule:
  generate packet.
  Effect on stored fields:
  updates `latest_packet_revision_id`, may set `state = 'packet-ready'`, and
  refreshes `updated_at`.
  Source: API contract.

## Cross-Feature Read Seams

- Exported seam:
  planned `HarnessChatConversationReader`
  Consumer:
  root-admin Build panel and history UI.
  Allowed read shape:
  conversation summary/detail filtered to root-visible records.
  Source: API contract.
- Exported seam:
  planned Product Discovery adapter input.
  Consumer:
  Product Discovery harness adapter.
  Allowed read shape:
  authorized durable transcript, structured state, and context needed to
  generate canonical Product Discovery packet data.
  Source: Runtime Contract.

## Compliance Classification And Governance

- Data classification:
  sensitive internal product metadata; possible customer, tenant, employee, or
  operational context supplied by requester.
- PII posture:
  possible.
- Privacy notes:
  transcript/state may include sensitive intent and must not be exposed outside
  authenticated root-builder visibility in MVP.
- Audit relevance:
  high. Creation, reads where required, state changes, generation, and failures
  require evidence.
- Retention / delete posture:
  indefinite MVP retention; hard delete/export/legal hold deferred.

## Compliance And Enforcement Trace

| Rule / Standard | Applies | Repo Enforcement Posture | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable Domain Data Rule | yes | enforced-by-maintained-artifact | this dictionary; PRD; API contract | Actor, scope, state, context, and packet linkage are planned durable facts. |
| Tenant Boundary Defaults | yes | enforced-by-maintained-artifact | permission mapping; API contract | Root MVP records must not accept tenant authority from body or URL state. |
| System-Managed Fields | yes | manual-review-required | future API tests | Implementation must reject client-supplied ids, timestamps, actor, and lifecycle fields. |
| Visibility And Soft Delete | conditional | documented-not-enforced | future data/API design | No delete route in MVP; future deletion requires explicit capability. |
| Runtime Bug Fix Evidence Gate | future | manual-review-required | future runtime evidence plan | Browser-visible chat history must be verified against live API shape. |

## Migration Compatibility Notes

- First implementation uses
  `src/features/harnessChat/persistence/migrations/0047_create_harness_chat_conversations.sql`.
- Future tenant rollout should add tenant-scoped constraints through additive
  migration and compatibility plan, not by weakening root MVP authority rules.
