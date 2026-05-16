import type { OrganizationLegalProfile, OrganizationLegalProfileData } from "./types";

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function toLegalProfile(data: OrganizationLegalProfileData): OrganizationLegalProfile {
  return {
    legalProfileId: data.legalProfileId,
    tenantId: data.tenantId,
    organizationId: data.organizationId,
    legalName: data.legalName,
    registrationIdentifier: data.registrationIdentifier,
    taxVatNumber: data.taxVatNumber,
    registeredAddress: data.registeredAddress,
    lifecycleStatus: data.lifecycleStatus,
    archivedAt: toIso(data.archivedAt),
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: toIso(data.deletedAt),
  };
}
