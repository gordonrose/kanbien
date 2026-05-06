function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

const iconPaths = {
  reporting: "M5 19h14v2H5zm2-2h2V9H7zm4 0h2V5h-2zm4 0h2v-7h-2z",
  support: "M12 4a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3h1v-6H7a5 5 0 0 1 10 0h-2v6h1a3 3 0 0 0 3-3v-3a7 7 0 0 0-7-7zm-1 15h2v2h-2z",
  build: "M12 3 4 7v10l8 4 8-4V7zm0 2.2 4.8 2.4L12 10 7.2 7.6zm-6 4 5 2.5v6.6l-5-2.5zm7 9.1v-6.6l5-2.5v6.6z",
  close: "M7.4 5.9 12 10.6l4.6-4.7 1.5 1.5-4.7 4.6 4.7 4.6-1.5 1.5-4.6-4.7-4.6 4.7-1.5-1.5 4.7-4.6-4.7-4.6z",
  copy: "M8 7h9a2 2 0 0 1 2 2v10H8zm2 2v8h7V9zM5 4h10v2H7v9H5z",
  edit: "M5 17.5V20h2.5L18.1 9.4l-2.5-2.5zm14.8-9.9-2.4-2.4 1.1-1.1a1.7 1.7 0 0 1 2.4 2.4z",
  reply: "M10 7V4L4 10l6 6v-3h4.5A4.5 4.5 0 0 1 19 17.5V20h2v-2.5A6.5 6.5 0 0 0 14.5 11H10z",
  retry: "M4 4v6h6M20 20v-6h-6M20 9a7 7 0 0 0-12.1-3.9L4 10M4 15a7 7 0 0 0 12.1 3.9L20 14",
  download: "M11 4h2v8l3-3 1.4 1.4-5.4 5.4-5.4-5.4L8 9l3 3zm-5 14h12v2H6z",
  attach: "M8.5 18.5a5 5 0 0 1 0-7.07l6.36-6.36a3.5 3.5 0 1 1 4.95 4.95l-7.07 7.07a2 2 0 0 1-2.83-2.83l6.36-6.36 1.41 1.41-6.36 6.36a.5.5 0 0 0 .71.71l7.07-7.07a1.5 1.5 0 0 0-2.12-2.12l-6.36 6.36a3 3 0 0 0 4.24 4.24l5.66-5.66 1.41 1.41-5.66 5.66a5 5 0 0 1-7.07 0z",
  screen: "M4 5h16v11H4zm2 2v7h12V7zm4 11h4v2h-4z",
  logs: "M6 4h12v16H6zm2 4h8V6H8zm0 3h8v2H8zm0 4h6v2H8z",
};

function svg(path) {
  return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${escapeHtml(path)}" /></svg>`;
}

export const conversationPanelCanonicalRefs = [
  {
    ref: "BWP-R-001",
    title: "Desktop closed launcher",
    note: "Right-side page action toolbar is visible and Build can open the panel.",
    panelOpen: false,
    historyOpen: true,
    packetState: "ready",
  },
  {
    ref: "BWP-R-002",
    title: "Desktop panel open, Build selected",
    note: "Primary signed-off desktop panel state with history, chat, composer, and packet ready.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
  },
  {
    ref: "BWP-R-003",
    title: "Active chat with history collapsed",
    note: "The active thread remains usable when the conversation-history lane is hidden.",
    panelOpen: true,
    historyOpen: false,
    packetState: "ready",
  },
  {
    ref: "BWP-R-004",
    title: "Active chat with visible history",
    note: "Mixed user and harness messages remain scannable beside slim conversation history.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
  },
  {
    ref: "BWP-R-005",
    title: "Packet available with download action",
    note: "The PDF export is an authorized attachment action, not public or inline preview.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
  },
  {
    ref: "BWP-R-006",
    title: "Generation failed",
    note: "A failed packet generation is visible and retryable without losing conversation history.",
    panelOpen: true,
    historyOpen: true,
    packetState: "failed",
  },
  {
    ref: "BWP-R-007",
    title: "Denied or restricted",
    note: "Restricted access is explicit and does not leak packet data or hidden history.",
    panelOpen: true,
    historyOpen: true,
    packetState: "denied",
  },
  {
    ref: "BWP-R-008",
    title: "Mobile floating action closed",
    note: "The collapsed mobile entry remains reachable without covering primary page work.",
    panelOpen: false,
    historyOpen: true,
    packetState: "ready",
    mobile: true,
  },
  {
    ref: "BWP-R-009",
    title: "Mobile panel open, Build selected",
    note: "Mobile panel framing keeps chat, history, composer, toolbar, and close controls usable.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    mobile: true,
  },
  {
    ref: "BWP-R-010",
    title: "RTL desktop panel open",
    note: "The work panel mirrors attachment, history, chat, and action order.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    direction: "rtl",
  },
  {
    ref: "BWP-R-011",
    title: "Dark theme with magnification",
    note: "Dark theme and larger text keep message, packet, and history surfaces readable.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    theme: "dark",
    scale: "1.35",
  },
  {
    ref: "BWP-R-012",
    title: "Reporting and Support inactive actions",
    note: "Inactive page-specific actions are visible without acting like broken chat tabs.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
  },
  {
    ref: "BWP-R-013",
    title: "Long typed input",
    note: "Composer text grows naturally without stretching the send button and scrolls only after max height.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    inputValue:
      "I need the Build panel to capture a fairly detailed change request with several sentences, enough line wrapping to prove the textarea expands naturally, and enough content to show that the send button stays fixed while the input owns the extra height.",
  },
  {
    ref: "BWP-R-014",
    title: "Tools menu open",
    note: "Attachment, screen capture, and log capture tools expand from the composer without squeezing the input row.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    toolsOpen: true,
  },
  {
    ref: "BWP-R-015",
    title: "Download completed journey",
    note: "The initial packet block disappears after download and the completed event remains in conversation history with repeat download.",
    panelOpen: true,
    historyOpen: true,
    packetState: "completed",
  },
  {
    ref: "BWP-R-016",
    title: "History summary tooltip",
    note: "Slim conversation history rows expose a bounded summary without making the list bulky.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    forceHistoryTooltip: true,
  },
  {
    ref: "BWP-R-017",
    title: "Message edit state",
    note: "A builder message can enter edit mode without collapsing message actions or transcript spacing.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    editMessageIndex: 1,
  },
  {
    ref: "BWP-R-018",
    title: "Harness reply prefill",
    note: "Replying to a harness message pre-fills the composer while preserving the compact action row.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    replyToMessageIndex: 2,
  },
  {
    ref: "BWP-R-019",
    title: "Mobile long-content stress",
    note: "Mobile panel keeps long messages, packet status, and composer reachable without clipping.",
    panelOpen: true,
    historyOpen: true,
    packetState: "ready",
    mobile: true,
    longMessages: true,
    inputValue: "Mobile follow-up with enough text to wrap cleanly.",
  },
  {
    ref: "BWP-R-020",
    title: "Dark mobile preparing download",
    note: "Dark mobile mode keeps the preparing state readable while preserving composer and panel structure.",
    panelOpen: true,
    historyOpen: true,
    packetState: "preparing",
    mobile: true,
    theme: "dark",
  },
];

export function getBuildWorkPanelCanonicalRef(refId = "BWP-R-002") {
  return getConversationPanelCanonicalRef(refId);
}

export const buildWorkPanelCanonicalRefs = conversationPanelCanonicalRefs;

export function getConversationPanelCanonicalRef(refId = "BWP-R-002") {
  return conversationPanelCanonicalRefs.find((entry) => entry.ref === refId) ?? conversationPanelCanonicalRefs[1];
}

const defaultHistory = [
  {
    title: "Build panel MVP",
    summary: "Product Discovery packet ready. Current thread covers root-admin Build panel discovery, packet history, and download journey review.",
  },
  {
    title: "PDF export journey",
    summary: "Download behavior under review, including prepared state, completed chat event, repeat download, and approved packet version trace.",
  },
  {
    title: "Design-system blockers",
    summary: "Open questions remain around governed panel layout, action nav placement, history lane behavior, and app adoption readiness.",
  },
];

const defaultMessages = [
  {
    author: "Harness",
    text: "I can help shape a Product Discovery packet before anything moves further through the build loop.",
  },
  {
    author: "Builder",
    text: "I want the root admin to start discovery from here and keep the packet history visible.",
    user: true,
  },
  {
    author: "Harness",
    text: "Got it. I will keep the page, module, role context, open blockers, and packet chain visible while we work through the first pass.",
  },
];

const longStressMessages = [
  {
    author: "Harness",
    text: "I can help shape a Product Discovery packet before anything moves further through the build loop. I will keep blockers visible and ask for decisions before the work advances.",
  },
  {
    author: "Builder",
    text: "I want this mobile panel to handle a longer request where someone explains the current page, the blocker, the desired packet outcome, and what they expect to download afterwards.",
    user: true,
  },
  {
    author: "Harness",
    text: "Got it. I will keep the chain visible, preserve approved packet data, and make sure the export journey remains clear even when the conversation gets long.",
  },
];

export function createBuildConversationPanelConfig(overrides = {}) {
  return {
    panel: {
      eyebrow: "Layer 1",
      title: "Build work panel",
      ariaLabel: "Build work panel",
      closeLabel: "Close Build work panel",
      historyLabel: "Conversation history",
      threadLabel: "Discovery chat history",
      composerLabel: "Message the harness",
      composerPlaceholder: "Ask the harness or describe a change",
      ...overrides.panel,
    },
    modes: overrides.modes ?? [
      { key: "reporting", label: "Reporting", icon: "reporting", disabled: true },
      { key: "support", label: "Support", icon: "support", disabled: true },
      { key: "build", label: "Build", icon: "build", active: true },
    ],
    packet: {
      title: "Product Discovery packet",
      readyStatus: "Ready to download",
      preparingStatus: "Preparing download",
      failedStatus: "Download preparation failed",
      deniedStatus: "Restricted",
      approvedCopy: "Approved packet data only. Version 1 of 1.",
      failedCopy: "The approved packet is still preserved in history.",
      deniedCopy: "You do not have access to download this packet from the current context.",
      downloadLabel: "Download PDF",
      preparingLabel: "Preparing...",
      retryLabel: "Retry packet download",
      repeatDownloadLabel: "Download packet again",
      ...overrides.packet,
    },
    tools: overrides.tools ?? [
      { key: "attach-file", label: "Attach file", icon: "attach" },
      { key: "capture-screen", label: "Capture screen", icon: "screen" },
      { key: "capture-logs", label: "Capture logs", icon: "logs" },
    ],
    ...overrides,
  };
}

export const buildConversationPanelConfig = createBuildConversationPanelConfig();

function getConversationPanelConfig(config) {
  return createBuildConversationPanelConfig(config);
}

function renderMessageActions(message) {
  const secondary = message.user
    ? `<button class="build-work-panel-demo-message-action" type="button" data-build-work-panel-edit-message aria-label="Edit message" title="Edit message">${svg(iconPaths.edit)}</button>`
    : `<button class="build-work-panel-demo-message-action" type="button" data-build-work-panel-reply-message aria-label="Reply to message" title="Reply">${svg(iconPaths.reply)}</button>`;
  return `
    <div class="build-work-panel-demo-message-actions" aria-label="Message actions">
      <button class="build-work-panel-demo-message-action" type="button" data-build-work-panel-copy-message aria-label="Copy message" title="Copy message">${svg(iconPaths.copy)}</button>
      ${secondary}
    </div>
  `;
}

function renderPacket(packetState, config) {
  const packet = config.packet;
  if (packetState === "completed") {
    return "";
  }

  if (packetState === "preparing") {
    return `
      <section class="build-work-panel-demo-packet" data-build-work-panel-packet aria-label="Product Discovery packet status">
        <div class="build-work-panel-demo-packet-row">
          <div>
            <strong>${escapeHtml(packet.title)}</strong>
            <p class="build-work-panel-demo-review-note"><span class="build-work-panel-demo-status-dot" aria-hidden="true"></span><span data-build-work-panel-download-status>${escapeHtml(packet.preparingStatus)}</span></p>
            <p class="build-work-panel-demo-review-note">${escapeHtml(packet.approvedCopy)}</p>
          </div>
          <button class="build-work-panel-demo-download" type="button" data-build-work-panel-download disabled>${escapeHtml(packet.preparingLabel)}</button>
        </div>
      </section>
    `;
  }

  if (packetState === "denied") {
    return `
      <section class="build-work-panel-demo-packet" data-build-work-panel-packet aria-label="Product Discovery packet status">
        <div class="build-work-panel-demo-packet-row">
          <div>
            <strong>${escapeHtml(packet.title)}</strong>
            <p class="build-work-panel-demo-review-note build-work-panel-demo-review-note-denied"><span class="build-work-panel-demo-status-dot" aria-hidden="true"></span><span>${escapeHtml(packet.deniedStatus)}</span></p>
            <p class="build-work-panel-demo-review-note">${escapeHtml(packet.deniedCopy)}</p>
          </div>
        </div>
      </section>
    `;
  }

  if (packetState === "failed") {
    return `
      <section class="build-work-panel-demo-packet" data-build-work-panel-packet aria-label="Product Discovery packet status">
        <div class="build-work-panel-demo-packet-row">
          <div>
            <strong>${escapeHtml(packet.title)}</strong>
            <p class="build-work-panel-demo-review-note build-work-panel-demo-review-note-failed"><span class="build-work-panel-demo-status-dot" aria-hidden="true"></span><span>${escapeHtml(packet.failedStatus)}</span></p>
            <p class="build-work-panel-demo-review-note">${escapeHtml(packet.failedCopy)}</p>
          </div>
          <button class="build-work-panel-demo-repeat" type="button" data-build-work-panel-download aria-label="${escapeHtml(packet.retryLabel)}">${svg(iconPaths.retry)}</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="build-work-panel-demo-packet" data-build-work-panel-packet aria-label="Product Discovery packet status">
      <div class="build-work-panel-demo-packet-row">
        <div>
          <strong>${escapeHtml(packet.title)}</strong>
          <p class="build-work-panel-demo-review-note"><span class="build-work-panel-demo-status-dot" aria-hidden="true"></span><span data-build-work-panel-download-status>${escapeHtml(packet.readyStatus)}</span></p>
          <p class="build-work-panel-demo-review-note">${escapeHtml(packet.approvedCopy)}</p>
        </div>
        <button class="build-work-panel-demo-download" type="button" data-build-work-panel-download>${escapeHtml(packet.downloadLabel)}</button>
      </div>
    </section>
  `;
}

function resolveMessages(state, messages) {
  if (state.longMessages) {
    return longStressMessages;
  }

  if (state.packetState === "completed") {
    return [
      ...messages,
      {
        author: "Harness",
        text: "Product Discovery packet downloaded from approved packet version 1. This event is now part of the conversation history.",
        repeatDownload: true,
      },
    ];
  }

  return messages;
}

function renderEditBox(message) {
  return `
    <div class="build-work-panel-demo-edit-box" data-build-work-panel-edit-box>
      <textarea aria-label="Edit message">${escapeHtml(message.text)}</textarea>
      <div class="build-work-panel-demo-edit-actions">
        <button type="button" data-build-work-panel-save-edit>Save</button>
        <button type="button" data-build-work-panel-cancel-edit>Cancel</button>
      </div>
    </div>
  `;
}

export function renderConversationPanel(
  root,
  {
    ref = getBuildWorkPanelCanonicalRef(),
    messages = defaultMessages,
    history = defaultHistory,
    config: rawConfig,
  } = {},
) {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  const config = getConversationPanelConfig(rawConfig);
  const state = typeof ref === "string" ? getConversationPanelCanonicalRef(ref) : ref;
  const panelOpen = state.panelOpen !== false;
  const historyOpen = state.historyOpen !== false;
  const resolvedMessages = resolveMessages(state, messages);
  const replyMessage = Number.isInteger(state.replyToMessageIndex) ? resolvedMessages[state.replyToMessageIndex] : null;
  const inputValue = replyMessage
    ? `Replying to: "${replyMessage.text}"\n\n`
    : state.inputValue ?? "";

  root.classList.add("build-work-panel-demo-app");
  root.dataset.buildWorkPanelMounted = "true";
  root.dataset.panelOpen = panelOpen ? "true" : "false";
  root.dataset.buildWorkPanelCanonicalRef = state.ref;
  root.setAttribute("dir", state.direction ?? "ltr");
  if (state.scale) {
    root.style.setProperty("--bwp-demo-scale", state.scale);
  }

  root.innerHTML = `
    <aside class="build-work-panel-demo-panel${panelOpen ? " is-open" : ""}" data-build-work-panel-panel data-history-open="${historyOpen ? "true" : "false"}" aria-label="${escapeHtml(config.panel.ariaLabel)}">
      <header class="build-work-panel-demo-panel-header">
        <div>
          <p class="top-nav-preview-eyebrow">${escapeHtml(config.panel.eyebrow)}</p>
          <h2>${escapeHtml(config.panel.title)}</h2>
        </div>
        <div class="build-work-panel-demo-header-actions">
          <button class="build-work-panel-demo-history-toggle" type="button" data-build-work-panel-history-toggle aria-controls="build-work-panel-history" aria-expanded="${historyOpen ? "true" : "false"}">
            <span class="build-work-panel-demo-history-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>
            <span data-build-work-panel-history-toggle-label>${historyOpen ? "Hide history" : "Show history"}</span>
            <span class="build-work-panel-demo-history-toggle-caret" aria-hidden="true">${svg("m9 6 6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6z")}</span>
          </button>
          <button class="build-work-panel-demo-close" type="button" data-build-work-panel-close aria-label="${escapeHtml(config.panel.closeLabel)}">${svg(iconPaths.close)}</button>
        </div>
      </header>
      <div class="build-work-panel-demo-body">
        <aside id="build-work-panel-history" class="build-work-panel-demo-history" aria-label="${escapeHtml(config.panel.historyLabel)}">
          <div class="build-work-panel-demo-history-header"><strong>${escapeHtml(config.panel.historyLabel)}</strong><span>${history.length} items</span></div>
          ${history.map((item, index) => `
            <button class="build-work-panel-demo-history-item${index === 0 ? " is-active" : ""}${state.forceHistoryTooltip && index === 0 ? " is-tooltip-visible" : ""}" type="button" title="${escapeHtml(item.summary.slice(0, 140))}">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.summary.slice(0, 140))}</span>
            </button>
          `).join("")}
        </aside>
        <div class="build-work-panel-demo-chat-column">
          <div class="build-work-panel-demo-thread" data-build-work-panel-thread aria-label="${escapeHtml(config.panel.threadLabel)}">
            ${resolvedMessages.map((message, index) => `
              <div class="build-work-panel-demo-message${message.user ? " is-user" : ""}" data-build-work-panel-message-index="${index}">
                <strong>${escapeHtml(message.author)}</strong>
                <span data-build-work-panel-message-copy${state.editMessageIndex === index ? " hidden" : ""}>${escapeHtml(message.text)}</span>
                ${state.editMessageIndex === index ? renderEditBox(message) : ""}
                ${message.repeatDownload ? `<button class="build-work-panel-demo-repeat" type="button" data-build-work-panel-download aria-label="${escapeHtml(config.packet.repeatDownloadLabel)}">${svg(iconPaths.download)}</button>` : renderMessageActions(message)}
              </div>
            `).join("")}
          </div>
          ${renderPacket(state.packetState, config)}
          <div class="build-work-panel-demo-input-area">
            <div id="build-work-panel-tools-menu" class="build-work-panel-demo-tools-menu${state.toolsOpen ? " is-open" : ""}" data-build-work-panel-tools-menu role="menu" aria-label="Chat input tools">
              ${config.tools.map((tool) => `
                <button class="build-work-panel-demo-tools-menu-item" type="button" role="menuitem" data-build-work-panel-tool-action="${escapeHtml(tool.key)}">${svg(iconPaths[tool.icon] ?? iconPaths.logs)}<span>${escapeHtml(tool.label)}</span></button>
              `).join("")}
            </div>
            <form class="build-work-panel-demo-composer" data-build-work-panel-composer>
              <button class="build-work-panel-demo-tools-toggle" type="button" data-build-work-panel-tools-toggle aria-label="Open chat tools" aria-controls="build-work-panel-tools-menu" aria-expanded="${state.toolsOpen ? "true" : "false"}">+</button>
              <textarea data-build-work-panel-message rows="1" aria-label="${escapeHtml(config.panel.composerLabel)}" placeholder="${escapeHtml(config.panel.composerPlaceholder)}">${escapeHtml(inputValue)}</textarea>
              <button class="build-work-panel-demo-send" type="submit" aria-label="Send message">${svg("M4 5.5 20 12 4 18.5V14l8-2-8-2z")}</button>
            </form>
          </div>
        </div>
      </div>
    </aside>
    <nav class="build-work-panel-demo-action-nav" aria-label="Page actions">
      ${config.modes.map((mode) => `
        <button class="build-work-panel-demo-action" type="button" ${mode.disabled ? 'aria-disabled="true"' : ""} ${mode.active ? 'aria-pressed="true"' : ""} data-build-work-panel-mode="${escapeHtml(mode.key)}" ${mode.key === "build" ? "data-build-work-panel-build-action" : ""} data-tooltip="${escapeHtml(mode.label)}">${svg(iconPaths[mode.icon] ?? iconPaths.build)}<span>${escapeHtml(mode.label)}</span></button>
      `).join("")}
    </nav>
    <button class="build-work-panel-demo-fab" type="button" data-build-work-panel-open aria-expanded="${panelOpen ? "true" : "false"}" aria-controls="build-work-panel-panel">Build</button>
  `;

  return root;
}

export function createBuildWorkPanelController(root, options = {}) {
  return createConversationPanelController(root, options);
}

export const renderBuildWorkPanel = renderConversationPanel;

export function createConversationPanelController(root, options = {}) {
  renderConversationPanel(root, options);
  const handlers = options.handlers ?? {};

  const panel = root.querySelector("[data-build-work-panel-panel]");
  const openButton = root.querySelector("[data-build-work-panel-open]");
  const closeButton = root.querySelector("[data-build-work-panel-close]");
  const buildAction = root.querySelector("[data-build-work-panel-build-action]");
  const historyToggle = root.querySelector("[data-build-work-panel-history-toggle]");
  const historyToggleLabel = root.querySelector("[data-build-work-panel-history-toggle-label]");
  const toolsToggle = root.querySelector("[data-build-work-panel-tools-toggle]");
  const toolsMenu = root.querySelector("[data-build-work-panel-tools-menu]");
  const input = root.querySelector("[data-build-work-panel-message]");
  const composer = root.querySelector("[data-build-work-panel-composer]");

  function setPanelOpen(isOpen) {
    root.dataset.panelOpen = isOpen ? "true" : "false";
    panel?.classList.toggle("is-open", isOpen);
    openButton?.setAttribute("aria-expanded", String(isOpen));
    handlers.onPanelOpenChange?.({ open: isOpen });
  }

  function setHistoryOpen(isOpen) {
    if (panel instanceof HTMLElement) {
      panel.dataset.historyOpen = isOpen ? "true" : "false";
    }
    historyToggle?.setAttribute("aria-expanded", String(isOpen));
    if (historyToggleLabel instanceof HTMLElement) {
      historyToggleLabel.textContent = isOpen ? "Hide history" : "Show history";
    }
    handlers.onHistoryOpenChange?.({ open: isOpen });
  }

  function setToolsOpen(isOpen) {
    toolsToggle?.setAttribute("aria-expanded", String(isOpen));
    toolsMenu?.classList.toggle("is-open", isOpen);
    handlers.onToolsOpenChange?.({ open: isOpen });
  }

  function resizeInput() {
    if (!(input instanceof HTMLTextAreaElement)) {
      return;
    }
    const computedStyle = window.getComputedStyle(input);
    const maxHeight = Number.parseFloat(computedStyle.maxHeight);
    const minHeight = Number.parseFloat(computedStyle.minHeight);
    const emptyHeight = Number.isFinite(minHeight) ? minHeight : 40;
    if (input.value.trim().length === 0) {
      input.style.height = `${emptyHeight}px`;
      input.style.overflowY = "hidden";
      return;
    }

    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 20;
    const horizontalPadding =
      (Number.parseFloat(computedStyle.paddingLeft) || 0) + (Number.parseFloat(computedStyle.paddingRight) || 0);
    const averageCharacterWidth = Math.max(8, lineHeight * 0.48);
    const usableWidth = Math.max(1, input.clientWidth - horizontalPadding);
    const charactersPerLine = Math.max(16, Math.floor(usableWidth / averageCharacterWidth));
    const measuredLines = input.value
      .split("\n")
      .reduce((lineCount, line) => lineCount + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0);
    const measuredHeight = emptyHeight + Math.max(0, measuredLines - 1) * lineHeight;
    const nextHeight = Number.isFinite(maxHeight) ? Math.min(measuredHeight, maxHeight) : measuredHeight;
    input.style.height = `${nextHeight}px`;
    input.style.overflowY = Number.isFinite(maxHeight) && measuredHeight > maxHeight ? "auto" : "hidden";
  }

  openButton?.addEventListener("click", () => setPanelOpen(true));
  closeButton?.addEventListener("click", () => setPanelOpen(false));
  buildAction?.addEventListener("click", () => setPanelOpen(!(panel instanceof HTMLElement && panel.classList.contains("is-open"))));
  historyToggle?.addEventListener("click", () => setHistoryOpen(!(panel instanceof HTMLElement && panel.dataset.historyOpen === "true")));
  toolsToggle?.addEventListener("click", () => setToolsOpen(!(toolsMenu instanceof HTMLElement && toolsMenu.classList.contains("is-open"))));
  composer?.addEventListener("submit", (event) => {
    event.preventDefault();
    handlers.onSendMessage?.({
      value: input instanceof HTMLTextAreaElement ? input.value : "",
    });
  });
  root.querySelectorAll("[data-build-work-panel-mode]").forEach((modeButton) => {
    modeButton.addEventListener("click", () => {
      if (!(modeButton instanceof HTMLElement) || modeButton.getAttribute("aria-disabled") === "true") {
        return;
      }
      handlers.onModeSelect?.({ mode: modeButton.dataset.buildWorkPanelMode ?? "" });
    });
  });
  root.querySelectorAll("[data-build-work-panel-tool-action]").forEach((toolButton) => {
    toolButton.addEventListener("click", () => {
      if (!(toolButton instanceof HTMLElement)) {
        return;
      }
      handlers.onToolAction?.({ action: toolButton.dataset.buildWorkPanelToolAction ?? "" });
      setToolsOpen(false);
    });
  });
  root.querySelectorAll("[data-build-work-panel-download]").forEach((downloadButton) => {
    downloadButton.addEventListener("click", () => {
      handlers.onDownloadPacket?.({ repeat: Boolean(downloadButton.closest(".build-work-panel-demo-message")) });
    });
  });
  root.querySelectorAll("[data-build-work-panel-copy-message]").forEach((copyButton) => {
    copyButton.addEventListener("click", () => {
      const message = copyButton.closest("[data-build-work-panel-message-index]");
      handlers.onCopyMessage?.({
        index: message instanceof HTMLElement ? Number.parseInt(message.dataset.buildWorkPanelMessageIndex ?? "", 10) : null,
      });
    });
  });
  root.querySelectorAll("[data-build-work-panel-edit-message]").forEach((editButton) => {
    editButton.addEventListener("click", () => {
      const message = editButton.closest("[data-build-work-panel-message-index]");
      handlers.onEditMessage?.({
        index: message instanceof HTMLElement ? Number.parseInt(message.dataset.buildWorkPanelMessageIndex ?? "", 10) : null,
      });
    });
  });
  root.querySelectorAll("[data-build-work-panel-reply-message]").forEach((replyButton) => {
    replyButton.addEventListener("click", () => {
      const message = replyButton.closest("[data-build-work-panel-message-index]");
      handlers.onReplyToMessage?.({
        index: message instanceof HTMLElement ? Number.parseInt(message.dataset.buildWorkPanelMessageIndex ?? "", 10) : null,
      });
    });
  });
  function handleDocumentClick(event) {
    if (!(toolsMenu instanceof HTMLElement) || !(toolsToggle instanceof HTMLElement)) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && (toolsMenu.contains(target) || toolsToggle.contains(target))) {
      return;
    }

    setToolsOpen(false);
  }

  function handleKeydown(event) {
    if (event.key !== "Escape" || !(toolsMenu instanceof HTMLElement) || !toolsMenu.classList.contains("is-open")) {
      return;
    }

    setToolsOpen(false);
    if (toolsToggle instanceof HTMLButtonElement) {
      toolsToggle.focus();
    }
  }

  root.ownerDocument.addEventListener("click", handleDocumentClick);
  root.ownerDocument.defaultView?.addEventListener("keydown", handleKeydown);
  input?.addEventListener("input", resizeInput);
  resizeInput();

  return {
    setPanelOpen,
    setHistoryOpen,
    setToolsOpen,
    resizeInput,
    destroy() {
      root.ownerDocument.removeEventListener("click", handleDocumentClick);
      root.ownerDocument.defaultView?.removeEventListener("keydown", handleKeydown);
    },
  };
}
