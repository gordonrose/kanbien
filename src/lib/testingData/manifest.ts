import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { isValidTestRunId } from "./runId";
import {
  cleanupEntities,
  isCleanupEntity,
  type CleanupEntity,
  type ManifestRecord,
  type TestRunManifest,
} from "./types";

export const DEFAULT_TEST_ARTIFACTS_DIR = ".test-artifacts";

function ensureArtifactsDir(artifactsDir: string) {
  mkdirSync(artifactsDir, { recursive: true });
}

function assertValidManifestRecord(record: ManifestRecord) {
  if (!isCleanupEntity(record.entity)) {
    throw new Error(`Unsupported cleanup entity: ${String(record.entity)}`);
  }

  if (!record.id || typeof record.id !== "string") {
    throw new Error("Manifest record IDs must be non-empty strings.");
  }
}

function assertValidManifestShape(manifest: TestRunManifest) {
  if (!isValidTestRunId(manifest.testRunId)) {
    throw new Error(`Invalid manifest testRunId: ${manifest.testRunId}`);
  }

  if (!manifest.createdAt || Number.isNaN(Date.parse(manifest.createdAt))) {
    throw new Error("Manifest createdAt must be a valid ISO-8601 timestamp.");
  }

  if (!Array.isArray(manifest.records)) {
    throw new Error("Manifest records must be an array.");
  }

  for (const record of manifest.records) {
    assertValidManifestRecord(record);
  }
}

export function createManifestPath(testRunId: string, artifactsDir = DEFAULT_TEST_ARTIFACTS_DIR): string {
  return resolve(join(artifactsDir, `${testRunId}.json`));
}

export function createEmptyManifest(
  testRunId: string,
  createdAt = new Date(),
): TestRunManifest {
  if (!isValidTestRunId(testRunId)) {
    throw new Error(`Invalid testRunId: ${testRunId}`);
  }

  return {
    testRunId,
    createdAt: createdAt.toISOString(),
    records: [],
  };
}

export function appendManifestRecords(
  manifest: TestRunManifest,
  records: ManifestRecord[],
): TestRunManifest {
  assertValidManifestShape(manifest);
  for (const record of records) {
    assertValidManifestRecord(record);
  }

  const existingKeys = new Set(manifest.records.map((record) => `${record.entity}:${record.id}`));
  const mergedRecords = [...manifest.records];

  for (const record of records) {
    const key = `${record.entity}:${record.id}`;

    if (existingKeys.has(key)) {
      continue;
    }

    existingKeys.add(key);
    mergedRecords.push(record);
  }

  return {
    ...manifest,
    records: mergedRecords,
  };
}

export function readManifestFile(path: string): TestRunManifest {
  let raw: unknown;

  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(
      `Failed to read manifest at ${path}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const manifest = raw as TestRunManifest;
  assertValidManifestShape(manifest);
  return manifest;
}

export function readManifestByRunId(
  testRunId: string,
  artifactsDir = DEFAULT_TEST_ARTIFACTS_DIR,
): TestRunManifest {
  return readManifestFile(createManifestPath(testRunId, artifactsDir));
}

export function writeManifestFile(
  path: string,
  manifest: TestRunManifest,
): void {
  assertValidManifestShape(manifest);
  ensureArtifactsDir(dirname(path));
  writeFileSync(
    path,
    `${JSON.stringify(
      manifest,
      null,
      2,
    )}\n`,
    "utf8",
  );
}

export function registerManifestRecords(
  testRunId: string,
  records: ManifestRecord[],
  artifactsDir = DEFAULT_TEST_ARTIFACTS_DIR,
): TestRunManifest {
  ensureArtifactsDir(artifactsDir);
  const path = createManifestPath(testRunId, artifactsDir);
  const existingManifest = existsSync(path) ? readManifestFile(path) : createEmptyManifest(testRunId);
  const nextManifest = appendManifestRecords(existingManifest, records);
  writeManifestFile(path, nextManifest);
  return nextManifest;
}
