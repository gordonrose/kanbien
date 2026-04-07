import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import type { RootRolesRepository } from "./repository";
import type {
  CapabilityCatalogListResult,
  CreateRootRoleAssignmentInput,
  CreateRootRoleRecordInput,
  ReplaceCapabilityGrantsInput,
  ReplaceRootRoleAssignmentInput,
  RootRoleAssignmentListInput,
  RootRoleAssignmentListResult,
  RootRoleRecord,
  RootRoleRepositoryListInput,
  RootRoleRepositoryListResult,
  UnassignRootRoleAssignmentInput,
  UpdateRootRoleRecordInput,
} from "./types";
import type {
  EffectivePermissionData,
  EffectiveRootUserPermissionsData,
  RootCapabilityCatalogItem,
  RootRoleAssignmentData,
  RootRoleData,
} from "../domain/types";
import {
  getRootAuthzCapabilityEntry,
  ROOT_AUTHZ_CAPABILITY_CATALOG,
  ROOT_USER_ADMIN_ROLE_KEY,
} from "../domain/capabilityCatalog";

interface RootRoleAssignmentRecord {
  root_user_role_assignment_id: string;
  root_user_id: string;
  system_root_role_id: string;
  role_key: string;
  display_name: string;
  is_protected: boolean;
  assigned_at: Date;
  unassigned_at: Date | null;
}

interface RootCapabilityRecord {
  capability_key: string;
  description: string;
  mandatory: boolean;
  protected: boolean;
}

interface EffectivePermissionRow {
  capability_key: string;
  role_keys: string[];
}

function normalizeRoleKey(roleKey: string): string {
  return roleKey.trim().toLowerCase();
}

function toRoleData(record: RootRoleRecord): RootRoleData {
  return {
    rootRoleId: record.system_root_role_id,
    roleKey: record.role_key,
    displayName: record.display_name,
    description: record.description,
    protected: record.is_protected,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deactivatedAt: record.deactivated_at,
    activeGrantCount: Number(record.active_grant_count),
  };
}

function toAssignmentData(record: RootRoleAssignmentRecord): RootRoleAssignmentData {
  return {
    rootRoleAssignmentId: record.root_user_role_assignment_id,
    rootUserId: record.root_user_id,
    rootRoleId: record.system_root_role_id,
    roleKey: record.role_key,
    displayName: record.display_name,
    protected: record.is_protected,
    assignedAt: record.assigned_at,
    unassignedAt: record.unassigned_at,
  };
}

function toCapabilityData(record: RootCapabilityRecord): RootCapabilityCatalogItem {
  return {
    capabilityKey: record.capability_key,
    description: record.description,
    mandatory: record.mandatory,
    protected: record.protected,
  };
}

async function createAuditEvent(
  client: PoolClient,
  input: {
    actorRootUserId: string;
    targetRootUserId?: string;
    rootRoleId?: string;
    assignmentId?: string;
    eventType: string;
    eventOutcome: "success" | "failure";
    reason?: string;
    beforeState?: unknown;
    afterState?: unknown;
  },
): Promise<void> {
  await client.query(
    `
      INSERT INTO root_role_audit_events (
        root_role_audit_event_id,
        actor_root_user_id,
        target_root_user_id,
        system_root_role_id,
        root_user_role_assignment_id,
        event_type,
        event_outcome,
        reason,
        before_state,
        after_state,
        occurred_at
      )
      VALUES (
        gen_random_uuid(),
        $1, $2, $3, $4, $5, $6, $7,
        CASE WHEN $8::text IS NULL THEN NULL ELSE $8::jsonb END,
        CASE WHEN $9::text IS NULL THEN NULL ELSE $9::jsonb END,
        NOW()
      )
    `,
    [
      input.actorRootUserId,
      input.targetRootUserId ?? null,
      input.rootRoleId ?? null,
      input.assignmentId ?? null,
      input.eventType,
      input.eventOutcome,
      input.reason ?? null,
      input.beforeState ? JSON.stringify(input.beforeState) : null,
      input.afterState ? JSON.stringify(input.afterState) : null,
    ],
  );
}

async function loadEffectivePermissions(
  client: PoolClient | Pool,
  rootUserId: string,
): Promise<EffectiveRootUserPermissionsData> {
  const rolesResult = await client.query<RootRoleAssignmentRecord>(
    `
      SELECT
        rua.root_user_role_assignment_id,
        rua.root_user_id,
        rua.system_root_role_id,
        r.role_key,
        r.display_name,
        r.is_protected,
        rua.assigned_at,
        rua.unassigned_at
      FROM root_user_role_assignments rua
      JOIN system_root_roles r
        ON r.system_root_role_id = rua.system_root_role_id
      WHERE rua.root_user_id = $1
        AND rua.unassigned_at IS NULL
      ORDER BY r.role_key ASC, rua.assigned_at ASC
    `,
    [rootUserId],
  );
  const permissionsResult = await client.query<EffectivePermissionRow>(
    `
      SELECT
        rg.capability_key,
        ARRAY_AGG(DISTINCT r.role_key ORDER BY r.role_key) AS role_keys
      FROM root_user_role_assignments rua
      JOIN system_root_roles r
        ON r.system_root_role_id = rua.system_root_role_id
      JOIN system_root_role_capability_grants rg
        ON rg.system_root_role_id = rua.system_root_role_id
      WHERE rua.root_user_id = $1
        AND rua.unassigned_at IS NULL
        AND rg.revoked_at IS NULL
      GROUP BY rg.capability_key
      ORDER BY rg.capability_key ASC
    `,
    [rootUserId],
  );

  return {
    rootUserId,
    roles: rolesResult.rows.map(toAssignmentData),
    permissions: permissionsResult.rows.map(
      (row): EffectivePermissionData => ({
        capabilityKey: row.capability_key,
        grantedByRoleKeys: row.role_keys,
      }),
    ),
  };
}

export function createPostgresRootRolesRepository(dbPool: Pool): RootRolesRepository {
  async function findRoleInternal(
    client: Pool | PoolClient,
    clause: string,
    value: string,
  ): Promise<RootRoleData | null> {
    const result = await client.query<RootRoleRecord>(
      `
        SELECT
          r.system_root_role_id,
          r.role_key,
          r.normalized_role_key,
          r.display_name,
          r.description,
          r.is_protected,
          r.created_at,
          r.updated_at,
          r.deactivated_at,
          (
            SELECT COUNT(*)
            FROM system_root_role_capability_grants rg
            WHERE rg.system_root_role_id = r.system_root_role_id
              AND rg.revoked_at IS NULL
          )::int AS active_grant_count
        FROM system_root_roles r
        WHERE ${clause} = $1
      `,
      [value],
    );
    return result.rows[0] ? toRoleData(result.rows[0]) : null;
  }

  async function listCapabilitiesInternal(
    client: Pool | PoolClient,
    input: { rootRoleId: string; page: number; pageSize: number; assignedOnly: boolean },
  ): Promise<CapabilityCatalogListResult> {
    const totals = await client.query(
      `
        SELECT COUNT(*)::int AS total
        FROM root_authz_capabilities c
        ${input.assignedOnly ? `
          JOIN system_root_role_capability_grants rg
            ON rg.capability_key = c.capability_key
           AND rg.system_root_role_id = $1
           AND rg.revoked_at IS NULL
        ` : ""}
      `,
      input.assignedOnly ? [input.rootRoleId] : [],
    );
    const result = await client.query<RootCapabilityRecord>(
      `
        SELECT
          c.capability_key,
          c.description,
          COALESCE(rg.is_mandatory, false) AS mandatory,
          COALESCE(rg.is_protected, false) AS protected
        FROM root_authz_capabilities c
        LEFT JOIN system_root_role_capability_grants rg
          ON rg.capability_key = c.capability_key
         AND rg.system_root_role_id = $1
         AND rg.revoked_at IS NULL
        ${input.assignedOnly ? `WHERE rg.system_root_role_capability_grant_id IS NOT NULL` : ""}
        ORDER BY c.capability_key ASC
        LIMIT $2
        OFFSET $3
      `,
      [input.rootRoleId, input.pageSize, (input.page - 1) * input.pageSize],
    );

    return {
      items: result.rows.map(toCapabilityData),
      totalSearchableRecords: Number(totals.rows[0]?.total ?? 0),
      totalMatchingRecords: Number(totals.rows[0]?.total ?? 0),
    };
  }

  return {
    async hasCapability(rootUserId, capabilityKey) {
      const result = await dbPool.query(
        `
          SELECT 1
          FROM root_user_role_assignments rua
          JOIN system_root_roles r
            ON r.system_root_role_id = rua.system_root_role_id
          JOIN system_root_role_capability_grants rg
            ON rg.system_root_role_id = rua.system_root_role_id
          WHERE rua.root_user_id = $1
            AND rua.unassigned_at IS NULL
            AND r.deactivated_at IS NULL
            AND rg.revoked_at IS NULL
            AND rg.capability_key = $2
          LIMIT 1
        `,
        [rootUserId, capabilityKey],
      );
      return (result.rowCount ?? 0) > 0;
    },
    async createRole(input) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query<RootRoleRecord>(
          `
            INSERT INTO system_root_roles (
              system_root_role_id,
              role_key,
              normalized_role_key,
              display_name,
              description,
              is_protected,
              created_at,
              updated_at,
              deactivated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NULL)
            RETURNING
              system_root_role_id,
              role_key,
              normalized_role_key,
              display_name,
              description,
              is_protected,
              created_at,
              updated_at,
              deactivated_at,
              0::int AS active_grant_count
          `,
          [
            input.rootRoleId,
            input.roleKey.trim(),
            normalizeRoleKey(input.roleKey),
            input.displayName.trim(),
            input.description.trim(),
            input.isProtected,
          ],
        );
        const created = toRoleData(result.rows[0]);
        await createAuditEvent(client, {
          actorRootUserId: input.actorRootUserId,
          rootRoleId: created.rootRoleId,
          eventType: "root_role_created",
          eventOutcome: "success",
          afterState: created,
        });
        await client.query("COMMIT");
        return created;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    findRoleById(rootRoleId) {
      return findRoleInternal(dbPool, "r.system_root_role_id", rootRoleId);
    },
    findRoleByKey(roleKey) {
      return findRoleInternal(dbPool, "r.normalized_role_key", normalizeRoleKey(roleKey));
    },
    async listRoles(input) {
      const scope = input.includeInactive ? "" : "WHERE r.deactivated_at IS NULL";
      const totals = await dbPool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM system_root_roles r
          ${scope}
        `,
      );
      const result = await dbPool.query<RootRoleRecord>(
        `
          SELECT
            r.system_root_role_id,
            r.role_key,
            r.normalized_role_key,
            r.display_name,
            r.description,
            r.is_protected,
            r.created_at,
            r.updated_at,
            r.deactivated_at,
            (
              SELECT COUNT(*)
              FROM system_root_role_capability_grants rg
              WHERE rg.system_root_role_id = r.system_root_role_id
                AND rg.revoked_at IS NULL
            )::int AS active_grant_count
          FROM system_root_roles r
          ${scope}
          ORDER BY r.updated_at DESC, r.system_root_role_id DESC
          LIMIT $1
          OFFSET $2
        `,
        [input.pageSize, (input.page - 1) * input.pageSize],
      );
      return {
        items: result.rows.map(toRoleData),
        totalSearchableRecords: Number(totals.rows[0]?.total ?? 0),
        totalMatchingRecords: Number(totals.rows[0]?.total ?? 0),
      };
    },
    async updateRole(input) {
      const current = await findRoleInternal(dbPool, "r.system_root_role_id", input.rootRoleId);
      if (!current) {
        return null;
      }
      const updates: string[] = [];
      const values: unknown[] = [];
      if (input.displayName !== undefined) {
        values.push(input.displayName.trim());
        updates.push(`display_name = $${values.length}`);
      }
      if (input.description !== undefined) {
        values.push(input.description.trim());
        updates.push(`description = $${values.length}`);
      }
      updates.push("updated_at = NOW()");
      values.push(input.rootRoleId);
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query<RootRoleRecord>(
          `
            UPDATE system_root_roles
            SET ${updates.join(", ")}
            WHERE system_root_role_id = $${values.length}
            RETURNING
              system_root_role_id,
              role_key,
              normalized_role_key,
              display_name,
              description,
              is_protected,
              created_at,
              updated_at,
              deactivated_at,
              (
                SELECT COUNT(*)
                FROM system_root_role_capability_grants rg
                WHERE rg.system_root_role_id = system_root_roles.system_root_role_id
                  AND rg.revoked_at IS NULL
              )::int AS active_grant_count
          `,
          values,
        );
        const updated = result.rows[0] ? toRoleData(result.rows[0]) : null;
        if (updated) {
          await createAuditEvent(client, {
            actorRootUserId: input.actorRootUserId,
            rootRoleId: updated.rootRoleId,
            eventType: "root_role_updated",
            eventOutcome: "success",
            beforeState: current,
            afterState: updated,
          });
        }
        await client.query("COMMIT");
        return updated;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async deactivateRole(rootRoleId, actorRootUserId) {
      const current = await findRoleInternal(dbPool, "r.system_root_role_id", rootRoleId);
      if (!current) {
        return null;
      }
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query<RootRoleRecord>(
          `
            UPDATE system_root_roles
            SET deactivated_at = NOW(), updated_at = NOW()
            WHERE system_root_role_id = $1
            RETURNING
              system_root_role_id,
              role_key,
              normalized_role_key,
              display_name,
              description,
              is_protected,
              created_at,
              updated_at,
              deactivated_at,
              (
                SELECT COUNT(*)
                FROM system_root_role_capability_grants rg
                WHERE rg.system_root_role_id = system_root_roles.system_root_role_id
                  AND rg.revoked_at IS NULL
              )::int AS active_grant_count
          `,
          [rootRoleId],
        );
        const updated = result.rows[0] ? toRoleData(result.rows[0]) : null;
        if (updated) {
          await createAuditEvent(client, {
            actorRootUserId,
            rootRoleId: updated.rootRoleId,
            eventType: "root_role_deactivated",
            eventOutcome: "success",
            beforeState: current,
            afterState: updated,
          });
        }
        await client.query("COMMIT");
        return updated;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async reactivateRole(rootRoleId, actorRootUserId) {
      const current = await findRoleInternal(dbPool, "r.system_root_role_id", rootRoleId);
      if (!current) {
        return null;
      }
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query<RootRoleRecord>(
          `
            UPDATE system_root_roles
            SET deactivated_at = NULL, updated_at = NOW()
            WHERE system_root_role_id = $1
            RETURNING
              system_root_role_id,
              role_key,
              normalized_role_key,
              display_name,
              description,
              is_protected,
              created_at,
              updated_at,
              deactivated_at,
              (
                SELECT COUNT(*)
                FROM system_root_role_capability_grants rg
                WHERE rg.system_root_role_id = system_root_roles.system_root_role_id
                  AND rg.revoked_at IS NULL
              )::int AS active_grant_count
          `,
          [rootRoleId],
        );
        const updated = result.rows[0] ? toRoleData(result.rows[0]) : null;
        if (updated) {
          await createAuditEvent(client, {
            actorRootUserId,
            rootRoleId: updated.rootRoleId,
            eventType: "root_role_reactivated",
            eventOutcome: "success",
            beforeState: current,
            afterState: updated,
          });
        }
        await client.query("COMMIT");
        return updated;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    listEligibleCapabilities(input) {
      return listCapabilitiesInternal(dbPool, {
        ...input,
        assignedOnly: false,
      });
    },
    listRoleCapabilityAssignments(input) {
      return listCapabilitiesInternal(dbPool, {
        ...input,
        assignedOnly: true,
      });
    },
    async replaceRoleCapabilityGrants(input) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const roleResult = await client.query<{ role_key: string }>(
          `SELECT role_key FROM system_root_roles WHERE system_root_role_id = $1 FOR UPDATE`,
          [input.rootRoleId],
        );
        const roleKey = roleResult.rows[0]?.role_key ?? "";
        const currentResult = await client.query<RootCapabilityRecord>(
          `
            SELECT
              rg.capability_key,
              c.description,
              rg.is_mandatory AS mandatory,
              rg.is_protected AS protected
            FROM system_root_role_capability_grants rg
            JOIN root_authz_capabilities c
              ON c.capability_key = rg.capability_key
            WHERE rg.system_root_role_id = $1
              AND rg.revoked_at IS NULL
          `,
          [input.rootRoleId],
        );
        const currentKeys = new Set(currentResult.rows.map((row) => row.capability_key));
        const desiredKeys = new Set(input.capabilityKeys);
        const toRevoke = [...currentKeys].filter((capabilityKey) => !desiredKeys.has(capabilityKey));
        const toUpsert = [...desiredKeys];

        if (toRevoke.length > 0) {
          await client.query(
            `
              UPDATE system_root_role_capability_grants
              SET revoked_at = NOW(), updated_at = NOW()
              WHERE system_root_role_id = $1
                AND capability_key = ANY($2::text[])
                AND revoked_at IS NULL
            `,
            [input.rootRoleId, toRevoke],
          );
        }

        for (const capabilityKey of toUpsert) {
          const entry = getRootAuthzCapabilityEntry(capabilityKey);
          await client.query(
            `
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
              VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW(), NULL)
              ON CONFLICT (system_root_role_id, capability_key)
              DO UPDATE
                SET is_mandatory = EXCLUDED.is_mandatory,
                    is_protected = EXCLUDED.is_protected,
                    revoked_at = NULL,
                    updated_at = NOW()
            `,
            [
              input.rootRoleId,
              capabilityKey,
              roleKey === ROOT_USER_ADMIN_ROLE_KEY
                ? (entry?.mandatoryForRootUserAdmin ?? false)
                : false,
              roleKey === ROOT_USER_ADMIN_ROLE_KEY
                ? (entry?.protectedForRootUserAdmin ?? false)
                : false,
            ],
          );
        }

        await createAuditEvent(client, {
          actorRootUserId: input.actorRootUserId,
          rootRoleId: input.rootRoleId,
          eventType: "root_role_capability_grants_replaced",
          eventOutcome: "success",
          reason: input.reason,
          beforeState: currentResult.rows.map((row) => row.capability_key).sort(),
          afterState: [...desiredKeys].sort(),
        });

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      return listCapabilitiesInternal(dbPool, {
        rootRoleId: input.rootRoleId,
        page: 1,
        pageSize: 1000,
        assignedOnly: true,
      });
    },
    async createRoleAssignment(input) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query<RootRoleAssignmentRecord>(
          `
            INSERT INTO root_user_role_assignments (
              root_user_role_assignment_id,
              root_user_id,
              system_root_role_id,
              assigned_by_root_user_id,
              assigned_reason,
              assigned_at,
              updated_at,
              unassigned_at,
              unassigned_by_root_user_id,
              unassigned_reason
            )
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NULL, NULL, NULL)
            RETURNING
              root_user_role_assignment_id,
              root_user_id,
              system_root_role_id,
              (
                SELECT role_key
                FROM system_root_roles
                WHERE system_root_role_id = root_user_role_assignments.system_root_role_id
              ) AS role_key,
              (
                SELECT display_name
                FROM system_root_roles
                WHERE system_root_role_id = root_user_role_assignments.system_root_role_id
              ) AS display_name,
              (
                SELECT is_protected
                FROM system_root_roles
                WHERE system_root_role_id = root_user_role_assignments.system_root_role_id
              ) AS is_protected,
              assigned_at,
              unassigned_at
          `,
          [
            input.assignmentId,
            input.rootUserId,
            input.rootRoleId,
            input.actorRootUserId,
            input.reason ?? null,
          ],
        );
        await createAuditEvent(client, {
          actorRootUserId: input.actorRootUserId,
          targetRootUserId: input.rootUserId,
          rootRoleId: input.rootRoleId,
          assignmentId: input.assignmentId,
          eventType: "root_role_assignment_created",
          eventOutcome: "success",
          reason: input.reason,
          afterState: result.rows[0],
        });
        await client.query("COMMIT");
        return toAssignmentData(result.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async unassignRoleAssignment(input) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const before = await client.query<RootRoleAssignmentRecord>(
          `
            SELECT
              rua.root_user_role_assignment_id,
              rua.root_user_id,
              rua.system_root_role_id,
              r.role_key,
              r.display_name,
              r.is_protected,
              rua.assigned_at,
              rua.unassigned_at
            FROM root_user_role_assignments rua
            JOIN system_root_roles r
              ON r.system_root_role_id = rua.system_root_role_id
            WHERE rua.root_user_role_assignment_id = $1
              AND rua.root_user_id = $2
              AND rua.unassigned_at IS NULL
            FOR UPDATE
          `,
          [input.rootRoleAssignmentId, input.rootUserId],
        );
        const result = await client.query<RootRoleAssignmentRecord>(
          `
            UPDATE root_user_role_assignments
            SET unassigned_at = NOW(),
                unassigned_by_root_user_id = $3,
                unassigned_reason = $4,
                updated_at = NOW()
            WHERE root_user_role_assignment_id = $1
              AND root_user_id = $2
              AND unassigned_at IS NULL
            RETURNING
              root_user_role_assignment_id,
              root_user_id,
              system_root_role_id,
              (
                SELECT role_key
                FROM system_root_roles
                WHERE system_root_role_id = root_user_role_assignments.system_root_role_id
              ) AS role_key,
              (
                SELECT display_name
                FROM system_root_roles
                WHERE system_root_role_id = root_user_role_assignments.system_root_role_id
              ) AS display_name,
              (
                SELECT is_protected
                FROM system_root_roles
                WHERE system_root_role_id = root_user_role_assignments.system_root_role_id
              ) AS is_protected,
              assigned_at,
              unassigned_at
          `,
          [
            input.rootRoleAssignmentId,
            input.rootUserId,
            input.actorRootUserId,
            input.reason ?? null,
          ],
        );
        if (result.rows[0]) {
          await createAuditEvent(client, {
            actorRootUserId: input.actorRootUserId,
            targetRootUserId: input.rootUserId,
            rootRoleId: result.rows[0].system_root_role_id,
            assignmentId: input.rootRoleAssignmentId,
            eventType: "root_role_assignment_unassigned",
            eventOutcome: "success",
            reason: input.reason,
            beforeState: before.rows[0] ?? null,
            afterState: result.rows[0],
          });
        }
        await client.query("COMMIT");
        return result.rows[0] ? toAssignmentData(result.rows[0]) : null;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async listRootUserAssignments(input) {
      const totals = await dbPool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM root_user_role_assignments
          WHERE root_user_id = $1
            AND unassigned_at IS NULL
        `,
        [input.rootUserId],
      );
      const result = await dbPool.query<RootRoleAssignmentRecord>(
        `
          SELECT
            rua.root_user_role_assignment_id,
            rua.root_user_id,
            rua.system_root_role_id,
            r.role_key,
            r.display_name,
            r.is_protected,
            rua.assigned_at,
            rua.unassigned_at
          FROM root_user_role_assignments rua
          JOIN system_root_roles r
            ON r.system_root_role_id = rua.system_root_role_id
          WHERE rua.root_user_id = $1
            AND rua.unassigned_at IS NULL
          ORDER BY rua.assigned_at DESC, rua.root_user_role_assignment_id DESC
          LIMIT $2
          OFFSET $3
        `,
        [input.rootUserId, input.pageSize, (input.page - 1) * input.pageSize],
      );
      return {
        items: result.rows.map(toAssignmentData),
        totalSearchableRecords: Number(totals.rows[0]?.total ?? 0),
        totalMatchingRecords: Number(totals.rows[0]?.total ?? 0),
      };
    },
    async replaceRoleAssignment(input) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const sourceResult = await client.query<RootRoleAssignmentRecord>(
          `
            SELECT
              rua.root_user_role_assignment_id,
              rua.root_user_id,
              rua.system_root_role_id,
              r.role_key,
              r.display_name,
              r.is_protected,
              rua.assigned_at,
              rua.unassigned_at
            FROM root_user_role_assignments rua
            JOIN system_root_roles r
              ON r.system_root_role_id = rua.system_root_role_id
            WHERE rua.root_user_id = $1
              AND rua.unassigned_at IS NULL
              AND (
                ($2::uuid IS NOT NULL AND rua.root_user_role_assignment_id = $2::uuid)
                OR ($3::uuid IS NOT NULL AND rua.system_root_role_id = $3::uuid)
              )
            ORDER BY rua.assigned_at DESC
            LIMIT 1
            FOR UPDATE
          `,
          [
            input.rootUserId,
            input.sourceRootRoleAssignmentId ?? null,
            input.sourceRootRoleId ?? null,
          ],
        );
        const source = sourceResult.rows[0];
        if (!source) {
          throw new Error("Missing source root-role assignment");
        }
        await client.query(
          `
            UPDATE root_user_role_assignments
            SET unassigned_at = NOW(),
                unassigned_by_root_user_id = $2,
                unassigned_reason = $3,
                updated_at = NOW()
            WHERE root_user_role_assignment_id = $1
          `,
          [source.root_user_role_assignment_id, input.actorRootUserId, input.reason ?? null],
        );
        const newAssignmentId = randomUUID();
        await client.query(
          `
            INSERT INTO root_user_role_assignments (
              root_user_role_assignment_id,
              root_user_id,
              system_root_role_id,
              assigned_by_root_user_id,
              assigned_reason,
              assigned_at,
              updated_at,
              unassigned_at,
              unassigned_by_root_user_id,
              unassigned_reason
            )
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NULL, NULL, NULL)
          `,
          [
            newAssignmentId,
            input.rootUserId,
            input.targetRootRoleId,
            input.actorRootUserId,
            input.reason ?? null,
          ],
        );
        const effective = await loadEffectivePermissions(client, input.rootUserId);
        await createAuditEvent(client, {
          actorRootUserId: input.actorRootUserId,
          targetRootUserId: input.rootUserId,
          rootRoleId: input.targetRootRoleId,
          assignmentId: newAssignmentId,
          eventType: "root_role_assignment_replaced",
          eventOutcome: "success",
          reason: input.reason,
          beforeState: source,
          afterState: effective,
        });
        await client.query("COMMIT");
        return effective;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    getEffectivePermissions(rootUserId) {
      return loadEffectivePermissions(dbPool, rootUserId);
    },
    async countActiveAssignmentsForRoleKey(roleKey) {
      const result = await dbPool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM root_user_role_assignments rua
          JOIN system_root_roles r
            ON r.system_root_role_id = rua.system_root_role_id
          WHERE rua.unassigned_at IS NULL
            AND r.role_key = $1
        `,
        [roleKey],
      );
      return Number(result.rows[0]?.total ?? 0);
    },
    async countActiveAssignmentsForRootUser(rootUserId) {
      const result = await dbPool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM root_user_role_assignments
          WHERE root_user_id = $1
            AND unassigned_at IS NULL
        `,
        [rootUserId],
      );
      return Number(result.rows[0]?.total ?? 0);
    },
    async findActiveAssignmentByRole(rootUserId, rootRoleId) {
      const result = await dbPool.query<RootRoleAssignmentRecord>(
        `
          SELECT
            rua.root_user_role_assignment_id,
            rua.root_user_id,
            rua.system_root_role_id,
            r.role_key,
            r.display_name,
            r.is_protected,
            rua.assigned_at,
            rua.unassigned_at
          FROM root_user_role_assignments rua
          JOIN system_root_roles r
            ON r.system_root_role_id = rua.system_root_role_id
          WHERE rua.root_user_id = $1
            AND rua.system_root_role_id = $2
            AND rua.unassigned_at IS NULL
          ORDER BY rua.assigned_at DESC
          LIMIT 1
        `,
        [rootUserId, rootRoleId],
      );
      return result.rows[0] ? toAssignmentData(result.rows[0]) : null;
    },
    async findActiveAssignmentById(rootUserId, rootRoleAssignmentId) {
      const result = await dbPool.query<RootRoleAssignmentRecord>(
        `
          SELECT
            rua.root_user_role_assignment_id,
            rua.root_user_id,
            rua.system_root_role_id,
            r.role_key,
            r.display_name,
            r.is_protected,
            rua.assigned_at,
            rua.unassigned_at
          FROM root_user_role_assignments rua
          JOIN system_root_roles r
            ON r.system_root_role_id = rua.system_root_role_id
          WHERE rua.root_user_id = $1
            AND rua.root_user_role_assignment_id = $2
            AND rua.unassigned_at IS NULL
          LIMIT 1
        `,
        [rootUserId, rootRoleAssignmentId],
      );
      return result.rows[0] ? toAssignmentData(result.rows[0]) : null;
    },
  };
}
