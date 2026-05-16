import type { OrganizationCoreRepository } from "../persistence/repository";
import { archiveOrganization } from "./archiveOrganization";
import { createOrganization } from "./createOrganization";
import { softDeleteOrganization } from "./deleteOrganization";
import { moveOrganization } from "./moveOrganization";
import { getOrganization, listOrganizations } from "./readOrganization";
import { restoreOrganization } from "./restoreOrganization";
import { updateOrganization } from "./updateOrganization";
import type {
  ArchiveOrganizationInput,
  CreateOrganizationInput,
  GetOrganizationInput,
  MoveOrganizationInput,
  Organization,
  OrganizationListInput,
  OrganizationListResult,
  RestoreOrganizationInput,
  SoftDeleteOrganizationInput,
  UpdateOrganizationInput,
} from "./types";

export interface OrganizationCoreService {
  createOrganization(input: CreateOrganizationInput): Promise<Organization>;
  getOrganization(input: GetOrganizationInput): Promise<Organization>;
  listOrganizations(input: OrganizationListInput): Promise<OrganizationListResult>;
  updateOrganization(input: UpdateOrganizationInput): Promise<Organization>;
  moveOrganization(input: MoveOrganizationInput): Promise<Organization>;
  archiveOrganization(input: ArchiveOrganizationInput): Promise<Organization>;
  restoreOrganization(input: RestoreOrganizationInput): Promise<Organization>;
  softDeleteOrganization(input: SoftDeleteOrganizationInput): Promise<Organization>;
}

export function createOrganizationCoreService(
  repository: OrganizationCoreRepository,
): OrganizationCoreService {
  return {
    createOrganization: (input) => createOrganization(repository, input),
    getOrganization: (input) => getOrganization(repository, input),
    listOrganizations: (input) => listOrganizations(repository, input),
    updateOrganization: (input) => updateOrganization(repository, input),
    moveOrganization: (input) => moveOrganization(repository, input),
    archiveOrganization: (input) => archiveOrganization(repository, input),
    restoreOrganization: (input) => restoreOrganization(repository, input),
    softDeleteOrganization: (input) => softDeleteOrganization(repository, input),
  };
}
