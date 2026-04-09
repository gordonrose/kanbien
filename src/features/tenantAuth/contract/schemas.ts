import { z } from "zod";

const trimmedNonEmptyString = z.string().trim().min(1);
const emailSchema = z.email().transform((value) => value.trim().toLowerCase());
const uuidSchema = z.string().uuid();
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const bootstrapPrincipalBodySchema = strictObject({
  verificationToken: trimmedNonEmptyString,
});

export const setupPasswordBodySchema = strictObject({
  bootstrapToken: trimmedNonEmptyString,
  newPassword: trimmedNonEmptyString,
  repeatPassword: trimmedNonEmptyString,
});

export const loginTenantPrincipalBodySchema = strictObject({
  email: emailSchema,
  password: trimmedNonEmptyString,
});

export const selectTenantContextBodySchema = strictObject({
  tenantId: uuidSchema,
});
