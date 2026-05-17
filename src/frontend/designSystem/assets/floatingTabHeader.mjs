import { createFloatingTabRowReorderController } from "./floatingTabRowReorder.mjs";
import {
  createFloatingTabStatusDropController,
  moveFloatingTabRowToStatus,
} from "./floatingTabStatusDrop.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value) {
  return String(value ?? "tab")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tab";
}

export const floatingTabRows = {
  Active: [
    ["Confirm kickoff packet", "Customer Success", "Today"],
    ["Map imported account list", "Operations", "May 10"],
    ["Prepare launch checklist", "Implementation", "May 12"],
  ],
  Review: [
    ["Approve billing handoff", "Finance", "Today"],
    ["Check customer training notes", "Enablement", "May 9"],
    ["Review final import sample", "Operations", "May 11"],
  ],
  Blocked: [
    ["Wait for security contact", "Customer", "Aging"],
    ["Resolve duplicate workspace names", "Support", "Needs owner"],
  ],
  Done: [
    ["Create workspace shell", "Platform", "Closed"],
    ["Invite primary admins", "Customer Success", "Closed"],
    ["Archive old kickoff notes", "Operations", "Closed"],
  ],
  Escalated: [
    ["Resolve executive blocker", "Leadership", "Today"],
    ["Approve exception path", "Operations", "Today"],
    ["Confirm customer owner", "Customer Success", "Tomorrow"],
  ],
  Waiting: [
    ["Receive security worksheet", "Customer", "May 14"],
    ["Wait for vendor export", "Integration", "May 15"],
    ["Confirm legal review", "Legal", "May 16"],
  ],
  Scheduled: [
    ["Run kickoff workshop", "Implementation", "May 20"],
    ["Open sandbox training", "Enablement", "May 21"],
    ["Review launch metrics", "Operations", "May 24"],
  ],
  Archived: [
    ["Close discovery notes", "Customer Success", "Closed"],
    ["Archive import dry run", "Operations", "Closed"],
    ["Store launch signoff", "Implementation", "Closed"],
  ],
  Paused: [
    ["Hold rollout checklist", "Implementation", "Paused"],
    ["Pause vendor review", "Integration", "Paused"],
    ["Defer training update", "Enablement", "Paused"],
  ],
  Snoozed: [
    ["Revisit sandbox cleanup", "Operations", "Next week"],
    ["Follow up on optional import", "Customer Success", "Later"],
    ["Check deferred launch survey", "Enablement", "Later"],
  ],
  Deferred: [
    ["Move optional mapping", "Operations", "Next cycle"],
    ["Defer customer training add-on", "Enablement", "Next cycle"],
    ["Hold reporting export", "Analytics", "Next cycle"],
  ],
  Cancelled: [
    ["Stop duplicate onboarding path", "Operations", "Stopped"],
  ],
};

export const floatingSubTabs = {
  Active: [
    ["All active", 12, false],
    ["Assigned", 7, false],
    ["Due soon", 3, true],
  ],
  Review: [
    ["All review", 4, true],
    ["Needs approval", 2, true],
    ["Changes requested", 2, false],
  ],
  Blocked: [
    ["All blocked", 2, true],
    ["Customer", 1, true],
    ["Internal", 1, false],
  ],
  Done: [
    ["All done", 31, false],
    ["This week", 8, false],
    ["Archived", 23, false],
  ],
  Escalated: [
    ["All escalated", 5, true],
    ["Executive", 2, true],
    ["Exception", 3, true],
  ],
  Waiting: [
    ["All waiting", 18, false],
    ["Customer", 11, true],
    ["Vendor", 7, false],
  ],
  Scheduled: [
    ["All scheduled", 9, false],
    ["This month", 6, false],
    ["Next month", 3, false],
  ],
  Archived: [
    ["All archived", 44, false],
    ["Launch", 18, false],
    ["Discovery", 26, false],
  ],
  Paused: [
    ["All paused", 6, false],
    ["Customer", 4, false],
    ["Internal", 2, false],
  ],
  Snoozed: [
    ["All snoozed", 3, false],
    ["Next week", 2, false],
    ["Later", 1, false],
  ],
  Deferred: [
    ["All deferred", 7, false],
    ["Next cycle", 5, false],
    ["No date", 2, false],
  ],
  Cancelled: [
    ["All cancelled", 1, false],
    ["Duplicate", 1, false],
  ],
};

export const rowPackingRules = {
  single: { maxTabsPerRow: 10, maxRows: 1 },
  double: { maxTabsPerRow: 5, maxRows: 2 },
};

const floatingTabThemeOptions = new Set(["normal", "dark", "desert"]);
const floatingTabZoomOptions = new Set(["-100", "-50", "0", "50", "100"]);

export const floatingTabCategories = {
  status: [
    ["Active", "In motion", 12, false],
    ["Review", "Needs a decision", 4, true],
    ["Blocked", "Waiting on input", 2, true],
    ["Done", "Closed this cycle", 31, false],
    ["Escalated", "Leadership review", 5, true],
    ["Waiting", "External response", 18, false],
    ["Scheduled", "Future work", 9, false],
    ["Archived", "Reference only", 44, false],
    ["Paused", "Temporarily held", 6, false],
    ["Snoozed", "Hidden until later", 3, false],
    ["Deferred", "Out of cycle", 7, false],
    ["Cancelled", "Stopped", 1, false],
  ],
  priority: [
    ["Critical", "Immediate action", 3, true],
    ["High", "This week", 9, true],
    ["Medium", "Planned work", 18, false],
    ["Low", "Can wait", 21, false],
    ["No priority", "Needs triage", 6, true],
    ["Customer risk", "Visible impact", 4, true],
    ["Revenue risk", "Commercial impact", 2, true],
    ["Compliance", "Policy review", 5, true],
    ["Internal", "Team cleanup", 11, false],
    ["Opportunity", "Nice to have", 7, false],
    ["Monitor", "Watch list", 10, false],
    ["Parked", "No action", 1, false],
  ],
  owner: [
    ["Success", "Customer team", 14, false],
    ["Operations", "Process owner", 17, false],
    ["Platform", "Core product", 8, false],
    ["Finance", "Billing handoff", 5, true],
    ["Enablement", "Training work", 6, false],
    ["Support", "Customer issue", 11, true],
    ["Legal", "Contract review", 3, true],
    ["Security", "Risk review", 4, true],
    ["Integration", "Data movement", 9, false],
    ["Leadership", "Executive call", 2, true],
    ["Analytics", "Reporting work", 7, false],
    ["Unassigned", "Needs owner", 1, true],
  ],
};

function setActiveChip(buttons, activeButton) {
  for (const button of buttons) {
    const active = button === activeButton;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function renderFloatingTabRows(label, rowsByLabel = floatingTabRows, category = "") {
  const categoryRows = category && rowsByLabel?.[category] && typeof rowsByLabel[category] === "object"
    ? rowsByLabel[category]
    : null;
  const rows = categoryRows?.[label] ?? rowsByLabel[label] ?? rowsByLabel.Active ?? [];
  return rows
    .map(
      ([title, owner, due]) => `
        <article class="floating-tab-row">
          <span class="floating-tab-row-marker" aria-hidden="true"></span>
          <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(owner)}</span></div>
          <small>${escapeHtml(due)}</small>
        </article>
      `,
    )
    .join("");
}

function renderRows(list, label, rowsByLabel = floatingTabRows, category = "") {
  list.innerHTML = renderFloatingTabRows(label, rowsByLabel, category);
}

function getCategoryRows(rowsByLabel, category) {
  return category && rowsByLabel?.[category] && typeof rowsByLabel[category] === "object"
    ? rowsByLabel[category]
    : rowsByLabel;
}

function renderSubTabs(container, label, attentionEnabled = false, subTabsByLabel = floatingSubTabs) {
  const tabs = subTabsByLabel[label] ?? subTabsByLabel.Active ?? [];
  container.innerHTML = tabs
    .map(
      ([title, count], index) => `
        <button
          class="accessibility-chip floating-tab-sub-tab${index === 0 ? " active" : ""}"
          type="button"
          role="tab"
          aria-selected="${index === 0 ? "true" : "false"}"
          aria-label="${escapeHtml(title)}, ${escapeHtml(count)} records${attentionEnabled && tabs[index]?.[2] ? ", needs attention" : ""}"
          data-sub-tab-attention="${tabs[index]?.[2] ? "true" : "false"}"
        >
          <span>${escapeHtml(title)}</span>
          <strong>${escapeHtml(count)}</strong>
          <em>Needs attention</em>
        </button>
      `,
    )
    .join("");
}

export function renderFloatingTabHeader({
  categories = floatingTabCategories,
  rowsByLabel = floatingTabRows,
  activeCategory = "status",
  activeIndex = 0,
  instanceId = "floating-tab",
  categoryMetadata = {},
  ariaLabel = "Project status views",
  tablistLabel = "Project status filters",
  subTabLabel = "Nested project status views",
  panelKicker = "Selected view",
} = {}) {
  const idBase = slugify(instanceId);
  const ids = {
    header: `${idBase}-header`,
    categoryToggle: `${idBase}-category-toggle`,
    collapseToggle: `${idBase}-collapse-toggle`,
    mainRow: `${idBase}-main-row`,
    scrollLeft: `${idBase}-scroll-left`,
    tabs: `${idBase}-status-tabs`,
    overflowLeft: `${idBase}-overflow-summary-left`,
    overflowRight: `${idBase}-overflow-summary-right`,
    scrollRight: `${idBase}-scroll-right`,
    collapsedSummary: `${idBase}-collapsed-summary`,
    collapsedTitle: `${idBase}-collapsed-title`,
    collapsedCount: `${idBase}-collapsed-count`,
    categoryDrawer: `${idBase}-category-drawer`,
    subTabs: `${idBase}-sub-tabs`,
    panel: `${idBase}-panel`,
    list: `${idBase}-list`,
    panelTitle: `${idBase}-panel-title`,
    panelCount: `${idBase}-panel-count`,
  };
  const categoryEntries = Object.entries(categories);
  const safeCategory = categories[activeCategory] ? activeCategory : categoryEntries[0]?.[0] ?? "status";
  const items = categories[safeCategory] ?? [];
  const maxItemCount = Math.max(0, ...categoryEntries.map(([, categoryItems]) => categoryItems.length));
  const activeItem = items[activeIndex] ?? items[0] ?? ["Active", "In motion", 0, false];
  const [activeLabel, , activeCount] = activeItem;
  const tabButtons = Array.from({ length: maxItemCount })
    .map((_, index) => {
      const item = items[index];
      const [label, meta, count, attention] = item ?? ["", "", 0, false];
      const extendedClass = index >= 4 ? " floating-tab-card-extended" : "";
      const overflowClass = index >= 8 ? " floating-tab-card-overflow-candidate" : "";
      const hiddenClass = item ? "" : " hidden floating-tab-card-empty";
      const activeClass = item && index === activeIndex ? " active" : "";
      const attentionMarkup = attention ? '<span class="floating-tab-attention-label">Needs attention</span>' : "";
      const hiddenAttributes = item ? "" : ' aria-hidden="true" disabled';

      return `
                    <button class="floating-tab-card${extendedClass}${overflowClass}${hiddenClass}${activeClass}" id="${ids.header}-${slugify(label || `slot-${index + 1}`)}-${index + 1}" type="button" role="tab" aria-selected="${item && index === activeIndex ? "true" : "false"}" aria-controls="${ids.panel}" data-tab-label="${escapeHtml(label)}" data-tab-count="${escapeHtml(count)}"${attention ? ' data-tab-attention="true"' : ""}${hiddenAttributes}>
                      <span class="floating-tab-card-copy">
                        <span class="floating-tab-card-title">${escapeHtml(label)}</span>
                        <span class="floating-tab-card-meta">${escapeHtml(meta)}</span>
                        ${attentionMarkup}
                      </span>
                      <span class="floating-tab-card-count">${escapeHtml(count)}</span>
                      <span class="floating-tab-card-drop-overlay" aria-hidden="true">Drop to move here</span>
                    </button>`;
    })
    .join("");
  const categoryMeta = {
    status: ["Status", "Work state"],
    priority: ["Priority", "Urgency bands"],
    owner: ["Owner", "Team handoffs"],
    ...categoryMetadata,
  };
  const categoryButtons = categoryEntries
    .map(([key]) => {
      const [label, meta] = categoryMeta[key] ?? [key, "Tab group"];
      const active = key === safeCategory;
      return `
                    <button class="floating-tab-category-option${active ? " active" : ""}" type="button" role="radio" aria-checked="${active ? "true" : "false"}" data-floating-tab-category="${escapeHtml(key)}">
                      <span>${escapeHtml(label)}</span>
                      <small>${escapeHtml(meta)}</small>
                    </button>`;
    })
    .join("");

  return `
              <nav id="${ids.header}" class="floating-tab-header" aria-label="${escapeHtml(ariaLabel)}" data-floating-tab-expandable="false" data-floating-tab-content-collapsed="false" data-floating-tab-sub-tabs="false" data-floating-tab-attention="false" data-floating-tab-layout="horizontal" data-floating-tab-row-packing="single" data-floating-tab-overflow-count="0">
                <button
                  id="${ids.categoryToggle}"
                  class="icon-button floating-tab-category-toggle tooltip-anchor"
                  type="button"
                  aria-expanded="false"
                  aria-controls="${ids.categoryDrawer}"
                  aria-label="Choose tab category"
                  data-tooltip="Choose tab category"
                >
                  <span class="icon-button-glyph" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false"><path d="M5 7h14M8 12h8M10 17h4" /></svg>
                  </span>
                </button>
                <button
                  id="${ids.collapseToggle}"
                  class="icon-button floating-tab-collapse-toggle hidden"
                  type="button"
                  aria-expanded="true"
                  aria-controls="${ids.panel}"
                  aria-label="Hide floating tab content"
                >
                  <span class="icon-button-glyph" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false"><path d="M7 14.5 12 9l5 5.5" /></svg>
                  </span>
                </button>
                <div class="floating-tab-main-row">
                  <button id="${ids.scrollLeft}" class="icon-button floating-tab-scroll-button floating-tab-scroll-button-left" type="button" aria-label="Scroll tabs left">
                    <span class="icon-button-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="m14.5 6-5.5 6 5.5 6" /></svg></span>
                  </button>
                  <div id="${ids.tabs}" class="floating-tab-scroll" role="tablist" aria-label="${escapeHtml(tablistLabel)}">
                    <span id="${ids.overflowLeft}" class="floating-tab-overflow-summary floating-tab-overflow-summary-left hidden" aria-live="polite">1 more</span>
${tabButtons}
                    <span id="${ids.overflowRight}" class="floating-tab-overflow-summary floating-tab-overflow-summary-right hidden" aria-live="polite">2 more</span>
                  </div>
                  <button id="${ids.scrollRight}" class="icon-button floating-tab-scroll-button floating-tab-scroll-button-right" type="button" aria-label="Scroll tabs right">
                    <span class="icon-button-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="m9.5 6 5.5 6-5.5 6" /></svg></span>
                  </button>
                </div>
                <div id="${ids.collapsedSummary}" class="floating-tab-collapsed-summary hidden" aria-live="polite">
                  <span id="${ids.collapsedTitle}">${escapeHtml(activeLabel)}</span>
                  <span id="${ids.collapsedCount}">Content hidden, ${escapeHtml(activeCount)} records</span>
                </div>
                <aside id="${ids.categoryDrawer}" class="floating-tab-category-drawer hidden" aria-label="Tab category selector">
                  <p class="floating-tab-category-drawer-label">Tab category</p>
                  <div class="floating-tab-category-options" role="radiogroup" aria-label="Tab category">
${categoryButtons}
                  </div>
                </aside>
                <div id="${ids.subTabs}" class="floating-tab-sub-tabs hidden" role="tablist" aria-label="${escapeHtml(subTabLabel)}"></div>
              </nav>

              <section id="${ids.panel}" class="floating-tab-list-panel" role="tabpanel" aria-labelledby="${ids.header}-${slugify(activeLabel)}-${activeIndex + 1}" tabindex="0">
                <div class="floating-tab-list-header">
                  <div>
                    <p class="floating-tab-project-kicker">${escapeHtml(panelKicker)}</p>
                    <h4 id="${ids.panelTitle}">${escapeHtml(activeLabel)} work</h4>
                  </div>
                  <span id="${ids.panelCount}" class="floating-tab-panel-count">${escapeHtml(activeCount)} records</span>
                </div>
                <div id="${ids.list}" class="floating-tab-list">
                  ${renderFloatingTabRows(activeLabel, rowsByLabel, safeCategory)}
                </div>
              </section>`;
}

export function mountFloatingTabHeader({
  root = document,
  rowsByLabel = floatingTabRows,
  categories = floatingTabCategories,
  subTabsByLabel = floatingSubTabs,
  displayRoot = document.documentElement,
  initialParams = null,
  instanceId = "floating-tab",
  workspaceId = "floating-tab-workspace",
  onCategoryChange = null,
  onTabChange = null,
} = {}) {
  const idBase = slugify(instanceId);
  const workspaceSelector = `#${CSS.escape(workspaceId)}`;
  const scope = root instanceof Document ? root : root.ownerDocument;
  const queryRoot = root instanceof Document ? root : root;
  const header = queryRoot.querySelector(`#${idBase}-header`);
  const workspace = queryRoot instanceof HTMLElement && queryRoot.id === workspaceId
    ? queryRoot
    : queryRoot.querySelector(workspaceSelector);
  const tabButtons = Array.from(queryRoot.querySelectorAll(".floating-tab-card"));
  const panel = queryRoot.querySelector(`#${idBase}-panel`);
  const panelTitle = queryRoot.querySelector(`#${idBase}-panel-title`);
  const panelCount = queryRoot.querySelector(`#${idBase}-panel-count`);
  const readout = scope.querySelector("#floating-tab-readout");
  const list = queryRoot.querySelector(`#${idBase}-list`);
  const collapsedSummary = queryRoot.querySelector(`#${idBase}-collapsed-summary`);
  const collapsedTitle = queryRoot.querySelector(`#${idBase}-collapsed-title`);
  const collapsedCount = queryRoot.querySelector(`#${idBase}-collapsed-count`);
  const collapseToggle = queryRoot.querySelector(`#${idBase}-collapse-toggle`);
  const subTabContainer = queryRoot.querySelector(`#${idBase}-sub-tabs`);
  const tabScroller = queryRoot.querySelector(`#${idBase}-status-tabs`);
  const scrollLeftButton = queryRoot.querySelector(`#${idBase}-scroll-left`);
  const scrollRightButton = queryRoot.querySelector(`#${idBase}-scroll-right`);
  const categoryToggle = queryRoot.querySelector(`#${idBase}-category-toggle`);
  const categoryDrawer = queryRoot.querySelector(`#${idBase}-category-drawer`);
  const categoryButtons = Array.from(queryRoot.querySelectorAll("button[data-floating-tab-category]"));
  const expandableButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-expandable]"));
  const categorySwitchButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-category-switch]"));
  const collapseStateButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-collapse-state]"));
  const subTabToggleButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-sub-tabs]"));
  const attentionToggleButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-attention]"));
  const layoutButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-layout]"));
  const rowPackingButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-row-packing]"));
  const tabCountButtons = Array.from(scope.querySelectorAll("button[data-floating-tab-count]"));
  const overflowSummaryLeft = queryRoot.querySelector(`#${idBase}-overflow-summary-left`);
  const overflowSummaryRight = queryRoot.querySelector(`#${idBase}-overflow-summary-right`);
  const displayScope = displayRoot instanceof HTMLElement ? displayRoot : document.documentElement;

  if (
    !header ||
    !workspace ||
    !tabButtons.length ||
    !panel ||
    !panelTitle ||
    !panelCount ||
    !list ||
    !collapsedSummary ||
    !collapsedTitle ||
    !collapsedCount ||
    !collapseToggle ||
    !subTabContainer ||
    !tabScroller ||
    !scrollLeftButton ||
    !scrollRightButton ||
    !categoryToggle ||
    !categoryDrawer ||
    !overflowSummaryLeft ||
    !overflowSummaryRight
  ) {
    return;
  }

  let activeLabel = "Active";
  let activeCount = "12";
  let expandable = false;
  let categorySwitchEnabled = true;
  let collapsed = false;
  let subTabsEnabled = false;
  let attentionEnabled = false;
  let layout = "horizontal";
  let rowPacking = "single";
  let tabCount = 5;
  let tabWindowStart = 0;
  let requestedWindowPosition = "start";
  let shouldOpenCategoryDrawer = false;
  let initialFocusTarget = "";
  let category = "status";
  let densityFrame = 0;
  let measuredVisibleLimit = null;
  let measuredCrowded = false;
  let applyingMeasuredDensity = false;
  let lastObservedInlineSize = 0;
  let resizeObserver = null;

  function getBooleanParam(params, name, fallback) {
    const value = params.get(name);
    if (value === "true" || value === "on" || value === "1") {
      return true;
    }
    if (value === "false" || value === "off" || value === "0") {
      return false;
    }
    return fallback;
  }

  function syncInitialChipState() {
    setActiveChip(
      expandableButtons,
      expandableButtons.find((button) => button.dataset.floatingTabExpandable === (expandable ? "on" : "off")),
    );
    setActiveChip(
      categorySwitchButtons,
      categorySwitchButtons.find((button) => button.dataset.floatingTabCategorySwitch === (categorySwitchEnabled ? "on" : "off")),
    );
    setActiveChip(
      collapseStateButtons,
      collapseStateButtons.find((button) => button.dataset.floatingTabCollapseState === (collapsed ? "collapsed" : "expanded")),
    );
    setActiveChip(
      subTabToggleButtons,
      subTabToggleButtons.find((button) => button.dataset.floatingTabSubTabs === (subTabsEnabled ? "on" : "off")),
    );
    setActiveChip(
      attentionToggleButtons,
      attentionToggleButtons.find((button) => button.dataset.floatingTabAttention === (attentionEnabled ? "on" : "off")),
    );
    setActiveChip(
      layoutButtons,
      layoutButtons.find((button) => button.dataset.floatingTabLayout === layout),
    );
    setActiveChip(
      rowPackingButtons,
      rowPackingButtons.find((button) => button.dataset.floatingTabRowPacking === rowPacking),
    );
    setActiveChip(
      tabCountButtons,
      tabCountButtons.find((button) => Number(button.dataset.floatingTabCount) === tabCount),
    );
    categoryButtons.forEach((button) => {
      const active = button.dataset.floatingTabCategory === category;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  function applyInitialStateFromUrl() {
    const params = initialParams instanceof URLSearchParams
      ? initialParams
      : new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    const direction = params.get("dir");
    const zoom = params.get("zoom");

    if (floatingTabThemeOptions.has(theme)) {
      if (theme === "normal") {
        delete displayScope.dataset.theme;
        delete displayScope.dataset.themeScope;
      } else {
        displayScope.dataset.themeScope = theme;
      }
    }
    if (direction === "rtl" || direction === "ltr") {
      displayScope.setAttribute("dir", direction);
    }
    if (floatingTabZoomOptions.has(zoom)) {
      displayScope.style.setProperty("--ui-scale", String(1 + Number(zoom) / 200));
    }

    expandable = getBooleanParam(params, "expandable", expandable);
    categorySwitchEnabled = getBooleanParam(params, "categorySwitch", categorySwitchEnabled);
    collapsed = getBooleanParam(params, "collapsed", collapsed);
    subTabsEnabled = getBooleanParam(params, "subTabs", subTabsEnabled);
    attentionEnabled = getBooleanParam(params, "attention", attentionEnabled);
    layout = params.get("layout") === "vertical" ? "vertical" : layout;
    rowPacking = params.get("rowPacking") === "double" ? "double" : rowPacking;
    const requestedTabCount = Number(params.get("tabs"));
    if ([4, 5, 10, 12, 16].includes(requestedTabCount)) {
      tabCount = requestedTabCount;
    }
    if (categories[params.get("category")]) {
      category = params.get("category");
    }
    if (params.get("window") === "middle" || params.get("window") === "end") {
      requestedWindowPosition = params.get("window");
    }
    const requestedWindowStart = Number(params.get("windowStart"));
    if (Number.isInteger(requestedWindowStart) && requestedWindowStart >= 0) {
      tabWindowStart = requestedWindowStart;
      requestedWindowPosition = "";
    }
    shouldOpenCategoryDrawer = params.get("drawer") === "open" || params.get("categoryOpen") === "true";
    initialFocusTarget = params.get("focus") ?? "";
    syncInitialChipState();
  }

  function isAttentionTab(button) {
    return attentionEnabled && button?.dataset.tabAttention === "true";
  }

  function syncCollapsedSummary() {
    collapsedTitle.textContent = activeLabel;
    collapsedCount.textContent = `Content hidden, ${activeCount} records${isAttentionTab(getActiveTabButton()) ? ", needs attention" : ""}`;
  }

  function getRowData(row) {
    const title = row.querySelector("strong")?.textContent?.trim() ?? "";
    const owner = row.querySelector("span:not(.floating-tab-row-marker)")?.textContent?.trim() ?? "";
    const due = row.querySelector("small")?.textContent?.trim() ?? "";
    return [title, owner, due];
  }

  function getTabItem(label) {
    return (categories[category] ?? []).find((item) => item[0] === label);
  }

  function setTabCount(label, delta) {
    const item = getTabItem(label);
    if (!item) {
      return;
    }
    item[2] = Math.max(0, Number(item[2] ?? 0) + delta);
    const button = tabButtons.find((tab) => tab.dataset.tabLabel === label);
    if (button instanceof HTMLElement) {
      button.dataset.tabCount = String(item[2]);
      const count = button.querySelector(".floating-tab-card-count");
      if (count instanceof HTMLElement) {
        count.textContent = String(item[2]);
      }
    }
  }

  function moveDraggedRowToStatus(targetLabel) {
    const draggedRow = rowReorderController.getDraggedRow();
    return moveFloatingTabRowToStatus({
      draggedRow,
      targetLabel,
      activeLabel,
      categoryRows: getCategoryRows(rowsByLabel, category),
      getRowData,
      setTabCount,
      getTabItem,
      setActiveCount: (nextActiveCount) => {
        activeCount = nextActiveCount;
      },
      panelCount,
      syncCollapsedSummary,
      renderActiveRows: () => renderRows(list, activeLabel, rowsByLabel, category),
      syncRows: () => rowReorderController.syncRows(),
    });
  }

  function syncActiveRowsFromDom() {
    const categoryRows = getCategoryRows(rowsByLabel, category);
    categoryRows[activeLabel] = Array.from(list.querySelectorAll(".floating-tab-row"))
      .filter((row) => row instanceof HTMLElement)
      .map((row) => getRowData(row));
  }

  let statusDropController = null;
  const rowReorderController = createFloatingTabRowReorderController({
    list,
    getRows: () => list.querySelectorAll(".floating-tab-row"),
    getRowLabel: (row) => row.querySelector("strong")?.textContent?.trim() ?? "Row",
    onRowsReordered: syncActiveRowsFromDom,
    onClearExternalTargets: () => statusDropController?.clearDropTargets(),
  });

  statusDropController = createFloatingTabStatusDropController({
    header,
    tabButtons,
    getDraggedRow: () => rowReorderController.getDraggedRow(),
    getActiveLabel: () => activeLabel,
    clearRowDropMarker: () => rowReorderController.clearDropMarker(),
    clearDragState: () => rowReorderController.clearDragState(),
    moveDraggedRowToStatus,
    onMoved: () => {
      if (typeof onTabChange === "function") {
        onTabChange({ category, label: activeLabel, count: activeCount, movement: "status-drop" });
      }
    },
  });

  function getActiveTabButton() {
    return tabButtons.find((button) => button.classList.contains("active") && !button.disabled && !button.classList.contains("hidden"))
      ?? tabButtons.find((button) => !button.disabled && !button.classList.contains("hidden"))
      ?? tabButtons[0];
  }

  function syncAttentionLabels() {
    tabButtons.forEach((button) => {
      const baseLabel = button.dataset.tabLabel ?? button.textContent?.trim() ?? "Status";
      const count = button.dataset.tabCount ?? "0";
      const attentionSuffix = isAttentionTab(button) ? ", needs attention" : "";
      button.setAttribute("aria-label", `${baseLabel}, ${count} records${attentionSuffix}`);
    });
  }

  function syncTabOverflowTooltips() {
    const candidates = Array.from(
      header.querySelectorAll(".floating-tab-card-title, .floating-tab-card-meta, .floating-tab-attention-label"),
    );
    const truncatedLabelsByCard = new Map();

    function getRenderedTextWidth(element) {
      const range = document.createRange();
      range.selectNodeContents(element);
      const width = range.getBoundingClientRect().width;
      range.detach();
      return width;
    }

    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) {
        continue;
      }

      candidate.classList.add("tooltip-anchor");
      const card = candidate.closest(".floating-tab-card");
      const hidden = candidate.closest(".hidden") || getComputedStyle(candidate).display === "none";
      const label = candidate.textContent?.trim() ?? "";
      const redDotReservedWidth =
        candidate.classList.contains("floating-tab-card-title")
        && card instanceof HTMLElement
        && isAttentionTab(card)
          ? 16
          : 0;
      const renderedTextWidth = getRenderedTextWidth(candidate);
      const truncated = renderedTextWidth + redDotReservedWidth > candidate.clientWidth + 1;
      if (!hidden && label && truncated) {
        candidate.dataset.tooltip = label;
        if (card instanceof HTMLElement) {
          const labels = truncatedLabelsByCard.get(card) ?? [];
          const tabLabel = card.dataset.tabLabel?.trim() ?? "";
          if (tabLabel && !labels.includes(tabLabel)) {
            labels.push(tabLabel);
          }
          if (!labels.includes(label)) {
            labels.push(label);
          }
          truncatedLabelsByCard.set(card, labels);
        }
      } else {
        delete candidate.dataset.tooltip;
      }
    }

    for (const card of tabButtons) {
      const labels = truncatedLabelsByCard.get(card) ?? [];
      card.classList.toggle("tooltip-anchor", labels.length > 0);
      if (labels.length > 0) {
        card.dataset.tooltip = labels.join(", ");
      } else {
        delete card.dataset.tooltip;
      }
    }
  }

  function textOverflows(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    return element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1;
  }

  function wouldRoomyCardsFit(visibleCards) {
    const scrollerStyle = window.getComputedStyle(tabScroller);
    const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
    const roomyMinWidth = 8.5 * rootFontSize;
    const columnGap = Number.parseFloat(scrollerStyle.columnGap || scrollerStyle.gap) || 0;
    const roomyFitWidth = (visibleCards.length * roomyMinWidth) + Math.max(0, visibleCards.length - 1) * columnGap;
    return roomyFitWidth <= tabScroller.clientWidth + 1;
  }

  function roomyLabelsWouldOverflow(visibleCards) {
    const previousCrowded = measuredCrowded;
    if (!previousCrowded) {
      return false;
    }

    header.dataset.floatingTabCrowded = "false";
    const labelsOverflow = visibleCards.some((button) => {
      const title = button.querySelector(".floating-tab-card-title");
      const meta = button.querySelector(".floating-tab-card-meta");
      const attention = button.querySelector(".floating-tab-attention-label");
      return textOverflows(title) || textOverflows(meta) || (isAttentionTab(button) && textOverflows(attention));
    });
    header.dataset.floatingTabCrowded = "true";
    return labelsOverflow;
  }

  function syncMeasuredCardDensity() {
    if (layout !== "horizontal") {
      header.dataset.floatingTabCrowded = "false";
      measuredVisibleLimit = null;
      measuredCrowded = false;
      return;
    }

    const visibleCards = tabButtons.filter(
      (button) =>
        !button.classList.contains("hidden")
        && !button.classList.contains("floating-tab-card-fixture-hidden")
        && !button.classList.contains("floating-tab-card-overflow-hidden"),
    );
    if (!visibleCards.length) {
      return;
    }

    let railOverflow = tabScroller.scrollWidth > tabScroller.clientWidth + 1;
    const textOverflow = visibleCards.some((button) => {
        const title = button.querySelector(".floating-tab-card-title");
        const meta = button.querySelector(".floating-tab-card-meta");
        const attention = button.querySelector(".floating-tab-attention-label");
        return textOverflows(title) || textOverflows(meta) || (isAttentionTab(button) && textOverflows(attention));
    });
    if (measuredCrowded) {
      const scrollerStyle = window.getComputedStyle(tabScroller);
      const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
      const compactMinWidth = 4.5 * rootFontSize;
      const columnGap = Number.parseFloat(scrollerStyle.columnGap || scrollerStyle.gap) || 0;
      const compactFitWidth = (visibleCards.length * compactMinWidth) + Math.max(0, visibleCards.length - 1) * columnGap;
      if (
        measuredVisibleLimit === null
        && wouldRoomyCardsFit(visibleCards)
        && !roomyLabelsWouldOverflow(visibleCards)
      ) {
        measuredVisibleLimit = null;
        measuredCrowded = false;
        applyingMeasuredDensity = true;
        applyVariantState();
        applyingMeasuredDensity = false;
        scheduleMeasuredCardDensity();
        return;
      }
      if (railOverflow) {
        railOverflow = compactFitWidth > tabScroller.clientWidth + 1;
      }
    }
    const fittedOverflow = measuredCrowded ? railOverflow : railOverflow || textOverflow;

    if (!fittedOverflow) {
      return;
    }

    if (!measuredCrowded) {
      measuredCrowded = true;
      applyingMeasuredDensity = true;
      applyVariantState();
      applyingMeasuredDensity = false;
      return;
    }

    if (visibleCards.length > 1) {
      const currentSlotLimit = Number.parseInt(header.style.getPropertyValue("--floating-tab-visible-slots"), 10);
      measuredVisibleLimit = Math.max(1, (Number.isFinite(currentSlotLimit) ? currentSlotLimit : visibleCards.length) - 1);
      applyingMeasuredDensity = true;
      applyVariantState();
      applyingMeasuredDensity = false;
      return;
    }

    header.dataset.floatingTabCrowded = "true";
  }

  function scheduleMeasuredCardDensity() {
    if (densityFrame) {
      window.cancelAnimationFrame(densityFrame);
      densityFrame = 0;
    }
    densityFrame = window.requestAnimationFrame(() => {
      densityFrame = 0;
      syncMeasuredCardDensity();
      syncScrollButtons();
      syncTabOverflowTooltips();
    });
  }

  function resetMeasuredCardDensity() {
    measuredVisibleLimit = null;
    measuredCrowded = false;
    applyVariantState();
    settleMeasuredCardDensity();
  }

  function settleMeasuredCardDensity() {
    if (layout !== "horizontal") {
      return;
    }
    for (let index = 0; index < tabButtons.length + 1; index += 1) {
      const beforeCrowded = measuredCrowded;
      const beforeLimit = measuredVisibleLimit;
      syncMeasuredCardDensity();
      if (beforeCrowded === measuredCrowded && beforeLimit === measuredVisibleLimit) {
        break;
      }
    }
    syncScrollButtons();
    syncTabOverflowTooltips();
  }

  function setOverflowSummary(summary, count, side) {
    summary.classList.toggle("hidden", count === 0);
    summary.textContent = `${count} more`;
    summary.setAttribute(
      "aria-label",
      count === 0 ? `No tabs hidden on the ${side}` : `${count} tabs hidden on the ${side}`,
    );
  }

  function applyCategory(nextCategory) {
    measuredVisibleLimit = null;
    category = categories[nextCategory] ? nextCategory : Object.keys(categories)[0] ?? "status";
    const items = categories[category];
    tabButtons.forEach((button, index) => {
      const item = items[index];
      if (!item) {
        button.classList.add("hidden", "floating-tab-card-empty");
        button.disabled = true;
        button.setAttribute("aria-hidden", "true");
        button.setAttribute("aria-selected", "false");
        button.classList.remove("active");
        button.dataset.tabLabel = "";
        button.dataset.tabCount = "0";
        button.dataset.tabAttention = "false";
        button.querySelector(".floating-tab-card-title").textContent = "";
        button.querySelector(".floating-tab-card-meta").textContent = "";
        button.querySelector(".floating-tab-card-count").textContent = "0";
        return;
      }

      const [label, meta, count, attention] = item;
      button.classList.remove("hidden", "floating-tab-card-empty");
      button.disabled = false;
      button.removeAttribute("aria-hidden");
      button.dataset.tabLabel = label;
      button.dataset.tabCount = String(count);
      button.dataset.tabAttention = attention ? "true" : "false";
      button.querySelector(".floating-tab-card-title").textContent = label;
      button.querySelector(".floating-tab-card-meta").textContent = meta;
      button.querySelector(".floating-tab-card-count").textContent = String(count);
    });

    const activeTab = tabButtons.find((button) => button.classList.contains("active") && !button.disabled && !button.classList.contains("hidden"))
      ?? tabButtons.find((button) => !button.disabled && !button.classList.contains("hidden"))
      ?? tabButtons[0];
    tabButtons.forEach((button) => {
      const active = button === activeTab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    const activeButton = getActiveTabButton();
    activeLabel = activeButton.dataset.tabLabel ?? "Active";
    activeCount = activeButton.dataset.tabCount ?? "0";
    panel.setAttribute("aria-labelledby", activeButton.id);
    panelTitle.textContent = `${activeLabel} work`;
    panelCount.textContent = `${activeCount} records`;
    if (readout instanceof HTMLElement) {
      readout.textContent = `Viewing ${activeLabel}, ${activeCount} records${isAttentionTab(activeButton) ? ", needs attention" : ""}`;
    }
    renderRows(list, activeLabel, rowsByLabel, category);
    rowReorderController.syncRows();
    if (typeof onCategoryChange === "function") {
      onCategoryChange({ category, label: activeLabel, count: activeCount });
    }
  }

  function applyVariantState() {
    if (!applyingMeasuredDensity) {
      measuredVisibleLimit = null;
      measuredCrowded = false;
    }
    const contentCollapsed = expandable && collapsed;
    const shouldShowSubTabs = subTabsEnabled;
    const rowRule = rowPackingRules[rowPacking] ?? rowPackingRules.single;
    const categoryItemCount = categories[category]?.length ?? tabButtons.length;
    const fixtureLimit = layout === "vertical" ? categoryItemCount : Math.min(tabCount, categoryItemCount);
    const rowCapacity = layout === "vertical" ? Number.POSITIVE_INFINITY : rowRule.maxTabsPerRow * rowRule.maxRows;
    const measuredLimit = Number.isInteger(measuredVisibleLimit)
      ? Math.max(1, Math.min(measuredVisibleLimit, fixtureLimit))
      : null;
    const baseVisibleLimit = Math.min(fixtureLimit, rowCapacity);
    const slotLimit = measuredLimit ?? rowCapacity;
    const exceedsRowCapacity = layout !== "vertical" && fixtureLimit > slotLimit;
    const maxWindowStart = exceedsRowCapacity ? Math.max(0, fixtureLimit - Math.max(1, slotLimit - 1)) : 0;
    if (exceedsRowCapacity && requestedWindowPosition) {
      tabWindowStart = requestedWindowPosition === "end" ? maxWindowStart : Math.floor(maxWindowStart / 2);
      requestedWindowPosition = "";
    }
    tabWindowStart = exceedsRowCapacity ? Math.min(tabWindowStart, maxWindowStart) : 0;
    const showLeftSummary = exceedsRowCapacity && tabWindowStart > 0;
    const showRightSummary = exceedsRowCapacity && tabWindowStart < maxWindowStart;
    const summarySlotCount = (showLeftSummary ? 1 : 0) + (showRightSummary ? 1 : 0);
    const visibleLimit = exceedsRowCapacity
      ? Math.max(1, slotLimit - summarySlotCount)
      : Math.min(fixtureLimit, slotLimit);
    const visibleSlotCount = visibleLimit + summarySlotCount;
    const visibleWindowEnd = tabWindowStart + visibleLimit;
    const hiddenLeftCount = showLeftSummary ? tabWindowStart : 0;
    const hiddenRightCount = showRightSummary ? fixtureLimit - visibleWindowEnd : 0;
    header.dataset.floatingTabExpandable = expandable ? "true" : "false";
    header.dataset.floatingTabCategorySwitch = categorySwitchEnabled ? "true" : "false";
    header.dataset.floatingTabContentCollapsed = contentCollapsed ? "true" : "false";
    header.dataset.floatingTabSubTabs = subTabsEnabled ? "true" : "false";
    header.dataset.floatingTabAttention = attentionEnabled ? "true" : "false";
    header.dataset.floatingTabLayout = layout;
    header.dataset.floatingTabRowPacking = rowPacking;
    header.dataset.floatingTabMaxTabsPerRow = String(rowRule.maxTabsPerRow);
    header.dataset.floatingTabMaxRows = String(rowRule.maxRows);
    header.dataset.floatingTabVisibleCount = String(visibleLimit);
    header.dataset.floatingTabWindowStart = String(tabWindowStart);
    header.dataset.floatingTabMaxWindowStart = String(maxWindowStart);
    header.dataset.floatingTabOverflowCount = String(hiddenLeftCount + hiddenRightCount);
    header.dataset.floatingTabOverflowLeftCount = String(hiddenLeftCount);
    header.dataset.floatingTabOverflowRightCount = String(hiddenRightCount);
    header.dataset.floatingTabCount = String(tabCount);
    header.dataset.floatingTabCategory = category;
    header.dataset.floatingTabCrowded = measuredCrowded ? "true" : "false";
    header.style.setProperty("--floating-tab-visible-slots", String(Math.max(1, visibleSlotCount)));
    workspace.dataset.floatingTabLayout = layout;
    workspace.dataset.floatingTabRowPacking = rowPacking;
    tabButtons.forEach((button, index) => {
      const outsideCategory = index >= categoryItemCount;
      const outsideFixture = outsideCategory || (layout !== "vertical" && index >= fixtureLimit);
      const outsideVisibleWindow = layout !== "vertical" && (index < tabWindowStart || index >= visibleWindowEnd);
      button.classList.toggle("floating-tab-card-fixture-hidden", outsideFixture);
      button.classList.toggle("floating-tab-card-overflow-hidden", !outsideFixture && outsideVisibleWindow);
    });
    setOverflowSummary(overflowSummaryLeft, hiddenLeftCount, "left");
    setOverflowSummary(overflowSummaryRight, hiddenRightCount, "right");
    categoryToggle.classList.toggle("hidden", !categorySwitchEnabled);
    if (!categorySwitchEnabled) {
      categoryDrawer.classList.add("hidden");
      categoryToggle.setAttribute("aria-expanded", "false");
    }
    collapseToggle.classList.toggle("hidden", !expandable);
    collapseToggle.setAttribute("aria-expanded", contentCollapsed ? "false" : "true");
    collapseToggle.setAttribute(
      "aria-label",
      contentCollapsed ? "Show floating tab content" : "Hide floating tab content",
    );
    panel.classList.toggle("hidden", contentCollapsed);
    panel.setAttribute("aria-hidden", contentCollapsed ? "true" : "false");
    collapsedSummary.classList.toggle("hidden", !contentCollapsed);
    if (shouldShowSubTabs) {
      subTabContainer.classList.remove("hidden");
    } else {
      subTabContainer.classList.add("hidden");
    }
    syncAttentionLabels();
    syncCollapsedSummary();
    renderSubTabs(subTabContainer, activeLabel, attentionEnabled, subTabsByLabel);
    scheduleMeasuredCardDensity();
  }

  function applyReferenceRoutePosture() {
    if (categorySwitchEnabled && shouldOpenCategoryDrawer) {
      categoryDrawer.classList.remove("hidden");
      categoryToggle.setAttribute("aria-expanded", "true");
    }

    if (initialFocusTarget === "truncated") {
      window.requestAnimationFrame(() => {
        syncTabOverflowTooltips();
        const truncatedTitle = Array.from(header.querySelectorAll(".floating-tab-card-title"))
          .find((candidate) => candidate instanceof HTMLElement && candidate.dataset.tooltip);
        const focusTarget = truncatedTitle?.closest(".floating-tab-card");
        if (focusTarget instanceof HTMLElement) {
          focusTarget.focus({ preventScroll: true });
        }
      });
    }
  }

  function selectTab(button) {
    tabButtons.forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", tab === button ? "true" : "false");
    });

    activeLabel = button.dataset.tabLabel ?? "Active";
    activeCount = button.dataset.tabCount ?? "0";
    panel.setAttribute("aria-labelledby", button.id);
    panelTitle.textContent = `${activeLabel} work`;
    panelCount.textContent = `${activeCount} records`;
    if (readout instanceof HTMLElement) {
      readout.textContent = `Viewing ${activeLabel}, ${activeCount} records${isAttentionTab(button) ? ", needs attention" : ""}`;
    }
    renderRows(list, activeLabel, rowsByLabel, category);
    rowReorderController.syncRows();
    if (typeof onTabChange === "function") {
      onTabChange({ category, label: activeLabel, count: activeCount });
    }
    applyVariantState();
  }

  rowReorderController.install();
  statusDropController.install();

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectTab(button);
    });
  });

  collapseToggle.addEventListener("click", () => {
    collapsed = !collapsed;
    applyVariantState();
    setActiveChip(
      collapseStateButtons,
      collapseStateButtons.find((button) => button.dataset.floatingTabCollapseState === (collapsed ? "collapsed" : "expanded")),
    );
  });

  expandableButtons.forEach((button) => {
    button.addEventListener("click", () => {
      expandable = button.dataset.floatingTabExpandable === "on";
      if (!expandable) {
        collapsed = false;
      }
      setActiveChip(expandableButtons, button);
      setActiveChip(
        collapseStateButtons,
        collapseStateButtons.find((item) => item.dataset.floatingTabCollapseState === (collapsed ? "collapsed" : "expanded")),
      );
      applyVariantState();
    });
  });

  categorySwitchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categorySwitchEnabled = button.dataset.floatingTabCategorySwitch === "on";
      setActiveChip(categorySwitchButtons, button);
      applyVariantState();
    });
  });

  collapseStateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      collapsed = button.dataset.floatingTabCollapseState === "collapsed";
      if (collapsed) {
        expandable = true;
        setActiveChip(
          expandableButtons,
          expandableButtons.find((item) => item.dataset.floatingTabExpandable === "on"),
        );
      }
      setActiveChip(collapseStateButtons, button);
      applyVariantState();
    });
  });

  subTabToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      subTabsEnabled = button.dataset.floatingTabSubTabs === "on";
      setActiveChip(subTabToggleButtons, button);
      applyVariantState();
    });
  });

  attentionToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      attentionEnabled = button.dataset.floatingTabAttention === "on";
      setActiveChip(attentionToggleButtons, button);
      selectTab(getActiveTabButton());
    });
  });

  layoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      measuredVisibleLimit = null;
      layout = button.dataset.floatingTabLayout ?? "horizontal";
      setActiveChip(layoutButtons, button);
      tabScroller.scrollLeft = 0;
      tabWindowStart = 0;
      applyVariantState();
    });
  });

  rowPackingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      measuredVisibleLimit = null;
      rowPacking = button.dataset.floatingTabRowPacking ?? "single";
      setActiveChip(rowPackingButtons, button);
      tabScroller.scrollLeft = 0;
      tabWindowStart = 0;
      applyVariantState();
    });
  });

  tabCountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      measuredVisibleLimit = null;
      tabCount = Number(button.dataset.floatingTabCount ?? "5");
      setActiveChip(tabCountButtons, button);
      tabScroller.scrollLeft = 0;
      tabWindowStart = 0;
      if (layout === "horizontal" && tabButtons.indexOf(getActiveTabButton()) >= tabCount) {
        selectTab(tabButtons[0]);
        return;
      }
      applyVariantState();
    });
  });

  categoryToggle.addEventListener("click", () => {
    const open = categoryDrawer.classList.toggle("hidden");
    categoryToggle.setAttribute("aria-expanded", open ? "false" : "true");
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-checked", active ? "true" : "false");
      });
      measuredVisibleLimit = null;
      applyCategory(button.dataset.floatingTabCategory ?? "status");
      categoryDrawer.classList.add("hidden");
      categoryToggle.setAttribute("aria-expanded", "false");
      applyVariantState();
      settleMeasuredCardDensity();
    });
  });

  function syncScrollButtons() {
    const canNativeScroll = tabScroller.scrollWidth > tabScroller.clientWidth + 1;
    const maxWindowStart = Number(header.dataset.floatingTabMaxWindowStart ?? "0");
    const canPageOverflow = maxWindowStart > 0;
    const canNavigate = canNativeScroll || canPageOverflow;
    header.dataset.floatingTabCanScroll = canNavigate ? "true" : "false";
    scrollLeftButton.classList.toggle("hidden", !canNavigate);
    scrollRightButton.classList.toggle("hidden", !canNavigate);
    scrollLeftButton.disabled = !canNavigate || (canPageOverflow ? tabWindowStart <= 0 : tabScroller.scrollLeft <= 1);
    scrollRightButton.disabled = !canNavigate || (
      canPageOverflow
        ? tabWindowStart >= maxWindowStart
        : tabScroller.scrollLeft + tabScroller.clientWidth >= tabScroller.scrollWidth - 1
    );
  }

  function scrollTabs(direction) {
    const maxWindowStart = Number(header.dataset.floatingTabMaxWindowStart ?? "0");
    if (maxWindowStart > 0) {
      tabWindowStart = Math.max(0, Math.min(maxWindowStart, tabWindowStart + direction));
      tabScroller.scrollLeft = 0;
      applyingMeasuredDensity = true;
      applyVariantState();
      applyingMeasuredDensity = false;
      return;
    }
    tabScroller.scrollBy({
      left: direction * Math.max(160, Math.floor(tabScroller.clientWidth * 0.72)),
      behavior: "smooth",
    });
    window.setTimeout(syncScrollButtons, 180);
  }

  scrollLeftButton.addEventListener("click", () => scrollTabs(-1));
  scrollRightButton.addEventListener("click", () => scrollTabs(1));
  tabScroller.addEventListener("scroll", syncScrollButtons, { passive: true });
  window.addEventListener("resize", resetMeasuredCardDensity);
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver((entries) => {
      const inlineSize = entries.reduce((max, entry) => {
        const box = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
        return Math.max(max, box?.inlineSize ?? entry.contentRect.width);
      }, 0);
      if (Math.abs(inlineSize - lastObservedInlineSize) <= 1) {
        return;
      }
      lastObservedInlineSize = inlineSize;
      resetMeasuredCardDensity();
    });
    resizeObserver.observe(tabScroller);
  }
  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleMeasuredCardDensity).catch(() => {});
  }

  subTabContainer.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".floating-tab-sub-tab") : null;
    if (!(button instanceof HTMLElement)) {
      return;
    }
    const subTabButtons = Array.from(subTabContainer.querySelectorAll(".floating-tab-sub-tab"));
    subTabButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
  });

  applyInitialStateFromUrl();
  applyCategory(category);
  applyVariantState();
  rowReorderController.syncRows();
  applyReferenceRoutePosture();
}
