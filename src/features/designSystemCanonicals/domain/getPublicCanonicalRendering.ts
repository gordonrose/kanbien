import {
  CanonicalFamilyNotFoundError,
  CanonicalReferenceNotFoundError,
} from "../contract/errors";
import {
  toCanonicalFamilyResponse,
  toCanonicalReferenceResponse,
  type DesignSystemCanonicalHierarchyNode,
} from "./types";
import type { DesignSystemCanonicalsRepository } from "../persistence/repository";

export async function getPublicCanonicalRendering(
  repository: DesignSystemCanonicalsRepository,
  familyKey: string,
  referenceId: string,
) {
  const family = await repository.findLiveFamilyByKey(familyKey);
  if (!family) {
    throw new CanonicalFamilyNotFoundError("familyKey");
  }

  const reference = await repository.findLiveReferenceByFamilyAndReferenceId(
    familyKey,
    referenceId,
  );
  if (!reference) {
    throw new CanonicalReferenceNotFoundError("referenceId");
  }

  return {
    family: toCanonicalFamilyResponse(family),
    reference: toCanonicalReferenceResponse(reference),
  };
}

export async function listLiveCanonicalHierarchyNodes(
  repository: DesignSystemCanonicalsRepository,
): Promise<DesignSystemCanonicalHierarchyNode[]> {
  const families = await repository.listLiveFamilies();
  const nodes: DesignSystemCanonicalHierarchyNode[] = [];

  for (const family of families) {
    const references = await repository.listLiveReferencesByFamilyKey(family.familyKey);
    nodes.push({
      familyKey: family.familyKey,
      familyDisplayLabel: family.displayLabel,
      launcherRoutePath: family.generatedLauncherRoutePath,
      rootRoutePath: family.generatedRootRoutePath,
      launcherTemplateKey: family.launcherTemplateKey,
      renderTemplateKey: family.renderTemplateKey,
      references: references.map((reference) => ({
        referenceId: reference.referenceId,
        displayLabel: reference.displayLabel,
        renderRoutePath: reference.renderRoutePath,
      })),
    });
  }

  return nodes;
}

