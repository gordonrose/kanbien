import { execFileSync } from "node:child_process";

const FRONTEND_ARCHITECTURE_DOC = "docs/architecture/frontend-overview.md";
const SYSTEM_OVERVIEW_DOC = "docs/architecture/system-overview.md";

const exactSensitiveFiles = new Set([
  "package.json",
  "src/app.ts",
  "src/scripts/copyFrontendAssets.ts",
]);

const sensitivePatterns = [
  /^src\/frontend\/[^/]+\/router\.ts$/,
  /^src\/frontend\/[^/]+\/discovery\.ts$/,
];

const adrPattern = /^docs\/architecture\/adr\/(?!README\.md$|0000-adr-template\.md$).+\.md$/;

function runGit(args: string[]): string {
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf8",
    }).trim();
  } catch (error) {
    const gitError = error as {
      status?: number | null;
      stdout?: string;
      output?: Array<string | null | undefined>;
    };

    const fallbackStdout =
      typeof gitError.stdout === "string"
        ? gitError.stdout
        : typeof gitError.output?.[1] === "string"
          ? gitError.output[1]
          : "";

    // Some sandboxed environments surface a child-process wrapper error even
    // when `git` completed successfully and returned stdout.
    if (gitError.status === 0) {
      return fallbackStdout.trim();
    }

    throw error;
  }
}

function parseStatusPath(statusLine: string): string | null {
  if (!statusLine.trim()) {
    return null;
  }

  const payload = statusLine.slice(2).trim();
  if (!payload) {
    return null;
  }

  const renamedParts = payload.split(" -> ");
  return renamedParts[renamedParts.length - 1] ?? null;
}

function listChangedFiles(useStaged: boolean): string[] {
  if (useStaged) {
    const output = runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]);
    return output ? output.split("\n").filter(Boolean) : [];
  }

  const output = runGit(["status", "--porcelain"]);
  return output
    ? output
        .split("\n")
        .map(parseStatusPath)
        .filter((path): path is string => Boolean(path))
    : [];
}

function isArchitectureSensitiveFrontendChange(path: string): boolean {
  if (exactSensitiveFiles.has(path)) {
    return true;
  }

  return sensitivePatterns.some((pattern) => pattern.test(path));
}

function main() {
  const useStaged = process.argv.includes("--staged");
  const changedFiles = listChangedFiles(useStaged);

  if (changedFiles.length === 0) {
    console.log("Frontend architecture guard: no changed files detected.");
    return;
  }

  const sensitiveFiles = changedFiles.filter(isArchitectureSensitiveFrontendChange);

  if (sensitiveFiles.length === 0) {
    console.log("Frontend architecture guard: no architecture-sensitive frontend changes detected.");
    return;
  }

  const hasFrontendOverviewUpdate = changedFiles.includes(FRONTEND_ARCHITECTURE_DOC);
  const hasSystemOverviewUpdate = changedFiles.includes(SYSTEM_OVERVIEW_DOC);
  const changedAdrFiles = changedFiles.filter((path) => adrPattern.test(path));

  const errors: string[] = [];

  if (!hasFrontendOverviewUpdate) {
    errors.push(
      `Update ${FRONTEND_ARCHITECTURE_DOC} to keep the current frontend architecture map in sync.`,
    );
  }

  if (changedAdrFiles.length === 0) {
    errors.push(
      "Stage an ADR update under docs/architecture/adr/ so the enduring frontend decision trail stays current.",
    );
  }

  if (errors.length === 0) {
    const systemOverviewNote = hasSystemOverviewUpdate
      ? "System overview update detected too."
      : `Consider whether ${SYSTEM_OVERVIEW_DOC} also needs a current-state refresh.`;

    console.log("Frontend architecture guard: passed.");
    console.log("");
    console.log("Architecture-sensitive frontend files:");
    for (const file of sensitiveFiles) {
      console.log(`- ${file}`);
    }
    console.log("");
    console.log(systemOverviewNote);
    return;
  }

  console.error("Frontend architecture guard: blocked.");
  console.error("");
  console.error("Architecture-sensitive frontend files:");
  for (const file of sensitiveFiles) {
    console.error(`- ${file}`);
  }
  console.error("");
  console.error("Required follow-up:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error("");
  console.error(
    "If this change is truly architecture-neutral, you can bypass the hook intentionally with --no-verify after reviewing the docs impact.",
  );
  process.exitCode = 1;
}

main();
