import {
  getChatWorkspaceLayerDefaultEntity,
  getChatWorkspaceLayerDefaultTool,
  getChatWorkspaceLayerTools,
} from "./chatWorkspaceShellContract.mjs";

function closestTarget(target, selector) {
  return target?.closest?.(selector) ?? null;
}

function datasetValue(target, selector, key) {
  const match = closestTarget(target, selector);
  return match?.dataset?.[key] ?? "";
}

export function resolveChatWorkspaceClickActions(target, { workspaceState } = {}) {
  const actions = [];

  if (
    workspaceState?.layerDrawerOpen
    && !closestTarget(target, "[data-chat-workspace-layer-selector]")
  ) {
    actions.push({ type: "close-layer-selector" });
  }

  if (closestTarget(target, "[data-chat-workspace-layer-trigger]")) {
    actions.push({ type: "toggle-layer-selector" });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-layer-option]")) {
    actions.push({
      type: "select-layer",
      layerKey: datasetValue(target, "[data-chat-workspace-layer-option]", "chatWorkspaceLayerOption"),
    });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-entity-option]")) {
    actions.push({
      type: "select-entity",
      entityKey: datasetValue(target, "[data-chat-workspace-entity-option]", "chatWorkspaceEntityOption"),
    });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-entity-selector-trigger]")) {
    actions.push({ type: "toggle-entity-selector" });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-toggle]")) {
    actions.push({ type: "toggle-workspace" });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-history-toggle]")) {
    actions.push({ type: "toggle-history" });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-chat-selector-toggle]")) {
    actions.push({ type: "toggle-chat-selector" });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-new-conversation]")) {
    actions.push({ type: "new-conversation" });
    return actions;
  }

  if (closestTarget(target, "[data-chat-workspace-close]")) {
    actions.push({ type: "close-chat" });
    return actions;
  }

  return actions.length ? actions : [{ type: "none" }];
}

const actionEffects = Object.freeze({
  "close-layer-selector": Object.freeze(["sync-header"]),
  "toggle-layer-selector": Object.freeze(["sync-header", "stop"]),
  "select-layer": Object.freeze(["sync-layer", "open-panel", "mount-chat", "stop"]),
  "select-entity": Object.freeze(["select-entity", "close-entity-selector", "sync-list", "stop"]),
  "toggle-entity-selector": Object.freeze(["toggle-entity-selector", "sync-list", "stop"]),
  "toggle-workspace": Object.freeze(["toggle-workspace", "stop"]),
  "toggle-history": Object.freeze(["toggle-history", "mount-chat", "stop"]),
  "toggle-chat-selector": Object.freeze(["toggle-history", "mount-chat", "stop"]),
  "new-conversation": Object.freeze(["new-conversation", "stop"]),
  "close-chat": Object.freeze(["close-chat", "stop"]),
  none: Object.freeze([]),
});

export function getChatWorkspaceActionEffects(action) {
  return [...(actionEffects[action?.type] ?? actionEffects.none)];
}

export function runChatWorkspaceActionEffects(action, handlers = {}) {
  const executed = [];

  for (const effect of getChatWorkspaceActionEffects(action)) {
    executed.push(effect);
    if (effect === "stop") {
      return { effects: executed, stopped: true };
    }

    const handler = handlers[effect];
    if (typeof handler === "function") {
      handler(action, effect);
    }
  }

  return { effects: executed, stopped: false };
}

export function getClosedChatWorkspaceDrawerState() {
  return { open: false, row: null };
}

export function resetChatWorkspaceTransientState(workspaceState) {
  workspaceState.drawer = getClosedChatWorkspaceDrawerState();
  workspaceState.entityDrawerOpen = false;
}

export function selectChatWorkspaceLayer({
  layerKey,
  layers = [],
  activeState,
  chatState,
  workspaceState,
  getLayerHistory,
}) {
  const nextLayer = layers.find((layer) => layer.key === layerKey);
  if (!nextLayer) {
    return null;
  }

  chatState.activeMode = nextLayer.key;
  activeState.layer = nextLayer;
  activeState.entity = getChatWorkspaceLayerDefaultEntity(nextLayer);
  activeState.tool = getChatWorkspaceLayerDefaultTool(nextLayer);
  chatState.history = typeof getLayerHistory === "function" ? getLayerHistory(nextLayer.key) : [];
  chatState.panel.historyOpen = true;
  chatState.panel.historyView = "active";
  chatState.panel.copyNotice = "";
  chatState.panel.renameConversationId = null;
  chatState.panel.showArchiveUndo = false;
  chatState.archivedConversation = null;
  resetChatWorkspaceTransientState(workspaceState);
  workspaceState.layerDrawerOpen = false;
  return nextLayer;
}

export function selectChatWorkspaceEntity({
  activeState,
  workspaceState,
  nextEntity,
  tools = getChatWorkspaceLayerTools(activeState?.layer?.key),
  syncTool = true,
}) {
  if (!nextEntity) {
    return null;
  }

  activeState.entity = nextEntity;
  if (syncTool) {
    activeState.tool = tools.find((tool) => tool.entity === nextEntity.key)?.key ?? activeState.tool;
  }
  workspaceState.drawer = getClosedChatWorkspaceDrawerState();
  return nextEntity;
}

export function selectChatWorkspaceTool({
  activeState,
  chatState,
  workspaceState,
  toolKey,
  tools = getChatWorkspaceLayerTools(activeState?.layer?.key),
}) {
  const tool = tools.find((item) => item.key === toolKey);
  if (!tool) {
    return null;
  }

  activeState.tool = tool.key;
  resetChatWorkspaceTransientState(workspaceState);

  if (tool.key === "conversations") {
    chatState.panel.historyOpen = true;
    return { type: "conversations", tool };
  }

  const nextEntity = activeState.layer.entities.find((entity) => entity.key === tool.entity) ?? null;
  return { type: "entity", tool, entity: nextEntity };
}

export function toggleChatWorkspaceEntitySelector({ workspaceState }) {
  workspaceState.entityDrawerOpen = !workspaceState.entityDrawerOpen;
  workspaceState.drawer = getClosedChatWorkspaceDrawerState();
  return workspaceState.entityDrawerOpen;
}

export function closeChatWorkspaceEntitySelector({ workspaceState }) {
  workspaceState.entityDrawerOpen = false;
}

export function closeChatWorkspaceRowDrawer({ workspaceState }) {
  workspaceState.drawer = getClosedChatWorkspaceDrawerState();
}

export function closeChatWorkspaceLayerSelector({ workspaceState }) {
  workspaceState.layerDrawerOpen = false;
}

export function toggleChatWorkspaceLayerSelector({ workspaceState }) {
  workspaceState.layerDrawerOpen = !workspaceState.layerDrawerOpen;
  return workspaceState.layerDrawerOpen;
}

export function startChatWorkspaceConversation({ chatState }) {
  chatState.messages = [
    {
      author: "Harness",
      text: "New chat started. Tell me what you want to shape next.",
    },
  ];
  chatState.panel.packetState = "none";
  chatState.panel.copyNotice = "";
  chatState.panel.editMessageIndex = null;
  chatState.panel.replyToMessageIndex = null;
}
