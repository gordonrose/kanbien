import { describe, expect, it } from "vitest";
import { createTestRunId, isValidTestRunId } from "../../../src/lib/testingData/runId";

describe("testing data run id", () => {
  it("TC-TEST-DATA-UNIT-001 generates a valid testRunId", () => {
    const result = createTestRunId(new Date("2026-03-26T00:00:00.000Z"), "abc123");

    expect(result).toBe("tr_20260326_abc123");
    expect(isValidTestRunId(result)).toBe(true);
  });
});
