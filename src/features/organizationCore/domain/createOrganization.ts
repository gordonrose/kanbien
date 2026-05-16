import { randomUUID } from "node:crypto";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization } from "./presenters";
import {
  assertActiveNameAvailable,
  assertHierarchyMoveAllowed,
  recordOrganizationAudit,
  requireActiveOrganization,
} from "./rules";
import type { CreateOrganizationInput, Organization } from "./types";

export async function createOrganization(
  repository: OrganizationCoreRepository,
  input: CreateOrganizationInput,
): Promise<Organization> {
  await assertActiveNameAvailable(repository, input.tenantId, input.name);

  if (input.parentOrganizationId) {
    await requireActiveOrganization(repository, input.tenantId, input.parentOrganizationId);
    await assertHierarchyMoveAllowed(repository, input.tenantId, randomUUID(), input.parentOrganizationId);
  }

  const organization = await repository.create({
    organizationId: randomUUID(),
    tenantId: input.tenantId,
    parentOrganizationId: input.parentOrganizationId ?? null,
    name: input.name,
    organizationTypeReferenceValueId: input.organizationTypeReferenceValueId ?? null,
  });

  await recordOrganizationAudit(repository, {
    tenantId: input.tenantId,
    organizationId: organization.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: "organization_created",
  });

  return toOrganization(organization);
}
