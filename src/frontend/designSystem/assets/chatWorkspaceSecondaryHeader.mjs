const controlIcons = {
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function iconButtonGlyph(icon) {
  return `<span class="icon-button-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="${escapeHtml(controlIcons[icon])}" /></svg></span>`;
}

export function renderChatWorkspaceEntitySelectorTrigger({ entityLabel, expanded = false } = {}) {
  return `
    <button
      class="chat-workspace-entity-trigger-card"
      type="button"
      aria-haspopup="listbox"
      aria-expanded="${expanded ? "true" : "false"}"
      data-chat-workspace-entity-selector-trigger
    >
      <span class="floating-tab-project-kicker">${escapeHtml(entityLabel)}</span>
      <span class="chat-workspace-entity-trigger-icon" aria-hidden="true" data-chat-workspace-entity-trigger-icon>
        <svg viewBox="0 0 24 24" focusable="false"><path d="m7 9 5 5 5-5" /></svg>
      </span>
    </button>
  `;
}

export function renderChatWorkspaceChatSelector({ label, expanded = false } = {}) {
  return `
    <button
      class="chat-workspace-chat-title-trigger"
      type="button"
      aria-haspopup="dialog"
      aria-expanded="${expanded ? "true" : "false"}"
      data-chat-workspace-chat-selector-toggle
    >
      <span>
        <small>Chat</small>
        <strong>${escapeHtml(label)}</strong>
      </span>
      <span class="chat-workspace-layer-trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false"><path d="m7 9 5 5 5-5" /></svg>
      </span>
    </button>
  `;
}

export function renderChatWorkspaceNewConversationButton() {
  return `
    <button
      class="icon-button tooltip-anchor"
      type="button"
      aria-label="Start new chat"
      data-tooltip="Start new chat"
      data-chat-workspace-new-conversation
    >
      ${iconButtonGlyph("plus")}
    </button>
  `;
}

export function renderChatWorkspaceSecondaryHeader({
  historyOpen = false,
  workspaceExpanded = false,
  chatLabel,
  entityLabel,
  entitySelectorExpanded = false,
  recordCount = 0,
} = {}) {
  const showChatSection = !historyOpen;
  return `
    ${historyOpen ? `
      <section class="chat-workspace-secondary-section chat-workspace-secondary-index" data-chat-workspace-secondary-index>
        ${renderChatWorkspaceChatSelector({ label: chatLabel, expanded: historyOpen })}
      </section>
    ` : ""}
    ${workspaceExpanded ? `
      <section class="chat-workspace-secondary-section chat-workspace-secondary-list" data-chat-workspace-secondary-list>
        ${renderChatWorkspaceEntitySelectorTrigger({ entityLabel, expanded: entitySelectorExpanded })}
        <span class="floating-tab-panel-count">${escapeHtml(recordCount)} records</span>
      </section>
    ` : ""}
    ${showChatSection ? `
      <section class="chat-workspace-secondary-section chat-workspace-secondary-chat" data-chat-workspace-secondary-chat>
        ${renderChatWorkspaceChatSelector({ label: chatLabel, expanded: historyOpen })}
      </section>
    ` : ""}
    <section class="chat-workspace-secondary-section chat-workspace-secondary-new-chat" data-chat-workspace-secondary-new-chat>
      ${renderChatWorkspaceNewConversationButton()}
    </section>
  `;
}
