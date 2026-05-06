import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("conversation panel governed adoption guard", () => {
  it("keeps root-admin adoption pinned to the neutral conversationPanel seam", () => {
    const adoptionContract = read(
      "docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md",
    );
    const governedUiGuard = read("src/scripts/checkGovernedUiAdoption.ts");
    const rootAdminUiGuard = read("src/scripts/checkGovernedRootAdminUi.ts");

    expect(adoptionContract).toContain("/design-system/assets/conversationPanel.mjs");
    expect(adoptionContract).toContain("renderConversationPanel");
    expect(adoptionContract).toContain("createConversationPanelController");
    expect(adoptionContract).toContain("createBuildConversationPanelConfig");
    expect(adoptionContract).toContain("with a Build config and explicit");
    expect(adoptionContract).toContain("/design-system/assets/buildWorkPanel.mjs");
    expect(adoptionContract).toContain("imports are drift");

    expect(governedUiGuard).toContain("family: \"conversation panel\"");
    expect(governedUiGuard).toContain("/design-system/assets/conversationPanel.css");
    expect(governedUiGuard).toContain("/design-system/assets/conversationPanel.mjs");
    expect(governedUiGuard).toContain("renderConversationPanel");
    expect(governedUiGuard).toContain("createConversationPanelController");
    expect(governedUiGuard).toContain("buildWorkPanel\\.mjs");
    expect(governedUiGuard).toContain("build-work-panel-demo-");

    expect(rootAdminUiGuard).toContain("forbiddenRootAdminConversationPanelOwnershipPatterns");
    expect(rootAdminUiGuard).toContain("buildWorkPanel\\.mjs");
    expect(rootAdminUiGuard).toContain("build-work-panel-demo-");
    expect(rootAdminUiGuard).toContain("data-build-work-panel");
  });

  it("proves the governed UI adoption self-test rejects CSS-only and local panel reconstruction", () => {
    const output = execFileSync(
      "node",
      ["--import", "tsx", "src/scripts/checkGovernedUiAdoption.ts", "--self-test"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
      },
    );

    expect(output).toContain("Governed UI adoption guard self-test: passed.");
    expect(output).toContain("CSS-only adoption and app-local governed markup reconstruction are rejected.");
  });
});
