function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export const designSystemIconDefinitions = [
  {
    key: "home",
    label: "Home",
    aliases: ["house", "dashboard", "landing"],
    markup: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />',
  },
  {
    key: "grid",
    label: "Grid",
    aliases: ["apps", "tiles", "catalog"],
    markup: '<path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 3.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z" />',
  },
  {
    key: "list",
    label: "List",
    aliases: ["rows", "menu", "items"],
    markup: '<path d="M5 6h14v3H5zm0 5h14v3H5zm0 5h9v3H5z" />',
  },
  {
    key: "doc",
    label: "Document",
    aliases: ["file", "page", "record"],
    markup: '<path d="M7 4h8l4 4v12H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm7 1.5V9h3.5" />',
  },
  {
    key: "token",
    label: "Token",
    aliases: ["badge", "seal", "module"],
    markup: '<path d="m12 3 7 4v10l-7 4-7-4V7zm0 3.1L8.1 8.3v4.4L12 15l3.9-2.3V8.3z" />',
  },
  {
    key: "spark",
    label: "Spark",
    aliases: ["magic", "highlight", "featured"],
    markup: '<path d="M12 2.5 14.2 8l5.3 2-5.3 2-2.2 5.5L9.8 12 4.5 10l5.3-2zm-5 13 1.15 2.85L11 19.5l-2.85 1.15L7 23.5l-1.15-2.85L3 19.5l2.85-1.15z" />',
  },
  {
    key: "text",
    label: "Text",
    aliases: ["type", "content", "copy"],
    markup: '<path d="M5 5h14v3h-5.5v11h-3V8H5z" />',
  },
  {
    key: "shield",
    label: "Shield",
    aliases: ["secure", "security", "protection"],
    markup: '<path d="M12 3.2 18.5 5v5.2c0 4.3-2.75 8.05-6.5 9.8-3.75-1.75-6.5-5.5-6.5-9.8V5zM10.8 14.7l4.7-4.7-1.4-1.4-3.3 3.3-1.8-1.8-1.4 1.4z" />',
  },
  {
    key: "globe",
    label: "Globe",
    aliases: ["world", "global", "internet"],
    markup: '<path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm5.85 8h-3.2a14.4 14.4 0 0 0-1.2-5A7.03 7.03 0 0 1 17.85 11zM12 5.2A12.1 12.1 0 0 1 13.4 11h-2.8A12.1 12.1 0 0 1 12 5.2zM6.15 13h3.2a14.4 14.4 0 0 0 1.2 5A7.03 7.03 0 0 1 6.15 13zm3.2-2h-3.2A7.03 7.03 0 0 1 10.55 6a14.4 14.4 0 0 0-1.2 5zm2.65 7.8A12.1 12.1 0 0 1 10.6 13h2.8A12.1 12.1 0 0 1 12 18.8zM13.45 18a14.4 14.4 0 0 0 1.2-5h3.2A7.03 7.03 0 0 1 13.45 18z" />',
  },
  {
    key: "filter",
    label: "Filter",
    aliases: ["funnel", "refine", "segment"],
    markup: '<path d="M4 6h16l-6.5 7.25V19l-3-1.5v-4.25z" />',
  },
  {
    key: "dashboard",
    label: "Dashboard",
    aliases: ["overview", "summary", "kpi"],
    markup: '<path d="M4 5h7v6H4zm9 0h7v4h-7zM4 13h7v6H4zm9 2h7v4h-7z" />',
  },
  {
    key: "search",
    label: "Search",
    aliases: ["find", "lookup", "magnify"],
    markup: '<path d="M10.5 4.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm4.25 10.25L19.5 19.5" />',
  },
  {
    key: "sort",
    label: "Sort",
    aliases: ["order", "arrange", "rank"],
    markup: '<path d="M7 5v12m0 0-3-3m3 3 3-3M17 19V7m0 0-3 3m3-3 3 3" />',
  },
  {
    key: "email",
    label: "Email",
    aliases: ["mail", "inbox", "message"],
    markup: '<path d="M4 7.5h16v9H4zm1.5.5 6.5 5 6.5-5" />',
  },
  {
    key: "notification",
    label: "Notification",
    aliases: ["alert", "bell", "reminder"],
    markup: '<path d="M12 4.5a4 4 0 0 1 4 4v2.5c0 .9.3 1.78.86 2.5L18 15.5H6l1.14-2c.56-.72.86-1.6.86-2.5V8.5a4 4 0 0 1 4-4zm-1.75 13a1.75 1.75 0 0 0 3.5 0" />',
  },
  {
    key: "help",
    label: "Help",
    aliases: ["question", "support", "faq"],
    markup: '<path d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zm-2.25 6a2.25 2.25 0 1 1 3.85 1.6c-.66.65-1.6 1.14-1.6 2.4m0 3h.01" />',
  },
  {
    key: "settings",
    label: "Settings",
    aliases: ["preferences", "gear", "configuration"],
    markup: '<path d="m12 3 1.05 2.2 2.43.35.7 2.35 2.22 1.1-.42 2.42 1.52 1.92-1.52 1.92.42 2.42-2.22 1.1-.7 2.35-2.43.35L12 21l-1.05-2.2-2.43-.35-.7-2.35-2.22-1.1.42-2.42L4.5 11.5l1.52-1.92-.42-2.42 2.22-1.1.7-2.35 2.43-.35zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />',
  },
  {
    key: "comment",
    label: "Comment",
    aliases: ["chat", "campaign"],
    markup: '<path d="M6 4h12a2 2 0 0 1 2 2v12.5a1.5 1.5 0 0 1-2.56 1.06l-2.88-2.88a1.5 1.5 0 0 0-1.06-.44H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm1.5 4.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5zm0 3.75a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z" />',
  },
  {
    key: "calendar",
    label: "Calendar",
    aliases: ["date", "schedule", "launch"],
    markup: '<path d="M7 3.5v3M17 3.5v3M4.5 8.5h15M6 6.5h12a1.5 1.5 0 0 1 1.5 1.5v9.5A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5V8A1.5 1.5 0 0 1 6 6.5Z" />',
  },
  {
    key: "clock",
    label: "Clock",
    aliases: ["time", "hour", "minute"],
    markup: '<path d="M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75Zm.75 4.5h-1.5v5.1l3.65 2.2.78-1.28-2.93-1.77Z" />',
  },
  {
    key: "hierarchy",
    label: "Hierarchy",
    aliases: ["tree", "structure", "nodes"],
    markup: '<path d="M4 6h8v4H4zm0 8h8v4H4zm10-4h6v4h-6zm-2-2h2v8h-2z" />',
  },
  {
    key: "browser",
    label: "Browser",
    aliases: ["window", "screen", "frame"],
    markup: '<path d="M4 6h16v12H4zm3 3v6h10V9z" />',
  },
  {
    key: "layout",
    label: "Layout",
    aliases: ["navigation", "shell", "sections"],
    markup: '<path d="M4 5h16v4H4zm0 6h10v3H4zm12 0h4v3h-4zM4 16h16v3H4z" />',
  },
  {
    key: "row",
    label: "Sub Nav Row",
    aliases: ["sub nav", "row", "header"],
    markup: '<path d="M4 5h16v3H4zm0 6h16v8H4zm4 2h8v4H8z" />',
  },
  {
    key: "split",
    label: "Split View",
    aliases: ["split", "columns", "detail"],
    markup: '<path d="M3 5h8v14H3zm10 0h8v14h-8zm1.5 2v10h5V7z" />',
  },
  {
    key: "record",
    label: "Record Panel",
    aliases: ["record", "detail", "card"],
    markup: '<path d="M5 5h14v8H5zm0 6h14v8H5zm3 2v4h8v-4z" />',
  },
  {
    key: "drawer",
    label: "Drawer",
    aliases: ["side panel", "picker", "slideout"],
    markup: '<path d="M4 5h16v14H8l-4 3V5Zm4 4h8v2H8Zm0 4h8v2H8Z" />',
  },
  {
    key: "workspace",
    label: "Workspace",
    aliases: ["product", "app", "platform"],
    markup: '<path d="M4 20.25V6.75a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5v13.5h2V3.75a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 20 3.75v16.5h.75a.75.75 0 0 1 0 1.5H3.25a.75.75 0 0 1 0-1.5zm3-11.5v2h2v-2zm0 4.5v2h2v-2zm4-4.5v2h2v-2zm0 4.5v2h2v-2z" />',
  },
  {
    key: "user",
    label: "User",
    aliases: ["person", "profile", "member"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5z" />',
  },
  {
    key: "secure-user",
    label: "Secure User",
    aliases: ["protected user", "verified user", "trusted user"],
    markup: '<path d="M10 4.75a3.25 3.25 0 1 1-3.25 3.25A3.25 3.25 0 0 1 10 4.75zm-4.1 13a4.4 4.4 0 0 1 8.2 0M15.75 5.5l4.25 1.2v3.4c0 2.8-1.8 5.25-4.25 6.4-2.45-1.15-4.25-3.6-4.25-6.4V6.7zm-1 5.7 1.1 1.1 2.6-2.6" />',
  },
  {
    key: "super-user",
    label: "Super User",
    aliases: ["power user", "advanced user", "elevated user"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zm6.2-8.7.6 1.2 1.33.2-.96.93.23 1.32-1.2-.63-1.2.63.23-1.32-.96-.93 1.33-.2z" />',
  },
  {
    key: "normal-user",
    label: "Normal User",
    aliases: ["standard user", "basic user", "regular user"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zM8.5 17.25h7" />',
  },
  {
    key: "admin",
    label: "Admin Shield",
    aliases: ["operator", "admin", "protected"],
    markup: '<path d="M12 2.75 5.5 5v6.15c0 4.34 2.76 8.39 6.5 10.1 3.74-1.71 6.5-5.76 6.5-10.1V5zm0 4.1a2.15 2.15 0 1 1-2.15 2.15A2.15 2.15 0 0 1 12 6.85zm3.55 8.92a5.04 5.04 0 0 1-7.1 0 4.2 4.2 0 0 1 7.1 0z" />',
  },
  {
    key: "administrator",
    label: "Administrator",
    aliases: ["system admin", "platform admin", "admin user"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zm6.4-7.9.58 1.18 1.3.19-.94.92.22 1.28-1.16-.61-1.16.61.22-1.28-.94-.92 1.3-.19zm0 9.8.58 1.18 1.3.19-.94.92.22 1.28-1.16-.61-1.16.61.22-1.28-.94-.92 1.3-.19z" />',
  },
  {
    key: "leader",
    label: "Leader",
    aliases: ["manager", "owner", "team lead"],
    markup: '<path d="M12 4.5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 4.5zm0 9c3.2 0 5.9 1.78 6.75 4.25A1.75 1.75 0 0 1 17.1 20H6.9a1.75 1.75 0 0 1-1.65-2.25C6.1 15.28 8.8 13.5 12 13.5zm-3.5-8.6L10.2 7l1.8-1.1L13.8 7l1.7-2.1" />',
  },
  {
    key: "tenant",
    label: "Tenant",
    aliases: ["organization", "workspace member", "account"],
    markup: '<path d="M12 3.25a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm-4.9 16.5a5.45 5.45 0 0 1 9.8-3.31V20H7.95A1.5 1.5 0 0 1 7.1 19.75zm11.65-7 1.05 2.13 2.35.34-1.7 1.66.4 2.34-2.1-1.11-2.1 1.11.4-2.34-1.7-1.66 2.35-.34z" />',
  },
  {
    key: "monitor",
    label: "Monitor",
    aliases: ["display", "screen", "preview"],
    markup: '<path d="M4.75 5.25h14.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H13.5l.9 2h2.35a.75.75 0 0 1 0 1.5H7.25a.75.75 0 0 1 0-1.5H9.6l.9-2H4.75a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5zm0 1.5v8.5h14.5v-8.5zm7.25 2a2.5 2.5 0 1 1-2.5 2.5 2.5 2.5 0 0 1 2.5-2.5z" />',
  },
  {
    key: "checklist",
    label: "Checklist",
    aliases: ["choice group", "steps", "tasks"],
    markup: '<path d="M5 7.5h14v2H5zm0 7h14v2H5zm2.5-3.5A1.75 1.75 0 1 0 7.5 7.5a1.75 1.75 0 0 0 0 3.5Zm0 7A1.75 1.75 0 1 0 7.5 14.5a1.75 1.75 0 0 0 0 3.5Z" />',
  },
  {
    key: "accessibility",
    label: "Accessibility",
    aliases: ["inclusive", "assistive", "a11y"],
    markup: '<path d="M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75zm0 3.1a2.15 2.15 0 1 1-2.15 2.15A2.15 2.15 0 0 1 12 5.85zm0 11.55a5.4 5.4 0 0 1-4.19-1.97 4.87 4.87 0 0 1 8.38 0A5.4 5.4 0 0 1 12 17.4z" />',
  },
];

const designSystemIconMarkupByKey = Object.fromEntries(
  designSystemIconDefinitions.map((icon) => [icon.key, icon.markup]),
);

let activeFormIconGrid = null;
let activeFormDrawerSelect = null;
let sharedListenersBound = false;

const formUploadStateCopy = {
  idle: {
    title: "Drop a campaign asset here",
    summary: "or choose a local file from this device",
    status: "No file selected",
    progress: 0,
  },
  uploading: {
    summary: "Upload in progress",
    status: "Uploading 64%",
    progress: 64,
  },
  complete: {
    summary: "Upload complete",
    status: "Ready to attach",
    progress: 100,
  },
  error: {
    summary: "Upload needs attention",
    status: "Upload failed",
    progress: 0,
  },
};

export function getDesignSystemIconRecord(iconKey) {
  return designSystemIconDefinitions.find((icon) => icon.key === iconKey) ?? designSystemIconDefinitions[0];
}

export function renderDesignSystemIconSvg(iconKey) {
  const iconMarkup = designSystemIconMarkupByKey[iconKey] ?? designSystemIconMarkupByKey.grid;
  return `<svg viewBox="0 0 24 24" focusable="false">${iconMarkup}</svg>`;
}

export function renderFormIconGrid({
  rootId = "",
  inputId = "",
  inputName = "iconKey",
  value = "grid",
  triggerId = "",
  labelId = "",
  modalTitleId = "",
  searchInputId = "",
  triggerMeta = "Search approved design-system icons",
  drawerEyebrow = "Icon picker",
  dialogTitle = "Choose campaign icon",
  closeLabel = "Close icon picker",
  searchLabel = "Search icons",
  searchPlaceholder = "Search icons",
  copy = "Uses the same approved icon library already present across the governed design system.",
} = {}) {
  const selectedIcon = getDesignSystemIconRecord(value);
  const ariaLabelledBy = [labelId, triggerId].filter(Boolean).join(" ");

  return `
    <div${rootId ? ` id="${escapeHtml(rootId)}"` : ""} class="form-icon-grid" data-form-icon-grid>
      <input
        ${inputId ? `id="${escapeHtml(inputId)}"` : ""}
        type="hidden"
        name="${escapeHtml(inputName)}"
        value="${escapeHtml(selectedIcon.key)}"
        data-form-icon-grid-value
      />
      <button
        class="form-icon-grid-trigger"
        type="button"
        ${triggerId ? `id="${escapeHtml(triggerId)}"` : ""}
        aria-haspopup="dialog"
        aria-expanded="false"
        ${ariaLabelledBy ? `aria-labelledby="${escapeHtml(ariaLabelledBy)}"` : ""}
        data-form-icon-grid-button
      >
        <span class="form-icon-grid-trigger-preview">
          <span class="form-icon-grid-trigger-glyph" aria-hidden="true" data-form-icon-grid-trigger-glyph>
            ${renderDesignSystemIconSvg(selectedIcon.key)}
          </span>
          <span class="form-icon-grid-trigger-copy">
            <span class="form-icon-grid-trigger-label" data-form-icon-grid-current-label>${escapeHtml(selectedIcon.label)}</span>
            <span class="form-icon-grid-trigger-meta">${escapeHtml(triggerMeta)}</span>
          </span>
        </span>
        <span class="form-icon-grid-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        class="form-icon-grid-modal hidden"
        role="dialog"
        aria-modal="false"
        ${modalTitleId ? `aria-labelledby="${escapeHtml(modalTitleId)}"` : ""}
        aria-hidden="true"
        data-form-icon-grid-panel
      >
        <div class="form-icon-grid-backdrop" data-form-icon-grid-backdrop></div>
        <div class="form-icon-grid-panel">
          <div class="side-panel-header form-icon-grid-header">
            <div>
              <p class="drawer-eyebrow">${escapeHtml(drawerEyebrow)}</p>
              <h4${modalTitleId ? ` id="${escapeHtml(modalTitleId)}"` : ""}>${escapeHtml(dialogTitle)}</h4>
            </div>
            <button class="icon-button" type="button" aria-label="${escapeHtml(closeLabel)}" data-form-icon-grid-close>
              <span class="icon-button-glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M6 6 18 18M18 6 6 18" /></svg>
              </span>
            </button>
          </div>
          <form class="search-shell form-icon-grid-search-shell" role="search">
            <label class="search-shell-field">
              <span class="visually-hidden">${escapeHtml(searchLabel)}</span>
              <input
                ${searchInputId ? `id="${escapeHtml(searchInputId)}"` : ""}
                class="search-input"
                type="search"
                placeholder="${escapeHtml(searchPlaceholder)}"
                autocomplete="off"
                data-form-icon-grid-search
              />
            </label>
          </form>
          <p class="form-icon-grid-copy">${escapeHtml(copy)}</p>
          <p class="form-icon-grid-empty hidden" data-form-icon-grid-empty>No icons match this search.</p>
          <div class="form-icon-grid-option-list" data-form-icon-grid-option-list></div>
        </div>
      </div>
    </div>
  `;
}

export function renderFormDrawerSelect({
  rootId = "",
  inputId = "",
  inputName = "selection",
  value = "",
  triggerId = "",
  labelId = "",
  panelTitleId = "",
  searchInputId = "",
  optionListId = "",
  emptySummary = "Choose items",
  triggerLabel = "Choose items",
  triggerMeta = "0 selected",
  drawerEyebrow = "Picker",
  dialogTitle = "Choose items",
  closeLabel = "Close selector",
  searchPlaceholder = "Search items",
  selectedTitle = "Selected",
  selectedEmpty = "No items selected yet.",
  availableTitle = "Available",
  emptyMessage = "No items match this search.",
  maxSelections = null,
} = {}) {
  const ariaLabelledBy = [labelId, triggerId].filter(Boolean).join(" ");
  const maxSelectionsAttribute = Number.isInteger(maxSelections) && maxSelections > 0
    ? `data-form-drawer-select-max-selections="${maxSelections}"`
    : "";

  return `
    <div
      ${rootId ? `id="${escapeHtml(rootId)}"` : ""}
      class="form-drawer-select"
      data-form-drawer-select
      data-form-drawer-select-empty-summary="${escapeHtml(emptySummary)}"
      ${maxSelectionsAttribute}
    >
      <input
        ${inputId ? `id="${escapeHtml(inputId)}"` : ""}
        type="hidden"
        name="${escapeHtml(inputName)}"
        value="${escapeHtml(value)}"
        data-form-drawer-select-value
      />
      <button
        class="form-drawer-select-trigger"
        type="button"
        ${triggerId ? `id="${escapeHtml(triggerId)}"` : ""}
        aria-haspopup="dialog"
        aria-expanded="false"
        ${ariaLabelledBy ? `aria-labelledby="${escapeHtml(ariaLabelledBy)}"` : ""}
        data-form-drawer-select-button
      >
        <span class="form-drawer-select-trigger-copy">
          <span class="form-drawer-select-trigger-label" data-form-drawer-select-summary>${escapeHtml(triggerLabel)}</span>
          <span class="form-drawer-select-trigger-meta" data-form-drawer-select-meta>${escapeHtml(triggerMeta)}</span>
        </span>
        <span class="form-drawer-select-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <aside
        class="form-drawer-select-panel hidden"
        role="dialog"
        aria-modal="false"
        ${panelTitleId ? `aria-labelledby="${escapeHtml(panelTitleId)}"` : ""}
        aria-hidden="true"
        data-form-drawer-select-panel
      >
        <div class="side-panel-header">
          <div>
            <p class="drawer-eyebrow">${escapeHtml(drawerEyebrow)}</p>
            <h4${panelTitleId ? ` id="${escapeHtml(panelTitleId)}"` : ""}>${escapeHtml(dialogTitle)}</h4>
          </div>
          <button
            class="icon-button"
            type="button"
            aria-label="${escapeHtml(closeLabel)}"
            data-form-drawer-select-close
          >
            <span class="icon-button-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M6 6 18 18M18 6 6 18" /></svg>
            </span>
          </button>
        </div>
        <form class="search-shell form-drawer-select-search-shell" role="search">
          <label class="search-shell-field">
            <input
              ${searchInputId ? `id="${escapeHtml(searchInputId)}"` : ""}
              class="search-input"
              type="search"
              placeholder="${escapeHtml(searchPlaceholder)}"
              autocomplete="off"
              data-form-drawer-select-search
            />
          </label>
        </form>
        <section class="form-drawer-select-selected-panel" aria-labelledby="${escapeHtml(panelTitleId ? `${panelTitleId}-selected` : "drawer-select-selected-title")}">
          <div class="form-drawer-select-selected-header">
            <h5 id="${escapeHtml(panelTitleId ? `${panelTitleId}-selected` : "drawer-select-selected-title")}" class="form-drawer-select-selected-title">
              ${escapeHtml(selectedTitle)}
            </h5>
            <span class="form-drawer-select-selected-count" data-form-drawer-select-selected-count>0 selected</span>
          </div>
          <p class="form-drawer-select-selected-empty" data-form-drawer-select-selected-empty>${escapeHtml(selectedEmpty)}</p>
          <div class="form-drawer-select-selected-list hidden" data-form-drawer-select-selected-list></div>
        </section>
        <section class="form-drawer-select-catalog" aria-labelledby="${escapeHtml(panelTitleId ? `${panelTitleId}-catalog` : "drawer-select-catalog-title")}">
          <div class="form-drawer-select-catalog-header">
            <h5 id="${escapeHtml(panelTitleId ? `${panelTitleId}-catalog` : "drawer-select-catalog-title")}" class="form-drawer-select-selected-title">
              ${escapeHtml(availableTitle)}
            </h5>
          </div>
          <p class="form-drawer-select-empty hidden" data-form-drawer-select-empty>${escapeHtml(emptyMessage)}</p>
          <div
            ${optionListId ? `id="${escapeHtml(optionListId)}"` : ""}
            class="form-drawer-select-option-list"
            data-form-drawer-select-option-list
          ></div>
        </section>
      </aside>
    </div>
  `;
}

export function renderFormDrawerSelectOptions(optionRecords = []) {
  return optionRecords.map((option) => {
    const value = typeof option?.value === "string" ? option.value : "";
    const label = typeof option?.label === "string" ? option.label : value;
    const description = typeof option?.description === "string" ? option.description : "";
    const attribute = typeof option?.attribute === "string" ? option.attribute : description;

    return `
      <button
        class="form-drawer-select-option"
        type="button"
        data-form-drawer-select-option
        data-value="${escapeHtml(value)}"
        data-label="${escapeHtml(label)}"
        ${description ? `data-description="${escapeHtml(description)}"` : ""}
        ${attribute ? `data-attribute="${escapeHtml(attribute)}"` : ""}
      >
        <span class="form-drawer-select-option-toggle" aria-hidden="true"></span>
        <span class="form-drawer-select-option-copy">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(attribute)}</span>
        </span>
      </button>
    `;
  }).join("");
}

export function renderFormImageCard({
  variant = "person-full",
  name = "",
  email = "",
  jobTitle = "",
  title = "",
  description = "",
  meta = "",
  imageLabel = "Image placeholder",
  editLabel = "Edit image",
  imageUrl = "",
  imageAlt = "",
} = {}) {
  const hasImage = Boolean(imageUrl);
  const cardTitle = name || title;
  const cardEmail = email || description;
  const cardJobTitle = jobTitle || meta;
  const placeholderMarkup = `
    <span
      class="form-image-card-placeholder"
      aria-hidden="true"
      data-form-image-card-placeholder
      ${hasImage ? "hidden" : ""}
    >
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17V7A1.5 1.5 0 0 1 5 5.5zm1.5 9 3.1-3.2 2.4 2.35 1.65-1.75 3.85 3.6M8.25 9.25h.01" />
      </svg>
      <span>${escapeHtml(imageLabel)}</span>
    </span>
  `;
  const copyMarkup = [cardTitle, cardEmail, cardJobTitle].some(Boolean)
    ? `
      <div class="form-image-card-copy">
        ${cardTitle ? `<strong>${escapeHtml(cardTitle)}</strong>` : ""}
        ${cardEmail ? `<span>${escapeHtml(cardEmail)}</span>` : ""}
        ${cardJobTitle ? `<small>${escapeHtml(cardJobTitle)}</small>` : ""}
      </div>
    `
    : "";

  return `
    <article class="form-image-card" data-form-image-card data-form-image-card-variant="${escapeHtml(variant)}">
      <div class="form-image-card-media" data-form-image-card-media>
        ${hasImage
          ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageAlt)}" data-form-image-card-image />`
          : ""}
        ${placeholderMarkup}
        <button class="form-image-card-edit" type="button" aria-label="${escapeHtml(editLabel)}" data-form-image-card-edit>
          <span aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m4.5 16.75-.75 3.5 3.5-.75L18.9 7.85a2.1 2.1 0 0 0-2.75-2.75zM14.75 6.5l2.75 2.75" />
            </svg>
          </span>
        </button>
      </div>
      ${copyMarkup}
    </article>
  `;
}

export function initializeFormImageCards({ scope = document } = {}) {
  if (!(scope instanceof Document || scope instanceof HTMLElement)) {
    return;
  }

  const handleImageFailure = (image) => {
    if (!(image instanceof HTMLImageElement)) {
      return;
    }
    const card = image.closest("[data-form-image-card]");
    const placeholder = card?.querySelector("[data-form-image-card-placeholder]");
    if (!(placeholder instanceof HTMLElement)) {
      return;
    }
    image.hidden = true;
    placeholder.hidden = false;
    card.dataset.formImageCardImageState = "error";
  };

  for (const image of scope.querySelectorAll("[data-form-image-card-image]")) {
    if (image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0) {
      handleImageFailure(image);
    }
  }

  if (scope.dataset?.formImageCardsInitialized === "true") {
    return;
  }

  scope.addEventListener(
    "error",
    (event) => {
      handleImageFailure(event.target);
    },
    true,
  );

  if (scope.dataset) {
    scope.dataset.formImageCardsInitialized = "true";
  }
}

export function renderFormUploadField({
  rootId = "",
  inputId = "",
  inputName = "asset",
  labelId = "",
  helpId = "",
  statusId = "",
  errorId = "",
  accept = "",
  multiple = false,
  disabled = false,
  defaultFileName = "renewal-audience.csv",
  state = "idle",
  title = "Drop a campaign asset here",
  summary = "or choose a local file from this device",
  actionLabel = "Browse",
  status = "No file selected",
  previewKind = "none",
  previewUrl = "",
  previewLabel = "",
} = {}) {
  const ariaDescribedBy = [helpId, statusId, errorId].filter(Boolean).join(" ");
  const normalizedState = state in formUploadStateCopy ? state : "idle";
  const normalizedPreviewKind = normalizeFormUploadPreviewKind(previewKind);

  return `
    <div
      ${rootId ? `id="${escapeHtml(rootId)}"` : ""}
      class="form-upload-field"
      data-form-upload-field
      data-form-upload-state="${escapeHtml(normalizedState)}"
      data-form-upload-default-file="${escapeHtml(defaultFileName)}"
      data-form-upload-preview-kind="${escapeHtml(normalizedPreviewKind)}"
    >
      <input
        ${inputId ? `id="${escapeHtml(inputId)}"` : ""}
        class="form-upload-input"
        type="file"
        name="${escapeHtml(inputName)}"
        ${accept ? `accept="${escapeHtml(accept)}"` : ""}
        ${multiple ? "multiple" : ""}
        ${disabled ? "disabled" : ""}
        ${labelId ? `aria-labelledby="${escapeHtml(labelId)}"` : ""}
        ${ariaDescribedBy ? `aria-describedby="${escapeHtml(ariaDescribedBy)}"` : ""}
        data-form-upload-input
      />
      <label class="form-upload-dropzone" ${inputId ? `for="${escapeHtml(inputId)}"` : ""} data-form-upload-dropzone>
        <span
          class="form-upload-preview${normalizedPreviewKind === "none" ? " hidden" : ""}"
          aria-hidden="true"
          data-form-upload-preview
          data-form-upload-preview-kind="${escapeHtml(normalizedPreviewKind)}"
          ${previewUrl ? `data-form-upload-preview-url="${escapeHtml(previewUrl)}"` : ""}
          ${previewLabel ? `data-form-upload-preview-label="${escapeHtml(previewLabel)}"` : ""}
        ></span>
        <span class="form-upload-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 4v10m0-10 4 4m-4-4-4 4M5 14v3.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V14" />
          </svg>
        </span>
        <span class="form-upload-copy">
          <strong data-form-upload-title>${escapeHtml(title)}</strong>
          <span data-form-upload-summary>${escapeHtml(summary)}</span>
        </span>
        <span class="form-upload-action">${escapeHtml(actionLabel)}</span>
      </label>
      <div class="form-upload-status" ${statusId ? `id="${escapeHtml(statusId)}"` : ""} aria-live="polite">
        <span class="form-upload-status-dot" aria-hidden="true"></span>
        <span data-form-upload-status-copy>${escapeHtml(status)}</span>
      </div>
      <div class="form-upload-progress" aria-hidden="true">
        <span data-form-upload-progress-bar></span>
      </div>
    </div>
  `;
}

function normalizeFormUploadPreviewKind(kind) {
  return ["image", "document", "video", "audio"].includes(kind) ? kind : "none";
}

function inferFormUploadPreviewKind(file, fileName = "") {
  const mimeType = typeof file?.type === "string" ? file.type.toLowerCase() : "";
  const normalizedName = String(fileName || file?.name || "").toLowerCase();

  if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  if (
    mimeType === "application/pdf"
    || mimeType.includes("document")
    || mimeType.includes("spreadsheet")
    || mimeType.includes("presentation")
    || mimeType.startsWith("text/")
    || /\.(csv|docx?|pdf|pptx?|txt|xlsx?)$/.test(normalizedName)
  ) {
    return "document";
  }

  return "document";
}

function getFormUploadFileExtension(fileName = "") {
  const extension = String(fileName).split(".").pop() ?? "";
  return extension && extension !== fileName ? extension.slice(0, 5).toUpperCase() : "FILE";
}

function getFormUploadPreviewIconMarkup(kind) {
  if (kind === "audio") {
    return `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 10v4h3l4 3.5v-11L8 10zm11.5-2.5a5.8 5.8 0 0 1 0 9M18.7 5a9 9 0 0 1 0 14" />
      </svg>
    `;
  }

  if (kind === "video") {
    return `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5.5 6.5h9a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zm11 3 4-2.2v9.4l-4-2.2z" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M7 4h7.5L19 8.5V20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm7 1.25V9h3.75M8 13h8M8 16h5" />
    </svg>
  `;
}

function releaseFormUploadObjectUrl(root) {
  const objectUrl = root.dataset.formUploadPreviewObjectUrl;
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    delete root.dataset.formUploadPreviewObjectUrl;
  }
}

function renderFormUploadPreview(root, {
  kind = "none",
  previewUrl = "",
  previewLabel = "",
  fileName = "",
} = {}) {
  const previewNode = root.querySelector("[data-form-upload-preview]");
  if (!(previewNode instanceof HTMLElement)) {
    return;
  }

  const normalizedKind = normalizeFormUploadPreviewKind(kind);
  root.dataset.formUploadPreviewKind = normalizedKind;
  previewNode.dataset.formUploadPreviewKind = normalizedKind;
  previewNode.classList.toggle("hidden", normalizedKind === "none");
  previewNode.innerHTML = "";

  if (normalizedKind === "none") {
    return;
  }

  if ((normalizedKind === "image" || normalizedKind === "video") && previewUrl) {
    const mediaLabel = previewLabel || fileName || `${normalizedKind} preview`;
    previewNode.innerHTML = normalizedKind === "image"
      ? `<img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(mediaLabel)}" data-form-upload-preview-image />`
      : `<video src="${escapeHtml(previewUrl)}" muted playsinline preload="metadata" data-form-upload-preview-video></video>`;
    return;
  }

  if (normalizedKind === "image") {
    previewNode.innerHTML = `
      <span class="form-upload-preview-art form-upload-preview-art-image" data-form-upload-preview-art>
        <span></span>
      </span>
    `;
    return;
  }

  if (normalizedKind === "document") {
    previewNode.innerHTML = `
      <span class="form-upload-preview-art form-upload-preview-art-document" data-form-upload-preview-art>
        ${getFormUploadPreviewIconMarkup("document")}
        <strong>${escapeHtml(getFormUploadFileExtension(fileName || previewLabel))}</strong>
      </span>
    `;
    return;
  }

  previewNode.innerHTML = `
    <span class="form-upload-preview-art form-upload-preview-art-${escapeHtml(normalizedKind)}" data-form-upload-preview-art>
      ${getFormUploadPreviewIconMarkup(normalizedKind)}
    </span>
  `;
}

function getFormIconGridRoots(scope = document) {
  return Array.from(scope.querySelectorAll("[data-form-icon-grid]")).filter((root) => root instanceof HTMLElement);
}

function getFormDrawerSelectRoots(scope = document) {
  return Array.from(scope.querySelectorAll("[data-form-drawer-select]")).filter((root) => root instanceof HTMLElement);
}

function getFormUploadRoots(scope = document) {
  return Array.from(scope.querySelectorAll("[data-form-upload-field]")).filter((root) => root instanceof HTMLElement);
}

function getFocusableElements(panel, selector) {
  if (!(panel instanceof HTMLElement)) {
    return [];
  }

  return Array.from(panel.querySelectorAll(selector)).filter((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    return !element.hasAttribute("disabled")
      && !element.hidden
      && !element.classList.contains("hidden")
      && element.getAttribute("aria-hidden") !== "true";
  });
}

function closeFormIconGridRoot(root, { restoreFocus = false } = {}) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-icon-grid-button]");
  const panel = root.querySelector("[data-form-icon-grid-panel]");

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("aria-modal", "false");

  if (restoreFocus) {
    trigger.focus();
  }

  if (activeFormIconGrid === root) {
    activeFormIconGrid = null;
  }
}

function closeFormDrawerSelectRoot(root, { restoreFocus = false } = {}) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const trigger = root.querySelector("[data-form-drawer-select-button]");
  const panel = root.querySelector("[data-form-drawer-select-panel]");

  if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  trigger.setAttribute("aria-expanded", "false");
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("aria-modal", "false");

  if (restoreFocus) {
    trigger.focus();
  }

  if (activeFormDrawerSelect === root) {
    activeFormDrawerSelect = null;
  }
}

export function closeUnrelatedFormSurfaces({ preservedRoots = [] } = {}) {
  const preserved = new Set(preservedRoots.filter((root) => root instanceof HTMLElement));

  for (const root of getFormIconGridRoots(document)) {
    if (preserved.has(root)) {
      continue;
    }
    closeFormIconGridRoot(root);
  }

  for (const root of getFormDrawerSelectRoots(document)) {
    if (preserved.has(root)) {
      continue;
    }
    closeFormDrawerSelectRoot(root);
  }
}

export function refreshFormIconGrid(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const hiddenInput = root.querySelector("[data-form-icon-grid-value]");
  const labelNode = root.querySelector("[data-form-icon-grid-current-label]");
  const glyphNode = root.querySelector("[data-form-icon-grid-trigger-glyph]");
  const optionsNode = root.querySelector("[data-form-icon-grid-option-list]");
  const emptyNode = root.querySelector("[data-form-icon-grid-empty]");
  const searchInput = root.querySelector("[data-form-icon-grid-search]");

  if (
    !(hiddenInput instanceof HTMLInputElement)
    || !(labelNode instanceof HTMLElement)
    || !(glyphNode instanceof HTMLElement)
    || !(optionsNode instanceof HTMLElement)
    || !(emptyNode instanceof HTMLElement)
  ) {
    return;
  }

  const selectedIcon = getDesignSystemIconRecord(hiddenInput.value);
  const normalizedSearch = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLowerCase() : "";
  const filteredIcons = normalizedSearch === ""
    ? designSystemIconDefinitions
    : designSystemIconDefinitions.filter((icon) => {
        const searchable = [icon.key, icon.label, ...icon.aliases].join(" ").toLowerCase();
        return searchable.includes(normalizedSearch);
      });

  hiddenInput.value = selectedIcon.key;
  labelNode.textContent = selectedIcon.label;
  glyphNode.innerHTML = renderDesignSystemIconSvg(selectedIcon.key);
  optionsNode.innerHTML = filteredIcons.map((icon) => {
    const isSelected = icon.key === selectedIcon.key;
    return `
      <button
        class="form-icon-grid-option${isSelected ? " active" : ""}"
        type="button"
        data-form-icon-grid-option="${escapeHtml(icon.key)}"
        data-tooltip="${escapeHtml(icon.label)}"
        aria-pressed="${String(isSelected)}"
        aria-label="Choose ${escapeHtml(icon.label)} icon"
      >
        <span class="form-icon-grid-option-glyph" aria-hidden="true">${renderDesignSystemIconSvg(icon.key)}</span>
      </button>
    `;
  }).join("");
  emptyNode.classList.toggle("hidden", filteredIcons.length > 0);
}

export function refreshFormDrawerSelect(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const hiddenInput = root.querySelector("[data-form-drawer-select-value]");
  const summaryNode = root.querySelector("[data-form-drawer-select-summary]");
  const metaNode = root.querySelector("[data-form-drawer-select-meta]");
  const selectedCountNode = root.querySelector("[data-form-drawer-select-selected-count]");
  const selectedList = root.querySelector("[data-form-drawer-select-selected-list]");
  const selectedEmpty = root.querySelector("[data-form-drawer-select-selected-empty]");
  const emptyNode = root.querySelector("[data-form-drawer-select-empty]");
  const searchInput = root.querySelector("[data-form-drawer-select-search]");

  if (
    !(hiddenInput instanceof HTMLInputElement)
    || !(summaryNode instanceof HTMLElement)
    || !(metaNode instanceof HTMLElement)
    || !(selectedCountNode instanceof HTMLElement)
    || !(selectedList instanceof HTMLElement)
    || !(selectedEmpty instanceof HTMLElement)
    || !(emptyNode instanceof HTMLElement)
  ) {
    return;
  }

  const selectedValues = hiddenInput.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const emptySummary = root.dataset.formDrawerSelectEmptySummary ?? "Choose pages";
  const searchTerm = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLowerCase() : "";
  const options = Array.from(root.querySelectorAll("[data-form-drawer-select-option]"))
    .filter((option) => option instanceof HTMLButtonElement)
    .map((option) => ({
      element: option,
      value: option.dataset.value ?? "",
      label: option.dataset.label ?? option.textContent?.trim() ?? "",
      description: option.dataset.description ?? "",
      attribute: option.dataset.attribute ?? option.dataset.description ?? "",
    }));
  const selectedRecords = options.filter((option) => selectedValues.includes(option.value));

  summaryNode.textContent = selectedRecords.length === 0
    ? emptySummary
    : selectedRecords.length <= 2
      ? selectedRecords.map((item) => item.label).join(", ")
      : `${selectedRecords.slice(0, 2).map((item) => item.label).join(", ")} +${selectedRecords.length - 2} more`;

  const selectedMeta = `${selectedRecords.length} selected`;
  metaNode.textContent = selectedMeta;
  selectedCountNode.textContent = selectedMeta;

  selectedList.innerHTML = selectedRecords.map((item) => `
    <button class="form-drawer-select-selected-chip" type="button" data-form-drawer-select-remove="${escapeHtml(item.value)}">
      <span class="form-drawer-select-selected-chip-copy">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.description || item.attribute)}</span>
      </span>
      <span class="form-drawer-select-selected-chip-remove">Remove</span>
    </button>
  `).join("");

  selectedEmpty.classList.toggle("hidden", selectedRecords.length > 0);
  selectedList.classList.toggle("hidden", selectedRecords.length === 0);

  let visibleOptions = 0;

  for (const option of options) {
    const isSelected = selectedValues.includes(option.value);
    const matchesSearch = searchTerm === ""
      || option.label.toLowerCase().includes(searchTerm)
      || option.description.toLowerCase().includes(searchTerm);

    option.element.classList.toggle("active", isSelected);
    option.element.setAttribute("aria-pressed", String(isSelected));
    option.element.classList.toggle("hidden", !matchesSearch);

    if (matchesSearch) {
      visibleOptions += 1;
    }
  }

  emptyNode.classList.toggle("hidden", visibleOptions > 0);
}

export function setFormUploadState(root, {
  state = "idle",
  fileName = "",
  file = null,
  progress,
  title,
  summary,
  status,
  previewKind,
  previewUrl = "",
  previewLabel = "",
} = {}) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const titleNode = root.querySelector("[data-form-upload-title]");
  const summaryNode = root.querySelector("[data-form-upload-summary]");
  const statusNode = root.querySelector("[data-form-upload-status-copy]");
  const progressBar = root.querySelector("[data-form-upload-progress-bar]");
  const normalizedState = state in formUploadStateCopy ? state : "idle";
  const stateCopy = formUploadStateCopy[normalizedState];
  const effectiveFileName = fileName || root.dataset.formUploadFileName || root.dataset.formUploadDefaultFile || "selected file";
  const effectiveProgress = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : stateCopy.progress;
  let effectivePreviewKind = previewKind ?? root.dataset.formUploadPreviewKind ?? "none";
  let effectivePreviewUrl = previewUrl || root.dataset.formUploadPreviewUrl || "";

  root.dataset.formUploadState = normalizedState;

  if (normalizedState === "idle") {
    releaseFormUploadObjectUrl(root);
    delete root.dataset.formUploadFileName;
    delete root.dataset.formUploadUserSelected;
    delete root.dataset.formUploadPreviewUrl;
    delete root.dataset.formUploadPreviewKind;
    effectivePreviewKind = "none";
    effectivePreviewUrl = "";
  } else {
    root.dataset.formUploadFileName = effectiveFileName;

    if (typeof File !== "undefined" && file instanceof File) {
      effectivePreviewKind = inferFormUploadPreviewKind(file, effectiveFileName);
      releaseFormUploadObjectUrl(root);

      if (effectivePreviewKind === "image" || effectivePreviewKind === "video") {
        effectivePreviewUrl = URL.createObjectURL(file);
        root.dataset.formUploadPreviewObjectUrl = effectivePreviewUrl;
      } else {
        effectivePreviewUrl = "";
      }
    }

    root.dataset.formUploadPreviewKind = normalizeFormUploadPreviewKind(effectivePreviewKind);

    if (effectivePreviewUrl) {
      root.dataset.formUploadPreviewUrl = effectivePreviewUrl;
    } else {
      delete root.dataset.formUploadPreviewUrl;
    }
  }

  if (titleNode instanceof HTMLElement) {
    titleNode.textContent = title ?? (normalizedState === "idle" ? stateCopy.title : effectiveFileName);
  }

  if (summaryNode instanceof HTMLElement) {
    summaryNode.textContent = summary ?? stateCopy.summary;
  }

  if (statusNode instanceof HTMLElement) {
    statusNode.textContent = status ?? stateCopy.status;
  }

  if (progressBar instanceof HTMLElement) {
    progressBar.style.width = `${effectiveProgress}%`;
  }

  renderFormUploadPreview(root, {
    kind: effectivePreviewKind,
    previewUrl: effectivePreviewUrl,
    previewLabel,
    fileName: effectiveFileName,
  });
}

export function refreshFormUploadField(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  setFormUploadState(root, {
    state: root.dataset.formUploadState ?? "idle",
    fileName: root.dataset.formUploadFileName,
  });
}

export function syncFormUploadFieldsForShell(shell) {
  if (!(shell instanceof HTMLElement)) {
    return;
  }

  const isErrorMode = shell.dataset.formErrorMode === "true";

  for (const root of getFormUploadRoots(shell)) {
    if (isErrorMode) {
      setFormUploadState(root, { state: "error" });
      continue;
    }

    if (root.dataset.formUploadState === "error") {
      setFormUploadState(root, {
        state: root.dataset.formUploadUserSelected === "true" ? "uploading" : "idle",
      });
    }
  }
}

function bindSharedListenersOnce() {
  if (sharedListenersBound) {
    return;
  }

  sharedListenersBound = true;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (activeFormIconGrid && !activeFormIconGrid.contains(event.target)) {
      closeFormIconGridRoot(activeFormIconGrid);
    }

    if (activeFormDrawerSelect && !activeFormDrawerSelect.contains(event.target)) {
      closeFormDrawerSelectRoot(activeFormDrawerSelect);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (activeFormIconGrid) {
      if (event.key === "Escape") {
        closeFormIconGridRoot(activeFormIconGrid, { restoreFocus: true });
        return;
      }

      if (event.key === "Tab") {
        const panel = activeFormIconGrid.querySelector("[data-form-icon-grid-panel]");
        const focusableElements = getFocusableElements(
          panel,
          "button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
          return;
        }

        if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
          return;
        }
      }
    }

    if (activeFormDrawerSelect) {
      if (event.key === "Escape") {
        closeFormDrawerSelectRoot(activeFormDrawerSelect, { restoreFocus: true });
        return;
      }

      if (event.key === "Tab") {
        const panel = activeFormDrawerSelect.querySelector("[data-form-drawer-select-panel]");
        const focusableElements = getFocusableElements(
          panel,
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
          return;
        }

        if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

export function initializeFormIconGrids({ scope = document } = {}) {
  bindSharedListenersOnce();

  for (const root of getFormIconGridRoots(scope)) {
    if (root.dataset.formIconGridInitialized === "true") {
      refreshFormIconGrid(root);
      continue;
    }

    root.dataset.formIconGridInitialized = "true";
    const trigger = root.querySelector("[data-form-icon-grid-button]");
    const hiddenInput = root.querySelector("[data-form-icon-grid-value]");
    const panel = root.querySelector("[data-form-icon-grid-panel]");
    const searchForm = root.querySelector(".form-icon-grid-search-shell");
    const searchInput = root.querySelector("[data-form-icon-grid-search]");

    if (
      !(trigger instanceof HTMLButtonElement)
      || !(hiddenInput instanceof HTMLInputElement)
      || !(panel instanceof HTMLElement)
    ) {
      continue;
    }

    refreshFormIconGrid(root);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeFormIconGridRoot(root);
        return;
      }

      closeUnrelatedFormSurfaces({ preservedRoots: [root] });
      if (searchInput instanceof HTMLInputElement) {
        searchInput.value = "";
      }
      refreshFormIconGrid(root);
      trigger.setAttribute("aria-expanded", "true");
      panel.classList.remove("hidden");
      panel.setAttribute("aria-hidden", "false");
      panel.setAttribute("aria-modal", "true");
      activeFormIconGrid = root;
      window.requestAnimationFrame(() => {
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
        }
      });
    });

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    searchInput?.addEventListener("input", () => {
      refreshFormIconGrid(root);
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const closeButton = target.closest("[data-form-icon-grid-close]");
      if (closeButton instanceof HTMLButtonElement) {
        closeFormIconGridRoot(root, { restoreFocus: true });
        return;
      }

      if (target.closest("[data-form-icon-grid-backdrop]")) {
        closeFormIconGridRoot(root);
        return;
      }

      const optionButton = target.closest("[data-form-icon-grid-option]");
      if (optionButton instanceof HTMLButtonElement) {
        hiddenInput.value = optionButton.dataset.formIconGridOption ?? designSystemIconDefinitions[0].key;
        refreshFormIconGrid(root);
        closeFormIconGridRoot(root, { restoreFocus: true });
      }
    });
  }
}

export function initializeFormDrawerSelects({ scope = document } = {}) {
  bindSharedListenersOnce();

  for (const root of getFormDrawerSelectRoots(scope)) {
    if (root.dataset.formDrawerSelectInitialized === "true") {
      refreshFormDrawerSelect(root);
      continue;
    }

    root.dataset.formDrawerSelectInitialized = "true";
    const trigger = root.querySelector("[data-form-drawer-select-button]");
    const hiddenInput = root.querySelector("[data-form-drawer-select-value]");
    const panel = root.querySelector("[data-form-drawer-select-panel]");
    const closeButton = root.querySelector("[data-form-drawer-select-close]");
    const searchForm = root.querySelector(".form-drawer-select-search-shell");
    const searchInput = root.querySelector("[data-form-drawer-select-search]");

    if (
      !(trigger instanceof HTMLButtonElement)
      || !(hiddenInput instanceof HTMLInputElement)
      || !(panel instanceof HTMLElement)
    ) {
      continue;
    }

    refreshFormDrawerSelect(root);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeFormDrawerSelectRoot(root);
        return;
      }

      closeUnrelatedFormSurfaces({ preservedRoots: [root] });
      if (searchInput instanceof HTMLInputElement) {
        searchInput.value = "";
      }
      refreshFormDrawerSelect(root);
      trigger.setAttribute("aria-expanded", "true");
      panel.classList.remove("hidden");
      panel.setAttribute("aria-hidden", "false");
      panel.setAttribute("aria-modal", "true");
      activeFormDrawerSelect = root;
      window.requestAnimationFrame(() => {
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
        }
      });
    });

    closeButton?.addEventListener("click", () => {
      closeFormDrawerSelectRoot(root, { restoreFocus: true });
    });

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    searchInput?.addEventListener("input", () => {
      refreshFormDrawerSelect(root);
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-form-drawer-select-backdrop]")) {
        closeFormDrawerSelectRoot(root);
        return;
      }

      const removeButton = target.closest("[data-form-drawer-select-remove]");
      if (removeButton instanceof HTMLButtonElement) {
        const selectedValues = hiddenInput.value
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
          .filter((value) => value !== removeButton.dataset.formDrawerSelectRemove);
        hiddenInput.value = selectedValues.join(",");
        refreshFormDrawerSelect(root);
        return;
      }

      const optionButton = target.closest("[data-form-drawer-select-option]");
      if (optionButton instanceof HTMLButtonElement) {
        const maxSelections = Number.parseInt(root.dataset.formDrawerSelectMaxSelections ?? "", 10);
        const isSingleSelect = maxSelections === 1;
        const currentValues = hiddenInput.value
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        const optionValue = optionButton.dataset.value ?? "";
        const existingIndex = currentValues.indexOf(optionValue);

        if (isSingleSelect) {
          hiddenInput.value = existingIndex >= 0 ? "" : optionValue;
          refreshFormDrawerSelect(root);
          return;
        }

        if (existingIndex >= 0) {
          currentValues.splice(existingIndex, 1);
        } else if (optionValue) {
          currentValues.push(optionValue);
        }

        hiddenInput.value = currentValues.join(",");
        refreshFormDrawerSelect(root);
      }
    });
  }
}

export function initializeFormUploadFields({
  scope = document,
  initialState = "idle",
  initialFileName = "",
  onFileSelected,
} = {}) {
  for (const root of getFormUploadRoots(scope)) {
    if (root.dataset.formUploadInitialized === "true") {
      refreshFormUploadField(root);
      continue;
    }

    root.dataset.formUploadInitialized = "true";
    const input = root.querySelector("[data-form-upload-input]");
    const dropzone = root.querySelector("[data-form-upload-dropzone]");

    if (!(input instanceof HTMLInputElement) || !(dropzone instanceof HTMLElement)) {
      continue;
    }

    const applySelectedFile = (file) => {
      const shell = root.closest(".form-page-shell");
      if ((shell instanceof HTMLElement && shell.dataset.formDisabledMode === "true") || input.disabled) {
        return;
      }

      root.dataset.formUploadUserSelected = "true";
      const fileName = file?.name ?? root.dataset.formUploadDefaultFile;
      setFormUploadState(root, { state: "uploading", file, fileName });

      root.dispatchEvent(new CustomEvent("form-upload:file-selected", {
        bubbles: true,
        detail: { file, fileName, root },
      }));

      if (typeof onFileSelected === "function") {
        onFileSelected({ file, fileName, root });
      }
    };

    setFormUploadState(root, {
      state: initialState,
      fileName: initialFileName || root.dataset.formUploadDefaultFile,
      previewKind: root.dataset.formUploadPreviewKind,
      previewUrl: root.dataset.formUploadPreviewUrl,
      previewLabel: root.dataset.formUploadPreviewLabel,
    });
    if (initialState === "uploading" || initialState === "complete" || initialState === "error") {
      root.dataset.formUploadUserSelected = "true";
    }

    input.addEventListener("change", () => {
      applySelectedFile(input.files?.[0] ?? null);
    });

    for (const eventName of ["dragenter", "dragover"]) {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        const shell = root.closest(".form-page-shell");
        if ((shell instanceof HTMLElement && shell.dataset.formDisabledMode === "true") || input.disabled) {
          return;
        }
        root.dataset.formUploadDragging = "true";
      });
    }

    for (const eventName of ["dragleave", "drop"]) {
      dropzone.addEventListener(eventName, () => {
        delete root.dataset.formUploadDragging;
      });
    }

    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      applySelectedFile(event.dataTransfer?.files?.[0] ?? null);
    });
  }
}
