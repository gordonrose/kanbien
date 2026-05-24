import {
  EntityNameAlreadyExistsError,
  InvalidRequestError,
} from "../contract/errors";
import type { EntityRepository } from "../persistence/repository";
import type { CreateEntityInput, EntityScope } from "./types";

export async function assertEntityNameAvailable(
  repository: EntityRepository,
  name: string,
  currentEntityId?: string,
) {
  const collision = await repository.findCurrentByName(name);
  if (collision && collision.entityId !== currentEntityId) {
    throw new EntityNameAlreadyExistsError();
  }
}

export function assertSharedCrossTenantApproved(
  scope: EntityScope | undefined,
  approved: boolean | undefined,
): void {
  if (scope === "shared-cross-tenant" && approved !== true) {
    throw new InvalidRequestError(
      "Shared cross-tenant Entity scope requires explicit approval.",
      {
        field: "scope",
        reason: "shared_cross_tenant_requires_explicit_approval",
      },
    );
  }
}

export function resolveCreateIdentity(input: CreateEntityInput) {
  assertSharedCrossTenantApproved(input.scope, input.sharedCrossTenantApproved);
  const entityKey = input.entityKey ?? singularizeFeatureName(input.featureName);
  const idField = input.idField ?? `${entityKey}Id`;
  return {
    entityKey,
    featureName: input.featureName,
    tableName: input.tableName ?? entityKey,
    idField,
    idColumn: input.idColumn ?? toSnakeCase(idField),
    scope: input.scope,
    routeBase: input.routeBase ?? `/${input.featureName}`,
  };
}

function singularizeFeatureName(featureName: string): string {
  if (featureName.endsWith("ies") && featureName.length > 3) {
    return `${featureName.slice(0, -3)}y`;
  }
  if (featureName.endsWith("s") && featureName.length > 1) {
    return featureName.slice(0, -1);
  }
  return featureName;
}

function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}
