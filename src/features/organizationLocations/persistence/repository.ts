import type { OrganizationLocationData } from "../domain/types";
import type {
  CreateLocationRecordInput,
  LocationAuditEventInput,
  LocationRepositoryListInput,
  LocationRepositoryListResult,
  UpdateLocationRecordInput,
} from "./types";

export interface OrganizationLocationsRepository {
  create(input: CreateLocationRecordInput): Promise<OrganizationLocationData>;
  findVisibleById(
    tenantId: string,
    organizationId: string,
    locationId: string,
  ): Promise<OrganizationLocationData | null>;
  findNonDeletedById(
    tenantId: string,
    organizationId: string,
    locationId: string,
  ): Promise<OrganizationLocationData | null>;
  list(input: LocationRepositoryListInput): Promise<LocationRepositoryListResult>;
  update(input: UpdateLocationRecordInput): Promise<OrganizationLocationData | null>;
  archive(tenantId: string, organizationId: string, locationId: string): Promise<OrganizationLocationData | null>;
  restore(tenantId: string, organizationId: string, locationId: string): Promise<OrganizationLocationData | null>;
  softDelete(tenantId: string, organizationId: string, locationId: string): Promise<OrganizationLocationData | null>;
  recordAuditEvent(input: LocationAuditEventInput): Promise<void>;
}
