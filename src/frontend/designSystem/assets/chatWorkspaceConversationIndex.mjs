export function dockChatWorkspaceConversationIndex({
  chatMount,
  historyDock,
  historyOpen,
} = {}) {
  if (!(chatMount instanceof HTMLElement) || !(historyDock instanceof HTMLElement)) {
    return;
  }

  const panelBody = chatMount.querySelector(".build-work-panel-demo-body");
  const chatColumn = chatMount.querySelector(".build-work-panel-demo-chat-column");
  const dockedHistory = historyDock.querySelector(".build-work-panel-demo-history");

  if (historyOpen === false) {
    if (panelBody instanceof HTMLElement && chatColumn instanceof HTMLElement && dockedHistory instanceof HTMLElement) {
      panelBody.insertBefore(dockedHistory, chatColumn);
    }
    return;
  }

  const history = dockedHistory ?? chatMount.querySelector(".build-work-panel-demo-history");
  if (history instanceof HTMLElement) {
    historyDock.append(history);
    hideIndexLocalNewConversation(history);
  }
}

export function hideIndexLocalNewConversation(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  root.querySelectorAll("[data-build-work-panel-new-conversation]").forEach((button) => {
    if (button instanceof HTMLElement) {
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
    }
  });
}

export function clearChatWorkspaceConversationIndex(historyDock) {
  if (historyDock instanceof HTMLElement) {
    historyDock.replaceChildren();
  }
}
