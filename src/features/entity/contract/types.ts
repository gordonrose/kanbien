import type { z } from "zod";
import type {
  createEntityBodySchema,
  deleteEntityParamsSchema,
  getEntityParamsSchema,
  getEntityQuerySchema,
  listEntitiesQuerySchema,
  updateEntityBodySchema,
  updateEntityParamsSchema,
} from "./schemas";
import type { Entity, EntityListResult } from "../domain/types";

export type CreateEntityRequest = z.infer<typeof createEntityBodySchema>;
export type GetEntityParams = z.infer<typeof getEntityParamsSchema>;
export type GetEntityQuery = z.infer<typeof getEntityQuerySchema>;
export type ListEntitiesQuery = z.infer<typeof listEntitiesQuerySchema>;
export type UpdateEntityParams = z.infer<typeof updateEntityParamsSchema>;
export type UpdateEntityRequest = z.infer<typeof updateEntityBodySchema>;
export type DeleteEntityParams = z.infer<typeof deleteEntityParamsSchema>;

export type CreateEntityResponse = Entity;
export type GetEntityResponse = Entity;
export type ListEntitiesResponse = EntityListResult;
export type UpdateEntityResponse = Entity;
export type DeleteEntityResponse = Entity;
