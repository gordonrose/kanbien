ALTER TABLE entities
  ADD COLUMN IF NOT EXISTS entity_key TEXT,
  ADD COLUMN IF NOT EXISTS feature_name TEXT,
  ADD COLUMN IF NOT EXISTS table_name TEXT,
  ADD COLUMN IF NOT EXISTS id_field TEXT,
  ADD COLUMN IF NOT EXISTS id_column TEXT,
  ADD COLUMN IF NOT EXISTS scope TEXT,
  ADD COLUMN IF NOT EXISTS route_base TEXT;

UPDATE entities
SET
  feature_name = COALESCE(
    feature_name,
    NULLIF(regexp_replace(normalized_name, '[^a-z0-9]+', '_', 'g'), ''),
    'entity'
  ),
  entity_key = COALESCE(
    entity_key,
    NULLIF(regexp_replace(normalized_name, '[^a-z0-9]+', '_', 'g'), ''),
    'entity'
  ),
  scope = COALESCE(scope, 'root')
WHERE
  feature_name IS NULL
  OR entity_key IS NULL
  OR scope IS NULL;

UPDATE entities
SET
  table_name = COALESCE(table_name, entity_key),
  id_field = COALESCE(id_field, entity_key || 'Id'),
  route_base = COALESCE(route_base, '/' || feature_name)
WHERE
  table_name IS NULL
  OR id_field IS NULL
  OR route_base IS NULL;

UPDATE entities
SET id_column = COALESCE(
  id_column,
  lower(regexp_replace(id_field, '([a-z0-9])([A-Z])', '\1_\2', 'g'))
)
WHERE id_column IS NULL;

ALTER TABLE entities
  ALTER COLUMN entity_key SET NOT NULL,
  ALTER COLUMN feature_name SET NOT NULL,
  ALTER COLUMN table_name SET NOT NULL,
  ALTER COLUMN id_field SET NOT NULL,
  ALTER COLUMN id_column SET NOT NULL,
  ALTER COLUMN scope SET NOT NULL,
  ALTER COLUMN route_base SET NOT NULL;

ALTER TABLE entities
  ADD CONSTRAINT ck_entities_entity_key_non_empty CHECK (length(btrim(entity_key)) > 0),
  ADD CONSTRAINT ck_entities_feature_name_non_empty CHECK (length(btrim(feature_name)) > 0),
  ADD CONSTRAINT ck_entities_table_name_non_empty CHECK (length(btrim(table_name)) > 0),
  ADD CONSTRAINT ck_entities_id_field_non_empty CHECK (length(btrim(id_field)) > 0),
  ADD CONSTRAINT ck_entities_id_column_non_empty CHECK (length(btrim(id_column)) > 0),
  ADD CONSTRAINT ck_entities_route_base_non_empty CHECK (length(btrim(route_base)) > 0),
  ADD CONSTRAINT ck_entities_scope_allowed CHECK (scope IN ('root', 'tenant', 'shared-cross-tenant'));

CREATE INDEX IF NOT EXISTS ix_entities_feature_name
  ON entities (feature_name);

CREATE INDEX IF NOT EXISTS ix_entities_entity_key
  ON entities (entity_key);

CREATE INDEX IF NOT EXISTS ix_entities_scope
  ON entities (scope);
