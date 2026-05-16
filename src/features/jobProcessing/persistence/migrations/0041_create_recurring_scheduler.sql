CREATE TABLE IF NOT EXISTS job_processing_recurring_schedule (
  schedule_key TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload_version INTEGER NOT NULL CHECK (payload_version > 0),
  cadence_seconds INTEGER NOT NULL CHECK (cadence_seconds >= 60),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  next_run_at TIMESTAMPTZ NOT NULL,
  last_run_at TIMESTAMPTZ NULL,
  lease_owner TEXT NULL,
  lease_until TIMESTAMPTZ NULL,
  failure_count INTEGER NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
  last_error_category TEXT NULL,
  last_error_summary TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_processing_recurring_schedule_due_idx
  ON job_processing_recurring_schedule (enabled, next_run_at, lease_until);

CREATE INDEX IF NOT EXISTS job_processing_recurring_schedule_job_type_idx
  ON job_processing_recurring_schedule (job_type);

CREATE TABLE IF NOT EXISTS job_processing_recurring_schedule_run (
  run_id UUID PRIMARY KEY,
  schedule_key TEXT NOT NULL REFERENCES job_processing_recurring_schedule(schedule_key) ON DELETE RESTRICT,
  due_slot_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('leased', 'enqueued', 'skipped_overlap', 'retryable_failed', 'terminal_failed')
  ),
  job_id UUID NULL REFERENCES job_processing_job(job_id) ON DELETE SET NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count >= 1),
  error_category TEXT NULL,
  error_summary TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (schedule_key, due_slot_at)
);

CREATE INDEX IF NOT EXISTS job_processing_recurring_schedule_run_status_idx
  ON job_processing_recurring_schedule_run (status, updated_at);

CREATE INDEX IF NOT EXISTS job_processing_recurring_schedule_run_job_idx
  ON job_processing_recurring_schedule_run (job_id)
  WHERE job_id IS NOT NULL;

