import {
  CanonicalFamilyConflictError,
  CanonicalFamilyNotFoundError,
} from "../contract/errors";
import { createDesignSystemCanonicalId } from "./helpers";
import { toCanonicalFamilyResponse, type CreateCanonicalFamilyInput, type UpdateCanonicalFamilyInput } from "./types";
import type { DesignSystemCanonicalsRepository } from "../persistence/repository";

export async function createCanonicalFamily(
  repository: DesignSystemCanonicalsRepository,
  input: CreateCanonicalFamilyInput,
) {
  const existingByKey = await repository.findFamilyByKey(input.familyKey);
  if (existingByKey) {
    throw new CanonicalFamilyConflictError("familyKey");
  }

  const existingByRoute = await repository.findFamilyByGeneratedLauncherRoutePath(
    input.generatedLauncherRoutePath,
  );
  if (existingByRoute) {
    throw new CanonicalFamilyConflictError("generatedLauncherRoutePath");
  }

  return toCanonicalFamilyResponse(
    await repository.createFamily({
      canonicalFamilyId: createDesignSystemCanonicalId(),
      familyKey: input.familyKey,
      displayLabel: input.displayLabel,
      familyKind: input.familyKind,
      launcherTitle: input.launcherTitle,
      launcherDescription: input.launcherDescription,
      launcherCategory: input.launcherCategory ?? null,
      generatedLauncherRoutePath: input.generatedLauncherRoutePath,
      generatedRootRoutePath: input.generatedRootRoutePath,
      legacyLauncherRoutePath: input.legacyLauncherRoutePath ?? null,
      sourceSurfaceRoutePath: input.sourceSurfaceRoutePath ?? null,
      status: input.status ?? "draft",
      sortOrder: input.sortOrder ?? 0,
      featured: input.featured ?? false,
    }),
  );
}

export async function updateCanonicalFamily(
  repository: DesignSystemCanonicalsRepository,
  input: UpdateCanonicalFamilyInput,
) {
  const existing = await repository.findFamilyById(input.canonicalFamilyId);
  if (!existing) {
    throw new CanonicalFamilyNotFoundError();
  }

  if (input.generatedLauncherRoutePath && input.generatedLauncherRoutePath !== existing.generatedLauncherRoutePath) {
    const conflicting = await repository.findFamilyByGeneratedLauncherRoutePath(
      input.generatedLauncherRoutePath,
    );
    if (conflicting && conflicting.canonicalFamilyId !== existing.canonicalFamilyId) {
      throw new CanonicalFamilyConflictError("generatedLauncherRoutePath");
    }
  }

  return toCanonicalFamilyResponse(
    await repository.updateFamily({
      canonicalFamilyId: existing.canonicalFamilyId,
      displayLabel: input.displayLabel ?? existing.displayLabel,
      familyKind: input.familyKind ?? existing.familyKind,
      launcherTitle: input.launcherTitle ?? existing.launcherTitle,
      launcherDescription: input.launcherDescription ?? existing.launcherDescription,
      launcherCategory:
        input.launcherCategory !== undefined ? input.launcherCategory : existing.launcherCategory,
      generatedLauncherRoutePath:
        input.generatedLauncherRoutePath ?? existing.generatedLauncherRoutePath,
      generatedRootRoutePath: input.generatedRootRoutePath ?? existing.generatedRootRoutePath,
      legacyLauncherRoutePath:
        input.legacyLauncherRoutePath !== undefined
          ? input.legacyLauncherRoutePath
          : existing.legacyLauncherRoutePath,
      sourceSurfaceRoutePath:
        input.sourceSurfaceRoutePath !== undefined
          ? input.sourceSurfaceRoutePath
          : existing.sourceSurfaceRoutePath,
      status: input.status ?? existing.status,
      sortOrder: input.sortOrder ?? existing.sortOrder,
      featured: input.featured ?? existing.featured,
    }),
  );
}

