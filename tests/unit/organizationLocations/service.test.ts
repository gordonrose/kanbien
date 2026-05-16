import { describe, expect, it } from "vitest";
import type { OrganizationCoreService } from "../../../src/features/organizationCore";
import { InvalidLocationRequestError, LocationNotFoundError } from "../../../src/features/organizationLocations/contract/errors";
import { createOrganizationLocationsService } from "../../../src/features/organizationLocations/domain/service";
import type { OrganizationLocationData } from "../../../src/features/organizationLocations/domain/types";
import type { OrganizationLocationsRepository } from "../../../src/features/organizationLocations/persistence/repository";
import type {
  CreateLocationRecordInput,
  LocationAuditEventInput,
  LocationRepositoryListInput,
  LocationRepositoryListResult,
  UpdateLocationRecordInput,
} from "../../../src/features/organizationLocations/persistence/types";

const tenantId = "11111111-1111-4111-8111-111111111111";
const organizationId = "22222222-2222-4222-8222-222222222222";

class MemoryLocationRepository implements OrganizationLocationsRepository {
  public readonly locations: OrganizationLocationData[] = [];
  public readonly auditEvents: LocationAuditEventInput[] = [];

  async create(input: CreateLocationRecordInput): Promise<OrganizationLocationData> {
    const now = new Date("2026-05-15T10:00:00.000Z");
    const location: OrganizationLocationData = {
      locationId: input.locationId,
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      locationName: input.locationName,
      addressSummary: input.addressSummary,
      latitude: input.latitude,
      longitude: input.longitude,
      isHeadOffice: input.isHeadOffice,
      isRegisteredOffice: input.isRegisteredOffice,
      lifecycleStatus: "active",
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    this.locations.push(location);
    return location;
  }

  async findVisibleById(
    locationTenantId: string,
    locationOrganizationId: string,
    locationId: string,
  ): Promise<OrganizationLocationData | null> {
    return this.locations.find((location) =>
      location.tenantId === locationTenantId
      && location.organizationId === locationOrganizationId
      && location.locationId === locationId
      && location.lifecycleStatus === "active"
      && location.deletedAt === null,
    ) ?? null;
  }

  async findNonDeletedById(
    locationTenantId: string,
    locationOrganizationId: string,
    locationId: string,
  ): Promise<OrganizationLocationData | null> {
    return this.locations.find((location) =>
      location.tenantId === locationTenantId
      && location.organizationId === locationOrganizationId
      && location.locationId === locationId
      && location.deletedAt === null,
    ) ?? null;
  }

  async list(input: LocationRepositoryListInput): Promise<LocationRepositoryListResult> {
    const items = this.locations.filter((location) =>
      location.tenantId === input.tenantId
      && location.organizationId === input.organizationId
      && location.deletedAt === null
      && (input.includeArchived || location.lifecycleStatus === "active")
      && (!input.lifecycleStatus || location.lifecycleStatus === input.lifecycleStatus),
    );
    return {
      items,
      totalSearchableRecords: items.length,
      totalMatchingRecords: items.length,
    };
  }

  async update(input: UpdateLocationRecordInput): Promise<OrganizationLocationData | null> {
    const location = await this.findVisibleById(input.tenantId, input.organizationId, input.locationId);
    if (!location) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "locationName")) {
      location.locationName = input.locationName ?? location.locationName;
    }
    if (Object.prototype.hasOwnProperty.call(input, "addressSummary")) {
      location.addressSummary = input.addressSummary ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "latitude")) {
      location.latitude = input.latitude ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "longitude")) {
      location.longitude = input.longitude ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(input, "isHeadOffice")) {
      location.isHeadOffice = input.isHeadOffice ?? location.isHeadOffice;
    }
    if (Object.prototype.hasOwnProperty.call(input, "isRegisteredOffice")) {
      location.isRegisteredOffice = input.isRegisteredOffice ?? location.isRegisteredOffice;
    }
    location.updatedAt = new Date("2026-05-15T10:05:00.000Z");
    return location;
  }

  async archive(locationTenantId: string, locationOrganizationId: string, locationId: string) {
    const location = await this.findVisibleById(locationTenantId, locationOrganizationId, locationId);
    if (!location) {
      return null;
    }
    location.lifecycleStatus = "archived";
    location.archivedAt = new Date("2026-05-15T10:10:00.000Z");
    location.updatedAt = location.archivedAt;
    return location;
  }

  async restore(locationTenantId: string, locationOrganizationId: string, locationId: string) {
    const location = await this.findNonDeletedById(locationTenantId, locationOrganizationId, locationId);
    if (!location || location.lifecycleStatus !== "archived") {
      return null;
    }
    location.lifecycleStatus = "active";
    location.archivedAt = null;
    location.updatedAt = new Date("2026-05-15T10:15:00.000Z");
    return location;
  }

  async softDelete(locationTenantId: string, locationOrganizationId: string, locationId: string) {
    const location = await this.findNonDeletedById(locationTenantId, locationOrganizationId, locationId);
    if (!location) {
      return null;
    }
    location.deletedAt = new Date("2026-05-15T10:20:00.000Z");
    location.updatedAt = location.deletedAt;
    return location;
  }

  async recordAuditEvent(input: LocationAuditEventInput): Promise<void> {
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

describe("organization locations service", () => {
  it("creates many locations with optional coordinates and descriptive flags", async () => {
    const repository = new MemoryLocationRepository();
    const service = createOrganizationLocationsService(repository, createFakeOrganizationCoreService());

    const headOffice = await service.createLocation({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Acme HQ",
      addressSummary: "1 Main Street",
      latitude: 51.5,
      longitude: -0.12,
      isHeadOffice: true,
      isRegisteredOffice: true,
    });
    const secondHeadOffice = await service.createLocation({
      tenantId,
      organizationId,
      actorType: "tenant-admin",
      actorId: "tenant-admin-1",
      locationName: "Acme North",
      isHeadOffice: true,
      isRegisteredOffice: false,
    });

    expect(headOffice.latitude).toBe(51.5);
    expect(headOffice.isHeadOffice).toBe(true);
    expect(secondHeadOffice.isHeadOffice).toBe(true);
    expect(repository.locations).toHaveLength(2);
    expect(repository.auditEvents).toHaveLength(2);
  });

  it("rejects incomplete or out-of-range coordinates", async () => {
    const repository = new MemoryLocationRepository();
    const service = createOrganizationLocationsService(repository, createFakeOrganizationCoreService());

    await expect(service.createLocation({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Bad Latitude",
      latitude: 91,
      longitude: 0,
      isHeadOffice: false,
      isRegisteredOffice: false,
    })).rejects.toBeInstanceOf(InvalidLocationRequestError);

    await expect(service.createLocation({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Missing Longitude",
      latitude: 51,
      isHeadOffice: false,
      isRegisteredOffice: false,
    })).rejects.toBeInstanceOf(InvalidLocationRequestError);
  });

  it("keeps archived locations out of normal reads but available to export projections when requested", async () => {
    const repository = new MemoryLocationRepository();
    const service = createOrganizationLocationsService(repository, createFakeOrganizationCoreService());
    const profile = await service.createLocation({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Acme HQ",
      isHeadOffice: false,
      isRegisteredOffice: false,
    });

    await service.archiveLocation({
      tenantId,
      organizationId,
      locationId: profile.locationId,
      actorType: "root-user",
      actorId: "root-1",
    });

    await expect(service.getLocation({ tenantId, organizationId, locationId: profile.locationId }))
      .rejects.toBeInstanceOf(LocationNotFoundError);
    await expect(service.listLocationsForExport({ tenantId, organizationId, includeArchived: true }))
      .resolves.toHaveLength(1);
  });

  it("updates location fields and allows nullable optional fields to be cleared", async () => {
    const repository = new MemoryLocationRepository();
    const service = createOrganizationLocationsService(repository, createFakeOrganizationCoreService());
    const profile = await service.createLocation({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Acme HQ",
      latitude: 51.5,
      longitude: -0.12,
      isHeadOffice: false,
      isRegisteredOffice: false,
    });

    const updated = await service.updateLocation({
      tenantId,
      organizationId,
      locationId: profile.locationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Acme West",
      latitude: null,
      longitude: null,
    });

    expect(updated.locationName).toBe("Acme West");
    expect(updated.latitude).toBeNull();
    expect(updated.longitude).toBeNull();
  });

  it("denies location creation when the owning organization is outside the tenant boundary", async () => {
    const repository = new MemoryLocationRepository();
    const service = createOrganizationLocationsService(repository, createFakeOrganizationCoreService("other-tenant"));

    await expect(service.createLocation({
      tenantId,
      organizationId,
      actorType: "root-user",
      actorId: "root-1",
      locationName: "Acme HQ",
      isHeadOffice: false,
      isRegisteredOffice: false,
    })).rejects.toThrow("organization not found");
  });
});
