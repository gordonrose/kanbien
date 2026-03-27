import { cleanupEntities, type CleanupEntity, type ManifestRecord } from "./types";

export const cleanupOrder = [...cleanupEntities];

export interface CleanupPlanStep {
  entity: CleanupEntity;
  ids: string[];
}

export function buildCleanupPlan(records: ManifestRecord[]): CleanupPlanStep[] {
  const idsByEntity = new Map<CleanupEntity, Set<string>>();

  for (const entity of cleanupOrder) {
    idsByEntity.set(entity, new Set<string>());
  }

  for (const record of records) {
    idsByEntity.get(record.entity)?.add(record.id);
  }

  return cleanupOrder.map((entity) => ({
    entity,
    ids: [...(idsByEntity.get(entity) ?? new Set<string>())].sort(),
  }));
}
