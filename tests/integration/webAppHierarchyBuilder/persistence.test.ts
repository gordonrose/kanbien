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

  it("TC-WEB-APP-HIER-EDGE-001 seeds the special root families and persists resolved route paths", async () => {
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
});
