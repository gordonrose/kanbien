import type { OrganizationReferenceValue, OrganizationReferenceValueData } from "./types";

export function toReferenceValue(record: OrganizationReferenceValueData): OrganizationReferenceValue {
  return {
    referenceValueId: record.referenceValueId,
    referenceType: record.referenceType,
    referenceValueKey: record.referenceValueKey,
    label: record.label,
    replacementReferenceValueId: record.replacementReferenceValueId,
    lifecycleStatus: record.lifecycleStatus,
    archivedAt: record.archivedAt?.toISOString() ?? null,
    deprecatedAt: record.deprecatedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
