import { describe, expect, it } from "vitest";
import type { OrganizationCoreService } from "../../../src/features/organizationCore";
import { DuplicateActiveLegalProfileError, LegalProfileNotFoundError } from "../../../src/features/organizationLegalDetails/contract/errors";
import { createOrganizationLegalDetailsService } from "../../../src/features/organizationLegalDetails/domain/service";
import type { OrganizationLegalProfileData } from "../../../src/features/organizationLegalDetails/domain/types";
import type { OrganizationLegalDetailsRepository } from "../../../src/features/organizationLegalDetails/persistence/repository";
import type {
  CreateLegalProfileRecordInput,
  LegalProfileAuditEventInput,
  LegalProfileRepositoryListInput,
  LegalProfileRepositoryListResult,
  UpdateLegalProfileRecordInput,
} from "../../../src/features/organizationLegalDetails/persistence/types";

const tenantId = "11111111-1111-4111-8111-111111111111";
const organizationId = "22222222-2222-4222-8222-222222222222";

class MemoryLegalProfileRepository implements OrganizationLegalDetailsRepository {
  public readonly profiles: OrganizationLegalProfileData[] = [];
  public readonly auditEvents: LegalProfileAuditEventInput[] = [];

  async create(input: CreateLegalProfileRecordInput): Promise<OrganizationLegalProfileData> {
    const now = new Date("2026-05-15T10:00:00.000Z");
    const profile: OrganizationLegalProfileData = {
      legalProfileId: input.legalProfileId,
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      legalName: input.legalName,
      registrationIdentifier: input.registrationIdentifier,
      taxVatNumber: input.taxVatNumber,
      registeredAddress: input.registeredAddress,
      lifecycleStatus: "active",
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    this.profiles.push(profile);
    return profile;
  }

  async findActiveByOrganization(
    profileTenantId: string,
    profileOrganizationId: string,
  ): Promise<OrganizationLegalProfileData | null> {
    return this.profiles.find((profile) =>
      profile.tenantId === profileTenantId
      && profile.organizationId === profileOrganizationId
      && profile.lifecycleStatus === "active"
      && profile.deletedAt === null,
    ) ?? null;
  }

  async findVisibleById(
    profileTenantId: string,
    profileOrganizationId: string,
    legalProfileId: string,
  ): Promise<OrganizationLegalProfileData | null> {
    return this.profiles.find((profile) =>
      profile.tenantId === profileTenantId
      && profile.organizationId === profileOrganizationId
      && profile.legalProfileId === legalProfileId
      && profile.lifecycleStatus === "active"
      && profile.deletedAt === null,
    ) ?? null;
  }

  async findNonDeletedById(
    profileTenantId: string,
    profileOrganizationId: string,
    legalProfileId: string,
  ): Promise<OrganizationLegalProfileData | null> {
    return this.profiles.find((profile) =>
      profile.tenantId === profileTenantId
      && profile.organizationId === profileOrganizationId
      && profile.legalProfileId === legalProfileId
      && profile.deletedAt === null,
    ) ?? null;
  }

  async list(input: LegalProfileRepositoryListInput): Promise<LegalProfileRepositoryListResult> {
    const items = this.profiles.filter((profile) =>
      profile.tenantId === input.tenantId
      && profile.organizationId === input.organizationId
      && profile.deletedAt === null
      && (input.includeArchived || profile.lifecycleStatus === "active")
      && (!input.lifecycleStatus || profile.lifecycleStatus === input.lifecycleStatus),
    );
    return {
      items,
      totalSearchableRecords: items.length,
      totalMatchingRecords: items.length,
    };
  }

  async update(input: UpdateLegalProfileRecordInput): Promise<OrganizationLegalProfileData | null> {
    const profile = await this.findVisibleById(input.tenantId, input.organizationId, input.legalProfileId);
    if (!profile) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "legalName")) {
      profile.legalName = input.legalName ?? profile.legalName;
    }
    if (Object.prototype.hasOwnProperty.call(input, "registrationIdentifier")) {
      profile.registrationIdentifier = input.registrationIdentifier ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "taxVatNumber")) {
      profile.taxVatNumber = input.taxVatNumber ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "registeredAddress")) {
      profile.registeredAddress = input.registeredAddress ?? null;
    }
    profile.updatedAt = new Date("2026-05-15T10:05:00.000Z");
    return profile;
  }

  async archive(profileTenantId: string, profileOrganizationId: string, legalProfileId: string) {
    const profile = await this.findVisibleById(profileTenantId, profileOrganizationId, legalProfileId);
    if (!profile) {
      return null;
    }
    profile.lifecycleStatus = "archived";
    profile.archivedAt = new Date("2026-05-15T10:10:00.000Z");
    profile.updatedAt = profile.archivedAt;
    return profile;
  }

  async restore(profileTenantId: string, profileOrganizationId: string, legalProfileId: string) {
    const profile = await this.findNonDeletedById(profileTenantId, profileOrganizationId, legalProfileId);
    if (!profile || profile.lifecycleStatus !== "archived") {
      return null;
    }
    profile.lifecycleStatus = "active";
    profile.archivedAt = null;
    profile.updatedAt = new Date("2026-05-15T10:15:00.000Z");
    return profile;
  }

  async softDelete(profileTenantId: string, profileOrganizationId: string, legalProfileId: string) {
    const profile = await this.findNonDeletedById(profileTenantId, profileOrganizationId, legalProfileId);
    if (!profile) {
      return null;
    }
    profile.deletedAt = new Date("2026-05-15T10:20:00.000Z");
    profile.updatedAt = profile.deletedAt;
    return profile;
  }

  async recordAuditEvent(input: LegalProfileAuditEventInput): Promise<void> {
    this.auditEvents.push(input);
  }
}

function createFakeOrganizationCoreService(validTenantId = tenantId): OrganizationCoreService {
  return {
    async getOrganization(input) {
      if (input.tenantId !== validTenantId || input.organizationId !== organizationId) {
        throw new Error("organization not found");
      }
      return {
        organizationId,
        tenantId: input.tenantId,
        parentOrganizationId: null,
        name: "Acme",
        organizationTypeReferenceValueId: null,
        lifecycleStatus: "active",
        archivedAt: null,
        createdAt: "2026-05-15T09:00:00.000Z",
        updatedAt: "2026-05-15T09:00:00.000Z",
        deletedAt: null,
      };
    },
    createOrganization: async () => {
      throw new Error("not used");
    },
    listOrganizations: async () => {
      throw new Error("not used");
    },
    updateOrganization: async () => {
      throw new Error("not used");
    },
    moveOrganization: async () => {
      throw new Error("not used");
    },
    archiveOrganization: async () => {
      throw new Error("not used");
    },
    restoreOrganization: async () => {
      throw new Error("not used");
    },
    softDeleteOrganization: async () => {
      throw new Error("not used");
    },
  };
}

describe("organization legal details service", () => {
  it("creates one active legal profile with optional tax/VAT and registered address fields", async () => {
    const repository = new MemoryLegalProfileRepository();
    const service = createOrganizationLegalDetailsService(repository, createFakeOrganizationCoreService());

    const profile = await service.createLegalProfile({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      legalName: "Acme Legal Ltd",
      registrationIdentifier: "REG-123",
      taxVatNumber: "VAT-123",
      registeredAddress: "1 Legal Street",
    });

    expect(profile.legalName).toBe("Acme Legal Ltd");
    expect(profile.taxVatNumber).toBe("VAT-123");
    expect(profile.registeredAddress).toBe("1 Legal Street");
    expect(profile.lifecycleStatus).toBe("active");
    expect(repository.auditEvents).toHaveLength(1);
  });

  it("denies a second active legal profile for the same organization", async () => {
    const repository = new MemoryLegalProfileRepository();
    const service = createOrganizationLegalDetailsService(repository, createFakeOrganizationCoreService());

    await service.createLegalProfile({
      tenantId,
      organizationId,
      actorType: "tenant-admin",
      actorId: "tenant-admin-1",
      legalName: "Acme Legal Ltd",
    });

    await expect(service.createLegalProfile({
      tenantId,
      organizationId,
      actorType: "tenant-admin",
      actorId: "tenant-admin-1",
      legalName: "Acme Legal Two Ltd",
    })).rejects.toBeInstanceOf(DuplicateActiveLegalProfileError);
  });

  it("keeps archived profiles out of normal reads but available to export projections when requested", async () => {
    const repository = new MemoryLegalProfileRepository();
    const service = createOrganizationLegalDetailsService(repository, createFakeOrganizationCoreService());
    const profile = await service.createLegalProfile({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      legalName: "Acme Legal Ltd",
    });

    await service.archiveLegalProfile({
      tenantId,
      organizationId,
      legalProfileId: profile.legalProfileId,
      actorType: "root-user",
      actorId: "root-1",
    });

    await expect(service.getLegalProfile({ tenantId, organizationId, legalProfileId: profile.legalProfileId }))
      .rejects.toBeInstanceOf(LegalProfileNotFoundError);
    await expect(service.listLegalProfilesForExport({ tenantId, organizationId, includeArchived: true }))
      .resolves.toHaveLength(1);
  });

  it("updates legal fields and allows nullable optional fields to be cleared", async () => {
    const repository = new MemoryLegalProfileRepository();
    const service = createOrganizationLegalDetailsService(repository, createFakeOrganizationCoreService());
    const profile = await service.createLegalProfile({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      legalName: "Acme Legal Ltd",
      taxVatNumber: "VAT-123",
      registeredAddress: "1 Legal Street",
    });

    const updated = await service.updateLegalProfile({
      tenantId,
      organizationId,
      legalProfileId: profile.legalProfileId,
      actorType: "root-user",
      actorId: "root-1",
      legalName: "Acme Holdings Ltd",
      taxVatNumber: null,
      registeredAddress: null,
    });

    expect(updated.legalName).toBe("Acme Holdings Ltd");
    expect(updated.taxVatNumber).toBeNull();
    expect(updated.registeredAddress).toBeNull();
  });

  it("denies legal profile creation when the owning organization is outside the tenant boundary", async () => {
    const repository = new MemoryLegalProfileRepository();
    const service = createOrganizationLegalDetailsService(repository, createFakeOrganizationCoreService("other-tenant"));

    await expect(service.createLegalProfile({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      legalName: "Acme Legal Ltd",
    })).rejects.toThrow("organization not found");
  });
});
