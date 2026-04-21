CREATE TABLE IF NOT EXISTS entity_definition (
  entity_definition_id UUID PRIMARY KEY,
  entity_key TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  description TEXT NOT NULL,
  current_version_id UUID NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'superseded', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_entity_key
  ON entity_definition (entity_key);

CREATE INDEX IF NOT EXISTS ix_entity_definition_status
  ON entity_definition (status);

CREATE INDEX IF NOT EXISTS ix_entity_definition_updated_at
  ON entity_definition (updated_at DESC);

CREATE TABLE IF NOT EXISTS entity_definition_version (
  entity_definition_version_id UUID PRIMARY KEY,
  entity_definition_id UUID NOT NULL REFERENCES entity_definition (entity_definition_id),
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'superseded', 'archived')),
  supersedes_version_id UUID NULL REFERENCES entity_definition_version (entity_definition_version_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activated_at TIMESTAMPTZ NULL,
  superseded_at TIMESTAMPTZ NULL,
  archived_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_version_lineage_version
  ON entity_definition_version (entity_definition_id, version_number);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_active_version_per_lineage
  ON entity_definition_version (entity_definition_id)
  WHERE status = 'active';

ALTER TABLE entity_definition
  DROP CONSTRAINT IF EXISTS fk_entity_definition_current_version;

ALTER TABLE entity_definition
  ADD CONSTRAINT fk_entity_definition_current_version
  FOREIGN KEY (current_version_id)
  REFERENCES entity_definition_version (entity_definition_version_id);

CREATE TABLE IF NOT EXISTS entity_definition_attribute (
  entity_definition_attribute_id UUID PRIMARY KEY,
  entity_definition_version_id UUID NOT NULL REFERENCES entity_definition_version (entity_definition_version_id),
  attribute_key TEXT NOT NULL,
  attribute_kind TEXT NOT NULL CHECK (attribute_kind IN ('persisted', 'computed')),
  attribute_type TEXT NOT NULL CHECK (attribute_type IN ('string', 'text', 'boolean', 'integer', 'decimal', 'uuid', 'email', 'url', 'date', 'datetime', 'enum', 'coordinates')),
  value_cardinality TEXT NOT NULL CHECK (value_cardinality IN ('single', 'multiple')),
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  help_text TEXT NULL,
  placeholder_text TEXT NULL,
  form_facing BOOLEAN NOT NULL DEFAULT TRUE,
  default_form_pattern_key TEXT NULL,
  options_mode TEXT NOT NULL CHECK (options_mode IN ('none', 'inline', 'catalog_reference')),
  options_catalog_key TEXT NULL,
  derivation_note TEXT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_entity_definition_attribute_form_pattern_required
    CHECK ((form_facing = FALSE AND default_form_pattern_key IS NULL) OR (form_facing = TRUE AND default_form_pattern_key IS NOT NULL)),
  CONSTRAINT ck_entity_definition_attribute_computed_derivation
    CHECK ((attribute_kind = 'computed' AND derivation_note IS NOT NULL) OR (attribute_kind = 'persisted'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_version_key
  ON entity_definition_attribute (entity_definition_version_id, attribute_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_version_display_order
  ON entity_definition_attribute (entity_definition_version_id, display_order);

CREATE TABLE IF NOT EXISTS entity_definition_attribute_validation_rule (
  entity_definition_attribute_validation_rule_id UUID PRIMARY KEY,
  entity_definition_attribute_id UUID NOT NULL REFERENCES entity_definition_attribute (entity_definition_attribute_id),
  rule_key TEXT NOT NULL CHECK (rule_key IN ('required', 'min_length', 'max_length', 'pattern', 'enum_membership', 'type_format')),
  rule_argument_type TEXT NOT NULL CHECK (rule_argument_type IN ('none', 'string', 'integer', 'decimal', 'boolean')),
  rule_argument_string TEXT NULL,
  rule_argument_integer INTEGER NULL,
  rule_argument_decimal NUMERIC NULL,
  rule_argument_boolean BOOLEAN NULL,
  error_message TEXT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_rule_order
  ON entity_definition_attribute_validation_rule (entity_definition_attribute_id, rule_key, display_order);

CREATE TABLE IF NOT EXISTS entity_definition_attribute_option (
  entity_definition_attribute_option_id UUID PRIMARY KEY,
  entity_definition_attribute_id UUID NOT NULL REFERENCES entity_definition_attribute (entity_definition_attribute_id),
  option_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_option_key
  ON entity_definition_attribute_option (entity_definition_attribute_id, option_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_option_order
  ON entity_definition_attribute_option (entity_definition_attribute_id, display_order);

CREATE TABLE IF NOT EXISTS entity_definition_attribute_source_link (
  entity_definition_attribute_source_link_id UUID PRIMARY KEY,
  entity_definition_attribute_id UUID NOT NULL REFERENCES entity_definition_attribute (entity_definition_attribute_id),
  source_attribute_key TEXT NOT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_source_link_key
  ON entity_definition_attribute_source_link (entity_definition_attribute_id, source_attribute_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_definition_attribute_source_link_order
  ON entity_definition_attribute_source_link (entity_definition_attribute_id, display_order);
