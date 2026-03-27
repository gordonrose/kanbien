import { describe, expect, it } from "vitest";
import { parseTestCaseId } from "../../../src/lib/testingData/traceability";

describe("traceability parsing", () => {
  it("TC-TEST-DATA-UNIT-005 parses valid TC IDs into PRD key and test type", () => {
    expect(parseTestCaseId("TC-ROOT-AUTH-UNIT-001")).toEqual({
      id: "TC-ROOT-AUTH-UNIT-001",
      prdKey: "ROOT-AUTH",
      testType: "UNIT",
    });
  });

  it("TC-TEST-DATA-UNIT-006 classifies malformed IDs as unknown", () => {
    expect(parseTestCaseId("TC-BAD-ID")).toEqual({
      id: "TC-BAD-ID",
      prdKey: "UNKNOWN",
      testType: "UNKNOWN",
    });
  });
});
