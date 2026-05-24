function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBreadcrumbMenuItems(items, currentLabel) {
  return items.map((item, index) => {
    const isCurrent = index === items.length - 1 && item.label === currentLabel;
    if (isCurrent) {
      return `<span class="menu-item breadcrumb-structure-current" aria-current="page">${escapeHtml(item.label)}</span>`;
    }

    return `<a class="menu-item" href="${escapeHtml(item.href)}" role="menuitem">${escapeHtml(item.label)}</a>`;
  }).join("");
}

export function buildPageShellBreadcrumbMarkup(chain) {
  const current = chain[chain.length - 1];
  const isSingleItem = chain.length === 1;
  const collapsedItems = chain.length >= 4 ? chain.slice(1, -2) : [];
  const pageMinusOne = chain.length >= 3 ? chain[chain.length - 2] : null;
  const compactItems = chain.length > 1 ? chain.slice(0, -1) : [];
  const compactMenuItems = [...compactItems, { href: current.href, label: current.label }];
  const hasCollapsed = collapsedItems.length > 0;
  const hasPageMinusOne = Boolean(pageMinusOne);
  const collapsedMenu = renderBreadcrumbMenuItems(collapsedItems, current.label);
  const compactMenu = renderBreadcrumbMenuItems(compactMenuItems, current.label);

  return `
    <div id="breadcrumb-compact" class="breadcrumb-compact hidden">
      <button
        id="breadcrumb-compact-button"
        class="breadcrumb-collapse-button breadcrumb-compact-button"
        type="button"
        aria-expanded="false"
        aria-controls="breadcrumb-compact-menu"
        aria-label="Open page structure menu"
      >
        <span class="breadcrumb-compact-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6 4.5a1.5 1.5 0 1 1 0 3H5v3h5.5a1.5 1.5 0 1 1 0 3H5v5h3.5a1.5 1.5 0 1 1 0 3H3.5a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 3.5 4.5zm11 0a4 4 0 0 1 0 8h-2v-3h2a1 1 0 1 0 0-2h-2v-3zm-2 9h3a4 4 0 1 1 0 8h-3v-3h3a1 1 0 1 0 0-2h-3z" />
          </svg>
        </span>
      </button>
      <div
        id="breadcrumb-compact-menu"
        class="breadcrumb-collapse-menu hidden"
        role="menu"
        aria-labelledby="breadcrumb-compact-button"
      >
        ${compactMenu}
      </div>
    </div>
    <ol id="breadcrumb-list" class="breadcrumb-list">
      <li id="breadcrumb-home-item">
        <a id="breadcrumb-home-link" class="breadcrumb-button" href="${escapeHtml(chain[0].href)}">${escapeHtml(chain[0].label)}</a>
      </li>
      <li id="breadcrumb-separator-before-collapsed" class="${hasCollapsed ? "" : "hidden"}">
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
      <li id="breadcrumb-collapsed-item" class="breadcrumb-collapsed ${hasCollapsed ? "" : "hidden"}">
        <button
          id="breadcrumb-collapse-button"
          class="breadcrumb-collapse-button"
          type="button"
          aria-expanded="false"
          aria-controls="breadcrumb-collapse-menu"
          aria-label="Open collapsed breadcrumb menu"
        >
          ...
        </button>
        <div
          id="breadcrumb-collapse-menu"
          class="breadcrumb-collapse-menu hidden"
          role="menu"
          aria-labelledby="breadcrumb-collapse-button"
        >
          ${collapsedMenu}
        </div>
      </li>
      <li id="breadcrumb-separator-before-page-minus-one" class="${hasPageMinusOne ? "" : "hidden"}">
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
      <li id="breadcrumb-page-minus-one-item" class="${hasPageMinusOne ? "" : "hidden"}">
        <a
          id="breadcrumb-page-minus-one-link"
          class="breadcrumb-button"
          href="${hasPageMinusOne ? escapeHtml(pageMinusOne.href) : "#"}"
        >${hasPageMinusOne ? escapeHtml(pageMinusOne.label) : ""}</a>
      </li>
      <li id="breadcrumb-separator-before-current" class="${chain.length > 1 ? "" : "hidden"}">
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
      </li>
      <li id="breadcrumb-current-item" class="${isSingleItem ? "hidden" : ""}">
        <span id="breadcrumb-current-label" class="breadcrumb-button breadcrumb-current" aria-current="page">${escapeHtml(current.label)}</span>
      </li>
    </ol>
  `;
}

export function createPageShellBreadcrumbController({
  row,
  breadcrumbNav,
  breadcrumbList,
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
  breadcrumbSeparatorBeforeCurrent,
  breadcrumbCurrentItem,
  breadcrumbCurrentLabel,
}) {
  const tooltipNodes = [
    breadcrumbHomeLink,
    breadcrumbPageMinusOneLink,
    breadcrumbCurrentLabel,
  ].filter((node) => node instanceof HTMLElement);

  let breadcrumbFrame = 0;

  function setBreadcrumbItemHidden(node, hidden) {
    node?.classList.toggle("hidden", hidden);
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

  function isBreadcrumbNodeTruncated(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }

    const measurementNode = ensureBreadcrumbLabel(node) ?? node;
    const parentItem = node.closest("li");
    const nodeTruncated = measurementNode.scrollWidth > measurementNode.clientWidth + 1;
    const parentTruncated =
      parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
    return nodeTruncated || parentTruncated;
  }

  function syncOverflowTooltip(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.classList.add("tooltip-anchor");
    const labelNode = ensureBreadcrumbLabel(node);
    const measurementNode = labelNode ?? node;
    const isHomeNode = node === breadcrumbHomeLink;

    if (isHomeNode) {
      node.classList.remove("breadcrumb-home-icon-only");
    }

    if (node.closest(".hidden")) {
      delete node.dataset.tooltip;
      return;
    }

    const label = node.dataset.fullLabel?.trim() || measurementNode.textContent?.trim() || "";
    const parentItem = node.closest("li");
    const nodeTruncated = measurementNode.scrollWidth > measurementNode.clientWidth + 1;
    const parentTruncated =
      parentItem instanceof HTMLElement && parentItem.scrollWidth > parentItem.clientWidth + 1;
    const isTruncated = nodeTruncated || parentTruncated;

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
    for (const node of tooltipNodes) {
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

  function syncBreadcrumbCompactLayout() {
    if (!(row instanceof HTMLElement) || !(breadcrumbCompact instanceof HTMLElement)) {
      return;
    }

    row.classList.toggle("sub-nav-compact-layout", !breadcrumbCompact.classList.contains("hidden"));
  }

  function breadcrumbPresentationNeedsCompaction({ allowPageMinusOne = true }) {
    if (!(breadcrumbList instanceof HTMLElement)) {
      return false;
    }

    const nodes = [breadcrumbCurrentLabel];
    if (allowPageMinusOne) {
      nodes.unshift(breadcrumbPageMinusOneLink);
    }

    return nodes.some((node) => (
      node instanceof HTMLElement
      && !node.closest(".hidden")
      && isBreadcrumbNodeTruncated(node)
    ));
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

  function closeBreadcrumbMenus() {
    setBreadcrumbMenuOpen(false);
    setBreadcrumbCompactMenuOpen(false);
  }

  function updateBreadcrumbPresentation() {
    if (!(breadcrumbList instanceof HTMLElement)) {
      return;
    }

    const allowPageMinusOne = Boolean(breadcrumbPageMinusOneLink?.textContent?.trim());
    const allowCollapsed = Boolean(breadcrumbCollapseMenu?.children.length);

    setBreadcrumbItemHidden(breadcrumbPageMinusOneItem, !allowPageMinusOne);
    setBreadcrumbItemHidden(breadcrumbSeparatorBeforePageMinusOne, !allowPageMinusOne);
    setBreadcrumbItemHidden(breadcrumbCollapsedItem, !allowCollapsed);
    setBreadcrumbItemHidden(breadcrumbSeparatorBeforeCollapsed, !allowCollapsed);
    breadcrumbCompact?.classList.add("hidden");
    breadcrumbList.classList.remove("hidden");

    const availableWidth = breadcrumbNav?.clientWidth ?? breadcrumbList.clientWidth;
    const fullPageMinusOneLabel =
      breadcrumbPageMinusOneLink?.dataset.fullLabel
      ?? breadcrumbPageMinusOneLink?.textContent?.trim()
      ?? "";
    const shortPageMinusOneLabel = breadcrumbPageMinusOneLink?.dataset.shortLabel ?? fullPageMinusOneLabel;

    if (breadcrumbPageMinusOneLink) {
      setBreadcrumbButtonLabel(breadcrumbPageMinusOneLink, fullPageMinusOneLabel);
    }

    if (breadcrumbPageMinusOneLink && isBreadcrumbNodeTruncated(breadcrumbPageMinusOneLink)) {
      setBreadcrumbButtonLabel(breadcrumbPageMinusOneLink, shortPageMinusOneLabel);
    }

    if (
      breadcrumbList.scrollWidth <= availableWidth
      && !breadcrumbPresentationNeedsCompaction({ allowPageMinusOne })
    ) {
      syncBreadcrumbCompactLayout();
      updateBreadcrumbOverflowTooltips();
      return;
    }

    if (allowPageMinusOne) {
      setBreadcrumbItemHidden(breadcrumbPageMinusOneItem, true);
      setBreadcrumbItemHidden(breadcrumbSeparatorBeforePageMinusOne, true);
    }

    if (
      breadcrumbList.scrollWidth <= availableWidth
      && !breadcrumbPresentationNeedsCompaction({ allowPageMinusOne: false })
    ) {
      syncBreadcrumbCompactLayout();
      updateBreadcrumbOverflowTooltips();
      return;
    }

    if (allowCollapsed) {
      setBreadcrumbItemHidden(breadcrumbCollapsedItem, true);
      setBreadcrumbItemHidden(breadcrumbSeparatorBeforeCollapsed, true);
    }

    if (
      breadcrumbList.scrollWidth <= availableWidth
      && !breadcrumbPresentationNeedsCompaction({ allowPageMinusOne: false })
    ) {
      syncBreadcrumbCompactLayout();
      updateBreadcrumbOverflowTooltips();
      return;
    }

    breadcrumbList.classList.add("hidden");
    breadcrumbCompact?.classList.remove("hidden");
    syncBreadcrumbCompactLayout();
    closeBreadcrumbMenus();
    updateBreadcrumbOverflowTooltips();
  }

  function scheduleBreadcrumbPresentation() {
    if (breadcrumbFrame) {
      return;
    }

    breadcrumbFrame = window.requestAnimationFrame(() => {
      breadcrumbFrame = 0;
      updateBreadcrumbPresentation();
    });
  }

  function renderBreadcrumbs(chain) {
    if (!Array.isArray(chain) || chain.length === 0) {
      return;
    }

    const current = chain[chain.length - 1];
    const compactItems = chain.length > 1 ? chain.slice(0, -1) : [];
    const compactMenuItems = [...compactItems, current];
    const collapsedItems = chain.length >= 4 ? chain.slice(1, -2) : [];
    const pageMinusOne = chain.length >= 3 ? chain[chain.length - 2] : null;
    const isSingleItem = chain.length === 1;

    if (breadcrumbHomeLink instanceof HTMLElement) {
      breadcrumbHomeLink.href = chain[0].href;
      breadcrumbHomeLink.dataset.fullLabel = chain[0].label;
      setBreadcrumbButtonLabel(breadcrumbHomeLink, chain[0].label);
      if (isSingleItem) {
        breadcrumbHomeLink.setAttribute("aria-current", "page");
        breadcrumbHomeLink.classList.add("breadcrumb-current");
      } else {
        breadcrumbHomeLink.removeAttribute("aria-current");
        breadcrumbHomeLink.classList.remove("breadcrumb-current");
      }
    }

    if (breadcrumbPageMinusOneLink instanceof HTMLElement) {
      breadcrumbPageMinusOneLink.href = pageMinusOne?.href ?? "#";
      breadcrumbPageMinusOneLink.dataset.fullLabel = pageMinusOne?.label ?? "";
      breadcrumbPageMinusOneLink.dataset.shortLabel = pageMinusOne?.label ?? "";
      setBreadcrumbButtonLabel(breadcrumbPageMinusOneLink, pageMinusOne?.label ?? "");
    }

    if (breadcrumbCurrentLabel instanceof HTMLElement) {
      breadcrumbCurrentLabel.dataset.fullLabel = current.label;
      setBreadcrumbButtonLabel(breadcrumbCurrentLabel, current.label);
      breadcrumbCurrentLabel.setAttribute("title", current.label);
    }

    if (breadcrumbCurrentItem instanceof HTMLElement) {
      breadcrumbCurrentItem.classList.toggle("hidden", isSingleItem);
    }

    const separatorBeforeCurrent = breadcrumbSeparatorBeforeCurrent ?? document.getElementById("breadcrumb-separator-before-current");
    separatorBeforeCurrent?.classList.toggle("hidden", isSingleItem);

    if (breadcrumbCollapseMenu instanceof HTMLElement) {
      breadcrumbCollapseMenu.innerHTML = renderBreadcrumbMenuItems(collapsedItems, current.label);
    }

    if (breadcrumbCompactMenu instanceof HTMLElement) {
      breadcrumbCompactMenu.innerHTML = renderBreadcrumbMenuItems(compactMenuItems, current.label);
    }

    setBreadcrumbItemHidden(breadcrumbCollapsedItem, collapsedItems.length === 0);
    setBreadcrumbItemHidden(breadcrumbSeparatorBeforeCollapsed, collapsedItems.length === 0);
    setBreadcrumbItemHidden(breadcrumbPageMinusOneItem, !pageMinusOne);
    setBreadcrumbItemHidden(breadcrumbSeparatorBeforePageMinusOne, !pageMinusOne);

    closeBreadcrumbMenus();
    scheduleBreadcrumbPresentation();
  }

  breadcrumbCollapseButton?.addEventListener("click", () => {
    setBreadcrumbCompactMenuOpen(false);
    setBreadcrumbMenuOpen(!isBreadcrumbMenuOpen());
  });

  breadcrumbCompactButton?.addEventListener("click", () => {
    setBreadcrumbMenuOpen(false);
    setBreadcrumbCompactMenuOpen(!isBreadcrumbCompactMenuOpen());
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (
      breadcrumbCollapseButton?.contains(target)
      || breadcrumbCollapseMenu?.contains(target)
      || breadcrumbCompactButton?.contains(target)
      || breadcrumbCompactMenu?.contains(target)
    ) {
      return;
    }

    closeBreadcrumbMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (isBreadcrumbMenuOpen()) {
      setBreadcrumbMenuOpen(false);
      breadcrumbCollapseButton?.focus();
    }

    if (isBreadcrumbCompactMenuOpen()) {
      setBreadcrumbCompactMenuOpen(false);
      breadcrumbCompactButton?.focus();
    }
  });

  return {
    closeBreadcrumbMenus,
    isBreadcrumbCompactMenuOpen,
    isBreadcrumbMenuOpen,
    renderBreadcrumbs,
    scheduleBreadcrumbPresentation,
    setBreadcrumbCompactMenuOpen,
    setBreadcrumbMenuOpen,
  };
}

export function createPageShellChromeController({
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
  displaySettingsPersistentRegions = [],
  shellSubNav,
  contextNav,
}) {
  let displaySettingsReturnFocusTarget = null;
  let shellOffsetFrame = 0;

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

  function shouldKeepDisplaySettingsOpenForTarget(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    if (
      target.closest(".context-nav-more")
      || target.closest("#display-settings-drawer")
      || target.closest("#display-settings-button")
    ) {
      return true;
    }

    return displaySettingsPersistentRegions.some((region) =>
      region instanceof Element && (region === target || region.contains(target)),
    );
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

  function updateContextNavOffset() {
    if (!topNav && !shellSubNav) {
      return;
    }

    const headerBottom = Math.max(
      topNav?.getBoundingClientRect().bottom ?? 0,
      shellSubNav?.getBoundingClientRect().bottom ?? 0,
    );

    document.documentElement.style.setProperty("--context-nav-top", `${Math.ceil(headerBottom)}px`);
    if (contextNav instanceof HTMLElement) {
      document.documentElement.style.setProperty(
        "--context-nav-mobile-bar-offset",
        `${Math.ceil(contextNav.getBoundingClientRect().height)}px`,
      );
    }
  }

  function scheduleContextNavOffsetUpdate() {
    if (shellOffsetFrame) {
      return;
    }

    shellOffsetFrame = window.requestAnimationFrame(() => {
      shellOffsetFrame = 0;
      updateContextNavOffset();
    });
  }

  return {
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
  };
}

export function createPageShellLanguageController({
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
  getActiveLanguageCode,
  languageModal,
  languageModalCloseButton,
  languageOptionList,
  languageOptions,
  magnificationButtons,
  mobileLanguageButton,
  onShellGeometryChange = () => {},
  profileLanguageButton,
  setActiveLanguageCode,
  themeButtons,
}) {
  let languageModalReturnFocusTarget = null;

  function getActiveLanguage() {
    const activeLanguageCode = getActiveLanguageCode();
    return languageOptions.find((language) => language.code === activeLanguageCode) ?? languageOptions[0];
  }

  function syncDocumentLanguageDirection() {
    const activeLanguage = getActiveLanguage();
    const isRtl = activeLanguage.code === "ar";
    const html = document.documentElement;
    const body = document.body;

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
    return getActiveLanguageCode() === "ar" ? displaySettingsCopy.rtl : displaySettingsCopy.ltr;
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
      onShellGeometryChange();
    });
  }

  function renderLanguageOptions() {
    if (!languageOptionList) {
      return;
    }

    const activeLanguageCode = getActiveLanguageCode();
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
        const selectedButton = languageOptionList?.querySelector(`[data-language-code="${getActiveLanguageCode()}"]`);
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
    setActiveLanguageCode(languageCode);
    syncDocumentLanguageDirection();
    syncLanguageTriggers();
    renderLanguageOptions();
  }

  return {
    applyMagnification,
    applyTheme,
    isLanguageModalOpen,
    renderLanguageOptions,
    selectLanguage,
    setLanguageModalOpen,
    syncDisplaySettingsCopy,
    syncDocumentLanguageDirection,
    syncLanguageTriggers,
  };
}

export function createPageShellTooltipController() {
  let activeSharedTooltipTarget = null;
  let hoverTooltipArmed = false;

  function getSharedTooltipElement() {
    let tooltip = document.getElementById("shared-floating-tooltip");
    if (tooltip instanceof HTMLElement) {
      return tooltip;
    }

    tooltip = document.createElement("div");
    tooltip.id = "shared-floating-tooltip";
    tooltip.className = "shared-floating-tooltip hidden token-paragraph-preview token-paragraph-main-minor";
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

  function suspendSharedTooltipUntilPointerMove() {
    hoverTooltipArmed = false;
    hideSharedTooltip();
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
    document.addEventListener("pointermove", () => {
      hoverTooltipArmed = true;
    }, { passive: true, capture: true });

    document.addEventListener("mouseover", (event) => {
      if (!hoverTooltipArmed) {
        if (!(event.relatedTarget instanceof Node)) {
          return;
        }

        hoverTooltipArmed = true;
      }

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

  return {
    hideSharedTooltip,
    suspendSharedTooltipUntilPointerMove,
    wireSharedTooltipSystem,
  };
}
