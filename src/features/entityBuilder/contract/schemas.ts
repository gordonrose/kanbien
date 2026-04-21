import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const keySchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/)
  .transform((value) => value.toLowerCase());
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const statusSchema = z.enum(["draft", "active", "superseded", "archived"]);
const attributeKindSchema = z.enum(["persisted", "computed"]);
const attributeTypeSchema = z.enum([
  "string",
  "text",
  "boolean",
  "integer",
  "decimal",
  "uuid",
  "email",
  "url",
  "date",
  "datetime",
  "enum",
  "coordinates",
]);
const valueCardinalitySchema = z.enum(["single", "multiple"]);
const optionsModeSchema = z.enum(["none", "inline", "catalog_reference"]);
const ruleKeySchema = z.enum([
  "required",
  "min_length",
  "max_length",
  "pattern",
  "enum_membership",
  "type_format",
]);
const ruleArgumentTypeSchema = z.enum(["none", "string", "integer", "decimal", "boolean"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const entityDefinitionVersionIdParamsSchema = strictObject({
  entityDefinitionVersionId: uuidSchema,
});

export const entityKeyParamsSchema = strictObject({
  entityKey: keySchema,
});

export const attributeValidationRuleSchema = strictObject({
  ruleKey: ruleKeySchema,
  ruleArgumentType: ruleArgumentTypeSchema,
  ruleArgumentString: z.string().trim().min(1).optional(),
  ruleArgumentInteger: z.coerce.number().int().optional(),
  ruleArgumentDecimal: z.coerce.number().optional(),
  ruleArgumentBoolean: z.coerce.boolean().optional(),
  errorMessage: trimmedNonEmptyString.optional(),
  displayOrder: z.coerce.number().int().min(0),
});

export const attributeOptionSchema = strictObject({
  optionKey: keySchema,
  label: trimmedNonEmptyString,
  description: trimmedNonEmptyString.optional(),
  displayOrder: z.coerce.number().int().min(0),
});

export const entityAttributeSchema = strictObject({
  attributeKey: keySchema,
  attributeKind: attributeKindSchema,
  attributeType: attributeTypeSchema,
  valueCardinality: valueCardinalitySchema,
  label: trimmedNonEmptyString,
  description: trimmedNonEmptyString,
  helpText: trimmedNonEmptyString.optional(),
  placeholderText: trimmedNonEmptyString.optional(),
  formFacing: z.coerce.boolean().default(true),
  defaultFormPatternKey: z.string().trim().min(1).optional(),
  optionsMode: optionsModeSchema.default("none"),
  optionsCatalogKey: keySchema.optional(),
  derivationNote: trimmedNonEmptyString.optional(),
  sourceAttributeKeys: z.array(keySchema).default([]),
  displayOrder: z.coerce.number().int().min(0),
  validationRules: z.array(attributeValidationRuleSchema).default([]),
  options: z.array(attributeOptionSchema).default([]),
})
  .refine(
    (value) => !value.formFacing || Boolean(value.defaultFormPatternKey),
    {
      message: "defaultFormPatternKey is required when formFacing is true.",
      path: ["defaultFormPatternKey"],
    },
  )
  .refine(
    (value) =>
      value.attributeKind !== "computed" ||
      (Boolean(value.derivationNote) && value.sourceAttributeKeys.length > 0),
    {
      message:
        "Computed attributes require derivationNote and at least one sourceAttributeKey.",
      path: ["derivationNote"],
    },
  )
  .refine(
    (value) =>
      (value.optionsMode === "inline" && value.options.length > 0) ||
      (value.optionsMode === "catalog_reference" && Boolean(value.optionsCatalogKey)) ||
      (value.optionsMode === "none" &&
        value.options.length === 0 &&
        value.optionsCatalogKey === undefined),
    {
      message: "Option posture is not valid for the selected optionsMode.",
      path: ["optionsMode"],
    },
  );

export const createEntityDefinitionVersionBodySchema = strictObject({
  entityKey: keySchema,
  entityName: trimmedNonEmptyString,
  description: trimmedNonEmptyString,
  status: z.enum(["draft", "active"]).default("draft"),
  attributes: z.array(entityAttributeSchema),
});

export const updateEntityDefinitionVersionBodySchema = strictObject({
  entityName: trimmedNonEmptyString.optional(),
  description: trimmedNonEmptyString.optional(),
  status: z.enum(["draft", "active"]).optional(),
  attributes: z.array(entityAttributeSchema).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const listEntityDefinitionsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["entityKey", "entityName", "updatedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  entityKeyPrefix: keySchema.optional(),
  entityNamePrefix: z.string().trim().min(1).transform((value) => value.toLowerCase()).optional(),
  status: statusSchema.optional(),
});

export const exportEntityDefinitionsBodySchema = strictObject({
  entityDefinitionVersionIds: z.array(uuidSchema).optional(),
  entityKeys: z.array(keySchema).optional(),
});
