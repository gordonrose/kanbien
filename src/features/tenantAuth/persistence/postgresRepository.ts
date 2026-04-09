import type { Pool, QueryResultRow } from "pg";
import type { TenantAuthRepository } from "./repository";
import type {
  CreateTenantAccessGrantInput,
  CreateTenantAuthPrincipalInput,
  CreateTenantPasswordSetupTokenInput,
  CreateTenantSessionInput,
  TenantAccessGrantRecord,
  TenantAuthPrincipalRecord,
  TenantPasswordSetupTokenRecord,
  TenantSessionRecord,
} from "./types";

export function createPostgresTenantAuthRepository(dbPool: Pool): TenantAuthRepository {
  async function queryOne<T extends QueryResultRow>(
    sql: string,
    params: unknown[],
  ): Promise<T | null> {
    const result = await dbPool.query<T>(sql, params);
    return result.rows[0] ?? null;
  }

  return {
    async createPrincipal(input: CreateTenantAuthPrincipalInput) {
      const result = await dbPool.query<TenantAuthPrincipalRecord>(
        `
          INSERT INTO tenant_auth_principal (
            auth_principal_id,
            login_email,
            normalized_login_email,
            password_state,
            created_at,
            updated_at,
            disabled_at
          )
          VALUES ($1, $2, $3, 'setup_required', NOW(), NOW(), NULL)
          RETURNING *
        `,
        [input.authPrincipalId, input.loginEmail, input.normalizedLoginEmail],
      );
      return result.rows[0];
    },
    findPrincipalById(authPrincipalId) {
      return queryOne<TenantAuthPrincipalRecord>(
        `SELECT * FROM tenant_auth_principal WHERE auth_principal_id = $1`,
        [authPrincipalId],
      );
    },
    findPrincipalByNormalizedEmail(email) {
      return queryOne<TenantAuthPrincipalRecord>(
        `SELECT * FROM tenant_auth_principal WHERE normalized_login_email = $1`,
        [email],
      );
    },
    async createAccessGrant(input: CreateTenantAccessGrantInput) {
      const result = await dbPool.query<TenantAccessGrantRecord>(
        `
          INSERT INTO tenant_access_grant (
            tenant_access_grant_id,
            auth_principal_id,
            tenant_id,
            subject_type,
            subject_id,
            created_at,
            updated_at,
            revoked_at
          )
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NULL)
          RETURNING *
        `,
        [
          input.tenantAccessGrantId,
          input.authPrincipalId,
          input.tenantId,
          input.subjectType,
          input.subjectId,
        ],
      );
      return result.rows[0];
    },
    findActiveAccessGrant(authPrincipalId, tenantId, subjectType, subjectId) {
      return queryOne<TenantAccessGrantRecord>(
        `
          SELECT *
          FROM tenant_access_grant
          WHERE auth_principal_id = $1
            AND tenant_id = $2
            AND subject_type = $3
            AND subject_id = $4
            AND revoked_at IS NULL
        `,
        [authPrincipalId, tenantId, subjectType, subjectId],
      );
    },
    async listActiveAccessGrants(authPrincipalId) {
      const result = await dbPool.query<TenantAccessGrantRecord>(
        `
          SELECT *
          FROM tenant_access_grant
          WHERE auth_principal_id = $1
            AND revoked_at IS NULL
          ORDER BY created_at ASC, tenant_access_grant_id ASC
        `,
        [authPrincipalId],
      );
      return result.rows;
    },
    async createPasswordSetupToken(input: CreateTenantPasswordSetupTokenInput) {
      const result = await dbPool.query<TenantPasswordSetupTokenRecord>(
        `
          INSERT INTO tenant_password_setup_token (
            tenant_password_setup_token_id,
            auth_principal_id,
            source_tenant_admin_id,
            token_id,
            purpose,
            secret_hash,
            expires_at,
            used_at,
            invalidated_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, 'password_setup', $5, $6, NULL, NULL, NOW())
          RETURNING *
        `,
        [
          input.tenantPasswordSetupTokenId,
          input.authPrincipalId,
          input.sourceTenantAdminId,
          input.tokenId,
          input.secretHash,
          input.expiresAt,
        ],
      );
      return result.rows[0];
    },
    findPasswordSetupTokenByTokenId(tokenId) {
      return queryOne<TenantPasswordSetupTokenRecord>(
        `
          SELECT *
          FROM tenant_password_setup_token
          WHERE token_id = $1
        `,
        [tokenId],
      );
    },
    async invalidateActivePasswordSetupTokens(authPrincipalId) {
      await dbPool.query(
        `
          UPDATE tenant_password_setup_token
          SET invalidated_at = NOW()
          WHERE auth_principal_id = $1
            AND invalidated_at IS NULL
            AND used_at IS NULL
        `,
        [authPrincipalId],
      );
    },
    async markPasswordSetupTokenUsed(tokenId) {
      await dbPool.query(
        `
          UPDATE tenant_password_setup_token
          SET used_at = NOW()
          WHERE token_id = $1
        `,
        [tokenId],
      );
    },
    async completePasswordSetup(input) {
      const client = await dbPool.connect();

      try {
        await client.query("BEGIN");

        const principalResult = await client.query<{
          auth_principal_id: string;
          password_state: "setup_required" | "active";
        }>(
          `
            SELECT auth_principal_id, password_state
            FROM tenant_auth_principal
            WHERE auth_principal_id = $1
            FOR UPDATE
          `,
          [input.authPrincipalId],
        );

        const principal = principalResult.rows[0];
        if (!principal) {
          await client.query("ROLLBACK");
          return "principal_not_found";
        }

        if (principal.password_state === "active") {
          await client.query("ROLLBACK");
          return "password_already_set";
        }

        const tokenResult = await client.query<{ token_id: string }>(
          `
            UPDATE tenant_password_setup_token
            SET used_at = NOW()
            WHERE token_id = $1
              AND auth_principal_id = $2
              AND used_at IS NULL
              AND invalidated_at IS NULL
            RETURNING token_id
          `,
          [input.tokenId, input.authPrincipalId],
        );

        if ((tokenResult.rowCount ?? 0) === 0) {
          await client.query("ROLLBACK");
          return "token_not_active";
        }

        await client.query(
          `
            INSERT INTO tenant_password_credential (
              tenant_password_credential_id,
              auth_principal_id,
              password_hash,
              password_set_at,
              created_at,
              updated_at
            )
            VALUES (gen_random_uuid(), $1, crypt($2, gen_salt('bf', 12)), $3, NOW(), NOW())
            ON CONFLICT (auth_principal_id)
            DO UPDATE SET
              password_hash = crypt($2, gen_salt('bf', 12)),
              password_set_at = EXCLUDED.password_set_at,
              updated_at = NOW()
          `,
          [input.authPrincipalId, input.newPassword, input.passwordSetAt],
        );

        await client.query(
          `
            UPDATE tenant_auth_principal
            SET password_state = 'active',
                updated_at = NOW()
            WHERE auth_principal_id = $1
          `,
          [input.authPrincipalId],
        );

        await client.query("COMMIT");
        return "updated";
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async setPassword(authPrincipalId, newPassword, passwordSetAt) {
      await dbPool.query(
        `
          INSERT INTO tenant_password_credential (
            tenant_password_credential_id,
            auth_principal_id,
            password_hash,
            password_set_at,
            created_at,
            updated_at
          )
          VALUES (gen_random_uuid(), $1, crypt($2, gen_salt('bf', 12)), $3, NOW(), NOW())
          ON CONFLICT (auth_principal_id)
          DO UPDATE SET
            password_hash = crypt($2, gen_salt('bf', 12)),
            password_set_at = EXCLUDED.password_set_at,
            updated_at = NOW()
        `,
        [authPrincipalId, newPassword, passwordSetAt],
      );
      await dbPool.query(
        `
          UPDATE tenant_auth_principal
          SET password_state = 'active',
              updated_at = NOW()
          WHERE auth_principal_id = $1
        `,
        [authPrincipalId],
      );
    },
    async verifyPassword(authPrincipalId, password) {
      const result = await dbPool.query<{ accepted: boolean }>(
        `
          SELECT (password_hash = crypt($2, password_hash)) AS accepted
          FROM tenant_password_credential
          WHERE auth_principal_id = $1
        `,
        [authPrincipalId, password],
      );
      return result.rows[0]?.accepted ?? false;
    },
    async createSession(input: CreateTenantSessionInput) {
      const result = await dbPool.query<TenantSessionRecord>(
        `
          INSERT INTO tenant_session (
            session_id,
            auth_principal_id,
            active_tenant_id,
            selection_required,
            authenticated_at,
            expires_at,
            revoked_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NULL, NOW())
          RETURNING *
        `,
        [
          input.sessionId,
          input.authPrincipalId,
          input.activeTenantId,
          input.selectionRequired,
          input.authenticatedAt,
          input.expiresAt,
        ],
      );
      return result.rows[0];
    },
    findActiveSessionById(sessionId) {
      return queryOne<TenantSessionRecord>(
        `
          SELECT sess.*
          FROM tenant_session sess
          JOIN tenant_auth_principal ap
            ON ap.auth_principal_id = sess.auth_principal_id
          WHERE sess.session_id = $1
            AND sess.revoked_at IS NULL
            AND sess.expires_at > NOW()
            AND ap.disabled_at IS NULL
        `,
        [sessionId],
      );
    },
    updateSessionContext(sessionId, authPrincipalId, activeTenantId, selectionRequired) {
      return queryOne<TenantSessionRecord>(
        `
          UPDATE tenant_session
          SET active_tenant_id = $3,
              selection_required = $4
          WHERE session_id = $1
            AND auth_principal_id = $2
            AND revoked_at IS NULL
          RETURNING *
        `,
        [sessionId, authPrincipalId, activeTenantId, selectionRequired],
      );
    },
    async revokeSession(sessionId, authPrincipalId) {
      const result = await dbPool.query(
        `
          UPDATE tenant_session
          SET revoked_at = COALESCE(revoked_at, NOW())
          WHERE session_id = $1
            AND auth_principal_id = $2
        `,
        [sessionId, authPrincipalId],
      );
      return (result.rowCount ?? 0) > 0;
    },
  };
}
