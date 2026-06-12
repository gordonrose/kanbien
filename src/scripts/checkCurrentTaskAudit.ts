import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const AUDIT_PATH = "docs/workspace/trust-harness/current-task-audit.md";

const REQUIRED_PREFLIGHT_FIELDS = [
  "Task summary",
  "Mode",
  "Governing instruction sources",
  "Task risk class",
  "Discovered evidence boundary",
  "Intended edit boundary",
  "Files allowed to edit",
  "Files explicitly out of scope",
  "Required verification commands",
  "Allowed closure vocabulary",
];

const REQUIRED_CLOSURE_FIELDS = [
  "Actual files edited",
  "Evidence collected",
  "Commands run and results",
  "Missing or inferred evidence",
  "User confirmation still required",
  "Final permitted closure state",
];

const MATERIAL_PATH_PREFIXES = [
  ".codex/skills/",
  "docs/architecture/",
  "docs/standards/",
  "docs/workspace/",
  "src/",
  "tests/",
  "package.json",
  "package-lock.json",
];

const COMPLETION_WORDS = [
  "fixed",
  "done",
  "complete",
  "working",
  "ready",
  "should be fixed",
  "should work",
];

const ALLOWED_INCOMPLETE_STATES = [
  "candidate fix",
  "implementation-only",
  "partially verified",
  "blocked on verification",
  "blocked on runtime verification",
  "pending user confirmation",
];

type ParsedAudit = {
  preflightFields: Map<string, string[]>;
  closureFields: Map<string, string[]>;
  preflightSectionCount: number;
  closureSectionCount: number;
  declaredAllowedPaths: string[];
  declaredOutOfScopePaths: string[];
  preExistingChangedPaths: string[];
  finalPermittedClosureState: string | null;
};

export type AuditValidationInput = {
  content: string | null;
  changedPaths: string[];
  auditPath?: string;
};

export type AuditValidationResult = {
  ok: boolean;
  violations: string[];
};

function normalizeRepoPath(value: string): string {
  return value
    .trim()
    .replace(/^[-*]\s+/, "")
    .replace(/^`|`$/g, "")
    .replace(/^["'`]+|["'`,.;:]+$/g, "")
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "")
    .replace(/\/+$/, "");
}

function stripInlineCode(value: string): string {
  const trimmed = value.trim();
  const codeMatch = /^`([^`]+)`$/.exec(trimmed);
  return codeMatch ? codeMatch[1] : trimmed;
}

function parseBulletValue(line: string): string | null {
  const match = /^\s+-\s+(.*)$/.exec(line);
  return match ? stripInlineCode(match[1]) : null;
}

function parseSectionFields(lines: string[]): Map<string, string[]> {
  const fields = new Map<string, string[]>();
  let currentField: string | null = null;

  for (const rawLine of lines) {
    const topLevelMatch = /^-\s+([^:]+):\s*(.*)$/.exec(rawLine);
    if (topLevelMatch) {
      currentField = topLevelMatch[1].trim();
      if (!fields.has(currentField)) {
        fields.set(currentField, []);
      }
      const inlineValue = topLevelMatch[2].trim();
      if (inlineValue) {
        fields.get(currentField)?.push(inlineValue);
      }
      continue;
    }

    const nestedValue = parseBulletValue(rawLine);
    if (nestedValue !== null && currentField !== null) {
      fields.get(currentField)?.push(nestedValue);
    }
  }

  return fields;
}

function parseAudit(content: string): ParsedAudit {
  const lines = content.split(/\r?\n/);
  const preflightStarts: number[] = [];
  const closureStarts: number[] = [];

  lines.forEach((line, index) => {
    if (line.trim() === "## Preflight Contract") {
      preflightStarts.push(index);
    } else if (line.trim() === "## Post-Work Closure Record") {
      closureStarts.push(index);
    }
  });

  const sectionLines = (start: number | undefined): string[] => {
    if (start === undefined) {
      return [];
    }
    const nextSection = lines.findIndex(
      (line, index) => index > start && /^##\s+/.test(line),
    );
    return lines.slice(start + 1, nextSection === -1 ? undefined : nextSection);
  };

  const preflightFields = parseSectionFields(sectionLines(preflightStarts[0]));
  const closureFields = parseSectionFields(sectionLines(closureStarts[0]));
  const preflightValuesFor = (field: string) => preflightFields.get(field) ?? [];
  const closureValuesFor = (field: string) => closureFields.get(field) ?? [];
  return {
    preflightFields,
    closureFields,
    preflightSectionCount: preflightStarts.length,
    closureSectionCount: closureStarts.length,
    declaredAllowedPaths: preflightValuesFor("Files allowed to edit").map(normalizeRepoPath),
    declaredOutOfScopePaths: preflightValuesFor("Files explicitly out of scope").map(normalizeRepoPath),
    preExistingChangedPaths: preflightValuesFor("Pre-existing changed paths acknowledged").map(normalizeRepoPath),
    finalPermittedClosureState: closureValuesFor("Final permitted closure state").join(" ").trim() || null,
  };
}

function pathMatchesPattern(filePath: string, pattern: string): boolean {
  const normalizedFile = normalizeRepoPath(filePath);
  const normalizedPattern = normalizeRepoPath(pattern);
  if (!normalizedPattern) {
    return false;
  }
  if (normalizedPattern.endsWith("/**")) {
    const prefix = normalizedPattern.slice(0, -"**".length);
    return normalizedFile === prefix.replace(/\/+$/, "") || normalizedFile.startsWith(prefix);
  }
  return normalizedFile === normalizedPattern || normalizedFile.startsWith(`${normalizedPattern}/`);
}

function isCoveredByAny(filePath: string, patterns: string[]): boolean {
  return patterns.some((pattern) => pathMatchesPattern(filePath, pattern));
}

function isMaterialPath(filePath: string): boolean {
  return MATERIAL_PATH_PREFIXES.some((prefix) => filePath === prefix || filePath.startsWith(prefix));
}

function hasNonPendingValue(values: string[] | undefined): boolean {
  if (!values || values.length === 0) {
    return false;
  }
  const joined = values.join(" ").trim().toLowerCase();
  return joined.length > 0 && joined !== "pending" && joined !== "n/a";
}

function containsCompletionLanguage(value: string): boolean {
  const lower = value.toLowerCase();
  return COMPLETION_WORDS.some((word) => new RegExp(`\\b${word}\\b`).test(lower));
}

function isAllowedClosureState(value: string | null): boolean {
  if (!value) {
    return false;
  }
  const lower = value.toLowerCase();
  return (
    ALLOWED_INCOMPLETE_STATES.some((state) => lower.includes(state)) ||
    (!containsCompletionLanguage(lower) && lower !== "pending")
  );
}

export function validateCurrentTaskAudit(input: AuditValidationInput): AuditValidationResult {
  const auditPath = input.auditPath ?? AUDIT_PATH;
  const changedPaths = Array.from(new Set(input.changedPaths.map(normalizeRepoPath))).filter(Boolean);
  const materialChangedPaths = changedPaths.filter(isMaterialPath);
  const violations: string[] = [];

  if (materialChangedPaths.length > 0 && input.content === null) {
    return {
      ok: false,
      violations: [
        `${auditPath} is required before material/governed changes are present.`,
      ],
    };
  }

  if (input.content === null) {
    return { ok: true, violations: [] };
  }

  const parsed = parseAudit(input.content);

  if (parsed.preflightSectionCount !== 1) {
    violations.push(
      `${auditPath} must contain exactly one active ## Preflight Contract section; found ${parsed.preflightSectionCount}.`,
    );
  }
  if (parsed.closureSectionCount !== 1) {
    violations.push(
      `${auditPath} must contain exactly one active ## Post-Work Closure Record section; found ${parsed.closureSectionCount}.`,
    );
  }

  for (const field of REQUIRED_PREFLIGHT_FIELDS) {
    if (!hasNonPendingValue(parsed.preflightFields.get(field))) {
      violations.push(`${auditPath} is missing required preflight field: ${field}`);
    }
  }

  for (const field of REQUIRED_CLOSURE_FIELDS) {
    if (!parsed.closureFields.has(field)) {
      violations.push(`${auditPath} is missing required closure field: ${field}`);
    }
  }

  const unacknowledgedChangedPaths = materialChangedPaths.filter(
    (changedPath) => !isCoveredByAny(changedPath, parsed.preExistingChangedPaths),
  );
  const outsideBoundary = unacknowledgedChangedPaths.filter(
    (changedPath) => !isCoveredByAny(changedPath, parsed.declaredAllowedPaths),
  );
  if (outsideBoundary.length > 0) {
    violations.push(
      `Changed material paths are outside the current task audit edit boundary: ${outsideBoundary.join(", ")}`,
    );
  }

  const outOfScopeEdited = unacknowledgedChangedPaths.filter((changedPath) =>
    isCoveredByAny(changedPath, parsed.declaredOutOfScopePaths),
  );
  if (outOfScopeEdited.length > 0) {
    violations.push(
      `Changed material paths are explicitly out of scope in ${auditPath}: ${outOfScopeEdited.join(", ")}`,
    );
  }

  if (
    parsed.finalPermittedClosureState !== null &&
    containsCompletionLanguage(parsed.finalPermittedClosureState) &&
    !hasNonPendingValue(parsed.closureFields.get("Evidence collected"))
  ) {
    violations.push(
      `${auditPath} uses completion language without recorded evidence collected.`,
    );
  }

  if (
    parsed.finalPermittedClosureState !== null &&
    parsed.finalPermittedClosureState.toLowerCase() !== "pending" &&
    !isAllowedClosureState(parsed.finalPermittedClosureState)
  ) {
    violations.push(
      `${auditPath} has an unsupported final permitted closure state: ${parsed.finalPermittedClosureState}`,
    );
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}

function gitChangedPaths(): string[] {
  const output = execFileSync("git", ["status", "--short", "--untracked-files=all"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return output
    .split(/\r?\n/)
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .flatMap((line) => line.split(" -> ").map(normalizeRepoPath));
}

export function runCurrentTaskAuditCheck(repoRoot = process.cwd()): AuditValidationResult {
  const auditAbsolutePath = path.resolve(repoRoot, AUDIT_PATH);
  const content = existsSync(auditAbsolutePath) ? readFileSync(auditAbsolutePath, "utf8") : null;
  return validateCurrentTaskAudit({
    content,
    changedPaths: gitChangedPaths(),
    auditPath: AUDIT_PATH,
  });
}

if (require.main === module) {
  const result = runCurrentTaskAuditCheck();
  if (!result.ok) {
    console.error("Current task audit check failed:");
    for (const violation of result.violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }
  console.log("Current task audit check passed.");
}
