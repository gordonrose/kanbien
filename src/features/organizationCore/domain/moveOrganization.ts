import { OrganizationNotFoundError } from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization } from "./presenters";
import { assertHierarchyMoveAllowed, recordOrganizationAudit, requireActiveOrganization } from "./rules";
import type { MoveOrganizationInput, Organization } from "./types";

export async function moveOrganization(
  repository: OrganizationCoreRepository,
  input: MoveOrganizationInput,
): Promise<Organization> {
  await requireActiveOrganization(repository, input.tenantId, input.organizationId);
  await assertHierarchyMoveAllowed(
    repository,
    input.tenantId,
    input.organizationId,
    input.parentOrganizationId,
  );

  const organization = await repository.move(
    input.tenantId,
    input.organizationId,
    input.parentOrganizationId,
  );
  if (!organization) {
    throw new OrganizationNotFoundError();
  }

  await recordOrganizationAudit(repository, {
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: "organization_moved",
    eventDetails: { parentOrganizationId: input.parentOrganizationId },
  });

  return toOrganization(organization);
}
