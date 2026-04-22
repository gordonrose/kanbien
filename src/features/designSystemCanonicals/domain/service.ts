import { getPublicCanonicalRendering, listLiveCanonicalHierarchyNodes } from "./getPublicCanonicalRendering";
import {
  getPublicCanonicalLauncher,
  listPublicCanonicalFamilies,
} from "./getPublicCanonicalLauncher";
import { createCanonicalFamily, updateCanonicalFamily } from "./manageCanonicalFamily";
import { createCanonicalReference, updateCanonicalReference } from "./manageCanonicalReference";
import type {
  DesignSystemCanonicalFamilyResponse,
  DesignSystemCanonicalReferenceResponse,
} from "../contract/types";
import type {
  CreateCanonicalFamilyInput,
  CreateCanonicalReferenceInput,
  DesignSystemCanonicalsPublicSeam,
  UpdateCanonicalFamilyInput,
  UpdateCanonicalReferenceInput,
} from "./types";
import type { DesignSystemCanonicalsRepository } from "../persistence/repository";
import { toCanonicalFamilyResponse, toCanonicalReferenceResponse } from "./types";

export interface DesignSystemCanonicalsService extends DesignSystemCanonicalsPublicSeam {
  createCanonicalFamily(input: CreateCanonicalFamilyInput): ReturnType<typeof createCanonicalFamily>;
  updateCanonicalFamily(input: UpdateCanonicalFamilyInput): ReturnType<typeof updateCanonicalFamily>;
  createCanonicalReference(input: CreateCanonicalReferenceInput): ReturnType<typeof createCanonicalReference>;
  updateCanonicalReference(
    input: UpdateCanonicalReferenceInput,
  ): ReturnType<typeof updateCanonicalReference>;
  getCanonicalFamilyById(canonicalFamilyId: string): Promise<DesignSystemCanonicalFamilyResponse | null>;
  getCanonicalReferenceById(canonicalReferenceId: string): Promise<DesignSystemCanonicalReferenceResponse | null>;
}

export function createDesignSystemCanonicalsService(
  repository: DesignSystemCanonicalsRepository,
): DesignSystemCanonicalsService {
  return {
    createCanonicalFamily: (input) => createCanonicalFamily(repository, input),
    updateCanonicalFamily: (input) => updateCanonicalFamily(repository, input),
    createCanonicalReference: (input) => createCanonicalReference(repository, input),
    updateCanonicalReference: (input) => updateCanonicalReference(repository, input),
    listLiveFamilies: () => listPublicCanonicalFamilies(repository),
    getPublicLauncherByFamilyKey: (familyKey) => getPublicCanonicalLauncher(repository, familyKey),
    getPublicRenderingByFamilyKeyAndReferenceId: (familyKey, referenceId) =>
      getPublicCanonicalRendering(repository, familyKey, referenceId),
    listLiveHierarchyNodes: () => listLiveCanonicalHierarchyNodes(repository),
    getCanonicalFamilyById: async (canonicalFamilyId) => {
      const family = await repository.findFamilyById(canonicalFamilyId);
      return family ? toCanonicalFamilyResponse(family) : null;
    },
    getCanonicalReferenceById: async (canonicalReferenceId) => {
      const reference = await repository.findReferenceById(canonicalReferenceId);
      return reference ? toCanonicalReferenceResponse(reference) : null;
    },
  };
}
