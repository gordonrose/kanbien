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

function getOpeningTag(source: string, attributeIndex: number) {
  const tagStart = findTagStart(source, attributeIndex);
  const tagEnd = tagStart === -1 ? -1 : findOpenTagEnd(source, tagStart);
  return tagStart === -1 || tagEnd === -1 ? "" : source.slice(tagStart, tagEnd + 1);
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

function tagContainsClass(tag: string, className: string) {
  return new RegExp(`class=["'][^"']*\\b${className}\\b`).test(tag);
}

function findElementOpeningTagById(source: string, id: string) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idMatch = new RegExp(`\\bid=["']${escapedId}["']`).exec(source);
  if (!idMatch) {
    return "";
  }
  return getOpeningTag(source, idMatch.index);
}

function getAttribute(tag: string, attributeName: string) {
  return new RegExp(`\\b${attributeName}=["']([^"']+)["']`).exec(tag)?.[1] ?? "";
}

describe("context-nav drawer artifact chain", () => {
  it("defines dedicated drawer-shell artifacts while keeping display settings as a separate payload concern", () => {
    const requiredFiles = [
      "docs/workspace/design-system/patterns/drawer-pattern.md",
      "docs/workspace/design-system/patterns/display-settings-pattern.md",
      "docs/workspace/design-system/reference-packs/context-nav-drawer-reference-pack.md",
      "docs/workspace/design-system/verification/context-nav-drawer-verification-checklist.md",
      "docs/workspace/design-system/adoption/root-admin-shell-context-nav-adoption-contract.md",
    ];

    for (const relativePath of requiredFiles) {
      expect(existsSync(resolve(process.cwd(), relativePath))).toBe(true);
    }

    const drawerPattern = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/patterns/drawer-pattern.md"),
      "utf8",
    );
    const controlsPattern = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/patterns/display-settings-pattern.md"),
      "utf8",
    );
    const referencePack = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/reference-packs/context-nav-drawer-reference-pack.md"),
      "utf8",
    );
    const adoption = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/adoption/root-admin-shell-context-nav-adoption-contract.md"),
      "utf8",
    );

    expect(drawerPattern).toContain("shell-attached");
    expect(drawerPattern).toContain("bottom-attached");
    expect(controlsPattern).toContain("Theme, magnification, accent, and direction controls");
    expect(controlsPattern).toContain("context-nav drawer");
    expect(referencePack).toContain("CDR-001");
    expect(referencePack).toContain("CNR-007");
    expect(adoption).toContain("context-nav drawer");
    expect(adoption).toContain("theme");
    expect(adoption).toContain("magnification");
  });

  it("keeps context-nav hosted drawer and panel launchers on the side-panel chassis", () => {
    const designSystemRoot = resolve(process.cwd(), "src/frontend/designSystem");
    const violations = [];

    for (const filePath of listHtmlFiles(designSystemRoot)) {
      const source = readFileSync(filePath, "utf8");
      const controlPattern = /\baria-controls=["']([^"']*(?:drawer|panel)[^"']*)["']/g;
      let match = controlPattern.exec(source);

      while (match) {
        const launcherTag = getOpeningTag(source, match.index);
        const launcherTagStart = findTagStart(source, match.index);
        const navStart = findAncestorTagStart(source, "nav", launcherTagStart);
        const navTag = navStart === -1 ? "" : getOpeningTag(source, navStart);
        const isContextNavHosted = tagContainsClass(navTag, "context-nav");

        if (!isContextNavHosted) {
          match = controlPattern.exec(source);
          continue;
        }

        const controlledId = match[1];
        const controlledTag = findElementOpeningTagById(source, controlledId);
        const isContextNavItem = tagContainsClass(launcherTag, "context-nav-item");
        const controlledIsSidePanel = tagContainsClass(controlledTag, "side-panel");
        const usesKnownFloatingDrawerClass =
          tagContainsClass(controlledTag, "build-work-panel-demo-settings-drawer");
        const missingControlledElement = controlledTag.length === 0;

        if (!isContextNavItem || !controlledIsSidePanel || usesKnownFloatingDrawerClass || missingControlledElement) {
          violations.push({
            file: `${filePath.replace(`${process.cwd()}/`, "")}:${source.slice(0, match.index).split("\n").length}`,
            controls: controlledId,
            launcherClass: getAttribute(launcherTag, "class"),
            controlledClass: getAttribute(controlledTag, "class"),
          });
        }

        match = controlPattern.exec(source);
      }
    }

    expect(violations).toEqual([]);
  });
});
