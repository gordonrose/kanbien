CREATE TABLE IF NOT EXISTS entities (
  entity_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'superseded', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_entities_name_non_empty CHECK (length(btrim(name)) > 0),
  CONSTRAINT ck_entities_normalized_name_non_empty CHECK (length(btrim(normalized_name)) > 0),
  CONSTRAINT ck_entities_description_non_empty CHECK (length(btrim(description)) > 0),
  CONSTRAINT ck_entities_archived_status_consistent CHECK (
    (status = 'archived' AND archived_at IS NOT NULL)
    OR (status <> 'archived' AND archived_at IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entities_normalized_name_current
  ON entities (normalized_name)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_entities_status
  ON entities (status);

CREATE INDEX IF NOT EXISTS ix_entities_normalized_name_prefix
  ON entities (normalized_name);

CREATE INDEX IF NOT EXISTS ix_entities_created_at
  ON entities (created_at DESC);

CREATE INDEX IF NOT EXISTS ix_entities_updated_at
  ON entities (updated_at DESC);

CREATE INDEX IF NOT EXISTS ix_entities_archived_at
  ON entities (archived_at DESC);
