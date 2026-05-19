import {
  createChatWorkspaceMockConsumerController,
  createChatWorkspaceMockConsumerState,
} from "./chatWorkspaceMockConsumer.mjs";
import { chatWorkspaceExpansionModes } from "./chatWorkspaceShellContract.mjs";
import {
  createBuildConversationPanelConfig,
  getConversationPanelCanonicalRef,
} from "./conversationPanel.mjs";

let recordManagementLayers = Object.freeze([
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

let recordManagementFilterOptions = {
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
};
let recordManagementDemoFixture = null;

const mount = document.querySelector("[data-record-management-list-centric-mount]");
const entityHostOptions = {
  rowCount: 5,
  statusCount: 10,
};
let filterSelections = {
  date: new Set(),
  org: new Set(),
  status: new Set(),
};
const filterDateRange = {
  start: "",
  end: "",
  viewStart: "2026-05-01",
  selectionStage: "start",
};
const filterDateSingle = {
  value: "",
  viewStart: "2026-05-01",
};
let templateController = null;
let templateState = null;

function resetFilterSelectionsForOptions(options) {
  filterSelections = Object.fromEntries(Object.keys(options).map((key) => [key, new Set()]));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function labelFor(value, fallback = "") {
  return String(value?.labelFallback ?? value?.titleFallback ?? value?.targetPluralLabelFallback ?? fallback ?? "");
}

function getFixtureDefinition() {
  return recordManagementDemoFixture?.entityDefinitionSlice ?? null;
}

function getFixtureAttribute(attributeKey) {
  return getFixtureDefinition()?.attributes?.find((attribute) => attribute.attributeKey === attributeKey) ?? null;
}

function formatFilterOptionLabel(attribute, value) {
  const option = attribute?.options?.find((candidate) => candidate.optionKey === value);
  return option?.labelFallback ?? String(value ?? "");
}

function buildFixtureLayer(relationship, layerKind) {
  const targetLabel = relationship.targetPluralLabelFallback ?? relationship.labelFallback ?? relationship.relationshipKey;
  return {
    key: relationship.relationshipKey,
    label: layerKind === "parent" ? "Parent" : "Child",
    layerKind,
    layerEntityLabel: targetLabel,
    layerSummary: layerKind === "child" ? "6 records" : targetLabel,
    defaultEntity: relationship.targetEntityKey,
    defaultTool: relationship.targetEntityKey,
    entities: Object.freeze([
      { key: relationship.targetEntityKey, label: targetLabel },
    ]),
  };
}

function buildRecordManagementLayersFromFixture(fixture) {
  const definition = fixture?.entityDefinitionSlice;
  if (!definition) {
    return recordManagementLayers;
  }

  const relationships = [...(definition.relationships ?? [])]
    .filter((relationship) => relationship.navigationPosture === "navigable" && relationship.layerSelectorEligible)
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0));
  const parentLayers = relationships
    .filter((relationship) => relationship.relationshipCategory === "parent_relation")
    .map((relationship) => buildFixtureLayer(relationship, "parent"));
  const childLayers = relationships
    .filter((relationship) => relationship.relationshipCategory === "child_relation")
    .map((relationship) => buildFixtureLayer(relationship, "child"));
  const entityLabel = definition.entityIdentity?.pluralLabelFallback ?? "Organizations";

  return Object.freeze([
    ...parentLayers,
    {
      key: "organization-current",
      label: "Current",
      layerKind: "current",
      layerEntityLabel: entityLabel,
      layerSummary: entityLabel,
      defaultEntity: "organization",
      defaultTool: "organization",
      entities: Object.freeze([
        { key: "organization", label: entityLabel, statusItems: buildStatusItemsFromFixture(fixture) },
      ]),
    },
    ...childLayers,
  ]);
}

function buildStatusItemsFromFixture(fixture) {
  const definition = fixture?.entityDefinitionSlice;
  const records = fixture?.records ?? [];
  const statuses = [...(definition?.operationalStatusSet?.statuses ?? [])]
    .filter((status) => status.tabEligible)
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0));
  return statuses.map((status) => {
    const statusRecords = records.filter((record) => record.review_status === status.statusKey);
    return {
      key: `organization-${status.statusKey}`,
      label: status.labelFallback,
      meta: "Status",
      count: statusRecords.length,
      attention: status.badgeTone === "warning" || status.badgeTone === "danger",
      rows: statusRecords.map((record) => [
        record.name,
        formatFilterOptionLabel(getFixtureAttribute("owning_group"), record.owning_group),
        status.labelFallback,
      ]),
    };
  });
}

function buildRowsByLabelFromFixture(fixture) {
  return {
    organization: Object.fromEntries(
      buildStatusItemsFromFixture(fixture).map((status) => [status.label, status.rows]),
    ),
  };
}

function buildFilterOptionsFromFixture(fixture) {
  const generatedFilters = [...(fixture?.entityDefinitionSlice?.searchModel?.generatedFilters ?? [])]
    .filter((filter) => filter.defaultVisible !== false)
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0));
  const nextOptions = {};
  for (const filter of generatedFilters) {
    if (filter.filterBehavior === "value_range") {
      continue;
    }
    if (filter.filterBehavior === "date_range") {
      nextOptions[filter.filterKey] = {
        eyebrow: "Attribute filter",
        title: filter.labelFallback,
        behavior: "date_range",
        description: filter.descriptionFallback,
        options: Object.freeze([
          ["today", "Today", "Due or updated today"],
          ["this-week", "This week", "Current week window"],
          ["next-week", "Next week", "Upcoming handoff window"],
          ["overdue", "Overdue", "Past expected review date"],
        ]),
      };
      continue;
    }
    if (filter.filterBehavior !== "collection_select") {
      continue;
    }
    const attribute = getFixtureAttribute(filter.attributeKey);
    nextOptions[filter.filterKey] = {
      eyebrow: "Attribute filter",
      title: filter.labelFallback,
      behavior: "collection_select",
      description: filter.descriptionFallback,
      options: Object.freeze((attribute?.options ?? []).map((option) => [
        option.optionKey,
        option.labelFallback,
        `${option.labelFallback} organizations`,
      ])),
    };
  }
  return nextOptions;
}

async function loadRecordManagementDemoFixture() {
  const response = await fetch("/design-system/templates/record_management_list_centric/organization-demo-fixture.json", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to load record-management fixture: ${response.status}`);
  }
  return response.json();
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
  const currentLabel = document.querySelector(".breadcrumb-current")?.textContent?.trim() ?? "record_management_list_centric";
  const crumbs = [
    [".breadcrumb-list li:nth-child(1) .breadcrumb-button", "Home"],
    [".breadcrumb-list li:nth-child(3) .breadcrumb-button", "Home > Templates"],
    [".breadcrumb-current", `Home > Templates > ${currentLabel}`],
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

function isRecordManagementEntityPageTemplate() {
  return document.querySelector("[data-record-management-entity-page-template]") instanceof HTMLElement;
}

function openRecordManagementEntityPageSkeleton() {
  if (!isRecordManagementEntityPageTemplate()) {
    return;
  }

  window.requestAnimationFrame(() => {
    const firstRow = mount?.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-row");
    if (firstRow instanceof HTMLElement) {
      firstRow.click();
    }
  });
}

function getFilterSelectionCount(key) {
  const optionCount = filterSelections[key]?.size ?? 0;
  if (recordManagementFilterOptions[key]?.behavior !== "date_range") {
    return optionCount;
  }
  return optionCount
    + (filterDateSingle.value ? 1 : 0)
    + (filterDateRange.start && filterDateRange.end ? 1 : 0);
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function formatRecordManagementIsoDate(date) {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function formatRecordManagementDateLabel(value) {
  if (!value) {
    return "";
  }
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function getRecordManagementDateRangeLabel() {
  if (!filterDateRange.start || !filterDateRange.end) {
    return "Choose date range";
  }
  return `${formatRecordManagementDateLabel(filterDateRange.start)} - ${formatRecordManagementDateLabel(filterDateRange.end)}`;
}

function getRecordManagementSingleDateLabel() {
  return filterDateSingle.value ? formatRecordManagementDateLabel(filterDateSingle.value) : "Choose date";
}

function syncFilterCounts() {
  let total = 0;
  for (const [key, selections] of Object.entries(filterSelections)) {
    const selectionCount = getFilterSelectionCount(key);
    total += selectionCount;
    const count = document.querySelector(`[data-record-management-filter-count="${CSS.escape(key)}"]`);
    if (count instanceof HTMLElement) {
      count.textContent = String(selectionCount);
    }
  }

  const totalNode = document.querySelector("[data-record-management-filter-total]");
  if (totalNode instanceof HTMLElement) {
    totalNode.textContent = `${total} selected`;
  }
}

function renderFilterCardsFromOptions() {
  const list = document.querySelector("[data-record-management-filter-card-list]");
  if (!(list instanceof HTMLElement)) {
    return;
  }
  const entries = Object.entries(recordManagementFilterOptions);
  list.innerHTML = entries.map(([key, config]) => `
    <button class="record-management-filter-card" type="button" aria-expanded="false" data-record-management-filter-card="${escapeHtml(key)}">
      <span>
        <strong>${escapeHtml(config.title)}</strong>
        <small>${escapeHtml(config.description ?? "Filter")}</small>
      </span>
      <em data-record-management-filter-count="${escapeHtml(key)}">0</em>
    </button>
  `).join("");
}

function renderRecordManagementDateRangeControl() {
  const hasRange = Boolean(filterDateRange.start && filterDateRange.end);
  const currentLabel = getRecordManagementDateRangeLabel();
  const summary = hasRange
    ? `Selected range: ${formatRecordManagementDateLabel(filterDateRange.start)} through ${formatRecordManagementDateLabel(filterDateRange.end)}.`
    : filterDateRange.start
      ? `Start selected: ${formatRecordManagementDateLabel(filterDateRange.start)}. Choose an end date next.`
      : "Select a start date, then an end date.";

  return `
    <div class="record-management-filter-date-range form-field" data-record-management-date-range-field>
      <span class="form-field-label" id="record-management-date-range-label">Custom date range</span>
      <div class="form-date-picker" data-form-date-picker data-picker-mode="range" data-month-count="1" data-record-management-date-range-picker>
        <input type="hidden" name="recordManagementFilterDateStart" value="${escapeHtml(filterDateRange.start)}" data-form-date-start-value />
        <input type="hidden" name="recordManagementFilterDateEnd" value="${escapeHtml(filterDateRange.end)}" data-form-date-end-value />
        <button
          class="form-date-trigger"
          type="button"
          id="record-management-date-range-trigger"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-labelledby="record-management-date-range-label record-management-date-range-trigger"
          data-form-date-button
          data-record-management-date-range-button
        >
          <span data-form-date-current-label>${escapeHtml(currentLabel)}</span>
          <span class="form-date-trigger-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M7 3.5v3M17 3.5v3M4.5 8.5h15M6 6.5h12a1.5 1.5 0 0 1 1.5 1.5v9.5A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5V8A1.5 1.5 0 0 1 6 6.5Z" />
            </svg>
          </span>
        </button>
        <div
          class="form-date-menu hidden"
          role="dialog"
          aria-modal="false"
          aria-labelledby="record-management-date-range-label"
          data-form-date-panel
          data-record-management-date-range-panel
        >
          <div class="form-date-menu-header">
            <div>
              <p class="top-nav-preview-eyebrow">Date Range</p>
              <h4 class="form-date-menu-title">Choose start and end dates</h4>
            </div>
            <div class="form-date-menu-controls">
              <div class="form-date-menu-actions">
                <button class="form-date-nav-button" type="button" data-record-management-date-range-nav="-1">Previous</button>
                <button class="form-date-nav-button" type="button" data-record-management-date-range-nav="1">Next</button>
              </div>
            </div>
          </div>
          <div class="form-date-range-summary" data-record-management-date-range-summary>${escapeHtml(summary)}</div>
          <div class="form-date-months" data-record-management-date-range-months></div>
          <div class="form-date-menu-footer">
            <button class="form-date-done-button" type="button" ${hasRange ? "" : "disabled"} data-record-management-date-range-done>Done</button>
          </div>
        </div>
      </div>
      <span class="form-field-help">Use a custom range when the preset review windows are too broad.</span>
    </div>
  `;
}

function renderRecordManagementSingleDateControl() {
  return `
    <div class="record-management-filter-date-control form-field" data-record-management-date-single-field>
      <span class="form-field-label" id="record-management-date-single-label">Specific date</span>
      <div class="form-date-picker" data-form-date-picker data-picker-mode="single" data-month-count="1" data-record-management-date-single-picker>
        <input type="hidden" name="recordManagementFilterDateSingle" value="${escapeHtml(filterDateSingle.value)}" data-form-date-start-value />
        <button
          class="form-date-trigger"
          type="button"
          id="record-management-date-single-trigger"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-labelledby="record-management-date-single-label record-management-date-single-trigger"
          data-form-date-button
          data-record-management-date-single-button
        >
          <span data-form-date-current-label>${escapeHtml(getRecordManagementSingleDateLabel())}</span>
          <span class="form-date-trigger-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M7 3.5v3M17 3.5v3M4.5 8.5h15M6 6.5h12a1.5 1.5 0 0 1 1.5 1.5v9.5A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5V8A1.5 1.5 0 0 1 6 6.5Z" />
            </svg>
          </span>
        </button>
        <div
          class="form-date-menu hidden"
          role="dialog"
          aria-modal="false"
          aria-labelledby="record-management-date-single-label"
          data-form-date-panel
          data-record-management-date-single-panel
        >
          <div class="form-date-menu-header">
            <div>
              <p class="top-nav-preview-eyebrow">Date</p>
              <h4 class="form-date-menu-title">Choose date</h4>
            </div>
            <div class="form-date-menu-controls">
              <div class="form-date-menu-actions">
                <button class="form-date-nav-button" type="button" data-record-management-date-single-nav="-1">Previous</button>
                <button class="form-date-nav-button" type="button" data-record-management-date-single-nav="1">Next</button>
              </div>
            </div>
          </div>
          <div class="form-date-months" data-record-management-date-single-months></div>
        </div>
      </div>
    </div>
  `;
}

function renderRecordManagementDateCalendar(root, {
  monthsSelector,
  viewStart,
  start,
  end = "",
  dayAttribute,
} = {}) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const monthsContainer = root.querySelector(monthsSelector);
  if (!(monthsContainer instanceof HTMLElement)) {
    return;
  }

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "narrow" });
  const monthTitleFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const viewDate = new Date(`${viewStart || start || "2026-05-01"}T12:00:00`);
  const safeViewDate = Number.isNaN(viewDate.getTime()) ? new Date("2026-05-01T12:00:00") : viewDate;
  const monthDate = new Date(safeViewDate.getFullYear(), safeViewDate.getMonth(), 1);
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const weekdays = Array.from({ length: 7 }, (_, dayIndex) => {
    const day = new Date(2026, 2, 2 + dayIndex);
    return `<span class="form-date-weekday" aria-hidden="true">${weekdayFormatter.format(day)}</span>`;
  }).join("");
  const days = [];

  for (let emptyIndex = 0; emptyIndex < offset; emptyIndex += 1) {
    days.push('<span class="form-date-day form-date-day-empty" aria-hidden="true"></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const isoDate = formatRecordManagementIsoDate(date);
    const isStart = isoDate === start;
    const isEnd = isoDate === end;
    const isSelected = isStart || isEnd;
    const isInRange = start && end && isoDate > start && isoDate < end;
    const classes = [
      "form-date-day",
      isSelected ? "form-date-day-selected" : "",
      isInRange ? "form-date-day-in-range" : "",
    ].filter(Boolean).join(" ");
    days.push(`<button class="${classes}" type="button" data-form-date-day ${dayAttribute} data-date="${isoDate}" aria-pressed="${String(isSelected)}">${day}</button>`);
  }

  monthsContainer.innerHTML = `
    <section class="form-date-month" aria-label="${monthTitleFormatter.format(monthDate)}">
      <h5 class="form-date-month-title">${monthTitleFormatter.format(monthDate)}</h5>
      <div class="form-date-weekdays">${weekdays}</div>
      <div class="form-date-grid">${days.join("")}</div>
    </section>
  `;
}

function renderRecordManagementDateRangeCalendar(root) {
  renderRecordManagementDateCalendar(root, {
    monthsSelector: "[data-record-management-date-range-months]",
    viewStart: filterDateRange.viewStart,
    start: filterDateRange.start,
    end: filterDateRange.end,
    dayAttribute: "data-record-management-date-range-day",
  });
}

function renderRecordManagementSingleDateCalendar(root) {
  renderRecordManagementDateCalendar(root, {
    monthsSelector: "[data-record-management-date-single-months]",
    viewStart: filterDateSingle.viewStart,
    start: filterDateSingle.value,
    dayAttribute: "data-record-management-date-single-day",
  });
}

function setRecordManagementDatePanelOpen(picker, buttonSelector, panelSelector, open, renderCalendar) {
  if (!(picker instanceof HTMLElement)) {
    return;
  }
  const button = picker.querySelector(buttonSelector);
  const panel = picker.querySelector(panelSelector);
  if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  button.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("hidden", !open);
  if (open) {
    renderCalendar(picker);
  }
}

function renderFilterSelectionDrawer(key) {
  const config = recordManagementFilterOptions[key];
  const drawer = document.querySelector("[data-record-management-filter-drawer]");
  if (!config || !(drawer instanceof HTMLElement)) {
    return;
  }

  const selectedOptions = config.options.filter(([value]) => filterSelections[key]?.has(value));
  const isDateRangeFilter = config.behavior === "date_range";
  const singleDateSelected = isDateRangeFilter && filterDateSingle.value;
  const dateRangeSelected = isDateRangeFilter && filterDateRange.start && filterDateRange.end;
  const selectedCount = getFilterSelectionCount(key);
  const selectedOptionMarkup = selectedOptions.map(([value, label, description]) => `
    <button class="form-drawer-select-selected-chip" type="button" data-record-management-filter-remove="${escapeHtml(key)}" data-value="${escapeHtml(value)}">
      <span class="form-drawer-select-selected-chip-copy">
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(description)}</span>
      </span>
      <span class="form-drawer-select-selected-chip-remove">Remove</span>
    </button>
  `).join("");
  const selectedRangeMarkup = dateRangeSelected
    ? `
      <button class="form-drawer-select-selected-chip" type="button" data-record-management-filter-remove-range="date">
        <span class="form-drawer-select-selected-chip-copy">
          <strong>Custom range</strong>
          <span>${escapeHtml(getRecordManagementDateRangeLabel())}</span>
        </span>
        <span class="form-drawer-select-selected-chip-remove">Remove</span>
      </button>
    `
    : "";
  const selectedSingleDateMarkup = singleDateSelected
    ? `
      <button class="form-drawer-select-selected-chip" type="button" data-record-management-filter-remove-single-date="date">
        <span class="form-drawer-select-selected-chip-copy">
          <strong>Specific date</strong>
          <span>${escapeHtml(getRecordManagementSingleDateLabel())}</span>
        </span>
        <span class="form-drawer-select-selected-chip-remove">Remove</span>
      </button>
    `
    : "";
  const selectedMarkup = selectedCount
    ? `
      <div class="form-drawer-select-selected-list" data-form-drawer-select-selected-list>
        ${selectedOptionMarkup}
        ${selectedSingleDateMarkup}
        ${selectedRangeMarkup}
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
    ${isDateRangeFilter ? renderRecordManagementSingleDateControl() : `
      <form class="search-shell form-drawer-select-search-shell" role="search">
        <label class="search-shell-field">
          <input class="search-input" type="search" placeholder="Search ${escapeHtml(config.title.toLowerCase())}" autocomplete="off" data-record-management-filter-search />
        </label>
      </form>
    `}
    ${isDateRangeFilter ? renderRecordManagementDateRangeControl() : ""}
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
  if (isDateRangeFilter) {
    renderRecordManagementSingleDateCalendar(drawer.querySelector("[data-record-management-date-single-picker]"));
    renderRecordManagementDateRangeCalendar(drawer.querySelector("[data-record-management-date-range-picker]"));
  }
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

function getActiveDateFilterKey() {
  return Object.entries(recordManagementFilterOptions).find(([, config]) => config.behavior === "date_range")?.[0] ?? "date";
}

function installFilterPanel() {
  const frame = document.querySelector("[data-record-management-template-frame]");
  const toggle = document.querySelector("[data-record-management-filter-toggle]");
  if (!(frame instanceof HTMLElement) || !(toggle instanceof HTMLElement)) {
    return;
  }

  const collapseFilters = () => {
    frame.dataset.filterExpanded = "false";
    toggle.setAttribute("aria-label", "Expand filters");
    toggle.dataset.tooltip = "Expand filters";
    closeFilterSelectionDrawer();
  };

  if (window.matchMedia("(max-width: 52rem)").matches) {
    collapseFilters();
  }

  toggle.addEventListener("click", () => {
    const expanded = frame.dataset.filterExpanded !== "false";
    if (expanded) {
      collapseFilters();
      return;
    }
    frame.dataset.filterExpanded = "true";
    toggle.setAttribute("aria-label", "Collapse filters");
    toggle.dataset.tooltip = "Collapse filters";
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

    if (target?.closest("[data-record-management-filter-remove-range]")) {
      const dateFilterKey = getActiveDateFilterKey();
      filterDateRange.start = "";
      filterDateRange.end = "";
      filterDateRange.selectionStage = "start";
      syncFilterCounts();
      renderFilterSelectionDrawer(dateFilterKey);
      return;
    }

    if (target?.closest("[data-record-management-filter-remove-single-date]")) {
      const dateFilterKey = getActiveDateFilterKey();
      filterDateSingle.value = "";
      syncFilterCounts();
      renderFilterSelectionDrawer(dateFilterKey);
      return;
    }

    const singleDateField = target?.closest("[data-record-management-date-single-field]");
    if (singleDateField instanceof HTMLElement && !target?.closest("[data-record-management-date-single-picker]")) {
      const picker = singleDateField.querySelector("[data-record-management-date-single-picker]");
      setRecordManagementDatePanelOpen(
        picker,
        "[data-record-management-date-single-button]",
        "[data-record-management-date-single-panel]",
        true,
        renderRecordManagementSingleDateCalendar,
      );
      return;
    }

    const dateRangeField = target?.closest("[data-record-management-date-range-field]");
    if (dateRangeField instanceof HTMLElement && !target?.closest("[data-record-management-date-range-picker]")) {
      const picker = dateRangeField.querySelector("[data-record-management-date-range-picker]");
      setRecordManagementDatePanelOpen(
        picker,
        "[data-record-management-date-range-button]",
        "[data-record-management-date-range-panel]",
        true,
        renderRecordManagementDateRangeCalendar,
      );
      return;
    }

    const singleDatePicker = target?.closest("[data-record-management-date-single-picker]");
    if (singleDatePicker instanceof HTMLElement) {
      const button = target?.closest("[data-record-management-date-single-button]");
      if (button instanceof HTMLButtonElement) {
        const expanded = button.getAttribute("aria-expanded") === "true";
        setRecordManagementDatePanelOpen(
          singleDatePicker,
          "[data-record-management-date-single-button]",
          "[data-record-management-date-single-panel]",
          !expanded,
          renderRecordManagementSingleDateCalendar,
        );
        return;
      }

      const navButton = target?.closest("[data-record-management-date-single-nav]");
      if (navButton instanceof HTMLButtonElement) {
        const currentView = new Date(`${filterDateSingle.viewStart || "2026-05-01"}T12:00:00`);
        const delta = Number(navButton.dataset.recordManagementDateSingleNav ?? "0");
        filterDateSingle.viewStart = formatRecordManagementIsoDate(addMonths(currentView, delta));
        renderRecordManagementSingleDateCalendar(singleDatePicker);
        return;
      }

      const dayButton = target?.closest("[data-record-management-date-single-day]");
      if (dayButton instanceof HTMLButtonElement) {
        filterDateSingle.value = dayButton.dataset.date ?? "";
        filterDateSingle.viewStart = filterDateSingle.value || filterDateSingle.viewStart;
        syncFilterCounts();
        renderFilterSelectionDrawer(getActiveDateFilterKey());
        return;
      }
    }

    const dateRangePicker = target?.closest("[data-record-management-date-range-picker]");
    if (dateRangePicker instanceof HTMLElement) {
      const button = target?.closest("[data-record-management-date-range-button]");
      if (button instanceof HTMLButtonElement) {
        const expanded = button.getAttribute("aria-expanded") === "true";
        setRecordManagementDatePanelOpen(
          dateRangePicker,
          "[data-record-management-date-range-button]",
          "[data-record-management-date-range-panel]",
          !expanded,
          renderRecordManagementDateRangeCalendar,
        );
        return;
      }

      const navButton = target?.closest("[data-record-management-date-range-nav]");
      if (navButton instanceof HTMLButtonElement) {
        const currentView = new Date(`${filterDateRange.viewStart || "2026-05-01"}T12:00:00`);
        const delta = Number(navButton.dataset.recordManagementDateRangeNav ?? "0");
        filterDateRange.viewStart = formatRecordManagementIsoDate(addMonths(currentView, delta));
        renderRecordManagementDateRangeCalendar(dateRangePicker);
        return;
      }

      const dayButton = target?.closest("[data-record-management-date-range-day]");
      if (dayButton instanceof HTMLButtonElement) {
        const selectedDate = dayButton.dataset.date ?? "";
        if (filterDateRange.selectionStage === "start" || !filterDateRange.start) {
          filterDateRange.start = selectedDate;
          filterDateRange.end = "";
          filterDateRange.selectionStage = "end";
        } else if (selectedDate < filterDateRange.start) {
          filterDateRange.end = filterDateRange.start;
          filterDateRange.start = selectedDate;
          filterDateRange.selectionStage = "start";
        } else {
          filterDateRange.end = selectedDate;
          filterDateRange.selectionStage = "start";
        }
        renderFilterSelectionDrawer(getActiveDateFilterKey());
        const updatedPicker = document.querySelector("[data-record-management-date-range-picker]");
        const updatedPanel = updatedPicker?.querySelector("[data-record-management-date-range-panel]");
        const updatedButton = updatedPicker?.querySelector("[data-record-management-date-range-button]");
        if (updatedPicker instanceof HTMLElement && updatedPanel instanceof HTMLElement && updatedButton instanceof HTMLButtonElement) {
          updatedButton.setAttribute("aria-expanded", "true");
          updatedPanel.classList.remove("hidden");
          renderRecordManagementDateRangeCalendar(updatedPicker);
        }
        syncFilterCounts();
        return;
      }

      if (target?.closest("[data-record-management-date-range-done]")) {
        renderFilterSelectionDrawer(getActiveDateFilterKey());
        return;
      }
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

async function initializeRecordManagementTemplate() {
  if (!(mount instanceof HTMLElement)) {
    return;
  }
  try {
    recordManagementDemoFixture = await loadRecordManagementDemoFixture();
    recordManagementLayers = buildRecordManagementLayersFromFixture(recordManagementDemoFixture);
    recordManagementFilterOptions = buildFilterOptionsFromFixture(recordManagementDemoFixture);
    resetFilterSelectionsForOptions(recordManagementFilterOptions);
    entityHostOptions.rowsByLabelOverride = buildRowsByLabelFromFixture(recordManagementDemoFixture);
    entityHostOptions.rowCount = null;
    entityHostOptions.statusCount = buildStatusItemsFromFixture(recordManagementDemoFixture).length;
  } catch (error) {
    console.warn(error);
    resetFilterSelectionsForOptions(recordManagementFilterOptions);
  }

  installBreadcrumbTooltips();
  applyRecordManagementStatusCountProperty();
  renderFilterCardsFromOptions();
  installFilterPanel();
  installDisplaySettingsDrawer();

  const state = createChatWorkspaceMockConsumerState({
    config: {
      defaultLayer: recordManagementLayers.find((layer) => layer.layerKind === "current")?.key ?? "delivery",
      expansion: chatWorkspaceExpansionModes.enabled,
      features: {
        conversationIndex: true,
        entitySelector: false,
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
    entitySelectorLabel: "",
    headerTools: [],
    layerSelectorPlacement: "secondary-list",
    newConversationLabel: "",
    showEntitySelector: false,
    showPrimaryCapabilityArea: false,
    state,
    title: "Record management",
  });
  openRecordManagementEntityPageSkeleton();
}

void initializeRecordManagementTemplate();
