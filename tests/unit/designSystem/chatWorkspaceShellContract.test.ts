import { describe, expect, it } from "vitest";

import {
  CHAT_WORKSPACE_SCOPE_FORMULA,
  chatWorkspaceFeatureDefaults,
  chatWorkspaceFeatureFlags,
  chatWorkspaceLayers,
  createChatWorkspaceShellConfig,
  createChatWorkspaceScope,
  getChatWorkspaceEntityCount,
  getChatWorkspaceEntityStatuses,
  getChatWorkspaceLayer,
  getChatWorkspaceLayerDefaultEntity,
  getChatWorkspaceLayerDefaultTool,
  getChatWorkspaceLayerTools,
  isChatWorkspaceExpansionEnabled,
  isCompleteChatWorkspaceScope,
  normalizeChatWorkspaceFeatures,
  shouldResolveChatWorkspaceEntities,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs";

interface ChatWorkspaceLayer {
  key: string;
}

interface ChatWorkspaceTool {
  key: string;
}

describe("chatWorkspaceShellContract", () => {
  it("keeps workspace expansion disabled unless a page explicitly opts in", () => {
    expect(isChatWorkspaceExpansionEnabled()).toBe(false);
    expect(isChatWorkspaceExpansionEnabled({})).toBe(false);
    expect(isChatWorkspaceExpansionEnabled({ expansion: "disabled" })).toBe(false);
    expect(isChatWorkspaceExpansionEnabled({ expansion: "enabled" })).toBe(true);
  });

  it("normalizes consumer config so optional workspace features stay disabled by default", () => {
    expect(Object.keys(chatWorkspaceFeatureFlags).sort()).toEqual([
      "conversationIndex",
      "entitySelector",
      "rowDrawer",
      "rowReorder",
      "statusDragDrop",
      "statusTabs",
    ]);
    expect(chatWorkspaceFeatureDefaults).toEqual({
      conversationIndex: false,
      entitySelector: false,
      rowDrawer: false,
      rowReorder: false,
      statusDragDrop: false,
      statusTabs: false,
    });
    expect(normalizeChatWorkspaceFeatures({ conversationIndex: true, rowDrawer: "yes" })).toEqual({
      conversationIndex: true,
      entitySelector: false,
      rowDrawer: false,
      rowReorder: false,
      statusDragDrop: false,
      statusTabs: false,
    });

    const resolver = () => [];
    const shellConfig = createChatWorkspaceShellConfig({
      defaultExpanded: true,
      expansion: "enabled",
      features: { conversationIndex: true, entitySelector: true, statusTabs: true },
      resolveEntities: resolver,
    });

    expect(shellConfig).toMatchObject({
      defaultExpanded: true,
      defaultLayer: "discovery",
      expansion: "enabled",
      features: {
        conversationIndex: true,
        entitySelector: true,
        rowDrawer: false,
        rowReorder: false,
        statusDragDrop: false,
        statusTabs: true,
      },
      resolveEntities: resolver,
    });
  });

  it("does not resolve scoped entities unless expansion, resolver, and complete scope are all present", () => {
    const scope = createChatWorkspaceScope({
      chatId: "chat-1",
      entityCategory: "questions",
      layer: "discovery",
    });
    const resolver = () => [];

    expect(shouldResolveChatWorkspaceEntities({ expansion: "enabled", resolveEntities: resolver }, scope)).toBe(true);
    expect(shouldResolveChatWorkspaceEntities({ expansion: "disabled", resolveEntities: resolver }, scope)).toBe(false);
    expect(shouldResolveChatWorkspaceEntities({ expansion: "enabled" }, scope)).toBe(false);
    expect(shouldResolveChatWorkspaceEntities({ expansion: "enabled", resolveEntities: resolver }, { layer: "discovery" })).toBe(false);
  });

  it("declares the layer/entity/chat scope rule as the reusable contract", () => {
    const scope = createChatWorkspaceScope({
      layer: "discovery",
      entityCategory: "questions",
      chatId: "chat-workspace-discovery-history",
    });

    expect(CHAT_WORKSPACE_SCOPE_FORMULA).toBe("Layer + Entity Category + Chat = Scoped Entity List");
    expect(scope).toEqual({
      layer: "discovery",
      entityCategory: "questions",
      chatId: "chat-workspace-discovery-history",
    });
    expect(isCompleteChatWorkspaceScope(scope)).toBe(true);
    expect(isCompleteChatWorkspaceScope({ layer: "discovery", entityCategory: "questions" })).toBe(false);
  });

  it("keeps the approved layer defaults and toolbar category maps stable", () => {
    const discovery = getChatWorkspaceLayer("discovery");
    const design = getChatWorkspaceLayer("design");
    const delivery = getChatWorkspaceLayer("delivery");

    expect((chatWorkspaceLayers as ChatWorkspaceLayer[]).map((layer) => layer.key)).toEqual([
      "discovery",
      "design",
      "delivery",
    ]);
    expect(getChatWorkspaceLayerDefaultEntity(discovery).key).toBe("questions");
    expect(getChatWorkspaceLayerDefaultTool(discovery)).toBe("conversations");
    expect(getChatWorkspaceLayerDefaultEntity(design).key).toBe("architecture-questions");
    expect(getChatWorkspaceLayerDefaultTool(design)).toBe("conversations");
    expect(getChatWorkspaceLayerDefaultEntity(delivery).key).toBe("stories");
    expect(getChatWorkspaceLayerDefaultTool(delivery)).toBe("stories");

    expect((getChatWorkspaceLayerTools("discovery") as ChatWorkspaceTool[]).map((tool) => tool.key)).toEqual([
      "conversations",
      "questions",
    ]);
    expect((getChatWorkspaceLayerTools("design") as ChatWorkspaceTool[]).map((tool) => tool.key)).toEqual([
      "conversations",
      "architecture-questions",
      "design-questions",
    ]);
    expect((getChatWorkspaceLayerTools("delivery") as ChatWorkspaceTool[]).map((tool) => tool.key)).toEqual([
      "product-discovery-package",
      "epics",
      "stories",
      "tasks",
    ]);
  });

  it("keeps each entity status vocabulary unique and countable", () => {
    const expectedStatuses = {
      "product-discovery-package": ["Draft", "In Refinement", "Ready for Review", "Done"],
      "chat-session": ["In Progress", "Paused", "Complete", "Archived"],
      questions: ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
      "architecture-questions": ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
      "design-questions": ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
      epics: [
        "Draft",
        "Steering",
        "Blocked",
        "In Refinement",
        "Ready for Delivery",
        "In Delivery",
        "Ready for Review",
        "Ready for Deploy",
        "Deployed",
      ],
      stories: [
        "Draft",
        "Blocked",
        "In Refinement",
        "Ready for Review",
        "Task Breakdown",
        "Ready for Delivery",
        "Ready for Deploy",
        "Deployed",
      ],
      tasks: ["Draft", "Blocked", "In Refinement", "Ready for Review", "Ready for Delivery", "Ready for Deploy", "Deployed"],
    };

    for (const [entityKey, statuses] of Object.entries(expectedStatuses)) {
      const actualStatuses = getChatWorkspaceEntityStatuses(entityKey);
      expect(actualStatuses).toEqual(statuses);
      expect(new Set(actualStatuses).size, `${entityKey} has duplicate statuses`).toBe(actualStatuses.length);
      expect(getChatWorkspaceEntityCount(entityKey), `${entityKey} count`).toBeGreaterThanOrEqual(actualStatuses.length);
    }
  });
});
