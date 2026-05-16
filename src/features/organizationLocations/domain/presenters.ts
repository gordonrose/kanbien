import type { OrganizationLocation, OrganizationLocationData } from "./types";

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function toLocation(data: OrganizationLocationData): OrganizationLocation {
  return {
    locationId: data.locationId,
    tenantId: data.tenantId,
    organizationId: data.organizationId,
    locationName: data.locationName,
    addressSummary: data.addressSummary,
    latitude: data.latitude,
    longitude: data.longitude,
    isHeadOffice: data.isHeadOffice,
    isRegisteredOffice: data.isRegisteredOffice,
    lifecycleStatus: data.lifecycleStatus,
    archivedAt: toIso(data.archivedAt),
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: toIso(data.deletedAt),
  };
}
