import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
    expect(controlsPattern).toContain("exploratory");
    expect(controlsPattern).toContain("display-settings-behavior-lock.md");
    expect(adoption).toContain("active first-consumer adoption contract");
    expect(referencePack).toContain("DSR-001");
    expect(verificationChecklist).toContain("display settings");
    expect(canonicalLauncher).toContain("Display Settings Canonicals");
  });
});
