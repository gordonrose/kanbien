import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("page-shell banner artifact chain", () => {
  it("defines a dedicated canonical launcher and render surface for the signed-off shell banner family", () => {
    const requiredFiles = [
      "docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md",
      "docs/workspace/design-system/patterns/page-shell-banner-pattern.md",
      "docs/workspace/design-system/components/page-shell-banner-component.md",
      "docs/workspace/design-system/reference-packs/page-shell-banner-reference-pack.md",
      "docs/workspace/design-system/verification/page-shell-banner-verification-checklist.md",
      "src/frontend/designSystem/canonicals/page-shell-banner/index.html",
      "src/frontend/designSystem/components/page-shell-banner.html",
      "src/frontend/designSystem/assets/pageShellBannerCanonical.mjs",
    ];

    for (const relativePath of requiredFiles) {
      expect(existsSync(resolve(process.cwd(), relativePath))).toBe(true);
    }

    const behaviorLock = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/behavior-locks/page-shell-banner-behavior-lock.md"),
      "utf8",
    );
    const pattern = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/patterns/page-shell-banner-pattern.md"),
      "utf8",
    );
    const component = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/components/page-shell-banner-component.md"),
      "utf8",
    );
    const referencePack = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/reference-packs/page-shell-banner-reference-pack.md"),
      "utf8",
    );
    const verificationChecklist = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/verification/page-shell-banner-verification-checklist.md"),
      "utf8",
    );
    const canonicalLauncher = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/page-shell-banner/index.html"),
      "utf8",
    );
    const canonicalRender = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/page-shell-banner.html"),
      "utf8",
    );

    expect(behaviorLock).toContain("visible close affordance");
    expect(pattern).toContain("shell-owned banner zone");
    expect(component).toContain("createPageShellBannerRuntimeController");
    expect(referencePack).toContain("PSBR-001");
    expect(verificationChecklist).toContain("Page-shell banner");
    expect(canonicalLauncher).toContain("Page-Shell Banner Canonicals");
    expect(canonicalLauncher).toContain("/design-system/canonical-renderings/page-shell-banner/PSBR-001");
    expect(canonicalRender).toContain("data-page-shell-banner-surface=\"canonical\"");
    expect(canonicalRender).toContain("pageShellBannerCanonical.mjs");
  });
});
