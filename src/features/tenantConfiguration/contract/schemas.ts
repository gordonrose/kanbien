import { z } from "zod";

const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();
const uuidSchema = z.string().uuid();
const nonNegativeInt = z.number().int().min(0);
const nullableNonNegativeInt = nonNegativeInt.nullable().optional();

export const tenantIdParamsSchema = strictObject({
  tenantId: uuidSchema,
});

export const updateTenantAuthPolicyBodySchema = strictObject({
  minLength: nullableNonNegativeInt,
  maxLength: nullableNonNegativeInt,
  minUppercase: nullableNonNegativeInt,
  maxUppercase: nullableNonNegativeInt,
  minLowercase: nullableNonNegativeInt,
  maxLowercase: nullableNonNegativeInt,
  minNumbers: nullableNonNegativeInt,
  maxNumbers: nullableNonNegativeInt,
  minSymbols: nullableNonNegativeInt,
  maxSymbols: nullableNonNegativeInt,
});
