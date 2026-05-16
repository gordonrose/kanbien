export type OrganizationReferenceValueLifecycleStatus = "active" | "archived" | "deprecated" | "replaced";

export interface OrganizationReferenceValueData {
  referenceValueId: string;
  referenceType: string;
  referenceValueKey: string;
  label: string;
  replacementReferenceValueId: string | null;
  lifecycleStatus: OrganizationReferenceValueLifecycleStatus;
  archivedAt: Date | null;
  deprecatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationReferenceValue {
  referenceValueId: string;
  referenceType: string;
  referenceValueKey: string;
  label: string;
  replacementReferenceValueId: string | null;
  lifecycleStatus: OrganizationReferenceValueLifecycleStatus;
  archivedAt: string | null;
  deprecatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceValueActorInput {
  actorType: "root-user" | "tenant-admin";
  actorId: string;
}

export interface CreateReferenceValueInput extends ReferenceValueActorInput {
  referenceType: string;
  referenceValueKey: string;
  label: string;
}

export interface ListReferenceValuesInput {
  referenceType?: string;
  lifecycleStatus?: OrganizationReferenceValueLifecycleStatus;
  includeRetained: boolean;
  page: number;
  pageSize: number;
  orderBy: "label" | "referenceType" | "createdAt" | "updatedAt";
  orderDirection: "asc" | "desc";
}

export interface ReferenceValueListResult {
  items: OrganizationReferenceValue[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalMatchingRecords: number;
  totalSearchableRecords: number;
}

export interface UpdateReferenceValueInput extends ReferenceValueActorInput {
  referenceValueId: string;
  label: string;
}

export interface ReferenceValueLifecycleInput extends ReferenceValueActorInput {
  referenceValueId: string;
}

export interface ReplaceReferenceValueInput extends ReferenceValueActorInput {
  referenceValueId: string;
  replacementReferenceValueId: string;
}
