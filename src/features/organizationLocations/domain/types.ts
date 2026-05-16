export type LocationLifecycleStatus = "active" | "archived";
export type LocationActorType = "root-user" | "tenant-admin";
export type CountValue = number | "10000+";

export interface OrganizationLocation {
  locationId: string;
  tenantId: string;
  organizationId: string;
  locationName: string;
  addressSummary: string | null;
  latitude: number | null;
  longitude: number | null;
  isHeadOffice: boolean;
  isRegisteredOffice: boolean;
  lifecycleStatus: LocationLifecycleStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrganizationLocationData {
  locationId: string;
  tenantId: string;
  organizationId: string;
  locationName: string;
  addressSummary: string | null;
  latitude: number | null;
  longitude: number | null;
  isHeadOffice: boolean;
  isRegisteredOffice: boolean;
  lifecycleStatus: LocationLifecycleStatus;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface LocationActorInput {
  actorType: LocationActorType;
  actorId: string;
}

export interface ListLocationsInput {
  tenantId: string;
  organizationId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: LocationLifecycleStatus;
}

export interface LocationListResult {
  items: OrganizationLocation[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface CreateLocationInput extends LocationActorInput {
  tenantId: string;
  organizationId: string;
  locationName: string;
  addressSummary?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isHeadOffice: boolean;
  isRegisteredOffice: boolean;
}

export interface GetLocationInput {
  tenantId: string;
  organizationId: string;
  locationId: string;
}

export interface UpdateLocationInput extends LocationActorInput, GetLocationInput {
  locationName?: string;
  addressSummary?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isHeadOffice?: boolean;
  isRegisteredOffice?: boolean;
}

export interface LifecycleLocationInput extends LocationActorInput, GetLocationInput {}

export interface LocationExportProjectionInput {
  tenantId: string;
  organizationId: string;
  includeArchived: boolean;
}
