export type OpeningHoursActorType = "root-user" | "tenant-admin";
export type OpeningHoursLifecycleStatus = "active" | "deleted";
export type OpeningHoursExceptionType =
  | "closed_day"
  | "replacement_day_schedule"
  | "closed_time_slot"
  | "special_opening_slot";
export type CountValue = number | "10000+";

export interface OpeningHoursActorInput {
  actorType: OpeningHoursActorType;
  actorId: string;
}

export interface WeeklyOpeningHoursSlot {
  weeklyOpeningHoursId: string;
  tenantId: string;
  organizationId: string;
  locationId: string;
  weekday: number;
  slotOrder: number;
  opensAtLocalTime: string;
  closesAtLocalTime: string;
  lifecycleStatus: OpeningHoursLifecycleStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface WeeklyOpeningHoursSlotData extends Omit<WeeklyOpeningHoursSlot, "createdAt" | "updatedAt" | "deletedAt"> {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OpeningHoursException {
  openingHoursExceptionId: string;
  tenantId: string;
  organizationId: string;
  locationId: string;
  exceptionType: OpeningHoursExceptionType;
  startsOnLocalDate: string;
  endsOnLocalDate: string | null;
  startsAtLocalTime: string | null;
  endsAtLocalTime: string | null;
  replacementSlots: ReplacementOpeningSlot[];
  reason: string | null;
  lifecycleStatus: OpeningHoursLifecycleStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OpeningHoursExceptionData extends Omit<OpeningHoursException, "createdAt" | "updatedAt" | "deletedAt"> {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ReplacementOpeningSlot {
  slotOrder: number;
  opensAtLocalTime: string;
  closesAtLocalTime: string;
}

export interface OpeningHoursListResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface OpeningHoursLocationInput {
  tenantId: string;
  organizationId: string;
  locationId: string;
}

export interface ListOpeningHoursInput extends OpeningHoursLocationInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
}

export interface CreateWeeklySlotInput extends OpeningHoursActorInput, OpeningHoursLocationInput {
  weekday: number;
  slotOrder: number;
  opensAtLocalTime: string;
  closesAtLocalTime: string;
}

export interface UpdateWeeklySlotInput extends OpeningHoursActorInput, OpeningHoursLocationInput {
  weeklyOpeningHoursId: string;
  weekday?: number;
  slotOrder?: number;
  opensAtLocalTime?: string;
  closesAtLocalTime?: string;
}

export interface WeeklySlotIdentityInput extends OpeningHoursActorInput, OpeningHoursLocationInput {
  weeklyOpeningHoursId: string;
}

export interface CreateOpeningHoursExceptionInput extends OpeningHoursActorInput, OpeningHoursLocationInput {
  exceptionType: OpeningHoursExceptionType;
  startsOnLocalDate: string;
  endsOnLocalDate?: string | null;
  startsAtLocalTime?: string | null;
  endsAtLocalTime?: string | null;
  replacementSlots?: ReplacementOpeningSlot[];
  reason?: string | null;
}

export interface UpdateOpeningHoursExceptionInput extends OpeningHoursActorInput, OpeningHoursLocationInput {
  openingHoursExceptionId: string;
  exceptionType?: OpeningHoursExceptionType;
  startsOnLocalDate?: string;
  endsOnLocalDate?: string | null;
  startsAtLocalTime?: string | null;
  endsAtLocalTime?: string | null;
  replacementSlots?: ReplacementOpeningSlot[];
  reason?: string | null;
}

export interface OpeningHoursExceptionIdentityInput extends OpeningHoursActorInput, OpeningHoursLocationInput {
  openingHoursExceptionId: string;
}

export interface EffectiveOpeningHoursInput extends OpeningHoursLocationInput {
  localDate: string;
}

export interface EffectiveOpeningHours {
  tenantId: string;
  organizationId: string;
  locationId: string;
  localDate: string;
  slots: ReplacementOpeningSlot[];
  appliedExceptionType: OpeningHoursExceptionType | "weekly_baseline" | "closed_by_absence";
}
