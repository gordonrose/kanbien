import type { Pool } from "pg";
import type { OrganizationSearchRecord, OrganizationSearchResultType } from "../domain/types";
import type {
  OrganizationSearchRepository,
  OrganizationSearchRepositoryGroup,
} from "./types";

interface SearchRow {
  result_type: OrganizationSearchResultType;
  id: string;
  tenant_id: string;
  organization_id: string | null;
  parent_id: string | null;
  title: string;
  subtitle: string | null;
  lifecycle_status: string;
  created_at: Date;
  updated_at: Date;
  matched_fields: string[];
}

const SEARCHABLE_RESULT_TYPES: OrganizationSearchResultType[] = [
  "organizations",
  "legalProfiles",
  "locations",
  "weeklyOpeningHours",
  "openingHourExceptions",
  "businessUnits",
  "memberships",
  "referenceValues",
  "brandingLogoReferences",
];

const ORDER_BY: Record<string, string> = {
  name: "title",
  updatedAt: "updated_at",
  createdAt: "created_at",
  resultType: "result_type",
};

function toRecord(row: SearchRow): OrganizationSearchRecord {
  return {
    resultType: row.result_type,
    id: row.id,
    tenantId: row.tenant_id,
    organizationId: row.organization_id,
    parentId: row.parent_id,
    title: row.title,
    subtitle: row.subtitle,
    lifecycleStatus: row.lifecycle_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    matchedFields: row.matched_fields ?? [],
  };
}

function buildTextPredicate(alias: string, fields: string[], q: string | undefined, values: unknown[]): string {
  if (!q) return "TRUE";
  values.push(`%${q.trim().toLowerCase()}%`);
  const parameter = `$${values.length}`;
  return fields.map((field) => `LOWER(COALESCE(${alias}.${field}::TEXT, '')) LIKE ${parameter}`).join(" OR ");
}

export function createPostgresOrganizationSearchRepository(dbPool: Pool): OrganizationSearchRepository {
  async function queryType(
    input: Parameters<OrganizationSearchRepository["search"]>[0],
    resultType: OrganizationSearchResultType,
  ): Promise<OrganizationSearchRepositoryGroup> {
    const values: unknown[] = [input.tenantId, input.lifecycleStatus];
    const organizationFilter = input.organizationId
      ? (() => {
          values.push(input.organizationId);
          return `AND organization_id = $${values.length}`;
        })()
      : "";
    const orderBy = ORDER_BY[input.orderBy] ?? "updated_at";
    const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";

    const queryFor = (() => {
      switch (resultType) {
        case "organizations": {
          const predicate = buildTextPredicate("o", ["name", "normalized_name"], input.q, values);
          return `
            SELECT
              'organizations'::text AS result_type,
              o.organization_id::text AS id,
              o.tenant_id::text AS tenant_id,
              o.organization_id::text AS organization_id,
              o.parent_organization_id::text AS parent_id,
              o.name AS title,
              NULL::text AS subtitle,
              o.lifecycle_status,
              o.created_at,
              o.updated_at,
              ARRAY['name']::text[] AS matched_fields
            FROM organization o
            WHERE o.tenant_id = $1
              AND o.lifecycle_status = $2
              AND o.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "o.organization_id")}
              AND (${predicate})
          `;
        }
        case "legalProfiles": {
          const predicate = buildTextPredicate("p", ["legal_name", "registration_identifier", "tax_vat_number", "registered_address"], input.q, values);
          return `
            SELECT
              'legalProfiles'::text AS result_type,
              p.organization_legal_profile_id::text AS id,
              p.tenant_id::text AS tenant_id,
              p.organization_id::text AS organization_id,
              NULL::text AS parent_id,
              p.legal_name AS title,
              p.registration_identifier AS subtitle,
              p.lifecycle_status,
              p.created_at,
              p.updated_at,
              ARRAY['legalName', 'registrationIdentifier', 'taxVatNumber', 'registeredAddress']::text[] AS matched_fields
            FROM organization_legal_profile p
            WHERE p.tenant_id = $1
              AND p.lifecycle_status = $2
              AND p.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "p.organization_id")}
              AND (${predicate})
          `;
        }
        case "locations": {
          const predicate = buildTextPredicate("l", ["location_name", "address_summary"], input.q, values);
          return `
            SELECT
              'locations'::text AS result_type,
              l.organization_location_id::text AS id,
              l.tenant_id::text AS tenant_id,
              l.organization_id::text AS organization_id,
              NULL::text AS parent_id,
              l.location_name AS title,
              l.address_summary AS subtitle,
              l.lifecycle_status,
              l.created_at,
              l.updated_at,
              ARRAY['locationName', 'addressSummary']::text[] AS matched_fields
            FROM organization_location l
            WHERE l.tenant_id = $1
              AND l.lifecycle_status = $2
              AND l.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "l.organization_id")}
              AND (${predicate})
          `;
        }
        case "weeklyOpeningHours": {
          const predicate = input.q ? "FALSE" : "TRUE";
          return `
            SELECT
              'weeklyOpeningHours'::text AS result_type,
              h.organization_weekly_opening_hours_id::text AS id,
              h.tenant_id::text AS tenant_id,
              h.organization_id::text AS organization_id,
              h.organization_location_id::text AS parent_id,
              ('weekday ' || h.weekday || ' slot ' || h.slot_order) AS title,
              (h.opens_at_local_time::text || '-' || h.closes_at_local_time::text) AS subtitle,
              h.lifecycle_status,
              h.created_at,
              h.updated_at,
              ARRAY['weekday', 'slot']::text[] AS matched_fields
            FROM organization_location_weekly_opening_hours h
            WHERE h.tenant_id = $1
              AND h.lifecycle_status = CASE WHEN $2 = 'active' THEN 'active' ELSE 'deleted' END
              AND h.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "h.organization_id")}
              AND (${predicate})
          `;
        }
        case "openingHourExceptions": {
          const predicate = buildTextPredicate("e", ["exception_type", "reason"], input.q, values);
          return `
            SELECT
              'openingHourExceptions'::text AS result_type,
              e.organization_opening_hours_exception_id::text AS id,
              e.tenant_id::text AS tenant_id,
              e.organization_id::text AS organization_id,
              e.organization_location_id::text AS parent_id,
              e.exception_type AS title,
              e.reason AS subtitle,
              e.lifecycle_status,
              e.created_at,
              e.updated_at,
              ARRAY['exceptionType', 'reason']::text[] AS matched_fields
            FROM organization_opening_hours_exception e
            WHERE e.tenant_id = $1
              AND e.lifecycle_status = CASE WHEN $2 = 'active' THEN 'active' ELSE 'deleted' END
              AND e.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "e.organization_id")}
              AND (${predicate})
          `;
        }
        case "businessUnits": {
          const predicate = buildTextPredicate("b", ["name", "normalized_name"], input.q, values);
          return `
            SELECT
              'businessUnits'::text AS result_type,
              b.organization_business_unit_id::text AS id,
              b.tenant_id::text AS tenant_id,
              b.organization_id::text AS organization_id,
              b.parent_business_unit_id::text AS parent_id,
              b.name AS title,
              NULL::text AS subtitle,
              b.lifecycle_status,
              b.created_at,
              b.updated_at,
              ARRAY['name']::text[] AS matched_fields
            FROM organization_business_unit b
            WHERE b.tenant_id = $1
              AND b.lifecycle_status = $2
              AND b.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "b.organization_id")}
              AND (${predicate})
          `;
        }
        case "memberships": {
          const predicate = buildTextPredicate("m", ["member_type", "membership_role"], input.q, values);
          return `
            SELECT
              'memberships'::text AS result_type,
              m.organization_business_unit_membership_id::text AS id,
              m.tenant_id::text AS tenant_id,
              m.organization_id::text AS organization_id,
              m.business_unit_id::text AS parent_id,
              (m.member_type || ':' || m.membership_role) AS title,
              COALESCE(m.individual_user_id::text, m.member_business_unit_id::text) AS subtitle,
              m.lifecycle_status,
              m.created_at,
              m.updated_at,
              ARRAY['memberType', 'membershipRole']::text[] AS matched_fields
            FROM organization_business_unit_membership m
            WHERE m.tenant_id = $1
              AND m.lifecycle_status = $2
              AND m.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "m.organization_id")}
              AND (${predicate})
          `;
        }
        case "referenceValues": {
          const predicate = buildTextPredicate("r", ["reference_type", "reference_value_key", "label"], input.q, values);
          return `
            SELECT
              'referenceValues'::text AS result_type,
              r.organization_reference_value_id::text AS id,
              $1::text AS tenant_id,
              NULL::text AS organization_id,
              NULL::text AS parent_id,
              r.label AS title,
              (r.reference_type || ':' || r.reference_value_key) AS subtitle,
              r.lifecycle_status,
              r.created_at,
              r.updated_at,
              ARRAY['referenceType', 'referenceValueKey', 'label']::text[] AS matched_fields
            FROM organization_reference_value r
            WHERE r.lifecycle_status = $2
              AND (${predicate})
          `;
        }
        case "brandingLogoReferences": {
          const predicate = buildTextPredicate("l", ["logo_type", "alt_text", "public_readiness_status"], input.q, values);
          return `
            SELECT
              'brandingLogoReferences'::text AS result_type,
              l.organization_logo_relationship_id::text AS id,
              l.tenant_id::text AS tenant_id,
              l.organization_id::text AS organization_id,
              l.asset_id::text AS parent_id,
              l.logo_type AS title,
              l.alt_text AS subtitle,
              CASE WHEN l.public_readiness_status = 'ready' THEN 'active' ELSE 'archived' END AS lifecycle_status,
              l.created_at,
              l.updated_at,
              ARRAY['logoType', 'altText', 'publicReadinessStatus']::text[] AS matched_fields
            FROM organization_logo_relationship l
            WHERE l.tenant_id = $1
              AND CASE WHEN l.public_readiness_status = 'ready' THEN 'active' ELSE 'archived' END = $2
              AND l.deleted_at IS NULL
              ${organizationFilter.replace("organization_id", "l.organization_id")}
              AND (${predicate})
          `;
        }
        default:
          return "";
      }
    })();

    const total = await dbPool.query<{ total_matching_records: string }>(
      `SELECT COUNT(*) AS total_matching_records FROM (${queryFor}) s`,
      values,
    );
    values.push(input.pageSize);
    values.push((input.page - 1) * input.pageSize);
    const rows = await dbPool.query<SearchRow>(
      `
        SELECT *
        FROM (${queryFor}) s
        ORDER BY ${orderBy} ${orderDirection}, id ASC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values,
    );
    return {
      resultType,
      items: rows.rows.map(toRecord),
      totalMatchingRecords: Number(total.rows[0]?.total_matching_records ?? 0),
    };
  }

  return {
    async search(input) {
      const resultTypes = input.resultType ? [input.resultType] : SEARCHABLE_RESULT_TYPES;
      return Promise.all(resultTypes.map((resultType) => queryType(input, resultType)));
    },
  };
}
