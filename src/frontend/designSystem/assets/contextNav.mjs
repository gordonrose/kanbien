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
