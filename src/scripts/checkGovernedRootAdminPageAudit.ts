import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const AUDIT_DOC =
  "docs/workspace/design-system/adoption/root-admin-governed-page-implementation-audit.md";

const exactSensitiveFiles = new Set([
  "src/frontend/rootAdminShell/index.html",
  "src/frontend/rootAdminShell/assets/app.mjs",
  "src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs",
  "src/frontend/designSystem/assets/contextNav.mjs",
  "src/frontend/designSystem/assets/rootUsersListWorkspace.mjs",
  "src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs",
  "src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs",
]);

const requiredRoutes = [
  "/root-admin",
  "/root-admin/users",
  "/root-admin/roles",
  "/root-admin/tenants",
  "/root-admin/tenant-admins",
  "/root-admin/web-app-hierarchy",
];

const requiredFieldLabels = [
  "Current implementation status:",
  "Local implementation evidence:",
  "Design-system sourced implementation evidence:",
  "Required remediation before more page work:",
];

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

function readAuditSource(): string {
  return readFileSync(resolve(process.cwd(), AUDIT_DOC), "utf8");
}

function extractRouteSection(source: string, route: string): string | null {
  const heading = `## \`${route}\``;
  const start = source.indexOf(heading);
  if (start === -1) {
    return null;
  }

  const afterHeading = source.slice(start + heading.length);
  const nextHeadingIndex = afterHeading.indexOf("\n## `");
  return nextHeadingIndex === -1
    ? afterHeading
    : afterHeading.slice(0, nextHeadingIndex);
}

function isGovernedRootAdminPageSensitive(path: string): boolean {
  return exactSensitiveFiles.has(path);
}

function main() {
  const useStaged = process.argv.includes("--staged");
  const changedFiles = listChangedFiles(useStaged);
  const sensitiveFiles = changedFiles.filter(isGovernedRootAdminPageSensitive);
  const auditSource = readAuditSource();
  const errors: string[] = [];

  for (const route of requiredRoutes) {
    const section = extractRouteSection(auditSource, route);
    if (section === null) {
      errors.push(`Add the required audit section for \`${route}\` in ${AUDIT_DOC}.`);
      continue;
    }

    for (const fieldLabel of requiredFieldLabels) {
      if (!section.includes(fieldLabel)) {
        errors.push(
          `Add \`${fieldLabel}\` to the \`${route}\` section in ${AUDIT_DOC}.`,
        );
      }
    }
  }

  if (sensitiveFiles.length > 0 && !changedFiles.includes(AUDIT_DOC)) {
    errors.push(
      `Refresh ${AUDIT_DOC} in the same change whenever a governed root-admin page or its DS-backed page seam changes.`,
    );
  }

  if (errors.length === 0) {
    if (sensitiveFiles.length === 0) {
      console.log("Governed root-admin page audit guard: no page-sensitive changes detected.");
    } else {
      console.log("Governed root-admin page audit guard: passed.");
      console.log("");
      console.log("Page-sensitive files:");
      for (const file of sensitiveFiles) {
        console.log(`- ${file}`);
      }
      console.log("");
      console.log("Root-admin governed page audit coverage is present and refreshed.");
    }
    return;
  }

  console.error("Governed root-admin page audit guard: blocked.");
  console.error("");
  if (sensitiveFiles.length > 0) {
    console.error("Page-sensitive files:");
    for (const file of sensitiveFiles) {
      console.error(`- ${file}`);
    }
    console.error("");
  }
  console.error("Required follow-up:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error("");
  console.error(
    "If page work is truly audit-neutral, refresh the audit doc anyway and say the page remains in the same posture.",
  );
  process.exitCode = 1;
}

main();
