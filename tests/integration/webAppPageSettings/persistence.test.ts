import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresWebAppHierarchyRepository } from "../../../src/features/webAppHierarchyBuilder/persistence/postgresRepository";
import { createPostgresWebAppPageSettingsRepository } from "../../../src/features/webAppPageSettings/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

interface SettingsRow {
  web_app_page_settings_id: string;
  web_app_page_id: string;
  parent_page_id: string | null;
  icon_key: string | null;
  show_in_top_nav: boolean;
  top_nav_order: number | null;
  page_template_key: string | null;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("webAppPageSettings postgres repository", () => {
  let pool: Pool;
  const actorRootUserId = "11111111-1111-1111-1111-111111111111";
  const moduleId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const ownerPageId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const childPageId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const siblingPageId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

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
      "webAppPageSettings",
    ]);

    const rootUsersRepository = createPostgresRootUsersRepository(pool);
    await rootUsersRepository.create({
      rootUserId: actorRootUserId,
      email: "page-settings-operator@example.test",
      firstName: "Page",
      lastName: "Settings",
    });

    const hierarchyRepository = createPostgresWebAppHierarchyRepository(pool);
    await hierarchyRepository.createModule({
      webAppModuleId: moduleId,
      rootFamilyId: "root-admin",
      moduleKey: "catalog",
      displayLabel: "Catalog",
      status: "draft",
      sortOrder: 0,
    });
    await hierarchyRepository.createPage({
      webAppPageId: ownerPageId,
      rootFamilyId: "root-admin",
      webAppModuleId: moduleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "catalog-home",
      displayLabel: "Catalog Home",
      routeSegment: "catalog-home",
      status: "draft",
      sortOrder: 0,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      templateKey: "static-html-page",
    });
    await hierarchyRepository.createPage({
      webAppPageId: childPageId,
      rootFamilyId: "root-admin",
      webAppModuleId: moduleId,
      parentPageId: ownerPageId,
      placementType: "child-page",
      pageKey: "catalog-child",
      displayLabel: "Catalog Child",
      routeSegment: "catalog-child",
      status: "draft",
      sortOrder: 1,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      templateKey: "static-html-page",
    });
    await hierarchyRepository.createPage({
      webAppPageId: siblingPageId,
      rootFamilyId: "root-admin",
      webAppModuleId: moduleId,
      parentPageId: null,
      placementType: "module-root",
      pageKey: "catalog-secondary",
      displayLabel: "Catalog Secondary",
      routeSegment: "catalog-secondary",
      status: "draft",
      sortOrder: 2,
      createdByRootAdminUserId: actorRootUserId,
      bootstrapSource: null,
      templateKey: "static-html-page",
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-WEB-PAGE-SET-INT-008 persists one durable settings row per page and refreshes updates through upsert", async () => {
    const repository = createPostgresWebAppPageSettingsRepository(pool);

    const created = await repository.upsertSettings({
      webAppPageSettingsId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      webAppPageId: ownerPageId,
      parentPageId: null,
      iconKey: "page-home",
      showInTopNav: true,
      topNavOrder: 2,
      pageTemplateKey: "static-html-page",
    });

    expect(created).toMatchObject({
      webAppPageSettingsId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      webAppPageId: ownerPageId,
      parentPageId: null,
      iconKey: "page-home",
      showInTopNav: true,
      topNavOrder: 2,
      pageTemplateKey: "static-html-page",
    });

    const updated = await repository.upsertSettings({
      webAppPageSettingsId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      webAppPageId: ownerPageId,
      parentPageId: childPageId,
      iconKey: "grid",
      showInTopNav: false,
      topNavOrder: null,
      pageTemplateKey: "static-html-page",
    });

    expect(updated.webAppPageSettingsId).toBe(created.webAppPageSettingsId);
    expect(updated.createdAt.toISOString()).toBe(created.createdAt.toISOString());
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    expect(updated).toMatchObject({
      webAppPageId: ownerPageId,
      parentPageId: childPageId,
      iconKey: "grid",
      showInTopNav: false,
      topNavOrder: null,
    });

    const storedRows = await pool.query<SettingsRow>(
      `
        SELECT
          web_app_page_settings_id,
          web_app_page_id,
          parent_page_id,
          icon_key,
          show_in_top_nav,
          top_nav_order,
          page_template_key
        FROM web_app_page_settings
        WHERE web_app_page_id = $1
      `,
      [ownerPageId],
    );

    expect(storedRows.rows).toEqual([
      {
        web_app_page_settings_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        web_app_page_id: ownerPageId,
        parent_page_id: childPageId,
        icon_key: "grid",
        show_in_top_nav: false,
        top_nav_order: null,
        page_template_key: "static-html-page",
      },
    ]);
  });

  it("TC-WEB-PAGE-SET-INT-009 replaces context-nav membership deterministically in postgres", async () => {
    const repository = createPostgresWebAppPageSettingsRepository(pool);

    await repository.replaceContextNavItems(ownerPageId, [
      {
        webAppPageContextNavItemId: "11111111-aaaa-4aaa-8aaa-111111111111",
        ownerWebAppPageId: ownerPageId,
        targetWebAppPageId: ownerPageId,
        sortOrder: 1,
      },
      {
        webAppPageContextNavItemId: "22222222-bbbb-4bbb-8bbb-222222222222",
        ownerWebAppPageId: ownerPageId,
        targetWebAppPageId: childPageId,
        sortOrder: 0,
      },
    ]);

    expect(await repository.listContextNavItemsByOwnerPageId(ownerPageId)).toEqual([
      expect.objectContaining({
        ownerWebAppPageId: ownerPageId,
        targetWebAppPageId: childPageId,
        sortOrder: 0,
      }),
      expect.objectContaining({
        ownerWebAppPageId: ownerPageId,
        targetWebAppPageId: ownerPageId,
        sortOrder: 1,
      }),
    ]);

    await repository.replaceContextNavItems(ownerPageId, [
      {
        webAppPageContextNavItemId: "33333333-cccc-4ccc-8ccc-333333333333",
        ownerWebAppPageId: ownerPageId,
        targetWebAppPageId: siblingPageId,
        sortOrder: 0,
      },
    ]);

    const replaced = await repository.listContextNavItemsByOwnerPageId(ownerPageId);
    expect(replaced).toEqual([
      expect.objectContaining({
        ownerWebAppPageId: ownerPageId,
        targetWebAppPageId: siblingPageId,
        sortOrder: 0,
      }),
    ]);

    const count = await pool.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM web_app_page_context_nav_items
        WHERE owner_web_app_page_id = $1
      `,
      [ownerPageId],
    );

    expect(count.rows[0]?.count).toBe("1");
  });
});
