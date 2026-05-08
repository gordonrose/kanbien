CREATE TABLE IF NOT EXISTS harness_chat_llm_usage_attempts (
  llm_usage_attempt_id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES harness_chat_conversations (conversation_id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (length(trim(provider)) > 0),
  model TEXT NOT NULL CHECK (length(trim(model)) > 0),
  state TEXT NOT NULL CHECK (state IN ('reserved', 'succeeded', 'failed', 'blocked')),
  safe_failure_reason TEXT NULL CHECK (
    safe_failure_reason IS NULL
    OR safe_failure_reason IN (
      'daily_request_limit',
      'monthly_request_limit',
      'provider_error',
      'guardrail_error'
    )
  ),
  request_day DATE NOT NULL,
  request_month DATE NOT NULL,
  daily_request_limit INTEGER NOT NULL CHECK (daily_request_limit >= 1),
  monthly_request_limit INTEGER NOT NULL CHECK (monthly_request_limit >= 1),
  input_chars INTEGER NOT NULL CHECK (input_chars >= 0),
  transcript_message_count INTEGER NOT NULL CHECK (transcript_message_count >= 0),
  output_chars INTEGER NULL CHECK (output_chars IS NULL OR output_chars >= 0),
  error_code TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_harness_chat_llm_usage_completed_state
    CHECK (
      (state IN ('succeeded', 'failed', 'blocked') AND completed_at IS NOT NULL)
      OR (state = 'reserved' AND completed_at IS NULL)
    ),
  CONSTRAINT ck_harness_chat_llm_usage_failure_reason
    CHECK (
      (state IN ('failed', 'blocked') AND safe_failure_reason IS NOT NULL)
      OR (state IN ('reserved', 'succeeded') AND safe_failure_reason IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS ix_harness_chat_llm_usage_conversation
  ON harness_chat_llm_usage_attempts (conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_harness_chat_llm_usage_daily
  ON harness_chat_llm_usage_attempts (provider, model, request_day, state);

CREATE INDEX IF NOT EXISTS ix_harness_chat_llm_usage_monthly
  ON harness_chat_llm_usage_attempts (provider, model, request_month, state);
