import { z } from "zod";

const uuidSchema = z.string().uuid();
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const tenantOrganizationParamsSchema = strictObject({
  tenantId: uuidSchema,
  organizationId: uuidSchema,
});

export const organizationParamsSchema = strictObject({
  organizationId: uuidSchema,
});

export const publicLogoParamsSchema = strictObject({
  organizationId: uuidSchema,
  logoType: z.literal("primary"),
});

export const createLogoUploadIntentBodySchema = strictObject({
  contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  byteSize: z.number().int().min(1).max(5 * 1024 * 1024),
  originalFilename: z.string().trim().min(1).max(255).optional(),
  expectedChecksumSha256: z.string().trim().regex(/^[a-fA-F0-9]{64}$/).optional(),
  piiPosture: z.enum(["unknown", "none", "possible", "contains"]).default("possible"),
});

export const completeLogoUploadBodySchema = strictObject({
  uploadIntentId: uuidSchema,
  checksumSha256: z.string().trim().regex(/^[a-fA-F0-9]{64}$/).optional(),
});

export const uploadLogoBytesQuerySchema = strictObject({
  uploadIntentId: uuidSchema,
});

export const replaceLogoBodySchema = strictObject({
  assetId: uuidSchema,
  altText: z.string().trim().min(1).max(500).optional(),
});

