import { OrganizationLifecycleConflictError, OrganizationNotFoundError } from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization } from "./presenters";
import {
  assertHierarchyMoveAllowed,
  recordOrganizationAudit,
  requireActiveOrganization,
} from "./rules";
import type { ArchiveOrganizationInput, Organization } from "./types";

export async function archiveOrganization(
  repository: OrganizationCoreRepository,
  input: ArchiveOrganizationInput,
): Promise<Organization> {
  await requireActiveOrganization(repository, input.tenantId, input.organizationId);
  const children = await repository.listActiveChildren(input.tenantId, input.organizationId);
  let archivedIds = [input.organizationId];

  if (input.childHandling === "archiveBranch") {
    const descendants = await repository.listNonDeletedDescendants(input.tenantId, input.organizationId);
    archivedIds = [input.organizationId, ...descendants.map((item) => item.organizationId)];
  } else {
    if (!input.replacementParentOrganizationId) {
      throw new OrganizationLifecycleConflictError("Replacement parent is required when moving children.");
    }
    const descendants = await repository.listNonDeletedDescendants(input.tenantId, input.organizationId);
    if (
      input.replacementParentOrganizationId === input.organizationId ||
      descendants.some((item) => item.organizationId === input.replacementParentOrganizationId)
    ) {
      throw new OrganizationLifecycleConflictError(
        "Replacement parent must be outside the archived branch.",
      );
    }
    await requireActiveOrganization(repository, input.tenantId, input.replacementParentOrganizationId);
    for (const child of children) {
      await assertHierarchyMoveAllowed(
        repository,
        input.tenantId,
        child.organizationId,
        input.replacementParentOrganizationId,
      );
      await repository.move(input.tenantId, child.organizationId, input.replacementParentOrganizationId);
    }
  }

  const organization = await repository.archive(input.tenantId, archivedIds);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }

  await recordOrganizationAudit(repository, {
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: "organization_archived",
    eventDetails: {
      childHandling: input.childHandling,
      replacementParentOrganizationId: input.replacementParentOrganizationId ?? null,
      archivedOrganizationIds: archivedIds,
    },
  });

  return toOrganization(organization);
}
