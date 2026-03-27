import { describe, expect, it } from "vitest";
import {
  buildTraceabilityReport,
  formatTraceabilityReport,
} from "../../../src/lib/testingData/traceabilityReport";

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
        "TC-BAD-ID",
      ],
      "TC-ROOT-AUTH-UNIT-001",
    );

    expect(report.malformedIds).toEqual(["TC-BAD-ID"]);
    expect(report.missingByType.UNKNOWN).toEqual(["TC-BAD-ID"]);
  });

  it("TC-TEST-DATA-AUD-002 formats grouped traceability output for review", () => {
    const report = buildTraceabilityReport(
      [
        "TC-ROOT-AUTH-UNIT-001",
        "TC-TEST-DATA-SEC-001",
      ],
      "TC-ROOT-AUTH-UNIT-001",
    );

    const lines = formatTraceabilityReport(report);

    expect(lines).toContain("Tracked PRD test cases: 2");
    expect(lines).toContain("Traceability by PRD:");
    expect(lines).toContain("ROOT-AUTH: 1/1 traceable");
    expect(lines).toContain("TEST-DATA / SEC: 0/1 traceable");
  });
});
