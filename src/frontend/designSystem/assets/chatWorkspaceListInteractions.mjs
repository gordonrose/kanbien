import {
  closeChatWorkspaceEntitySelector,
  closeChatWorkspaceRowDrawer,
  toggleChatWorkspaceEntitySelector,
} from "./chatWorkspaceController.mjs";
import {
  isChatWorkspaceEntitySelectorEvent,
  shouldCloseChatWorkspaceEntitySelectorOnDocumentClick,
} from "./chatWorkspaceEntitySelector.mjs";
import {
  getChatWorkspaceDrawerStateFromTarget,
  isChatWorkspaceDrawerCloseTarget,
} from "./chatWorkspaceRowDrawer.mjs";

function isElement(value) {
  const ElementType = globalThis.Element;
  return typeof ElementType === "function" ? value instanceof ElementType : Boolean(value?.closest);
}

function isHtmlElement(value) {
  const ElementType = globalThis.HTMLElement;
  return typeof ElementType === "function" ? value instanceof ElementType : Boolean(value?.querySelector);
}

export function createChatWorkspaceListInteractionController({
  activeState,
  getEntityWorkspace,
  isEventTargetElement = isElement,
  isWorkspaceElement = isHtmlElement,
  mutationObserverFactory = (callback) => new MutationObserver(callback),
  requestAnimationFrame = (callback) => globalThis.requestAnimationFrame(callback),
  syncWorkspaceListRows,
  workspaceState,
}) {
  let workspaceDrawerObserver = null;

  function sync(entityWorkspace) {
    syncWorkspaceListRows(entityWorkspace);
  }

  function closeEntitySelector(entityWorkspace) {
    closeChatWorkspaceEntitySelector({ workspaceState });
    sync(entityWorkspace);
  }

  function handleWorkspaceClick(entityWorkspace, event) {
    const target = isEventTargetElement(event.target) ? event.target : null;

    if (
      workspaceState.entityDrawerOpen
      && !isChatWorkspaceEntitySelectorEvent(target)
    ) {
      closeEntitySelector(entityWorkspace);
    }

    if (isChatWorkspaceDrawerCloseTarget(target)) {
      closeChatWorkspaceRowDrawer({ workspaceState });
      sync(entityWorkspace);
      return;
    }

    const nextDrawerState = getChatWorkspaceDrawerStateFromTarget(target, {
      layer: activeState.layer,
      entity: activeState.entity,
    });
    if (nextDrawerState) {
      workspaceState.drawer = nextDrawerState;
      sync(entityWorkspace);
    }
  }

  function handleWorkspaceKeydown(entityWorkspace, event) {
    if (event.key === "Escape" && workspaceState.entityDrawerOpen) {
      event.preventDefault();
      closeEntitySelector(entityWorkspace);
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const target = isEventTargetElement(event.target) ? event.target : null;
    if (target?.closest("[data-chat-workspace-entity-selector-trigger]")) {
      event.preventDefault();
      toggleChatWorkspaceEntitySelector({ workspaceState });
      sync(entityWorkspace);
      return;
    }

    const nextDrawerState = getChatWorkspaceDrawerStateFromTarget(target, {
      layer: activeState.layer,
      entity: activeState.entity,
    });
    if (nextDrawerState) {
      event.preventDefault();
      workspaceState.drawer = nextDrawerState;
      sync(entityWorkspace);
    }
  }

  function installWorkspaceListDrawer(entityWorkspace) {
    if (!isWorkspaceElement(entityWorkspace)) {
      return;
    }

    if (entityWorkspace.dataset.chatWorkspaceDrawerInstalled !== "true") {
      entityWorkspace.dataset.chatWorkspaceDrawerInstalled = "true";
      entityWorkspace.addEventListener("click", (event) => {
        handleWorkspaceClick(entityWorkspace, event);
      });
      entityWorkspace.addEventListener("keydown", (event) => {
        handleWorkspaceKeydown(entityWorkspace, event);
      });
    }

    workspaceDrawerObserver?.disconnect();
    const list = entityWorkspace.querySelector(".floating-tab-list");
    if (isWorkspaceElement(list)) {
      workspaceDrawerObserver = mutationObserverFactory(() => {
        requestAnimationFrame(() => sync(entityWorkspace));
      });
      workspaceDrawerObserver.observe(list, { childList: true });
    }

    sync(entityWorkspace);
  }

  function handleDocumentClick(event) {
    const entityWorkspace = getEntityWorkspace();
    if (!isWorkspaceElement(entityWorkspace) || !workspaceState.entityDrawerOpen) {
      return;
    }

    const target = isEventTargetElement(event.target) ? event.target : null;
    if (
      !shouldCloseChatWorkspaceEntitySelectorOnDocumentClick({
        target,
        entityWorkspace,
      })
    ) {
      return;
    }

    closeEntitySelector(entityWorkspace);
  }

  function handleDocumentKeydown(event) {
    if (event.key !== "Escape" || !workspaceState.entityDrawerOpen) {
      return;
    }

    const entityWorkspace = getEntityWorkspace();
    if (!isWorkspaceElement(entityWorkspace)) {
      return;
    }

    closeEntitySelector(entityWorkspace);
  }

  function destroy() {
    workspaceDrawerObserver?.disconnect();
    workspaceDrawerObserver = null;
  }

  return {
    destroy,
    handleDocumentClick,
    handleDocumentKeydown,
    handleWorkspaceClick,
    handleWorkspaceKeydown,
    installWorkspaceListDrawer,
  };
}
