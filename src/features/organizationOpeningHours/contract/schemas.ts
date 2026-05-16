import { z } from "zod";

const uuid = z.string().uuid();
const weekday = z.coerce.number().int().min(0).max(6);
const slotOrder = z.coerce.number().int().min(1).max(20);
const localTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:MM local time.");
const localDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD local date.");

export const tenantLocationParamsSchema = z.object({
  tenantId: uuid,
  organizationId: uuid,
  locationId: uuid,
}).strict();

export const locationParamsSchema = z.object({
  organizationId: uuid,
  locationId: uuid,
}).strict();

export const tenantWeeklySlotParamsSchema = tenantLocationParamsSchema.extend({
  weeklyOpeningHoursId: uuid,
}).strict();

export const weeklySlotParamsSchema = locationParamsSchema.extend({
  weeklyOpeningHoursId: uuid,
}).strict();

export const tenantExceptionParamsSchema = tenantLocationParamsSchema.extend({
  openingHoursExceptionId: uuid,
}).strict();

export const exceptionParamsSchema = locationParamsSchema.extend({
  openingHoursExceptionId: uuid,
}).strict();

export const listOpeningHoursQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  orderBy: z.enum(["updatedAt", "weekday", "startsOnLocalDate"]).default("updatedAt"),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
}).strict();

export const effectiveOpeningHoursQuerySchema = z.object({
  localDate,
}).strict();

export const replacementSlotSchema = z.object({
  slotOrder,
  opensAtLocalTime: localTime,
  closesAtLocalTime: localTime,
}).strict();

export const createWeeklySlotBodySchema = z.object({
  weekday,
  slotOrder,
  opensAtLocalTime: localTime,
  closesAtLocalTime: localTime,
}).strict();

export const updateWeeklySlotBodySchema = createWeeklySlotBodySchema.partial().strict();

export const createExceptionBodySchema = z.object({
  exceptionType: z.enum(["closed_day", "replacement_day_schedule", "closed_time_slot", "special_opening_slot"]),
  startsOnLocalDate: localDate,
  endsOnLocalDate: localDate.nullable().optional(),
  startsAtLocalTime: localTime.nullable().optional(),
  endsAtLocalTime: localTime.nullable().optional(),
  replacementSlots: z.array(replacementSlotSchema).max(20).optional(),
  reason: z.string().trim().min(1).max(500).nullable().optional(),
}).strict();

export const updateExceptionBodySchema = createExceptionBodySchema.partial().strict();
