import { describe, expect, it } from "vitest";

import {
  InvalidOpeningHoursRequestError,
  WeeklyOpeningHoursOverlapError,
} from "../../../src/features/organizationOpeningHours/contract/errors";
import { createOrganizationOpeningHoursService } from "../../../src/features/organizationOpeningHours/domain/service";
import type {
  OpeningHoursExceptionData,
  WeeklyOpeningHoursSlotData,
} from "../../../src/features/organizationOpeningHours/domain/types";
import type { OrganizationOpeningHoursRepository } from "../../../src/features/organizationOpeningHours/persistence/repository";
import type {
  CreateExceptionRecordInput,
  CreateWeeklySlotRecordInput,
  ExceptionListResult,
  OpeningHoursAuditEventInput,
  RepositoryListInput,
  UpdateExceptionRecordInput,
  UpdateWeeklySlotRecordInput,
  WeeklySlotListResult,
} from "../../../src/features/organizationOpeningHours/persistence/types";
import type { OrganizationLocationsService } from "../../../src/features/organizationLocations";
import type { OrganizationLocation } from "../../../src/features/organizationLocations/domain/types";

const base = {
  tenantId: "tenant-1",
  organizationId: "org-1",
  locationId: "loc-1",
  actorType: "root-user" as const,
  actorId: "root-user-1",
};

function now(offset = 0): Date {
  return new Date(Date.UTC(2026, 4, 15, 10, offset, 0));
}

function cloneWeekly(slot: WeeklyOpeningHoursSlotData): WeeklyOpeningHoursSlotData {
  return { ...slot };
}

function cloneException(exception: OpeningHoursExceptionData): OpeningHoursExceptionData {
  return {
    ...exception,
    replacementSlots: exception.replacementSlots.map((slot) => ({ ...slot })),
  };
}

class MemoryOpeningHoursRepository implements OrganizationOpeningHoursRepository {
  public readonly weeklySlots: WeeklyOpeningHoursSlotData[] = [];
  public readonly exceptions: OpeningHoursExceptionData[] = [];
  public readonly auditEvents: OpeningHoursAuditEventInput[] = [];

  async createWeeklySlot(input: CreateWeeklySlotRecordInput): Promise<WeeklyOpeningHoursSlotData> {
    const slot: WeeklyOpeningHoursSlotData = {
      ...input,
      lifecycleStatus: "active",
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };
    this.weeklySlots.push(slot);
    return cloneWeekly(slot);
  }

  async findWeeklySlotById(
    tenantId: string,
    organizationId: string,
    locationId: string,
    weeklyOpeningHoursId: string,
  ): Promise<WeeklyOpeningHoursSlotData | null> {
    const slot = this.weeklySlots.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.locationId === locationId &&
        item.weeklyOpeningHoursId === weeklyOpeningHoursId &&
        item.deletedAt === null,
    );
    return slot ? cloneWeekly(slot) : null;
  }

  async listWeeklySlots(input: RepositoryListInput): Promise<WeeklySlotListResult> {
    const items = this.weeklySlots.filter(
      (slot) =>
        slot.tenantId === input.tenantId &&
        slot.organizationId === input.organizationId &&
        slot.locationId === input.locationId &&
        slot.deletedAt === null,
    );
    return {
      items: items.map(cloneWeekly),
      totalSearchableRecords: items.length,
      totalMatchingRecords: items.length,
    };
  }

  async listWeeklySlotsForWeekday(
    tenantId: string,
    organizationId: string,
    locationId: string,
    weekday: number,
  ): Promise<WeeklyOpeningHoursSlotData[]> {
    return this.weeklySlots
      .filter(
        (slot) =>
          slot.tenantId === tenantId &&
          slot.organizationId === organizationId &&
          slot.locationId === locationId &&
          slot.weekday === weekday &&
          slot.deletedAt === null,
      )
      .map(cloneWeekly);
  }

  async updateWeeklySlot(input: UpdateWeeklySlotRecordInput): Promise<WeeklyOpeningHoursSlotData | null> {
    const index = this.weeklySlots.findIndex(
      (slot) =>
        slot.tenantId === input.tenantId &&
        slot.organizationId === input.organizationId &&
        slot.locationId === input.locationId &&
        slot.weeklyOpeningHoursId === input.weeklyOpeningHoursId &&
        slot.deletedAt === null,
    );
    if (index < 0) return null;
    this.weeklySlots[index] = {
      ...this.weeklySlots[index],
      weekday: input.weekday ?? this.weeklySlots[index].weekday,
      slotOrder: input.slotOrder ?? this.weeklySlots[index].slotOrder,
      opensAtLocalTime: input.opensAtLocalTime ?? this.weeklySlots[index].opensAtLocalTime,
      closesAtLocalTime: input.closesAtLocalTime ?? this.weeklySlots[index].closesAtLocalTime,
      updatedAt: now(5),
    };
    return cloneWeekly(this.weeklySlots[index]);
  }

  async deleteWeeklySlot(
    tenantId: string,
    organizationId: string,
    locationId: string,
    weeklyOpeningHoursId: string,
  ): Promise<WeeklyOpeningHoursSlotData | null> {
    const index = this.weeklySlots.findIndex(
      (slot) =>
        slot.tenantId === tenantId &&
        slot.organizationId === organizationId &&
        slot.locationId === locationId &&
        slot.weeklyOpeningHoursId === weeklyOpeningHoursId &&
        slot.deletedAt === null,
    );
    if (index < 0) return null;
    this.weeklySlots[index] = {
      ...this.weeklySlots[index],
      lifecycleStatus: "deleted",
      deletedAt: now(9),
      updatedAt: now(9),
    };
    return cloneWeekly(this.weeklySlots[index]);
  }

  async createException(input: CreateExceptionRecordInput): Promise<OpeningHoursExceptionData> {
    const exception: OpeningHoursExceptionData = {
      ...input,
      lifecycleStatus: "active",
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };
    this.exceptions.push(exception);
    return cloneException(exception);
  }

  async findExceptionById(
    tenantId: string,
    organizationId: string,
    locationId: string,
    openingHoursExceptionId: string,
  ): Promise<OpeningHoursExceptionData | null> {
    const exception = this.exceptions.find(
      (item) =>
        item.tenantId === tenantId &&
        item.organizationId === organizationId &&
        item.locationId === locationId &&
        item.openingHoursExceptionId === openingHoursExceptionId &&
        item.deletedAt === null,
    );
    return exception ? cloneException(exception) : null;
  }

  async listExceptions(input: RepositoryListInput): Promise<ExceptionListResult> {
    const items = this.exceptions.filter(
      (exception) =>
        exception.tenantId === input.tenantId &&
        exception.organizationId === input.organizationId &&
        exception.locationId === input.locationId &&
        exception.deletedAt === null,
    );
    return {
      items: items.map(cloneException),
      totalSearchableRecords: items.length,
      totalMatchingRecords: items.length,
    };
  }

  async listExceptionsForDate(
    tenantId: string,
    organizationId: string,
    locationId: string,
    localDate: string,
  ): Promise<OpeningHoursExceptionData[]> {
    return this.exceptions
      .filter(
        (exception) =>
          exception.tenantId === tenantId &&
          exception.organizationId === organizationId &&
          exception.locationId === locationId &&
          exception.startsOnLocalDate <= localDate &&
          (exception.endsOnLocalDate ?? exception.startsOnLocalDate) >= localDate &&
          exception.deletedAt === null,
      )
      .map(cloneException);
  }

  async updateException(input: UpdateExceptionRecordInput): Promise<OpeningHoursExceptionData | null> {
    const index = this.exceptions.findIndex(
      (exception) =>
        exception.tenantId === input.tenantId &&
        exception.organizationId === input.organizationId &&
        exception.locationId === input.locationId &&
        exception.openingHoursExceptionId === input.openingHoursExceptionId &&
        exception.deletedAt === null,
    );
    if (index < 0) return null;
    this.exceptions[index] = {
      ...this.exceptions[index],
      ...input,
      replacementSlots: input.replacementSlots.map((slot) => ({ ...slot })),
      updatedAt: now(5),
    };
    return cloneException(this.exceptions[index]);
  }

  async deleteException(
    tenantId: string,
    organizationId: string,
    locationId: string,
    openingHoursExceptionId: string,
  ): Promise<OpeningHoursExceptionData | null> {
    const index = this.exceptions.findIndex(
      (exception) =>
        exception.tenantId === tenantId &&
        exception.organizationId === organizationId &&
        exception.locationId === locationId &&
        exception.openingHoursExceptionId === openingHoursExceptionId &&
        exception.deletedAt === null,
    );
    if (index < 0) return null;
    this.exceptions[index] = {
      ...this.exceptions[index],
      lifecycleStatus: "deleted",
      deletedAt: now(9),
      updatedAt: now(9),
    };
    return cloneException(this.exceptions[index]);
  }

  async recordAuditEvent(input: OpeningHoursAuditEventInput): Promise<void> {
    this.auditEvents.push(input);
  }
}

function createFakeLocationsService(): OrganizationLocationsService {
  const location: OrganizationLocation = {
    locationId: base.locationId,
    tenantId: base.tenantId,
    organizationId: base.organizationId,
    locationName: "Head Office",
    addressSummary: null,
    latitude: null,
    longitude: null,
    isHeadOffice: true,
    isRegisteredOffice: false,
    lifecycleStatus: "active",
    archivedAt: null,
    createdAt: now().toISOString(),
    updatedAt: now().toISOString(),
    deletedAt: null,
  };
  return {
    async getLocation(input) {
      if (
        input.tenantId !== base.tenantId ||
        input.organizationId !== base.organizationId ||
        input.locationId !== base.locationId
      ) {
        throw new Error("Location not found");
      }
      return location;
    },
    async createLocation() {
      return location;
    },
    async listLocations() {
      return {
        items: [location],
        page: 1,
        pageSize: 25,
        totalPages: 1,
        totalMatchingRecords: 1,
        totalSearchableRecords: 1,
      };
    },
    async updateLocation() {
      return location;
    },
    async archiveLocation() {
      return { ...location, lifecycleStatus: "archived" };
    },
    async restoreLocation() {
      return location;
    },
    async softDeleteLocation() {
      return { ...location, deletedAt: now().toISOString() };
    },
    async listLocationsForExport() {
      return [location];
    },
  };
}

function createSubject() {
  const repository = new MemoryOpeningHoursRepository();
  const service = createOrganizationOpeningHoursService(repository, createFakeLocationsService());
  return { repository, service };
}

describe("organization opening hours service", () => {
  it("creates weekly slots and blocks overlaps or duplicate slot order", async () => {
    const { repository, service } = createSubject();

    await service.createWeeklySlot({
      ...base,
      weekday: 1,
      slotOrder: 1,
      opensAtLocalTime: "09:00",
      closesAtLocalTime: "12:00",
    });

    await expect(
      service.createWeeklySlot({
        ...base,
        weekday: 1,
        slotOrder: 2,
        opensAtLocalTime: "11:30",
        closesAtLocalTime: "13:00",
      }),
    ).rejects.toBeInstanceOf(WeeklyOpeningHoursOverlapError);

    await expect(
      service.createWeeklySlot({
        ...base,
        weekday: 1,
        slotOrder: 1,
        opensAtLocalTime: "13:00",
        closesAtLocalTime: "17:00",
      }),
    ).rejects.toMatchObject({ details: { reason: "duplicate_slot_order" } });

    expect(repository.auditEvents).toHaveLength(1);
  });

  it("rejects overnight weekly slots", async () => {
    const { service } = createSubject();

    await expect(
      service.createWeeklySlot({
        ...base,
        weekday: 2,
        slotOrder: 1,
        opensAtLocalTime: "18:00",
        closesAtLocalTime: "08:00",
      }),
    ).rejects.toBeInstanceOf(InvalidOpeningHoursRequestError);
  });

  it("applies closed-day and replacement-day exceptions over weekly slots", async () => {
    const { service } = createSubject();

    await service.createWeeklySlot({
      ...base,
      weekday: 1,
      slotOrder: 1,
      opensAtLocalTime: "09:00",
      closesAtLocalTime: "17:00",
    });
    await service.createException({
      ...base,
      exceptionType: "replacement_day_schedule",
      startsOnLocalDate: "2026-05-18",
      replacementSlots: [{ slotOrder: 1, opensAtLocalTime: "10:00", closesAtLocalTime: "14:00" }],
      reason: "Bank holiday hours",
    });
    await expect(
      service.getEffectiveOpeningHours({
        tenantId: base.tenantId,
        organizationId: base.organizationId,
        locationId: base.locationId,
        localDate: "2026-05-18",
      }),
    ).resolves.toMatchObject({
      appliedExceptionType: "replacement_day_schedule",
      slots: [{ slotOrder: 1, opensAtLocalTime: "10:00", closesAtLocalTime: "14:00" }],
    });

    await service.createException({
      ...base,
      exceptionType: "closed_day",
      startsOnLocalDate: "2026-05-25",
      reason: "Closed for works",
    });
    await expect(
      service.getEffectiveOpeningHours({
        tenantId: base.tenantId,
        organizationId: base.organizationId,
        locationId: base.locationId,
        localDate: "2026-05-25",
      }),
    ).resolves.toMatchObject({ appliedExceptionType: "closed_day", slots: [] });
  });

  it("splits closed time slots and adds non-overlapping special opening slots", async () => {
    const { service } = createSubject();

    await service.createWeeklySlot({
      ...base,
      weekday: 1,
      slotOrder: 1,
      opensAtLocalTime: "09:00",
      closesAtLocalTime: "17:00",
    });
    await service.createException({
      ...base,
      exceptionType: "closed_time_slot",
      startsOnLocalDate: "2026-05-18",
      startsAtLocalTime: "12:00",
      endsAtLocalTime: "13:00",
    });
    await service.createException({
      ...base,
      exceptionType: "special_opening_slot",
      startsOnLocalDate: "2026-05-18",
      startsAtLocalTime: "18:00",
      endsAtLocalTime: "20:00",
    });

    await expect(
      service.getEffectiveOpeningHours({
        tenantId: base.tenantId,
        organizationId: base.organizationId,
        locationId: base.locationId,
        localDate: "2026-05-18",
      }),
    ).resolves.toMatchObject({
      appliedExceptionType: "weekly_baseline",
      slots: [
        { slotOrder: 1, opensAtLocalTime: "09:00", closesAtLocalTime: "12:00" },
        { slotOrder: 2, opensAtLocalTime: "13:00", closesAtLocalTime: "17:00" },
        { slotOrder: 3, opensAtLocalTime: "18:00", closesAtLocalTime: "20:00" },
      ],
    });
  });
});
