import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresWebAppHierarchyRepository } from "../../../src/features/webAppHierarchyBuilder/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

interface RootFamilyRow {
  root_family_id: string;
  route_prefix: string;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("web app hierarchy postgres repository", () => {
  let pool: Pool;
  const actorRootUserId = "11111111-1111-1111-1111-111111111111";

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "tenants",
      "webAppHierarchyBuilder",
    ]);
    const rootUsersRepository = createPostgresRootUsersRepository(pool);
    await rootUsersRepository.create({
      rootUserId: actorRootUserId,
      email: "hierarchy-operator@example.test",
      firstName: "Hierarchy",
      lastName: "Operator",
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("seeds the special root families and persists resolved route paths", async () => {
    const repository = createPostgresWebAppHierarchyRepository(pool);
    const rootFamilies = await pool.query<RootFamilyRow>(
      `SELECT root_family_id, route_prefix FROM web_app_root_families ORDER BY sort_order ASC`,
    );
    expect(rootFamilies.rows).toEqual([
      { root_family_id: "root-admin", route_prefix: "/root-admin" },
      { root_family_id: "login", route_prefix: "/login" },
      { root_family_id: "design-system", route_prefix: "/design-system" },
    ]);

    const module = await repository.createModule({
      webAppModuleId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      rootFamilyId: "root-admin",
      moduleKey: "catalog",
      displayLabel: "Catalog",
      status: "draft",
      sortOrder: 0,
    });
    const page = await repository.createPage({
      webAppPageId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      rootFamilyId: "root-admin",
      webAppModuleId: module.webAppModuleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "catalog-home",
      displayLabel: "Catalog Home",
      routeSegment: "catalog",
      status: "draft",
      sortOrder: 0,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
    });
    await repository.updateResolvedFullRoutePaths([
      {
        webAppPageId: page.webAppPageId,
        resolvedFullRoutePath: "/root-admin/catalog",
      },
    ]);

    const stored = await repository.findPageById(page.webAppPageId);
    expect(stored?.resolvedFullRoutePath).toBe("/root-admin/catalog");
  });

  it("persists durable hierarchy audit events with actor, target, and before-after payloads", async () => {
    const repository = createPostgresWebAppHierarchyRepository(pool);
    const module = await repository.createModule({
      webAppModuleId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      rootFamilyId: "root-admin",
      moduleKey: "catalog",
      displayLabel: "Catalog",
      status: "draft",
      sortOrder: 0,
    });
    const page = await repository.createPage({
      webAppPageId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      rootFamilyId: "root-admin",
      webAppModuleId: module.webAppModuleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "catalog-home",
      displayLabel: "Catalog Home",
      routeSegment: "catalog",
      status: "draft",
      sortOrder: 0,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
    });

    await repository.createAuditEvent({
      webAppHierarchyAuditEventId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      actorRootUserId,
      rootFamilyId: "root-admin",
      webAppModuleId: module.webAppModuleId,
      webAppPageId: page.webAppPageId,
      eventType: "web_app_hierarchy.page_moved",
      eventOutcome: "success",
      beforeState: { placementType: "module-root" },
      afterState: { placementType: "orphaned" },
      occurredAt: new Date("2026-05-01T12:00:00.000Z"),
    });

    await expect(
      repository.listAuditEvents({
        eventType: "web_app_hierarchy.page_moved",
        webAppPageId: page.webAppPageId,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        webAppHierarchyAuditEventId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        actorRootUserId,
        rootFamilyId: "root-admin",
        webAppModuleId: module.webAppModuleId,
        webAppPageId: page.webAppPageId,
        eventOutcome: "success",
        beforeState: { placementType: "module-root" },
        afterState: { placementType: "orphaned" },
      }),
    ]);
  });

  it("TC-WEB-APP-HIER-INT-013 and TC-WEB-APP-HIER-EDGE-011 enforce page-locator schema and activation constraints", async () => {
    const repository = createPostgresWebAppHierarchyRepository(pool);
    const module = await repository.createModule({
      webAppModuleId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      rootFamilyId: "root-admin",
      moduleKey: "catalog",
      displayLabel: "Catalog",
      status: "draft",
      sortOrder: 0,
    });
    const page = await repository.createPage({
      webAppPageId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      rootFamilyId: "root-admin",
      webAppModuleId: module.webAppModuleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "catalog-home",
      displayLabel: "Catalog Home",
      routeSegment: "catalog",
      status: "draft",
      sortOrder: 0,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
    });

    await expect(
      pool.query(
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
            created_by_root_admin_user_id
          )
          VALUES (
            '11111111-1111-4111-8111-111111111111',
            $1,
            'root-admin',
            'path',
            '/root-admin/catalog#users',
            '/root-admin/catalog',
            'users',
            '/root-admin/catalog#users',
            TRUE,
            $2
          )
        `,
        [page.webAppPageId, actorRootUserId],
      ),
    ).rejects.toThrow();

    await expect(
      pool.query(
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
            created_by_root_admin_user_id
          )
          VALUES (
            '22222222-2222-4222-8222-222222222222',
            $1,
            'root-admin',
            'hash-state',
            '/root-admin#users',
            '/root-admin',
            NULL,
            '/root-admin#users',
            TRUE,
            $2
          )
        `,
        [page.webAppPageId, actorRootUserId],
      ),
    ).rejects.toThrow();

    await pool.query(
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
          created_by_root_admin_user_id
        )
        VALUES (
          '33333333-3333-4333-8333-333333333333',
          $1,
          'root-admin',
          'path',
          '/root-admin/catalog',
          '/root-admin/catalog',
          NULL,
          '/root-admin/catalog',
          TRUE,
          $2
        )
      `,
      [page.webAppPageId, actorRootUserId],
    );

    await expect(
      pool.query(
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
            created_by_root_admin_user_id
          )
          VALUES (
            '44444444-4444-4444-8444-444444444444',
            $1,
            'root-admin',
            'path',
            '/root-admin/catalog-alt',
            '/root-admin/catalog-alt',
            NULL,
            '/root-admin/catalog-alt',
            TRUE,
            $2
          )
        `,
        [page.webAppPageId, actorRootUserId],
      ),
    ).rejects.toThrow();

    await expect(
      pool.query(
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
            created_by_root_admin_user_id
          )
          VALUES (
            '55555555-5555-4555-8555-555555555555',
            '99999999-9999-4999-8999-999999999999',
            'root-admin',
            'path',
            '/root-admin/missing',
            '/root-admin/missing',
            NULL,
            '/root-admin/missing',
            TRUE,
            $1
          )
        `,
        [actorRootUserId],
      ),
    ).rejects.toThrow();
  });

  it("TC-WEB-APP-HIER-INT-014 enforces discovery-link schema and target exclusivity constraints", async () => {
    const repository = createPostgresWebAppHierarchyRepository(pool);
    const module = await repository.createModule({
      webAppModuleId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      rootFamilyId: "root-admin",
      moduleKey: "catalog",
      displayLabel: "Catalog",
      status: "draft",
      sortOrder: 0,
    });
    const page = await repository.createPage({
      webAppPageId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      rootFamilyId: "root-admin",
      webAppModuleId: module.webAppModuleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "catalog-home",
      displayLabel: "Catalog Home",
      routeSegment: "catalog",
      status: "draft",
      sortOrder: 0,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      topologyState: "applied",
      templateKey: null,
      materializedAt: null,
    });

    await pool.query(
      `
        INSERT INTO web_app_discovery_runs (
          web_app_discovery_run_id,
          scope_key,
          status,
          trigger_kind,
          provider_version,
          created_by_root_admin_user_id,
          started_at,
          completed_at
        )
        VALUES (
          '66666666-6666-4666-8666-666666666666',
          'current-approved-root-families',
          'succeeded',
          'manual',
          '1',
          $1,
          NOW(),
          NOW()
        )
      `,
      [actorRootUserId],
    );
    await pool.query(
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
          last_discovered_at
        )
        VALUES (
          '77777777-7777-4777-8777-777777777777',
          'root-admin',
          'root-admin:/root-admin/catalog',
          'page-route',
          'path',
          '/root-admin/catalog',
          NULL,
          '/root-admin/catalog',
          'Catalog Home',
          'user-facing',
          'test',
          'src/frontend/rootAdmin/catalog',
          '66666666-6666-4666-8666-666666666666',
          '66666666-6666-4666-8666-666666666666',
          NOW(),
          NOW()
        )
      `,
    );
    await pool.query(
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
          last_discovered_at
        )
        VALUES (
          '88888888-8888-4888-8888-888888888888',
          'root-admin',
          'root-admin/catalog',
          'root-admin',
          NULL,
          'catalog',
          'page-surface',
          'Catalog Home',
          1,
          '77777777-7777-4777-8777-777777777777',
          'test',
          'src/frontend/rootAdmin/catalog',
          '66666666-6666-4666-8666-666666666666',
          '66666666-6666-4666-8666-666666666666',
          NOW(),
          NOW()
        )
      `,
    );

    await pool.query(
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
          drift_status
        )
        VALUES (
          '99999999-9999-4999-8999-999999999999',
          '88888888-8888-4888-8888-888888888888',
          '77777777-7777-4777-8777-777777777777',
          'root-admin',
          'page',
          NULL,
          $1,
          'matched',
          'none'
        )
      `,
      [page.webAppPageId],
    );

    await expect(
      pool.query(
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
            drift_status
          )
          VALUES (
            '11111111-1111-4111-8111-111111111111',
            '88888888-8888-4888-8888-888888888888',
            '77777777-7777-4777-8777-777777777777',
            'root-admin',
            'module',
            NULL,
            NULL,
            'matched',
            'none'
          )
        `,
      ),
    ).rejects.toThrow();

    await expect(
      pool.query(
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
            drift_status
          )
          VALUES (
            '22222222-2222-4222-8222-222222222222',
            '88888888-8888-4888-8888-888888888888',
            '77777777-7777-4777-8777-777777777777',
            'root-admin',
            'page',
            NULL,
            NULL,
            'matched',
            'none'
          )
        `,
      ),
    ).rejects.toThrow();

    await expect(
      pool.query(
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
            drift_status
          )
          VALUES (
            '33333333-3333-4333-8333-333333333333',
            '88888888-8888-4888-8888-888888888888',
            '77777777-7777-4777-8777-777777777777',
            'root-admin',
            'page',
            NULL,
            $1,
            'matched',
            'none'
          )
        `,
        [page.webAppPageId],
      ),
    ).rejects.toThrow();
  });
});
