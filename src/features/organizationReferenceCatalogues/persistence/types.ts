import type { OrganizationReferenceValueData, OrganizationReferenceValueLifecycleStatus } from "../domain/types";

export interface CreateReferenceValueRecordInput {
  referenceValueId: string;
  referenceType: string;
  referenceValueKey: string;
  label: string;
}

export interface ListReferenceValueRecordInput {
  referenceType?: string;
  lifecycleStatus?: OrganizationReferenceValueLifecycleStatus;
  includeRetained: boolean;
  page: number;
  pageSize: number;
  orderBy: "label" | "referenceType" | "createdAt" | "updatedAt";
  orderDirection: "asc" | "desc";
}

export interface ListReferenceValueRecordResult {
  items: OrganizationReferenceValueData[];
  totalMatchingRecords: number;
  totalSearchableRecords: number;
}

export interface ReferenceValueAuditEventInput {
  eventId: string;
  referenceValueId: string;
  actorType: "root-user" | "tenant-admin";
  actorId: string;
  eventType: string;
  eventOutcome: "success" | "denied" | "failure";
  eventDetails: Record<string, unknown>;
  occurredAt: Date;
}

export interface OrganizationReferenceCataloguesRepository {
  create(input: CreateReferenceValueRecordInput): Promise<OrganizationReferenceValueData>;
  list(input: ListReferenceValueRecordInput): Promise<ListReferenceValueRecordResult>;
  findById(referenceValueId: string): Promise<OrganizationReferenceValueData | null>;
  updateLabel(referenceValueId: string, label: string): Promise<OrganizationReferenceValueData | null>;
  archive(referenceValueId: string): Promise<OrganizationReferenceValueData | null>;
  deprecate(referenceValueId: string): Promise<OrganizationReferenceValueData | null>;
  replace(referenceValueId: string, replacementReferenceValueId: string): Promise<OrganizationReferenceValueData | null>;
  recordAuditEvent(input: ReferenceValueAuditEventInput): Promise<void>;
}
