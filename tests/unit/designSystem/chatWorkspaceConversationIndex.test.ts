import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("chatWorkspaceConversationIndex extraction", () => {
  it("keeps the demo route wired through the conversation index docking seam", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const seamSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceConversationIndex.mjs"),
      "utf8",
    );

    expect(patternSource).toContain("dockChatWorkspaceConversationIndex");
    expect(patternSource).toContain("clearChatWorkspaceConversationIndex");
    expect(patternSource).not.toContain("historyDock.append(history)");
    expect(patternSource).not.toContain("panelBody.insertBefore(dockedHistory, chatColumn)");
    expect(seamSource).toContain("export function dockChatWorkspaceConversationIndex");
    expect(seamSource).toContain("export function clearChatWorkspaceConversationIndex");
    expect(seamSource).toContain("hideIndexLocalNewConversation");
    expect(seamSource).toContain("[data-build-work-panel-new-conversation]");
  });
});
