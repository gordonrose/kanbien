import {
  createChatWorkspaceMockConsumerController,
  createChatWorkspaceMockConsumerState,
} from "./chatWorkspaceMockConsumer.mjs";
import { chatWorkspaceExpansionModes } from "./chatWorkspaceShellContract.mjs";
import {
  createBuildConversationPanelConfig,
  getConversationPanelCanonicalRef,
} from "./conversationPanel.mjs";

const recordManagementLayers = Object.freeze([
  {
    key: "discovery",
    label: "Parent 1",
    layerKind: "parent",
    layerEntityLabel: "Intake Requests",
    layerSummary: "Intake Requests",
    defaultEntity: "questions",
    defaultTool: "questions",
    entities: Object.freeze([
      { key: "product-discovery-package", label: "Record Packets" },
      { key: "chat-session", label: "Review Threads" },
      { key: "questions", label: "Intake Requests" },
    ]),
  },
  {
    key: "design",
    label: "Parent 2",
    layerKind: "parent",
    layerEntityLabel: "Policy Checks",
    layerSummary: "Policy Checks",
    defaultEntity: "architecture-questions",
    defaultTool: "architecture-questions",
    entities: Object.freeze([
      { key: "architecture-questions", label: "Policy Checks" },
      { key: "design-questions", label: "Data Quality Checks" },
    ]),
  },
  {
    key: "delivery",
    label: "Current",
    layerKind: "current",
    layerEntityLabel: "Managed Records",
    layerSummary: "Managed Records",
    defaultEntity: "stories",
    defaultTool: "stories",
    entities: Object.freeze([
      { key: "product-discovery-package", label: "Record Packets" },
      { key: "epics", label: "Case Groups" },
      { key: "stories", label: "Managed Records" },
      { key: "tasks", label: "Follow-up Tasks" },
    ]),
  },
  {
    key: "child-1",
    label: "Child 1",
    layerKind: "child",
    layerEntityLabel: "Child Records",
    layerSummary: "18 records",
    defaultEntity: "child-one-records",
    defaultTool: "child-one-records",
    entities: Object.freeze([
      { key: "child-one-records", label: "Child Records" },
      { key: "child-one-tasks", label: "Child Tasks" },
    ]),
  },
  {
    key: "child-2",
    label: "Child 2",
    layerKind: "child",
    layerEntityLabel: "Child Records",
    layerSummary: "9 records",
    defaultEntity: "child-two-records",
    defaultTool: "child-two-records",
    entities: Object.freeze([
      { key: "child-two-records", label: "Child Records" },
      { key: "child-two-tasks", label: "Child Tasks" },
    ]),
  },
  {
    key: "child-3",
    label: "Child 3",
    layerKind: "child",
    layerEntityLabel: "Child Records",
    layerSummary: "4 records",
    defaultEntity: "child-three-records",
    defaultTool: "child-three-records",
    entities: Object.freeze([
      { key: "child-three-records", label: "Child Records" },
      { key: "child-three-tasks", label: "Child Tasks" },
    ]),
  },
]);

const recordManagementHistory = Object.freeze([
  {
    archived: false,
    conversationId: "record-management-active-review",
    summary: "Active review thread for the selected record list and its follow-up work.",
    title: "Active record review",
  },
  {
    archived: false,
    conversationId: "record-management-data-quality",
    summary: "Field completeness, ownership, and duplicate-resolution context.",
    title: "Data quality triage",
  },
  {
    archived: false,
    conversationId: "record-management-change-log",
    summary: "Recent updates and unresolved handoff notes for the current record set.",
    title: "Change log follow-up",
  },
  {
    archived: true,
    conversationId: "record-management-archived-import",
    summary: "Prior import review retained for traceability.",
    title: "Archived import cleanup",
  },
]);

const recordManagementMessages = Object.freeze([
  {
    author: "Assistant",
    text: "The managed-record list is filtered to active follow-up work. I can help inspect one record, summarize the history, or prepare the next action.",
  },
  {
    author: "Operator",
    text: "Keep the list in view while I review the selected record and the related notes.",
    user: true,
  },
  {
    author: "Assistant",
    text: "I will keep the record lane, detail drawer, and review thread together so the next action is traceable before anything changes.",
  },
]);

const recordManagementFilterOptions = Object.freeze({
  status: {
    eyebrow: "Attribute filter",
    title: "Status",
    options: Object.freeze([
      ["draft", "Draft", "Records still being shaped"],
      ["blocked", "Blocked", "Needs attention before movement"],
      ["ready-review", "Ready for Review", "Waiting for review"],
      ["deployed", "Deployed", "Released records"],
    ]),
  },
  org: {
    eyebrow: "Attribute filter",
    title: "Org",
    options: Object.freeze([
      ["operations", "Operations", "Operational ownership"],
      ["product", "Product", "Product discovery and delivery"],
      ["support", "Support", "Customer-facing review"],
      ["finance", "Finance", "Billing and reporting context"],
    ]),
  },
  date: {
    eyebrow: "Attribute filter",
    title: "Date",
    options: Object.freeze([
      ["today", "Today", "Due or updated today"],
      ["this-week", "This week", "Current week window"],
      ["next-week", "Next week", "Upcoming handoff window"],
      ["overdue", "Overdue", "Past expected review date"],
    ]),
  },
});

const mount = document.querySelector("[data-record-management-list-centric-mount]");
const entityHostOptions = {
  rowCount: 5,
  statusCount: 10,
};
const filterSelections = {
  date: new Set(),
  org: new Set(),
  status: new Set(),
};
let templateController = null;
let templateState = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function syncDraftCount(entityWorkspace) {
  const draftTab = entityWorkspace.querySelector('.floating-tab-card[data-tab-label="Draft"]');
  const draftCount = draftTab?.querySelector(".floating-tab-card-count");
  if (!(draftTab instanceof HTMLElement) || !(draftCount instanceof HTMLElement)) {
    return;
  }

  const baseCount = Number(draftTab.dataset.recordManagementBaseCount ?? draftTab.dataset.tabCount ?? "0");
  draftTab.dataset.recordManagementBaseCount = String(baseCount);
  const placeholderCount = entityWorkspace.querySelectorAll("[data-record-management-placeholder-record]").length;
  const nextCount = baseCount + placeholderCount;
  draftTab.dataset.tabCount = String(nextCount);
  draftCount.textContent = String(nextCount);
  draftTab.setAttribute("aria-label", `Draft, ${nextCount} records`);
}

function closeCreateDrawer() {
  if (!templateState) {
    return;
  }
  templateState.workspace.drawer = { open: false, row: null };
  const entityWorkspace = mount?.querySelector("[data-chat-workspace-entity-workspace]");
  const drawer = mount?.querySelector("[data-chat-workspace-list-drawer]");
  if (entityWorkspace instanceof HTMLElement) {
    entityWorkspace.dataset.chatWorkspaceDrawerOpen = "false";
    entityWorkspace.querySelectorAll(".floating-tab-row").forEach((row) => {
      row.classList.remove("is-selected");
      row.setAttribute("aria-pressed", "false");
    });
  }
  if (drawer instanceof HTMLElement) {
    drawer.hidden = true;
    drawer.replaceChildren();
  }
}

function insertDraftRecordPlaceholder() {
  if (!(mount instanceof HTMLElement)) {
    return;
  }

  const entityWorkspace = mount.querySelector("[data-chat-workspace-entity-workspace]");
  if (!(entityWorkspace instanceof HTMLElement)) {
    return;
  }

  const draftTab = entityWorkspace.querySelector('.floating-tab-card[data-tab-label="Draft"]');
  if (draftTab instanceof HTMLElement && draftTab.getAttribute("aria-selected") !== "true") {
    draftTab.click();
  }

  window.requestAnimationFrame(() => {
    const list = entityWorkspace.querySelector(".floating-tab-list");
    if (!(list instanceof HTMLElement)) {
      return;
    }

    const existingPlaceholder = list.querySelector("[data-record-management-placeholder-record]");
    if (existingPlaceholder instanceof HTMLElement) {
      existingPlaceholder.click();
      return;
    }

    const placeholderId = `RM-${String(Date.now()).slice(-5)}`;
    const row = document.createElement("article");
    row.className = "floating-tab-row record-management-placeholder-row";
    row.dataset.recordManagementPlaceholderRecord = placeholderId;
    row.innerHTML = `
      <span class="floating-tab-row-marker" aria-hidden="true"></span>
      <div><strong>${escapeHtml(placeholderId)} - New draft record</strong><span>Draft</span></div>
      <small>Build record</small>
    `;

    list.prepend(row);
    syncDraftCount(entityWorkspace);
    row.click();
  });
}

function installCreateDrawerHandlers() {
  if (!(mount instanceof HTMLElement)) {
    return;
  }

  mount.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest("[data-record-management-form-cancel]")) {
      return;
    }
    const form = target.closest("[data-record-management-drawer-form]");
    const placeholderId = form instanceof HTMLElement ? form.dataset.placeholderRecordId : "";
    const entityWorkspace = mount.querySelector("[data-chat-workspace-entity-workspace]");
    const row = placeholderId
      ? mount.querySelector(`[data-record-management-placeholder-record="${CSS.escape(placeholderId)}"]`)
      : null;
    if (row instanceof HTMLElement) {
      row.remove();
    }
    if (entityWorkspace instanceof HTMLElement) {
      syncDraftCount(entityWorkspace);
    }
    closeCreateDrawer();
  });

  mount.addEventListener("submit", (event) => {
    const form = event.target instanceof HTMLFormElement
      ? event.target.closest("[data-record-management-drawer-form]")
      : null;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    event.preventDefault();
    const placeholderId = form.dataset.placeholderRecordId ?? "";
    const row = placeholderId
      ? mount.querySelector(`[data-record-management-placeholder-record="${CSS.escape(placeholderId)}"]`)
      : null;
    if (!(row instanceof HTMLElement)) {
      closeCreateDrawer();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("recordName") ?? "").trim() || "Untitled record";
    const owner = String(formData.get("recordOwner") ?? "").trim() || "Owner needed";
    const nextAction = String(formData.get("recordAction") ?? "").trim() || "Next review";
    row.removeAttribute("data-record-management-placeholder-record");
    row.innerHTML = `
      <span class="floating-tab-row-marker" aria-hidden="true"></span>
      <div><strong>${escapeHtml(placeholderId)} - ${escapeHtml(name)}</strong><span>${escapeHtml(owner)}</span></div>
      <small>${escapeHtml(nextAction)}</small>
    `;
    closeCreateDrawer();
  });
}

function setPressed(buttons, activeButton) {
  buttons.forEach((button) => {
    const active = button === activeButton;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function applyRecordManagementTheme(theme) {
  const shell = mount?.querySelector("[data-chat-workspace-shell]");
  document.documentElement.dataset.theme = theme;
  if (theme === "normal") {
    document.documentElement.removeAttribute("data-theme");
  }
  if (shell instanceof HTMLElement) {
    if (theme === "normal") {
      shell.removeAttribute("data-theme-scope");
      return;
    }
    shell.dataset.themeScope = theme;
  }
}

function applyCurrentRecordManagementTheme() {
  const activeThemeButton = document.querySelector("[data-record-management-theme-option].active");
  const theme = activeThemeButton instanceof HTMLElement
    ? activeThemeButton.dataset.recordManagementThemeOption ?? "normal"
    : "normal";
  applyRecordManagementTheme(theme);
}

function applyRecordManagementStatusCountProperty() {
  if (mount instanceof HTMLElement) {
    mount.style.setProperty("--record-management-status-count", String(entityHostOptions.statusCount));
  }
}

function installBreadcrumbTooltips() {
  const crumbs = [
    [".breadcrumb-list li:nth-child(1) .breadcrumb-button", "Home"],
    [".breadcrumb-list li:nth-child(3) .breadcrumb-button", "Home > Templates"],
    [".breadcrumb-current", "Home > Templates > record_management_list_centric"],
  ];
  crumbs.forEach(([selector, label]) => {
    const crumb = document.querySelector(selector);
    if (crumb instanceof HTMLElement) {
      crumb.classList.add("tooltip-anchor");
      crumb.dataset.tooltip = label;
      crumb.setAttribute("title", label);
    }
  });
}

function getFilterSelectionCount(key) {
  return filterSelections[key]?.size ?? 0;
}

function syncFilterCounts() {
  let total = 0;
  for (const [key, selections] of Object.entries(filterSelections)) {
    total += selections.size;
    const count = document.querySelector(`[data-record-management-filter-count="${CSS.escape(key)}"]`);
    if (count instanceof HTMLElement) {
      count.textContent = String(selections.size);
    }
  }

  const totalNode = document.querySelector("[data-record-management-filter-total]");
  if (totalNode instanceof HTMLElement) {
    totalNode.textContent = `${total} selected`;
  }
}

function renderFilterSelectionDrawer(key) {
  const config = recordManagementFilterOptions[key];
  const drawer = document.querySelector("[data-record-management-filter-drawer]");
  if (!config || !(drawer instanceof HTMLElement)) {
    return;
  }

  const selectedOptions = config.options.filter(([value]) => filterSelections[key]?.has(value));
  const selectedCount = selectedOptions.length;
  const selectedMarkup = selectedOptions.length
    ? `
      <div class="form-drawer-select-selected-list" data-form-drawer-select-selected-list>
        ${selectedOptions.map(([value, label, description]) => `
          <button class="form-drawer-select-selected-chip" type="button" data-record-management-filter-remove="${escapeHtml(key)}" data-value="${escapeHtml(value)}">
            <span class="form-drawer-select-selected-chip-copy">
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(description)}</span>
            </span>
            <span class="form-drawer-select-selected-chip-remove">Remove</span>
          </button>
        `).join("")}
      </div>
    `
    : `<p class="form-drawer-select-selected-empty" data-form-drawer-select-selected-empty>No ${escapeHtml(config.title.toLowerCase())} filters selected yet.</p>`;

  drawer.innerHTML = `
    <div class="side-panel-header">
      <div>
        <p class="drawer-eyebrow">${escapeHtml(config.eyebrow)}</p>
        <h4 data-record-management-filter-drawer-title>${escapeHtml(config.title)}</h4>
      </div>
      <button class="icon-button" type="button" aria-label="Close ${escapeHtml(config.title)} filter selection" data-record-management-filter-drawer-close>
        <span class="icon-button-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="M6 6 18 18M18 6 6 18" /></svg>
        </span>
      </button>
    </div>
    <form class="search-shell form-drawer-select-search-shell" role="search">
      <label class="search-shell-field">
        <input class="search-input" type="search" placeholder="Search ${escapeHtml(config.title.toLowerCase())}" autocomplete="off" data-record-management-filter-search />
      </label>
    </form>
    <section class="form-drawer-select-selected-panel">
      <div class="form-drawer-select-selected-header">
        <h5 class="form-drawer-select-selected-title">Selected</h5>
        <span class="form-drawer-select-selected-count">${escapeHtml(selectedCount)} selected</span>
      </div>
      ${selectedMarkup}
    </section>
    <section class="form-drawer-select-catalog">
      <div class="form-drawer-select-catalog-header">
        <h5 class="form-drawer-select-selected-title">Available</h5>
      </div>
      <div class="form-drawer-select-option-list" data-record-management-filter-options>
        ${config.options.map(([value, label, description]) => {
          const active = filterSelections[key]?.has(value) ? " active" : "";
          return `
            <button
              class="form-drawer-select-option${active}"
              type="button"
              data-record-management-filter-option="${escapeHtml(key)}"
              data-value="${escapeHtml(value)}"
              data-label="${escapeHtml(label)}"
              data-description="${escapeHtml(description)}"
            >
              <span class="form-drawer-select-option-toggle" aria-hidden="true"></span>
              <span class="form-drawer-select-option-copy">
                <strong>${escapeHtml(label)}</strong>
                <span>${escapeHtml(description)}</span>
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;

  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  document.querySelectorAll("[data-record-management-filter-card]").forEach((card) => {
    const active = card instanceof HTMLElement && card.dataset.recordManagementFilterCard === key;
    card.setAttribute("aria-expanded", active ? "true" : "false");
  });
}

function toggleFilterSelection(key, value) {
  const selections = filterSelections[key];
  if (!selections) {
    return;
  }
  if (selections.has(value)) {
    selections.delete(value);
  } else {
    selections.add(value);
  }
  syncFilterCounts();
  renderFilterSelectionDrawer(key);
}

function closeFilterSelectionDrawer() {
  const drawer = document.querySelector("[data-record-management-filter-drawer]");
  if (drawer instanceof HTMLElement) {
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
  }
  document.querySelectorAll("[data-record-management-filter-card]").forEach((card) => {
    card.setAttribute("aria-expanded", "false");
  });
}

function installFilterPanel() {
  const frame = document.querySelector("[data-record-management-template-frame]");
  const toggle = document.querySelector("[data-record-management-filter-toggle]");
  if (!(frame instanceof HTMLElement) || !(toggle instanceof HTMLElement)) {
    return;
  }

  toggle.addEventListener("click", () => {
    const expanded = frame.dataset.filterExpanded !== "false";
    frame.dataset.filterExpanded = expanded ? "false" : "true";
    toggle.setAttribute("aria-label", expanded ? "Expand filters" : "Collapse filters");
    toggle.dataset.tooltip = expanded ? "Expand filters" : "Collapse filters";
    closeFilterSelectionDrawer();
  });

  document.querySelectorAll("[data-record-management-filter-card]").forEach((card) => {
    card.addEventListener("click", () => {
      if (!(card instanceof HTMLElement)) {
        return;
      }
      if (frame.dataset.filterExpanded === "false") {
        frame.dataset.filterExpanded = "true";
      }
      renderFilterSelectionDrawer(card.dataset.recordManagementFilterCard ?? "status");
    });
  });

  document.querySelector("[data-record-management-filter-drawer]")?.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("[data-record-management-filter-drawer-close]")) {
      closeFilterSelectionDrawer();
      return;
    }
    const option = target?.closest("[data-record-management-filter-option], [data-record-management-filter-remove]");
    if (!(option instanceof HTMLElement)) {
      return;
    }
    const key = option.dataset.recordManagementFilterOption ?? option.dataset.recordManagementFilterRemove ?? "";
    const value = option.dataset.value ?? "";
    toggleFilterSelection(key, value);
  });

  syncFilterCounts();
}

function installDisplaySettingsDrawer() {
  const button = document.getElementById("record-management-display-settings-button");
  const drawer = document.getElementById("record-management-display-settings-drawer");
  const closeButton = document.getElementById("record-management-display-settings-close");
  const template = document.querySelector("[data-record-management-list-centric-template]");
  const themeButtons = Array.from(document.querySelectorAll("[data-record-management-theme-option]"));
  const directionButtons = Array.from(document.querySelectorAll("[data-record-management-direction-option]"));
  const magnificationButtons = Array.from(document.querySelectorAll("[data-record-management-magnification-option]"));
  const drawerViewButtons = Array.from(document.querySelectorAll("[data-record-management-drawer-view]"));
  const editControlStyleButtons = Array.from(document.querySelectorAll("[data-record-management-edit-control-style]"));
  const statusCountButtons = Array.from(document.querySelectorAll("[data-record-management-status-count]"));
  const listCountButtons = Array.from(document.querySelectorAll("[data-record-management-list-count]"));

  if (!(button instanceof HTMLElement) || !(drawer instanceof HTMLElement)) {
    return;
  }

  const setOpen = (open) => {
    drawer.classList.toggle("hidden", !open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  };

  button.addEventListener("click", () => {
    setOpen(drawer.classList.contains("hidden"));
  });

  closeButton?.addEventListener("click", () => {
    setOpen(false);
    button.focus();
  });

  themeButtons.forEach((themeButton) => {
    themeButton.addEventListener("click", () => {
      setPressed(themeButtons, themeButton);
      applyRecordManagementTheme(themeButton.dataset.recordManagementThemeOption ?? "normal");
    });
  });

  directionButtons.forEach((directionButton) => {
    directionButton.addEventListener("click", () => {
      setPressed(directionButtons, directionButton);
      document.documentElement.setAttribute("dir", directionButton.dataset.recordManagementDirectionOption ?? "ltr");
    });
  });

  magnificationButtons.forEach((magnificationButton) => {
    magnificationButton.addEventListener("click", () => {
      setPressed(magnificationButtons, magnificationButton);
      const amount = Number(magnificationButton.dataset.recordManagementMagnificationOption ?? "0");
      const scale = 1 + amount / 200;
      if (template instanceof HTMLElement) {
        if (amount === 0) {
          template.style.removeProperty("--ui-scale");
          delete template.dataset.magnification;
          return;
        }
        template.style.setProperty("--ui-scale", String(scale));
        template.dataset.magnification = String(amount);
      }
    });
  });

  drawerViewButtons.forEach((drawerViewButton) => {
    drawerViewButton.addEventListener("click", () => {
      setPressed(drawerViewButtons, drawerViewButton);
      if (template instanceof HTMLElement) {
        template.dataset.recordManagementDrawerViewMode = drawerViewButton.dataset.recordManagementDrawerView ?? "end_user";
      }
      const selectedRow = mount?.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-row.is-selected");
      if (selectedRow instanceof HTMLElement && !selectedRow.dataset.recordManagementPlaceholderRecord) {
        selectedRow.click();
      }
      applyCurrentRecordManagementTheme();
    });
  });

  editControlStyleButtons.forEach((editControlStyleButton) => {
    editControlStyleButton.addEventListener("click", () => {
      setPressed(editControlStyleButtons, editControlStyleButton);
      if (template instanceof HTMLElement) {
        template.dataset.recordManagementEditControlStyle = editControlStyleButton.dataset.recordManagementEditControlStyle ?? "compact";
      }
      applyCurrentRecordManagementTheme();
    });
  });

  statusCountButtons.forEach((statusCountButton) => {
    statusCountButton.addEventListener("click", () => {
      setPressed(statusCountButtons, statusCountButton);
      entityHostOptions.statusCount = Number(statusCountButton.dataset.recordManagementStatusCount ?? "10");
      applyRecordManagementStatusCountProperty();
      templateController?.render?.();
      applyCurrentRecordManagementTheme();
    });
  });

  listCountButtons.forEach((listCountButton) => {
    listCountButton.addEventListener("click", () => {
      setPressed(listCountButtons, listCountButton);
      entityHostOptions.rowCount = Number(listCountButton.dataset.recordManagementListCount ?? "5");
      templateController?.render?.();
      applyCurrentRecordManagementTheme();
    });
  });
}

if (mount instanceof HTMLElement) {
  installBreadcrumbTooltips();
  applyRecordManagementStatusCountProperty();
  installFilterPanel();
  installDisplaySettingsDrawer();

  const state = createChatWorkspaceMockConsumerState({
    config: {
      defaultLayer: "delivery",
      expansion: chatWorkspaceExpansionModes.enabled,
      features: {
        conversationIndex: true,
        entitySelector: true,
        rowDrawer: true,
        statusTabs: true,
      },
    },
    layers: recordManagementLayers,
  });

  state.workspace.expanded = true;
  state.chat.panel = {
    ...getConversationPanelCanonicalRef("BWP-R-004"),
    historyOpen: true,
    panelOpen: true,
  };
  state.chat.history = [...recordManagementHistory];
  state.chat.messages = [...recordManagementMessages];
  templateState = state;
  installCreateDrawerHandlers();

  templateController = createChatWorkspaceMockConsumerController(mount, {
    getChatInput() {
      return {
        config: createBuildConversationPanelConfig({ tools: [] }),
        handlers: {
          onNewConversation: insertDraftRecordPlaceholder,
        },
        history: [...recordManagementHistory],
        messages: [...recordManagementMessages],
        ref: {
          ...getConversationPanelCanonicalRef("BWP-R-004"),
          historyOpen: true,
          panelOpen: true,
        },
      };
    },
    entityHostOptions,
    entitySelectorLabel: "View",
    headerTools: [
      { icon: "upload", label: "Upload" },
      { icon: "export", label: "Export" },
      { icon: "sort", label: "Sort" },
    ],
    layerSelectorPlacement: "secondary-list",
    newConversationLabel: "Create new",
    state,
    title: "Record management",
  });
}
