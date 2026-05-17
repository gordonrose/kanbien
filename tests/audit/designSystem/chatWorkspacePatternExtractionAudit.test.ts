import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("chat workspace pattern extraction audit", () => {
  it("keeps bootstrap orchestration out of the preview pattern", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const auditSource = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/adoption/chat-workspace-pattern-extraction-audit.md"),
      "utf8",
    );

    expect(patternSource).toContain("createChatWorkspaceBootstrap");
    expect(patternSource).toContain("bootstrapController.initialize");
    expect(patternSource).not.toContain("createChatWorkspaceShellController");
    expect(patternSource).not.toContain("createChatWorkspaceListInteractionController");
    expect(patternSource).not.toContain("createChatWorkspacePreviewEffectHandlers");
    expect(patternSource).not.toContain("document.addEventListener(\"click\"");
    expect(patternSource).not.toContain("document.addEventListener(\"keydown\"");
    expect(patternSource).not.toContain("target?.closest(\"[data-chat-workspace-toggle]\")");
    expect(patternSource).not.toContain("workspaceState.expanded = !workspaceState.expanded");

    expect(auditSource).toContain("Demo Data");
    expect(auditSource).toContain("Preview Render Callbacks");
    expect(auditSource).toContain("Remaining Shared-Seam Candidates");
    expect(auditSource).toContain("chatWorkspaceBootstrap.mjs");
  });
});
