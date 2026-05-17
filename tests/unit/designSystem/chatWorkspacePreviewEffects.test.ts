import { describe, expect, it } from "vitest";

import { createChatWorkspacePreviewEffectHandlers } from "../../../src/frontend/designSystem/assets/chatWorkspacePreviewEffects.mjs";

function createHandlers() {
  const calls: string[] = [];
  const entityWorkspace = { name: "workspace" };
  const chatClose = {
    click() {
      calls.push("close-chat");
    },
  };
  const chatMount = {
    querySelector(selector: string) {
      return selector === "[data-build-work-panel-close]" ? chatClose : null;
    },
  };
  const shellController = {
    toggleWorkspace(options: { refresh: boolean }) {
      calls.push(`toggle-workspace:${String(options.refresh)}`);
    },
    toggleHistory(options: { refresh: boolean }) {
      calls.push(`toggle-history:${String(options.refresh)}`);
    },
  };
  const activeState = {
    layer: {
      entities: [
        { key: "questions", label: "Questions" },
        { key: "stories", label: "Stories" },
      ],
    },
  };
  const chatState = {
    panel: {
      panelOpen: false,
    },
  };
  const workspaceState = {
    expanded: true,
    entityDrawerOpen: false,
    layerDrawerOpen: true,
  };

  return {
    calls,
    chatState,
    workspaceState,
    handlers: createChatWorkspacePreviewEffectHandlers({
      activeState,
      chatMount,
      chatState,
      getEntityWorkspace() {
        return entityWorkspace;
      },
      getShellController() {
        return shellController;
      },
      isButtonElement(value: unknown) {
        return value === chatClose;
      },
      isWorkspaceElement(value: unknown) {
        return value === entityWorkspace || value === chatMount;
      },
      mountChatPanel() {
        calls.push("mount-chat");
      },
      selectWorkspaceEntity(workspace: unknown, entity: { key: string }) {
        calls.push(`select:${workspace === entityWorkspace ? entity.key : "missing"}`);
      },
      startNewConversation() {
        calls.push("new-conversation");
      },
      syncHeaderLayerSelector() {
        calls.push("sync-header");
      },
      syncLayerMode(layerKey: string) {
        calls.push(`sync-layer:${layerKey}`);
      },
      syncWorkspaceListRows(workspace: unknown) {
        calls.push(`sync-list:${workspace === entityWorkspace ? "workspace" : "missing"}`);
      },
      workspaceState,
    }),
  };
}

describe("chatWorkspacePreviewEffects", () => {
  it("creates render-effect handlers without embedding them in the pattern click loop", () => {
    const { calls, chatState, handlers, workspaceState } = createHandlers();

    handlers["sync-header"]({ type: "toggle-layer-selector" });
    expect(workspaceState.layerDrawerOpen).toBe(false);
    expect(calls).toEqual(["sync-header"]);

    handlers["sync-layer"]({ layerKey: "design" });
    handlers["open-panel"]({});
    handlers["mount-chat"]({});
    handlers["select-entity"]({ entityKey: "stories" });
    handlers["sync-list"]({});
    handlers["toggle-entity-selector"]({});
    handlers["toggle-workspace"]({});
    handlers["toggle-history"]({});
    handlers["new-conversation"]({});
    handlers["close-chat"]({});

    expect(chatState.panel.panelOpen).toBe(true);
    expect(workspaceState.entityDrawerOpen).toBe(true);
    expect(calls).toEqual([
      "sync-header",
      "sync-layer:design",
      "mount-chat",
      "select:stories",
      "sync-list:workspace",
      "toggle-workspace:true",
      "toggle-history:true",
      "new-conversation",
      "close-chat",
    ]);
  });
});
