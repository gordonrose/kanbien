CREATE TABLE IF NOT EXISTS platform_security_counters (
  counter_namespace TEXT NOT NULL,
  subject_scope TEXT NOT NULL,
  subject_key TEXT NOT NULL,
  signal TEXT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (
    counter_namespace,
    subject_scope,
    subject_key,
    signal,
    window_started_at
  )
);

CREATE INDEX IF NOT EXISTS ix_platform_security_counters_expires_at
  ON platform_security_counters (expires_at);

CREATE INDEX IF NOT EXISTS ix_platform_security_counters_lookup
  ON platform_security_counters (
    counter_namespace,
    subject_scope,
    subject_key,
    signal,
    expires_at
  );

CREATE TABLE IF NOT EXISTS platform_security_lockdowns (
  lockdown_id TEXT PRIMARY KEY,
  subject_scope TEXT NOT NULL,
  subject_key TEXT NOT NULL,
  signal TEXT NOT NULL,
  reason TEXT NOT NULL,
  endpoint_class TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_platform_security_lockdowns_lookup
  ON platform_security_lockdowns (subject_scope, subject_key, signal, expires_at);
