import { describe, expect, it } from "vitest";
import {
  buildTraceabilityReport,
  formatTraceabilityReport,
} from "../../../src/lib/testingData/traceabilityReport";

const ROOT_AUTH_UNIT_999 = ["TC", "ROOT", "AUTH", "UNIT", "999"].join("-");
const BAD_TRACEABILITY_ID = ["TC", "BAD", "ID"].join("-");

describe("traceability reporting integration", () => {
  it("TC-TEST-DATA-INT-004 keeps docs and grouped traceability summaries aligned", () => {
    const report = buildTraceabilityReport(
      [
        "TC-ROOT-AUTH-UNIT-001",
        "TC-ROOT-AUTH-INT-001",
        "TC-TEST-DATA-UNIT-001",
      ],
      "TC-ROOT-AUTH-UNIT-001\nTC-TEST-DATA-UNIT-001",
    );

    expect(report.coveredIds).toEqual([
      "TC-ROOT-AUTH-UNIT-001",
      "TC-TEST-DATA-UNIT-001",
    ]);
    expect(report.missingIds).toEqual(["TC-ROOT-AUTH-INT-001"]);
    expect(report.byPrd["ROOT-AUTH"]).toEqual({ traced: 1, total: 2 });
    expect(report.byPrdAndType["ROOT-AUTH / INT"]).toEqual({ traced: 0, total: 1 });
  });

  it("reports executable IDs that do not exist in reviewed docs", () => {
    const report = buildTraceabilityReport(
      [
        "TC-ROOT-AUTH-UNIT-001",
      ],
      `TC-ROOT-AUTH-UNIT-001\n${ROOT_AUTH_UNIT_999}`,
    );

    expect(report.executableIds).toEqual([
      "TC-ROOT-AUTH-UNIT-001",
      ROOT_AUTH_UNIT_999,
    ]);
    expect(report.orphanedExecutableIds).toEqual([ROOT_AUTH_UNIT_999]);
  });

  it("TC-TEST-DATA-EDGE-004 keeps grouped reporting correct across multiple PRDs", () => {
    const report = buildTraceabilityReport(
      [
        "TC-ROOT-AUTH-UNIT-001",
        "TC-TEST-DATA-UNIT-001",
        "TC-TEST-DATA-SEC-001",
      ],
      "TC-ROOT-AUTH-UNIT-001\nTC-TEST-DATA-SEC-001",
    );

    expect(report.byPrd["ROOT-AUTH"]).toEqual({ traced: 1, total: 1 });
    expect(report.byPrd["TEST-DATA"]).toEqual({ traced: 1, total: 2 });
    expect(report.byType["SEC"]).toEqual({ traced: 1, total: 1 });
    expect(report.byPrdAndType["TEST-DATA / SEC"]).toEqual({ traced: 1, total: 1 });
  });

  it("TC-TEST-DATA-SEC-004 surfaces malformed documented IDs and missing mapped coverage", () => {
    const report = buildTraceabilityReport(
      [
        "TC-ROOT-AUTH-UNIT-001",
        BAD_TRACEABILITY_ID,
      ],
      "TC-ROOT-AUTH-UNIT-001",
    );

    expect(report.malformedIds).toEqual([BAD_TRACEABILITY_ID]);
    expect(report.missingByType.UNKNOWN).toEqual([BAD_TRACEABILITY_ID]);
  });

  it("TC-TEST-DATA-AUD-002 formats grouped traceability output for review", () => {
    const report = buildTraceabilityReport(
      [
        "TC-ROOT-AUTH-UNIT-001",
        "TC-TEST-DATA-SEC-001",
      ],
      `TC-ROOT-AUTH-UNIT-001\n${ROOT_AUTH_UNIT_999}`,
    );

    const lines = formatTraceabilityReport(report);

    expect(lines).toContain("Tracked active PRD test cases: 2");
    expect(lines).toContain("Traceability by PRD:");
    expect(lines).toContain("Executable IDs without reviewed PRD cases: 1");
    expect(lines).toContain("ROOT-AUTH: 1/1 traceable");
    expect(lines).toContain("TEST-DATA / SEC: 0/1 traceable");
    expect(lines).toContain("Executable test-case IDs missing from reviewed PRD docs:");
    expect(lines).toContain(`- ${ROOT_AUTH_UNIT_999}`);
  });
});
