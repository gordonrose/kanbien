CREATE TABLE IF NOT EXISTS job_processing_job (
  job_id UUID PRIMARY KEY,
  job_type TEXT NOT NULL,
  queue_name TEXT NOT NULL CHECK (queue_name IN ('critical', 'default', 'bulk', 'maintenance')),
  payload_version INTEGER NOT NULL CHECK (payload_version > 0),
  payload_json JSONB NOT NULL,
  execution_scope TEXT NOT NULL CHECK (execution_scope IN ('root', 'tenant', 'platform-internal', 'shared-cross-tenant')),
  tenant_id UUID NULL,
  requested_by_actor_type TEXT NULL CHECK (
    requested_by_actor_type IS NULL OR requested_by_actor_type IN ('root_user', 'tenant_user', 'system')
  ),
  requested_by_actor_id TEXT NULL,
  idempotency_key TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'dispatched', 'running', 'succeeded', 'retryable', 'dead', 'canceled')),
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 100),
  run_at TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts INTEGER NOT NULL CHECK (max_attempts >= 1),
  dead_letter_reason TEXT NULL,
  related_entity_type TEXT NULL,
  related_entity_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  CONSTRAINT job_processing_tenant_scope_check CHECK (
    (execution_scope = 'tenant' AND tenant_id IS NOT NULL)
    OR (execution_scope <> 'tenant' AND tenant_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS job_processing_job_idempotency_key_idx
  ON job_processing_job (job_type, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS job_processing_job_status_idx ON job_processing_job (status);
CREATE INDEX IF NOT EXISTS job_processing_job_queue_idx ON job_processing_job (queue_name);
CREATE INDEX IF NOT EXISTS job_processing_job_type_idx ON job_processing_job (job_type);
CREATE INDEX IF NOT EXISTS job_processing_job_tenant_idx ON job_processing_job (tenant_id);
CREATE INDEX IF NOT EXISTS job_processing_job_related_entity_idx
  ON job_processing_job (related_entity_type, related_entity_id);
CREATE INDEX IF NOT EXISTS job_processing_job_created_at_idx ON job_processing_job (created_at);
CREATE INDEX IF NOT EXISTS job_processing_job_completed_at_idx ON job_processing_job (completed_at);
CREATE INDEX IF NOT EXISTS job_processing_job_dead_letter_idx
  ON job_processing_job (dead_letter_reason)
  WHERE dead_letter_reason IS NOT NULL;
CREATE INDEX IF NOT EXISTS job_processing_job_polling_idx
  ON job_processing_job (status, run_at, priority, created_at);

CREATE TABLE IF NOT EXISTS job_processing_outbox (
  outbox_id UUID PRIMARY KEY,
  job_id UUID NOT NULL UNIQUE REFERENCES job_processing_job(job_id) ON DELETE RESTRICT,
  dispatch_status TEXT NOT NULL CHECK (dispatch_status IN ('pending', 'dispatched', 'failed')),
  provider_job_id TEXT NULL UNIQUE,
  dispatch_attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (dispatch_attempt_count >= 0),
  locked_by TEXT NULL,
  locked_until TIMESTAMPTZ NULL,
  last_error_summary TEXT NULL,
  dispatched_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_processing_outbox_polling_idx
  ON job_processing_outbox (dispatch_status, locked_until, created_at);
CREATE INDEX IF NOT EXISTS job_processing_outbox_locked_until_idx
  ON job_processing_outbox (locked_until);

CREATE TABLE IF NOT EXISTS job_processing_attempt (
  attempt_id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES job_processing_job(job_id) ON DELETE RESTRICT,
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1),
  worker_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'dead')),
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ NULL,
  error_code TEXT NULL,
  error_summary TEXT NULL,
  UNIQUE (job_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS job_processing_attempt_job_idx ON job_processing_attempt (job_id);
CREATE INDEX IF NOT EXISTS job_processing_attempt_worker_idx ON job_processing_attempt (worker_id);
CREATE INDEX IF NOT EXISTS job_processing_attempt_started_at_idx ON job_processing_attempt (started_at);
