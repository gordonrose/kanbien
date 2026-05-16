import type { OpeningHoursExceptionData, WeeklyOpeningHoursSlotData } from "../domain/types";
import type {
  CreateExceptionRecordInput,
  CreateWeeklySlotRecordInput,
  ExceptionListResult,
  OpeningHoursAuditEventInput,
  RepositoryListInput,
  UpdateExceptionRecordInput,
  UpdateWeeklySlotRecordInput,
  WeeklySlotListResult,
} from "./types";

export interface OrganizationOpeningHoursRepository {
  createWeeklySlot(input: CreateWeeklySlotRecordInput): Promise<WeeklyOpeningHoursSlotData>;
  findWeeklySlotById(
    tenantId: string,
    organizationId: string,
    locationId: string,
    weeklyOpeningHoursId: string,
  ): Promise<WeeklyOpeningHoursSlotData | null>;
  listWeeklySlots(input: RepositoryListInput): Promise<WeeklySlotListResult>;
  listWeeklySlotsForWeekday(
    tenantId: string,
    organizationId: string,
    locationId: string,
    weekday: number,
  ): Promise<WeeklyOpeningHoursSlotData[]>;
  updateWeeklySlot(input: UpdateWeeklySlotRecordInput): Promise<WeeklyOpeningHoursSlotData | null>;
  deleteWeeklySlot(
    tenantId: string,
    organizationId: string,
    locationId: string,
    weeklyOpeningHoursId: string,
  ): Promise<WeeklyOpeningHoursSlotData | null>;
  createException(input: CreateExceptionRecordInput): Promise<OpeningHoursExceptionData>;
  findExceptionById(
    tenantId: string,
    organizationId: string,
    locationId: string,
    openingHoursExceptionId: string,
  ): Promise<OpeningHoursExceptionData | null>;
  listExceptions(input: RepositoryListInput): Promise<ExceptionListResult>;
  listExceptionsForDate(
    tenantId: string,
    organizationId: string,
    locationId: string,
    localDate: string,
  ): Promise<OpeningHoursExceptionData[]>;
  updateException(input: UpdateExceptionRecordInput): Promise<OpeningHoursExceptionData | null>;
  deleteException(
    tenantId: string,
    organizationId: string,
    locationId: string,
    openingHoursExceptionId: string,
  ): Promise<OpeningHoursExceptionData | null>;
  recordAuditEvent(input: OpeningHoursAuditEventInput): Promise<void>;
}
