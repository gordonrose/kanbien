import {
  createInitialState,
  deriveViewFlags,
  displayNameForSession,
  resetToLoginState,
} from "./state.mjs";
import {
  buildCanonicalRootAdminPath,
  deriveShellPageKeyFromPathname,
  deriveShellPageKeyFromRoutePath,
  isKnownRootAdminShellPage,
  normalizePage,
  normalizeRootAdminShellPageKey,
} from "./routeTopology.mjs";
import { rootAdminPageMetadata as pageMetadata } from "./pageMetadata.mjs";
import { signLoginChallenge } from "./helperClient.mjs";
import { getRootAdminRouteDefinition } from "../routes/registry.mjs";
import {
  partitionContextNavItems,
  renderContextNavItems as renderSharedContextNavItems,
  renderContextNavMenuItems,
} from "/design-system/assets/contextNav.mjs";
import { renderDesignSystemIconSvg } from "/design-system/assets/formControls.mjs";
import {
  createAppShellController,
  renderAppShell,
} from "/design-system/assets/appShell.mjs";
import {
  createLoginTemplateController,
  renderRootAdminLoginTemplate,
} from "/design-system/assets/loginTemplate.mjs";
import { createPageShellBannerRuntimeController } from "/design-system/assets/pageShellBanner.mjs";
import {
  createBuildConversationPanelConfig,
  createConversationPanelController,
  getConversationPanelCanonicalRef,
  renderConversationPanel,
} from "/design-system/assets/conversationPanel.mjs";

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

const rootAdminTopNavPageOrder = [
  "overview",
  "users",
  "roles",
  "tenants",
  "tenant-admins",
  "web-app-hierarchy",
  "build-backlog",
];

const rootAdminTopNavPageOrderIndex = new Map(
  rootAdminTopNavPageOrder.map((pageKey, index) => [pageKey, index]),
);

const rootAdminInitialNavItems = [
  {
    key: "overview",
    label: pageMetadata.overview.title,
    href: buildCanonicalRootAdminPath("overview"),
    title: pageMetadata.overview.title,
  },
];

const rootAdminOverviewPageHtml = `
  <div class="component-catalog-section-header">
    <div>
      <h1 class="component-catalog-section-title">Root Admin Shell POC</h1>
      <p class="component-catalog-meta">
        This replaces the old authenticated root-admin frontend with the signed-off top-nav and sub-nav
        patterns while preserving the real browser-auth journey.
      </p>
    </div>
  </div>
  <div class="component-catalog-section-actions">
    <button id="refresh-session-button" class="accessibility-chip" type="button">Refresh Session</button>
  </div>

  <div class="component-catalog-grid">
    <section class="component-catalog-card">
      <div class="component-catalog-card-header">
        <div class="top-nav-preview-eyebrow">Authenticated Session</div>
        <h2 class="component-catalog-card-title">My Session</h2>
      </div>
      <dl id="session-summary" class="canonical-render-meta" aria-label="Current session"></dl>
    </section>

    <section class="component-catalog-card">
      <div class="component-catalog-card-header">
        <div class="top-nav-preview-eyebrow">Adoption Notes</div>
        <h2 class="component-catalog-card-title">What This Proves</h2>
      </div>
      <p class="component-catalog-card-copy">\`/root-admin\` can adopt the governed top-nav without replacing the browser-auth seam.</p>
      <p class="component-catalog-card-copy">The signed-off sub-nav row stays truthful while section pages change underneath it.</p>
      <p class="component-catalog-card-copy">The signed-off context-nav can own real root-admin section routing instead of local one-off shell chrome.</p>
      <p class="component-catalog-card-copy">New root-admin functions can be added in a controlled way before deeper page UIs are rebuilt later.</p>
    </section>
  </div>
`;

const rootAdminRolesPageHtml = `
  <div class="component-catalog-section-header">
    <div>
      <h1 class="component-catalog-section-title">Roles</h1>
      <p class="component-catalog-meta">
        This placeholder keeps roles visible as a real root-admin section while the role-management surface is
        rebuilt against the adopted shell chrome.
      </p>
    </div>
  </div>

  <div class="component-catalog-grid">
    <section class="component-catalog-card">
      <div class="component-catalog-card-header">
        <h2 class="component-catalog-card-title">Route Intent</h2>
      </div>
      <p class="component-catalog-card-copy">This section will hold root-level role and permission management.</p>
      <p class="component-catalog-card-copy">The route already participates in the same governed breadcrumb and shell search behavior as the other sections.</p>
      <p class="component-catalog-card-copy">The deeper list and editor surfaces can be added later without changing the shell framing.</p>
    </section>

    <section class="component-catalog-card">
      <div class="component-catalog-card-header">
        <h2 class="component-catalog-card-title">Current Boundary</h2>
      </div>
      <p class="component-catalog-card-copy">
        This page intentionally stops at route and shell proof so the navigation contract can be validated
        first in the real consumer.
      </p>
    </section>
  </div>
`;

const rootAdminAppShellInput = {
  appLabel: "Root Admin",
  brand: {
    label: "Kanbien",
    href: buildCanonicalRootAdminPath("overview"),
    ariaLabel: "Kanbien root admin home",
    mark: "K",
  },
  currentPageKey: "overview",
  nav: {
    ariaLabel: "Root admin primary",
    mobileAriaLabel: "Mobile root admin primary",
    mobileButtonLabel: "Open root admin navigation",
    pageChromeLabel: "Root admin page chrome",
    primary: rootAdminInitialNavItems,
    mobile: "same-as-primary",
  },
  profile: {
    label: "Profile",
    initials: "RU",
  },
  breadcrumbs: [
    { href: buildCanonicalRootAdminPath("overview"), label: "Root Admin" },
  ],
  search: {
    enabled: true,
    name: "q",
    placeholder: "Search root admin sections",
  },
  contextNav: {
    enabled: true,
  },
  displaySettings: {
    enabled: true,
  },
  slots: {
    shellMessage: true,
    contextNav: true,
    conversationPanel: true,
    languageModal: true,
  },
  pages: [
    {
      key: "overview",
      sectionId: "page-overview",
      className: "component-catalog-section",
      initiallyVisible: true,
      html: rootAdminOverviewPageHtml,
    },
    {
      key: "users",
      sectionId: "page-users",
      initiallyVisible: false,
    },
    {
      key: "roles",
      sectionId: "page-roles",
      className: "component-catalog-section",
      initiallyVisible: false,
      html: rootAdminRolesPageHtml,
    },
    {
      key: "tenants",
      sectionId: "page-tenants",
      initiallyVisible: false,
    },
    {
      key: "tenant-admins",
      sectionId: "page-tenant-admins",
      initiallyVisible: false,
    },
    {
      key: "web-app-hierarchy",
      sectionId: "page-web-app-hierarchy",
      initiallyVisible: false,
    },
    {
      key: "build-backlog",
      sectionId: "page-build-backlog",
      initiallyVisible: false,
    },
  ],
};

const state = createInitialState();
state.navigation.currentPage = "overview";

let activeLanguageCode = resolveInitialLanguageCode();
let sessionExpiryTimerId = null;
const maxBrowserTimeoutMs = 2_147_483_647;

const authView = document.getElementById("auth-view");
const rootAdminLoginTemplateHost = document.querySelector("[data-root-admin-login-template-host]");
if (rootAdminLoginTemplateHost instanceof HTMLElement) {
  rootAdminLoginTemplateHost.innerHTML = renderRootAdminLoginTemplate();
}
const rootAdminLoginTemplateController = rootAdminLoginTemplateHost instanceof HTMLElement
  ? createLoginTemplateController(rootAdminLoginTemplateHost)
  : null;
const shellView = document.getElementById("shell-view");
if (shellView instanceof HTMLElement) {
  shellView.innerHTML = renderAppShell(rootAdminAppShellInput);
}
const sshStage = document.getElementById("ssh-stage");
const authMessage = document.getElementById("auth-message");
const shellMessage = document.getElementById("shell-message");
const sessionSummary = document.getElementById("session-summary");
const sshInstructions = document.getElementById("ssh-instructions");
const sshKeyChoiceList = document.getElementById("ssh-key-choice-list");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const signSubmit = document.getElementById("sign-submit");
const refreshSessionButton = document.getElementById("refresh-session-button");

const rootAdminContextNavMount = document.getElementById("root-admin-context-nav-mount");
const rootAdminConversationPanelMount = document.getElementById("root-admin-conversation-panel-mount");

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
  "build-backlog": document.getElementById("page-build-backlog"),
};

const appShellController = createAppShellController({
  root: shellView,
  displaySettingsCopy,
  getActiveLanguageCode: () => activeLanguageCode,
  languageOptions,
  onShellGeometryChange: () => {
    syncNavState();
  },
  setActiveLanguageCode: (languageCode) => {
    activeLanguageCode = languageCode;
  },
});

const shellChromeController = appShellController.chrome;

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

const shellBreadcrumbController = appShellController.breadcrumbs;

const {
  closeBreadcrumbMenus,
  renderBreadcrumbs,
  scheduleBreadcrumbPresentation,
} = shellBreadcrumbController;

const shellLanguageController = appShellController.language;

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

const shellTooltipController = appShellController.tooltip;
const { hideSharedTooltip, suspendSharedTooltipUntilPointerMove, wireSharedTooltipSystem } = shellTooltipController;
const shellBannerController = createPageShellBannerRuntimeController(shellMessage, {
  ariaLabel: "Root-admin shell feedback",
});
const rootAdminShellBannerPolicyNames = new Set(["error", "blocked-action", "mutation-success"]);

const usersRoute = getRootAdminRouteDefinition("users");
const usersPageController = usersRoute?.mount?.({
  root: document.getElementById("page-users"),
  searchInput: shellSearchInput,
  fetchJson,
  uploadFileBytes,
  setShellMessage,
  getCurrentPage: () => state.navigation.currentPage,
}) ?? {
  async handleShellSearchSubmit() {
    return false;
  },
  syncPageState() {},
  reset() {},
};

const tenantsRoute = getRootAdminRouteDefinition("tenants");
const tenantsPageController = tenantsRoute?.mount?.({
  root: document.getElementById("page-tenants"),
  searchInput: shellSearchInput,
  fetchJson,
  uploadFileBytes,
  setShellMessage,
  getCurrentPage: () => state.navigation.currentPage,
}) ?? {
  async handleShellSearchSubmit() {
    return false;
  },
  syncPageState() {},
  reset() {},
};

const tenantAdminsRoute = getRootAdminRouteDefinition("tenant-admins");
const tenantAdminsPageController = tenantAdminsRoute?.mount?.({
  root: document.getElementById("page-tenant-admins"),
  searchInput: shellSearchInput,
  fetchJson,
  uploadFileBytes,
  setShellMessage,
  getCurrentPage: () => state.navigation.currentPage,
}) ?? {
  async handleShellSearchSubmit() {
    return false;
  },
  syncPageState() {},
  reset() {},
};

const rootAdminDirectoryControllers = [
  usersPageController,
  tenantsPageController,
  tenantAdminsPageController,
];

const rootAdminDirectoryController = {
  async handleShellSearchSubmit(query) {
    for (const controller of rootAdminDirectoryControllers) {
      if (await controller.handleShellSearchSubmit(query)) {
        return true;
      }
    }
    return false;
  },
  syncPageState() {
    for (const controller of rootAdminDirectoryControllers) {
      controller.syncPageState();
    }
  },
  reset() {
    for (const controller of rootAdminDirectoryControllers) {
      controller.reset();
    }
  },
};

const webAppHierarchyRoute = getRootAdminRouteDefinition("web-app-hierarchy");
const webAppHierarchyPageController = webAppHierarchyRoute?.mount?.({
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
}) ?? {
  syncPageState() {},
  reset() {},
};

const buildBacklogRoute = getRootAdminRouteDefinition("build-backlog");
const buildBacklogPageController = buildBacklogRoute?.mount?.({
  root: document.getElementById("page-build-backlog"),
  getCurrentPage: () => state.navigation.currentPage,
}) ?? {
  syncPageState() {},
  reset() {},
};

const rootAdminConversationPanelState = {
  ref: "BWP-R-001",
  conversationId: null,
  latestPacketRevisionId: null,
  latestPacketState: null,
  editMessageIndex: null,
  renameConversationId: null,
  copyNotice: "",
  historyView: "active",
  messages: [],
  history: [],
};
let rootAdminConversationPanelController = null;

function buildPanelSurfaceContext() {
  const currentPage = state.navigation.currentPage;
  return {
    moduleKey: "root-admin",
    pageKey: currentPage,
    pageLabel: pageMetadata[currentPage]?.title ?? currentPage,
    pathname: window.location.pathname,
    roleContext: "root-builder",
  };
}

function rootAdminBuilderFirstName() {
  const displayName = displayNameForSession(state.session).trim();
  const candidate = displayName || "there";
  return candidate.split(/\s+/)[0] || "there";
}

function buildPanelGreetingMessage() {
  return {
    author: "Harness",
    text: `hello ${rootAdminBuilderFirstName()}, what would you like us to work on today?`,
  };
}

function rootAdminBuildConversationPanelConfig() {
  return createBuildConversationPanelConfig({
    tools: [],
  });
}

function rootAdminConversationPanelRefForRender() {
  const canonicalRef = getConversationPanelCanonicalRef(rootAdminConversationPanelState.ref);

  if (!rootAdminConversationPanelState.latestPacketRevisionId) {
    return {
      ...canonicalRef,
      packetState: "none",
    };
  }

  return canonicalRef;
}

function mapHarnessChatMessages(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [];
  }

  return messages.map((message) => ({
    messageId: message.messageId ?? null,
    author: message.role === "user" ? "Builder" : "Harness",
    text: String(message.body ?? ""),
    user: message.role === "user",
    metadata: message.metadata ?? null,
  }));
}

function mapHarnessChatHistory(conversation) {
  const title = conversation?.title || "Product Discovery conversation";
  const stateLabel = conversation?.latestPacketRevisionId
    ? "Packet revision is ready for authorized PDF download."
    : "Conversation is saved in the root-admin discovery history.";

  return [
    {
      conversationId: conversation?.conversationId ?? null,
      title,
      summary: stateLabel,
      archived: !["active", "packet-ready"].includes(conversation?.state ?? "active"),
    },
    ...rootAdminConversationPanelState.history.filter((item) => item.conversationId !== conversation?.conversationId).slice(0, 24),
  ];
}

function mapHarnessChatHistoryItems(conversations = []) {
  if (!Array.isArray(conversations)) {
    return [];
  }

  return conversations.map((conversation) => {
    const title = conversation?.title || "Product Discovery conversation";
    const stateLabel = conversation?.latestPacketRevisionId
      ? "Packet revision is ready for authorized PDF download."
      : "Conversation is saved in the root-admin discovery history.";
    return {
      conversationId: conversation?.conversationId ?? null,
      title,
      summary: stateLabel,
      archived: !["active", "packet-ready"].includes(conversation?.state ?? "active"),
    };
  });
}

function applyHarnessChatConversation(conversation) {
  if (!conversation) {
    return;
  }

  rootAdminConversationPanelState.conversationId = conversation.conversationId ?? rootAdminConversationPanelState.conversationId;
  rootAdminConversationPanelState.latestPacketRevisionId =
    conversation.latestPacketRevisionId ?? rootAdminConversationPanelState.latestPacketRevisionId;
  rootAdminConversationPanelState.latestPacketState =
    conversation.latestPacketState ?? rootAdminConversationPanelState.latestPacketState;
  rootAdminConversationPanelState.messages = mapHarnessChatMessages(conversation.messages);
  rootAdminConversationPanelState.history = mapHarnessChatHistory(conversation);
  rootAdminConversationPanelState.editMessageIndex = null;
  rootAdminConversationPanelState.ref = rootAdminConversationPanelState.latestPacketState === "downloaded"
    ? "BWP-R-015"
    : rootAdminConversationPanelState.latestPacketRevisionId
      ? "BWP-R-005"
      : "BWP-R-004";
}

function addHarnessChatStatusMessage(text, { user = false } = {}) {
  rootAdminConversationPanelState.messages = [
    ...rootAdminConversationPanelState.messages,
    {
      author: user ? "Builder" : "Harness",
      text,
      user,
    },
  ];
}

function rootAdminConversationPanelMessagesForRender() {
  const messages = rootAdminConversationPanelState.messages.filter((message) =>
    !(message.author === "Harness" && String(message.text ?? "").startsWith("Context: ")),
  );
  return messages.length > 0 ? messages : [buildPanelGreetingMessage()];
}

async function submitHarnessChatMessage(text) {
  if (!rootAdminConversationPanelState.conversationId) {
    const conversation = await fetchJson("/v1/root-admin/harness-chat/conversations", {
      method: "POST",
      body: JSON.stringify({
        sourceChannel: "app",
        initialMessage: text,
        surfaceContext: buildPanelSurfaceContext(),
      }),
    });
    applyHarnessChatConversation(conversation);
    return;
  }

  const response = await fetchJson(
    `/v1/root-admin/harness-chat/conversations/${encodeURIComponent(rootAdminConversationPanelState.conversationId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        message: text,
        surfaceContext: buildPanelSurfaceContext(),
      }),
    },
  );
  applyHarnessChatConversation(response.conversation);
}

async function updateHarnessChatConversation({ conversationId, title, state: nextState, apply = true }) {
  const id = String(conversationId ?? rootAdminConversationPanelState.conversationId ?? "").trim();
  if (!id) {
    return;
  }
  const conversation = await fetchJson(
    `/v1/root-admin/harness-chat/conversations/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        ...(title ? { title } : {}),
        ...(nextState ? { state: nextState } : {}),
      }),
    },
  );
  if (apply) {
    applyHarnessChatConversation(conversation);
  }
  return conversation;
}

async function editHarnessChatMessage(index, text) {
  const message = rootAdminConversationPanelState.messages[index];
  const messageId = message?.messageId;
  if (!rootAdminConversationPanelState.conversationId || !messageId) {
    throw new ApiError(409, "HARNESS_CHAT_MESSAGE_REQUIRED", "Select a saved builder message to edit.");
  }

  const response = await fetchJson(
    `/v1/root-admin/harness-chat/conversations/${encodeURIComponent(rootAdminConversationPanelState.conversationId)}/messages/${encodeURIComponent(messageId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        message: text,
      }),
    },
  );
  applyHarnessChatConversation(response.conversation);
}

async function loadHarnessChatConversationHistory() {
  const response = await fetchJson("/v1/root-admin/harness-chat/conversations?page=1&pageSize=25", {
    method: "GET",
  });
  rootAdminConversationPanelState.history = mapHarnessChatHistoryItems(response?.items);
}

async function loadHarnessChatConversation(conversationId) {
  const id = String(conversationId ?? "").trim();
  if (!id) {
    return;
  }

  const conversation = await fetchJson(
    `/v1/root-admin/harness-chat/conversations/${encodeURIComponent(id)}?includeMessages=true`,
    { method: "GET" },
  );
  applyHarnessChatConversation(conversation);
}

async function ensureHarnessChatPacketRevision() {
  if (rootAdminConversationPanelState.latestPacketRevisionId) {
    return rootAdminConversationPanelState.latestPacketRevisionId;
  }

  if (!rootAdminConversationPanelState.conversationId) {
    throw new ApiError(409, "HARNESS_CHAT_CONVERSATION_REQUIRED", "Start a discovery conversation before downloading a packet.");
  }

  const response = await fetchJson(
    `/v1/root-admin/harness-chat/conversations/${encodeURIComponent(rootAdminConversationPanelState.conversationId)}/packet-generations`,
    {
      method: "POST",
      body: JSON.stringify({
        reason: "user-requested",
      }),
    },
  );
  applyHarnessChatConversation(response.conversation);
  rootAdminConversationPanelState.latestPacketRevisionId =
    response.packet?.packetRevisionId ?? rootAdminConversationPanelState.latestPacketRevisionId;
  return rootAdminConversationPanelState.latestPacketRevisionId;
}

async function fetchHarnessChatPacketPdf(packetRevisionId) {
  const response = await fetch(
    `/v1/root-admin/harness-chat/packet-revisions/${encodeURIComponent(packetRevisionId)}/pdf`,
    {
      headers: {
        accept: "application/pdf",
      },
    },
  );

  if (response.status === 401) {
    returnToLoginAfterSessionExpiry();
    throw new ApiError(response.status, "UNAUTHORIZED", "Your session has expired.");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await response.json() : null;
    throw new ApiError(
      response.status,
      body?.code ?? "REQUEST_FAILED",
      body?.message ?? "The packet PDF could not be downloaded.",
      body?.details,
    );
  }

  return response.blob();
}

function downloadHarnessChatPdf(blob, packetRevisionId) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `product-discovery-${packetRevisionId}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function mountRootAdminConversationPanel() {
  if (!(rootAdminConversationPanelMount instanceof HTMLElement)) {
    return;
  }

  rootAdminConversationPanelController?.destroy?.();
  const ref = {
    ...rootAdminConversationPanelRefForRender(),
    ...(rootAdminConversationPanelState.renameConversationId
      ? { renameConversationId: rootAdminConversationPanelState.renameConversationId }
      : {}),
    ...(rootAdminConversationPanelState.copyNotice
      ? { copyNotice: rootAdminConversationPanelState.copyNotice }
      : {}),
    historyView: rootAdminConversationPanelState.historyView,
    ...(Number.isInteger(rootAdminConversationPanelState.editMessageIndex)
      ? { editMessageIndex: rootAdminConversationPanelState.editMessageIndex }
      : {}),
  };
  renderConversationPanel(rootAdminConversationPanelMount, {
    ref,
    messages: rootAdminConversationPanelMessagesForRender(),
    history: rootAdminConversationPanelState.history,
    config: rootAdminBuildConversationPanelConfig(),
  });
  rootAdminConversationPanelController = createConversationPanelController(rootAdminConversationPanelMount, {
    ref,
    messages: rootAdminConversationPanelMessagesForRender(),
    history: rootAdminConversationPanelState.history,
    config: rootAdminBuildConversationPanelConfig(),
    handlers: {
      async onSendMessage({ value }) {
        const text = String(value ?? "").trim();
        if (!text) {
          return;
        }

        try {
          rootAdminConversationPanelState.ref = "BWP-R-004";
          addHarnessChatStatusMessage(text, { user: true });
          mountRootAdminConversationPanel();
          await submitHarnessChatMessage(text);
          clearShellMessage();
        } catch (error) {
          rootAdminConversationPanelState.ref = error instanceof ApiError && error.status === 403 ? "BWP-R-007" : "BWP-R-006";
          addHarnessChatStatusMessage(messageForError(error, "The harness could not capture that message."));
          setShellMessage(messageForError(error, "The harness could not capture that message."), "error");
        } finally {
          mountRootAdminConversationPanel();
        }
      },
      async onDownloadPacket() {
        try {
          rootAdminConversationPanelState.ref = "BWP-R-020";
          mountRootAdminConversationPanel();
          const packetRevisionId = await ensureHarnessChatPacketRevision();
          const pdf = await fetchHarnessChatPacketPdf(packetRevisionId);
          downloadHarnessChatPdf(pdf, packetRevisionId);
          rootAdminConversationPanelState.latestPacketState = "downloaded";
          rootAdminConversationPanelState.ref = "BWP-R-015";
          clearShellMessage();
        } catch (error) {
          rootAdminConversationPanelState.ref = error instanceof ApiError && error.status === 403 ? "BWP-R-007" : "BWP-R-006";
          setShellMessage(messageForError(error, "The packet PDF could not be downloaded."), "error");
        } finally {
          mountRootAdminConversationPanel();
        }
      },
      onToolAction() {},
      async onCopyMessage({ index }) {
        const text = rootAdminConversationPanelState.messages[index]?.text;
        if (!text) {
          return;
        }
        try {
          await navigator.clipboard?.writeText(text);
          rootAdminConversationPanelState.copyNotice = "Copied";
        } catch {
          rootAdminConversationPanelState.copyNotice = "Copy unavailable";
        }
        mountRootAdminConversationPanel();
        window.setTimeout(() => {
          rootAdminConversationPanelState.copyNotice = "";
          mountRootAdminConversationPanel();
        }, 1600);
      },
      onNewConversation() {
        rootAdminConversationPanelState.conversationId = null;
        rootAdminConversationPanelState.latestPacketRevisionId = null;
        rootAdminConversationPanelState.latestPacketState = null;
        rootAdminConversationPanelState.editMessageIndex = null;
        rootAdminConversationPanelState.renameConversationId = null;
        rootAdminConversationPanelState.copyNotice = "";
        rootAdminConversationPanelState.historyView = "active";
        rootAdminConversationPanelState.messages = [];
        rootAdminConversationPanelState.ref = "BWP-R-004";
        mountRootAdminConversationPanel();
      },
      onHistoryViewSelect({ view }) {
        rootAdminConversationPanelState.historyView = view === "archived" ? "archived" : "active";
        mountRootAdminConversationPanel();
      },
      async onHistorySelect({ conversationId }) {
        try {
          await loadHarnessChatConversation(conversationId);
          clearShellMessage();
        } catch (error) {
          setShellMessage(messageForError(error, "The selected chat could not be loaded."), "error");
        } finally {
          mountRootAdminConversationPanel();
        }
      },
      onEditMessage({ index }) {
        rootAdminConversationPanelState.editMessageIndex = index;
        rootAdminConversationPanelState.ref = "BWP-R-017";
        mountRootAdminConversationPanel();
      },
      async onSaveEdit({ index, value }) {
        const text = String(value ?? "").trim();
        if (!text) {
          return;
        }
        try {
          await editHarnessChatMessage(index, text);
          clearShellMessage();
        } catch (error) {
          setShellMessage(messageForError(error, "The message could not be edited."), "error");
        } finally {
          mountRootAdminConversationPanel();
        }
      },
      onCancelEdit() {
        rootAdminConversationPanelState.editMessageIndex = null;
        rootAdminConversationPanelState.ref = rootAdminConversationPanelState.latestPacketRevisionId ? "BWP-R-005" : "BWP-R-004";
        mountRootAdminConversationPanel();
      },
      onReplyToMessage() {
        rootAdminConversationPanelState.ref = "BWP-R-018";
        mountRootAdminConversationPanel();
      },
      onRenameConversation({ conversationId }) {
        rootAdminConversationPanelState.renameConversationId = conversationId;
        mountRootAdminConversationPanel();
      },
      async onSaveRenameConversation({ conversationId, title }) {
        const nextTitle = String(title ?? "").trim();
        if (!nextTitle) {
          rootAdminConversationPanelState.renameConversationId = null;
          mountRootAdminConversationPanel();
          return;
        }
        try {
          await updateHarnessChatConversation({ conversationId, title: nextTitle, apply: false });
          rootAdminConversationPanelState.renameConversationId = null;
          await loadHarnessChatConversationHistory();
          clearShellMessage();
        } catch (error) {
          setShellMessage(messageForError(error, "The chat name could not be updated."), "error");
        } finally {
          mountRootAdminConversationPanel();
        }
      },
      onCancelRenameConversation() {
        rootAdminConversationPanelState.renameConversationId = null;
        mountRootAdminConversationPanel();
      },
      async onArchiveConversation({ conversationId, index }) {
        const archived = rootAdminConversationPanelState.history[index]?.archived === true;
        const nextState = archived ? "active" : "closed";
        try {
          await updateHarnessChatConversation({ conversationId, state: nextState, apply: false });
          if (!archived && conversationId === rootAdminConversationPanelState.conversationId) {
            rootAdminConversationPanelState.conversationId = null;
            rootAdminConversationPanelState.latestPacketRevisionId = null;
            rootAdminConversationPanelState.latestPacketState = null;
            rootAdminConversationPanelState.messages = [];
          }
          await loadHarnessChatConversationHistory();
          clearShellMessage();
        } catch (error) {
          setShellMessage(messageForError(error, "The chat could not be archived."), "error");
        } finally {
          mountRootAdminConversationPanel();
        }
      },
    },
  });
}

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
    case "build-backlog":
    case "root-admin-build-backlog":
      return "list";
    default:
      return "grid";
  }
}

function contextNavHrefForItem(item) {
  if (isKnownRootAdminShellPage(item?.shellPageKey)) {
    return buildCanonicalRootAdminPath(item.shellPageKey);
  }

  return item?.resolvedFullRoutePath ?? buildCanonicalRootAdminPath(item?.shellPageKey);
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
    currentPathname === canonicalPath || (canonicalPath !== "/root-admin" && currentPathname.startsWith(`${canonicalPath}/`))
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
    getHref: contextNavHrefForItem,
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
  const reservedMobileSlots = isMobileContextNavLayout() && hierarchyTreeNavButton instanceof HTMLElement && !hierarchyTreeNavButton.classList.contains("hidden")
    ? 1
    : 0;
  const { visibleItems, overflowItems } = partitionContextNavItems(renderedContextNavItems, {
    isMobile: isMobileContextNavLayout(),
    currentItemKey: state.navigation.currentPage,
    maxVisibleItems: 4,
    reservedMobileSlots,
    getItemKey: (item) => item.shellPageKey,
  });

  contextNavMainItems.innerHTML = visibleItems
    ? renderSharedContextNavItems(visibleItems, {
      getHref: contextNavHrefForItem,
      getLabel: (item) => item.displayLabel,
      getCurrent: (item) => item.shellPageKey === state.navigation.currentPage,
      getItemKey: (item) => item.shellPageKey,
      getTooltip: (item) => item.displayLabel,
      getIconSvg: (item) => {
        const iconKey = decodePageSettingsIconKey(item.effectiveIconKey ?? item.iconKey ?? null, item.shellPageKey);
        return renderDesignSystemIconSvg(iconKey);
      },
    })
    : "";

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

function clearSessionExpiryTimer() {
  if (sessionExpiryTimerId !== null) {
    window.clearTimeout(sessionExpiryTimerId);
    sessionExpiryTimerId = null;
  }
}

function resetAuthenticatedShellForLogin({ authMessage = "" } = {}) {
  clearSessionExpiryTimer();
  window.history.replaceState(null, "", buildCanonicalRootAdminPath("overview"));
  Object.assign(state, resetToLoginState(state));
  state.authMessage = authMessage;
  clearShellMessage();
  rootAdminDirectoryController.reset();
  webAppHierarchyPageController.reset();
  buildBacklogPageController.reset();
  setTopNavLinkCollections(buildFallbackTopNavItems());
  renderContextNavItems([]);
  render();
}

function returnToLoginAfterSessionExpiry() {
  resetAuthenticatedShellForLogin({
    authMessage: "Your session has expired. Please sign in again.",
  });
}

function scheduleSessionExpiryLogout(session) {
  clearSessionExpiryTimer();

  const expiresAtMs = Date.parse(session?.expiresAt ?? "");
  if (!Number.isFinite(expiresAtMs)) {
    return;
  }

  const msUntilExpiry = Math.min(
    Math.max(0, expiresAtMs - Date.now()),
    maxBrowserTimeoutMs,
  );
  sessionExpiryTimerId = window.setTimeout(returnToLoginAfterSessionExpiry, msUntilExpiry);
}

async function fetchJson(path, options = {}) {
  const { markUnauthorizedAsSessionExpired = true, ...fetchOptions } = options;
  const response = await fetch(path, {
    headers: {
      accept: "application/json",
      ...(fetchOptions.body ? { "content-type": "application/json" } : {}),
      ...(fetchOptions.headers ?? {}),
    },
    ...fetchOptions,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (response.status === 401 && markUnauthorizedAsSessionExpired) {
    returnToLoginAfterSessionExpiry();
    throw new ApiError(response.status, body?.code ?? "UNAUTHORIZED", body?.message ?? "Your session has expired.");
  }

  if (response.status === 401) {
    throw new ApiError(response.status, body?.code ?? "UNAUTHORIZED", body?.message ?? "The request was not authorized.");
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

async function uploadFileBytes(path, file, options = {}) {
  const { markUnauthorizedAsSessionExpired = true } = options;
  const response = await fetch(path, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": file.type,
    },
    body: file,
  });
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : null;
  const fallbackMessage = response.status === 404
    ? "The profile-picture upload route is not available. Restart the app server and try again."
    : `The selected file could not be uploaded. (${response.status})`;

  if (response.status === 401 && markUnauthorizedAsSessionExpired) {
    returnToLoginAfterSessionExpiry();
    throw new ApiError(response.status, body?.code ?? "UNAUTHORIZED", body?.message ?? "Your session has expired.");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.code ?? "REQUEST_FAILED",
      body?.message ?? fallbackMessage,
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
  const breadcrumbChain = Array.isArray(meta.breadcrumbChain)
    ? meta.breadcrumbChain
    : isOverview
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
  rootAdminLoginTemplateController?.setVariant(flags.showSshStage ? "ssh-challenge" : "password");

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
    rootAdminDirectoryController.syncPageState();
    webAppHierarchyPageController.syncPageState();
    buildBacklogPageController.syncPageState();
    mountRootAdminConversationPanel();
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
  rootAdminLoginTemplateController?.renderSshKeyChoices(keys);
}

function selectedSshKeyFingerprint() {
  const selectedKey = sshKeyChoiceList?.querySelector('input[name="sshKeyFingerprint"]:checked');
  if (selectedKey instanceof HTMLInputElement) {
    return selectedKey.value;
  }
  return "";
}

async function bootstrapSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    state.phase = "authenticated";
    state.navigation.currentPage = resolvePageFromLocation();
    syncBrowserLocationForPage(state.navigation.currentPage, "replace");
    scheduleSessionExpiryLogout(session);
    render();
    await refreshTopNav();
    await refreshContextNavForCurrentPage();
    try {
      await loadHarnessChatConversationHistory();
    } catch (error) {
      setShellMessage(messageForError(error, "The chat history could not be loaded."), "error");
    }
    mountRootAdminConversationPanel();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      resetAuthenticatedShellForLogin();
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
      markUnauthorizedAsSessionExpired: false,
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
      selectedSshKeyFingerprint(),
    );
    await fetchJson("/v1/root-auth/browser/login/ssh", {
      method: "POST",
      markUnauthorizedAsSessionExpired: false,
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

  resetAuthenticatedShellForLogin();
}

async function handleRefreshSession() {
  try {
    const session = await fetchJson("/v1/root-auth/browser/session", { method: "GET" });
    state.session = session;
    scheduleSessionExpiryLogout(session);
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
  const handledByDirectory = await rootAdminDirectoryController.handleShellSearchSubmit(query);
  if (handledByDirectory) {
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
    if (page && isKnownRootAdminShellPage(page)) {
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
