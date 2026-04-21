import type { Pool, PoolClient } from "pg";
import type { EntityBuilderRepository } from "./repository";
import type {
  CreateEntityDefinitionVersionRecordInput,
  EntityDefinitionAttributeRecord,
  EntityDefinitionLineageRecord,
  EntityDefinitionOptionRecord,
  EntityDefinitionSourceLinkRecord,
  EntityDefinitionValidationRuleRecord,
  EntityDefinitionVersionRecord,
} from "./types";
import type {
  EntityDefinitionAttributeData,
  EntityDefinitionListInput,
  EntityDefinitionListResultData,
  EntityDefinitionVersionData,
  ExportEntityDefinitionsInput,
  UpdateEntityDefinitionVersionInput,
} from "../domain/types";
import { createEntityBuilderId, normalizeKey } from "../domain/helpers";

const ORDER_BY_MAP: Record<string, string> = {
  entityKey: "l.entity_key",
  entityName: "l.entity_name",
  updatedAt: "l.updated_at",
};

function toAttributeData(
  attribute: EntityDefinitionAttributeRecord,
  validationRules: EntityDefinitionValidationRuleRecord[],
  options: EntityDefinitionOptionRecord[],
  sourceLinks: EntityDefinitionSourceLinkRecord[],
): EntityDefinitionAttributeData {
  return {
    entityDefinitionAttributeId: attribute.entity_definition_attribute_id,
    attributeKey: attribute.attribute_key,
    attributeKind: attribute.attribute_kind,
    attributeType: attribute.attribute_type,
    valueCardinality: attribute.value_cardinality,
    label: attribute.label,
    description: attribute.description,
    helpText: attribute.help_text,
    placeholderText: attribute.placeholder_text,
    formFacing: attribute.form_facing,
    defaultFormPatternKey: attribute.default_form_pattern_key,
    optionsMode: attribute.options_mode,
    optionsCatalogKey: attribute.options_catalog_key,
    derivationNote: attribute.derivation_note,
    sourceAttributeKeys: sourceLinks
      .sort((a, b) => a.display_order - b.display_order)
      .map((item) => item.source_attribute_key),
    displayOrder: attribute.display_order,
    createdAt: attribute.created_at,
    updatedAt: attribute.updated_at,
    validationRules: validationRules
      .sort((a, b) => a.display_order - b.display_order)
      .map((rule) => ({
        entityDefinitionAttributeValidationRuleId:
          rule.entity_definition_attribute_validation_rule_id,
        ruleKey: rule.rule_key,
        ruleArgumentType: rule.rule_argument_type,
        ruleArgumentString: rule.rule_argument_string,
        ruleArgumentInteger: rule.rule_argument_integer,
        ruleArgumentDecimal: rule.rule_argument_decimal,
        ruleArgumentBoolean: rule.rule_argument_boolean,
        errorMessage: rule.error_message,
        displayOrder: rule.display_order,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
      })),
    options: options
      .sort((a, b) => a.display_order - b.display_order)
      .map((option) => ({
        entityDefinitionAttributeOptionId: option.entity_definition_attribute_option_id,
        optionKey: option.option_key,
        label: option.label,
        description: option.description,
        displayOrder: option.display_order,
        createdAt: option.created_at,
        updatedAt: option.updated_at,
      })),
  };
}

async function withTransaction<T>(dbPool: Pool, callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function createPostgresEntityBuilderRepository(dbPool: Pool): EntityBuilderRepository {
  async function loadAggregateByVersionId(
    client: Pool | PoolClient,
    entityDefinitionVersionId: string,
  ): Promise<EntityDefinitionVersionData | null> {
    const versionResult = await client.query<
      EntityDefinitionVersionRecord &
        Omit<EntityDefinitionLineageRecord, "status" | "created_at" | "updated_at" | "archived_at"> & {
          lineage_status: EntityDefinitionLineageRecord["status"];
          lineage_created_at: EntityDefinitionLineageRecord["created_at"];
          lineage_updated_at: EntityDefinitionLineageRecord["updated_at"];
          lineage_archived_at: EntityDefinitionLineageRecord["archived_at"];
        }
    >(
      `
        SELECT
          v.entity_definition_version_id,
          v.entity_definition_id,
          v.version_number,
          v.status,
          v.supersedes_version_id,
          v.created_at,
          v.updated_at,
          v.activated_at,
          v.superseded_at,
          v.archived_at,
          l.entity_key,
          l.entity_name,
          l.description,
          l.current_version_id,
          l.status AS lineage_status,
          l.created_at AS lineage_created_at,
          l.updated_at AS lineage_updated_at,
          l.archived_at AS lineage_archived_at
        FROM entity_definition_version v
        JOIN entity_definition l ON l.entity_definition_id = v.entity_definition_id
        WHERE v.entity_definition_version_id = $1
      `,
      [entityDefinitionVersionId],
    );
    const versionRow = versionResult.rows[0];
    if (!versionRow) {
      return null;
    }

    const attributeResult = await client.query<EntityDefinitionAttributeRecord>(
      `SELECT * FROM entity_definition_attribute WHERE entity_definition_version_id = $1 ORDER BY display_order ASC`,
      [entityDefinitionVersionId],
    );
    const attributeIds = attributeResult.rows.map((row) => row.entity_definition_attribute_id);
    const validationRuleRows =
      attributeIds.length > 0
        ? (
            await client.query<EntityDefinitionValidationRuleRecord>(
              `SELECT * FROM entity_definition_attribute_validation_rule WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            )
          ).rows
        : [];
    const optionRows =
      attributeIds.length > 0
        ? (
            await client.query<EntityDefinitionOptionRecord>(
              `SELECT * FROM entity_definition_attribute_option WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            )
          ).rows
        : [];
    const sourceLinkRows =
      attributeIds.length > 0
        ? (
            await client.query<EntityDefinitionSourceLinkRecord>(
              `SELECT * FROM entity_definition_attribute_source_link WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            )
          ).rows
        : [];

    return {
      entityDefinitionId: versionRow.entity_definition_id,
      entityKey: versionRow.entity_key,
      entityName: versionRow.entity_name,
      description: versionRow.description,
      currentVersionId: versionRow.current_version_id,
      lineageStatus: versionRow.lineage_status,
      entityDefinitionVersionId: versionRow.entity_definition_version_id,
      versionNumber: versionRow.version_number,
      status: versionRow.status,
      supersedesVersionId: versionRow.supersedes_version_id,
      createdAt: versionRow.created_at,
      updatedAt: versionRow.updated_at,
      activatedAt: versionRow.activated_at,
      supersededAt: versionRow.superseded_at,
      archivedAt: versionRow.archived_at,
      attributes: attributeResult.rows.map((attribute) =>
        toAttributeData(
          attribute,
          validationRuleRows.filter(
            (row) => row.entity_definition_attribute_id === attribute.entity_definition_attribute_id,
          ),
          optionRows.filter(
            (row) => row.entity_definition_attribute_id === attribute.entity_definition_attribute_id,
          ),
          sourceLinkRows.filter(
            (row) => row.entity_definition_attribute_id === attribute.entity_definition_attribute_id,
          ),
        ),
      ),
    };
  }

  async function insertAttributes(
    client: PoolClient,
    entityDefinitionVersionId: string,
    attributes: CreateEntityDefinitionVersionRecordInput["attributes"],
  ) {
    for (const attribute of attributes) {
      const entityDefinitionAttributeId = createEntityBuilderId();
      await client.query(
        `
          INSERT INTO entity_definition_attribute (
            entity_definition_attribute_id,
            entity_definition_version_id,
            attribute_key,
            attribute_kind,
            attribute_type,
            value_cardinality,
            label,
            description,
            help_text,
            placeholder_text,
            form_facing,
            default_form_pattern_key,
            options_mode,
            options_catalog_key,
            derivation_note,
            display_order,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        `,
        [
          entityDefinitionAttributeId,
          entityDefinitionVersionId,
          attribute.attributeKey,
          attribute.attributeKind,
          attribute.attributeType,
          attribute.valueCardinality,
          attribute.label,
          attribute.description,
          attribute.helpText?.trim() ?? null,
          attribute.placeholderText?.trim() ?? null,
          attribute.formFacing,
          attribute.defaultFormPatternKey ?? null,
          attribute.optionsMode,
          attribute.optionsCatalogKey ?? null,
          attribute.derivationNote ?? null,
          attribute.displayOrder,
        ],
      );

      for (const rule of attribute.validationRules) {
        await client.query(
          `
            INSERT INTO entity_definition_attribute_validation_rule (
              entity_definition_attribute_validation_rule_id,
              entity_definition_attribute_id,
              rule_key,
              rule_argument_type,
              rule_argument_string,
              rule_argument_integer,
              rule_argument_decimal,
              rule_argument_boolean,
              error_message,
              display_order,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
          `,
          [
            createEntityBuilderId(),
            entityDefinitionAttributeId,
            rule.ruleKey,
            rule.ruleArgumentType,
            rule.ruleArgumentString ?? null,
            rule.ruleArgumentInteger ?? null,
            rule.ruleArgumentDecimal ?? null,
            rule.ruleArgumentBoolean ?? null,
            rule.errorMessage ?? null,
            rule.displayOrder,
          ],
        );
      }

      for (const option of attribute.options) {
        await client.query(
          `
            INSERT INTO entity_definition_attribute_option (
              entity_definition_attribute_option_id,
              entity_definition_attribute_id,
              option_key,
              label,
              description,
              display_order,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          `,
          [
            createEntityBuilderId(),
            entityDefinitionAttributeId,
            option.optionKey,
            option.label,
            option.description ?? null,
            option.displayOrder,
          ],
        );
      }

      for (const [index, sourceAttributeKey] of attribute.sourceAttributeKeys.entries()) {
        await client.query(
          `
            INSERT INTO entity_definition_attribute_source_link (
              entity_definition_attribute_source_link_id,
              entity_definition_attribute_id,
              source_attribute_key,
              display_order
            )
            VALUES ($1, $2, $3, $4)
          `,
          [createEntityBuilderId(), entityDefinitionAttributeId, sourceAttributeKey, index],
        );
      }
    }
  }

  return {
    async findLineageByEntityKey(entityKey) {
      const result = await dbPool.query<EntityDefinitionLineageRecord>(
        `SELECT * FROM entity_definition WHERE entity_key = $1`,
        [normalizeKey(entityKey)],
      );
      return result.rows[0] ?? null;
    },
    async findCurrentVersionByEntityKey(entityKey) {
      const result = await dbPool.query<{ current_version_id: string | null }>(
        `SELECT current_version_id FROM entity_definition WHERE entity_key = $1`,
        [normalizeKey(entityKey)],
      );
      const currentVersionId = result.rows[0]?.current_version_id;
      return currentVersionId ? loadAggregateByVersionId(dbPool, currentVersionId) : null;
    },
    findVersionById(entityDefinitionVersionId) {
      return loadAggregateByVersionId(dbPool, entityDefinitionVersionId);
    },
    async listLineages(input) {
      const orderBy = ORDER_BY_MAP[input.orderBy];
      const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
      const values: unknown[] = [];
      const clauses: string[] = [];
      if (input.filters.entityKeyPrefix) {
        values.push(`${input.filters.entityKeyPrefix.toLowerCase()}%`);
        clauses.push(`l.entity_key LIKE $${values.length}`);
      }
      if (input.filters.entityNamePrefix) {
        values.push(`${input.filters.entityNamePrefix.toLowerCase()}%`);
        clauses.push(`LOWER(l.entity_name) LIKE $${values.length}`);
      }
      if (input.filters.status) {
        values.push(input.filters.status);
        clauses.push(`l.status = $${values.length}`);
      }
      const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
      const totals = await dbPool.query<{ total_matching_records: string }>(
        `SELECT COUNT(*)::text AS total_matching_records FROM entity_definition l ${where}`,
        values,
      );
      values.push(input.pageSize);
      values.push((input.page - 1) * input.pageSize);
      const result = await dbPool.query<{
        entity_definition_id: string;
        entity_key: string;
        entity_name: string;
        status: "draft" | "active" | "superseded" | "archived";
        current_version_id: string | null;
        version_number: number | null;
        updated_at: Date;
      }>(
        `
          SELECT
            l.entity_definition_id,
            l.entity_key,
            l.entity_name,
            l.status,
            l.current_version_id,
            v.version_number,
            l.updated_at
          FROM entity_definition l
          LEFT JOIN entity_definition_version v
            ON v.entity_definition_version_id = l.current_version_id
          ${where}
          ORDER BY ${orderBy} ${orderDirection}
          LIMIT $${values.length - 1}
          OFFSET $${values.length}
        `,
        values,
      );
      const items = result.rows.map((row) => ({
        entityDefinitionId: row.entity_definition_id,
        entityKey: row.entity_key,
        entityName: row.entity_name,
        status: row.status,
        currentVersionId: row.current_version_id,
        currentVersionNumber: row.version_number ?? null,
        updatedAt: row.updated_at,
        exportable: row.status === "active" && row.current_version_id !== null,
      }));
      return {
        items,
        totalMatchingRecords: Number(totals.rows[0]?.total_matching_records ?? "0"),
      } satisfies EntityDefinitionListResultData;
    },
    async createLineageWithVersion(input) {
      return withTransaction(dbPool, async (client) => {
        await client.query(
          `
            INSERT INTO entity_definition (
              entity_definition_id,
              entity_key,
              entity_name,
              description,
              current_version_id,
              status,
              created_at,
              updated_at,
              archived_at
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              CASE WHEN $5 = 'active' THEN $6::uuid ELSE NULL::uuid END,
              $5,
              NOW(),
              NOW(),
              NULL
            )
          `,
          [
            input.entityDefinitionId,
            input.entityKey,
            input.entityName,
            input.description,
            input.status,
            input.entityDefinitionVersionId,
          ],
        );
        await client.query(
          `
            INSERT INTO entity_definition_version (
              entity_definition_version_id,
              entity_definition_id,
              version_number,
              status,
              supersedes_version_id,
              created_at,
              updated_at,
              activated_at,
              superseded_at,
              archived_at
            )
            VALUES ($1, $2, 1, $3, NULL, NOW(), NOW(), CASE WHEN $3 = 'active' THEN NOW() ELSE NULL END, NULL, NULL)
          `,
          [input.entityDefinitionVersionId, input.entityDefinitionId, input.status],
        );
        await insertAttributes(client, input.entityDefinitionVersionId, input.attributes);
        return loadAggregateByVersionId(client, input.entityDefinitionVersionId) as Promise<EntityDefinitionVersionData>;
      });
    },
    async createVersionForExistingLineage(input) {
      return withTransaction(dbPool, async (client) => {
        const versionNumberResult = await client.query<{ next_version_number: string }>(
          `SELECT (COALESCE(MAX(version_number), 0) + 1)::text AS next_version_number FROM entity_definition_version WHERE entity_definition_id = $1`,
          [input.entityDefinitionId],
        );
        const nextVersionNumber = Number(versionNumberResult.rows[0]?.next_version_number ?? "1");
        await client.query(
          `
            UPDATE entity_definition
            SET entity_name = $2, description = $3, updated_at = NOW()
            WHERE entity_definition_id = $1
          `,
          [input.entityDefinitionId, input.entityName, input.description],
        );
        await client.query(
          `
            INSERT INTO entity_definition_version (
              entity_definition_version_id,
              entity_definition_id,
              version_number,
              status,
              supersedes_version_id,
              created_at,
              updated_at,
              activated_at,
              superseded_at,
              archived_at
            )
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), CASE WHEN $4 = 'active' THEN NOW() ELSE NULL END, NULL, NULL)
          `,
          [
            input.entityDefinitionVersionId,
            input.entityDefinitionId,
            nextVersionNumber,
            input.status,
            input.supersedesVersionId,
          ],
        );
        await insertAttributes(client, input.entityDefinitionVersionId, input.attributes);
        return loadAggregateByVersionId(client, input.entityDefinitionVersionId) as Promise<EntityDefinitionVersionData>;
      });
    },
    async updateDraftVersion(input) {
      return withTransaction(dbPool, async (client) => {
        const existing = await loadAggregateByVersionId(client, input.entityDefinitionVersionId);
        if (!existing) {
          throw new Error("version_not_found");
        }
        await client.query(
          `
            UPDATE entity_definition
            SET
              entity_name = COALESCE($2, entity_name),
              description = COALESCE($3, description),
              updated_at = NOW()
            WHERE entity_definition_id = $1
          `,
          [existing.entityDefinitionId, input.entityName ?? null, input.description ?? null],
        );
        await client.query(
          `
            UPDATE entity_definition_version
            SET updated_at = NOW()
            WHERE entity_definition_version_id = $1
          `,
          [input.entityDefinitionVersionId],
        );
        if (input.attributes) {
          const attributeIds = existing.attributes.map((item) => item.entityDefinitionAttributeId);
          if (attributeIds.length > 0) {
            await client.query(
              `DELETE FROM entity_definition_attribute_source_link WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            );
            await client.query(
              `DELETE FROM entity_definition_attribute_option WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            );
            await client.query(
              `DELETE FROM entity_definition_attribute_validation_rule WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            );
            await client.query(
              `DELETE FROM entity_definition_attribute WHERE entity_definition_attribute_id = ANY($1::uuid[])`,
              [attributeIds],
            );
          }
          await insertAttributes(client, input.entityDefinitionVersionId, input.attributes);
        }
        return loadAggregateByVersionId(client, input.entityDefinitionVersionId) as Promise<EntityDefinitionVersionData>;
      });
    },
    async replaceVersionStatusAndCurrent(entityDefinitionVersionId, status) {
      return withTransaction(dbPool, async (client) => {
        const existing = await loadAggregateByVersionId(client, entityDefinitionVersionId);
        if (!existing) {
          throw new Error("version_not_found");
        }
        if (status === "active") {
          await client.query(
            `
              UPDATE entity_definition_version
              SET status = 'superseded', superseded_at = NOW(), updated_at = NOW()
              WHERE entity_definition_id = $1
                AND entity_definition_version_id <> $2
                AND status = 'active'
            `,
            [existing.entityDefinitionId, entityDefinitionVersionId],
          );
          await client.query(
            `
              UPDATE entity_definition_version
              SET status = 'active', activated_at = COALESCE(activated_at, NOW()), updated_at = NOW()
              WHERE entity_definition_version_id = $1
            `,
            [entityDefinitionVersionId],
          );
          await client.query(
            `
              UPDATE entity_definition
              SET current_version_id = $2, status = 'active', updated_at = NOW()
              WHERE entity_definition_id = $1
            `,
            [existing.entityDefinitionId, entityDefinitionVersionId],
          );
        } else {
          await client.query(
            `
              UPDATE entity_definition_version
              SET status = 'draft', updated_at = NOW()
              WHERE entity_definition_version_id = $1
            `,
            [entityDefinitionVersionId],
          );
          await client.query(
            `
              UPDATE entity_definition
              SET status = CASE WHEN current_version_id IS NULL THEN 'draft' ELSE status END, updated_at = NOW()
              WHERE entity_definition_id = $1
            `,
            [existing.entityDefinitionId],
          );
        }
        return loadAggregateByVersionId(client, entityDefinitionVersionId) as Promise<EntityDefinitionVersionData>;
      });
    },
    async findExportVersions(input) {
      if (input.entityDefinitionVersionIds && input.entityDefinitionVersionIds.length > 0) {
        const items = await Promise.all(
          input.entityDefinitionVersionIds.map((id) => loadAggregateByVersionId(dbPool, id)),
        );
        return items.filter((item): item is EntityDefinitionVersionData => Boolean(item));
      }
      if (input.entityKeys && input.entityKeys.length > 0) {
        const items = await Promise.all(
          input.entityKeys.map((key) => this.findCurrentVersionByEntityKey(key)),
        );
        return items.filter((item): item is EntityDefinitionVersionData => Boolean(item));
      }
      const result = await dbPool.query<{ current_version_id: string }>(
        `SELECT current_version_id FROM entity_definition WHERE status = 'active' AND current_version_id IS NOT NULL ORDER BY entity_key ASC`,
      );
      const items = await Promise.all(
        result.rows.map((row) => loadAggregateByVersionId(dbPool, row.current_version_id)),
      );
      return items.filter((item): item is EntityDefinitionVersionData => Boolean(item));
    },
  };
}
