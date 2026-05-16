import type {
  BusinessUnitMembershipLifecycleStatus,
  MembershipAuditEventInput,
  OrganizationBusinessUnitMembershipData,
} from "../domain/types";

export interface MembershipRepositoryListInput {
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  includeArchived: boolean;
  lifecycleStatus?: BusinessUnitMembershipLifecycleStatus;
}

export interface MembershipRepositoryListResult {
  items: OrganizationBusinessUnitMembershipData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface CreateMembershipRecordInput {
  membershipId: string;
  tenantId: string;
  organizationId: string;
  businessUnitId: string;
  memberType: "individual" | "business_unit";
  individualUserId: string | null;
  memberBusinessUnitId: string | null;
  membershipRole: "owner" | "manager" | "member" | "viewer";
}

export interface UpdateMembershipRecordInput extends Omit<CreateMembershipRecordInput, "membershipId"> {
  membershipId: string;
}

export interface OrganizationBusinessUnitMembershipsRepository {
  create(input: CreateMembershipRecordInput): Promise<OrganizationBusinessUnitMembershipData>;
  findActiveById(tenantId: string, organizationId: string, businessUnitId: string, membershipId: string): Promise<OrganizationBusinessUnitMembershipData | null>;
  list(input: MembershipRepositoryListInput): Promise<MembershipRepositoryListResult>;
  listForOrganization(input: Omit<MembershipRepositoryListInput, "businessUnitId">): Promise<MembershipRepositoryListResult>;
  update(input: UpdateMembershipRecordInput): Promise<OrganizationBusinessUnitMembershipData | null>;
  archive(tenantId: string, organizationId: string, businessUnitId: string, membershipId: string): Promise<OrganizationBusinessUnitMembershipData | null>;
  restore(tenantId: string, organizationId: string, businessUnitId: string, membershipId: string): Promise<OrganizationBusinessUnitMembershipData | null>;
  softDelete(tenantId: string, organizationId: string, businessUnitId: string, membershipId: string): Promise<OrganizationBusinessUnitMembershipData | null>;
  recordAuditEvent(input: MembershipAuditEventInput): Promise<void>;
}
