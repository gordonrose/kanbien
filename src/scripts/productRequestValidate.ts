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
    errors.push(...validateProductRequestFolder(loaded.rootPath));
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

function validateProductRequestFolder(rootPath: string): string[] {
  const errors: string[] = [];
  const epicsPath = path.join(rootPath, "epics");

  if (!existsSync(epicsPath) || !statSync(epicsPath).isDirectory()) {
    errors.push(`folder Product Request missing epics directory: ${epicsPath}`);
    return errors;
  }

  const epicFolders = readdirSync(epicsPath)
    .filter((entry) => /^EPIC-[A-Za-z0-9]+/.test(entry))
    .sort();

  if (epicFolders.length === 0) {
    errors.push(`folder Product Request has no epics/EPIC-* directories: ${epicsPath}`);
  }

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

function validateRequiredBullet(content: string, label: string, errors: string[]): void {
  const value = parseBulletValue(content, label);
  if (!value || isPending(value)) {
    errors.push(`${label} is required`);
  }
}

function parseBulletValue(content: string, label: string): string {
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index]?.trim() !== `- ${label}:`) {
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
    normalized.startsWith("not-applicable");
}

function main(): void {
  const requestArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));

  if (!requestArg) {
    console.error("Usage: npm run product-request:validate -- <request-path>");
    process.exit(1);
  }

  const requestPath = path.resolve(process.cwd(), requestArg);
  const result = validateProductRequestPath(requestPath);

  console.log("Product Request Validation");
  console.log(`- status: ${result.status}`);
  console.log(`- request: ${requestPath}`);

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
