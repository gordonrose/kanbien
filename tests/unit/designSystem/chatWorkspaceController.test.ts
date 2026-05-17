import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  closeChatWorkspaceEntitySelector,
  closeChatWorkspaceLayerSelector,
  closeChatWorkspaceRowDrawer,
  getClosedChatWorkspaceDrawerState,
  getChatWorkspaceActionEffects,
  resolveChatWorkspaceClickActions,
  runChatWorkspaceActionEffects,
  selectChatWorkspaceEntity,
  selectChatWorkspaceLayer,
  selectChatWorkspaceTool,
  startChatWorkspaceConversation,
  toggleChatWorkspaceEntitySelector,
  toggleChatWorkspaceLayerSelector,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceController.mjs";
import {
  chatWorkspaceLayers,
  getChatWorkspaceLayerDefaultEntity,
  getChatWorkspaceLayerDefaultTool,
  getChatWorkspaceLayerTools,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs";

function makeState() {
  const layer = chatWorkspaceLayers[0];
  return {
    activeState: {
      layer,
      entity: getChatWorkspaceLayerDefaultEntity(layer),
      tool: getChatWorkspaceLayerDefaultTool(layer),
    },
    chatState: {
      activeMode: layer.key,
      panel: {
        historyOpen: false,
        historyView: "archived",
        copyNotice: "saved",
        renameConversationId: "conversation",
        showArchiveUndo: true,
        packetState: "ready",
        editMessageIndex: 0,
        replyToMessageIndex: 0,
      },
      history: [],
      archivedConversation: { conversationId: "archived" },
      messages: [{ author: "Builder", text: "Existing" }],
    },
    workspaceState: {
      drawer: { open: true, row: { key: "row" } },
      entityDrawerOpen: true,
      layerDrawerOpen: true,
    },
  };
}

describe("chatWorkspaceController", () => {
  it("keeps workspace state transition rules outside the pattern preview", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const controllerSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceController.mjs"),
      "utf8",
    );

    expect(patternSource).toContain("selectChatWorkspaceLayer");
    expect(patternSource).toContain("resolveChatWorkspaceClickActions");
    expect(patternSource).toContain("runChatWorkspaceActionEffects");
    expect(patternSource).toContain("selectChatWorkspaceEntity");
    expect(patternSource).toContain("selectChatWorkspaceTool");
    expect(patternSource).toContain("startChatWorkspaceConversation");
    expect(patternSource).not.toContain("chatState.messages = [");
    expect(patternSource).not.toContain("chatState.panel.historyView = \"active\"");
    expect(patternSource).not.toContain("workspaceState.entityDrawerOpen = false");
    expect(patternSource).not.toContain("workspaceState.layerDrawerOpen = false");
    expect(patternSource).not.toContain("target?.closest(\"[data-chat-workspace-layer-trigger]\")");
    expect(patternSource).not.toContain("target?.closest(\"[data-chat-workspace-entity-option]\")");

    expect(controllerSource).toContain("resolveChatWorkspaceClickActions");
    expect(controllerSource).toContain("getChatWorkspaceActionEffects");
    expect(controllerSource).toContain("runChatWorkspaceActionEffects");
    expect(controllerSource).toContain("selectChatWorkspaceLayer");
    expect(controllerSource).toContain("selectChatWorkspaceEntity");
    expect(controllerSource).toContain("selectChatWorkspaceTool");
    expect(controllerSource).toContain("startChatWorkspaceConversation");
    expect(controllerSource).toContain("resetChatWorkspaceTransientState");
  });

  it("maps governed action objects to ordered render/effect names", () => {
    expect(getChatWorkspaceActionEffects({ type: "close-layer-selector" })).toEqual(["sync-header"]);
    expect(getChatWorkspaceActionEffects({ type: "toggle-layer-selector" })).toEqual(["sync-header", "stop"]);
    expect(getChatWorkspaceActionEffects({ type: "select-layer" })).toEqual(["sync-layer", "open-panel", "mount-chat", "stop"]);
    expect(getChatWorkspaceActionEffects({ type: "select-entity" })).toEqual([
      "select-entity",
      "close-entity-selector",
      "sync-list",
      "stop",
    ]);
    expect(getChatWorkspaceActionEffects({ type: "toggle-history" })).toEqual(["toggle-history", "mount-chat", "stop"]);
    expect(getChatWorkspaceActionEffects({ type: "none" })).toEqual([]);
  });

  it("runs governed action effects through supplied render handlers", () => {
    const seen: string[] = [];
    const result = runChatWorkspaceActionEffects({ type: "select-entity", entityKey: "questions" }, {
      "select-entity": (action: { entityKey?: string }) => {
        seen.push(`select:${action.entityKey}`);
      },
      "close-entity-selector": () => {
        seen.push("close");
      },
      "sync-list": () => {
        seen.push("sync");
      },
    });

    expect(seen).toEqual(["select:questions", "close", "sync"]);
    expect(result).toEqual({
      effects: ["select-entity", "close-entity-selector", "sync-list", "stop"],
      stopped: true,
    });
    expect(runChatWorkspaceActionEffects({ type: "none" })).toEqual({ effects: [], stopped: false });
  });

  it("resolves shell click targets into governed action objects", () => {
    function targetFor(selector: string, dataset: Record<string, string> = {}) {
      return {
        closest(requested: string) {
          return requested === selector ? { dataset } : null;
        },
      };
    }
    const layerOutsideTarget = {
      closest(selector: string) {
        return selector === "[data-chat-workspace-toggle]" ? { dataset: {} } : null;
      },
    };

    expect(resolveChatWorkspaceClickActions(targetFor("[data-chat-workspace-layer-trigger]"))).toEqual([
      { type: "toggle-layer-selector" },
    ]);
    expect(resolveChatWorkspaceClickActions(targetFor("[data-chat-workspace-layer-option]", {
      chatWorkspaceLayerOption: "design",
    }))).toEqual([
      { type: "select-layer", layerKey: "design" },
    ]);
    expect(resolveChatWorkspaceClickActions(targetFor("[data-chat-workspace-entity-option]", {
      chatWorkspaceEntityOption: "questions",
    }))).toEqual([
      { type: "select-entity", entityKey: "questions" },
    ]);
    expect(resolveChatWorkspaceClickActions(targetFor("[data-chat-workspace-entity-selector-trigger]"))).toEqual([
      { type: "toggle-entity-selector" },
    ]);
    expect(resolveChatWorkspaceClickActions(targetFor("[data-chat-workspace-new-conversation]"))).toEqual([
      { type: "new-conversation" },
    ]);
    expect(resolveChatWorkspaceClickActions(layerOutsideTarget, {
      workspaceState: { layerDrawerOpen: true },
    })).toEqual([
      { type: "close-layer-selector" },
      { type: "toggle-workspace" },
    ]);
  });

  it("selects a layer and resets dependent chat/workspace state", () => {
    const { activeState, chatState, workspaceState } = makeState();

    const selected = selectChatWorkspaceLayer({
      layerKey: "design",
      layers: chatWorkspaceLayers,
      activeState,
      chatState,
      workspaceState,
      getLayerHistory: (layerKey: string) => [{ conversationId: layerKey }],
    });

    expect(selected?.key).toBe("design");
    expect(activeState.layer.key).toBe("design");
    expect(activeState.entity.key).toBe("architecture-questions");
    expect(activeState.tool).toBe("conversations");
    expect(chatState.activeMode).toBe("design");
    expect(chatState.history).toEqual([{ conversationId: "design" }]);
    expect(chatState.panel.historyOpen).toBe(true);
    expect(chatState.panel.historyView).toBe("active");
    expect(chatState.panel.copyNotice).toBe("");
    expect(chatState.archivedConversation).toBeNull();
    expect(workspaceState.drawer).toEqual({ open: false, row: null });
    expect(workspaceState.entityDrawerOpen).toBe(false);
    expect(workspaceState.layerDrawerOpen).toBe(false);
  });

  it("selects entity and tool transitions without DOM dependencies", () => {
    const { activeState, chatState, workspaceState } = makeState();
    activeState.layer = chatWorkspaceLayers[2];
    const tools = getChatWorkspaceLayerTools(activeState.layer.key);
    const tasks = activeState.layer.entities.find((entity: { key: string }) => entity.key === "tasks");

    selectChatWorkspaceEntity({ activeState, workspaceState, nextEntity: tasks, tools });
    expect(activeState.entity.key).toBe("tasks");
    expect(activeState.tool).toBe("tasks");
    expect(workspaceState.drawer).toEqual({ open: false, row: null });

    activeState.tool = "conversations";
    selectChatWorkspaceEntity({
      activeState,
      workspaceState,
      nextEntity: tasks,
      tools,
      syncTool: false,
    });
    expect(activeState.entity.key).toBe("tasks");
    expect(activeState.tool).toBe("conversations");

    activeState.layer = chatWorkspaceLayers[0];
    const discoveryTools = getChatWorkspaceLayerTools(activeState.layer.key);
    const conversations = selectChatWorkspaceTool({
      activeState,
      chatState,
      workspaceState,
      toolKey: "conversations",
      tools: discoveryTools,
    });
    expect(conversations?.type).toBe("conversations");
    expect(chatState.panel.historyOpen).toBe(true);

    activeState.layer = chatWorkspaceLayers[2];
    const stories = selectChatWorkspaceTool({
      activeState,
      chatState,
      workspaceState,
      toolKey: "stories",
      tools,
    });
    expect(stories?.type).toBe("entity");
    expect(stories?.entity?.key).toBe("stories");
  });

  it("owns selector, drawer, and new-chat transitions", () => {
    const { chatState, workspaceState } = makeState();

    expect(toggleChatWorkspaceEntitySelector({ workspaceState })).toBe(false);
    expect(workspaceState.drawer).toEqual(getClosedChatWorkspaceDrawerState());
    closeChatWorkspaceEntitySelector({ workspaceState });
    expect(workspaceState.entityDrawerOpen).toBe(false);

    expect(toggleChatWorkspaceLayerSelector({ workspaceState })).toBe(false);
    closeChatWorkspaceLayerSelector({ workspaceState });
    expect(workspaceState.layerDrawerOpen).toBe(false);

    workspaceState.drawer = { open: true, row: { key: "row" } };
    closeChatWorkspaceRowDrawer({ workspaceState });
    expect(workspaceState.drawer).toEqual({ open: false, row: null });

    startChatWorkspaceConversation({ chatState });
    expect(chatState.messages).toEqual([
      {
        author: "Harness",
        text: "New chat started. Tell me what you want to shape next.",
      },
    ]);
    expect(chatState.panel.packetState).toBe("none");
    expect(chatState.panel.copyNotice).toBe("");
  });
});
