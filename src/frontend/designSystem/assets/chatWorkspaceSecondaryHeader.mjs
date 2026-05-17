const controlIcons = {
  export: "M12 4v9m0-9 3.5 3.5M12 4 8.5 7.5M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
  sort: "M7 4h10v2H7zm0 7h7v2H7zm0 7h4v2H7z",
  upload: "M12 20v-9m0 0-3.5 3.5M12 11l3.5 3.5M5 10V5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5V10",
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

export function renderChatWorkspaceEntitySelectorTrigger({ entityLabel, expanded = false, label = "" } = {}) {
  const labelMarkup = label
    ? `
      <span>
        <small>${escapeHtml(label)}</small>
        <strong>${escapeHtml(entityLabel)}</strong>
      </span>
    `
    : `<span class="floating-tab-project-kicker">${escapeHtml(entityLabel)}</span>`;

  return `
    <button
      class="chat-workspace-entity-trigger-card"
      type="button"
      aria-haspopup="listbox"
      aria-expanded="${expanded ? "true" : "false"}"
      data-chat-workspace-entity-selector-trigger
    >
      ${labelMarkup}
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

export function renderChatWorkspaceNewConversationButton({ label = "Start new chat" } = {}) {
  return `
    <button
      class="icon-button tooltip-anchor"
      type="button"
      aria-label="${escapeHtml(label)}"
      data-tooltip="${escapeHtml(label)}"
      data-chat-workspace-new-conversation
    >
      ${iconButtonGlyph("plus")}
    </button>
  `;
}

export function renderChatWorkspaceHeaderToolButton({ icon, label } = {}) {
  return `
    <button
      class="icon-button tooltip-anchor"
      type="button"
      aria-label="${escapeHtml(label)}"
      data-tooltip="${escapeHtml(label)}"
      data-chat-workspace-header-tool="${escapeHtml(label)}"
    >
      ${iconButtonGlyph(icon)}
    </button>
  `;
}

export function renderChatWorkspaceSecondaryHeader({
  headerTools = [],
  historyOpen = false,
  workspaceExpanded = false,
  chatLabel,
  entityLabel,
  entitySelectorLabel = "",
  entitySelectorExpanded = false,
  listPrefix = "",
  newConversationLabel = "Start new chat",
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
        ${listPrefix}
        ${renderChatWorkspaceEntitySelectorTrigger({ entityLabel, expanded: entitySelectorExpanded, label: entitySelectorLabel })}
        <span class="floating-tab-panel-count">${escapeHtml(recordCount)} records</span>
      </section>
    ` : ""}
    ${showChatSection ? `
      <section class="chat-workspace-secondary-section chat-workspace-secondary-chat" data-chat-workspace-secondary-chat>
        ${renderChatWorkspaceChatSelector({ label: chatLabel, expanded: historyOpen })}
      </section>
    ` : ""}
    <section class="chat-workspace-secondary-section chat-workspace-secondary-new-chat" data-chat-workspace-secondary-new-chat>
      ${headerTools.map((tool) => renderChatWorkspaceHeaderToolButton(tool)).join("")}
      ${renderChatWorkspaceNewConversationButton({ label: newConversationLabel })}
    </section>
  `;
}
