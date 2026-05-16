import type {
  OrganizationLogoAuditEventInput,
  OrganizationLogoRelationshipData,
} from "../domain/types";

export interface OrganizationLogoRepository {
  findOrganizationSummaryById(organizationId: string): Promise<{
    tenantId: string;
    organizationId: string;
    name: string;
  } | null>;
  findCurrent(tenantId: string, organizationId: string): Promise<OrganizationLogoRelationshipData | null>;
  findCurrentByOrganizationId(organizationId: string): Promise<OrganizationLogoRelationshipData | null>;
  replaceCurrent(input: {
    organizationLogoRelationshipId: string;
    tenantId: string;
    organizationId: string;
    assetId: string;
    altText: string;
  }): Promise<OrganizationLogoRelationshipData>;
  removeCurrent(tenantId: string, organizationId: string): Promise<OrganizationLogoRelationshipData | null>;
  recordAuditEvent(input: OrganizationLogoAuditEventInput): Promise<void>;
}
