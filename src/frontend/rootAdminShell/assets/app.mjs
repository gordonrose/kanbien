import {
  createInitialState,
  deriveViewFlags,
  displayNameForSession,
  markSessionExpired,
  resetToLoginState,
} from "./state.mjs";
import { signLoginChallenge } from "./helperClient.mjs";
import { createRootUsersListController } from "./rootUsersList.mjs";
import { createWebAppHierarchyPageController } from "./webAppHierarchyPage.mjs";
import { partitionContextNavItems, renderContextNavMenuItems } from "/design-system/assets/contextNav.mjs";
import { renderDesignSystemIconSvg } from "/design-system/assets/formControls.mjs";
import { createPageShellBannerRuntimeController } from "/design-system/assets/pageShellBanner.mjs";
import {
  buildPageShellBreadcrumbMarkup,
  createPageShellBreadcrumbController,
  createPageShellChromeController,
  createPageShellLanguageController,
  createPageShellTooltipController,
} from "/design-system/assets/pageShellController.mjs";

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

const rootAdminTopNavPageOrder = [
  "overview",
  "users",
  "roles",
  "tenants",
  "tenant-admins",
  "web-app-hierarchy",
];

const rootAdminTopNavPageOrderIndex = new Map(
  rootAdminTopNavPageOrder.map((pageKey, index) => [pageKey, index]),
);

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
  "web-app-hierarchy": {
    title: "Web App Hierarchy",
    breadcrumbCurrent: "Web App Hierarchy",
    searchPlaceholder: "Search hierarchy routes, modules, or shell guidance",
    searchKeywords: ["hierarchy", "web app hierarchy", "tree", "modules", "pages", "routes"],
  },
};

const rootAdminCanonicalPaths = {
  overview: "/root-admin",
  users: "/root-admin/users",
  roles: "/root-admin/roles",
  tenants: "/root-admin/tenants",
  "tenant-admins": "/root-admin/tenant-admins",
  "web-app-hierarchy": "/root-admin/web-app-hierarchy",
};

const state = createInitialState();
state.navigation.currentPage = "overview";

let activeLanguageCode = resolveInitialLanguageCode();

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
const contextNavMainItems = document.querySelector(".context-nav-main");
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
const breadcrumbNav = document.querySelector(".breadcrumb-nav");
if (breadcrumbNav instanceof HTMLElement) {
  breadcrumbNav.innerHTML = buildPageShellBreadcrumbMarkup([
    { href: "/root-admin", label: "Root Admin" },
  ]);
}
const breadcrumbHomeItem = document.getElementById("breadcrumb-home-item");
const breadcrumbHomeLink = document.getElementById("breadcrumb-home-link");
const breadcrumbCompact = document.getElementById("breadcrumb-compact");
const breadcrumbCompactButton = document.getElementById("breadcrumb-compact-button");
const breadcrumbCompactMenu = document.getElementById("breadcrumb-compact-menu");
const breadcrumbCollapseButton = document.getElementById("breadcrumb-collapse-button");
const breadcrumbCollapseMenu = document.getElementById("breadcrumb-collapse-menu");
const breadcrumbCollapsedItem = document.getElementById("breadcrumb-collapsed-item");
const breadcrumbSeparatorBeforeCollapsed = document.getElementById("breadcrumb-separator-before-collapsed");
const breadcrumbPageMinusOneItem = document.getElementById("breadcrumb-page-minus-one-item");
const breadcrumbSeparatorBeforePageMinusOne = document.getElementById("breadcrumb-separator-before-page-minus-one");
const breadcrumbPageMinusOneLink = document.getElementById("breadcrumb-page-minus-one-link");
const breadcrumbCurrentItem = document.getElementById("breadcrumb-current-item");
const breadcrumbCurrentLabel = document.getElementById("breadcrumb-current-label");
const shellSearchForm = document.getElementById("shell-search-form");
const shellSearchInput = document.getElementById("shell-search-input");
const shellSubNav = document.querySelector(".sub-nav");
const hierarchyTreeNavButton = document.getElementById("hierarchy-tree-nav-button");
const displaySettingsButton = document.getElementById("display-settings-button");
const displaySettingsLabel = document.getElementById("display-settings-label");
const contextNavMoreButton = document.getElementById("context-nav-more-button");
const contextNavMoreMenu = document.getElementById("context-nav-more-menu");
const contextNavMoreLinks = document.getElementById("context-nav-more-links");
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
  "web-app-hierarchy": document.getElementById("page-web-app-hierarchy"),
};

const shellChromeController = createPageShellChromeController({
  topNav,
  primaryNav,
  primaryNavOverflow,
  primaryNavOverflowButton,
  primaryNavOverflowMenu,
  primaryNavLinks,
  mobileNavButton,
  mobileNavMenu,
  profileButton,
  profileMenu,
  navUtilities,
  mobileProfileButton,
  mobileProfileMenu,
  contextNavMoreButton,
  contextNavMoreMenu,
  displaySettingsDrawer,
  displaySettingsButton,
  displaySettingsCloseButton,
  displaySettingsPersistentRegions: [
    document.getElementById("hierarchy-tree-drawer"),
    document.getElementById("hierarchy-tree-drawer-scrim"),
    document.getElementById("hierarchy-tree-nav-button"),
  ],
  shellSubNav,
  contextNav: document.querySelector(".context-nav"),
});

const {
  closeTransientShellSurfaces,
  isContextNavMoreOpen,
  isDisplaySettingsDrawerOpen,
  isMenuOpen,
  isMobileNavOpen,
  isMobileProfileOpen,
  isPrimaryNavOverflowOpen,
  scheduleContextNavOffsetUpdate,
  setContextNavMoreOpen,
  setDisplaySettingsDrawerOpen,
  setMenuOpen,
  setMobileNavOpen,
  setMobileProfileOpen,
  setPrimaryNavOverflowOpen,
  shouldKeepDisplaySettingsOpenForTarget,
  updatePrimaryNavOverflow,
} = shellChromeController;

const shellBreadcrumbController = createPageShellBreadcrumbController({
  row: shellSubNav,
  breadcrumbNav,
  breadcrumbList: document.getElementById("breadcrumb-list"),
  breadcrumbHomeLink,
  breadcrumbCompact,
  breadcrumbCompactButton,
  breadcrumbCompactMenu,
  breadcrumbCollapseButton,
  breadcrumbCollapseMenu,
  breadcrumbCollapsedItem,
  breadcrumbSeparatorBeforeCollapsed,
  breadcrumbPageMinusOneItem,
  breadcrumbSeparatorBeforePageMinusOne,
  breadcrumbPageMinusOneLink,
  breadcrumbCurrentItem,
  breadcrumbCurrentLabel,
});

const {
  closeBreadcrumbMenus,
  renderBreadcrumbs,
  scheduleBreadcrumbPresentation,
} = shellBreadcrumbController;

const shellLanguageController = createPageShellLanguageController({
  displaySettingsButton,
  displaySettingsCloseButton,
  displaySettingsCopy,
  displaySettingsEyebrow,
  displaySettingsLabel,
  displaySettingsMagnificationLabel,
  displaySettingsThemeLabel,
  displaySettingsTitle,
  contextNavMoreButton,
  contextNavMoreDisplaySettingsButton,
  getActiveLanguageCode: () => activeLanguageCode,
  languageModal,
  languageModalCloseButton,
  languageOptionList,
  languageOptions,
  magnificationButtons,
  mobileLanguageButton,
  onShellGeometryChange: () => {
    updatePrimaryNavOverflow();
    scheduleBreadcrumbPresentation();
    syncNavState();
    scheduleContextNavOffsetUpdate();
  },
  profileLanguageButton,
  setActiveLanguageCode: (languageCode) => {
    activeLanguageCode = languageCode;
  },
  themeButtons,
});

const {
  applyMagnification,
  applyTheme,
  isLanguageModalOpen,
  renderLanguageOptions,
  selectLanguage,
  setLanguageModalOpen,
  syncDisplaySettingsCopy,
  syncDocumentLanguageDirection,
  syncLanguageTriggers,
} = shellLanguageController;

const shellTooltipController = createPageShellTooltipController();
const { hideSharedTooltip, suspendSharedTooltipUntilPointerMove, wireSharedTooltipSystem } = shellTooltipController;
const shellBannerController = createPageShellBannerRuntimeController(shellMessage, {
  ariaLabel: "Root-admin shell feedback",
});
const rootAdminShellBannerPolicyNames = new Set(["error", "blocked-action", "mutation-success"]);

const rootUsersListController = createRootUsersListController({
  root: document.getElementById("root-users-list-page"),
  searchInput: shellSearchInput,
  fetchJson,
  setShellMessage,
  getCurrentPage: () => state.navigation.currentPage,
});

const webAppHierarchyPageController = createWebAppHierarchyPageController({
  root: document.getElementById("page-web-app-hierarchy"),
  fetchJson,
  setShellMessage,
  getCurrentPage: () => state.navigation.currentPage,
  getCurrentPathname: () => window.location.pathname,
  setCurrentPathname: (pathname, { historyMode = "replace" } = {}) => {
    syncBrowserLocationForPathname(pathname, historyMode);
  },
  setPageLinkIcon,
  refreshTopNav,
  refreshContextNav: refreshContextNavForCurrentPage,
});

function renderPageLinkIcon(iconHost, iconKey) {
  if (!(iconHost instanceof HTMLElement)) {
    return;
  }

  iconHost.innerHTML = renderDesignSystemIconSvg(iconKey);
}

function defaultDisplayIconKeyForPage(pageKey) {
  switch (pageKey) {
    case "overview":
    case "root-admin-overview":
      return "home";
    case "users":
    case "root-admin-users":
      return "user";
    case "roles":
    case "root-admin-roles":
      return "admin";
    case "tenants":
    case "root-admin-tenants":
      return "workspace";
    case "tenant-admins":
    case "root-admin-tenant-admins":
      return "tenant";
    case "web-app-hierarchy":
    case "root-admin-web-app-hierarchy":
      return "hierarchy";
    default:
      return "grid";
  }
}

function normalizeRootAdminShellPageKey(pageKey) {
  if (typeof pageKey !== "string" || pageKey.trim().length === 0) {
    return null;
  }

  const trimmed = pageAliases[pageKey.trim()] ?? pageKey.trim();
  if (Object.hasOwn(pageMetadata, trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("root-admin-")) {
    const stripped = trimmed.slice("root-admin-".length);
    return Object.hasOwn(pageMetadata, stripped) ? stripped : null;
  }

  return null;
}

function deriveShellPageKeyFromRoutePath(routePath, fallbackPageKey = "overview") {
  if (typeof routePath !== "string" || routePath.trim().length === 0) {
    return fallbackPageKey;
  }

  const [pathname, hash = ""] = routePath.split("#", 2);
  if (hash.trim().length > 0) {
    return normalizePage(hash.trim());
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin") {
    return fallbackPageKey;
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  return normalizePage(segments.at(-1) ?? fallbackPageKey);
}

function buildCanonicalRootAdminPath(pageKey) {
  return rootAdminCanonicalPaths[normalizePage(pageKey)] ?? rootAdminCanonicalPaths.overview;
}

function normalizePathname(pathname) {
  if (typeof pathname !== "string" || pathname.trim().length === 0) {
    return "/";
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  return normalizedPath.length > 0 ? normalizedPath : "/";
}

function syncBrowserLocationForPathname(pathname, historyMode = "replace") {
  if (typeof pathname !== "string" || pathname.trim().length === 0) {
    return;
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.pathname = pathname;
  nextUrl.hash = "";

  const nextLocation = `${nextUrl.pathname}${nextUrl.search}`;
  const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextLocation === currentLocation) {
    return;
  }

  const historyMethod = historyMode === "push" ? "pushState" : "replaceState";
  window.history[historyMethod](null, "", nextLocation);
}

function deriveShellPageKeyFromPathname(pathname, fallbackPageKey = "overview") {
  if (typeof pathname !== "string" || pathname.trim().length === 0) {
    return fallbackPageKey;
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin" || normalizedPath === "") {
    return "overview";
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments[0] !== "root-admin") {
    return fallbackPageKey;
  }

  if (segments.length === 1) {
    return "overview";
  }

  return normalizePage(segments[1] ?? fallbackPageKey);
}

function resolvePageLocationFromWindow() {
  const pathnamePage = deriveShellPageKeyFromPathname(window.location.pathname, null);
  if (pathnamePage && pathnamePage !== "overview") {
    return pathnamePage;
  }

  const hashPage = normalizeRootAdminShellPageKey(window.location.hash.replace(/^#/, ""));
  if (hashPage) {
    return hashPage;
  }

  return pathnamePage ?? "overview";
}

function syncBrowserLocationForPage(page, historyMode = "replace") {
  const canonicalPath = buildCanonicalRootAdminPath(page);
  const currentPathname = normalizePathname(window.location.pathname);
  const nextPathname =
    currentPathname === canonicalPath || currentPathname.startsWith(`${canonicalPath}/`)
      ? currentPathname
      : canonicalPath;

  syncBrowserLocationForPathname(nextPathname, historyMode);
}

function flattenHierarchyPages(pages) {
  if (!Array.isArray(pages)) {
    return [];
  }

  return pages.flatMap((page) => [
    page,
    ...flattenHierarchyPages(page.children),
  ]);
}

function buildRootAdminTopNavHref(pageKey) {
  return buildCanonicalRootAdminPath(pageKey);
}

function createPrimaryNavLink(pageKey, label) {
  const link = document.createElement("a");
  link.className = "nav-link";
  link.href = buildRootAdminTopNavHref(pageKey);
  link.dataset.pageLink = pageKey;
  link.title = label;
  link.textContent = label;
  return link;
}

function createMobileNavLink(pageKey, label) {
  const link = document.createElement("a");
  link.className = "nav-link";
  link.href = buildRootAdminTopNavHref(pageKey);
  link.dataset.pageLink = pageKey;
  link.title = label;
  link.textContent = label;
  return link;
}

function setTopNavLinkCollections(nextItems) {
  const primaryNavLinksHost = document.getElementById("primary-nav-links");
  if (primaryNavLinksHost instanceof HTMLElement) {
    primaryNavLinksHost.replaceChildren(
      ...nextItems.map((item) => createPrimaryNavLink(item.shellPageKey, item.displayLabel)),
    );
    primaryNavLinks.splice(
      0,
      primaryNavLinks.length,
      ...Array.from(primaryNavLinksHost.querySelectorAll(".nav-link")),
    );
  }

  if (mobileNavMenu instanceof HTMLElement) {
    for (const link of mobileNavLinks) {
      link.remove();
    }

    const mobileProfileGroup = mobileNavMenu.querySelector(".mobile-profile-group");
    const nextMobileLinks = nextItems.map((item) => createMobileNavLink(item.shellPageKey, item.displayLabel));
    for (const link of nextMobileLinks) {
      mobileNavMenu.insertBefore(link, mobileProfileGroup);
    }
    mobileNavLinks.splice(0, mobileNavLinks.length, ...nextMobileLinks);
  }
}

function buildFallbackTopNavItems() {
  return [
    {
      webAppPageId: null,
      shellPageKey: "overview",
      displayLabel: pageMetaFor("overview").title,
      topNavOrder: -1,
    },
  ];
}

function buildRootAdminTopNavItemsFromTree(tree) {
  const rootFamily = tree?.rootFamilies?.find((family) => family.rootFamilyId === "root-admin");
  if (!rootFamily || !Array.isArray(rootFamily.modules)) {
    return [];
  }

  const itemsByPageKey = new Map();

  for (const module of rootFamily.modules) {
    for (const page of flattenHierarchyPages(module.pages)) {
      const normalizedPageKey =
        normalizeRootAdminShellPageKey(page?.pageKey)
        ?? deriveShellPageKeyFromRoutePath(page?.resolvedFullRoutePath, "overview");

      if (!normalizedPageKey || !Object.hasOwn(pageMetadata, normalizedPageKey)) {
        continue;
      }

      itemsByPageKey.set(normalizedPageKey, {
        webAppPageId: page.webAppPageId,
        shellPageKey: normalizedPageKey,
        displayLabel: page.displayLabel ?? pageMetaFor(normalizedPageKey).title,
      });
    }
  }

  return [...itemsByPageKey.values()];
}

function sortTopNavItems(items) {
  return [...items].sort((left, right) => {
    if (left.shellPageKey === "overview" && right.shellPageKey !== "overview") {
      return -1;
    }

    if (right.shellPageKey === "overview" && left.shellPageKey !== "overview") {
      return 1;
    }

    const leftOrder = typeof left.topNavOrder === "number" ? left.topNavOrder : Number.POSITIVE_INFINITY;
    const rightOrder = typeof right.topNavOrder === "number" ? right.topNavOrder : Number.POSITIVE_INFINITY;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftIndex = rootAdminTopNavPageOrderIndex.get(left.shellPageKey) ?? Number.POSITIVE_INFINITY;
    const rightIndex = rootAdminTopNavPageOrderIndex.get(right.shellPageKey) ?? Number.POSITIVE_INFINITY;
    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return left.displayLabel.localeCompare(right.displayLabel);
  });
}

let topNavRequestId = 0;

async function refreshTopNav() {
  if (state.phase !== "authenticated") {
    setTopNavLinkCollections(buildFallbackTopNavItems());
    syncNavState();
    updatePrimaryNavOverflow();
    return;
  }

  const requestId = ++topNavRequestId;

  try {
    const tree = await fetchJson("/v1/web-app-hierarchy/tree", { method: "GET" });
    const candidates = buildRootAdminTopNavItemsFromTree(tree);
    const settingsItems = await Promise.all(
      candidates.map(async (candidate) => {
        try {
          const settings = await fetchJson(
            `/v1/web-app-page-settings/pages/${encodeURIComponent(candidate.webAppPageId)}`,
            { method: "GET" },
          );
          return {
            ...candidate,
            displayLabel: settings?.displayLabel ?? candidate.displayLabel,
            showInTopNav: settings?.showInTopNav === true,
            topNavOrder: settings?.topNavOrder ?? null,
          };
        } catch (_error) {
          return {
            ...candidate,
            showInTopNav: false,
            topNavOrder: null,
          };
        }
      }),
    );

    if (requestId !== topNavRequestId || state.phase !== "authenticated") {
      return;
    }

    const itemsByPageKey = new Map();
    for (const item of settingsItems) {
      if (item.showInTopNav || item.shellPageKey === "overview") {
        itemsByPageKey.set(item.shellPageKey, item);
      }
    }

    if (!itemsByPageKey.has("overview")) {
      itemsByPageKey.set("overview", buildFallbackTopNavItems()[0]);
    }

    setTopNavLinkCollections(sortTopNavItems([...itemsByPageKey.values()]));
  } catch (_error) {
    if (requestId !== topNavRequestId) {
      return;
    }

    setTopNavLinkCollections(buildFallbackTopNavItems());
  }

  syncNavState();
  updatePrimaryNavOverflow();
}

function decodePageSettingsIconKey(iconKey, pageKey) {
  switch (iconKey) {
    case null:
    case undefined:
    case "":
    case "page-default":
      return defaultDisplayIconKeyForPage(pageKey);
    case "page-home":
      return "home";
    case "page-grid":
      return "grid";
    case "page-list":
      return "list";
    case "page-settings":
      return "settings";
    case "page-folder":
      return "doc";
    default:
      return iconKey;
  }
}

function getContextNavLinks() {
  return Array.from(contextNavMainItems?.querySelectorAll(".context-nav-item[data-page-link]") ?? []);
}

function setPageLinkIcon(pageKey, iconKey) {
  if (typeof pageKey !== "string" || typeof iconKey !== "string") {
    return;
  }

  getContextNavLinks()
    .filter((link) => link.dataset.pageLink === pageKey)
    .forEach((link) => renderPageLinkIcon(link.querySelector(".context-nav-icon"), iconKey));

  if (pageKey === "web-app-hierarchy") {
    renderPageLinkIcon(hierarchyTreeNavButton?.querySelector(".context-nav-icon"), iconKey);
  }
}

function normalizePage(page) {
  const normalizedPage = normalizeRootAdminShellPageKey(page);
  return normalizedPage ?? "overview";
}

let contextNavRequestId = 0;
let renderedContextNavItems = [];

function isMobileContextNavLayout() {
  return window.matchMedia("(max-width: 61.25rem)").matches;
}

function renderContextNavOverflowLinks(items) {
  if (!(contextNavMoreLinks instanceof HTMLElement)) {
    return;
  }

  contextNavMoreLinks.innerHTML = renderContextNavMenuItems(items, {
    getHref: (item) => item.resolvedFullRoutePath ?? buildCanonicalRootAdminPath(item.shellPageKey),
    getLabel: (item) => item.displayLabel,
    getCurrent: (item) => item.shellPageKey === state.navigation.currentPage,
    getItemKey: (item) => item.shellPageKey,
  });
}

function renderContextNavItems(items) {
  if (!(contextNavMainItems instanceof HTMLElement)) {
    return;
  }

  renderedContextNavItems = Array.isArray(items) ? items : [];
  const { visibleItems, overflowItems } = partitionContextNavItems(renderedContextNavItems, {
    isMobile: isMobileContextNavLayout(),
    currentItemKey: state.navigation.currentPage,
    maxVisibleItems: 4,
    getItemKey: (item) => item.shellPageKey,
  });

  contextNavMainItems.innerHTML = visibleItems
    .map((item) => {
      const iconKey = decodePageSettingsIconKey(item.effectiveIconKey ?? item.iconKey ?? null, item.shellPageKey);
      const href = item.resolvedFullRoutePath ?? buildCanonicalRootAdminPath(item.shellPageKey);
      return `
        <a
          class="context-nav-item"
          href="${escapeHtml(href)}"
          data-page-link="${escapeHtml(item.shellPageKey)}"
          data-tooltip="${escapeHtml(item.displayLabel)}"
        >
          <span class="context-nav-icon" aria-hidden="true">${renderDesignSystemIconSvg(iconKey)}</span>
          <span class="context-nav-label">${escapeHtml(item.displayLabel)}</span>
        </a>
      `;
    })
    .join("");

  renderContextNavOverflowLinks(overflowItems);
  syncNavState();
  scheduleContextNavOffsetUpdate();
}

async function refreshContextNav(pageKey) {
  if (state.phase !== "authenticated") {
    renderContextNavItems([]);
    return;
  }

  const requestId = ++contextNavRequestId;
  renderContextNavItems([]);

  try {
    const response = await fetchJson(
      `/v1/web-app-page-settings/root-families/root-admin/pages/${encodeURIComponent(pageKey)}/context-nav`,
      { method: "GET" },
    );
    if (requestId !== contextNavRequestId || state.navigation.currentPage !== pageKey) {
      return;
    }
    renderContextNavItems(Array.isArray(response?.items) ? response.items : []);
  } catch (_error) {
    if (requestId !== contextNavRequestId || state.navigation.currentPage !== pageKey) {
      return;
    }
    renderContextNavItems([]);
  }
}

function refreshContextNavForCurrentPage() {
  return refreshContextNav(state.navigation.currentPage);
}

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

function clearShellMessage() {
  state.shellMessage = "";
  shellBannerController?.clear();
}

function setShellMessage(message, policyName = "error") {
  state.shellMessage = message;
  if (!message) {
    clearShellMessage();
    return;
  }

  const resolvedPolicyName = rootAdminShellBannerPolicyNames.has(policyName) ? policyName : "error";
  shellBannerController?.showForPolicy(resolvedPolicyName, {
    message,
  });
}

function renderSessionSummary(session) {
  if (!session) {
    sessionSummary.innerHTML = "";
    return;
  }

  sessionSummary.innerHTML = `
    <div class="canonical-render-meta-row"><dt>User</dt><dd>${escapeHtml(displayNameForSession(session))}</dd></div>
    <div class="canonical-render-meta-row"><dt>Email</dt><dd>${escapeHtml(session.email)}</dd></div>
    <div class="canonical-render-meta-row"><dt>Root User ID</dt><dd><code>${escapeHtml(session.rootUserId)}</code></dd></div>
    <div class="canonical-render-meta-row"><dt>Principal ID</dt><dd><code>${escapeHtml(session.authPrincipalId)}</code></dd></div>
    <div class="canonical-render-meta-row"><dt>Session Expires</dt><dd>${escapeHtml(formatTimestamp(session.expiresAt))}</dd></div>
  `;
}

function getActiveLanguage() {
  return languageMetaFor(activeLanguageCode);
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
    clearShellMessage();
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
  return resolvePageLocationFromWindow();
}

function setCurrentPage(page, { syncLocation = true, historyMode = "replace" } = {}) {
  const normalizedPage = normalizePage(page);
  clearShellMessage();
  state.navigation.currentPage = normalizedPage;

  if (syncLocation) {
    syncBrowserLocationForPage(normalizedPage, historyMode);
  }

  closeTransientShellSurfaces({ includeDisplaySettings: true, returnFocus: false });
  render();
  void refreshContextNav(normalizedPage);
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
  syncLinkCollection(getContextNavLinks());
  syncLinkCollection(Array.from(contextNavMoreMenu?.querySelectorAll("[data-page-link]") ?? []));
  syncLinkCollection(Array.from(primaryNavOverflowMenu?.querySelectorAll("[data-page-link]") ?? []));

  for (const [page, section] of Object.entries(pageSections)) {
    section?.classList.toggle("hidden", page !== currentPage);
  }

  if (hierarchyTreeNavButton instanceof HTMLElement) {
    hierarchyTreeNavButton.classList.toggle("hidden", currentPage !== "web-app-hierarchy");
  }

}

function syncSubNavState() {
  const currentPage = state.navigation.currentPage;
  const meta = pageMetaFor(currentPage);
  const isOverview = currentPage === "overview";
  const breadcrumbChain = isOverview
    ? [{ href: buildCanonicalRootAdminPath("overview"), label: "Root Admin" }]
    : [
        { href: buildCanonicalRootAdminPath("overview"), label: "Root Admin" },
        { href: buildCanonicalRootAdminPath(currentPage), label: meta.breadcrumbCurrent ?? meta.title },
      ];

  if (breadcrumbHomeItem) {
    breadcrumbHomeItem.classList.remove("hidden");
  }

  renderBreadcrumbs(breadcrumbChain);

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


function render() {
  const flags = deriveViewFlags(state);
  authView?.classList.toggle("hidden", !flags.showAuthView);
  shellView?.classList.toggle("hidden", !flags.showShellView);
  sshStage?.classList.toggle("hidden", !flags.showSshStage);
  expiryOverlay?.classList.toggle("hidden", !flags.showExpiryOverlay);

  setMessage(authMessage, state.authMessage, "danger");
  suspendSharedTooltipUntilPointerMove();
  renderSessionSummary(state.session);
  syncDocumentLanguageDirection();
  syncProfileIdentity();
  syncLanguageTriggers();
  syncDisplaySettingsCopy();
  syncNavState();
  syncSubNavState();

  if (flags.showShellView) {
    rootUsersListController.syncPageState();
    webAppHierarchyPageController.syncPageState();
  }

  if (flags.showShellView) {
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      scheduleBreadcrumbPresentation();
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
    syncBrowserLocationForPage(state.navigation.currentPage, "replace");
    render();
    await refreshTopNav();
    await refreshContextNavForCurrentPage();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      Object.assign(state, resetToLoginState(state));
      clearShellMessage();
      rootUsersListController.reset();
      webAppHierarchyPageController.reset();
      renderContextNavItems([]);
      state.phase = "login";
      render();
      return;
    }
    state.phase = "login";
    state.authMessage = "Could not restore the browser session. Please sign in again.";
    clearShellMessage();
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
    clearShellMessage();
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

  window.history.replaceState(null, "", buildCanonicalRootAdminPath("overview"));
  Object.assign(state, resetToLoginState(state));
  clearShellMessage();
  rootUsersListController.reset();
  webAppHierarchyPageController.reset();
  setTopNavLinkCollections(buildFallbackTopNavItems());
  renderContextNavItems([]);
  render();
}

async function handleRefreshSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    render();
  } catch (error) {
    setShellMessage(messageForError(error, "Could not refresh the browser session."), "error");
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
    setShellMessage("Type a route, users, or roles term to navigate the shell.", "blocked-action");
    return;
  }

  const matchedPage = matchPageFromSearch(query);
  if (!matchedPage) {
    setShellMessage(`No root-admin destination matched “${query}”.`, "error");
    return;
  }

  setCurrentPage(matchedPage, { historyMode: "push" });
}

loginForm?.addEventListener("submit", handlePasswordSubmit);
signSubmit?.addEventListener("click", handleSshSubmit);
returnToLogin?.addEventListener("click", () => {
  window.history.replaceState(null, "", buildCanonicalRootAdminPath("overview"));
  Object.assign(state, resetToLoginState(state));
  clearShellMessage();
  rootUsersListController.reset();
  webAppHierarchyPageController.reset();
  setTopNavLinkCollections(buildFallbackTopNavItems());
  renderContextNavItems([]);
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
  closeBreadcrumbMenus();
  setMenuOpen(nextState);
});

displaySettingsButton?.addEventListener("click", () => {
  closeBreadcrumbMenus();
  setDisplaySettingsDrawerOpen(!isDisplaySettingsDrawerOpen(), { trigger: displaySettingsButton });
});

contextNavMoreButton?.addEventListener("click", () => {
  closeBreadcrumbMenus();
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
  closeBreadcrumbMenus();
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setPrimaryNavOverflowOpen(nextState);
});

mobileNavButton?.addEventListener("click", () => {
  const nextState = !isMobileNavOpen();
  setMenuOpen(false);
  closeBreadcrumbMenus();
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(nextState);
  if (!nextState) {
    setMobileProfileOpen(false);
  }
});

mobileProfileButton?.addEventListener("click", () => {
  closeBreadcrumbMenus();
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

  if (!shouldKeepDisplaySettingsOpenForTarget(target)) {
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
      setCurrentPage(page, { historyMode: "push" });
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
  closeBreadcrumbMenus();
  hideSharedTooltip();
});

window.addEventListener("resize", () => {
  renderContextNavItems(renderedContextNavItems);
  updatePrimaryNavOverflow();
  scheduleBreadcrumbPresentation();
  syncNavState();
  scheduleContextNavOffsetUpdate();
});

window.addEventListener("hashchange", () => {
  suspendSharedTooltipUntilPointerMove();
  clearShellMessage();
  state.navigation.currentPage = resolvePageFromLocation();
  syncBrowserLocationForPage(state.navigation.currentPage, "replace");
  render();
  void refreshContextNavForCurrentPage();
});

window.addEventListener("popstate", () => {
  suspendSharedTooltipUntilPointerMove();
  clearShellMessage();
  state.navigation.currentPage = resolvePageFromLocation();
  render();
  void refreshContextNavForCurrentPage();
});

window.addEventListener("scroll", scheduleContextNavOffsetUpdate, { passive: true });

state.phase = "bootstrapping";
state.navigation.currentPage = resolvePageFromLocation();
wireSharedTooltipSystem();
applyTheme("normal");
applyMagnification(0);
setTopNavLinkCollections(buildFallbackTopNavItems());
render();
bootstrapSession();
