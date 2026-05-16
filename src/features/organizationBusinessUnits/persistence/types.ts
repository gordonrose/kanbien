import type { OrganizationBusinessUnitData, BusinessUnitAuditEventInput, BusinessUnitLifecycleStatus } from "../domain/types";

export interface BusinessUnitRepositoryListInput {
  tenantId: string;
  organizationId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: BusinessUnitLifecycleStatus;
  parentBusinessUnitId?: string | null;
}

export interface BusinessUnitRepositoryListResult {
  items: OrganizationBusinessUnitData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface CreateBusinessUnitRecordInput {
  businessUnitId: string;
  tenantId: string;
  organizationId: string;
  parentBusinessUnitId: string | null;
  name: string;
}

export interface UpdateBusinessUnitRecordInput {
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
  name?: string;
}

export interface OrganizationBusinessUnitsRepository {
  create(input: CreateBusinessUnitRecordInput): Promise<OrganizationBusinessUnitData>;
  findActiveById(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData | null>;
  findNonDeletedById(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData | null>;
  list(input: BusinessUnitRepositoryListInput): Promise<BusinessUnitRepositoryListResult>;
  update(input: UpdateBusinessUnitRecordInput): Promise<OrganizationBusinessUnitData | null>;
  move(tenantId: string, organizationId: string, businessUnitId: string, parentBusinessUnitId: string | null): Promise<OrganizationBusinessUnitData | null>;
  archive(tenantId: string, organizationId: string, businessUnitIds: string[]): Promise<OrganizationBusinessUnitData | null>;
  restore(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData | null>;
  softDelete(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData | null>;
  listActiveChildren(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData[]>;
  listNonDeletedDescendants(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData[]>;
  listActiveAncestors(tenantId: string, organizationId: string, businessUnitId: string): Promise<OrganizationBusinessUnitData[]>;
  recordAuditEvent(input: BusinessUnitAuditEventInput): Promise<void>;
}
