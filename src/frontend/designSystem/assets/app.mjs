const profileButton = document.getElementById("profile-menu-button");
const profileMenu = document.getElementById("profile-menu");
const profileLanguageButton = document.getElementById("profile-language-button");
const closeProfileMenuButton = document.getElementById("close-profile-menu");
const brandLockup = document.querySelector(".brand-lockup");
const primaryNav = document.querySelector(".primary-nav");
const primaryNavLinksContainer = document.getElementById("primary-nav-links");
const primaryNavLinks = Array.from(primaryNavLinksContainer?.querySelectorAll(".nav-link") ?? []);
const primaryNavOverflow = document.getElementById("primary-nav-overflow");
const primaryNavOverflowButton = document.getElementById("primary-nav-overflow-button");
const primaryNavOverflowMenu = document.getElementById("primary-nav-overflow-menu");
const navUtilities = document.querySelector(".nav-utilities");
const mobileNavButton = document.getElementById("mobile-nav-button");
const mobileNavMenu = document.getElementById("mobile-nav-menu");
const mobileNavLinks = Array.from(mobileNavMenu?.querySelectorAll(".nav-link") ?? []);
const mobileProfileButton = document.getElementById("mobile-profile-button");
const mobileProfileMenu = document.getElementById("mobile-profile-menu");
const mobileLanguageButton = document.getElementById("mobile-language-button");
const breadcrumbNav = document.querySelector(".breadcrumb-nav");
const breadcrumbList = document.getElementById("breadcrumb-list");
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
const filterPanelButton = document.getElementById("filter-panel-button");
const filterPanel = document.getElementById("filter-panel");
const filterPanelCloseButton = document.getElementById("filter-panel-close");
const filterMenuButtons = Array.from(document.querySelectorAll("[data-filter-target]"));
const filterOptionsPanel = document.getElementById("filter-options-panel");
const filterOptionsTitle = document.getElementById("filter-options-title");
const filterOptionsCloseButton = document.getElementById("filter-options-close");
const filterOptionsSearch = document.getElementById("filter-options-search");
const filterOptionsList = document.getElementById("filter-options-list");
const accessibilityButton = document.getElementById("accessibility-button");
const accessibilityDrawer = document.getElementById("accessibility-drawer");
const accessibilityCloseButton = document.getElementById("accessibility-close");
const displaySettingsCopyNodes = Array.from(document.querySelectorAll("[data-display-settings-copy]"));
const displaySettingsAriaLabelNodes = Array.from(document.querySelectorAll("[data-display-settings-aria-label]"));
const contextNavMoreButton = document.getElementById("context-nav-more-button");
const contextNavMoreMenu = document.getElementById("context-nav-more-menu");
const contextNavMoreFilterButton = document.getElementById("context-nav-more-filter");
const contextNavMoreAccessibilityButton = document.getElementById("context-nav-more-accessibility");
const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
const directionButtons = Array.from(document.querySelectorAll("[data-direction-option]"));
const accentButtons = Array.from(document.querySelectorAll("[data-accent]"));
const magnificationButtons = Array.from(document.querySelectorAll("[data-magnification-option]"));
const topNav = document.querySelector(".top-nav");
const subNav = document.querySelector(".sub-nav");
const designSystemShell = document.querySelector(".design-system-shell");
const shellTopNav = document.querySelector(".design-system-shell > .top-nav");
const shellSubNav = document.querySelector(".design-system-shell > .sub-nav");
const languageModal = document.getElementById("language-modal");
const languageModalBackdrop = document.getElementById("language-modal-backdrop");
const languageModalCloseButton = document.getElementById("language-modal-close");
const languageOptionList = document.getElementById("language-option-list");
const previewFrame = document.getElementById("top-nav-preview-frame");
const topNavPreviewCanvas = previewFrame?.querySelector(".top-nav-preview-canvas");
const topNavCanonicalRenderLayout = previewFrame?.closest(".canonical-render-layout");
const previewWidthInput = document.getElementById("top-nav-preview-width");
const previewWidthReadout = document.getElementById("top-nav-preview-width-readout");
const previewWidthPresetButtons = Array.from(document.querySelectorAll("[data-preview-width-preset]"));
const previewFixtureButtons = Array.from(document.querySelectorAll("[data-preview-fixture]"));
const previewOpenStateButtons = Array.from(document.querySelectorAll("[data-preview-open-state]"));
const previewBrandLabel = document.getElementById("preview-brand-label");
const previewProfileLabel = document.getElementById("preview-profile-label");
const previewTopNav = previewFrame?.querySelector(".top-nav") ?? topNav;
const previewPrimaryNav = previewFrame?.querySelector(".primary-nav") ?? primaryNav;
const previewNavUtilities = previewFrame?.querySelector(".nav-utilities") ?? navUtilities;
const topNavCanonicalMatchList = document.getElementById("top-nav-canonical-match-list");
const topNavCanonicalCircumstances = document.getElementById("top-nav-canonical-circumstances");
const topNavCanonicalCurrent = document.getElementById("top-nav-canonical-current");
const topNavCanonicalPrev = document.getElementById("top-nav-canonical-prev");
const topNavCanonicalNext = document.getElementById("top-nav-canonical-next");
const subNavPreviewFrame = document.getElementById("sub-nav-preview-frame");
const subNavPreviewShell = document.getElementById("sub-nav-preview-shell");
const subNavPreviewSummary = document.getElementById("sub-nav-preview-summary");
const subNavPreviewWidthInput = document.getElementById("sub-nav-preview-width");
const subNavPreviewWidthReadout = document.getElementById("sub-nav-preview-width-readout");
const subNavPreviewWidthPresetButtons = Array.from(document.querySelectorAll("[data-sub-nav-width-preset]"));
const subNavPreviewStateButtons = Array.from(document.querySelectorAll("[data-sub-nav-state]"));
const subNavPreviewSearchStateButtons = Array.from(document.querySelectorAll("[data-sub-nav-search-state]"));
const subNavPreviewLocaleButtons = Array.from(document.querySelectorAll("[data-sub-nav-locale]"));
const subNavPreviewBreadcrumbNav = document.getElementById("sub-nav-preview-breadcrumb-nav");
const subNavPreviewBreadcrumbList = document.getElementById("sub-nav-preview-breadcrumb-list");
const subNavPreviewBreadcrumbCompact = document.getElementById("sub-nav-preview-breadcrumb-compact");
const subNavPreviewBreadcrumbCompactButton = document.getElementById("sub-nav-preview-breadcrumb-compact-button");
const subNavPreviewBreadcrumbCompactMenu = document.getElementById("sub-nav-preview-breadcrumb-compact-menu");
const subNavPreviewCollapsedItem = document.getElementById("sub-nav-preview-collapsed-item");
const subNavPreviewBreadcrumbCollapseButton = document.getElementById("sub-nav-preview-breadcrumb-collapse-button");
const subNavPreviewBreadcrumbCollapseMenu = document.getElementById("sub-nav-preview-breadcrumb-collapse-menu");
const subNavPreviewSeparatorBeforeCollapsed = document.getElementById("sub-nav-preview-separator-before-collapsed");
const subNavPreviewPageMinusOneItem = document.getElementById("sub-nav-preview-page-minus-one-item");
const subNavPreviewSeparatorBeforePageMinusOne = document.getElementById("sub-nav-preview-separator-before-page-minus-one");
const subNavPreviewHomeLink = document.getElementById("sub-nav-preview-home-link");
const subNavPreviewPageMinusOneLink = document.getElementById("sub-nav-preview-page-minus-one-link");
const subNavPreviewCurrentLabel = document.getElementById("sub-nav-preview-current-label");
const subNavPreviewMiddleALink = document.getElementById("sub-nav-preview-middle-a-link");
const subNavPreviewMiddleBLink = document.getElementById("sub-nav-preview-middle-b-link");
const subNavPreviewCompactHome = document.getElementById("sub-nav-preview-compact-home");
const subNavPreviewCompactMiddleA = document.getElementById("sub-nav-preview-compact-middle-a");
const subNavPreviewCompactMiddleB = document.getElementById("sub-nav-preview-compact-middle-b");
const subNavPreviewCompactPageMinusOne = document.getElementById("sub-nav-preview-compact-page-minus-one");
const subNavPreviewCompactCurrent = document.getElementById("sub-nav-preview-compact-current");
const subNavPreviewSearchInput = document.getElementById("sub-nav-preview-search-input");
const subNavCanonicalRenderLayout = subNavPreviewFrame?.closest(".canonical-render-layout");
const contextNavPreviewFrame = document.getElementById("context-nav-preview-frame");
const contextNavCanonicalRenderLayout = contextNavPreviewFrame?.closest(".canonical-render-layout");
const contextNavPreviewShell = document.getElementById("context-nav-preview-shell");
const contextNavPreviewContent = document.querySelector(".context-nav-preview-content");
const contextNavPreviewSummary = document.getElementById("context-nav-preview-summary");
const contextNavPreviewWidthInput = document.getElementById("context-nav-preview-width");
const contextNavPreviewHeightInput = document.getElementById("context-nav-preview-height");
const contextNavPreviewWidthPresetButtons = Array.from(document.querySelectorAll("[data-context-nav-width-preset]"));
const contextNavPreviewHeightPresetButtons = Array.from(document.querySelectorAll("[data-context-nav-height-preset]"));
const contextNavPreviewStackButtons = Array.from(document.querySelectorAll("[data-context-nav-stack]"));
const contextNavPreviewLabelButtons = Array.from(document.querySelectorAll("[data-context-nav-labels]"));
const contextNavPreviewOpenButtons = Array.from(document.querySelectorAll("[data-context-nav-open]"));
const contextNavPreviewMainItems = document.getElementById("context-nav-preview-main-items");
const contextNavPreviewMeta = document.getElementById("context-nav-preview-meta");
const contextNavShellTopNav = document.getElementById("context-nav-shell-top-nav");
const contextNavShellPrimaryNav = document.getElementById("context-nav-shell-primary-nav");
const contextNavShellPrimaryNavLinksContainer = document.getElementById("context-nav-shell-primary-nav-links");
const contextNavShellPrimaryNavLinks = Array.from(contextNavShellPrimaryNavLinksContainer?.querySelectorAll(".nav-link") ?? []);
const contextNavShellPrimaryNavOverflow = document.getElementById("context-nav-shell-primary-nav-overflow");
const contextNavShellPrimaryNavOverflowButton = document.getElementById("context-nav-shell-primary-nav-overflow-button");
const contextNavShellPrimaryNavOverflowMenu = document.getElementById("context-nav-shell-primary-nav-overflow-menu");
const contextNavShellMobileNavButton = document.getElementById("context-nav-shell-mobile-nav-button");
const contextNavShellMobileNavMenu = document.getElementById("context-nav-shell-mobile-nav-menu");
const contextNavShellNavUtilities = document.getElementById("context-nav-shell-nav-utilities");
const contextNavPreviewBreadcrumbNav = document.getElementById("context-nav-preview-breadcrumb-nav");
const contextNavPreviewBreadcrumbList = document.getElementById("context-nav-preview-breadcrumb-list");
const contextNavPreviewBreadcrumbCompact = document.getElementById("context-nav-preview-breadcrumb-compact");
const contextNavPreviewBreadcrumbCompactButton = document.getElementById("context-nav-preview-breadcrumb-compact-button");
const contextNavPreviewBreadcrumbCompactMenu = document.getElementById("context-nav-preview-breadcrumb-compact-menu");
const contextNavPreviewCollapsedItem = document.getElementById("context-nav-preview-collapsed-item");
const contextNavPreviewBreadcrumbCollapseButton = document.getElementById("context-nav-preview-breadcrumb-collapse-button");
const contextNavPreviewBreadcrumbCollapseMenu = document.getElementById("context-nav-preview-breadcrumb-collapse-menu");
const contextNavPreviewSeparatorBeforeCollapsed = document.getElementById("context-nav-preview-separator-before-collapsed");
const contextNavPreviewPageMinusOneItem = document.getElementById("context-nav-preview-page-minus-one-item");
const contextNavPreviewSeparatorBeforePageMinusOne = document.getElementById("context-nav-preview-separator-before-page-minus-one");
const contextNavPreviewPageMinusOneLink = document.getElementById("context-nav-preview-page-minus-one-link");
const contextNavPreviewSearchShell = document.getElementById("context-nav-preview-search-shell");
const contextNavFilterLabel = document.getElementById("context-nav-filter-label");
const contextNavAccessLabel = document.getElementById("context-nav-access-label");
const contextNavMoreLabel = document.getElementById("context-nav-more-label");
const contextNavCanonicalMatchList = document.getElementById("context-nav-canonical-match-list");
const contextNavCanonicalCircumstances = document.getElementById("context-nav-canonical-circumstances");
const contextNavCanonicalCurrent = document.getElementById("context-nav-canonical-current");
const contextNavCanonicalPrev = document.getElementById("context-nav-canonical-prev");
const contextNavCanonicalNext = document.getElementById("context-nav-canonical-next");
const subNavCanonicalMatchList = document.getElementById("sub-nav-canonical-match-list");
const subNavCanonicalCircumstances = document.getElementById("sub-nav-canonical-circumstances");
const subNavCanonicalCurrent = document.getElementById("sub-nav-canonical-current");
const subNavCanonicalPrev = document.getElementById("sub-nav-canonical-prev");
const subNavCanonicalNext = document.getElementById("sub-nav-canonical-next");
const breadcrumbTooltipNodes = Array.from(
  document.querySelectorAll("#breadcrumb-list .breadcrumb-button, #sub-nav-preview-breadcrumb-list .breadcrumb-button"),
);
let subNavPreviewRenderPass = 0;
let activeSharedTooltipTarget = null;

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

const filterOptionSets = {
  status: ["All", "Ready", "Draft", "In Review", "Blocked"],
  surface: ["Navigation", "Forms", "Tables", "Data Entry", "Dashboards"],
  lifecycle: ["Current", "Deprecated", "Experimental", "Archived", "Planned"],
};

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
  { code: "zh-Hans", name: "Chinese (Simplified)", detail: "Simplified Chinese" },
];

const topNavPreviewFixtures = {
  standard: {
    brand: "Kanbien",
    primary: ["Overview", "Foundations", "Components", "Patterns", "Resources"],
    profile: "Profile",
    mobileProfile: "Profile",
    menu: ["Language", "Close menu"],
    mobileMenu: ["My Profile", "Preferences", "Language", "Sign Out"],
  },
  "long-labels": {
    brand: "Kanbien Internationalization Operations Console",
    primary: [
      "Overview and Platform Signals",
      "Foundational Governance Rules",
      "Components and Interaction Contracts",
      "Patterns and Localization Guidance",
      "Resources and Operational References",
    ],
    profile: "Profile and Personalization Preferences",
    mobileProfile: "Profile and Personalization Preferences",
    menu: ["Language and Regional Preferences", "Close account navigation menu"],
    mobileMenu: [
      "My Administrative Profile Settings",
      "Preferences and Display Controls",
      "Language and Regional Preferences",
      "Sign Out of the Current Session",
    ],
  },
};

let activeFilterCategory = "status";
let activeLanguageCode = "en";
let languageModalReturnFocusTarget = null;
let accessibilityDrawerReturnFocusTarget = null;
let activeTopNavPreviewFixture = "standard";
let activeTopNavPreviewOpenState = "closed";
const topNavSurfaceMode = document.body.dataset.topNavSurface ?? "exploration";
const contextNavSurfaceMode = document.body.dataset.contextNavSurface ?? "inactive";
const subNavSurfaceMode = document.body.dataset.subNavSurface ?? "exploration";

function usesLocalCanonicalAppearanceScope() {
  return topNavSurfaceMode === "canonical" || subNavSurfaceMode === "canonical" || contextNavSurfaceMode === "canonical";
}

function getLocalCanonicalAppearanceScope() {
  return topNavCanonicalRenderLayout ?? subNavCanonicalRenderLayout ?? contextNavCanonicalRenderLayout ?? null;
}

function getAppearanceScopeNode() {
  if (usesLocalCanonicalAppearanceScope()) {
    return getLocalCanonicalAppearanceScope() ?? document.documentElement;
  }

  return document.documentElement;
}

function getCurrentSurfaceTheme() {
  const scopeNode = getAppearanceScopeNode();
  if (scopeNode instanceof HTMLElement && scopeNode !== document.documentElement) {
    return scopeNode.dataset.themeScope ?? document.documentElement.dataset.theme ?? topNavPreviewDefaults.theme;
  }

  return document.documentElement.dataset.theme ?? topNavPreviewDefaults.theme;
}

function getLocalCanonicalMagnificationScope() {
  return topNavPreviewCanvas ?? subNavPreviewShell ?? contextNavPreviewShell ?? getLocalCanonicalAppearanceScope() ?? null;
}

function getMagnificationScopeNode() {
  if (usesLocalCanonicalAppearanceScope()) {
    return getLocalCanonicalMagnificationScope() ?? document.documentElement;
  }

  return document.documentElement;
}

function getCurrentDocumentDirection() {
  return document.documentElement.getAttribute("dir") ?? topNavPreviewDefaults.direction;
}

function getTopNavSurfaceDirection() {
  return topNavPreviewCanvas?.getAttribute("dir")
    ?? getCurrentDocumentDirection()
    ?? topNavPreviewDefaults.direction;
}

function shouldUseLocalCanonicalDirection() {
  return topNavSurfaceMode === "canonical"
    || subNavSurfaceMode === "canonical"
    || contextNavSurfaceMode === "canonical";
}

function getSubNavSurfaceDirection() {
  return subNavPreviewShell?.getAttribute("dir")
    ?? getCurrentDocumentDirection()
    ?? subNavPreviewDefaults.direction;
}

function getContextNavSurfaceDirection() {
  return contextNavPreviewShell?.getAttribute("dir")
    ?? getCurrentDocumentDirection()
    ?? contextNavPreviewDefaults.direction;
}

function shouldTrackHostContextNavOffset() {
  return Boolean(designSystemShell && (shellTopNav || shellSubNav));
}
const previewAccentPalette = [
  "#635bff",
  "#2563eb",
  "#0891b2",
  "#0f766e",
  "#2f855a",
  "#65a30d",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#e11d48",
  "#c026d3",
  "#7c3aed",
];
const topNavPreviewDefaults = {
  width: 1120,
  fixture: "standard",
  open: "closed",
  theme: "normal",
  direction: "ltr",
  magnification: 0,
  accent: "#635bff",
};
const validPreviewThemes = new Set(["normal", "dark", "desert"]);
const validPreviewDirections = new Set(["ltr", "rtl"]);
const validPreviewFixtures = new Set(Object.keys(topNavPreviewFixtures));
const validPreviewOpenStates = new Set(["closed", "overflow", "profile", "mobile"]);
const validPreviewMagnificationValues = new Set([-100, -50, 0, 50, 100]);
const validPreviewAccents = new Set(previewAccentPalette);
const displaySettingsCopy = {
  ltr: {
    eyebrow: "Display",
    title: "Display Settings",
    "theme-group": "Theme",
    "theme-normal": "Normal",
    "theme-dark": "Dark",
    "theme-desert": "Desert",
    "magnification-group": "Magnification",
    "accent-group": "Primary Colour",
    "direction-group": "Direction",
    "direction-ltr": "Left to right",
    "direction-rtl": "Right to left",
  },
  rtl: {
    eyebrow: "العرض",
    title: "إعدادات العرض",
    "theme-group": "المظهر",
    "theme-normal": "عادي",
    "theme-dark": "داكن",
    "theme-desert": "صحراوي",
    "magnification-group": "التكبير",
    "accent-group": "اللون الأساسي",
    "direction-group": "الاتجاه",
    "direction-ltr": "من اليسار إلى اليمين",
    "direction-rtl": "من اليمين إلى اليسار",
  },
};
const displaySettingsAriaLabels = {
  ltr: {
    close: "Close display settings",
  },
  rtl: {
    close: "إغلاق إعدادات العرض",
  },
};
const displaySettingsAccentLabels = {
  ltr: {
    "#635bff": "Indigo",
    "#2563eb": "Blue",
    "#0891b2": "Cyan",
    "#0f766e": "Teal",
    "#2f855a": "Green",
    "#65a30d": "Lime",
    "#ca8a04": "Gold",
    "#ea580c": "Orange",
    "#dc2626": "Red",
    "#e11d48": "Rose",
    "#c026d3": "Fuchsia",
    "#7c3aed": "Violet",
  },
  rtl: {
    "#635bff": "نيلي",
    "#2563eb": "أزرق",
    "#0891b2": "سماوي",
    "#0f766e": "فيروزي",
    "#2f855a": "أخضر",
    "#65a30d": "ليموني",
    "#ca8a04": "ذهبي",
    "#ea580c": "برتقالي",
    "#dc2626": "أحمر",
    "#e11d48": "وردي",
    "#c026d3": "فوشيا",
    "#7c3aed": "بنفسجي",
  },
};
const topNavCanonicalReferenceStates = [
  { ref: "TRP-001", label: "Desktop default", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop baseline with full primary navigation visible, profile controls closed, and no overflow pressure." },
  { ref: "TRP-002", label: "Desktop overflow", fixture: "standard", width: 880, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop shell under width pressure where overflow activates before overlap or utility collision." },
  { ref: "TRP-003", label: "Desktop threshold before mobile", fixture: "standard", width: 760, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop threshold state that must not degrade into the disallowed `1 item + More` layout." },
  { ref: "TRP-004", label: "Mobile shell closed", fixture: "standard", width: 560, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Mobile shell with the collapsed navigation chrome closed." },
  { ref: "TRP-005", label: "Mobile shell open", fixture: "standard", width: 560, open: "mobile", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Mobile shell with the primary navigation exposed as the full open mobile menu." },
  { ref: "TRP-006", label: "Profile menu open", fixture: "standard", width: 1120, open: "profile", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop shell with the profile menu open and anchored to the utility region." },
  { ref: "TRP-007", label: "Overflow menu open", fixture: "standard", width: 880, open: "overflow", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop overflow state with the `More` menu open and derived from the hidden primary destinations." },
  { ref: "TRP-008", label: "RTL desktop", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "rtl", magnification: 0, circumstance: "RTL desktop shell with native-feeling mirrored alignment and preserved utility separation." },
  { ref: "TRP-009", label: "RTL mobile", fixture: "standard", width: 560, open: "mobile", theme: "normal", direction: "rtl", magnification: 0, circumstance: "RTL mobile shell with the open mobile navigation and mirrored utility grammar." },
  { ref: "TRP-010", label: "Magnified desktop", fixture: "long-labels", width: 880, open: "closed", theme: "normal", direction: "ltr", magnification: 100, circumstance: "Magnified desktop shell with long labels, requiring overflow or mobile fallback before crowding." },
  { ref: "TRP-011", label: "Long brand label", fixture: "long-labels", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop shell with an intentionally long brand label that must yield without distorting the brand mark." },
  { ref: "TRP-012", label: "Long primary label", fixture: "long-labels", width: 880, open: "overflow", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop overflow state with long primary destination labels preserved through overflow rather than overlap." },
  { ref: "TRP-013", label: "Long profile label", fixture: "long-labels", width: 1120, open: "profile", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Desktop shell with long profile and menu labels open in the utility menu." },
  { ref: "TRP-014A", label: "Theme normal", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Normal theme baseline for top-nav readability and contrast." },
  { ref: "TRP-014B", label: "Theme dark", fixture: "standard", width: 1120, open: "closed", theme: "dark", direction: "ltr", magnification: 0, circumstance: "Dark theme top-nav state used for cross-theme readability review." },
  { ref: "TRP-014C", label: "Theme desert", fixture: "standard", width: 1120, open: "closed", theme: "desert", direction: "ltr", magnification: 0, circumstance: "Desert theme top-nav state used for cross-theme readability review." },
  { ref: "TRP-015A", label: "Accent indigo", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Default indigo accent inheritance for the shell." },
  { ref: "TRP-015B", label: "Accent violet", fixture: "standard", width: 1120, open: "closed", theme: "normal", direction: "ltr", magnification: 0, circumstance: "Alternate violet accent inheritance for the shell." },
];
const subNavPreviewDefaults = {
  width: 1560,
  state: "full",
  search: "inactive",
  theme: "normal",
  direction: "ltr",
  magnification: 0,
  locale: "standard",
  accent: "#635bff",
};
const validSubNavStates = new Set(["full", "shallow", "reduced-page-minus-one", "reduced-middle", "compact", "mobile"]);
const validSubNavSearchStates = new Set(["inactive", "active"]);
const contextNavPreviewDefaults = {
  width: 1120,
  height: 760,
  stack: "standard",
  labels: "standard",
  open: "closed",
  theme: "normal",
  direction: "ltr",
  magnification: 0,
  accent: "#635bff",
};
const validContextNavStacks = new Set(["standard", "tall"]);
const validContextNavLabels = new Set(["standard", "long"]);
const validContextNavOpenStates = new Set(["closed", "more", "filter", "accessibility"]);
const contextNavPrimaryFixtures = {
  standard: [
    { key: "overview", href: "/design-system", standard: "Overview", long: "Overview and Signals", active: true, icon: "home" },
    { key: "components", href: "/design-system/components", standard: "Components", long: "Components Library", icon: "grid" },
    { key: "patterns", href: "/design-system/patterns", standard: "Patterns", long: "Pattern Guidance", icon: "list" },
    { key: "resources", href: "/design-system/resources", standard: "Resources", long: "Operational Resources", icon: "doc" },
  ],
  tall: [
    { key: "overview", href: "/design-system", standard: "Overview", long: "Overview and Signals", active: true, icon: "home" },
    { key: "components", href: "/design-system/components", standard: "Components", long: "Components Library", icon: "grid" },
    { key: "patterns", href: "/design-system/patterns", standard: "Patterns", long: "Pattern Guidance", icon: "list" },
    { key: "resources", href: "/design-system/resources", standard: "Resources", long: "Operational Resources", icon: "doc" },
    { key: "tokens", href: "/design-system/tokens", standard: "Tokens", long: "Semantic Tokens", icon: "token" },
    { key: "motion", href: "/design-system/motion", standard: "Motion", long: "Motion Behavior", icon: "spark" },
    { key: "content", href: "/design-system/content", standard: "Content", long: "Content Contracts", icon: "text" },
    { key: "quality", href: "/design-system/quality", standard: "Quality", long: "Quality Gates", icon: "shield" },
    { key: "locales", href: "/design-system/localization", standard: "Locales", long: "Localization Review", icon: "globe" },
  ],
};
const contextNavBottomFixtures = {
  filter: { standard: "Filters", long: "Filter Controls", tooltip: "Filters" },
  accessibility: { standard: "Access", long: "Accessibility Tools", tooltip: "Accessibility" },
  more: { standard: "More", long: "More Actions", tooltip: "More" },
};
const contextNavCanonicalReferenceStates = [
  { ref: "CNR-001", label: "Desktop rail baseline", width: 1120, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop baseline review with a shell-attached rail, standard labels, stable top and bottom zones, and no transient surfaces open." },
  { ref: "CNR-002", label: "Tall top-stack scroll", width: 1120, height: 620, stack: "tall", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop scroll review where the top stack is tall enough to scroll while the bottom zone remains anchored and center alignment stays intact beside a thin scrollbar." },
  { ref: "CNR-003", label: "Desktop tooltip hover target", width: 1120, height: 760, stack: "standard", labels: "long", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop hover-target review where long labels remain hidden in the rail and the governed tooltip layer is ready to reveal the full label on hover." },
  { ref: "CNR-004", label: "Short-height scroll pressure", width: 1120, height: 460, stack: "tall", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Short-height desktop review where the tall top zone remains scrollable under stronger height pressure while the bottom utility zone stays pinned and aligned." },
  { ref: "CNR-005", label: "Mobile bottom-nav baseline", width: 560, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile baseline review where the rail converts into a bottom bar with visible labels and the current destination remains identifiable." },
  { ref: "CNR-006", label: "Mobile More menu open", width: 560, height: 760, stack: "tall", labels: "standard", open: "more", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile overflow review where extra top actions and bottom utility actions move into the More menu instead of crowding the primary lane." },
  { ref: "CNR-007", label: "Context-nav drawer launch", width: 560, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile action review where the context-nav drawer launches from the governed utility path and layers cleanly above the bottom bar." },
  { ref: "CNR-008", label: "RTL right-edge rail", width: 1120, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL desktop review where the context-nav mirrors to the full right edge and preserves native-feeling anchoring for menus, drawers, and tooltips." },
  { ref: "CNR-009", label: "Magnified long-label desktop", width: 1120, height: 760, stack: "standard", labels: "long", open: "closed", theme: "normal", direction: "ltr", magnification: 100, accent: "#635bff", circumstance: "Magnified desktop review where long labels still truncate cleanly, the rail geometry stays stable, and tooltip-trigger affordances remain honest." },
  { ref: "CNR-010", label: "Theme and accent readability", width: 1120, height: 760, stack: "standard", labels: "standard", open: "closed", theme: "dark", direction: "ltr", magnification: 0, accent: "#7c3aed", circumstance: "Theme and accent review where the context-nav keeps its locked behavior while contrast, emphasis, and active states inherit the shared design-system styling." },
  { ref: "CDR-001", label: "Desktop attached drawer open", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Desktop context-nav drawer review where the drawer opens as a shell-attached side panel, overlays the content area, preserves the governed close-control grammar, and remains directly tied to the launching rail." },
  { ref: "CDR-002", label: "RTL right-edge attached drawer", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL context-nav drawer review where the drawer mirrors to the right-edge shell presentation and preserves native-feeling anchoring relative to the mirrored rail." },
  { ref: "CDR-003", label: "Mobile bottom-sheet drawer open", width: 560, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile context-nav drawer review where the drawer opens as a bottom-attached sheet, fills the lane to the top edge of the bottom bar, and remains layered above the mobile shell chrome." },
  { ref: "CDR-004", label: "Mobile tall-stack utility path", width: 560, height: 760, stack: "tall", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile tall-stack review where the context-nav drawer still launches truthfully through the constrained utility path without collapsing the governed bottom-bar model." },
  { ref: "CDR-005", label: "Dark theme with magnification", width: 1120, height: 760, stack: "standard", labels: "long", open: "accessibility", theme: "dark", direction: "ltr", magnification: 100, accent: "#7c3aed", circumstance: "Context-nav-drawer stress review under dark theme and magnification where focus visibility, contrast, readable control grouping, and structural stability stay intact." },
  { ref: "CDR-006", label: "Long-label readability and alternate theme", width: 1120, height: 760, stack: "standard", labels: "long", open: "accessibility", theme: "desert", direction: "ltr", magnification: 50, accent: "#0f766e", circumstance: "Context-nav-drawer readability review under longer labels and an alternate approved theme where the drawer structure stays stable without geometric drift." },
  { ref: "DSR-001", label: "Desktop grouped payload baseline", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Display-settings payload baseline where the grouped runtime controls for theme, magnification, accent, and direction are reviewed inside the signed-off desktop drawer shell." },
  { ref: "DSR-002", label: "Dark theme and enlarged payload", width: 1120, height: 760, stack: "standard", labels: "long", open: "accessibility", theme: "dark", direction: "ltr", magnification: 100, accent: "#7c3aed", circumstance: "Display-settings stress review where the grouped payload remains readable and structurally stable under dark theme, enlarged magnification, and the shared drawer shell." },
  { ref: "DSR-003", label: "RTL mirrored payload", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "rtl", magnification: 0, accent: "#635bff", circumstance: "RTL display-settings review where the payload body mirrors, local copy shifts to Arabic, and the grouped controls feel native inside the mirrored drawer shell." },
  { ref: "DSR-004", label: "Mobile bottom-sheet payload", width: 560, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: 0, accent: "#635bff", circumstance: "Mobile display-settings review where the full grouped payload remains usable inside the bottom-attached sheet without clipping or losing the bottom-bar relationship." },
  { ref: "DSR-005", label: "Reduced magnification and accent sweep", width: 1120, height: 760, stack: "standard", labels: "standard", open: "accessibility", theme: "normal", direction: "ltr", magnification: -100, accent: "#2563eb", circumstance: "Display-settings range review where the low-end magnification state and non-default accent remain real, reload-safe, and visually legible inside the payload." },
];
const validSubNavLocales = new Set(["standard", "long-latin", "long-latin-truncation", "rtl", "rtl-long", "rtl-long-truncation", "cjk", "symbols"]);
const subNavPreviewLocales = {
  standard: {
    placeholder: "Search components, patterns, or docs",
    home: "Home",
    middleA: "Library",
    middleB: "Navigation",
    pageMinusOne: "Sub-nav",
    pageMinusOneShort: "Previous",
    current: "Search",
  },
  "long-latin": {
    placeholder: "Search components, patterns, documentation, and operational references",
    home: "Home",
    middleA: "Design System",
    middleB: "Navigation Hierarchy",
    pageMinusOne: "Sub-navigation Workspace",
    pageMinusOneShort: "Previous",
    current: "Search and Discovery",
  },
  "long-latin-truncation": {
    placeholder: "Search components, patterns, or docs",
    home: "Home",
    middleA: "Design System",
    middleB: "Navigation Hierarchy",
    pageMinusOne: "Sub-navigation governance workspace",
    pageMinusOneShort: "Previous",
    current: "Search discovery documentation",
  },
  rtl: {
    placeholder: "ابحث في المكونات والأنماط والوثائق",
    home: "الرئيسية",
    middleA: "المكتبة",
    middleB: "التنقل",
    pageMinusOne: "الشريط الفرعي",
    pageMinusOneShort: "السابق",
    current: "البحث",
  },
  "rtl-long": {
    placeholder: "ابحث في المكونات والأنماط والوثائق المرجعية والتشغيلية",
    home: "الصفحة الرئيسية",
    middleA: "مكتبة التصميم",
    middleB: "التنقل الهيكلي",
    pageMinusOne: "مساحة التنقل الفرعي",
    pageMinusOneShort: "السابق",
    current: "البحث والاستكشاف",
  },
  "rtl-long-truncation": {
    placeholder: "ابحث في المكونات والأنماط والوثائق",
    home: "الرئيسية",
    middleA: "مكتبة التصميم",
    middleB: "التنقل الهيكلي",
    pageMinusOne: "مساحة التنقل والمراجعة",
    pageMinusOneShort: "السابق",
    current: "البحث والاستكشاف المرجعي",
  },
  cjk: {
    placeholder: "搜索组件、模式和文档",
    home: "首页",
    middleA: "设计系统",
    middleB: "导航",
    pageMinusOne: "子导航",
    pageMinusOneShort: "上一页",
    current: "搜索",
  },
  symbols: {
    placeholder: "Search components / patterns / docs & tokens",
    home: "Home",
    middleA: "Patterns & Docs",
    middleB: "Search / Tokens",
    pageMinusOne: "Sub-nav / Search",
    pageMinusOneShort: "Previous",
    current: "Query & Filter",
  },
};
const subNavCanonicalReferenceStates = [
  { ref: "SNR-001", label: "Desktop default row", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop baseline row review with the full breadcrumb trail visible, centered search inactive, standard locale copy, normal theme, and LTR layout." },
  { ref: "SNR-002", label: "Compressed desktop row", width: 760, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Compressed desktop row review where breadcrumb pressure removes Page -1 while search remains centered and inactive." },
  { ref: "SNR-003", label: "Desktop active search", width: 1560, state: "full", search: "active", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop full-row review with active search focus, Enter hint visible, and the full breadcrumb trail retained." },
  { ref: "SNR-004", label: "Mobile fallback row", width: 560, state: "mobile", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Mobile fallback review where breadcrumb is absent and search expands to the full sub-nav width." },
  { ref: "SNR-005", label: "RTL row", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "Desktop RTL row review at the widened full canonical width so the collapsed middle breadcrumb and RTL locale copy remain honestly visible together." },
  { ref: "SNR-006", label: "Theme readability row", width: 1560, state: "full", search: "inactive", theme: "dark", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop full-row review in dark theme to confirm the shared row remains readable without changing composition." },
  { ref: "SNR-007", label: "Magnified long-content row", width: 880, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 100, locale: "long-latin", circumstance: "Magnified row review with long Latin content and reduced breadcrumb pressure so placeholder and breadcrumb fit can be judged together." },
  { ref: "SNR-008", label: "RTL reduced row", width: 1120, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL transition row review where Page -1 has already yielded so the remaining breadcrumb structure, separators, and search lane can be judged under medium-width pressure." },
  { ref: "BCR-001", label: "Full breadcrumb trail", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Wide breadcrumb baseline showing home, collapsed middle path, Page -1, and current page under standard desktop conditions." },
  { ref: "BCR-002", label: "Shallow home breadcrumb", width: 1320, state: "shallow", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Shallow-navigation review where only the home breadcrumb appears because there is no real middle path or Page -1 depth." },
  { ref: "BCR-003", label: "Reduced breadcrumb without Page -1", width: 760, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Responsive breadcrumb reduction review where Page -1 has yielded but the middle segment still remains visible." },
  { ref: "BCR-004", label: "Reduced breadcrumb without middle segment", width: 700, state: "reduced-middle", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Responsive breadcrumb reduction review where the middle segment has yielded and the remaining structure stays out of the search lane." },
  { ref: "BCR-005", label: "Compact signpost mode", width: 640, state: "compact", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Compact signpost review where breadcrumb compresses to a single protected icon/menu and search yields around that dedicated lane." },
  { ref: "BCR-006", label: "RTL breadcrumb", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL breadcrumb review at the widened full canonical width so the collapsed middle path, separators, and anchoring remain visible under RTL copy." },
  { ref: "BCR-007", label: "Long-label breadcrumb", width: 880, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "long-latin", circumstance: "Long-label breadcrumb review where long Latin labels must yield through the approved reduction path instead of wrapping or overlapping search." },
  { ref: "BCR-008", label: "Mobile breadcrumb absence", width: 560, state: "mobile", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Mobile review confirming breadcrumb disappears entirely and does not leave residual structure behind." },
  { ref: "BCR-009", label: "RTL reduced breadcrumb", width: 1120, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL breadcrumb transition review where Page -1 has yielded and the mirrored collapsed-middle structure must still anchor correctly under narrower width pressure." },
  { ref: "BCR-010", label: "RTL compact breadcrumb", width: 760, state: "compact", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL compact signpost review where the breadcrumb has collapsed to its protected recovery trigger and mirrored menu behavior remains intact." },
  { ref: "BCR-011", label: "LTR truncated breadcrumb labels", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "long-latin-truncation", circumstance: "LTR breadcrumb truncation review at full desktop width where deliberately oversized button labels must ellipsize honestly, surface tooltips, and remain visible without forcing the row into a reduced breadcrumb state." },
  { ref: "BCR-012", label: "RTL truncated breadcrumb labels", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl-long-truncation", circumstance: "RTL breadcrumb truncation review at full desktop width where deliberately oversized mirrored button labels must ellipsize honestly, surface tooltips, and remain visible without forcing the row into a reduced breadcrumb state." },
  { ref: "SSR-001", label: "Desktop empty search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop search-shell baseline with full row support, inactive search field, and standard placeholder copy." },
  { ref: "SSR-002", label: "Desktop active search", width: 1560, state: "full", search: "active", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Desktop active-search review showing focus treatment and Enter hint inside the full supported row." },
  { ref: "SSR-003", label: "Compressed desktop search", width: 760, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Compressed desktop review where search must remain bounded and clear while the breadcrumb has already yielded Page -1." },
  { ref: "SSR-004", label: "Mobile search", width: 560, state: "mobile", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Mobile search review where the field fills the sub-nav width and the Enter hint is absent." },
  { ref: "SSR-005", label: "RTL search", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL search-shell review at the widened full canonical width so the search field stays paired with the full supported breadcrumb structure under RTL content." },
  { ref: "SSR-006", label: "Theme readability search", width: 1560, state: "full", search: "inactive", theme: "dark", direction: "ltr", magnification: 0, locale: "standard", circumstance: "Dark-theme search-shell review focused on placeholder, border, and focus readability." },
  { ref: "SSR-007", label: "Magnified long-placeholder search", width: 880, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "ltr", magnification: 100, locale: "long-latin", circumstance: "Magnified long-placeholder review where long Latin guidance text must yield cleanly without pretending the full breadcrumb still fits." },
  { ref: "SSR-008", label: "Localized long Latin search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "long-latin", circumstance: "Wide search-shell review with long Latin placeholder copy under full row support." },
  { ref: "SSR-009", label: "Localized RTL search", width: 1920, state: "full", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "Wide RTL search-shell review at the widened full canonical width with localized RTL placeholder content and the full breadcrumb structure retained." },
  { ref: "SSR-010", label: "Localized CJK search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "cjk", circumstance: "Wide search-shell review with dense CJK placeholder content to confirm glyph rendering and spacing." },
  { ref: "SSR-011", label: "Symbol-heavy search", width: 1560, state: "full", search: "inactive", theme: "normal", direction: "ltr", magnification: 0, locale: "symbols", circumstance: "Wide search-shell review with punctuation-heavy placeholder guidance to verify symbol spacing and yield behavior." },
  { ref: "SSR-012", label: "RTL reduced search", width: 1120, state: "reduced-page-minus-one", search: "inactive", theme: "normal", direction: "rtl", magnification: 0, locale: "rtl", circumstance: "RTL search-shell transition review where the field must remain readable and centered while the mirrored breadcrumb has already yielded Page -1." },
];

if (breadcrumbPageMinusOneLink) {
  breadcrumbPageMinusOneLink.dataset.fullLabel = breadcrumbPageMinusOneLink.textContent?.trim() ?? "Page -1";
  breadcrumbPageMinusOneLink.dataset.shortLabel = "Previous";
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function normalizePreviewState(rawState = {}) {
  const normalized = {
    width: clampNumber(rawState.width, 480, 1320, topNavPreviewDefaults.width),
    fixture: validPreviewFixtures.has(rawState.fixture) ? rawState.fixture : topNavPreviewDefaults.fixture,
    open: validPreviewOpenStates.has(rawState.open) ? rawState.open : topNavPreviewDefaults.open,
    theme: validPreviewThemes.has(rawState.theme) ? rawState.theme : topNavPreviewDefaults.theme,
    direction: validPreviewDirections.has(rawState.direction) ? rawState.direction : topNavPreviewDefaults.direction,
    magnification: validPreviewMagnificationValues.has(Number(rawState.magnification))
      ? Number(rawState.magnification)
      : topNavPreviewDefaults.magnification,
    accent: validPreviewAccents.has(rawState.accent) ? rawState.accent : topNavPreviewDefaults.accent,
  };

  if (normalized.open === "overflow" && normalized.width > 880) {
    normalized.width = 880;
  }

  if (normalized.open === "mobile") {
    normalized.width = 560;
  }

  if (normalized.open === "profile" && normalized.width < 880) {
    normalized.width = 1120;
  }

  return normalized;
}

function normalizeSubNavPreviewState(rawState = {}) {
  const normalized = {
    width: clampNumber(rawState.width, 480, 1920, subNavPreviewDefaults.width),
    state: validSubNavStates.has(rawState.state) ? rawState.state : subNavPreviewDefaults.state,
    search: validSubNavSearchStates.has(rawState.search) ? rawState.search : subNavPreviewDefaults.search,
    theme: validPreviewThemes.has(rawState.theme) ? rawState.theme : subNavPreviewDefaults.theme,
    direction: validPreviewDirections.has(rawState.direction) ? rawState.direction : subNavPreviewDefaults.direction,
    magnification: validPreviewMagnificationValues.has(Number(rawState.magnification))
      ? Number(rawState.magnification)
      : subNavPreviewDefaults.magnification,
    locale: validSubNavLocales.has(rawState.locale) ? rawState.locale : subNavPreviewDefaults.locale,
    accent: validPreviewAccents.has(rawState.accent) ? rawState.accent : subNavPreviewDefaults.accent,
  };

  if (normalized.state === "full" && normalized.width < 1560) {
    normalized.width = 1560;
  }

  if (normalized.state === "mobile") {
    normalized.width = 560;
  }

  return normalized;
}

function getSubNavCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return subNavCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getLegacySubNavCanonicalReference(params) {
  const width = Number(params.get("width"));
  const state = params.get("state");
  const search = params.get("search");
  const theme = params.get("theme");
  const direction = params.get("dir");
  const zoom = Number(params.get("zoom"));
  const locale = params.get("locale");

  if (
    width === 960
    && state === "reduced-middle"
    && search === "inactive"
    && theme === "normal"
    && direction === "ltr"
    && zoom === 0
    && locale === "long-latin"
  ) {
    return getSubNavCanonicalReferenceByRef("BCR-011");
  }

  if (
    width === 960
    && state === "reduced-middle"
    && search === "inactive"
    && theme === "normal"
    && direction === "rtl"
    && zoom === 0
    && locale === "rtl-long"
  ) {
    return getSubNavCanonicalReferenceByRef("BCR-012");
  }

  return null;
}

function getSubNavCanonicalMatches(state) {
  return subNavCanonicalReferenceStates.filter((reference) => (
    reference.width === state.width &&
    reference.state === state.state &&
    reference.search === state.search &&
    reference.theme === state.theme &&
    reference.direction === state.direction &&
    reference.magnification === Number(state.magnification) &&
    reference.locale === state.locale
  ));
}

function getRequestedSubNavCanonicalRef() {
  return new URLSearchParams(window.location.search).get("ref");
}

function buildSubNavCanonicalHref(reference, accent = subNavPreviewDefaults.accent) {
  const params = new URLSearchParams();
  params.set("width", String(reference.width));
  params.set("state", reference.state);
  params.set("search", reference.search);
  params.set("theme", reference.theme);
  params.set("dir", reference.direction);
  params.set("zoom", String(Number(reference.magnification)));
  params.set("locale", reference.locale);
  params.set("accent", accent);
  params.set("ref", reference.ref);
  return `/design-system/components/sub-nav?${params.toString()}`;
}

function getActiveSubNavCanonicalReference(matches) {
  const requestedRef = getRequestedSubNavCanonicalRef();
  if (requestedRef) {
    const matchedReference = matches.find((reference) => reference.ref === requestedRef);
    if (matchedReference) {
      return matchedReference;
    }
  }

  return matches[0] ?? null;
}

function updateSubNavCanonicalStepper(state, matches) {
  if (!subNavCanonicalCurrent && !subNavCanonicalPrev && !subNavCanonicalNext) {
    return;
  }

  const activeReference = getActiveSubNavCanonicalReference(matches);
  const activeIndex = activeReference
    ? subNavCanonicalReferenceStates.findIndex((reference) => reference.ref === activeReference.ref)
    : -1;
  const previousReference = activeIndex > 0 ? subNavCanonicalReferenceStates[activeIndex - 1] : null;
  const nextReference = activeIndex >= 0 && activeIndex < subNavCanonicalReferenceStates.length - 1
    ? subNavCanonicalReferenceStates[activeIndex + 1]
    : null;

  if (subNavCanonicalCurrent) {
    subNavCanonicalCurrent.textContent = activeReference
      ? `${activeReference.ref} - ${activeReference.label}`
      : "Ad hoc canonical state";
  }

  const accent = state.accent ?? subNavPreviewDefaults.accent;
  for (const [node, reference] of [
    [subNavCanonicalPrev, previousReference],
    [subNavCanonicalNext, nextReference],
  ]) {
    if (!(node instanceof HTMLAnchorElement)) {
      continue;
    }

    if (reference) {
      node.href = buildSubNavCanonicalHref(reference, accent);
      node.setAttribute("aria-disabled", "false");
      node.tabIndex = 0;
    } else {
      node.href = "#";
      node.setAttribute("aria-disabled", "true");
      node.tabIndex = -1;
    }
  }
}

function hideSharedTooltip() {
  const tooltip = getSharedTooltipElement();
  tooltip.classList.add("hidden");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.textContent = "";
  tooltip.removeAttribute("data-placement");
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
  const isBreadcrumbTooltip =
    target.classList.contains("breadcrumb-button")
    || target.classList.contains("breadcrumb-current")
    || target.id === "sub-nav-preview-current-label";
  const isContextNavTooltip = target.classList.contains("context-nav-item");
  const direction = topNavPreviewCanvas?.getAttribute("dir") === "rtl" || document.documentElement.getAttribute("dir") === "rtl"
    ? "rtl"
    : "ltr";

  if (isBreadcrumbTooltip) {
    tooltip.dataset.placement = "below";
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    tooltip.style.top = `${rect.bottom + 12}px`;
    tooltip.style.transform = "translateX(-50%)";
  } else if (isContextNavTooltip) {
    tooltip.dataset.placement = direction === "rtl" ? "left" : "right";
    if (direction === "rtl") {
      tooltip.style.left = `${rect.left - 12}px`;
      tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
      tooltip.style.transform = "translate(-100%, -50%)";
    } else {
      tooltip.style.left = `${rect.right + 12}px`;
      tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
      tooltip.style.transform = "translateY(-50%)";
    }
  } else {
    tooltip.dataset.placement = "above";
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    tooltip.style.top = `${rect.top - 12}px`;
    tooltip.style.transform = "translate(-50%, -100%)";
  }

  activeSharedTooltipTarget = target;
}

function getTooltipTargetFromNode(node) {
  if (!(node instanceof Element)) {
    return null;
  }

  return node.closest(".tooltip-anchor[data-tooltip], .context-nav-item[data-tooltip]");
}

function getTooltipTargetFromEvent(event) {
  if (!event || typeof event.composedPath !== "function") {
    return getTooltipTargetFromNode(event?.target);
  }

  for (const entry of event.composedPath()) {
    if (entry instanceof Element) {
      const target = getTooltipTargetFromNode(entry);
      if (target) {
        return target;
      }
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

  document.addEventListener("focusin", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (target instanceof HTMLElement && !target.classList.contains("context-nav-item")) {
      positionSharedTooltip(target);
    }
  });

  document.addEventListener("focusout", (event) => {
    const target = getTooltipTargetFromEvent(event);
    if (!(target instanceof HTMLElement) || target.classList.contains("context-nav-item") || target !== activeSharedTooltipTarget) {
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

function describeSubNavCanonicalCircumstances(state, matches) {
  if (matches.length > 0) {
    return matches.map((match) => match.circumstance).join(" ");
  }

  const viewportLabel = state.state === "mobile" ? "mobile" : "desktop";
  const searchLabel = state.search === "active" ? "active search" : "inactive search";
  const directionLabel = state.direction.toUpperCase();
  const themeLabel = state.theme;
  const zoomLabel = `${Number(state.magnification)}% magnification`;
  return `Ad hoc ${viewportLabel} canonical view using the ${state.state} row state, ${searchLabel}, ${state.locale} locale copy, ${directionLabel} direction, ${themeLabel} theme, ${zoomLabel}, and ${state.width}px frame width.`;
}

function getContextNavIconMarkup(icon) {
  const icons = {
    home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />',
    grid: '<path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 3.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z" />',
    list: '<path d="M5 6h14v3H5zm0 5h14v3H5zm0 5h9v3H5z" />',
    doc: '<path d="M7 4h8l4 4v12H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm7 1.5V9h3.5" />',
    token: '<path d="m12 3 7 4v10l-7 4-7-4V7zm0 3.1L8.1 8.3v4.4L12 15l3.9-2.3V8.3z" />',
    spark: '<path d="M12 2.5 14.2 8l5.3 2-5.3 2-2.2 5.5L9.8 12 4.5 10l5.3-2zm-5 13 1.15 2.85L11 19.5l-2.85 1.15L7 23.5l-1.15-2.85L3 19.5l2.85-1.15z" />',
    text: '<path d="M5 5h14v3h-5.5v11h-3V8H5z" />',
    shield: '<path d="M12 3.2 18.5 5v5.2c0 4.3-2.75 8.05-6.5 9.8-3.75-1.75-6.5-5.5-6.5-9.8V5zM10.8 14.7l4.7-4.7-1.4-1.4-3.3 3.3-1.8-1.8-1.4 1.4z" />',
    globe: '<path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm5.85 8h-3.2a14.4 14.4 0 0 0-1.2-5A7.03 7.03 0 0 1 17.85 11zM12 5.2A12.1 12.1 0 0 1 13.4 11h-2.8A12.1 12.1 0 0 1 12 5.2zM6.15 13h3.2a14.4 14.4 0 0 0 1.2 5A7.03 7.03 0 0 1 6.15 13zm3.2-2h-3.2A7.03 7.03 0 0 1 10.55 6a14.4 14.4 0 0 0-1.2 5zm2.65 7.8A12.1 12.1 0 0 1 10.6 13h2.8A12.1 12.1 0 0 1 12 18.8zM13.45 18a14.4 14.4 0 0 0 1.2-5h3.2A7.03 7.03 0 0 1 13.45 18z" />',
    more: '<path d="M12 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5z" />',
    filter: '<path d="M4 6h16l-6.5 7.25V19l-3-1.5v-4.25z" />',
    accessibility: '<path d="M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75zm0 3.1a2.15 2.15 0 1 1-2.15 2.15A2.15 2.15 0 0 1 12 5.85zm0 11.55a5.4 5.4 0 0 1-4.19-1.97 4.87 4.87 0 0 1 8.38 0A5.4 5.4 0 0 1 12 17.4z" />',
  };

  return icons[icon] ?? icons.grid;
}

function normalizeContextNavPreviewState(rawState = {}) {
  const normalized = {
    width: clampNumber(rawState.width, 560, 1320, contextNavPreviewDefaults.width),
    height: clampNumber(rawState.height, 420, 980, contextNavPreviewDefaults.height),
    stack: validContextNavStacks.has(rawState.stack) ? rawState.stack : contextNavPreviewDefaults.stack,
    labels: validContextNavLabels.has(rawState.labels) ? rawState.labels : contextNavPreviewDefaults.labels,
    open: validContextNavOpenStates.has(rawState.open) ? rawState.open : contextNavPreviewDefaults.open,
    theme: validPreviewThemes.has(rawState.theme) ? rawState.theme : contextNavPreviewDefaults.theme,
    direction: validPreviewDirections.has(rawState.direction) ? rawState.direction : contextNavPreviewDefaults.direction,
    magnification: validPreviewMagnificationValues.has(Number(rawState.magnification))
      ? Number(rawState.magnification)
      : contextNavPreviewDefaults.magnification,
    accent: validPreviewAccents.has(rawState.accent) ? rawState.accent : contextNavPreviewDefaults.accent,
  };

  return normalized;
}

function getContextNavCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return contextNavCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getContextNavCanonicalMatches(state) {
  const matches = contextNavCanonicalReferenceStates.filter((reference) => (
    reference.width === state.width &&
    reference.height === state.height &&
    reference.stack === state.stack &&
    reference.labels === state.labels &&
    reference.open === state.open &&
    reference.theme === state.theme &&
    reference.direction === state.direction &&
    reference.magnification === Number(state.magnification)
  ));

  const requestedRef = getRequestedContextNavCanonicalRef();
  if (!requestedRef) {
    return matches;
  }

  const requestedFamily = requestedRef.split("-")[0];
  const familyMatches = matches.filter((reference) => reference.ref.startsWith(`${requestedFamily}-`));
  return familyMatches.length > 0 ? familyMatches : matches;
}

function getRequestedContextNavCanonicalRef() {
  return new URLSearchParams(window.location.search).get("ref");
}

function buildContextNavCanonicalHref(reference, accent = contextNavPreviewDefaults.accent) {
  const params = new URLSearchParams();
  params.set("width", String(reference.width));
  params.set("height", String(reference.height));
  params.set("stack", reference.stack);
  params.set("labels", reference.labels);
  params.set("open", reference.open);
  params.set("theme", reference.theme);
  params.set("dir", reference.direction);
  params.set("zoom", String(Number(reference.magnification)));
  params.set("accent", accent);
  params.set("ref", reference.ref);
  return `/design-system/components/context-nav?${params.toString()}`;
}

function updateDisplaySettingsCopy(direction) {
  const copySet = displaySettingsCopy[direction] ?? displaySettingsCopy.ltr;
  const ariaLabelSet = displaySettingsAriaLabels[direction] ?? displaySettingsAriaLabels.ltr;
  const accentLabelSet = displaySettingsAccentLabels[direction] ?? displaySettingsAccentLabels.ltr;

  for (const node of displaySettingsCopyNodes) {
    const key = node.dataset.displaySettingsCopy;
    if (!key) {
      continue;
    }
    const nextCopy = copySet[key];
    if (typeof nextCopy === "string") {
      node.textContent = nextCopy;
    }
  }

  for (const node of displaySettingsAriaLabelNodes) {
    const key = node.dataset.displaySettingsAriaLabel;
    if (!key) {
      continue;
    }
    const nextLabel = ariaLabelSet[key];
    if (typeof nextLabel === "string") {
      node.setAttribute("aria-label", nextLabel);
    }
  }

  for (const button of accentButtons) {
    const accent = (button.dataset.accent ?? "").toLowerCase();
    const nextLabel = accentLabelSet[accent];
    if (typeof nextLabel === "string") {
      button.setAttribute("aria-label", nextLabel);
    }
  }
}

function getActiveContextNavCanonicalReference(matches) {
  const requestedRef = getRequestedContextNavCanonicalRef();
  if (requestedRef) {
    const matchedReference = matches.find((reference) => reference.ref === requestedRef);
    if (matchedReference) {
      return matchedReference;
    }
  }

  return matches[0] ?? null;
}

function describeContextNavCanonicalCircumstances(state, matches) {
  const activeReference = getActiveContextNavCanonicalReference(matches);
  if (activeReference?.circumstance) {
    return activeReference.circumstance;
  }

  const viewportLabel = state.width <= 980 ? "mobile" : "desktop";
  const stackLabel = state.stack === "tall" ? "tall top stack" : "standard top stack";
  return `Ad hoc ${viewportLabel} context-nav view using ${stackLabel}, ${state.labels} labels, ${state.open} open state, ${state.direction.toUpperCase()} direction, ${state.theme} theme, ${Number(state.magnification)}% magnification, ${state.width}px width, and ${state.height}px height.`;
}

function getTopNavPreviewStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return normalizePreviewState({
    width: params.get("width") ?? topNavPreviewDefaults.width,
    fixture: params.get("fixture") ?? topNavPreviewDefaults.fixture,
    open: params.get("open") ?? topNavPreviewDefaults.open,
    theme: params.get("theme") ?? topNavPreviewDefaults.theme,
    direction: params.get("dir") ?? topNavPreviewDefaults.direction,
    magnification: params.get("zoom") ?? topNavPreviewDefaults.magnification,
    accent: params.get("accent") ?? topNavPreviewDefaults.accent,
  });
}

function getSubNavPreviewStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedReference = getSubNavCanonicalReferenceByRef(params.get("ref")) ?? getLegacySubNavCanonicalReference(params);

  if (requestedReference) {
    return normalizeSubNavPreviewState({
      width: requestedReference.width,
      state: requestedReference.state,
      search: requestedReference.search,
      theme: requestedReference.theme,
      direction: requestedReference.direction,
      magnification: requestedReference.magnification,
      locale: requestedReference.locale,
      accent: params.get("accent") ?? subNavPreviewDefaults.accent,
    });
  }

  return normalizeSubNavPreviewState({
    width: params.get("width") ?? subNavPreviewDefaults.width,
    state: params.get("state") ?? subNavPreviewDefaults.state,
    search: params.get("search") ?? subNavPreviewDefaults.search,
    theme: params.get("theme") ?? subNavPreviewDefaults.theme,
    direction: params.get("dir") ?? subNavPreviewDefaults.direction,
    magnification: params.get("zoom") ?? subNavPreviewDefaults.magnification,
    locale: params.get("locale") ?? subNavPreviewDefaults.locale,
    accent: params.get("accent") ?? subNavPreviewDefaults.accent,
  });
}

function getContextNavPreviewStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedReference = getContextNavCanonicalReferenceByRef(params.get("ref"));

  if (requestedReference) {
    return normalizeContextNavPreviewState({
      width: params.get("width") ?? requestedReference.width,
      height: params.get("height") ?? requestedReference.height,
      stack: params.get("stack") ?? requestedReference.stack,
      labels: params.get("labels") ?? requestedReference.labels,
      open: params.get("open") ?? requestedReference.open,
      theme: params.get("theme") ?? requestedReference.theme,
      direction: params.get("dir") ?? requestedReference.direction,
      magnification: params.get("zoom") ?? requestedReference.magnification,
      accent: params.get("accent") ?? requestedReference.accent,
    });
  }

  return normalizeContextNavPreviewState({
    width: params.get("width") ?? contextNavPreviewDefaults.width,
    height: params.get("height") ?? contextNavPreviewDefaults.height,
    stack: params.get("stack") ?? contextNavPreviewDefaults.stack,
    labels: params.get("labels") ?? contextNavPreviewDefaults.labels,
    open: params.get("open") ?? contextNavPreviewDefaults.open,
    theme: params.get("theme") ?? contextNavPreviewDefaults.theme,
    direction: params.get("dir") ?? contextNavPreviewDefaults.direction,
    magnification: params.get("zoom") ?? contextNavPreviewDefaults.magnification,
    accent: params.get("accent") ?? contextNavPreviewDefaults.accent,
  });
}

function getTopNavCanonicalReferenceByRef(ref) {
  if (!ref) {
    return null;
  }

  return topNavCanonicalReferenceStates.find((reference) => reference.ref === ref) ?? null;
}

function getRequestedTopNavCanonicalRef() {
  return new URLSearchParams(window.location.search).get("ref");
}

function getTopNavCanonicalMatches(state) {
  return topNavCanonicalReferenceStates.filter((reference) => (
    reference.width === state.width &&
    reference.fixture === state.fixture &&
    reference.open === state.open &&
    reference.theme === state.theme &&
    reference.direction === state.direction &&
    reference.magnification === Number(state.magnification)
  ));
}

function getActiveTopNavCanonicalReference(matches) {
  const requestedRef = getRequestedTopNavCanonicalRef();
  if (requestedRef) {
    const matchedReference = matches.find((reference) => reference.ref === requestedRef);
    if (matchedReference) {
      return matchedReference;
    }
  }

  return matches[0] ?? null;
}

function buildTopNavCanonicalHref(reference, accent = topNavPreviewDefaults.accent) {
  const params = new URLSearchParams();
  params.set("width", String(reference.width));
  params.set("fixture", reference.fixture);
  params.set("open", reference.open);
  params.set("theme", reference.theme);
  params.set("dir", reference.direction);
  params.set("zoom", String(Number(reference.magnification)));
  params.set("accent", accent);
  params.set("ref", reference.ref);
  return `/design-system/components/top-nav?${params.toString()}`;
}

function getCurrentTopNavPreviewState(overrides = {}) {
  const currentWidth = previewWidthInput?.value
    ?? previewFrame?.style.getPropertyValue("--top-nav-preview-width").replace("px", "").trim()
    ?? topNavPreviewDefaults.width;
  const currentTheme = getCurrentSurfaceTheme();
  const currentDirection = getTopNavSurfaceDirection();
  const currentMagnification = Array.from(magnificationButtons).find((button) => button.classList.contains("active"))
    ?.dataset.magnificationOption
    ?? new URLSearchParams(window.location.search).get("zoom")
    ?? String(topNavPreviewDefaults.magnification);
  const currentAccent = Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
    ?? new URLSearchParams(window.location.search).get("accent")
    ?? topNavPreviewDefaults.accent;

  return normalizePreviewState({
    width: overrides.width ?? currentWidth,
    fixture: overrides.fixture ?? activeTopNavPreviewFixture,
    open: overrides.open ?? activeTopNavPreviewOpenState,
    theme: overrides.theme ?? currentTheme,
    direction: overrides.direction ?? currentDirection,
    magnification: overrides.magnification ?? currentMagnification,
    accent: overrides.accent ?? currentAccent,
  });
}

function describeTopNavCanonicalCircumstances(state, matches) {
  const activeReference = getActiveTopNavCanonicalReference(matches);
  if (activeReference?.circumstance) {
    return activeReference.circumstance;
  }

  const viewportLabel = state.width <= 560 || state.open === "mobile" ? "mobile" : "desktop";
  return `Ad hoc ${viewportLabel} top-nav view using the ${state.fixture} fixture, ${state.open} open state, ${state.direction.toUpperCase()} direction, ${state.theme} theme, ${Number(state.magnification)}% magnification, and ${state.width}px frame width.`;
}

function syncTopNavCanonicalUrl(reference, accent = topNavPreviewDefaults.accent) {
  if (topNavSurfaceMode !== "canonical" || !reference || !window.history?.replaceState) {
    return;
  }

  const nextUrl = buildTopNavCanonicalHref(reference, accent);
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

function updateTopNavCanonicalMeta(state) {
  const matches = getTopNavCanonicalMatches(state);
  const activeReference = getActiveTopNavCanonicalReference(matches);
  const activeIndex = activeReference ? topNavCanonicalReferenceStates.findIndex((reference) => reference.ref === activeReference.ref) : -1;
  const prevReference = activeIndex > 0 ? topNavCanonicalReferenceStates[activeIndex - 1] : null;
  const nextReference = activeIndex >= 0 && activeIndex < topNavCanonicalReferenceStates.length - 1
    ? topNavCanonicalReferenceStates[activeIndex + 1]
    : null;

  if (topNavCanonicalMatchList) {
    topNavCanonicalMatchList.textContent = matches.length > 0
      ? matches.map((match) => `${match.ref} - ${match.label}`).join("; ")
      : "No named canonical reference matches this exact URL state yet.";
  }

  if (topNavCanonicalCircumstances) {
    topNavCanonicalCircumstances.textContent = describeTopNavCanonicalCircumstances(state, matches);
  }

  if (topNavCanonicalCurrent) {
    topNavCanonicalCurrent.textContent = activeReference
      ? `${activeReference.ref} - ${activeReference.label}`
      : "Ad hoc canonical";
  }

  if (topNavCanonicalPrev) {
    if (prevReference) {
      topNavCanonicalPrev.href = buildTopNavCanonicalHref(prevReference, state.accent);
      topNavCanonicalPrev.removeAttribute("aria-disabled");
    } else {
      topNavCanonicalPrev.href = "#";
      topNavCanonicalPrev.setAttribute("aria-disabled", "true");
    }
  }

  if (topNavCanonicalNext) {
    if (nextReference) {
      topNavCanonicalNext.href = buildTopNavCanonicalHref(nextReference, state.accent);
      topNavCanonicalNext.removeAttribute("aria-disabled");
    } else {
      topNavCanonicalNext.href = "#";
      topNavCanonicalNext.setAttribute("aria-disabled", "true");
    }
  }

  syncTopNavCanonicalUrl(activeReference, state.accent);
}

function syncSubNavPreviewUrl(state) {
  if (subNavSurfaceMode !== "exploration" || !subNavPreviewFrame || !window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const activeState = normalizeSubNavPreviewState({
    ...state,
    width: state?.width ?? subNavPreviewWidthInput?.value ?? subNavPreviewDefaults.width,
    theme: state?.theme ?? getCurrentSurfaceTheme() ?? subNavPreviewDefaults.theme,
    direction: state?.direction ?? getSubNavSurfaceDirection(),
    magnification:
      state?.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? subNavPreviewDefaults.magnification,
    locale:
      state?.locale
      ?? subNavPreviewLocaleButtons.find((button) => button.classList.contains("active"))?.dataset.subNavLocale
      ?? subNavPreviewDefaults.locale,
    accent:
      state?.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? subNavPreviewDefaults.accent,
  });

  params.set("width", String(activeState.width));
  params.set("state", activeState.state);
  params.set("search", activeState.search);
  params.set("theme", activeState.theme);
  params.set("dir", activeState.direction);
  params.set("zoom", String(Number(activeState.magnification)));
  params.set("locale", activeState.locale);
  params.set("accent", activeState.accent);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

function syncCanonicalRenderUrl(reference, accent = subNavPreviewDefaults.accent) {
  if (subNavSurfaceMode !== "canonical" || !reference || !window.history?.replaceState) {
    return;
  }

  const nextUrl = buildSubNavCanonicalHref(reference, accent);
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

function syncContextNavPreviewUrl(state) {
  if (contextNavSurfaceMode !== "exploration" || !contextNavPreviewFrame || !window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const activeState = normalizeContextNavPreviewState(state ?? getCurrentContextNavPreviewState());
  params.set("width", String(activeState.width));
  params.set("height", String(activeState.height));
  params.set("stack", activeState.stack);
  params.set("labels", activeState.labels);
  params.set("open", activeState.open);
  params.set("theme", activeState.theme);
  params.set("dir", activeState.direction);
  params.set("zoom", String(Number(activeState.magnification)));
  params.set("accent", activeState.accent);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

function syncTopNavPreviewUrl() {
  if (topNavSurfaceMode !== "exploration" || !previewFrame || !window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const width = clampNumber(previewWidthInput?.value, 480, 1320, topNavPreviewDefaults.width);
  const theme = getCurrentSurfaceTheme();
  const direction = getTopNavSurfaceDirection();
  const magnification = Array.from(magnificationButtons).find((button) => button.classList.contains("active"))
    ?.dataset.magnificationOption ?? String(topNavPreviewDefaults.magnification);
  const accent = Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
    ?? topNavPreviewDefaults.accent;

  params.set("width", String(width));
  params.set("fixture", activeTopNavPreviewFixture);
  params.set("open", activeTopNavPreviewOpenState);
  params.set("theme", theme);
  params.set("dir", direction);
  params.set("zoom", String(Number(magnification)));
  params.set("accent", accent);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

function setCanonicalRenderLayoutWidth(layoutNode, width) {
  if (!(layoutNode instanceof HTMLElement)) {
    return;
  }

  layoutNode.style.setProperty("--canonical-render-layout-width", `${width}px`);
}

function updateContextNavReviewFrameOffset() {
  if (!(contextNavPreviewFrame instanceof HTMLElement) || !(shellTopNav instanceof HTMLElement)) {
    return;
  }

  const shellTopNavHeight = shellTopNav.offsetHeight;
  const shellSubNavHeight = shellSubNav instanceof HTMLElement ? shellSubNav.offsetHeight : 0;
  const reviewOffset = shellTopNavHeight + shellSubNavHeight + 16;

  contextNavPreviewFrame.style.setProperty("--context-nav-review-top", `${Math.ceil(reviewOffset)}px`);
}

function applySubNavPreviewState(state) {
  if (!subNavPreviewFrame || !subNavPreviewSearchInput || !subNavPreviewShell) {
    return;
  }

  const normalizedState = normalizeSubNavPreviewState({
    ...state,
    theme: state.theme ?? getCurrentSurfaceTheme() ?? subNavPreviewDefaults.theme,
    direction: state.direction ?? getSubNavSurfaceDirection(),
    magnification:
      state.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? subNavPreviewDefaults.magnification,
    accent:
      state.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? subNavPreviewDefaults.accent,
  });
  const locale = subNavPreviewLocales[normalizedState.locale] ?? subNavPreviewLocales.standard;
  document.body.dataset.renderStatus = "settling";
  subNavPreviewShell.dataset.renderStatus = "settling";
  subNavPreviewShell.dataset.canonicalState = [
    normalizedState.state,
    normalizedState.search,
    normalizedState.locale,
    normalizedState.direction,
    normalizedState.theme,
    String(normalizedState.width),
  ].join(":");
  subNavPreviewShell.setAttribute("dir", normalizedState.direction);
  subNavPreviewFrame.style.setProperty("--sub-nav-preview-width", `${normalizedState.width}px`);
  setCanonicalRenderLayoutWidth(subNavCanonicalRenderLayout, normalizedState.width + 96);
  subNavPreviewSearchInput.placeholder = locale.placeholder;
  if (subNavPreviewHomeLink) {
    subNavPreviewHomeLink.textContent = locale.home;
  }
  if (subNavPreviewMiddleALink) {
    subNavPreviewMiddleALink.textContent = locale.middleA;
  }
  if (subNavPreviewMiddleBLink) {
    subNavPreviewMiddleBLink.textContent = locale.middleB;
  }
  if (subNavPreviewPageMinusOneLink) {
    subNavPreviewPageMinusOneLink.dataset.fullLabel = locale.pageMinusOne;
    subNavPreviewPageMinusOneLink.dataset.shortLabel = locale.pageMinusOneShort ?? locale.pageMinusOne;
    setBreadcrumbButtonLabel(subNavPreviewPageMinusOneLink, locale.pageMinusOne);
  }
  if (subNavPreviewCurrentLabel) {
    subNavPreviewCurrentLabel.textContent = locale.current;
  }
  if (subNavPreviewCompactHome) {
    subNavPreviewCompactHome.textContent = locale.home;
  }
  if (subNavPreviewCompactMiddleA) {
    subNavPreviewCompactMiddleA.textContent = locale.middleA;
  }
  if (subNavPreviewCompactMiddleB) {
    subNavPreviewCompactMiddleB.textContent = locale.middleB;
  }
  if (subNavPreviewCompactPageMinusOne) {
    subNavPreviewCompactPageMinusOne.textContent = locale.pageMinusOne;
  }
  if (subNavPreviewCompactCurrent) {
    subNavPreviewCompactCurrent.textContent = locale.current;
  }

  subNavPreviewShell.classList.toggle("sub-nav-preview-mobile", normalizedState.state === "mobile");
  subNavPreviewBreadcrumbNav?.classList.toggle("hidden", false);
  subNavPreviewBreadcrumbCompact?.classList.add("hidden");
  subNavPreviewBreadcrumbList?.classList.remove("hidden");
  subNavPreviewCollapsedItem?.classList.remove("hidden");
  subNavPreviewSeparatorBeforeCollapsed?.classList.remove("hidden");
  subNavPreviewPageMinusOneItem?.classList.remove("hidden");
  subNavPreviewSeparatorBeforePageMinusOne?.classList.remove("hidden");
  setSubNavPreviewBreadcrumbMenuOpen(false);
  setSubNavPreviewBreadcrumbCompactMenuOpen(false);

  if (normalizedState.state === "shallow") {
    subNavPreviewCollapsedItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforeCollapsed?.classList.add("hidden");
    subNavPreviewPageMinusOneItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforePageMinusOne?.classList.add("hidden");
  }

  if (normalizedState.state === "reduced-page-minus-one") {
    subNavPreviewPageMinusOneItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforePageMinusOne?.classList.add("hidden");
  }

  if (normalizedState.state === "reduced-middle") {
    subNavPreviewCollapsedItem?.classList.add("hidden");
    subNavPreviewSeparatorBeforeCollapsed?.classList.add("hidden");
  }

  if (normalizedState.state === "compact") {
    subNavPreviewBreadcrumbList?.classList.add("hidden");
    subNavPreviewBreadcrumbCompact?.classList.remove("hidden");
  }

  if (normalizedState.state === "mobile") {
    subNavPreviewBreadcrumbNav?.classList.add("hidden");
  }

  syncSubNavPreviewRowLayout(normalizedState.state);

  subNavPreviewSearchInput.value = "";
  if (subNavPreviewWidthInput) {
    subNavPreviewWidthInput.value = String(normalizedState.width);
  }
  if (subNavPreviewWidthReadout) {
    subNavPreviewWidthReadout.textContent = `Preview width: ${normalizedState.width}px`;
  }
  for (const button of subNavPreviewWidthPresetButtons) {
    button.classList.toggle("active", button.dataset.subNavWidthPreset === String(normalizedState.width));
  }
  for (const button of subNavPreviewStateButtons) {
    button.classList.toggle("active", button.dataset.subNavState === normalizedState.state);
  }
  for (const button of subNavPreviewSearchStateButtons) {
    button.classList.toggle("active", button.dataset.subNavSearchState === normalizedState.search);
  }
  for (const button of subNavPreviewLocaleButtons) {
    button.classList.toggle("active", button.dataset.subNavLocale === normalizedState.locale);
  }
  if (subNavPreviewSummary) {
    const searchLabel = normalizedState.search === "active" ? "active search" : "inactive search";
    subNavPreviewSummary.textContent = `State: ${normalizedState.state}, ${searchLabel}, locale: ${normalizedState.locale}, width: ${normalizedState.width}px`;
  }
  const canonicalMatches = getSubNavCanonicalMatches(normalizedState);
  const activeCanonicalReference = getActiveSubNavCanonicalReference(canonicalMatches);
  subNavPreviewShell.dataset.breadcrumbCanonicalMode =
    activeCanonicalReference && (activeCanonicalReference.ref === "BCR-011" || activeCanonicalReference.ref === "BCR-012")
      ? "button-truncation"
      : "default";
  if (subNavCanonicalMatchList) {
    subNavCanonicalMatchList.textContent = canonicalMatches.length > 0
      ? canonicalMatches.map((match) => `${match.ref} - ${match.label}`).join("; ")
      : "No named canonical reference matches this exact URL state yet.";
  }
  if (subNavCanonicalCircumstances) {
    subNavCanonicalCircumstances.textContent = describeSubNavCanonicalCircumstances(normalizedState, canonicalMatches);
  }
  updateSubNavCanonicalStepper(normalizedState, canonicalMatches);
  syncCanonicalRenderUrl(activeCanonicalReference, normalizedState.accent);
  hideSharedTooltip();

  syncSubNavPreviewUrl(normalizedState);
  const renderPass = ++subNavPreviewRenderPass;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (renderPass !== subNavPreviewRenderPass) {
        return;
      }

      document.body.dataset.renderStatus = "ready";
      subNavPreviewShell.dataset.renderStatus = "ready";

      if (normalizedState.state === "full") {
        applyResponsiveBreadcrumbPriority({
          list: subNavPreviewBreadcrumbList,
          container: subNavPreviewBreadcrumbList?.parentElement,
          pageMinusOneLink: subNavPreviewPageMinusOneLink,
          pageMinusOneItem: subNavPreviewPageMinusOneItem,
          separatorBeforePageMinusOne: subNavPreviewSeparatorBeforePageMinusOne,
          collapsedItem: subNavPreviewCollapsedItem,
          separatorBeforeCollapsed: subNavPreviewSeparatorBeforeCollapsed,
          compact: subNavPreviewBreadcrumbCompact,
          closeExpandedMenus: () => {
            setSubNavPreviewBreadcrumbMenuOpen(false);
            setSubNavPreviewBreadcrumbCompactMenuOpen(false);
          },
        });
      } else {
        updateBreadcrumbOverflowTooltips();
      }
    });
  });

  if (normalizedState.search === "active") {
    window.requestAnimationFrame(() => {
      subNavPreviewSearchInput.focus();
      subNavPreviewSearchInput.setSelectionRange(0, 0);
    });
  } else {
    subNavPreviewSearchInput.blur();
  }
}

wireSharedTooltipSystem();

function getCurrentSubNavPreviewState(overrides = {}) {
  return normalizeSubNavPreviewState({
    width: overrides.width ?? subNavPreviewWidthInput?.value ?? subNavPreviewDefaults.width,
    state:
      overrides.state
      ?? subNavPreviewStateButtons.find((button) => button.classList.contains("active"))?.dataset.subNavState
      ?? subNavPreviewDefaults.state,
    search:
      overrides.search
      ?? subNavPreviewSearchStateButtons.find((button) => button.classList.contains("active"))?.dataset.subNavSearchState
      ?? subNavPreviewDefaults.search,
    theme: overrides.theme ?? getCurrentSurfaceTheme() ?? subNavPreviewDefaults.theme,
    direction: overrides.direction ?? getSubNavSurfaceDirection(),
    magnification:
      overrides.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? subNavPreviewDefaults.magnification,
    locale:
      overrides.locale
      ?? subNavPreviewLocaleButtons.find((button) => button.classList.contains("active"))?.dataset.subNavLocale
      ?? subNavPreviewDefaults.locale,
    accent:
      overrides.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? subNavPreviewDefaults.accent,
  });
}

function renderContextNavMenuItems(items) {
  return items.map((item) => {
    const currentAttr = item.active ? ' aria-current="page"' : "";
    return `<a class="menu-item" href="${item.href}" role="menuitem"${currentAttr}>${item.label}</a>`;
  }).join("");
}

function renderContextNavPreviewNav(state) {
  if (!contextNavPreviewMainItems || !contextNavMoreMenu || !contextNavPreviewShell) {
    return;
  }

  const labelKey = state.labels === "long" ? "long" : "standard";
  const primaryItems = contextNavPrimaryFixtures[state.stack].map((item) => ({ ...item, label: item[labelKey] }));
  const isMobile = state.width <= 980;
  const shouldScrollTop = !isMobile && state.stack === "tall";
  const visiblePrimaryItems = isMobile ? primaryItems.slice(0, 4) : primaryItems;
  const overflowPrimaryItems = isMobile ? primaryItems.slice(4) : [];
  const filterLabel = contextNavBottomFixtures.filter[labelKey];
  const accessLabel = contextNavBottomFixtures.accessibility[labelKey];
  const moreLabel = contextNavBottomFixtures.more[labelKey];

  contextNavPreviewMainItems.innerHTML = visiblePrimaryItems.map((item) => {
    const activeClass = item.active ? " active" : "";
    const currentAttr = item.active ? ' aria-current="page"' : "";
    return `
      <a class="context-nav-item${activeClass}" href="${item.href}" data-tooltip="${item.label}"${currentAttr}>
        <span class="context-nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">${getContextNavIconMarkup(item.icon)}</svg>
        </span>
        <span class="context-nav-label">${item.label}</span>
      </a>
    `;
  }).join("");
  contextNavPreviewMainItems.classList.toggle("context-nav-main-scroll", shouldScrollTop);

  if (contextNavFilterLabel) {
    contextNavFilterLabel.textContent = filterLabel;
  }
  if (filterPanelButton) {
    filterPanelButton.dataset.tooltip = contextNavBottomFixtures.filter.tooltip;
  }
  if (contextNavAccessLabel) {
    contextNavAccessLabel.textContent = accessLabel;
  }
  if (accessibilityButton) {
    accessibilityButton.dataset.tooltip = contextNavBottomFixtures.accessibility.tooltip;
  }
  if (contextNavMoreLabel) {
    contextNavMoreLabel.textContent = moreLabel;
  }

  contextNavMoreMenu.innerHTML = (
    isMobile
      ? [
          ...overflowPrimaryItems.map((item) => `<a class="menu-item" href="${item.href}" role="menuitem">${item.label}</a>`),
          '<button id="context-nav-more-filter" class="menu-item menu-item-button" type="button" role="menuitem">Filters</button>',
          '<button id="context-nav-more-accessibility" class="menu-item menu-item-button" type="button" role="menuitem">Accessibility</button>',
        ].join("")
      : ""
  );

  contextNavPreviewShell.classList.toggle("context-nav-preview-mobile", isMobile);
  contextNavPreviewShell.classList.toggle("context-nav-preview-desktop", !isMobile);
  contextNavPreviewShell.dataset.contextNavStack = state.stack;
  contextNavPreviewShell.dataset.contextNavLabels = state.labels;
  contextNavPreviewShell.dataset.contextNavScrollable = String(shouldScrollTop);
  if (contextNavPreviewMeta) {
    contextNavPreviewMeta.textContent = "Profile";
  }
}

function updateContextNavCanonicalMeta(state) {
  const matches = getContextNavCanonicalMatches(state);
  const activeReference = getActiveContextNavCanonicalReference(matches);
  const activeIndex = activeReference ? contextNavCanonicalReferenceStates.findIndex((reference) => reference.ref === activeReference.ref) : -1;
  const prevReference = activeIndex > 0 ? contextNavCanonicalReferenceStates[activeIndex - 1] : null;
  const nextReference = activeIndex >= 0 && activeIndex < contextNavCanonicalReferenceStates.length - 1
    ? contextNavCanonicalReferenceStates[activeIndex + 1]
    : null;

  if (contextNavCanonicalMatchList) {
    contextNavCanonicalMatchList.textContent = matches.length > 0
      ? matches.map((match) => `${match.ref} - ${match.label}`).join("; ")
      : "No named canonical reference matches this exact URL state yet.";
  }

  if (contextNavCanonicalCircumstances) {
    contextNavCanonicalCircumstances.textContent = describeContextNavCanonicalCircumstances(state, matches);
  }

  if (contextNavCanonicalCurrent) {
    contextNavCanonicalCurrent.textContent = activeReference
      ? `${activeReference.ref} - ${activeReference.label}`
      : "Ad hoc canonical";
  }

  if (contextNavCanonicalPrev) {
    if (prevReference) {
      contextNavCanonicalPrev.href = buildContextNavCanonicalHref(prevReference, state.accent);
      contextNavCanonicalPrev.removeAttribute("aria-disabled");
    } else {
      contextNavCanonicalPrev.href = "#";
      contextNavCanonicalPrev.setAttribute("aria-disabled", "true");
    }
  }

  if (contextNavCanonicalNext) {
    if (nextReference) {
      contextNavCanonicalNext.href = buildContextNavCanonicalHref(nextReference, state.accent);
      contextNavCanonicalNext.removeAttribute("aria-disabled");
    } else {
      contextNavCanonicalNext.href = "#";
      contextNavCanonicalNext.setAttribute("aria-disabled", "true");
    }
  }
}

function applyContextNavPreviewState(state) {
  if (!contextNavPreviewFrame || !contextNavPreviewShell) {
    return;
  }

  const normalizedState = normalizeContextNavPreviewState({
    ...state,
    theme: state.theme ?? getCurrentSurfaceTheme() ?? contextNavPreviewDefaults.theme,
    direction: state.direction ?? getContextNavSurfaceDirection(),
    magnification:
      state.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? contextNavPreviewDefaults.magnification,
    accent:
      state.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? contextNavPreviewDefaults.accent,
  });

  document.body.dataset.renderStatus = "settling";
  contextNavPreviewShell.setAttribute("dir", normalizedState.direction);
  contextNavPreviewFrame.style.setProperty("--context-nav-preview-width", `${normalizedState.width}px`);
  contextNavPreviewFrame.style.setProperty("--context-nav-preview-height", `${normalizedState.height}px`);
  setCanonicalRenderLayoutWidth(contextNavCanonicalRenderLayout, normalizedState.width + 96);

  renderContextNavPreviewNav(normalizedState);
  setContextNavMoreOpen(false);
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(false);

  if (contextNavPreviewWidthInput) {
    contextNavPreviewWidthInput.value = String(normalizedState.width);
  }
  if (contextNavPreviewHeightInput) {
    contextNavPreviewHeightInput.value = String(normalizedState.height);
  }
  for (const button of contextNavPreviewWidthPresetButtons) {
    button.classList.toggle("active", button.dataset.contextNavWidthPreset === String(normalizedState.width));
  }
  for (const button of contextNavPreviewHeightPresetButtons) {
    button.classList.toggle("active", button.dataset.contextNavHeightPreset === String(normalizedState.height));
  }
  for (const button of contextNavPreviewStackButtons) {
    button.classList.toggle("active", button.dataset.contextNavStack === normalizedState.stack);
  }
  for (const button of contextNavPreviewLabelButtons) {
    button.classList.toggle("active", button.dataset.contextNavLabels === normalizedState.labels);
  }
  for (const button of contextNavPreviewOpenButtons) {
    button.classList.toggle("active", button.dataset.contextNavOpen === normalizedState.open);
  }

  if (contextNavPreviewSummary) {
    contextNavPreviewSummary.textContent = `State: ${normalizedState.stack} stack, ${normalizedState.labels} labels, ${normalizedState.open} open state, ${normalizedState.width}px by ${normalizedState.height}px`;
  }

  updateContextNavCanonicalMeta(normalizedState);
  syncContextNavPreviewUrl(normalizedState);
  hideSharedTooltip();

  window.requestAnimationFrame(() => {
    updateContextNavPreviewShellLayout();
    if (shouldTrackHostContextNavOffset()) {
      updateContextNavOffset();
    }
    if (normalizedState.open === "more") {
      setContextNavMoreOpen(true);
    }
    if (normalizedState.open === "filter") {
      setFilterPanelOpen(true);
    }
    if (normalizedState.open === "accessibility") {
      setAccessibilityDrawerOpen(true);
    }

    document.body.dataset.renderStatus = "ready";
  });
}

function getCurrentContextNavPreviewState(overrides = {}) {
  const liveOpenState = isAccessibilityDrawerOpen()
    ? "accessibility"
    : isFilterOptionsPanelOpen()
      ? "filter"
      : isFilterPanelOpen()
        ? "filter"
        : isContextNavMoreOpen()
          ? "more"
          : null;

  return normalizeContextNavPreviewState({
    width: overrides.width ?? contextNavPreviewWidthInput?.value ?? contextNavPreviewDefaults.width,
    height: overrides.height ?? contextNavPreviewHeightInput?.value ?? contextNavPreviewDefaults.height,
    stack:
      overrides.stack
      ?? contextNavPreviewStackButtons.find((button) => button.classList.contains("active"))?.dataset.contextNavStack
      ?? contextNavPreviewDefaults.stack,
    labels:
      overrides.labels
      ?? contextNavPreviewLabelButtons.find((button) => button.classList.contains("active"))?.dataset.contextNavLabels
      ?? contextNavPreviewDefaults.labels,
    open:
      overrides.open
      ?? liveOpenState
      ?? contextNavPreviewOpenButtons.find((button) => button.classList.contains("active"))?.dataset.contextNavOpen
      ?? contextNavPreviewDefaults.open,
    theme: overrides.theme ?? getCurrentSurfaceTheme() ?? contextNavPreviewDefaults.theme,
    direction: overrides.direction ?? getContextNavSurfaceDirection(),
    magnification:
      overrides.magnification
      ?? Array.from(magnificationButtons).find((button) => button.classList.contains("active"))?.dataset.magnificationOption
      ?? contextNavPreviewDefaults.magnification,
    accent:
      overrides.accent
      ?? Array.from(accentButtons).find((button) => button.classList.contains("active"))?.dataset.accent
      ?? contextNavPreviewDefaults.accent,
  });
}

function setPrimaryNavOverflowOpen(open) {
  primaryNavOverflowButton?.setAttribute("aria-expanded", String(open));
  primaryNavOverflowMenu?.classList.toggle("hidden", !open);
}

function isPrimaryNavOverflowOpen() {
  return primaryNavOverflowButton?.getAttribute("aria-expanded") === "true";
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
      const href = link.getAttribute("href") ?? "#";
      const label = link.textContent?.trim() ?? "";
      const isCurrent = link.getAttribute("aria-current") === "page";
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      return `<a class="menu-item" href="${href}" role="menuitem"${currentAttr}>${label}</a>`;
    })
    .join("");
}

function measurePrimaryNavOverflowButton(label) {
  if (!primaryNavOverflow || !primaryNavOverflowButton) {
    return 0;
  }

  primaryNavOverflow.classList.remove("hidden");
  primaryNavOverflow.classList.add("primary-nav-overflow-measuring");
  primaryNavOverflowButton.textContent = label;
  const width = primaryNavOverflow.getBoundingClientRect().width;
  primaryNavOverflow.classList.add("hidden");
  primaryNavOverflow.classList.remove("primary-nav-overflow-measuring");
  return width;
}

function getVisiblePrimaryNavLinks() {
  return primaryNavLinks.filter((link) => !link.classList.contains("hidden"));
}

function primaryNavFits() {
  if (!previewPrimaryNav) {
    return true;
  }

  return previewPrimaryNav.scrollWidth <= previewPrimaryNav.clientWidth;
}

function primaryNavOverlapsUtilities() {
  if (!previewNavUtilities) {
    return false;
  }

  const navUtilitiesRect = previewNavUtilities.getBoundingClientRect();
  const visibleLinks = getVisiblePrimaryNavLinks();
  const lastVisibleLink = visibleLinks.at(-1);

  if (lastVisibleLink) {
    const lastVisibleLinkRect = lastVisibleLink.getBoundingClientRect();
    if (lastVisibleLinkRect.right > navUtilitiesRect.left) {
      return true;
    }
  }

  if (primaryNavOverflowButton && !primaryNavOverflow.classList.contains("hidden")) {
    const overflowRect = primaryNavOverflowButton.getBoundingClientRect();
    if (overflowRect.right > navUtilitiesRect.left) {
      return true;
    }
  }

  if (!previewPrimaryNav) {
    return false;
  }

  const primaryNavRect = previewPrimaryNav.getBoundingClientRect();
  return primaryNavRect.right > navUtilitiesRect.left;
}

function primaryNavOverflowOverlapsVisibleLinks() {
  if (!primaryNavOverflowButton || primaryNavOverflow.classList.contains("hidden")) {
    return false;
  }

  const visibleLinks = getVisiblePrimaryNavLinks();
  const lastVisibleLink = visibleLinks.at(-1);

  if (!lastVisibleLink) {
    return false;
  }

  const lastLinkRect = lastVisibleLink.getBoundingClientRect();
  const overflowRect = primaryNavOverflowButton.getBoundingClientRect();

  return lastLinkRect.right > overflowRect.left;
}

function updatePrimaryNavOverflow() {
  if (!previewPrimaryNav || !previewTopNav || primaryNavLinks.length === 0 || !primaryNavOverflow || !primaryNavOverflowButton) {
    return;
  }

  previewTopNav.classList.remove("force-mobile-nav");
  primaryNavOverflow.classList.add("hidden");
  setPrimaryNavOverflowOpen(false);
  primaryNavOverflowButton.textContent = "More";
  renderPrimaryNavOverflowMenu([]);

  for (const link of primaryNavLinks) {
    setPrimaryNavLinkHidden(link, false);
  }

  if (primaryNavFits() && !primaryNavOverlapsUtilities()) {
    return;
  }

  primaryNavOverflowButton.textContent = "More";
  primaryNavOverflow.classList.remove("hidden");

  while (
    getVisiblePrimaryNavLinks().length > 2
    && (!primaryNavFits() || primaryNavOverlapsUtilities() || primaryNavOverflowOverlapsVisibleLinks())
  ) {
    const visibleLinks = getVisiblePrimaryNavLinks();
    const lastVisibleLink = visibleLinks.at(-1);
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
  setPrimaryNavOverflowOpen(false);
  previewTopNav.classList.add("force-mobile-nav");
}

function setScopedNavLinkHidden(node, hidden) {
  node?.classList.toggle("hidden", hidden);
}

function renderScopedPrimaryNavOverflowMenu(menu, links) {
  if (!menu) {
    return;
  }

  menu.innerHTML = links
    .map((link) => {
      const href = link.getAttribute("href") ?? "#";
      const label = link.textContent?.trim() ?? "";
      const isCurrent = link.getAttribute("aria-current") === "page";
      const currentAttr = isCurrent ? ' aria-current="page"' : "";
      return `<a class="menu-item" href="${href}" role="menuitem"${currentAttr}>${label}</a>`;
    })
    .join("");
}

function getScopedVisiblePrimaryNavLinks(links) {
  return links.filter((link) => !link.classList.contains("hidden"));
}

function scopedPrimaryNavFits(primaryNavNode) {
  if (!primaryNavNode) {
    return true;
  }

  return primaryNavNode.scrollWidth <= primaryNavNode.clientWidth;
}

function horizontalRectsOverlap(rectA, rectB) {
  return rectA.left < rectB.right && rectA.right > rectB.left;
}

function scopedPrimaryNavOverlapsUtilities(primaryNavNode, links, overflowNode, overflowButtonNode, navUtilitiesNode) {
  if (!navUtilitiesNode) {
    return false;
  }

  const navUtilitiesRect = navUtilitiesNode.getBoundingClientRect();
  const visibleLinks = getScopedVisiblePrimaryNavLinks(links);

  for (const link of visibleLinks) {
    if (horizontalRectsOverlap(link.getBoundingClientRect(), navUtilitiesRect)) {
      return true;
    }
  }

  if (overflowButtonNode && overflowNode && !overflowNode.classList.contains("hidden")) {
    const overflowRect = overflowButtonNode.getBoundingClientRect();
    if (horizontalRectsOverlap(overflowRect, navUtilitiesRect)) {
      return true;
    }
  }

  if (!primaryNavNode) {
    return false;
  }

  const primaryNavRect = primaryNavNode.getBoundingClientRect();
  return horizontalRectsOverlap(primaryNavRect, navUtilitiesRect);
}

function scopedPrimaryNavOverflowOverlapsVisibleLinks(links, overflowNode, overflowButtonNode) {
  if (!overflowNode || !overflowButtonNode || overflowNode.classList.contains("hidden")) {
    return false;
  }

  const overflowRect = overflowButtonNode.getBoundingClientRect();
  return getScopedVisiblePrimaryNavLinks(links).some((link) => horizontalRectsOverlap(link.getBoundingClientRect(), overflowRect));
}

function updateContextNavPreviewShellLayout() {
  if (
    !contextNavPreviewShell
    || !contextNavShellTopNav
    || !contextNavShellPrimaryNav
    || contextNavShellPrimaryNavLinks.length === 0
    || !contextNavShellPrimaryNavOverflow
    || !contextNavShellPrimaryNavOverflowButton
    || !contextNavShellPrimaryNavOverflowMenu
  ) {
    return;
  }

  const writeContextNavPreviewTop = () => {
    window.requestAnimationFrame(() => {
      const previewSubNav = contextNavPreviewBreadcrumbNav?.closest(".sub-nav");
      const shellRect = contextNavPreviewShell.getBoundingClientRect();
      const topNavBottom = contextNavShellTopNav.getBoundingClientRect().bottom - shellRect.top;
      const mobileMenuBottom = contextNavShellMobileNavMenu && !contextNavShellMobileNavMenu.classList.contains("hidden")
        ? contextNavShellMobileNavMenu.getBoundingClientRect().bottom - shellRect.top
        : 0;
      const previewSubNavBottom = previewSubNav instanceof HTMLElement
        ? previewSubNav.getBoundingClientRect().bottom - shellRect.top
        : 0;
      const headerBottom = Math.max(topNavBottom, mobileMenuBottom, previewSubNavBottom);
      const shellScaleValue = Number.parseFloat(getComputedStyle(contextNavPreviewShell).getPropertyValue("--ui-scale"));
      const shellScale = Number.isFinite(shellScaleValue) && shellScaleValue > 0 ? shellScaleValue : 1;

      contextNavPreviewShell.style.setProperty("--context-nav-shell-top-nav-height", `${Math.ceil(contextNavShellTopNav.offsetHeight)}px`);
      contextNavPreviewShell.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
      contextNavPreviewShell.style.setProperty("--context-nav-top-adjusted", `${headerBottom / shellScale}px`);
    });
  };

  contextNavShellTopNav.classList.remove("force-mobile-nav");
  contextNavShellMobileNavButton?.setAttribute("aria-expanded", "false");
  contextNavShellMobileNavMenu?.classList.add("hidden");
  contextNavShellPrimaryNavOverflow.classList.add("hidden");
  contextNavShellPrimaryNavOverflowButton.textContent = "More";
  contextNavShellPrimaryNavOverflowButton.setAttribute("aria-expanded", "false");
  renderScopedPrimaryNavOverflowMenu(contextNavShellPrimaryNavOverflowMenu, []);

  for (const link of contextNavShellPrimaryNavLinks) {
    setScopedNavLinkHidden(link, false);
  }

  if (
    scopedPrimaryNavFits(contextNavShellPrimaryNav)
    && !scopedPrimaryNavOverlapsUtilities(
      contextNavShellPrimaryNav,
      contextNavShellPrimaryNavLinks,
      contextNavShellPrimaryNavOverflow,
      contextNavShellPrimaryNavOverflowButton,
      contextNavShellNavUtilities,
    )
  ) {
    writeContextNavPreviewTop();
    return;
  }

  contextNavShellPrimaryNavOverflow.classList.remove("hidden");

  while (
    getScopedVisiblePrimaryNavLinks(contextNavShellPrimaryNavLinks).length > 2
    && (
      !scopedPrimaryNavFits(contextNavShellPrimaryNav)
      || scopedPrimaryNavOverlapsUtilities(
        contextNavShellPrimaryNav,
        contextNavShellPrimaryNavLinks,
        contextNavShellPrimaryNavOverflow,
        contextNavShellPrimaryNavOverflowButton,
        contextNavShellNavUtilities,
      )
      || scopedPrimaryNavOverflowOverlapsVisibleLinks(
        contextNavShellPrimaryNavLinks,
        contextNavShellPrimaryNavOverflow,
        contextNavShellPrimaryNavOverflowButton,
      )
    )
  ) {
    const lastVisibleLink = getScopedVisiblePrimaryNavLinks(contextNavShellPrimaryNavLinks).at(-1);
    if (!lastVisibleLink) {
      break;
    }
    setScopedNavLinkHidden(lastVisibleLink, true);
  }

  if (
    scopedPrimaryNavFits(contextNavShellPrimaryNav)
    && !scopedPrimaryNavOverlapsUtilities(
      contextNavShellPrimaryNav,
      contextNavShellPrimaryNavLinks,
      contextNavShellPrimaryNavOverflow,
      contextNavShellPrimaryNavOverflowButton,
      contextNavShellNavUtilities,
    )
    && !scopedPrimaryNavOverflowOverlapsVisibleLinks(
      contextNavShellPrimaryNavLinks,
      contextNavShellPrimaryNavOverflow,
      contextNavShellPrimaryNavOverflowButton,
    )
  ) {
    renderScopedPrimaryNavOverflowMenu(
      contextNavShellPrimaryNavOverflowMenu,
      contextNavShellPrimaryNavLinks.filter((link) => link.classList.contains("hidden")),
    );
  } else {
    contextNavShellPrimaryNavOverflow.classList.add("hidden");
    contextNavShellTopNav.classList.add("force-mobile-nav");
  }

  const isPreviewMobile = contextNavShellTopNav.classList.contains("force-mobile-nav");
  contextNavPreviewShell.classList.toggle("context-nav-preview-mobile-frame", isPreviewMobile);
  contextNavPreviewShell.classList.toggle("context-nav-preview-desktop-frame", !isPreviewMobile);

  if (contextNavPreviewBreadcrumbList && contextNavPreviewBreadcrumbCompact) {
    if (isPreviewMobile) {
      contextNavPreviewBreadcrumbList.classList.add("hidden");
      contextNavPreviewBreadcrumbCompact.classList.add("hidden");
      const previewRow = contextNavPreviewBreadcrumbNav?.closest(".sub-nav");
      previewRow?.classList.remove("sub-nav-compact-layout");
    } else {
      applyResponsiveBreadcrumbPriority({
        list: contextNavPreviewBreadcrumbList,
        container: contextNavPreviewBreadcrumbList.parentElement,
        pageMinusOneLink: contextNavPreviewPageMinusOneLink,
        pageMinusOneItem: contextNavPreviewPageMinusOneItem,
        separatorBeforePageMinusOne: contextNavPreviewSeparatorBeforePageMinusOne,
        collapsedItem: contextNavPreviewCollapsedItem,
        separatorBeforeCollapsed: contextNavPreviewSeparatorBeforeCollapsed,
        compact: contextNavPreviewBreadcrumbCompact,
        closeExpandedMenus: () => {
          contextNavPreviewBreadcrumbCollapseButton?.setAttribute("aria-expanded", "false");
          contextNavPreviewBreadcrumbCollapseMenu?.classList.add("hidden");
          contextNavPreviewBreadcrumbCompactButton?.setAttribute("aria-expanded", "false");
          contextNavPreviewBreadcrumbCompactMenu?.classList.add("hidden");
        },
      });
    }
  }

  writeContextNavPreviewTop();
}

function updateContextNavOffset() {
  if (!shouldTrackHostContextNavOffset()) {
    designSystemShell?.style.removeProperty("--context-nav-top");
    return;
  }

  if (!shellTopNav && !shellSubNav) {
    return;
  }

  const headerBottom = Math.max(
    shellTopNav?.getBoundingClientRect().bottom ?? 0,
    shellSubNav?.getBoundingClientRect().bottom ?? 0,
  );

  designSystemShell?.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
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

function setBreadcrumbItemHidden(node, hidden) {
  node?.classList.toggle("hidden", hidden);
}

function updateBreadcrumbOverflow() {
  if (!breadcrumbList) {
    return;
  }

  applyResponsiveBreadcrumbPriority({
    list: breadcrumbList,
    container: breadcrumbList.parentElement,
    pageMinusOneLink: breadcrumbPageMinusOneLink,
    pageMinusOneItem: breadcrumbPageMinusOneItem,
    separatorBeforePageMinusOne: breadcrumbSeparatorBeforePageMinusOne,
    collapsedItem: breadcrumbCollapsedItem,
    separatorBeforeCollapsed: breadcrumbSeparatorBeforeCollapsed,
    compact: breadcrumbCompact,
    closeExpandedMenus: () => {
      setBreadcrumbMenuOpen(false);
      setBreadcrumbCompactMenuOpen(false);
    },
  });
}

function setMenuOpen(open) {
  profileButton?.setAttribute("aria-expanded", String(open));
  profileMenu?.classList.toggle("hidden", !open);
}

function isMenuOpen() {
  return profileButton?.getAttribute("aria-expanded") === "true";
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

function setBreadcrumbMenuOpen(open) {
  breadcrumbCollapseButton?.setAttribute("aria-expanded", String(open));
  breadcrumbCollapseMenu?.classList.toggle("hidden", !open);
}

function isBreadcrumbMenuOpen() {
  return breadcrumbCollapseButton?.getAttribute("aria-expanded") === "true";
}

function setBreadcrumbCompactMenuOpen(open) {
  breadcrumbCompactButton?.setAttribute("aria-expanded", String(open));
  breadcrumbCompactMenu?.classList.toggle("hidden", !open);
}

function isBreadcrumbCompactMenuOpen() {
  return breadcrumbCompactButton?.getAttribute("aria-expanded") === "true";
}

function setSubNavPreviewBreadcrumbMenuOpen(open) {
  subNavPreviewBreadcrumbCollapseButton?.setAttribute("aria-expanded", String(open));
  subNavPreviewBreadcrumbCollapseMenu?.classList.toggle("hidden", !open);
}

function isSubNavPreviewBreadcrumbMenuOpen() {
  return subNavPreviewBreadcrumbCollapseButton?.getAttribute("aria-expanded") === "true";
}

function setSubNavPreviewBreadcrumbCompactMenuOpen(open) {
  subNavPreviewBreadcrumbCompactButton?.setAttribute("aria-expanded", String(open));
  subNavPreviewBreadcrumbCompactMenu?.classList.toggle("hidden", !open);
}

function isSubNavPreviewBreadcrumbCompactMenuOpen() {
  return subNavPreviewBreadcrumbCompactButton?.getAttribute("aria-expanded") === "true";
}

function setAccessibilityDrawerOpen(open) {
  accessibilityButton?.setAttribute("aria-expanded", String(open));
  accessibilityDrawer?.classList.toggle("hidden", !open);
  accessibilityDrawer?.setAttribute("aria-hidden", String(!open));

  if (open) {
    accessibilityDrawerReturnFocusTarget = accessibilityButton;
    window.requestAnimationFrame(() => {
      accessibilityCloseButton?.focus();
    });
    return;
  }

  if (accessibilityDrawerReturnFocusTarget instanceof HTMLElement) {
    accessibilityDrawerReturnFocusTarget.focus();
  }
}

function isAccessibilityDrawerOpen() {
  return accessibilityButton?.getAttribute("aria-expanded") === "true";
}

function setFilterPanelOpen(open) {
  filterPanelButton?.setAttribute("aria-expanded", String(open));
  filterPanel?.classList.toggle("hidden", !open);
  filterPanel?.setAttribute("aria-hidden", String(!open));
}

function isFilterPanelOpen() {
  return filterPanelButton?.getAttribute("aria-expanded") === "true";
}

function setFilterOptionsPanelOpen(open) {
  filterOptionsPanel?.classList.toggle("hidden", !open);
  filterOptionsPanel?.setAttribute("aria-hidden", String(!open));
}

function isFilterOptionsPanelOpen() {
  return !filterOptionsPanel?.classList.contains("hidden");
}

function renderFilterOptions(category, query = "") {
  if (!filterOptionsList || !filterOptionsTitle) {
    return;
  }

  activeFilterCategory = category;
  const options = filterOptionSets[category] ?? [];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(normalizedQuery),
  );

  filterOptionsTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  filterOptionsList.innerHTML = visibleOptions
    .map(
      (option) =>
        `<button class="filter-option-item" type="button" role="listitem">${option}</button>`,
    )
    .join("");
}

function setContextNavMoreOpen(open) {
  contextNavMoreButton?.setAttribute("aria-expanded", String(open));
  contextNavMoreMenu?.classList.toggle("hidden", !open);
}

function isContextNavMoreOpen() {
  return contextNavMoreButton?.getAttribute("aria-expanded") === "true";
}

function setPreviewWidth(width) {
  if (!previewFrame) {
    return;
  }

  previewFrame.style.setProperty("--top-nav-preview-width", `${width}px`);
  setCanonicalRenderLayoutWidth(topNavCanonicalRenderLayout, Number(width) + 96);

  if (previewWidthInput) {
    previewWidthInput.value = String(width);
  }

  if (previewWidthReadout) {
    previewWidthReadout.textContent = `Preview width: ${width}px`;
  }

  for (const button of previewWidthPresetButtons) {
    button.classList.toggle("active", button.dataset.previewWidthPreset === String(width));
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ width }));
}

function setLabelText(node, value) {
  if (!node) {
    return;
  }

  node.textContent = value;
  node.dataset.tooltip = value;
  node.removeAttribute("title");
}

function ensureBreadcrumbLabel(node) {
  if (!(node instanceof HTMLElement)) {
    return null;
  }

  let label = node.querySelector(".breadcrumb-label");
  if (label instanceof HTMLElement) {
    return label;
  }

  const text = node.textContent ?? "";
  node.textContent = "";
  label = document.createElement("span");
  label.className = "breadcrumb-label";
  label.textContent = text;
  node.append(label);
  return label;
}

function syncOverflowTooltip(node) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  node.classList.add("tooltip-anchor");
  const labelNode = ensureBreadcrumbLabel(node);
  const measurementNode = labelNode ?? node;
  const isHomeNode = node === breadcrumbHomeLink || node === subNavPreviewHomeLink;
  const isSubNavPreviewNode = Boolean(node.closest("#sub-nav-preview-shell"));
  const canonicalPreviewStillSettling =
    subNavSurfaceMode === "canonical"
    && isSubNavPreviewNode
    && subNavPreviewShell?.dataset.renderStatus !== "ready";
  if (isHomeNode) {
    node.classList.remove("breadcrumb-home-icon-only");
  }

  if (canonicalPreviewStillSettling) {
    delete node.dataset.tooltip;
    return;
  }

  if (node.closest(".hidden")) {
    delete node.dataset.tooltip;
    return;
  }

  const label = measurementNode.textContent?.trim() ?? "";
  const forceCanonicalTooltip =
    subNavPreviewShell?.dataset.breadcrumbCanonicalMode === "button-truncation"
    && (
      node === subNavPreviewPageMinusOneLink
      || node === subNavPreviewCurrentLabel
    );
  const parentItem = node.closest("li");
  const nodeTruncated = measurementNode.scrollWidth > measurementNode.clientWidth + 1;
  const parentTruncated =
    parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
  const isTruncated = forceCanonicalTooltip || nodeTruncated || parentTruncated;

  if (isHomeNode) {
    node.classList.toggle("breadcrumb-home-icon-only", isTruncated);
  }

  if (label && isTruncated) {
    node.dataset.tooltip = label;
    return;
  }

  delete node.dataset.tooltip;
}

function updateBreadcrumbOverflowTooltips() {
  for (const node of breadcrumbTooltipNodes) {
    syncOverflowTooltip(node);
  }
}

function setBreadcrumbButtonLabel(node, label) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const labelNode = ensureBreadcrumbLabel(node);
  if (labelNode) {
    labelNode.textContent = label;
    return;
  }

  node.textContent = label;
}

function isBreadcrumbNodeTruncated(node) {
  if (!(node instanceof HTMLElement)) {
    return false;
  }

  const measurementNode = ensureBreadcrumbLabel(node) ?? node;
  const parentItem = node.closest("li");
  const nodeTruncated = measurementNode.scrollWidth > measurementNode.clientWidth + 1;
  const parentTruncated = parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
  return nodeTruncated || parentTruncated;
}

function syncBreadcrumbCompactLayout(compact) {
  const row = compact?.closest(".sub-nav");
  if (!(row instanceof HTMLElement)) {
    return;
  }

  row.classList.toggle("sub-nav-compact-layout", !compact.classList.contains("hidden"));
}

function syncSubNavPreviewRowLayout(state) {
  const row = subNavPreviewBreadcrumbNav?.closest(".sub-nav");
  if (!(row instanceof HTMLElement)) {
    return;
  }

  const preserveBreadcrumbLane = state === "reduced-page-minus-one" || state === "reduced-middle" || state === "compact";
  row.classList.toggle("sub-nav-compact-layout", preserveBreadcrumbLane);
}

function applyResponsiveBreadcrumbPriority({
  list,
  container,
  pageMinusOneLink,
  pageMinusOneItem,
  separatorBeforePageMinusOne,
  collapsedItem,
  separatorBeforeCollapsed,
  compact,
  closeExpandedMenus,
}) {
  if (!list) {
    return;
  }

  const availableWidth = container?.clientWidth ?? list.clientWidth;

  const fullPageMinusOneLabel = pageMinusOneLink?.dataset.fullLabel ?? pageMinusOneLink?.textContent?.trim() ?? "";
  const shortPageMinusOneLabel = pageMinusOneLink?.dataset.shortLabel ?? fullPageMinusOneLabel;

  setBreadcrumbItemHidden(pageMinusOneItem, false);
  setBreadcrumbItemHidden(separatorBeforePageMinusOne, false);
  setBreadcrumbItemHidden(collapsedItem, false);
  setBreadcrumbItemHidden(separatorBeforeCollapsed, false);
  compact?.classList.add("hidden");
  syncBreadcrumbCompactLayout(compact);
  list.classList.remove("hidden");

  if (pageMinusOneLink) {
    setBreadcrumbButtonLabel(pageMinusOneLink, fullPageMinusOneLabel);
  }

  if (pageMinusOneLink && isBreadcrumbNodeTruncated(pageMinusOneLink)) {
    setBreadcrumbButtonLabel(pageMinusOneLink, shortPageMinusOneLabel);
  }

  if (list.scrollWidth <= availableWidth) {
    syncBreadcrumbCompactLayout(compact);
    updateBreadcrumbOverflowTooltips();
    return;
  }

  setBreadcrumbItemHidden(pageMinusOneItem, true);
  setBreadcrumbItemHidden(separatorBeforePageMinusOne, true);

  if (list.scrollWidth <= availableWidth) {
    syncBreadcrumbCompactLayout(compact);
    updateBreadcrumbOverflowTooltips();
    return;
  }

  setBreadcrumbItemHidden(collapsedItem, true);
  setBreadcrumbItemHidden(separatorBeforeCollapsed, true);

  if (list.scrollWidth <= availableWidth) {
    syncBreadcrumbCompactLayout(compact);
    updateBreadcrumbOverflowTooltips();
    return;
  }

  list.classList.add("hidden");
  compact?.classList.remove("hidden");
  syncBreadcrumbCompactLayout(compact);
  closeExpandedMenus?.();
  updateBreadcrumbOverflowTooltips();
}

function applyTopNavPreviewFixture(fixtureName) {
  const fixture = topNavPreviewFixtures[fixtureName];
  if (!fixture) {
    return;
  }

  activeTopNavPreviewFixture = fixtureName;

  setLabelText(previewBrandLabel, fixture.brand);
  setLabelText(previewProfileLabel, fixture.profile);
  setLabelText(mobileProfileButton, fixture.mobileProfile);
  setLabelText(profileLanguageButton, fixture.menu[0]);
  setLabelText(closeProfileMenuButton, fixture.menu[1]);
  setLabelText(mobileLanguageButton, fixture.mobileMenu[2]);

  for (const [index, label] of fixture.primary.entries()) {
    setLabelText(primaryNavLinks[index], label);
    setLabelText(mobileNavLinks[index], label);
  }

  const mobileMenuLabels = [
    mobileProfileMenu?.querySelector('a[href="/design-system/profile"]'),
    mobileProfileMenu?.querySelector('a[href="/design-system/profile/preferences"]'),
    mobileLanguageButton,
    mobileProfileMenu?.querySelector('a[href="/design-system/profile/sign-out"]'),
  ];

  for (const [index, label] of fixture.mobileMenu.entries()) {
    setLabelText(mobileMenuLabels[index], label);
  }

  for (const button of previewFixtureButtons) {
    button.classList.toggle("active", button.dataset.previewFixture === fixtureName);
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ fixture: fixtureName }));
}

function applyTopNavPreviewOpenState(openState) {
  activeTopNavPreviewOpenState = openState;

  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);

  if (openState === "overflow" && !primaryNavOverflow?.classList.contains("hidden")) {
    setPrimaryNavOverflowOpen(true);
  }

  if (openState === "profile") {
    setMenuOpen(true);
  }

  if (openState === "mobile" && topNav?.classList.contains("force-mobile-nav")) {
    setMobileNavOpen(true);
  }

  for (const button of previewOpenStateButtons) {
    button.classList.toggle("active", button.dataset.previewOpenState === openState);
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ open: openState }));
}

function getActiveLanguage() {
  return languageOptions.find((language) => language.code === activeLanguageCode) ?? languageOptions[0];
}

function syncLanguageTriggers() {
  const activeLanguage = getActiveLanguage();
  if (profileLanguageButton) {
    profileLanguageButton.textContent = `Language: ${activeLanguage.name}`;
  }

  if (mobileLanguageButton) {
    mobileLanguageButton.textContent = `Language: ${activeLanguage.name}`;
  }
}

function renderLanguageOptions() {
  if (!languageOptionList) {
    return;
  }

  languageOptionList.innerHTML = languageOptions
    .map((language) => {
      const isActive = language.code === activeLanguageCode;
      const activeClass = isActive ? " active" : "";
      const selectedState = String(isActive);
      const check = isActive ? '<span class="language-option-check" aria-hidden="true">Selected</span>' : "";

      return `
        <button
          class="language-option${activeClass}"
          type="button"
          role="option"
          data-language-code="${language.code}"
          aria-selected="${selectedState}"
        >
          <span class="language-option-label">
            <span class="language-option-name">${language.name}</span>
            <span class="language-option-detail">${language.detail}</span>
          </span>
          ${check}
        </button>
      `;
    })
    .join("");
}

function setLanguageModalOpen(open, trigger = null) {
  languageModal?.classList.toggle("hidden", !open);

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
  syncLanguageTriggers();
  renderLanguageOptions();
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}

function applyAccent(hex) {
  const root = document.documentElement;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-strong", mixWithWhite(hex, 0.12));
  root.style.setProperty("--accent-soft", mixWithWhite(hex, 0.86));
  root.style.setProperty("--accent-text", "#1f2540");

  for (const button of accentButtons) {
    const isActive = button.dataset.accent === hex;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  syncTopNavPreviewUrl();
  syncSubNavPreviewUrl({ accent: hex });
  syncContextNavPreviewUrl({ accent: hex });
}

function applyTheme(theme) {
  const scopeNode = getAppearanceScopeNode();
  if (scopeNode instanceof HTMLElement && scopeNode !== document.documentElement) {
    scopeNode.dataset.themeScope = theme;
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme;
  }
  for (const button of themeButtons) {
    const isActive = button.dataset.themeOption === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ theme }));
  syncSubNavPreviewUrl({ theme });
  syncContextNavPreviewUrl({ theme });
}

function applyDirection(direction) {
  if (shouldUseLocalCanonicalDirection()) {
    if (topNavSurfaceMode === "canonical") {
      topNavPreviewCanvas?.setAttribute("dir", direction);
    }
    if (subNavSurfaceMode === "canonical") {
      subNavPreviewShell?.setAttribute("dir", direction);
    }
    if (contextNavSurfaceMode === "canonical") {
      contextNavPreviewShell?.setAttribute("dir", direction);
    }
  } else {
    document.documentElement.setAttribute("dir", direction);
  }
  for (const button of directionButtons) {
    const isActive = button.dataset.directionOption === direction;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  updateDisplaySettingsCopy(direction);

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ direction }));
  syncSubNavPreviewUrl({ direction });
  syncContextNavPreviewUrl({ direction });
}

function applyMagnification(value) {
  const amount = Number(value);
  const scale = 1 + amount / 200;
  const scopeNode = getMagnificationScopeNode();
  if (scopeNode instanceof HTMLElement && scopeNode !== document.documentElement) {
    if (amount === 0) {
      scopeNode.style.removeProperty("--ui-scale");
      delete scopeNode.dataset.magnification;
    } else {
      scopeNode.style.setProperty("--ui-scale", String(scale));
      scopeNode.dataset.magnification = String(amount);
    }
    document.documentElement.style.removeProperty("--ui-scale");
  } else {
    document.documentElement.style.setProperty("--ui-scale", String(scale));
  }
  for (const button of magnificationButtons) {
    const isActive = button.dataset.magnificationOption === String(amount);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  syncTopNavPreviewUrl();
  updateTopNavCanonicalMeta(getCurrentTopNavPreviewState({ magnification: amount }));
  syncSubNavPreviewUrl({ magnification: amount });
  syncContextNavPreviewUrl({ magnification: amount });

  if (contextNavSurfaceMode === "canonical") {
    updateContextNavPreviewShellLayout();
  }
}

profileButton?.addEventListener("click", () => {
  setMenuOpen(!isMenuOpen());
});

mobileNavButton?.addEventListener("click", () => {
  setMobileNavOpen(!isMobileNavOpen());
});

mobileProfileButton?.addEventListener("click", () => {
  setMobileProfileOpen(!isMobileProfileOpen());
});

breadcrumbCollapseButton?.addEventListener("click", () => {
  setBreadcrumbMenuOpen(!isBreadcrumbMenuOpen());
});

breadcrumbCompactButton?.addEventListener("click", () => {
  setBreadcrumbCompactMenuOpen(!isBreadcrumbCompactMenuOpen());
});

subNavPreviewBreadcrumbCollapseButton?.addEventListener("click", () => {
  setSubNavPreviewBreadcrumbCompactMenuOpen(false);
  setSubNavPreviewBreadcrumbMenuOpen(!isSubNavPreviewBreadcrumbMenuOpen());
});

subNavPreviewBreadcrumbCompactButton?.addEventListener("click", () => {
  setSubNavPreviewBreadcrumbMenuOpen(false);
  setSubNavPreviewBreadcrumbCompactMenuOpen(!isSubNavPreviewBreadcrumbCompactMenuOpen());
});

accessibilityButton?.addEventListener("click", () => {
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(!isAccessibilityDrawerOpen());
});

filterPanelButton?.addEventListener("click", () => {
  setAccessibilityDrawerOpen(false);
  setFilterOptionsPanelOpen(false);
  setFilterPanelOpen(!isFilterPanelOpen());
});

contextNavMoreButton?.addEventListener("click", () => {
  setContextNavMoreOpen(!isContextNavMoreOpen());
});

closeProfileMenuButton?.addEventListener("click", () => {
  setMenuOpen(false);
  profileButton?.focus();
});

profileLanguageButton?.addEventListener("click", () => {
  setMenuOpen(false);
  setLanguageModalOpen(true, profileLanguageButton);
});

mobileLanguageButton?.addEventListener("click", () => {
  setMobileProfileOpen(false);
  setLanguageModalOpen(true, mobileLanguageButton);
});

languageModalCloseButton?.addEventListener("click", () => {
  setLanguageModalOpen(false);
});

languageModalBackdrop?.addEventListener("click", () => {
  setLanguageModalOpen(false);
});

languageOptionList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest("[data-language-code]");
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const languageCode = button.dataset.languageCode;
  if (!languageCode) {
    return;
  }

  selectLanguage(languageCode);
  setLanguageModalOpen(false);
});

previewWidthInput?.addEventListener("input", () => {
  const width = Number(previewWidthInput.value);
  setPreviewWidth(width);
  window.requestAnimationFrame(() => {
    updatePrimaryNavOverflow();
    applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
  });
});

for (const button of previewWidthPresetButtons) {
  button.addEventListener("click", () => {
    const width = Number(button.dataset.previewWidthPreset ?? "1120");
    setPreviewWidth(width);
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
    });
  });
}

subNavPreviewWidthInput?.addEventListener("input", () => {
  applySubNavPreviewState(
    getCurrentSubNavPreviewState({
      width: subNavPreviewWidthInput.value,
    }),
  );
});

for (const button of subNavPreviewWidthPresetButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        width: button.dataset.subNavWidthPreset ?? subNavPreviewDefaults.width,
      }),
    );
  });
}

contextNavPreviewWidthInput?.addEventListener("input", () => {
  applyContextNavPreviewState(
    getCurrentContextNavPreviewState({
      width: contextNavPreviewWidthInput.value,
    }),
  );
});

contextNavPreviewHeightInput?.addEventListener("input", () => {
  applyContextNavPreviewState(
    getCurrentContextNavPreviewState({
      height: contextNavPreviewHeightInput.value,
    }),
  );
});

for (const button of contextNavPreviewWidthPresetButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        width: button.dataset.contextNavWidthPreset ?? contextNavPreviewDefaults.width,
      }),
    );
  });
}

for (const button of contextNavPreviewHeightPresetButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        height: button.dataset.contextNavHeightPreset ?? contextNavPreviewDefaults.height,
      }),
    );
  });
}

for (const button of contextNavPreviewStackButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        stack: button.dataset.contextNavStack ?? contextNavPreviewDefaults.stack,
      }),
    );
  });
}

for (const button of contextNavPreviewLabelButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        labels: button.dataset.contextNavLabels ?? contextNavPreviewDefaults.labels,
      }),
    );
  });
}

for (const button of contextNavPreviewOpenButtons) {
  button.addEventListener("click", () => {
    applyContextNavPreviewState(
      getCurrentContextNavPreviewState({
        open: button.dataset.contextNavOpen ?? contextNavPreviewDefaults.open,
      }),
    );
  });
}

for (const button of subNavPreviewStateButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        state: button.dataset.subNavState ?? subNavPreviewDefaults.state,
      }),
    );
  });
}

for (const button of subNavPreviewSearchStateButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        search: button.dataset.subNavSearchState ?? subNavPreviewDefaults.search,
      }),
    );
  });
}

for (const button of subNavPreviewLocaleButtons) {
  button.addEventListener("click", () => {
    applySubNavPreviewState(
      getCurrentSubNavPreviewState({
        locale: button.dataset.subNavLocale ?? subNavPreviewDefaults.locale,
      }),
    );
  });
}

for (const button of previewFixtureButtons) {
  button.addEventListener("click", () => {
    applyTopNavPreviewFixture(button.dataset.previewFixture ?? "standard");
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
    });
  });
}

for (const button of previewOpenStateButtons) {
  button.addEventListener("click", () => {
    const previewState = normalizePreviewState({
      width: previewWidthInput?.value,
      fixture: activeTopNavPreviewFixture,
      open: button.dataset.previewOpenState ?? "closed",
      theme: getCurrentSurfaceTheme(),
      direction: getTopNavSurfaceDirection(),
      magnification: Array.from(magnificationButtons).find((item) => item.classList.contains("active"))
        ?.dataset.magnificationOption,
      accent: Array.from(accentButtons).find((item) => item.classList.contains("active"))?.dataset.accent,
    });

    setPreviewWidth(previewState.width);

    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(previewState.open);
    });
  });
}

primaryNavOverflowButton?.addEventListener("click", () => {
  setPrimaryNavOverflowOpen(!isPrimaryNavOverflowOpen());
});

accessibilityCloseButton?.addEventListener("click", () => {
  setAccessibilityDrawerOpen(false);
});

filterPanelCloseButton?.addEventListener("click", () => {
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  filterPanelButton?.focus();
});

filterOptionsCloseButton?.addEventListener("click", () => {
  setFilterOptionsPanelOpen(false);
  filterOptionsCloseButton?.blur();
});

for (const button of filterMenuButtons) {
  button.addEventListener("click", () => {
    const category = button.dataset.filterTarget ?? "status";
    renderFilterOptions(category);
    if (filterOptionsSearch) {
      filterOptionsSearch.value = "";
    }
    setFilterOptionsPanelOpen(true);
  });
}

filterOptionsSearch?.addEventListener("input", () => {
  renderFilterOptions(activeFilterCategory, filterOptionsSearch.value);
});

for (const button of themeButtons) {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.themeOption ?? "normal");
    applySubNavPreviewState(getCurrentSubNavPreviewState());
    applyContextNavPreviewState(getCurrentContextNavPreviewState());
  });
}

for (const button of directionButtons) {
  button.addEventListener("click", () => {
    applyDirection(button.dataset.directionOption ?? "ltr");
    applySubNavPreviewState(getCurrentSubNavPreviewState());
    applyContextNavPreviewState(getCurrentContextNavPreviewState());
  });
}

for (const button of accentButtons) {
  button.addEventListener("click", () => {
    applyAccent(button.dataset.accent ?? "#635bff");
    applySubNavPreviewState(getCurrentSubNavPreviewState());
    applyContextNavPreviewState(getCurrentContextNavPreviewState());
  });
}

for (const button of magnificationButtons) {
  button.addEventListener("click", () => {
    applyMagnification(button.dataset.magnificationOption ?? "0");
    window.requestAnimationFrame(() => {
      updatePrimaryNavOverflow();
      applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
      applySubNavPreviewState(getCurrentSubNavPreviewState());
      applyContextNavPreviewState(getCurrentContextNavPreviewState());
    });
  });
}

const initialTopNavPreviewState = getTopNavPreviewStateFromUrl();
const initialSubNavPreviewState = getSubNavPreviewStateFromUrl();
const initialContextNavPreviewState = getContextNavPreviewStateFromUrl();

updateContextNavOffset();
updatePrimaryNavOverflow();
updateBreadcrumbOverflow();
updateBreadcrumbOverflowTooltips();
updateContextNavReviewFrameOffset();
updateContextNavPreviewShellLayout();
const initialTheme = previewFrame
  ? initialTopNavPreviewState.theme
  : (subNavPreviewFrame ? initialSubNavPreviewState.theme : initialContextNavPreviewState.theme);
const initialDirection = previewFrame
  ? initialTopNavPreviewState.direction
  : (subNavPreviewFrame ? initialSubNavPreviewState.direction : initialContextNavPreviewState.direction);
const initialMagnification = previewFrame
  ? initialTopNavPreviewState.magnification
  : (subNavPreviewFrame ? initialSubNavPreviewState.magnification : initialContextNavPreviewState.magnification);
const initialAccent = previewFrame
  ? initialTopNavPreviewState.accent
  : (subNavPreviewFrame ? initialSubNavPreviewState.accent : initialContextNavPreviewState.accent);
applyTheme(initialTheme);
applyDirection(initialDirection);
applyAccent(initialAccent);
applyMagnification(initialMagnification);
renderFilterOptions(activeFilterCategory);
syncLanguageTriggers();
renderLanguageOptions();
if (shouldTrackHostContextNavOffset()) {
  scheduleContextNavOffsetUpdate();
}
applyTopNavPreviewFixture(initialTopNavPreviewState.fixture);
setPreviewWidth(initialTopNavPreviewState.width);
window.requestAnimationFrame(() => {
  updatePrimaryNavOverflow();
  applyTopNavPreviewOpenState(initialTopNavPreviewState.open);
});
applySubNavPreviewState(initialSubNavPreviewState);
applyContextNavPreviewState(initialContextNavPreviewState);

window.addEventListener("resize", () => {
  if (shouldTrackHostContextNavOffset()) {
    scheduleContextNavOffsetUpdate();
  }
  updatePrimaryNavOverflow();
  updateBreadcrumbOverflow();
  updateBreadcrumbOverflowTooltips();
  updateContextNavReviewFrameOffset();
  updateContextNavPreviewShellLayout();
  applyTopNavPreviewOpenState(activeTopNavPreviewOpenState);
  applyContextNavPreviewState(getCurrentContextNavPreviewState());
});

window.addEventListener("scroll", () => {
  if (shouldTrackHostContextNavOffset()) {
    scheduleContextNavOffsetUpdate();
  }
  updateContextNavReviewFrameOffset();
  updateContextNavPreviewShellLayout();
}, { passive: true });

contextNavPreviewContent?.addEventListener("scroll", () => {
  updateContextNavPreviewShellLayout();
}, { passive: true });

if ("ResizeObserver" in window) {
  const headerObserver = new ResizeObserver(() => {
    if (shouldTrackHostContextNavOffset()) {
      scheduleContextNavOffsetUpdate();
    }
    updateBreadcrumbOverflow();
    updateContextNavReviewFrameOffset();
    updateContextNavPreviewShellLayout();
  });

  if (shellTopNav) {
    headerObserver.observe(shellTopNav);
  }

  if (primaryNav) {
    headerObserver.observe(primaryNav);
  }

  if (shellSubNav) {
    headerObserver.observe(shellSubNav);
  }

  if (breadcrumbNav) {
    headerObserver.observe(breadcrumbNav);
  }

  if (breadcrumbList) {
    headerObserver.observe(breadcrumbList);
  }

  if (previewFrame) {
    headerObserver.observe(previewFrame);
  }

  if (subNavPreviewFrame) {
    headerObserver.observe(subNavPreviewFrame);
  }

  if (contextNavPreviewFrame) {
    headerObserver.observe(contextNavPreviewFrame);
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (target.closest("#context-nav-more-filter")) {
    setContextNavMoreOpen(false);
    setAccessibilityDrawerOpen(false);
    setFilterOptionsPanelOpen(false);
    setFilterPanelOpen(true);
    return;
  }

  if (target.closest("#context-nav-more-accessibility")) {
    setContextNavMoreOpen(false);
    setFilterPanelOpen(false);
    setFilterOptionsPanelOpen(false);
    setAccessibilityDrawerOpen(true);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (profileButton?.contains(target) || profileMenu?.contains(target)) {
    return;
  }

  if (languageModal?.contains(target)) {
    return;
  }

  if (primaryNavOverflowButton?.contains(target) || primaryNavOverflowMenu?.contains(target)) {
    return;
  }

  if (
    breadcrumbCollapseButton?.contains(target) ||
    breadcrumbCollapseMenu?.contains(target) ||
    breadcrumbCompactButton?.contains(target) ||
    breadcrumbCompactMenu?.contains(target) ||
    subNavPreviewBreadcrumbCollapseButton?.contains(target) ||
    subNavPreviewBreadcrumbCollapseMenu?.contains(target) ||
    subNavPreviewBreadcrumbCompactButton?.contains(target) ||
    subNavPreviewBreadcrumbCompactMenu?.contains(target)
  ) {
    return;
  }

  if (
    mobileNavButton?.contains(target) ||
    mobileNavMenu?.contains(target) ||
    mobileProfileButton?.contains(target) ||
    mobileProfileMenu?.contains(target)
  ) {
    return;
  }

  if (
    filterPanelButton?.contains(target) ||
    filterPanel?.contains(target) ||
    filterOptionsPanel?.contains(target)
  ) {
    return;
  }

  if (accessibilityButton?.contains(target) || accessibilityDrawer?.contains(target)) {
    return;
  }

  if (contextNavMoreButton?.contains(target) || contextNavMoreMenu?.contains(target)) {
    return;
  }

  setMenuOpen(false);
  setPrimaryNavOverflowOpen(false);
  setMobileNavOpen(false);
  setMobileProfileOpen(false);
  setBreadcrumbMenuOpen(false);
  setBreadcrumbCompactMenuOpen(false);
  setSubNavPreviewBreadcrumbMenuOpen(false);
  setSubNavPreviewBreadcrumbCompactMenuOpen(false);
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(false);
  setContextNavMoreOpen(false);
  setLanguageModalOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (isLanguageModalOpen()) {
    setLanguageModalOpen(false);
  }

  if (isMenuOpen()) {
    setMenuOpen(false);
    profileButton?.focus();
  }

  if (isPrimaryNavOverflowOpen()) {
    setPrimaryNavOverflowOpen(false);
    primaryNavOverflowButton?.focus();
  }

  if (isMobileNavOpen()) {
    setMobileNavOpen(false);
    mobileNavButton?.focus();
  }

  if (isMobileProfileOpen()) {
    setMobileProfileOpen(false);
    mobileProfileButton?.focus();
  }

  if (isBreadcrumbMenuOpen()) {
    setBreadcrumbMenuOpen(false);
    breadcrumbCollapseButton?.focus();
  }

  if (isBreadcrumbCompactMenuOpen()) {
    setBreadcrumbCompactMenuOpen(false);
    breadcrumbCompactButton?.focus();
  }

  if (isSubNavPreviewBreadcrumbMenuOpen()) {
    setSubNavPreviewBreadcrumbMenuOpen(false);
    subNavPreviewBreadcrumbCollapseButton?.focus();
  }

  if (isSubNavPreviewBreadcrumbCompactMenuOpen()) {
    setSubNavPreviewBreadcrumbCompactMenuOpen(false);
    subNavPreviewBreadcrumbCompactButton?.focus();
  }

  if (isAccessibilityDrawerOpen()) {
    setAccessibilityDrawerOpen(false);
    accessibilityButton?.focus();
  }

  if (isFilterPanelOpen()) {
    setFilterPanelOpen(false);
    setFilterOptionsPanelOpen(false);
    filterPanelButton?.focus();
  }

  if (isFilterOptionsPanelOpen()) {
    setFilterOptionsPanelOpen(false);
    filterOptionsCloseButton?.focus();
  }

  if (isContextNavMoreOpen()) {
    setContextNavMoreOpen(false);
    contextNavMoreButton?.focus();
  }

});
