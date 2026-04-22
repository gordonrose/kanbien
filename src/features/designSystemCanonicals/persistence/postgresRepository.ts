import type { Pool } from "pg";
import type { DesignSystemCanonicalsRepository } from "./repository";
import type {
  DesignSystemCanonicalFamilyRecord,
  DesignSystemCanonicalReferenceRecord,
} from "./types";
import type {
  DesignSystemCanonicalFamilyData,
  DesignSystemCanonicalReferenceData,
} from "../domain/types";

function toFamilyData(record: DesignSystemCanonicalFamilyRecord): DesignSystemCanonicalFamilyData {
  return {
    ...record,
    launcherTemplateKey: "launcher",
    renderTemplateKey: "canonical-rendering",
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function toReferenceData(
  record: DesignSystemCanonicalReferenceRecord,
): DesignSystemCanonicalReferenceData {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    specimenPayload:
      record.specimenPayload && typeof record.specimenPayload === "object"
        ? record.specimenPayload
        : {},
  };
}

export function createPostgresDesignSystemCanonicalsRepository(
  dbPool: Pool,
): DesignSystemCanonicalsRepository {
  async function queryFamily(
    sql: string,
    values: unknown[],
  ): Promise<DesignSystemCanonicalFamilyData | null> {
    const result = await dbPool.query<DesignSystemCanonicalFamilyRecord>(sql, values);
    return result.rows[0] ? toFamilyData(result.rows[0]) : null;
  }

  async function queryReference(
    sql: string,
    values: unknown[],
  ): Promise<DesignSystemCanonicalReferenceData | null> {
    const result = await dbPool.query<DesignSystemCanonicalReferenceRecord>(sql, values);
    return result.rows[0] ? toReferenceData(result.rows[0]) : null;
  }

  return {
    async listLiveFamilies() {
      const result = await dbPool.query<DesignSystemCanonicalFamilyRecord>(
        `
          SELECT
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM design_system_canonical_families
          WHERE status = 'live'
          ORDER BY featured DESC, sort_order ASC, family_key ASC
        `,
      );
      return result.rows.map(toFamilyData);
    },
    findFamilyById(canonicalFamilyId) {
      return queryFamily(
        `
          SELECT
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM design_system_canonical_families
          WHERE design_system_canonical_family_id = $1
        `,
        [canonicalFamilyId],
      );
    },
    findFamilyByKey(familyKey) {
      return queryFamily(
        `
          SELECT
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM design_system_canonical_families
          WHERE normalized_family_key = lower(trim($1))
        `,
        [familyKey],
      );
    },
    findLiveFamilyByKey(familyKey) {
      return queryFamily(
        `
          SELECT
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM design_system_canonical_families
          WHERE normalized_family_key = lower(trim($1))
            AND status = 'live'
        `,
        [familyKey],
      );
    },
    findFamilyByGeneratedLauncherRoutePath(routePath) {
      return queryFamily(
        `
          SELECT
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM design_system_canonical_families
          WHERE generated_launcher_route_path = $1
        `,
        [routePath],
      );
    },
    async createFamily(input) {
      const result = await dbPool.query<DesignSystemCanonicalFamilyRecord>(
        `
          INSERT INTO design_system_canonical_families (
            design_system_canonical_family_id,
            family_key,
            normalized_family_key,
            display_label,
            family_kind,
            launcher_title,
            launcher_description,
            launcher_category,
            generated_launcher_route_path,
            generated_root_route_path,
            legacy_launcher_route_path,
            source_surface_route_path,
            status,
            sort_order,
            featured,
            created_at,
            updated_at
          )
          VALUES (
            $1, $2, lower(trim($2)), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
          )
          RETURNING
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.canonicalFamilyId,
          input.familyKey,
          input.displayLabel,
          input.familyKind,
          input.launcherTitle,
          input.launcherDescription,
          input.launcherCategory,
          input.generatedLauncherRoutePath,
          input.generatedRootRoutePath,
          input.legacyLauncherRoutePath,
          input.sourceSurfaceRoutePath,
          input.status,
          input.sortOrder,
          input.featured,
        ],
      );
      return toFamilyData(result.rows[0]);
    },
    async updateFamily(input) {
      const result = await dbPool.query<DesignSystemCanonicalFamilyRecord>(
        `
          UPDATE design_system_canonical_families
          SET
            display_label = $2,
            family_kind = $3,
            launcher_title = $4,
            launcher_description = $5,
            launcher_category = $6,
            generated_launcher_route_path = $7,
            generated_root_route_path = $8,
            legacy_launcher_route_path = $9,
            source_surface_route_path = $10,
            status = $11,
            sort_order = $12,
            featured = $13,
            updated_at = NOW()
          WHERE design_system_canonical_family_id = $1
          RETURNING
            design_system_canonical_family_id AS "canonicalFamilyId",
            family_key AS "familyKey",
            display_label AS "displayLabel",
            family_kind AS "familyKind",
            launcher_title AS "launcherTitle",
            launcher_description AS "launcherDescription",
            launcher_category AS "launcherCategory",
            generated_launcher_route_path AS "generatedLauncherRoutePath",
            generated_root_route_path AS "generatedRootRoutePath",
            legacy_launcher_route_path AS "legacyLauncherRoutePath",
            source_surface_route_path AS "sourceSurfaceRoutePath",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.canonicalFamilyId,
          input.displayLabel,
          input.familyKind,
          input.launcherTitle,
          input.launcherDescription,
          input.launcherCategory,
          input.generatedLauncherRoutePath,
          input.generatedRootRoutePath,
          input.legacyLauncherRoutePath,
          input.sourceSurfaceRoutePath,
          input.status,
          input.sortOrder,
          input.featured,
        ],
      );
      return toFamilyData(result.rows[0]);
    },
    async listLiveReferencesByFamilyKey(familyKey) {
      const result = await dbPool.query<DesignSystemCanonicalReferenceRecord>(
        `
          SELECT
            r.design_system_canonical_reference_id AS "canonicalReferenceId",
            r.design_system_canonical_family_id AS "canonicalFamilyId",
            f.family_key AS "familyKey",
            r.reference_id AS "referenceId",
            r.display_label AS "displayLabel",
            r.description,
            r.render_route_path AS "renderRoutePath",
            r.legacy_render_route_path AS "legacyRenderRoutePath",
            r.viewport,
            r.width,
            r.height,
            r.theme,
            r.direction,
            r.zoom,
            r.locale_fixture AS "localeFixture",
            r.label_density_fixture AS "labelDensityFixture",
            r.state_variant_key AS "stateVariantKey",
            r.specimen_payload AS "specimenPayload",
            r.status,
            r.sort_order AS "sortOrder",
            r.featured,
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt"
          FROM design_system_canonical_references r
          JOIN design_system_canonical_families f
            ON f.design_system_canonical_family_id = r.design_system_canonical_family_id
          WHERE f.normalized_family_key = lower(trim($1))
            AND f.status = 'live'
            AND r.status = 'live'
          ORDER BY r.featured DESC, r.sort_order ASC, r.reference_id ASC
        `,
        [familyKey],
      );
      return result.rows.map(toReferenceData);
    },
    findReferenceById(canonicalReferenceId) {
      return queryReference(
        `
          SELECT
            r.design_system_canonical_reference_id AS "canonicalReferenceId",
            r.design_system_canonical_family_id AS "canonicalFamilyId",
            f.family_key AS "familyKey",
            r.reference_id AS "referenceId",
            r.display_label AS "displayLabel",
            r.description,
            r.render_route_path AS "renderRoutePath",
            r.legacy_render_route_path AS "legacyRenderRoutePath",
            r.viewport,
            r.width,
            r.height,
            r.theme,
            r.direction,
            r.zoom,
            r.locale_fixture AS "localeFixture",
            r.label_density_fixture AS "labelDensityFixture",
            r.state_variant_key AS "stateVariantKey",
            r.specimen_payload AS "specimenPayload",
            r.status,
            r.sort_order AS "sortOrder",
            r.featured,
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt"
          FROM design_system_canonical_references r
          JOIN design_system_canonical_families f
            ON f.design_system_canonical_family_id = r.design_system_canonical_family_id
          WHERE r.design_system_canonical_reference_id = $1
        `,
        [canonicalReferenceId],
      );
    },
    findReferenceByFamilyAndReferenceId(familyKey, referenceId) {
      return queryReference(
        `
          SELECT
            r.design_system_canonical_reference_id AS "canonicalReferenceId",
            r.design_system_canonical_family_id AS "canonicalFamilyId",
            f.family_key AS "familyKey",
            r.reference_id AS "referenceId",
            r.display_label AS "displayLabel",
            r.description,
            r.render_route_path AS "renderRoutePath",
            r.legacy_render_route_path AS "legacyRenderRoutePath",
            r.viewport,
            r.width,
            r.height,
            r.theme,
            r.direction,
            r.zoom,
            r.locale_fixture AS "localeFixture",
            r.label_density_fixture AS "labelDensityFixture",
            r.state_variant_key AS "stateVariantKey",
            r.specimen_payload AS "specimenPayload",
            r.status,
            r.sort_order AS "sortOrder",
            r.featured,
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt"
          FROM design_system_canonical_references r
          JOIN design_system_canonical_families f
            ON f.design_system_canonical_family_id = r.design_system_canonical_family_id
          WHERE f.normalized_family_key = lower(trim($1))
            AND lower(trim(r.reference_id)) = lower(trim($2))
        `,
        [familyKey, referenceId],
      );
    },
    findLiveReferenceByFamilyAndReferenceId(familyKey, referenceId) {
      return queryReference(
        `
          SELECT
            r.design_system_canonical_reference_id AS "canonicalReferenceId",
            r.design_system_canonical_family_id AS "canonicalFamilyId",
            f.family_key AS "familyKey",
            r.reference_id AS "referenceId",
            r.display_label AS "displayLabel",
            r.description,
            r.render_route_path AS "renderRoutePath",
            r.legacy_render_route_path AS "legacyRenderRoutePath",
            r.viewport,
            r.width,
            r.height,
            r.theme,
            r.direction,
            r.zoom,
            r.locale_fixture AS "localeFixture",
            r.label_density_fixture AS "labelDensityFixture",
            r.state_variant_key AS "stateVariantKey",
            r.specimen_payload AS "specimenPayload",
            r.status,
            r.sort_order AS "sortOrder",
            r.featured,
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt"
          FROM design_system_canonical_references r
          JOIN design_system_canonical_families f
            ON f.design_system_canonical_family_id = r.design_system_canonical_family_id
          WHERE f.normalized_family_key = lower(trim($1))
            AND lower(trim(r.reference_id)) = lower(trim($2))
            AND f.status = 'live'
            AND r.status = 'live'
        `,
        [familyKey, referenceId],
      );
    },
    findReferenceByRenderRoutePath(routePath) {
      return queryReference(
        `
          SELECT
            r.design_system_canonical_reference_id AS "canonicalReferenceId",
            r.design_system_canonical_family_id AS "canonicalFamilyId",
            f.family_key AS "familyKey",
            r.reference_id AS "referenceId",
            r.display_label AS "displayLabel",
            r.description,
            r.render_route_path AS "renderRoutePath",
            r.legacy_render_route_path AS "legacyRenderRoutePath",
            r.viewport,
            r.width,
            r.height,
            r.theme,
            r.direction,
            r.zoom,
            r.locale_fixture AS "localeFixture",
            r.label_density_fixture AS "labelDensityFixture",
            r.state_variant_key AS "stateVariantKey",
            r.specimen_payload AS "specimenPayload",
            r.status,
            r.sort_order AS "sortOrder",
            r.featured,
            r.created_at AS "createdAt",
            r.updated_at AS "updatedAt"
          FROM design_system_canonical_references r
          JOIN design_system_canonical_families f
            ON f.design_system_canonical_family_id = r.design_system_canonical_family_id
          WHERE r.render_route_path = $1
        `,
        [routePath],
      );
    },
    async createReference(input) {
      const result = await dbPool.query<DesignSystemCanonicalReferenceRecord>(
        `
          INSERT INTO design_system_canonical_references (
            design_system_canonical_reference_id,
            design_system_canonical_family_id,
            reference_id,
            normalized_reference_id,
            display_label,
            description,
            render_route_path,
            legacy_render_route_path,
            viewport,
            width,
            height,
            theme,
            direction,
            zoom,
            locale_fixture,
            label_density_fixture,
            state_variant_key,
            specimen_payload,
            status,
            sort_order,
            featured,
            created_at,
            updated_at
          )
          VALUES (
            $1, $2, $3, lower(trim($3)), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19, $20, NOW(), NOW()
          )
          RETURNING
            design_system_canonical_reference_id AS "canonicalReferenceId",
            design_system_canonical_family_id AS "canonicalFamilyId",
            $21 AS "familyKey",
            reference_id AS "referenceId",
            display_label AS "displayLabel",
            description,
            render_route_path AS "renderRoutePath",
            legacy_render_route_path AS "legacyRenderRoutePath",
            viewport,
            width,
            height,
            theme,
            direction,
            zoom,
            locale_fixture AS "localeFixture",
            label_density_fixture AS "labelDensityFixture",
            state_variant_key AS "stateVariantKey",
            specimen_payload AS "specimenPayload",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.canonicalReferenceId,
          input.canonicalFamilyId,
          input.referenceId,
          input.displayLabel,
          input.description,
          input.renderRoutePath,
          input.legacyRenderRoutePath,
          input.viewport,
          input.width,
          input.height,
          input.theme,
          input.direction,
          input.zoom,
          input.localeFixture,
          input.labelDensityFixture,
          input.stateVariantKey,
          JSON.stringify(input.specimenPayload ?? {}),
          input.status,
          input.sortOrder,
          input.featured,
          input.familyKey,
        ],
      );
      return toReferenceData(result.rows[0]);
    },
    async updateReference(input) {
      const result = await dbPool.query<DesignSystemCanonicalReferenceRecord>(
        `
          UPDATE design_system_canonical_references
          SET
            display_label = $2,
            description = $3,
            render_route_path = $4,
            legacy_render_route_path = $5,
            viewport = $6,
            width = $7,
            height = $8,
            theme = $9,
            direction = $10,
            zoom = $11,
            locale_fixture = $12,
            label_density_fixture = $13,
            state_variant_key = $14,
            specimen_payload = $15::jsonb,
            status = $16,
            sort_order = $17,
            featured = $18,
            updated_at = NOW()
          WHERE design_system_canonical_reference_id = $1
          RETURNING
            design_system_canonical_reference_id AS "canonicalReferenceId",
            design_system_canonical_family_id AS "canonicalFamilyId",
            (
              SELECT family_key
              FROM design_system_canonical_families
              WHERE design_system_canonical_family_id = design_system_canonical_references.design_system_canonical_family_id
            ) AS "familyKey",
            reference_id AS "referenceId",
            display_label AS "displayLabel",
            description,
            render_route_path AS "renderRoutePath",
            legacy_render_route_path AS "legacyRenderRoutePath",
            viewport,
            width,
            height,
            theme,
            direction,
            zoom,
            locale_fixture AS "localeFixture",
            label_density_fixture AS "labelDensityFixture",
            state_variant_key AS "stateVariantKey",
            specimen_payload AS "specimenPayload",
            status,
            sort_order AS "sortOrder",
            featured,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [
          input.canonicalReferenceId,
          input.displayLabel,
          input.description,
          input.renderRoutePath,
          input.legacyRenderRoutePath,
          input.viewport,
          input.width,
          input.height,
          input.theme,
          input.direction,
          input.zoom,
          input.localeFixture,
          input.labelDensityFixture,
          input.stateVariantKey,
          JSON.stringify(input.specimenPayload ?? {}),
          input.status,
          input.sortOrder,
          input.featured,
        ],
      );
      return toReferenceData(result.rows[0]);
    },
  };
}

