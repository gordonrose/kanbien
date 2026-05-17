import { closeChatWorkspaceLayerSelector } from "./chatWorkspaceController.mjs";
import { createChatWorkspaceListInteractionController } from "./chatWorkspaceListInteractions.mjs";
import { createChatWorkspacePreviewEffectHandlers } from "./chatWorkspacePreviewEffects.mjs";
import { createChatWorkspaceShellController } from "./chatWorkspaceShell.mjs";

function isElement(value) {
  const ElementType = globalThis.Element;
  return typeof ElementType === "function" ? value instanceof ElementType : Boolean(value?.closest);
}

function isHtmlElement(value) {
  const ElementType = globalThis.HTMLElement;
  return typeof ElementType === "function" ? value instanceof ElementType : Boolean(value?.addEventListener);
}

export function createChatWorkspaceBootstrap({
  activeState,
  applyRequestDisplayState,
  chatMount,
  chatState,
  documentRef = globalThis.document,
  getEntityWorkspace,
  historyDock,
  iconButtonMarkup,
  isEventTargetElement = isElement,
  isShellElement = isHtmlElement,
  mountChatPanel,
  renderEntityWorkspace,
  runActionEffects,
  selectWorkspaceEntity,
  shell,
  startNewConversation,
  syncHeaderLayerSelector,
  syncHistoryDock,
  syncLayerMode,
  syncLayerToolbar,
  syncWorkspaceListRows,
  workspaceMain,
  workspaceState,
}) {
  let shellController = null;
  let listInteractionController = null;

  function getShellController() {
    return shellController;
  }

  function syncWorkspaceToggle({ refresh = false } = {}) {
    shellController?.sync({ refresh });
  }

  function installWorkspaceToggle() {
    shellController?.installExpansionToggle({
      chatMount,
      iconButtonMarkup,
    });
  }

  function initializeShellController(callbacks = {}) {
    if (!isShellElement(shell)) {
      return null;
    }

    applyRequestDisplayState?.(shell);
    shellController = createChatWorkspaceShellController({
      shell,
      workspaceMain,
      state: workspaceState,
      getHistoryOpen() {
        return chatState.panel.historyOpen;
      },
      setHistoryOpen(open) {
        chatState.panel.historyOpen = open;
      },
      onRefreshWorkspace: callbacks.onRefreshWorkspace,
      onSyncHistoryIcon: callbacks.onSyncHistoryIcon,
      onSyncHistoryDock: callbacks.onSyncHistoryDock,
      onSyncHeader: callbacks.onSyncHeader,
      onSyncSecondaryHeader: callbacks.onSyncSecondaryHeader,
    });
    return shellController;
  }

  function initializeListInteractions() {
    listInteractionController = createChatWorkspaceListInteractionController({
      activeState,
      getEntityWorkspace,
      syncWorkspaceListRows,
      workspaceState,
    });

    documentRef?.addEventListener?.("click", listInteractionController.handleDocumentClick);
    documentRef?.addEventListener?.("keydown", listInteractionController.handleDocumentKeydown);
    return listInteractionController;
  }

  function createEffectHandlers() {
    return createChatWorkspacePreviewEffectHandlers({
      activeState,
      chatMount,
      chatState,
      getEntityWorkspace,
      getShellController,
      mountChatPanel,
      selectWorkspaceEntity,
      startNewConversation,
      syncHeaderLayerSelector,
      syncLayerMode,
      syncWorkspaceListRows,
      workspaceState,
    });
  }

  function installShellListeners(workspaceEffectHandlers) {
    if (!isShellElement(shell)) {
      return;
    }

    shell.addEventListener("click", (event) => {
      const target = isEventTargetElement(event.target) ? event.target : null;
      const stopped = runActionEffects(target, workspaceEffectHandlers);
      if (stopped) {
        return;
      }
    });

    shell.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !workspaceState.layerDrawerOpen) {
        return;
      }
      closeChatWorkspaceLayerSelector({ workspaceState });
      syncHeaderLayerSelector();
    });
  }

  function initialize(callbacks = {}) {
    initializeShellController(callbacks);
    const workspaceEffectHandlers = createEffectHandlers();
    const listInteractions = initializeListInteractions();
    installShellListeners(workspaceEffectHandlers);

    if (!workspaceState.expanded) {
      chatState.panel.historyOpen = false;
    }

    if (isShellElement(chatMount)) {
      mountChatPanel();
    }
    renderEntityWorkspace();
    syncWorkspaceToggle();

    return {
      historyDock,
      installWorkspaceToggle,
      listInteractions,
      shellController,
      syncHistoryDock,
      syncLayerToolbar,
      syncWorkspaceToggle,
      workspaceEffectHandlers,
    };
  }

  return {
    createEffectHandlers,
    getShellController,
    initialize,
    getListInteractionController() {
      return listInteractionController;
    },
    initializeListInteractions,
    initializeShellController,
    installShellListeners,
    installWorkspaceToggle,
    syncWorkspaceToggle,
  };
}
