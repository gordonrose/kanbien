import type {
  LegalProfileActorType,
  LegalProfileLifecycleStatus,
  OrganizationLegalProfileData,
} from "../domain/types";

export interface OrganizationLegalProfileRecord {
  organization_legal_profile_id: string;
  tenant_id: string;
  organization_id: string;
  legal_name: string;
  registration_identifier: string | null;
  tax_vat_number: string | null;
  registered_address: string | null;
  lifecycle_status: LegalProfileLifecycleStatus;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateLegalProfileRecordInput {
  legalProfileId: string;
  tenantId: string;
  organizationId: string;
  legalName: string;
  registrationIdentifier: string | null;
  taxVatNumber: string | null;
  registeredAddress: string | null;
}

export interface UpdateLegalProfileRecordInput {
  tenantId: string;
  organizationId: string;
  legalProfileId: string;
  legalName?: string;
  registrationIdentifier?: string | null;
  taxVatNumber?: string | null;
  registeredAddress?: string | null;
}

export interface LegalProfileRepositoryListInput {
  tenantId: string;
  organizationId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: LegalProfileLifecycleStatus;
}

export interface LegalProfileRepositoryListResult {
  items: OrganizationLegalProfileData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface LegalProfileAuditEventInput {
  eventId: string;
  tenantId: string;
  organizationId: string;
  legalProfileId: string | null;
  actorType: LegalProfileActorType;
  actorId: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  eventDetails?: Record<string, unknown>;
  occurredAt: Date;
}
