import { renderRootAdminContextNavShell } from "./contextNav.mjs";
import {
  buildPageShellBreadcrumbMarkup,
  createPageShellBreadcrumbController,
  createPageShellChromeController,
  createPageShellLanguageController,
  createPageShellTooltipController,
} from "./pageShellController.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPageSections(pages = []) {
  return pages.map((page) => {
    const sectionId = page.sectionId ?? `page-${page.key}`;
    const classNames = [
      page.className ?? "",
      page.initiallyVisible ? "" : "hidden",
    ].filter(Boolean).join(" ");
    return `<section id="${escapeHtml(sectionId)}" class="${escapeHtml(classNames)}">${page.html ?? ""}</section>`;
  }).join("\n");
}

function renderPrimaryNavItems(items = [], currentPageKey) {
  return items.map((item) => {
    const active = item.key === currentPageKey;
    return `
      <a
        class="nav-link ${active ? "active" : ""}"
        href="${escapeHtml(item.href)}"
        data-page-link="${escapeHtml(item.key)}"
        ${active ? 'aria-current="page"' : ""}
        title="${escapeHtml(item.title ?? item.label)}"
      >
        ${escapeHtml(item.label)}
      </a>
    `;
  }).join("");
}

function renderMobileNavItems(items = [], currentPageKey) {
  return items.map((item) => {
    const active = item.key === currentPageKey;
    return `
      <a
        class="nav-link ${active ? "active" : ""}"
        href="${escapeHtml(item.href)}"
        data-page-link="${escapeHtml(item.key)}"
        ${active ? 'aria-current="page"' : ""}
        title="${escapeHtml(item.title ?? item.label)}"
      >
        ${escapeHtml(item.label)}
      </a>
    `;
  }).join("");
}

export function renderAppShell({
  appLabel = "Application",
  brand = {},
  currentPageKey = "overview",
  nav = {},
  profile = {},
  breadcrumbs = [],
  search = {},
  contextNav = {},
  displaySettings = {},
  slots = {},
  pages = [],
} = {}) {
  const primaryNavItems = nav.primary ?? [];
  const mobileNavItems = nav.mobile === "same-as-primary" ? primaryNavItems : (nav.mobile ?? primaryNavItems);
  const breadcrumbItems = breadcrumbs.length > 0 ? breadcrumbs : [{ href: brand.href ?? "/", label: appLabel }];
  const contextNavMarkup = contextNav.enabled === false ? "" : renderRootAdminContextNavShell();
  const searchEnabled = search.enabled !== false;
  const displaySettingsEnabled = displaySettings.enabled !== false;
  const profileLabel = profile.label ?? "Profile";
  const profileInitials = profile.initials ?? "U";

  return `
    <header class="top-nav">
      <a class="brand-lockup" href="${escapeHtml(brand.href ?? "/")}" aria-label="${escapeHtml(brand.ariaLabel ?? `${brand.label ?? appLabel} home`)}">
        <span class="brand-mark" aria-hidden="true">${escapeHtml(brand.mark ?? "K")}</span>
        <span class="brand-copy">
          <strong id="brand-label" title="${escapeHtml(brand.label ?? appLabel)}">${escapeHtml(brand.label ?? appLabel)}</strong>
        </span>
      </a>

      <nav class="primary-nav" aria-label="${escapeHtml(nav.ariaLabel ?? `${appLabel} primary`)}">
        <div id="primary-nav-links" class="primary-nav-links">
          ${renderPrimaryNavItems(primaryNavItems, currentPageKey)}
        </div>
        <div id="primary-nav-overflow" class="primary-nav-overflow hidden">
          <button
            id="primary-nav-overflow-button"
            class="nav-link primary-nav-overflow-button"
            type="button"
            aria-expanded="false"
            aria-controls="primary-nav-overflow-menu"
          >
            More
          </button>
          <div
            id="primary-nav-overflow-menu"
            class="primary-nav-overflow-menu hidden"
            role="menu"
            aria-labelledby="primary-nav-overflow-button"
          ></div>
        </div>
      </nav>

      <button
        id="mobile-nav-button"
        class="mobile-nav-button"
        type="button"
        aria-expanded="false"
        aria-controls="mobile-nav-menu"
        aria-label="${escapeHtml(nav.mobileButtonLabel ?? `Open ${appLabel} navigation`)}"
      >
        <span class="burger-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div class="nav-utilities">
        <button
          id="profile-menu-button"
          class="profile-button"
          type="button"
          aria-expanded="false"
          aria-controls="profile-menu"
          title="${escapeHtml(profile.title ?? "Profile")}"
        >
          <span id="profile-avatar" class="profile-avatar" aria-hidden="true">${escapeHtml(profileInitials)}</span>
          <span class="profile-meta">
            <strong id="profile-label" title="${escapeHtml(profileLabel)}">${escapeHtml(profileLabel)}</strong>
          </span>
        </button>

        <div
          id="profile-menu"
          class="profile-menu hidden"
          role="menu"
          aria-labelledby="profile-menu-button"
        >
          <a
            id="profile-session-link"
            class="menu-item"
            href="${escapeHtml(brand.href ?? "/")}"
            data-page-link="overview"
            role="menuitem"
            title="My Session"
          >
            My Session
          </a>
          <button
            id="profile-language-button"
            class="menu-item menu-item-button"
            type="button"
            role="menuitem"
            title="Language"
          >
            Language
          </button>
          <button
            id="profile-logout-button"
            class="menu-item menu-item-button"
            type="button"
            role="menuitem"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <nav id="mobile-nav-menu" class="mobile-nav-menu hidden" aria-label="${escapeHtml(nav.mobileAriaLabel ?? `Mobile ${appLabel} primary`)}">
      ${renderMobileNavItems(mobileNavItems, currentPageKey)}
      <div class="mobile-profile-group">
        <button
          id="mobile-profile-button"
          class="mobile-profile-item"
          type="button"
          aria-expanded="false"
          aria-controls="mobile-profile-menu"
        >
          Profile
        </button>
        <div id="mobile-profile-menu" class="mobile-profile-menu hidden">
          <a class="mobile-subnav-link" href="${escapeHtml(brand.href ?? "/")}" data-page-link="overview" title="My Session">
            My Session
          </a>
          <button
            id="mobile-language-button"
            class="mobile-subnav-link mobile-subnav-button"
            type="button"
            title="Language"
          >
            Language
          </button>
          <button
            id="mobile-logout-button"
            class="mobile-subnav-link mobile-subnav-button"
            type="button"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>

    <section class="sub-nav" aria-label="${escapeHtml(nav.pageChromeLabel ?? `${appLabel} page chrome`)}">
      <nav class="breadcrumb-nav" aria-label="Current page breadcrumb">
        ${buildPageShellBreadcrumbMarkup(breadcrumbItems)}
      </nav>

      ${searchEnabled ? `
        <form id="shell-search-form" class="search-shell" role="search">
          <label class="search-shell-field">
            <input
              id="shell-search-input"
              class="search-input"
              type="search"
              name="${escapeHtml(search.name ?? "q")}"
              placeholder="${escapeHtml(search.placeholder ?? "Search")}"
              autocomplete="off"
            />
            <span class="search-submit-hint" aria-hidden="true">
              <span class="search-submit-hint-copy">Press</span>
              <span class="search-submit-hint-key">Enter</span>
            </span>
          </label>
        </form>
      ` : ""}
    </section>

    <div id="root-admin-context-nav-mount">${contextNavMarkup}</div>

    ${slots.conversationPanel === false ? "" : '<div id="root-admin-conversation-panel-mount" class="conversation-panel-shell-mount"></div>'}

    ${displaySettingsEnabled ? `
      <aside
        id="display-settings-drawer"
        class="side-panel display-settings-drawer hidden"
        aria-labelledby="display-settings-title"
        aria-hidden="true"
      >
        <div class="side-panel-header">
          <div>
            <p id="display-settings-eyebrow" class="drawer-eyebrow">Display</p>
            <h2 id="display-settings-title">Display Settings</h2>
          </div>
          <button
            id="display-settings-close"
            class="icon-button"
            type="button"
            aria-label="Close display settings"
          >
            <span class="icon-button-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M6 6 18 18M18 6 6 18" />
              </svg>
            </span>
          </button>
        </div>

        <div class="accessibility-group">
          <p id="display-settings-theme-label" class="accessibility-label">Theme</p>
          <div class="chip-row" role="group" aria-labelledby="display-settings-theme-label">
            <button class="accessibility-chip active" type="button" data-theme-option="normal" aria-pressed="true">
              Normal
            </button>
            <button class="accessibility-chip" type="button" data-theme-option="dark" aria-pressed="false">
              Dark
            </button>
            <button class="accessibility-chip" type="button" data-theme-option="desert" aria-pressed="false">
              Desert
            </button>
          </div>
        </div>

        <div class="accessibility-group">
          <p id="display-settings-magnification-label" class="accessibility-label">Magnification</p>
          <div class="chip-row chip-row-single-line" role="group" aria-labelledby="display-settings-magnification-label">
            <button class="accessibility-chip" type="button" data-magnification-option="-100" aria-pressed="false">
              -100%
            </button>
            <button class="accessibility-chip" type="button" data-magnification-option="-50" aria-pressed="false">
              -50%
            </button>
            <button class="accessibility-chip active" type="button" data-magnification-option="0" aria-pressed="true">
              0%
            </button>
            <button class="accessibility-chip" type="button" data-magnification-option="50" aria-pressed="false">
              +50%
            </button>
            <button class="accessibility-chip" type="button" data-magnification-option="100" aria-pressed="false">
              +100%
            </button>
          </div>
        </div>
      </aside>
    ` : ""}

    <main id="root-admin-main" class="design-system-page-main">
      ${slots.shellMessage === false ? "" : '<div id="shell-message" class="page-shell-banner-demo hidden" aria-label="Root-admin shell feedback"></div>'}
      ${renderPageSections(pages)}
    </main>

    ${slots.languageModal === false ? "" : `
      <div id="language-modal" class="language-modal hidden" aria-hidden="true">
        <div id="language-modal-backdrop" class="language-modal-backdrop"></div>
        <div class="language-modal-panel" role="dialog" aria-modal="true" aria-labelledby="language-modal-title">
          <div class="language-modal-header">
            <div>
              <p class="language-modal-eyebrow">Preferences</p>
              <h2 id="language-modal-title">Choose a language</h2>
              <p class="language-modal-copy">
                This POC keeps language selection inside the lightweight profile-menu flow while deferring persistence.
              </p>
            </div>
            <button
              id="language-modal-close"
              class="mobile-nav-button"
              type="button"
              aria-label="Close language selector"
            >
              Close
            </button>
          </div>
          <div id="language-option-list" class="language-option-list" role="listbox" aria-label="Available languages"></div>
        </div>
      </div>
    `}
  `;
}

export function createAppShellController({
  root,
  displaySettingsCopy,
  getActiveLanguageCode,
  languageOptions,
  setActiveLanguageCode,
  onShellGeometryChange = () => {},
} = {}) {
  const scope = root instanceof HTMLElement ? root : document;
  const get = (selector) => scope.querySelector(selector);
  const byId = (id) => scope.querySelector(`#${id}`);

  const elements = {
    topNav: get(".top-nav"),
    primaryNav: get(".primary-nav"),
    primaryNavOverflow: byId("primary-nav-overflow"),
    primaryNavOverflowButton: byId("primary-nav-overflow-button"),
    primaryNavOverflowMenu: byId("primary-nav-overflow-menu"),
    primaryNavLinks: Array.from(scope.querySelectorAll("#primary-nav-links .nav-link")),
    mobileNavButton: byId("mobile-nav-button"),
    mobileNavMenu: byId("mobile-nav-menu"),
    mobileNavLinks: Array.from(scope.querySelectorAll("#mobile-nav-menu > .nav-link")),
    contextNavMainItems: get(".context-nav-main"),
    profileButton: byId("profile-menu-button"),
    profileMenu: byId("profile-menu"),
    profileLabel: byId("profile-label"),
    profileAvatar: byId("profile-avatar"),
    navUtilities: get(".nav-utilities"),
    mobileProfileButton: byId("mobile-profile-button"),
    mobileProfileMenu: byId("mobile-profile-menu"),
    profileSessionLink: byId("profile-session-link"),
    profileLanguageButton: byId("profile-language-button"),
    profileLogoutButton: byId("profile-logout-button"),
    mobileLanguageButton: byId("mobile-language-button"),
    mobileLogoutButton: byId("mobile-logout-button"),
    breadcrumbNav: get(".breadcrumb-nav"),
    breadcrumbHomeItem: byId("breadcrumb-home-item"),
    breadcrumbHomeLink: byId("breadcrumb-home-link"),
    breadcrumbCompact: byId("breadcrumb-compact"),
    breadcrumbCompactButton: byId("breadcrumb-compact-button"),
    breadcrumbCompactMenu: byId("breadcrumb-compact-menu"),
    breadcrumbCollapseButton: byId("breadcrumb-collapse-button"),
    breadcrumbCollapseMenu: byId("breadcrumb-collapse-menu"),
    breadcrumbCollapsedItem: byId("breadcrumb-collapsed-item"),
    breadcrumbSeparatorBeforeCollapsed: byId("breadcrumb-separator-before-collapsed"),
    breadcrumbPageMinusOneItem: byId("breadcrumb-page-minus-one-item"),
    breadcrumbSeparatorBeforePageMinusOne: byId("breadcrumb-separator-before-page-minus-one"),
    breadcrumbPageMinusOneLink: byId("breadcrumb-page-minus-one-link"),
    breadcrumbCurrentItem: byId("breadcrumb-current-item"),
    breadcrumbCurrentLabel: byId("breadcrumb-current-label"),
    shellSearchForm: byId("shell-search-form"),
    shellSearchInput: byId("shell-search-input"),
    shellSubNav: get(".sub-nav"),
    hierarchyTreeNavButton: byId("hierarchy-tree-nav-button"),
    displaySettingsButton: byId("display-settings-button"),
    displaySettingsLabel: byId("display-settings-label"),
    contextNavMoreButton: byId("context-nav-more-button"),
    contextNavMoreMenu: byId("context-nav-more-menu"),
    contextNavMoreLinks: byId("context-nav-more-links"),
    contextNavMoreDisplaySettingsButton: byId("context-nav-more-display-settings"),
    displaySettingsDrawer: byId("display-settings-drawer"),
    displaySettingsEyebrow: byId("display-settings-eyebrow"),
    displaySettingsTitle: byId("display-settings-title"),
    displaySettingsCloseButton: byId("display-settings-close"),
    displaySettingsThemeLabel: byId("display-settings-theme-label"),
    displaySettingsMagnificationLabel: byId("display-settings-magnification-label"),
    themeButtons: Array.from(scope.querySelectorAll("[data-theme-option]")),
    magnificationButtons: Array.from(scope.querySelectorAll("[data-magnification-option]")),
    languageModal: byId("language-modal"),
    languageModalBackdrop: byId("language-modal-backdrop"),
    languageModalCloseButton: byId("language-modal-close"),
    languageOptionList: byId("language-option-list"),
    brandLabel: byId("brand-label"),
    main: byId("root-admin-main"),
    shellMessage: byId("shell-message"),
    contextNavMount: byId("root-admin-context-nav-mount"),
    conversationPanelMount: byId("root-admin-conversation-panel-mount"),
  };

  const shellChromeController = createPageShellChromeController({
    topNav: elements.topNav,
    primaryNav: elements.primaryNav,
    primaryNavOverflow: elements.primaryNavOverflow,
    primaryNavOverflowButton: elements.primaryNavOverflowButton,
    primaryNavOverflowMenu: elements.primaryNavOverflowMenu,
    primaryNavLinks: elements.primaryNavLinks,
    mobileNavButton: elements.mobileNavButton,
    mobileNavMenu: elements.mobileNavMenu,
    profileButton: elements.profileButton,
    profileMenu: elements.profileMenu,
    navUtilities: elements.navUtilities,
    mobileProfileButton: elements.mobileProfileButton,
    mobileProfileMenu: elements.mobileProfileMenu,
    contextNavMoreButton: elements.contextNavMoreButton,
    contextNavMoreMenu: elements.contextNavMoreMenu,
    displaySettingsDrawer: elements.displaySettingsDrawer,
    displaySettingsButton: elements.displaySettingsButton,
    displaySettingsCloseButton: elements.displaySettingsCloseButton,
    displaySettingsPersistentRegions: [
      byId("hierarchy-tree-drawer"),
      byId("hierarchy-tree-drawer-scrim"),
      byId("hierarchy-tree-nav-button"),
    ],
    shellSubNav: elements.shellSubNav,
    contextNav: get(".context-nav"),
  });

  const shellBreadcrumbController = createPageShellBreadcrumbController({
    row: elements.shellSubNav,
    breadcrumbNav: elements.breadcrumbNav,
    breadcrumbList: byId("breadcrumb-list"),
    breadcrumbHomeLink: elements.breadcrumbHomeLink,
    breadcrumbCompact: elements.breadcrumbCompact,
    breadcrumbCompactButton: elements.breadcrumbCompactButton,
    breadcrumbCompactMenu: elements.breadcrumbCompactMenu,
    breadcrumbCollapseButton: elements.breadcrumbCollapseButton,
    breadcrumbCollapseMenu: elements.breadcrumbCollapseMenu,
    breadcrumbCollapsedItem: elements.breadcrumbCollapsedItem,
    breadcrumbSeparatorBeforeCollapsed: elements.breadcrumbSeparatorBeforeCollapsed,
    breadcrumbPageMinusOneItem: elements.breadcrumbPageMinusOneItem,
    breadcrumbSeparatorBeforePageMinusOne: elements.breadcrumbSeparatorBeforePageMinusOne,
    breadcrumbPageMinusOneLink: elements.breadcrumbPageMinusOneLink,
    breadcrumbCurrentItem: elements.breadcrumbCurrentItem,
    breadcrumbCurrentLabel: elements.breadcrumbCurrentLabel,
  });

  const shellLanguageController = createPageShellLanguageController({
    displaySettingsButton: elements.displaySettingsButton,
    displaySettingsCloseButton: elements.displaySettingsCloseButton,
    displaySettingsCopy,
    displaySettingsEyebrow: elements.displaySettingsEyebrow,
    displaySettingsLabel: elements.displaySettingsLabel,
    displaySettingsMagnificationLabel: elements.displaySettingsMagnificationLabel,
    displaySettingsThemeLabel: elements.displaySettingsThemeLabel,
    displaySettingsTitle: elements.displaySettingsTitle,
    contextNavMoreButton: elements.contextNavMoreButton,
    contextNavMoreDisplaySettingsButton: elements.contextNavMoreDisplaySettingsButton,
    getActiveLanguageCode,
    languageModal: elements.languageModal,
    languageModalCloseButton: elements.languageModalCloseButton,
    languageOptionList: elements.languageOptionList,
    languageOptions,
    magnificationButtons: elements.magnificationButtons,
    mobileLanguageButton: elements.mobileLanguageButton,
    onShellGeometryChange: () => {
      shellChromeController.updatePrimaryNavOverflow();
      shellBreadcrumbController.scheduleBreadcrumbPresentation();
      shellChromeController.scheduleContextNavOffsetUpdate();
      onShellGeometryChange();
    },
    profileLanguageButton: elements.profileLanguageButton,
    setActiveLanguageCode,
    themeButtons: elements.themeButtons,
  });

  const shellTooltipController = createPageShellTooltipController();

  return {
    elements,
    chrome: shellChromeController,
    breadcrumbs: shellBreadcrumbController,
    language: shellLanguageController,
    tooltip: shellTooltipController,
    destroy() {},
  };
}
