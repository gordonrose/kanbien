import type { Pool } from "pg";
import type { WebAppPageSettingsRepository } from "./repository";
import type {
  WebAppPageContextNavItemRecord,
  WebAppPageSettingsRecord,
} from "./types";

function toSettingsData(record: WebAppPageSettingsRecord): WebAppPageSettingsRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function toContextNavItemData(
  record: WebAppPageContextNavItemRecord,
): WebAppPageContextNavItemRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

export function createPostgresWebAppPageSettingsRepository(
  dbPool: Pool,
): WebAppPageSettingsRepository {
  return {
    async findSettingsByPageId(webAppPageId) {
      const result = await dbPool.query<WebAppPageSettingsRecord>(
        `
          SELECT
            web_app_page_settings_id AS "webAppPageSettingsId",
            web_app_page_id AS "webAppPageId",
            parent_page_id AS "parentPageId",
            icon_key AS "iconKey",
            show_in_top_nav AS "showInTopNav",
            top_nav_order AS "topNavOrder",
            page_template_key AS "pageTemplateKey",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_page_settings
          WHERE web_app_page_id = $1
        `,
        [webAppPageId],
      );
      return result.rows[0] ? toSettingsData(result.rows[0]) : null;
    },
    async upsertSettings(input) {
      const result = await dbPool.query<WebAppPageSettingsRecord>(
        `
          INSERT INTO web_app_page_settings (
            web_app_page_settings_id,
            web_app_page_id,
            parent_page_id,
            icon_key,
            show_in_top_nav,
            top_nav_order,
            page_template_key,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          ON CONFLICT (web_app_page_id)
          DO UPDATE SET
            parent_page_id = EXCLUDED.parent_page_id,
            icon_key = EXCLUDED.icon_key,
            show_in_top_nav = EXCLUDED.show_in_top_nav,
            top_nav_order = EXCLUDED.top_nav_order,
            page_template_key = EXCLUDED.page_template_key,
            updated_at = NOW()
          RETURNING
            web_app_page_settings_id AS "webAppPageSettingsId",
            web_app_page_id AS "webAppPageId",
            parent_page_id AS "parentPageId",
            icon_key AS "iconKey",
            show_in_top_nav AS "showInTopNav",
            top_nav_order AS "topNavOrder",
            page_template_key AS "pageTemplateKey",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.webAppPageSettingsId,
          input.webAppPageId,
          input.parentPageId,
          input.iconKey,
          input.showInTopNav,
          input.topNavOrder,
          input.pageTemplateKey,
        ],
      );
      return toSettingsData(result.rows[0]);
    },
    async listContextNavItemsByOwnerPageId(ownerWebAppPageId) {
      const result = await dbPool.query<WebAppPageContextNavItemRecord>(
        `
          SELECT
            web_app_page_context_nav_item_id AS "webAppPageContextNavItemId",
            owner_web_app_page_id AS "ownerWebAppPageId",
            target_web_app_page_id AS "targetWebAppPageId",
            sort_order AS "sortOrder",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM web_app_page_context_nav_items
          WHERE owner_web_app_page_id = $1
          ORDER BY sort_order ASC, target_web_app_page_id ASC
        `,
        [ownerWebAppPageId],
      );
      return result.rows.map(toContextNavItemData);
    },
    async replaceContextNavItems(ownerWebAppPageId, items) {
      await dbPool.query(
        `
          DELETE FROM web_app_page_context_nav_items
          WHERE owner_web_app_page_id = $1
        `,
        [ownerWebAppPageId],
      );

      for (const item of items) {
        await dbPool.query(
          `
            INSERT INTO web_app_page_context_nav_items (
              web_app_page_context_nav_item_id,
              owner_web_app_page_id,
              target_web_app_page_id,
              sort_order,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, NOW(), NOW())
          `,
          [
            item.webAppPageContextNavItemId,
            item.ownerWebAppPageId,
            item.targetWebAppPageId,
            item.sortOrder,
          ],
        );
      }
    },
  };
}
