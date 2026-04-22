import type { Pool, PoolClient } from "pg";
import type { CapabilityContractCatalogRepository } from "./repository";
import type {
  CapabilityCatalogConstraintRow,
  CapabilityCatalogFieldRow,
  CapabilityCatalogRecordRow,
  CapabilityCatalogSourceReferenceRow,
} from "./types";
import type {
  CapabilityConstraintData,
  CapabilityFieldData,
  CapabilityRecordData,
  CapabilitySourceReferenceData,
} from "../domain/types";

function toFieldData(row: CapabilityCatalogFieldRow): CapabilityFieldData {
  return {
    fieldId: row.capability_catalog_field_id,
    capabilityId: row.capability_id,
    contractSide: row.contract_side as CapabilityFieldData["contractSide"],
    path: row.path,
    displayLabel: row.display_label,
    description: row.description,
    fieldType: row.field_type,
    required: row.required,
    nullable: row.nullable,
    repeated: row.repeated,
    format: row.format,
    enumValues: row.enum_values ?? [],
    systemManaged: row.system_managed,
    normalizationSteps: row.normalization_steps ?? [],
    bindingHints: row.binding_hints ?? [],
    validation: row.validation,
    displayOrder: row.display_order,
  };
}

function toConstraintData(row: CapabilityCatalogConstraintRow): CapabilityConstraintData {
  return {
    constraintId: row.capability_catalog_constraint_id,
    capabilityId: row.capability_id,
    constraintKind: row.constraint_kind,
    fields: row.field_paths ?? [],
    message: row.message,
    displayOrder: row.display_order,
  };
}

function toSourceData(row: CapabilityCatalogSourceReferenceRow): CapabilitySourceReferenceData {
  return {
    sourceReferenceId: row.capability_catalog_source_reference_id,
    capabilityId: row.capability_id,
    sourceType: row.source_type,
    sourcePath: row.source_path,
    sourceCoverage: row.source_coverage,
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

export function createPostgresCapabilityContractCatalogRepository(
  dbPool: Pool,
): CapabilityContractCatalogRepository {
  async function hydrateRecords(recordRows: CapabilityCatalogRecordRow[]): Promise<CapabilityRecordData[]> {
    if (recordRows.length === 0) {
      return [];
    }
    const capabilityIds = recordRows.map((row) => row.capability_id);
    const [fieldRows, constraintRows, sourceRows] = await Promise.all([
      dbPool.query<CapabilityCatalogFieldRow>(
        `SELECT * FROM capability_catalog_fields WHERE capability_id = ANY($1::text[]) ORDER BY contract_side ASC, display_order ASC`,
        [capabilityIds],
      ),
      dbPool.query<CapabilityCatalogConstraintRow>(
        `SELECT * FROM capability_catalog_constraints WHERE capability_id = ANY($1::text[]) ORDER BY display_order ASC`,
        [capabilityIds],
      ),
      dbPool.query<CapabilityCatalogSourceReferenceRow>(
        `SELECT * FROM capability_catalog_source_references WHERE capability_id = ANY($1::text[]) ORDER BY source_type ASC, source_path ASC`,
        [capabilityIds],
      ),
    ]);

    return recordRows.map((row) => ({
      recordId: row.capability_catalog_record_id,
      capabilityId: row.capability_id,
      featureName: row.feature_name,
      displayLabel: row.display_label,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      userFacingOutcome: row.user_facing_outcome,
      routeFamily: row.route_family,
      seamType: row.seam_type,
      capabilityBoundary: row.capability_boundary as CapabilityRecordData["capabilityBoundary"],
      selectionGroup: row.selection_group,
      httpMethod: row.http_method,
      routePath: row.route_path,
      governingAuthzCapabilities: row.governing_authz_capabilities ?? [],
      allowedRoles: row.allowed_roles ?? [],
      supportsRequestBody: row.supports_request_body,
      supportsResponseFields: row.supports_response_fields,
      supportsFilters: row.supports_filters,
      lifecycleStatus: row.lifecycle_status as CapabilityRecordData["lifecycleStatus"],
      normalizedHash: row.normalized_hash,
      lastMaterializedAt: row.last_materialized_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      fields: fieldRows.rows
        .filter((item) => item.capability_id === row.capability_id)
        .map(toFieldData),
      constraints: constraintRows.rows
        .filter((item) => item.capability_id === row.capability_id)
        .map(toConstraintData),
      sourceReferences: sourceRows.rows
        .filter((item) => item.capability_id === row.capability_id)
        .map(toSourceData),
    }));
  }

  return {
    async materializeRecords(records) {
      return withTransaction(dbPool, async (client) => {
        let insertedCount = 0;
        let updatedCount = 0;

        for (const record of records) {
          const existing = await client.query<{ capability_id: string }>(
            `SELECT capability_id FROM capability_catalog_records WHERE capability_id = $1`,
            [record.capabilityId],
          );

          if ((existing.rowCount ?? 0) > 0) {
            updatedCount += 1;
          } else {
            insertedCount += 1;
          }

          await client.query(
            `
              INSERT INTO capability_catalog_records (
                capability_catalog_record_id,
                capability_id,
                feature_name,
                display_label,
                short_description,
                full_description,
                user_facing_outcome,
                route_family,
                seam_type,
                capability_boundary,
                selection_group,
                http_method,
                route_path,
                governing_authz_capabilities,
                allowed_roles,
                supports_request_body,
                supports_response_fields,
                supports_filters,
                lifecycle_status,
                normalized_hash,
                last_materialized_at,
                created_at,
                updated_at
              )
              VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::text[],$15::text[],$16,$17,$18,$19,$20,$21,$22,$23
              )
              ON CONFLICT (capability_id)
              DO UPDATE SET
                feature_name = EXCLUDED.feature_name,
                display_label = EXCLUDED.display_label,
                short_description = EXCLUDED.short_description,
                full_description = EXCLUDED.full_description,
                user_facing_outcome = EXCLUDED.user_facing_outcome,
                route_family = EXCLUDED.route_family,
                seam_type = EXCLUDED.seam_type,
                capability_boundary = EXCLUDED.capability_boundary,
                selection_group = EXCLUDED.selection_group,
                http_method = EXCLUDED.http_method,
                route_path = EXCLUDED.route_path,
                governing_authz_capabilities = EXCLUDED.governing_authz_capabilities,
                allowed_roles = EXCLUDED.allowed_roles,
                supports_request_body = EXCLUDED.supports_request_body,
                supports_response_fields = EXCLUDED.supports_response_fields,
                supports_filters = EXCLUDED.supports_filters,
                lifecycle_status = EXCLUDED.lifecycle_status,
                normalized_hash = EXCLUDED.normalized_hash,
                last_materialized_at = EXCLUDED.last_materialized_at,
                updated_at = EXCLUDED.updated_at
            `,
            [
              record.recordId,
              record.capabilityId,
              record.featureName,
              record.displayLabel,
              record.shortDescription,
              record.fullDescription,
              record.userFacingOutcome,
              record.routeFamily,
              record.seamType,
              record.capabilityBoundary,
              record.selectionGroup,
              record.httpMethod,
              record.routePath,
              record.governingAuthzCapabilities,
              record.allowedRoles,
              record.supportsRequestBody,
              record.supportsResponseFields,
              record.supportsFilters,
              record.lifecycleStatus,
              record.normalizedHash,
              record.lastMaterializedAt,
              record.createdAt,
              record.updatedAt,
            ],
          );

          await client.query(`DELETE FROM capability_catalog_fields WHERE capability_id = $1`, [
            record.capabilityId,
          ]);
          await client.query(`DELETE FROM capability_catalog_constraints WHERE capability_id = $1`, [
            record.capabilityId,
          ]);
          await client.query(
            `DELETE FROM capability_catalog_source_references WHERE capability_id = $1`,
            [record.capabilityId],
          );

          for (const field of record.fields) {
            await client.query(
              `
                INSERT INTO capability_catalog_fields (
                  capability_catalog_field_id,
                  capability_id,
                  contract_side,
                  path,
                  display_label,
                  description,
                  field_type,
                  required,
                  nullable,
                  repeated,
                  format,
                  enum_values,
                  system_managed,
                  normalization_steps,
                  binding_hints,
                  validation,
                  display_order
                )
                VALUES (
                  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::text[],$13,$14::text[],$15::text[],$16::jsonb,$17
                )
              `,
              [
                field.fieldId,
                field.capabilityId,
                field.contractSide,
                field.path,
                field.displayLabel,
                field.description,
                field.fieldType,
                field.required,
                field.nullable,
                field.repeated,
                field.format,
                field.enumValues,
                field.systemManaged,
                field.normalizationSteps,
                field.bindingHints,
                field.validation ? JSON.stringify(field.validation) : null,
                field.displayOrder,
              ],
            );
          }

          for (const constraint of record.constraints) {
            await client.query(
              `
                INSERT INTO capability_catalog_constraints (
                  capability_catalog_constraint_id,
                  capability_id,
                  constraint_kind,
                  field_paths,
                  message,
                  display_order
                )
                VALUES ($1,$2,$3,$4::text[],$5,$6)
              `,
              [
                constraint.constraintId,
                constraint.capabilityId,
                constraint.constraintKind,
                constraint.fields,
                constraint.message,
                constraint.displayOrder,
              ],
            );
          }

          for (const sourceReference of record.sourceReferences) {
            await client.query(
              `
                INSERT INTO capability_catalog_source_references (
                  capability_catalog_source_reference_id,
                  capability_id,
                  source_type,
                  source_path,
                  source_coverage
                )
                VALUES ($1,$2,$3,$4,$5)
              `,
              [
                sourceReference.sourceReferenceId,
                sourceReference.capabilityId,
                sourceReference.sourceType,
                sourceReference.sourcePath,
                sourceReference.sourceCoverage,
              ],
            );
          }
        }

        return { insertedCount, updatedCount };
      });
    },

    async listAllRecords() {
      const recordRows = await dbPool.query<CapabilityCatalogRecordRow>(
        `SELECT * FROM capability_catalog_records ORDER BY feature_name ASC, capability_id ASC`,
      );
      return hydrateRecords(recordRows.rows);
    },

    async findRecordByCapabilityId(capabilityId) {
      const recordRows = await dbPool.query<CapabilityCatalogRecordRow>(
        `SELECT * FROM capability_catalog_records WHERE capability_id = $1`,
        [capabilityId],
      );
      const records = await hydrateRecords(recordRows.rows);
      return records[0] ?? null;
    },
  };
}
