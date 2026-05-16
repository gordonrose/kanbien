import type { OrganizationData } from "../domain/types";
import type {
  CreateOrganizationRecordInput,
  OrganizationAuditEventInput,
  OrganizationRepositoryListInput,
  OrganizationRepositoryListResult,
  UpdateOrganizationRecordInput,
} from "./types";

export interface OrganizationCoreRepository {
  create(input: CreateOrganizationRecordInput): Promise<OrganizationData>;
  findActiveById(tenantId: string, organizationId: string): Promise<OrganizationData | null>;
  findArchivedById(tenantId: string, organizationId: string): Promise<OrganizationData | null>;
  findNonDeletedById(tenantId: string, organizationId: string): Promise<OrganizationData | null>;
  findActiveByName(tenantId: string, name: string): Promise<OrganizationData | null>;
  listActive(input: OrganizationRepositoryListInput): Promise<OrganizationRepositoryListResult>;
  update(input: UpdateOrganizationRecordInput): Promise<OrganizationData | null>;
  move(tenantId: string, organizationId: string, parentOrganizationId: string | null): Promise<OrganizationData | null>;
  archive(tenantId: string, organizationIds: string[]): Promise<OrganizationData | null>;
  restore(tenantId: string, organizationId: string): Promise<OrganizationData | null>;
  softDelete(tenantId: string, organizationId: string): Promise<OrganizationData | null>;
  listActiveChildren(tenantId: string, organizationId: string): Promise<OrganizationData[]>;
  listNonDeletedDescendants(tenantId: string, organizationId: string): Promise<OrganizationData[]>;
  recordAuditEvent(input: OrganizationAuditEventInput): Promise<void>;
}
