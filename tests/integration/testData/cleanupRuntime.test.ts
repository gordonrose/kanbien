import { mkdtempSync, readFileSync, rmSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDurableTestDataHelper } from "../../harness/testData/durableData";
import {
  assertSafeCleanupEnvironment,
  parseCleanupArgs,
  runCleanup,
} from "../../../src/lib/testingData/cleanupRuntime";
import {
  createManifestPath,
  readManifestFile,
  readManifestByRunId,
  registerManifestRecords,
} from "../../../src/lib/testingData/manifest";
import type { CleanupPlanStep } from "../../../src/lib/testingData/cleanupPlan";

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

describe("testing data integration workflow", () => {
  it("TC-TEST-DATA-INT-001 registers durable records across helper calls in one manifest", () => {
    const artifactsDir = createTempArtifactsDir();
    const testRunId = "tr_20260326_int001";
    const helper = createDurableTestDataHelper({ testRunId, artifactsDir });

    helper.registerRecord("auth_principals", "ap_1");
    helper.registerRecords(
      [
        { entity: "auth_sessions", id: "sess_1" },
        { entity: "root_users", id: "ru_1" },
      ],
    );

    const manifest = readManifestFile(createManifestPath(testRunId, artifactsDir));

    expect(manifest.records).toEqual([
      { entity: "auth_principals", id: "ap_1" },
      { entity: "auth_sessions", id: "sess_1" },
      { entity: "root_users", id: "ru_1" },
    ]);
  });

  it("TC-TEST-DATA-INT-002 supports cleanup dry-run without deleting manifest-backed data", async () => {
    const artifactsDir = createTempArtifactsDir();
    const testRunId = "tr_20260326_int002";
    const logs: string[] = [];
    const executePlan = vi.fn<(_: CleanupPlanStep[]) => Promise<Array<{
      entity: CleanupPlanStep["entity"];
      requestedCount: number;
      deletedCount: number;
      skippedCount: number;
    }>>>().mockResolvedValue([]);
    const unlinkManifest = vi.fn();

    registerManifestRecords(
      testRunId,
      [
        { entity: "auth_audit_events", id: "evt_1" },
        { entity: "auth_sessions", id: "sess_1" },
      ],
      artifactsDir,
    );

    await runCleanup(
      {
        testRunId,
        dryRun: true,
        artifactsDir,
      },
      {
        nodeEnv: "test",
        readManifestByRunId: (runId, dir) => readManifestFile(createManifestPath(runId, dir)),
        executePlan,
        unlinkManifest,
        log: (line) => {
          logs.push(line);
        },
      },
    );

    expect(executePlan).not.toHaveBeenCalled();
    expect(unlinkManifest).not.toHaveBeenCalled();
    expect(readFileSync(createManifestPath(testRunId, artifactsDir), "utf8")).toContain("evt_1");
    expect(logs).toContain(`Dry run for ${testRunId}`);
    expect(logs).toContain("- auth_audit_events: 1 record(s)");
    expect(logs).toContain("- auth_sessions: 1 record(s)");
    expect(logs).toContain("\nNo records were deleted.");
  });

  it("TC-TEST-DATA-INT-003 deletes manifest-tracked entities in cleanup order and removes the manifest", async () => {
    const artifactsDir = createTempArtifactsDir();
    const testRunId = "tr_20260326_int003";
    const observedPlans: CleanupPlanStep[][] = [];
    const logs: string[] = [];

    registerManifestRecords(
      testRunId,
      [
        { entity: "root_users", id: "ru_1" },
        { entity: "auth_principals", id: "ap_1" },
        { entity: "auth_audit_events", id: "evt_1" },
      ],
      artifactsDir,
    );

    await runCleanup(
      {
        testRunId,
        dryRun: false,
        artifactsDir,
      },
      {
        nodeEnv: "test",
        readManifestByRunId: (runId, dir) => readManifestFile(createManifestPath(runId, dir)),
        executePlan: async (plan) => {
          observedPlans.push(plan);
          return plan
            .filter((step) => step.ids.length > 0)
            .map((step) => ({
              entity: step.entity,
              requestedCount: step.ids.length,
              deletedCount: step.ids.length,
              skippedCount: 0,
            }));
        },
        unlinkManifest: unlinkSync,
        log: (line) => {
          logs.push(line);
        },
      },
    );

    expect(observedPlans).toHaveLength(1);
    expect(observedPlans[0].filter((step) => step.ids.length > 0)).toEqual([
      { entity: "auth_audit_events", ids: ["evt_1"] },
      { entity: "auth_principals", ids: ["ap_1"] },
      { entity: "root_users", ids: ["ru_1"] },
    ]);
    expect(logs).toContain(`Cleanup for ${testRunId}`);
    expect(logs).toContain("- auth_audit_events: deleted 1/1, skipped 0");
    expect(logs).toContain("\nCleanup completed and manifest removed.");
    expect(() => readManifestFile(createManifestPath(testRunId, artifactsDir))).toThrow();
  });

  it("TC-TEST-DATA-SEC-001 refuses cleanup in production environments", () => {
    expect(() => assertSafeCleanupEnvironment("production")).toThrow(
      "Cleanup is not allowed when NODE_ENV=production.",
    );
  });

  it("TC-TEST-DATA-SEC-003 requires an explicit valid testRunId", () => {
    expect(() => parseCleanupArgs(["--dry-run"])).toThrow(
      "A valid `--run-id <testRunId>` is required.",
    );
    expect(() => parseCleanupArgs(["--run-id", "bad-id"])).toThrow(
      "A valid `--run-id <testRunId>` is required.",
    );
  });

  it("TC-TEST-DATA-SEC-002 refuses guessed deletion when the manifest is missing or invalid", async () => {
    const artifactsDir = createTempArtifactsDir();
    const executePlan = vi.fn();

    await expect(() =>
      runCleanup(
        {
          testRunId: "tr_20260326_sec002",
          dryRun: false,
          artifactsDir,
        },
        {
          nodeEnv: "test",
          readManifestByRunId,
          executePlan,
          unlinkManifest: vi.fn(),
          log: vi.fn(),
        },
      ),
    ).rejects.toThrow("Failed to read manifest");

    expect(executePlan).not.toHaveBeenCalled();
  });

  it("TC-TEST-DATA-AUD-001 reports deleted and skipped counts distinctly", async () => {
    const artifactsDir = createTempArtifactsDir();
    const testRunId = "tr_20260326_aud001";
    const logs: string[] = [];

    registerManifestRecords(
      testRunId,
      [
        { entity: "auth_audit_events", id: "evt_1" },
        { entity: "auth_sessions", id: "sess_1" },
      ],
      artifactsDir,
    );

    await runCleanup(
      {
        testRunId,
        dryRun: false,
        artifactsDir,
      },
      {
        nodeEnv: "test",
        readManifestByRunId: (runId, dir) => readManifestFile(createManifestPath(runId, dir)),
        executePlan: async (plan) =>
          plan
            .filter((step) => step.ids.length > 0)
            .map((step, index) => ({
              entity: step.entity,
              requestedCount: step.ids.length,
              deletedCount: index === 0 ? step.ids.length : 0,
              skippedCount: index === 0 ? 0 : step.ids.length,
            })),
        unlinkManifest: unlinkSync,
        log: (line) => {
          logs.push(line);
        },
      },
    );

    expect(logs).toContain(`Cleanup for ${testRunId}`);
    expect(logs).toContain("- auth_audit_events: deleted 1/1, skipped 0");
    expect(logs).toContain("- auth_sessions: deleted 0/1, skipped 1");
  });

  it("TC-TEST-DATA-EDGE-003 handles already-missing records deterministically", async () => {
    const artifactsDir = createTempArtifactsDir();
    const testRunId = "tr_20260326_edge003";
    const logs: string[] = [];

    registerManifestRecords(
      testRunId,
      [{ entity: "auth_sessions", id: "sess_404" }],
      artifactsDir,
    );

    await runCleanup(
      {
        testRunId,
        dryRun: false,
        artifactsDir,
      },
      {
        nodeEnv: "test",
        readManifestByRunId: (runId, dir) => readManifestFile(createManifestPath(runId, dir)),
        executePlan: async (plan) =>
          plan
            .filter((step) => step.ids.length > 0)
            .map((step) => ({
              entity: step.entity,
              requestedCount: step.ids.length,
              deletedCount: 0,
              skippedCount: step.ids.length,
            })),
        unlinkManifest: unlinkSync,
        log: (line) => {
          logs.push(line);
        },
      },
    );

    expect(logs).toContain("- auth_sessions: deleted 0/1, skipped 1");
    expect(logs).toContain("\nCleanup completed and manifest removed.");
  });
});
