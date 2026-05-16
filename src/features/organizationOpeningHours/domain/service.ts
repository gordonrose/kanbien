import { randomUUID } from "node:crypto";
import type { OrganizationLocationsService } from "../../organizationLocations";
import {
  InvalidOpeningHoursRequestError,
  OpeningHoursExceptionNotFoundError,
  WeeklyOpeningHoursNotFoundError,
  WeeklyOpeningHoursOverlapError,
} from "../contract/errors";
import type { OrganizationOpeningHoursRepository } from "../persistence/repository";
import { toOpeningHoursException, toWeeklySlot } from "./presenters";
import type {
  CreateOpeningHoursExceptionInput,
  CreateWeeklySlotInput,
  EffectiveOpeningHours,
  EffectiveOpeningHoursInput,
  ListOpeningHoursInput,
  OpeningHoursException,
  OpeningHoursListResult,
  OpeningHoursLocationInput,
  ReplacementOpeningSlot,
  UpdateOpeningHoursExceptionInput,
  UpdateWeeklySlotInput,
  WeeklyOpeningHoursSlot,
  WeeklySlotIdentityInput,
  OpeningHoursExceptionIdentityInput,
} from "./types";

export interface OrganizationOpeningHoursService {
  createWeeklySlot(input: CreateWeeklySlotInput): Promise<WeeklyOpeningHoursSlot>;
  listWeeklySlots(input: ListOpeningHoursInput): Promise<OpeningHoursListResult<WeeklyOpeningHoursSlot>>;
  updateWeeklySlot(input: UpdateWeeklySlotInput): Promise<WeeklyOpeningHoursSlot>;
  deleteWeeklySlot(input: WeeklySlotIdentityInput): Promise<WeeklyOpeningHoursSlot>;
  createException(input: CreateOpeningHoursExceptionInput): Promise<OpeningHoursException>;
  listExceptions(input: ListOpeningHoursInput): Promise<OpeningHoursListResult<OpeningHoursException>>;
  updateException(input: UpdateOpeningHoursExceptionInput): Promise<OpeningHoursException>;
  deleteException(input: OpeningHoursExceptionIdentityInput): Promise<OpeningHoursException>;
  getEffectiveOpeningHours(input: EffectiveOpeningHoursInput): Promise<EffectiveOpeningHours>;
}

async function requireLocation(
  organizationLocationsService: OrganizationLocationsService,
  input: OpeningHoursLocationInput,
): Promise<void> {
  await organizationLocationsService.getLocation({
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    locationId: input.locationId,
  });
}

function minutes(time: string): number {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

function normalizeTime(time: string): string {
  return time.slice(0, 5);
}

function assertTimeRange(opensAtLocalTime: string, closesAtLocalTime: string): void {
  if (minutes(opensAtLocalTime) >= minutes(closesAtLocalTime)) {
    throw new InvalidOpeningHoursRequestError("Opening-hour time ranges must be same-day and close after opening.", {
      reason: "invalid_time_range",
    });
  }
}

function assertReplacementSlots(slots: ReplacementOpeningSlot[]): void {
  const seenOrders = new Set<number>();
  const sorted = [...slots].sort((left, right) => left.slotOrder - right.slotOrder);
  for (const slot of sorted) {
    assertTimeRange(slot.opensAtLocalTime, slot.closesAtLocalTime);
    if (seenOrders.has(slot.slotOrder)) {
      throw new InvalidOpeningHoursRequestError("Replacement slot order must be unique.", {
        field: "replacementSlots",
        reason: "duplicate_slot_order",
      });
    }
    seenOrders.add(slot.slotOrder);
  }
  assertNoOverlap(sorted);
}

function assertNoOverlap(slots: Array<{ opensAtLocalTime: string; closesAtLocalTime: string }>): void {
  const sorted = [...slots].sort((left, right) => minutes(left.opensAtLocalTime) - minutes(right.opensAtLocalTime));
  for (let index = 1; index < sorted.length; index += 1) {
    if (minutes(sorted[index - 1].closesAtLocalTime) > minutes(sorted[index].opensAtLocalTime)) {
      throw new WeeklyOpeningHoursOverlapError({ reason: "overlapping_slots" });
    }
  }
}

function weekdayForLocalDate(localDate: string): number {
  return new Date(`${localDate}T00:00:00Z`).getUTCDay();
}

function dateInRange(localDate: string, startsOnLocalDate: string, endsOnLocalDate: string | null): boolean {
  return localDate >= startsOnLocalDate && localDate <= (endsOnLocalDate ?? startsOnLocalDate);
}

function assertDateRange(startsOnLocalDate: string, endsOnLocalDate: string | null | undefined): void {
  if (endsOnLocalDate && endsOnLocalDate < startsOnLocalDate) {
    throw new InvalidOpeningHoursRequestError("Exception end date must be on or after start date.", {
      field: "endsOnLocalDate",
      reason: "invalid_date_range",
    });
  }
}

function assertExceptionShape(input: {
  exceptionType: string;
  startsOnLocalDate: string;
  endsOnLocalDate?: string | null;
  startsAtLocalTime?: string | null;
  endsAtLocalTime?: string | null;
  replacementSlots?: ReplacementOpeningSlot[];
}): void {
  assertDateRange(input.startsOnLocalDate, input.endsOnLocalDate);
  const hasStartTime = input.startsAtLocalTime !== undefined && input.startsAtLocalTime !== null;
  const hasEndTime = input.endsAtLocalTime !== undefined && input.endsAtLocalTime !== null;
  const replacementSlots = input.replacementSlots ?? [];

  if (hasStartTime !== hasEndTime) {
    throw new InvalidOpeningHoursRequestError("Exception time ranges must include both start and end time.", {
      reason: "exception_time_pair_required",
    });
  }
  if (hasStartTime && input.startsAtLocalTime && input.endsAtLocalTime) {
    assertTimeRange(input.startsAtLocalTime, input.endsAtLocalTime);
  }

  if (input.exceptionType === "closed_day") {
    if (hasStartTime || replacementSlots.length > 0) {
      throw new InvalidOpeningHoursRequestError("Closed-day exceptions cannot include times or replacement slots.", {
        reason: "invalid_closed_day_shape",
      });
    }
    return;
  }

  if (input.exceptionType === "replacement_day_schedule") {
    if (hasStartTime || replacementSlots.length === 0) {
      throw new InvalidOpeningHoursRequestError("Replacement-day exceptions require replacement slots and no time range.", {
        reason: "invalid_replacement_shape",
      });
    }
    assertReplacementSlots(replacementSlots);
    return;
  }

  if (input.exceptionType === "closed_time_slot" || input.exceptionType === "special_opening_slot") {
    if (!hasStartTime || replacementSlots.length > 0) {
      throw new InvalidOpeningHoursRequestError("Timed exceptions require a time range and cannot include replacement slots.", {
        reason: "invalid_timed_exception_shape",
      });
    }
    return;
  }
}

async function assertWeeklySlotAvailable(
  repository: OrganizationOpeningHoursRepository,
  input: OpeningHoursLocationInput & {
    weekday: number;
    slotOrder: number;
    opensAtLocalTime: string;
    closesAtLocalTime: string;
    ignoreWeeklyOpeningHoursId?: string;
  },
): Promise<void> {
  assertTimeRange(input.opensAtLocalTime, input.closesAtLocalTime);
  const existing = await repository.listWeeklySlotsForWeekday(
    input.tenantId,
    input.organizationId,
    input.locationId,
    input.weekday,
  );
  const peerSlots = existing.filter((slot) => slot.weeklyOpeningHoursId !== input.ignoreWeeklyOpeningHoursId);
  if (peerSlots.some((slot) => slot.slotOrder === input.slotOrder)) {
    throw new InvalidOpeningHoursRequestError("Slot order must be unique for a location and weekday.", {
      field: "slotOrder",
      reason: "duplicate_slot_order",
    });
  }
  assertNoOverlap([
    ...peerSlots,
    {
      opensAtLocalTime: input.opensAtLocalTime,
      closesAtLocalTime: input.closesAtLocalTime,
    },
  ]);
}

function applyClosedRange(slots: ReplacementOpeningSlot[], start: string, end: string): ReplacementOpeningSlot[] {
  const startMinutes = minutes(start);
  const endMinutes = minutes(end);
  return slots
    .flatMap((slot) => {
      const slotStart = minutes(slot.opensAtLocalTime);
      const slotEnd = minutes(slot.closesAtLocalTime);
      if (endMinutes <= slotStart || startMinutes >= slotEnd) {
        return [slot];
      }
      const pieces: ReplacementOpeningSlot[] = [];
      if (slotStart < startMinutes) {
        pieces.push({ ...slot, closesAtLocalTime: start });
      }
      if (slotEnd > endMinutes) {
        pieces.push({ ...slot, opensAtLocalTime: end });
      }
      return pieces;
    })
    .map((slot, index) => ({ ...slot, slotOrder: index + 1 }));
}

function mergeAndOrder(slots: ReplacementOpeningSlot[]): ReplacementOpeningSlot[] {
  const sorted = [...slots].sort((left, right) => minutes(left.opensAtLocalTime) - minutes(right.opensAtLocalTime));
  assertNoOverlap(sorted);
  return sorted.map((slot, index) => ({ ...slot, slotOrder: index + 1 }));
}

async function recordAudit(
  repository: OrganizationOpeningHoursRepository,
  input: {
    tenantId: string;
    organizationId: string;
    locationId: string;
    weeklyOpeningHoursId?: string | null;
    openingHoursExceptionId?: string | null;
    actorType: "root-user" | "tenant-admin";
    actorId: string;
    eventType: string;
  },
): Promise<void> {
  await repository.recordAuditEvent({
    eventId: randomUUID(),
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    locationId: input.locationId,
    weeklyOpeningHoursId: input.weeklyOpeningHoursId ?? null,
    openingHoursExceptionId: input.openingHoursExceptionId ?? null,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: "success",
    occurredAt: new Date(),
  });
}

export function createOrganizationOpeningHoursService(
  repository: OrganizationOpeningHoursRepository,
  organizationLocationsService: OrganizationLocationsService,
): OrganizationOpeningHoursService {
  return {
    async createWeeklySlot(input) {
      await requireLocation(organizationLocationsService, input);
      await assertWeeklySlotAvailable(repository, input);
      const slot = await repository.createWeeklySlot({
        ...input,
        weeklyOpeningHoursId: randomUUID(),
        opensAtLocalTime: normalizeTime(input.opensAtLocalTime),
        closesAtLocalTime: normalizeTime(input.closesAtLocalTime),
      });
      await recordAudit(repository, {
        ...input,
        weeklyOpeningHoursId: slot.weeklyOpeningHoursId,
        eventType: "organization_weekly_hours_slot_created",
      });
      return toWeeklySlot(slot);
    },
    async listWeeklySlots(input) {
      await requireLocation(organizationLocationsService, input);
      const result = await repository.listWeeklySlots(input);
      return {
        items: result.items.map(toWeeklySlot),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalMatchingRecords: result.totalMatchingRecords,
        totalSearchableRecords: result.totalSearchableRecords,
      };
    },
    async updateWeeklySlot(input) {
      const existing = await repository.findWeeklySlotById(
        input.tenantId,
        input.organizationId,
        input.locationId,
        input.weeklyOpeningHoursId,
      );
      if (!existing) {
        throw new WeeklyOpeningHoursNotFoundError();
      }
      const next = {
        ...input,
        weekday: input.weekday ?? existing.weekday,
        slotOrder: input.slotOrder ?? existing.slotOrder,
        opensAtLocalTime: normalizeTime(input.opensAtLocalTime ?? existing.opensAtLocalTime),
        closesAtLocalTime: normalizeTime(input.closesAtLocalTime ?? existing.closesAtLocalTime),
      };
      await assertWeeklySlotAvailable(repository, {
        ...next,
        ignoreWeeklyOpeningHoursId: input.weeklyOpeningHoursId,
      });
      const slot = await repository.updateWeeklySlot(next);
      if (!slot) {
        throw new WeeklyOpeningHoursNotFoundError();
      }
      await recordAudit(repository, {
        ...input,
        weeklyOpeningHoursId: input.weeklyOpeningHoursId,
        eventType: "organization_weekly_hours_slot_updated",
      });
      return toWeeklySlot(slot);
    },
    async deleteWeeklySlot(input) {
      const slot = await repository.deleteWeeklySlot(
        input.tenantId,
        input.organizationId,
        input.locationId,
        input.weeklyOpeningHoursId,
      );
      if (!slot) {
        throw new WeeklyOpeningHoursNotFoundError();
      }
      await recordAudit(repository, {
        ...input,
        weeklyOpeningHoursId: input.weeklyOpeningHoursId,
        eventType: "organization_weekly_hours_slot_deleted",
      });
      return toWeeklySlot(slot);
    },
    async createException(input) {
      await requireLocation(organizationLocationsService, input);
      assertExceptionShape(input);
      const exception = await repository.createException({
        ...input,
        openingHoursExceptionId: randomUUID(),
        endsOnLocalDate: input.endsOnLocalDate ?? null,
        startsAtLocalTime: input.startsAtLocalTime ? normalizeTime(input.startsAtLocalTime) : null,
        endsAtLocalTime: input.endsAtLocalTime ? normalizeTime(input.endsAtLocalTime) : null,
        replacementSlots: input.replacementSlots ?? [],
        reason: input.reason ?? null,
      });
      await recordAudit(repository, {
        ...input,
        openingHoursExceptionId: exception.openingHoursExceptionId,
        eventType: "organization_opening_hours_exception_created",
      });
      return toOpeningHoursException(exception);
    },
    async listExceptions(input) {
      await requireLocation(organizationLocationsService, input);
      const result = await repository.listExceptions(input);
      return {
        items: result.items.map(toOpeningHoursException),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalMatchingRecords: result.totalMatchingRecords,
        totalSearchableRecords: result.totalSearchableRecords,
      };
    },
    async updateException(input) {
      const existing = await repository.findExceptionById(
        input.tenantId,
        input.organizationId,
        input.locationId,
        input.openingHoursExceptionId,
      );
      if (!existing) {
        throw new OpeningHoursExceptionNotFoundError();
      }
      const next = {
        tenantId: input.tenantId,
        organizationId: input.organizationId,
        locationId: input.locationId,
        openingHoursExceptionId: input.openingHoursExceptionId,
        exceptionType: input.exceptionType ?? existing.exceptionType,
        startsOnLocalDate: input.startsOnLocalDate ?? existing.startsOnLocalDate,
        endsOnLocalDate: input.endsOnLocalDate === undefined ? existing.endsOnLocalDate : input.endsOnLocalDate,
        startsAtLocalTime: input.startsAtLocalTime === undefined ? existing.startsAtLocalTime : input.startsAtLocalTime,
        endsAtLocalTime: input.endsAtLocalTime === undefined ? existing.endsAtLocalTime : input.endsAtLocalTime,
        replacementSlots: input.replacementSlots ?? existing.replacementSlots,
        reason: input.reason === undefined ? existing.reason : input.reason,
      };
      assertExceptionShape(next);
      const exception = await repository.updateException({
        ...next,
        startsAtLocalTime: next.startsAtLocalTime ? normalizeTime(next.startsAtLocalTime) : null,
        endsAtLocalTime: next.endsAtLocalTime ? normalizeTime(next.endsAtLocalTime) : null,
        reason: next.reason ?? null,
      });
      if (!exception) {
        throw new OpeningHoursExceptionNotFoundError();
      }
      await recordAudit(repository, {
        ...input,
        openingHoursExceptionId: input.openingHoursExceptionId,
        eventType: "organization_opening_hours_exception_updated",
      });
      return toOpeningHoursException(exception);
    },
    async deleteException(input) {
      const exception = await repository.deleteException(
        input.tenantId,
        input.organizationId,
        input.locationId,
        input.openingHoursExceptionId,
      );
      if (!exception) {
        throw new OpeningHoursExceptionNotFoundError();
      }
      await recordAudit(repository, {
        ...input,
        openingHoursExceptionId: input.openingHoursExceptionId,
        eventType: "organization_opening_hours_exception_deleted",
      });
      return toOpeningHoursException(exception);
    },
    async getEffectiveOpeningHours(input) {
      await requireLocation(organizationLocationsService, input);
      const weekday = weekdayForLocalDate(input.localDate);
      const weeklySlots = (await repository.listWeeklySlotsForWeekday(
        input.tenantId,
        input.organizationId,
        input.locationId,
        weekday,
      )).map((slot) => ({
        slotOrder: slot.slotOrder,
        opensAtLocalTime: slot.opensAtLocalTime,
        closesAtLocalTime: slot.closesAtLocalTime,
      }));
      const exceptions = (await repository.listExceptionsForDate(
        input.tenantId,
        input.organizationId,
        input.locationId,
        input.localDate,
      )).filter((exception) => dateInRange(input.localDate, exception.startsOnLocalDate, exception.endsOnLocalDate));

      if (exceptions.some((exception) => exception.exceptionType === "closed_day")) {
        return { ...input, slots: [], appliedExceptionType: "closed_day" };
      }
      const replacement = exceptions.find((exception) => exception.exceptionType === "replacement_day_schedule");
      if (replacement) {
        return {
          ...input,
          slots: replacement.replacementSlots,
          appliedExceptionType: "replacement_day_schedule",
        };
      }
      let slots = weeklySlots;
      for (const exception of exceptions.filter((item) => item.exceptionType === "closed_time_slot")) {
        if (exception.startsAtLocalTime && exception.endsAtLocalTime) {
          slots = applyClosedRange(slots, exception.startsAtLocalTime, exception.endsAtLocalTime);
        }
      }
      const specialSlots = exceptions
        .filter((item) => item.exceptionType === "special_opening_slot")
        .map((item) => ({
          slotOrder: 0,
          opensAtLocalTime: item.startsAtLocalTime ?? "",
          closesAtLocalTime: item.endsAtLocalTime ?? "",
        }))
        .filter((item) => item.opensAtLocalTime && item.closesAtLocalTime);
      const finalSlots = mergeAndOrder([...slots, ...specialSlots]);
      return {
        ...input,
        slots: finalSlots,
        appliedExceptionType: finalSlots.length > 0 ? "weekly_baseline" : "closed_by_absence",
      };
    },
  };
}
