import { OrganizationNotFoundError } from "../contract/errors";
import type { OrganizationCoreRepository } from "../persistence/repository";
import { toOrganization, toOrganizationListResult } from "./presenters";
import type { GetOrganizationInput, Organization, OrganizationListInput, OrganizationListResult } from "./types";

export async function getOrganization(
  repository: OrganizationCoreRepository,
  input: GetOrganizationInput,
): Promise<Organization> {
  const organization = await repository.findActiveById(input.tenantId, input.organizationId);
  if (!organization) {
    throw new OrganizationNotFoundError();
  }
  return toOrganization(organization);
}

export async function listOrganizations(
  repository: OrganizationCoreRepository,
  input: OrganizationListInput,
): Promise<OrganizationListResult> {
  return toOrganizationListResult(input, await repository.listActive(input));
}
