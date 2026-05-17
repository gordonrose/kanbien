import { describe, expect, it } from "vitest";

import {
  renderChatWorkspaceSecondaryHeader,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceSecondaryHeader.mjs";

describe("chatWorkspaceSecondaryHeader", () => {
  it("renders chat-only secondary header without index or list sections", () => {
    const html = renderChatWorkspaceSecondaryHeader({
      historyOpen: false,
      workspaceExpanded: false,
      chatLabel: "Discovery chat",
      entityLabel: "Questions",
      recordCount: 22,
    });

    expect(html).toContain("data-chat-workspace-secondary-chat");
    expect(html).toContain("Discovery chat");
    expect(html).toContain("data-chat-workspace-secondary-new-chat");
    expect(html).not.toContain("data-chat-workspace-secondary-index");
    expect(html).not.toContain("data-chat-workspace-secondary-list");
    expect(html).not.toContain("22 records");
  });

  it("renders index, list, count, and new-chat sections when expanded with history open", () => {
    const html = renderChatWorkspaceSecondaryHeader({
      historyOpen: true,
      workspaceExpanded: true,
      chatLabel: "Discovery chat history",
      entityLabel: "Questions",
      entitySelectorExpanded: true,
      recordCount: 22,
    });

    expect(html).toContain("data-chat-workspace-secondary-index");
    expect(html).toContain("data-chat-workspace-secondary-list");
    expect(html).toContain("data-chat-workspace-secondary-new-chat");
    expect(html).toContain("Discovery chat history");
    expect(html).toContain("Questions");
    expect(html).toContain("22 records");
    expect(html).toContain('data-chat-workspace-entity-selector-trigger');
    expect(html).toContain('aria-expanded="true"');
    expect(html).not.toContain("data-chat-workspace-secondary-chat");
  });
});
