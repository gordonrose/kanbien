import type { Pool } from "pg";
import type { WebAppSurfaceDiscoveryRepository } from "./repository";
import type {
  CompleteWebAppDiscoveryRunRecordInput,
  CreateDiscoveredWebAppSurfaceObservationRecordInput,
  CreateDiscoveredWebAppSurfaceRecordInput,
  CreateDiscoveredWebAppStructureNodeRecordInput,
  CreateDiscoveredWebAppStructureObservationRecordInput,
  CreateWebAppDiscoveryRunRecordInput,
  DiscoveredWebAppStructureNodeRecord,
  DiscoveredWebAppSurfaceRecord,
  RefreshDiscoveredWebAppSurfaceRecordInput,
  RefreshDiscoveredWebAppStructureNodeRecordInput,
  WebAppDiscoveryRunRecord,
} from "./types";
import type {
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppSurfaceData,
  ListDiscoveredWebAppStructureTreeInput,
  ListDiscoveredWebAppSurfacesInput,
  ListDiscoveryRunsInput,
  PaginatedResult,
  WebAppDiscoveryRunData,
  WebAppRootFamilyId,
} from "../domain/types";

function toRunData(record: WebAppDiscoveryRunRecord): WebAppDiscoveryRunData {
  return {
    webAppDiscoveryRunId: record.web_app_discovery_run_id,
    scopeKey: record.scope_key,
    status: record.status,
    triggerKind: record.trigger_kind,
    providerVersion: record.provider_version,
    createdByRootAdminUserId: record.created_by_root_admin_user_id,
    startedAt: record.started_at,
    completedAt: record.completed_at,
    failureSummary: record.failure_summary,
    createdCount: record.created_count,
    refreshedCount: record.refreshed_count,
    unchangedCount: record.unchanged_count,
    staleCount: record.stale_count,
    supportOnlyCount: record.support_only_count,
    reviewRequiredCount: record.review_required_count,
    structureCreatedCount: record.structure_created_count,
    structureRefreshedCount: record.structure_refreshed_count,
    structureUnchangedCount: record.structure_unchanged_count,
    structureStaleCount: record.structure_stale_count,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function toSurfaceData(record: DiscoveredWebAppSurfaceRecord): DiscoveredWebAppSurfaceData {
  return {
    discoveredWebAppSurfaceId: record.discovered_web_app_surface_id,
    rootFamilyId: record.root_family_id,
    discoveryKey: record.discovery_key,
    surfaceKind: record.surface_kind,
    locatorType: record.locator_type,
    routePath: record.route_path,
    routeHash: record.route_hash,
    canonicalLocator: record.canonical_locator,
    displayLabel: record.display_label,
    userFacingDisposition: record.user_facing_disposition,
    providerKey: record.provider_key,
    implementationSourcePath: record.implementation_source_path,
    firstDiscoveredRunId: record.first_discovered_run_id,
    lastDiscoveredRunId: record.last_discovered_run_id,
    firstDiscoveredAt: record.first_discovered_at,
    lastDiscoveredAt: record.last_discovered_at,
    staleAt: record.stale_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function toStructureNodeData(
  record: DiscoveredWebAppStructureNodeRecord,
): DiscoveredWebAppStructureNodeData {
  return {
    discoveredWebAppStructureNodeId: record.discovered_web_app_structure_node_id,
    rootFamilyId: record.root_family_id,
    structureKey: record.structure_key,
    parentStructureKey: record.parent_structure_key,
    parentDiscoveredWebAppStructureNodeId:
      record.parent_discovered_web_app_structure_node_id,
    nodeKey: record.node_key,
    nodeKind: record.node_kind,
    displayLabel: record.display_label,
    depth: record.depth,
    linkedDiscoveredWebAppSurfaceId: record.linked_discovered_web_app_surface_id,
    providerKey: record.provider_key,
    implementationSourcePath: record.implementation_source_path,
    firstDiscoveredRunId: record.first_discovered_run_id,
    lastDiscoveredRunId: record.last_discovered_run_id,
    firstDiscoveredAt: record.first_discovered_at,
    lastDiscoveredAt: record.last_discovered_at,
    staleAt: record.stale_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function createPostgresWebAppSurfaceDiscoveryRepository(
  dbPool: Pool,
): WebAppSurfaceDiscoveryRepository {
  return {
    async createDiscoveryRun(input) {
      const result = await dbPool.query<WebAppDiscoveryRunRecord>(
        `
          INSERT INTO web_app_discovery_runs (
            web_app_discovery_run_id,
            scope_key,
            status,
            trigger_kind,
            provider_version,
            created_by_root_admin_user_id,
            started_at,
            completed_at,
            failure_summary,
            created_count,
            refreshed_count,
            unchanged_count,
            stale_count,
            support_only_count,
            review_required_count,
            structure_created_count,
            structure_refreshed_count,
            structure_unchanged_count,
            structure_stale_count,
            created_at,
            updated_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, NULL, NULL,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NOW(), NOW()
          )
          RETURNING *
        `,
        [
          input.webAppDiscoveryRunId,
          input.scopeKey,
          input.status,
          input.triggerKind,
          input.providerVersion,
          input.createdByRootAdminUserId,
          input.startedAt,
        ],
      );
      return toRunData(result.rows[0]!);
    },

    async completeDiscoveryRun(input) {
      const result = await dbPool.query<WebAppDiscoveryRunRecord>(
        `
          UPDATE web_app_discovery_runs
          SET
            status = $2,
            completed_at = $3,
            failure_summary = $4,
            created_count = $5,
            refreshed_count = $6,
            unchanged_count = $7,
            stale_count = $8,
            support_only_count = $9,
            review_required_count = $10,
            structure_created_count = $11,
            structure_refreshed_count = $12,
            structure_unchanged_count = $13,
            structure_stale_count = $14,
            updated_at = NOW()
          WHERE web_app_discovery_run_id = $1
          RETURNING *
        `,
        [
          input.webAppDiscoveryRunId,
          input.status,
          input.completedAt,
          input.failureSummary,
          input.createdCount,
          input.refreshedCount,
          input.unchangedCount,
          input.staleCount,
          input.supportOnlyCount,
          input.reviewRequiredCount,
          input.structureCreatedCount,
          input.structureRefreshedCount,
          input.structureUnchangedCount,
          input.structureStaleCount,
        ],
      );
      return toRunData(result.rows[0]!);
    },

    async findDiscoveryRunById(webAppDiscoveryRunId) {
      const result = await dbPool.query<WebAppDiscoveryRunRecord>(
        `SELECT * FROM web_app_discovery_runs WHERE web_app_discovery_run_id = $1`,
        [webAppDiscoveryRunId],
      );
      return result.rows[0] ? toRunData(result.rows[0]) : null;
    },

    async listDiscoveryRuns(input) {
      const where: string[] = [];
      const values: unknown[] = [];
      if (input.filters.status) {
        values.push(input.filters.status);
        where.push(`status = $${values.length}`);
      }
      if (input.filters.triggerKind) {
        values.push(input.filters.triggerKind);
        where.push(`trigger_kind = $${values.length}`);
      }

      const result = await dbPool.query<WebAppDiscoveryRunRecord>(
        `
          SELECT *
          FROM web_app_discovery_runs
          ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
          ORDER BY started_at DESC, web_app_discovery_run_id DESC
        `,
        values,
      );
      const start = (input.page - 1) * input.pageSize;
      return {
        items: result.rows.slice(start, start + input.pageSize).map(toRunData),
        totalMatchingRecords: result.rows.length,
      };
    },

    async findSurfaceByCanonicalLocator(canonicalLocator) {
      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `SELECT * FROM discovered_web_app_surfaces WHERE canonical_locator = $1`,
        [canonicalLocator],
      );
      return result.rows[0] ? toSurfaceData(result.rows[0]) : null;
    },

    async createDiscoveredSurface(input) {
      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `
          INSERT INTO discovered_web_app_surfaces (
            discovered_web_app_surface_id,
            root_family_id,
            discovery_key,
            surface_kind,
            locator_type,
            route_path,
            route_hash,
            canonical_locator,
            display_label,
            user_facing_disposition,
            provider_key,
            implementation_source_path,
            first_discovered_run_id,
            last_discovered_run_id,
            first_discovered_at,
            last_discovered_at,
            stale_at,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NULL, NOW(), NOW())
          RETURNING *
        `,
        [
          input.discoveredWebAppSurfaceId,
          input.rootFamilyId,
          input.discoveryKey,
          input.surfaceKind,
          input.locatorType,
          input.routePath,
          input.routeHash,
          input.canonicalLocator,
          input.displayLabel,
          input.userFacingDisposition,
          input.providerKey,
          input.implementationSourcePath,
          input.firstDiscoveredRunId,
          input.lastDiscoveredRunId,
          input.firstDiscoveredAt,
          input.lastDiscoveredAt,
        ],
      );
      return toSurfaceData(result.rows[0]!);
    },

    async refreshDiscoveredSurface(input) {
      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `
          UPDATE discovered_web_app_surfaces
          SET
            root_family_id = $2,
            discovery_key = $3,
            surface_kind = $4,
            locator_type = $5,
            route_path = $6,
            route_hash = $7,
            canonical_locator = $8,
            display_label = $9,
            user_facing_disposition = $10,
            provider_key = $11,
            implementation_source_path = $12,
            last_discovered_run_id = $13,
            last_discovered_at = $14,
            stale_at = $15,
            updated_at = NOW()
          WHERE discovered_web_app_surface_id = $1
          RETURNING *
        `,
        [
          input.discoveredWebAppSurfaceId,
          input.rootFamilyId,
          input.discoveryKey,
          input.surfaceKind,
          input.locatorType,
          input.routePath,
          input.routeHash,
          input.canonicalLocator,
          input.displayLabel,
          input.userFacingDisposition,
          input.providerKey,
          input.implementationSourcePath,
          input.lastDiscoveredRunId,
          input.lastDiscoveredAt,
          input.staleAt,
        ],
      );
      return toSurfaceData(result.rows[0]!);
    },

    async createSurfaceObservation(input) {
      await dbPool.query(
        `
          INSERT INTO discovered_web_app_surface_observations (
            discovered_web_app_surface_observation_id,
            web_app_discovery_run_id,
            discovered_web_app_surface_id,
            root_family_id,
            surface_kind,
            locator_type,
            route_path,
            route_hash,
            canonical_locator,
            display_label,
            user_facing_disposition,
            provider_key,
            implementation_source_path,
            observed_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
        `,
        [
          input.discoveredWebAppSurfaceObservationId,
          input.webAppDiscoveryRunId,
          input.discoveredWebAppSurfaceId,
          input.rootFamilyId,
          input.surfaceKind,
          input.locatorType,
          input.routePath,
          input.routeHash,
          input.canonicalLocator,
          input.displayLabel,
          input.userFacingDisposition,
          input.providerKey,
          input.implementationSourcePath,
          input.observedAt,
        ],
      );
    },

    async markSurfaceStale(discoveredWebAppSurfaceId, staleAt) {
      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `
          UPDATE discovered_web_app_surfaces
          SET stale_at = $2, updated_at = NOW()
          WHERE discovered_web_app_surface_id = $1
          RETURNING *
        `,
        [discoveredWebAppSurfaceId, staleAt],
      );
      return toSurfaceData(result.rows[0]!);
    },

    async listScopeSurfaces(rootFamilyIds) {
      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `
          SELECT *
          FROM discovered_web_app_surfaces
          WHERE root_family_id = ANY($1::text[])
          ORDER BY canonical_locator ASC
        `,
        [rootFamilyIds],
      );
      return result.rows.map(toSurfaceData);
    },

    async findStructureNodeByStructureKey(structureKey) {
      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `SELECT * FROM discovered_web_app_structure_nodes WHERE structure_key = $1`,
        [structureKey],
      );
      return result.rows[0] ? toStructureNodeData(result.rows[0]) : null;
    },

    async createDiscoveredStructureNode(input) {
      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `
          INSERT INTO discovered_web_app_structure_nodes (
            discovered_web_app_structure_node_id,
            root_family_id,
            structure_key,
            parent_structure_key,
            parent_discovered_web_app_structure_node_id,
            node_key,
            node_kind,
            display_label,
            depth,
            linked_discovered_web_app_surface_id,
            provider_key,
            implementation_source_path,
            first_discovered_run_id,
            last_discovered_run_id,
            first_discovered_at,
            last_discovered_at,
            stale_at,
            created_at,
            updated_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NULL, NOW(), NOW()
          )
          RETURNING *
        `,
        [
          input.discoveredWebAppStructureNodeId,
          input.rootFamilyId,
          input.structureKey,
          input.parentStructureKey,
          input.parentDiscoveredWebAppStructureNodeId,
          input.nodeKey,
          input.nodeKind,
          input.displayLabel,
          input.depth,
          input.linkedDiscoveredWebAppSurfaceId,
          input.providerKey,
          input.implementationSourcePath,
          input.firstDiscoveredRunId,
          input.lastDiscoveredRunId,
          input.firstDiscoveredAt,
          input.lastDiscoveredAt,
        ],
      );
      return toStructureNodeData(result.rows[0]!);
    },

    async refreshDiscoveredStructureNode(input) {
      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `
          UPDATE discovered_web_app_structure_nodes
          SET
            root_family_id = $2,
            structure_key = $3,
            parent_structure_key = $4,
            parent_discovered_web_app_structure_node_id = $5,
            node_key = $6,
            node_kind = $7,
            display_label = $8,
            depth = $9,
            linked_discovered_web_app_surface_id = $10,
            provider_key = $11,
            implementation_source_path = $12,
            last_discovered_run_id = $13,
            last_discovered_at = $14,
            stale_at = $15,
            updated_at = NOW()
          WHERE discovered_web_app_structure_node_id = $1
          RETURNING *
        `,
        [
          input.discoveredWebAppStructureNodeId,
          input.rootFamilyId,
          input.structureKey,
          input.parentStructureKey,
          input.parentDiscoveredWebAppStructureNodeId,
          input.nodeKey,
          input.nodeKind,
          input.displayLabel,
          input.depth,
          input.linkedDiscoveredWebAppSurfaceId,
          input.providerKey,
          input.implementationSourcePath,
          input.lastDiscoveredRunId,
          input.lastDiscoveredAt,
          input.staleAt,
        ],
      );
      return toStructureNodeData(result.rows[0]!);
    },

    async createStructureObservation(input) {
      await dbPool.query(
        `
          INSERT INTO discovered_web_app_structure_observations (
            discovered_web_app_structure_observation_id,
            web_app_discovery_run_id,
            discovered_web_app_structure_node_id,
            root_family_id,
            structure_key,
            parent_structure_key,
            parent_discovered_web_app_structure_node_id,
            node_key,
            node_kind,
            display_label,
            depth,
            linked_discovered_web_app_surface_id,
            provider_key,
            implementation_source_path,
            observed_at,
            created_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
          )
        `,
        [
          input.discoveredWebAppStructureObservationId,
          input.webAppDiscoveryRunId,
          input.discoveredWebAppStructureNodeId,
          input.rootFamilyId,
          input.structureKey,
          input.parentStructureKey,
          input.parentDiscoveredWebAppStructureNodeId,
          input.nodeKey,
          input.nodeKind,
          input.displayLabel,
          input.depth,
          input.linkedDiscoveredWebAppSurfaceId,
          input.providerKey,
          input.implementationSourcePath,
          input.observedAt,
        ],
      );
    },

    async markStructureNodeStale(discoveredWebAppStructureNodeId, staleAt) {
      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `
          UPDATE discovered_web_app_structure_nodes
          SET stale_at = $2, updated_at = NOW()
          WHERE discovered_web_app_structure_node_id = $1
          RETURNING *
        `,
        [discoveredWebAppStructureNodeId, staleAt],
      );
      return toStructureNodeData(result.rows[0]!);
    },

    async listScopeStructureNodes(rootFamilyIds) {
      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `
          SELECT *
          FROM discovered_web_app_structure_nodes
          WHERE root_family_id = ANY($1::text[])
          ORDER BY depth ASC, structure_key ASC
        `,
        [rootFamilyIds],
      );
      return result.rows.map(toStructureNodeData);
    },

    async findDiscoveredStructureNodeById(discoveredWebAppStructureNodeId) {
      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `
          SELECT *
          FROM discovered_web_app_structure_nodes
          WHERE discovered_web_app_structure_node_id = $1
        `,
        [discoveredWebAppStructureNodeId],
      );
      return result.rows[0] ? toStructureNodeData(result.rows[0]) : null;
    },

    async listDiscoveredStructureNodes(input) {
      const where: string[] = [];
      const values: unknown[] = [];

      if (input.filters.rootFamilyId) {
        values.push(input.filters.rootFamilyId);
        where.push(`root_family_id = $${values.length}`);
      }
      if (input.filters.staleStatus === "current") {
        where.push("stale_at IS NULL");
      }
      if (input.filters.staleStatus === "stale") {
        where.push("stale_at IS NOT NULL");
      }

      const result = await dbPool.query<DiscoveredWebAppStructureNodeRecord>(
        `
          SELECT *
          FROM discovered_web_app_structure_nodes
          ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
          ORDER BY depth ASC, structure_key ASC
        `,
        values,
      );
      return result.rows.map(toStructureNodeData);
    },

    async findDiscoveredSurfaceById(discoveredWebAppSurfaceId) {
      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `SELECT * FROM discovered_web_app_surfaces WHERE discovered_web_app_surface_id = $1`,
        [discoveredWebAppSurfaceId],
      );
      return result.rows[0] ? toSurfaceData(result.rows[0]) : null;
    },

    async listDiscoveredSurfaces(input) {
      const where: string[] = [];
      const values: unknown[] = [];

      if (input.filters.rootFamilyId) {
        values.push(input.filters.rootFamilyId);
        where.push(`root_family_id = $${values.length}`);
      }
      if (input.filters.surfaceKind) {
        values.push(input.filters.surfaceKind);
        where.push(`surface_kind = $${values.length}`);
      }
      if (input.filters.userFacingDisposition) {
        values.push(input.filters.userFacingDisposition);
        where.push(`user_facing_disposition = $${values.length}`);
      }
      if (input.filters.providerKey) {
        values.push(input.filters.providerKey);
        where.push(`provider_key = $${values.length}`);
      }
      if (input.filters.staleStatus === "current") {
        where.push("stale_at IS NULL");
      }
      if (input.filters.staleStatus === "stale") {
        where.push("stale_at IS NOT NULL");
      }

      const result = await dbPool.query<DiscoveredWebAppSurfaceRecord>(
        `
          SELECT *
          FROM discovered_web_app_surfaces
          ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
          ORDER BY last_discovered_at DESC, canonical_locator ASC
        `,
        values,
      );
      const start = (input.page - 1) * input.pageSize;
      return {
        items: result.rows.slice(start, start + input.pageSize).map(toSurfaceData),
        totalMatchingRecords: result.rows.length,
      };
    },
  };
}
