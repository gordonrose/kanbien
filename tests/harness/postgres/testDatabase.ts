import { Pool } from "pg";

function hasValue(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!hasValue(value)) {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Invalid boolean environment value: ${value}`);
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!hasValue(value)) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric environment value: ${value}`);
  }

  return parsed;
}

export interface PostgresTestDatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

export function hasPostgresTestDatabaseConfig(): boolean {
  return [
    process.env.TEST_DATABASE_HOST,
    process.env.TEST_DATABASE_NAME,
    process.env.TEST_DATABASE_USER,
    process.env.TEST_DATABASE_PASSWORD,
  ].every(hasValue);
}

export function readPostgresTestDatabaseConfig(): PostgresTestDatabaseConfig {
  if (!hasPostgresTestDatabaseConfig()) {
    throw new Error(
      "Missing test database configuration. Set TEST_DATABASE_HOST, TEST_DATABASE_NAME, TEST_DATABASE_USER, and TEST_DATABASE_PASSWORD.",
    );
  }

  return {
    host: process.env.TEST_DATABASE_HOST!,
    port: parseNumber(process.env.TEST_DATABASE_PORT, 5432),
    database: process.env.TEST_DATABASE_NAME!,
    user: process.env.TEST_DATABASE_USER!,
    password: process.env.TEST_DATABASE_PASSWORD!,
    ssl: parseBoolean(process.env.TEST_DATABASE_SSL, false),
  };
}

export function isPostgresTestDataPreserveModeEnabled(): boolean {
  return process.env.PRESERVE_POSTGRES_TEST_DATA === "true";
}

export function createPostgresTestDatabasePool(): Pool {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Postgres-backed tests may only run when NODE_ENV=test.");
  }

  const config = readPostgresTestDatabaseConfig();
  return new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
  });
}

export async function resetPostgresTestDatabase(pool: Pool): Promise<void> {
  await pool.query(`
    DROP TABLE IF EXISTS capability_catalog_source_references CASCADE;
    DROP TABLE IF EXISTS capability_catalog_constraints CASCADE;
    DROP TABLE IF EXISTS capability_catalog_fields CASCADE;
    DROP TABLE IF EXISTS capability_catalog_records CASCADE;
    DROP TABLE IF EXISTS web_app_page_context_nav_items CASCADE;
    DROP TABLE IF EXISTS web_app_page_settings CASCADE;
    DROP TABLE IF EXISTS web_app_discovery_links CASCADE;
    DROP TABLE IF EXISTS web_app_page_locators CASCADE;
    DROP TABLE IF EXISTS discovered_web_app_structure_nodes CASCADE;
    DROP TABLE IF EXISTS discovered_web_app_surfaces CASCADE;
    DROP TABLE IF EXISTS web_app_discovery_runs CASCADE;
    DROP TABLE IF EXISTS web_app_pages CASCADE;
    DROP TABLE IF EXISTS web_app_modules CASCADE;
    DROP TABLE IF EXISTS web_app_root_families CASCADE;
    DROP TABLE IF EXISTS entity_definition_attribute_source_link CASCADE;
    DROP TABLE IF EXISTS entity_definition_attribute_option CASCADE;
    DROP TABLE IF EXISTS entity_definition_attribute_validation_rule CASCADE;
    DROP TABLE IF EXISTS entity_definition_attribute CASCADE;
    DROP TABLE IF EXISTS entity_definition_version CASCADE;
    DROP TABLE IF EXISTS entity_definition CASCADE;
    DROP TABLE IF EXISTS outbound_email_attempt CASCADE;
    DROP TABLE IF EXISTS outbound_email_content CASCADE;
    DROP TABLE IF EXISTS outbound_email CASCADE;
    DROP TABLE IF EXISTS harness_chat_pdf_attempts CASCADE;
    DROP TABLE IF EXISTS harness_chat_packet_revisions CASCADE;
    DROP TABLE IF EXISTS harness_chat_messages CASCADE;
    DROP TABLE IF EXISTS harness_chat_conversations CASCADE;
    DROP TABLE IF EXISTS job_processing_attempt CASCADE;
    DROP TABLE IF EXISTS job_processing_outbox CASCADE;
    DROP TABLE IF EXISTS job_processing_job CASCADE;
    DROP TABLE IF EXISTS tenant_session CASCADE;
    DROP TABLE IF EXISTS tenant_auth_policy CASCADE;
    DROP TABLE IF EXISTS tenant_password_setup_token CASCADE;
    DROP TABLE IF EXISTS tenant_access_grant CASCADE;
    DROP TABLE IF EXISTS tenant_password_credential CASCADE;
    DROP TABLE IF EXISTS tenant_auth_principal CASCADE;
    DROP TABLE IF EXISTS tenant_admin_verification_token CASCADE;
    DROP TABLE IF EXISTS tenant_admin CASCADE;
    DROP TABLE IF EXISTS tenant CASCADE;
    DROP TABLE IF EXISTS root_role_audit_events CASCADE;
    DROP TABLE IF EXISTS root_user_role_assignments CASCADE;
    DROP TABLE IF EXISTS system_root_role_capability_grants CASCADE;
    DROP TABLE IF EXISTS system_root_roles CASCADE;
    DROP TABLE IF EXISTS root_authz_capabilities CASCADE;
    DROP TABLE IF EXISTS auth_audit_events CASCADE;
    DROP TABLE IF EXISTS auth_sessions CASCADE;
    DROP TABLE IF EXISTS auth_login_challenges CASCADE;
    DROP TABLE IF EXISTS auth_ssh_public_keys CASCADE;
    DROP TABLE IF EXISTS auth_principal_root_user_links CASCADE;
    DROP TABLE IF EXISTS auth_principals CASCADE;
    DROP TABLE IF EXISTS root_users CASCADE;
    DROP TABLE IF EXISTS platform_security_lockdowns CASCADE;
    DROP TABLE IF EXISTS platform_security_counters CASCADE;
    DROP TABLE IF EXISTS schema_migrations CASCADE;
  `);
}

export async function resetPostgresTestDatabaseForRoutineIsolation(pool: Pool): Promise<void> {
  if (isPostgresTestDataPreserveModeEnabled()) {
    return;
  }

  await resetPostgresTestDatabase(pool);
}
