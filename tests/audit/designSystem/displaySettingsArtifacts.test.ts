import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function listHtmlFiles(root: string): string[] {
  return readdirSync(root).flatMap((entry) => {
    const absolutePath = resolve(root, entry);
    if (statSync(absolutePath).isDirectory()) {
      return listHtmlFiles(absolutePath);
    }
    return absolutePath.endsWith(".html") ? [absolutePath] : [];
  });
}

function findTagStart(source: string, attributeIndex: number) {
  return source.lastIndexOf("<", attributeIndex);
}

function findOpenTagEnd(source: string, tagStart: number) {
  const match = source.slice(tagStart).match(/>/);
  return match ? tagStart + (match.index ?? 0) : -1;
}

function findAncestorTagStart(source: string, tagName: string, beforeIndex: number) {
  const openPattern = new RegExp(`<${tagName}\\b`, "gi");
  const closePattern = new RegExp(`</${tagName}>`, "gi");
  let lastOpen = -1;
  let openMatch = openPattern.exec(source);
  while (openMatch && openMatch.index < beforeIndex) {
    lastOpen = openMatch.index;
    openMatch = openPattern.exec(source);
  }

  let lastClose = -1;
  let closeMatch = closePattern.exec(source);
  while (closeMatch && closeMatch.index < beforeIndex) {
    lastClose = closeMatch.index;
    closeMatch = closePattern.exec(source);
  }

  return lastOpen > lastClose ? lastOpen : -1;
}

function tagContainsClass(source: string, tagStart: number, className: string) {
  const tagEnd = findOpenTagEnd(source, tagStart);
  if (tagEnd === -1) {
    return false;
  }
  const tag = source.slice(tagStart, tagEnd + 1);
  return new RegExp(`class=["'][^"']*\\b${className}\\b`).test(tag);
}

function getOpeningTag(source: string, attributeIndex: number) {
  const tagStart = findTagStart(source, attributeIndex);
  const tagEnd = tagStart === -1 ? -1 : findOpenTagEnd(source, tagStart);
  return tagStart === -1 || tagEnd === -1 ? "" : source.slice(tagStart, tagEnd + 1);
}

describe("display settings artifact chain", () => {
  it("starts the payload loop separately from the signed-off context-nav drawer shell", () => {
    const requiredFiles = [
      "docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md",
      "docs/workspace/design-system/patterns/display-settings-pattern.md",
      "docs/workspace/design-system/adoption/root-admin-display-settings-adoption-contract.md",
      "docs/workspace/design-system/reference-packs/display-settings-reference-pack.md",
      "docs/workspace/design-system/verification/display-settings-verification-checklist.md",
      "src/frontend/designSystem/canonicals/display-settings/index.html",
    ];

    for (const relativePath of requiredFiles) {
      expect(existsSync(resolve(process.cwd(), relativePath))).toBe(true);
    }

    const behaviorLock = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md"),
      "utf8",
    );
    const controlsPattern = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/patterns/display-settings-pattern.md"),
      "utf8",
    );
    const adoption = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/adoption/root-admin-display-settings-adoption-contract.md"),
      "utf8",
    );
    const referencePack = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/reference-packs/display-settings-reference-pack.md"),
      "utf8",
    );
    const verificationChecklist = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/verification/display-settings-verification-checklist.md"),
      "utf8",
    );
    const canonicalLauncher = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/display-settings/index.html"),
      "utf8",
    );

    expect(behaviorLock).toContain("context-nav drawer");
    expect(behaviorLock).toContain("display settings");
    expect(behaviorLock).toContain("theme");
    expect(behaviorLock).toContain("magnification");
    expect(controlsPattern).toContain("signed-off");
    expect(controlsPattern).toContain("display-settings-behavior-lock.md");
    expect(adoption).toContain("active first-consumer adoption contract");
    expect(referencePack).toContain("DSR-001");
    expect(verificationChecklist).toContain("display settings");
    expect(canonicalLauncher).toContain("Display Settings Canonicals");
  });

  it("keeps display settings launchers mounted in context nav instead of page content", () => {
    const designSystemRoot = resolve(process.cwd(), "src/frontend/designSystem");
    const violations = [];

    for (const filePath of listHtmlFiles(designSystemRoot)) {
      const source = readFileSync(filePath, "utf8");
      const launcherPattern = /\bdata-[\w-]*settings-open\b/g;
      let match = launcherPattern.exec(source);

      while (match) {
        const tagStart = findTagStart(source, match.index);
        const navStart = findAncestorTagStart(source, "nav", tagStart);
        const isContextNav = navStart !== -1 && tagContainsClass(source, navStart, "context-nav");
        const isContextNavButton = tagStart !== -1 && tagContainsClass(source, tagStart, "context-nav-item");

        if (!isContextNav || !isContextNavButton) {
          violations.push(`${filePath.replace(`${process.cwd()}/`, "")}:${source.slice(0, match.index).split("\n").length}`);
        }

        match = launcherPattern.exec(source);
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps display settings drawers on the side-panel chassis instead of floating demo drawers", () => {
    const designSystemRoot = resolve(process.cwd(), "src/frontend/designSystem");
    const violations = [];

    for (const filePath of listHtmlFiles(designSystemRoot)) {
      const source = readFileSync(filePath, "utf8");
      const drawerPattern = /\bdata-[\w-]*settings-drawer\b/g;
      let match = drawerPattern.exec(source);

      while (match) {
        const tag = getOpeningTag(source, match.index);
        const hasSidePanel = /\bclass=["'][^"']*\bside-panel\b/.test(tag);
        const usesFloatingDemoDrawer = /\bclass=["'][^"']*\bbuild-work-panel-demo-settings-drawer\b/.test(tag);

        if (!hasSidePanel || usesFloatingDemoDrawer) {
          violations.push(`${filePath.replace(`${process.cwd()}/`, "")}:${source.slice(0, match.index).split("\n").length}`);
        }

        match = drawerPattern.exec(source);
      }
    }

    expect(violations).toEqual([]);
  });
});
