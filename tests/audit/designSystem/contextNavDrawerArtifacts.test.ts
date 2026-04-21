import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
});
