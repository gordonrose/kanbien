CREATE TABLE IF NOT EXISTS harness_chat_packet_revisions (
  packet_revision_id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES harness_chat_conversations (conversation_id) ON DELETE CASCADE,
  product_request_id TEXT NULL,
  version INTEGER NOT NULL CHECK (version >= 1),
  state TEXT NOT NULL CHECK (state IN ('draft', 'generated', 'pdf-ready', 'downloaded', 'superseded', 'failed')),
  product_discovery_packet_path TEXT NULL,
  packet_data JSONB NOT NULL,
  source_message_sequence_max INTEGER NOT NULL CHECK (source_message_sequence_max >= 0),
  previous_packet_revision_id UUID NULL REFERENCES harness_chat_packet_revisions (packet_revision_id) ON DELETE SET NULL,
  next_packet_revision_id UUID NULL REFERENCES harness_chat_packet_revisions (packet_revision_id) ON DELETE SET NULL,
  generated_by_root_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  generated_at TIMESTAMPTZ NULL,
  superseded_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_harness_chat_packet_success_has_generated_at
    CHECK (state IN ('draft', 'failed') OR generated_at IS NOT NULL),
  CONSTRAINT ck_harness_chat_packet_superseded_has_timestamp
    CHECK (state <> 'superseded' OR superseded_at IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_harness_chat_packet_revisions_conversation_version
  ON harness_chat_packet_revisions (conversation_id, version);

CREATE UNIQUE INDEX IF NOT EXISTS uq_harness_chat_packet_revisions_current
  ON harness_chat_packet_revisions (conversation_id)
  WHERE superseded_at IS NULL
    AND state IN ('generated', 'pdf-ready', 'downloaded');

CREATE INDEX IF NOT EXISTS ix_harness_chat_packet_revisions_actor
  ON harness_chat_packet_revisions (generated_by_root_user_id, generated_at DESC);

CREATE TABLE IF NOT EXISTS harness_chat_pdf_attempts (
  pdf_attempt_id UUID PRIMARY KEY,
  packet_revision_id UUID NOT NULL REFERENCES harness_chat_packet_revisions (packet_revision_id) ON DELETE CASCADE,
  requested_by_root_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  state TEXT NOT NULL CHECK (state IN ('requested', 'preparing', 'succeeded', 'failed', 'denied', 'rate-limited')),
  safe_failure_reason TEXT NULL CHECK (
    safe_failure_reason IS NULL
    OR safe_failure_reason IN (
      'render_timeout',
      'packet_unavailable',
      'permission_denied',
      'data_integrity_failure',
      'renderer_unavailable'
    )
  ),
  source_data_size_bytes INTEGER NULL CHECK (source_data_size_bytes IS NULL OR source_data_size_bytes >= 0),
  rendered_html_size_bytes INTEGER NULL CHECK (rendered_html_size_bytes IS NULL OR rendered_html_size_bytes >= 0),
  output_size_bytes INTEGER NULL CHECK (output_size_bytes IS NULL OR output_size_bytes >= 0),
  duration_ms INTEGER NULL CHECK (duration_ms IS NULL OR duration_ms >= 0),
  retry_of_attempt_id UUID NULL REFERENCES harness_chat_pdf_attempts (pdf_attempt_id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NULL,
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_harness_chat_pdf_attempts_packet
  ON harness_chat_pdf_attempts (packet_revision_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_harness_chat_pdf_attempts_actor
  ON harness_chat_pdf_attempts (requested_by_root_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_harness_chat_pdf_attempts_state
  ON harness_chat_pdf_attempts (state, created_at DESC);

ALTER TABLE harness_chat_conversations
  ADD CONSTRAINT fk_harness_chat_conversations_latest_packet_revision
  FOREIGN KEY (latest_packet_revision_id)
  REFERENCES harness_chat_packet_revisions (packet_revision_id)
  DEFERRABLE INITIALLY DEFERRED;
