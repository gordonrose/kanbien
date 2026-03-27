import { afterEach, describe, expect, it } from "vitest";
import {
  isPostgresTestDataPreserveModeEnabled,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

describe("postgres test database harness mode selection", () => {
  const originalPreserveMode = process.env.PRESERVE_POSTGRES_TEST_DATA;

  afterEach(() => {
    if (originalPreserveMode === undefined) {
      delete process.env.PRESERVE_POSTGRES_TEST_DATA;
      return;
    }

    process.env.PRESERVE_POSTGRES_TEST_DATA = originalPreserveMode;
  });

  it("TC-TEST-DATA-INT-000 defaults to reset-first mode", () => {
    delete process.env.PRESERVE_POSTGRES_TEST_DATA;

    expect(isPostgresTestDataPreserveModeEnabled()).toBe(false);
  });

  it("TC-TEST-DATA-EDGE-006 enables preserve/debug mode only when explicitly requested", () => {
    process.env.PRESERVE_POSTGRES_TEST_DATA = "true";
    expect(isPostgresTestDataPreserveModeEnabled()).toBe(true);

    process.env.PRESERVE_POSTGRES_TEST_DATA = "false";
    expect(isPostgresTestDataPreserveModeEnabled()).toBe(false);
  });

  it("TC-TEST-DATA-INT-000 skips routine resets when preserve/debug mode is enabled", async () => {
    process.env.PRESERVE_POSTGRES_TEST_DATA = "true";
    let resetCalled = false;
    const pool = {
      query: async () => {
        resetCalled = true;
      },
    } as any;

    await resetPostgresTestDatabaseForRoutineIsolation(pool);

    expect(resetCalled).toBe(false);
  });
});
