import {
  createInitialState,
  deriveViewFlags,
  displayNameForRootUser,
  displayNameForSession,
  markSessionExpired,
  resetToLoginState,
} from "./state.mjs";
import { signLoginChallenge } from "./helperClient.mjs";

class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const state = createInitialState();

const authView = document.getElementById("auth-view");
const shellView = document.getElementById("shell-view");
const sshStage = document.getElementById("ssh-stage");
const authMessage = document.getElementById("auth-message");
const shellMessage = document.getElementById("shell-message");
const sessionSummary = document.getElementById("session-summary");
const expiryOverlay = document.getElementById("expiry-overlay");
const sshInstructions = document.getElementById("ssh-instructions");
const sshKeySelect = document.getElementById("ssh-key-select");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const signSubmit = document.getElementById("sign-submit");
const logoutButton = document.getElementById("logout-button");
const returnToLogin = document.getElementById("return-to-login");
const refreshConsoleButton = document.getElementById("refresh-console");
const navButtons = Array.from(document.querySelectorAll("[data-page]"));
const myDetailsPage = document.getElementById("page-my-details");
const viewUsersPage = document.getElementById("page-view-users");
const rootRolesPage = document.getElementById("page-root-roles");

const createRootUserButton = document.getElementById("create-root-user");
const refreshRootUsersButton = document.getElementById("refresh-root-users");
const usersSearchForm = document.getElementById("users-search-form");
const usersFilterSelect = document.getElementById("users-filter");
const usersSearchFieldSelect = document.getElementById("users-search-field");
const usersSearchInput = document.getElementById("users-search-input");
const usersClearSearchButton = document.getElementById("users-clear-search");
const usersPageSizeSelect = document.getElementById("users-page-size");
const usersPaginationSummary = document.getElementById("users-pagination-summary");
const usersPageIndicator = document.getElementById("users-page-indicator");
const usersPrevPageButton = document.getElementById("users-prev-page");
const usersNextPageButton = document.getElementById("users-next-page");
const usersList = document.getElementById("users-list");
const selectedRootUser = document.getElementById("selected-root-user");
const userDrawerOverlay = document.getElementById("user-drawer-overlay");
const userDrawerBackdrop = document.getElementById("user-drawer-backdrop");
const closeUserDrawerButton = document.getElementById("close-user-drawer");
const userSortButtons = Array.from(document.querySelectorAll("[data-sort-by]"));

const createRootRoleButton = document.getElementById("create-root-role");
const refreshRootRolesButton = document.getElementById("refresh-root-roles");
const rootRolesPageSizeSelect = document.getElementById("root-roles-page-size");
const rootRolesIncludeInactiveSelect = document.getElementById("root-roles-include-inactive");
const rootRolesPaginationSummary = document.getElementById("root-roles-pagination-summary");
const rootRolesPageIndicator = document.getElementById("root-roles-page-indicator");
const rootRolesPrevPageButton = document.getElementById("root-roles-prev-page");
const rootRolesNextPageButton = document.getElementById("root-roles-next-page");
const rootRolesList = document.getElementById("root-roles-list");
const selectedRootRole = document.getElementById("selected-root-role");
const roleDrawerOverlay = document.getElementById("role-drawer-overlay");
const roleDrawerBackdrop = document.getElementById("role-drawer-backdrop");
const closeRoleDrawerButton = document.getElementById("close-role-drawer");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setMessage(node, message, tone = "info") {
  node.textContent = message;
  node.dataset.tone = tone;
  node.classList.toggle("hidden", !message);
}

function setShellMessage(message, tone = "info") {
  state.shellMessage = message;
  setMessage(shellMessage, message, tone);
}

function renderKeyOptions(keys) {
  sshKeySelect.innerHTML = "";
  for (const key of keys) {
    const option = document.createElement("option");
    option.value = key.fingerprint;
    option.textContent = `${key.label} (${key.fingerprint})`;
    sshKeySelect.append(option);
  }
}

function renderSessionSummary(session) {
  if (!session) {
    sessionSummary.innerHTML = "";
    return;
  }

  sessionSummary.innerHTML = `
    <div><strong>User</strong><span>${escapeHtml(displayNameForSession(session))}</span></div>
    <div><strong>Email</strong><span>${escapeHtml(session.email)}</span></div>
    <div><strong>Root User ID</strong><span><code class="inline-code">${escapeHtml(session.rootUserId)}</code></span></div>
    <div><strong>Principal ID</strong><span><code class="inline-code">${escapeHtml(session.authPrincipalId)}</code></span></div>
    <div><strong>Session Expires</strong><span>${escapeHtml(session.expiresAt)}</span></div>
  `;
}

function renderBadges(items) {
  return `
    <div class="badges">
      ${items
        .map((item) => `<span class="badge"${item.tone ? ` data-tone="${escapeHtml(item.tone)}"` : ""}>${escapeHtml(item.label)}</span>`)
        .join("")}
    </div>
  `;
}

function formatTimestamp(value) {
  if (!value) {
    return "Unknown";
  }
  return new Date(value).toLocaleString();
}

function sortLabel(sortBy) {
  const labels = {
    firstName: "Name",
    email: "Email",
    status: "Status",
    updatedAt: "Updated",
  };
  return labels[sortBy] ?? sortBy;
}

function renderUsersList() {
  usersPaginationSummary.textContent =
    state.rootUsers.totalMatchingRecords === 0
      ? "No users match the current search."
      : `Showing page ${state.rootUsers.page} of ${state.rootUsers.totalPages} across ${state.rootUsers.totalMatchingRecords} matching users`;
  usersPageIndicator.textContent = `Page ${state.rootUsers.page} of ${state.rootUsers.totalPages}`;
  usersPrevPageButton.disabled = state.rootUsers.page <= 1;
  usersNextPageButton.disabled = state.rootUsers.page >= state.rootUsers.totalPages;

  for (const button of userSortButtons) {
    const sortBy = button.dataset.sortBy;
    const active = sortBy === state.rootUsers.orderBy;
    const direction = active ? state.rootUsers.orderDirection : "";
    button.classList.toggle("active", active);
    button.textContent = active
      ? `${sortLabel(sortBy)} ${direction === "asc" ? "↑" : "↓"}`
      : sortLabel(sortBy);
  }

  if (state.rootUsers.items.length === 0) {
    usersList.innerHTML = `<div class="empty-state">No root users found for this filter.</div>`;
    return;
  }

  usersList.innerHTML = state.rootUsers.items
    .map((rootUser) => {
      const selected = state.rootUsers.selected?.rootUserId === rootUser.rootUserId;
      const isDeleted = Boolean(rootUser.deletedAt);
      const isInactive = isDeleted || rootUser.status === "inactive";
      return `
        <article class="user-row${selected ? " selected" : ""}">
          <div class="user-row-main">
            <strong>${escapeHtml(displayNameForRootUser(rootUser))}</strong>
            <span class="muted">${escapeHtml(rootUser.email)}</span>
            <div>${renderBadges([
              { label: rootUser.status, tone: rootUser.status === "active" ? "success" : "danger" },
              ...(rootUser.deletedAt ? [{ label: "deleted", tone: "danger" }] : []),
            ])}</div>
            <span class="muted">${escapeHtml(formatTimestamp(rootUser.updatedAt))}</span>
          </div>
          <div class="actions compact-actions">
            <button type="button" class="ghost" data-select-root-user="${escapeHtml(rootUser.rootUserId)}">Edit</button>
            ${
              isInactive
                ? `<button type="button" class="secondary" data-activate-root-user="${escapeHtml(rootUser.rootUserId)}">${isDeleted ? "Reactivate" : "Activate"}</button>`
                : `<button type="button" class="danger" data-deactivate-root-user="${escapeHtml(rootUser.rootUserId)}">Deactivate</button>`
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSelectedRootUser() {
  const mode = state.rootUsers.drawerMode;
  const rootUser = state.rootUsers.selected;

  if (!mode) {
    selectedRootUser.innerHTML = `<div class="empty-state">Select a user from the list to open the edit drawer.</div>`;
    return;
  }

  if (mode === "create") {
    selectedRootUser.innerHTML = `
      <div class="detail-stack user-drawer">
        <div>
          <div class="eyebrow">Create</div>
          <h3>New Root User</h3>
          <p class="muted">Create a new root user and normalize the email on save.</p>
        </div>
        <form id="selected-root-user-form" class="stack inline-form">
          <label>
            <span>Email</span>
            <input name="email" type="email" value="" required />
          </label>
          <label>
            <span>First Name</span>
            <input name="firstName" type="text" value="" />
          </label>
          <label>
            <span>Last Name</span>
            <input name="lastName" type="text" value="" />
          </label>
          <div class="actions">
            <button type="submit">Create User</button>
          </div>
        </form>
      </div>
    `;
    return;
  }

  const isDeleted = Boolean(rootUser.deletedAt);
  const isInactive = isDeleted || rootUser.status === "inactive";

  selectedRootUser.innerHTML = `
    <div class="detail-stack user-drawer">
      <div>
        <div class="eyebrow">Selected Root User</div>
        <h3>${escapeHtml(displayNameForRootUser(rootUser))}</h3>
        <p class="muted">${escapeHtml(rootUser.email)}</p>
      </div>
      <div class="meta-grid">
        <div><strong>Status</strong><span>${escapeHtml(rootUser.status)}</span></div>
        <div><strong>Root User ID</strong><span><code class="inline-code">${escapeHtml(rootUser.rootUserId)}</code></span></div>
        <div><strong>Created At</strong><span>${escapeHtml(formatTimestamp(rootUser.createdAt))}</span></div>
        <div><strong>Updated At</strong><span>${escapeHtml(formatTimestamp(rootUser.updatedAt))}</span></div>
        <div><strong>Deleted At</strong><span>${escapeHtml(rootUser.deletedAt ? formatTimestamp(rootUser.deletedAt) : "Active")}</span></div>
      </div>
      ${
        isInactive
          ? `
            <div class="message" data-tone="warning">
              This root user is inactive. ${isDeleted ? "Reactivate" : "Activate"} the user before editing details.
            </div>
            <div class="actions">
              <button type="button" class="secondary" data-activate-root-user="${escapeHtml(rootUser.rootUserId)}">${isDeleted ? "Reactivate" : "Activate"} User</button>
            </div>
          `
          : `
            <form id="selected-root-user-form" class="stack inline-form">
              <label>
                <span>Email</span>
                <input name="email" type="email" value="${escapeHtml(rootUser.email)}" required />
              </label>
              <label>
                <span>First Name</span>
                <input name="firstName" type="text" value="${escapeHtml(rootUser.firstName ?? "")}" />
              </label>
              <label>
                <span>Last Name</span>
                <input name="lastName" type="text" value="${escapeHtml(rootUser.lastName ?? "")}" />
              </label>
              <div class="actions">
                <button type="submit">Save Changes</button>
                <button type="button" class="danger" data-deactivate-root-user="${escapeHtml(rootUser.rootUserId)}">Deactivate User</button>
              </div>
            </form>
          `
      }
    </div>
  `;
}

function renderRootRolesList() {
  rootRolesPaginationSummary.textContent =
    state.rootRoles.totalMatchingRecords === 0
      ? "No system root roles found."
      : `Showing page ${state.rootRoles.page} of ${state.rootRoles.totalPages} across ${state.rootRoles.totalMatchingRecords} matching roles`;
  rootRolesPageIndicator.textContent = `Page ${state.rootRoles.page} of ${state.rootRoles.totalPages}`;
  rootRolesPrevPageButton.disabled = state.rootRoles.page <= 1;
  rootRolesNextPageButton.disabled = state.rootRoles.page >= state.rootRoles.totalPages;

  if (state.rootRoles.items.length === 0) {
    rootRolesList.innerHTML = `
      <div class="empty-state empty-state-action">
        <p>No system root roles found for this filter.</p>
        <button type="button" class="ghost" data-open-create-root-role="true">Create New Role</button>
      </div>
    `;
    return;
  }

  rootRolesList.innerHTML = state.rootRoles.items
    .map((role) => {
      const selected = state.rootRoles.selected?.rootRoleId === role.rootRoleId;
      const isInactive = Boolean(role.deactivatedAt) || role.assignable === false;
      return `
        <article class="role-row${selected ? " selected" : ""}" data-select-root-role="${escapeHtml(role.rootRoleId)}">
          <div class="role-row-main">
            <strong>${escapeHtml(role.displayName)}</strong>
            <span class="muted"><code class="inline-code">${escapeHtml(role.roleKey)}</code></span>
            <span>${escapeHtml(String(role.activeGrantCount))}</span>
            <div>${renderBadges([
              { label: isInactive ? "inactive" : "active", tone: isInactive ? "danger" : "success" },
              ...(role.protected ? [{ label: "protected", tone: "danger" }] : []),
            ])}</div>
            <span class="muted">${escapeHtml(formatTimestamp(role.updatedAt))}</span>
          </div>
          <div class="actions compact-actions">
            <button type="button" class="ghost" data-select-root-role="${escapeHtml(role.rootRoleId)}">Edit Role</button>
            ${
              isInactive
                ? `<button type="button" class="secondary" data-reactivate-root-role="${escapeHtml(role.rootRoleId)}">Reactivate</button>`
                : `<button type="button" class="danger" data-deactivate-root-role="${escapeHtml(role.rootRoleId)}">Deactivate</button>`
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCapabilityColumn(capabilities, selectedCapabilityKeys, mode) {
  if (capabilities.length === 0) {
    return `<div class="empty-state">No capabilities in this column.</div>`;
  }

  return capabilities
    .map((capability) => {
      const selected = selectedCapabilityKeys.includes(capability.capabilityKey);
      const actionLabel = mode === "assigned" ? "Remove" : "Add";
      const actionDataset = mode === "assigned" ? "data-remove-capability" : "data-add-capability";
      return `
        <article class="capability-row">
          <div class="capability-copy">
            <h4><code class="inline-code">${escapeHtml(capability.capabilityKey)}</code></h4>
            <p class="muted">${escapeHtml(capability.description)}</p>
            ${renderBadges([
              ...(capability.mandatory ? [{ label: "mandatory", tone: "danger" }] : []),
              ...(capability.protected ? [{ label: "protected", tone: "danger" }] : []),
              ...(selected ? [{ label: "applied", tone: "success" }] : []),
            ])}
          </div>
          <div class="actions compact-actions">
            <button type="button" class="${mode === "assigned" ? "secondary" : "ghost"}" ${actionDataset}="${escapeHtml(capability.capabilityKey)}" ${capability.mandatory && mode === "assigned" ? "disabled" : ""}>
              ${actionLabel}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSelectedRootRole() {
  const mode = state.rootRoles.drawerMode;
  if (!mode) {
    selectedRootRole.innerHTML = `<div class="empty-state">Select a role or create a new one to open the editor.</div>`;
    return;
  }

  const role = state.rootRoles.selected;
  const selectedCapabilityKeys = state.rootRoles.draftCapabilityKeys;
  const assignedCapabilities = state.rootRoles.eligibleCapabilities.filter((capability) =>
    selectedCapabilityKeys.includes(capability.capabilityKey),
  );
  const eligibleCapabilities = state.rootRoles.eligibleCapabilities.filter(
    (capability) => !selectedCapabilityKeys.includes(capability.capabilityKey),
  );

  selectedRootRole.innerHTML = `
    <div class="detail-stack user-drawer">
      <div>
        <div class="eyebrow">${mode === "create" ? "Create" : "Edit"} System Root Role</div>
        <h3>${escapeHtml(role?.displayName ?? "New Root Role")}</h3>
        <p class="muted">${mode === "create" ? "Create a new durable system root role and assign its initial capabilities." : "Update role metadata and move capabilities between applied and eligible columns."}</p>
      </div>

      <form id="root-role-form" class="stack inline-form">
        <label>
          <span>Role Key</span>
          <input name="roleKey" type="text" value="${escapeHtml(role?.roleKey ?? "")}" ${mode === "edit" ? "readonly" : "required"} />
        </label>
        <label>
          <span>Display Name</span>
          <input name="displayName" type="text" value="${escapeHtml(role?.displayName ?? "")}" required />
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" required>${escapeHtml(role?.description ?? "")}</textarea>
        </label>
        ${
          mode === "edit"
            ? `
              <div class="meta-grid">
                <div><strong>Status</strong><span>${escapeHtml(role?.deactivatedAt ? "inactive" : "active")}</span></div>
                <div><strong>Protected</strong><span>${escapeHtml(role?.protected ? "yes" : "no")}</span></div>
                <div><strong>Grant Count</strong><span>${escapeHtml(String(role?.activeGrantCount ?? 0))}</span></div>
                <div><strong>Updated</strong><span>${escapeHtml(formatTimestamp(role?.updatedAt))}</span></div>
              </div>
            `
            : ""
        }
        <div class="actions">
          <button type="submit">${mode === "create" ? "Create Role" : "Save Changes"}</button>
          ${
            mode === "edit"
              ? role?.deactivatedAt
                ? `<button type="button" class="secondary" data-reactivate-root-role="${escapeHtml(role.rootRoleId)}">Reactivate Role</button>`
                : `<button type="button" class="danger" data-deactivate-root-role="${escapeHtml(role.rootRoleId)}">Deactivate Role</button>`
              : ""
          }
        </div>
      </form>

      <section class="capability-grid">
        <div class="subpanel capability-panel">
          <div class="section-header">
            <div>
              <div class="eyebrow">Applied</div>
              <h4>Current Capabilities</h4>
            </div>
          </div>
          <div class="capability-list">
            ${renderCapabilityColumn(assignedCapabilities, selectedCapabilityKeys, "assigned")}
          </div>
        </div>

        <div class="subpanel capability-panel">
          <div class="section-header">
            <div>
              <div class="eyebrow">Eligible</div>
              <h4>Available Capabilities</h4>
            </div>
          </div>
          <div class="capability-list">
            ${renderCapabilityColumn(eligibleCapabilities, selectedCapabilityKeys, "eligible")}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderNavigation() {
  for (const button of navButtons) {
    const isActive = button.dataset.page === state.navigation.currentPage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  }

  myDetailsPage.classList.toggle("hidden", state.navigation.currentPage !== "my-details");
  viewUsersPage.classList.toggle("hidden", state.navigation.currentPage !== "view-users");
  rootRolesPage.classList.toggle("hidden", state.navigation.currentPage !== "root-roles");
}

function renderShell() {
  usersFilterSelect.value = state.rootUsers.filter;
  usersSearchFieldSelect.value = state.rootUsers.searchField;
  usersSearchInput.value = state.rootUsers.searchText;
  usersPageSizeSelect.value = String(state.rootUsers.pageSize);
  userDrawerOverlay.classList.toggle("hidden", !state.rootUsers.drawerMode);
  userDrawerOverlay.setAttribute("aria-hidden", state.rootUsers.drawerMode ? "false" : "true");

  rootRolesPageSizeSelect.value = String(state.rootRoles.pageSize);
  rootRolesIncludeInactiveSelect.value = String(state.rootRoles.includeInactive);
  roleDrawerOverlay.classList.toggle("hidden", !state.rootRoles.drawerMode);
  roleDrawerOverlay.setAttribute("aria-hidden", state.rootRoles.drawerMode ? "false" : "true");

  renderSessionSummary(state.session);
  renderNavigation();
  renderUsersList();
  renderSelectedRootUser();
  renderRootRolesList();
  renderSelectedRootRole();
}

function render() {
  const flags = deriveViewFlags(state);
  authView.classList.toggle("hidden", !flags.showAuthView);
  sshStage.classList.toggle("hidden", !flags.showSshStage);
  shellView.classList.toggle("hidden", !flags.showShellView);
  expiryOverlay.classList.toggle("hidden", !flags.showExpiryOverlay);
  setMessage(authMessage, state.authMessage, "warning");
  setMessage(shellMessage, state.shellMessage, shellMessage.dataset.tone || "info");

  if (flags.showShellView) {
    renderShell();
  }
}

async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (response.status === 401) {
    Object.assign(state, markSessionExpired(state));
    render();
    throw new ApiError(response.status, body?.code ?? "UNAUTHORIZED", body?.message ?? "Your session has expired.");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.code ?? "REQUEST_FAILED",
      body?.message ?? "The request could not be completed.",
      body?.details,
    );
  }

  return body;
}

function toQueryString(input) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    params.set(key, String(value));
  }
  return params.toString();
}

function buildUsersQuery() {
  const query = {
    page: state.rootUsers.page,
    pageSize: state.rootUsers.pageSize,
    orderBy: state.rootUsers.orderBy,
    orderDirection: state.rootUsers.orderDirection,
  };

  if (state.rootUsers.filter === "active") {
    query.status = "active";
  } else if (state.rootUsers.filter === "inactive") {
    query.status = "inactive";
  }

  const searchText = state.rootUsers.searchText.trim();
  if (searchText.length >= 3) {
    const key = `${state.rootUsers.searchField}Prefix`;
    query[key] = searchText;
  }

  return query;
}

function buildRootRolesQuery() {
  return {
    page: state.rootRoles.page,
    pageSize: state.rootRoles.pageSize,
    includeInactive: state.rootRoles.includeInactive,
  };
}

async function bootstrapSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    state.phase = "authenticated";
    await loadConsoleData();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      Object.assign(state, resetToLoginState(state));
      state.phase = "login";
      render();
      return;
    }
    state.phase = "login";
    state.authMessage = "Could not restore the browser session. Please sign in again.";
    render();
  }
}

async function loadConsoleData() {
  await Promise.all([
    loadRootUsers({ preserveSelection: true }),
    loadRootRoles({ preserveSelection: true }),
  ]);
  render();
}

async function loadRootUsers({ preserveSelection } = { preserveSelection: true }) {
  const selectedId = preserveSelection ? state.rootUsers.selected?.rootUserId : null;
  const response = await fetchJson(`/v1/root-users?${toQueryString(buildUsersQuery())}`);
  state.rootUsers.items = response.items;
  state.rootUsers.page = response.page;
  state.rootUsers.pageSize = response.pageSize;
  state.rootUsers.totalPages = Math.max(1, Number(response.totalPages ?? 1));
  state.rootUsers.totalMatchingRecords =
    typeof response.totalMatchingRecords === "number"
      ? response.totalMatchingRecords
      : Number.parseInt(String(response.totalMatchingRecords).replace("+", ""), 10);
  state.rootUsers.totalSearchableRecords =
    typeof response.totalSearchableRecords === "number"
      ? response.totalSearchableRecords
      : Number.parseInt(String(response.totalSearchableRecords).replace("+", ""), 10);
  state.rootUsers.selected =
    selectedId
      ? state.rootUsers.items.find((item) => item.rootUserId === selectedId) ?? null
      : null;
}

async function loadRootRoles({ preserveSelection } = { preserveSelection: true }) {
  const selectedId = preserveSelection ? state.rootRoles.selected?.rootRoleId : null;
  const response = await fetchJson(`/v1/root-roles?${toQueryString(buildRootRolesQuery())}`);
  state.rootRoles.items = response.items;
  state.rootRoles.page = response.page;
  state.rootRoles.pageSize = response.pageSize;
  state.rootRoles.totalPages = Math.max(1, Number(response.totalPages ?? 1));
  state.rootRoles.totalMatchingRecords =
    typeof response.totalMatchingRecords === "number"
      ? response.totalMatchingRecords
      : Number.parseInt(String(response.totalMatchingRecords).replace("+", ""), 10);
  if (selectedId) {
    const selected = state.rootRoles.items.find((item) => item.rootRoleId === selectedId) ?? null;
    if (selected) {
      await openRootRoleEditor("edit", selected.rootRoleId);
    }
  }
}

async function loadRootRoleCapabilities(rootRoleId) {
  const [eligible, assigned] = await Promise.all([
    fetchJson(`/v1/root-roles/${rootRoleId}/eligible-authz-capabilities?page=1&pageSize=100`),
    fetchJson(`/v1/root-roles/${rootRoleId}/capability-assignments?page=1&pageSize=100`),
  ]);
  state.rootRoles.eligibleCapabilities = eligible.items;
  state.rootRoles.assignedCapabilityKeys = assigned.items.map((item) => item.capabilityKey);
  state.rootRoles.draftCapabilityKeys = [...state.rootRoles.assignedCapabilityKeys];
}

async function openRootRoleEditor(mode, rootRoleId = null) {
  state.rootRoles.drawerMode = mode;

  if (mode === "create") {
    state.rootRoles.selected = {
      rootRoleId: "",
      roleKey: "",
      displayName: "",
      description: "",
      protected: false,
      assignable: true,
      createdAt: "",
      updatedAt: "",
      deactivatedAt: null,
      activeGrantCount: 0,
    };
    state.rootRoles.eligibleCapabilities = [];
    state.rootRoles.assignedCapabilityKeys = [];
    state.rootRoles.draftCapabilityKeys = [];
    render();

    const defaultRoleId = state.rootRoles.items[0]?.rootRoleId;
    if (!defaultRoleId) {
      return;
    }

    try {
      const eligibleCapabilities = await fetchJson(
        `/v1/root-roles/${defaultRoleId}/eligible-authz-capabilities?page=1&pageSize=100`,
      );
      state.rootRoles.eligibleCapabilities = eligibleCapabilities.items;
      render();
    } catch (_error) {
      // Creating a role should not be blocked by optional capability preload.
    }
    return;
  }

  const detail = await fetchJson(`/v1/root-roles/${rootRoleId}`);
  state.rootRoles.selected = detail;
  await loadRootRoleCapabilities(rootRoleId);
  render();
}

function closeRootRoleDrawer() {
  state.rootRoles.drawerMode = null;
  state.rootRoles.selected = null;
  state.rootRoles.eligibleCapabilities = [];
  state.rootRoles.assignedCapabilityKeys = [];
  state.rootRoles.draftCapabilityKeys = [];
  render();
}

function messageForError(error, fallback) {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
}

function setCurrentPage(page) {
  state.navigation.currentPage = page;
  render();
}

async function handlePasswordSubmit(event) {
  event.preventDefault();
  state.authMessage = "";
  render();
  try {
    const response = await fetchJson("/v1/root-auth/login/password", {
      method: "POST",
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });
    state.challenge = response;
    state.phase = "ssh-challenge";
    renderKeyOptions(response.availableSshKeys);
    sshInstructions.textContent = "Choose one of your registered SSH keys and complete the signed challenge.";
    render();
  } catch (error) {
    state.authMessage = messageForError(error, "Could not verify the password.");
    render();
  }
}

async function handleSshSubmit() {
  if (!state.challenge) {
    return;
  }
  state.authMessage = "";
  render();
  try {
    const helperResult = await signLoginChallenge(
      state.challenge.challengeText,
      sshKeySelect.value,
    );
    await fetchJson("/v1/root-auth/browser/login/ssh", {
      method: "POST",
      body: JSON.stringify({
        challengeId: state.challenge.challengeId,
        publicKeyFingerprint: helperResult.publicKeyFingerprint,
        signature: helperResult.signature,
      }),
    });
    state.phase = "authenticated";
    await bootstrapSession();
  } catch (error) {
    state.authMessage = messageForError(error, "Could not complete SSH verification.");
    render();
  }
}

async function handleLogout() {
  try {
    await fetchJson("/v1/root-auth/browser/logout", {
      method: "POST",
      headers: {
        origin: window.location.origin,
      },
    });
  } catch (_error) {}

  Object.assign(state, resetToLoginState(state));
  render();
}

async function handleRefreshConsole() {
  try {
    setShellMessage("Refreshing console data...");
    await bootstrapSession();
    setShellMessage("Console refreshed.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not refresh the console."), "danger");
  }
}

function selectRootUser(rootUserId) {
  state.rootUsers.selected = state.rootUsers.items.find((item) => item.rootUserId === rootUserId) ?? null;
  state.rootUsers.drawerMode = state.rootUsers.selected ? "edit" : null;
  state.navigation.currentPage = "view-users";
  render();
}

async function handleRootUserUpdate(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  try {
    if (state.rootUsers.drawerMode === "create") {
      await fetchJson("/v1/root-users", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          firstName: formData.get("firstName") || undefined,
          lastName: formData.get("lastName") || undefined,
        }),
      });
      state.rootUsers.drawerMode = null;
      state.rootUsers.selected = null;
      await loadRootUsers({ preserveSelection: false });
      render();
      setShellMessage("Root user created.", "success");
      return;
    }

    if (!state.rootUsers.selected) {
      return;
    }

    await fetchJson(`/v1/root-users/${state.rootUsers.selected.rootUserId}`, {
      method: "PATCH",
      body: JSON.stringify({
        email: formData.get("email"),
        firstName: formData.get("firstName") || undefined,
        lastName: formData.get("lastName") || undefined,
      }),
    });
    await loadRootUsers({ preserveSelection: true });
    render();
    setShellMessage("Root user updated.", "success");
  } catch (error) {
    setShellMessage(
      messageForError(
        error,
        state.rootUsers.drawerMode === "create"
          ? "Could not create the root user."
          : "Could not update the selected root user.",
      ),
      "danger",
    );
  }
}

async function deactivateRootUser(rootUserId) {
  try {
    await fetchJson(`/v1/root-users/${rootUserId}`, { method: "DELETE" });
    await loadRootUsers({ preserveSelection: true });
    render();
    setShellMessage("Root user deactivated.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not deactivate that root user."), "danger");
  }
}

async function reactivateRootUser(rootUserId) {
  try {
    await fetchJson(`/v1/root-users/${rootUserId}/reactivate`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    await loadRootUsers({ preserveSelection: true });
    render();
    setShellMessage("Root user reactivated.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not reactivate that root user."), "danger");
  }
}

async function activateRootUser(rootUserId) {
  const current = state.rootUsers.items.find((item) => item.rootUserId === rootUserId) ?? state.rootUsers.selected;
  if (!current) {
    setShellMessage("Could not find the selected root user to activate.", "danger");
    return;
  }
  if (current.deletedAt) {
    await reactivateRootUser(rootUserId);
    return;
  }
  try {
    await fetchJson(`/v1/root-users/${rootUserId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    });
    await loadRootUsers({ preserveSelection: true });
    render();
    setShellMessage("Root user activated.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not activate that root user."), "danger");
  }
}

function handleUsersListClick(event) {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }
  if (target.dataset.selectRootUser) {
    selectRootUser(target.dataset.selectRootUser);
    return;
  }
  if (target.dataset.deactivateRootUser) {
    deactivateRootUser(target.dataset.deactivateRootUser);
    return;
  }
  if (target.dataset.activateRootUser) {
    activateRootUser(target.dataset.activateRootUser);
  }
}

function handleSelectedRootUserClick(event) {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }
  if (target.dataset.deactivateRootUser) {
    deactivateRootUser(target.dataset.deactivateRootUser);
    return;
  }
  if (target.dataset.activateRootUser) {
    activateRootUser(target.dataset.activateRootUser);
  }
}

async function handleUsersSearchSubmit(event) {
  event.preventDefault();
  state.rootUsers.filter = usersFilterSelect.value;
  state.rootUsers.searchField = usersSearchFieldSelect.value;
  state.rootUsers.searchText = usersSearchInput.value.trim();
  state.rootUsers.pageSize = Number(usersPageSizeSelect.value);
  state.rootUsers.page = 1;

  try {
    await loadRootUsers({ preserveSelection: false });
    render();
    if (state.rootUsers.searchText && state.rootUsers.searchText.length < 3) {
      setShellMessage("Search prefixes must be at least 3 characters long. Showing the unfiltered list.", "warning");
    } else {
      setShellMessage("Users list updated.", "success");
    }
  } catch (error) {
    setShellMessage(messageForError(error, "Could not search root users."), "danger");
  }
}

async function handleUsersClearSearch() {
  state.rootUsers.filter = "all";
  state.rootUsers.searchField = "email";
  state.rootUsers.searchText = "";
  state.rootUsers.page = 1;
  state.rootUsers.selected = null;
  try {
    await loadRootUsers({ preserveSelection: false });
    render();
    setShellMessage("Search cleared.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not clear the current search."), "danger");
  }
}

async function handleUsersPrevPage() {
  state.rootUsers.page = Math.max(1, state.rootUsers.page - 1);
  try {
    await loadRootUsers({ preserveSelection: true });
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not load the previous page."), "danger");
  }
}

async function handleUsersNextPage() {
  state.rootUsers.page = Math.min(state.rootUsers.totalPages, state.rootUsers.page + 1);
  try {
    await loadRootUsers({ preserveSelection: true });
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not load the next page."), "danger");
  }
}

async function handleUserSort(sortBy) {
  if (state.rootUsers.orderBy === sortBy) {
    state.rootUsers.orderDirection = state.rootUsers.orderDirection === "asc" ? "desc" : "asc";
  } else {
    state.rootUsers.orderBy = sortBy;
    state.rootUsers.orderDirection = sortBy === "updatedAt" ? "desc" : "asc";
  }
  state.rootUsers.page = 1;
  try {
    await loadRootUsers({ preserveSelection: true });
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not sort root users."), "danger");
  }
}

async function handleRefreshRootUsers() {
  try {
    setShellMessage("Refreshing root users...");
    await loadRootUsers({ preserveSelection: true });
    render();
    setShellMessage("Root users refreshed.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not refresh root users."), "danger");
  }
}

function handleCloseUserDrawer() {
  state.rootUsers.drawerMode = null;
  state.rootUsers.selected = null;
  render();
}

function selectDraftCapability(capabilityKey) {
  if (!state.rootRoles.draftCapabilityKeys.includes(capabilityKey)) {
    state.rootRoles.draftCapabilityKeys = [...state.rootRoles.draftCapabilityKeys, capabilityKey].sort();
    render();
  }
}

function unselectDraftCapability(capabilityKey) {
  state.rootRoles.draftCapabilityKeys = state.rootRoles.draftCapabilityKeys.filter((key) => key !== capabilityKey);
  render();
}

async function handleRootRoleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const mode = state.rootRoles.drawerMode;
  try {
    if (mode === "create") {
      const created = await fetchJson("/v1/root-roles", {
        method: "POST",
        body: JSON.stringify({
          roleKey: formData.get("roleKey"),
          displayName: formData.get("displayName"),
          description: formData.get("description"),
        }),
      });
      if (state.rootRoles.draftCapabilityKeys.length > 0) {
        await fetchJson(`/v1/root-roles/${created.rootRoleId}/capability-assignments`, {
          method: "PUT",
          body: JSON.stringify({ capabilityKeys: state.rootRoles.draftCapabilityKeys }),
        });
      }
      await loadRootRoles({ preserveSelection: false });
      await openRootRoleEditor("edit", created.rootRoleId);
      setShellMessage("System root role created.", "success");
      return;
    }

    if (mode === "edit" && state.rootRoles.selected?.rootRoleId) {
      await fetchJson(`/v1/root-roles/${state.rootRoles.selected.rootRoleId}`, {
        method: "PATCH",
        body: JSON.stringify({
          displayName: formData.get("displayName"),
          description: formData.get("description"),
        }),
      });
      await fetchJson(`/v1/root-roles/${state.rootRoles.selected.rootRoleId}/capability-assignments`, {
        method: "PUT",
        body: JSON.stringify({ capabilityKeys: state.rootRoles.draftCapabilityKeys }),
      });
      await loadRootRoles({ preserveSelection: true });
      await openRootRoleEditor("edit", state.rootRoles.selected.rootRoleId);
      setShellMessage("System root role updated.", "success");
    }
  } catch (error) {
    setShellMessage(messageForError(error, "Could not save the root role."), "danger");
  }
}

async function deactivateRootRole(rootRoleId) {
  try {
    await fetchJson(`/v1/root-roles/${rootRoleId}/deactivate`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    await loadRootRoles({ preserveSelection: true });
    if (state.rootRoles.drawerMode === "edit") {
      await openRootRoleEditor("edit", rootRoleId);
    }
    setShellMessage("System root role deactivated.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not deactivate that root role."), "danger");
  }
}

async function reactivateRootRole(rootRoleId) {
  try {
    await fetchJson(`/v1/root-roles/${rootRoleId}/reactivate`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    await loadRootRoles({ preserveSelection: true });
    await openRootRoleEditor("edit", rootRoleId);
    setShellMessage("System root role reactivated.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not reactivate that root role."), "danger");
  }
}

function handleRootRolesListClick(event) {
  const target = event.target.closest("button");
  if (target?.dataset.openCreateRootRole) {
    openRootRoleEditor("create").catch((error) => {
      setShellMessage(messageForError(error, "Could not open the root role creator."), "danger");
    });
    return;
  }
  if (target?.dataset.selectRootRole) {
    openRootRoleEditor("edit", target.dataset.selectRootRole).catch((error) => {
      setShellMessage(messageForError(error, "Could not load that root role."), "danger");
    });
    return;
  }
  if (target?.dataset.deactivateRootRole) {
    deactivateRootRole(target.dataset.deactivateRootRole);
    return;
  }
  if (target?.dataset.reactivateRootRole) {
    reactivateRootRole(target.dataset.reactivateRootRole);
    return;
  }

  const row = event.target.closest("[data-select-root-role]");
  if (row) {
    openRootRoleEditor("edit", row.dataset.selectRootRole).catch((error) => {
      setShellMessage(messageForError(error, "Could not load that root role."), "danger");
    });
  }
}

function handleSelectedRootRoleClick(event) {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }
  if (target.dataset.addCapability) {
    selectDraftCapability(target.dataset.addCapability);
    return;
  }
  if (target.dataset.removeCapability) {
    unselectDraftCapability(target.dataset.removeCapability);
    return;
  }
  if (target.dataset.deactivateRootRole) {
    deactivateRootRole(target.dataset.deactivateRootRole);
    return;
  }
  if (target.dataset.reactivateRootRole) {
    reactivateRootRole(target.dataset.reactivateRootRole);
  }
}

async function handleRefreshRootRoles() {
  try {
    setShellMessage("Refreshing system root roles...");
    await loadRootRoles({ preserveSelection: true });
    render();
    setShellMessage("System root roles refreshed.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not refresh system root roles."), "danger");
  }
}

async function handleRootRolesPrevPage() {
  state.rootRoles.page = Math.max(1, state.rootRoles.page - 1);
  try {
    await loadRootRoles({ preserveSelection: true });
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not load the previous roles page."), "danger");
  }
}

async function handleRootRolesNextPage() {
  state.rootRoles.page = Math.min(state.rootRoles.totalPages, state.rootRoles.page + 1);
  try {
    await loadRootRoles({ preserveSelection: true });
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not load the next roles page."), "danger");
  }
}

async function handleRootRolesToolbarChange() {
  state.rootRoles.pageSize = Number(rootRolesPageSizeSelect.value);
  state.rootRoles.includeInactive = rootRolesIncludeInactiveSelect.value === "true";
  state.rootRoles.page = 1;
  try {
    await loadRootRoles({ preserveSelection: false });
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not update the root role list."), "danger");
  }
}

function handleReturnToLogin() {
  Object.assign(state, resetToLoginState(state));
  render();
}

loginForm.addEventListener("submit", handlePasswordSubmit);
signSubmit.addEventListener("click", handleSshSubmit);
logoutButton.addEventListener("click", handleLogout);
returnToLogin.addEventListener("click", handleReturnToLogin);
refreshConsoleButton.addEventListener("click", handleRefreshConsole);

refreshRootUsersButton.addEventListener("click", handleRefreshRootUsers);
createRootUserButton.addEventListener("click", () => {
  state.rootUsers.drawerMode = "create";
  state.rootUsers.selected = null;
  state.navigation.currentPage = "view-users";
  render();
});
usersSearchForm.addEventListener("submit", handleUsersSearchSubmit);
usersClearSearchButton.addEventListener("click", handleUsersClearSearch);
usersPrevPageButton.addEventListener("click", handleUsersPrevPage);
usersNextPageButton.addEventListener("click", handleUsersNextPage);
usersList.addEventListener("click", handleUsersListClick);
selectedRootUser.addEventListener("click", handleSelectedRootUserClick);
selectedRootUser.addEventListener("submit", (event) => {
  if (event.target.id === "selected-root-user-form") {
    handleRootUserUpdate(event);
  }
});
closeUserDrawerButton.addEventListener("click", handleCloseUserDrawer);
userDrawerBackdrop.addEventListener("click", handleCloseUserDrawer);

createRootRoleButton.addEventListener("click", () => {
  openRootRoleEditor("create").catch((error) => {
    setShellMessage(messageForError(error, "Could not open the root role creator."), "danger");
  });
});
refreshRootRolesButton.addEventListener("click", handleRefreshRootRoles);
rootRolesPageSizeSelect.addEventListener("change", handleRootRolesToolbarChange);
rootRolesIncludeInactiveSelect.addEventListener("change", handleRootRolesToolbarChange);
rootRolesPrevPageButton.addEventListener("click", handleRootRolesPrevPage);
rootRolesNextPageButton.addEventListener("click", handleRootRolesNextPage);
rootRolesList.addEventListener("click", handleRootRolesListClick);
selectedRootRole.addEventListener("click", handleSelectedRootRoleClick);
selectedRootRole.addEventListener("submit", (event) => {
  if (event.target.id === "root-role-form") {
    handleRootRoleSubmit(event);
  }
});
closeRoleDrawerButton.addEventListener("click", closeRootRoleDrawer);
roleDrawerBackdrop.addEventListener("click", closeRootRoleDrawer);

for (const button of navButtons) {
  button.addEventListener("click", () => {
    setCurrentPage(button.dataset.page);
  });
}

for (const button of userSortButtons) {
  button.addEventListener("click", () => {
    handleUserSort(button.dataset.sortBy);
  });
}

state.phase = "login";
render();
bootstrapSession();
