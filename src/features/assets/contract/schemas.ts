import { z } from "zod";

const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID.",
);
const checksumSha256Schema = z.string().regex(/^[a-fA-F0-9]{64}$/, "Invalid SHA-256 checksum.");
const trimmedNonEmptyString = z.string().trim().min(1);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const assetIdParamsSchema = strictObject({
  assetId: uuidSchema,
});

export const createUploadIntentBodySchema = strictObject({
  scopeType: z.enum(["root", "tenant"]),
  tenantId: uuidSchema.optional(),
  kind: z.enum(["image", "video", "audio", "document", "other"]),
  contentType: z.enum(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]),
  byteSize: z.number().int().min(1),
  visibility: z.enum(["private", "public"]).default("private"),
  originalFilename: trimmedNonEmptyString.max(255).optional(),
  expectedChecksumSha256: checksumSha256Schema.optional(),
  piiPosture: z.enum(["unknown", "none", "possible", "contains"]).optional(),
}).superRefine((value, context) => {
  if (value.scopeType === "tenant" && !value.tenantId) {
    context.addIssue({
      code: "custom",
      path: ["tenantId"],
      message: "tenantId is required for tenant-scoped assets.",
    });
  }
  if (value.scopeType === "root" && value.tenantId) {
    context.addIssue({
      code: "custom",
      path: ["tenantId"],
      message: "tenantId is not allowed for root-scoped assets.",
    });
  }
});

export const completeUploadBodySchema = strictObject({
  uploadIntentId: uuidSchema,
  checksumSha256: checksumSha256Schema.optional(),
});

export const cleanupExpiredUploadsBodySchema = strictObject({
  batchSize: z.number().int().min(1).max(500).default(100),
  retryFailedOnly: z.boolean().default(false),
  dryRun: z.boolean().default(false),
});
