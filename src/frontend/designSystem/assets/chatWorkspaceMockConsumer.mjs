import {
  createBuildConversationPanelConfig,
  createConversationPanelController,
  getConversationPanelCanonicalRef,
  renderConversationPanel,
} from "./conversationPanel.mjs";
import {
  clearChatWorkspaceConversationIndex,
  dockChatWorkspaceConversationIndex,
} from "./chatWorkspaceConversationIndex.mjs";
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
import {
  getChatWorkspaceEntityItemCount,
  refreshChatWorkspaceEntityHostLayout,
  renderChatWorkspaceEntityHost,
} from "./chatWorkspaceEntityHost.mjs";
import { renderChatWorkspaceEntitySelector } from "./chatWorkspaceEntitySelector.mjs";
import {
  renderChatWorkspaceJointHeader,
  renderChatWorkspaceLayerSelector,
} from "./chatWorkspaceJointHeader.mjs";
import {
  renderChatWorkspaceListDrawer,
  syncChatWorkspaceRowSelection,
} from "./chatWorkspaceRowDrawer.mjs";
import {
  renderChatWorkspaceEntitySelectorTrigger,
  renderChatWorkspaceSecondaryHeader,
} from "./chatWorkspaceSecondaryHeader.mjs";
import { createChatWorkspaceBootstrap } from "./chatWorkspaceBootstrap.mjs";
import {
  chatWorkspaceExpansionModes,
  chatWorkspaceLayers,
  createChatWorkspaceShellConfig,
  getChatWorkspaceLayerDefaultEntity,
  getChatWorkspaceLayerDefaultTool,
  getChatWorkspaceLayerTools,
} from "./chatWorkspaceShellContract.mjs";

const controlIcons = {
  index: "M8 6h11M8 12h11M8 18h11M5 6h.01M5 12h.01M5 18h.01",
  project: "M5 5h14v14H5zM5 9h14M9 5v14",
};

const toolIcons = {
  conversations: "M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v4A3.5 3.5 0 0 1 16.5 14H10l-5 4v-4.7A3.5 3.5 0 0 1 4 10.5zm4 1h8v2H8z",
  "product-discovery-package": "M6 3h8.5L19 7.5V21H6zm8 1.8V8h3.2zM9 11h6v2H9zm0 4h4v2H9zm8.8-4.4.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z",
  questions: "M12 3.5c3.6 0 6.5 2.35 6.5 5.5 0 2.55-1.9 4.65-4.5 5.3V17h-4v-4.1l1.4-.25c1.9-.35 3.1-1.7 3.1-3.3 0-1.75-1.45-3-3.35-3-1.65 0-2.95.85-3.35 2.25L5 7.8c.75-2.55 3.35-4.3 7-4.3zM10 19h4v2h-4z",
  "architecture-questions": "M12 3 4 8v2h16V8zm-5 9h2v6H7zm4 0h2v6h-2zm4 0h2v6h-2zM5 20h14v1H5zm10.8-8.4.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z",
  "design-questions": "M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v13A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5zm4 1.5v4h6V7zm0 6v2h6v-2zm0 4v1h4v-1z",
  epics: "M5 4h2v16H5zm4 1h8l2 2.4-2 2.4H9zm0 6h6.8l1.7 2-1.7 2H9zm0 5h5v2H9z",
  stories: "M8 4h9a2 2 0 0 1 2 2v9h-2V6H8zm-3 4h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5zm3 3h5v2H8zm0 4h4v2H8z",
  tasks: "M6 4h12v3h-2V6H8v12h8v-3h2v5H6zm9.2 4.2 1.4 1.4-4.6 4.6-2.6-2.6 1.4-1.4 1.2 1.2zM9 15h4v2H9z",
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
  return `<span class="icon-button-glyph" aria-hidden="true">${svg(controlIcons[icon])}</span>`;
}

function defaultHistoryForLayer(layerKey) {
  const labels = {
    discovery: ["Discovery chat history", "Build panel MVP", "PDF export journey"],
    design: ["Product Discovery", "Architecture review", "Design review"],
    delivery: ["Epics", "Stories", "Tasks"],
  }[layerKey] ?? ["Discovery chat history", "Build panel MVP", "PDF export journey"];

  return labels.map((title, index) => ({
    archived: false,
    conversationId: `mock-${layerKey}-${index + 1}`,
    summary: "Mock workspace adoption context for the root-admin users list.",
    title,
  }));
}

function normalizedHistory(history, layerKey) {
  return Array.isArray(history) && history.length > 0 ? history : defaultHistoryForLayer(layerKey);
}

export function createChatWorkspaceMockConsumerState({
  config = {},
  layers = chatWorkspaceLayers,
} = {}) {
  const shellConfig = createChatWorkspaceShellConfig({
    expansion: chatWorkspaceExpansionModes.enabled,
    defaultExpanded: false,
    defaultLayer: "discovery",
    features: {
      conversationIndex: true,
      entitySelector: true,
      statusTabs: true,
      rowDrawer: true,
      statusDragDrop: false,
      rowReorder: false,
    },
    layers,
    ...config,
  });
  const activeLayer = layers.find((layer) => layer.key === shellConfig.defaultLayer) ?? layers[0];

  return {
    active: {
      entity: getChatWorkspaceLayerDefaultEntity(activeLayer),
      layer: activeLayer,
      tool: getChatWorkspaceLayerDefaultTool(activeLayer),
    },
    chat: {
      activeMode: activeLayer.key,
      archivedConversation: null,
      history: defaultHistoryForLayer(activeLayer.key),
      messages: [],
      panel: { ...getConversationPanelCanonicalRef("BWP-R-004"), historyOpen: false, panelOpen: false },
    },
    config: shellConfig,
    workspace: {
      drawer: getClosedChatWorkspaceDrawerState(),
      entityDrawerOpen: false,
      expanded: false,
      expansionEnabled: shellConfig.expansion === chatWorkspaceExpansionModes.enabled,
      layerDrawerOpen: false,
    },
  };
}

function renderShellScaffold({ title = "Build work panel" } = {}) {
  return `
    <div class="chat-workspace-pattern-page" data-root-admin-chat-workspace-mock>
      <section class="chat-workspace-shell" aria-label="Root users chat workspace preview" data-chat-workspace-shell data-chat-workspace-expanded="false">
        <header class="chat-workspace-joint-header build-work-panel-demo-panel-header" data-chat-workspace-joint-header>
          <div>
            <p class="top-nav-preview-eyebrow">Layer 1</p>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <div class="build-work-panel-demo-header-actions">
            <button class="icon-button tooltip-anchor" type="button" data-chat-workspace-toggle aria-controls="chat-workspace-main" aria-expanded="false" aria-label="Expand workspace" data-tooltip="Expand workspace">
              ${iconButtonGlyph("project")}
            </button>
            <button class="build-work-panel-demo-close" type="button" data-chat-workspace-close aria-label="Close chat panel">
              ${svg("M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z")}
            </button>
          </div>
        </header>
        <header class="chat-workspace-secondary-header" data-chat-workspace-secondary-header></header>
        <nav class="chat-workspace-layer-toolbar build-work-panel-demo-action-nav" aria-label="Workspace focus" data-chat-workspace-layer-toolbar></nav>
        <section class="chat-workspace-history-dock" aria-label="Conversation history" data-chat-workspace-history-dock></section>
        <div class="chat-workspace-chat-pane build-work-panel-demo-page" aria-label="Chat pane">
          <div class="chat-workspace-chat-mount" data-chat-workspace-chat-mount></div>
        </div>
        <section id="chat-workspace-main" class="chat-workspace-main" aria-label="Workspace" data-chat-workspace-main aria-hidden="true">
          <div class="chat-workspace-tab-zone" aria-label="Workspace navigation">
            <div id="chat-workspace-entity-workspace" class="chat-workspace-entity-workspace" data-chat-workspace-entity-workspace></div>
          </div>
        </section>
      </section>
    </div>
  `;
}

export function createChatWorkspaceMockConsumerController(mount, {
  config,
  entityHostOptions = {},
  getChatInput,
  entitySelectorLabel = "",
  headerTools = [],
  layerSelectorPlacement = "joint-header",
  newConversationLabel = "Start new chat",
  onClose,
  showEntitySelector = true,
  showPrimaryCapabilityArea = true,
  state = createChatWorkspaceMockConsumerState({ config }),
  title = "Build work panel",
} = {}) {
  let chatController = null;
  let bootstrapController = null;
  let workspaceRefreshTimer = 0;
  const layers = state.config.layers ?? chatWorkspaceLayers;

  function getActiveLayerTools() {
    return getChatWorkspaceLayerTools(state.active.layer.key);
  }

  function getChatInputValue() {
    return typeof getChatInput === "function" ? (getChatInput() ?? {}) : {};
  }

  function getChatLabel() {
    const active = state.chat.history.find((item) => !item.archived);
    return active?.title ?? "Discovery chat";
  }

  function syncWorkspaceListHeader(entityWorkspace) {
    const header = entityWorkspace.querySelector(".floating-tab-list-header");
    const tabHeader = entityWorkspace.querySelector(".floating-tab-header");
    if (!(header instanceof HTMLElement) || !(tabHeader instanceof HTMLElement)) {
      return;
    }

    header.classList.add("chat-workspace-list-header-bar");
    header.innerHTML = state.workspace.expanded
      ? ""
      : `
        ${renderChatWorkspaceEntitySelectorTrigger({
          entityLabel: state.active.entity.label,
          expanded: state.workspace.entityDrawerOpen,
        })}
        <span class="floating-tab-panel-count">${escapeHtml(getChatWorkspaceEntityItemCount(state.active.entity, entityHostOptions))} records</span>
      `;
    if (header.previousElementSibling !== tabHeader) {
      entityWorkspace.insertBefore(header, tabHeader);
    }
  }

  function renderWorkspaceEntitySelector(entityWorkspace) {
    if (!showEntitySelector) {
      closeChatWorkspaceEntitySelector({ workspaceState: state.workspace });
      return;
    }
    const secondaryHeader = mount.querySelector("[data-chat-workspace-secondary-header]");
    const selectorMount = state.workspace.expanded && secondaryHeader instanceof HTMLElement
      ? secondaryHeader.querySelector("[data-chat-workspace-secondary-list]")
      : entityWorkspace.querySelector(".chat-workspace-list-header-bar");
    renderChatWorkspaceEntitySelector({
      activeEntity: state.active.entity,
      entityWorkspace,
      getEntityCount: getChatWorkspaceEntityItemCount,
      layer: state.active.layer,
      mount: selectorMount,
      open: state.workspace.entityDrawerOpen,
    });
  }

  function syncWorkspaceListRows(entityWorkspace) {
    syncWorkspaceListHeader(entityWorkspace);
    syncSecondaryHeader();
    renderWorkspaceEntitySelector(entityWorkspace);
    syncChatWorkspaceRowSelection({
      activeState: state.active,
      entity: state.active.entity,
      entityWorkspace,
      layer: state.active.layer,
      selectedRow: state.workspace.drawer,
    });
    renderChatWorkspaceListDrawer({
      entityWorkspace,
      selected: state.workspace.drawer.open ? state.workspace.drawer.row : null,
    });
  }

  function selectWorkspaceEntity(entityWorkspace, nextEntity) {
    if (!nextEntity) {
      return;
    }
    selectChatWorkspaceEntity({
      activeState: state.active,
      nextEntity,
      tools: getActiveLayerTools(),
      workspaceState: state.workspace,
    });
    const categoryButton = entityWorkspace.querySelector(`[data-floating-tab-category="${CSS.escape(nextEntity.key)}"]`);
    if (categoryButton instanceof HTMLElement) {
      categoryButton.dispatchEvent(new MouseEvent("click", { bubbles: false, cancelable: true }));
    }
    syncHeaderLayerSelector();
    syncWorkspaceListRows(entityWorkspace);
    syncLayerToolbar();
  }

  function selectWorkspaceTool(toolKey) {
    const result = selectChatWorkspaceTool({
      activeState: state.active,
      chatState: state.chat,
      toolKey,
      tools: getActiveLayerTools(),
      workspaceState: state.workspace,
    });
    if (!result) {
      return;
    }
    if (result.type === "entity") {
      const entityWorkspace = mount.querySelector("[data-chat-workspace-entity-workspace]");
      if (entityWorkspace instanceof HTMLElement) {
        selectWorkspaceEntity(entityWorkspace, result.entity);
      }
    }
    syncLayerToolbar();
    return result;
  }

  function renderEntityWorkspace() {
    const entityWorkspace = mount.querySelector("[data-chat-workspace-entity-workspace]");
    const shell = mount.querySelector("[data-chat-workspace-shell]");
    if (!(entityWorkspace instanceof HTMLElement)) {
      return;
    }
    renderChatWorkspaceEntityHost({
      activeEntity: state.active.entity,
      displayRoot: shell ?? document.documentElement,
      layer: state.active.layer,
      ...entityHostOptions,
      onCategoryChange({ category }) {
        selectChatWorkspaceEntity({
          activeState: state.active,
          nextEntity: state.active.layer.entities.find((entity) => entity.key === category) ?? state.active.layer.entities[0],
          syncTool: false,
          tools: getActiveLayerTools(),
          workspaceState: state.workspace,
        });
        window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
      },
      onTabChange() {
        closeChatWorkspaceRowDrawer({ workspaceState: state.workspace });
        closeChatWorkspaceEntitySelector({ workspaceState: state.workspace });
        window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
      },
      root: entityWorkspace,
    });
    bootstrapController?.getListInteractionController()?.installWorkspaceListDrawer(entityWorkspace);
  }

  function refreshEntityWorkspaceAfterLayout() {
    refreshChatWorkspaceEntityHostLayout({
      clearTimer() {
        window.clearTimeout(workspaceRefreshTimer);
      },
      getRoot() {
        return mount.querySelector("[data-chat-workspace-entity-workspace]");
      },
      onSyncRows: syncWorkspaceListRows,
      setTimer(timer) {
        workspaceRefreshTimer = timer;
      },
    });
  }

  function syncHeaderLayerSelector() {
    const header = mount.querySelector("[data-chat-workspace-joint-header]");
    if (!(header instanceof HTMLElement)) {
      return;
    }
    header.innerHTML = renderChatWorkspaceJointHeader({
      activeLayer: state.active.layer,
      expansionEnabled: state.workspace.expansionEnabled,
      layerDrawerOpen: state.workspace.layerDrawerOpen,
      layers,
      workspaceExpanded: state.workspace.expanded,
    });
  }

  function syncSecondaryHeader() {
    const secondaryHeader = mount.querySelector("[data-chat-workspace-secondary-header]");
    if (!(secondaryHeader instanceof HTMLElement)) {
      return;
    }
    const historyOpen = state.chat.panel.historyOpen !== false;
    secondaryHeader.dataset.chatWorkspaceSecondaryHistoryOpen = historyOpen ? "true" : "false";
    secondaryHeader.innerHTML = renderChatWorkspaceSecondaryHeader({
      chatLabel: historyOpen ? getChatLabel() : "Discovery chat",
      entityLabel: state.active.entity.label,
      entitySelectorLabel,
      entitySelectorExpanded: state.workspace.entityDrawerOpen,
      headerTools,
      historyOpen,
      listPrefix: layerSelectorPlacement === "secondary-list"
        ? renderChatWorkspaceLayerSelector({
          activeLayerKey: state.active.layer?.key,
          activeLayerLabel: state.active.layer?.label,
          expanded: state.workspace.layerDrawerOpen,
          layers,
        })
        : "",
      newConversationLabel,
      recordCount: getChatWorkspaceEntityItemCount(state.active.entity, entityHostOptions),
      showEntitySelector,
      showPrimaryCapabilityArea,
      workspaceExpanded: state.workspace.expanded,
    });
    const entityWorkspace = mount.querySelector("[data-chat-workspace-entity-workspace]");
    if (entityWorkspace instanceof HTMLElement) {
      renderWorkspaceEntitySelector(entityWorkspace);
    }
  }

  function syncHistoryDock() {
    dockChatWorkspaceConversationIndex({
      chatMount: mount.querySelector("[data-chat-workspace-chat-mount]"),
      historyDock: mount.querySelector("[data-chat-workspace-history-dock]"),
      historyOpen: state.chat.panel.historyOpen,
    });
  }

  function syncPanelOpenState() {
    const open = state.chat.panel.panelOpen !== false;
    mount.dataset.panelOpen = open ? "true" : "false";
    const shell = mount.querySelector("[data-chat-workspace-shell]");
    if (shell instanceof HTMLElement) {
      shell.dataset.chatWorkspacePanelOpen = open ? "true" : "false";
    }
  }

  function syncLayerToolbar() {
    const layerToolbar = mount.querySelector("[data-chat-workspace-layer-toolbar]");
    if (!(layerToolbar instanceof HTMLElement)) {
      return;
    }
    layerToolbar.innerHTML = getActiveLayerTools().map((tool) => `
      <button class="build-work-panel-demo-action" type="button" ${tool.key === state.active.tool ? 'aria-pressed="true"' : ""} data-chat-workspace-tool="${escapeHtml(tool.key)}" data-tooltip="${escapeHtml(tool.label)}">${svg(toolIcons[tool.key] ?? toolIcons.conversations)}<span>${escapeHtml(tool.label)}</span></button>
    `).join("");
    layerToolbar.querySelectorAll("[data-chat-workspace-tool]").forEach((toolButton) => {
      toolButton.addEventListener("click", () => {
        if (toolButton instanceof HTMLElement) {
          const result = selectWorkspaceTool(toolButton.dataset.chatWorkspaceTool ?? "");
          if (result?.type === "conversations" && !state.workspace.expanded) {
            state.chat.panel.historyOpen = false;
          }
          state.chat.panel.panelOpen = true;
          mountChatPanel();
        }
      });
    });
  }

  function syncLayerMode(layerKey) {
    const currentInput = getChatInputValue();
    if (!selectChatWorkspaceLayer({
      activeState: state.active,
      chatState: state.chat,
      getLayerHistory: (key) => normalizedHistory(currentInput.history, key),
      layerKey,
      layers,
      workspaceState: state.workspace,
    })) {
      return;
    }
    renderEntityWorkspace();
    syncHeaderLayerSelector();
    syncLayerToolbar();
  }

  function startNewConversation() {
    const handlers = getChatInputValue().handlers ?? {};
    if (typeof handlers.onNewConversation === "function") {
      state.chat.panel.packetState = "none";
      state.chat.panel.copyNotice = "";
      state.chat.panel.editMessageIndex = null;
      state.chat.panel.replyToMessageIndex = null;
      handlers.onNewConversation();
      return;
    }
    startChatWorkspaceConversation({ chatState: state.chat });
    mountChatPanel();
  }

  function mountChatPanel() {
    const chatMount = mount.querySelector("[data-chat-workspace-chat-mount]");
    if (!(chatMount instanceof HTMLElement)) {
      return;
    }
    const input = getChatInputValue();
    const ref = {
      ...(input.ref ?? {}),
      ...state.chat.panel,
    };
    if (state.chat.messages.length === 1 && state.chat.messages[0]?.text === "New chat started. Tell me what you want to shape next.") {
      ref.packetState = "none";
    }
    state.chat.panel = ref;
    state.chat.messages = Array.isArray(input.messages) ? input.messages : state.chat.messages;
    state.chat.history = normalizedHistory(input.history, state.active.layer.key);
    const handlers = input.handlers ?? {};
    const wrappedHandlers = {
      ...handlers,
      onPanelOpenChange({ open, source } = {}) {
        state.chat.panel.panelOpen = open === true;
        if (open === true && source === "build-action") {
          state.workspace.expanded = false;
          state.chat.panel.historyOpen = false;
          bootstrapController?.syncWorkspaceToggle({ refresh: false });
        }
        syncPanelOpenState();
        handlers.onPanelOpenChange?.({ open, source });
        syncHistoryDock();
        syncHeaderLayerSelector();
        syncSecondaryHeader();
      },
      onHistoryOpenChange({ open } = {}) {
        state.chat.panel.historyOpen = open === true;
        handlers.onHistoryOpenChange?.({ open });
        syncHistoryDock();
        syncHeaderLayerSelector();
        syncSecondaryHeader();
      },
    };

    chatController?.destroy?.();
    clearChatWorkspaceConversationIndex(mount.querySelector("[data-chat-workspace-history-dock]"));
    renderConversationPanel(chatMount, {
      config: input.config ?? createBuildConversationPanelConfig({ tools: [] }),
      history: state.chat.history,
      messages: state.chat.messages,
      ref,
    });
    syncPanelOpenState();
    chatController = createConversationPanelController(chatMount, {
      config: input.config ?? createBuildConversationPanelConfig({ tools: [] }),
      handlers: wrappedHandlers,
      history: state.chat.history,
      messages: state.chat.messages,
      ref,
    });
    bootstrapController?.installWorkspaceToggle();
    installWorkspaceHistoryIconButton();
    syncLayerToolbar();
    syncHistoryDock();
    syncHeaderLayerSelector();
    syncSecondaryHeader();
  }

  function installWorkspaceHistoryIconButton() {
    const chatMount = mount.querySelector("[data-chat-workspace-chat-mount]");
    if (!(chatMount instanceof HTMLElement)) {
      return;
    }
    const historyToggle = chatMount.querySelector("[data-build-work-panel-history-toggle]");
    if (!(historyToggle instanceof HTMLButtonElement)) {
      return;
    }
    const labelText = state.chat.panel.historyOpen === false ? "Show history" : "Hide history";
    historyToggle.className = "icon-button tooltip-anchor";
    historyToggle.dataset.tooltip = labelText;
    historyToggle.setAttribute("aria-label", labelText);
    historyToggle.innerHTML = iconButtonGlyph("index");
  }

  function render() {
    if (!(mount instanceof HTMLElement)) {
      return;
    }
    mount.innerHTML = renderShellScaffold({ title });
    const shell = mount.querySelector("[data-chat-workspace-shell]");
    const chatMount = mount.querySelector("[data-chat-workspace-chat-mount]");
    const workspaceMain = mount.querySelector("[data-chat-workspace-main]");
    const historyDock = mount.querySelector("[data-chat-workspace-history-dock]");

    bootstrapController = createChatWorkspaceBootstrap({
      activeState: state.active,
      chatMount,
      chatState: state.chat,
      documentRef: document,
      getEntityWorkspace() {
        return mount.querySelector("[data-chat-workspace-entity-workspace]");
      },
      historyDock,
      iconButtonMarkup: iconButtonGlyph("project"),
      mountChatPanel,
      renderEntityWorkspace,
      runActionEffects(target, workspaceEffectHandlers) {
        const actions = resolveChatWorkspaceClickActions(target, { workspaceState: state.workspace });
        for (const action of actions) {
          if (action.type === "select-layer") {
            const result = runChatWorkspaceActionEffects(action, {
              ...workspaceEffectHandlers,
              "sync-layer": () => syncLayerMode(action.layerKey),
            });
            if (result.stopped) {
              return true;
            }
            continue;
          }
          const result = runChatWorkspaceActionEffects(action, workspaceEffectHandlers);
          if (action.type === "toggle-layer-selector" || action.type === "close-layer-selector") {
            syncSecondaryHeader();
          }
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
      workspaceState: state.workspace,
    });

    bootstrapController.initialize({
      onRefreshWorkspace: refreshEntityWorkspaceAfterLayout,
      onSyncHeader: syncHeaderLayerSelector,
      onSyncHistoryDock: syncHistoryDock,
      onSyncHistoryIcon: installWorkspaceHistoryIconButton,
      onSyncSecondaryHeader: syncSecondaryHeader,
    });
  }

  render();

  return {
    destroy() {
      chatController?.destroy?.();
      window.clearTimeout(workspaceRefreshTimer);
      mount.replaceChildren();
    },
    render,
    state,
    sync() {
      mountChatPanel();
    },
  };
}
