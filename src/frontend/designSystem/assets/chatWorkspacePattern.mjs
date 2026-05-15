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
        key: "product-discovery-package",
        label: "Product Discovery Package",
        rows: [
          ["PD-001", "Delivery-ready packet", "Ready for delivery", "3 linked stories"],
          ["PD-002", "Discovery signoff trail", "Ready for review", "Approval visible"],
          ["PD-003", "Packet release note", "Ready for deploy", "Handoff ready"],
        ],
      },
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

const layerDefaults = {
  discovery: {
    entity: "questions",
    tool: "conversations",
    history: [
      ["chat-workspace-discovery-history", "Discovery chat history", "Active discovery thread, open questions, and packet context."],
      ["chat-workspace-build-panel", "Build panel MVP", "Workspace pattern review with active discovery, design, and delivery layers."],
      ["chat-workspace-pdf-export", "PDF export journey", "Packet export behavior, completed download states, and history continuity."],
    ],
  },
  design: {
    entity: "architecture-questions",
    tool: "conversations",
    history: [
      ["chat-workspace-product-discovery", "Product Discovery", "Approved packet context for architecture and design questions."],
      ["chat-workspace-architecture-review", "Architecture review", "Open architecture decisions for the workspace pattern."],
      ["chat-workspace-design-review", "Design review", "Design-system review notes and component adoption posture."],
    ],
  },
  delivery: {
    entity: "stories",
    tool: "stories",
    history: [
      ["chat-workspace-epics", "Epics", "Delivery epic context and sequencing for the expanded workspace."],
      ["chat-workspace-stories", "Stories", "Story breakdown and acceptance notes for the active delivery lane."],
      ["chat-workspace-tasks", "Tasks", "Task-level delivery follow-up and implementation checkpoints."],
    ],
  },
};

function getLayerDefaultEntity(layer) {
  return layer.entities.find((entity) => entity.key === layerDefaults[layer.key]?.entity) ?? layer.entities[0];
}

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
  tool: layerDefaults.discovery.tool,
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
let workspaceDrawerObserver = null;

const layerIconPaths = {
  discovery: "M12 3a7 7 0 0 0-4 12.75V18h8v-2.25A7 7 0 0 0 12 3zm0 2a5 5 0 0 1 2.6 9.27l-.6.36V16h-4v-1.37l-.6-.36A5 5 0 0 1 12 5zm-3 15h6v2H9z",
  design: "M5 4h10l4 4v12H5zm2 2v12h10V9h-3V6zm2 4h6v2H9zm0 4h4v2H9zM16 4l4 4h-4z",
  delivery: "M4 5h10v2H6v10h10v-8h2v10H4zm12.6-.4L20 8l-8.5 8.5-4-4L9 11l2.5 2.5z",
};

const workspaceToolIcons = {
  conversations: "M4 5h16v10H8l-4 4zm4 4h8v2H8z",
  "product-discovery-package": "M6 3h9l3 3v15H6zm8 1.5V7h2.5zM8 10h8v2H8zm0 4h8v2H8z",
  questions: "M12 4a6 6 0 0 0-6 6h2a4 4 0 1 1 5.2 3.82L12 14.3V17h2v-1.35A6 6 0 0 0 12 4zm-1 15h2v2h-2z",
  "architecture-questions": "M4 20h16v-2H4zm2-4h12v-2H6zm1-4h10l-5-7z",
  "design-questions": "M6 4h12v16H6zm2 2v12h8V6zm2 2h4v2h-4zm0 4h4v2h-4z",
  epics: "M4 5h16v4H4zm0 6h16v8H4zm3 2v4h3v-4z",
  stories: "M5 4h14v16H5zm2 3h10v2H7zm0 4h10v2H7zm0 4h6v2H7z",
  tasks: "M5 5h14v14H5zm3 4 2 2 4-4 1.4 1.4L10 13.8 6.6 10.4zm0 6h8v2H8z",
};

const layerWorkspaceTools = {
  discovery: [
    { key: "conversations", label: "Conversations" },
    { key: "questions", label: "Questions", entity: "questions" },
  ],
  design: [
    { key: "conversations", label: "Conversations" },
    { key: "architecture-questions", label: "Architecture Questions", entity: "architecture-questions" },
    { key: "design-questions", label: "Design Questions", entity: "design-questions" },
  ],
  delivery: [
    { key: "product-discovery-package", label: "Product Discovery Package", entity: "product-discovery-package" },
    { key: "epics", label: "Epics", entity: "epics" },
    { key: "stories", label: "Stories", entity: "stories" },
    { key: "tasks", label: "Tasks", entity: "tasks" },
  ],
};

const workspaceControlIcons = {
  project: "M5 5h14v14H5zM5 9h14M9 5v14",
  index: "M8 6h11M8 12h11M8 18h11M5 6h.01M5 12h.01M5 18h.01",
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
  const nextLayer = layers.find((layer) => layer.key === mode);
  if (!nextLayer) {
    return;
  }
  chatState.activeMode = mode;
  activeState.layer = nextLayer;
  activeState.entity = getLayerDefaultEntity(nextLayer);
  activeState.tool = layerDefaults[nextLayer.key]?.tool ?? "conversations";
  chatState.history = getLayerHistory(nextLayer.key);
  chatState.panel.historyOpen = workspaceState.expanded;
  chatState.panel.historyView = "active";
  chatState.panel.copyNotice = "";
  chatState.panel.renameConversationId = null;
  chatState.panel.showArchiveUndo = false;
  chatState.archivedConversation = null;
  workspaceState.drawer = { open: false, row: null };
  workspaceState.entityDrawerOpen = false;
  workspaceState.layerDrawerOpen = false;
  renderEntityWorkspace();
  syncSecondaryHeader();
  syncLayerToolbar();
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

function getEntityItemCount(entity, layer = activeState.layer) {
  return getStatusItems(entity).reduce((total, status) => total + Number(status.count ?? 0), 0);
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

function getWorkspaceDrawerRowFromElement(row) {
  const title = row.querySelector("strong")?.textContent?.trim() ?? "Selected workspace item";
  const status = row.querySelector("span:not(.floating-tab-row-marker)")?.textContent?.trim() ?? "Status";
  const note = row.querySelector("small")?.textContent?.trim() ?? "Workspace detail";
  return {
    key: `${activeState.layer.key}:${activeState.entity.key}:${title}`,
    title,
    status,
    note,
    entity: activeState.entity.label,
    layer: activeState.layer.label,
  };
}

function renderWorkspaceListDrawer(entityWorkspace) {
  const panel = entityWorkspace.querySelector(".floating-tab-list-panel");
  const list = entityWorkspace.querySelector(".floating-tab-list");
  if (!(panel instanceof HTMLElement) || !(list instanceof HTMLElement)) {
    return;
  }

  let drawer = entityWorkspace.querySelector("[data-chat-workspace-list-drawer]");
  if (!(drawer instanceof HTMLElement)) {
    drawer = document.createElement("aside");
    drawer.className = "chat-workspace-list-drawer";
    drawer.dataset.chatWorkspaceListDrawer = "";
    drawer.setAttribute("aria-label", "Workspace item detail");
    panel.append(drawer);
  }

  const selected = workspaceState.drawer.open ? workspaceState.drawer.row : null;
  entityWorkspace.dataset.chatWorkspaceDrawerOpen = selected ? "true" : "false";
  drawer.hidden = !selected;
  if (!selected) {
    drawer.replaceChildren();
    return;
  }

  drawer.innerHTML = `
    <div class="chat-workspace-list-drawer-header">
      <div>
        <p>${escapeHtml(selected.entity)}</p>
        <h4>${escapeHtml(selected.title)}</h4>
      </div>
      <button class="icon-button" type="button" aria-label="Close item detail" data-chat-workspace-list-drawer-close>
        <span class="icon-button-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </span>
      </button>
    </div>
    <dl class="chat-workspace-list-drawer-meta">
      <div>
        <dt>Layer</dt>
        <dd>${escapeHtml(selected.layer)}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>${escapeHtml(selected.status)}</dd>
      </div>
      <div>
        <dt>Signal</dt>
        <dd>${escapeHtml(selected.note)}</dd>
      </div>
    </dl>
    <div class="chat-workspace-list-drawer-body">
      <p>This drawer is reserved for the selected build item preview. Logic and real workspace data stay deferred.</p>
    </div>
  `;
}

function syncWorkspaceListHeader(entityWorkspace) {
  const header = entityWorkspace.querySelector(".floating-tab-list-header");
  const tabHeader = entityWorkspace.querySelector(".floating-tab-header");
  if (!(header instanceof HTMLElement) || !(tabHeader instanceof HTMLElement)) {
    return;
  }

  header.classList.add("chat-workspace-list-header-bar");
  if (header.previousElementSibling !== tabHeader) {
    entityWorkspace.insertBefore(header, tabHeader);
  }
}

function renderWorkspaceEntitySelector(entityWorkspace) {
  const mount = document.querySelector("[data-chat-workspace-secondary-list]");
  if (!(mount instanceof HTMLElement)) {
    return;
  }

  const legacyDrawer = entityWorkspace.querySelector("[data-chat-workspace-entity-drawer]");
  legacyDrawer?.remove();

  const trigger = mount.querySelector("[data-chat-workspace-entity-selector-trigger]");
  if (trigger instanceof HTMLElement) {
    trigger.setAttribute("aria-expanded", workspaceState.entityDrawerOpen ? "true" : "false");
  }

  let selector = mount.querySelector("[data-chat-workspace-entity-selector-options]");
  if (!(selector instanceof HTMLElement)) {
    selector = document.createElement("div");
    selector.className = "chat-workspace-entity-selector-options";
    selector.dataset.chatWorkspaceEntitySelectorOptions = "";
    selector.setAttribute("role", "listbox");
    selector.setAttribute("aria-label", `${activeState.layer.label} entities`);
    mount.append(selector);
  }

  entityWorkspace.dataset.chatWorkspaceEntitySelectorOpen = workspaceState.entityDrawerOpen ? "true" : "false";
  selector.classList.toggle("is-open", workspaceState.entityDrawerOpen);
  selector.hidden = !workspaceState.entityDrawerOpen;
  if (!workspaceState.entityDrawerOpen) {
    selector.replaceChildren();
    return;
  }

  selector.innerHTML = `
    ${activeState.layer.entities.map((entity) => `
      <button
        class="chat-workspace-entity-option${entity.key === activeState.entity.key ? " is-active" : ""}"
        type="button"
        role="option"
        aria-selected="${entity.key === activeState.entity.key ? "true" : "false"}"
        data-chat-workspace-entity-option="${escapeHtml(entity.key)}"
      >
        <span>${escapeHtml(entity.label)}</span>
        <small>${escapeHtml(getEntityItemCount(entity, activeState.layer))} entities</small>
      </button>
    `).join("")}
  `;
}

function syncWorkspaceListRows(entityWorkspace) {
  syncWorkspaceListHeader(entityWorkspace);
  syncSecondaryHeader();
  renderWorkspaceEntitySelector(entityWorkspace);
  const rows = Array.from(entityWorkspace.querySelectorAll(".floating-tab-row"));
  rows.forEach((row) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const rowState = getWorkspaceDrawerRowFromElement(row);
    const selected = workspaceState.drawer.open && workspaceState.drawer.row?.key === rowState.key;
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-pressed", selected ? "true" : "false");
    row.dataset.chatWorkspaceListRow = "";
    row.classList.toggle("is-selected", selected);
  });
  renderWorkspaceListDrawer(entityWorkspace);
}

function selectWorkspaceEntity(entityWorkspace, nextEntity) {
  if (!nextEntity) {
    return;
  }

  activeState.entity = nextEntity;
  activeState.tool = getActiveLayerTools().find((tool) => tool.entity === nextEntity.key)?.key ?? activeState.tool;
  workspaceState.drawer = { open: false, row: null };
  const categoryButton = entityWorkspace.querySelector(`[data-floating-tab-category="${CSS.escape(nextEntity.key)}"]`);
  if (categoryButton instanceof HTMLElement) {
    categoryButton.dispatchEvent(new MouseEvent("click", { bubbles: false, cancelable: true }));
  }
  const kicker = entityWorkspace.querySelector(".floating-tab-project-kicker");
  if (kicker instanceof HTMLElement) {
    kicker.textContent = nextEntity.label;
  }
  syncSecondaryHeader();
  syncWorkspaceListRows(entityWorkspace);
  syncLayerToolbar();
}

function getActiveLayerTools() {
  return layerWorkspaceTools[activeState.layer.key] ?? [];
}

function selectWorkspaceTool(toolKey) {
  const tool = getActiveLayerTools().find((item) => item.key === toolKey);
  if (!tool) {
    return;
  }

  activeState.tool = tool.key;
  workspaceState.drawer = { open: false, row: null };
  workspaceState.entityDrawerOpen = false;

  if (tool.key === "conversations") {
    chatState.panel.historyOpen = true;
    syncWorkspaceToggle({ refresh: false });
    syncLayerToolbar();
    return;
  }

  const nextEntity = activeState.layer.entities.find((entity) => entity.key === tool.entity);
  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (nextEntity && entityWorkspace instanceof HTMLElement) {
    selectWorkspaceEntity(entityWorkspace, nextEntity);
  }
  syncLayerToolbar();
}

function installWorkspaceListDrawer(entityWorkspace) {
  if (!(entityWorkspace instanceof HTMLElement)) {
    return;
  }

  if (entityWorkspace.dataset.chatWorkspaceDrawerInstalled !== "true") {
    entityWorkspace.dataset.chatWorkspaceDrawerInstalled = "true";
    entityWorkspace.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const entityOption = target?.closest("[data-chat-workspace-entity-option]");
      if (entityOption instanceof HTMLElement) {
        event.stopPropagation();
        const nextEntity = activeState.layer.entities.find((entity) => entity.key === entityOption.dataset.chatWorkspaceEntityOption);
        if (nextEntity) {
          selectWorkspaceEntity(entityWorkspace, nextEntity);
        }
        workspaceState.entityDrawerOpen = false;
        syncWorkspaceListRows(entityWorkspace);
        return;
      }

      if (target?.closest("[data-chat-workspace-entity-selector-trigger]")) {
        workspaceState.entityDrawerOpen = !workspaceState.entityDrawerOpen;
        workspaceState.drawer = { open: false, row: null };
        syncWorkspaceListRows(entityWorkspace);
        return;
      }

      if (
        workspaceState.entityDrawerOpen
        && !target?.closest("[data-chat-workspace-entity-selector-options]")
        && !target?.closest("[data-chat-workspace-entity-selector-trigger]")
      ) {
        workspaceState.entityDrawerOpen = false;
        syncWorkspaceListRows(entityWorkspace);
      }

      if (target?.closest("[data-chat-workspace-list-drawer-close]")) {
        workspaceState.drawer = { open: false, row: null };
        syncWorkspaceListRows(entityWorkspace);
        return;
      }

      const row = target?.closest("[data-chat-workspace-list-row], .floating-tab-row");
      if (row instanceof HTMLElement) {
        workspaceState.drawer = {
          open: true,
          row: getWorkspaceDrawerRowFromElement(row),
        };
        syncWorkspaceListRows(entityWorkspace);
      }
    });
    entityWorkspace.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && workspaceState.entityDrawerOpen) {
        event.preventDefault();
        workspaceState.entityDrawerOpen = false;
        syncWorkspaceListRows(entityWorkspace);
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("[data-chat-workspace-entity-selector-trigger]")) {
        event.preventDefault();
        workspaceState.entityDrawerOpen = !workspaceState.entityDrawerOpen;
        workspaceState.drawer = { open: false, row: null };
        syncWorkspaceListRows(entityWorkspace);
        return;
      }

      const row = target?.closest("[data-chat-workspace-list-row], .floating-tab-row");
      if (row instanceof HTMLElement) {
        event.preventDefault();
        workspaceState.drawer = {
          open: true,
          row: getWorkspaceDrawerRowFromElement(row),
        };
        syncWorkspaceListRows(entityWorkspace);
      }
    });
  }

  workspaceDrawerObserver?.disconnect();
  const list = entityWorkspace.querySelector(".floating-tab-list");
  if (list instanceof HTMLElement) {
    workspaceDrawerObserver = new MutationObserver(() => {
      window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
    });
    workspaceDrawerObserver.observe(list, { childList: true });
  }

  syncWorkspaceListRows(entityWorkspace);
}

document.addEventListener("click", (event) => {
  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (!(entityWorkspace instanceof HTMLElement) || !workspaceState.entityDrawerOpen) {
    return;
  }

  const target = event.target instanceof Element ? event.target : null;
  if (
    target
    && (
      entityWorkspace.contains(target)
      || target.closest("[data-chat-workspace-entity-selector-options]")
      || target.closest("[data-chat-workspace-entity-selector-trigger]")
    )
  ) {
    return;
  }

  workspaceState.entityDrawerOpen = false;
  syncWorkspaceListRows(entityWorkspace);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !workspaceState.entityDrawerOpen) {
    return;
  }

  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (!(entityWorkspace instanceof HTMLElement)) {
    return;
  }

  workspaceState.entityDrawerOpen = false;
  syncWorkspaceListRows(entityWorkspace);
});

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
    initialParams: new URLSearchParams(`layout=horizontal&tabs=10&category=${encodeURIComponent(activeState.entity.key)}&categorySwitch=false&expandable=false&subTabs=off&attention=on`),
    displayRoot: document.querySelector("[data-chat-workspace-shell]") ?? document.documentElement,
    onCategoryChange({ category }) {
      activeState.entity = activeState.layer.entities.find((entity) => entity.key === category) ?? activeState.layer.entities[0];
      workspaceState.drawer = { open: false, row: null };
      window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
    },
    onTabChange() {
      workspaceState.drawer = { open: false, row: null };
      workspaceState.entityDrawerOpen = false;
      window.requestAnimationFrame(() => syncWorkspaceListRows(entityWorkspace));
    },
  });
  installWorkspaceListDrawer(entityWorkspace);
}

function refreshEntityWorkspaceAfterLayout() {
  window.clearTimeout(workspaceRefreshTimer);
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
    const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
    if (entityWorkspace instanceof HTMLElement) {
      syncWorkspaceListRows(entityWorkspace);
    }
    workspaceRefreshTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      const refreshedWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
      if (refreshedWorkspace instanceof HTMLElement) {
        syncWorkspaceListRows(refreshedWorkspace);
      }
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
const historyDock = document.querySelector("[data-chat-workspace-history-dock]");

if (shell instanceof HTMLElement) {
  applyRequestDisplayState(shell);
}

if (!workspaceState.expanded) {
  chatState.panel.historyOpen = false;
}

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
  if (shell instanceof HTMLElement) {
    shell.dataset.chatWorkspaceExpanded = workspaceState.expanded ? "true" : "false";
    shell.dataset.chatWorkspaceHistoryOpen = chatState.panel.historyOpen === false ? "false" : "true";
  }

  if (workspaceMain instanceof HTMLElement) {
    workspaceMain.setAttribute("aria-hidden", workspaceState.expanded ? "false" : "true");
    workspaceMain.inert = !workspaceState.expanded;
  }

  document.querySelectorAll("[data-chat-workspace-toggle]").forEach((toggle) => {
    if (toggle instanceof HTMLButtonElement) {
      const labelText = workspaceState.expanded ? "Collapse workspace" : "Expand workspace";
      toggle.setAttribute("aria-expanded", workspaceState.expanded ? "true" : "false");
      toggle.setAttribute("aria-label", labelText);
      toggle.dataset.tooltip = labelText;
      const label = toggle.querySelector("[data-chat-workspace-toggle-label]");
      if (label instanceof HTMLElement) {
        label.textContent = labelText;
      }
    }
  });

  document.querySelectorAll("[data-chat-workspace-history-toggle]").forEach((toggle) => {
    if (toggle instanceof HTMLButtonElement) {
      const historyOpen = chatState.panel.historyOpen !== false;
      const labelText = historyOpen ? "Hide history" : "Show history";
      toggle.setAttribute("aria-expanded", historyOpen ? "true" : "false");
      toggle.setAttribute("aria-label", labelText);
      toggle.dataset.tooltip = labelText;
      const label = toggle.querySelector("[data-chat-workspace-history-toggle-label]");
      if (label instanceof HTMLElement) {
        label.textContent = labelText;
      }
    }
  });

  if (refresh && workspaceState.expanded) {
    refreshEntityWorkspaceAfterLayout();
  }

  installWorkspaceHistoryIconButton();
  syncHistoryDock();
  syncSecondaryHeader();
}

function renderLayerSelectorMarkup() {
  return `
    <div class="chat-workspace-layer-selector" data-chat-workspace-layer-selector>
      <button
        class="chat-workspace-layer-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="${workspaceState.layerDrawerOpen ? "true" : "false"}"
        data-chat-workspace-layer-trigger
      >
        <span>
          <small>Layer</small>
          <strong>${escapeHtml(activeState.layer.label)}</strong>
        </span>
        <span class="chat-workspace-layer-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m7 9 5 5 5-5" /></svg>
        </span>
      </button>
      <div class="chat-workspace-layer-options${workspaceState.layerDrawerOpen ? " is-open" : ""}" role="listbox" aria-label="Workspace layer" data-chat-workspace-layer-options>
        ${layers.map((layer) => `
          <button
            class="chat-workspace-layer-option${layer.key === activeState.layer.key ? " is-active" : ""}"
            type="button"
            role="option"
            aria-selected="${layer.key === activeState.layer.key ? "true" : "false"}"
            data-chat-workspace-layer-option="${escapeHtml(layer.key)}"
          >
            <span>${escapeHtml(layer.label)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderEntitySelectorTriggerMarkup() {
  return `
    <button
      class="chat-workspace-entity-trigger-card"
      type="button"
      aria-haspopup="listbox"
      aria-expanded="${workspaceState.entityDrawerOpen ? "true" : "false"}"
      data-chat-workspace-entity-selector-trigger
    >
      <span class="floating-tab-project-kicker">${escapeHtml(activeState.entity.label)}</span>
      <span class="chat-workspace-entity-trigger-icon" aria-hidden="true" data-chat-workspace-entity-trigger-icon>
        <svg viewBox="0 0 24 24" focusable="false"><path d="m7 9 5 5 5-5" /></svg>
      </span>
    </button>
  `;
}

function syncSecondaryHeader() {
  const header = document.querySelector("[data-chat-workspace-joint-header]");
  if (!(header instanceof HTMLElement)) {
    return;
  }

  const historyOpen = chatState.panel.historyOpen !== false;
  const chatTitle = getActiveChatTitle();
  header.dataset.chatWorkspaceSecondaryHistoryOpen = historyOpen ? "true" : "false";
  header.innerHTML = `
    ${workspaceState.expanded || historyOpen ? `
      <section class="chat-workspace-secondary-section chat-workspace-secondary-index" data-chat-workspace-secondary-index>
        ${workspaceState.expanded ? renderLayerSelectorMarkup() : `
          <div>
            <p class="top-nav-preview-eyebrow">Index</p>
            <h2>Conversation history</h2>
          </div>
        `}
        <button class="icon-button tooltip-anchor" type="button" aria-label="Close conversation index" data-tooltip="Close conversation index" data-chat-workspace-history-close>
          ${iconButtonGlyph("index")}
        </button>
      </section>
    ` : ""}
    ${workspaceState.expanded ? `
      <section class="chat-workspace-secondary-section chat-workspace-secondary-list" data-chat-workspace-secondary-list>
        ${renderEntitySelectorTriggerMarkup()}
        <span class="floating-tab-panel-count">${escapeHtml(getEntityItemCount(activeState.entity, activeState.layer))} records</span>
      </section>
    ` : ""}
    <section class="chat-workspace-secondary-section chat-workspace-secondary-chat" data-chat-workspace-secondary-chat>
      <button
        class="chat-workspace-chat-title-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="${historyOpen ? "true" : "false"}"
        data-chat-workspace-chat-selector-toggle
      >
        <span>
          <small>Chat</small>
          <strong>${escapeHtml(chatTitle)}</strong>
        </span>
        <span class="chat-workspace-layer-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m7 9 5 5 5-5" /></svg>
        </span>
      </button>
      <div class="build-work-panel-demo-header-actions">
        <button class="icon-button tooltip-anchor" type="button" data-chat-workspace-toggle aria-controls="chat-workspace-main" aria-expanded="${workspaceState.expanded ? "true" : "false"}" aria-label="${workspaceState.expanded ? "Collapse workspace" : "Expand workspace"}" data-tooltip="${workspaceState.expanded ? "Collapse workspace" : "Expand workspace"}">
          ${iconButtonGlyph("project")}
        </button>
        <button class="build-work-panel-demo-close" type="button" data-chat-workspace-close aria-label="Close chat panel">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z" /></svg>
        </button>
      </div>
    </section>
  `;
  const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
  if (entityWorkspace instanceof HTMLElement) {
    renderWorkspaceEntitySelector(entityWorkspace);
  }
}

function syncHistoryDock() {
  if (!(chatMount instanceof HTMLElement) || !(historyDock instanceof HTMLElement)) {
    return;
  }

  const panelBody = chatMount.querySelector(".build-work-panel-demo-body");
  const chatColumn = chatMount.querySelector(".build-work-panel-demo-chat-column");
  const dockedHistory = historyDock.querySelector(".build-work-panel-demo-history");

  if (chatState.panel.historyOpen === false) {
    if (panelBody instanceof HTMLElement && chatColumn instanceof HTMLElement && dockedHistory instanceof HTMLElement) {
      panelBody.insertBefore(dockedHistory, chatColumn);
    }
    return;
  }

  const history = dockedHistory ?? chatMount.querySelector(".build-work-panel-demo-history");
  if (history instanceof HTMLElement) {
    historyDock.append(history);
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
  toggle.className = "icon-button tooltip-anchor";
  toggle.type = "button";
  toggle.dataset.chatWorkspaceToggle = "";
  toggle.dataset.tooltip = "Expand workspace";
  toggle.setAttribute("aria-controls", "chat-workspace-main");
  toggle.setAttribute("aria-label", "Expand workspace");
  toggle.innerHTML = iconButtonGlyph("project");
  headerActions.prepend(toggle);
  syncWorkspaceToggle();
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

if (shell instanceof HTMLElement) {
  shell.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const layerTrigger = target?.closest("[data-chat-workspace-layer-trigger]");
    if (layerTrigger instanceof HTMLElement) {
      workspaceState.layerDrawerOpen = !workspaceState.layerDrawerOpen;
      syncSecondaryHeader();
      return;
    }

    const layerOption = target?.closest("[data-chat-workspace-layer-option]");
    if (layerOption instanceof HTMLElement) {
      syncLayerMode(layerOption.dataset.chatWorkspaceLayerOption ?? "");
      chatState.panel.panelOpen = true;
      mountChatPanel();
      return;
    }

    if (
      workspaceState.layerDrawerOpen
      && !target?.closest("[data-chat-workspace-layer-selector]")
    ) {
      workspaceState.layerDrawerOpen = false;
      syncSecondaryHeader();
    }

    const entityWorkspace = document.querySelector("[data-chat-workspace-entity-workspace]");
    const entityOption = target?.closest("[data-chat-workspace-entity-option]");
    if (entityOption instanceof HTMLElement && entityWorkspace instanceof HTMLElement) {
      const nextEntity = activeState.layer.entities.find((entity) => entity.key === entityOption.dataset.chatWorkspaceEntityOption);
      if (nextEntity) {
        selectWorkspaceEntity(entityWorkspace, nextEntity);
      }
      workspaceState.entityDrawerOpen = false;
      syncWorkspaceListRows(entityWorkspace);
      return;
    }

    const entityTrigger = target?.closest("[data-chat-workspace-entity-selector-trigger]");
    if (entityTrigger instanceof HTMLElement && entityWorkspace instanceof HTMLElement) {
      workspaceState.entityDrawerOpen = !workspaceState.entityDrawerOpen;
      workspaceState.drawer = { open: false, row: null };
      syncWorkspaceListRows(entityWorkspace);
      return;
    }

    const toggle = target?.closest("[data-chat-workspace-toggle]");
    if (toggle instanceof HTMLElement) {
      workspaceState.expanded = !workspaceState.expanded;
      chatState.panel.historyOpen = workspaceState.expanded;
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

    const chatSelectorToggle = target?.closest("[data-chat-workspace-chat-selector-toggle]");
    if (chatSelectorToggle instanceof HTMLElement) {
      chatState.panel.historyOpen = true;
      syncWorkspaceToggle({ refresh: workspaceState.expanded });
      mountChatPanel();
      return;
    }

    const historyClose = target?.closest("[data-chat-workspace-history-close]");
    if (historyClose instanceof HTMLElement) {
      chatState.panel.historyOpen = false;
      syncWorkspaceToggle({ refresh: workspaceState.expanded });
      mountChatPanel();
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

  shell.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !workspaceState.layerDrawerOpen) {
      return;
    }
    workspaceState.layerDrawerOpen = false;
    syncSecondaryHeader();
  });
}

function mountChatPanel() {
  if (!(chatMount instanceof HTMLElement)) {
    return;
  }

  chatController?.destroy?.();
  if (historyDock instanceof HTMLElement) {
    historyDock.replaceChildren();
  }
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
        chatState.messages = [
          {
            author: "Harness",
            text: "New chat started. Tell me what you want to shape next.",
          },
        ];
        chatState.panel.packetState = "none";
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
  installWorkspaceHistoryIconButton();
  syncLayerToolbar();
  syncHistoryDock();
  syncSecondaryHeader();
}

if (chatMount instanceof HTMLElement) {
  mountChatPanel();
}

renderEntityWorkspace();
syncWorkspaceToggle();
