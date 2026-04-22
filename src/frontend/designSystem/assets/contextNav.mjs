function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function defaultGetItemKey(item) {
  return item?.shellPageKey
    ?? item?.pageKey
    ?? item?.href
    ?? item?.label
    ?? null;
}

const hierarchyIconSvg = '<svg viewBox="0 0 24 24" focusable="false"><path d="M4 6h8v4H4zm0 8h8v4H4zm10-4h6v4h-6zm-2-2h2v8h-2z" /></svg>';
const displayIconSvg = `<svg viewBox="0 0 24 24" focusable="false">
  <path d="M4.75 5.25h14.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H13.5l.9 2h2.35a.75.75 0 0 1 0 1.5H7.25a.75.75 0 0 1 0-1.5H9.6l.9-2H4.75a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5zm0 1.5v8.5h14.5v-8.5zm7.25 2a2.5 2.5 0 1 1-2.5 2.5 2.5 2.5 0 0 1 2.5-2.5z" />
</svg>`;
const moreIconSvg = `<svg viewBox="0 0 24 24" focusable="false">
  <path d="M12 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5z" />
</svg>`;

export function renderRootAdminContextNavShell() {
  return `
    <nav class="context-nav" aria-label="Root admin section navigation">
      <div class="context-nav-main"></div>
      <div class="context-nav-bottom-group">
        <button
          id="hierarchy-tree-nav-button"
          class="context-nav-item context-nav-item-button context-nav-item-bottom hidden"
          type="button"
          data-tooltip="Hierarchy"
          aria-expanded="false"
          aria-controls="hierarchy-tree-drawer"
        >
          <span class="context-nav-icon" aria-hidden="true">${hierarchyIconSvg}</span>
          <span class="context-nav-label">Hierarchy</span>
        </button>
        <button
          id="display-settings-button"
          class="context-nav-item context-nav-item-button context-nav-mobile-overflow-target"
          type="button"
          data-tooltip="Display Settings"
          aria-expanded="false"
          aria-controls="display-settings-drawer"
        >
          <span class="context-nav-icon" aria-hidden="true">${displayIconSvg}</span>
          <span id="display-settings-label" class="context-nav-label">Display</span>
        </button>

        <div class="context-nav-more">
          <button
            id="context-nav-more-button"
            class="context-nav-item context-nav-item-button context-nav-more-button"
            type="button"
            data-tooltip="More"
            aria-expanded="false"
            aria-controls="context-nav-more-menu"
          >
            <span class="context-nav-icon" aria-hidden="true">${moreIconSvg}</span>
            <span class="context-nav-label">More</span>
          </button>
          <div
            id="context-nav-more-menu"
            class="context-nav-more-menu hidden"
            role="menu"
            aria-labelledby="context-nav-more-button"
          >
            <div id="context-nav-more-links"></div>
            <button
              id="context-nav-more-display-settings"
              class="menu-item menu-item-button"
              type="button"
              role="menuitem"
            >
              Display Settings
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function partitionContextNavItems(items, {
  isMobile = false,
  currentItemKey = null,
  maxVisibleItems = 4,
  reservedMobileSlots = 0,
  mobileLaneCapacity = 5,
  getItemKey = defaultGetItemKey,
} = {}) {
  const normalizedItems = Array.isArray(items) ? items : [];
  const effectiveMaxVisibleItems = isMobile
    ? Math.max(1, Math.min(maxVisibleItems, mobileLaneCapacity - 1 - Math.max(0, reservedMobileSlots)))
    : maxVisibleItems;

  if (!isMobile || normalizedItems.length <= effectiveMaxVisibleItems) {
    return {
      visibleItems: normalizedItems,
      overflowItems: [],
    };
  }

  const currentIndex = normalizedItems.findIndex((item) => getItemKey(item) === currentItemKey);
  const initialVisibleItems = normalizedItems.slice(0, effectiveMaxVisibleItems);

  if (currentIndex < 0 || currentIndex < effectiveMaxVisibleItems) {
    return {
      visibleItems: initialVisibleItems,
      overflowItems: normalizedItems.slice(effectiveMaxVisibleItems),
    };
  }

  const currentItem = normalizedItems[currentIndex];
  const visibleItems = [
    ...normalizedItems.slice(0, Math.max(0, effectiveMaxVisibleItems - 1)),
    currentItem,
  ];
  const visibleKeys = new Set(visibleItems.map((item) => getItemKey(item)));

  return {
    visibleItems,
    overflowItems: normalizedItems.filter((item) => !visibleKeys.has(getItemKey(item))),
  };
}

export function renderContextNavMenuItems(items, {
  getHref = (item) => item?.href ?? "#",
  getLabel = (item) => item?.label ?? "",
  getCurrent = (item) => Boolean(item?.active),
  getItemKey = () => null,
} = {}) {
  return (Array.isArray(items) ? items : []).map((item) => {
    const href = getHref(item);
    const label = getLabel(item);
    const currentAttr = getCurrent(item) ? ' aria-current="page"' : "";
    const itemKey = getItemKey(item);
    const pageLinkAttr = itemKey ? ` data-page-link="${escapeHtml(itemKey)}"` : "";
    return `<a class="menu-item" href="${escapeHtml(href)}" role="menuitem"${pageLinkAttr}${currentAttr}>${escapeHtml(label)}</a>`;
  }).join("");
}

export function renderContextNavItems(items, {
  getHref = (item) => item?.href ?? "#",
  getLabel = (item) => item?.label ?? "",
  getCurrent = (item) => Boolean(item?.active),
  getItemKey = defaultGetItemKey,
  getTooltip = (item) => getLabel(item),
  getIconSvg = () => "",
} = {}) {
  return (Array.isArray(items) ? items : []).map((item) => {
    const href = getHref(item);
    const label = getLabel(item);
    const itemKey = getItemKey(item);
    const tooltip = getTooltip(item);
    const currentAttr = getCurrent(item) ? ' aria-current="page"' : "";
    const pageLinkAttr = itemKey ? ` data-page-link="${escapeHtml(itemKey)}"` : "";
    return `
      <a
        class="context-nav-item"
        href="${escapeHtml(href)}"
        data-tooltip="${escapeHtml(tooltip)}"${pageLinkAttr}${currentAttr}
      >
        <span class="context-nav-icon" aria-hidden="true">${getIconSvg(item)}</span>
        <span class="context-nav-label">${escapeHtml(label)}</span>
      </a>
    `;
  }).join("");
}
