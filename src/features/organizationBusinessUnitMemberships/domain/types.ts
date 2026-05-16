export type BusinessUnitMembershipActorType = "root-user" | "tenant-admin";
export type BusinessUnitMembershipLifecycleStatus = "active" | "archived";
export type BusinessUnitMembershipMemberType = "individual" | "business_unit";
export type BusinessUnitMembershipRole = "owner" | "manager" | "member" | "viewer";
export type CountValue = number | "10000+";

export interface BusinessUnitMembershipActorInput {
  actorType: BusinessUnitMembershipActorType;
  actorId: string;
}

export interface OrganizationBusinessUnitMembership {
  membershipId: string;
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
  memberType: BusinessUnitMembershipMemberType;
  individualUserId: string | null;
  memberBusinessUnitId: string | null;
  membershipRole: BusinessUnitMembershipRole;
  lifecycleStatus: BusinessUnitMembershipLifecycleStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrganizationBusinessUnitMembershipData extends Omit<OrganizationBusinessUnitMembership, "createdAt" | "updatedAt" | "archivedAt" | "deletedAt"> {
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MembershipUnitInput {
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
}

export interface MembershipIdentityInput extends MembershipUnitInput {
  membershipId: string;
}

export interface ListMembershipsInput extends MembershipUnitInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: BusinessUnitMembershipLifecycleStatus;
}

export interface MembershipListResult {
  items: OrganizationBusinessUnitMembership[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface CreateMembershipInput extends BusinessUnitMembershipActorInput, MembershipUnitInput {
  memberType: BusinessUnitMembershipMemberType;
  individualUserId?: string | null;
  memberBusinessUnitId?: string | null;
  membershipRole: BusinessUnitMembershipRole;
}

export interface UpdateMembershipInput extends BusinessUnitMembershipActorInput, MembershipIdentityInput {
  memberType?: BusinessUnitMembershipMemberType;
  individualUserId?: string | null;
  memberBusinessUnitId?: string | null;
  membershipRole?: BusinessUnitMembershipRole;
}

export interface ArchiveMembershipInput extends BusinessUnitMembershipActorInput, MembershipIdentityInput {}
export interface RestoreMembershipInput extends BusinessUnitMembershipActorInput, MembershipIdentityInput {}
export interface DeleteMembershipInput extends BusinessUnitMembershipActorInput, MembershipIdentityInput {}

export interface MembershipAuditEventInput {
  eventId: string;
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
  membershipId: string;
  actorType: BusinessUnitMembershipActorType;
  actorId: string;
  eventType: string;
  eventOutcome: "success";
  eventDetails?: Record<string, unknown>;
  occurredAt: Date;
}
