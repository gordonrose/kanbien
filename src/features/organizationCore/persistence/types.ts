import type { OrganizationData, OrganizationLifecycleStatus, OrganizationActorType } from "../domain/types";

export interface OrganizationRecord {
  organization_id: string;
  tenant_id: string;
  parent_organization_id: string | null;
  name: string;
  normalized_name: string;
  organization_type_reference_value_id: string | null;
  lifecycle_status: OrganizationLifecycleStatus;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateOrganizationRecordInput {
  organizationId: string;
  tenantId: string;
  parentOrganizationId: string | null;
  name: string;
  organizationTypeReferenceValueId: string | null;
}

export interface UpdateOrganizationRecordInput {
  tenantId: string;
  organizationId: string;
  name?: string;
  organizationTypeReferenceValueId?: string | null;
}

export interface OrganizationRepositoryListInput {
  tenantId: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: {
    namePrefix?: string;
    parentOrganizationId?: string | null;
    lifecycleStatus?: OrganizationLifecycleStatus;
    createdAtFrom?: string;
    createdAtTo?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
  };
}

export interface OrganizationRepositoryListResult {
  items: OrganizationData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface OrganizationAuditEventInput {
  eventId: string;
  tenantId: string;
  organizationId: string | null;
  actorType: OrganizationActorType;
  actorId: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  eventDetails?: Record<string, unknown>;
  occurredAt: Date;
}
