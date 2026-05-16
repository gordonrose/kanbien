export type BusinessUnitLifecycleStatus = "active" | "archived";
export type BusinessUnitActorType = "root-user" | "tenant-admin";
export type CountValue = number | "10000+";

export interface BusinessUnitActorInput {
  actorType: BusinessUnitActorType;
  actorId: string;
}

export interface OrganizationBusinessUnit {
  businessUnitId: string;
  tenantId: string;
  organizationId: string;
  parentBusinessUnitId: string | null;
  childBusinessUnitIds: string[];
  name: string;
  lifecycleStatus: BusinessUnitLifecycleStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrganizationBusinessUnitData extends Omit<OrganizationBusinessUnit, "createdAt" | "updatedAt" | "archivedAt" | "deletedAt" | "childBusinessUnitIds"> {
  normalizedName: string;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BusinessUnitIdentityInput {
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
}

export interface CreateBusinessUnitInput extends BusinessUnitActorInput {
  tenantId: string;
  organizationId: string;
  parentBusinessUnitId?: string | null;
  name: string;
}

export interface ListBusinessUnitsInput {
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

export interface BusinessUnitListResult {
  items: OrganizationBusinessUnit[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface UpdateBusinessUnitInput extends BusinessUnitActorInput, BusinessUnitIdentityInput {
  name?: string;
}

export interface MoveBusinessUnitInput extends BusinessUnitActorInput, BusinessUnitIdentityInput {
  parentBusinessUnitId: string | null;
}

export interface ArchiveBusinessUnitInput extends BusinessUnitActorInput, BusinessUnitIdentityInput {
  childHandling: "archiveBranch" | "moveChildren";
  replacementParentBusinessUnitId?: string | null;
}

export interface RestoreBusinessUnitInput extends BusinessUnitActorInput, BusinessUnitIdentityInput {}
export interface DeleteBusinessUnitInput extends BusinessUnitActorInput, BusinessUnitIdentityInput {}

export interface BusinessUnitAuditEventInput {
  eventId: string;
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
  actorType: BusinessUnitActorType;
  actorId: string;
  eventType: string;
  eventOutcome: "success";
  eventDetails?: Record<string, unknown>;
  occurredAt: Date;
}
