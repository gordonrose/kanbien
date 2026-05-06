import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("build work panel artifact chain", () => {
  it("keeps the root-admin Build panel blocked on design-system proof before app adoption", () => {
    const requiredFiles = [
      "docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md",
      "docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md",
      "docs/workspace/design-system/patterns/build-work-panel-pattern.md",
      "docs/workspace/design-system/verification/build-work-panel-verification-checklist.md",
      "docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md",
      "src/frontend/designSystem/patterns/build-work-panel-demo/index.html",
      "src/frontend/designSystem/components/build-work-panel.html",
      "src/frontend/designSystem/canonicals/build-work-panel/index.html",
      "src/frontend/designSystem/assets/buildWorkPanel.mjs",
      "src/frontend/designSystem/assets/buildWorkPanelCanonical.mjs",
      "src/frontend/designSystem/assets/buildWorkPanelDemo.css",
      "src/frontend/designSystem/assets/buildWorkPanelDemo.mjs",
    ];

    for (const relativePath of requiredFiles) {
      expect(existsSync(resolve(process.cwd(), relativePath))).toBe(true);
    }

    const behaviorLock = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md"),
      "utf8",
    );
    const referencePack = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md"),
      "utf8",
    );
    const pattern = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/patterns/build-work-panel-pattern.md"),
      "utf8",
    );
    const verification = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/verification/build-work-panel-verification-checklist.md"),
      "utf8",
    );
    const adoption = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md"),
      "utf8",
    );
    const demo = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/patterns/build-work-panel-demo/index.html"),
      "utf8",
    );
    const component = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/components/build-work-panel.html"),
      "utf8",
    );
    const canonicalLauncher = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/canonicals/build-work-panel/index.html"),
      "utf8",
    );
    const seam = readFileSync(resolve(process.cwd(), "src/frontend/designSystem/assets/buildWorkPanel.mjs"), "utf8");
    const canonicalController = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/buildWorkPanelCanonical.mjs"),
      "utf8",
    );
    const catalog = readFileSync(resolve(process.cwd(), "src/frontend/designSystem/patterns/index.html"), "utf8");
    const demoCss = readFileSync(resolve(process.cwd(), "src/frontend/designSystem/assets/buildWorkPanelDemo.css"), "utf8");

    expect(behaviorLock).toContain("BWP-000");
    expect(behaviorLock).toContain("Reporting, Support, and Build");
    expect(behaviorLock).toContain("Root-admin app adoption is blocked");
    expect(referencePack).toContain("BWP-R-001");
    expect(referencePack).toContain("BWP-R-020");
    expect(referencePack).toContain("canonical-created");
    expect(pattern).toContain("root-admin shell Build panel");
    expect(pattern).toContain("page-local CSS implementation");
    expect(pattern).toContain("/design-system/patterns/build-work-panel-demo");
    expect(verification).toContain("Real-app adoption now allowed:");
    expect(verification).toContain("no");
    expect(adoption).toContain("Shared render seam:");
    expect(adoption).toContain("missing");
    expect(adoption).toContain("Do not implement root-admin app UI by copying design-system markup");
    expect(demo).toContain("data-build-work-panel-demo");
    expect(demo).toContain("data-build-work-panel-demo-history-toggle");
    expect(demo).toContain("Conversation history");
    expect(demo).toContain("data-build-work-panel-demo-settings-drawer");
    expect(demo).toContain("data-build-work-panel-demo-theme");
    expect(demo).toContain("data-build-work-panel-demo-scale");
    expect(demo).toContain("data-build-work-panel-demo-direction");
    expect(demo).toContain("/design-system/assets/buildWorkPanelDemo.css");
    expect(demo).toContain("Signed-off pattern");
    expect(demo).toContain("Signed off");
    expect(demo).toContain("Pattern surface");
    expect(demo).toContain("Not app-consumable");
    expect(demo).toContain("Reporting");
    expect(demo).toContain("Support");
    expect(demo).toContain("Build");
    expect(demo).not.toContain("data-build-work-panel-demo-starter");
    expect(demo).not.toContain("You're currently on");
    expect(component).toContain("data-build-work-panel-surface=\"canonical\"");
    expect(component).toContain("id=\"build-work-panel-preview-shell\"");
    expect(component).toContain("/design-system/assets/buildWorkPanelCanonical.mjs");
    expect(canonicalLauncher).toContain("Build Work Panel Canonicals");
    expect(canonicalLauncher).toContain("/design-system/canonical-renderings/build-work-panel/BWP-R-001");
    expect(canonicalLauncher).toContain("/design-system/canonical-renderings/build-work-panel/BWP-R-020");
    expect(seam).toContain("export function renderBuildWorkPanel");
    expect(seam).toContain("export function createBuildWorkPanelController");
    expect(seam).toContain("buildWorkPanelCanonicalRefs");
    expect(seam).toContain("BWP-R-013");
    expect(seam).toContain("BWP-R-020");
    expect(seam).toContain("toolsOpen");
    expect(seam).toContain("replyToMessageIndex");
    expect(seam).toContain("forceHistoryTooltip");
    expect(canonicalController).toContain("createBuildWorkPanelController");
    expect(canonicalController).toContain("/design-system/canonical-renderings/build-work-panel/");
    expect(demoCss).toContain("--bwp-raised-surface");
    expect(demoCss).toContain("--bwp-panel-surface");
    expect(demoCss).toContain("--bwp-active-surface");
    expect(demoCss).not.toContain("background: #fff;");
    expect(demoCss).not.toContain("background: #f8fbff;");
    expect(demoCss).not.toContain("background: #eff6ff;");
    expect(demoCss).not.toContain("background: #e6f5f2;");
    expect(catalog).toContain('href="/design-system/patterns/build-work-panel-demo"');
  });
});
