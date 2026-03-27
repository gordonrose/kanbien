import { parseTestCaseId, type ParsedTestCaseId, type TestCaseType } from "./traceability";

export interface CoverageBucket {
  total: number;
  traced: number;
}

export interface TraceabilityReport {
  totalIds: number;
  coveredIds: string[];
  missingIds: string[];
  byPrd: Record<string, CoverageBucket>;
  byType: Record<string, CoverageBucket>;
  byPrdAndType: Record<string, CoverageBucket>;
  missingByType: Record<string, string[]>;
  malformedIds: string[];
}

function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = getKey(item);
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

function buildBucket(ids: string[], coveredSet: Set<string>): CoverageBucket {
  return {
    total: ids.length,
    traced: ids.filter((id) => coveredSet.has(id)).length,
  };
}

function sortedKeys<T extends string>(record: Partial<Record<T, unknown>>): T[] {
  return Object.keys(record).sort() as T[];
}

export function buildTraceabilityReport(documentedIds: string[], corpus: string): TraceabilityReport {
  const coveredIds = documentedIds.filter((id) => corpus.includes(id));
  const missingIds = documentedIds.filter((id) => !corpus.includes(id));
  const coveredSet = new Set(coveredIds);
  const parsedIds = documentedIds.map(parseTestCaseId);
  const byPrdGroup = groupBy(parsedIds, (item) => item.prdKey);
  const byTypeGroup = groupBy(parsedIds, (item) => item.testType);
  const missingByTypeGroup = groupBy(missingIds.map(parseTestCaseId), (item) => item.testType);
  const byPrd = sortedKeys(byPrdGroup).reduce<Record<string, CoverageBucket>>((acc, key) => {
    acc[key] = buildBucket(byPrdGroup[key].map((item) => item.id), coveredSet);
    return acc;
  }, {});
  const byType = sortedKeys(byTypeGroup).reduce<Record<string, CoverageBucket>>((acc, key) => {
    acc[key] = buildBucket(byTypeGroup[key].map((item) => item.id), coveredSet);
    return acc;
  }, {});
  const byPrdAndType = sortedKeys(byPrdGroup).reduce<Record<string, CoverageBucket>>((acc, prdKey) => {
    const prdItems = byPrdGroup[prdKey];
    const prdByType = groupBy(prdItems, (item) => item.testType);

    for (const testType of sortedKeys(prdByType)) {
      acc[`${prdKey} / ${testType}`] = buildBucket(
        prdByType[testType].map((item) => item.id),
        coveredSet,
      );
    }

    return acc;
  }, {});
  const missingByType = sortedKeys(missingByTypeGroup).reduce<Record<string, string[]>>((acc, key) => {
    acc[key] = missingByTypeGroup[key].map((item) => item.id);
    return acc;
  }, {});

  return {
    totalIds: documentedIds.length,
    coveredIds,
    missingIds,
    byPrd,
    byType,
    byPrdAndType,
    missingByType,
    malformedIds: parsedIds.filter((item) => item.testType === "UNKNOWN").map((item) => item.id),
  };
}

export function formatCoverageBucket(title: string, bucket: CoverageBucket): string {
  return `${title}: ${bucket.traced}/${bucket.total} traceable`;
}

export function formatTraceabilityReport(report: TraceabilityReport): string[] {
  const lines = [
    `Tracked PRD test cases: ${report.totalIds}`,
    `Traceable in executable tests/code: ${report.coveredIds.length}`,
    `Missing mappings: ${report.missingIds.length}`,
    "Interpretation: this command reports traceability of documented `TC-*` IDs in code, not whether those tests were executed in the current run.",
    "",
    "Traceability by PRD:",
  ];

  for (const key of Object.keys(report.byPrd).sort()) {
    lines.push(formatCoverageBucket(key, report.byPrd[key]));
  }

  lines.push("", "Traceability by Test Type:");
  for (const key of Object.keys(report.byType).sort()) {
    lines.push(formatCoverageBucket(key, report.byType[key]));
  }

  lines.push("", "Traceability by PRD and Test Type:");
  for (const key of Object.keys(report.byPrdAndType).sort()) {
    lines.push(formatCoverageBucket(key, report.byPrdAndType[key]));
  }

  if (report.malformedIds.length > 0) {
    lines.push("", "Malformed documented test-case IDs:");
    for (const id of report.malformedIds) {
      lines.push(`- ${id}`);
    }
  }

  if (report.missingIds.length > 0) {
    lines.push("", "Missing test-case IDs by type:");
    for (const key of Object.keys(report.missingByType).sort()) {
      lines.push("", key);
      for (const id of report.missingByType[key]) {
        lines.push(`- ${id}`);
      }
    }
  } else {
    lines.push("", "All documented PRD test-case IDs are traceable in the codebase.");
  }

  return lines;
}
