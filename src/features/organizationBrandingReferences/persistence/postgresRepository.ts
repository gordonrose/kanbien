import type { Pool } from "pg";
import type { OrganizationLogoRelationshipData } from "../domain/types";
import type { OrganizationLogoRepository } from "./types";

interface LogoRecord {
  organization_logo_relationship_id: string;
  tenant_id: string;
  organization_id: string;
  asset_id: string;
  logo_type: "primary";
  alt_text: string;
  public_readiness_status: "ready" | "removed" | "superseded";
  published_at: Date | null;
  replaced_at: Date | null;
  cache_invalidation_status: "not_required" | "pending" | "recorded" | "failed_retryable";
  cache_invalidation_requested_at: Date | null;
  cleanup_eligible_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

function toData(record: LogoRecord): OrganizationLogoRelationshipData {
  return {
    organizationLogoRelationshipId: record.organization_logo_relationship_id,
    tenantId: record.tenant_id,
    organizationId: record.organization_id,
    assetId: record.asset_id,
    logoType: record.logo_type,
    altText: record.alt_text,
    publicReadinessStatus: record.public_readiness_status,
    publishedAt: record.published_at,
    replacedAt: record.replaced_at,
    cacheInvalidationStatus: record.cache_invalidation_status,
    cacheInvalidationRequestedAt: record.cache_invalidation_requested_at,
    cleanupEligibleAt: record.cleanup_eligible_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at,
  };
}

export function createPostgresOrganizationLogoRepository(dbPool: Pool): OrganizationLogoRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<OrganizationLogoRelationshipData | null> {
    const result = await dbPool.query<LogoRecord>(sql, params);
    return result.rows[0] ? toData(result.rows[0]) : null;
  }

  return {
    async findOrganizationSummaryById(organizationId) {
      const result = await dbPool.query<{
        tenant_id: string;
        organization_id: string;
        name: string;
      }>(
        `
          SELECT tenant_id, organization_id, name
          FROM organization
          WHERE organization_id = $1
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [organizationId],
      );
      const row = result.rows[0];
      return row ? { tenantId: row.tenant_id, organizationId: row.organization_id, name: row.name } : null;
    },
    findCurrent(tenantId, organizationId) {
      return queryOne(
        `
          SELECT *
          FROM organization_logo_relationship
          WHERE tenant_id = $1
            AND organization_id = $2
            AND logo_type = 'primary'
            AND public_readiness_status = 'ready'
            AND deleted_at IS NULL
          ORDER BY published_at DESC
          LIMIT 1
        `,
        [tenantId, organizationId],
      );
    },
    findCurrentByOrganizationId(organizationId) {
      return queryOne(
        `
          SELECT *
          FROM organization_logo_relationship
          WHERE organization_id = $1
            AND logo_type = 'primary'
            AND public_readiness_status = 'ready'
            AND deleted_at IS NULL
          ORDER BY published_at DESC
          LIMIT 1
        `,
        [organizationId],
      );
    },
    async replaceCurrent(input) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          `
            UPDATE organization_logo_relationship
            SET public_readiness_status = 'superseded',
                replaced_at = NOW(),
                cleanup_eligible_at = NOW() + INTERVAL '24 hours',
                updated_at = NOW(),
                deleted_at = NOW()
            WHERE tenant_id = $1
              AND organization_id = $2
              AND logo_type = 'primary'
              AND public_readiness_status = 'ready'
              AND deleted_at IS NULL
          `,
          [input.tenantId, input.organizationId],
        );
        const inserted = await client.query<LogoRecord>(
          `
            INSERT INTO organization_logo_relationship (
              organization_logo_relationship_id,
              tenant_id,
              organization_id,
              asset_id,
              logo_type,
              alt_text,
              public_readiness_status,
              published_at,
              cache_invalidation_status,
              cache_invalidation_requested_at,
              created_at,
              updated_at,
              deleted_at
            )
            VALUES ($1, $2, $3, $4, 'primary', $5, 'ready', NOW(), 'pending', NOW(), NOW(), NOW(), NULL)
            RETURNING *
          `,
          [
            input.organizationLogoRelationshipId,
            input.tenantId,
            input.organizationId,
            input.assetId,
            input.altText,
          ],
        );
        await client.query("COMMIT");
        return toData(inserted.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async removeCurrent(tenantId, organizationId) {
      const result = await dbPool.query<LogoRecord>(
        `
          UPDATE organization_logo_relationship
          SET public_readiness_status = 'removed',
              replaced_at = NOW(),
              cleanup_eligible_at = NOW() + INTERVAL '24 hours',
              cache_invalidation_status = 'pending',
              cache_invalidation_requested_at = NOW(),
              updated_at = NOW(),
              deleted_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND logo_type = 'primary'
            AND public_readiness_status = 'ready'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId],
      );
      return result.rows[0] ? toData(result.rows[0]) : null;
    },
    async recordAuditEvent(input) {
      await dbPool.query(
        `
          INSERT INTO organization_logo_audit_event (
            organization_logo_audit_event_id,
            organization_logo_relationship_id,
            tenant_id,
            organization_id,
            actor_type,
            actor_id,
            event_type,
            event_outcome,
            event_details,
            occurred_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
        `,
        [
          input.eventId,
          input.organizationLogoRelationshipId ?? null,
          input.tenantId,
          input.organizationId,
          input.actorType,
          input.actorId,
          input.eventType,
          input.eventOutcome,
          JSON.stringify(input.eventDetails),
          input.occurredAt,
        ],
      );
    },
  };
}
