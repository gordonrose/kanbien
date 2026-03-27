import { DEFAULT_TEST_ARTIFACTS_DIR, registerManifestRecords } from "../../../src/lib/testingData/manifest";
import type { CleanupEntity, ManifestRecord } from "../../../src/lib/testingData/types";

export interface DurableTestDataHelperOptions {
  testRunId: string;
  artifactsDir?: string;
  registerRecords?: typeof registerManifestRecords;
}

function sanitizeSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "test";
}

export function createTaggedEmail(testRunId: string, localPart: string): string {
  return `${sanitizeSegment(localPart)}.${testRunId}@example.test`;
}

export function createTaggedLabel(testRunId: string, label: string): string {
  return `${sanitizeSegment(label)}-${testRunId}`;
}

export function createDurableTestDataHelper(options: DurableTestDataHelperOptions) {
  const artifactsDir = options.artifactsDir ?? DEFAULT_TEST_ARTIFACTS_DIR;
  const register = options.registerRecords ?? registerManifestRecords;

  function registerRecords(records: ManifestRecord[]) {
    return register(options.testRunId, records, artifactsDir);
  }

  function registerRecord(entity: CleanupEntity, id: string) {
    return registerRecords([{ entity, id }]);
  }

  return {
    testRunId: options.testRunId,
    artifactsDir,
    createEmail(localPart: string) {
      return createTaggedEmail(options.testRunId, localPart);
    },
    createLabel(label: string) {
      return createTaggedLabel(options.testRunId, label);
    },
    registerRecord,
    registerRecords,
  };
}
