import type { Pool, QueryResultRow } from "pg";
import type { RootAuthRepository } from "./repository";
import type {
  ActiveAuthSessionRecord,
  AddAuthSshPublicKeyInput,
  AuthLoginChallengeRecord,
  AuthPrincipalRecord,
  AuthPrincipalWithRootUserRecord,
  AuthSessionRecord,
  AuthSshPublicKeyRecord,
  CreateAuthAuditEventInput,
  CreateAuthChallengeInput,
  CreateAuthLinkInput,
  CreateAuthPrincipalInput,
  CreateAuthSessionInput,
} from "./types";

export function createPostgresRootAuthRepository(dbPool: Pool): RootAuthRepository {
  async function queryOne<T extends QueryResultRow>(
    sql: string,
    params: unknown[],
  ): Promise<T | null> {
    const result = await dbPool.query<T>(sql, params);
    return result.rows[0] ?? null;
  }

  return {
    async createAuthPrincipal(input: CreateAuthPrincipalInput) {
      const result = await dbPool.query<AuthPrincipalRecord>(
        `
          INSERT INTO auth_principals (
            auth_principal_id,
            login_email,
            login_email_normalized,
            password_hash,
            password_changed_at,
            auth_status,
            created_at,
            updated_at
          )
          VALUES (
            $1,
            $2,
            $3,
            crypt($4, gen_salt('bf', 12)),
            NOW(),
            'active',
            NOW(),
            NOW()
          )
          RETURNING
            auth_principal_id,
            login_email,
            login_email_normalized,
            auth_status,
            password_changed_at,
            created_at,
            updated_at
        `,
        [input.authPrincipalId, input.loginEmail, input.loginEmailNormalized, input.password],
      );
      return result.rows[0];
    },
    async createRootUserLink(input: CreateAuthLinkInput) {
      await dbPool.query(
        `
          INSERT INTO auth_principal_root_user_links (
            link_id,
            auth_principal_id,
            root_user_id,
            created_at
          )
          VALUES ($1, $2, $3, NOW())
        `,
        [input.linkId, input.authPrincipalId, input.rootUserId],
      );
    },
    findPrincipalByNormalizedEmail(email) {
      return queryOne<AuthPrincipalWithRootUserRecord>(
        `
          SELECT
            ap.auth_principal_id,
            ap.login_email,
            ap.login_email_normalized,
            ap.auth_status,
            ap.password_changed_at,
            ap.created_at,
            ap.updated_at,
            link.root_user_id
          FROM auth_principals ap
          JOIN auth_principal_root_user_links link
            ON link.auth_principal_id = ap.auth_principal_id
          WHERE ap.login_email_normalized = $1
        `,
        [email],
      );
    },
    findPrincipalById(authPrincipalId) {
      return queryOne<AuthPrincipalWithRootUserRecord>(
        `
          SELECT
            ap.auth_principal_id,
            ap.login_email,
            ap.login_email_normalized,
            ap.auth_status,
            ap.password_changed_at,
            ap.created_at,
            ap.updated_at,
            link.root_user_id
          FROM auth_principals ap
          JOIN auth_principal_root_user_links link
            ON link.auth_principal_id = ap.auth_principal_id
          WHERE ap.auth_principal_id = $1
        `,
        [authPrincipalId],
      );
    },
    async verifyPassword(authPrincipalId, password) {
      const result = await dbPool.query<{ accepted: boolean }>(
        `
          SELECT (password_hash = crypt($2, password_hash)) AS accepted
          FROM auth_principals
          WHERE auth_principal_id = $1
        `,
        [authPrincipalId, password],
      );
      return result.rows[0]?.accepted ?? false;
    },
    async createChallenge(input: CreateAuthChallengeInput) {
      const result = await dbPool.query<AuthLoginChallengeRecord>(
        `
          INSERT INTO auth_login_challenges (
            challenge_id,
            auth_principal_id,
            purpose,
            challenge_text,
            expires_at,
            used_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, NULL, NOW())
          RETURNING *
        `,
        [
          input.challengeId,
          input.authPrincipalId,
          input.purpose,
          input.challengeText,
          input.expiresAt,
        ],
      );
      return result.rows[0];
    },
    findChallengeById(challengeId) {
      return queryOne<AuthLoginChallengeRecord>(
        `SELECT * FROM auth_login_challenges WHERE challenge_id = $1`,
        [challengeId],
      );
    },
    async markChallengeUsed(challengeId, usedAt) {
      await dbPool.query(
        `UPDATE auth_login_challenges SET used_at = $2 WHERE challenge_id = $1`,
        [challengeId, usedAt],
      );
    },
    async createSession(input: CreateAuthSessionInput) {
      const result = await dbPool.query<AuthSessionRecord>(
        `
          INSERT INTO auth_sessions (
            session_id,
            auth_principal_id,
            root_user_id,
            authenticated_at,
            expires_at,
            revoked_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, NULL, NOW())
          RETURNING *
        `,
        [
          input.sessionId,
          input.authPrincipalId,
          input.rootUserId,
          input.authenticatedAt,
          input.expiresAt,
        ],
      );
      return result.rows[0];
    },
    findActiveSessionById(sessionId) {
      return queryOne<ActiveAuthSessionRecord>(
        `
          SELECT sess.*
          FROM auth_sessions sess
          JOIN auth_principals ap
            ON ap.auth_principal_id = sess.auth_principal_id
          JOIN root_users ru
            ON ru.root_user_id = sess.root_user_id
          WHERE sess.session_id = $1
            AND sess.revoked_at IS NULL
            AND sess.expires_at > NOW()
            AND ap.auth_status = 'active'
            AND ru.status = 'active'
            AND ru.deleted_at IS NULL
            AND ru.anonymized = false
        `,
        [sessionId],
      );
    },
    async revokeSession(sessionId, authPrincipalId) {
      const result = await dbPool.query(
        `
          UPDATE auth_sessions
          SET revoked_at = COALESCE(revoked_at, NOW())
          WHERE session_id = $1 AND auth_principal_id = $2
        `,
        [sessionId, authPrincipalId],
      );
      return (result.rowCount ?? 0) > 0;
    },
    async revokeOtherSessions(authPrincipalId, exceptSessionId) {
      await dbPool.query(
        `
          UPDATE auth_sessions
          SET revoked_at = COALESCE(revoked_at, NOW())
          WHERE auth_principal_id = $1
            AND session_id <> $2
            AND revoked_at IS NULL
        `,
        [authPrincipalId, exceptSessionId],
      );
    },
    async setPassword(authPrincipalId, newPassword, changedAt) {
      await dbPool.query(
        `
          UPDATE auth_principals
          SET password_hash = crypt($2, gen_salt('bf', 12)),
              password_changed_at = $3,
              updated_at = NOW()
          WHERE auth_principal_id = $1
        `,
        [authPrincipalId, newPassword, changedAt],
      );
    },
    async addSshPublicKey(input: AddAuthSshPublicKeyInput) {
      const result = await dbPool.query<AuthSshPublicKeyRecord>(
        `
          INSERT INTO auth_ssh_public_keys (
            auth_ssh_public_key_id,
            auth_principal_id,
            label,
            algorithm,
            public_key_openssh,
            fingerprint,
            status,
            created_at,
            revoked_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW(), NULL)
          RETURNING *
        `,
        [
          input.keyId,
          input.authPrincipalId,
          input.label,
          input.algorithm,
          input.publicKeyOpenSsh,
          input.fingerprint,
        ],
      );
      return result.rows[0];
    },
    findActiveSshKeyByFingerprint(authPrincipalId, fingerprint) {
      return queryOne<AuthSshPublicKeyRecord>(
        `
          SELECT *
          FROM auth_ssh_public_keys
          WHERE auth_principal_id = $1
            AND fingerprint = $2
            AND status = 'active'
            AND revoked_at IS NULL
        `,
        [authPrincipalId, fingerprint],
      );
    },
    async listSshPublicKeys(authPrincipalId) {
      const result = await dbPool.query<AuthSshPublicKeyRecord>(
        `
          SELECT *
          FROM auth_ssh_public_keys
          WHERE auth_principal_id = $1
          ORDER BY created_at DESC
        `,
        [authPrincipalId],
      );
      return result.rows;
    },
    async revokeSshPublicKey(keyId, authPrincipalId, revokedAt) {
      const result = await dbPool.query(
        `
          UPDATE auth_ssh_public_keys
          SET status = 'revoked',
              revoked_at = COALESCE(revoked_at, $3)
          WHERE auth_ssh_public_key_id = $1
            AND auth_principal_id = $2
        `,
        [keyId, authPrincipalId, revokedAt],
      );
      return (result.rowCount ?? 0) > 0;
    },
    async listSessions(authPrincipalId) {
      const result = await dbPool.query<AuthSessionRecord>(
        `
          SELECT *
          FROM auth_sessions
          WHERE auth_principal_id = $1
            AND revoked_at IS NULL
            AND expires_at > NOW()
          ORDER BY created_at DESC
        `,
        [authPrincipalId],
      );
      return result.rows;
    },
    findOwnedSession(sessionId, authPrincipalId) {
      return queryOne<AuthSessionRecord>(
        `
          SELECT *
          FROM auth_sessions
          WHERE session_id = $1 AND auth_principal_id = $2
        `,
        [sessionId, authPrincipalId],
      );
    },
    async createAuditEvent(input: CreateAuthAuditEventInput) {
      await dbPool.query(
        `
          INSERT INTO auth_audit_events (
            event_id,
            auth_principal_id,
            root_user_id,
            event_type,
            event_outcome,
            ip_address,
            user_agent,
            occurred_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          input.eventId,
          input.authPrincipalId ?? null,
          input.rootUserId ?? null,
          input.eventType,
          input.eventOutcome,
          input.ipAddress ?? null,
          input.userAgent ?? null,
          input.occurredAt,
        ],
      );
    },
  };
}
