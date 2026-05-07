import { spawnSync } from "node:child_process";

import type { Layer5TaskContext, WriteSetResult } from "./contract";

export function checkWriteSet(context: Layer5TaskContext, mode: "report" | "enforced" = "report"): WriteSetResult {
  return analyzeWriteSet(context.task.allowedWriteSet, collectChangedFiles(), mode);
}

export function analyzeWriteSet(
  allowedWriteSet: string,
  changedFiles: string[],
  mode: "report" | "enforced" = "report",
): WriteSetResult {
  const allowedEntries = parseAllowedEntries(allowedWriteSet);
  const ambiguousEntries = allowedEntries.filter(isAmbiguousEntry);
  const uniqueChangedFiles = [...new Set(changedFiles)].sort();

  if (allowedEntries.length === 0) {
    return {
      status: "blocked",
      mode,
      reason: "task has no allowed write set entries",
      allowedEntries,
      changedFiles: uniqueChangedFiles,
      allowedFiles: [],
      forbiddenFiles: uniqueChangedFiles,
      ambiguousEntries,
    };
  }

  if (ambiguousEntries.length > 0) {
    return {
      status: "blocked",
      mode,
      reason: `allowed write set contains ambiguous broad entries: ${ambiguousEntries.join(", ")}`,
      allowedEntries,
      changedFiles: uniqueChangedFiles,
      allowedFiles: [],
      forbiddenFiles: uniqueChangedFiles,
      ambiguousEntries,
    };
  }

  const allowedFiles = uniqueChangedFiles.filter((file) => allowedEntries.some((entry) => matchesAllowedEntry(entry, file)));
  const forbiddenFiles = uniqueChangedFiles.filter((file) => !allowedFiles.includes(file));

  if (forbiddenFiles.length > 0) {
    return {
      status: "blocked",
      mode,
      reason: `changed files exceed allowed write set: ${forbiddenFiles.join(", ")}`,
      allowedEntries,
      changedFiles: uniqueChangedFiles,
      allowedFiles,
      forbiddenFiles,
      ambiguousEntries,
    };
  }

  return {
    status: "pass",
    mode,
    reason: uniqueChangedFiles.length > 0 ? "changed files are inside the allowed write set" : "no changed files detected",
    allowedEntries,
    changedFiles: uniqueChangedFiles,
    allowedFiles,
    forbiddenFiles,
    ambiguousEntries,
  };
}

function collectChangedFiles(): string[] {
  return [
    ...gitLines(["diff", "--name-only"]),
    ...gitLines(["diff", "--name-only", "--cached"]),
    ...gitLines(["ls-files", "--others", "--exclude-standard"]),
  ];
}

function gitLines(args: string[]): string[] {
  const result = spawnSync("git", args, {
    cwd: process.cwd(),
    shell: false,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return [];
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseAllowedEntries(value: string): string[] {
  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => !entry.toLowerCase().startsWith("not-applicable"));
}

function isAmbiguousEntry(entry: string): boolean {
  const normalized = entry.replace(/\/$/, "");
  return normalized === "**" || normalized === "*" || ["src/**", "src", "tests/**", "tests", "docs/**", "docs"].includes(normalized);
}

function matchesAllowedEntry(entry: string, filePath: string): boolean {
  if (!entry.includes("*")) {
    return filePath === entry;
  }

  if (entry.endsWith("/**")) {
    const prefix = entry.slice(0, -3);
    return filePath === prefix || filePath.startsWith(`${prefix}/`);
  }

  if (entry.includes("**/*.")) {
    const [prefix, extension] = entry.split("**/*.");
    return filePath.startsWith(prefix) && filePath.endsWith(`.${extension}`);
  }

  if (entry.endsWith("*")) {
    const prefix = entry.slice(0, -1);
    return filePath.startsWith(prefix);
  }

  return false;
}
