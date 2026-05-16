CREATE TABLE IF NOT EXISTS organization_location_weekly_opening_hours (
  organization_weekly_opening_hours_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  organization_location_id UUID NOT NULL REFERENCES organization_location(organization_location_id),
  weekday INTEGER NOT NULL,
  slot_order INTEGER NOT NULL,
  opens_at_local_time TIME NOT NULL,
  closes_at_local_time TIME NOT NULL,
  lifecycle_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_weekly_hours_weekday CHECK (weekday >= 0 AND weekday <= 6),
  CONSTRAINT ck_weekly_hours_slot_order CHECK (slot_order >= 1),
  CONSTRAINT ck_weekly_hours_time_range CHECK (opens_at_local_time < closes_at_local_time),
  CONSTRAINT ck_weekly_hours_lifecycle CHECK (lifecycle_status IN ('active', 'deleted'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_weekly_hours_slot_order_active
  ON organization_location_weekly_opening_hours (organization_location_id, weekday, slot_order)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_weekly_hours_location
  ON organization_location_weekly_opening_hours (tenant_id, organization_id, organization_location_id, weekday, slot_order)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS organization_opening_hours_exception (
  organization_opening_hours_exception_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  organization_location_id UUID NOT NULL REFERENCES organization_location(organization_location_id),
  exception_type TEXT NOT NULL,
  starts_on_local_date DATE NOT NULL,
  ends_on_local_date DATE NULL,
  starts_at_local_time TIME NULL,
  ends_at_local_time TIME NULL,
  replacement_slots JSONB NOT NULL DEFAULT '[]'::jsonb,
  reason TEXT NULL,
  lifecycle_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_opening_hours_exception_type CHECK (
    exception_type IN ('closed_day', 'replacement_day_schedule', 'closed_time_slot', 'special_opening_slot')
  ),
  CONSTRAINT ck_opening_hours_exception_date_range CHECK (
    ends_on_local_date IS NULL OR ends_on_local_date >= starts_on_local_date
  ),
  CONSTRAINT ck_opening_hours_exception_time_range CHECK (
    starts_at_local_time IS NULL OR ends_at_local_time IS NULL OR starts_at_local_time < ends_at_local_time
  ),
  CONSTRAINT ck_opening_hours_exception_lifecycle CHECK (lifecycle_status IN ('active', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_opening_hours_exception_location_dates
  ON organization_opening_hours_exception (
    tenant_id,
    organization_id,
    organization_location_id,
    starts_on_local_date,
    COALESCE(ends_on_local_date, starts_on_local_date)
  )
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS organization_opening_hours_audit_event (
  organization_opening_hours_audit_event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  organization_location_id UUID NOT NULL REFERENCES organization_location(organization_location_id),
  organization_weekly_opening_hours_id UUID NULL,
  organization_opening_hours_exception_id UUID NULL,
  actor_type TEXT NOT NULL,
  actor_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_opening_hours_audit_location_occurred_at
  ON organization_opening_hours_audit_event (organization_location_id, occurred_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
) VALUES
  ('organization.weekly-hours-slot.manage', 'Create and manage organization weekly opening-hour slots.', TRUE, TRUE, NOW(), NOW()),
  ('organization.weekly-hours-slot.read', 'Read organization weekly opening-hour slots.', TRUE, TRUE, NOW(), NOW()),
  ('organization.opening-hours-exception.manage', 'Create and manage organization opening-hour exceptions.', TRUE, TRUE, NOW(), NOW()),
  ('organization.opening-hours-exception.read', 'Read organization opening-hour exceptions.', TRUE, TRUE, NOW(), NOW())
ON CONFLICT (capability_key) DO UPDATE
  SET description = EXCLUDED.description,
      root_user_admin_default_mandatory = EXCLUDED.root_user_admin_default_mandatory,
      root_user_admin_default_protected = EXCLUDED.root_user_admin_default_protected,
      updated_at = NOW();

INSERT INTO system_root_role_capability_grants (
  system_root_role_capability_grant_id,
  system_root_role_id,
  capability_key,
  is_mandatory,
  is_protected,
  created_at,
  updated_at,
  revoked_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  c.capability_key,
  c.root_user_admin_default_mandatory,
  c.root_user_admin_default_protected,
  NOW(),
  NOW(),
  NULL
FROM root_authz_capabilities c
WHERE c.capability_key IN (
  SELECT capability_key
  FROM (
  VALUES
    ('organization.weekly-hours-slot.manage'),
    ('organization.weekly-hours-slot.read'),
    ('organization.opening-hours-exception.manage'),
    ('organization.opening-hours-exception.read')
  ) AS capabilities(capability_key)
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
