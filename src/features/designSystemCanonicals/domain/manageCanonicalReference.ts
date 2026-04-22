import {
  CanonicalFamilyNotFoundError,
  CanonicalReferenceConflictError,
  CanonicalReferenceNotFoundError,
} from "../contract/errors";
import { createDesignSystemCanonicalId } from "./helpers";
import {
  toCanonicalReferenceResponse,
  type CreateCanonicalReferenceInput,
  type UpdateCanonicalReferenceInput,
} from "./types";
import type { DesignSystemCanonicalsRepository } from "../persistence/repository";

export async function createCanonicalReference(
  repository: DesignSystemCanonicalsRepository,
  input: CreateCanonicalReferenceInput,
) {
  const family = await repository.findFamilyById(input.canonicalFamilyId);
  if (!family) {
    throw new CanonicalFamilyNotFoundError();
  }

  const existingReference = await repository.findReferenceByFamilyAndReferenceId(
    family.familyKey,
    input.referenceId,
  );
  if (existingReference) {
    throw new CanonicalReferenceConflictError("referenceId");
  }

  const existingRoute = await repository.findReferenceByRenderRoutePath(input.renderRoutePath);
  if (existingRoute) {
    throw new CanonicalReferenceConflictError("renderRoutePath");
  }

  return toCanonicalReferenceResponse(
    await repository.createReference({
      canonicalReferenceId: createDesignSystemCanonicalId(),
      canonicalFamilyId: family.canonicalFamilyId,
      familyKey: family.familyKey,
      referenceId: input.referenceId,
      displayLabel: input.displayLabel,
      description: input.description,
      renderRoutePath: input.renderRoutePath,
      legacyRenderRoutePath: input.legacyRenderRoutePath ?? null,
      viewport: input.viewport ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      theme: input.theme ?? "normal",
      direction: input.direction ?? "ltr",
      zoom: input.zoom ?? 0,
      localeFixture: input.localeFixture ?? null,
      labelDensityFixture: input.labelDensityFixture ?? null,
      stateVariantKey: input.stateVariantKey ?? null,
      specimenPayload: input.specimenPayload ?? {},
      status: input.status ?? "draft",
      sortOrder: input.sortOrder ?? 0,
      featured: input.featured ?? false,
    }),
  );
}

export async function updateCanonicalReference(
  repository: DesignSystemCanonicalsRepository,
  input: UpdateCanonicalReferenceInput,
) {
  const existing = await repository.findReferenceById(input.canonicalReferenceId);
  if (!existing) {
    throw new CanonicalReferenceNotFoundError();
  }

  if (input.renderRoutePath && input.renderRoutePath !== existing.renderRoutePath) {
    const conflict = await repository.findReferenceByRenderRoutePath(input.renderRoutePath);
    if (conflict && conflict.canonicalReferenceId !== existing.canonicalReferenceId) {
      throw new CanonicalReferenceConflictError("renderRoutePath");
    }
  }

  return toCanonicalReferenceResponse(
    await repository.updateReference({
      canonicalReferenceId: existing.canonicalReferenceId,
      displayLabel: input.displayLabel ?? existing.displayLabel,
      description: input.description ?? existing.description,
      renderRoutePath: input.renderRoutePath ?? existing.renderRoutePath,
      legacyRenderRoutePath:
        input.legacyRenderRoutePath !== undefined
          ? input.legacyRenderRoutePath
          : existing.legacyRenderRoutePath,
      viewport: input.viewport !== undefined ? input.viewport : existing.viewport,
      width: input.width !== undefined ? input.width : existing.width,
      height: input.height !== undefined ? input.height : existing.height,
      theme: input.theme ?? existing.theme,
      direction: input.direction ?? existing.direction,
      zoom: input.zoom ?? existing.zoom,
      localeFixture:
        input.localeFixture !== undefined ? input.localeFixture : existing.localeFixture,
      labelDensityFixture:
        input.labelDensityFixture !== undefined
          ? input.labelDensityFixture
          : existing.labelDensityFixture,
      stateVariantKey:
        input.stateVariantKey !== undefined ? input.stateVariantKey : existing.stateVariantKey,
      specimenPayload: input.specimenPayload ?? existing.specimenPayload,
      status: input.status ?? existing.status,
      sortOrder: input.sortOrder ?? existing.sortOrder,
      featured: input.featured ?? existing.featured,
    }),
  );
}

