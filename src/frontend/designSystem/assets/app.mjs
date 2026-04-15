const profileButton = document.getElementById("profile-menu-button");
const profileMenu = document.getElementById("profile-menu");
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
const mobileProfileButton = document.getElementById("mobile-profile-button");
const mobileProfileMenu = document.getElementById("mobile-profile-menu");
const breadcrumbNav = document.querySelector(".breadcrumb-nav");
const breadcrumbList = document.getElementById("breadcrumb-list");
const breadcrumbCompact = document.getElementById("breadcrumb-compact");
const breadcrumbCompactButton = document.getElementById("breadcrumb-compact-button");
const breadcrumbCompactMenu = document.getElementById("breadcrumb-compact-menu");
const breadcrumbCollapseButton = document.getElementById("breadcrumb-collapse-button");
const breadcrumbCollapseMenu = document.getElementById("breadcrumb-collapse-menu");
const breadcrumbCollapsedItem = document.getElementById("breadcrumb-collapsed-item");
const breadcrumbSeparatorBeforeCollapsed = document.getElementById("breadcrumb-separator-before-collapsed");
const breadcrumbPageMinusOneItem = document.getElementById("breadcrumb-page-minus-one-item");
const breadcrumbSeparatorBeforePageMinusOne = document.getElementById("breadcrumb-separator-before-page-minus-one");
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

const filterOptionSets = {
  status: ["All", "Ready", "Draft", "In Review", "Blocked"],
  surface: ["Navigation", "Forms", "Tables", "Data Entry", "Dashboards"],
  lifecycle: ["Current", "Deprecated", "Experimental", "Archived", "Planned"],
};

let activeFilterCategory = "status";

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
  if (!primaryNav) {
    return true;
  }

  return primaryNav.scrollWidth <= primaryNav.clientWidth;
}

function primaryNavOverlapsUtilities() {
  if (!navUtilities) {
    return false;
  }

  const navUtilitiesRect = navUtilities.getBoundingClientRect();
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

  if (!primaryNav) {
    return false;
  }

  const primaryNavRect = primaryNav.getBoundingClientRect();
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
  if (!primaryNav || !topNav || primaryNavLinks.length === 0 || !primaryNavOverflow || !primaryNavOverflowButton) {
    return;
  }

  topNav.classList.remove("force-mobile-nav");
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

  const navigationWidth = measurePrimaryNavOverflowButton("Navigation");
  primaryNavOverflowButton.textContent = "More";
  primaryNavOverflow.classList.remove("hidden");

  while (
    getVisiblePrimaryNavLinks().length > 1
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

  for (const link of primaryNavLinks) {
    setPrimaryNavLinkHidden(link, true);
  }

  if (navigationWidth <= primaryNav.clientWidth) {
    primaryNavOverflowButton.textContent = "Navigation";
    renderPrimaryNavOverflowMenu(primaryNavLinks);
    primaryNavOverflow.classList.remove("hidden");
    return;
  }

  primaryNavOverflow.classList.add("hidden");
  setPrimaryNavOverflowOpen(false);
  topNav.classList.add("force-mobile-nav");
}

function updateContextNavOffset() {
  const headerBottom = Math.max(
    topNav?.getBoundingClientRect().bottom ?? 0,
    subNav?.getBoundingClientRect().bottom ?? 0,
  );

  document.documentElement.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
}

function setBreadcrumbItemHidden(node, hidden) {
  node?.classList.toggle("hidden", hidden);
}

function updateBreadcrumbOverflow() {
  if (!breadcrumbList) {
    return;
  }

  const breadcrumbContainer = breadcrumbList.parentElement;
  const availableWidth = breadcrumbContainer?.clientWidth ?? breadcrumbList.clientWidth;

  setBreadcrumbItemHidden(breadcrumbPageMinusOneItem, false);
  setBreadcrumbItemHidden(breadcrumbSeparatorBeforePageMinusOne, false);
  setBreadcrumbItemHidden(breadcrumbCollapsedItem, false);
  setBreadcrumbItemHidden(breadcrumbSeparatorBeforeCollapsed, false);
  breadcrumbCompact?.classList.add("hidden");
  breadcrumbList.classList.remove("hidden");

  if (breadcrumbList.scrollWidth <= availableWidth) {
    return;
  }

  setBreadcrumbItemHidden(breadcrumbPageMinusOneItem, true);
  setBreadcrumbItemHidden(breadcrumbSeparatorBeforePageMinusOne, true);

  if (breadcrumbList.scrollWidth <= availableWidth) {
    return;
  }

  setBreadcrumbItemHidden(breadcrumbCollapsedItem, true);
  setBreadcrumbItemHidden(breadcrumbSeparatorBeforeCollapsed, true);

  if (breadcrumbList.scrollWidth <= availableWidth) {
    return;
  }

  breadcrumbList.classList.add("hidden");
  breadcrumbCompact?.classList.remove("hidden");
  setBreadcrumbMenuOpen(false);
  setBreadcrumbCompactMenuOpen(false);
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

function setAccessibilityDrawerOpen(open) {
  accessibilityButton?.setAttribute("aria-expanded", String(open));
  accessibilityDrawer?.classList.toggle("hidden", !open);
  accessibilityDrawer?.setAttribute("aria-hidden", String(!open));
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
    button.classList.toggle("active", button.dataset.accent === hex);
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  for (const button of themeButtons) {
    button.classList.toggle("active", button.dataset.themeOption === theme);
  }
}

function applyDirection(direction) {
  document.documentElement.setAttribute("dir", direction);
  for (const button of directionButtons) {
    button.classList.toggle("active", button.dataset.directionOption === direction);
  }
}

function applyMagnification(value) {
  const amount = Number(value);
  const scale = 1 + amount / 200;
  document.documentElement.style.setProperty("--ui-scale", String(scale));
  for (const button of magnificationButtons) {
    button.classList.toggle("active", button.dataset.magnificationOption === String(amount));
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

contextNavMoreFilterButton?.addEventListener("click", () => {
  setContextNavMoreOpen(false);
  setAccessibilityDrawerOpen(false);
  setFilterOptionsPanelOpen(false);
  setFilterPanelOpen(true);
});

contextNavMoreAccessibilityButton?.addEventListener("click", () => {
  setContextNavMoreOpen(false);
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(true);
});

closeProfileMenuButton?.addEventListener("click", () => {
  setMenuOpen(false);
  profileButton?.focus();
});

primaryNavOverflowButton?.addEventListener("click", () => {
  setPrimaryNavOverflowOpen(!isPrimaryNavOverflowOpen());
});

accessibilityCloseButton?.addEventListener("click", () => {
  setAccessibilityDrawerOpen(false);
  accessibilityButton?.focus();
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
  });
}

for (const button of directionButtons) {
  button.addEventListener("click", () => {
    applyDirection(button.dataset.directionOption ?? "ltr");
  });
}

for (const button of accentButtons) {
  button.addEventListener("click", () => {
    applyAccent(button.dataset.accent ?? "#635bff");
  });
}

for (const button of magnificationButtons) {
  button.addEventListener("click", () => {
    applyMagnification(button.dataset.magnificationOption ?? "0");
  });
}

updateContextNavOffset();
updatePrimaryNavOverflow();
updateBreadcrumbOverflow();
applyTheme("normal");
applyDirection("ltr");
applyAccent("#635bff");
applyMagnification(0);
renderFilterOptions(activeFilterCategory);

window.addEventListener("resize", () => {
  updateContextNavOffset();
  updatePrimaryNavOverflow();
  updateBreadcrumbOverflow();
});

if ("ResizeObserver" in window) {
  const headerObserver = new ResizeObserver(() => {
    updateContextNavOffset();
    updateBreadcrumbOverflow();
  });

  if (topNav) {
    headerObserver.observe(topNav);
  }

  if (primaryNav) {
    headerObserver.observe(primaryNav);
  }

  if (subNav) {
    headerObserver.observe(subNav);
  }

  if (breadcrumbNav) {
    headerObserver.observe(breadcrumbNav);
  }

  if (breadcrumbList) {
    headerObserver.observe(breadcrumbList);
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (profileButton?.contains(target) || profileMenu?.contains(target)) {
    return;
  }

  if (primaryNavOverflowButton?.contains(target) || primaryNavOverflowMenu?.contains(target)) {
    return;
  }

  if (
    breadcrumbCollapseButton?.contains(target) ||
    breadcrumbCollapseMenu?.contains(target) ||
    breadcrumbCompactButton?.contains(target) ||
    breadcrumbCompactMenu?.contains(target)
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
  setFilterPanelOpen(false);
  setFilterOptionsPanelOpen(false);
  setAccessibilityDrawerOpen(false);
  setContextNavMoreOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
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
