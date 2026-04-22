import type { CapabilityRecordData } from "../domain/types";

export interface CapabilityContractCatalogRepository {
  materializeRecords(records: CapabilityRecordData[]): Promise<{ insertedCount: number; updatedCount: number }>;
  listAllRecords(): Promise<CapabilityRecordData[]>;
  findRecordByCapabilityId(capabilityId: string): Promise<CapabilityRecordData | null>;
}
