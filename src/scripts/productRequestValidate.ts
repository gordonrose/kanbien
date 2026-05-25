import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { validateStoryBreakdownPath } from "./storyBreakdownValidate";

const requiredHeadings = [
  "# Product Request",
  "## Status",
  "## Human Summary",
  "## Artifact Links",
  "## What The Chat Widget Should Show",
  "## Source-Of-Truth Boundary",
];

const artifactLinkLabels = [
  "Product Discovery packet",
  "Technical Steering packet",
  "Story Breakdown",
  "Task Breakdown",
  "PRD",
  "Capability Matrix",
  "PRD-derived test cases",
  "Layer 1 Runtime Contract",
  "Permission Mapping",
  "API Contract",
];

type ProductRequestValidationResult = {
  status: "PASS" | "BLOCKED";
  errors: string[];
};

type ProductRequestLoadResult = {
  requestPath: string;
  requestContent: string;
  rootPath: string;
  isFolder: boolean;
  errors: string[];
};

export function validateProductRequestPath(requestPath: string): ProductRequestValidationResult {
  const loaded = loadProductRequestPath(requestPath);
  const errors = [...loaded.errors, ...validateProductRequestContent(loaded.requestContent, loaded.requestPath)];

  if (loaded.isFolder) {
    errors.push(...validateProductRequestFolder(loaded.rootPath, loaded.requestContent));
  }

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
}

export function validateAllProductRequests(rootPath = path.resolve(process.cwd(), "docs/workspace/product-requests")): ProductRequestValidationResult {
  const errors: string[] = [];

  if (!existsSync(rootPath) || !statSync(rootPath).isDirectory()) {
    return {
      status: "BLOCKED",
      errors: [`Product Request directory not found: ${rootPath}`],
    };
  }

  for (const entry of readdirSync(rootPath).sort()) {
    const requestPath = path.join(rootPath, entry);
    const stats = statSync(requestPath);
    if (stats.isDirectory()) {
      const result = validateProductRequestPath(requestPath);
      errors.push(...result.errors.map((error) => `${entry}: ${error}`));
      continue;
    }

    if (stats.isFile() && entry.endsWith(".md") && entry !== "README.md") {
      const result = validateProductRequestPath(requestPath);
      errors.push(...result.errors.map((error) => `${entry}: ${error}`));
    }
  }

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
}

export function validateProductRequestContent(content: string, sourcePath = process.cwd()): string[] {
  const errors: string[] = [];

  for (const heading of requiredHeadings) {
    if (!content.includes(heading)) {
      errors.push(`missing heading: ${heading}`);
    }
  }

  validateRequiredBullet(content, "Product Request ID", errors);
  validateRequiredBullet(content, "Current status", errors);
  validateRequiredBullet(content, "Requester-facing status", errors);
  validateRequiredBullet(content, "Source channel", errors);
  validateRequiredBullet(content, "Target users", errors);
  validateRequiredBullet(content, "What we are trying to accomplish", errors);

  for (const label of artifactLinkLabels) {
    const value = parseBulletValue(content, label);
    if (!value || isPending(value)) {
      continue;
    }

    const artifactPath = path.resolve(process.cwd(), stripTicks(value));
    if (!existsSync(artifactPath)) {
      errors.push(`${label} does not exist: ${value}`);
    }
  }

  const storyPath = parseBulletValue(content, "Story Breakdown");
  if (storyPath && !isPending(storyPath)) {
    const resolvedStoryPath = path.resolve(process.cwd(), stripTicks(storyPath));
    if (existsSync(resolvedStoryPath)) {
      const storyResult = validateStoryBreakdownPath(resolvedStoryPath);
      if (storyResult.status !== "PASS") {
        errors.push(`${sourcePath} links to blocked Story Breakdown: ${storyPath}`);
        errors.push(...storyResult.errors.map((error) => `Story Breakdown: ${error}`));
      }
    }
  }

  return errors;
}

function loadProductRequestPath(requestPath: string): ProductRequestLoadResult {
  const resolved = path.resolve(process.cwd(), requestPath);
  if (!existsSync(resolved)) {
    return {
      requestPath: resolved,
      requestContent: "",
      rootPath: resolved,
      isFolder: false,
      errors: [`Product Request not found: ${resolved}`],
    };
  }

  if (!statSync(resolved).isDirectory()) {
    return {
      requestPath: resolved,
      requestContent: readFileSync(resolved, "utf8"),
      rootPath: path.dirname(resolved),
      isFolder: false,
      errors: [],
    };
  }

  const requestFile = path.join(resolved, "request.md");
  if (!existsSync(requestFile)) {
    return {
      requestPath: requestFile,
      requestContent: "",
      rootPath: resolved,
      isFolder: true,
      errors: [`folder Product Request missing request.md: ${requestFile}`],
    };
  }

  return {
    requestPath: requestFile,
    requestContent: readFileSync(requestFile, "utf8"),
    rootPath: resolved,
    isFolder: true,
    errors: [],
  };
}

function validateProductRequestFolder(rootPath: string, requestContent: string): string[] {
  const errors: string[] = [];
  const epicsPath = path.join(rootPath, "epics");

  if (!existsSync(epicsPath) || !statSync(epicsPath).isDirectory()) {
    const currentStatus = parseBulletValue(requestContent, "Current status");
    const storyPath = parseBulletValue(requestContent, "Story Breakdown");
    const hasLinkedStoryBreakdown = Boolean(storyPath && !isPending(storyPath));
    const isDraftRequest = currentStatus === "draft-request";

    if (!hasLinkedStoryBreakdown && !isDraftRequest) {
      errors.push(`folder Product Request missing epics directory: ${epicsPath}`);
    }
    return errors;
  }

  const epicFolders = readdirSync(epicsPath)
    .filter((entry) => /^EPIC-[A-Za-z0-9]+/.test(entry))
    .sort();

  if (epicFolders.length === 0) {
    errors.push(`folder Product Request has no epics/EPIC-* directories: ${epicsPath}`);
  }

  validateEpicIndex(rootPath, requestContent, epicFolders, errors);

  for (const epicFolder of epicFolders) {
    const epicPath = path.join(epicsPath, epicFolder);
    if (!statSync(epicPath).isDirectory()) {
      errors.push(`Product Request epic entry must be a directory: ${epicPath}`);
      continue;
    }

    const epicFile = path.join(epicPath, "epic.md");
    if (!existsSync(epicFile)) {
      errors.push(`Product Request epic missing epic.md: ${epicFile}`);
      continue;
    }

    const storyResult = validateStoryBreakdownPath(epicPath);
    if (storyResult.status !== "PASS") {
      errors.push(`Product Request epic is not a valid Story Breakdown: ${epicPath}`);
      errors.push(...storyResult.errors.map((error) => `Epic ${epicFolder}: ${error}`));
    }
  }

  return errors;
}

function validateEpicIndex(rootPath: string, content: string, epicFolders: string[], errors: string[]): void {
  if (!content.includes("## Epic Index")) {
    errors.push("folder Product Request missing heading: ## Epic Index");
    return;
  }

  const rows = parseTableRows(content, "## Epic Index");
  if (rows.length === 0) {
    errors.push("folder Product Request Epic Index must list each epic");
    return;
  }

  const indexedFolders = new Set<string>();
  const actualFolders = new Set(epicFolders);

  for (const row of rows) {
    const epicId = row["Epic ID"] ?? "";
    const artifact = row["Epic Artifact"] ?? "";

    if (!epicId) {
      errors.push("Epic Index row missing Epic ID");
    }
    if (!artifact) {
      errors.push(`${epicId || "Epic Index row"} missing Epic Artifact`);
      continue;
    }

    const artifactPath = path.resolve(process.cwd(), stripTicks(artifact));
    const epicFolder = path.basename(artifactPath) === "epic.md" ? path.dirname(artifactPath) : artifactPath;
    const folderName = path.basename(epicFolder);
    indexedFolders.add(folderName);

    if (!existsSync(epicFolder) || !statSync(epicFolder).isDirectory()) {
      errors.push(`${epicId || "Epic Index row"} Epic Artifact does not exist as a directory: ${artifact}`);
      continue;
    }

    const epicFile = path.join(epicFolder, "epic.md");
    if (!existsSync(epicFile)) {
      errors.push(`${epicId || "Epic Index row"} Epic Artifact missing epic.md: ${epicFolder}`);
    }

    if (!epicFolder.startsWith(path.join(rootPath, "epics") + path.sep)) {
      errors.push(`${epicId || "Epic Index row"} Epic Artifact must be inside the Product Request epics directory: ${artifact}`);
    }

    if (epicId && epicId !== folderName) {
      errors.push(`${epicId} Epic Index ID must match epic folder name: ${folderName}`);
    }

    if (!actualFolders.has(folderName)) {
      errors.push(`${epicId || folderName} Epic Index entry does not match an epics/EPIC-* folder`);
    }
  }

  for (const epicFolder of epicFolders) {
    if (!indexedFolders.has(epicFolder)) {
      errors.push(`Epic Index missing Product Request epic: ${epicFolder}`);
    }
  }
}

function parseTableRows(content: string, heading: string): Record<string, string>[] {
  const section = sectionAfterHeading(content, heading);
  const tableLines = section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));

  if (tableLines.length < 3) {
    return [];
  }

  const headers = splitMarkdownRow(tableLines[0]);
  return tableLines.slice(2).map((line) => {
    const cells = splitMarkdownRow(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = stripTicks(cells[index] ?? "");
    });
    return row;
  });
}

function sectionAfterHeading(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) {
    return "";
  }

  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n## /);
  return nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
}

function splitMarkdownRow(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function validateRequiredBullet(content: string, label: string, errors: string[]): void {
  const value = parseBulletValue(content, label);
  if (!value || isPending(value)) {
    errors.push(`${label} is required`);
  }
}

function parseBulletValue(content: string, label: string): string {
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index]?.trim() ?? "";
    const inlinePrefix = `- ${label}: `;

    if (trimmed.startsWith(inlinePrefix)) {
      return stripTicks(trimmed.slice(inlinePrefix.length));
    }

    if (trimmed !== `- ${label}:`) {
      continue;
    }

    const values: string[] = [];
    for (let next = index + 1; next < lines.length; next += 1) {
      const line = lines[next] ?? "";
      if (line.startsWith("- ") || line.startsWith("## ")) {
        break;
      }
      if (line.trim()) {
        values.push(line.trim());
      }
    }
    return stripTicks(values.join(" "));
  }

  return "";
}

function stripTicks(value: string): string {
  return value.trim().replace(/^`|`$/g, "");
}

function isPending(value: string): boolean {
  const normalized = stripTicks(value).trim().toLowerCase();
  return normalized === "pending" ||
    normalized.startsWith("pending ") ||
    normalized === "none yet" ||
    normalized === "not created" ||
    normalized.startsWith("not created ") ||
    normalized === "not applicable" ||
    normalized.startsWith("not applicable ") ||
    normalized.startsWith("not-applicable");
}

function main(): void {
  const args = process.argv.slice(2);
  const validateAll = args.includes("--all");
  const requestArg = args.find((arg) => !arg.startsWith("--"));

  if (!requestArg && !validateAll) {
    console.error("Usage: npm run product-request:validate -- <request-path>");
    console.error("   or: npm run product-request:validate -- --all");
    process.exit(1);
  }

  const requestPath = requestArg ? path.resolve(process.cwd(), requestArg) : path.resolve(process.cwd(), "docs/workspace/product-requests");
  const result = validateAll ? validateAllProductRequests(requestPath) : validateProductRequestPath(requestPath);

  console.log("Product Request Validation");
  console.log(`- status: ${result.status}`);
  console.log(`- ${validateAll ? "root" : "request"}: ${requestPath}`);

  if (result.errors.length > 0) {
    console.log("- blockers:");
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
