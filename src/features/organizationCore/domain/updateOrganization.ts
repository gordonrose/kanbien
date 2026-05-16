import { OrganizationNotFoundError } from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization } from "./presenters";
import { assertActiveNameAvailable, recordOrganizationAudit } from "./rules";
import type { Organization, UpdateOrganizationInput } from "./types";

export async function updateOrganization(
  repository: OrganizationCoreRepository,
  input: UpdateOrganizationInput,
): Promise<Organization> {
  if (input.name !== undefined) {
    await assertActiveNameAvailable(repository, input.tenantId, input.name, input.organizationId);
  }

  const organization = await repository.update(input);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }

  await recordOrganizationAudit(repository, {
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: "organization_updated",
  });

  return toOrganization(organization);
}
