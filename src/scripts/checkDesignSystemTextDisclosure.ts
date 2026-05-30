import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

type Finding = {
  path: string;
  line: number;
  message: string;
};

const repoRoot = process.cwd();
const scanRoots = [
  "src/frontend/designSystem/layers",
  "src/frontend/designSystem/systems/default/assets",
  "src/frontend/designSystem/systems/default/primitives",
  "src/frontend/designSystem/systems/default/patterns",
];

const findings: Finding[] = [];

function walk(path: string): string[] {
  const fullPath = join(repoRoot, path);
  const stat = statSync(fullPath);

  if (stat.isFile()) {
    return [fullPath];
  }

  return readdirSync(fullPath).flatMap((entry) => walk(join(path, entry)));
}

function lineNumber(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function isScannable(path: string): boolean {
  return [".css", ".mjs", ".js", ".ts", ".html"].some((extension) => path.endsWith(extension));
}

function isApprovedDisclosureBlock(selector: string, body: string): boolean {
  return (
    selector.includes('data-radio-simple-select-legend-presentation="visually-hidden"') ||
    selector.includes('data-card-list-select-legend-presentation="visually-hidden"') ||
    selector.includes(".token-spec-choice-affordance-preview") ||
    selector.includes(".token-spec-choice-affordance-state") ||
    selector.includes(".ds-truncating-label-text") ||
    selector.includes(".ds-index-nav-item-control-label") ||
    selector.includes(".ds-index-nav-item-control-supporting") ||
    selector.includes(".ds-radio-simple-select-text") ||
    selector.includes(".ds-radio-simple-select-supporting") ||
    selector.includes(".ds-radio-simple-select-group-supporting") ||
    selector.includes(".ds-card-list-select-text") ||
    selector.includes(".ds-card-list-select-supporting") ||
    selector.includes(".ds-card-list-select-group-supporting") ||
    selector.includes(".ds-card-list-select-state-text") ||
    selector.includes(".ds-card-list-select-input") ||
    selector.includes(".ds-simple-dropdown-trigger-label") ||
    selector.includes(".ds-simple-dropdown-option-label") ||
    selector.includes(".ds-simple-dropdown-option-supporting") ||
    body.includes("data-truncating-label")
  );
}

function scanCss(path: string, content: string) {
  const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(content)) !== null) {
    const selector = match[1].trim();
    const body = match[2];
    const hasTruncation =
      /text-overflow\s*:\s*ellipsis\b/.test(body) || /white-space\s*:\s*nowrap\b/.test(body);

    if (!hasTruncation) {
      continue;
    }

    if (isApprovedDisclosureBlock(selector, body)) {
      continue;
    }

    findings.push({
      path,
      line: lineNumber(content, match.index),
      message:
        "Text clipping/truncation must be owned by truncating-label or another approved text-disclosure primitive with overflow-gated browser evidence.",
    });
  }
}

function scanSource(path: string, content: string) {
  const bannedPatterns = [
    /text-overflow\s*:\s*ellipsis\b/g,
    /white-space\s*:\s*nowrap\b/g,
    /title\s*=\s*["'`]/g,
  ];

  for (const pattern of bannedPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const before = content.slice(Math.max(0, match.index - 500), match.index);
      const after = content.slice(match.index, match.index + 500);
      if (before.includes("data-truncating-label") || after.includes("data-truncating-label")) {
        continue;
      }

      findings.push({
        path,
        line: lineNumber(content, match.index),
        message:
          "Potential text truncation or title-only disclosure found outside the governed truncating-label seam.",
      });
    }
  }
}

for (const root of scanRoots) {
  for (const fullPath of walk(root)) {
    if (!isScannable(fullPath)) {
      continue;
    }

    const path = relative(repoRoot, fullPath);
    const content = readFileSync(fullPath, "utf8");

    if (path.endsWith(".css")) {
      scanCss(path, content);
    } else {
      scanSource(path, content);
    }
  }
}

if (findings.length > 0) {
  console.error("Design-system text disclosure audit failed.");
  console.error(
    "Any visible truncated text must use truncating-label or an approved text-disclosure primitive with browser evidence.",
  );
  for (const finding of findings) {
    console.error(`- ${finding.path}:${finding.line} ${finding.message}`);
  }
  process.exit(1);
}

console.log("Design-system text disclosure audit passed.");
