import { OrganizationNotFoundError } from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization } from "./presenters";
import { assertNoActiveChildren, recordOrganizationAudit, requireNonDeletedOrganization } from "./rules";
import type { Organization, SoftDeleteOrganizationInput } from "./types";

export async function softDeleteOrganization(
  repository: OrganizationCoreRepository,
  input: SoftDeleteOrganizationInput,
): Promise<Organization> {
  await requireNonDeletedOrganization(repository, input.tenantId, input.organizationId);
  await assertNoActiveChildren(repository, input.tenantId, input.organizationId);

  const organization = await repository.softDelete(input.tenantId, input.organizationId);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }

  await recordOrganizationAudit(repository, {
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: "organization_deleted",
  });

  return toOrganization(organization);
}
