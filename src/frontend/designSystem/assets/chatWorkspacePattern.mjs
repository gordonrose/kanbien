import {
  createBuildConversationPanelConfig,
  createConversationPanelController,
  getConversationPanelCanonicalRef,
} from "./conversationPanel.mjs";
import { mountFloatingTabHeader, renderFloatingTabHeader } from "./floatingTabHeader.mjs";

const layers = [
  {
    key: "discovery",
    label: "Discovery",
    entities: [
      {
        key: "product-discovery-package",
        label: "Product Discovery Package",
        rows: [
          ["PD-001", "Chat workspace pattern variant", "Draft review", "4 linked questions"],
          ["PD-002", "Organization domain foundation", "Needs steering", "2 decisions open"],
          ["PD-003", "Root admin build panel", "Signed off", "Packet ready"],
        ],
      },
      {
        key: "chat-session",
        label: "Chat Session",
        rows: [
          ["CS-014", "Workspace layout exploration", "Active", "12 messages"],
          ["CS-011", "Discovery handoff review", "Archived", "6 messages"],
          ["CS-006", "Build panel MVP", "Active", "Packet attached"],
        ],
      },
      {
        key: "questions",
        label: "Questions",
        rows: [
          ["Q-101", "Who uses this expanded workspace first?", "Answered", "Owner confirmed"],
          ["Q-102", "Which rows need first-class comparison?", "Open", "Design follow-up"],
          ["Q-103", "What should be visible before save?", "Open", "Needs review"],
        ],
      },
    ],
  },
  {
    key: "design",
    label: "Design",
    entities: [
      {
        key: "architecture-questions",
        label: "Architecture Questions",
        rows: [
          ["AQ-021", "Where does workspace state persist?", "Deferred", "Logic later"],
          ["AQ-022", "Which artifacts own entity rows?", "Open", "Planning seam"],
          ["AQ-023", "How does app adoption consume the pattern?", "Blocked", "Needs signoff"],
        ],
      },
      {
        key: "design-questions",
        label: "Design Questions",
        rows: [
          ["DQ-031", "Does the layer rail stay visible while rows scroll?", "Proposed", "Yes"],
          ["DQ-032", "How many entity tabs fit before overflow?", "Open", "Canonical later"],
          ["DQ-033", "What empty state belongs under each entity?", "Deferred", "Logic later"],
        ],
      },
    ],
  },
  {
    key: "delivery",
    label: "Delivery",
    entities: [
      {
        key: "epics",
        label: "Epics",
        rows: [
          ["EP-001", "Expanded chat workspace", "Draft", "3 stories"],
          ["EP-002", "Discovery artifact flow", "Planned", "5 stories"],
          ["EP-003", "Delivery task surface", "Backlog", "Unscoped"],
        ],
      },
      {
        key: "stories",
        label: "Stories",
        rows: [
          ["ST-014", "Switch between layers beside chat", "Ready", "Design-system first"],
          ["ST-015", "Browse build entities as row lists", "Ready", "Static demo"],
          ["ST-016", "Wire real workspace data", "Deferred", "Future logic"],
        ],
      },
      {
        key: "tasks",
        label: "Tasks",
        rows: [
          ["TK-101", "Create provisional pattern surface", "In progress", "Design system"],
          ["TK-102", "Add smoke coverage", "Ready", "Visual test"],
          ["TK-103", "Prepare behavior lock after signoff", "Blocked", "Needs review"],
        ],
      },
    ],
  },
];

const statusSets = {
  "product-discovery-package": ["Draft", "In Refinement", "Ready for Review", "Done"],
  "chat-session": ["In Progress", "Paused", "Complete", "Archived"],
  questions: ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
  "architecture-questions": ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
  "design-questions": ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
  epics: [
    "Draft",
    "Steering",
    "Blocked",
    "In Refinement",
    "Ready for Delivery",
    "In Delivery",
    "Ready for Review",
    "Ready for Deploy",
    "Deployed",
  ],
  stories: [
    "Draft",
    "Blocked",
    "In Refinement",
    "Ready for Review",
    "Task Breakdown",
    "Ready for Delivery",
    "Ready for Deploy",
    "Deployed",
  ],
  tasks: ["Draft", "Blocked", "In Refinement", "Ready for Review", "Ready for Delivery", "Ready for Deploy", "Deployed"],
};

const activeState = {
  layer: layers[0],
  entity: layers[0].entities[0],
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
  history: [
    {
      conversationId: "chat-workspace-build-panel",
      title: "Build panel MVP",
      summary: "Workspace pattern review with active discovery, design, and delivery layers.",
      archived: false,
    },
    {
      conversationId: "chat-workspace-pdf-export",
      title: "PDF export journey",
      summary: "Packet export behavior, completed download states, and history continuity.",
      archived: false,
    },
    {
      conversationId: "chat-workspace-archived-design",
      title: "Design-system blockers",
      summary: "Archived review notes for earlier workspace layout alternatives.",
      archived: true,
    },
  ],
  archivedConversation: null,
};

const workspaceState = {
  expanded: false,
};

let chatController = null;
let workspaceRefreshTimer = 0;

function getLayerModes() {
  return layers.map((layer) => ({
    key: layer.key,
    label: layer.label,
    icon: layer.key,
    active: layer.key === chatState.activeMode,
  }));
}

function syncLayerMode(mode) {
  const nextLayer = layers.find((layer) => layer.key === mode);
  if (!nextLayer) {
    return;
  }
  chatState.activeMode = mode;
  activeState.layer = nextLayer;
  activeState.entity = nextLayer.entities[0];
  renderEntityWorkspace();
}

function getStatusItems(entity) {
  return (statusSets[entity.key] ?? ["Draft", "In Progress", "Done"]).map((status, index) => ({
    key: `${entity.key}-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    label: status,
    meta: entity.label,
    count: Math.max(1, 4 - (index % 3)),
    attention: ["Blocked", "Ready for Review", "Ready for Deploy"].includes(status),
    rows: [
      [`${entity.key.slice(0, 2).toUpperCase()}-${String(index * 3 + 1).padStart(3, "0")}`, `${entity.label} ${status.toLowerCase()} item`, status, "Workspace preview"],
      [`${entity.key.slice(0, 2).toUpperCase()}-${String(index * 3 + 2).padStart(3, "0")}`, `${status} follow-up`, status, "Owner needed"],
      [`${entity.key.slice(0, 2).toUpperCase()}-${String(index * 3 + 3).padStart(3, "0")}`, `${entity.label} handoff`, status, "Next review"],
    ],
  }));
}

function toEntityStatusCategories(entities) {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.key,
      getStatusItems(entity).map((status) => [status.label, "Status", status.count, status.attention]),
    ]),
  );
}

function toEntityStatusRows(entities) {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.key,
      Object.fromEntries(
        getStatusItems(entity).map((status) => [
          status.label,
          status.rows.map(([id, title, rowStatus, note]) => [`${id} - ${title}`, rowStatus, note]),
        ]),
      ),
    ]),
  );
}

function toEntityCategoryMetadata(entities) {
  return Object.fromEntries(entities.map((entity) => [entity.key, [entity.label, "Build entity"]]));
}

function renderEntityWorkspace() {
  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (!(entityWorkspace instanceof HTMLElement)) {
    return;
  }

  const categories = toEntityStatusCategories(activeState.layer.entities);
  const rowsByLabel = toEntityStatusRows(activeState.layer.entities);
  const categoryMetadata = toEntityCategoryMetadata(activeState.layer.entities);
  entityWorkspace.innerHTML = renderFloatingTabHeader({
    instanceId: "chat-workspace-entity",
    categories,
    rowsByLabel,
    activeCategory: activeState.entity.key,
    activeIndex: 0,
    categoryMetadata,
    ariaLabel: `${activeState.layer.label} workspace statuses`,
    tablistLabel: `${activeState.layer.label} status tabs`,
    panelKicker: activeState.entity.label,
  });
  mountFloatingTabHeader({
    root: entityWorkspace,
    instanceId: "chat-workspace-entity",
    workspaceId: "chat-workspace-entity-workspace",
    categories,
    rowsByLabel,
    initialParams: new URLSearchParams(`layout=horizontal&tabs=10&category=${encodeURIComponent(activeState.entity.key)}&categorySwitch=true&expandable=false&subTabs=off&attention=on`),
    displayRoot: document.querySelector("[data-chat-workspace-shell]") ?? document.documentElement,
    onCategoryChange({ category }) {
      activeState.entity = activeState.layer.entities.find((entity) => entity.key === category) ?? activeState.layer.entities[0];
    },
  });
}

function refreshEntityWorkspaceAfterLayout() {
  window.clearTimeout(workspaceRefreshTimer);
  window.requestAnimationFrame(() => {
    renderEntityWorkspace();
    workspaceRefreshTimer = window.setTimeout(() => {
      renderEntityWorkspace();
    }, 190);
  });
}

function applyRequestDisplayState(root) {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");
  const direction = params.get("dir");
  const scale = params.get("scale");
  const expanded = params.get("expanded");

  if (theme === "dark") {
    root.dataset.themeScope = "dark";
  }
  if (direction === "rtl") {
    root.setAttribute("dir", "rtl");
  }
  if (scale) {
    root.style.setProperty("--ui-scale", String(Number(scale) / 100));
  }
  if (expanded === "true") {
    workspaceState.expanded = true;
  }
}

const shell = document.querySelector("[data-chat-workspace-shell]");
const chatMount = document.querySelector("[data-chat-workspace-chat-mount]");
const workspaceMain = document.querySelector("[data-chat-workspace-main]");
const layerToolbar = document.querySelector("[data-chat-workspace-layer-toolbar]");

if (shell instanceof HTMLElement) {
  applyRequestDisplayState(shell);
}

function syncLayerToolbar() {
  if (!(chatMount instanceof HTMLElement) || !(layerToolbar instanceof HTMLElement)) {
    return;
  }

  const sourceToolbar = chatMount.querySelector(".build-work-panel-demo-action-nav");
  if (!(sourceToolbar instanceof HTMLElement)) {
    return;
  }

  layerToolbar.innerHTML = sourceToolbar.innerHTML;
  layerToolbar.querySelectorAll("[data-build-work-panel-mode]").forEach((modeButton) => {
    modeButton.addEventListener("click", () => {
      if (!(modeButton instanceof HTMLElement) || modeButton.getAttribute("aria-disabled") === "true") {
        return;
      }
      syncLayerMode(modeButton.dataset.buildWorkPanelMode ?? "");
      chatState.panel.panelOpen = true;
      mountChatPanel();
    });
  });
}

function syncWorkspaceToggle({ refresh = false } = {}) {
  if (shell instanceof HTMLElement) {
    shell.dataset.chatWorkspaceExpanded = workspaceState.expanded ? "true" : "false";
  }

  if (workspaceMain instanceof HTMLElement) {
    workspaceMain.setAttribute("aria-hidden", workspaceState.expanded ? "false" : "true");
    workspaceMain.inert = !workspaceState.expanded;
  }

  document.querySelectorAll("[data-chat-workspace-toggle]").forEach((toggle) => {
    if (toggle instanceof HTMLButtonElement) {
      toggle.setAttribute("aria-expanded", workspaceState.expanded ? "true" : "false");
      toggle.setAttribute("aria-label", workspaceState.expanded ? "Collapse workspace" : "Expand workspace");
      const label = toggle.querySelector("[data-chat-workspace-toggle-label]");
      if (label instanceof HTMLElement) {
        label.textContent = workspaceState.expanded ? "Collapse" : "Expand";
      }
    }
  });

  document.querySelectorAll("[data-chat-workspace-history-toggle]").forEach((toggle) => {
    if (toggle instanceof HTMLButtonElement) {
      const historyOpen = chatState.panel.historyOpen !== false;
      toggle.setAttribute("aria-expanded", historyOpen ? "true" : "false");
      const label = toggle.querySelector("[data-chat-workspace-history-toggle-label]");
      if (label instanceof HTMLElement) {
        label.textContent = historyOpen ? "Hide history" : "Show history";
      }
    }
  });

  if (refresh && workspaceState.expanded) {
    refreshEntityWorkspaceAfterLayout();
  }
}

function installWorkspaceToggle() {
  if (!(chatMount instanceof HTMLElement)) {
    return;
  }

  const headerActions = chatMount.querySelector(".build-work-panel-demo-header-actions");
  if (!(headerActions instanceof HTMLElement) || headerActions.querySelector("[data-chat-workspace-toggle]")) {
    syncWorkspaceToggle();
    return;
  }

  const toggle = document.createElement("button");
  toggle.className = "build-work-panel-demo-history-toggle";
  toggle.type = "button";
  toggle.dataset.chatWorkspaceToggle = "";
  toggle.setAttribute("aria-controls", "chat-workspace-main");
  toggle.innerHTML = `<span data-chat-workspace-toggle-label></span>`;
  headerActions.prepend(toggle);
  syncWorkspaceToggle();
}

if (shell instanceof HTMLElement) {
  shell.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const toggle = target?.closest("[data-chat-workspace-toggle]");
    if (toggle instanceof HTMLElement) {
      workspaceState.expanded = !workspaceState.expanded;
      syncWorkspaceToggle({ refresh: true });
      return;
    }

    const historyToggle = target?.closest("[data-chat-workspace-history-toggle]");
    if (historyToggle instanceof HTMLElement) {
      const sourceHistoryToggle = chatMount instanceof HTMLElement ? chatMount.querySelector("[data-build-work-panel-history-toggle]") : null;
      if (sourceHistoryToggle instanceof HTMLButtonElement) {
        sourceHistoryToggle.click();
      }
      return;
    }

    const closeButton = target?.closest("[data-chat-workspace-close]");
    if (closeButton instanceof HTMLElement) {
      const sourceCloseButton = chatMount instanceof HTMLElement ? chatMount.querySelector("[data-build-work-panel-close]") : null;
      if (sourceCloseButton instanceof HTMLButtonElement) {
        sourceCloseButton.click();
      }
    }
  });
}

function mountChatPanel() {
  if (!(chatMount instanceof HTMLElement)) {
    return;
  }

  chatController?.destroy?.();
  chatController = createConversationPanelController(chatMount, {
    ref: chatState.panel,
    messages: chatState.messages,
    history: chatState.history,
    config: createBuildConversationPanelConfig({
      modes: getLayerModes(),
    }),
    handlers: {
      onModeSelect({ mode }) {
        syncLayerMode(mode);
        chatState.panel.panelOpen = true;
        mountChatPanel();
      },
      onPanelOpenChange({ open }) {
        chatState.panel.panelOpen = open;
      },
      onHistoryOpenChange({ open }) {
        chatState.panel.historyOpen = open;
        syncWorkspaceToggle();
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
        chatState.messages = [
          {
            author: "Harness",
            text: "New chat started. Tell me what you want to shape next.",
          },
        ];
        chatState.panel.copyNotice = "";
        chatState.panel.editMessageIndex = null;
        chatState.panel.replyToMessageIndex = null;
        mountChatPanel();
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
  syncLayerToolbar();
}

if (chatMount instanceof HTMLElement) {
  mountChatPanel();
}

renderEntityWorkspace();
syncWorkspaceToggle();
