import { randomUUID } from "node:crypto";
import type { OrganizationCoreService } from "../../organizationCore";
import { InvalidLocationRequestError, LocationNotFoundError } from "../contract/errors";
import type { OrganizationLocationsRepository } from "../persistence/repository";
import { toLocation } from "./presenters";
import type {
  CreateLocationInput,
  GetLocationInput,
  LocationExportProjectionInput,
  LocationListResult,
  LifecycleLocationInput,
  ListLocationsInput,
  OrganizationLocation,
  UpdateLocationInput,
} from "./types";

export interface OrganizationLocationsService {
  createLocation(input: CreateLocationInput): Promise<OrganizationLocation>;
  getLocation(input: GetLocationInput): Promise<OrganizationLocation>;
  listLocations(input: ListLocationsInput): Promise<LocationListResult>;
  updateLocation(input: UpdateLocationInput): Promise<OrganizationLocation>;
  archiveLocation(input: LifecycleLocationInput): Promise<OrganizationLocation>;
  restoreLocation(input: LifecycleLocationInput): Promise<OrganizationLocation>;
  softDeleteLocation(input: LifecycleLocationInput): Promise<OrganizationLocation>;
  listLocationsForExport(input: LocationExportProjectionInput): Promise<OrganizationLocation[]>;
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

function nullableNumber(value: number | null | undefined): number | null {
  return value ?? null;
}

function assertCoordinatePair(latitude: number | null | undefined, longitude: number | null | undefined): void {
  const hasLatitude = latitude !== undefined && latitude !== null;
  const hasLongitude = longitude !== undefined && longitude !== null;
  if (hasLatitude !== hasLongitude) {
    throw new InvalidLocationRequestError("Latitude and longitude must be supplied together.", {
      field: hasLatitude ? "longitude" : "latitude",
      reason: "coordinate_pair_required",
    });
  }
  if (hasLatitude && (latitude < -90 || latitude > 90)) {
    throw new InvalidLocationRequestError("Latitude must be between -90 and 90.", {
      field: "latitude",
      reason: "coordinate_range",
    });
  }
  if (hasLongitude && (longitude < -180 || longitude > 180)) {
    throw new InvalidLocationRequestError("Longitude must be between -180 and 180.", {
      field: "longitude",
      reason: "coordinate_range",
    });
  }
}

async function recordAudit(
  repository: OrganizationLocationsRepository,
  input: {
    tenantId: string;
    organizationId: string;
    locationId: string | null;
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
    locationId: input.locationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: "success",
    eventDetails: input.eventDetails,
    occurredAt: new Date(),
  });
}

export function createOrganizationLocationsService(
  repository: OrganizationLocationsRepository,
  organizationCoreService: OrganizationCoreService,
): OrganizationLocationsService {
  return {
    async createLocation(input) {
      await requireOwningOrganization(organizationCoreService, input.tenantId, input.organizationId);
      assertCoordinatePair(input.latitude, input.longitude);
      const profile = await repository.create({
        locationId: randomUUID(),
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationName: input.locationName,
        addressSummary: nullable(input.addressSummary),
        latitude: nullableNumber(input.latitude),
        longitude: nullableNumber(input.longitude),
        isHeadOffice: input.isHeadOffice,
        isRegisteredOffice: input.isRegisteredOffice,
      });
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: profile.locationId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_location_created",
      });
      return toLocation(profile);
    },
    async getLocation(input) {
      const profile = await repository.findVisibleById(input.tenantId, input.organizationId, input.locationId);
      if (!profile) {
        throw new LocationNotFoundError();
      }
      return toLocation(profile);
    },
    async listLocations(input) {
      await requireOwningOrganization(organizationCoreService, input.tenantId, input.organizationId);
      const result = await repository.list(input);
      return {
        items: result.items.map(toLocation),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalSearchableRecords: result.totalSearchableRecords,
        totalMatchingRecords: result.totalMatchingRecords,
      };
    },
    async updateLocation(input) {
      if (
        Object.prototype.hasOwnProperty.call(input, "latitude") ||
        Object.prototype.hasOwnProperty.call(input, "longitude")
      ) {
        assertCoordinatePair(input.latitude, input.longitude);
      }
      const existing = await repository.findVisibleById(input.tenantId, input.organizationId, input.locationId);
      if (!existing) {
        throw new LocationNotFoundError();
      }
      const profile = await repository.update(input);
      if (!profile) {
        throw new LocationNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_location_updated",
      });
      return toLocation(profile);
    },
    async archiveLocation(input) {
      const profile = await repository.archive(input.tenantId, input.organizationId, input.locationId);
      if (!profile) {
        throw new LocationNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_location_archived",
      });
      return toLocation(profile);
    },
    async restoreLocation(input) {
      const profile = await repository.restore(input.tenantId, input.organizationId, input.locationId);
      if (!profile) {
        throw new LocationNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_location_restored",
      });
      return toLocation(profile);
    },
    async softDeleteLocation(input) {
      const profile = await repository.softDelete(input.tenantId, input.organizationId, input.locationId);
      if (!profile) {
        throw new LocationNotFoundError();
      }
      await recordAudit(repository, {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        actorType: input.actorType,
        actorId: input.actorId,
        eventType: "organization_location_deleted",
      });
      return toLocation(profile);
    },
    async listLocationsForExport(input) {
      await requireOwningOrganization(organizationCoreService, input.tenantId, input.organizationId);
      const result = await repository.list({
        ...input,
        page: 1,
        pageSize: 100,
        orderBy: "updatedAt",
        orderDirection: "desc",
      });
      return result.items.map(toLocation);
    },
  };
}
