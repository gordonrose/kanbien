function isHtmlElement(value) {
  const HTMLElementType = globalThis.HTMLElement;
  return typeof HTMLElementType === "function" ? value instanceof HTMLElementType : Boolean(value?.setAttribute || value?.dataset);
}

function getDocument() {
  return globalThis.document;
}

export function createChatWorkspaceShellController({
  shell,
  workspaceMain,
  state,
  getHistoryOpen,
  setHistoryOpen,
  onRefreshWorkspace,
  onSyncHistoryIcon,
  onSyncHistoryDock,
  onSyncHeader,
  onSyncSecondaryHeader,
} = {}) {
  function sync({ refresh = false } = {}) {
    const expanded = Boolean(state?.expanded);
    const expansionEnabled = Boolean(state?.expansionEnabled);
    const historyOpen = getHistoryOpen?.() !== false;

    if (isHtmlElement(shell)) {
      shell.dataset.chatWorkspaceExpansionEnabled = expansionEnabled ? "true" : "false";
      shell.dataset.chatWorkspaceExpanded = expanded ? "true" : "false";
      shell.dataset.chatWorkspaceHistoryOpen = historyOpen ? "true" : "false";
    }

    if (isHtmlElement(workspaceMain)) {
      workspaceMain.setAttribute("aria-hidden", expanded ? "false" : "true");
      workspaceMain.inert = !expanded;
    }

    getDocument()?.querySelectorAll?.("[data-chat-workspace-toggle]").forEach((toggle) => {
      if (!isHtmlElement(toggle)) {
        return;
      }
      const labelText = expanded ? "Collapse workspace" : "Expand workspace";
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggle.setAttribute("aria-label", labelText);
      toggle.dataset.tooltip = labelText;
      const label = toggle.querySelector("[data-chat-workspace-toggle-label]");
      if (isHtmlElement(label)) {
        label.textContent = labelText;
      }
    });

    getDocument()?.querySelectorAll?.("[data-chat-workspace-history-toggle]").forEach((toggle) => {
      if (!isHtmlElement(toggle)) {
        return;
      }
      const labelText = historyOpen ? "Hide history" : "Show history";
      toggle.setAttribute("aria-expanded", historyOpen ? "true" : "false");
      toggle.setAttribute("aria-label", labelText);
      toggle.dataset.tooltip = labelText;
      const label = toggle.querySelector("[data-chat-workspace-history-toggle-label]");
      if (isHtmlElement(label)) {
        label.textContent = labelText;
      }
    });

    if (refresh && expanded) {
      onRefreshWorkspace?.();
    }

    onSyncHistoryIcon?.();
    onSyncHistoryDock?.();
    onSyncHeader?.();
    onSyncSecondaryHeader?.();
  }

  function toggleWorkspace({ refresh = true } = {}) {
    if (!state?.expansionEnabled) {
      return false;
    }
    state.expanded = !state.expanded;
    setHistoryOpen?.(state.expanded);
    sync({ refresh });
    return true;
  }

  function toggleHistory({ refresh = false } = {}) {
    setHistoryOpen?.(getHistoryOpen?.() === false);
    sync({ refresh });
  }

  function installExpansionToggle({ chatMount, iconButtonMarkup }) {
    if (!isHtmlElement(chatMount)) {
      return;
    }

    if (!state?.expansionEnabled) {
      chatMount.querySelectorAll("[data-chat-workspace-toggle]").forEach((toggle) => toggle.remove());
      sync();
      return;
    }

    const headerActions = chatMount.querySelector(".build-work-panel-demo-header-actions");
    if (!isHtmlElement(headerActions) || headerActions.querySelector("[data-chat-workspace-toggle]")) {
      sync();
      return;
    }

    const toggle = getDocument()?.createElement?.("button");
    if (!toggle) {
      sync();
      return;
    }
    toggle.className = "icon-button tooltip-anchor";
    toggle.type = "button";
    toggle.dataset.chatWorkspaceToggle = "";
    toggle.dataset.tooltip = "Expand workspace";
    toggle.setAttribute("aria-controls", "chat-workspace-main");
    toggle.setAttribute("aria-label", "Expand workspace");
    toggle.innerHTML = iconButtonMarkup;
    headerActions.prepend(toggle);
    sync();
  }

  return {
    installExpansionToggle,
    sync,
    toggleHistory,
    toggleWorkspace,
  };
}
