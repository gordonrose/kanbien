import { OrganizationNotFoundError } from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization } from "./presenters";
import { assertActiveNameAvailable, assertHierarchyMoveAllowed, recordOrganizationAudit } from "./rules";
import type { Organization, RestoreOrganizationInput } from "./types";

export async function restoreOrganization(
  repository: OrganizationCoreRepository,
  input: RestoreOrganizationInput,
): Promise<Organization> {
  const archived = await repository.findArchivedById(input.tenantId, input.organizationId);
  if (!archived) {
    throw new OrganizationNotFoundError();
  }

  await assertActiveNameAvailable(repository, input.tenantId, archived.name, input.organizationId);
  await assertHierarchyMoveAllowed(
    repository,
    input.tenantId,
    input.organizationId,
    archived.parentOrganizationId,
  );

  const organization = await repository.restore(input.tenantId, input.organizationId);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }

  await recordOrganizationAudit(repository, {
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: "organization_restored",
  });

  return toOrganization(organization);
}
