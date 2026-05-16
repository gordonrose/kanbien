export type LegalProfileLifecycleStatus = "active" | "archived";
export type LegalProfileActorType = "root-user" | "tenant-admin";
export type CountValue = number | "10000+";

export interface OrganizationLegalProfile {
  legalProfileId: string;
  tenantId: string;
  organizationId: string;
  legalName: string;
  registrationIdentifier: string | null;
  taxVatNumber: string | null;
  registeredAddress: string | null;
  lifecycleStatus: LegalProfileLifecycleStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrganizationLegalProfileData {
  legalProfileId: string;
  tenantId: string;
  organizationId: string;
  legalName: string;
  registrationIdentifier: string | null;
  taxVatNumber: string | null;
  registeredAddress: string | null;
  lifecycleStatus: LegalProfileLifecycleStatus;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface LegalProfileActorInput {
  actorType: LegalProfileActorType;
  actorId: string;
}

export interface ListLegalProfilesInput {
  tenantId: string;
  organizationId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: LegalProfileLifecycleStatus;
}

export interface LegalProfileListResult {
  items: OrganizationLegalProfile[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface CreateLegalProfileInput extends LegalProfileActorInput {
  tenantId: string;
  organizationId: string;
  legalName: string;
  registrationIdentifier?: string | null;
  taxVatNumber?: string | null;
  registeredAddress?: string | null;
}

export interface GetLegalProfileInput {
  tenantId: string;
  organizationId: string;
  legalProfileId: string;
}

export interface UpdateLegalProfileInput extends LegalProfileActorInput, GetLegalProfileInput {
  legalName?: string;
  registrationIdentifier?: string | null;
  taxVatNumber?: string | null;
  registeredAddress?: string | null;
}

export interface LifecycleLegalProfileInput extends LegalProfileActorInput, GetLegalProfileInput {}

export interface LegalProfileExportProjectionInput {
  tenantId: string;
  organizationId: string;
  includeArchived: boolean;
}
