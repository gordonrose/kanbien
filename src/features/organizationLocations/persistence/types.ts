import type {
  LocationActorType,
  LocationLifecycleStatus,
  OrganizationLocationData,
} from "../domain/types";

export interface OrganizationLocationRecord {
  organization_location_id: string;
  tenant_id: string;
  organization_id: string;
  location_name: string;
  address_summary: string | null;
  latitude: number | null;
  longitude: number | null;
  is_head_office: boolean;
  is_registered_office: boolean;
  lifecycle_status: LocationLifecycleStatus;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateLocationRecordInput {
  locationId: string;
  tenantId: string;
  organizationId: string;
  locationName: string;
  addressSummary: string | null;
  latitude: number | null;
  longitude: number | null;
  isHeadOffice: boolean;
  isRegisteredOffice: boolean;
}

export interface UpdateLocationRecordInput {
  tenantId: string;
  organizationId: string;
  locationId: string;
  locationName?: string;
  addressSummary?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isHeadOffice?: boolean;
  isRegisteredOffice?: boolean;
}

export interface LocationRepositoryListInput {
  tenantId: string;
  organizationId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: LocationLifecycleStatus;
}

export interface LocationRepositoryListResult {
  items: OrganizationLocationData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface LocationAuditEventInput {
  eventId: string;
  tenantId: string;
  organizationId: string;
  locationId: string | null;
  actorType: LocationActorType;
  actorId: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  eventDetails?: Record<string, unknown>;
  occurredAt: Date;
}
