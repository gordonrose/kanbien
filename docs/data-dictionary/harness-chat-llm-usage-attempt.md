# Harness Chat LLM Usage Attempt

## Summary

- Description:
  Durable record of one attempted provider-backed assistant turn for the Layer 1
  Build chat. The record exists so local spend guardrails survive process
  restarts and can distinguish reserved, completed, failed, and blocked calls.
- Owning feature:
  `harnessChat`
- Primary source tables or records:
  `harness_chat_llm_usage_attempts`, `HarnessChatLlmUsageAttemptRecord`
- Status:
  implemented for OpenAI Product Discovery conversation guardrails.

## Storage Model

- Primary table or durable record:
  `harness_chat_llm_usage_attempts`
- Related durable records:
  `harness_chat_conversations`
- Primary key:
  `llm_usage_attempt_id`
- Foreign key relationships:
  - `conversation_id -> harness_chat_conversations.conversation_id`

## Capabilities That Rely On This Entity

- `harness-chat.root.message.append`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.conversation.create`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`

## Fields

- `llm_usage_attempt_id`
  Type / Shape: `UUID`
  Description: Generated stable identifier for one provider usage attempt.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: local usage guardrail implementation.
- `conversation_id`
  Type / Shape: `UUID`
  Description: Conversation that triggered the assistant turn.
  Constraints / Notes: Required feature-owned relationship.
  Source: chat API contract.
- `provider`
  Type / Shape: `TEXT`
  Description: External model provider identifier.
  Constraints / Notes: Current value is `openai`.
  Source: adapter configuration.
- `model`
  Type / Shape: `TEXT`
  Description: Provider model configured for the call.
  Constraints / Notes: Current default is `gpt-5.2`.
  Source: `OPENAI_MODEL`.
- `state`
  Type / Shape: `TEXT`
  Description: Usage attempt lifecycle.
  Constraints / Notes: Allowed values are `reserved`, `succeeded`, `failed`,
  and `blocked`.
  Source: spend guardrail lifecycle.
- `safe_failure_reason`
  Type / Shape: `TEXT | NULL`
  Description: Safe reason for failed or blocked attempts.
  Constraints / Notes: Allowed values are `daily_request_limit`,
  `monthly_request_limit`, `provider_error`, and `guardrail_error`.
  Source: safe fallback contract.
- `request_day`
  Type / Shape: `DATE`
  Description: UTC day bucket used for daily local limits.
  Constraints / Notes: System-managed from request time.
  Source: daily request guardrail.
- `request_month`
  Type / Shape: `DATE`
  Description: UTC month bucket used for monthly local limits.
  Constraints / Notes: First day of UTC month.
  Source: monthly request guardrail.
- `daily_request_limit`
  Type / Shape: `INTEGER`
  Description: Daily limit in force when the attempt was reserved.
  Constraints / Notes: Stored for auditability.
  Source: `OPENAI_DAILY_REQUEST_LIMIT`.
- `monthly_request_limit`
  Type / Shape: `INTEGER`
  Description: Monthly limit in force when the attempt was reserved.
  Constraints / Notes: Stored for auditability.
  Source: `OPENAI_MONTHLY_REQUEST_LIMIT`.
- `input_chars`
  Type / Shape: `INTEGER`
  Description: Approximate serialized prompt size before provider call.
  Constraints / Notes: Non-negative; not a billing token count.
  Source: local guardrail evidence.
- `transcript_message_count`
  Type / Shape: `INTEGER`
  Description: Number of transcript messages considered for the call.
  Constraints / Notes: Non-negative.
  Source: local guardrail evidence.
- `output_chars`
  Type / Shape: `INTEGER | NULL`
  Description: Assistant message size after successful response.
  Constraints / Notes: Non-negative when present.
  Source: local guardrail evidence.
- `error_code`
  Type / Shape: `TEXT | NULL`
  Description: Sanitized local error class for failed calls.
  Constraints / Notes: Must not contain API keys or raw provider payloads.
  Source: secret-safety rule.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Reservation timestamp.
  Constraints / Notes: System-managed UTC timestamp.
  Source: timestamp defaults.
- `completed_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Completion, failure, or block timestamp.
  Constraints / Notes: Required for terminal states; null while reserved.
  Source: lifecycle constraints.

## Indexes And Constraints

- primary key on `llm_usage_attempt_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per attempt.
  Why It Matters: Stable audit and troubleshooting linkage.
  Source: guardrail implementation.
- daily usage index
  Type: `index`
  Definition / Rule: provider, model, request day, state.
  Why It Matters: Supports deterministic daily request caps.
  Source: local spend guardrails.
- monthly usage index
  Type: `index`
  Definition / Rule: provider, model, request month, state.
  Why It Matters: Supports deterministic monthly request caps.
  Source: local spend guardrails.

## Lifecycle Semantics

- State or lifecycle rule:
  `reserved` means the call is allowed and about to be sent to the provider.
  Meaning:
  reserved attempts count against local limits to avoid retry loops.
  Source: no-bloat/no-contamination guardrail.
- State or lifecycle rule:
  `blocked` means no provider call was made.
  Meaning:
  chat stores a safe deterministic fallback assistant turn.
  Source: API contract LLM spend guardrails.
- State or lifecycle rule:
  `failed` means a reserved provider call did not produce usable validated
  output.
  Meaning:
  the user message remains durable and the assistant fallback is stored.
  Source: runtime fallback contract.

## Compliance Classification And Governance

- Data classification:
  internal operational metadata.
- PII posture:
  low by design; prompt contents are not stored here.
- Privacy notes:
  this entity stores approximate sizes and lifecycle outcomes, not raw model
  prompts or provider responses.
- Audit relevance:
  medium. It explains why provider-backed chat was used or blocked.
- Retention / delete posture:
  follows the owning conversation retention posture through cascade delete.
