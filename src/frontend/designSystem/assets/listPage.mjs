const selectableList = document.querySelector("[data-selectable-list]");
const recordCardTemplate = document.getElementById("list-page-record-card-template");
const splitLayout = selectableList?.matches("[data-selectable-list-layout]")
  ? selectableList
  : selectableList?.querySelector("[data-selectable-list-layout]");
const listColumn = selectableList?.querySelector("[data-selectable-list-column]");
const searchInput = document.getElementById("design-system-search");
const searchForm = searchInput?.closest("form");
const detailPanel = selectableList?.querySelector("[data-selectable-list-detail-panel]");
const detailTitle = selectableList?.querySelector('[data-selectable-list-detail-field="title"]');
const detailSubtitle = selectableList?.querySelector('[data-selectable-list-detail-field="subtitle"]');
const detailDescription = selectableList?.querySelector('[data-selectable-list-detail-field="description"]');
const detailMeta = selectableList?.querySelector('[data-selectable-list-detail-field="meta"]');
const detailTags = selectableList?.querySelector('[data-selectable-list-detail-field="tags"]');
const detailClose = selectableList?.querySelector("#list-page-detail-close");
const detailPrev = selectableList?.querySelector("#list-page-detail-prev");
const detailNext = selectableList?.querySelector("#list-page-detail-next");
const detailNextAnchor = selectableList?.querySelector("#list-page-detail-next-anchor");
const lazyLoadStatusAction = selectableList?.querySelector("[data-selectable-list-status-action]");
const lazyLoadSentinel = selectableList?.querySelector("[data-selectable-list-sentinel]");
const loadingGroup = selectableList?.querySelector("[data-selectable-list-loading]");
const loadingLabel = selectableList?.querySelector("[data-selectable-list-loading-label]");
const emptyState = selectableList?.querySelector("[data-selectable-list-empty-state]");
const noResultsState = selectableList?.querySelector("[data-selectable-list-no-results-state]");
const initialErrorState = selectableList?.querySelector("[data-selectable-list-initial-error-state]");
const queryCopy = selectableList?.querySelector("[data-selectable-list-query-copy]");
const emptyReset = selectableList?.querySelector("[data-selectable-list-empty-reset]");
const clearSearch = selectableList?.querySelector("[data-selectable-list-clear-search]");
const initialRetry = selectableList?.querySelector("[data-selectable-list-initial-retry]");
const appendError = selectableList?.querySelector("[data-selectable-list-append-error]");
const appendRetry = selectableList?.querySelector("[data-selectable-list-append-retry]");
const itemsContainer = selectableList?.querySelector("[data-selectable-list-items]");
const announcementRegion = selectableList?.querySelector("[data-selectable-list-announcement]");
const detailError = selectableList?.querySelector("[data-selectable-list-detail-error]");
const detailRetry = selectableList?.querySelector("[data-selectable-list-detail-retry]");
const searchParams = new URLSearchParams(window.location.search);
const initialLoadingPreview = searchParams.get("listLoading") === "initial";
const initialEmptyPreview = searchParams.get("listState") === "empty";
const initialMissingAttributesPreview = searchParams.get("listState") === "missing-attributes";
const initialLongAttributesPreview = searchParams.get("listState") === "long-attributes";
const initialListLoadErrorPreview = searchParams.get("listLoadError") === "initial";
const initialAppendLoadErrorPreview = searchParams.get("listLoadError") === "append";
const initialDetailErrorPreview = searchParams.get("detailError") === "1";
let currentQuery = searchParams.get("q")?.trim() ?? "";
const initialNoResultsPreview = currentQuery.length > 0;
const untitledRecordFallback = "Untitled record";

const lazyLoadBatchSize = 6;
const lazyLoadMaxItems = 28;
const loadingDelayMs = 320;
const initialLoadingDelayMs = 700;
const defaultLazyLoadStatus = "Scroll to load more placeholder items.";
const mobileDetailBreakpoint = "(max-width: 61.25rem)";
let nextLazyLoadIndex = 5;
let lazyLoadComplete = false;
let isLoading = false;
let currentListState = initialEmptyPreview ? "empty" : initialNoResultsPreview ? "no-results" : "items";
let lastDetailTrigger = null;
let announcementResetTimer = 0;
let appendFailurePending = initialAppendLoadErrorPreview;
let detailFailurePending = initialDetailErrorPreview;
let lastDetailRecord = null;
let listColumnResizeObserver = null;

function getItemButtons() {
  return Array.from(selectableList?.querySelectorAll("[data-selectable-list-card]") ?? []);
}

function getVisibleItemButtons() {
  return getItemButtons().filter((button) => !button.classList.contains("hidden"));
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function announce(message) {
  if (!(announcementRegion instanceof HTMLElement)) {
    return;
  }

  if (announcementResetTimer) {
    window.clearTimeout(announcementResetTimer);
    announcementResetTimer = 0;
  }

  if (announcementRegion.textContent === message) {
    announcementRegion.textContent = "";
    window.requestAnimationFrame(() => {
      announcementRegion.textContent = message;
    });
    return;
  }

  announcementRegion.textContent = message;
}

function isMobileDetailMode() {
  return window.matchMedia(mobileDetailBreakpoint).matches;
}

function getFocusableElements(container) {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];

  return Array.from(container.querySelectorAll(selectors.join(","))).filter((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    return !element.hasAttribute("hidden") && !element.classList.contains("hidden") && element.offsetParent !== null;
  });
}

function syncDetailPanelAccessibility() {
  if (!(detailPanel instanceof HTMLElement)) {
    return;
  }

  const isOpen = !detailPanel.classList.contains("hidden");
  const isMobile = isMobileDetailMode();
  const useModalSemantics = isOpen && isMobile;

  detailPanel.setAttribute("role", useModalSemantics ? "dialog" : "region");
  detailPanel.setAttribute("aria-modal", String(useModalSemantics));
}

function focusDetailEntryPoint() {
  if (detailTitle instanceof HTMLElement) {
    detailTitle.focus({ preventScroll: true });
    return;
  }

  if (detailClose instanceof HTMLElement) {
    detailClose.focus({ preventScroll: true });
  }
}

function updateLazyLoadStatus(message) {
  if (!(lazyLoadStatusAction instanceof HTMLButtonElement)) {
    return;
  }

  lazyLoadStatusAction.textContent = message;
}

function syncLazyLoadStatusAction() {
  if (!(lazyLoadStatusAction instanceof HTMLButtonElement)) {
    return;
  }

  const appendErrorHidden = !(appendError instanceof HTMLElement) || appendError.classList.contains("hidden");
  const canLoadMore =
    currentListState === "items"
    && !lazyLoadComplete
    && !isLoading
    && appendErrorHidden;

  lazyLoadStatusAction.disabled = !canLoadMore;
}

function setAppendErrorVisible(visible) {
  setStateVisibility(appendError, visible);
  syncLazyLoadStatusAction();
}

function setDetailErrorVisible(visible) {
  setStateVisibility(detailError, visible);
}

function getDefaultLazyLoadStatus() {
  return lazyLoadComplete ? "All placeholder items loaded." : defaultLazyLoadStatus;
}

function setItemsVisibility(visible) {
  if (!(itemsContainer instanceof HTMLElement)) {
    return;
  }

  itemsContainer.classList.toggle("hidden", !visible);
  syncLazyLoadStatusAction();
}

function setStateVisibility(element, visible) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.toggle("hidden", !visible);
  element.setAttribute("aria-hidden", String(!visible));
}

function setLoadingState(visible, mode = "append") {
  if (loadingGroup instanceof HTMLElement) {
    loadingGroup.classList.toggle("hidden", !visible);
    loadingGroup.setAttribute("aria-hidden", String(!visible));
  }

  if (loadingLabel instanceof HTMLElement) {
    loadingLabel.textContent = mode === "initial" ? "Loading list items..." : "Loading more items...";
  }

  if (listColumn instanceof HTMLElement) {
    listColumn.setAttribute("aria-busy", String(visible));
  }

  syncLazyLoadStatusAction();
}

function updatePreviewUrl(mutator) {
  const nextUrl = new URL(window.location.href);
  mutator(nextUrl.searchParams);
  window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

function setNoResultsQueryCopy(query) {
  if (!(queryCopy instanceof HTMLElement)) {
    return;
  }

  queryCopy.textContent = `"${query}"`;
}

function setOverflowTooltip(element, value) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const fullValue = normalizeText(value);

  if (!fullValue) {
    delete element.dataset.tooltip;
    return;
  }

  const isTruncated = element.scrollWidth > element.clientWidth + 1;
  if (isTruncated) {
    element.dataset.tooltip = fullValue;
  } else {
    delete element.dataset.tooltip;
  }
}

function updateOverflowTooltips() {
  const candidates = Array.from(
    selectableList?.querySelectorAll("[data-overflow-tooltip-source]") ?? [],
  );

  for (const candidate of candidates) {
    if (!(candidate instanceof HTMLElement)) {
      continue;
    }

    setOverflowTooltip(candidate, candidate.dataset.fullValue ?? candidate.textContent ?? "");
  }
}

function scheduleOverflowTooltipUpdate() {
  window.requestAnimationFrame(() => {
    updateOverflowTooltips();
  });
}

function scheduleListGeometrySync() {
  window.requestAnimationFrame(() => {
    syncLazyLoadStatusAction();
  });
}

function isDesktopSplitOpen() {
  return splitLayout instanceof HTMLElement
    && splitLayout.classList.contains("detail-open")
    && !isMobileDetailMode();
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getTagsFromButton(button) {
  return (button.dataset.tags ?? "")
    .split("|")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getButtonRecord(button) {
  const listTitle = normalizeText(button.dataset.title) || untitledRecordFallback;
  const listSubtitle = normalizeText(button.dataset.subtitle);
  const listDescription = normalizeText(button.dataset.description);
  const detailTitle = normalizeText(button.dataset.detailTitle) || listTitle;
  const detailSubtitle = normalizeText(button.dataset.detailSubtitle) || listSubtitle;
  const detailBody = normalizeText(button.dataset.detailBody) || listDescription;
  const detailMetaValue = normalizeText(button.dataset.detailMeta);
  const tags = getTagsFromButton(button);

  return {
    listTitle,
    listSubtitle,
    listDescription,
    detailTitle,
    detailSubtitle,
    detailBody,
    detailMetaValue,
    tags,
  };
}

function getRecordSearchText(button) {
  const record = getButtonRecord(button);

  return [
    record.listTitle,
    record.listSubtitle,
    record.listDescription,
    record.detailTitle,
    record.detailSubtitle,
    record.detailBody,
    record.detailMetaValue,
    ...record.tags,
  ]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function setOptionalText(element, value) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const hasValue = Boolean(value);
  element.textContent = hasValue ? value : "";
  if (hasValue) {
    element.dataset.fullValue = value;
  } else {
    delete element.dataset.fullValue;
    delete element.dataset.tooltip;
  }
  element.classList.toggle("hidden", !hasValue);
  element.setAttribute("aria-hidden", String(!hasValue));
}

function setOptionalTags(container, tags) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const hasTags = tags.length > 0;
  container.classList.toggle("hidden", !hasTags);
  container.setAttribute("aria-hidden", String(!hasTags));

  if (!hasTags) {
    container.replaceChildren();
    return;
  }

  container.replaceChildren();

  for (const tag of tags) {
    const chip = document.createElement("span");
    chip.className = "list-page-tag tooltip-anchor";
    chip.dataset.overflowTooltipSource = "";
    chip.dataset.fullValue = tag;
    chip.textContent = tag;
    container.append(chip);
  }
}

function renderCard(button) {
  if (!(button instanceof HTMLElement)) {
    return;
  }

  if (recordCardTemplate instanceof HTMLTemplateElement) {
    button.replaceChildren(recordCardTemplate.content.cloneNode(true));
  }

  const record = getButtonRecord(button);
  const title = button.querySelector(".list-page-card-title");
  const subtitle = button.querySelector(".list-page-card-subtitle");
  const description = button.querySelector(".list-page-card-description");
  const tags = button.querySelector(".list-page-card-tags");

  if (title instanceof HTMLElement) {
    title.classList.add("tooltip-anchor");
    title.dataset.overflowTooltipSource = "";
    title.textContent = record.listTitle;
    title.dataset.fullValue = record.listTitle;
  }

  if (subtitle instanceof HTMLElement) {
    subtitle.classList.add("tooltip-anchor");
    subtitle.dataset.overflowTooltipSource = "";
  }

  setOptionalText(subtitle, record.listSubtitle);
  setOptionalText(description, record.listDescription);
  setOptionalTags(tags, record.tags);
}

function renderAllCards() {
  for (const button of getItemButtons()) {
    renderCard(button);
  }
}

function applyMissingAttributesPreview() {
  const itemButtons = getItemButtons();

  if (itemButtons[0] instanceof HTMLElement) {
    itemButtons[0].dataset.title = "";
    itemButtons[0].dataset.detailTitle = "";
    itemButtons[0].dataset.subtitle = "";
    itemButtons[0].dataset.detailSubtitle = "";
    itemButtons[0].dataset.tags = "";
  }

  if (itemButtons[1] instanceof HTMLElement) {
    itemButtons[1].dataset.subtitle = "";
    itemButtons[1].dataset.detailSubtitle = "";
    itemButtons[1].dataset.detailMeta = "";
    itemButtons[1].dataset.tags = "";
  }

  if (itemButtons[2] instanceof HTMLElement) {
    itemButtons[2].dataset.description = "";
    itemButtons[2].dataset.detailBody = "";
    itemButtons[2].dataset.tags = "";
  }
}

function applyLongAttributesPreview() {
  const itemButtons = getItemButtons();

  if (itemButtons[0] instanceof HTMLElement) {
    itemButtons[0].dataset.title = "Placeholder record with an intentionally extended title that should truncate cleanly in the list card";
    itemButtons[0].dataset.subtitle = "Secondary supporting subtitle content that is deliberately too long for the compact list-card row";
    itemButtons[0].dataset.tags = "Extremely long governed tag label for tooltip recovery|Another unusually verbose placeholder tag|Compact state";
    itemButtons[0].dataset.detailMeta = "Extremely long metadata label for the detail header that should truncate but remain recoverable";
    itemButtons[0].dataset.detailTitle = "Placeholder record with an intentionally extended title that should wrap inside the detail header instead of truncating";
    itemButtons[0].dataset.detailSubtitle = "Secondary supporting subtitle content that should remain readable and wrap inside the detail panel";
    itemButtons[0].dataset.detailBody = "This governed long-attributes preview keeps the detail body in wrapped reading mode instead of clipping it with ellipses. The list card should absorb overflow pressure through truncation and tooltip recovery, while the drawer identity and body continue to behave like readable long-form content. This extra sentence keeps the wrapped reading state obvious during visual review.";
  }

  if (itemButtons[1] instanceof HTMLElement) {
    itemButtons[1].dataset.title = "Second placeholder record with another intentionally oversized title for list overflow review";
    itemButtons[1].dataset.tags = "Long taxonomy token that should ellipsize in the chip treatment|Reference";
  }
}

function createPlaceholderItem(index) {
  const button = document.createElement("button");
  button.className = "list-page-card list-page-card-button";
  button.type = "button";
  button.dataset.listItem = "";
  button.dataset.selectableListCard = "";
  button.dataset.listPageChildSeam = "list-record-card";
  button.dataset.title = `Placeholder Item ${index}`;
  button.dataset.subtitle = `Auto-loaded placeholder subtitle ${index}`;
  button.dataset.description =
    `This placeholder item was lazy-loaded while scrolling so the list-page template can prove larger catalogs without implying real domain data.`;
  button.dataset.detailTitle = `Placeholder Item ${index}`;
  button.dataset.detailSubtitle = `Auto-loaded placeholder subtitle ${index}`;
  button.dataset.detailBody =
    `This drawer body belongs to lazy-loaded placeholder item ${index}. It exists to keep the detail surface honest when the list grows beyond the first static batch.`;
  button.dataset.detailMeta = `Lazy-loaded placeholder ${index}`;
  button.dataset.tags = `Placeholder|Lazy Load|Item ${index}`;
  button.setAttribute("aria-controls", "list-page-detail-panel");
  button.setAttribute("aria-pressed", "false");

  renderCard(button);
  return button;
}

async function loadMoreItems(mode = "append") {
  if (!(listColumn instanceof HTMLElement) || currentListState !== "items" || lazyLoadComplete || isLoading) {
    return false;
  }

  isLoading = true;
  setAppendErrorVisible(false);
  setLoadingState(true, mode);
  await wait(loadingDelayMs);

  if (mode === "append" && appendFailurePending) {
    appendFailurePending = false;
    setLoadingState(false, mode);
    isLoading = false;
    setAppendErrorVisible(true);
    updateLazyLoadStatus("Could not load more items. Retry to keep going.");
    announce("Could not load more list items.");
    return false;
  }

  const fragment = document.createDocumentFragment();
  const finalIndex = Math.min(nextLazyLoadIndex + lazyLoadBatchSize - 1, lazyLoadMaxItems);
  const appendedCount = finalIndex - nextLazyLoadIndex + 1;

  for (let index = nextLazyLoadIndex; index <= finalIndex; index += 1) {
    fragment.append(createPlaceholderItem(index));
  }

  if (itemsContainer instanceof HTMLElement && lazyLoadSentinel instanceof HTMLElement) {
    itemsContainer.insertBefore(fragment, lazyLoadSentinel);
  } else {
    listColumn.insertBefore(fragment, lazyLoadSentinel ?? null);
  }
  nextLazyLoadIndex = finalIndex + 1;
  lazyLoadComplete = nextLazyLoadIndex > lazyLoadMaxItems;

  updateLazyLoadStatus(
    lazyLoadComplete
      ? "All placeholder items loaded."
      : "More placeholder items loaded. Scroll to load more.",
  );
  if (mode === "append") {
    announce(
      lazyLoadComplete
        ? `Loaded the final ${appendedCount} list items.`
        : `Loaded ${appendedCount} more list items.`,
    );
  }

  setLoadingState(false, mode);
  isLoading = false;
  syncQueryFilter({ syncUrl: false });
  scheduleListGeometrySync();
  scheduleOverflowTooltipUpdate();
  return true;
}

async function handleListScroll() {
  if (!(listColumn instanceof HTMLElement) || currentListState !== "items" || lazyLoadComplete || isLoading) {
    return;
  }

  let distanceFromBottom = Number.POSITIVE_INFINITY;

  if (isDesktopSplitOpen()) {
    distanceFromBottom = listColumn.scrollHeight - listColumn.clientHeight - listColumn.scrollTop;
  } else if (lazyLoadSentinel instanceof HTMLElement) {
    distanceFromBottom = lazyLoadSentinel.getBoundingClientRect().bottom - window.innerHeight;
  } else {
    const scrollingElement = document.scrollingElement;
    if (scrollingElement instanceof HTMLElement) {
      distanceFromBottom =
        scrollingElement.scrollHeight - window.innerHeight - window.scrollY;
    }
  }

  if (distanceFromBottom <= 120) {
    await loadMoreItems("append");
  }
}

async function seedListUntilScrollable() {
  if (!(listColumn instanceof HTMLElement) || currentListState !== "items") {
    return;
  }

  const needsMoreScrollableContent = () => {
    if (isDesktopSplitOpen()) {
      return listColumn.scrollHeight <= listColumn.clientHeight;
    }

    const scrollingElement = document.scrollingElement;
    if (!(scrollingElement instanceof HTMLElement)) {
      return false;
    }

    return scrollingElement.scrollHeight <= window.innerHeight;
  };

  while (!lazyLoadComplete && needsMoreScrollableContent()) {
    const appended = await loadMoreItems("seed");
    if (!appended) {
      break;
    }
  }
}

function clearDetailTags() {
  if (!(detailTags instanceof HTMLElement)) {
    return;
  }

  detailTags.replaceChildren();
}

function getActiveItemIndex() {
  return getVisibleItemButtons().findIndex((itemButton) => itemButton.classList.contains("active"));
}

function updateDetailNavigation() {
  const activeIndex = getActiveItemIndex();
  const itemButtons = getVisibleItemButtons();
  const isAtLastVisibleItem = activeIndex >= 0 && activeIndex >= itemButtons.length - 1;
  const isAtTrueLastItem = isAtLastVisibleItem && lazyLoadComplete;

  if (detailPrev instanceof HTMLButtonElement) {
    detailPrev.disabled = activeIndex <= 0;
  }

  if (detailNext instanceof HTMLButtonElement) {
    detailNext.disabled = activeIndex === -1 || isAtTrueLastItem;
  }

  if (detailNextAnchor instanceof HTMLElement) {
    if (isAtTrueLastItem) {
      detailNextAnchor.dataset.tooltip = "Last item";
    } else {
      delete detailNextAnchor.dataset.tooltip;
    }
  }
}

function setListState(nextState) {
  currentListState = nextState;

  setItemsVisibility(nextState === "items");
  setStateVisibility(emptyState, nextState === "empty");
  setStateVisibility(noResultsState, nextState === "no-results");
  setStateVisibility(initialErrorState, nextState === "initial-error");

  if (nextState !== "items") {
    setLoadingState(false, "append");
    setAppendErrorVisible(false);
    closeDetailPanel();
  } else {
    updateLazyLoadStatus(getDefaultLazyLoadStatus());
  }

  scheduleListGeometrySync();

  if (nextState === "no-results") {
    const query = normalizeText(currentQuery) || normalizeText(searchInput?.value ?? "");
    setNoResultsQueryCopy(query);
    announce(query ? `No results found for ${query}.` : "No results found.");
  }

  if (nextState === "initial-error") {
    announce("List items could not load.");
  }
}

function closeDetailPanel(options = {}) {
  const { restoreFocus = false, focusTarget = null } = options;

  if (!(detailPanel instanceof HTMLElement)) {
    return;
  }

  splitLayout?.classList.remove("detail-open");
  detailPanel.classList.add("hidden");
  detailPanel.setAttribute("aria-hidden", "true");
  syncDetailPanelAccessibility();

  for (const itemButton of getItemButtons()) {
    itemButton.classList.remove("active");
    itemButton.setAttribute("aria-pressed", "false");
  }

  updateDetailNavigation();

  const resolvedFocusTarget = focusTarget instanceof HTMLElement
    ? focusTarget
    : lastDetailTrigger instanceof HTMLElement && document.contains(lastDetailTrigger)
      ? lastDetailTrigger
      : null;

  if (restoreFocus && resolvedFocusTarget instanceof HTMLElement) {
    resolvedFocusTarget.focus({ preventScroll: true });
  }

  scheduleListGeometrySync();
}

function syncQueryFilter(options = {}) {
  const { syncUrl = true, focusSearch = false } = options;
  const normalizedQuery = normalizeText(searchInput?.value ?? currentQuery);
  const queryLower = normalizedQuery.toLowerCase();
  const itemButtons = getItemButtons();
  let visibleCount = 0;

  currentQuery = normalizedQuery;

  for (const button of itemButtons) {
    const matches = queryLower.length === 0 || getRecordSearchText(button).includes(queryLower);
    button.classList.toggle("hidden", !matches);
    button.setAttribute("aria-hidden", String(!matches));
    if (matches) {
      visibleCount += 1;
    }
  }

  if (syncUrl) {
    updatePreviewUrl((params) => {
      if (normalizedQuery) {
        params.set("q", normalizedQuery);
      } else {
        params.delete("q");
      }
    });
  }

  const activeItem = getItemButtons().find((button) => button.classList.contains("active"));
  const activeItemStillVisible = activeItem instanceof HTMLElement && !activeItem.classList.contains("hidden");

  if (!activeItemStillVisible && !detailPanel?.classList.contains("hidden")) {
    closeDetailPanel({
      restoreFocus: true,
      focusTarget: focusSearch ? searchInput : null,
    });
    announce(
      normalizedQuery
        ? `Closed details because the active record is not in results for ${normalizedQuery}.`
        : "Closed details because the active record is not in the current results.",
    );
  }

  if (normalizedQuery.length > 0 && visibleCount === 0) {
    setListState("no-results");
  } else if (normalizedQuery.length > 0) {
    setListState("items");
    updateDetailNavigation();
  } else {
    if (currentListState === "no-results") {
      setListState("items");
    } else {
      updateDetailNavigation();
    }
  }

  scheduleListGeometrySync();
  scheduleOverflowTooltipUpdate();
}

function setDetailContent(button) {
  if (!(button instanceof HTMLElement) || !(detailPanel instanceof HTMLElement)) {
    return;
  }

  const record = getButtonRecord(button);
  lastDetailTrigger = button;
  lastDetailRecord = record;

  for (const itemButton of getItemButtons()) {
    const isActive = itemButton === button;
    itemButton.classList.toggle("active", isActive);
    itemButton.setAttribute("aria-pressed", String(isActive));
  }

  if (detailTitle instanceof HTMLElement) {
    detailTitle.textContent = record.detailTitle;
  }

  setOptionalText(detailSubtitle, record.detailSubtitle);
  setOptionalText(detailMeta, record.detailMetaValue);
  splitLayout?.classList.add("detail-open");
  detailPanel.classList.remove("hidden");
  detailPanel.setAttribute("aria-hidden", "false");
  syncDetailPanelAccessibility();
  updateDetailNavigation();

  if (detailFailurePending) {
    detailFailurePending = false;
    setDetailErrorVisible(true);
    setOptionalText(detailDescription, "");
    setOptionalTags(detailTags, []);
    announce(`Detail content could not load for ${record.detailTitle}.`);
  } else {
    setDetailErrorVisible(false);
    setOptionalText(detailDescription, record.detailBody);
    setOptionalTags(detailTags, record.tags);
    announce(`Opened details for ${record.detailTitle}.`);
  }

  scheduleListGeometrySync();
  scheduleOverflowTooltipUpdate();
  focusDetailEntryPoint();
}

if (getItemButtons().length > 0 && detailPanel instanceof HTMLElement) {
  if (initialMissingAttributesPreview) {
    applyMissingAttributesPreview();
  }

  if (initialLongAttributesPreview) {
    applyLongAttributesPreview();
  }

  renderAllCards();
  clearDetailTags();
  closeDetailPanel();
  scheduleOverflowTooltipUpdate();
  syncDetailPanelAccessibility();

  if (searchInput instanceof HTMLInputElement) {
    searchInput.value = currentQuery;
  }

  if (initialNoResultsPreview) {
    setNoResultsQueryCopy(currentQuery);
  }

  listColumn?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest("[data-selectable-list-card]");
    if (button instanceof HTMLElement) {
      setDetailContent(button);
    }
  });
  listColumn?.addEventListener("scroll", () => {
    void handleListScroll();
  });
  window.addEventListener("scroll", () => {
    if (isDesktopSplitOpen()) {
      return;
    }

    void handleListScroll();
  }, { passive: true });

  window.addEventListener("resize", () => {
    scheduleOverflowTooltipUpdate();
    syncDetailPanelAccessibility();
    scheduleListGeometrySync();
    if (!isDesktopSplitOpen()) {
      void handleListScroll();
    }
  });

  if (typeof ResizeObserver === "function" && listColumn instanceof HTMLElement) {
    listColumnResizeObserver = new ResizeObserver(() => {
      scheduleListGeometrySync();
      if (!isDesktopSplitOpen()) {
        void handleListScroll();
      }
    });

    listColumnResizeObserver.observe(listColumn);
    if (itemsContainer instanceof HTMLElement) {
      listColumnResizeObserver.observe(itemsContainer);
    }
  }

  detailClose?.addEventListener("click", () => {
    closeDetailPanel({ restoreFocus: true });
  });
  detailPrev?.addEventListener("click", () => {
    const activeIndex = getActiveItemIndex();
    const itemButtons = getVisibleItemButtons();

    if (activeIndex > 0) {
      setDetailContent(itemButtons[activeIndex - 1]);
    }
  });
  detailNext?.addEventListener("click", async () => {
    let activeIndex = getActiveItemIndex();
    let itemButtons = getVisibleItemButtons();

    if (activeIndex >= 0 && activeIndex < itemButtons.length - 1) {
      setDetailContent(itemButtons[activeIndex + 1]);
      return;
    }

    if (activeIndex >= 0 && activeIndex === itemButtons.length - 1 && !lazyLoadComplete) {
      const appended = await loadMoreItems("append");
      if (!appended) {
        updateDetailNavigation();
      }
    }
  });

  emptyReset?.addEventListener("click", async () => {
    updatePreviewUrl((params) => {
      params.delete("listState");
    });
    setListState("items");
    await seedListUntilScrollable();
  });

  clearSearch?.addEventListener("click", async () => {
    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = "";
    }

    currentQuery = "";
    syncQueryFilter({ focusSearch: true });
    await seedListUntilScrollable();
  });

  initialRetry?.addEventListener("click", async () => {
    updatePreviewUrl((params) => {
      params.delete("listLoadError");
    });
    setListState("items");
    await seedListUntilScrollable();
  });

  appendRetry?.addEventListener("click", async () => {
    setAppendErrorVisible(false);
    await loadMoreItems("append");
  });

  lazyLoadStatusAction?.addEventListener("click", async () => {
    await loadMoreItems("append");
  });

  detailRetry?.addEventListener("click", () => {
    if (!(lastDetailTrigger instanceof HTMLElement)) {
      return;
    }

    updatePreviewUrl((params) => {
      params.delete("detailError");
    });
    setDetailErrorVisible(false);
    setDetailContent(lastDetailTrigger);
  });

  detailPanel.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === "Escape" && !detailPanel.classList.contains("hidden")) {
      event.preventDefault();
      event.stopPropagation();
      closeDetailPanel({ restoreFocus: true });
      return;
    }

    if (event.key !== "Tab" || !isMobileDetailMode() || detailPanel.classList.contains("hidden")) {
      return;
    }

    const focusable = getFocusableElements(detailPanel);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  searchForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncQueryFilter({ focusSearch: true });

    if (currentListState === "items") {
      await seedListUntilScrollable();
    }
  });

  void (async () => {
    if (initialListLoadErrorPreview) {
      setListState("initial-error");
      return;
    }

    if (initialEmptyPreview) {
      setListState("empty");
      return;
    }

    if (initialNoResultsPreview) {
      syncQueryFilter({ syncUrl: false });
      return;
    }

    setListState("items");

    if (initialLoadingPreview) {
      isLoading = true;
      setItemsVisibility(false);
      setLoadingState(true, "initial");
      await wait(initialLoadingDelayMs);
      setListState("items");
      setLoadingState(false, "initial");
      isLoading = false;
      updateLazyLoadStatus(getDefaultLazyLoadStatus());
      scheduleListGeometrySync();
      scheduleOverflowTooltipUpdate();
      return;
    }

    await seedListUntilScrollable();
    scheduleListGeometrySync();
    scheduleOverflowTooltipUpdate();
  })();
}
