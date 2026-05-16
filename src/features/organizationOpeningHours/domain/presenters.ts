import type {
  OpeningHoursException,
  OpeningHoursExceptionData,
  WeeklyOpeningHoursSlot,
  WeeklyOpeningHoursSlotData,
} from "./types";

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function toWeeklySlot(data: WeeklyOpeningHoursSlotData): WeeklyOpeningHoursSlot {
  return {
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: iso(data.deletedAt),
  };
}

export function toOpeningHoursException(data: OpeningHoursExceptionData): OpeningHoursException {
  return {
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: iso(data.deletedAt),
  };
}
