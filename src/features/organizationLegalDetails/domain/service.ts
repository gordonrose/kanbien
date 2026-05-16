import { randomUUID } from "node:crypto";
import type { OrganizationCoreService } from "../../organizationCore";
import { DuplicateActiveLegalProfileError, LegalProfileNotFoundError } from "../contract/errors";
import type { OrganizationLegalDetailsRepository } from "../persistence/repository";
import { toLegalProfile } from "./presenters";
import type {
  CreateLegalProfileInput,
  GetLegalProfileInput,
  LegalProfileExportProjectionInput,
  LegalProfileListResult,
  LifecycleLegalProfileInput,
  ListLegalProfilesInput,
  OrganizationLegalProfile,
  UpdateLegalProfileInput,
} from "./types";

export interface OrganizationLegalDetailsService {
  createLegalProfile(input: CreateLegalProfileInput): Promise<OrganizationLegalProfile>;
  getLegalProfile(input: GetLegalProfileInput): Promise<OrganizationLegalProfile>;
  listLegalProfiles(input: ListLegalProfilesInput): Promise<LegalProfileListResult>;
  updateLegalProfile(input: UpdateLegalProfileInput): Promise<OrganizationLegalProfile>;
  archiveLegalProfile(input: LifecycleLegalProfileInput): Promise<OrganizationLegalProfile>;
  restoreLegalProfile(input: LifecycleLegalProfileInput): Promise<OrganizationLegalProfile>;
  softDeleteLegalProfile(input: LifecycleLegalProfileInput): Promise<OrganizationLegalProfile>;
  listLegalProfilesForExport(input: LegalProfileExportProjectionInput): Promise<OrganizationLegalProfile[]>;
}

async function requireOwningOrganization(
  organizationCoreService: OrganizationCoreService,
  tenantId: string,
  organizationId: string,
): Promise<void> {
  await organizationCoreService.getOrganization({ tenantId, organizationId });
}

function nullable(value: string | null | undefined): string | null {
  return value ?? null;
}

async function recordAudit(
  repository: OrganizationLegalDetailsRepository,
  input: {
    tenantId: string;
    organizationId: string;
    legalProfileId: string | null;
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
    legalProfileId: input.legalProfileId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: "success",
    eventDetails: input.eventDetails,
    occurredAt: new Date(),
  });
}

export function createOrganizationLegalDetailsService(
  repository: OrganizationLegalDetailsRepository,
  organizationCoreService: OrganizationCoreService,
): OrganizationLegalDetailsService {
  return {
    async createLegalProfile(input) {
      await requireOwningOrganization(organizationCoreService, input.tenantId, input.organizationId);
      const existing = await repository.findActiveByOrganization(input.tenantId, input.organizationId);
      if (existing) {
        throw new DuplicateActiveLegalProfileError();
      }
      const profile = await repository.create({
        legalProfileId: randomUUID(),
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        legalName: input.legalName,
        registrationIdentifier: nullable(input.registrationIdentifier),
        taxVatNumber: nullable(input.taxVatNumber),
        registeredAddress: nullable(input.registeredAddress),
      });
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        legalProfileId: profile.legalProfileId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_legal_profile_created",
      });
      return toLegalProfile(profile);
    },
    async getLegalProfile(input) {
      const profile = await repository.findVisibleById(input.tenantId, input.organizationId, input.legalProfileId);
      if (!profile) {
        throw new LegalProfileNotFoundError();
      }
      return toLegalProfile(profile);
    },
    async listLegalProfiles(input) {
      await requireOwningOrganization(organizationCoreService, input.tenantId, input.organizationId);
      const result = await repository.list(input);
      return {
        items: result.items.map(toLegalProfile),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalSearchableRecords: result.totalSearchableRecords,
        totalMatchingRecords: result.totalMatchingRecords,
      };
    },
    async updateLegalProfile(input) {
      const existing = await repository.findVisibleById(input.tenantId, input.organizationId, input.legalProfileId);
      if (!existing) {
        throw new LegalProfileNotFoundError();
      }
      const profile = await repository.update(input);
      if (!profile) {
        throw new LegalProfileNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        legalProfileId: input.legalProfileId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_legal_profile_updated",
      });
      return toLegalProfile(profile);
    },
    async archiveLegalProfile(input) {
      const profile = await repository.archive(input.tenantId, input.organizationId, input.legalProfileId);
      if (!profile) {
        throw new LegalProfileNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        legalProfileId: input.legalProfileId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_legal_profile_archived",
      });
      return toLegalProfile(profile);
    },
    async restoreLegalProfile(input) {
      const existing = await repository.findActiveByOrganization(input.tenantId, input.organizationId);
      if (existing && existing.legalProfileId !== input.legalProfileId) {
        throw new DuplicateActiveLegalProfileError();
      }
      const profile = await repository.restore(input.tenantId, input.organizationId, input.legalProfileId);
      if (!profile) {
        throw new LegalProfileNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        legalProfileId: input.legalProfileId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_legal_profile_restored",
      });
      return toLegalProfile(profile);
    },
    async softDeleteLegalProfile(input) {
      const profile = await repository.softDelete(input.tenantId, input.organizationId, input.legalProfileId);
      if (!profile) {
        throw new LegalProfileNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        legalProfileId: input.legalProfileId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_legal_profile_deleted",
      });
      return toLegalProfile(profile);
    },
    async listLegalProfilesForExport(input) {
      await requireOwningOrganization(organizationCoreService, input.tenantId, input.organizationId);
      const result = await repository.list({
        ...input,
        page: 1,
        pageSize: 100,
        orderBy: "updatedAt",
        orderDirection: "desc",
      });
      return result.items.map(toLegalProfile);
    },
  };
}
