import type { OrganizationBusinessUnit, OrganizationBusinessUnitData } from "./types";

export function toBusinessUnit(
  data: OrganizationBusinessUnitData,
  childBusinessUnitIds: string[],
): OrganizationBusinessUnit {
  return {
    businessUnitId: data.businessUnitId,
    tenantId: data.tenantId,
    organizationId: data.organizationId,
    parentBusinessUnitId: data.parentBusinessUnitId,
    childBusinessUnitIds,
    name: data.name,
    lifecycleStatus: data.lifecycleStatus,
    archivedAt: data.archivedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: data.deletedAt?.toISOString() ?? null,
  };
}
