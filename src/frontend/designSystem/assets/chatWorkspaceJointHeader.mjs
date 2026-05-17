const controlIcons = {
  project: "M5 5h14v14H5zM5 9h14M9 5v14",
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

export function renderChatWorkspaceLayerSelector({
  layers = [],
  activeLayerKey,
  activeLayerLabel,
  expanded = false,
} = {}) {
  return `
    <div class="chat-workspace-layer-selector" data-chat-workspace-layer-selector>
      <button
        class="chat-workspace-layer-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="${expanded ? "true" : "false"}"
        data-chat-workspace-layer-trigger
      >
        <span>
          <small>Layer</small>
          <strong>${escapeHtml(activeLayerLabel)}</strong>
        </span>
        <span class="chat-workspace-layer-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m7 9 5 5 5-5" /></svg>
        </span>
      </button>
      <div class="chat-workspace-layer-options${expanded ? " is-open" : ""}" role="listbox" aria-label="Workspace layer" data-chat-workspace-layer-options>
        ${layers.map((layer) => `
          <button
            class="chat-workspace-layer-option${layer.key === activeLayerKey ? " is-active" : ""}"
            type="button"
            role="option"
            aria-selected="${layer.key === activeLayerKey ? "true" : "false"}"
            data-chat-workspace-layer-option="${escapeHtml(layer.key)}"
          >
            <span>${escapeHtml(layer.label)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

export function renderChatWorkspaceJointHeader({
  workspaceExpanded = false,
  expansionEnabled = false,
  layerDrawerOpen = false,
  activeLayer,
  layers = [],
} = {}) {
  const toggleLabel = workspaceExpanded ? "Collapse workspace" : "Expand workspace";
  return `
    <div class="chat-workspace-header-title">
      ${workspaceExpanded ? renderChatWorkspaceLayerSelector({
        layers,
        activeLayerKey: activeLayer?.key,
        activeLayerLabel: activeLayer?.label,
        expanded: layerDrawerOpen,
      }) : `
        <div>
          <p class="top-nav-preview-eyebrow">Layer 1</p>
          <h2>Build work panel</h2>
        </div>
      `}
    </div>
    <div class="build-work-panel-demo-header-actions">
      ${expansionEnabled ? `
        <button class="icon-button tooltip-anchor" type="button" data-chat-workspace-toggle aria-controls="chat-workspace-main" aria-expanded="${workspaceExpanded ? "true" : "false"}" aria-label="${escapeHtml(toggleLabel)}" data-tooltip="${escapeHtml(toggleLabel)}">
          ${iconButtonGlyph("project")}
        </button>
      ` : ""}
      <button class="build-work-panel-demo-close" type="button" data-chat-workspace-close aria-label="Close chat panel">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z" /></svg>
      </button>
    </div>
  `;
}
