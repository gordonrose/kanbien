import { randomUUID } from "node:crypto";
import type { OrganizationCoreService } from "../../organizationCore";
import { BusinessUnitHierarchyError, BusinessUnitNotFoundError, InvalidBusinessUnitRequestError } from "../contract/errors";
import type { OrganizationBusinessUnitsRepository } from "../persistence/types";
import { toBusinessUnit } from "./presenters";
import type {
  ArchiveBusinessUnitInput,
  BusinessUnitIdentityInput,
  BusinessUnitListResult,
  CreateBusinessUnitInput,
  DeleteBusinessUnitInput,
  ListBusinessUnitsInput,
  MoveBusinessUnitInput,
  OrganizationBusinessUnit,
  OrganizationBusinessUnitData,
  RestoreBusinessUnitInput,
  UpdateBusinessUnitInput,
} from "./types";

const MAX_DEPTH = 10;

export interface OrganizationBusinessUnitsService {
  createBusinessUnit(input: CreateBusinessUnitInput): Promise<OrganizationBusinessUnit>;
  getBusinessUnit(input: BusinessUnitIdentityInput): Promise<OrganizationBusinessUnit>;
  listBusinessUnits(input: ListBusinessUnitsInput): Promise<BusinessUnitListResult>;
  updateBusinessUnit(input: UpdateBusinessUnitInput): Promise<OrganizationBusinessUnit>;
  moveBusinessUnit(input: MoveBusinessUnitInput): Promise<OrganizationBusinessUnit>;
  archiveBusinessUnit(input: ArchiveBusinessUnitInput): Promise<OrganizationBusinessUnit>;
  restoreBusinessUnit(input: RestoreBusinessUnitInput): Promise<OrganizationBusinessUnit>;
  softDeleteBusinessUnit(input: DeleteBusinessUnitInput): Promise<OrganizationBusinessUnit>;
  assertActiveBusinessUnit(input: BusinessUnitIdentityInput): Promise<OrganizationBusinessUnit>;
}

async function requireOrganization(
  organizationCoreService: OrganizationCoreService,
  tenantId: string,
  organizationId: string,
): Promise<void> {
  await organizationCoreService.getOrganization({ tenantId, organizationId });
}

function normalizeName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new InvalidBusinessUnitRequestError("Business-unit name is required.", {
      field: "name",
      reason: "empty",
    });
  }
  return trimmed;
}

async function withChildren(
  repository: OrganizationBusinessUnitsRepository,
  data: OrganizationBusinessUnitData,
): Promise<OrganizationBusinessUnit> {
  const children = await repository.listActiveChildren(data.tenantId, data.organizationId, data.businessUnitId);
  return toBusinessUnit(data, children.map((child) => child.businessUnitId));
}

async function recordAudit(
  repository: OrganizationBusinessUnitsRepository,
  input: {
    tenantId: string;
    organizationId: string;
    businessUnitId: string;
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
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: "success",
    eventDetails: input.eventDetails ?? {},
    occurredAt: new Date(),
  });
}

async function assertParentAllowed(
  repository: OrganizationBusinessUnitsRepository,
  input: {
    tenantId: string;
    organizationId: string;
    businessUnitId?: string;
    parentBusinessUnitId: string | null;
  },
): Promise<void> {
  if (!input.parentBusinessUnitId) {
    return;
  }
  if (input.businessUnitId && input.parentBusinessUnitId === input.businessUnitId) {
    throw new BusinessUnitHierarchyError("A business unit cannot be its own parent.", {
      field: "parentBusinessUnitId",
      reason: "self_parent",
    });
  }
  const parent = await repository.findActiveById(input.tenantId, input.organizationId, input.parentBusinessUnitId);
  if (!parent) {
    throw new BusinessUnitHierarchyError("Parent business unit cannot be found in the same Organization.", {
      field: "parentBusinessUnitId",
      reason: "parent_not_found",
    });
  }
  if (input.businessUnitId) {
    const descendants = await repository.listNonDeletedDescendants(input.tenantId, input.organizationId, input.businessUnitId);
    if (descendants.some((descendant) => descendant.businessUnitId === input.parentBusinessUnitId)) {
      throw new BusinessUnitHierarchyError("A business unit cannot move under its own descendant.", {
        field: "parentBusinessUnitId",
        reason: "cycle",
      });
    }
  }
  const ancestors = await repository.listActiveAncestors(input.tenantId, input.organizationId, input.parentBusinessUnitId);
  const newDepth = ancestors.length + 2;
  if (newDepth > MAX_DEPTH) {
    throw new BusinessUnitHierarchyError("Business-unit depth cannot exceed 10.", {
      field: "parentBusinessUnitId",
      reason: "max_depth_exceeded",
      maxDepth: MAX_DEPTH,
    });
  }
}

export function createOrganizationBusinessUnitsService(
  repository: OrganizationBusinessUnitsRepository,
  organizationCoreService: OrganizationCoreService,
): OrganizationBusinessUnitsService {
  return {
    async createBusinessUnit(input) {
      await requireOrganization(organizationCoreService, input.tenantId, input.organizationId);
      await assertParentAllowed(repository, { ...input, parentBusinessUnitId: input.parentBusinessUnitId ?? null });
      const record = await repository.create({
        businessUnitId: randomUUID(),
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        parentBusinessUnitId: input.parentBusinessUnitId ?? null,
        name: normalizeName(input.name),
      });
      await recordAudit(repository, { ...input, businessUnitId: record.businessUnitId, eventType: "organization_business_unit_created" });
      return withChildren(repository, record);
    },
    async getBusinessUnit(input) {
      const record = await repository.findActiveById(input.tenantId, input.organizationId, input.businessUnitId);
      if (!record) throw new BusinessUnitNotFoundError();
      return withChildren(repository, record);
    },
    async listBusinessUnits(input) {
      await requireOrganization(organizationCoreService, input.tenantId, input.organizationId);
      const result = await repository.list(input);
      const items = await Promise.all(result.items.map((item) => withChildren(repository, item)));
      return {
        items,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalMatchingRecords: result.totalMatchingRecords,
        totalSearchableRecords: result.totalSearchableRecords,
      };
    },
    async updateBusinessUnit(input) {
      const record = await repository.update({
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        businessUnitId: input.businessUnitId,
        name: input.name === undefined ? undefined : normalizeName(input.name),
      });
      if (!record) throw new BusinessUnitNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_updated" });
      return withChildren(repository, record);
    },
    async moveBusinessUnit(input) {
      const existing = await repository.findActiveById(input.tenantId, input.organizationId, input.businessUnitId);
      if (!existing) throw new BusinessUnitNotFoundError();
      await assertParentAllowed(repository, input);
      const moved = await repository.move(input.tenantId, input.organizationId, input.businessUnitId, input.parentBusinessUnitId);
      if (!moved) throw new BusinessUnitNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_moved", eventDetails: { parentBusinessUnitId: input.parentBusinessUnitId } });
      return withChildren(repository, moved);
    },
    async archiveBusinessUnit(input) {
      const existing = await repository.findActiveById(input.tenantId, input.organizationId, input.businessUnitId);
      if (!existing) throw new BusinessUnitNotFoundError();
      const children = await repository.listActiveChildren(input.tenantId, input.organizationId, input.businessUnitId);
      if (input.childHandling === "moveChildren") {
        await assertParentAllowed(repository, {
          tenantId: input.tenantId,
          organizationId: input.organizationId,
          businessUnitId: input.businessUnitId,
          parentBusinessUnitId: input.replacementParentBusinessUnitId ?? null,
        });
        await Promise.all(children.map((child) =>
          repository.move(input.tenantId, input.organizationId, child.businessUnitId, input.replacementParentBusinessUnitId ?? null),
        ));
      }
      const ids = input.childHandling === "archiveBranch"
        ? [input.businessUnitId, ...(await repository.listNonDeletedDescendants(input.tenantId, input.organizationId, input.businessUnitId)).map((item) => item.businessUnitId)]
        : [input.businessUnitId];
      const archived = await repository.archive(input.tenantId, input.organizationId, ids);
      if (!archived) throw new BusinessUnitNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_archived", eventDetails: { childHandling: input.childHandling } });
      return withChildren(repository, archived);
    },
    async restoreBusinessUnit(input) {
      const record = await repository.restore(input.tenantId, input.organizationId, input.businessUnitId);
      if (!record) throw new BusinessUnitNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_restored" });
      return withChildren(repository, record);
    },
    async softDeleteBusinessUnit(input) {
      const children = await repository.listActiveChildren(input.tenantId, input.organizationId, input.businessUnitId);
      if (children.length > 0) {
        throw new BusinessUnitHierarchyError("Business unit with active children cannot be deleted.", {
          reason: "active_children",
        });
      }
      const record = await repository.softDelete(input.tenantId, input.organizationId, input.businessUnitId);
      if (!record) throw new BusinessUnitNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_business_unit_deleted" });
      return withChildren(repository, record);
    },
    async assertActiveBusinessUnit(input) {
      return this.getBusinessUnit(input);
    },
  };
}
