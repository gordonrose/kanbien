import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const normalizedKeySchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const lifecycleStatusSchema = z.enum(["draft", "review", "live", "inactive"]);
const familyKindSchema = z.enum(["component", "pattern", "template"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const canonicalFamilyIdParamsSchema = strictObject({
  canonicalFamilyId: uuidSchema,
});

export const canonicalReferenceIdParamsSchema = strictObject({
  canonicalReferenceId: uuidSchema,
});

export const familyKeyParamsSchema = strictObject({
  familyKey: normalizedKeySchema,
});

export const familyKeyReferenceIdParamsSchema = strictObject({
  familyKey: normalizedKeySchema,
  referenceId: trimmedNonEmptyString,
});

export const createCanonicalFamilyBodySchema = strictObject({
  familyKey: normalizedKeySchema,
  displayLabel: trimmedNonEmptyString,
  familyKind: familyKindSchema,
  launcherTitle: trimmedNonEmptyString,
  launcherDescription: trimmedNonEmptyString,
  launcherCategory: trimmedNonEmptyString.nullish(),
  generatedLauncherRoutePath: trimmedNonEmptyString,
  generatedRootRoutePath: trimmedNonEmptyString,
  legacyLauncherRoutePath: trimmedNonEmptyString.nullish(),
  sourceSurfaceRoutePath: trimmedNonEmptyString.nullish(),
  status: lifecycleStatusSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
});

export const updateCanonicalFamilyBodySchema = strictObject({
  displayLabel: trimmedNonEmptyString.optional(),
  familyKind: familyKindSchema.optional(),
  launcherTitle: trimmedNonEmptyString.optional(),
  launcherDescription: trimmedNonEmptyString.optional(),
  launcherCategory: trimmedNonEmptyString.nullish(),
  generatedLauncherRoutePath: trimmedNonEmptyString.optional(),
  generatedRootRoutePath: trimmedNonEmptyString.optional(),
  legacyLauncherRoutePath: trimmedNonEmptyString.nullish(),
  sourceSurfaceRoutePath: trimmedNonEmptyString.nullish(),
  status: lifecycleStatusSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const createCanonicalReferenceBodySchema = strictObject({
  referenceId: trimmedNonEmptyString,
  displayLabel: trimmedNonEmptyString,
  description: trimmedNonEmptyString,
  renderRoutePath: trimmedNonEmptyString,
  legacyRenderRoutePath: trimmedNonEmptyString.nullish(),
  viewport: trimmedNonEmptyString.nullish(),
  width: z.coerce.number().int().positive().nullish(),
  height: z.coerce.number().int().positive().nullish(),
  theme: trimmedNonEmptyString.optional(),
  direction: trimmedNonEmptyString.optional(),
  zoom: z.coerce.number().int().min(-100).max(100).optional(),
  localeFixture: trimmedNonEmptyString.nullish(),
  labelDensityFixture: trimmedNonEmptyString.nullish(),
  stateVariantKey: trimmedNonEmptyString.nullish(),
  specimenPayload: z.record(z.string(), z.unknown()).optional(),
  status: lifecycleStatusSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
});

export const updateCanonicalReferenceBodySchema = strictObject({
  displayLabel: trimmedNonEmptyString.optional(),
  description: trimmedNonEmptyString.optional(),
  renderRoutePath: trimmedNonEmptyString.optional(),
  legacyRenderRoutePath: trimmedNonEmptyString.nullish(),
  viewport: trimmedNonEmptyString.nullish(),
  width: z.coerce.number().int().positive().nullish(),
  height: z.coerce.number().int().positive().nullish(),
  theme: trimmedNonEmptyString.optional(),
  direction: trimmedNonEmptyString.optional(),
  zoom: z.coerce.number().int().min(-100).max(100).optional(),
  localeFixture: trimmedNonEmptyString.nullish(),
  labelDensityFixture: trimmedNonEmptyString.nullish(),
  stateVariantKey: trimmedNonEmptyString.nullish(),
  specimenPayload: z.record(z.string(), z.unknown()).optional(),
  status: lifecycleStatusSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

