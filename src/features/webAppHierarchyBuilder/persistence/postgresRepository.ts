import type { Pool } from "pg";
import type { WebAppHierarchyRepository } from "./repository";
import type {
  BootstrapUpsertWebAppPageRecordInput,
  CreateWebAppModuleRecordInput,
  CreateWebAppPageRecordInput,
  MoveWebAppPageRecordInput,
  UpsertWebAppDiscoveryLinkRecordInput,
  UpsertWebAppPageLocatorRecordInput,
  UpdateWebAppModuleRecordInput,
  UpdateWebAppPageMetadataRecordInput,
  WebAppDiscoveryLinkRecord,
  WebAppModuleRecord,
  WebAppPageLocatorRecord,
  WebAppPageRecord,
  WebAppRootFamilyRecord,
} from "./types";
import type { WebAppPagePlacementType } from "../domain/types";

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeTopologyState(value: string | null | undefined): string {
  return value ?? "applied";
}

function toRootFamilyData(record: WebAppRootFamilyRecord): WebAppRootFamilyRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function toModuleData(record: WebAppModuleRecord): WebAppModuleRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function toPageData(record: WebAppPageRecord): WebAppPageRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    materializedAt: record.materializedAt ? new Date(record.materializedAt) : null,
    activeLocator: record.activeLocator
      ? {
          ...record.activeLocator,
          createdAt: new Date(record.activeLocator.createdAt),
          updatedAt: new Date(record.activeLocator.updatedAt),
        }
      : null,
  };
}

function toLocatorData(record: WebAppPageLocatorRecord): WebAppPageLocatorRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function toDiscoveryLinkData(record: WebAppDiscoveryLinkRecord): WebAppDiscoveryLinkRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

export function createPostgresWebAppHierarchyRepository(dbPool: Pool): WebAppHierarchyRepository {
  async function queryModule(sql: string, values: unknown[]): Promise<WebAppModuleRecord | null> {
    const result = await dbPool.query<WebAppModuleRecord>(sql, values);
    return result.rows[0] ? toModuleData(result.rows[0]) : null;
  }

  async function queryPage(sql: string, values: unknown[]): Promise<WebAppPageRecord | null> {
    const result = await dbPool.query<WebAppPageRecord>(sql, values);
    return result.rows[0] ? toPageData(result.rows[0]) : null;
  }

  async function queryLocator(
    sql: string,
    values: unknown[],
  ): Promise<WebAppPageLocatorRecord | null> {
    const result = await dbPool.query<WebAppPageLocatorRecord>(sql, values);
    return result.rows[0] ? toLocatorData(result.rows[0]) : null;
  }

  async function queryDiscoveryLink(
    sql: string,
    values: unknown[],
  ): Promise<WebAppDiscoveryLinkRecord | null> {
    const result = await dbPool.query<WebAppDiscoveryLinkRecord>(sql, values);
    return result.rows[0] ? toDiscoveryLinkData(result.rows[0]) : null;
  }

  async function updateOrInsertPage(
    input: BootstrapUpsertWebAppPageRecordInput,
  ): Promise<WebAppPageRecord> {
    const result = await dbPool.query<WebAppPageRecord>(
      `
        INSERT INTO web_app_pages (
          web_app_page_id,
          root_family_id,
          web_app_module_id,
          parent_page_id,
          placement_type,
          page_key,
          normalized_page_key,
          display_label,
          route_segment,
          normalized_route_segment,
          resolved_full_route_path,
          status,
          sort_order,
          created_by_root_admin_user_id,
          bootstrap_source,
          topology_state,
          template_key,
          materialized_at,
          created_at,
          updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW()
        )
        ON CONFLICT (normalized_page_key)
        DO UPDATE SET
          root_family_id = EXCLUDED.root_family_id,
          web_app_module_id = EXCLUDED.web_app_module_id,
          parent_page_id = EXCLUDED.parent_page_id,
          placement_type = EXCLUDED.placement_type,
          display_label = EXCLUDED.display_label,
          route_segment = EXCLUDED.route_segment,
          normalized_route_segment = EXCLUDED.normalized_route_segment,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          bootstrap_source = EXCLUDED.bootstrap_source,
          topology_state = EXCLUDED.topology_state,
          template_key = EXCLUDED.template_key,
          materialized_at = EXCLUDED.materialized_at,
          updated_at = NOW()
        RETURNING
          web_app_page_id AS "webAppPageId",
          root_family_id AS "rootFamilyId",
          web_app_module_id AS "webAppModuleId",
          parent_page_id AS "parentPageId",
          placement_type AS "placementType",
          page_key AS "pageKey",
          display_label AS "displayLabel",
          route_segment AS "routeSegment",
          normalized_route_segment AS "normalizedRouteSegment",
          resolved_full_route_path AS "resolvedFullRoutePath",
          status,
          sort_order AS "sortOrder",
          created_by_root_admin_user_id AS "createdByRootAdminUserId",
          bootstrap_source AS "bootstrapSource",
          topology_state AS "topologyState",
          template_key AS "templateKey",
          materialized_at AS "materializedAt",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [
        input.webAppPageId,
        input.rootFamilyId,
        input.webAppModuleId,
        input.parentPageId,
        input.placementType,
        input.pageKey,
        normalizeKey(input.pageKey),
        input.displayLabel,
        input.routeSegment,
        normalizeKey(input.routeSegment),
        input.status,
        input.sortOrder,
        input.createdByRootAdminUserId,
        input.bootstrapSource,
        normalizeTopologyState(input.topologyState),
        input.templateKey,
        input.materializedAt,
      ],
    );
    return toPageData(result.rows[0]);
  }

  return {
    async listRootFamilies() {
      const result = await dbPool.query<WebAppRootFamilyRecord>(
        `
          SELECT
            root_family_id AS "rootFamilyId",
            display_label AS "displayLabel",
            route_prefix AS "routePrefix",
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_root_families
          ORDER BY sort_order ASC, root_family_id ASC
        `,
      );
      return result.rows.map(toRootFamilyData);
    },
    async listModules() {
      const result = await dbPool.query<WebAppModuleRecord>(
        `
          SELECT
            web_app_module_id AS "webAppModuleId",
            root_family_id AS "rootFamilyId",
            module_key AS "moduleKey",
            display_label AS "displayLabel",
            landing_page_web_app_page_id AS "landingPageWebAppPageId",
            status,
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_modules
          ORDER BY sort_order ASC, module_key ASC
        `,
      );
      return result.rows.map(toModuleData);
    },
    async listPages() {
      const result = await dbPool.query<WebAppPageRecord>(
        `
          SELECT
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_pages
          ORDER BY sort_order ASC, page_key ASC
        `,
      );
      return result.rows.map(toPageData);
    },
    findModuleById(webAppModuleId) {
      return queryModule(
        `
          SELECT
            web_app_module_id AS "webAppModuleId",
            root_family_id AS "rootFamilyId",
            module_key AS "moduleKey",
            display_label AS "displayLabel",
            landing_page_web_app_page_id AS "landingPageWebAppPageId",
            status,
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_modules
          WHERE web_app_module_id = $1
        `,
        [webAppModuleId],
      );
    },
    findModuleByKey(moduleKey) {
      return queryModule(
        `
          SELECT
            web_app_module_id AS "webAppModuleId",
            root_family_id AS "rootFamilyId",
            module_key AS "moduleKey",
            display_label AS "displayLabel",
            landing_page_web_app_page_id AS "landingPageWebAppPageId",
            status,
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_modules
          WHERE normalized_module_key = $1
        `,
        [normalizeKey(moduleKey)],
      );
    },
    async createModule(input: CreateWebAppModuleRecordInput) {
      const result = await dbPool.query<WebAppModuleRecord>(
        `
          INSERT INTO web_app_modules (
            web_app_module_id,
            root_family_id,
            module_key,
            normalized_module_key,
            display_label,
            landing_page_web_app_page_id,
            status,
            sort_order,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING
            web_app_module_id AS "webAppModuleId",
            root_family_id AS "rootFamilyId",
            module_key AS "moduleKey",
            display_label AS "displayLabel",
            landing_page_web_app_page_id AS "landingPageWebAppPageId",
            status,
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.webAppModuleId,
          input.rootFamilyId,
          input.moduleKey,
          normalizeKey(input.moduleKey),
          input.displayLabel,
          input.landingPageWebAppPageId ?? null,
          input.status,
          input.sortOrder,
        ],
      );
      return toModuleData(result.rows[0]);
    },
    async updateModule(input: UpdateWebAppModuleRecordInput) {
      const assignments: string[] = [];
      const values: unknown[] = [];
      if (input.displayLabel !== undefined) {
        values.push(input.displayLabel);
        assignments.push(`display_label = $${values.length}`);
      }
      if (input.landingPageWebAppPageId !== undefined) {
        values.push(input.landingPageWebAppPageId);
        assignments.push(`landing_page_web_app_page_id = $${values.length}`);
      }
      if (input.status !== undefined) {
        values.push(input.status);
        assignments.push(`status = $${values.length}`);
      }
      if (input.sortOrder !== undefined) {
        values.push(input.sortOrder);
        assignments.push(`sort_order = $${values.length}`);
      }
      assignments.push(`updated_at = NOW()`);
      values.push(input.webAppModuleId);
      const result = await dbPool.query<WebAppModuleRecord>(
        `
          UPDATE web_app_modules
          SET ${assignments.join(", ")}
          WHERE web_app_module_id = $${values.length}
          RETURNING
            web_app_module_id AS "webAppModuleId",
            root_family_id AS "rootFamilyId",
            module_key AS "moduleKey",
            display_label AS "displayLabel",
            landing_page_web_app_page_id AS "landingPageWebAppPageId",
            status,
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        values,
      );
      return toModuleData(result.rows[0]);
    },
    findPageById(webAppPageId) {
      return queryPage(
        `
          SELECT
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_pages
          WHERE web_app_page_id = $1
        `,
        [webAppPageId],
      );
    },
    findPageByKey(pageKey) {
      return queryPage(
        `
          SELECT
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_pages
          WHERE normalized_page_key = $1
        `,
        [normalizeKey(pageKey)],
      );
    },
    findPageByPlacementRoute(webAppModuleId, parentPageId, placementType, routeSegment) {
      if (placementType === "orphaned") {
        return Promise.resolve(null);
      }
      return queryPage(
        `
          SELECT
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_pages
          WHERE web_app_module_id = $1
            AND placement_type = $2
            AND normalized_route_segment = $3
            AND (
              (parent_page_id IS NULL AND $4::uuid IS NULL)
              OR parent_page_id = $4
            )
          LIMIT 1
        `,
        [webAppModuleId, placementType, normalizeKey(routeSegment), parentPageId],
      );
    },
    async createPage(input: CreateWebAppPageRecordInput) {
      return updateOrInsertPage(input);
    },
    async bootstrapUpsertPage(input: BootstrapUpsertWebAppPageRecordInput) {
      return updateOrInsertPage(input);
    },
    async updatePageMetadata(input: UpdateWebAppPageMetadataRecordInput) {
      const assignments: string[] = [];
      const values: unknown[] = [];
      if (input.displayLabel !== undefined) {
        values.push(input.displayLabel);
        assignments.push(`display_label = $${values.length}`);
      }
      if (input.routeSegment !== undefined) {
        values.push(input.routeSegment);
        assignments.push(`route_segment = $${values.length}`);
        values.push(normalizeKey(input.routeSegment));
        assignments.push(`normalized_route_segment = $${values.length}`);
      }
      if (input.status !== undefined) {
        values.push(input.status);
        assignments.push(`status = $${values.length}`);
      }
      if (input.sortOrder !== undefined) {
        values.push(input.sortOrder);
        assignments.push(`sort_order = $${values.length}`);
      }
      assignments.push(`updated_at = NOW()`);
      values.push(input.webAppPageId);
      const result = await dbPool.query<WebAppPageRecord>(
        `
          UPDATE web_app_pages
          SET ${assignments.join(", ")}
          WHERE web_app_page_id = $${values.length}
          RETURNING
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        values,
      );
      return toPageData(result.rows[0]);
    },
    async movePage(input: MoveWebAppPageRecordInput) {
      const result = await dbPool.query<WebAppPageRecord>(
        `
          UPDATE web_app_pages
          SET
            root_family_id = $2,
            web_app_module_id = $3,
            parent_page_id = $4,
            placement_type = $5,
            sort_order = COALESCE($6, sort_order),
            updated_at = NOW()
          WHERE web_app_page_id = $1
          RETURNING
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.webAppPageId,
          input.rootFamilyId,
          input.webAppModuleId,
          input.parentPageId,
          input.placementType,
          input.sortOrder ?? null,
        ],
      );
      return toPageData(result.rows[0]);
    },
    async markPageApplied(input) {
      const result = await dbPool.query<WebAppPageRecord>(
        `
          UPDATE web_app_pages
          SET
            topology_state = 'applied',
            materialized_at = $1,
            updated_at = NOW()
          WHERE web_app_page_id = $2
          RETURNING
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            web_app_module_id AS "webAppModuleId",
            parent_page_id AS "parentPageId",
            placement_type AS "placementType",
            page_key AS "pageKey",
            display_label AS "displayLabel",
            route_segment AS "routeSegment",
            normalized_route_segment AS "normalizedRouteSegment",
            resolved_full_route_path AS "resolvedFullRoutePath",
            status,
            sort_order AS "sortOrder",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            bootstrap_source AS "bootstrapSource",
            topology_state AS "topologyState",
            template_key AS "templateKey",
            materialized_at AS "materializedAt",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [input.materializedAt.toISOString(), input.webAppPageId],
      );
      return toPageData(result.rows[0]);
    },
    async listPageLocators() {
      const result = await dbPool.query<WebAppPageLocatorRecord>(
        `
          SELECT
            web_app_page_locator_id AS "webAppPageLocatorId",
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            locator_type AS "locatorType",
            canonical_locator AS "canonicalLocator",
            route_path AS "routePath",
            route_hash AS "routeHash",
            normalized_locator_key AS "normalizedLocatorKey",
            is_active AS "isActive",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_page_locators
          ORDER BY canonical_locator ASC
        `,
      );
      return result.rows.map(toLocatorData);
    },
    findActivePageLocatorByPageId(webAppPageId) {
      return queryLocator(
        `
          SELECT
            web_app_page_locator_id AS "webAppPageLocatorId",
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            locator_type AS "locatorType",
            canonical_locator AS "canonicalLocator",
            route_path AS "routePath",
            route_hash AS "routeHash",
            normalized_locator_key AS "normalizedLocatorKey",
            is_active AS "isActive",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_page_locators
          WHERE web_app_page_id = $1
            AND is_active = TRUE
          LIMIT 1
        `,
        [webAppPageId],
      );
    },
    findActivePageLocatorByNormalizedKey(normalizedLocatorKey) {
      return queryLocator(
        `
          SELECT
            web_app_page_locator_id AS "webAppPageLocatorId",
            web_app_page_id AS "webAppPageId",
            root_family_id AS "rootFamilyId",
            locator_type AS "locatorType",
            canonical_locator AS "canonicalLocator",
            route_path AS "routePath",
            route_hash AS "routeHash",
            normalized_locator_key AS "normalizedLocatorKey",
            is_active AS "isActive",
            created_by_root_admin_user_id AS "createdByRootAdminUserId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_page_locators
          WHERE normalized_locator_key = $1
            AND is_active = TRUE
          LIMIT 1
        `,
        [normalizedLocatorKey],
      );
    },
    async upsertActivePageLocator(input: UpsertWebAppPageLocatorRecordInput) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          `
            UPDATE web_app_page_locators
            SET is_active = FALSE, updated_at = NOW()
            WHERE web_app_page_id = $1
              AND is_active = TRUE
          `,
          [input.webAppPageId],
        );
        const result = await client.query<WebAppPageLocatorRecord>(
          `
            INSERT INTO web_app_page_locators (
              web_app_page_locator_id,
              web_app_page_id,
              root_family_id,
              locator_type,
              canonical_locator,
              route_path,
              route_hash,
              normalized_locator_key,
              is_active,
              created_by_root_admin_user_id,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9, NOW(), NOW())
            ON CONFLICT (normalized_locator_key)
            DO UPDATE SET
              web_app_page_id = EXCLUDED.web_app_page_id,
              root_family_id = EXCLUDED.root_family_id,
              locator_type = EXCLUDED.locator_type,
              canonical_locator = EXCLUDED.canonical_locator,
              route_path = EXCLUDED.route_path,
              route_hash = EXCLUDED.route_hash,
              is_active = TRUE,
              updated_at = NOW()
            RETURNING
              web_app_page_locator_id AS "webAppPageLocatorId",
              web_app_page_id AS "webAppPageId",
              root_family_id AS "rootFamilyId",
              locator_type AS "locatorType",
              canonical_locator AS "canonicalLocator",
              route_path AS "routePath",
              route_hash AS "routeHash",
              normalized_locator_key AS "normalizedLocatorKey",
              is_active AS "isActive",
              created_by_root_admin_user_id AS "createdByRootAdminUserId",
              created_at AS "createdAt",
              updated_at AS "updatedAt"
          `,
          [
            input.webAppPageLocatorId,
            input.webAppPageId,
            input.rootFamilyId,
            input.locatorType,
            input.canonicalLocator,
            input.routePath,
            input.routeHash,
            input.normalizedLocatorKey,
            input.createdByRootAdminUserId,
          ],
        );
        await client.query("COMMIT");
        return toLocatorData(result.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async listDiscoveryLinks(input = {}) {
      const values: unknown[] = [];
      const where: string[] = [];
      if (input.rootFamilyId) {
        values.push(input.rootFamilyId);
        where.push(`root_family_id = $${values.length}`);
      }
      if (input.linkStatus) {
        values.push(input.linkStatus);
        where.push(`link_status = $${values.length}`);
      }
      if (input.driftStatus) {
        values.push(input.driftStatus);
        where.push(`drift_status = $${values.length}`);
      }
      if (input.curatedTargetType) {
        values.push(input.curatedTargetType);
        where.push(`curated_target_type = $${values.length}`);
      }
      const result = await dbPool.query<WebAppDiscoveryLinkRecord>(
        `
          SELECT
            web_app_discovery_link_id AS "webAppDiscoveryLinkId",
            discovered_web_app_structure_node_id AS "discoveredWebAppStructureNodeId",
            discovered_web_app_surface_id AS "discoveredWebAppSurfaceId",
            root_family_id AS "rootFamilyId",
            curated_target_type AS "curatedTargetType",
            curated_web_app_module_id AS "curatedWebAppModuleId",
            curated_web_app_page_id AS "curatedWebAppPageId",
            link_status AS "linkStatus",
            drift_status AS "driftStatus",
            drift_summary AS "driftSummary",
            last_compared_web_app_discovery_run_id AS "lastComparedWebAppDiscoveryRunId",
            last_matched_web_app_discovery_run_id AS "lastMatchedWebAppDiscoveryRunId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_discovery_links
          ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
          ORDER BY root_family_id ASC, created_at ASC
        `,
        values,
      );
      return result.rows.map(toDiscoveryLinkData);
    },
    findDiscoveryLinkByDiscoveredStructureNodeId(discoveredWebAppStructureNodeId) {
      return queryDiscoveryLink(
        `
          SELECT
            web_app_discovery_link_id AS "webAppDiscoveryLinkId",
            discovered_web_app_structure_node_id AS "discoveredWebAppStructureNodeId",
            discovered_web_app_surface_id AS "discoveredWebAppSurfaceId",
            root_family_id AS "rootFamilyId",
            curated_target_type AS "curatedTargetType",
            curated_web_app_module_id AS "curatedWebAppModuleId",
            curated_web_app_page_id AS "curatedWebAppPageId",
            link_status AS "linkStatus",
            drift_status AS "driftStatus",
            drift_summary AS "driftSummary",
            last_compared_web_app_discovery_run_id AS "lastComparedWebAppDiscoveryRunId",
            last_matched_web_app_discovery_run_id AS "lastMatchedWebAppDiscoveryRunId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_discovery_links
          WHERE discovered_web_app_structure_node_id = $1
          LIMIT 1
        `,
        [discoveredWebAppStructureNodeId],
      );
    },
    async upsertDiscoveryLink(input: UpsertWebAppDiscoveryLinkRecordInput) {
      const result = await dbPool.query<WebAppDiscoveryLinkRecord>(
        `
          INSERT INTO web_app_discovery_links (
            web_app_discovery_link_id,
            discovered_web_app_structure_node_id,
            discovered_web_app_surface_id,
            root_family_id,
            curated_target_type,
            curated_web_app_module_id,
            curated_web_app_page_id,
            link_status,
            drift_status,
            drift_summary,
            last_compared_web_app_discovery_run_id,
            last_matched_web_app_discovery_run_id,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
          ON CONFLICT (discovered_web_app_structure_node_id)
          DO UPDATE SET
            discovered_web_app_surface_id = EXCLUDED.discovered_web_app_surface_id,
            root_family_id = EXCLUDED.root_family_id,
            curated_target_type = EXCLUDED.curated_target_type,
            curated_web_app_module_id = EXCLUDED.curated_web_app_module_id,
            curated_web_app_page_id = EXCLUDED.curated_web_app_page_id,
            link_status = EXCLUDED.link_status,
            drift_status = EXCLUDED.drift_status,
            drift_summary = EXCLUDED.drift_summary,
            last_compared_web_app_discovery_run_id = EXCLUDED.last_compared_web_app_discovery_run_id,
            last_matched_web_app_discovery_run_id = EXCLUDED.last_matched_web_app_discovery_run_id,
            updated_at = NOW()
          RETURNING
            web_app_discovery_link_id AS "webAppDiscoveryLinkId",
            discovered_web_app_structure_node_id AS "discoveredWebAppStructureNodeId",
            discovered_web_app_surface_id AS "discoveredWebAppSurfaceId",
            root_family_id AS "rootFamilyId",
            curated_target_type AS "curatedTargetType",
            curated_web_app_module_id AS "curatedWebAppModuleId",
            curated_web_app_page_id AS "curatedWebAppPageId",
            link_status AS "linkStatus",
            drift_status AS "driftStatus",
            drift_summary AS "driftSummary",
            last_compared_web_app_discovery_run_id AS "lastComparedWebAppDiscoveryRunId",
            last_matched_web_app_discovery_run_id AS "lastMatchedWebAppDiscoveryRunId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.webAppDiscoveryLinkId,
          input.discoveredWebAppStructureNodeId,
          input.discoveredWebAppSurfaceId,
          input.rootFamilyId,
          input.curatedTargetType,
          input.curatedWebAppModuleId,
          input.curatedWebAppPageId,
          input.linkStatus,
          input.driftStatus,
          input.driftSummary,
          input.lastComparedWebAppDiscoveryRunId,
          input.lastMatchedWebAppDiscoveryRunId,
        ],
      );
      return toDiscoveryLinkData(result.rows[0]);
    },
    async updateResolvedFullRoutePaths(updates) {
      if (updates.length === 0) {
        return;
      }
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        for (const update of updates) {
          await client.query(
            `
              UPDATE web_app_pages
              SET resolved_full_route_path = $2, updated_at = NOW()
              WHERE web_app_page_id = $1
            `,
            [update.webAppPageId, update.resolvedFullRoutePath],
          );
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
