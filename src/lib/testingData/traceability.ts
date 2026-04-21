export type TestCaseType =
  | "UNIT"
  | "INT"
  | "SEC"
  | "AUD"
  | "EDGE"
  | "FRONTEND"
  | "E2E"
  | "CONC"
  | "PERF"
  | "RESILIENCE"
  | "COMPAT"
  | "A11Y"
  | "UNKNOWN";

export interface ParsedTestCaseId {
  id: string;
  prdKey: string;
  testType: TestCaseType;
}

const knownTypes = new Set<TestCaseType>([
  "UNIT",
  "INT",
  "SEC",
  "AUD",
  "EDGE",
  "FRONTEND",
  "E2E",
  "CONC",
  "PERF",
  "RESILIENCE",
  "COMPAT",
  "A11Y",
]);

export function parseTestCaseId(id: string): ParsedTestCaseId {
  const match = /^TC-([A-Z0-9-]+)-([A-Z0-9]+)-(\d+)$/.exec(id);

  if (!match) {
    return {
      id,
      prdKey: "UNKNOWN",
      testType: "UNKNOWN",
    };
  }

  const [, prdKey, rawType] = match;
  const testType = knownTypes.has(rawType as TestCaseType)
    ? (rawType as TestCaseType)
    : "UNKNOWN";

  return {
    id,
    prdKey,
    testType,
  };
}
