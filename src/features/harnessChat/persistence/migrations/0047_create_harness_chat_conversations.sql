CREATE TABLE IF NOT EXISTS harness_chat_conversations (
  conversation_id UUID PRIMARY KEY,
  product_request_id TEXT NULL,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('root')),
  tenant_id UUID NULL,
  created_by_root_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  state TEXT NOT NULL CHECK (state IN ('draft', 'active', 'packet-ready', 'abandoned', 'closed')),
  source_channel TEXT NOT NULL CHECK (source_channel IN ('app')),
  surface_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  client_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  structured_discovery_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  compact_transcript_summary TEXT NULL,
  latest_packet_revision_id UUID NULL,
  retention_posture TEXT NOT NULL CHECK (retention_posture IN ('indefinite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_harness_chat_root_has_no_tenant
    CHECK (scope_type <> 'root' OR tenant_id IS NULL)
);

CREATE INDEX IF NOT EXISTS ix_harness_chat_conversations_root_history
  ON harness_chat_conversations (scope_type, updated_at DESC, state)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_harness_chat_conversations_creator_history
  ON harness_chat_conversations (created_by_root_user_id, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS harness_chat_messages (
  message_id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES harness_chat_conversations (conversation_id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL CHECK (sequence_number >= 1),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  body TEXT NOT NULL CHECK (length(trim(body)) > 0),
  accepted_by_harness BOOLEAN NOT NULL DEFAULT FALSE,
  created_by_root_user_id UUID NULL REFERENCES root_users (root_user_id),
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_harness_chat_user_message_actor
    CHECK (
      (role = 'user' AND created_by_root_user_id IS NOT NULL)
      OR (role IN ('assistant', 'system') AND created_by_root_user_id IS NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_harness_chat_messages_conversation_sequence
  ON harness_chat_messages (conversation_id, sequence_number);

CREATE INDEX IF NOT EXISTS ix_harness_chat_messages_transcript
  ON harness_chat_messages (conversation_id, sequence_number);
