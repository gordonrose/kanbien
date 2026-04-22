import type {
  CapabilityExactRecord,
  CapabilityPickerSummary,
  CapabilityRegistryStatus,
  ExportCatalogResult,
  MaterializeCatalogResult,
  PaginatedResult,
} from "../domain/types";

export interface ListCapabilityCatalogResponse extends PaginatedResult<CapabilityPickerSummary> {}

export interface GetCapabilityCatalogEntryResponse extends CapabilityExactRecord {}

export interface ExportCapabilityCatalogResponse extends ExportCatalogResult {}

export interface MaterializeCapabilityCatalogResponse extends MaterializeCatalogResult {}

export interface AuditCapabilityCatalogDriftResponse {
  items: CapabilityRegistryStatus[];
}
