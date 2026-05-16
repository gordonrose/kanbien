export type OrganizationLifecycleStatus = "active" | "archived";
export type OrganizationActorType = "root-user" | "tenant-admin";
export type CountValue = number | "10000+";

export interface Organization {
  organizationId: string;
  tenantId: string;
  parentOrganizationId: string | null;
  name: string;
  organizationTypeReferenceValueId: string | null;
  lifecycleStatus: OrganizationLifecycleStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrganizationListItem extends Organization {}

export interface OrganizationData {
  organizationId: string;
  tenantId: string;
  parentOrganizationId: string | null;
  name: string;
  normalizedName: string;
  organizationTypeReferenceValueId: string | null;
  lifecycleStatus: OrganizationLifecycleStatus;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationListFilters {
  namePrefix?: string;
  parentOrganizationId?: string | null;
  lifecycleStatus?: OrganizationLifecycleStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
}

export interface OrganizationListInput {
  tenantId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: OrganizationListFilters;
}

export interface OrganizationListResult {
  items: OrganizationListItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface OrganizationActorInput {
  actorType: OrganizationActorType;
  actorId: string;
}

export interface CreateOrganizationInput extends OrganizationActorInput {
  tenantId: string;
  parentOrganizationId?: string | null;
  name: string;
  organizationTypeReferenceValueId?: string | null;
}

export interface GetOrganizationInput {
  tenantId: string;
  organizationId: string;
}

export interface UpdateOrganizationInput extends OrganizationActorInput {
  tenantId: string;
  organizationId: string;
  name?: string;
  organizationTypeReferenceValueId?: string | null;
}

export interface MoveOrganizationInput extends OrganizationActorInput {
  tenantId: string;
  organizationId: string;
  parentOrganizationId: string | null;
}

export interface ArchiveOrganizationInput extends OrganizationActorInput {
  tenantId: string;
  organizationId: string;
  childHandling: "archiveBranch" | "moveChildren";
  replacementParentOrganizationId?: string | null;
}

export interface RestoreOrganizationInput extends OrganizationActorInput {
  tenantId: string;
  organizationId: string;
}

export interface SoftDeleteOrganizationInput extends OrganizationActorInput {
  tenantId: string;
  organizationId: string;
}
