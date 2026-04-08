import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const isoDateTimeSchema = z.string().datetime({ offset: true });
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const normalizedTextSchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const sendTestEmailBodySchema = strictObject({
  recipientEmail: z.email().transform((value) => value.trim().toLowerCase()),
  subject: trimmedNonEmptyString,
  bodyText: trimmedNonEmptyString,
  notificationType: trimmedNonEmptyString,
  tenantId: uuidSchema.optional(),
  relatedEntityType: trimmedNonEmptyString.optional(),
  relatedEntityId: trimmedNonEmptyString.optional(),
});

export const resendEmailParamsSchema = strictObject({
  emailId: uuidSchema,
});

export const resendEmailBodySchema = strictObject({
  resendReason: trimmedNonEmptyString.optional(),
  subject: trimmedNonEmptyString.optional(),
  bodyText: trimmedNonEmptyString.optional(),
}).refine(
  (value) =>
    value.resendReason !== undefined || value.subject !== undefined || value.bodyText !== undefined,
  {
    message: "At least one field must be supplied.",
  },
);

export const getOutboundEmailParamsSchema = strictObject({
  emailId: uuidSchema,
});

export const listOutboundEmailsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["requestedAt", "sentAt", "subject", "recipientEmail", "status"]).default("requestedAt"),
  orderDirection: orderDirectionSchema,
  tenantId: uuidSchema.optional(),
  notificationType: normalizedTextSchema.optional(),
  recipientEmail: normalizedTextSchema.optional(),
  relatedEntityType: normalizedTextSchema.optional(),
  relatedEntityId: trimmedNonEmptyString.optional(),
  subject: normalizedTextSchema.optional(),
  status: z.enum(["pending", "sent", "failed"]).optional(),
  provider: normalizedTextSchema.optional(),
  createdByActorType: normalizedTextSchema.optional(),
  createdByActorId: trimmedNonEmptyString.optional(),
  requestedAtFrom: isoDateTimeSchema.optional(),
  requestedAtTo: isoDateTimeSchema.optional(),
  sentAtFrom: isoDateTimeSchema.optional(),
  sentAtTo: isoDateTimeSchema.optional(),
});
