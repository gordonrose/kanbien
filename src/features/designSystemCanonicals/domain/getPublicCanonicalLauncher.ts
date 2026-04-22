import { CanonicalFamilyNotFoundError } from "../contract/errors";
import {
  toCanonicalFamilyResponse,
  toCanonicalReferenceResponse,
} from "./types";
import type { DesignSystemCanonicalsRepository } from "../persistence/repository";

export async function listPublicCanonicalFamilies(
  repository: DesignSystemCanonicalsRepository,
) {
  return {
    items: (await repository.listLiveFamilies()).map(toCanonicalFamilyResponse),
  };
}

export async function getPublicCanonicalLauncher(
  repository: DesignSystemCanonicalsRepository,
  familyKey: string,
) {
  const family = await repository.findLiveFamilyByKey(familyKey);
  if (!family) {
    throw new CanonicalFamilyNotFoundError("familyKey");
  }

  const references = await repository.listLiveReferencesByFamilyKey(familyKey);
  return {
    family: toCanonicalFamilyResponse(family),
    references: references.map(toCanonicalReferenceResponse),
  };
}

