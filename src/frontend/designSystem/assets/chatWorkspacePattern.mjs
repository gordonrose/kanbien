import {
  createBuildConversationPanelConfig,
  createConversationPanelController,
  getConversationPanelCanonicalRef,
} from "./conversationPanel.mjs";
import {
  renderChatWorkspaceEntitySelectorTrigger,
  renderChatWorkspaceSecondaryHeader,
} from "./chatWorkspaceSecondaryHeader.mjs";
import {
  clearChatWorkspaceConversationIndex,
  dockChatWorkspaceConversationIndex,
} from "./chatWorkspaceConversationIndex.mjs";
import {
  getChatWorkspaceEntityItemCount as getEntityItemCount,
  refreshChatWorkspaceEntityHostLayout,
  renderChatWorkspaceEntityHost,
} from "./chatWorkspaceEntityHost.mjs";
import {
  renderChatWorkspaceEntitySelector,
} from "./chatWorkspaceEntitySelector.mjs";
import { renderChatWorkspaceJointHeader } from "./chatWorkspaceJointHeader.mjs";
import {
  renderChatWorkspaceListDrawer,
  syncChatWorkspaceRowSelection,
} from "./chatWorkspaceRowDrawer.mjs";
import {
  closeChatWorkspaceEntitySelector,
  closeChatWorkspaceRowDrawer,
  getClosedChatWorkspaceDrawerState,
  resolveChatWorkspaceClickActions,
  runChatWorkspaceActionEffects,
  selectChatWorkspaceEntity,
  selectChatWorkspaceLayer,
  selectChatWorkspaceTool,
  startChatWorkspaceConversation,
} from "./chatWorkspaceController.mjs";
import { createChatWorkspaceBootstrap } from "./chatWorkspaceBootstrap.mjs";
import {
  chatWorkspaceExpansionModes,
  chatWorkspaceLayers as layers,
  getChatWorkspaceLayerDefaultEntity as getLayerDefaultEntity,
  getChatWorkspaceLayerDefaultTool,
  getChatWorkspaceLayerTools,
  isChatWorkspaceExpansionEnabled,
} from "./chatWorkspaceShellContract.mjs";

const chatWorkspacePreviewConfig = Object.freeze({
  expansion: chatWorkspaceExpansionModes.enabled,
});

const layerDefaults = {
  discovery: {
    history: [
      ["chat-workspace-discovery-history", "Discovery chat history", "Active discovery thread, open questions, and packet context."],
      ["chat-workspace-build-panel", "Build panel MVP", "Workspace pattern review with active discovery, design, and delivery layers."],
      ["chat-workspace-pdf-export", "PDF export journey", "Packet export behavior, completed download states, and history continuity."],
    ],
  },
  design: {
    history: [
      ["chat-workspace-product-discovery", "Product Discovery", "Approved packet context for architecture and design questions."],
      ["chat-workspace-architecture-review", "Architecture review", "Open architecture decisions for the workspace pattern."],
      ["chat-workspace-design-review", "Design review", "Design-system review notes and component adoption posture."],
    ],
  },
  delivery: {
    history: [
      ["chat-workspace-epics", "Epics", "Delivery epic context and sequencing for the expanded workspace."],
      ["chat-workspace-stories", "Stories", "Story breakdown and acceptance notes for the active delivery lane."],
      ["chat-workspace-tasks", "Tasks", "Task-level delivery follow-up and implementation checkpoints."],
    ],
  },
};

function getLayerHistory(layerKey) {
  const defaultHistory = layerDefaults[layerKey]?.history ?? layerDefaults.discovery.history;
  return [
    ...defaultHistory.map(([conversationId, title, summary]) => ({
      conversationId,
      title,
      summary,
      archived: false,
    })),
    {
      conversationId: `${layerKey}-archived-reference`,
      title: "Archived review notes",
      summary: "Archived reference notes for earlier workspace layout alternatives.",
      archived: true,
    },
  ];
}

const activeState = {
  layer: layers[0],
  entity: getLayerDefaultEntity(layers[0]),
  tool: getChatWorkspaceLayerDefaultTool(layers[0]),
};

const chatState = {
  activeMode: "discovery",
  panel: { ...getConversationPanelCanonicalRef("BWP-R-004") },
  messages: [
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
  ],
  history: getLayerHistory(layers[0].key),
  archivedConversation: null,
};

const workspaceState = {
  expansionEnabled: isChatWorkspaceExpansionEnabled(chatWorkspacePreviewConfig),
  expanded: false,
  drawer: {
    open: false,
    row: null,
  },
  entityDrawerOpen: false,
  layerDrawerOpen: false,
};

let chatController = null;
let workspaceRefreshTimer = 0;
let bootstrapController = null;

const layerIconPaths = {
  discovery: "M12 3a7 7 0 0 0-4 12.75V18h8v-2.25A7 7 0 0 0 12 3zm0 2a5 5 0 0 1 2.6 9.27l-.6.36V16h-4v-1.37l-.6-.36A5 5 0 0 1 12 5zm-3 15h6v2H9z",
  design: "M5 4h10l4 4v12H5zm2 2v12h10V9h-3V6zm2 4h6v2H9zm0 4h4v2H9zM16 4l4 4h-4z",
  delivery: "M4 5h10v2H6v10h10v-8h2v10H4zm12.6-.4L20 8l-8.5 8.5-4-4L9 11l2.5 2.5z",
};

const workspaceToolIcons = {
  conversations: "M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v4A3.5 3.5 0 0 1 16.5 14H10l-5 4v-4.7A3.5 3.5 0 0 1 4 10.5zm4 1h8v2H8z",
  "product-discovery-package": "M6 3h8.5L19 7.5V21H6zm8 1.8V8h3.2zM9 11h6v2H9zm0 4h4v2H9zm8.8-4.4.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z",
  questions: "M12 3.5c3.6 0 6.5 2.35 6.5 5.5 0 2.55-1.9 4.65-4.5 5.3V17h-4v-4.1l1.4-.25c1.9-.35 3.1-1.7 3.1-3.3 0-1.75-1.45-3-3.35-3-1.65 0-2.95.85-3.35 2.25L5 7.8c.75-2.55 3.35-4.3 7-4.3zM10 19h4v2h-4z",
  "architecture-questions": "M12 3 4 8v2h16V8zm-5 9h2v6H7zm4 0h2v6h-2zm4 0h2v6h-2zM5 20h14v1H5zm10.8-8.4.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z",
  "design-questions": "M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v13A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5zm4 1.5v4h6V7zm0 6v2h6v-2zm0 4v1h4v-1z",
  epics: "M5 4h2v16H5zm4 1h8l2 2.4-2 2.4H9zm0 6h6.8l1.7 2-1.7 2H9zm0 5h5v2H9z",
  stories: "M8 4h9a2 2 0 0 1 2 2v9h-2V6H8zm-3 4h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5zm3 3h5v2H8zm0 4h4v2H8z",
  tasks: "M6 4h12v3h-2V6H8v12h8v-3h2v5H6zm9.2 4.2 1.4 1.4-4.6 4.6-2.6-2.6 1.4-1.4 1.2 1.2zM9 15h4v2H9z",
};

const workspaceControlIcons = {
  project: "M5 5h14v14H5zM5 9h14M9 5v14",
  index: "M8 6h11M8 12h11M8 18h11M5 6h.01M5 12h.01M5 18h.01",
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

function svg(path) {
  return `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${escapeHtml(path)}" /></svg>`;
}

function iconButtonGlyph(icon) {
  return `<span class="icon-button-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="${escapeHtml(workspaceControlIcons[icon])}" /></svg></span>`;
}

function getActiveChatTitle() {
  return chatState.history.find((item) => !item.archived)?.title ?? "Discovery chat";
}

function getChatModes() {
  return [
    {
      key: "build",
      label: "Build",
      icon: "build",
      active: true,
    },
  ];
}

function syncLayerMode(mode) {
  if (!selectChatWorkspaceLayer({
    layerKey: mode,
    layers,
    activeState,
    chatState,
    workspaceState,
    getLayerHistory,
  })) {
    return;
  }
  renderEntityWorkspace();
  syncHeaderLayerSelector();
  syncLayerToolbar();
}

function syncWorkspaceListHeader(entityWorkspace) {
  const header = entityWorkspace.querySelector(".floating-tab-list-header");
  const tabHeader = entityWorkspace.querySelector(".floating-tab-header");
  if (!(header instanceof HTMLElement) || !(tabHeader instanceof HTMLElement)) {
    return;
  }

  header.classList.add("chat-workspace-list-header-bar");
  header.innerHTML = workspaceState.expanded
    ? ""
    : `
      ${renderChatWorkspaceEntitySelectorTrigger({
        entityLabel: activeState.entity.label,
        expanded: workspaceState.entityDrawerOpen,
      })}
      <span class="floating-tab-panel-count">${escapeHtml(getEntityItemCount(activeState.entity))} records</span>
    `;
  if (header.previousElementSibling !== tabHeader) {
    entityWorkspace.insertBefore(header, tabHeader);
  }
}

function renderWorkspaceEntitySelector(entityWorkspace) {
  const mount = workspaceState.expanded && secondaryHeader instanceof HTMLElement
    ? secondaryHeader.querySelector("[data-chat-workspace-secondary-list]")
    : entityWorkspace.querySelector(".chat-workspace-list-header-bar");
  renderChatWorkspaceEntitySelector({
    entityWorkspace,
    mount,
    layer: activeState.layer,
    activeEntity: activeState.entity,
    open: workspaceState.entityDrawerOpen,
    getEntityCount: getEntityItemCount,
  });
}

function syncWorkspaceListRows(entityWorkspace) {
  syncWorkspaceListHeader(entityWorkspace);
  syncSecondaryHeader();
  renderWorkspaceEntitySelector(entityWorkspace);
  syncChatWorkspaceRowSelection({
    entityWorkspace,
    layer: activeState.layer,
    entity: activeState.entity,
    selectedRow: workspaceState.drawer,
  });
  renderChatWorkspaceListDrawer({
    entityWorkspace,
    selected: workspaceState.drawer.open ? workspaceState.drawer.row : null,
  });
}

function selectWorkspaceEntity(entityWorkspace, nextEntity) {
  if (!nextEntity) {
    return;
  }

  selectChatWorkspaceEntity({
    activeState,
    workspaceState,
    nextEntity,
    tools: getActiveLayerTools(),
  });
  const categoryButton = entityWorkspace.querySelector(`[data-floating-tab-category="${CSS.escape(nextEntity.key)}"]`);
  if (categoryButton instanceof HTMLElement) {
    categoryButton.dispatchEvent(new MouseEvent("click", { bubbles: false, cancelable: true }));
  }
  const kicker = entityWorkspace.querySelector(".floating-tab-project-kicker");
  if (kicker instanceof HTMLElement) {
    kicker.textContent = nextEntity.label;
  }
  syncHeaderLayerSelector();
  syncWorkspaceListRows(entityWorkspace);
  syncLayerToolbar();
}

function getActiveLayerTools() {
  return getChatWorkspaceLayerTools(activeState.layer.key);
}

function selectWorkspaceTool(toolKey) {
  const result = selectChatWorkspaceTool({
    activeState,
    chatState,
    workspaceState,
    toolKey,
    tools: getActiveLayerTools(),
  });
  if (!result) {
    return;
  }

  if (result.type === "conversations") {
    syncWorkspaceToggle({ refresh: false });
    syncLayerToolbar();
    return;
  }

  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (result.entity && entityWorkspace instanceof HTMLElement) {
    selectWorkspaceEntity(entityWorkspace, result.entity);
  }
  syncLayerToolbar();
}

function renderEntityWorkspace() {
  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (!(entityWorkspace instanceof HTMLElement)) {
    return;
  }

  renderChatWorkspaceEntityHost({
    root: entityWorkspace,
    layer: activeState.layer,
    activeEntity: activeState.entity,
    displayRoot: document.querySelector("[data-chat-workspace-shell]") ?? document.documentElement,
    onCategoryChange({ category }) {
      selectChatWorkspaceEntity({
        activeState,
        workspaceState,
        nextEntity: activeState.layer.entities.find((entity) => entity.key === category) ?? activeState.layer.entities[0],
        tools: getActiveLayerTools(),
        syncTool: false,
      });
      window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
    },
    onTabChange() {
      closeChatWorkspaceRowDrawer({ workspaceState });
      closeChatWorkspaceEntitySelector({ workspaceState });
      window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
    },
  });
  bootstrapController?.getListInteractionController()?.installWorkspaceListDrawer(entityWorkspace);
}

function refreshEntityWorkspaceAfterLayout() {
  refreshChatWorkspaceEntityHostLayout({
    getRoot() {
      return document.querySelector("[data-chat-workspace-entity-workspace]");
    },
    onSyncRows: syncWorkspaceListRows,
    clearTimer() {
      window.clearTimeout(workspaceRefreshTimer);
    },
    setTimer(timer) {
      workspaceRefreshTimer = timer;
    },
  });
}

function applyRequestDisplayState(root) {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");
  const direction = params.get("dir");
  const scale = params.get("scale") ?? params.get("zoom");
  const expanded = params.get("expanded");
  const expansion = params.get("expansion");

  if (["dark", "desert"].includes(theme)) {
    applyPreviewTheme(theme);
  }
  if (direction === "rtl") {
    applyPreviewDirection("rtl");
  }
  if (scale) {
    applyPreviewScale(scale);
  }
  if (expansion === chatWorkspaceExpansionModes.disabled) {
    workspaceState.expansionEnabled = false;
    workspaceState.expanded = false;
  }
  if (expanded === "true" && workspaceState.expansionEnabled) {
    workspaceState.expanded = true;
  }
}

const shell = document.querySelector("[data-chat-workspace-shell]");
const chatMount = document.querySelector("[data-chat-workspace-chat-mount]");
const workspaceMain = document.querySelector("[data-chat-workspace-main]");
const layerToolbar = document.querySelector("[data-chat-workspace-layer-toolbar]");
const historyDock = document.querySelector("[data-chat-workspace-history-dock]");
const secondaryHeader = document.querySelector("[data-chat-workspace-secondary-header]");
const patternPage = document.querySelector("[data-chat-workspace-pattern]");
const settingsOpenButton = document.querySelector("[data-chat-workspace-settings-open]");
const settingsCloseButton = document.querySelector("[data-chat-workspace-settings-close]");
const settingsDrawer = document.querySelector("[data-chat-workspace-settings-drawer]");
const themeOptionButtons = document.querySelectorAll("[data-chat-workspace-theme]");
const scaleOptionButtons = document.querySelectorAll("[data-chat-workspace-scale]");
const directionOptionButtons = document.querySelectorAll("[data-chat-workspace-direction]");

function activateOption(buttons, activeButton) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("active", isActive);
    button.classList.toggle("is-active", isActive);
    if (button instanceof HTMLButtonElement) {
      button.setAttribute("aria-pressed", String(isActive));
    }
  });
}

function findOptionButton(buttons, value, dataName) {
  return Array.from(buttons).find((button) => button instanceof HTMLButtonElement && button.dataset[dataName] === value) ?? null;
}

function setSettingsOpen(isOpen) {
  if (!(settingsDrawer instanceof HTMLElement)) {
    return;
  }

  settingsDrawer.classList.toggle("is-open", isOpen);
  settingsDrawer.classList.toggle("hidden", !isOpen);
  settingsDrawer.setAttribute("aria-hidden", String(!isOpen));
  if (settingsOpenButton instanceof HTMLButtonElement) {
    settingsOpenButton.setAttribute("aria-expanded", String(isOpen));
  }
}

function applyPreviewTheme(theme, activeButton = null) {
  const normalizedTheme = ["normal", "dark", "desert"].includes(theme) ? theme : "normal";
  if (shell instanceof HTMLElement) {
    if (normalizedTheme === "normal") {
      delete shell.dataset.themeScope;
    } else {
      shell.dataset.themeScope = normalizedTheme;
    }
  }
  if (patternPage instanceof HTMLElement) {
    if (normalizedTheme === "normal") {
      delete patternPage.dataset.demoTheme;
    } else {
      patternPage.dataset.demoTheme = normalizedTheme;
    }
  }
  if (settingsDrawer instanceof HTMLElement) {
    settingsDrawer.dataset.demoTheme = normalizedTheme;
  }
  activateOption(themeOptionButtons, activeButton ?? findOptionButton(themeOptionButtons, normalizedTheme, "chatWorkspaceTheme"));
}

function applyPreviewScale(scale, activeButton = null) {
  const normalizedScale = ["100", "115", "135"].includes(scale) ? scale : "100";
  if (shell instanceof HTMLElement) {
    shell.style.setProperty("--ui-scale", String(Number(normalizedScale) / 100));
  }
  activateOption(scaleOptionButtons, activeButton ?? findOptionButton(scaleOptionButtons, normalizedScale, "chatWorkspaceScale"));
}

function applyPreviewDirection(direction, activeButton = null) {
  const normalizedDirection = direction === "rtl" ? "rtl" : "ltr";
  if (shell instanceof HTMLElement) {
    shell.setAttribute("dir", normalizedDirection);
  }
  if (patternPage instanceof HTMLElement) {
    patternPage.setAttribute("dir", normalizedDirection);
  }
  if (settingsDrawer instanceof HTMLElement) {
    settingsDrawer.setAttribute("dir", normalizedDirection);
  }
  activateOption(directionOptionButtons, activeButton ?? findOptionButton(directionOptionButtons, normalizedDirection, "chatWorkspaceDirection"));
}

function installDisplaySettingsDrawer() {
  settingsOpenButton?.addEventListener("click", () => {
    const isOpen = settingsDrawer instanceof HTMLElement && settingsDrawer.classList.contains("is-open");
    setSettingsOpen(!isOpen);
  });

  settingsCloseButton?.addEventListener("click", () => {
    setSettingsOpen(false);
    if (settingsOpenButton instanceof HTMLButtonElement) {
      settingsOpenButton.focus();
    }
  });

  themeOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button instanceof HTMLButtonElement) {
        applyPreviewTheme(button.dataset.chatWorkspaceTheme ?? "normal", button);
      }
    });
  });

  scaleOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button instanceof HTMLButtonElement) {
        applyPreviewScale(button.dataset.chatWorkspaceScale ?? "100", button);
      }
    });
  });

  directionOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button instanceof HTMLButtonElement) {
        applyPreviewDirection(button.dataset.chatWorkspaceDirection ?? "ltr", button);
      }
    });
  });
}

bootstrapController = createChatWorkspaceBootstrap({
  activeState,
  applyRequestDisplayState,
  chatMount,
  chatState,
  documentRef: document,
  getEntityWorkspace() {
    return document.querySelector("[data-chat-workspace-entity-workspace]");
  },
  historyDock,
  iconButtonMarkup: iconButtonGlyph("project"),
  mountChatPanel,
  renderEntityWorkspace,
  runActionEffects(target, workspaceEffectHandlers) {
    const actions = resolveChatWorkspaceClickActions(target, { workspaceState });
    for (const action of actions) {
      const result = runChatWorkspaceActionEffects(action, workspaceEffectHandlers);
      if (result.stopped) {
        return true;
      }
    }
    return false;
  },
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
});

function syncLayerToolbar() {
  if (!(layerToolbar instanceof HTMLElement)) {
    return;
  }

  layerToolbar.innerHTML = getActiveLayerTools().map((tool) => `
    <button class="build-work-panel-demo-action" type="button" ${tool.key === activeState.tool ? 'aria-pressed="true"' : ""} data-chat-workspace-tool="${escapeHtml(tool.key)}" data-tooltip="${escapeHtml(tool.label)}">${svg(workspaceToolIcons[tool.key] ?? workspaceToolIcons.conversations)}<span>${escapeHtml(tool.label)}</span></button>
  `).join("");
  layerToolbar.querySelectorAll("[data-chat-workspace-tool]").forEach((toolButton) => {
    toolButton.addEventListener("click", () => {
      if (!(toolButton instanceof HTMLElement) || toolButton.getAttribute("aria-disabled") === "true") {
        return;
      }
      selectWorkspaceTool(toolButton.dataset.chatWorkspaceTool ?? "");
      chatState.panel.panelOpen = true;
      mountChatPanel();
    });
  });
}

function syncWorkspaceToggle({ refresh = false } = {}) {
  bootstrapController?.syncWorkspaceToggle({ refresh });
}

function syncHeaderLayerSelector() {
  const header = document.querySelector("[data-chat-workspace-joint-header]");
  if (!(header instanceof HTMLElement)) {
    return;
  }

  const historyOpen = chatState.panel.historyOpen !== false;
  header.dataset.chatWorkspaceHeaderHistoryOpen = historyOpen ? "true" : "false";
  header.innerHTML = renderChatWorkspaceJointHeader({
    workspaceExpanded: workspaceState.expanded,
    expansionEnabled: workspaceState.expansionEnabled,
    layerDrawerOpen: workspaceState.layerDrawerOpen,
    activeLayer: activeState.layer,
    layers,
  });
}

function syncSecondaryHeader() {
  if (!(secondaryHeader instanceof HTMLElement)) {
    return;
  }

  const historyOpen = chatState.panel.historyOpen !== false;
  secondaryHeader.dataset.chatWorkspaceSecondaryHistoryOpen = historyOpen ? "true" : "false";
  secondaryHeader.innerHTML = renderChatWorkspaceSecondaryHeader({
    historyOpen,
    workspaceExpanded: workspaceState.expanded,
    chatLabel: historyOpen ? getActiveChatTitle() : "Discovery chat",
    entityLabel: activeState.entity.label,
    entitySelectorExpanded: workspaceState.entityDrawerOpen,
    recordCount: getEntityItemCount(activeState.entity),
  });

  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (entityWorkspace instanceof HTMLElement) {
    renderWorkspaceEntitySelector(entityWorkspace);
  }
}

function startNewConversation() {
  startChatWorkspaceConversation({ chatState });
  mountChatPanel();
}

function syncHistoryDock() {
  dockChatWorkspaceConversationIndex({
    chatMount,
    historyDock,
    historyOpen: chatState.panel.historyOpen,
  });
}

function installWorkspaceToggle() {
  bootstrapController?.installWorkspaceToggle();
}

function installWorkspaceHistoryIconButton() {
  if (!(chatMount instanceof HTMLElement)) {
    return;
  }

  const historyToggle = chatMount.querySelector("[data-build-work-panel-history-toggle]");
  if (!(historyToggle instanceof HTMLButtonElement)) {
    return;
  }

  const labelText = chatState.panel.historyOpen === false ? "Show history" : "Hide history";
  historyToggle.className = "icon-button tooltip-anchor";
  historyToggle.dataset.tooltip = labelText;
  historyToggle.setAttribute("aria-label", labelText);
  historyToggle.innerHTML = iconButtonGlyph("index");
}

function mountChatPanel() {
  if (!(chatMount instanceof HTMLElement)) {
    return;
  }

  chatController?.destroy?.();
  clearChatWorkspaceConversationIndex(historyDock);
  chatController = createConversationPanelController(chatMount, {
    ref: chatState.panel,
    messages: chatState.messages,
    history: chatState.history,
    config: createBuildConversationPanelConfig({
      modes: getChatModes(),
    }),
    handlers: {
      onModeSelect({ mode }) {
        if (mode === "build") {
          return;
        }
        syncLayerMode(mode);
        chatState.panel.panelOpen = true;
        mountChatPanel();
      },
      onPanelOpenChange({ open }) {
        chatState.panel.panelOpen = open;
      },
      onHistoryOpenChange({ open }) {
        chatState.panel.historyOpen = open;
        syncWorkspaceToggle({ refresh: workspaceState.expanded });
      },
      onToolsOpenChange({ open }) {
        chatState.panel.toolsOpen = open;
      },
      onSendMessage({ value }) {
        const text = value.trim();
        if (!text) {
          return;
        }
        chatState.messages.push({ author: "Builder", text, user: true });
        chatState.messages.push({
          author: "Harness",
          text: "Captured. I will keep that in the current workspace thread while you continue shaping the build.",
        });
        chatState.panel.inputValue = "";
        chatState.panel.replyToMessageIndex = null;
        mountChatPanel();
      },
      onCopyMessage({ index }) {
        chatState.panel.copyNotice = Number.isInteger(index) ? "Message copied" : "Copy unavailable";
        mountChatPanel();
      },
      onEditMessage({ index }) {
        chatState.panel.editMessageIndex = index;
        mountChatPanel();
      },
      onSaveEdit({ index, value }) {
        if (Number.isInteger(index) && chatState.messages[index]) {
          chatState.messages[index] = { ...chatState.messages[index], text: value.trim() || chatState.messages[index].text };
        }
        chatState.panel.editMessageIndex = null;
        mountChatPanel();
      },
      onCancelEdit() {
        chatState.panel.editMessageIndex = null;
        mountChatPanel();
      },
      onReplyToMessage({ index }) {
        chatState.panel.replyToMessageIndex = index;
        mountChatPanel();
      },
      onDownloadPacket() {
        chatState.panel.packetState = "completed";
        mountChatPanel();
      },
      onNewConversation() {
        startNewConversation();
      },
      onHistoryViewSelect({ view }) {
        chatState.panel.historyView = view;
        mountChatPanel();
      },
      onRenameConversation({ conversationId }) {
        chatState.panel.renameConversationId = conversationId;
        mountChatPanel();
      },
      onSaveRenameConversation({ conversationId, title }) {
        const item = chatState.history.find((entry) => entry.conversationId === conversationId);
        if (item && title.trim()) {
          item.title = title.trim();
        }
        chatState.panel.renameConversationId = null;
        mountChatPanel();
      },
      onCancelRenameConversation() {
        chatState.panel.renameConversationId = null;
        mountChatPanel();
      },
      onArchiveConversation({ conversationId }) {
        const item = chatState.history.find((entry) => entry.conversationId === conversationId);
        if (item) {
          item.archived = !item.archived;
          chatState.archivedConversation = item;
          chatState.panel.showArchiveUndo = true;
        }
        mountChatPanel();
      },
      onUndoArchive() {
        if (chatState.archivedConversation) {
          chatState.archivedConversation.archived = false;
        }
        chatState.panel.showArchiveUndo = false;
        chatState.archivedConversation = null;
        mountChatPanel();
      },
      onToolAction({ action }) {
        chatState.panel.copyNotice = `${action.replaceAll("-", " ")} selected`;
        mountChatPanel();
      },
      onHistorySelect({ conversationId }) {
        const item = chatState.history.find((entry) => entry.conversationId === conversationId);
        if (item) {
          chatState.panel.copyNotice = `Viewing ${item.title}`;
        }
        mountChatPanel();
      },
    },
  });
  installWorkspaceToggle();
  installWorkspaceHistoryIconButton();
  syncLayerToolbar();
  syncHistoryDock();
  syncHeaderLayerSelector();
}

bootstrapController.initialize({
  onRefreshWorkspace: refreshEntityWorkspaceAfterLayout,
  onSyncHistoryIcon: installWorkspaceHistoryIconButton,
  onSyncHistoryDock: syncHistoryDock,
  onSyncHeader: syncHeaderLayerSelector,
  onSyncSecondaryHeader: syncSecondaryHeader,
});
installDisplaySettingsDrawer();
