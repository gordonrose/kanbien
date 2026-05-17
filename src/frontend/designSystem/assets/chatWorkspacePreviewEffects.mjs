import {
  closeChatWorkspaceEntitySelector,
  closeChatWorkspaceLayerSelector,
  toggleChatWorkspaceEntitySelector,
  toggleChatWorkspaceLayerSelector,
} from "./chatWorkspaceController.mjs";

function isHtmlElement(value) {
  const ElementType = globalThis.HTMLElement;
  return typeof ElementType === "function" ? value instanceof ElementType : Boolean(value?.querySelector);
}

function isHtmlButton(value) {
  const ButtonType = globalThis.HTMLButtonElement;
  return typeof ButtonType === "function" ? value instanceof ButtonType : typeof value?.click === "function";
}

export function createChatWorkspacePreviewEffectHandlers({
  activeState,
  chatMount,
  chatState,
  getEntityWorkspace,
  getShellController,
  isButtonElement = isHtmlButton,
  isWorkspaceElement = isHtmlElement,
  mountChatPanel,
  selectWorkspaceEntity,
  startNewConversation,
  syncHeaderLayerSelector,
  syncLayerMode,
  syncWorkspaceListRows,
  workspaceState,
}) {
  return {
    "sync-header": (action) => {
      if (action.type === "close-layer-selector") {
        closeChatWorkspaceLayerSelector({ workspaceState });
      }
      if (action.type === "toggle-layer-selector") {
        toggleChatWorkspaceLayerSelector({ workspaceState });
      }
      syncHeaderLayerSelector();
    },
    "sync-layer": (action) => {
      syncLayerMode(action.layerKey ?? "");
    },
    "open-panel": () => {
      chatState.panel.panelOpen = true;
    },
    "mount-chat": () => {
      mountChatPanel();
    },
    "select-entity": (action) => {
      const entityWorkspace = getEntityWorkspace();
      if (!isWorkspaceElement(entityWorkspace)) {
        return;
      }
      const nextEntity = activeState.layer.entities.find((entity) => entity.key === action.entityKey);
      if (nextEntity) {
        selectWorkspaceEntity(entityWorkspace, nextEntity);
      }
    },
    "close-entity-selector": () => {
      closeChatWorkspaceEntitySelector({ workspaceState });
    },
    "sync-list": () => {
      const entityWorkspace = getEntityWorkspace();
      if (!isWorkspaceElement(entityWorkspace)) {
        return;
      }
      syncWorkspaceListRows(entityWorkspace);
    },
    "toggle-entity-selector": () => {
      toggleChatWorkspaceEntitySelector({ workspaceState });
    },
    "toggle-workspace": () => {
      getShellController()?.toggleWorkspace({ refresh: true });
    },
    "toggle-history": () => {
      getShellController()?.toggleHistory({ refresh: workspaceState.expanded });
    },
    "new-conversation": () => {
      startNewConversation();
    },
    "close-chat": () => {
      const sourceCloseButton = isWorkspaceElement(chatMount)
        ? chatMount.querySelector("[data-build-work-panel-close]")
        : null;
      if (isButtonElement(sourceCloseButton)) {
        sourceCloseButton.click();
      }
    },
  };
}
