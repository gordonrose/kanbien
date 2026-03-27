import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createDurableTestDataHelper } from "../../harness/testData/durableData";
import {
  appendManifestRecords,
  createEmptyManifest,
  createManifestPath,
  readManifestFile,
  registerManifestRecords,
} from "../../../src/lib/testingData/manifest";

const tempDirs: string[] = [];

function createTempArtifactsDir() {
  const dir = mkdtempSync(join(tmpdir(), "kanbien-test-artifacts-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("testing data manifest", () => {
  it("TC-TEST-DATA-UNIT-002 appends manifest records without duplicating existing entries", () => {
    const manifest = createEmptyManifest("tr_20260326_abc123", new Date("2026-03-26T00:00:00.000Z"));
    const updated = appendManifestRecords(manifest, [
      { entity: "auth_principals", id: "ap_1" },
      { entity: "auth_principals", id: "ap_1" },
      { entity: "root_users", id: "ru_1" },
    ]);

    expect(updated.records).toEqual([
      { entity: "auth_principals", id: "ap_1" },
      { entity: "root_users", id: "ru_1" },
    ]);
  });

  it("TC-TEST-DATA-UNIT-003 reads persisted manifest records from disk", () => {
    const artifactsDir = createTempArtifactsDir();
    const testRunId = "tr_20260326_def456";
    registerManifestRecords(
      testRunId,
      [
        { entity: "auth_sessions", id: "sess_1" },
        { entity: "auth_audit_events", id: "evt_1" },
      ],
      artifactsDir,
    );

    const manifest = readManifestFile(createManifestPath(testRunId, artifactsDir));

    expect(manifest.testRunId).toBe(testRunId);
    expect(manifest.records).toEqual([
      { entity: "auth_sessions", id: "sess_1" },
      { entity: "auth_audit_events", id: "evt_1" },
    ]);
  });

  it("TC-TEST-DATA-EDGE-001 rejects malformed manifest files and invalid record entries", () => {
    const artifactsDir = createTempArtifactsDir();
    const malformedPath = join(artifactsDir, "bad.json");
    const invalidPath = join(artifactsDir, "invalid.json");
    writeFileSync(malformedPath, "{not-json}", "utf8");
    writeFileSync(
      invalidPath,
      JSON.stringify({
        testRunId: "tr_20260326_bad001",
        createdAt: "2026-03-26T00:00:00.000Z",
        records: [{ entity: "not_real", id: "x_1" }],
      }),
      "utf8",
    );

    expect(() => readManifestFile(malformedPath)).toThrow("Failed to read manifest");
    expect(() => readManifestFile(invalidPath)).toThrow("Unsupported cleanup entity");
  });

  it("TC-TEST-DATA-EDGE-002 de-duplicates manifest entries before cleanup planning sees them", () => {
    const manifest = createEmptyManifest("tr_20260326_dup001", new Date("2026-03-26T00:00:00.000Z"));
    const updated = appendManifestRecords(manifest, [
      { entity: "auth_sessions", id: "sess_1" },
      { entity: "auth_sessions", id: "sess_1" },
      { entity: "auth_sessions", id: "sess_1" },
    ]);

    expect(updated.records).toEqual([{ entity: "auth_sessions", id: "sess_1" }]);
  });

  it("TC-TEST-DATA-EDGE-005 embeds the testRunId in helper-generated human-readable values", () => {
    const helper = createDurableTestDataHelper({
      testRunId: "tr_20260326_val001",
      artifactsDir: createTempArtifactsDir(),
    });

    expect(helper.createEmail("Root Admin")).toBe("root-admin.tr_20260326_val001@example.test");
    expect(helper.createLabel("Laptop Key")).toBe("laptop-key-tr_20260326_val001");
  });
});
