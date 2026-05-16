import { describe, expect, it } from "vitest";
import { parseTestCaseId } from "../../../src/lib/testingData/traceability";

const BAD_TRACEABILITY_ID = ["TC", "BAD", "ID"].join("-");

describe("traceability parsing", () => {
  it("TC-TEST-DATA-UNIT-005 parses valid TC IDs into PRD key and test type", () => {
    expect(parseTestCaseId("TC-ROOT-AUTH-UNIT-001")).toEqual({
      id: "TC-ROOT-AUTH-UNIT-001",
      prdKey: "ROOT-AUTH",
      testType: "UNIT",
    });
  });

  it("TC-TEST-DATA-UNIT-007 recognizes asset-linking traceability IDs", () => {
    expect(parseTestCaseId("TC-ROOT-USERS-ASSET-001")).toEqual({
      id: "TC-ROOT-USERS-ASSET-001",
      prdKey: "ROOT-USERS",
      testType: "ASSET",
    });
  });

  it("TC-TEST-DATA-UNIT-006 classifies malformed IDs as unknown", () => {
    expect(parseTestCaseId(BAD_TRACEABILITY_ID)).toEqual({
      id: BAD_TRACEABILITY_ID,
      prdKey: "UNKNOWN",
      testType: "UNKNOWN",
    });
  });
});
