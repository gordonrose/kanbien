import type { OrganizationLegalProfileData } from "../domain/types";
import type {
  CreateLegalProfileRecordInput,
  LegalProfileAuditEventInput,
  LegalProfileRepositoryListInput,
  LegalProfileRepositoryListResult,
  UpdateLegalProfileRecordInput,
} from "./types";

export interface OrganizationLegalDetailsRepository {
  create(input: CreateLegalProfileRecordInput): Promise<OrganizationLegalProfileData>;
  findActiveByOrganization(tenantId: string, organizationId: string): Promise<OrganizationLegalProfileData | null>;
  findVisibleById(
    tenantId: string,
    organizationId: string,
    legalProfileId: string,
  ): Promise<OrganizationLegalProfileData | null>;
  findNonDeletedById(
    tenantId: string,
    organizationId: string,
    legalProfileId: string,
  ): Promise<OrganizationLegalProfileData | null>;
  list(input: LegalProfileRepositoryListInput): Promise<LegalProfileRepositoryListResult>;
  update(input: UpdateLegalProfileRecordInput): Promise<OrganizationLegalProfileData | null>;
  archive(tenantId: string, organizationId: string, legalProfileId: string): Promise<OrganizationLegalProfileData | null>;
  restore(tenantId: string, organizationId: string, legalProfileId: string): Promise<OrganizationLegalProfileData | null>;
  softDelete(tenantId: string, organizationId: string, legalProfileId: string): Promise<OrganizationLegalProfileData | null>;
  recordAuditEvent(input: LegalProfileAuditEventInput): Promise<void>;
}
