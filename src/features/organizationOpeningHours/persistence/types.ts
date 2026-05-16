import type {
  OpeningHoursExceptionData,
  OpeningHoursExceptionType,
  ReplacementOpeningSlot,
  WeeklyOpeningHoursSlotData,
} from "../domain/types";

export interface RepositoryListResult<T> {
  items: T[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface RepositoryListInput {
  tenantId: string;
  organizationId: string;
  locationId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
}

export interface CreateWeeklySlotRecordInput {
  weeklyOpeningHoursId: string;
  tenantId: string;
  organizationId: string;
  locationId: string;
  weekday: number;
  slotOrder: number;
  opensAtLocalTime: string;
  closesAtLocalTime: string;
}

export interface UpdateWeeklySlotRecordInput {
  tenantId: string;
  organizationId: string;
  locationId: string;
  weeklyOpeningHoursId: string;
  weekday?: number;
  slotOrder?: number;
  opensAtLocalTime?: string;
  closesAtLocalTime?: string;
}

export interface CreateExceptionRecordInput {
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
}

export interface UpdateExceptionRecordInput extends Omit<CreateExceptionRecordInput, "openingHoursExceptionId"> {
  openingHoursExceptionId: string;
}

export interface OpeningHoursAuditEventInput {
  eventId: string;
  tenantId: string;
  organizationId: string;
  locationId: string;
  weeklyOpeningHoursId?: string | null;
  openingHoursExceptionId?: string | null;
  actorType: "root-user" | "tenant-admin";
  actorId: string;
  eventType: string;
  eventOutcome: "success";
  eventDetails?: Record<string, unknown>;
  occurredAt: Date;
}

export type WeeklySlotListResult = RepositoryListResult<WeeklyOpeningHoursSlotData>;
export type ExceptionListResult = RepositoryListResult<OpeningHoursExceptionData>;
