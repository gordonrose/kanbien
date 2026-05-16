import { randomUUID } from "node:crypto";
import type { OrganizationBusinessUnitsService } from "../../organizationBusinessUnits";
import { BusinessUnitMembershipNotFoundError, IndividualMembershipDeferredError, InvalidBusinessUnitMembershipRequestError } from "../contract/errors";
import type { OrganizationBusinessUnitMembershipsRepository } from "../persistence/types";
import { toMembership } from "./presenters";
import type {
  ArchiveMembershipInput,
  CreateMembershipInput,
  DeleteMembershipInput,
  ListMembershipsInput,
  MembershipListResult,
  RestoreMembershipInput,
  UpdateMembershipInput,
} from "./types";

export interface OrganizationBusinessUnitMembershipsService {
  createMembership(input: CreateMembershipInput): Promise<ReturnType<typeof toMembership>>;
  listMemberships(input: ListMembershipsInput): Promise<MembershipListResult>;
  listMembershipsForExport(input: Omit<ListMembershipsInput, "businessUnitId">): Promise<MembershipListResult>;
  updateMembership(input: UpdateMembershipInput): Promise<ReturnType<typeof toMembership>>;
  archiveMembership(input: ArchiveMembershipInput): Promise<ReturnType<typeof toMembership>>;
  restoreMembership(input: RestoreMembershipInput): Promise<ReturnType<typeof toMembership>>;
  softDeleteMembership(input: DeleteMembershipInput): Promise<ReturnType<typeof toMembership>>;
}

async function recordAudit(
  repository: OrganizationBusinessUnitMembershipsRepository,
  input: {
    tenantId: string;
    organizationId: string;
    businessUnitId: string;
    membershipId: string;
    actorType: "root-user" | "tenant-admin";
    actorId: string;
    eventType: string;
    eventDetails?: Record<string, unknown>;
  },
): Promise<void> {
  await repository.recordAuditEvent({
    eventId: randomUUID(),
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    businessUnitId: input.businessUnitId,
    membershipId: input.membershipId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: "success",
    eventDetails: input.eventDetails ?? {},
    occurredAt: new Date(),
  });
}

async function validateTarget(
  businessUnitsService: OrganizationBusinessUnitsService,
  input: {
    tenantId: string;
    organizationId: string;
    businessUnitId: string;
    memberType: "individual" | "business_unit";
    individualUserId?: string | null;
    memberBusinessUnitId?: string | null;
  },
): Promise<{ individualUserId: string | null; memberBusinessUnitId: string | null }> {
  await businessUnitsService.assertActiveBusinessUnit(input);
  if (input.memberType === "individual") {
    throw new IndividualMembershipDeferredError();
  }
  if (input.individualUserId) {
    throw new InvalidBusinessUnitMembershipRequestError("Business-unit members cannot include individualUserId.", {
      field: "individualUserId",
      reason: "wrong_target_type",
    });
  }
  if (!input.memberBusinessUnitId) {
    throw new InvalidBusinessUnitMembershipRequestError("memberBusinessUnitId is required for business-unit members.", {
      field: "memberBusinessUnitId",
      reason: "required",
    });
  }
  if (input.memberBusinessUnitId === input.businessUnitId) {
    throw new InvalidBusinessUnitMembershipRequestError("A business unit cannot be a member of itself.", {
      field: "memberBusinessUnitId",
      reason: "self_membership",
    });
  }
  await businessUnitsService.assertActiveBusinessUnit({
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    businessUnitId: input.memberBusinessUnitId,
  });
  return { individualUserId: null, memberBusinessUnitId: input.memberBusinessUnitId };
}

export function createOrganizationBusinessUnitMembershipsService(
  repository: OrganizationBusinessUnitMembershipsRepository,
  businessUnitsService: OrganizationBusinessUnitsService,
): OrganizationBusinessUnitMembershipsService {
  return {
    async createMembership(input) {
      const target = await validateTarget(businessUnitsService, input);
      const record = await repository.create({
        membershipId: randomUUID(),
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        businessUnitId: input.businessUnitId,
        memberType: input.memberType,
        ...target,
        membershipRole: input.membershipRole,
      });
      await recordAudit(repository, { ...input, membershipId: record.membershipId, eventType: "organization_business_unit_membership_created" });
      return toMembership(record);
    },
    async listMemberships(input) {
      await businessUnitsService.assertActiveBusinessUnit(input);
      const result = await repository.list(input);
      return {
        items: result.items.map(toMembership),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalMatchingRecords: result.totalMatchingRecords,
        totalSearchableRecords: result.totalSearchableRecords,
      };
    },
    async listMembershipsForExport(input) {
      const result = await repository.listForOrganization(input);
      return {
        items: result.items.map(toMembership),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalMatchingRecords: result.totalMatchingRecords,
        totalSearchableRecords: result.totalSearchableRecords,
      };
    },
    async updateMembership(input) {
      const existing = await repository.findActiveById(input.tenantId, input.organizationId, input.businessUnitId, input.membershipId);
      if (!existing) throw new BusinessUnitMembershipNotFoundError();
      const next = {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        businessUnitId: input.businessUnitId,
        memberType: input.memberType ?? existing.memberType,
        individualUserId: input.individualUserId === undefined ? existing.individualUserId : input.individualUserId,
        memberBusinessUnitId: input.memberBusinessUnitId === undefined ? existing.memberBusinessUnitId : input.memberBusinessUnitId,
      };
      const target = await validateTarget(businessUnitsService, next);
      const record = await repository.update({
        membershipId: input.membershipId,
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        businessUnitId: input.businessUnitId,
        memberType: next.memberType,
        ...target,
        membershipRole: input.membershipRole ?? existing.membershipRole,
      });
      if (!record) throw new BusinessUnitMembershipNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_membership_updated" });
      return toMembership(record);
    },
    async archiveMembership(input) {
      const record = await repository.archive(input.tenantId, input.organizationId, input.businessUnitId, input.membershipId);
      if (!record) throw new BusinessUnitMembershipNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_membership_archived" });
      return toMembership(record);
    },
    async restoreMembership(input) {
      const record = await repository.restore(input.tenantId, input.organizationId, input.businessUnitId, input.membershipId);
      if (!record) throw new BusinessUnitMembershipNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_membership_restored" });
      return toMembership(record);
    },
    async softDeleteMembership(input) {
      const record = await repository.softDelete(input.tenantId, input.organizationId, input.businessUnitId, input.membershipId);
      if (!record) throw new BusinessUnitMembershipNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_membership_deleted" });
      return toMembership(record);
    },
  };
}
