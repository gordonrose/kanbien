export const cleanupEntities = [
  "auth_audit_events",
  "auth_sessions",
  "auth_login_challenges",
  "auth_ssh_public_keys",
  "auth_principal_root_user_links",
  "auth_principals",
  "root_users",
] as const;

export type CleanupEntity = (typeof cleanupEntities)[number];

export interface ManifestRecord {
  entity: CleanupEntity;
  id: string;
}

export interface TestRunManifest {
  testRunId: string;
  createdAt: string;
  records: ManifestRecord[];
}

export const cleanupPrimaryKeyColumnByEntity: Record<CleanupEntity, string> = {
  auth_audit_events: "event_id",
  auth_sessions: "session_id",
  auth_login_challenges: "challenge_id",
  auth_ssh_public_keys: "auth_ssh_public_key_id",
  auth_principal_root_user_links: "link_id",
  auth_principals: "auth_principal_id",
  root_users: "root_user_id",
};

export function isCleanupEntity(value: string): value is CleanupEntity {
  return cleanupEntities.includes(value as CleanupEntity);
}
