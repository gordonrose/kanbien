import {
  createInitialState,
  deriveViewFlags,
  displayNameForSession,
  markSessionExpired,
  resetToLoginState,
} from "./state.mjs";
import { signLoginChallenge } from "./helperClient.mjs";
import { createRootUsersListController } from "./rootUsersList.mjs";

class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const languageOptions = [
  { code: "en", name: "English", detail: "English" },
  { code: "es", name: "Spanish", detail: "Espanol" },
  { code: "fr", name: "French", detail: "Francais" },
  { code: "de", name: "German", detail: "Deutsch" },
  { code: "it", name: "Italian", detail: "Italiano" },
  { code: "pt", name: "Portuguese", detail: "Portugues" },
  { code: "nl", name: "Dutch", detail: "Nederlands" },
  { code: "pl", name: "Polish", detail: "Polski" },
  { code: "ar", name: "Arabic", detail: "Arabic" },
  { code: "hi", name: "Hindi", detail: "Hindi" },
  { code: "ja", name: "Japanese", detail: "Japanese" },
  { code: "zh-Hans", name: "Chinese (Simplified)", detail: "Chinese Simplified" },
];

const displaySettingsCopy = {
  ltr: {
    launcher: "Display",
    launcherTooltip: "Display Settings",
    more: "More",
    menuItem: "Display Settings",
    eyebrow: "Display",
    title: "Display Settings",
    close: "Close display settings",
    themeGroup: "Theme",
    themeNormal: "Normal",
    themeDark: "Dark",
    themeDesert: "Desert",
    magnificationGroup: "Magnification",
  },
  rtl: {
    launcher: "العرض",
    launcherTooltip: "إعدادات العرض",
    more: "المزيد",
    menuItem: "إعدادات العرض",
    eyebrow: "العرض",
    title: "إعدادات العرض",
    close: "إغلاق إعدادات العرض",
    themeGroup: "المظهر",
    themeNormal: "عادي",
    themeDark: "داكن",
    themeDesert: "صحراوي",
    magnificationGroup: "التكبير",
  },
};

const pageAliases = {
  "root-users": "users",
  "root-roles": "roles",
};

const pageMetadata = {
  overview: {
    title: "Overview",
    breadcrumbCurrent: null,
    searchPlaceholder: "Search root admin sections",
    searchKeywords: ["overview", "home", "session", "root admin"],
  },
  users: {
    title: "Users",
    breadcrumbCurrent: "Users",
    searchPlaceholder: "Search root users by exact email or 3+ email prefix",
    searchKeywords: ["users", "people", "accounts", "root users", "root user"],
  },
  roles: {
    title: "Roles",
    breadcrumbCurrent: "Roles",
    searchPlaceholder: "Search roles, permissions, or shell guidance",
    searchKeywords: ["roles", "permissions", "root roles", "system roles"],
  },
  tenants: {
    title: "Tenants",
    breadcrumbCurrent: "Tenants",
    searchPlaceholder: "Search tenants, routes, or shell guidance",
    searchKeywords: ["tenants", "organizations", "workspaces", "accounts"],
  },
  "tenant-admins": {
    title: "Tenant Admins",
    breadcrumbCurrent: "Tenant Admins",
    searchPlaceholder: "Search tenant admins, routes, or shell guidance",
    searchKeywords: ["tenant admins", "tenant admin", "admins", "administrators"],
  },
};

const state = createInitialState();
state.navigation.currentPage = "overview";

let activeLanguageCode = resolveInitialLanguageCode();
let languageModalReturnFocusTarget = null;
let displaySettingsReturnFocusTarget = null;

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
const returnToLogin = document.getElementById("return-to-login");
const refreshSessionButton = document.getElementById("refresh-session-button");

const topNav = document.querySelector(".top-nav");
const primaryNav = document.querySelector(".primary-nav");
const primaryNavOverflow = document.getElementById("primary-nav-overflow");
const primaryNavOverflowButton = document.getElementById("primary-nav-overflow-button");
const primaryNavOverflowMenu = document.getElementById("primary-nav-overflow-menu");
const primaryNavLinks = Array.from(document.querySelectorAll("#primary-nav-links .nav-link"));
const mobileNavButton = document.getElementById("mobile-nav-button");
const mobileNavMenu = document.getElementById("mobile-nav-menu");
const mobileNavLinks = Array.from(document.querySelectorAll("#mobile-nav-menu > .nav-link"));
const contextNavLinks = Array.from(document.querySelectorAll(".context-nav .context-nav-item[data-page-link]"));
const profileButton = document.getElementById("profile-menu-button");
const profileMenu = document.getElementById("profile-menu");
const profileLabel = document.getElementById("profile-label");
const profileAvatar = document.getElementById("profile-avatar");
const navUtilities = document.querySelector(".nav-utilities");
const mobileProfileButton = document.getElementById("mobile-profile-button");
const mobileProfileMenu = document.getElementById("mobile-profile-menu");
const profileSessionLink = document.getElementById("profile-session-link");
const profileLanguageButton = document.getElementById("profile-language-button");
const profileLogoutButton = document.getElementById("profile-logout-button");
const mobileLanguageButton = document.getElementById("mobile-language-button");
const mobileLogoutButton = document.getElementById("mobile-logout-button");
const breadcrumbHomeItem = document.getElementById("breadcrumb-home-item");
const breadcrumbHomeLink = document.getElementById("breadcrumb-home-link");
const breadcrumbHomeSeparatorItem = document.getElementById("breadcrumb-home-separator-item");
const breadcrumbCurrentItem = document.getElementById("breadcrumb-current-item");
const breadcrumbCurrentLabel = document.getElementById("breadcrumb-current-label");
const shellSearchForm = document.getElementById("shell-search-form");
const shellSearchInput = document.getElementById("shell-search-input");
const shellSubNav = document.querySelector(".sub-nav-row");
const displaySettingsButton = document.getElementById("display-settings-button");
const displaySettingsLabel = document.getElementById("display-settings-label");
const contextNavMoreButton = document.getElementById("context-nav-more-button");
const contextNavMoreMenu = document.getElementById("context-nav-more-menu");
const contextNavMoreDisplaySettingsButton = document.getElementById("context-nav-more-display-settings");
const displaySettingsDrawer = document.getElementById("display-settings-drawer");
const displaySettingsEyebrow = document.getElementById("display-settings-eyebrow");
const displaySettingsTitle = document.getElementById("display-settings-title");
const displaySettingsCloseButton = document.getElementById("display-settings-close");
const displaySettingsThemeLabel = document.getElementById("display-settings-theme-label");
const displaySettingsMagnificationLabel = document.getElementById("display-settings-magnification-label");
const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
const magnificationButtons = Array.from(document.querySelectorAll("[data-magnification-option]"));

const languageModal = document.getElementById("language-modal");
const languageModalBackdrop = document.getElementById("language-modal-backdrop");
const languageModalCloseButton = document.getElementById("language-modal-close");
const languageOptionList = document.getElementById("language-option-list");

const brandLabel = document.getElementById("brand-label");
const rootAdminMain = document.getElementById("root-admin-main");
const pageSections = {
  overview: document.getElementById("page-overview"),
  users: document.getElementById("page-users"),
  roles: document.getElementById("page-roles"),
  tenants: document.getElementById("page-tenants"),
  "tenant-admins": document.getElementById("page-tenant-admins"),
};

const rootUsersListController = createRootUsersListController({
  root: document.getElementById("root-users-list-page"),
  searchInput: shellSearchInput,
  fetchJson,
  setShellMessage,
  getCurrentPage: () => state.navigation.currentPage,
});

function normalizePage(page) {
  const normalizedPage = pageAliases[page] ?? page;
  return Object.hasOwn(pageMetadata, normalizedPage) ? normalizedPage : "overview";
}

let activeSharedTooltipTarget = null;

function resolveInitialLanguageCode() {
  const params = new URLSearchParams(window.location.search);
  const languageCode = params.get("lang");

  if (languageCode && languageOptions.some((language) => language.code === languageCode)) {
    return languageCode;
  }

  return "en";
}

function pageMetaFor(page) {
  return pageMetadata[page] ?? pageMetadata.overview;
}

function languageMetaFor(code) {
  return languageOptions.find((language) => language.code === code) ?? languageOptions[0];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initialsForSession(session) {
  const name = displayNameForSession(session);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "RU";
}

function formatTimestamp(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString();
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

function renderSessionSummary(session) {
  if (!session) {
    sessionSummary.innerHTML = "";
    return;
  }

  sessionSummary.innerHTML = `
    <div><strong>User</strong><span>${escapeHtml(displayNameForSession(session))}</span></div>
    <div><strong>Email</strong><span>${escapeHtml(session.email)}</span></div>
    <div><strong>Root User ID</strong><span><code>${escapeHtml(session.rootUserId)}</code></span></div>
    <div><strong>Principal ID</strong><span><code>${escapeHtml(session.authPrincipalId)}</code></span></div>
    <div><strong>Session Expires</strong><span>${escapeHtml(formatTimestamp(session.expiresAt))}</span></div>
  `;
}

function setMenuOpen(open) {
  profileButton?.setAttribute("aria-expanded", String(open));
  profileMenu?.classList.toggle("hidden", !open);
}

function isMenuOpen() {
  return profileButton?.getAttribute("aria-expanded") === "true";
}

function setPrimaryNavOverflowOpen(open) {
  primaryNavOverflowButton?.setAttribute("aria-expanded", String(open));
  primaryNavOverflowMenu?.classList.toggle("hidden", !open);
}

function isPrimaryNavOverflowOpen() {
  return primaryNavOverflowButton?.getAttribute("aria-expanded") === "true";
}

function setMobileNavOpen(open) {
  mobileNavButton?.setAttribute("aria-expanded", String(open));
  mobileNavMenu?.classList.toggle("hidden", !open);
}

function isMobileNavOpen() {
  return mobileNavButton?.getAttribute("aria-expanded") === "true";
}

function setMobileProfileOpen(open) {
  mobileProfileButton?.setAttribute("aria-expanded", String(open));
  mobileProfileMenu?.classList.toggle("hidden", !open);
}

function isMobileProfileOpen() {
  return mobileProfileButton?.getAttribute("aria-expanded") === "true";
}

function setContextNavMoreOpen(open) {
  contextNavMoreButton?.setAttribute("aria-expanded", String(open));
  contextNavMoreMenu?.classList.toggle("hidden", !open);
}

function isContextNavMoreOpen() {
  return contextNavMoreButton?.getAttribute("aria-expanded") === "true";
}

function setDisplaySettingsDrawerOpen(open, { trigger = null, returnFocus = true } = {}) {
  displaySettingsDrawer?.classList.toggle("hidden", !open);
  displaySettingsDrawer?.setAttribute("aria-hidden", String(!open));
  displaySettingsButton?.setAttribute("aria-expanded", String(open));

  if (open) {
    displaySettingsReturnFocusTarget = trigger ?? document.activeElement;
    setContextNavMoreOpen(false);
    window.requestAnimationFrame(() => {
      displaySettingsCloseButton?.focus();
    });
    return;
  }

  if (returnFocus && displaySettingsReturnFocusTarget instanceof HTMLElement) {
    displaySettingsReturnFocusTarget.focus();
  }
  displaySettingsReturnFocusTarget = null;
}

function isDisplaySettingsDrawerOpen() {
  return !displaySettingsDrawer?.classList.contains("hidden");
}

function closeTransientShellSurfaces({ includeDisplaySettings = false, returnFocus = false } = {}) {
  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  if (includeDisplaySettings) {
    setContextNavMoreOpen(false);
    setDisplaySettingsDrawerOpen(false, { returnFocus });
  }
}

function setPrimaryNavLinkHidden(node, hidden) {
  node.classList.toggle("hidden", hidden);
}

function renderPrimaryNavOverflowMenu(links) {
  if (!primaryNavOverflowMenu) {
    return;
  }

  primaryNavOverflowMenu.innerHTML = links
    .map((link) => {
      const href = link.getAttribute("href") ?? "/root-admin#overview";
      const label = link.textContent?.trim() ?? "";
      const isCurrent = link.getAttribute("aria-current") === "page";
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      const title = link.getAttribute("title") ?? label;
      return `<a class="menu-item" href="${href}" data-page-link="${escapeHtml(link.dataset.pageLink ?? "")}" role="menuitem" title="${escapeHtml(title)}"${currentAttr}>${escapeHtml(label)}</a>`;
    })
    .join("");
}

function getVisiblePrimaryNavLinks() {
  return primaryNavLinks.filter((link) => !link.classList.contains("hidden"));
}

function primaryNavFits() {
  return primaryNav ? primaryNav.scrollWidth <= primaryNav.clientWidth : true;
}

function horizontalRectsOverlap(rectA, rectB) {
  return rectA.left < rectB.right && rectA.right > rectB.left;
}

function primaryNavOverlapsUtilities() {
  if (!navUtilities) {
    return false;
  }

  const navUtilitiesRect = navUtilities.getBoundingClientRect();
  for (const link of getVisiblePrimaryNavLinks()) {
    if (horizontalRectsOverlap(link.getBoundingClientRect(), navUtilitiesRect)) {
      return true;
    }
  }

  if (primaryNavOverflowButton && !primaryNavOverflow.classList.contains("hidden")) {
    const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
    if (horizontalRectsOverlap(overflowRect, navUtilitiesRect)) {
      return true;
    }
  }

  const primaryNavRect = primaryNav?.getBoundingClientRect();
  return primaryNavRect ? horizontalRectsOverlap(primaryNavRect, navUtilitiesRect) : false;
}

function primaryNavOverflowOverlapsVisibleLinks() {
  if (!primaryNavOverflowButton || primaryNavOverflow.classList.contains("hidden")) {
    return false;
  }

  const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
  return getVisiblePrimaryNavLinks().some((link) => horizontalRectsOverlap(link.getBoundingClientRect(), overflowRect));
}

function updatePrimaryNavOverflow() {
  if (!primaryNav || !topNav || primaryNavLinks.length === 0 || !primaryNavOverflow || !primaryNavOverflowButton) {
    return;
  }

  topNav.classList.remove("force-mobile-nav");
  primaryNavOverflow.classList.add("hidden");
  setPrimaryNavOverflowOpen(false);
  renderPrimaryNavOverflowMenu([]);

  for (const link of primaryNavLinks) {
    setPrimaryNavLinkHidden(link, false);
  }

  if (primaryNavFits() && !primaryNavOverlapsUtilities()) {
    return;
  }

  primaryNavOverflow.classList.remove("hidden");

  while (
    getVisiblePrimaryNavLinks().length > 2
    && (!primaryNavFits() || primaryNavOverlapsUtilities() || primaryNavOverflowOverlapsVisibleLinks())
  ) {
    const lastVisibleLink = getVisiblePrimaryNavLinks().at(-1);
    if (!lastVisibleLink) {
      break;
    }
    setPrimaryNavLinkHidden(lastVisibleLink, true);
  }

  if (primaryNavFits() && !primaryNavOverlapsUtilities() && !primaryNavOverflowOverlapsVisibleLinks()) {
    renderPrimaryNavOverflowMenu(primaryNavLinks.filter((link) => link.classList.contains("hidden")));
    return;
  }

  primaryNavOverflow.classList.add("hidden");
  topNav.classList.add("force-mobile-nav");
  setPrimaryNavOverflowOpen(false);
}

function getActiveLanguage() {
  return languageMetaFor(activeLanguageCode);
}

function syncDocumentLanguageDirection() {
  const isRtl = activeLanguageCode === "ar";
  const html = document.documentElement;
  const body = document.body;
  const activeLanguage = getActiveLanguage();

  html.setAttribute("lang", activeLanguage.code);
  html.setAttribute("dir", isRtl ? "rtl" : "ltr");
  body?.setAttribute("dir", isRtl ? "rtl" : "ltr");
}

function syncLanguageTriggers() {
  const activeLanguage = getActiveLanguage();
  const label = `Language: ${activeLanguage.name}`;

  if (profileLanguageButton) {
    profileLanguageButton.textContent = label;
    profileLanguageButton.setAttribute("title", label);
  }

  if (mobileLanguageButton) {
    mobileLanguageButton.textContent = label;
    mobileLanguageButton.setAttribute("title", label);
  }
}

function getDisplaySettingsLocale() {
  return activeLanguageCode === "ar" ? displaySettingsCopy.rtl : displaySettingsCopy.ltr;
}

function syncDisplaySettingsCopy() {
  const copy = getDisplaySettingsLocale();

  if (displaySettingsLabel) {
    displaySettingsLabel.textContent = copy.launcher;
  }

  if (displaySettingsButton) {
    displaySettingsButton.dataset.tooltip = copy.launcherTooltip;
    displaySettingsButton.setAttribute("title", copy.launcherTooltip);
  }

  if (contextNavMoreButton) {
    contextNavMoreButton.setAttribute("title", copy.more);
    const moreLabel = contextNavMoreButton.querySelector(".context-nav-label");
    if (moreLabel) {
      moreLabel.textContent = copy.more;
    }
  }

  if (contextNavMoreDisplaySettingsButton) {
    contextNavMoreDisplaySettingsButton.textContent = copy.menuItem;
    contextNavMoreDisplaySettingsButton.setAttribute("title", copy.menuItem);
  }

  if (displaySettingsEyebrow) {
    displaySettingsEyebrow.textContent = copy.eyebrow;
  }

  if (displaySettingsTitle) {
    displaySettingsTitle.textContent = copy.title;
  }

  if (displaySettingsCloseButton) {
    displaySettingsCloseButton.setAttribute("aria-label", copy.close);
    displaySettingsCloseButton.setAttribute("title", copy.close);
  }

  if (displaySettingsThemeLabel) {
    displaySettingsThemeLabel.textContent = copy.themeGroup;
  }

  if (displaySettingsMagnificationLabel) {
    displaySettingsMagnificationLabel.textContent = copy.magnificationGroup;
  }

  for (const button of themeButtons) {
    const key = button.dataset.themeOption;
    if (key === "normal") {
      button.textContent = copy.themeNormal;
    }
    if (key === "dark") {
      button.textContent = copy.themeDark;
    }
    if (key === "desert") {
      button.textContent = copy.themeDesert;
    }
  }
}

function applyTheme(theme) {
  const nextTheme = ["dark", "desert"].includes(theme) ? theme : "normal";
  if (nextTheme === "normal") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = nextTheme;
  }

  for (const button of themeButtons) {
    const isActive = button.dataset.themeOption === nextTheme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function applyMagnification(value) {
  const amount = Number(value);
  const scale = 1 + amount / 200;

  if (amount === 0) {
    document.documentElement.style.removeProperty("--ui-scale");
  } else {
    document.documentElement.style.setProperty("--ui-scale", String(scale));
  }

  for (const button of magnificationButtons) {
    const isActive = button.dataset.magnificationOption === String(amount);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  window.requestAnimationFrame(() => {
    updatePrimaryNavOverflow();
    syncNavState();
    scheduleContextNavOffsetUpdate();
  });
}

function renderLanguageOptions() {
  if (!languageOptionList) {
    return;
  }

  languageOptionList.innerHTML = languageOptions
    .map((language) => {
      const isActive = language.code === activeLanguageCode;
      const activeClass = isActive ? " active" : "";
      const check = isActive ? '<span class="language-option-check" aria-hidden="true">Selected</span>' : "";

      return `
        <button
          class="language-option${activeClass}"
          type="button"
          role="option"
          data-language-code="${language.code}"
          aria-selected="${String(isActive)}"
        >
          <span class="language-option-label">
            <span class="language-option-name">${escapeHtml(language.name)}</span>
            <span class="language-option-detail">${escapeHtml(language.detail)}</span>
          </span>
          ${check}
        </button>
      `;
    })
    .join("");
}

function setLanguageModalOpen(open, trigger = null) {
  languageModal?.classList.toggle("hidden", !open);
  languageModal?.setAttribute("aria-hidden", String(!open));

  if (open) {
    languageModalReturnFocusTarget = trigger ?? document.activeElement;
    renderLanguageOptions();
    window.requestAnimationFrame(() => {
      const selectedButton = languageOptionList?.querySelector(`[data-language-code="${activeLanguageCode}"]`);
      if (selectedButton instanceof HTMLElement) {
        selectedButton.focus();
        return;
      }
      languageModalCloseButton?.focus();
    });
    return;
  }

  if (languageModalReturnFocusTarget instanceof HTMLElement) {
    languageModalReturnFocusTarget.focus();
  }
  languageModalReturnFocusTarget = null;
}

function isLanguageModalOpen() {
  return !languageModal?.classList.contains("hidden");
}

function selectLanguage(languageCode) {
  activeLanguageCode = languageCode;
  syncDocumentLanguageDirection();
  syncLanguageTriggers();
  renderLanguageOptions();
}

async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
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

function resolvePageFromLocation() {
  return normalizePage(window.location.hash.replace(/^#/, ""));
}

function setCurrentPage(page, { syncHash = true } = {}) {
  const normalizedPage = normalizePage(page);
  state.navigation.currentPage = normalizedPage;

  if (syncHash) {
    const targetHash = `#${normalizedPage}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, "", targetHash);
    }
  }

  closeTransientShellSurfaces({ includeDisplaySettings: true, returnFocus: false });
  render();
}

function syncNavState() {
  const currentPage = state.navigation.currentPage;
  const syncLinkCollection = (collection) => {
    for (const link of collection) {
      const isCurrent = link.dataset.pageLink === currentPage;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  syncLinkCollection(primaryNavLinks);
  syncLinkCollection(mobileNavLinks);
  syncLinkCollection(contextNavLinks);
  syncLinkCollection(Array.from(primaryNavOverflowMenu?.querySelectorAll("[data-page-link]") ?? []));

  for (const [page, section] of Object.entries(pageSections)) {
    section?.classList.toggle("hidden", page !== currentPage);
  }

  rootAdminMain?.classList.toggle("root-admin-main-canonical-page", currentPage === "users");

}

function syncSubNavState() {
  const currentPage = state.navigation.currentPage;
  const meta = pageMetaFor(currentPage);
  const isOverview = currentPage === "overview";

  if (breadcrumbHomeItem) {
    breadcrumbHomeItem.classList.remove("hidden");
  }

  if (breadcrumbHomeLink) {
    breadcrumbHomeLink.textContent = "Root Admin";
    breadcrumbHomeLink.setAttribute("title", "Root Admin");
    breadcrumbHomeLink.setAttribute("href", "/root-admin#overview");

    if (isOverview) {
      breadcrumbHomeLink.setAttribute("aria-current", "page");
      breadcrumbHomeLink.classList.add("breadcrumb-current");
    } else {
      breadcrumbHomeLink.removeAttribute("aria-current");
      breadcrumbHomeLink.classList.remove("breadcrumb-current");
    }
  }

  if (breadcrumbHomeSeparatorItem) {
    breadcrumbHomeSeparatorItem.classList.toggle("hidden", isOverview);
  }

  if (breadcrumbCurrentItem) {
    breadcrumbCurrentItem.classList.toggle("hidden", isOverview);
  }

  if (breadcrumbCurrentLabel) {
    breadcrumbCurrentLabel.textContent = meta.breadcrumbCurrent ?? meta.title;
    breadcrumbCurrentLabel.setAttribute("title", meta.breadcrumbCurrent ?? meta.title);
  }

  if (shellSearchInput) {
    shellSearchInput.setAttribute("placeholder", meta.searchPlaceholder);
    shellSearchInput.setAttribute("aria-label", meta.searchPlaceholder);
  }
}

function syncProfileIdentity() {
  const sessionLabel = state.session ? displayNameForSession(state.session) : "Profile";
  const avatar = state.session ? initialsForSession(state.session) : "RU";

  if (profileLabel) {
    profileLabel.textContent = sessionLabel;
    profileLabel.setAttribute("title", sessionLabel);
  }

  if (profileButton) {
    profileButton.setAttribute("title", sessionLabel);
  }

  if (mobileProfileButton) {
    mobileProfileButton.textContent = sessionLabel;
  }

  if (profileAvatar) {
    profileAvatar.textContent = avatar;
  }

  if (brandLabel) {
    brandLabel.setAttribute("title", "Kanbien");
  }
}

function matchPageFromSearch(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return null;
  }

  return Object.entries(pageMetadata).find(([, meta]) =>
    meta.searchKeywords.some((keyword) => normalizedQuery.includes(keyword) || keyword.includes(normalizedQuery)),
  )?.[0] ?? null;
}

function updateContextNavOffset() {
  if (!topNav && !shellSubNav) {
    return;
  }

  const headerBottom = Math.max(
    topNav?.getBoundingClientRect().bottom ?? 0,
    shellSubNav?.getBoundingClientRect().bottom ?? 0,
  );

  document.documentElement.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
}

let shellOffsetFrame = 0;

function scheduleContextNavOffsetUpdate() {
  if (shellOffsetFrame) {
    return;
  }

  shellOffsetFrame = window.requestAnimationFrame(() => {
    shellOffsetFrame = 0;
    updateContextNavOffset();
  });
}

function getSharedTooltipElement() {
  let tooltip = document.getElementById("shared-floating-tooltip");
  if (tooltip instanceof HTMLElement) {
    return tooltip;
  }

  tooltip = document.createElement("div");
  tooltip.id = "shared-floating-tooltip";
  tooltip.className = "shared-floating-tooltip hidden";
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  document.body.append(tooltip);
  return tooltip;
}

function hideSharedTooltip() {
  const tooltip = getSharedTooltipElement();
  tooltip.classList.add("hidden");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.textContent = "";
  tooltip.style.removeProperty("left");
  tooltip.style.removeProperty("top");
  tooltip.style.removeProperty("transform");
  activeSharedTooltipTarget = null;
}

function positionSharedTooltip(target) {
  if (!(target instanceof HTMLElement)) {
    hideSharedTooltip();
    return;
  }

  const label = target.dataset.tooltip?.trim();
  if (!label) {
    hideSharedTooltip();
    return;
  }

  const tooltip = getSharedTooltipElement();
  tooltip.textContent = label;
  tooltip.classList.remove("hidden");
  tooltip.setAttribute("aria-hidden", "false");

  const rect = target.getBoundingClientRect();
  const direction = document.documentElement.getAttribute("dir") === "rtl" ? "rtl" : "ltr";
  const isContextNavItem = target.matches(".context-nav-item");

  if (isContextNavItem && direction === "rtl") {
    tooltip.style.left = `${rect.left - 12}px`;
    tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
    tooltip.style.transform = "translate(-100%, -50%)";
  } else if (isContextNavItem) {
    tooltip.style.left = `${rect.right + 12}px`;
    tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
    tooltip.style.transform = "translateY(-50%)";
  } else {
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    tooltip.style.top = `${Math.max(rect.top - 10, 12)}px`;
    tooltip.style.transform = "translate(-50%, -100%)";
  }

  activeSharedTooltipTarget = target;
}

function getTooltipTargetFromNode(node) {
  if (!(node instanceof Element)) {
    return null;
  }

  return node.closest(".context-nav-item[data-tooltip], .tooltip-anchor[data-tooltip]");
}

function getTooltipTargetFromEvent(event) {
  if (!event || typeof event.composedPath !== "function") {
    return getTooltipTargetFromNode(event?.target);
  }

  for (const node of event.composedPath()) {
    const target = getTooltipTargetFromNode(node);
    if (target) {
      return target;
    }
  }

  return null;
}

function wireSharedTooltipSystem() {
  document.addEventListener("mouseover", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (!(target instanceof HTMLElement)) {
      return;
    }

    positionSharedTooltip(target);
  });

  document.addEventListener("mouseout", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (!(target instanceof HTMLElement) || target !== activeSharedTooltipTarget) {
      return;
    }

    const nextTarget = getTooltipTargetFromNode(event.relatedTarget);
    if (nextTarget === target) {
      return;
    }

    hideSharedTooltip();
  });

  window.addEventListener("scroll", () => {
    if (activeSharedTooltipTarget instanceof HTMLElement) {
      positionSharedTooltip(activeSharedTooltipTarget);
    }
  }, true);

  window.addEventListener("resize", () => {
    if (activeSharedTooltipTarget instanceof HTMLElement) {
      positionSharedTooltip(activeSharedTooltipTarget);
    }
  });
}

function render() {
  const flags = deriveViewFlags(state);
  authView?.classList.toggle("hidden", !flags.showAuthView);
  shellView?.classList.toggle("hidden", !flags.showShellView);
  sshStage?.classList.toggle("hidden", !flags.showSshStage);
  expiryOverlay?.classList.toggle("hidden", !flags.showExpiryOverlay);

  setMessage(authMessage, state.authMessage, "danger");
  setMessage(shellMessage, state.shellMessage);
  renderSessionSummary(state.session);
  syncDocumentLanguageDirection();
  syncProfileIdentity();
  syncLanguageTriggers();
  syncDisplaySettingsCopy();
  syncNavState();
  syncSubNavState();

  if (flags.showShellView) {
    rootUsersListController.syncPageState();
  }

  if (flags.showShellView) {
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      syncNavState();
      scheduleContextNavOffsetUpdate();
    });
  }
}

function messageForError(error, fallback) {
  if (error instanceof ApiError) {
    return error.message;
  }
  return fallback;
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

async function bootstrapSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    state.phase = "authenticated";
    state.navigation.currentPage = resolvePageFromLocation();
    render();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      Object.assign(state, resetToLoginState(state));
      rootUsersListController.reset();
      state.phase = "login";
      render();
      return;
    }
    state.phase = "login";
    state.authMessage = "Could not restore the browser session. Please sign in again.";
    render();
  }
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
  } catch (_error) {
    // Session may already be expired. Reset locally either way.
  }

  window.history.replaceState(null, "", "/root-admin#overview");
  Object.assign(state, resetToLoginState(state));
  rootUsersListController.reset();
  render();
}

async function handleRefreshSession() {
  try {
    setShellMessage("Refreshing browser session...");
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    render();
    setShellMessage("Browser session refreshed.", "success");
  } catch (error) {
    setShellMessage(messageForError(error, "Could not refresh the browser session."), "danger");
  }
}

async function handleShellSearchSubmit(event) {
  event.preventDefault();

  if (!(shellSearchInput instanceof HTMLInputElement)) {
    return;
  }

  const query = shellSearchInput.value.trim();
  const handledByRootUsers = await rootUsersListController.handleShellSearchSubmit(query);
  if (handledByRootUsers) {
    return;
  }

  if (!query) {
    setShellMessage("Type a route, users, or roles term to navigate the shell.");
    return;
  }

  const matchedPage = matchPageFromSearch(query);
  if (!matchedPage) {
    setShellMessage(`No root-admin destination matched “${query}”.`, "danger");
    return;
  }

  setCurrentPage(matchedPage);
  setShellMessage(`Opened ${pageMetaFor(matchedPage).title}.`, "success");
}

loginForm?.addEventListener("submit", handlePasswordSubmit);
signSubmit?.addEventListener("click", handleSshSubmit);
returnToLogin?.addEventListener("click", () => {
  window.history.replaceState(null, "", "/root-admin#overview");
  Object.assign(state, resetToLoginState(state));
  rootUsersListController.reset();
  render();
});
refreshSessionButton?.addEventListener("click", handleRefreshSession);
shellSearchForm?.addEventListener("submit", handleShellSearchSubmit);
profileLanguageButton?.addEventListener("click", () => setLanguageModalOpen(true, profileLanguageButton));
mobileLanguageButton?.addEventListener("click", () => setLanguageModalOpen(true, mobileLanguageButton));
languageModalCloseButton?.addEventListener("click", () => setLanguageModalOpen(false));
languageModalBackdrop?.addEventListener("click", () => setLanguageModalOpen(false));
profileLogoutButton?.addEventListener("click", handleLogout);
mobileLogoutButton?.addEventListener("click", handleLogout);

profileButton?.addEventListener("click", () => {
  const nextState = !isMenuOpen();
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setMenuOpen(nextState);
});

displaySettingsButton?.addEventListener("click", () => {
  setDisplaySettingsDrawerOpen(!isDisplaySettingsDrawerOpen(), { trigger: displaySettingsButton });
});

contextNavMoreButton?.addEventListener("click", () => {
  setContextNavMoreOpen(!isContextNavMoreOpen());
});

contextNavMoreDisplaySettingsButton?.addEventListener("click", () => {
  setContextNavMoreOpen(false);
  setDisplaySettingsDrawerOpen(true, { trigger: contextNavMoreButton });
});

displaySettingsCloseButton?.addEventListener("click", () => {
  setDisplaySettingsDrawerOpen(false, { returnFocus: true });
});

primaryNavOverflowButton?.addEventListener("click", () => {
  const nextState = !isPrimaryNavOverflowOpen();
  setMenuOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setPrimaryNavOverflowOpen(nextState);
});

mobileNavButton?.addEventListener("click", () => {
  const nextState = !isMobileNavOpen();
  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(nextState);
  if (!nextState) {
    setMobileProfileOpen(false);
  }
});

mobileProfileButton?.addEventListener("click", () => {
  setMobileProfileOpen(!isMobileProfileOpen());
});

for (const button of themeButtons) {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.themeOption ?? "normal");
  });
}

for (const button of magnificationButtons) {
  button.addEventListener("click", () => {
    applyMagnification(button.dataset.magnificationOption ?? "0");
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  if (
    !target.closest(".nav-utilities")
    && !target.closest(".primary-nav-overflow")
    && !target.closest("#mobile-nav-menu")
    && !target.closest("#mobile-nav-button")
  ) {
    setMenuOpen(false);
    setPrimaryNavOverflowOpen(false);
    setMobileNavOpen(false);
    setMobileProfileOpen(false);
  }

  if (
    !target.closest(".context-nav-more")
    && !target.closest("#display-settings-drawer")
    && !target.closest("#display-settings-button")
  ) {
    setContextNavMoreOpen(false);
    if (isDisplaySettingsDrawerOpen()) {
      setDisplaySettingsDrawerOpen(false, { returnFocus: true });
    }
  }

  const pageLink = target.closest("[data-page-link]");
  if (pageLink instanceof HTMLElement) {
    const page = pageLink.dataset.pageLink;
    if (page) {
      event.preventDefault();
      setCurrentPage(page);
    }
  }

  const languageButton = target.closest("[data-language-code]");
  if (languageButton instanceof HTMLElement) {
    const languageCode = languageButton.dataset.languageCode;
    if (languageCode) {
      selectLanguage(languageCode);
      setLanguageModalOpen(false);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (isLanguageModalOpen()) {
    setLanguageModalOpen(false);
    return;
  }

  if (isDisplaySettingsDrawerOpen()) {
    setContextNavMoreOpen(false);
    setDisplaySettingsDrawerOpen(false, { returnFocus: true });
    hideSharedTooltip();
    return;
  }

  if (isContextNavMoreOpen()) {
    setContextNavMoreOpen(false);
    contextNavMoreButton?.focus();
    hideSharedTooltip();
    return;
  }

  closeTransientShellSurfaces();
  hideSharedTooltip();
});

window.addEventListener("resize", () => {
  updatePrimaryNavOverflow();
  syncNavState();
  scheduleContextNavOffsetUpdate();
});

window.addEventListener("hashchange", () => {
  state.navigation.currentPage = resolvePageFromLocation();
  render();
});

window.addEventListener("scroll", scheduleContextNavOffsetUpdate, { passive: true });

state.phase = "bootstrapping";
state.navigation.currentPage = resolvePageFromLocation();
wireSharedTooltipSystem();
applyTheme("normal");
applyMagnification(0);
render();
bootstrapSession();
