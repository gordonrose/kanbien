function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderChatWorkspaceEntitySelector({
  entityWorkspace,
  mount,
  layer,
  activeEntity,
  open = false,
  getEntityCount,
} = {}) {
  if (!(entityWorkspace instanceof HTMLElement) || !(mount instanceof HTMLElement) || !layer) {
    return;
  }

  const legacyDrawer = entityWorkspace.querySelector("[data-chat-workspace-entity-drawer]");
  legacyDrawer?.remove();

  const trigger = mount.querySelector("[data-chat-workspace-entity-selector-trigger]");
  if (trigger instanceof HTMLElement) {
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  let selector = mount.querySelector("[data-chat-workspace-entity-selector-options]");
  if (!(selector instanceof HTMLElement)) {
    selector = document.createElement("div");
    selector.className = "chat-workspace-entity-selector-options";
    selector.dataset.chatWorkspaceEntitySelectorOptions = "";
    selector.setAttribute("role", "listbox");
    selector.setAttribute("aria-label", `${layer.label} entities`);
    mount.append(selector);
  }

  entityWorkspace.dataset.chatWorkspaceEntitySelectorOpen = open ? "true" : "false";
  selector.classList.toggle("is-open", open);
  selector.hidden = !open;
  if (!open) {
    selector.replaceChildren();
    return;
  }

  selector.innerHTML = `
    ${layer.entities.map((entity) => `
      <button
        class="chat-workspace-entity-option${entity.key === activeEntity?.key ? " is-active" : ""}"
        type="button"
        role="option"
        aria-selected="${entity.key === activeEntity?.key ? "true" : "false"}"
        data-chat-workspace-entity-option="${escapeHtml(entity.key)}"
      >
        <span>${escapeHtml(entity.label)}</span>
        <small>${escapeHtml(getEntityCount?.(entity) ?? 0)} entities</small>
      </button>
    `).join("")}
  `;
}

export function isChatWorkspaceEntitySelectorEvent(target) {
  return Boolean(
    target?.closest("[data-chat-workspace-entity-selector-options]")
      || target?.closest("[data-chat-workspace-entity-selector-trigger]"),
  );
}

export function shouldCloseChatWorkspaceEntitySelectorOnDocumentClick({ target, entityWorkspace }) {
  if (!target) {
    return true;
  }
  return !(
    entityWorkspace?.contains(target)
      || isChatWorkspaceEntitySelectorEvent(target)
  );
}
