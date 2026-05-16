import type { OrganizationBusinessUnitMembership, OrganizationBusinessUnitMembershipData } from "./types";

export function toMembership(data: OrganizationBusinessUnitMembershipData): OrganizationBusinessUnitMembership {
  return {
    membershipId: data.membershipId,
    tenantId: data.tenantId,
    organizationId: data.organizationId,
    businessUnitId: data.businessUnitId,
    memberType: data.memberType,
    individualUserId: data.individualUserId,
    memberBusinessUnitId: data.memberBusinessUnitId,
    membershipRole: data.membershipRole,
    lifecycleStatus: data.lifecycleStatus,
    archivedAt: data.archivedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: data.deletedAt?.toISOString() ?? null,
  };
}
