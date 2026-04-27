function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatTimestamp(value) {
  if (!value) {
    return "Not recorded";
  }

  return new Date(value).toLocaleString();
}

function setStateVisibility(element, visible) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.toggle("hidden", !visible);
  element.setAttribute("aria-hidden", String(!visible));
}

function setOptionalText(element, value) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const text = normalizeText(value);
  element.textContent = text;
  element.classList.toggle("hidden", !text);
  element.setAttribute("aria-hidden", String(!text));
  if (text) {
    element.dataset.fullValue = text;
  } else {
    delete element.dataset.fullValue;
  }
}

function setOptionalTags(container, tags) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const visibleTags = tags.map(normalizeText).filter(Boolean);
  container.replaceChildren();
  container.classList.toggle("hidden", visibleTags.length === 0);
  container.setAttribute("aria-hidden", String(visibleTags.length === 0));

  for (const tag of visibleTags) {
    const chip = document.createElement("span");
    chip.className = "list-page-tag tooltip-anchor";
    chip.dataset.overflowTooltipSource = "";
    chip.dataset.fullValue = tag;
    chip.textContent = tag;
    container.append(chip);
  }
}

function titleForPerson(record, fallback) {
  const name = [record?.firstName, record?.lastName].filter(Boolean).join(" ").trim();
  return name || record?.email || fallback;
}

function statusLabel(value) {
  const text = normalizeText(value);
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "Not recorded";
}

const directoryConfigs = {
  users: {
    pageKey: "users",
    idPrefix: "root-users",
    idField: "rootUserId",
    entityLabel: "root user",
    entityLabelPlural: "root users",
    title: "Root Users",
    eyebrow: "Root Admin Directory",
    description: "Review, create, and edit visible root users from the governed list-page workspace.",
    listPath: "/v1/root-users",
    detailPath: (record) => `/v1/root-users/${encodeURIComponent(record.rootUserId)}`,
    createPath: () => "/v1/root-users",
    updatePath: (record) => `/v1/root-users/${encodeURIComponent(record.rootUserId)}`,
    searchParam: "rootUsersQ",
    search: {
      placeholder: "Search root users by exact email or 3+ email prefix",
      listParam: "emailPrefix",
      exactParam: "email",
      exactCode: "ROOT_USER_NOT_FOUND",
      minPrefixLength: 3,
    },
    fields: [
      { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
      { name: "firstName", label: "First name", type: "text", autocomplete: "given-name" },
      { name: "lastName", label: "Last name", type: "text", autocomplete: "family-name" },
      {
        name: "status",
        label: "Status",
        type: "select",
        editOnly: true,
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ],
    card(record) {
      return {
        title: titleForPerson(record, "Root User"),
        subtitle: record.email,
        description: `${statusLabel(record.status)} root user. Updated ${formatTimestamp(record.updatedAt)}.`,
        tags: [
          record.deletedAt ? "Deleted" : statusLabel(record.status),
          record.anonymized ? "Anonymized" : "",
          record.firstName || record.lastName ? "Named" : "Email-only",
        ],
      };
    },
    detail(record) {
      return {
        meta: `${statusLabel(record.status)} root user`,
        title: titleForPerson(record, "Root User"),
        subtitle: record.email,
        description: [
          `Root user ID: ${record.rootUserId}.`,
          `Created: ${formatTimestamp(record.createdAt)}.`,
          `Updated: ${formatTimestamp(record.updatedAt)}.`,
          record.deletedAt ? `Deleted: ${formatTimestamp(record.deletedAt)}.` : "This record remains visible.",
        ].join(" "),
        tags: [record.rootUserId, `Created ${formatTimestamp(record.createdAt)}`, `Updated ${formatTimestamp(record.updatedAt)}`],
      };
    },
  },
  tenants: {
    pageKey: "tenants",
    idPrefix: "tenants",
    idField: "tenantId",
    entityLabel: "tenant",
    entityLabelPlural: "tenants",
    title: "Tenants",
    eyebrow: "Tenant Directory",
    description: "Review, create, and edit tenants from the governed list-page workspace.",
    listPath: "/v1/tenants",
    detailPath: (record) => `/v1/tenants/${encodeURIComponent(record.tenantId)}`,
    createPath: () => "/v1/tenants",
    updatePath: (record) => `/v1/tenants/${encodeURIComponent(record.tenantId)}`,
    searchParam: "tenantsQ",
    search: {
      placeholder: "Search tenants by name or business ID prefix",
      listParam: "namePrefix",
      fallbackListParam: "bizIdPrefix",
      minPrefixLength: 1,
    },
    fields: [
      { name: "bizId", label: "Business ID", type: "text", required: true, createOnly: true },
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "customer", label: "Customer" },
          { value: "demo", label: "Demo" },
          { value: "test", label: "Test" },
        ],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "draft", label: "Draft" },
          { value: "live", label: "Live" },
          { value: "disabled", label: "Disabled" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ],
    card(record) {
      return {
        title: record.name || "Tenant",
        subtitle: record.bizId,
        description: `${statusLabel(record.status)} ${statusLabel(record.category)} tenant. Updated ${formatTimestamp(record.updatedAt)}.`,
        tags: [statusLabel(record.status), statusLabel(record.category), record.deletedAt ? "Deleted" : "Visible"],
      };
    },
    detail(record) {
      return {
        meta: `${statusLabel(record.status)} tenant`,
        title: record.name || "Tenant",
        subtitle: record.bizId,
        description: [
          `Tenant ID: ${record.tenantId}.`,
          `Category: ${statusLabel(record.category)}.`,
          `Created: ${formatTimestamp(record.createdAt)}.`,
          `Updated: ${formatTimestamp(record.updatedAt)}.`,
        ].join(" "),
        tags: [record.tenantId, record.bizId, statusLabel(record.category), statusLabel(record.status)],
      };
    },
  },
  "tenant-admins": {
    pageKey: "tenant-admins",
    idPrefix: "tenant-admins",
    idField: "tenantAdminId",
    entityLabel: "tenant admin",
    entityLabelPlural: "tenant admins",
    title: "Tenant Admins",
    eyebrow: "Tenant Admin Directory",
    description: "Choose a tenant, then review, create, and edit tenant-admin profiles in the governed list-page workspace.",
    listPath: ({ selectedTenantId }) => selectedTenantId ? `/v1/tenants/${encodeURIComponent(selectedTenantId)}/admins` : null,
    detailPath: (record, { selectedTenantId }) =>
      `/v1/tenants/${encodeURIComponent(record.tenantId ?? selectedTenantId)}/admins/${encodeURIComponent(record.tenantAdminId)}`,
    createPath: (_record, { selectedTenantId }) => `/v1/tenants/${encodeURIComponent(selectedTenantId)}/admins`,
    updatePath: (record, { selectedTenantId }) =>
      `/v1/tenants/${encodeURIComponent(record.tenantId ?? selectedTenantId)}/admins/${encodeURIComponent(record.tenantAdminId)}`,
    searchParam: "tenantAdminsQ",
    tenantParam: "tenantId",
    search: {
      placeholder: "Search tenant admins by email prefix",
      listParam: "emailPrefix",
      minPrefixLength: 1,
    },
    fields: [
      { name: "tenantId", label: "Tenant", type: "tenant-select", required: true, createOnly: true },
      { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
      { name: "firstName", label: "First name", type: "text", autocomplete: "given-name" },
      { name: "lastName", label: "Last name", type: "text", autocomplete: "family-name" },
    ],
    card(record) {
      return {
        title: titleForPerson(record, "Tenant Admin"),
        subtitle: record.email,
        description: `${statusLabel(record.emailVerificationStatus)} tenant admin. Updated ${formatTimestamp(record.updatedAt)}.`,
        tags: [statusLabel(record.emailVerificationStatus), record.firstName || record.lastName ? "Named" : "Email-only"],
      };
    },
    detail(record) {
      return {
        meta: `${statusLabel(record.emailVerificationStatus)} tenant admin`,
        title: titleForPerson(record, "Tenant Admin"),
        subtitle: record.email,
        description: [
          `Tenant admin ID: ${record.tenantAdminId}.`,
          `Tenant ID: ${record.tenantId}.`,
          `Created: ${formatTimestamp(record.createdAt)}.`,
          `Updated: ${formatTimestamp(record.updatedAt)}.`,
        ].join(" "),
        tags: [record.tenantAdminId, record.tenantId, statusLabel(record.emailVerificationStatus)],
      };
    },
  },
};

function renderField(field, mode, config) {
  if (field.createOnly && mode === "edit") {
    return "";
  }
  if (field.editOnly && mode === "create") {
    return "";
  }

  const fieldId = `${config.idPrefix}-form-${mode}-${field.name}`;
  const required = field.required ? " required" : "";
  const autocomplete = field.autocomplete ? ` autocomplete="${escapeHtml(field.autocomplete)}"` : " autocomplete=\"off\"";

  if (field.type === "select" || field.type === "tenant-select") {
    const options = field.type === "tenant-select"
      ? ""
      : field.options.map((option) =>
          `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`,
        ).join("");
    const optionSource = field.type === "tenant-select" ? " data-tenant-options" : "";

    return `
      <label class="drawer-form-field">
        <span class="drawer-form-label">${escapeHtml(field.label)}</span>
        <select
          id="${escapeHtml(fieldId)}"
          class="drawer-form-input"
          name="${escapeHtml(field.name)}"
          ${optionSource}
          ${required}
        >${options}</select>
      </label>
    `;
  }

  return `
    <label class="drawer-form-field">
      <span class="drawer-form-label">${escapeHtml(field.label)}</span>
      <input
        id="${escapeHtml(fieldId)}"
        class="drawer-form-input"
        type="${escapeHtml(field.type)}"
        name="${escapeHtml(field.name)}"
        ${autocomplete}
        ${required}
      />
    </label>
  `;
}

function renderForm(mode, config) {
  const title = mode === "create" ? `Create ${config.entityLabel}` : `Edit ${config.entityLabel}`;
  return `
    <form class="drawer-form hidden" data-directory-form="${escapeHtml(mode)}" aria-hidden="true">
      <div class="drawer-form-section">
        <div class="drawer-form-section-header">
          <p class="list-page-state-eyebrow">${mode === "create" ? "Create" : "Edit"}</p>
          <h3 class="drawer-form-section-title">${escapeHtml(title)}</h3>
          <p class="list-page-state-description">
            Required fields stay inside this drawer form and submit to the existing protected root-admin API.
          </p>
        </div>
        <div class="drawer-form-grid">
          ${config.fields.map((field) => renderField(field, mode, config)).join("")}
        </div>
        <p class="drawer-form-status" aria-live="polite" data-directory-form-status></p>
      </div>
    </form>
  `;
}

export function renderRootAdminDirectoryWorkspaceShell(pageKey) {
  const config = directoryConfigs[pageKey] ?? directoryConfigs.users;
  const createLabel = `Create ${config.entityLabel}`;
  const detailTitleId = `${config.idPrefix}-detail-title`;
  const detailPanelId = `${config.idPrefix}-detail-panel`;

  return `
    <section
      id="${escapeHtml(config.idPrefix)}-list-page"
      class="list-page-shell list-page-shell-split"
      data-root-admin-directory="${escapeHtml(config.pageKey)}"
      data-selectable-list
      data-selectable-list-layout
    >
      <p
        id="${escapeHtml(config.idPrefix)}-list-announcement"
        class="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-directory-announcement
      ></p>

      <div class="list-page-list-column" aria-label="${escapeHtml(config.title)}" data-selectable-list-column>
        <div class="component-catalog-section-header">
          <div>
            <p class="top-nav-preview-eyebrow">${escapeHtml(config.eyebrow)}</p>
            <h1 class="component-catalog-section-title">${escapeHtml(config.title)}</h1>
            <p class="component-catalog-meta">${escapeHtml(config.description)}</p>
          </div>
          <div class="list-page-header-actions">
            ${config.tenantParam ? `
              <label class="drawer-form-field">
                <span class="visually-hidden">Tenant</span>
                <select class="drawer-form-input" data-directory-tenant-filter></select>
              </label>
            ` : ""}
            <button class="list-page-create-button" type="button" data-directory-create>
              ${escapeHtml(createLabel)}
            </button>
          </div>
        </div>

        <div class="list-page-loading-group hidden" aria-live="polite" aria-hidden="true" data-directory-loading data-selectable-list-loading>
          <p class="list-page-loading-label" data-directory-loading-label>Loading ${escapeHtml(config.entityLabelPlural)}...</p>
          <div class="list-page-loading-card" aria-hidden="true">
            <span class="list-page-loading-line list-page-loading-line-title"></span>
            <span class="list-page-loading-line list-page-loading-line-subtitle"></span>
            <span class="list-page-loading-line list-page-loading-line-body"></span>
          </div>
        </div>

        <div class="list-page-state-card hidden" aria-live="polite" aria-hidden="true" data-directory-empty data-selectable-list-empty-state>
          <p class="list-page-state-eyebrow">No visible ${escapeHtml(config.entityLabelPlural)}</p>
          <h2 class="list-page-state-title">No records are visible yet</h2>
          <p class="list-page-state-description">Create a record or refresh this governed directory view.</p>
          <div class="list-page-state-actions">
            <button class="list-page-state-button" type="button" data-directory-refresh data-selectable-list-empty-reset>Refresh</button>
          </div>
        </div>

        <div class="list-page-state-card hidden" aria-live="polite" aria-hidden="true" data-directory-no-results data-selectable-list-no-results-state>
          <p class="list-page-state-eyebrow">No matching results</p>
          <h2 class="list-page-state-title">No records match this search</h2>
          <p class="list-page-state-description">
            No visible ${escapeHtml(config.entityLabelPlural)} matched
            <span class="list-page-state-query" data-directory-query-copy>this query</span>.
          </p>
          <div class="list-page-state-actions">
            <button class="list-page-state-button" type="button" data-directory-clear-search data-selectable-list-clear-search>Clear search</button>
          </div>
        </div>

        <div class="list-page-state-card hidden" aria-live="polite" aria-hidden="true" data-directory-error data-selectable-list-initial-error-state>
          <p class="list-page-state-eyebrow">Directory unavailable</p>
          <h2 class="list-page-state-title">${escapeHtml(config.title)} could not load</h2>
          <p class="list-page-state-description">Retry the protected root-admin request without leaving the page.</p>
          <div class="list-page-state-actions">
            <button class="list-page-state-button" type="button" data-directory-retry data-selectable-list-initial-retry>Retry</button>
          </div>
        </div>

        <div data-directory-items></div>

        <div class="list-page-lazy-load-status" aria-live="polite" data-directory-status>
          <button class="list-page-lazy-load-status-button" type="button" data-directory-load-more data-selectable-list-status-action>
            Load more ${escapeHtml(config.entityLabelPlural)}
          </button>
        </div>
      </div>

      <aside
        id="${escapeHtml(detailPanelId)}"
        class="list-page-detail-panel hidden"
        aria-labelledby="${escapeHtml(detailTitleId)}"
        aria-hidden="true"
        data-directory-detail-panel
        data-selectable-list-detail-panel
      >
        <div class="list-page-detail-header">
          <div class="list-page-detail-copy">
            <p class="list-page-detail-meta tooltip-anchor" data-directory-detail-meta data-overflow-tooltip-source></p>
            <h2 id="${escapeHtml(detailTitleId)}" class="list-page-detail-title" tabindex="-1" data-directory-detail-title></h2>
            <p class="list-page-detail-subtitle" data-directory-detail-subtitle></p>
          </div>
          <div class="list-page-detail-controls">
            <div class="list-page-detail-action-row">
              <button id="${escapeHtml(config.idPrefix)}-detail-edit" class="list-page-state-button" type="button" data-directory-edit>Edit</button>
              <button id="${escapeHtml(config.idPrefix)}-detail-close" class="drawer-close-button" type="button" aria-label="Close details" data-directory-close>×</button>
            </div>
          </div>
        </div>
        <div class="list-page-detail-body">
          <div data-directory-view-body>
            <p class="list-page-detail-description" data-directory-detail-description></p>
            <div class="list-page-detail-tags" aria-label="${escapeHtml(config.title)} fields" data-directory-detail-tags></div>
          </div>
          ${renderForm("create", config)}
          ${renderForm("edit", config)}
        </div>
        <div class="list-page-detail-footer">
          <div class="list-page-detail-nav-row" data-directory-view-actions>
            <button id="${escapeHtml(config.idPrefix)}-detail-prev" class="list-page-detail-nav-button" type="button" data-directory-prev>Previous</button>
            <button id="${escapeHtml(config.idPrefix)}-detail-next" class="list-page-detail-nav-button" type="button" data-directory-next>Next</button>
          </div>
          <div class="list-page-detail-nav-row hidden" data-directory-form-actions>
            <button class="list-page-detail-nav-button" type="button" data-directory-form-cancel>Cancel</button>
            <button class="list-page-detail-nav-button" type="button" data-directory-form-save>Save</button>
          </div>
        </div>
      </aside>
    </section>
  `;
}

export function createRootAdminDirectoryWorkspaceController({
  pageKey,
  root,
  searchInput,
  fetchJson,
  setShellMessage,
  getCurrentPage,
}) {
  const config = directoryConfigs[pageKey] ?? directoryConfigs.users;
  if (!(root instanceof HTMLElement)) {
    return { async handleShellSearchSubmit() { return false; }, syncPageState() {}, reset() {} };
  }

  if (!root.querySelector(`[data-root-admin-directory="${config.pageKey}"]`)) {
    root.innerHTML = renderRootAdminDirectoryWorkspaceShell(config.pageKey);
  }

  const workspaceRoot = root.querySelector(`[data-root-admin-directory="${config.pageKey}"]`);
  const listColumn = root.querySelector("[data-selectable-list-column]");
  const itemsContainer = root.querySelector("[data-directory-items]");
  const detailPanel = root.querySelector("[data-directory-detail-panel]");
  const detailTitle = root.querySelector("[data-directory-detail-title]");
  const detailSubtitle = root.querySelector("[data-directory-detail-subtitle]");
  const detailDescription = root.querySelector("[data-directory-detail-description]");
  const detailMeta = root.querySelector("[data-directory-detail-meta]");
  const detailTags = root.querySelector("[data-directory-detail-tags]");
  const viewBody = root.querySelector("[data-directory-view-body]");
  const viewActions = root.querySelector("[data-directory-view-actions]");
  const formActions = root.querySelector("[data-directory-form-actions]");
  const createButton = root.querySelector("[data-directory-create]");
  const editButton = root.querySelector("[data-directory-edit]");
  const closeButton = root.querySelector("[data-directory-close]");
  const prevButton = root.querySelector("[data-directory-prev]");
  const nextButton = root.querySelector("[data-directory-next]");
  const cancelButton = root.querySelector("[data-directory-form-cancel]");
  const saveButton = root.querySelector("[data-directory-form-save]");
  const loadMoreButton = root.querySelector("[data-directory-load-more]");
  const loading = root.querySelector("[data-directory-loading]");
  const emptyState = root.querySelector("[data-directory-empty]");
  const noResultsState = root.querySelector("[data-directory-no-results]");
  const errorState = root.querySelector("[data-directory-error]");
  const queryCopy = root.querySelector("[data-directory-query-copy]");
  const refreshButton = root.querySelector("[data-directory-refresh]");
  const clearSearchButton = root.querySelector("[data-directory-clear-search]");
  const retryButton = root.querySelector("[data-directory-retry]");
  const tenantFilter = root.querySelector("[data-directory-tenant-filter]");
  const announcement = root.querySelector("[data-directory-announcement]");

  const initialSearchParams = new URLSearchParams(window.location.search);
  let currentQuery = initialSearchParams.get(config.searchParam)?.trim() ?? "";
  let selectedTenantId = initialSearchParams.get(config.tenantParam)?.trim() ?? "";
  let tenantOptions = [];
  let items = [];
  let currentPage = 0;
  let totalPages = 1;
  let selectedId = null;
  let loadedOnce = false;
  let isLoading = false;
  let mode = "view";
  let currentListState = "items";
  let lastDetailTrigger = null;

  function isActivePage() {
    return getCurrentPage() === config.pageKey;
  }

  function getSelectedRecord() {
    return items.find((item) => item[config.idField] === selectedId) ?? null;
  }

  function getCardButtons() {
    return Array.from(root.querySelectorAll("[data-directory-card]"));
  }

  function getActiveIndex() {
    return items.findIndex((item) => item[config.idField] === selectedId);
  }

  function announce(message) {
    if (announcement instanceof HTMLElement) {
      announcement.textContent = "";
      window.requestAnimationFrame(() => {
        announcement.textContent = message;
      });
    }
  }

  function syncUrlParams() {
    const nextUrl = new URL(window.location.href);
    if (currentQuery) {
      nextUrl.searchParams.set(config.searchParam, currentQuery);
    } else {
      nextUrl.searchParams.delete(config.searchParam);
    }
    if (config.tenantParam && selectedTenantId) {
      nextUrl.searchParams.set(config.tenantParam, selectedTenantId);
    }
    window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  }

  function setListState(nextState) {
    currentListState = nextState;
    setStateVisibility(emptyState, nextState === "empty");
    setStateVisibility(noResultsState, nextState === "no-results");
    setStateVisibility(errorState, nextState === "error");
    itemsContainer?.classList.toggle("hidden", nextState !== "items");
    if (queryCopy instanceof HTMLElement) {
      queryCopy.textContent = currentQuery ? `"${currentQuery}"` : "this query";
    }
    syncLoadMoreButton();
  }

  function setLoading(visible) {
    isLoading = visible;
    setStateVisibility(loading, visible);
    if (listColumn instanceof HTMLElement) {
      listColumn.setAttribute("aria-busy", String(visible));
    }
    syncLoadMoreButton();
  }

  function syncLoadMoreButton() {
    if (!(loadMoreButton instanceof HTMLButtonElement)) {
      return;
    }
    const canLoadMore = currentListState === "items" && !isLoading && currentPage < totalPages;
    loadMoreButton.disabled = !canLoadMore;
    loadMoreButton.textContent = canLoadMore
      ? `Load more ${config.entityLabelPlural}`
      : `All visible ${config.entityLabelPlural} loaded.`;
  }

  function closeDetailPanel({ restoreFocus = false } = {}) {
    selectedId = null;
    mode = "view";
    workspaceRoot?.classList.remove("detail-open");
    detailPanel?.classList.add("hidden");
    detailPanel?.setAttribute("aria-hidden", "true");
    for (const button of getCardButtons()) {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    }
    if (restoreFocus && lastDetailTrigger instanceof HTMLElement && document.contains(lastDetailTrigger)) {
      lastDetailTrigger.focus({ preventScroll: true });
    }
  }

  function syncDetailAccessibility() {
    if (!(detailPanel instanceof HTMLElement)) {
      return;
    }
    const isOpen = !detailPanel.classList.contains("hidden");
    const useModal = isOpen && window.matchMedia("(max-width: 62rem)").matches;
    detailPanel.setAttribute("role", useModal ? "dialog" : "region");
    detailPanel.setAttribute("aria-modal", String(useModal));
  }

  function openPanel() {
    workspaceRoot?.classList.add("detail-open");
    detailPanel?.classList.remove("hidden");
    detailPanel?.setAttribute("aria-hidden", "false");
    syncDetailAccessibility();
  }

  function setMode(nextMode) {
    mode = nextMode;
    const isForm = mode === "create" || mode === "edit";
    setStateVisibility(viewBody, !isForm);
    viewActions?.classList.toggle("hidden", isForm);
    formActions?.classList.toggle("hidden", !isForm);
    for (const form of root.querySelectorAll("[data-directory-form]")) {
      const visible = form.getAttribute("data-directory-form") === mode;
      setStateVisibility(form, visible);
    }
    editButton?.classList.toggle("hidden", isForm || !selectedId);
  }

  function syncDetail(record, trigger = null) {
    if (!record) {
      return;
    }
    selectedId = record[config.idField];
    lastDetailTrigger = trigger;

    const detail = config.detail(record);
    setOptionalText(detailMeta, detail.meta);
    if (detailTitle instanceof HTMLElement) {
      detailTitle.textContent = detail.title;
    }
    setOptionalText(detailSubtitle, detail.subtitle);
    setOptionalText(detailDescription, detail.description);
    setOptionalTags(detailTags, detail.tags);

    for (const button of getCardButtons()) {
      const isActive = button.dataset.directoryRecordId === selectedId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }

    const activeIndex = getActiveIndex();
    if (prevButton instanceof HTMLButtonElement) {
      prevButton.disabled = activeIndex <= 0;
    }
    if (nextButton instanceof HTMLButtonElement) {
      nextButton.disabled = activeIndex === -1 || (activeIndex >= items.length - 1 && currentPage >= totalPages);
    }

    openPanel();
    setMode("view");
    detailTitle?.focus({ preventScroll: true });
  }

  function renderCard(record) {
    const model = config.card(record);
    const button = document.createElement("button");
    button.className = "list-page-card list-page-card-button";
    button.type = "button";
    button.dataset.directoryCard = "";
    button.dataset.selectableListCard = "";
    button.dataset.directoryRecordId = record[config.idField];
    button.setAttribute("aria-controls", `${config.idPrefix}-detail-panel`);
    button.setAttribute("aria-pressed", String(record[config.idField] === selectedId));
    button.innerHTML = `
      <span class="list-page-card-header">
        <span class="list-page-card-copy">
          <span class="list-page-card-title tooltip-anchor" data-overflow-tooltip-source>${escapeHtml(model.title)}</span>
          <span class="list-page-card-subtitle tooltip-anchor" data-overflow-tooltip-source>${escapeHtml(model.subtitle)}</span>
        </span>
      </span>
      <span class="list-page-card-description">${escapeHtml(model.description)}</span>
      <span class="list-page-card-tags" aria-label="${escapeHtml(config.title)} tags">
        ${model.tags.map(normalizeText).filter(Boolean).map((tag) => `<span class="list-page-tag">${escapeHtml(tag)}</span>`).join("")}
      </span>
    `;
    if (record[config.idField] === selectedId) {
      button.classList.add("active");
    }
    return button;
  }

  function renderList() {
    if (!(itemsContainer instanceof HTMLElement)) {
      return;
    }
    itemsContainer.replaceChildren(...items.map(renderCard));
  }

  function searchParamsFor(query) {
    const normalized = normalizeText(query).toLowerCase();
    const params = new URLSearchParams();
    if (!normalized) {
      params.set("page", "1");
      params.set("pageSize", "25");
      params.set("orderBy", "updatedAt");
      params.set("orderDirection", "desc");
      return params;
    }
    if (config.search.exactParam && normalized.includes("@") && !normalized.includes(" ")) {
      params.set(config.search.exactParam, normalized);
      return params;
    }
    if (normalized.length < config.search.minPrefixLength) {
      throw new Error(`Search ${config.entityLabelPlural} with at least ${config.search.minPrefixLength} characters.`);
    }
    params.set("page", "1");
    params.set("pageSize", "25");
    params.set("orderBy", "updatedAt");
    params.set("orderDirection", "desc");
    params.set(config.search.listParam, normalized);
    return params;
  }

  function listPathFor(pageNumber) {
    const basePath = typeof config.listPath === "function" ? config.listPath({ selectedTenantId }) : config.listPath;
    if (!basePath) {
      return null;
    }
    const params = searchParamsFor(currentQuery);
    if (!config.search.exactParam || !params.has(config.search.exactParam)) {
      params.set("page", String(pageNumber));
    }
    return `${basePath}?${params.toString()}`;
  }

  async function loadTenantsForFilter() {
    if (!config.tenantParam) {
      return;
    }
    const response = await fetchJson("/v1/tenants?page=1&pageSize=100&orderBy=name&orderDirection=asc");
    tenantOptions = Array.isArray(response?.items) ? response.items : [];
    if (!selectedTenantId && tenantOptions[0]) {
      selectedTenantId = tenantOptions[0].tenantId;
      syncUrlParams();
    }
    renderTenantOptions();
  }

  function renderTenantOptions() {
    const selects = [
      tenantFilter,
      ...Array.from(root.querySelectorAll("[data-tenant-options]")),
    ];
    for (const select of selects) {
      if (!(select instanceof HTMLSelectElement)) {
        continue;
      }
      select.replaceChildren(
        ...tenantOptions.map((tenant) => {
          const option = document.createElement("option");
          option.value = tenant.tenantId;
          option.textContent = tenant.name ?? tenant.bizId ?? tenant.tenantId;
          return option;
        }),
      );
      select.value = selectedTenantId;
    }
  }

  async function loadDirectory({ append = false } = {}) {
    if (config.tenantParam && tenantOptions.length === 0) {
      await loadTenantsForFilter();
    }

    const nextPage = append ? currentPage + 1 : 1;
    const path = listPathFor(nextPage);
    if (!path) {
      items = [];
      renderList();
      setListState("empty");
      return;
    }

    setLoading(true);
    try {
      let response;
      try {
        response = await fetchJson(path);
      } catch (error) {
        if (config.search.exactParam && error?.code === config.search.exactCode) {
          response = { items: [], page: 1, totalPages: 1 };
        } else {
          throw error;
        }
      }

      const nextItems = Array.isArray(response?.items) ? response.items : response ? [response] : [];
      items = append ? [...items, ...nextItems] : nextItems;
      currentPage = response?.page ?? 1;
      totalPages = response?.totalPages ?? 1;
      loadedOnce = true;
      renderList();
      setListState(items.length > 0 ? "items" : currentQuery ? "no-results" : "empty");
      if (!items.some((item) => item[config.idField] === selectedId)) {
        closeDetailPanel({ restoreFocus: false });
      }
      syncLoadMoreButton();
    } catch (error) {
      setListState("error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function payloadFromForm(form, intent) {
    const data = new FormData(form);
    const payload = {};
    for (const field of config.fields) {
      if (field.createOnly && intent === "edit") {
        continue;
      }
      if (field.editOnly && intent === "create") {
        continue;
      }
      if (field.type === "tenant-select") {
        continue;
      }
      const value = normalizeText(data.get(field.name));
      if (value || field.required) {
        payload[field.name] = value;
      }
    }
    return payload;
  }

  function fillForm(intent, record = null) {
    const form = root.querySelector(`[data-directory-form="${intent}"]`);
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    form.reset();
    renderTenantOptions();
    for (const field of config.fields) {
      const control = form.elements.namedItem(field.name);
      if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) {
        continue;
      }
      if (field.type === "tenant-select") {
        control.value = record?.tenantId ?? selectedTenantId;
      } else {
        control.value = normalizeText(record?.[field.name]);
      }
    }
  }

  function openCreateForm() {
    selectedId = null;
    openPanel();
    fillForm("create");
    setMode("create");
    root.querySelector('[data-directory-form="create"] input, [data-directory-form="create"] select')?.focus({ preventScroll: true });
  }

  function openEditForm() {
    const record = getSelectedRecord();
    if (!record) {
      return;
    }
    fillForm("edit", record);
    setMode("edit");
    root.querySelector('[data-directory-form="edit"] input, [data-directory-form="edit"] select')?.focus({ preventScroll: true });
  }

  async function saveForm() {
    const form = root.querySelector(`[data-directory-form="${mode}"]`);
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) {
      return;
    }

    const intent = mode;
    const selectedRecord = getSelectedRecord();
    const tenantSelect = form.elements.namedItem("tenantId");
    const nextTenantId = tenantSelect instanceof HTMLSelectElement ? tenantSelect.value : selectedTenantId;
    const context = { selectedTenantId: nextTenantId };
    const path = intent === "create"
      ? config.createPath(null, context)
      : config.updatePath(selectedRecord, context);
    const payload = payloadFromForm(form, intent);

    try {
      const savedRecord = await fetchJson(path, {
        method: intent === "create" ? "POST" : "PATCH",
        body: JSON.stringify(payload),
      });
      if (config.tenantParam && nextTenantId !== selectedTenantId) {
        selectedTenantId = nextTenantId;
        syncUrlParams();
        renderTenantOptions();
      }
      await loadDirectory();
      const matchingRecord = items.find((item) => item[config.idField] === savedRecord?.[config.idField]) ?? savedRecord;
      if (matchingRecord) {
        syncDetail(matchingRecord);
      }
      setShellMessage(`${statusLabel(intent)} ${config.entityLabel} saved.`, "mutation-success");
      announce(`${statusLabel(intent)} ${config.entityLabel} saved.`);
    } catch (error) {
      setShellMessage(error?.message ?? `Could not save ${config.entityLabel}.`, "error");
    }
  }

  async function handleShellSearchSubmit(query) {
    if (!isActivePage()) {
      return false;
    }
    currentQuery = normalizeText(query);
    try {
      searchParamsFor(currentQuery);
    } catch (error) {
      setShellMessage(error.message, "error");
      return true;
    }
    syncUrlParams();
    try {
      await loadDirectory();
      if (currentListState === "no-results") {
        setShellMessage(`No visible ${config.entityLabelPlural} matched "${currentQuery}".`, "error");
      }
    } catch (_error) {
      setShellMessage(`Could not update ${config.entityLabelPlural}.`, "error");
    }
    return true;
  }

  async function ensureLoaded() {
    if (loadedOnce || isLoading || !isActivePage()) {
      return;
    }
    try {
      await loadDirectory();
    } catch (_error) {
      setShellMessage(`Could not load ${config.entityLabelPlural}.`, "error");
    }
  }

  function syncSearchInput() {
    if (searchInput instanceof HTMLInputElement && isActivePage()) {
      searchInput.value = currentQuery;
    }
  }

  function syncPageState() {
    syncSearchInput();
    syncDetailAccessibility();
    void ensureLoaded();
  }

  root.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const card = target?.closest("[data-directory-card]");
    if (card instanceof HTMLElement) {
      const record = items.find((item) => item[config.idField] === card.dataset.directoryRecordId);
      syncDetail(record, card);
      return;
    }
    if (target?.closest("[data-directory-create]")) {
      openCreateForm();
      return;
    }
    if (target?.closest("[data-directory-edit]")) {
      openEditForm();
      return;
    }
    if (target?.closest("[data-directory-close]")) {
      closeDetailPanel({ restoreFocus: true });
      return;
    }
    if (target?.closest("[data-directory-form-cancel]")) {
      const record = getSelectedRecord();
      if (record) {
        syncDetail(record);
      } else {
        closeDetailPanel({ restoreFocus: true });
      }
      return;
    }
    if (target?.closest("[data-directory-form-save]")) {
      void saveForm();
      return;
    }
    if (target?.closest("[data-directory-load-more]")) {
      void loadDirectory({ append: true });
      return;
    }
    if (target?.closest("[data-directory-refresh]") || target?.closest("[data-directory-retry]")) {
      void loadDirectory();
      return;
    }
    if (target?.closest("[data-directory-clear-search]")) {
      currentQuery = "";
      syncUrlParams();
      if (searchInput instanceof HTMLInputElement) {
        searchInput.value = "";
        searchInput.focus({ preventScroll: true });
      }
      void loadDirectory();
      return;
    }
    if (target?.closest("[data-directory-prev]")) {
      const index = getActiveIndex();
      if (index > 0) {
        syncDetail(items[index - 1]);
      }
      return;
    }
    if (target?.closest("[data-directory-next]")) {
      const index = getActiveIndex();
      if (index >= 0 && index < items.length - 1) {
        syncDetail(items[index + 1]);
      } else if (index >= 0 && currentPage < totalPages && !isLoading) {
        void loadDirectory({ append: true }).then(() => {
          const nextRecord = items[index + 1];
          if (nextRecord) {
            syncDetail(nextRecord);
          }
        }).catch(() => {
          setShellMessage(`Could not load more ${config.entityLabelPlural}.`, "error");
        });
      }
    }
  });

  root.addEventListener("change", (event) => {
    if (event.target === tenantFilter && tenantFilter instanceof HTMLSelectElement) {
      selectedTenantId = tenantFilter.value;
      syncUrlParams();
      loadedOnce = false;
      closeDetailPanel({ restoreFocus: false });
      void loadDirectory();
    }
  });

  window.addEventListener("resize", syncDetailAccessibility);
  const maybeLoadMoreFromScroll = () => {
    if (!isActivePage() || isLoading || currentListState !== "items" || currentPage >= totalPages) {
      return;
    }
    const detailOpen = workspaceRoot instanceof HTMLElement && workspaceRoot.classList.contains("detail-open");
    const distanceFromBottom = detailOpen && listColumn instanceof HTMLElement
      ? listColumn.scrollHeight - listColumn.clientHeight - listColumn.scrollTop
      : document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    if (distanceFromBottom <= 120) {
      void loadDirectory({ append: true }).catch(() => {
        setShellMessage(`Could not load more ${config.entityLabelPlural}.`, "error");
      });
    }
  };
  window.addEventListener("scroll", maybeLoadMoreFromScroll, { passive: true });
  listColumn?.addEventListener("scroll", maybeLoadMoreFromScroll, { passive: true });

  return {
    handleShellSearchSubmit,
    syncPageState,
    reset() {
      items = [];
      currentPage = 0;
      totalPages = 1;
      loadedOnce = false;
      closeDetailPanel({ restoreFocus: false });
      renderList();
      setListState("items");
    },
  };
}
